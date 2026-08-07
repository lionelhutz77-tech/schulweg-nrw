/*
 * Kompetenzmodell (Slice 1) - bewusst KEIN SRS-Stufenwert.
 *
 * Eine Vokabel ist ein atomares Item mit einer Erfolgsdimension.
 * Eine Kompetenz ist zusammengesetzt: sie wird getrennt nach Fertigkeiten
 * (listening/reading/speaking/writing) belegt und kann teilweise beherrscht
 * sein. Deshalb eigener Zustand, eigene Regeln.
 *
 * Der Vokabel-SRS bleibt die autoritative Quelle fuer einzelne Vokabelstaende;
 * dieses Modul liest oder schreibt ihn nicht.
 *
 * Status: introduced -> practicing -> partially_mastered -> mastered
 *
 * mastered nur wenn ALLE gelten:
 *   - rezeptive Evidenz  (listening ODER reading)
 *   - produktive Evidenz (speaking  ODER writing)
 *   - >= 2 unterschiedliche Aktivitaetstypen erfolgreich
 * Eine einzelne bestandene Multiple-Choice-Aufgabe genuegt nie.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else { root.SCHULWEG_LEARN = root.SCHULWEG_LEARN || {}; root.SCHULWEG_LEARN.competency = api; }
})(typeof window !== "undefined" ? window : global, function () {
  "use strict";

  var FERTIGKEITEN = ["listening", "reading", "speaking", "writing"];
  var REZEPTIV = ["listening", "reading"];
  var PRODUKTIV = ["speaking", "writing"];
  var MIN_AKTIVITAETSTYPEN = 2;

  function leererStand(competencyId) {
    var bySkill = {};
    FERTIGKEITEN.forEach(function (f) {
      bySkill[f] = { versuche: 0, erfolge: 0, letzteAm: null };
    });
    return {
      competencyId: competencyId,
      status: "introduced",
      bySkill: bySkill,
      aktivitaetstypen: [],   // erfolgreich abgeschlossene, eindeutige Typen
      vokabelIds: [],         // nur Referenz auf den SRS - keine Kopie von Staenden
      updatedAt: null
    };
  }

  function hatEvidenz(stand, gruppe) {
    return gruppe.some(function (f) { return stand.bySkill[f] && stand.bySkill[f].erfolge > 0; });
  }

  function berechneStatus(stand) {
    var rezeptiv = hatEvidenz(stand, REZEPTIV);
    var produktiv = hatEvidenz(stand, PRODUKTIV);
    var genugTypen = stand.aktivitaetstypen.length >= MIN_AKTIVITAETSTYPEN;

    if (rezeptiv && produktiv && genugTypen) return "mastered";
    if (rezeptiv || produktiv) {
      // teilweise beherrscht, sobald eine Seite belegt ist und ueberhaupt
      // schon mehr als ein Versuch stattfand
      return (rezeptiv && produktiv) || genugTypen ? "partially_mastered" : "practicing";
    }
    var versuche = FERTIGKEITEN.reduce(function (s, f) { return s + stand.bySkill[f].versuche; }, 0);
    return versuche > 0 ? "practicing" : "introduced";
  }

  /**
   * Verbucht das Ergebnis EINER Aktivitaet.
   * @param {object|null} standVorher
   * @param {string} competencyId
   * @param {object} ergebnis { skill, activityType, correct, heute }
   */
  function verbucheAktivitaet(standVorher, competencyId, ergebnis) {
    var stand = standVorher
      ? JSON.parse(JSON.stringify(standVorher))
      : leererStand(competencyId);

    if (FERTIGKEITEN.indexOf(ergebnis.skill) === -1) {
      return { stand: stand, angewendet: false, grund: "unbekannteFertigkeit" };
    }

    var s = stand.bySkill[ergebnis.skill];
    s.versuche += 1;
    if (ergebnis.correct) {
      s.erfolge += 1;
      s.letzteAm = ergebnis.heute || null;
      if (ergebnis.activityType && stand.aktivitaetstypen.indexOf(ergebnis.activityType) === -1) {
        stand.aktivitaetstypen.push(ergebnis.activityType);
      }
    }
    stand.updatedAt = ergebnis.heute || null;
    stand.status = berechneStatus(stand);
    return { stand: stand, angewendet: true };
  }

  /** Anzeige-Zusammenfassung pro Fertigkeit (fuer die UI). */
  function fertigkeitsUebersicht(stand) {
    return FERTIGKEITEN.map(function (f) {
      var s = stand.bySkill[f];
      return { skill: f, erfolge: s.erfolge, versuche: s.versuche, sitzt: s.erfolge > 0 };
    });
  }

  return {
    FERTIGKEITEN: FERTIGKEITEN,
    REZEPTIV: REZEPTIV,
    PRODUKTIV: PRODUKTIV,
    MIN_AKTIVITAETSTYPEN: MIN_AKTIVITAETSTYPEN,
    leererStand: leererStand,
    berechneStatus: berechneStatus,
    verbucheAktivitaet: verbucheAktivitaet,
    fertigkeitsUebersicht: fertigkeitsUebersicht
  };
});
