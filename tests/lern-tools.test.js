"use strict";
var test = require("node:test");
var assert = require("node:assert/strict");
var tools = require("../js/learn/tools.js");

test("alle zwoelf Lernwerkzeuge sind eindeutig vorhanden", function () {
  assert.equal(tools.MODI.length, 12);
  assert.equal(new Set(tools.MODI.map(function (m) { return m.id; })).size, 12);
});

test("Lernauftrag ist altersgerecht und datensparsam", function () {
  var prompt = tools.baueAuftrag({ modus: "quiz", fach: "Deutsch", klasse: 7, thema: "Sachlich berichten", seiten: "Kapitel Bericht" });
  assert.match(prompt, /Klasse 7/);
  assert.match(prompt, /fuenf abwechslungsreiche Fragen/);
  assert.match(prompt, /persoenlichen Daten/);
  assert.match(prompt, /kopiere keine Schulbuchtexte/);
});

test("unbekannte Modi und Klassen werden abgelehnt", function () {
  assert.throws(function () { tools.baueAuftrag({ modus: "magie", fach: "Mathe", klasse: 5, thema: "Winkel" }); });
  assert.throws(function () { tools.baueAuftrag({ modus: "steps", fach: "Mathe", klasse: 12, thema: "Winkel" }); });
});
