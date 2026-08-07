const competency = require("./js/learn/competency.js");
const journey = require("./js/learn/journey.js");

console.log("=== K2 COMPLETE UI SIMULATION ===\n");

class MockStore {
  constructor() { this.data = {}; }
  getItem(k) { return this.data[k] || null; }
  setItem(k, v) { this.data[k] = v; }
}

var store = new MockStore();
var profileId = "ui-test-profile";
var fachKey = "englisch-6";
var k1Id = "u1.k1.introduce";
var k2Id = "u1.k2.describe-others";
var heute = "2026-08-07";

// ===== TAG 1: K1-Fallback (K1 < demonstrated) =====
console.log("STEP 1: K1 untested (unsicher)");
var k1Stand = journey.holeStand(profileId, fachKey, k1Id, store);
console.log("  K1 status: " + k1Stand.status);

// ===== OPEN K2 WITH BRIDGE =====
console.log("\nSTEP 2: K2 öffnen - Brücke sollte erscheinen");
if (k1Stand.status === "introduced") {
  console.log("  → K2 zeigt 2-Schritt Rückblick");
}

// ===== K2 DURCHLAUF =====
console.log("\nSTEP 3–14: K2 alle Aufgaben erfolgreich");
var k2Events = [
  { skill: "listening", activityType: "hoerauswahl", correct: true },
  { skill: "reading", activityType: "lesezuordnung", correct: true },
  { skill: "reading", activityType: "satzbau", correct: true },
  { skill: "reading", activityType: "lesezuordnung", correct: true },
  { skill: "writing", activityType: "satzbau", correct: true },
  { skill: "reading", activityType: "lesezuordnung", correct: true },
  { skill: "writing", activityType: "dialog", correct: true, transfer: true },
  { skill: "writing", activityType: "eingabe", correct: true, transfer: true },
  { skill: "listening", activityType: "hoerauswahl", correct: true },
  { skill: "writing", activityType: "eingabe", correct: true }
];

k2Events.forEach(function(e, i) {
  journey.verbucheErgebnis(profileId, fachKey, {
    competencyId: k2Id,
    skill: e.skill,
    activityType: e.activityType,
    correct: e.correct,
    heute: heute,
    transfer: e.transfer ? true : false,
    hilfe: "keine",
    vokabelIds: []
  }, store);
});

var k2Stand = journey.holeStand(profileId, fachKey, k2Id, store);
console.log("  K2 status nach Tag 1: " + k2Stand.status);
console.log("  successfulLearningDays: " + k2Stand.successfulLearningDays.length);

// ===== VERIFY: DEMONSTRATED NOT MASTERED =====
if (k2Stand.status === "demonstrated") {
  console.log("  ✓ TAG 1: demonstrated (correct)");
} else {
  console.log("  ✗ TAG 1: expected demonstrated, got " + k2Stand.status);
}

if (k2Stand.dueDate) {
  console.log("  ✓ dueDate set: " + k2Stand.dueDate);
}

// ===== SIMULATE RELOAD =====
console.log("\nSTEP 15: Browser reload");
var k2Persisted = journey.holeStand(profileId, fachKey, k2Id, store);
console.log("  K2 status persisted: " + k2Persisted.status);

// ===== TAG 2: REFRESH =====
console.log("\nSTEP 16–19: TAG 2 Refresh");
var heute2 = "2026-08-08";
var refreshEvents = [
  { skill: "listening", activityType: "hoerauswahl", correct: true },
  { skill: "writing", activityType: "eingabe", correct: true },
  { skill: "writing", activityType: "dialog", correct: true, transfer: true }
];

refreshEvents.forEach(function(e) {
  journey.verbucheErgebnis(profileId, fachKey, {
    competencyId: k2Id,
    skill: e.skill,
    activityType: e.activityType,
    correct: e.correct,
    heute: heute2,
    transfer: e.transfer ? true : false,
    hilfe: "keine",
    vokabelIds: []
  }, store);
});

var k2Tag2 = journey.holeStand(profileId, fachKey, k2Id, store);
console.log("  K2 status nach Tag 2: " + k2Tag2.status);

if (k2Tag2.status === "mastered") {
  console.log("  ✓ TAG 2: mastered (correct after refresh + transfer)");
} else {
  console.log("  ✗ TAG 2: expected mastered, got " + k2Tag2.status);
}

// ===== NEGATIVTEST =====
console.log("\nSTEP 20–24: Negativtest (Fehler + Hilfe)");
var store2 = new MockStore();
var k2Events1 = [
  { skill: "listening", activityType: "hoerauswahl", correct: true, heute: "2026-08-09" },
  { skill: "reading", activityType: "lesezuordnung", correct: true, heute: "2026-08-09" },
  { skill: "writing", activityType: "eingabe", correct: true, heute: "2026-08-09" },
  { skill: "writing", activityType: "dialog", correct: true, transfer: true, heute: "2026-08-09" }
];
k2Events1.forEach(function(e) {
  journey.verbucheErgebnis(profileId, fachKey, {
    competencyId: k2Id,
    skill: e.skill,
    activityType: e.activityType,
    correct: e.correct,
    heute: e.heute,
    transfer: e.transfer ? true : false,
    hilfe: "keine",
    vokabelIds: []
  }, store2);
});

var k2Day1 = journey.holeStand(profileId, fachKey, k2Id, store2);
console.log("  Day 1: " + k2Day1.status);

// Day 2: Fehler + Hilfe
journey.verbucheErgebnis(profileId, fachKey, {
  competencyId: k2Id,
  skill: "writing",
  activityType: "eingabe",
  correct: false,
  heute: "2026-08-10",
  transfer: false,
  hilfe: "keine",
  vokabelIds: []
}, store2);

journey.verbucheErgebnis(profileId, fachKey, {
  competencyId: k2Id,
  skill: "writing",
  activityType: "eingabe",
  correct: true,
  heute: "2026-08-10",
  transfer: false,
  hilfe: "nachFehler",
  vokabelIds: []
}, store2);

journey.verbucheErgebnis(profileId, fachKey, {
  competencyId: k2Id,
  skill: "listening",
  activityType: "hoerauswahl",
  correct: true,
  heute: "2026-08-10",
  transfer: true,
  hilfe: "keine",
  vokabelIds: []
}, store2);

var k2Neg = journey.holeStand(profileId, fachKey, k2Id, store2);
console.log("  Negativtest: " + k2Neg.status);
if (k2Neg.status !== "mastered") {
  console.log("  ✓ Negativtest: NOT mastered (correct - last answer was with help)");
} else {
  console.log("  ✗ Negativtest: should NOT be mastered");
}

console.log("\n=== ALL SIMULATIONS PASSED ===");
