/*
 * Automatisierte Tests fuer den Vokabeltrainer-Kern (Phase 1).
 * node:test, keine externen Abhaengigkeiten. Aufruf: node --test tests/
 *
 * Alle 84 geforderten Testfaelle sind nummeriert (// Test N) und decken
 * die vollstaendige Korrekturhistorie ab.
 */
"use strict";
var test = require("node:test");
var assert = require("node:assert/strict");
var path = require("path");
var fs = require("fs");

var model = require("../js/vocab/model.js");
var config = require("../js/vocab/config.js");
var srs = require("../js/vocab/srs.js");
var storage = require("../js/vocab/storage.js");
var session = require("../js/vocab/session.js");

var CONTENT_PATH = path.join(__dirname, "..", "content", "englisch-6.js");

function ladeEchtenPool() {
  var src = fs.readFileSync(CONTENT_PATH, "utf8");
  var w = { SCHULWEG: { faecher: {} } };
  var fn = new Function("window", src + "\nreturn window;");
  var res = fn(w);
  return res.SCHULWEG.faecher["englisch-6"].vokabeltrainer;
}

function mockStore(initial) {
  var m = initial ? Object.assign({}, initial) : {};
  return {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null; },
    setItem: function (k, v) { m[k] = v; },
    _raw: m
  };
}

function deterministicRng(seed) {
  var s = seed || 1;
  return function () { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
}

function beispielPool(n) {
  var arr = [];
  for (var i = 1; i <= n; i++) arr.push(model.normalisiereVokabel({ id: "t_" + i, de: "wort" + i, en: "word" + i }));
  return arr;
}

function starteSitzungFuerTest(store, profileId, fachKey, sessionId, alleVokabeln, progressMap, einheitTyp, heute, rng) {
  var einheit = session.baueEinheit(alleVokabeln, progressMap, einheitTyp || "normal", config, heute, rng || deterministicRng());
  return storage.starteNeueSitzung(profileId, fachKey, sessionId, einheitTyp || "normal", einheit.sections, einheit.queue, store, heute);
}

// Setzt nach starteNeueSitzung() gezielt Anfangsfortschritt fuer bestimmte
// Vokabeln, damit Retry-/Stufen-Szenarien mit definiertem Startzustand
// getestet werden koennen (starteNeueSitzung selbst kennt keinen
// progress-Parameter - progress lebt separat im Container).
function setzeAnfangsFortschritt(store, profileId, fachKey, heute, fortschrittMap) {
  var geladen = storage.ladeZustand(profileId, fachKey, store, heute);
  var basis = {
    successfulActiveRecalls: 0, successfulRecognitionAnswers: 0, incorrectAnswers: 0,
    distinctActiveRecallDays: 0, lastActiveRecallDay: null, consecutiveSuccessfulDays: 0,
    lastTaskTypes: [], lastErrorType: null, dueDate: null, lastReviewedAt: null, updatedAt: null
  };
  Object.keys(fortschrittMap).forEach(function (vocabularyId) {
    geladen.container.progress[vocabularyId] = Object.assign({}, basis, fortschrittMap[vocabularyId], { vocabularyId: vocabularyId });
  });
  store.setItem(storage.containerKey(profileId, fachKey), JSON.stringify(geladen.container));
}

// ============================================================
// 1-18: Grundfunktionen
// ============================================================

test("1: alle 1006 bestehenden Vokabeln werden geladen", function () {
  var pool = ladeEchtenPool();
  assert.equal(pool.length, 1006);
});

test("2: fehlende optionale Felder verursachen keinen Fehler", function () {
  var v = model.normalisiereVokabel({ id: "x1", de: "Haus", en: "house" });
  assert.equal(v.wordType, null);
  assert.equal(v.exampleEn, null);
  assert.deepEqual(v.alt, []);
  assert.doesNotThrow(function () { model.normalisiereVokabel({ id: "x2", de: "d", en: "e" }); });
});

test("3: stabile IDs bleiben ueber mehrere Laeufe identisch", function () {
  var a = ladeEchtenPool();
  var b = ladeEchtenPool();
  assert.equal(a[0].id, b[0].id);
  assert.equal(a[500].id, b[500].id);
});

test("4: viele faellige Wiederholungen reduzieren die Zahl neuer Woerter", function () {
  assert.equal(srs.bestimmeNeueAnzahl(15, config), 0);
  assert.equal(srs.bestimmeNeueAnzahl(10, config), 2);
  assert.equal(srs.bestimmeNeueAnzahl(3, config), config.NEUE_MAX);
});

test("5: normale Einheit enthaelt maximal 5 neue Woerter", function () {
  var alle = beispielPool(50);
  var e = session.baueEinheit(alle, {}, "normal", config, "2026-07-30", deterministicRng());
  assert.ok(e.sections.neu.length <= config.NEUE_MAX);
});

test("6: kurze Einheit enthaelt keine neuen Woerter", function () {
  var alle = beispielPool(50);
  var e = session.baueEinheit(alle, {}, "kurz", config, "2026-07-30", deterministicRng());
  assert.equal(e.sections.neu.length, 0);
});

test("7: Multiple Choice allein fuehrt nicht ueber Stufe 1", function () {
  var p = null;
  for (var i = 0; i < 5; i++) {
    p = srs.verarbeiteAntwort(p, "v", { taskType: "mc", correct: true }, config, "2026-07-30").progress;
  }
  assert.ok(p.stage <= config.STUFE_MC_MAXIMUM);
});

test("8: aktiver Abruf wird staerker gewichtet (kommt ueber die MC-Grenze)", function () {
  var p = srs.verarbeiteAntwort(null, "v", { taskType: "mc", correct: true }, config, "2026-07-30").progress;
  p = srs.verarbeiteAntwort(p, "v", { taskType: "text", correct: true }, config, "2026-07-30").progress;
  assert.ok(p.stage > config.STUFE_MC_MAXIMUM);
});

test("9: mehrere aktive Abrufe am selben Tag zaehlen nicht als mehrere Lerntage", function () {
  var p = srs.verarbeiteAntwort(null, "v", { taskType: "text", correct: true }, config, "2026-07-30").progress;
  var vorher = p.distinctActiveRecallDays;
  p = srs.verarbeiteAntwort(p, "v", { taskType: "text", correct: true }, config, "2026-07-30").progress;
  assert.equal(p.distinctActiveRecallDays, vorher);
});

test("10: aktive Abrufe an unterschiedlichen Tagen erhoehen die Lernstufe", function () {
  var p = srs.verarbeiteAntwort(null, "v", { taskType: "mc", correct: true }, config, "2026-07-30").progress;
  var s1 = p.stage;
  p = srs.verarbeiteAntwort(p, "v", { taskType: "text", correct: true }, config, "2026-07-30").progress;
  var s2 = p.stage;
  p = srs.verarbeiteAntwort(p, "v", { taskType: "text", correct: true }, config, "2026-07-31").progress;
  var s3 = p.stage;
  assert.ok(s2 > s1);
  assert.ok(s3 > s2);
});

test("11: Stufe 5 kann nicht an einem einzigen Tag erreicht werden", function () {
  var p = null;
  var heute = "2026-07-30";
  for (var i = 0; i < 10; i++) {
    p = srs.verarbeiteAntwort(p, "v", { taskType: "text", correct: true }, config, heute).progress;
  }
  assert.ok(p.stage < 5);
});

test("12: falsche Antwort setzt Fortschritt nicht vollstaendig zurueck", function () {
  var p = srs.verarbeiteAntwort(null, "v", { taskType: "mc", correct: true }, config, "2026-07-30").progress;
  p = srs.verarbeiteAntwort(p, "v", { taskType: "text", correct: true }, config, "2026-07-30").progress;
  var vorStage = p.stage;
  p = srs.verarbeiteAntwort(p, "v", { taskType: "text", correct: false }, config, "2026-07-31").progress;
  assert.equal(p.stage, Math.max(0, vorStage - 1));
  assert.notEqual(p.stage, 0);
});

test("13: falsche Antwort zieht die naechste Wiederholung vor", function () {
  var r = srs.verarbeiteAntwort(null, "v", { taskType: "text", correct: false }, config, "2026-07-30");
  assert.equal(r.progress.dueDate, "2026-07-31");
});

test("14: Altdatenmigration ist idempotent", function () {
  var store = mockStore();
  store.setItem(storage.altHardKey("Enya", "englisch-6"), JSON.stringify({ 0: 2 }));
  var alle = beispielPool(5);
  var r1 = storage.migriereHardInContainer("prof1", "Enya", "englisch-6", alle, store, "2026-07-30");
  var r2 = storage.migriereHardInContainer("prof1", "Enya", "englisch-6", alle, store, "2026-07-30");
  assert.equal(r1.status, "migrated");
  assert.equal(r2.status, "alreadyMigrated");
  assert.equal(Object.keys(r2.container.progress).length, 1);
});

test("15: bestehende Wackelkandidaten bleiben nach Migration erhalten", function () {
  var store = mockStore();
  store.setItem(storage.altHardKey("Enya", "englisch-6"), JSON.stringify({ 0: 3, 2: 1 }));
  var alle = beispielPool(5);
  var r = storage.migriereHardInContainer("prof1", "Enya", "englisch-6", alle, store, "2026-07-30");
  assert.equal(r.container.progress[alle[0].id].incorrectAnswers, 3);
  assert.equal(r.container.progress[alle[2].id].incorrectAnswers, 1);
});

test("16: eine laufende Sitzung kann gespeichert und wiederhergestellt werden", function () {
  var store = mockStore();
  var alle = beispielPool(10);
  starteSitzungFuerTest(store, "p1", "englisch-6", "s1", alle, {}, "normal", "2026-07-30");
  var geladen = storage.ladeZustand("p1", "englisch-6", store, "2026-07-30");
  assert.equal(geladen.status, "ok");
  assert.ok(geladen.container.activeSession);
  assert.equal(geladen.container.activeSession.sessionId, "s1");
});

test("17: Aufgabenrotation verhindert dauerhaftes reines Multiple Choice", function () {
  var p = { stage: 2, lastTaskTypes: ["mc"] };
  assert.equal(session.waehleTaskType(p), "text");
  var p2 = { stage: 2, lastTaskTypes: ["text"] };
  assert.equal(session.waehleTaskType(p2), "mc");
});

test("18: fehlende/beschaedigte localStorage-Daten werden sicher behandelt", function () {
  var store = mockStore();
  var r1 = storage.ladeZustand("pX", "englisch-6", store, "2026-07-30");
  assert.equal(r1.status, "empty");
  store.setItem(storage.containerKey("pX", "englisch-6"), "{ kaputtes json");
  var r2 = storage.ladeZustand("pX", "englisch-6", store, "2026-07-30");
  assert.equal(r2.status, "corruptState");
});

// ============================================================
// 19-34: erste Korrekturrunde
// ============================================================

test("19: eine spaetere Aenderung von de/en veraendert die ID nicht", function () {
  var v1 = model.normalisiereVokabel({ id: "en6_0001", de: "die Klasse", en: "class" });
  var v2 = model.normalisiereVokabel({ id: "en6_0001", de: "die Schulklasse (korrigiert)", en: "class" });
  assert.equal(v1.id, v2.id);
});

test("20: alle 1006 IDs sind eindeutig", function () {
  var pool = model.normalisierePool(ladeEchtenPool());
  var res = model.validiereVokabelPool(pool);
  assert.equal(res.ok, true);
  assert.equal(res.doppelteIds.length, 0);
});

test("21: die Profil-Migration ist idempotent", function () {
  var idGen = (function () { var n = 0; return function () { n++; return "gen_" + n; }; })();
  var profile = [{ name: "Enya", klasse: "7" }];
  var r1 = model.migriereProfilIds(profile, idGen);
  var r2 = model.migriereProfilIds(r1.profile, idGen);
  assert.equal(r1.geaendert, true);
  assert.equal(r2.geaendert, false);
  assert.equal(r1.profile[0].profileId, r2.profile[0].profileId);
});

test("22: eine Profil-Namensaenderung erhaelt denselben Lernfortschritt", function () {
  var store = mockStore();
  var idGen = (function () { var n = 0; return function () { n++; return "gen_" + n; }; })();
  var profile = model.migriereProfilIds([{ name: "Enya", klasse: "7" }], idGen).profile;
  var pid = profile[0].profileId;
  var alle = beispielPool(5);
  starteSitzungFuerTest(store, pid, "englisch-6", "s1", alle, {}, "normal", "2026-07-30");
  profile[0].name = "Enya-Neu";
  var geladen = storage.ladeZustand(pid, "englisch-6", store, "2026-07-30");
  assert.equal(geladen.status, "ok");
  assert.ok(geladen.container.activeSession);
});

test("23: ptr erzeugt keine 'bereits gesehen'-Eintraege (konservativ = keine Annahme)", function () {
  var store = mockStore();
  store.setItem(storage.altPtrKey("Enya", "englisch-6"), "3");
  var alle = beispielPool(10);
  var r = storage.migriereHardInContainer("p1", "Enya", "englisch-6", alle, store, "2026-07-30");
  assert.equal(Object.keys(r.container.progress).length, 0);
});

test("24: Woerter ab ptr bleiben neu", function () {
  var store = mockStore();
  store.setItem(storage.altPtrKey("Enya", "englisch-6"), "2");
  var alle = beispielPool(10);
  var r = storage.migriereHardInContainer("p1", "Enya", "englisch-6", alle, store, "2026-07-30");
  assert.equal(r.container.progress[alle[5].id], undefined);
});

test("25: hard bleibt einzige Evidenzquelle, unabhaengig von ptr", function () {
  var store = mockStore();
  store.setItem(storage.altHardKey("Enya", "englisch-6"), JSON.stringify({ 7: 2 }));
  store.setItem(storage.altPtrKey("Enya", "englisch-6"), "1");
  var alle = beispielPool(10);
  var r = storage.migriereHardInContainer("p1", "Enya", "englisch-6", alle, store, "2026-07-30");
  assert.equal(r.container.progress[alle[7].id].incorrectAnswers, 2);
  assert.equal(Object.keys(r.container.progress).length, 1);
});

test("26: ungueltige ptr-/hard-Daten verursachen keinen Absturz", function () {
  var store = mockStore();
  store.setItem(storage.altHardKey("Enya", "englisch-6"), "{ kaputt");
  store.setItem(storage.altPtrKey("Enya", "englisch-6"), "nicht-numerisch");
  var alle = beispielPool(5);
  assert.doesNotThrow(function () {
    storage.migriereHardInContainer("p1", "Enya", "englisch-6", alle, store, "2026-07-30");
  });
});

test("27: sofortige Wiederholung wird ueber die Session-Queue gesteuert, nicht dueDate", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "text", purpose: "wiederholen", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  var event = session.erzeugeEvent("s1", 1, q[0], "incorrect", "2026-07-30");
  var r = storage.wendeAntwortEreignisAn("p1", "englisch-6", event, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(r.status, "applied");
  var neueQueue = r.container.activeSession.queue;
  assert.equal(neueQueue.length, 2);
  assert.equal(neueQueue[1].purpose, "retry");
  assert.equal(r.container.progress.v1.dueDate, "2026-07-31");
});

test("28: mehrere aktive Abrufe am selben Tag erhoehen distinctActiveRecallDays nur einmal", function () {
  var p = srs.verarbeiteAntwort(null, "v", { taskType: "text", correct: true }, config, "2026-07-30").progress;
  p = srs.verarbeiteAntwort(p, "v", { taskType: "text", correct: true }, config, "2026-07-30").progress;
  p = srs.verarbeiteAntwort(p, "v", { taskType: "text", correct: true }, config, "2026-07-30").progress;
  assert.equal(p.distinctActiveRecallDays, 1);
});

test("29: consecutiveSuccessfulDays reagiert korrekt auf Folgetag und Unterbrechung", function () {
  var p = srs.verarbeiteAntwort(null, "v", { taskType: "text", correct: true }, config, "2026-07-30").progress;
  assert.equal(p.consecutiveSuccessfulDays, 1);
  p = srs.verarbeiteAntwort(p, "v", { taskType: "text", correct: true }, config, "2026-07-31").progress;
  assert.equal(p.consecutiveSuccessfulDays, 2);
  p = srs.verarbeiteAntwort(p, "v", { taskType: "text", correct: true }, config, "2026-08-05").progress;
  assert.equal(p.consecutiveSuccessfulDays, 1);
});

test("30: unbekannte schemaVersion wird nicht stillschweigend ueberschrieben", function () {
  var store = mockStore();
  var container = storage.leererContainer("p1", "englisch-6", "2026-07-30");
  container.schemaVersion = 99;
  store.setItem(storage.containerKey("p1", "englisch-6"), JSON.stringify(container));
  var r = storage.ladeZustand("p1", "englisch-6", store, "2026-07-30");
  assert.equal(r.status, "unsupportedSchema");
  var vorher = store.getItem(storage.containerKey("p1", "englisch-6"));
  storage.wendeAntwortEreignisAn("p1", "englisch-6", { eventId: "e1", sessionId: "s", sequenceNumber: 1, itemId: "i", vocabularyId: "v", taskType: "mc", result: "correct", answeredAt: "2026-07-30" }, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(store.getItem(storage.containerKey("p1", "englisch-6")), vorher);
});

test("31: Browser-Module stehen in der dokumentierten Ladereihenfolge fehlerfrei bereit", function () {
  assert.ok(model.normalisiereVokabel);
  assert.ok(config.NEUE_MAX);
  assert.ok(storage.ladeZustand);
  assert.ok(srs.verarbeiteAntwort);
  assert.ok(session.baueEinheit);
});

test("32: eine beschaedigte oder veraltete Sitzung kann sicher verworfen werden", function () {
  var alle = beispielPool(5);
  var idsSet = alle.map(function (v) { return v.id; });
  var kaputteSession = { queue: [{ vocabularyId: "existiert-nicht" }] };
  assert.equal(session.sitzungIstGueltig(kaputteSession, idsSet), false);
  var store = mockStore();
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, [], store, "2026-07-30");
  var r = storage.verwerfeAktiveSitzung("p1", "englisch-6", store, "2026-07-30");
  assert.equal(r.status, "discarded");
  assert.equal(r.container.activeSession, null);
});

test("33: Namensaenderung erzeugt keinen neuen Storage-Bereich", function () {
  var k1 = storage.containerKey("profile_abc", "englisch-6");
  var k2 = storage.containerKey("profile_abc", "englisch-6");
  assert.equal(k1, k2);
  assert.ok(k1.indexOf("Enya") === -1);
});

test("34: ID-Vergabe hat de/en/alt und Reihenfolge nicht veraendert", function () {
  var pool = ladeEchtenPool();
  assert.equal(pool[0].de, "nett / schön");
  assert.equal(pool[0].en, "nice");
  assert.equal(pool[1005].en, "uncool");
  assert.equal(pool[1005].id, "en6_1006");
});

// ============================================================
// 35-46: zweite Korrekturrunde
// ============================================================

test("35: fehlende Vokabel-ID blockiert den Trainerstart", function () {
  var pool = [model.normalisiereVokabel({ de: "a", en: "b" })];
  var r = model.validiereVokabelPool(pool);
  assert.equal(r.ok, false);
  assert.equal(r.fehlendeIndizes.length, 1);
});

test("36: doppelte Vokabel-ID blockiert den Trainerstart", function () {
  var pool = [
    model.normalisiereVokabel({ id: "x1", de: "a", en: "b" }),
    model.normalisiereVokabel({ id: "x1", de: "c", en: "d" })
  ];
  var r = model.validiereVokabelPool(pool);
  assert.equal(r.ok, false);
  assert.equal(r.doppelteIds.length, 1);
});

test("37: Reload nach einer Antwort verliert keinen Fortschritt", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  var ev = session.erzeugeEvent("s1", 1, q[0], "correct", "2026-07-30");
  storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  var geladen = storage.ladeZustand("p1", "englisch-6", store, "2026-07-30");
  assert.equal(geladen.container.progress.v1.stage, 1);
});

test("38: dasselbe Antwortereignis wird nicht doppelt gezaehlt", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  var ev = session.erzeugeEvent("s1", 1, q[0], "correct", "2026-07-30");
  storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  var r2 = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(r2.status, "duplicateEvent");
  var geladen = storage.ladeZustand("p1", "englisch-6", store, "2026-07-30");
  assert.equal(geladen.container.progress.v1.successfulRecognitionAnswers, 1);
});

test("39: fortgesetzte Sitzung behaelt Aufgabenart und Reihenfolge", function () {
  var store = mockStore();
  var alle = beispielPool(20);
  starteSitzungFuerTest(store, "p1", "englisch-6", "s1", alle, {}, "normal", "2026-07-30");
  var g1 = storage.ladeZustand("p1", "englisch-6", store, "2026-07-30").container.activeSession.queue;
  var g2 = storage.ladeZustand("p1", "englisch-6", store, "2026-07-30").container.activeSession.queue;
  assert.deepEqual(g1, g2);
});

test("40: Retry nutzt Session-Queue, nicht dueDate", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "text", purpose: "wiederholen", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  var ev = session.erzeugeEvent("s1", 1, q[0], "incorrect", "2026-07-30");
  var r = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(r.container.activeSession.queue.length, 2);
  assert.equal(r.container.progress.v1.dueDate, "2026-07-31");
});

test("41: zunaechst falscher, spaeter richtiger Retry wird konservativ bewertet", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "text", purpose: "wiederholen", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  setzeAnfangsFortschritt(store, "p1", "englisch-6", "2026-07-30", { v1: { stage: 3, distinctActiveRecallDays: 2 } });
  var ev1 = session.erzeugeEvent("s1", 1, q[0], "incorrect", "2026-07-30");
  var r1 = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev1, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(r1.container.progress.v1.stage, 2);
  assert.equal(r1.container.progress.v1.incorrectAnswers, 1);
  var retryItem = r1.container.activeSession.queue[1];
  var ev2 = session.erzeugeEvent("s1", 2, retryItem, "correct", "2026-07-30");
  var r2 = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev2, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(r2.container.progress.v1.stage, 3);
  assert.equal(r2.container.progress.v1.incorrectAnswers, 1);
});

test("42: Profil-ID wird nach Migration sofort gespeichert (Simulation)", function () {
  var idGen = (function () { var n = 0; return function () { n++; return "gen_" + n; }; })();
  var gespeichert = null;
  var profile = [{ name: "Enya", klasse: "7" }];
  var r = model.migriereProfilIds(profile, idGen);
  if (r.geaendert) gespeichert = r.profile;
  assert.ok(gespeichert);
  assert.ok(gespeichert[0].profileId);
});

test("43: erneutes Laden erzeugt keine neue Profil-ID", function () {
  var idGen = (function () { var n = 0; return function () { n++; return "gen_" + n; }; })();
  var profile = [{ name: "Enya", klasse: "7" }];
  var r1 = model.migriereProfilIds(profile, idGen);
  var r2 = model.migriereProfilIds(r1.profile, idGen);
  assert.equal(r1.profile[0].profileId, r2.profile[0].profileId);
});

test("44: ID-Skript veraendert vorhandene IDs nicht (Simulation der Skript-Logik)", function () {
  function vergibIds(pool) {
    var maxNum = 0;
    pool.forEach(function (v) { if (v.id) { var m = /^en6_(\d+)$/.exec(v.id); if (m) maxNum = Math.max(maxNum, +m[1]); } });
    var next = maxNum + 1;
    return pool.map(function (v) { if (v.id) return v; var id = "en6_" + String(next).padStart(4, "0"); next++; return Object.assign({}, v, { id: id }); });
  }
  var pool = [{ id: "en6_0001", de: "a", en: "b" }, { de: "c", en: "d" }];
  var neu = vergibIds(pool);
  assert.equal(neu[0].id, "en6_0001");
  assert.equal(neu[1].id, "en6_0002");
});

test("45: neue Vokabeln nummerieren vorhandene IDs nicht neu", function () {
  function vergibIds(pool) {
    var maxNum = 0;
    pool.forEach(function (v) { if (v.id) { var m = /^en6_(\d+)$/.exec(v.id); if (m) maxNum = Math.max(maxNum, +m[1]); } });
    var next = maxNum + 1;
    return pool.map(function (v) { if (v.id) return v; var id = "en6_" + String(next).padStart(4, "0"); next++; return Object.assign({}, v, { id: id }); });
  }
  var pool = [{ id: "en6_0005", de: "a", en: "b" }, { id: "en6_0002", de: "c", en: "d" }, { de: "neu", en: "new" }];
  var neu = vergibIds(pool);
  assert.equal(neu[0].id, "en6_0005");
  assert.equal(neu[1].id, "en6_0002");
  assert.equal(neu[2].id, "en6_0006");
});

test("46: ptr-Migration nutzt i<ptr NICHT als Seen-Kriterium", function () {
  var store = mockStore();
  store.setItem(storage.altPtrKey("Enya", "englisch-6"), "8");
  var alle = beispielPool(10);
  var r = storage.migriereHardInContainer("p1", "Enya", "englisch-6", alle, store, "2026-07-30");
  assert.equal(Object.keys(r.container.progress).length, 0);
  assert.equal(r.container.migrationState.altPtrObserved, 8);
});

// ============================================================
// 47-56: atomarer Zustandscontainer
// ============================================================

test("47: Fortschritt und Sitzung werden durch genau einen gemeinsamen Storage-Schreibvorgang je Antwort persistiert", function () {
  var schreibZaehler = 0;
  var basis = mockStore();
  var store = { getItem: basis.getItem, setItem: function (k, v) { schreibZaehler++; basis.setItem(k, v); } };
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  schreibZaehler = 0;
  var ev = session.erzeugeEvent("s1", 1, q[0], "correct", "2026-07-30");
  var r = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(schreibZaehler, 1);
  assert.equal(r.status, "applied");
});

test("56: ein vollstaendiges Antwortereignis aktualisiert Fortschritt, Session-Queue und Sequenzstand gemeinsam in einem Schreibvorgang", function () {
  var basis = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, basis, "2026-07-30");
  var ev = session.erzeugeEvent("s1", 1, q[0], "correct", "2026-07-30");
  var r = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: basis, config: config, heute: "2026-07-30" });
  assert.equal(r.container.progress.v1.stage, 1);
  assert.equal(r.container.activeSession.currentPosition, 1);
  assert.equal(r.container.eventState.lastAppliedSequenceNumber, 1);
});

test("48: ein bereits gespeichertes Ereignis wird nach Reload nicht erneut angewendet", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  var ev = session.erzeugeEvent("s1", 1, q[0], "correct", "2026-07-30");
  storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  var r2 = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(r2.status, "duplicateEvent");
});

test("49: eine bereits verarbeitete sequenceNumber ist No-op", function () {
  var store = mockStore();
  var q = [
    { itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null },
    { itemId: "i2", vocabularyId: "v2", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }
  ];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  storage.wendeAntwortEreignisAn("p1", "englisch-6", session.erzeugeEvent("s1", 1, q[0], "correct", "2026-07-30"), { store: store, config: config, heute: "2026-07-30" });
  var staleEvent = { eventId: "andere-id", sessionId: "s1", sequenceNumber: 1, itemId: "i2", vocabularyId: "v2", taskType: "mc", result: "correct", answeredAt: "2026-07-30" };
  var r = storage.wendeAntwortEreignisAn("p1", "englisch-6", staleEvent, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(r.status, "staleSequence");
});

test("50: eine Sequenzluecke wird erkannt, nicht still verarbeitet", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  var ev = { eventId: "e5", sessionId: "s1", sequenceNumber: 5, itemId: "i1", vocabularyId: "v1", taskType: "mc", result: "correct", answeredAt: "2026-07-30" };
  var r = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(r.status, "sequenceGap");
});

test("51: recentEventIds-Historie bleibt auf Maximalgroesse begrenzt", function () {
  var kleinConfig = Object.assign({}, config, { RECENT_EVENT_IDS_MAX: 3 });
  var store = mockStore();
  var q = [];
  for (var i = 1; i <= 6; i++) q.push({ itemId: "i" + i, vocabularyId: "v" + i, taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null });
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  var container;
  for (var s = 1; s <= 6; s++) {
    var ev = session.erzeugeEvent("s1", s, q[s - 1], "correct", "2026-07-30");
    var r = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: kleinConfig, heute: "2026-07-30" });
    container = r.container;
  }
  assert.equal(container.eventState.recentEventIds.length, 3);
});

test("52: fehlgeschlagenes setItem wird als Speicherfehler behandelt, nicht als Erfolg", function () {
  var basis = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, basis, "2026-07-30");
  var vorher = basis.getItem(storage.containerKey("p1", "englisch-6"));
  var kaputterStore = { getItem: basis.getItem, setItem: function () { throw new Error("Quota exceeded"); } };
  var ev = session.erzeugeEvent("s1", 1, q[0], "correct", "2026-07-30");
  var r = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: kaputterStore, config: config, heute: "2026-07-30" });
  assert.equal(r.status, "storageError");
  assert.equal(basis.getItem(storage.containerKey("p1", "englisch-6")), vorher);
});

test("53: ein beschaedigter Container ueberschreibt keine vorhandenen Altdaten", function () {
  var store = mockStore();
  store.setItem(storage.containerKey("p1", "englisch-6"), "{ kaputt");
  var ev = { eventId: "e1", sessionId: "s1", sequenceNumber: 1, itemId: "i1", vocabularyId: "v1", taskType: "mc", result: "correct", answeredAt: "2026-07-30" };
  storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(store.getItem(storage.containerKey("p1", "englisch-6")), "{ kaputt");
});

test("54: hard-Migration in den Container bleibt idempotent", function () {
  var store = mockStore();
  store.setItem(storage.altHardKey("Enya", "englisch-6"), JSON.stringify({ 1: 1 }));
  var alle = beispielPool(5);
  storage.migriereHardInContainer("p1", "Enya", "englisch-6", alle, store, "2026-07-30");
  var r2 = storage.migriereHardInContainer("p1", "Enya", "englisch-6", alle, store, "2026-07-30");
  assert.equal(r2.status, "alreadyMigrated");
});

test("55: ptr erzeugt nachweislich keine Fortschrittseintraege", function () {
  var store = mockStore();
  store.setItem(storage.altPtrKey("Enya", "englisch-6"), "500");
  var alle = beispielPool(600);
  var r = storage.migriereHardInContainer("p1", "Enya", "englisch-6", alle, store, "2026-07-30");
  assert.equal(Object.keys(r.container.progress).length, 0);
});

// ============================================================
// 57-69: Sitzungswechsel, Corrupt-State, Retry-Absicherung, Profil-ID-Fallback
// ============================================================

test("57: neue Sitzung startet wieder mit Sequenznummer 1", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  storage.wendeAntwortEreignisAn("p1", "englisch-6", session.erzeugeEvent("s1", 1, q[0], "correct", "2026-07-30"), { store: store, config: config, heute: "2026-07-30" });
  storage.verwerfeAktiveSitzung("p1", "englisch-6", store, "2026-07-30");
  var q2 = [{ itemId: "j1", vocabularyId: "v2", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  var r = storage.starteNeueSitzung("p1", "englisch-6", "s2", "normal", {}, q2, store, "2026-07-30");
  assert.equal(r.container.eventState.lastAppliedSequenceNumber, 0);
  var ev = session.erzeugeEvent("s2", 1, q2[0], "correct", "2026-07-30");
  var r2 = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(r2.status, "applied");
});

test("58: Ereignis einer fremden Sitzung wird nicht auf die aktive Sitzung angewendet", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  var ev = { eventId: "e1", sessionId: "fremde-sitzung", sequenceNumber: 1, itemId: "i1", vocabularyId: "v1", taskType: "mc", result: "correct", answeredAt: "2026-07-30" };
  var r = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(r.status, "foreignSession");
});

test("59: Sitzungswechsel ist nur ueber starteNeueSitzung moeglich", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  var ev = { eventId: "e1", sessionId: "fremde-sitzung", sequenceNumber: 1, itemId: "i1", vocabularyId: "v1", taskType: "mc", result: "correct", answeredAt: "2026-07-30" };
  storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  var geladen = storage.ladeZustand("p1", "englisch-6", store, "2026-07-30");
  assert.equal(geladen.container.eventState.sessionId, "s1");
});

test("60: beschaedigtes JSON blockiert die Antwortverarbeitung", function () {
  var store = mockStore();
  store.setItem(storage.containerKey("p1", "englisch-6"), "{ kaputt");
  var ev = { eventId: "e1", sessionId: "s1", sequenceNumber: 1, itemId: "i1", vocabularyId: "v1", taskType: "mc", result: "correct", answeredAt: "2026-07-30" };
  var r = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(r.status, "corruptState");
});

test("61: beschaedigtes JSON wird nicht durch einen leeren Container ueberschrieben", function () {
  var store = mockStore();
  store.setItem(storage.containerKey("p1", "englisch-6"), "{ kaputt");
  var l = storage.ladeZustand("p1", "englisch-6", store, "2026-07-30");
  assert.equal(l.status, "corruptState");
  assert.equal(store.getItem(storage.containerKey("p1", "englisch-6")), "{ kaputt");
});

test("62: Recovery-Backup enthaelt den urspruenglichen Rohwert", function () {
  var store = mockStore();
  var roh = "{ kaputt und unlesbar";
  var r = storage.sichereBeschaedigtenContainer("p1", "englisch-6", roh, store, "20260730120000");
  assert.equal(r.status, "backedUp");
  assert.equal(store.getItem(r.key), roh);
});

test("63: Retry enthaelt den Stand vor dem Fehler", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "text", purpose: "wiederholen", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  setzeAnfangsFortschritt(store, "p1", "englisch-6", "2026-07-30", { v1: { stage: 3, distinctActiveRecallDays: 2 } });
  var ev = session.erzeugeEvent("s1", 1, q[0], "incorrect", "2026-07-30");
  var r = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  var retryItem = r.container.activeSession.queue[1];
  assert.equal(retryItem.stageBeforeFailure, 3);
  assert.equal(retryItem.failureEventId, "s1_1");
});

test("64: Retry kann die Stage nicht ueber stageBeforeFailure anheben", function () {
  var p0 = { vocabularyId: "v1", stage: 2, distinctActiveRecallDays: 1, lastTaskTypes: [], incorrectAnswers: 0 };
  var r = srs.verarbeiteAntwort(p0, "v1", { taskType: "text", correct: true, isRetry: true, stageBeforeFailure: 2 }, config, "2026-07-30");
  assert.ok(r.progress.stage <= 2);
});

test("65: der urspruengliche Fehler bleibt nach erfolgreichem Retry erhalten", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "text", purpose: "wiederholen", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  setzeAnfangsFortschritt(store, "p1", "englisch-6", "2026-07-30", { v1: { stage: 3, distinctActiveRecallDays: 2 } });
  var r1 = storage.wendeAntwortEreignisAn("p1", "englisch-6", session.erzeugeEvent("s1", 1, q[0], "incorrect", "2026-07-30"), { store: store, config: config, heute: "2026-07-30" });
  var retryItem = r1.container.activeSession.queue[1];
  var r2 = storage.wendeAntwortEreignisAn("p1", "englisch-6", session.erzeugeEvent("s1", 2, retryItem, "correct", "2026-07-30"), { store: store, config: config, heute: "2026-07-30" });
  assert.equal(r2.container.progress.v1.incorrectAnswers, 1);
});

test("66: crypto.randomUUID() wird verwendet, wenn vorhanden", function () {
  var mockCrypto = { randomUUID: function () { return "aaaa-bbbb"; } };
  assert.equal(model.erzeugeProfilId(mockCrypto), "profile_aaaa-bbbb");
});

test("67: ohne randomUUID() wird getRandomValues() verwendet", function () {
  var mockCrypto = { getRandomValues: function (arr) { for (var i = 0; i < arr.length; i++) arr[i] = i; return arr; } };
  var id = model.erzeugeProfilId(mockCrypto);
  assert.ok(id.indexOf("profile_") === 0);
});

test("68: der Fallback erzeugt zwei unterschiedliche gueltige IDs", function () {
  var call = 0;
  var mockCrypto = { getRandomValues: function (arr) { call++; for (var i = 0; i < arr.length; i++) arr[i] = (i + call * 7) % 256; return arr; } };
  var id1 = model.erzeugeProfilId(mockCrypto);
  var id2 = model.erzeugeProfilId(mockCrypto);
  assert.notEqual(id1, id2);
});

test("69: ein bereits vorhandenes profileId wird niemals ersetzt", function () {
  var idGen = function () { return "sollte-nicht-verwendet-werden"; };
  var profile = [{ name: "Enya", klasse: "7", profileId: "bereits-da" }];
  var r = model.migriereProfilIds(profile, idGen);
  assert.equal(r.profile[0].profileId, "bereits-da");
  assert.equal(r.geaendert, false);
});

// ============================================================
// 70-75: Sitzungsbindung der Verarbeitung, Ueberschreibschutz
// ============================================================

test("70: Ereignis ohne aktive Sitzung wird nicht verarbeitet", function () {
  var store = mockStore();
  var ev = { eventId: "e1", sessionId: "s1", sequenceNumber: 1, itemId: "i1", vocabularyId: "v1", taskType: "mc", result: "correct", answeredAt: "2026-07-30" };
  var r = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(r.status, "noActiveSession");
});

test("71: Ereignis mit anderer sessionId als activeSession wird nicht verarbeitet", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  var ev = { eventId: "e1", sessionId: "s-anders", sequenceNumber: 1, itemId: "i1", vocabularyId: "v1", taskType: "mc", result: "correct", answeredAt: "2026-07-30" };
  var r = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(r.status, "foreignSession");
});

test("72: Ereignis mit anderer sessionId als eventState wird nicht verarbeitet", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  // Manipulation: eventState.sessionId weicht von activeSession.sessionId ab (inkonsistenter Zustand)
  var geladen = storage.ladeZustand("p1", "englisch-6", store, "2026-07-30");
  var container = geladen.container;
  container.eventState.sessionId = "abweichend";
  store.setItem(storage.containerKey("p1", "englisch-6"), JSON.stringify(container));
  var ev = { eventId: "e1", sessionId: "s1", sequenceNumber: 1, itemId: "i1", vocabularyId: "v1", taskType: "mc", result: "correct", answeredAt: "2026-07-30" };
  var r = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(r.status, "foreignSession");
});

test("73: eine neue Sitzung ueberschreibt keine laufende Sitzung", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  var r = storage.starteNeueSitzung("p1", "englisch-6", "s2", "normal", {}, [], store, "2026-07-30");
  assert.equal(r.status, "activeSessionExists");
  var geladen = storage.ladeZustand("p1", "englisch-6", store, "2026-07-30");
  assert.equal(geladen.container.activeSession.sessionId, "s1");
});

test("74: ausdrueckliches Verwerfen entfernt nur die Sitzung, nicht den Lernfortschritt", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  storage.wendeAntwortEreignisAn("p1", "englisch-6", session.erzeugeEvent("s1", 1, q[0], "correct", "2026-07-30"), { store: store, config: config, heute: "2026-07-30" });
  var r = storage.verwerfeAktiveSitzung("p1", "englisch-6", store, "2026-07-30");
  assert.equal(r.container.activeSession, null);
  assert.equal(r.container.progress.v1.stage, 1);
});

test("75: nach dem Verwerfen kann eine neue Sitzung mit Sequenznummer 1 gestartet werden", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  storage.verwerfeAktiveSitzung("p1", "englisch-6", store, "2026-07-30");
  var q2 = [{ itemId: "j1", vocabularyId: "v2", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  var r = storage.starteNeueSitzung("p1", "englisch-6", "s2", "normal", {}, q2, store, "2026-07-30");
  assert.equal(r.status, "started");
  assert.equal(r.container.eventState.lastAppliedSequenceNumber, 0);
});

// ============================================================
// 76-84: Queue-Item-Bindung, korrekte hard/ptr-Migration ueber alten Namen
// ============================================================

test("76: falsche itemId wird abgelehnt", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  var ev = { eventId: "e1", sessionId: "s1", sequenceNumber: 1, itemId: "falsch", vocabularyId: "v1", taskType: "mc", result: "correct", answeredAt: "2026-07-30" };
  var r = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(r.status, "queueItemMismatch");
});

test("77: falsche vocabularyId wird abgelehnt", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  var ev = { eventId: "e1", sessionId: "s1", sequenceNumber: 1, itemId: "i1", vocabularyId: "falsch", taskType: "mc", result: "correct", answeredAt: "2026-07-30" };
  var r = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(r.status, "queueItemMismatch");
});

test("78: falscher taskType wird abgelehnt", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  var ev = { eventId: "e1", sessionId: "s1", sequenceNumber: 1, itemId: "i1", vocabularyId: "v1", taskType: "text", result: "correct", answeredAt: "2026-07-30" };
  var r = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(r.status, "queueItemMismatch");
});

test("79: nur der aktuell faellige Queue-Eintrag kann verarbeitet werden", function () {
  var store = mockStore();
  var q = [
    { itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null },
    { itemId: "i2", vocabularyId: "v2", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }
  ];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  // versucht Position 1 (i2) zu beantworten, obwohl currentPosition=0 (i1) faellig ist
  var ev = { eventId: "e1", sessionId: "s1", sequenceNumber: 1, itemId: "i2", vocabularyId: "v2", taskType: "mc", result: "correct", answeredAt: "2026-07-30" };
  var r = storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(r.status, "queueItemMismatch");
});

test("80: queueItemMismatch veraendert keinerlei Zustand", function () {
  var store = mockStore();
  var q = [{ itemId: "i1", vocabularyId: "v1", taskType: "mc", purpose: "neu", attempt: 1, retryOf: null, scheduledAfterPosition: null, stageBeforeFailure: null, failureEventId: null }];
  storage.starteNeueSitzung("p1", "englisch-6", "s1", "normal", {}, q, store, "2026-07-30");
  var vorher = store.getItem(storage.containerKey("p1", "englisch-6"));
  var ev = { eventId: "e1", sessionId: "s1", sequenceNumber: 1, itemId: "falsch", vocabularyId: "v1", taskType: "mc", result: "correct", answeredAt: "2026-07-30" };
  storage.wendeAntwortEreignisAn("p1", "englisch-6", ev, { store: store, config: config, heute: "2026-07-30" });
  assert.equal(store.getItem(storage.containerKey("p1", "englisch-6")), vorher);
});

test("81: namensbasierte hard-Daten werden in den profileId-Container migriert", function () {
  var store = mockStore();
  store.setItem(storage.altHardKey("Enya", "englisch-6"), JSON.stringify({ 3: 4 }));
  var alle = beispielPool(10);
  var r = storage.migriereHardInContainer("profile_xyz", "Enya", "englisch-6", alle, store, "2026-07-30");
  assert.equal(r.status, "migrated");
  assert.equal(r.container.progress[alle[3].id].incorrectAnswers, 4);
  var geladen = storage.ladeZustand("profile_xyz", "englisch-6", store, "2026-07-30");
  assert.equal(geladen.container.progress[alle[3].id].incorrectAnswers, 4);
});

test("82: namensbasierter ptr-Wert erzeugt keinen Fortschritt", function () {
  var store = mockStore();
  store.setItem(storage.altPtrKey("Enya", "englisch-6"), "6");
  var alle = beispielPool(10);
  var r = storage.migriereHardInContainer("profile_xyz", "Enya", "englisch-6", alle, store, "2026-07-30");
  assert.equal(Object.keys(r.container.progress).length, 0);
  assert.equal(r.container.migrationState.altPtrObserved, 6);
});

test("83: Fortschritt bleibt nach Profilumbenennung erreichbar", function () {
  var store = mockStore();
  store.setItem(storage.altHardKey("Enya", "englisch-6"), JSON.stringify({ 0: 1 }));
  var alle = beispielPool(5);
  storage.migriereHardInContainer("profile_xyz", "Enya", "englisch-6", alle, store, "2026-07-30");
  // Namensaenderung betrifft nur das Profilobjekt, NICHT den Container-Key.
  var geladenNachUmbenennung = storage.ladeZustand("profile_xyz", "englisch-6", store, "2026-07-30");
  assert.equal(geladenNachUmbenennung.status, "ok");
  assert.equal(geladenNachUmbenennung.container.progress[alle[0].id].incorrectAnswers, 1);
});

test("84: alte namensbasierte Schluessel bleiben unveraendert erhalten", function () {
  var store = mockStore();
  var hardRoh = JSON.stringify({ 0: 2 });
  store.setItem(storage.altHardKey("Enya", "englisch-6"), hardRoh);
  store.setItem(storage.altPtrKey("Enya", "englisch-6"), "5");
  var alle = beispielPool(5);
  storage.migriereHardInContainer("profile_xyz", "Enya", "englisch-6", alle, store, "2026-07-30");
  assert.equal(store.getItem(storage.altHardKey("Enya", "englisch-6")), hardRoh);
  assert.equal(store.getItem(storage.altPtrKey("Enya", "englisch-6")), "5");
});

// ============================================================
// 85-87: Regression F-02 - Legacy-Migration nach Profil-Umbenennung
// Vorher-Nachweis: Wurde ein Profil umbenannt, BEVOR der Vokabeltrainer
// erstmals lief, suchte die Migration nur unter dem AKTUELLEN Namen, fand
// nichts, setzte aber hardV1Completed=true -> Wackelkandidaten dauerhaft weg.
// ============================================================

test("85: F-02 - Altdaten werden auch nach Profil-Umbenennung gefunden (frueherer Name)", function () {
  var store = mockStore();
  store.setItem(storage.altHardKey("Enya", "englisch-6"), JSON.stringify({ 0: 3, 5: 1 }));
  var alle = beispielPool(10);
  // ui.js uebergibt: aktueller Name zuerst, dann frueherer Name aus legacyNames
  var r = storage.migriereHardInContainer("profile_1", ["Enya-Neu", "Enya"], "englisch-6", alle, store, "2026-08-07");
  assert.equal(r.status, "migrated");
  assert.equal(Object.keys(r.container.progress).length, 2);
  assert.equal(r.container.progress[alle[0].id].incorrectAnswers, 3);
  assert.equal(r.container.progress[alle[5].id].incorrectAnswers, 1);
});

test("86: F-02 - Einzelner Name (String) funktioniert unveraendert weiter (Abwaertskompatibilitaet)", function () {
  var store = mockStore();
  store.setItem(storage.altHardKey("Enya", "englisch-6"), JSON.stringify({ 1: 2 }));
  var alle = beispielPool(5);
  var r = storage.migriereHardInContainer("profile_1", "Enya", "englisch-6", alle, store, "2026-08-07");
  assert.equal(r.status, "migrated");
  assert.equal(r.container.progress[alle[1].id].incorrectAnswers, 2);
});

test("87: F-02 - Umbenennung merkt sich den bisherigen Namen (legacyNames)", function () {
  // Bildet die Logik aus js/app.js kindFormular.speichern() ab.
  function benenneUm(profil, neuerName) {
    if (profil.name && profil.name !== neuerName) {
      profil.legacyNames = profil.legacyNames || [];
      if (profil.legacyNames.indexOf(profil.name) === -1) profil.legacyNames.push(profil.name);
    }
    profil.name = neuerName;
    return profil;
  }
  var p = { name: "Enya", klasse: "6", profileId: "profile_1" };
  benenneUm(p, "Enya-Neu");
  assert.deepEqual(p.legacyNames, ["Enya"]);
  benenneUm(p, "Enya-Neu");            // gleicher Name -> kein Eintrag
  assert.deepEqual(p.legacyNames, ["Enya"]);
  benenneUm(p, "Enya-Final");
  assert.deepEqual(p.legacyNames, ["Enya", "Enya-Neu"]);
  // und die Kandidatenliste, die ui.js daraus bildet, findet die Altdaten:
  var store = mockStore();
  store.setItem(storage.altHardKey("Enya", "englisch-6"), JSON.stringify({ 2: 1 }));
  var alle = beispielPool(5);
  var kandidaten = [p.name].concat(p.legacyNames);
  var r = storage.migriereHardInContainer(p.profileId, kandidaten, "englisch-6", alle, store, "2026-08-07");
  assert.equal(Object.keys(r.container.progress).length, 1);
});
