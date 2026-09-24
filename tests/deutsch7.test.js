"use strict";
var test = require("node:test");
var assert = require("node:assert/strict");
var fs = require("fs");
var path = require("path");

function ladeDeutsch7() {
  var window = { SCHULWEG: { faecher: {} } };
  var src = fs.readFileSync(path.join(__dirname, "..", "content", "deutsch-7.js"), "utf8");
  new Function("window", src)(window);
  return window.SCHULWEG.faecher["deutsch-7"];
}

test("Deutsch Klasse 7 hat Tutor, Fehlerquiz und lokale Schreibwerkstatt", function () {
  var fach = ladeDeutsch7();
  assert.equal(fach.klasse, 7);
  assert.deepEqual(fach.themen.map(function (t) { return t.id; }), [
    "tutor-sachlicher-bericht", "bericht-detektiv", "bericht-werkstatt-lokal"
  ]);
});

test("Tutor deckt die zentralen Bericht-Kompetenzen ab", function () {
  var tutor = ladeDeutsch7().themen[0];
  var text = JSON.stringify(tutor);
  ["W-Fragen", "zeitlicher Reihenfolge", "Präteritum", "Plusquamperfekt", "sachlich", "Checkliste"].forEach(function (begriff) {
    assert.match(text, new RegExp(begriff, "i"), "fehlt: " + begriff);
  });
  assert.equal(tutor.lektionen.length, 6);
});

test("Fehlerquiz gibt zu jeder falschen Multiple-Choice-Antwort eine Diagnose", function () {
  var quiz = ladeDeutsch7().themen[1];
  assert.ok(quiz.aufgaben.length >= 10);
  quiz.aufgaben.filter(function (a) { return a.typ === "mc"; }).forEach(function (a) {
    a.antworten.filter(function (antwort) { return antwort !== a.richtig; }).forEach(function (antwort) {
      assert.ok(a.fehler && a.fehler[antwort], "Diagnose fehlt: " + antwort);
    });
  });
});

test("Freie Berichtaufgabe bleibt lokal und besitzt eine konkrete Checkliste", function () {
  var werkstatt = ladeDeutsch7().themen[2];
  werkstatt.aufgaben.forEach(function (a) {
    assert.equal(a.typ, "freitext");
    assert.equal(a.nurLokal, true);
    assert.ok(a.checkliste.length >= 6);
    assert.ok(a.musterloesung);
  });
});

test("App stoppt lokale Freitexte vor jedem Netzwerkaufruf", function () {
  var src = fs.readFileSync(path.join(__dirname, "..", "js", "app.js"), "utf8");
  var funktion = src.slice(src.indexOf("function freitextAbschicken"), src.indexOf("function zeigeErgebnis"));
  assert.ok(funktion.indexOf("if (a.nurLokal)") > -1);
  assert.ok(funktion.indexOf("if (a.nurLokal)") < funktion.indexOf("fetch(window.SCHULWEG_CONFIG.kiEndpoint"));
});

test("Inhalt uebernimmt keine Figuren oder Falltexte aus den Buchscans", function () {
  var src = fs.readFileSync(path.join(__dirname, "..", "content", "deutsch-7.js"), "utf8");
  ["Hauptkommissarin Fuchs", "René Pfitz", "Julian Köhler", "Anne-Frank-Realschule"].forEach(function (name) {
    assert.doesNotMatch(src, new RegExp(name));
  });
});
