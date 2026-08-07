/*
 * Zentrale Konfiguration fuer den Vokabeltrainer (SRS-Kern, Phase 1).
 * Keine "Magic Numbers" in srs.js/session.js/storage.js/ui.js - alles hier.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else { root.SCHULWEG_VOCAB = root.SCHULWEG_VOCAB || {}; root.SCHULWEG_VOCAB.config = api; }
})(typeof window !== "undefined" ? window : global, function () {
  "use strict";

  return {
    SCHEMA_VERSION: 1,

    // Einheitsgroessen
    NEUE_MAX: 5,
    WIEDERHOLEN_MIN: 8,
    WIEDERHOLEN_MAX: 15,
    EINSTIEG_MAX: 3,
    KURZ_WIEDERHOLEN_MIN: 5,

    // Adaptive Reduktion neuer Woerter je nach Anzahl faelliger Wiederholungen.
    // Stufentabelle, absteigend sortiert nach Schwelle geprueft.
    NEUWORT_REDUKTION: [
      { abFaellig: 15, neu: 0 },
      { abFaellig: 10, neu: 2 }
      // sonst: NEUE_MAX
    ],

    // Wiederholungsabstaende in Tagen, indiziert nach Lernstufe (0-5).
    // Index 0 wird praktisch nicht als Basis benutzt (Stufe 0 -> naechster
    // Schritt ist Stufe 1, Abstand minimal).
    ABSTAENDE_TAGE: [0, 1, 3, 7, 14, 30],

    // Wieviele unterschiedliche Kalendertage mit korrektem, hilfefreiem
    // aktiven Abruf sind fuer welche Stufe mindestens erforderlich.
    // Index = Stufe.
    STUFE_DISTINCT_TAGE_ERFORDERLICH: [0, 0, 1, 2, 3, 4],

    // Multiple Choice (Wiedererkennen) allein hebt eine Vokabel nie ueber
    // diese Stufe.
    STUFE_MC_MAXIMUM: 1,

    // Aufgabenrotation
    TASKTYPE_HISTORY_LEN: 3,

    // In-Session-Retry: nach wie vielen weiteren Queue-Eintraegen taucht
    // eine falsch beantwortete Vokabel wieder auf.
    RETRY_AFTER_TASKS: 2,

    // Begrenzung der Event-ID-Historie im Zustandscontainer (Punkt 51).
    RECENT_EVENT_IDS_MAX: 50
  };
});
