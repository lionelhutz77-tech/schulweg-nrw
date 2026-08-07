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
 * Status:
 *   introduced   erstmals gesehen
 *   practicing   wird geuebt
 *   demonstrated in der aktuellen Lernphase erfolgreich gezeigt
 *   mastered     ueber zeitlich getrennte Abrufe UND Transfer bestaetigt
 *
 * Kernaussage der Regeln: Beherrschung entsteht NICHT innerhalb einer Sitzung.
 *
 * Datumsarithmetik ist hier bewusst lokal (wenige Zeilen) statt aus js/vocab/
 * importiert - eine Kompetenz soll nicht an das Vokabelmodul gekoppelt sein.
 * `heute` wird immer injiziert; nie new Date() in der Logik.
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
  var MIN_LERNTAGE_FUER_MASTERED = 2;
  var TAGE_BIS_ERSTE_WIEDERHOLUNG = 1;   // fruehestens am naechsten Kalendertag
  var MAX_EVIDENCE_EVENTS = 100;  // Technische Speicherbegrenzung für Detailhistorie

  // Hilfe-Arten (fuer spaetere adaptive Hilfen bereits im Modell vorgesehen)
  var HILFE_KEINE = "keine";
  var HILFE_HINWEIS = "hinweis";
  var HILFE_NACH_FEHLER = "nachFehler";

  function tageAddieren(isoDatum, tage) {
    var d = new Date(isoDatum + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + tage);
    return d.toISOString().slice(0, 10);
  }

  function leererStand(competencyId) {
    var bySkill = {};
    FERTIGKEITEN.forEach(function (f) {
      bySkill[f] = { versuche: 0, erfolge: 0, erfolgeOhneHilfe: 0, letzteAm: null, letzteSacilieOhneHilfeAm: null };
    });
    return {
      competencyId: competencyId,
      status: "introduced",
      bySkill: bySkill,
      aktivitaetstypen: [],          // eindeutige Typen mit Erfolg
      successfulLearningDays: [],    // eindeutige Kalendertage mit Erfolg (begrenzt)
      transferTage: [],              // Kalendertage mit erfolgreicher Transferaufgabe
      firstDemonstratedAt: null,
      lastEvidenceAt: null,
      dueDate: null,
      vokabelIds: [],                // nur Referenz auf den SRS - keine Kopie von Staenden
      updatedAt: null
    };
  }

  function hatEvidenz(stand, gruppe, nurOhneHilfe) {
    return gruppe.some(function (f) {
      var s = stand.bySkill[f];
      return s && (nurOhneHilfe ? s.erfolgeOhneHilfe > 0 : s.erfolge > 0);
    });
  }

  /** Evidenz, die AUSSCHLIESSLICH an oder nach einem Stichtag entstand. */
  function tageNach(liste, stichtag) {
    return liste.filter(function (t) { return stichtag ? t > stichtag : true; });
  }

  /**
   * Mastery-Regel (bewusst klein und nachvollziehbar, keine Scores):
   *   A war zuvor demonstrated
   *   B Erfolge an >= 2 unterschiedlichen Kalendertagen
   *   C erneut rezeptive UND produktive Leistung (nach dem ersten Nachweis)
   *   D die spaetere Leistung enthaelt mindestens eine Transferaktivitaet
   *   E die entscheidende produktive Antwort ohne Hilfe
   */
  function pruefeMastery(stand) {
    if (!stand.firstDemonstratedAt) return false;                                  // A
    if (stand.successfulLearningDays.length < MIN_LERNTAGE_FUER_MASTERED) return false; // B

    var spaetereTage = tageNach(stand.successfulLearningDays, stand.firstDemonstratedAt);
    if (!spaetereTage.length) return false;                                        // B (echte Trennung)

    var rezeptivSpaeter = REZEPTIV.some(function (f) {
      var s = stand.bySkill[f];
      return s.letzteAm && s.letzteAm > stand.firstDemonstratedAt;
    });
    // E: die AKTUELLE (letzte) produktive Antwort MUSS ohne Hilfe sein
    var produktivAktuelOhneHilfe = PRODUKTIV.some(function (f) {
      var s = stand.bySkill[f];
      // letzteAm === letzteSacilieOhneHilfeAm bedeutet: die neueste Antwort war ohne Hilfe
      return s.letzteAm && s.letzteSacilieOhneHilfeAm === s.letzteAm && s.letzteAm >= stand.firstDemonstratedAt;
    });
    if (!rezeptivSpaeter || !produktivAktuelOhneHilfe) return false;              // C + E

    var transferSpaeter = tageNach(stand.transferTage, stand.firstDemonstratedAt);
    if (!transferSpaeter.length) return false;                                     // D

    return true;
  }

  /** demonstrated: erste Lernphase erfolgreich gezeigt - noch NICHT beherrscht. */
  function pruefeDemonstrated(stand) {
    return hatEvidenz(stand, REZEPTIV) &&
      hatEvidenz(stand, PRODUKTIV) &&
      stand.aktivitaetstypen.length >= MIN_AKTIVITAETSTYPEN;
  }

  function berechneStatus(stand) {
    if (pruefeMastery(stand)) return "mastered";
    if (stand.firstDemonstratedAt || pruefeDemonstrated(stand)) return "demonstrated";
    var versuche = FERTIGKEITEN.reduce(function (s, f) { return s + stand.bySkill[f].versuche; }, 0);
    return versuche > 0 ? "practicing" : "introduced";
  }

  function ergaenzeEindeutig(liste, wert) {
    if (wert == null || liste.indexOf(wert) !== -1) return liste;
    return liste.concat([wert]);
  }

  /**
   * Verbucht das Ergebnis EINER Aktivitaet.
   * @param {object|null} standVorher
   * @param {string} competencyId
   * @param {object} e { skill, activityType, correct, heute,
   *                     hilfe?: "keine"|"hinweis"|"nachFehler",
   *                     transfer?: boolean }
   */
  function verbucheAktivitaet(standVorher, competencyId, e) {
    var stand = standVorher ? JSON.parse(JSON.stringify(standVorher)) : leererStand(competencyId);

    // Rueckwaertskompatibel: aeltere Staende ohne die neuen Felder ergaenzen
    FERTIGKEITEN.forEach(function (f) {
      if (!stand.bySkill[f]) stand.bySkill[f] = { versuche: 0, erfolge: 0, erfolgeOhneHilfe: 0, letzteAm: null };
      if (typeof stand.bySkill[f].erfolgeOhneHilfe !== "number") stand.bySkill[f].erfolgeOhneHilfe = 0;
    });
    if (!stand.successfulLearningDays) stand.successfulLearningDays = [];
    if (!stand.transferTage) stand.transferTage = [];

    if (FERTIGKEITEN.indexOf(e.skill) === -1) {
      return { stand: stand, angewendet: false, grund: "unbekannteFertigkeit" };
    }

    var hilfe = e.hilfe || HILFE_KEINE;
    var s = stand.bySkill[e.skill];
    s.versuche += 1;

    if (e.correct) {
      s.erfolge += 1;
      if (hilfe === HILFE_KEINE) {
        s.erfolgeOhneHilfe += 1;
        s.letzteSacilieOhneHilfeAm = e.heute || null;  // Nur bei "ohne Hilfe" aktualisieren
      }
      s.letzteAm = e.heute || null;
      stand.aktivitaetstypen = ergaenzeEindeutig(stand.aktivitaetstypen, e.activityType);
      stand.successfulLearningDays = ergaenzeEindeutig(stand.successfulLearningDays, e.heute);
      if (e.transfer) stand.transferTage = ergaenzeEindeutig(stand.transferTage, e.heute);
      stand.lastEvidenceAt = e.heute || stand.lastEvidenceAt;
    }
    // Ein Fehler zaehlt als Versuch - er loescht NIE bestehende Erfolge,
    // Lerntage, Transfer oder firstDemonstratedAt.

    stand.updatedAt = e.heute || null;

    var vorherDemonstrated = !!stand.firstDemonstratedAt;
    stand.status = berechneStatus(stand);

    if (!vorherDemonstrated && (stand.status === "demonstrated" || stand.status === "mastered")) {
      stand.firstDemonstratedAt = e.heute || null;
      // erste Wiederholung fruehestens am naechsten Kalendertag
      stand.dueDate = e.heute ? tageAddieren(e.heute, TAGE_BIS_ERSTE_WIEDERHOLUNG) : null;
      stand.status = berechneStatus(stand);   // Mastery kann jetzt noch nicht greifen
    } else if (stand.status === "mastered") {
      stand.dueDate = null;                   // Langzeit-Review ist spaetere Arbeit
    }

    return { stand: stand, angewendet: true };
  }

  /** Ist die Kompetenz heute zur Wiederholung faellig? */
  function istFaellig(stand, heute) {
    if (!stand || !stand.dueDate) return false;
    if (stand.status === "mastered") return false;
    return stand.dueDate <= heute;
  }

  /** Anzeige-Zusammenfassung pro Fertigkeit (fuer die UI). */
  function fertigkeitsUebersicht(stand) {
    return FERTIGKEITEN.map(function (f) {
      var s = stand.bySkill[f] || { versuche: 0, erfolge: 0, erfolgeOhneHilfe: 0 };
      return { skill: f, erfolge: s.erfolge, versuche: s.versuche, sitzt: s.erfolge > 0 };
    });
  }

  return {
    FERTIGKEITEN: FERTIGKEITEN,
    REZEPTIV: REZEPTIV,
    PRODUKTIV: PRODUKTIV,
    MIN_AKTIVITAETSTYPEN: MIN_AKTIVITAETSTYPEN,
    MIN_LERNTAGE_FUER_MASTERED: MIN_LERNTAGE_FUER_MASTERED,
    TAGE_BIS_ERSTE_WIEDERHOLUNG: TAGE_BIS_ERSTE_WIEDERHOLUNG,
    HILFE_KEINE: HILFE_KEINE,
    HILFE_HINWEIS: HILFE_HINWEIS,
    HILFE_NACH_FEHLER: HILFE_NACH_FEHLER,
    tageAddieren: tageAddieren,
    leererStand: leererStand,
    berechneStatus: berechneStatus,
    pruefeDemonstrated: pruefeDemonstrated,
    pruefeMastery: pruefeMastery,
    verbucheAktivitaet: verbucheAktivitaet,
    istFaellig: istFaellig,
    fertigkeitsUebersicht: fertigkeitsUebersicht
  };
});
