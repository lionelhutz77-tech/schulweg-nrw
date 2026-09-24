"use strict";
var test = require("node:test");
var assert = require("node:assert/strict");
var coach = require("../js/voice/coach.js");
var fs = require("node:fs");
var path = require("node:path");

var vocab = [
  { id: "en7_0001", de: "die U-Bahn", en: "the Tube" },
  { id: "en7_0002", de: "teuer", en: "expensive" },
  { id: "en7_0003", de: "die Nachbarschaft", en: "neighbourhood" }
];

test("Sprachcoach priorisiert Fehler und faellige Woerter ohne Profilnamen", function () {
  var brief = coach.baueLernauftrag({
    fachKey: "englisch-7",
    vocab: vocab,
    progress: {
      en7_0001: { stage: 3, incorrectAnswers: 0, dueDate: "2026-10-10" },
      en7_0002: { stage: 0, incorrectAnswers: 2, dueDate: "2026-09-20" }
    },
    voiceState: { sessions: [] },
    heute: "2026-09-24",
    maxWoerter: 3,
    verboteneNamen: ["Privatname"]
  });
  assert.match(brief, /en7_0002.*expensive/);
  assert.match(brief, /SCHULWEG-LERNPASS-V1/);
  assert.doesNotMatch(brief, /Privatname/);
});

test("Lernpass akzeptiert nur bekannte Vokabel-IDs", function () {
  var text = 'Hier ist der Lernpass:\nSCHULWEG-LERNPASS-V1 {"sicher":["en7_0001","fremd"],"ueben":["en7_0002"],"themen":["London"]}';
  var parsed = coach.leseLernpass(text, vocab.map(function (v) { return v.id; }), "2026-09-24");
  assert.deepEqual(parsed.sicher, ["en7_0001"]);
  assert.deepEqual(parsed.ueben, ["en7_0002"]);
  assert.deepEqual(parsed.themen, ["London"]);
});

test("Fruehere Sprachluecken fliessen in die naechste Sitzung ein", function () {
  var brief = coach.baueLernauftrag({
    fachKey: "englisch-7",
    vocab: vocab,
    progress: {},
    voiceState: { sessions: [{ datum: "2026-09-23", sicher: [], ueben: ["en7_0003"], themen: ["neighbourhood"] }] },
    heute: "2026-09-24",
    maxWoerter: 2
  });
  assert.match(brief, /en7_0003.*neighbourhood/);
});

test("Ungueltiger Lernpass wird kontrolliert abgelehnt", function () {
  assert.throws(function () { coach.leseLernpass("kein pass", ["en7_0001"], "2026-09-24"); }, /Lernpass/);
});

test("Browser-Ladereihenfolge erhaelt den gemeinsamen Faecher-Container", function () {
  var window = {};
  var coachSrc = fs.readFileSync(path.join(__dirname, "..", "js", "voice", "coach.js"), "utf8");
  var fachSrc = fs.readFileSync(path.join(__dirname, "..", "content", "englisch-7.js"), "utf8");
  new Function("window", "global", coachSrc)(window, window);
  new Function("window", fachSrc)(window);
  assert.ok(window.SCHULWEG.voiceCoach);
  assert.equal(window.SCHULWEG.faecher["englisch-7"].klasse, 7);
});
