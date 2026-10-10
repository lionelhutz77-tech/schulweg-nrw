"use strict";
var test = require("node:test");
var assert = require("node:assert/strict");
var fs = require("fs");
var path = require("path");

function fach() {
  var window = { SCHULWEG: { faecher: {} } };
  var src = fs.readFileSync(path.join(__dirname, "..", "content", "englisch-7.js"), "utf8");
  new Function("window", src)(window);
  return window.SCHULWEG.faecher["englisch-7"];
}

test("Unit 1 deckt Seiten 8 bis 16 mit eigenen Uebungen ab", function () {
  var f = fach();
  assert.ok(f.themen.length >= 4);
  assert.ok(f.themen.some(function (t) { return t.seiten === "S. 8–13"; }));
  assert.ok(f.themen.some(function (t) { return t.seiten === "S. 14–15"; }));
  assert.ok(f.themen.some(function (t) { return t.seiten === "S. 16"; }));
});

test("Klasse 7 besitzt einen eindeutigen Unit-1-Vokabelpool", function () {
  var pool = fach().vokabeltrainer;
  assert.ok(pool.length >= 55);
  assert.equal(new Set(pool.map(function (v) { return v.id; })).size, pool.length);
  ["the Tube", "market", "expensive", "neighbourhood", "shopping centre"].forEach(function (wort) {
    assert.ok(pool.some(function (v) { return v.en === wort; }), "fehlt: " + wort);
  });
});

test("Writing Course uebt einen eigenen Text mit 40 bis 60 Woertern", function () {
  var writing = fach().themen.filter(function (t) { return t.id === "u1-writing-neighbourhood"; })[0];
  assert.ok(writing);
  assert.ok(writing.aufgaben.some(function (a) { return a.typ === "freitext" && /40.*60/.test(a.kriterien); }));
});

test("Lerncheck bis 08.10.2026 verweist auf alle gemeldeten Buchaufgaben ohne Inhalte zu erfinden", function () {
  var check = fach().lerncheck;
  assert.ok(check);
  assert.equal(check.datum, "08.10.2026");
  assert.equal(check.tage.length, 11);
  var aufgaben = check.tage.flatMap(function (tag) { return tag.aufgaben.map(function (a) { return a.text; }); }).join("\n");
  ["Workbook S. 3, Nr. 1 + 2", "Workbook S. 4, Nr. 3a + 3b", "Workbook S. 5, Nr. 5a", "Workbook S. 6, Nr. 6 + 7", "Workbook S. 7, Nr. 9a, 9b, 9c", "Workbook S. 8, Nr. 10a + 10b", "More Practice 4", "Textbook S. 95, Nr. 1b", "Textbook S. 16"].forEach(function (text) {
    assert.match(aufgaben, new RegExp(text.replace(/[.+]/g, "\\$&")));
  });
  assert.ok(check.fehlendeSeiten.some(function (seite) { return /Workbook S\. 3–8/.test(seite); }));
  assert.ok(check.fehlendeSeiten.some(function (seite) { return /Textbook S\. 95/.test(seite); }));
});

test("Sprachcoach ist nur fuer Unit 1 konfiguriert und enthaelt keine Personendaten", function () {
  var f = fach();
  assert.equal(f.sprachcoach.unit, "Unit 1");
  assert.match(f.sprachcoach.stoff, /S\. 8–16/);
  assert.doesNotMatch(JSON.stringify(f), /Privatname|Privatort/);
});
