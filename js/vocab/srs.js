/*
 * Reine SRS-Engine (Spaced Repetition) fuer den Vokabeltrainer.
 * Keine Storage-, DOM- oder echte Zeit-/Zufallsabhaengigkeiten - `heute`
 * (ISO-Datums-String "YYYY-MM-DD") wird immer injiziert.
 *
 * WICHTIG: kein eigenes `schemaVersion`-Feld an Fortschrittsobjekten - die
 * Versionierung lebt ausschliesslich auf Ebene des Zustandscontainers
 * (siehe storage.js).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else { root.SCHULWEG_VOCAB = root.SCHULWEG_VOCAB || {}; root.SCHULWEG_VOCAB.srs = api; }
})(typeof window !== "undefined" ? window : global, function () {
  "use strict";

  function leeresFortschritt(vocabularyId) {
    return {
      vocabularyId: vocabularyId,
      stage: 0,
      dueDate: null,
      lastReviewedAt: null,
      successfulActiveRecalls: 0,
      successfulRecognitionAnswers: 0,
      incorrectAnswers: 0,
      distinctActiveRecallDays: 0,
      lastActiveRecallDay: null,
      consecutiveSuccessfulDays: 0,
      lastTaskTypes: [],
      lastErrorType: null,
      updatedAt: null
    };
  }

  function naechsterTag(isoDatum) {
    var d = new Date(isoDatum + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().slice(0, 10);
  }
  function tageAddieren(isoDatum, tage) {
    var d = new Date(isoDatum + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + tage);
    return d.toISOString().slice(0, 10);
  }

  function pushTaskType(liste, taskType, maxLen) {
    var neu = liste.concat([taskType]);
    if (neu.length > maxLen) neu = neu.slice(neu.length - maxLen);
    return neu;
  }

  function maxStageDurchTage(distinctTage, config) {
    var tab = config.STUFE_DISTINCT_TAGE_ERFORDERLICH; // index = stage
    var max = 1;
    for (var s = 2; s < tab.length; s++) {
      if (distinctTage >= tab[s]) max = s;
    }
    return max;
  }

  /**
   * Wendet eine einzelne Antwort auf einen Fortschritts-Eintrag an.
   * @param {object|null} progressIn bestehender Fortschritt oder null (neu)
   * @param {string} vocabularyId
   * @param {object} params { taskType: "mc"|"text", correct: bool,
   *   isRetry: bool, stageBeforeFailure: number|null, errorType: string|null }
   * @param {object} config
   * @param {string} heute ISO-Datum
   * @returns {{ progress: object, retryNeeded: boolean, stageBeforeFailure: number }}
   */
  function verarbeiteAntwort(progressIn, vocabularyId, params, config, heute) {
    var p = progressIn ? Object.assign({}, progressIn) : leeresFortschritt(vocabularyId);
    p.lastTaskTypes = pushTaskType(p.lastTaskTypes || [], params.taskType, config.TASKTYPE_HISTORY_LEN);
    p.lastReviewedAt = heute;
    p.updatedAt = heute;

    var stageVorAntwort = p.stage;
    var retryNeeded = false;

    if (!params.correct) {
      // Falsche Antwort: Fortschritt wird NIE pauschal auf 0 gesetzt, nur
      // um max. 1 Stufe zurueckgestuft. dueDate = morgen (Inter-Day-SRS).
      // In-Session-Retry wird ueber die Queue gesteuert (session.js), NICHT
      // hier ueber dueDate.
      p.incorrectAnswers = (p.incorrectAnswers || 0) + 1;
      p.stage = Math.max(0, stageVorAntwort - 1);
      p.dueDate = naechsterTag(heute);
      p.lastErrorType = params.errorType || null;
      p.consecutiveSuccessfulDays = 0;
      retryNeeded = true;
      return { progress: p, retryNeeded: retryNeeded, stageBeforeFailure: stageVorAntwort };
    }

    if (params.isRetry) {
      // Konservative Retry-Bewertung (Korrekturrunde 3, Punkt 10 / 7):
      // urspruenglicher Fehler bleibt gezaehlt (kein Zuruecksetzen),
      // kein zusaetzlicher aktiver Lerntag, kein voller Abstandsbonus,
      // Stage darf hoechstens auf den Stand vor dem Fehler zurueck -
      // nie darueber hinaus.
      var deckel = params.stageBeforeFailure != null ? params.stageBeforeFailure : stageVorAntwort;
      p.stage = Math.min(stageVorAntwort + 1, deckel);
      p.dueDate = naechsterTag(heute); // kein voller Abstandssprung
      return { progress: p, retryNeeded: false, stageBeforeFailure: null };
    }

    if (params.taskType === "mc") {
      // Wiedererkennen: hebt eine Vokabel nie ueber STUFE_MC_MAXIMUM,
      // senkt eine bereits hoehere Stufe aber auch nicht ab.
      p.successfulRecognitionAnswers = (p.successfulRecognitionAnswers || 0) + 1;
      p.stage = stageVorAntwort === 0 ? config.STUFE_MC_MAXIMUM : stageVorAntwort;
      p.dueDate = naechsterTag(heute); // kein voller Abstandssprung (nur Wiedererkennen)
      return { progress: p, retryNeeded: false, stageBeforeFailure: null };
    }

    // Aktiver Abruf (taskType "text"), korrekt, kein Retry.
    p.successfulActiveRecalls = (p.successfulActiveRecalls || 0) + 1;
    var neuerTag = p.lastActiveRecallDay !== heute;
    if (neuerTag) {
      // consecutiveSuccessfulDays: nur erhoehen, wenn heute exakt der
      // Folgetag des letzten aktiven Abrufs ist; sonst neu bei 1 beginnen.
      if (p.lastActiveRecallDay && naechsterTag(p.lastActiveRecallDay) === heute) {
        p.consecutiveSuccessfulDays = (p.consecutiveSuccessfulDays || 0) + 1;
      } else {
        p.consecutiveSuccessfulDays = 1;
      }
      p.distinctActiveRecallDays = (p.distinctActiveRecallDays || 0) + 1;
      p.lastActiveRecallDay = heute;
      var maxDurchTage = maxStageDurchTage(p.distinctActiveRecallDays, config);
      p.stage = Math.min(stageVorAntwort + 1, maxDurchTage, 5);
    }
    // Zweiter aktiver Abruf am selben Tag: successfulActiveRecalls zaehlt
    // trotzdem (kumulativ), aber keine weitere Stufen-/Tage-Erhoehung.
    p.dueDate = tageAddieren(heute, config.ABSTAENDE_TAGE[p.stage] || 1);
    return { progress: p, retryNeeded: false, stageBeforeFailure: null };
  }

  // Fällige Vokabel-IDs (dueDate <= heute), nach Faelligkeitsalter sortiert
  // (aelteste zuerst). progressMap: { vocabularyId: progress }.
  function waehleFaellige(progressMap, heute) {
    return Object.keys(progressMap)
      .filter(function (id) { return progressMap[id].dueDate && progressMap[id].dueDate <= heute; })
      .sort(function (a, b) {
        return progressMap[a].dueDate < progressMap[b].dueDate ? -1
          : progressMap[a].dueDate > progressMap[b].dueDate ? 1 : 0;
      });
  }

  // Adaptive Reduktion neuer Woerter je nach Anzahl faelliger Wiederholungen.
  function bestimmeNeueAnzahl(anzahlFaellig, config) {
    var tab = config.NEUWORT_REDUKTION.slice().sort(function (a, b) { return b.abFaellig - a.abFaellig; });
    for (var i = 0; i < tab.length; i++) {
      if (anzahlFaellig >= tab[i].abFaellig) return tab[i].neu;
    }
    return config.NEUE_MAX;
  }

  return {
    leeresFortschritt: leeresFortschritt,
    verarbeiteAntwort: verarbeiteAntwort,
    waehleFaellige: waehleFaellige,
    bestimmeNeueAnzahl: bestimmeNeueAnzahl,
    naechsterTag: naechsterTag,
    tageAddieren: tageAddieren
  };
});
