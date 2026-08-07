#!/usr/bin/env node
/*
 * Einmaliges Skript: ergaenzt fehlende `id`-Felder im Vokabeltrainer-Pool
 * (content/englisch-6.js). Regeln:
 *  - ergaenzt NUR fehlende IDs, veraendert nie bestehende
 *  - nummeriert bestehende Eintraege nie neu
 *  - naechste ID = max(vorhandene Nummern) + 1 (nicht Array-Index)
 *  - bricht bei Duplikaten im Bestand ab, ohne zu schreiben
 *  - --check: reiner Pruefmodus, schreibt nichts
 *
 * Aufruf: node scripts/assign-vocabulary-ids.js [--check]
 */
"use strict";
var fs = require("fs");
var path = require("path");

var CONTENT_PATH = path.join(__dirname, "..", "content", "englisch-6.js");
var PREFIX = "en6_";
var CHECK_ONLY = process.argv.indexOf("--check") !== -1;

function ladePool(sourceText) {
  var g = { window: { SCHULWEG: { faecher: {} } } };
  // eslint-disable-next-line no-new-func
  var fn = new Function("window", sourceText + "\nreturn window;");
  var w = fn(g.window);
  var fach = w.SCHULWEG.faecher["englisch-6"];
  if (!fach || !Array.isArray(fach.vokabeltrainer)) {
    throw new Error("vokabeltrainer-Array nicht gefunden");
  }
  return fach.vokabeltrainer;
}

function main() {
  var src = fs.readFileSync(CONTENT_PATH, "utf8");
  var pool = ladePool(src);

  // 1) Bestehende IDs einsammeln, Duplikate erkennen
  var seen = {};
  var maxNum = 0;
  var duplicates = [];
  pool.forEach(function (v, i) {
    if (v.id) {
      if (seen[v.id]) duplicates.push({ id: v.id, indices: [seen[v.id], i] });
      seen[v.id] = i;
      var m = /^en6_(\d+)$/.exec(v.id);
      if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10));
    }
  });

  if (duplicates.length) {
    console.error("ABBRUCH: doppelte Vokabel-IDs gefunden, es wird NICHTS geschrieben:");
    duplicates.forEach(function (d) { console.error("  " + d.id + " bei Indizes " + d.indices.join(", ")); });
    process.exit(1);
  }

  // 2) Fehlende IDs zuweisen (naechste freie Nummer, nie bestehende anfassen)
  var next = maxNum + 1;
  var assigned = 0;
  var neueIds = pool.map(function (v) {
    if (v.id) return v.id;
    var id = PREFIX + String(next).padStart(4, "0");
    next++;
    assigned++;
    return id;
  });

  console.log("Pool-Groesse: " + pool.length);
  console.log("Bereits vorhandene IDs: " + (pool.length - assigned));
  console.log("Neu zu vergebende IDs: " + assigned);

  if (CHECK_ONLY) {
    console.log("--check: keine Datei geschrieben.");
    process.exit(assigned > 0 || duplicates.length ? 0 : 0);
    return;
  }

  if (assigned === 0) {
    console.log("Nichts zu tun (alle Eintraege haben bereits eine ID).");
    return;
  }

  // 3) Block neu schreiben: id als erstes Feld, de/en/alt unveraendert, Reihenfolge unveraendert
  var lines = pool.map(function (v, i) {
    var parts = ["id: " + JSON.stringify(neueIds[i])];
    parts.push("de: " + JSON.stringify(v.de));
    parts.push("en: " + JSON.stringify(v.en));
    if (v.alt) parts.push("alt: " + JSON.stringify(v.alt));
    return "  { " + parts.join(", ") + " }";
  });
  var block = "[\n" + lines.join(",\n") + "\n];";

  var neuerSrc = src.replace(
    /(\.vokabeltrainer\s*=\s*)\[[\s\S]*?\];\s*$/,
    "$1" + block.replace(/\$/g, "$$$$") + "\n"
  );
  if (neuerSrc === src) {
    console.error("ABBRUCH: Ersetzungs-Regex hat nicht gegriffen, es wurde NICHTS geschrieben.");
    process.exit(1);
  }
  fs.writeFileSync(CONTENT_PATH, neuerSrc, "utf8");
  console.log("Geschrieben: " + assigned + " neue IDs ergaenzt (" + PREFIX + String(maxNum + 1).padStart(4, "0") + " .. " + PREFIX + String(next - 1).padStart(4, "0") + ").");
}

main();
