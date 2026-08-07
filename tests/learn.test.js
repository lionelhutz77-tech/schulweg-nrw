/*
 * Tests fuer Unit-1-Slice 1 (Kompetenz "Sich vorstellen") + Audio-Schicht.
 * node:test, keine externen Abhaengigkeiten. Aufruf: node --test tests/
 *
 * Deckt die Anforderungen A-H des Auftrags ab (Nummerierung im Testnamen).
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
var HEUTE = "2026-08-07";
var KID = "u1.k1.introduce";

function verbuche(store, profileId, liste) {
  liste.forEach(function (e) {
    journey.verbucheErgebnis(profileId, "englisch-6", {
      competencyId: KID, skill: e.skill, activityType: e.typ,
      correct: e.correct !== false, heute: e.heute || HEUTE
    }, store);
  });
  return journey.holeStand(profileId, "englisch-6", KID, store);
}

// ---------- A ----------
test("A1: eine einzelne rezeptive Aufgabe fuehrt NICHT zu mastered", function () {
  var store = mockStore();
  var stand = verbuche(store, "p1", [{ skill: "listening", typ: "hoerauswahl" }]);
  assert.notEqual(stand.status, "mastered");
});

test("A2: auch mehrere rezeptive Aufgaben allein fuehren nicht zu mastered", function () {
  var store = mockStore();
  var stand = verbuche(store, "p1", [
    { skill: "listening", typ: "hoerauswahl" },
    { skill: "reading", typ: "lesezuordnung" },
    { skill: "listening", typ: "hoerauswahl" }
  ]);
  assert.notEqual(stand.status, "mastered");
  assert.equal(stand.status, "partially_mastered");
});

test("A3: mehrere produktive Aufgaben allein fuehren nicht zu mastered", function () {
  var store = mockStore();
  var stand = verbuche(store, "p1", [
    { skill: "writing", typ: "eingabe" },
    { skill: "speaking", typ: "nachsprechen" }
  ]);
  assert.notEqual(stand.status, "mastered");
});

// ---------- B ----------
test("B: rezeptive UND produktive Evidenz mit 2 Aktivitaetstypen fuehrt zu mastered", function () {
  var store = mockStore();
  var stand = verbuche(store, "p1", [
    { skill: "listening", typ: "hoerauswahl" },
    { skill: "writing", typ: "eingabe" }
  ]);
  assert.equal(stand.status, "mastered");
});

// ---------- C ----------
test("C: zwei unterschiedliche Aktivitaetstypen sind erforderlich (gleicher Typ genuegt nicht)", function () {
  var store = mockStore();
  // rezeptiv + produktiv, aber BEIDE ueber denselben Aktivitaetstyp
  var stand = verbuche(store, "p1", [
    { skill: "reading", typ: "eingabe" },
    { skill: "writing", typ: "eingabe" }
  ]);
  assert.equal(stand.aktivitaetstypen.length, 1);
  assert.notEqual(stand.status, "mastered");
  // zweiter Typ ergaenzt -> jetzt mastered
  var stand2 = verbuche(store, "p1", [{ skill: "listening", typ: "hoerauswahl" }]);
  assert.equal(stand2.status, "mastered");
});

// ---------- D ----------
test("D: Fortschritt verschiedener Profile bleibt getrennt", function () {
  var store = mockStore();
  verbuche(store, "profile_A", [
    { skill: "listening", typ: "hoerauswahl" },
    { skill: "writing", typ: "eingabe" }
  ]);
  var a = journey.holeStand("profile_A", "englisch-6", KID, store);
  var b = journey.holeStand("profile_B", "englisch-6", KID, store);
  assert.equal(a.status, "mastered");
  assert.equal(b.status, "introduced");
  assert.notEqual(journey.containerKey("profile_A", "englisch-6"), journey.containerKey("profile_B", "englisch-6"));
});

test("D2: Persistenz ueberlebt Reload (neuer Storage-Lesevorgang)", function () {
  var store = mockStore();
  verbuche(store, "p1", [{ skill: "listening", typ: "hoerauswahl" }]);
  var frisch = mockStore(store._raw);          // simuliert Seiten-Reload
  var stand = journey.holeStand("p1", "englisch-6", KID, frisch);
  assert.equal(stand.bySkill.listening.erfolge, 1);
});

test("D3: Journey-Position wird gemerkt und wiederhergestellt", function () {
  var store = mockStore();
  journey.merkePosition("p1", "englisch-6", KID, 5, store);
  assert.equal(journey.holePosition("p1", "englisch-6", KID, store), 5);
  assert.equal(journey.holePosition("p2", "englisch-6", KID, store), 0);
});

// ---------- E ----------
test("E: der Vokabel-SRS-Container wird durch Kompetenzfortschritt nicht beruehrt", function () {
  var srsKey = "srs_p1_englisch-6_state_v1";
  var srsInhalt = JSON.stringify({ schemaVersion: 1, progress: { en6_0001: { stage: 3 } } });
  var store = mockStore();
  store.setItem(srsKey, srsInhalt);
  verbuche(store, "p1", [
    { skill: "listening", typ: "hoerauswahl" },
    { skill: "writing", typ: "eingabe" }
  ]);
  assert.equal(store.getItem(srsKey), srsInhalt);                       // unveraendert
  assert.ok(store.getItem(journey.containerKey("p1", "englisch-6")));    // eigener Key
  assert.notEqual(journey.containerKey("p1", "englisch-6"), srsKey);
});

test("E2: Kompetenz nutzt KEINEN SRS-stage-Wert als Beherrschungsstatus", function () {
  var stand = competency.leererStand(KID);
  assert.equal(stand.stage, undefined);
  assert.ok(stand.bySkill.listening && stand.bySkill.writing);
  assert.equal(stand.status, "introduced");
});

// ---------- F ----------
test("F1: AudioRef ist unabhaengig vom konkreten Player (reine Aufloesung)", function () {
  var ref = registry.machRef("sentence", "u1.k1.test", "Hello.", "en-GB");
  assert.equal(registry.loese(ref, { ttsVerfuegbar: true }).typ, "tts");
  assert.equal(registry.loese(ref, { ttsVerfuegbar: false }).typ, "keins");
  assert.equal(registry.loese(ref, { dateien: { "u1.k1.test": "audio/x.mp3" } }).typ, "datei");
});

test("F2: Datei hat Vorrang vor TTS", function () {
  var ref = registry.machRef("sentence", "k", "Hello.", "en-GB");
  var q = registry.loese(ref, { dateien: { k: "audio/k.mp3" }, ttsVerfuegbar: true });
  assert.equal(q.typ, "datei");
  assert.equal(q.url, "audio/k.mp3");
});

test("F3: ungueltige AudioRef liefert 'keins' statt zu werfen", function () {
  assert.equal(registry.loese(null, { ttsVerfuegbar: true }).typ, "keins");
  assert.equal(registry.loese({ kind: "quatsch", key: "k", lang: "en" }, { ttsVerfuegbar: true }).typ, "keins");
});

test("F4: Lerninhalt referenziert Audio ausschliesslich ueber AudioRefs", function () {
  var src = fs.readFileSync(path.join(__dirname, "..", "content", "englisch-unit1.js"), "utf8");
  assert.equal(/speechSynthesis|SpeechSynthesisUtterance|new Audio\(/.test(src), false);
  var learnSrc = fs.readFileSync(path.join(__dirname, "..", "js", "learn", "ui.js"), "utf8");
  assert.equal(/speechSynthesis|SpeechSynthesisUtterance|new Audio\(/.test(learnSrc), false);
});

// ---------- G ----------
test("G1: fehlendes SpeechSynthesis verursacht keinen Fehler", function () {
  var umgebungOhneTts = {};                       // kein speechSynthesis
  var ref = registry.machRef("sentence", "k", "Hello.", "en-GB");
  var r;
  assert.doesNotThrow(function () { r = player.spiele(ref, umgebungOhneTts); });
  assert.equal(r.gespielt, false);
  assert.equal(r.text, "Hello.");                 // Text-Fallback bleibt nutzbar
  assert.equal(player.ttsVerfuegbar(umgebungOhneTts), false);
  assert.doesNotThrow(function () { player.stoppe(umgebungOhneTts); });
});

test("G2: werfende Sprachsynthese wird abgefangen", function () {
  var kaputt = {
    speechSynthesis: { cancel: function () {}, speak: function () { throw new Error("boom"); } },
    SpeechSynthesisUtterance: function () { return {}; }
  };
  var r;
  assert.doesNotThrow(function () { r = player.spiele(registry.machRef("sentence", "k", "Hi.", "en-GB"), kaputt); });
  assert.equal(r.gespielt, false);
});

test("G3: funktionierende Sprachsynthese wird genutzt", function () {
  var gesprochen = [];
  var ok = {
    speechSynthesis: { cancel: function () {}, speak: function (u) { gesprochen.push(u.text); } },
    SpeechSynthesisUtterance: function (t) { this.text = t; }
  };
  var r = player.spiele(registry.machRef("sentence", "k", "Hello Sam.", "en-GB"), ok);
  assert.equal(r.gespielt, true);
  assert.deepEqual(gesprochen, ["Hello Sam."]);
});

// ---------- Inhaltliche Absicherung des Slice ----------
test("I1: Lerninhalt referenziert nur bestehende Vokabel-IDs (keine Duplikate)", function () {
  var w = { SCHULWEG: { faecher: {} } };
  new Function("window", fs.readFileSync(path.join(__dirname, "..", "content", "englisch-6.js"), "utf8") + "\nreturn window;")(w);
  new Function("window", fs.readFileSync(path.join(__dirname, "..", "content", "englisch-unit1.js"), "utf8") + "\nreturn window;")(w);
  var pool = w.SCHULWEG.faecher["englisch-6"].vokabeltrainer;
  var ids = {};
  pool.forEach(function (v) { ids[v.id] = true; });
  var referenziert = w.SCHULWEG.unit1.kompetenz.vokabelIds;
  assert.ok(referenziert.length > 0);
  referenziert.forEach(function (id) { assert.ok(ids[id], "unbekannte Vokabel-ID: " + id); });
});

test("I2: jede Aufgabe der Lernreise hat Fertigkeit und Aktivitaetstyp", function () {
  var w = { SCHULWEG: { faecher: {} } };
  new Function("window", fs.readFileSync(path.join(__dirname, "..", "content", "englisch-unit1.js"), "utf8") + "\nreturn window;")(w);
  var schritte = w.SCHULWEG.unit1.schritte;
  var aufgaben = schritte.filter(function (s) { return s.art === "aufgabe" || s.art === "dialog"; });
  assert.ok(aufgaben.length >= 6);
  aufgaben.forEach(function (s) {
    assert.ok(competency.FERTIGKEITEN.indexOf(s.skill) !== -1, "ungueltige Fertigkeit bei " + s.id);
    assert.ok(s.activityType, "kein activityType bei " + s.id);
  });
});

test("I3: die Lernreise enthaelt rezeptive UND produktive Aufgaben (mastered erreichbar)", function () {
  var w = { SCHULWEG: { faecher: {} } };
  new Function("window", fs.readFileSync(path.join(__dirname, "..", "content", "englisch-unit1.js"), "utf8") + "\nreturn window;")(w);
  var schritte = w.SCHULWEG.unit1.schritte;
  var store = mockStore();
  schritte.forEach(function (s) {
    if (!s.skill || !s.activityType) return;
    journey.verbucheErgebnis("p1", "englisch-6", {
      competencyId: KID, skill: s.skill, activityType: s.activityType, correct: true, heute: HEUTE
    }, store);
  });
  var stand = journey.holeStand("p1", "englisch-6", KID, store);
  assert.equal(stand.status, "mastered");
});

test("I4: beschaedigter Kompetenz-Container wird nicht ueberschrieben", function () {
  var store = mockStore();
  var key = journey.containerKey("p1", "englisch-6");
  store.setItem(key, "{ kaputt");
  var r = journey.verbucheErgebnis("p1", "englisch-6", {
    competencyId: KID, skill: "listening", activityType: "hoerauswahl", correct: true, heute: HEUTE
  }, store);
  assert.equal(r.status, "corruptState");
  assert.equal(store.getItem(key), "{ kaputt");
});

test("I5: Schreibfehler wird nicht als Fortschritt dargestellt", function () {
  var basis = mockStore();
  var kaputt = { getItem: basis.getItem, setItem: function () { throw new Error("quota"); } };
  var r = journey.verbucheErgebnis("p1", "englisch-6", {
    competencyId: KID, skill: "listening", activityType: "hoerauswahl", correct: true, heute: HEUTE
  }, kaputt);
  assert.equal(r.status, "storageError");
  assert.equal(basis.getItem(journey.containerKey("p1", "englisch-6")), null);
});

test("I6: falsche Antwort zaehlt als Versuch, aber nicht als Erfolg", function () {
  var store = mockStore();
  var stand = verbuche(store, "p1", [{ skill: "writing", typ: "eingabe", correct: false }]);
  assert.equal(stand.bySkill.writing.versuche, 1);
  assert.equal(stand.bySkill.writing.erfolge, 0);
  assert.equal(stand.status, "practicing");
  assert.equal(stand.aktivitaetstypen.length, 0);
});
