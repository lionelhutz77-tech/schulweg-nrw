"use strict";
var test = require("node:test");
var assert = require("node:assert/strict");
var fs = require("fs");
var path = require("path");

function ladeInhalte() {
  var window = { SCHULWEG: { faecher: {} } };
  ["englisch-unit1.js", "englisch-unit1-k2.js", "englisch-5.js", "englisch-7.js"].forEach(function (datei) {
    var src = fs.readFileSync(path.join(__dirname, "..", "content", datei), "utf8");
    new Function("window", src)(window);
  });
  return window.SCHULWEG;
}

test("Klasse 5 und 7 haben getrennte Englischbereiche", function () {
  var s = ladeInhalte();
  assert.equal(s.faecher["englisch-5"].klasse, 5);
  assert.equal(s.faecher["englisch-7"].klasse, 7);
  assert.notEqual(s.faecher["englisch-5"], s.faecher["englisch-7"]);
});

test("Klasse 5 enthaelt den vollstaendigen bereitgestellten Lernwortschatz", function () {
  var pool = ladeInhalte().faecher["englisch-5"].vokabeltrainer;
  assert.equal(pool.length, 108);
  assert.equal(new Set(pool.map(function (v) { return v.id; })).size, pool.length);
  ["Nice to meet you!", "one", "fourteen", "watch TV", "an elephant", "it's fun"].forEach(function (wort) {
    assert.ok(pool.some(function (v) { return v.en === wort; }), "fehlt: " + wort);
  });
});

test("Beide Vokabeltest-Proben bilden neun Woerter plus einen Satz ab", function () {
  var themen = ladeInhalte().faecher["englisch-5"].themen;
  var proben = themen.filter(function (t) { return t.id.indexOf("vokabeltest-180-181") === 0; });
  assert.equal(proben.length, 2);
  proben.forEach(function (p) {
    assert.equal(p.aufgaben.length, 10);
    assert.match(p.aufgaben[9].frage, /sentence|Satz/i);
    assert.ok(p.aufgaben.some(function (a) { return /into English/.test(a.frage); }));
    assert.ok(p.aufgaben.some(function (a) { return /into German/.test(a.frage); }));
  });
});

test("Klasse-5-Lernreisen sind lokal und vom Klasse-6-Fortschritt getrennt", function () {
  var s = ladeInhalte();
  assert.equal(s.lernreisen.length, 2);
  s.lernreisen.forEach(function (r) {
    assert.equal(r.fachKey, "englisch-5");
    assert.ok(r.kompetenz.id);
    assert.notEqual(r, s.unit1);
  });
  assert.equal(s.lernreisen[0].kompetenz.vokabelIds.length, 11);
  assert.ok(s.lernreisen[0].kompetenz.vokabelIds.every(function (id) { return /^en5_/.test(id); }));
});

test("Neue Aufgaben enthalten keine fest eingebauten privaten Beispiele", function () {
  var files = ["englisch-5.js", path.join("..", "js", "learn", "ui.js")];
  files.forEach(function (rel) {
    var src = fs.readFileSync(path.join(__dirname, "..", "content", rel), "utf8");
    assert.doesNotMatch(src, /Enya|Oberhausen/);
  });
});
