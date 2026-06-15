/* Schulweg NRW - App-Logik (reines JS, kein Framework, kein Build-Schritt) */
(function () {
  "use strict";

  var app = document.getElementById("app");

  // ---------- Profile (lokal gespeichert) ----------
  var AVATARE = ["🦊", "🐱", "🐢", "🦋", "🐬", "🦉"];
  function ladeProfile() {
    try { return JSON.parse(localStorage.getItem("schulweg_profile")) || []; }
    catch (e) { return []; }
  }
  function speichereProfile(p) { localStorage.setItem("schulweg_profile", JSON.stringify(p)); }

  var state = { profil: null, fachKey: null, thema: null };
  var verwaltenModus = false;

  // ---------- Antwort-Pruefung (flexibel: 0,5 = 0.5 = 1/2) ----------
  function alsZahl(text) {
    if (text == null) return null;
    var s = String(text).trim().replace(",", ".").replace(/[°\s]/g, "");
    if (/^-?\d+\/\d+$/.test(s)) {
      var t = s.split("/");
      var n = parseFloat(t[1]);
      return n === 0 ? null : parseFloat(t[0]) / n;
    }
    if (/^-?\d*\.?\d+$/.test(s)) return parseFloat(s);
    return null;
  }
  function istRichtig(eingabe, loesung) {
    var a = alsZahl(eingabe), b = alsZahl(loesung);
    if (a !== null && b !== null) return Math.abs(a - b) < 1e-9;
    return String(eingabe).trim().toLowerCase() === String(loesung).trim().toLowerCase();
  }

  // Tolerante Prüfung für Texteingaben: Groß/Klein, Apostroph-Varianten
  // (’ ` → '), fehlender Apostroph (wont = won't), Satzzeichen am Ende,
  // mehrfache Leerzeichen. Zusätzliche gültige Schreibweisen über aufgabe.akzeptiert.
  function normalisiere(s) {
    return String(s == null ? "" : s).trim().toLowerCase()
      .replace(/[’`´]/g, "'")
      .replace(/[.!?,;:]+$/, "")
      .replace(/\s+/g, " ");
  }
  function textRichtig(eingabe, aufgabe) {
    var e = normalisiere(eingabe), eOhneApo = e.replace(/'/g, "");
    var liste = [aufgabe.richtig].concat(aufgabe.akzeptiert || []);
    return liste.some(function (k) {
      var n = normalisiere(k);
      return e === n || eOhneApo === n.replace(/'/g, "");
    });
  }
  function fehlerText(fehlerMap, eingabe) {
    if (!fehlerMap) return null;
    var roh = String(eingabe).trim();
    if (fehlerMap[roh]) return fehlerMap[roh];
    var e = normalisiere(eingabe), treffer = null;
    Object.keys(fehlerMap).forEach(function (k) { if (normalisiere(k) === e) treffer = fehlerMap[k]; });
    return treffer;
  }

  function kiAktiv() {
    return !!(window.SCHULWEG_CONFIG && window.SCHULWEG_CONFIG.kiEndpoint);
  }

  // Fragt den Cloudflare-Worker (der wiederum Groq fragt) nach einer
  // individuellen Erklaerung fuer genau diese falsche Antwort.
  function frageKI(aufgabe, antwort, themaTitel, btn) {
    var out = document.getElementById("ki-out");
    btn.disabled = true; btn.textContent = "🤖 denkt nach …";
    var fach = (window.SCHULWEG.faecher[state.fachKey] || {}).fach || "";
    fetch(window.SCHULWEG_CONFIG.kiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fach: fach, klasse: state.profil.klasse, thema: themaTitel,
        frage: aufgabe.frage, antwort: String(antwort), richtig: String(aufgabe.richtig)
      })
    }).then(function (r) { return r.json(); }).then(function (d) {
      var schritte = (d.schritte || []).map(function (s, i) {
        return '<div class="step"><span class="n">' + (i + 1) + "</span>" + s + "</div>";
      }).join("");
      out.innerHTML =
        '<div class="analyse" style="margin-top:12px;background:var(--richtig-bg)">' +
        '<div class="head" style="color:#085041">🤖 Noch eine Erklärung für dich</div>' +
        '<p style="color:#085041">' + (d.analyse || "Geh es einfach Schritt für Schritt durch.") + "</p>" +
        '<div class="steps">' + schritte + "</div></div>";
      btn.style.display = "none";
    }).catch(function () {
      out.innerHTML = '<p class="muted" style="margin-top:10px">Die KI ist gerade nicht erreichbar – aber die Erklärung oben hilft dir trotzdem weiter.</p>';
      btn.disabled = false; btn.textContent = "🤖 Nochmal versuchen";
    });
  }

  // ---------- kleine DOM-Helfer ----------
  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }
  function topbar(titel, sub, zurueck) {
    var bar =
      '<div class="topbar">' +
      (zurueck ? '<button class="back" aria-label="Zurück">←</button>' : "") +
      '<div><h1>' + titel + "</h1>" + (sub ? '<p class="sub">' + sub + "</p>" : "") + "</div>" +
      "</div>";
    return bar;
  }

  // ---------- Bildschirm 1: Profile ----------
  function zeigeProfile() {
    state.fachKey = null; state.thema = null;
    var profile = ladeProfile();
    var karten = profile.map(function (p, i) {
      return (
        '<div class="card profile-card" data-profil="' + i + '">' +
        '<div class="avatar" style="background:var(--akzent-bg)">' + p.avatar + "</div>" +
        "<h3>" + p.name + "</h3>" +
        '<p class="muted">Klasse ' + p.klasse + "</p>" +
        (verwaltenModus ? '<p class="muted" style="margin-top:6px;color:var(--akzent)">✎ bearbeiten</p>' : "") +
        "</div>"
      );
    }).join("");
    var addTile = '<button class="card add-tile" id="add"><span style="font-size:30px">+</span><span>Kind hinzufügen</span></button>';

    app.innerHTML =
      '<div class="topbar"><div><h1>Schulweg NRW</h1><p class="sub">Wer lernt heute?</p></div><div class="spacer"></div>' +
      (profile.length ? '<button class="back" id="verw" aria-label="Profile verwalten">' + (verwaltenModus ? "✓" : "✎") + "</button>" : "") +
      "</div>" +
      '<div class="grid">' + karten + addTile + "</div>" +
      '<p class="center" style="margin-top:28px"><button class="btn btn-soft" id="eltern" style="max-width:280px;margin:0 auto">Eltern-Bereich</button></p>';

    app.querySelectorAll("[data-profil]").forEach(function (n) {
      n.onclick = function () {
        var i = +n.dataset.profil;
        if (verwaltenModus) { kindFormular(i); }
        else { state.profil = ladeProfile()[i]; zeigeFaecher(); }
      };
    });
    document.getElementById("add").onclick = function () { kindFormular(null); };
    document.getElementById("eltern").onclick = zeigeEltern;
    var vb = document.getElementById("verw");
    if (vb) vb.onclick = function () { verwaltenModus = !verwaltenModus; zeigeProfile(); };
  }

  // In-App-Maske statt Eingabe-Fenster
  function kindFormular(index) {
    var profile = ladeProfile();
    var edit = (index != null) ? profile[index] : null;
    var daten = { name: edit ? edit.name : "", klasse: edit ? edit.klasse : "", avatar: edit ? edit.avatar : AVATARE[profile.length % AVATARE.length] };

    function render() {
      app.innerHTML =
        topbar(edit ? "Kind bearbeiten" : "Kind hinzufügen", null, true) +
        '<div class="intro-box">' +
        '<label class="form-label">Name</label>' +
        '<input id="f-name" class="text-in" placeholder="Vorname" value="' + daten.name.replace(/"/g, "&quot;") + '" />' +
        '<label class="form-label">Klasse</label>' +
        '<div class="chips" id="f-klasse">' + ["4", "5", "6", "7", "8", "9", "10"].map(function (k) {
          return '<button class="chip' + (k === daten.klasse ? " on" : "") + '" data-k="' + k + '">' + k + "</button>";
        }).join("") + "</div>" +
        (edit ? '<button class="btn btn-soft" id="f-promote" style="margin-top:10px">⬆ Eine Klasse weiter (neues Schuljahr)</button>' : "") +
        '<label class="form-label">Figur</label>' +
        '<div class="chips" id="f-avatar">' + AVATARE.map(function (a) {
          return '<button class="chip av' + (a === daten.avatar ? " on" : "") + '" data-a="' + a + '">' + a + "</button>";
        }).join("") + "</div>" +
        '<button class="btn btn-primary" id="f-save">Speichern</button>' +
        (edit ? '<button class="btn btn-soft" id="f-del">Dieses Kind löschen</button>' : "") +
        "</div>";

      app.querySelector(".back").onclick = zeigeProfile;
      var nameIn = document.getElementById("f-name");
      nameIn.oninput = function () { daten.name = nameIn.value; saveBtnState(); };
      app.querySelectorAll("#f-klasse .chip").forEach(function (b) {
        b.onclick = function () { daten.klasse = b.dataset.k; render(); };
      });
      app.querySelectorAll("#f-avatar .chip").forEach(function (b) {
        b.onclick = function () { daten.avatar = b.dataset.a; render(); };
      });
      document.getElementById("f-save").onclick = speichern;
      if (edit) document.getElementById("f-del").onclick = loeschen;
      var pb = document.getElementById("f-promote");
      if (pb) pb.onclick = function () {
        var n = parseInt(daten.klasse, 10) || 0;
        if (n) { daten.klasse = String(Math.min(n + 1, 10)); render(); }
      };
      saveBtnState();
    }
    function saveBtnState() {
      document.getElementById("f-save").disabled = !(daten.name.trim() && daten.klasse);
    }
    function speichern() {
      var p = ladeProfile();
      if (edit) { edit.name = daten.name.trim(); edit.klasse = daten.klasse; edit.avatar = daten.avatar; p[index] = edit; }
      else { p.push({ name: daten.name.trim(), klasse: daten.klasse, avatar: daten.avatar, fortschritt: {} }); }
      speichereProfile(p); verwaltenModus = false; zeigeProfile();
    }
    function loeschen() {
      if (!confirm("Dieses Kind und seinen Fortschritt wirklich löschen?")) return;
      var p = ladeProfile(); p.splice(index, 1); speichereProfile(p); verwaltenModus = false; zeigeProfile();
    }
    render();
  }

  // ---------- Bildschirm 2: Faecher ----------
  function zeigeFaecher() {
    var kl = state.profil.klasse;
    var defs = [
      { fach: "mathe", name: "Mathe", farbe: "mathe", icon: "➕" },
      { fach: "deutsch", name: "Deutsch", farbe: "deutsch", icon: "📖" },
      { fach: "englisch", name: "Englisch", farbe: "englisch", icon: "🇬🇧" }
    ];
    var karten = defs.map(function (d) {
      var key = d.fach + "-" + kl;
      var data = window.SCHULWEG.faecher[key];
      var aktiv = !!data;
      var thema = aktiv ? (data.themen.length + " Themen") : "Bald verfügbar";
      return (
        '<div class="card" data-fach="' + (aktiv ? key : "") + '" style="' + (aktiv ? "" : "opacity:.5") + '">' +
        '<div class="icon" style="background:var(--' + d.farbe + '-bg)">' + d.icon + "</div>" +
        "<h3>" + d.name + "</h3><p>" + thema + "</p>" +
        '<div class="bar"><span style="width:' + (aktiv ? "8%" : "0") + ';background:var(--' + d.farbe + ')"></span></div></div>'
      );
    }).join("");

    app.innerHTML =
      topbar("Hallo " + state.profil.name, "Klasse " + kl + " · Was lernen wir?", true) +
      '<div class="grid">' + karten + "</div>";

    app.querySelector(".back").onclick = zeigeProfile;
    app.querySelectorAll("[data-fach]").forEach(function (n) {
      if (!n.dataset.fach) return;
      n.onclick = function () { state.fachKey = n.dataset.fach; zeigeThemen(); };
    });
  }

  // ---------- Bildschirm 3: Themen ----------
  function zeigeThemen() {
    var fach = window.SCHULWEG.faecher[state.fachKey];
    var karten = fach.themen.map(function (t, i) {
      return (
        '<div class="card" data-thema="' + i + '">' +
        "<h3>" + t.titel + "</h3>" +
        '<p>' + t.aufgaben.length + " Aufgaben</p>" +
        '<div class="bar"><span style="width:0;background:var(--' + fach.farbe + ')"></span></div></div>'
      );
    }).join("");
    app.innerHTML =
      topbar(fach.fach, "Klasse " + fach.klasse + " · Thema wählen", true) +
      '<div class="grid">' + karten + "</div>";
    app.querySelector(".back").onclick = zeigeFaecher;
    app.querySelectorAll("[data-thema]").forEach(function (n) {
      n.onclick = function () { state.thema = fach.themen[+n.dataset.thema]; zeigeIntro(); };
    });
  }

  // ---------- Bildschirm 4: Intro ("Wozu brauche ich das") ----------
  function zeigeIntro() {
    var t = state.thema;
    var hatExplorer = t.explorer && window.WINKEL;
    var explorerHTML = hatExplorer
      ? '<div id="explorer" style="margin:16px 0 6px"></div>' +
        '<p class="muted center" style="font-size:14px">Probier es oben aus – dann geht’s zu den Aufgaben.</p>'
      : "";
    app.innerHTML =
      topbar(t.titel, hatExplorer ? "Grundlagen ausprobieren" : "Kurz erklaert", true) +
      '<div class="intro-box">' +
      '<div class="prereq">✓ Dafür brauchst du: ' + t.voraussetzung + "</div>" +
      "<p style=\"font-size:17px;line-height:1.6\">" + t.intro + "</p>" +
      explorerHTML +
      '<button class="btn btn-primary" id="los">' + (hatExplorer ? "Jetzt üben →" : "Los geht’s →") + "</button></div>";
    app.querySelector(".back").onclick = zeigeThemen;
    if (hatExplorer) window.WINKEL.initExplorer(document.getElementById("explorer"), t.explorer);
    document.getElementById("los").onclick = function () { starteQuiz(t); };
  }

  // ---------- Bildschirm 5: Quiz mit Lernbox ----------
  function starteQuiz(thema) {
    var warteschlange = thema.aufgaben.slice();      // Lernbox: falsche kommen wieder rein
    var gesamt = warteschlange.length;
    var falschGehabt = [];                           // Aufgaben, die mind. 1x falsch waren
    var richtigErst = 0, beantwortet = 0, idx = 0;

    function naechste() {
      if (warteschlange.length === 0) return zeigeErgebnis();
      var aufgabe = warteschlange.shift();
      idx++;
      zeigeAufgabe(aufgabe);
    }

    function zeigeAufgabe(a) {
      var koerper, btnLabel = "Überprüfen";
      if (a.typ === "mc") {
        koerper = '<div class="options">' + a.antworten.map(function (opt) {
          return '<button class="opt" data-val="' + opt.replace(/"/g, "&quot;") + '">' + opt + "</button>";
        }).join("") + "</div>";
      } else if (a.typ === "freitext") {
        btnLabel = "Abschicken";
        koerper =
          '<textarea id="eingabe" class="text-in" rows="4" autocomplete="off" placeholder="Schreibe hier deine Antwort …" style="resize:vertical"></textarea>' +
          (a.tipp ? '<p class="hint-input">💡 ' + a.tipp + "</p>" : "");
      } else {
        var istMathe = String(state.fachKey || "").indexOf("mathe") === 0;
        koerper =
          '<input class="zahl" id="eingabe" inputmode="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="Antwort" />' +
          '<p class="hint-input">' + (istMathe ? "Du darfst 0,5 oder 1/2 schreiben – beides zählt." : "Tippe deine Antwort.") + "</p>";
      }
      var bild = (a.bild && window.WINKEL) ? window.WINKEL.bildHTML(a.bild) : "";
      app.innerHTML =
        topbar(thema.titel, null, true) +
        '<p class="q-meta">Aufgabe ' + idx + " · noch " + (warteschlange.length + 1) + " offen</p>" +
        '<div class="q-card"><p class="q-frage">' + a.frage + "</p>" + bild + koerper +
        '<button class="btn btn-primary" id="pruefen" disabled>' + btnLabel + "</button>" +
        '<div class="feedback" id="fb"></div></div>';

      app.querySelector(".back").onclick = function () { if (confirm("Übung beenden?")) zeigeThemen(); };

      var gewaehlt = null;
      var pruefBtn = document.getElementById("pruefen");

      if (a.typ === "mc") {
        app.querySelectorAll(".opt").forEach(function (b) {
          b.onclick = function () {
            app.querySelectorAll(".opt").forEach(function (x) { x.classList.remove("sel"); });
            b.classList.add("sel"); gewaehlt = b.dataset.val; pruefBtn.disabled = false;
          };
        });
      } else {
        var inp = document.getElementById("eingabe");
        inp.oninput = function () { gewaehlt = inp.value; pruefBtn.disabled = !inp.value.trim(); };
        inp.focus();
      }

      pruefBtn.onclick = function () {
        if (a.typ === "freitext") { freitextAbschicken(a, gewaehlt); return; }
        var ok;
        if (a.toleranz != null) {
          var g = alsZahl(gewaehlt);
          ok = g !== null && Math.abs(g - alsZahl(a.richtig)) <= a.toleranz;
        } else if (a.typ === "text") {
          ok = textRichtig(gewaehlt, a);
        } else {
          ok = istRichtig(gewaehlt, a.richtig);
        }
        beantwortet++;
        if (ok && falschGehabt.indexOf(a) === -1) richtigErst++;
        zeigeFeedback(a, gewaehlt, ok);
      };

      function zeigeFeedback(a, gewaehlt, ok) {
        pruefBtn.style.display = "none";
        if (a.typ === "mc") {
          app.querySelectorAll(".opt").forEach(function (b) {
            b.disabled = true;
            if (b.dataset.val === a.richtig) b.classList.add("ok");
            else if (b.dataset.val === gewaehlt) b.classList.add("no");
          });
        }
        var fb = document.getElementById("fb");
        if (ok) {
          fb.innerHTML =
            '<div class="row-result"><span class="pill ok">✓ Richtig! ' + a.erklaerung + "</span></div>" +
            '<button class="btn btn-primary" id="weiter">Weiter →</button>';
        } else {
          var diagnose = fehlerText(a.fehler, gewaehlt) ||
            ("Deine Antwort war " + gewaehlt + ". " + a.erklaerung);
          var schritte = a.schritte.map(function (s, i) {
            return '<div class="step"><span class="n">' + (i + 1) + "</span>" + s + "</div>";
          }).join("");
          if (falschGehabt.indexOf(a) === -1) falschGehabt.push(a);
          warteschlange.push(a);   // Lernbox: nochmal ueben
          var kiBtn = kiAktiv()
            ? '<button class="btn btn-soft" id="ki-btn" style="margin-top:12px">🤖 Erklär’s mir nochmal anders</button><div id="ki-out"></div>'
            : "";
          fb.innerHTML =
            '<div class="row-result"><span class="pill no">🔄 Versuch’s gleich nochmal</span>' +
            '<span class="pill ok">Richtig: ' + a.richtig + "</span></div>" +
            '<div class="analyse"><div class="head">✨ Das ist hier passiert</div>' +
            "<p>" + diagnose + "</p><div class=\"steps\">" + schritte + "</div></div>" +
            kiBtn +
            '<button class="btn btn-primary" id="weiter" style="margin-top:16px">Verstanden, weiter →</button>';
          var kib = document.getElementById("ki-btn");
          if (kib) kib.onclick = function () { frageKI(a, gewaehlt, thema.titel, kib); };
        }
        document.getElementById("weiter").onclick = naechste;
      }

      // Freitext: kein richtig/falsch, sondern KI-Feedback (Fallback: Beispiel-Lösung)
      function freitextAbschicken(a, text) {
        beantwortet++;
        pruefBtn.style.display = "none";
        document.getElementById("fb").innerHTML = '<div id="ft-out"><p class="muted">🤖 Dein Text wird angeschaut …</p></div>';
        var out = document.getElementById("ft-out");

        function fertig(html) {
          out.innerHTML = html + '<button class="btn btn-primary" id="weiter" style="margin-top:14px">Weiter →</button>';
          document.getElementById("weiter").onclick = naechste;
        }
        function muster(vortext) {
          fertig((vortext || "") + (a.musterloesung
            ? '<div class="analyse" style="background:var(--akzent-bg)"><div class="head" style="color:var(--akzent-text)">Beispiel-Lösung</div><p style="color:var(--akzent-text)">' + a.musterloesung + "</p></div>"
            : ""));
        }
        if (!kiAktiv()) { muster('<p class="muted">Vergleiche deinen Text mit dem Beispiel:</p>'); return; }

        fetch(window.SCHULWEG_CONFIG.kiEndpoint, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            modus: "freitext",
            fach: (window.SCHULWEG.faecher[state.fachKey] || {}).fach || "",
            klasse: state.profil.klasse, thema: thema.titel,
            frage: a.frage, antwort: String(text)
          })
        }).then(function (r) { return r.json(); }).then(function (d) {
          var schritte = (d.schritte || []).map(function (s, i) {
            return '<div class="step"><span class="n">' + (i + 1) + "</span>" + s + "</div>";
          }).join("");
          fertig('<div class="analyse" style="background:var(--richtig-bg)"><div class="head" style="color:#085041">🤖 Feedback zu deinem Text</div><p style="color:#085041">' +
            (d.analyse || "Schön gemacht!") + "</p>" + (schritte ? '<div class="steps">' + schritte + "</div>" : "") + "</div>");
        }).catch(function () {
          muster('<p class="muted">Die KI ist gerade nicht erreichbar. Vergleiche selbst mit dem Beispiel:</p>');
        });
      }
    }

    function zeigeErgebnis() {
      var quote = gesamt ? Math.round((richtigErst / gesamt) * 100) : 0;
      app.innerHTML =
        topbar("Geschafft!", thema.titel, true) +
        '<div class="result-hero"><div class="big">' + quote + "%</div>" +
        "<p>auf Anhieb richtig</p></div>" +
        '<div class="stat-row">' +
        '<div class="stat"><div class="num">' + gesamt + '</div><div class="lbl">Aufgaben</div></div>' +
        '<div class="stat"><div class="num">' + richtigErst + '</div><div class="lbl">sofort richtig</div></div>' +
        '<div class="stat"><div class="num">' + (beantwortet - richtigErst) + '</div><div class="lbl">geübt</div></div>' +
        "</div>" +
        '<button class="btn btn-primary" id="nochmal">Nochmal üben</button>' +
        '<button class="btn btn-soft" id="zurueck">Zurück zu den Themen</button>';
      app.querySelector(".back").onclick = zeigeThemen;
      document.getElementById("nochmal").onclick = function () { starteQuiz(thema); };
      document.getElementById("zurueck").onclick = zeigeThemen;
    }

    naechste();
  }

  // ---------- Eltern-Bereich (Platzhalter, Phase 2: Lernplan + Statistik) ----------
  function zeigeEltern() {
    app.innerHTML =
      topbar("Eltern-Bereich", "Übersicht & Lernplan", true) +
      '<div class="intro-box"><p>Hier kommt in Phase 2 das Dashboard: pro Kind und Fach sehen, ' +
      "was schon sitzt und wo es hakt – und gezielt einstellen, was diese Woche geübt wird.</p>" +
      '<p class="muted">Aktuell angelegte Kinder: ' + (ladeProfile().map(function (p) { return p.name; }).join(", ") || "noch keine") + "</p></div>";
    app.querySelector(".back").onclick = zeigeProfile;
  }

  zeigeProfile();
})();
