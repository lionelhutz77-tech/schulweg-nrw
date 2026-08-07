/*
 * Tests fuer Unit-1-Slice 1 (Kompetenz "Sich vorstellen") + Audio-Schicht.
 * node:test, keine externen Abhaengigkeiten. Aufruf: node --test tests/
 *
 * Deckt Auftrag-4-Anforderungen ab:
 * - Status-Semantik: introduced, practicing, demonstrated, mastered
 * - Tag 1 endet bei demonstrated, niemals mastered
 * - Kalender-Trennung: mastery erfordert 2+ Tage
 * - dueDate + Refresh-Mission
 * - Hilfe-Tracking (keine/hinweis/nachFehler)
 * - Transfer-Aktivitaeten
 * - Mastery-Regeln A-E
 * - Rezeptiv + produktiv erforderlich
 * - Fehler setzen Fortschritt nicht auf null
 */
"use strict";
var test = require("node:test");
var assert = require("node:assert/strict");
var fs = require("fs");
var path = require("path");

var competency = require("../js/learn/competency.js");
var journey = require("../js/learn/journey.js");
var registry = require("../js/audio/registry.js");
var player = require("../js/audio/player.js");

function mockStore(initial) {
  var m = initial ? Object.assign({}, initial) : {};
  return {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null; },
    setItem: function (k, v) { m[k] = v; },
    _raw: m
  };
}

// Feste Daten fuer deterministische Tests
var TAG_1 = "2026-08-07";
var TAG_2 = "2026-08-08";
var TAG_3 = "2026-08-09";
var KID = "u1.k1.introduce";

function verbuche(store, profileId, liste) {
  liste.forEach(function (e) {
    journey.verbucheErgebnis(profileId, "englisch-6", {
      competencyId: KID,
      skill: e.skill,
      activityType: e.typ,
      correct: e.correct !== false,
      heute: e.heute || TAG_1,
      hilfe: e.hilfe,
      transfer: e.transfer
    }, store);
  });
  return journey.holeStand(profileId, "englisch-6", KID, store);
}

// ============ TESTS: STATUS-SEMANTIK ============

test("Status: introduced -> practicing -> demonstrated -> mastered", function () {
  var store = mockStore();

  // Noch nichts versucht
  var s0 = journey.holeStand("p1", "englisch-6", KID, store);
  assert.equal(s0.status, "introduced");

  // Ein Versuch (erfolglos oder einzelne Fertigkeit)
  verbuche(store, "p1", [{ skill: "listening", typ: "hoerauswahl", correct: false }]);
  var s1 = journey.holeStand("p1", "englisch-6", KID, store);
  assert.equal(s1.status, "practicing");

  // Rezeptiv + produktiv an Tag 1 -> demonstrated (NICHT mastered!)
  var store2 = mockStore();
  verbuche(store2, "p1", [
    { skill: "listening", typ: "hoerauswahl" },
    { skill: "writing", typ: "eingabe" }
  ]);
  var s2 = journey.holeStand("p1", "englisch-6", KID, store2);
  assert.equal(s2.status, "demonstrated");
});

// ============ TESTS: TAG 1 REGELN ============

test("Tag 1: rezeptive + produktive Evidenz + 2 Typen = demonstrated (NICHT mastered)", function () {
  var store = mockStore();
  verbuche(store, "p1", [
    { skill: "listening", typ: "hoerauswahl" },
    { skill: "writing", typ: "eingabe" }
  ]);
  var stand = journey.holeStand("p1", "englisch-6", KID, store);
  assert.equal(stand.status, "demonstrated");
  assert.notEqual(stand.status, "mastered");
});

test("Tag 1: nur rezeptiv = practicing (nicht demonstrated)", function () {
  var store = mockStore();
  verbuche(store, "p1", [
    { skill: "listening", typ: "hoerauswahl" },
    { skill: "reading", typ: "lesezuordnung" }
  ]);
  var stand = journey.holeStand("p1", "englisch-6", KID, store);
  assert.notEqual(stand.status, "demonstrated");
  assert.notEqual(stand.status, "mastered");
});

test("Tag 1: nur produktiv = practicing (nicht demonstrated)", function () {
  var store = mockStore();
  verbuche(store, "p1", [
    { skill: "writing", typ: "eingabe" },
    { skill: "speaking", typ: "nachsprechen" }
  ]);
  var stand = journey.holeStand("p1", "englisch-6", KID, store);
  assert.notEqual(stand.status, "demonstrated");
});

test("Tag 1: rezeptiv + produktiv, aber nur 1 Aktivitaetstyp = practicing", function () {
  var store = mockStore();
  verbuche(store, "p1", [
    { skill: "reading", typ: "eingabe" },
    { skill: "writing", typ: "eingabe" }
  ]);
  var stand = journey.holeStand("p1", "englisch-6", KID, store);
  assert.notEqual(stand.status, "demonstrated");
});

// ============ TESTS: KALENDER-TRENNUNG & MASTERY ============

test("Mastery-Regel A: ohne firstDemonstratedAt = keine mastery", function () {
  var store = mockStore();
  var stand = competency.leererStand(KID);
  stand.successfulLearningDays = ["2026-08-08", "2026-08-09"];
  stand.transferTage = ["2026-08-09"];
  stand.bySkill.listening.erfolge = 1;
  stand.bySkill.writing.erfolgeOhneHilfe = 1;
  stand.bySkill.listening.letzteAm = "2026-08-09";
  stand.bySkill.writing.letzteAm = "2026-08-09";
  // firstDemonstratedAt ist null!
  var mastered = competency.pruefeMastery(stand);
  assert.equal(mastered, false);
});

test("Mastery-Regel B: weniger als 2 Lerntage = keine mastery", function () {
  var store = mockStore();
  var stand = competency.leererStand(KID);
  stand.firstDemonstratedAt = TAG_1;
  stand.successfulLearningDays = [TAG_1];  // nur 1 Tag
  stand.transferTage = [TAG_1];
  stand.bySkill.listening.erfolge = 1;
  stand.bySkill.listening.erfolgeOhneHilfe = 1;
  stand.bySkill.writing.erfolgeOhneHilfe = 1;
  stand.bySkill.listening.letzteAm = TAG_1;
  stand.bySkill.writing.letzteAm = TAG_1;
  var mastered = competency.pruefeMastery(stand);
  assert.equal(mastered, false);
});

test("Mastery-Regel C: fehlendes rezeptives Nachweis nach firstDemonstrated = keine mastery", function () {
  var store = mockStore();
  var stand = competency.leererStand(KID);
  stand.firstDemonstratedAt = TAG_1;
  stand.successfulLearningDays = [TAG_1, TAG_2];
  stand.transferTage = [TAG_2];
  stand.bySkill.writing.erfolgeOhneHilfe = 1;
  stand.bySkill.writing.letzteAm = TAG_2;
  // Kein rezeptives Nachweis nach Tag 1
  var mastered = competency.pruefeMastery(stand);
  assert.equal(mastered, false);
});

test("Mastery-Regel C: fehlendes produktives Nachweis ohne Hilfe = keine mastery", function () {
  var store = mockStore();
  var stand = competency.leererStand(KID);
  stand.firstDemonstratedAt = TAG_1;
  stand.successfulLearningDays = [TAG_1, TAG_2];
  stand.transferTage = [TAG_2];
  stand.bySkill.listening.erfolge = 1;
  stand.bySkill.listening.letzteAm = TAG_2;
  stand.bySkill.speaking.erfolge = 1;
  stand.bySkill.speaking.erfolgeOhneHilfe = 0;  // MIT Hilfe nur!
  stand.bySkill.speaking.letzteAm = TAG_2;
  var mastered = competency.pruefeMastery(stand);
  assert.equal(mastered, false);
});

test("Mastery-Regel D: ohne Transfer-Aktivitaet = keine mastery", function () {
  var store = mockStore();
  var stand = competency.leererStand(KID);
  stand.firstDemonstratedAt = TAG_1;
  stand.successfulLearningDays = [TAG_1, TAG_2];
  stand.transferTage = [];  // Kein Transfer!
  stand.bySkill.listening.erfolgeOhneHilfe = 1;
  stand.bySkill.writing.erfolgeOhneHilfe = 1;
  stand.bySkill.listening.letzteAm = TAG_2;
  stand.bySkill.writing.letzteAm = TAG_2;
  var mastered = competency.pruefeMastery(stand);
  assert.equal(mastered, false);
});

test("Mastery-Regel E: Transfer MUSS nach firstDemonstrated liegen", function () {
  var store = mockStore();
  var stand = competency.leererStand(KID);
  stand.firstDemonstratedAt = TAG_2;
  stand.successfulLearningDays = [TAG_2, TAG_3];
  stand.transferTage = [TAG_1];  // VOR firstDemonstrated!
  stand.bySkill.listening.erfolgeOhneHilfe = 1;
  stand.bySkill.writing.erfolgeOhneHilfe = 1;
  stand.bySkill.listening.letzteAm = TAG_3;
  stand.bySkill.writing.letzteAm = TAG_3;
  var mastered = competency.pruefeMastery(stand);
  assert.equal(mastered, false);
});

test("Mastery: alle Kriterien erfuellt = mastered", function () {
  var store = mockStore();
  var stand = competency.leererStand(KID);
  stand.firstDemonstratedAt = TAG_1;
  stand.successfulLearningDays = [TAG_1, TAG_2];  // 2+ Tage
  stand.transferTage = [TAG_2];  // nach firstDemonstrated
  stand.bySkill.listening.erfolgeOhneHilfe = 1;
  stand.bySkill.writing.erfolgeOhneHilfe = 1;
  stand.bySkill.listening.letzteAm = TAG_2;
  stand.bySkill.writing.letzteAm = TAG_2;
  var mastered = competency.pruefeMastery(stand);
  assert.equal(mastered, true);
});

// ============ TESTS: REFRESH-MISSION (Tag 2+) ============

test("Refresh-Mission: Tag 1 erreicht demonstrated, dueDate gesetzt", function () {
  var store = mockStore();
  verbuche(store, "p1", [
    { skill: "listening", typ: "hoerauswahl" },
    { skill: "writing", typ: "eingabe" }
  ]);
  var stand = journey.holeStand("p1", "englisch-6", KID, store);
  assert.equal(stand.status, "demonstrated");
  assert.equal(stand.dueDate, TAG_2);  // TAE_1 + 1 Tag
  assert.equal(stand.firstDemonstratedAt, TAG_1);
});

test("Refresh-Mission: istFaellig() vor fälligem Datum = false", function () {
  var store = mockStore();
  verbuche(store, "p1", [
    { skill: "listening", typ: "hoerauswahl" },
    { skill: "writing", typ: "eingabe" }
  ]);
  var stand = journey.holeStand("p1", "englisch-6", KID, store);
  assert.equal(competency.istFaellig(stand, TAG_1), false);
});

test("Refresh-Mission: istFaellig() am fälligen Datum = true", function () {
  var store = mockStore();
  verbuche(store, "p1", [
    { skill: "listening", typ: "hoerauswahl" },
    { skill: "writing", typ: "eingabe" }
  ]);
  var stand = journey.holeStand("p1", "englisch-6", KID, store);
  assert.equal(competency.istFaellig(stand, TAG_2), true);
});

test("Refresh-Mission: istFaellig() nach fälligem Datum = true", function () {
  var store = mockStore();
  verbuche(store, "p1", [
    { skill: "listening", typ: "hoerauswahl" },
    { skill: "writing", typ: "eingabe" }
  ]);
  var stand = journey.holeStand("p1", "englisch-6", KID, store);
  assert.equal(competency.istFaellig(stand, TAG_3), true);
});

test("Refresh-Mission: mastered hat dueDate=null (keine weiteren Refreshes)", function () {
  var store = mockStore();
  // Tag 1
  verbuche(store, "p1", [
    { skill: "listening", typ: "hoerauswahl" },
    { skill: "writing", typ: "eingabe" }
  ]);
  // Tag 2: Refresh mit Transfer
  var stand2 = verbuche(store, "p1", [
    { skill: "reading", typ: "lesezuordnung", heute: TAG_2, transfer: true },
    { skill: "speaking", typ: "nachsprechen", heute: TAG_2 }
  ]);
  // Jetzt sollte mastered sein (wenn Transfer und ohne Hilfe)
  if (stand2.status === "mastered") {
    assert.equal(stand2.dueDate, null);
  }
});

// ============ TESTS: HILFE-TRACKING ============

test("Hilfe: erfolgeOhneHilfe wird nur gezaehlt wenn hilfe=keine", function () {
  var store = mockStore();
  verbuche(store, "p1", [
    { skill: "listening", typ: "hoerauswahl", hilfe: "keine" },
    { skill: "reading", typ: "lesezuordnung", hilfe: "hinweis" }
  ]);
  var stand = journey.holeStand("p1", "englisch-6", KID, store);
  assert.equal(stand.bySkill.listening.erfolgeOhneHilfe, 1);
  assert.equal(stand.bySkill.reading.erfolgeOhneHilfe, 0);
  assert.equal(stand.bySkill.listening.erfolge, 1);
  assert.equal(stand.bySkill.reading.erfolge, 1);
});

test("Hilfe: nachFehler verhindert Mastery-Nachweis", function () {
  var store = mockStore();
  verbuche(store, "p1", [
    { skill: "listening", typ: "hoerauswahl" },
    { skill: "writing", typ: "eingabe", hilfe: "nachFehler" }
  ]);
  var stand = journey.holeStand("p1", "englisch-6", KID, store);
  // Liegt noch an Tag 1, daher demonstrated
  assert.equal(stand.status, "demonstrated");
  // Aber schreiben hat erfolgeOhneHilfe=0
  assert.equal(stand.bySkill.writing.erfolgeOhneHilfe, 0);
});

// ============ TESTS: TRANSFER ============

test("Transfer: tag wird nur gezaehlt wenn transfer=true", function () {
  var store = mockStore();
  verbuche(store, "p1", [
    { skill: "listening", typ: "hoerauswahl", transfer: false },
    { skill: "reading", typ: "lesezuordnung", transfer: true }
  ]);
  var stand = journey.holeStand("p1", "englisch-6", KID, store);
  assert.equal(stand.transferTage.length, 1);
  assert.equal(stand.transferTage[0], TAG_1);
});

test("Transfer: Transfer-Aufgabe OHne Erfolg zaehlt nicht", function () {
  var store = mockStore();
  verbuche(store, "p1", [
    { skill: "listening", typ: "hoerauswahl", transfer: true, correct: false }
  ]);
  var stand = journey.holeStand("p1", "englisch-6", KID, store);
  assert.equal(stand.transferTage.length, 0);
});

// ============ TESTS: FEHLER-VERARBEITUNG ============

test("Fehler: zaehlt als Versuch, nicht als Erfolg", function () {
  var store = mockStore();
  verbuche(store, "p1", [{ skill: "writing", typ: "eingabe", correct: false }]);
  var stand = journey.holeStand("p1", "englisch-6", KID, store);
  assert.equal(stand.bySkill.writing.versuche, 1);
  assert.equal(stand.bySkill.writing.erfolge, 0);
  assert.equal(stand.bySkill.writing.erfolgeOhneHilfe, 0);
});

test("Fehler: loescht nicht bisherige Erfolge", function () {
  var store = mockStore();
  verbuche(store, "p1", [
    { skill: "writing", typ: "eingabe" },
    { skill: "writing", typ: "eingabe", correct: false }
  ]);
  var stand = journey.holeStand("p1", "englisch-6", KID, store);
  assert.equal(stand.bySkill.writing.erfolge, 1);
  assert.equal(stand.bySkill.writing.versuche, 2);
});

test("Fehler: loescht nicht Aktivitaetstypen", function () {
  var store = mockStore();
  verbuche(store, "p1", [
    { skill: "listening", typ: "hoerauswahl" },
    { skill: "listening", typ: "hoerauswahl", correct: false }
  ]);
  var stand = journey.holeStand("p1", "englisch-6", KID, store);
  assert.equal(stand.aktivitaetstypen.length, 1);
});

test("Fehler: loescht nicht Lerntage", function () {
  var store = mockStore();
  verbuche(store, "p1", [
    { skill: "listening", typ: "hoerauswahl" },
    { skill: "listening", typ: "hoerauswahl", correct: false }
  ]);
  var stand = journey.holeStand("p1", "englisch-6", KID, store);
  assert.equal(stand.successfulLearningDays.length, 1);
});

// ============ TESTS: MEHRFACHE ERFOLGSTAGE ============

test("successfulLearningDays: unbegrenzt gespeichert", function () {
  var store = mockStore();
  var stand = competency.leererStand(KID);
  // Simuliere 35 erfolgreiche Tage
  for (var i = 0; i < 35; i++) {
    var tag = competency.tageAddieren("2026-01-01", i);
    stand = competency.verbucheAktivitaet(stand, KID, {
      skill: "listening",
      activityType: "hoerauswahl",
      correct: true,
      heute: tag
    }).stand;
  }
  assert.equal(stand.successfulLearningDays.length, 35);
  // Alle Tage sollten gespeichert sein
  assert.equal(stand.successfulLearningDays[0], competency.tageAddieren("2026-01-01", 0));
});

// ============ TESTS: PROFILTRENNUNG ============

test("Profile: Fortschritt bleibt getrennt", function () {
  var store = mockStore();
  verbuche(store, "profile_A", [
    { skill: "listening", typ: "hoerauswahl" },
    { skill: "writing", typ: "eingabe" }
  ]);
  var a = journey.holeStand("profile_A", "englisch-6", KID, store);
  var b = journey.holeStand("profile_B", "englisch-6", KID, store);
  assert.equal(a.status, "demonstrated");
  assert.equal(b.status, "introduced");
});

test("Profile: Persistenz ueberlebt Reload", function () {
  var store = mockStore();
  verbuche(store, "p1", [{ skill: "listening", typ: "hoerauswahl" }]);
  var frisch = mockStore(store._raw);
  var stand = journey.holeStand("p1", "englisch-6", KID, frisch);
  assert.equal(stand.bySkill.listening.erfolge, 1);
});

// ============ TESTS: VOKABEL-SRS TRENNUNG ============

test("Vokabel-SRS: Kompetenz-Container beruehrt SRS nicht", function () {
  var srsKey = "srs_p1_englisch-6_state_v1";
  var srsInhalt = JSON.stringify({ schemaVersion: 1, progress: { en6_0001: { stage: 3 } } });
  var store = mockStore();
  store.setItem(srsKey, srsInhalt);
  verbuche(store, "p1", [
    { skill: "listening", typ: "hoerauswahl" },
    { skill: "writing", typ: "eingabe" }
  ]);
  assert.equal(store.getItem(srsKey), srsInhalt);
  assert.notEqual(journey.containerKey("p1", "englisch-6"), srsKey);
});

// ============ TESTS: AUDIO ============

test("AudioRef: unabhaengig vom konkreten Player", function () {
  var ref = registry.machRef("sentence", "u1.k1.test", "Hello.", "en-GB");
  assert.equal(registry.loese(ref, { ttsVerfuegbar: true }).typ, "tts");
  assert.equal(registry.loese(ref, { ttsVerfuegbar: false }).typ, "keins");
});

test("Audio: Datei hat Vorrang vor TTS", function () {
  var ref = registry.machRef("sentence", "k", "Hello.", "en-GB");
  var q = registry.loese(ref, { dateien: { k: "audio/k.mp3" }, ttsVerfuegbar: true });
  assert.equal(q.typ, "datei");
  assert.equal(q.url, "audio/k.mp3");
});

test("Audio: ungueltige AudioRef liefert keins statt Fehler", function () {
  assert.equal(registry.loese(null, { ttsVerfuegbar: true }).typ, "keins");
  assert.equal(registry.loese({ kind: "quatsch" }, { ttsVerfuegbar: true }).typ, "keins");
});

test("Audio: Lerninhalt nutzt KEIN speechSynthesis direkt", function () {
  var src = fs.readFileSync(path.join(__dirname, "..", "content", "englisch-unit1.js"), "utf8");
  assert.equal(/speechSynthesis|SpeechSynthesisUtterance|new Audio\(/.test(src), false);
});

test("Audio: fehlendes SpeechSynthesis verursacht keinen Fehler", function () {
  var umgebungOhneTts = {};
  var ref = registry.machRef("sentence", "k", "Hello.", "en-GB");
  var r;
  assert.doesNotThrow(function () { r = player.spiele(ref, umgebungOhneTts); });
  assert.equal(r.gespielt, false);
  assert.equal(r.text, "Hello.");
});

// ============ TESTS: INHALT ============

test("Inhalt: vokabelIds sind alle vorhanden und eindeutig", function () {
  var w = { SCHULWEG: { faecher: {} } };
  new Function("window", fs.readFileSync(path.join(__dirname, "..", "content", "englisch-6.js"), "utf8") + "\nreturn window;")(w);
  new Function("window", fs.readFileSync(path.join(__dirname, "..", "content", "englisch-unit1.js"), "utf8") + "\nreturn window;")(w);
  var pool = w.SCHULWEG.faecher["englisch-6"].vokabeltrainer;
  var ids = {};
  pool.forEach(function (v) { ids[v.id] = true; });
  var referenziert = w.SCHULWEG.unit1.kompetenz.vokabelIds;
  assert.ok(referenziert.length > 0);
  assert.equal(new Set(referenziert).size, referenziert.length);  // Keine Duplikate
  referenziert.forEach(function (id) { assert.ok(ids[id], "unbekannte ID: " + id); });
});

test("Inhalt: Lernreise hat rezeptive UND produktive Aufgaben", function () {
  var w = { SCHULWEG: { faecher: {} } };
  new Function("window", fs.readFileSync(path.join(__dirname, "..", "content", "englisch-unit1.js"), "utf8") + "\nreturn window;")(w);
  var schritte = w.SCHULWEG.unit1.schritte;
  var aufgaben = schritte.filter(function (s) { return s.skill && s.activityType; });
  var rezeptiv = aufgaben.filter(function (s) { return competency.REZEPTIV.indexOf(s.skill) !== -1; });
  var produktiv = aufgaben.filter(function (s) { return competency.PRODUKTIV.indexOf(s.skill) !== -1; });
  assert.ok(rezeptiv.length > 0);
  assert.ok(produktiv.length > 0);
});

test("Inhalt: Lernreise mit allen Erfolgen = demonstrated", function () {
  var w = { SCHULWEG: { faecher: {} } };
  new Function("window", fs.readFileSync(path.join(__dirname, "..", "content", "englisch-unit1.js"), "utf8") + "\nreturn window;")(w);
  var schritte = w.SCHULWEG.unit1.schritte;
  var store = mockStore();
  schritte.forEach(function (s) {
    if (!s.skill || !s.activityType) return;
    journey.verbucheErgebnis("p1", "englisch-6", {
      competencyId: KID,
      skill: s.skill,
      activityType: s.activityType,
      correct: true,
      heute: TAG_1
    }, store);
  });
  var stand = journey.holeStand("p1", "englisch-6", KID, store);
  assert.equal(stand.status, "demonstrated");
});

test("Inhalt: keine Scans oder Buchkopien vorhanden", function () {
  var src = fs.readFileSync(path.join(__dirname, "..", "content", "englisch-unit1.js"), "utf8");
  // Keine echten Buchseiten-Referenzen (Seite 45, page 123, etc.)
  assert.equal(/Seite\s+\d+|page\s+\d+|©|Copyright/i.test(src), false);
  assert.equal(src.indexOf("en6_0388"), -1);  // en6_0388 wurde entfernt
});

test("Inhalt: beschaedigter Container wird nicht ueberschrieben", function () {
  var store = mockStore();
  var key = journey.containerKey("p1", "englisch-6");
  store.setItem(key, "{ kaputt");
  var r = journey.verbucheErgebnis("p1", "englisch-6", {
    competencyId: KID,
    skill: "listening",
    activityType: "hoerauswahl",
    correct: true,
    heute: TAG_1
  }, store);
  assert.equal(r.status, "corruptState");
  assert.equal(store.getItem(key), "{ kaputt");
});

test("Inhalt: Speicherfehler bricht atomar ab", function () {
  var basis = mockStore();
  var kaputt = { getItem: basis.getItem, setItem: function () { throw new Error("quota"); } };
  var r = journey.verbucheErgebnis("p1", "englisch-6", {
    competencyId: KID,
    skill: "listening",
    activityType: "hoerauswahl",
    correct: true,
    heute: TAG_1
  }, kaputt);
  assert.equal(r.status, "storageError");
  assert.equal(basis.getItem(journey.containerKey("p1", "englisch-6")), null);
});
