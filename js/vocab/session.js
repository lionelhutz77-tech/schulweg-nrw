/*
 * Reine Sitzungs-Orchestrierung: baut eine normale oder kurze Einheit aus
 * dem Vokabelpool + Fortschritt. Kein DOM, keine echte Zeit/Zufall - `heute`
 * und `rng` (Funktion () => Zahl in [0,1)) werden injiziert.
 */
(function (root, factory) {
  var api = factory(
    typeof module !== "undefined" && module.exports ? require("./srs.js") : root.SCHULWEG_VOCAB.srs
  );
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else { root.SCHULWEG_VOCAB = root.SCHULWEG_VOCAB || {}; root.SCHULWEG_VOCAB.session = api; }
})(typeof window !== "undefined" ? window : global, function (srsModul) {
  "use strict";

  // Seed-basiertes Fisher-Yates (deterministisch bei injiziertem rng).
  function mischeMitRng(arr, rng) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Welche Aufgabenart fuer eine Wiederholung? Aktiver Abruf ("text") wird
  // staerker gewichtet, aber nicht 2x in Folge dieselbe Art fuer dasselbe Wort.
  function waehleTaskType(progress) {
    if (!progress || progress.stage === 0) return "mc";
    var letzte = (progress.lastTaskTypes || []);
    var letzteArt = letzte.length ? letzte[letzte.length - 1] : null;
    return letzteArt === "text" ? "mc" : "text";
  }

  function machEintrag(itemIdCounterRef, vocabularyId, taskType, purpose) {
    var itemId = "item_" + String(itemIdCounterRef.n++).padStart(3, "0");
    return {
      itemId: itemId, vocabularyId: vocabularyId, taskType: taskType, purpose: purpose,
      attempt: 1, retryOf: null, scheduledAfterPosition: null,
      stageBeforeFailure: null, failureEventId: null
    };
  }

  /**
   * @param {Array} alleVokabeln normalisierte Vokabelobjekte (mit id)
   * @param {Object} progressMap { vocabularyId: progress }
   * @param {"normal"|"kurz"} einheitTyp
   * @param {Object} config
   * @param {String} heute ISO-Datum
   * @param {Function} rng () => Zahl in [0,1)
   */
  function baueEinheit(alleVokabeln, progressMap, einheitTyp, config, heute, rng) {
    var faelligeIds = srsModul.waehleFaellige(progressMap, heute);
    var wiederholenMax = einheitTyp === "kurz" ? config.WIEDERHOLEN_MAX : config.WIEDERHOLEN_MAX;
    var wiederholenIds = faelligeIds.slice(0, wiederholenMax);

    var neueAnzahl = einheitTyp === "kurz" ? 0 : srsModul.bestimmeNeueAnzahl(faelligeIds.length, config);
    var nieGesehen = alleVokabeln.filter(function (v) { return !progressMap[v.id]; });
    var nieGesehenGemischt = mischeMitRng(nieGesehen, rng);
    var neuIds = nieGesehenGemischt.slice(0, neueAnzahl).map(function (v) { return v.id; });

    var bekannteIds = Object.keys(progressMap).filter(function (id) {
      return progressMap[id].stage >= 2 && wiederholenIds.indexOf(id) === -1 && neuIds.indexOf(id) === -1;
    });
    var einstiegIds = mischeMitRng(bekannteIds, rng).slice(0, config.EINSTIEG_MAX);

    var counter = { n: 1 };
    var queue = [];
    einstiegIds.forEach(function (id) { queue.push(machEintrag(counter, id, "mc", "einstieg")); });
    neuIds.forEach(function (id) { queue.push(machEintrag(counter, id, "mc", "neu")); });
    mischeMitRng(wiederholenIds, rng).forEach(function (id) {
      queue.push(machEintrag(counter, id, waehleTaskType(progressMap[id]), "wiederholen"));
    });

    return {
      sections: { einstieg: einstiegIds, neu: neuIds, wiederholen: wiederholenIds },
      queue: queue
    };
  }

  function erzeugeEvent(sessionId, sequenceNumber, queueItem, result, heute, extra) {
    extra = extra || {};
    return {
      eventId: sessionId + "_" + sequenceNumber,
      sessionId: sessionId,
      sequenceNumber: sequenceNumber,
      itemId: queueItem.itemId,
      vocabularyId: queueItem.vocabularyId,
      taskType: queueItem.taskType,
      result: result,
      answeredAt: heute,
      errorType: extra.errorType || null,
      hilfeGenutzt: !!extra.hilfeGenutzt
    };
  }

  // Prueft, ob eine gespeicherte activeSession sicher fortgesetzt werden
  // darf: alle referenzierten vocabularyIds muessen im aktuellen Pool
  // existieren. Bei false soll die UI die Sitzung ueber
  // storage.verwerfeAktiveSitzung() verwerfen, ohne progress anzufassen.
  function sitzungIstGueltig(activeSession, alleVokabelIdsSet) {
    if (!activeSession) return false;
    return activeSession.queue.every(function (qi) {
      return alleVokabelIdsSet.indexOf(qi.vocabularyId) !== -1;
    });
  }

  return {
    mischeMitRng: mischeMitRng,
    waehleTaskType: waehleTaskType,
    baueEinheit: baueEinheit,
    erzeugeEvent: erzeugeEvent,
    sitzungIstGueltig: sitzungIstGueltig
  };
});
