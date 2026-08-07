#!/usr/bin/env node
/*
 * Unabhaengige Pruefung nach assign-vocabulary-ids.js:
 *  - exakt gleiche Anzahl Datensaetze vor/nach (Vergleich gegen ein Backup)
 *  - jede Vokabel hat genau ein `id`-Feld, alle IDs eindeutig
 *  - de/en/alt inhaltlich identisch zu vorher, Reihenfolge unveraendert
 *
 * Aufruf: node scripts/verify-vocabulary-ids.js <pfad-zum-backup-vor-der-aenderung>
 * Backup-Beispiel: git show HEAD:content/englisch-6.js > /tmp/vor.js
 */
"use strict";
var fs = require("fs");
var path = require("path");

var CONTENT_PATH = path.join(__dirname, "..", "content", "englisch-6.js");
var BACKUP_PATH = process.argv[2];

function ladePool(sourceText) {
  var g = { window: { SCHULWEG: { faecher: {} } } };
  var fn = new Function("window", sourceText + "\nreturn window;");
  var w = fn(g.window);
  var fach = w.SCHULWEG.faecher["englisch-6"];
  if (!fach || !Array.isArray(fach.vokabeltrainer)) throw new Error("vokabeltrainer-Array nicht gefunden");
  return fach.vokabeltrainer;
}

function fail(msg) { console.error("FAIL: " + msg); process.exitCode = 1; }
function ok(msg) { console.log("OK: " + msg); }

function main() {
  if (!BACKUP_PATH) {
    console.error("Nutzung: node scripts/verify-vocabulary-ids.js <backup-datei>");
    process.exit(2);
  }
  var neu = ladePool(fs.readFileSync(CONTENT_PATH, "utf8"));
  var alt = ladePool(fs.readFileSync(BACKUP_PATH, "utf8"));

  if (neu.length === alt.length) ok("Anzahl Datensaetze unveraendert: " + neu.length);
  else fail("Anzahl veraendert: vorher " + alt.length + ", nachher " + neu.length);

  var idSet = {};
  var fehlend = 0, doppelt = 0;
  neu.forEach(function (v) {
    if (!v.id) { fehlend++; return; }
    if (idSet[v.id]) doppelt++;
    idSet[v.id] = true;
  });
  if (fehlend === 0) ok("Jede Vokabel hat ein id-Feld.");
  else fail(fehlend + " Vokabeln ohne id-Feld.");
  if (doppelt === 0) ok("Alle IDs eindeutig.");
  else fail(doppelt + " doppelte IDs gefunden.");

  var n = Math.min(neu.length, alt.length);
  var reihenfolgeFehler = 0, inhaltFehler = 0;
  for (var i = 0; i < n; i++) {
    var a = alt[i], b = neu[i];
    if (a.de !== b.de || a.en !== b.en) { reihenfolgeFehler++; continue; }
    var altAlt = JSON.stringify(a.alt || []), neuAlt = JSON.stringify(b.alt || []);
    if (altAlt !== neuAlt) inhaltFehler++;
  }
  if (reihenfolgeFehler === 0) ok("Reihenfolge/de/en identisch zu vorher (Index-fuer-Index).");
  else fail(reihenfolgeFehler + " Positionen mit abweichendem de/en (Reihenfolge oder Inhalt veraendert).");
  if (inhaltFehler === 0) ok("alt-Felder identisch zu vorher.");
  else fail(inhaltFehler + " Positionen mit abweichendem alt-Feld.");

  if (process.exitCode === 1) {
    console.error("\nVerifikation FEHLGESCHLAGEN.");
  } else {
    console.log("\nVerifikation ERFOLGREICH.");
  }
}

main();
