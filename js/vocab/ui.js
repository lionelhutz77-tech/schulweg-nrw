/*
 * UI-Schicht des Vokabeltrainers (Phase 1). Bindet die reinen Module
 * (model/config/storage/srs/session) an das DOM. Wird ZULETZT geladen,
 * nach js/app.js (braucht window.SCHULWEG.util).
 *
 * Phase 1: nur die Aufgabenarten "mc" (Wiedererkennen) und "text" (aktiver
 * Abruf) - Audio, Diktat, Hilfesystem, Eltern-Dashboard folgen in
 * spaeteren Phasen.
 */
(function (root) {
  "use strict";
  var model = root.SCHULWEG_VOCAB.model;
  var config = root.SCHULWEG_VOCAB.config;
  var srs = root.SCHULWEG_VOCAB.srs;
  var storage = root.SCHULWEG_VOCAB.storage;
  var sessionModul = root.SCHULWEG_VOCAB.session;

  var store = root.localStorage;
  var cryptoObj = root.crypto;

  function heuteIso() { return new Date().toISOString().slice(0, 10); }
  function rng() { return Math.random(); }
  function neueSessionId() { return "sess_" + Date.now() + "_" + Math.floor(rng() * 1e9); }

  function starteEinheit(fach, state, app, zurueck) {
    var util = root.SCHULWEG.util;
    var fachKey = state.fachKey;
    var profil = state.profil;
    var profileId = profil.profileId;
    // F-02: aktueller Name zuerst, danach frühere Namen (Umbenennung), damit
    // Legacy-Vokabeldaten unter dem bisherigen Namen gefunden werden.
    var profilNamen = [profil.name].concat(profil.legacyNames || []);
    var alleRoh = fach.vokabeltrainer;
    var alle = model.normalisierePool(alleRoh);

    var validierung = model.validiereVokabelPool(alle);
    if (!validierung.ok) {
      app.innerHTML =
        util.topbar("Vokabeltrainer", "Datenproblem", true) +
        '<div class="intro-box"><p>Die Vokabeldaten sind gerade fehlerhaft (' +
        (validierung.fehlendeIndizes.length ? validierung.fehlendeIndizes.length + " fehlende ID(s)" : "") +
        (validierung.doppelteIds.length ? (validierung.fehlendeIndizes.length ? ", " : "") + validierung.doppelteIds.length + " doppelte ID(s)" : "") +
        '). Bitte Eltern informieren. Andere Fächer/Themen sind davon nicht betroffen.</p></div>';
      app.querySelector(".back").onclick = zurueck;
      return;
    }

    // Legacy hard/ptr in den Container migrieren (idempotent, laeuft ueber
    // den AKTUELL gueltigen Profilnamen, da das die alten Keys erzeugt hat).
    storage.migriereHardInContainer(profileId, profilNamen, fachKey, alle, store, heuteIso());

    var geladen = storage.ladeZustand(profileId, fachKey, store, heuteIso());
    if (geladen.status === "corruptState" || geladen.status === "unsupportedSchema") {
      zeigeBlockiert(app, util, geladen, profileId, fachKey, zurueck);
      return;
    }

    var container = geladen.container;
    var idsSet = alle.map(function (v) { return v.id; });
    if (container.activeSession && sessionModul.sitzungIstGueltig(container.activeSession, idsSet)) {
      zeigeFortsetzenAngebot(app, util, container, alle, fach, state, zurueck);
      return;
    }
    if (container.activeSession) {
      // Beschaedigte/veraltete Referenzen: sicher verwerfen, Fortschritt bleibt.
      storage.verwerfeAktiveSitzung(profileId, fachKey, store, heuteIso());
    }
    zeigeEinheitAuswahl(app, util, alle, fach, state, zurueck);
  }

  function zeigeBlockiert(app, util, geladen, profileId, fachKey, zurueck) {
    app.innerHTML =
      util.topbar("Vokabeltrainer", "Datenproblem", true) +
      '<div class="intro-box"><p>Die gespeicherten Lerndaten sind gerade nicht lesbar. Der Vokabeltrainer ist vorübergehend nicht nutzbar, andere Fächer/Themen funktionieren normal.</p></div>';
    app.querySelector(".back").onclick = zurueck;
    if (geladen.status === "corruptState" && geladen.raw) {
      storage.sichereBeschaedigtenContainer(profileId, fachKey, geladen.raw, store, String(Date.now()));
    }
  }

  function zeigeFortsetzenAngebot(app, util, container, alle, fach, state, zurueck) {
    var s = container.activeSession;
    app.innerHTML =
      util.topbar("Vokabeltrainer", "Laufende Einheit gefunden", true) +
      '<div class="intro-box"><p>Du hast eine ' + (s.einheitTyp === "kurz" ? "kurze" : "normale") +
      " Einheit begonnen (" + s.currentPosition + " von " + s.queue.length + " Aufgaben). Weitermachen?</p></div>" +
      '<button class="btn btn-primary" id="weiter-alt">Sitzung fortsetzen</button>' +
      '<button class="btn btn-soft" id="verwerfen">Neu starten</button>';
    app.querySelector(".back").onclick = zurueck;
    document.getElementById("weiter-alt").onclick = function () {
      zeigeAufgabe(app, util, container, alle, fach, state, zurueck);
    };
    document.getElementById("verwerfen").onclick = function () {
      storage.verwerfeAktiveSitzung(state.profil.profileId, state.fachKey, store, heuteIso());
      zeigeEinheitAuswahl(app, util, alle, fach, state, zurueck);
    };
  }

  function zeigeEinheitAuswahl(app, util, alle, fach, state, zurueck) {
    app.innerHTML =
      util.topbar("Vokabeltrainer", "Welche Einheit?", true) +
      '<div class="intro-box"><p>Normale Einheit: ca. 15 Minuten, mit neuen Wörtern. Kurze Einheit: ca. 5 Minuten, nur Wiederholung.</p></div>' +
      '<button class="btn btn-primary" id="normal">Normale Einheit (~15 Min)</button>' +
      '<button class="btn btn-soft" id="kurz">Kurze Einheit (~5 Min)</button>';
    app.querySelector(".back").onclick = zurueck;
    document.getElementById("normal").onclick = function () { starteNeu(app, util, alle, fach, state, zurueck, "normal"); };
    document.getElementById("kurz").onclick = function () { starteNeu(app, util, alle, fach, state, zurueck, "kurz"); };
  }

  function starteNeu(app, util, alle, fach, state, zurueck, typ) {
    var geladen = storage.ladeZustand(state.profil.profileId, state.fachKey, store, heuteIso());
    var progressMap = geladen.status === "ok" || geladen.status === "empty" ? geladen.container.progress : {};
    var einheit = sessionModul.baueEinheit(alle, progressMap, typ, config, heuteIso(), rng);
    var sessionId = neueSessionId();
    var r = storage.starteNeueSitzung(state.profil.profileId, state.fachKey, sessionId, typ, einheit.sections, einheit.queue, store, heuteIso());
    if (r.status !== "started") {
      zeigeEinheitAuswahl(app, util, alle, fach, state, zurueck);
      return;
    }
    zeigeAufgabe(app, util, r.container, alle, fach, state, zurueck);
  }

  function findeVokabel(alle, id) {
    for (var i = 0; i < alle.length; i++) if (alle[i].id === id) return alle[i];
    return null;
  }

  function kopf(container) {
    var s = container.activeSession;
    return "Aufgabe " + (s.currentPosition + 1) + " von " + s.queue.length;
  }

  function zeigeAufgabe(app, util, container, alle, fach, state, zurueck) {
    var s = container.activeSession;
    var qi = s.queue[s.currentPosition];
    if (!qi) { zeigeAbschluss(app, util, container, alle, fach, state, zurueck); return; }
    var v = findeVokabel(alle, qi.vocabularyId);
    if (!v) {
      // Verwaiste Referenz (Vokabel wurde aus dem Pool entfernt) - Item ueberspringen.
      s.currentPosition++;
      zeigeAufgabe(app, util, container, alle, fach, state, zurueck);
      return;
    }
    if (qi.taskType === "mc") zeigeMc(app, util, container, alle, fach, state, zurueck, qi, v);
    else zeigeText(app, util, container, alle, fach, state, zurueck, qi, v);
  }

  function naechsteSequenceNumber(container) {
    return container.eventState.lastAppliedSequenceNumber + 1;
  }

  function verarbeiteUndWeiter(app, util, container, alle, fach, state, zurueck, event) {
    var r = storage.wendeAntwortEreignisAn(state.profil.profileId, state.fachKey, event, { store: store, config: config, heute: heuteIso() });
    if (r.status !== "applied") {
      // Sollte im Normalbetrieb nicht vorkommen; sicherer Rueckweg ohne Datenverlust.
      zeigeBlockiert(app, util, { status: "corruptState", raw: null }, state.profil.profileId, state.fachKey, zurueck);
      return null;
    }
    return r.container;
  }

  function zeigeMc(app, util, container, alle, fach, state, zurueck, qi, v) {
    var distraktorPool = util.mische(alle.filter(function (x) { return x.id !== v.id; }));
    var optionen = [v.en];
    for (var i = 0; i < distraktorPool.length && optionen.length < 3; i++) {
      if (optionen.indexOf(distraktorPool[i].en) === -1) optionen.push(distraktorPool[i].en);
    }
    optionen = util.mische(optionen);
    app.innerHTML =
      util.topbar("Vokabeltrainer", kopf(container), true) +
      '<div class="q-card"><p class="muted" style="margin:0 0 6px">Welches englische Wort passt?</p>' +
      '<p class="q-frage" style="font-size:24px;margin:0 0 16px">' + v.de + "</p>" +
      '<div class="options">' + optionen.map(function (o) {
        return '<button class="opt" data-val="' + o.replace(/"/g, "&quot;") + '">' + o + "</button>";
      }).join("") + "</div>" +
      '<div class="feedback" id="fb"></div></div>';
    app.querySelector(".back").onclick = function () {
      if (confirm("Vokabeltrainer beenden? Dein Fortschritt bleibt gespeichert.")) zurueck();
    };
    app.querySelectorAll(".opt").forEach(function (b) {
      b.onclick = function () {
        var ok = b.dataset.val === v.en;
        app.querySelectorAll(".opt").forEach(function (x) {
          x.disabled = true;
          if (x.dataset.val === v.en) x.classList.add("ok"); else if (x === b) x.classList.add("no");
        });
        var event = sessionModul.erzeugeEvent(container.activeSession.sessionId, naechsteSequenceNumber(container), qi, ok ? "correct" : "incorrect", heuteIso());
        var neuerContainer = verarbeiteUndWeiter(app, util, container, alle, fach, state, zurueck, event);
        if (!neuerContainer) return;
        document.getElementById("fb").innerHTML =
          '<div class="row-result"><span class="pill ' + (ok ? "ok" : "no") + '">' + v.de + " = " + v.en + '</span></div>' +
          '<button class="btn btn-primary" id="weiter">Weiter →</button>';
        document.getElementById("weiter").onclick = function () { zeigeAufgabe(app, util, neuerContainer, alle, fach, state, zurueck); };
      };
    });
  }

  function zeigeText(app, util, container, alle, fach, state, zurueck, qi, v) {
    app.innerHTML =
      util.topbar("Vokabeltrainer", kopf(container), true) +
      '<div class="q-card"><p class="muted" style="margin:0 0 6px">Wie heißt das auf Englisch? (richtig schreiben)</p>' +
      '<p class="q-frage" style="font-size:24px;margin:0 0 16px">' + v.de + "</p>" +
      '<input class="zahl" id="eingabe" inputmode="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="englisch …" style="height:96px;font-size:24px;text-transform:lowercase" />' +
      '<button class="btn btn-primary" id="pruefen" disabled style="margin-top:14px">Überprüfen</button>' +
      '<div class="feedback" id="fb"></div></div>';
    app.querySelector(".back").onclick = function () {
      if (confirm("Vokabeltrainer beenden? Dein Fortschritt bleibt gespeichert.")) zurueck();
    };
    var inp = document.getElementById("eingabe"), pr = document.getElementById("pruefen");
    inp.oninput = function () { pr.disabled = !inp.value.trim(); };
    inp.focus();
    pr.onclick = function () {
      var eingabe = util.normalisiere(inp.value).replace(/'/g, "");
      var ok = [v.en].concat(v.alt || []).some(function (k) { return util.normalisiere(k).replace(/'/g, "") === eingabe; });
      pr.style.display = "none";
      var event = sessionModul.erzeugeEvent(container.activeSession.sessionId, naechsteSequenceNumber(container), qi, ok ? "correct" : "incorrect", heuteIso());
      var neuerContainer = verarbeiteUndWeiter(app, util, container, alle, fach, state, zurueck, event);
      if (!neuerContainer) return;
      var fb = document.getElementById("fb");
      if (ok) {
        fb.innerHTML = '<div class="row-result"><span class="pill ok">✓ Richtig! ' + v.en + '</span></div><button class="btn btn-primary" id="weiter">Weiter →</button>';
      } else {
        fb.innerHTML = '<div class="row-result"><span class="pill no">🔄 Merk dir das</span><span class="pill ok">Richtig: ' + v.en + "</span></div>" +
          '<div class="analyse"><p>„' + v.de + "“ heißt auf Englisch <b>" + v.en + "</b>. Es kommt gleich nochmal.</p></div>" +
          '<button class="btn btn-primary" id="weiter" style="margin-top:12px">Verstanden, weiter →</button>';
      }
      document.getElementById("weiter").onclick = function () { zeigeAufgabe(app, util, neuerContainer, alle, fach, state, zurueck); };
    };
  }

  function zeigeAbschluss(app, util, container, alle, fach, state, zurueck) {
    var s = container.activeSession;
    var antworten = s.answers;
    var neuAnzahl = s.sections.neu.length;
    var wiederholenAnzahl = s.sections.wiederholen.length;
    var aktiveOhneHilfe = antworten.filter(function (a) { return a.taskType === "text" && a.richtig && !a.hilfeGenutzt; }).length;
    var wiedererkannt = antworten.filter(function (a) { return a.taskType === "mc"; }).length;
    var heute = heuteIso();
    var baldFaellig = Object.keys(container.progress).filter(function (id) {
      var p = container.progress[id];
      return p.dueDate && p.dueDate > heute && p.dueDate <= srs.tageAddieren(heute, 3);
    }).length;
    var startMs = Date.parse(s.startedAt);
    var dauerText = !isNaN(startMs) ? Math.max(1, Math.round((Date.now() - startMs) / 60000)) + " Min." : "";

    storage.verwerfeAktiveSitzung(state.profil.profileId, state.fachKey, store, heute);

    app.innerHTML =
      util.topbar("Vokabeltrainer", "Geschafft!", true) +
      '<div class="result-hero"><div class="big">🎉</div><p>Einheit abgeschlossen</p></div>' +
      '<div class="stat-row">' +
      '<div class="stat"><div class="num">' + neuAnzahl + '</div><div class="lbl">neu bearbeitet</div></div>' +
      '<div class="stat"><div class="num">' + wiederholenAnzahl + '</div><div class="lbl">wiederholt</div></div>' +
      '<div class="stat"><div class="num">' + aktiveOhneHilfe + '</div><div class="lbl">sicher erinnert</div></div>' +
      "</div>" +
      '<div class="intro-box"><p>Wiedererkennungsaufgaben: <b>' + wiedererkannt + "</b><br>" +
      "Bald erneut fällig (nächste 3 Tage): <b>" + baldFaellig + "</b><br>" +
      (dauerText ? "Dauer: <b>" + dauerText + "</b><br>" : "") +
      "</p></div>" +
      '<button class="btn btn-primary" id="neu">Neue Einheit</button>' +
      '<button class="btn btn-soft" id="zurueck">Zurück</button>';
    app.querySelector(".back").onclick = zurueck;
    document.getElementById("zurueck").onclick = zurueck;
    document.getElementById("neu").onclick = function () { starteEinheit(fach, state, app, zurueck); };
  }

  root.SCHULWEG = root.SCHULWEG || {};
  root.SCHULWEG.vocabUI = { starteEinheit: starteEinheit };
})(typeof window !== "undefined" ? window : this);
