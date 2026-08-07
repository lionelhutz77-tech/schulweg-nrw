/*
 * UI der Lernreise (Slice 1). Wird ZULETZT geladen - braucht
 * window.SCHULWEG.util (aus app.js), SCHULWEG_LEARN.* und SCHULWEG_AUDIO.*.
 *
 * Ton: ruhig, wenig Text pro Bildschirm, kein Zeitdruck, Fehler fuehren zu
 * Hilfe statt zu Abzug. Keine Punkte, kein Shop, keine Abenteuerkarte.
 */
(function (root) {
  "use strict";
  var competency = root.SCHULWEG_LEARN.competency;
  var journey = root.SCHULWEG_LEARN.journey;
  var player = root.SCHULWEG_AUDIO.player;
  var store = root.localStorage;

  function heuteIso() { return new Date().toISOString().slice(0, 10); }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  var SKILL_LABEL = { listening: "Hören", reading: "Lesen", speaking: "Sprechen", writing: "Schreiben" };

  function starteLernreise(app, state, zurueck) {
    var util = root.SCHULWEG.util;
    var daten = root.SCHULWEG.unit1;
    if (!daten) { zurueck(); return; }
    var profileId = state.profil.profileId;
    var fachKey = daten.fachKey;
    var journeyId = daten.kompetenz.id;

    var position = journey.holePosition(profileId, fachKey, journeyId, store);
    if (position >= daten.schritte.length) position = 0;   // abgeschlossen -> neu beginnen

    function speicherePosition(p) { journey.merkePosition(profileId, fachKey, journeyId, p, store); }

    function verbuche(schritt, richtig) {
      if (!schritt.skill || !schritt.activityType) return;
      journey.verbucheErgebnis(profileId, fachKey, {
        competencyId: journeyId,
        skill: schritt.skill,
        activityType: schritt.activityType,
        correct: !!richtig,
        heute: heuteIso(),
        vokabelIds: daten.kompetenz.vokabelIds
      }, store);
    }

    function kopf(untertitel) {
      var f = journey.fortschritt(daten.schritte, position);
      return util.topbar(daten.kompetenz.titel, untertitel || ("Schritt " + (position + 1) + " von " + f.gesamt), true) +
        '<div class="bar" style="margin:-8px 0 18px"><span style="width:' + f.prozent + '%;background:var(--englisch)"></span></div>';
    }

    function backHandler() {
      app.querySelector(".back").onclick = function () { speicherePosition(position); zurueck(); };
    }

    function audioKnopf(audio, id) {
      if (!audio) return "";
      return '<button class="btn btn-soft" id="' + id + '" style="margin-top:0">🔊 Anhören</button>';
    }
    function wireAudio(audio, id, textFallbackId) {
      if (!audio) return;
      var b = document.getElementById(id);
      if (!b) return;
      b.onclick = function () {
        var r = player.spiele(audio, root);
        if (!r.gespielt) {
          b.textContent = "🔇 Ton nicht verfügbar – lies mit";
          b.disabled = true;
          var t = document.getElementById(textFallbackId);
          if (t) t.style.display = "block";
        }
      };
    }

    function weiter() {
      position++;
      speicherePosition(position);
      zeige();
    }

    // ---------- Szene ----------
    function zeigeSzene(s) {
      app.innerHTML = kopf() +
        '<div class="intro-box">' +
        '<p style="font-size:17px;line-height:1.6">' + esc(s.text) + "</p>" +
        (s.audio ? '<div class="q-card" style="margin-top:16px">' +
          '<p class="muted" style="margin:0 0 6px">' + esc(s.sprecher || "") + " sagt:</p>" +
          '<p class="q-frage" style="font-size:22px;margin:0 0 14px">„' + esc(s.audio.text) + '"</p>' +
          audioKnopf(s.audio, "au") + "</div>" : "") +
        (s.hinweis ? '<p class="hint-input" style="margin-top:14px">' + esc(s.hinweis) + "</p>" : "") +
        '<button class="btn btn-primary" id="w">Weiter →</button></div>';
      backHandler();
      wireAudio(s.audio, "au");
      document.getElementById("w").onclick = weiter;
      if (s.audio) player.spiele(s.audio, root);   // einmal automatisch
    }

    // ---------- Muster ----------
    function zeigeMuster(s) {
      app.innerHTML = kopf() +
        '<div class="intro-box"><h3 style="margin:0 0 12px;font-size:18px">' + esc(s.titel) + "</h3>" +
        '<div class="steps">' + s.beispiele.map(function (b) {
          return '<div class="step"><span class="n">›</span><b>' + esc(b.en) + "</b>&nbsp; – &nbsp;" + esc(b.de) + "</div>";
        }).join("") + "</div>" +
        '<div class="prereq" style="margin-top:16px">💡 ' + esc(s.merksatz) + "</div>" +
        audioKnopf(s.audio, "au") +
        '<button class="btn btn-primary" id="w">Verstanden →</button></div>';
      backHandler();
      wireAudio(s.audio, "au");
      document.getElementById("w").onclick = weiter;
    }

    // ---------- Multiple Choice (mit optionalem Audio) ----------
    function zeigeMc(s) {
      app.innerHTML = kopf() +
        (s.einleitung ? '<p class="muted" style="margin-bottom:12px">' + esc(s.einleitung) + "</p>" : "") +
        '<div class="q-card">' +
        (s.audio ? '<p id="afall" style="display:none" class="q-frage">„' + esc(s.audio.text) + '"</p>' + audioKnopf(s.audio, "au") + '<div style="height:14px"></div>' : "") +
        '<p class="q-frage">' + esc(s.frage) + "</p>" +
        '<div class="options">' + s.antworten.map(function (a) {
          return '<button class="opt" data-v="' + esc(a) + '">' + esc(a) + "</button>";
        }).join("") + "</div><div class='feedback' id='fb'></div></div>";
      backHandler();
      wireAudio(s.audio, "au", "afall");
      if (s.audio) player.spiele(s.audio, root);
      app.querySelectorAll(".opt").forEach(function (b) {
        b.onclick = function () {
          var richtig = b.dataset.v === s.richtig;
          app.querySelectorAll(".opt").forEach(function (x) {
            x.disabled = true;
            if (x.dataset.v === s.richtig) x.classList.add("ok");
            else if (x === b) x.classList.add("no");
          });
          verbuche(s, richtig);
          zeigeFeedback(s, richtig);
        };
      });
    }

    // ---------- Satzbausteine ----------
    function zeigeSatzbau(s) {
      var pool = util.mische(s.teile.slice()), gebaut = [];
      function render() {
        app.innerHTML = kopf() +
          '<div class="q-card"><p class="q-frage">' + esc(s.frage) + "</p>" +
          '<div id="bau" style="min-height:52px;display:flex;flex-wrap:wrap;gap:8px;padding:12px;border:1.5px dashed var(--border);border-radius:12px;margin-bottom:12px">' +
          (gebaut.length ? gebaut.map(function (t, i) { return '<button class="chip on" data-b="' + i + '">' + esc(t) + "</button>"; }).join("")
            : '<span class="muted">Tippe die Bausteine der Reihe nach an …</span>') + "</div>" +
          '<div style="display:flex;flex-wrap:wrap;gap:8px">' + pool.map(function (t, i) {
            return '<button class="chip" data-p="' + i + '">' + esc(t) + "</button>";
          }).join("") + "</div>" +
          '<button class="btn btn-primary" id="pr"' + (pool.length ? " disabled" : "") + ">Überprüfen</button>" +
          "<div class='feedback' id='fb'></div></div>";
        backHandler();
        app.querySelectorAll("[data-p]").forEach(function (b) {
          b.onclick = function () { gebaut.push(pool.splice(+b.dataset.p, 1)[0]); render(); };
        });
        app.querySelectorAll("[data-b]").forEach(function (b) {
          b.onclick = function () { pool.push(gebaut.splice(+b.dataset.b, 1)[0]); render(); };
        });
        var pr = document.getElementById("pr");
        if (pr) pr.onclick = function () {
          var richtig = gebaut.join(" ").trim() === s.loesung.trim();
          verbuche(s, richtig);
          zeigeFeedback(s, richtig, gebaut.join(" "));
        };
      }
      render();
    }

    // ---------- Freie Eingabe ----------
    function zeigeEingabe(s) {
      app.innerHTML = kopf() +
        '<div class="q-card"><p class="q-frage">' + esc(s.frage) + "</p>" +
        '<input class="zahl" id="ein" inputmode="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="' + esc(s.beispiel || "") + '" style="height:84px;font-size:22px" />' +
        '<button class="btn btn-primary" id="pr" disabled style="margin-top:14px">Überprüfen</button>' +
        "<div class='feedback' id='fb'></div></div>";
      backHandler();
      var inp = document.getElementById("ein"), pr = document.getElementById("pr");
      inp.oninput = function () { pr.disabled = !inp.value.trim(); };
      inp.focus();
      pr.onclick = function () {
        var richtig = new RegExp(s.muster, "i").test(inp.value.trim());
        verbuche(s, richtig);
        zeigeFeedback(s, richtig, inp.value.trim());
      };
    }

    // ---------- Nachsprechen (Selbstbestaetigung, keine Bewertung) ----------
    function zeigeNachsprechen(s) {
      app.innerHTML = kopf() +
        '<div class="q-card"><p class="muted" style="margin:0 0 6px">Sprich diesen Satz laut nach:</p>' +
        '<p class="q-frage" style="font-size:24px">„' + esc(s.satz) + '"</p>' +
        '<p class="muted" style="margin:-8px 0 14px">' + esc(s.uebersetzung) + "</p>" +
        audioKnopf(s.audio, "au") +
        '<p class="hint-input" style="margin-top:14px">' + esc(s.hinweis) + "</p>" +
        '<button class="btn btn-primary" id="ok">Hab ich gesagt ✓</button>' +
        '<button class="btn btn-soft" id="nochmal">Nochmal anhören</button></div>';
      backHandler();
      wireAudio(s.audio, "au");
      if (s.audio) player.spiele(s.audio, root);
      document.getElementById("nochmal").onclick = function () { player.spiele(s.audio, root); };
      document.getElementById("ok").onclick = function () { verbuche(s, true); weiter(); };
    }

    // ---------- Mini-Dialog ----------
    function zeigeDialog(s) {
      var zug = 0, verlauf = [], merker = {};
      function render(fehlversuch) {
        var z = s.zuege[zug];
        var text = z.sam.replace(/\{(\d)\}/g, function (m, i) { return merker[i] || ""; });
        app.innerHTML = kopf(s.titel) +
          (zug === 0 ? '<p class="muted" style="margin-bottom:12px">' + esc(s.einleitung) + "</p>" : "") +
          '<div class="intro-box" style="margin-bottom:14px">' + verlauf.map(function (v) {
            return '<p style="margin:0 0 8px"><b>' + esc(v.wer) + ":</b> " + esc(v.was) + "</p>";
          }).join("") +
          '<p style="margin:0 0 4px"><b>' + esc(s.partner) + ":</b> " + esc(text) + "</p>" +
          audioKnopf(z.audio, "au") + "</div>" +
          '<div class="q-card"><p class="muted" style="margin:0 0 8px">Deine Antwort:</p>' +
          '<input class="zahl" id="ein" inputmode="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="' + esc(z.beispiel) + '" style="height:76px;font-size:21px" />' +
          '<button class="btn btn-primary" id="pr" disabled style="margin-top:12px">Antworten</button>' +
          (fehlversuch ? '<div class="analyse" style="margin-top:14px"><p>Fast! Versuch es so: <b>' + esc(z.beispiel) + '</b></p></div>' : "") +
          "</div>";
        backHandler();
        wireAudio(z.audio, "au");
        if (z.audio) player.spiele(z.audio, root);
        var inp = document.getElementById("ein"), pr = document.getElementById("pr");
        inp.oninput = function () { pr.disabled = !inp.value.trim(); };
        inp.focus();
        pr.onclick = function () {
          var m = new RegExp(z.erwartet, "i").exec(inp.value.trim());
          if (!m) { render(true); return; }
          if (z.merkeGruppe && m[z.merkeGruppe]) merker[0] = m[z.merkeGruppe];
          verlauf.push({ wer: s.partner, was: text });
          verlauf.push({ wer: "Du", was: inp.value.trim() });
          var antwort = z.antwortSam.replace(/\{(\d)\}/g, function (mm, i) { return merker[i] || ""; });
          verlauf.push({ wer: s.partner, was: antwort });
          player.spiele({ kind: "sentence", key: "u1.k1.reply." + zug, text: antwort, lang: "en-GB" }, root);
          zug++;
          if (zug < s.zuege.length) { render(false); }
          else {
            verbuche(s, true);
            app.innerHTML = kopf(s.titel) +
              '<div class="intro-box">' + verlauf.map(function (v) {
                return '<p style="margin:0 0 8px"><b>' + esc(v.wer) + ":</b> " + esc(v.was) + "</p>";
              }).join("") + "</div>" +
              '<div class="prereq" style="margin-top:14px">🎉 ' + esc(s.abschluss) + "</div>" +
              '<button class="btn btn-primary" id="w">Weiter →</button>';
            backHandler();
            document.getElementById("w").onclick = weiter;
          }
        };
      }
      render(false);
    }

    // ---------- Feedback ----------
    function zeigeFeedback(s, richtig, eingabe) {
      var fb = document.getElementById("fb");
      if (richtig) {
        fb.innerHTML = '<div class="row-result"><span class="pill ok">✓ Genau!</span></div>' +
          (s.erklaerung ? '<div class="analyse"><p>' + esc(s.erklaerung) + "</p></div>" : "") +
          '<button class="btn btn-primary" id="w" style="margin-top:12px">Weiter →</button>';
        document.getElementById("w").onclick = weiter;
      } else {
        fb.innerHTML = '<div class="row-result"><span class="pill no">Fast – schau nochmal</span></div>' +
          '<div class="analyse"><p>' + esc(s.hilfe || s.erklaerung || "") + "</p>" +
          (s.beispiel ? "<p>So könnte es aussehen: <b>" + esc(s.beispiel) + "</b></p>" : "") +
          (s.loesung ? "<p>Richtig wäre: <b>" + esc(s.loesung) + "</b></p>" : "") + "</div>" +
          '<button class="btn btn-primary" id="r" style="margin-top:12px">Nochmal versuchen</button>' +
          '<button class="btn btn-soft" id="w">Trotzdem weiter →</button>';
        document.getElementById("r").onclick = zeige;
        document.getElementById("w").onclick = weiter;
      }
    }

    // ---------- Abschluss: Kompetenzstand ----------
    function zeigeAbschluss() {
      var stand = journey.holeStand(profileId, fachKey, journeyId, store);
      var uebersicht = competency.fertigkeitsUebersicht(stand);
      var STATUS_TEXT = {
        introduced: "gerade kennengelernt",
        practicing: "du übst noch",
        demonstrated: "schon gezeigt – komm morgen wieder!",
        mastered: "sitzt!"
      };
      app.innerHTML =
        util.topbar(daten.kompetenz.titel, "Dein Stand", true) +
        '<div class="result-hero"><div class="big">' + (stand.status === "mastered" ? "🎉" : "👍") + "</div>" +
        "<p>" + esc(STATUS_TEXT[stand.status] || "") + "</p></div>" +
        '<div class="intro-box"><h3 style="margin:0 0 12px;font-size:17px">' + esc(daten.kompetenz.titel) + "</h3>" +
        uebersicht.map(function (u) {
          return '<p style="margin:0 0 8px;display:flex;justify-content:space-between">' +
            "<span>" + SKILL_LABEL[u.skill] + "</span>" +
            '<span style="color:' + (u.sitzt ? "var(--richtig)" : "var(--text-hint)") + '">' +
            (u.sitzt ? "✓" : "noch üben") + "</span></p>";
        }).join("") + "</div>" +
        (stand.status !== "mastered"
          ? '<p class="muted center" style="margin-top:14px">Für „sitzt!" brauchst du beides: verstehen (Hören/Lesen) <b>und</b> selbst anwenden (Sprechen/Schreiben).</p>'
          : "") +
        '<button class="btn btn-primary" id="neu">Lernreise nochmal</button>' +
        '<button class="btn btn-soft" id="z">Zurück</button>';
      app.querySelector(".back").onclick = zurueck;
      document.getElementById("z").onclick = zurueck;
      document.getElementById("neu").onclick = function () { position = 0; speicherePosition(0); zeige(); };
    }

    // ---------- Dispatcher ----------
    function zeige() {
      var s = journey.naechsterSchritt(daten.schritte, position);
      if (!s) { zeigeAbschluss(); return; }
      if (s.art === "szene") return zeigeSzene(s);
      if (s.art === "muster") return zeigeMuster(s);
      if (s.art === "dialog") return zeigeDialog(s);
      if (s.typ === "mc") return zeigeMc(s);
      if (s.typ === "bausteine") return zeigeSatzbau(s);
      if (s.typ === "freieingabe") return zeigeEingabe(s);
      if (s.activityType === "nachsprechen") return zeigeNachsprechen(s);
      position++; zeige();   // unbekannter Typ: sicher ueberspringen
    }

    zeige();
  }

  root.SCHULWEG = root.SCHULWEG || {};
  root.SCHULWEG.learnUI = { starteLernreise: starteLernreise };
})(typeof window !== "undefined" ? window : this);
