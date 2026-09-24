/*
 * Datenschutzsparsame Bruecke zwischen lokalem Lernstand und ChatGPT Voice.
 * Namen/Profile verlassen die App nie. Exportiert werden nur begrenzte
 * Unit-Inhalte und anonyme Vokabel-IDs; der Rueckweg ist ein validierter
 * Lernpass, der ausschliesslich lokal gespeichert wird.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else {
    root.SCHULWEG = root.SCHULWEG || { faecher: {} };
    root.SCHULWEG.faecher = root.SCHULWEG.faecher || {};
    root.SCHULWEG.voiceCoach = api;
  }
})(typeof window !== "undefined" ? window : global, function () {
  "use strict";

  var MARKER = "SCHULWEG-LERNPASS-V1";

  function einzigartig(liste) {
    var gesehen = {};
    return (liste || []).filter(function (wert) {
      if (typeof wert !== "string" || gesehen[wert]) return false;
      gesehen[wert] = true;
      return true;
    });
  }

  function letzterLernpass(state) {
    var sessions = state && Array.isArray(state.sessions) ? state.sessions : [];
    return sessions.length ? sessions[sessions.length - 1] : null;
  }

  function sortierePrioritaet(vocab, progress, voiceState, heute) {
    var letzter = letzterLernpass(voiceState);
    var sprachLuecken = letzter ? letzter.ueben || [] : [];
    return vocab.slice().sort(function (a, b) {
      function score(v) {
        var p = progress[v.id];
        var s = 0;
        if (sprachLuecken.indexOf(v.id) !== -1) s += 100;
        if (!p) s += 30;
        else {
          s += Math.max(0, 5 - (p.stage || 0)) * 8;
          s += Math.min(4, p.incorrectAnswers || 0) * 12;
          if (p.dueDate && p.dueDate <= heute) s += 25;
        }
        return s;
      }
      var diff = score(b) - score(a);
      return diff || a.id.localeCompare(b.id);
    });
  }

  function baueLernauftrag(optionen) {
    var vocab = optionen.vocab || [];
    var progress = optionen.progress || {};
    var max = Math.max(6, Math.min(20, optionen.maxWoerter || 12));
    var prioritaet = sortierePrioritaet(vocab, progress, optionen.voiceState || {}, optionen.heute || "").slice(0, max);
    var letzter = letzterLernpass(optionen.voiceState || {});
    var wortliste = prioritaet.map(function (v) {
      return "- " + v.id + ": " + v.en + " = " + v.de;
    }).join("\n");
    var alteLuecken = letzter && letzter.ueben && letzter.ueben.length
      ? letzter.ueben.join(", ") : "noch keine Sprachrunde vorhanden";

    var prompt = [
      "Du leitest eine kurze, ermutigende Englisch-Sprechlernunit fuer Klasse 7 (NRW).",
      "Stoff: Unit 1 London, Seiten 8–16: London und Sehenswuerdigkeiten, Meinungen begruenden, eine kurze Geschichte verstehen sowie einen Text ueber die eigene neighbourhood planen.",
      "Datenschutz: Frage NICHT nach Name, Schule, Adresse, Wohnort oder anderen persoenlichen Daten. Verwende erfundene Orte und Personen.",
      "Fuehre 10–12 Minuten Dialog. Sprich ueberwiegend einfaches Englisch; erklaere Fehler bei Bedarf kurz auf Deutsch.",
      "Stelle immer nur EINE Frage. Warte die Antwort ab. Gib erst einen kleinen Hinweis und danach die Loesung. Korrigiere freundlich und lass die richtige Form einmal wiederholen.",
      "Ablauf: 1) warm-up, 2) sechs priorisierte Woerter aktiv abrufen, 3) zwei kurze London-Verstaendnisfragen, 4) zwei eigene Saetze zu a neighbourhood, 5) Abschlusswiederholung.",
      "Fruehere Sprechluecken (anonyme IDs): " + alteLuecken + ".",
      "Priorisierte Woerter fuer heute:",
      wortliste,
      "Bewerte nur inhaltlich, nicht den Akzent. Markiere ein Wort nur als sicher, wenn es ohne vorsagende Hilfe korrekt aktiv benutzt wurde.",
      "Beende mit einer sehr kurzen Ermutigung. Gib DANACH im Textchat exakt eine Zeile in diesem Format aus:",
      MARKER + ' {"sicher":["en7_0001"],"ueben":["en7_0002"],"themen":["London"]}',
      "Nutze dabei nur IDs aus der obigen Liste; maximal drei sachliche Themenwoerter, keine Namen und keine persoenlichen Angaben."
    ].join("\n");

    (optionen.verboteneNamen || []).forEach(function (name) {
      if (!name) return;
      prompt = prompt.split(String(name)).join("");
    });
    return prompt;
  }

  function leseLernpass(text, erlaubteIds, heute) {
    var pos = String(text || "").lastIndexOf(MARKER);
    if (pos < 0) throw new Error("Kein gueltiger Lernpass gefunden.");
    var rest = String(text).slice(pos + MARKER.length).trim();
    var start = rest.indexOf("{");
    var ende = rest.indexOf("}", start + 1);
    if (start < 0 || ende < 0) throw new Error("Der Lernpass ist unvollstaendig.");
    var daten;
    try { daten = JSON.parse(rest.slice(start, ende + 1)); }
    catch (e) { throw new Error("Der Lernpass ist nicht lesbar."); }
    var erlaubt = {};
    (erlaubteIds || []).forEach(function (id) { erlaubt[id] = true; });
    var sicher = einzigartig(daten.sicher).filter(function (id) { return erlaubt[id]; }).slice(0, 20);
    var ueben = einzigartig(daten.ueben).filter(function (id) { return erlaubt[id] && sicher.indexOf(id) < 0; }).slice(0, 20);
    var themen = einzigartig(daten.themen).map(function (t) { return t.trim().slice(0, 40); }).filter(Boolean).slice(0, 3);
    if (!sicher.length && !ueben.length) throw new Error("Der Lernpass enthaelt keine bekannten Vokabeln.");
    return { datum: heute || null, sicher: sicher, ueben: ueben, themen: themen };
  }

  function fuegeLernpassHinzu(state, lernpass) {
    var sessions = state && Array.isArray(state.sessions) ? state.sessions.slice() : [];
    sessions.push(lernpass);
    if (sessions.length > 20) sessions = sessions.slice(sessions.length - 20);
    return { schemaVersion: 1, sessions: sessions };
  }

  function storageKey(profileId, fachKey) {
    return "voice_" + profileId + "_" + fachKey + "_state_v1";
  }

  function ladeState(store, profileId, fachKey) {
    try {
      var raw = store.getItem(storageKey(profileId, fachKey));
      if (!raw) return { schemaVersion: 1, sessions: [] };
      var state = JSON.parse(raw);
      if (!state || state.schemaVersion !== 1 || !Array.isArray(state.sessions)) throw new Error("ungueltig");
      return state;
    } catch (e) { return { schemaVersion: 1, sessions: [] }; }
  }

  function speichereState(store, profileId, fachKey, state) {
    store.setItem(storageKey(profileId, fachKey), JSON.stringify(state));
  }

  return {
    MARKER: MARKER,
    baueLernauftrag: baueLernauftrag,
    leseLernpass: leseLernpass,
    fuegeLernpassHinzu: fuegeLernpassHinzu,
    storageKey: storageKey,
    ladeState: ladeState,
    speichereState: speichereState
  };
});
