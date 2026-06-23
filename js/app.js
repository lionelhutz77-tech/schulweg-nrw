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
  // Uhrzeit erkennen (H:MM oder H.MM) -> {h (mod 12), m}, damit 3:45 = 15:45 zaehlt
  function alsZeit(s) {
    var m = String(s == null ? "" : s).trim().match(/^(\d{1,2})[:.](\d{2})$/);
    if (!m) return null;
    var h = parseInt(m[1], 10), min = parseInt(m[2], 10);
    if (h > 23 || min > 59) return null;
    return { h: h % 12, m: min };
  }
  function textRichtig(eingabe, aufgabe) {
    var e = normalisiere(eingabe), eOhneApo = e.replace(/'/g, "");
    var zEin = alsZeit(eingabe);
    var liste = [aufgabe.richtig].concat(aufgabe.akzeptiert || []);
    return liste.some(function (k) {
      var n = normalisiere(k);
      if (e === n || eOhneApo === n.replace(/'/g, "")) return true;
      var zK = alsZeit(k);
      return !!(zEin && zK && zEin.h === zK.h && zEin.m === zK.m);
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
        '<p>' + (t.seiten ? t.seiten + " · " : "") +
          (t.lektionen ? t.lektionen.length + " Lektionen" : (t.aufgaben || []).length + " Aufgaben") + "</p>" +
        '<div class="bar"><span style="width:0;background:var(--' + fach.farbe + ')"></span></div></div>'
      );
    }).join("");
    app.innerHTML =
      topbar(fach.fach, "Klasse " + fach.klasse + " · Thema wählen", true) +
      '<div class="grid">' + karten + "</div>" +
      '<button class="btn btn-soft" id="arbeit" style="margin-top:20px">📝 Für eine Arbeit lernen (mehrere auswählen)</button>';
    app.querySelector(".back").onclick = zeigeFaecher;
    app.querySelectorAll("[data-thema]").forEach(function (n) {
      n.onclick = function () {
        var t = fach.themen[+n.dataset.thema];
        state.thema = t;
        if (t.lektionen) starteTutor(t); else if (t.lernweg) zeigeLernweg(t); else zeigeIntro();
      };
    });
    document.getElementById("arbeit").onclick = zeigeArbeitAuswahl;
  }

  function mische(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // "Für eine Arbeit lernen": mehrere Themen/Seiten auswählen -> gemischtes Lernset
  function zeigeArbeitAuswahl() {
    var fach = window.SCHULWEG.faecher[state.fachKey];
    var gewaehlt = {};
    function render() {
      var liste = fach.themen.map(function (t, i) {
        if (!t.aufgaben || !t.aufgaben.length) return "";   // Tutor-Themen (lektionen) sind nicht kombinierbar
        var an = !!gewaehlt[i];
        return '<div class="card" data-pick="' + i + '" style="display:flex;align-items:center;gap:12px;' +
          (an ? "border-color:var(--akzent);background:var(--akzent-bg)" : "") + '">' +
          '<span style="font-size:22px">' + (an ? "☑" : "☐") + "</span>" +
          '<div><h3 style="margin:0;font-size:17px">' + t.titel + "</h3>" +
          '<p class="muted" style="margin:2px 0 0">' + (t.seiten ? t.seiten + " · " : "") + t.aufgaben.length + " Aufgaben</p></div></div>";
      }).join("");
      var anzahl = 0, count = 0;
      Object.keys(gewaehlt).forEach(function (k) { if (gewaehlt[k]) { anzahl++; count += (fach.themen[k].aufgaben || []).length; } });
      app.innerHTML =
        topbar(fach.fach, "Für eine Arbeit lernen", true) +
        '<p class="muted" style="margin-bottom:14px">Wähle die Themen/Seiten, die in der Arbeit drankommen. Daraus baue ich dir ein gemischtes Lernset.</p>' +
        '<div style="display:flex;flex-direction:column;gap:12px">' + liste + "</div>" +
        '<button class="btn btn-primary" id="start" style="margin-top:20px"' + (anzahl ? "" : " disabled") + ">Lernset starten" + (count ? " (" + count + " Aufgaben)" : "") + "</button>";
      app.querySelector(".back").onclick = zeigeThemen;
      app.querySelectorAll("[data-pick]").forEach(function (n) {
        n.onclick = function () { var i = +n.dataset.pick; gewaehlt[i] = !gewaehlt[i]; render(); };
      });
      document.getElementById("start").onclick = function () {
        var aufgaben = [];
        fach.themen.forEach(function (t, i) { if (gewaehlt[i] && t.aufgaben) aufgaben = aufgaben.concat(t.aufgaben); });
        if (!aufgaben.length) return;
        starteQuiz({ titel: "Lernset · " + fach.fach, aufgaben: mische(aufgaben) });
      };
    }
    render();
  }

  // Rendert einen Erklär-Abschnitt (text / schritte / punkte) als Karte
  function abschnittHTML(s) {
    var inner = "";
    if (s.text) inner += '<p style="font-size:16px;line-height:1.65;margin:0 0 4px">' + s.text + "</p>";
    if (s.schritte) inner += '<div class="steps" style="margin-top:8px">' + s.schritte.map(function (x, i) {
      return '<div class="step"><span class="n">' + (i + 1) + "</span>" + x + "</div>";
    }).join("") + "</div>";
    if (s.punkte) inner += '<ul style="margin:8px 0 0;padding-left:20px;line-height:1.7">' +
      s.punkte.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>";
    return '<div class="intro-box" style="margin-bottom:14px">' +
      (s.titel ? '<h3 style="margin:0 0 10px;font-size:17px">' + s.titel + "</h3>" : "") + inner + "</div>";
  }

  // ---------- "So gehst du vor": Strategie/Erklärung zum Lesen ----------
  function zeigeLernweg(thema) {
    var hatAufgaben = thema.aufgaben && thema.aufgaben.length;
    app.innerHTML =
      topbar(thema.titel, "So gehst du vor", true) +
      (thema.wozu ? '<div class="prereq" style="margin-bottom:14px">💡 ' + thema.wozu + "</div>" : "") +
      (thema.lernweg || []).map(abschnittHTML).join("") +
      (hatAufgaben
        ? '<button class="btn btn-primary" id="ueben">Jetzt üben →</button>'
        : '<button class="btn btn-soft" id="ueben">Verstanden</button>');
    app.querySelector(".back").onclick = zeigeThemen;
    document.getElementById("ueben").onclick = function () {
      if (hatAufgaben) starteQuiz(thema); else zeigeThemen();
    };
  }

  // ---------- Interaktiver Tutor: kleine Lektionen (erklären → prüfen → nachfragen) ----------
  function starteTutor(thema) {
    var lekts = thema.lektionen;
    var i = 0;
    var EP = (window.SCHULWEG_CONFIG || {}).kiEndpoint;
    var fachName = (window.SCHULWEG.faecher[state.fachKey] || {}).fach || "";

    function naechste() { if (i < lekts.length - 1) { i++; zeigeLektion(); } else zeigeFertig(); }

    function frageKastenHTML() {
      return '<div class="intro-box" style="margin-top:16px;background:var(--akzent-bg)">' +
        '<div style="font-weight:600;color:var(--akzent-text);margin-bottom:8px">🙋 Etwas unklar? Frag den Tutor</div>' +
        '<textarea id="frage-in" class="text-in" rows="2" placeholder="Deine Frage …"></textarea>' +
        '<button class="btn btn-soft" id="frage-btn" style="margin-top:8px">Frage senden</button><div id="frage-out"></div></div>';
    }
    function wireFrage(kontext) {
      var btn = document.getElementById("frage-btn"), inp = document.getElementById("frage-in"), out = document.getElementById("frage-out");
      if (!btn) return;
      btn.onclick = function () {
        var q = (inp.value || "").trim(); if (!q) return;
        if (!EP) { out.innerHTML = '<p class="muted" style="margin-top:8px">Die Tutor-Frage braucht die KI (gerade nicht aktiv).</p>'; return; }
        btn.disabled = true; out.innerHTML = '<p class="muted" style="margin-top:8px">🤖 Tutor denkt nach …</p>';
        fetch(EP, { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ modus: "frage", fach: fachName, klasse: state.profil.klasse, thema: thema.titel, kontext: kontext, frage_text: q })
        }).then(function (r) { return r.json(); }).then(function (d) {
          out.innerHTML = '<div class="analyse" style="margin-top:10px"><div class="head">🤖 Tutor</div><p>' + (d.analyse || "…") + "</p></div>";
          btn.disabled = false;
        }).catch(function () { out.innerHTML = '<p class="muted" style="margin-top:8px">Gerade nicht erreichbar.</p>'; btn.disabled = false; });
      };
    }

    function kontextVon(L) {
      return L.titel + " — " + (L.erklaerung || []).map(function (s) {
        return (s.text || "") + (s.punkte ? " " + s.punkte.join(" ") : "") + (s.schritte ? " " + s.schritte.join(" ") : "");
      }).join(" ");
    }

    function zeigeLektion() {
      var L = lekts[i], c = L.check, kontext = kontextVon(L), koerper = "";
      if (c) {
        if (c.typ === "mc") koerper = '<div class="options">' + c.antworten.map(function (o) {
          return '<button class="opt" data-val="' + o.replace(/"/g, "&quot;") + '">' + o + "</button>";
        }).join("") + "</div>";
        else if (c.typ === "freitext") koerper = '<textarea id="ein" class="text-in" rows="3" placeholder="Deine Antwort …"></textarea>' +
          (c.tipp ? '<p class="hint-input">💡 ' + c.tipp + "</p>" : "");
        else koerper = '<input id="ein" class="text-in" autocapitalize="none" autocorrect="off" autocomplete="off" placeholder="Antwort" />';
      }
      app.innerHTML =
        topbar(thema.titel, "Lektion " + (i + 1) + " von " + lekts.length, true) +
        '<h2 style="font-size:19px;margin:0 0 12px">' + L.titel + "</h2>" +
        (L.erklaerung || []).map(abschnittHTML).join("") +
        (c
          ? '<div class="q-card"><p class="q-frage" style="font-size:18px">' + c.frage + "</p>" + koerper +
            '<button class="btn btn-primary" id="pruef" disabled>' + (c.typ === "freitext" ? "Abschicken" : "Prüfen") + "</button>" +
            '<div class="feedback" id="fb"></div></div>'
          : '<button class="btn btn-primary" id="weiter2">Weiter →</button>') +
        frageKastenHTML();
      app.querySelector(".back").onclick = zeigeThemen;
      wireFrage(kontext);
      if (!c) { document.getElementById("weiter2").onclick = naechste; return; }

      var gew = null, pruef = document.getElementById("pruef");
      if (c.typ === "mc") {
        app.querySelectorAll(".opt").forEach(function (b) {
          b.onclick = function () {
            app.querySelectorAll(".opt").forEach(function (x) { x.classList.remove("sel"); });
            b.classList.add("sel"); gew = b.dataset.val; pruef.disabled = false;
          };
        });
      } else {
        var inp = document.getElementById("ein");
        inp.oninput = function () { gew = inp.value; pruef.disabled = !inp.value.trim(); };
      }
      pruef.onclick = function () {
        if (c.typ === "freitext") { freitextCheck(c, gew); return; }
        var ok = c.typ === "text" ? textRichtig(gew, c) : istRichtig(gew, c.richtig);
        pruef.style.display = "none";
        if (c.typ === "mc") app.querySelectorAll(".opt").forEach(function (b) {
          b.disabled = true;
          if (b.dataset.val === c.richtig) b.classList.add("ok");
          else if (b.dataset.val === gew) b.classList.add("no");
        });
        var fb = document.getElementById("fb");
        if (ok) {
          fb.innerHTML = '<div class="row-result"><span class="pill ok">✓ Genau! ' + (c.erklaerung || "") + "</span></div>" +
            '<button class="btn btn-primary" id="weiter2">Weiter →</button>';
          document.getElementById("weiter2").onclick = naechste;
        } else {
          var diag = fehlerText(c.fehler, gew) || c.erklaerung || "Schau nochmal in die Erklärung oben.";
          fb.innerHTML = '<div class="row-result"><span class="pill no">🔄 Fast – schau nochmal</span></div>' +
            '<div class="analyse"><p>' + diag + "</p></div>" +
            '<button class="btn btn-soft" id="retry" style="margin-top:12px">Nochmal versuchen</button>';
          document.getElementById("retry").onclick = function () { zeigeLektion(); };
        }
      };
    }

    function freitextCheck(c, text) {
      var pruef = document.getElementById("pruef"); pruef.style.display = "none";
      var fb = document.getElementById("fb"); fb.innerHTML = '<p class="muted">🤖 Tutor schaut sich deine Antwort an …</p>';
      function done(html) {
        fb.innerHTML = html + '<button class="btn btn-primary" id="weiter2" style="margin-top:12px">Weiter →</button>';
        document.getElementById("weiter2").onclick = naechste;
      }
      var beispiel = c.musterloesung ? '<div class="analyse" style="background:var(--akzent-bg)"><div class="head" style="color:var(--akzent-text)">Beispiel</div><p style="color:var(--akzent-text)">' + c.musterloesung + "</p></div>" : "";
      if (!EP) { done(beispiel); return; }
      fetch(EP, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modus: "freitext", fach: fachName, klasse: state.profil.klasse, thema: thema.titel, frage: c.frage, antwort: String(text), kriterien: c.kriterien || "" })
      }).then(function (r) { return r.json(); }).then(function (d) {
        var sch = (d.schritte || []).map(function (s, k) { return '<div class="step"><span class="n">' + (k + 1) + "</span>" + s + "</div>"; }).join("");
        done('<div class="analyse" style="background:var(--richtig-bg)"><div class="head" style="color:#085041">🤖 Tutor-Feedback</div><p style="color:#085041">' +
          (d.analyse || "Gut gemacht!") + "</p>" + (sch ? '<div class="steps">' + sch + "</div>" : "") + "</div>");
      }).catch(function () { done('<p class="muted">Tutor gerade nicht erreichbar.</p>' + beispiel); });
    }

    function zeigeFertig() {
      app.innerHTML =
        topbar(thema.titel, "Geschafft!", true) +
        '<div class="result-hero"><div class="big">🎉</div><p>Du hast den ganzen Tutor-Weg durchgearbeitet!</p></div>' +
        '<div class="intro-box"><p>Du kennst jetzt den Bauplan: Einleitung (TATT) → Inhalt → Form → sprachliche Bilder &amp; Deutung → Stellungnahme.</p></div>' +
        '<button class="btn btn-soft" id="zurueck">Zurück zu den Themen</button>';
      app.querySelector(".back").onclick = zeigeThemen;
      document.getElementById("zurueck").onclick = zeigeThemen;
    }

    zeigeLektion();
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

    // KI erzeugt eine neue, aehnliche Aufgabe und haengt sie als naechste an
    function generiereAufgabe(a, antwort, btn) {
      if (!kiAktiv()) return;
      btn.disabled = true; btn.textContent = "🎯 KI denkt sich eine Aufgabe aus …";
      fetch(window.SCHULWEG_CONFIG.kiEndpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modus: "neue_aufgabe",
          fach: (window.SCHULWEG.faecher[state.fachKey] || {}).fach || "",
          klasse: state.profil.klasse, thema: thema.titel,
          frage: a.frage, richtig: String(a.richtig), antwort: String(antwort)
        })
      }).then(function (r) { return r.json(); }).then(function (neu) {
        if (!neu || !neu.frage || !neu.richtig) throw new Error("leer");
        if (neu.typ !== "mc") neu.typ = "text";
        if (neu.typ === "mc" && (!Array.isArray(neu.antworten) || neu.antworten.indexOf(neu.richtig) < 0)) throw new Error("mc kaputt");
        if (!Array.isArray(neu.schritte)) neu.schritte = [];
        if (!neu.erklaerung) neu.erklaerung = "Gut gemacht!";
        warteschlange.unshift(neu);
        naechste();
      }).catch(function () {
        btn.disabled = false; btn.textContent = "🎯 Nochmal: neue Aufgabe";
      });
    }

    // Satzglieder markieren: Wörter antippen, die das gefragte Satzglied bilden
    function zeigeMarkierenAufgabe(a) {
      var woerter = a.satz.split(" "), sel = {};
      app.innerHTML =
        topbar(thema.titel, null, true) +
        '<p class="q-meta">Aufgabe ' + idx + " · noch " + (warteschlange.length + 1) + " offen</p>" +
        '<div class="q-card"><p class="q-frage" style="font-size:18px">' + a.frage + "</p>" +
        (a.tipp ? '<p class="hint-input" style="margin:0 0 12px">💡 ' + a.tipp + "</p>" : "") +
        '<div id="msatz" style="display:flex;flex-wrap:wrap;gap:8px;font-size:20px;line-height:1.9">' +
        woerter.map(function (w, wi) {
          return '<span class="wort" data-wi="' + wi + '" style="padding:4px 10px;border-radius:8px;border:1.5px solid var(--border);cursor:pointer">' + w + "</span>";
        }).join("") + "</div>" +
        '<button class="btn btn-primary" id="pruefen" disabled style="margin-top:18px">Überprüfen</button>' +
        '<div class="feedback" id="fb"></div></div>';
      app.querySelector(".back").onclick = function () { if (confirm("Übung beenden?")) zeigeThemen(); };
      var pruefBtn = document.getElementById("pruefen");
      app.querySelectorAll(".wort").forEach(function (s) {
        s.onclick = function () {
          var wi = +s.dataset.wi;
          if (sel[wi]) { delete sel[wi]; s.style.borderColor = "var(--border)"; s.style.background = ""; }
          else { sel[wi] = true; s.style.borderColor = "var(--akzent)"; s.style.background = "var(--akzent-bg)"; }
          pruefBtn.disabled = Object.keys(sel).length === 0;
        };
      });
      pruefBtn.onclick = function () {
        var gewaehlt = Object.keys(sel).map(Number).sort(function (x, y) { return x - y; });
        var soll = a.richtig.slice().sort(function (x, y) { return x - y; });
        var ok = gewaehlt.length === soll.length && gewaehlt.every(function (v, k) { return v === soll[k]; });
        beantwortet++;
        if (ok && falschGehabt.indexOf(a) === -1) richtigErst++;
        pruefBtn.style.display = "none";
        app.querySelectorAll(".wort").forEach(function (s) {
          var wi = +s.dataset.wi; s.style.cursor = "default";
          if (soll.indexOf(wi) > -1) { s.style.borderColor = "var(--richtig)"; s.style.background = "var(--richtig-bg)"; }
          else if (sel[wi]) { s.style.borderColor = "var(--falsch)"; s.style.background = "var(--falsch-bg)"; }
        });
        var fb = document.getElementById("fb");
        if (ok) {
          fb.innerHTML = '<div class="row-result"><span class="pill ok">✓ Richtig! ' + (a.erklaerung || "") + "</span></div>" +
            '<button class="btn btn-primary" id="weiter">Weiter →</button>';
        } else {
          if (falschGehabt.indexOf(a) === -1) falschGehabt.push(a);
          warteschlange.push(a);
          var loesung = soll.map(function (wi) { return woerter[wi]; }).join(" ");
          fb.innerHTML = '<div class="row-result"><span class="pill no">🔄 Versuch’s gleich nochmal</span>' +
            '<span class="pill ok">Richtig: ' + loesung + "</span></div>" +
            '<div class="analyse"><div class="head">✨ So findest du es</div><p>' + (a.erklaerung || "") + "</p></div>" +
            '<button class="btn btn-primary" id="weiter" style="margin-top:14px">Verstanden, weiter →</button>';
        }
        document.getElementById("weiter").onclick = naechste;
      };
    }

    function zeigeAufgabe(a) {
      if (a.typ === "markieren") return zeigeMarkierenAufgabe(a);
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
          var schritte = (a.schritte || []).map(function (s, i) {
            return '<div class="step"><span class="n">' + (i + 1) + "</span>" + s + "</div>";
          }).join("");
          if (falschGehabt.indexOf(a) === -1) falschGehabt.push(a);
          warteschlange.push(a);   // Lernbox: nochmal ueben
          var kiBtn = kiAktiv()
            ? '<button class="btn btn-soft" id="ki-btn" style="margin-top:12px">🤖 Erklär’s mir nochmal anders</button>' +
              '<button class="btn btn-soft" id="gen-btn" style="margin-top:10px">🎯 Üb das mit einer neuen Aufgabe</button>' +
              '<div id="ki-out"></div>'
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
          var gb = document.getElementById("gen-btn");
          if (gb) gb.onclick = function () { generiereAufgabe(a, gewaehlt, gb); };
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
            frage: a.frage, antwort: String(text), kriterien: a.kriterien || ""
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
