/*
 * Lernreise-Steuerung + Persistenz des Kompetenzfortschritts.
 *
 * Bewusst EIGENER Storage-Key, getrennt vom Vokabel-SRS:
 *   comp_<profileId>_<fachKey>_state_v1
 * Gleiches Prinzip wie beim SRS (ein Container, eine schemaVersion, ein
 * setItem pro Schreibvorgang), aber ohne jede Kopplung an Vokabeldetails.
 * Der SRS-Container wird von diesem Modul nie gelesen oder geschrieben.
 *
 * Profilbezug ausschliesslich ueber profileId - nie ueber den Namen.
 */
(function (root, factory) {
  var api = factory(
    typeof module !== "undefined" && module.exports ? require("./competency.js") : root.SCHULWEG_LEARN.competency
  );
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else { root.SCHULWEG_LEARN = root.SCHULWEG_LEARN || {}; root.SCHULWEG_LEARN.journey = api; }
})(typeof window !== "undefined" ? window : global, function (competency) {
  "use strict";

  var SCHEMA_VERSION = 1;

  function containerKey(profileId, fachKey) {
    return "comp_" + profileId + "_" + fachKey + "_state_v1";
  }

  function leererContainer(profileId, fachKey) {
    return {
      schemaVersion: SCHEMA_VERSION,
      profileId: profileId,
      fachKey: fachKey,
      competencies: {},
      journeys: {},     // journeyId -> { position, abgeschlossen }
      updatedAt: null
    };
  }

  /**
   * Laedt den Container. Schreibt nie.
   * @returns {{status:"ok"|"empty"|"corruptState"|"unsupportedSchema", container, raw}}
   */
  function ladeZustand(profileId, fachKey, store) {
    var raw;
    try { raw = store.getItem(containerKey(profileId, fachKey)); }
    catch (e) { return { status: "corruptState", container: null, raw: null }; }
    if (raw == null) return { status: "empty", container: leererContainer(profileId, fachKey), raw: null };
    var parsed;
    try { parsed = JSON.parse(raw); } catch (e) { return { status: "corruptState", container: null, raw: raw }; }
    if (!parsed || typeof parsed !== "object" || !parsed.competencies) {
      return { status: "corruptState", container: null, raw: raw };
    }
    var v = typeof parsed.schemaVersion === "number" ? parsed.schemaVersion : 1;
    if (v > SCHEMA_VERSION) return { status: "unsupportedSchema", container: parsed, raw: raw };
    if (!parsed.journeys) parsed.journeys = {};   // rueckwaertskompatibel ergaenzen
    return { status: "ok", container: parsed, raw: null };
  }

  function speichere(profileId, fachKey, container, store) {
    try {
      store.setItem(containerKey(profileId, fachKey), JSON.stringify(container));
      return { status: "gespeichert" };
    } catch (e) {
      return { status: "storageError" };
    }
  }

  /**
   * Verbucht das Ergebnis einer Aktivitaet und speichert atomar.
   * @param {object} ergebnis { competencyId, skill, activityType, correct, heute, vokabelIds? }
   */
  function verbucheErgebnis(profileId, fachKey, ergebnis, store) {
    var geladen = ladeZustand(profileId, fachKey, store);
    if (geladen.status === "corruptState") return { status: "corruptState" };
    if (geladen.status === "unsupportedSchema") return { status: "unsupportedSchema" };

    var container = JSON.parse(JSON.stringify(geladen.container));
    var vorher = container.competencies[ergebnis.competencyId] || null;
    var r = competency.verbucheAktivitaet(vorher, ergebnis.competencyId, ergebnis);
    if (!r.angewendet) return { status: "abgelehnt", grund: r.grund };

    if (ergebnis.vokabelIds && !r.stand.vokabelIds.length) r.stand.vokabelIds = ergebnis.vokabelIds.slice();
    container.competencies[ergebnis.competencyId] = r.stand;
    container.updatedAt = ergebnis.heute || null;

    var s = speichere(profileId, fachKey, container, store);
    if (s.status !== "gespeichert") return { status: "storageError" };
    return { status: "verbucht", stand: r.stand, container: container };
  }

  function holeStand(profileId, fachKey, competencyId, store) {
    var geladen = ladeZustand(profileId, fachKey, store);
    if (geladen.status !== "ok" && geladen.status !== "empty") return null;
    return geladen.container.competencies[competencyId] || competency.leererStand(competencyId);
  }

  /** Position in der Lernreise merken (Fortsetzen nach Reload). */
  function merkePosition(profileId, fachKey, journeyId, position, store) {
    var geladen = ladeZustand(profileId, fachKey, store);
    if (geladen.status === "corruptState" || geladen.status === "unsupportedSchema") return { status: geladen.status };
    var container = JSON.parse(JSON.stringify(geladen.container));
    container.journeys[journeyId] = container.journeys[journeyId] || {};
    container.journeys[journeyId].position = position;
    return speichere(profileId, fachKey, container, store);
  }

  function holePosition(profileId, fachKey, journeyId, store) {
    var geladen = ladeZustand(profileId, fachKey, store);
    if (geladen.status !== "ok" && geladen.status !== "empty") return 0;
    var j = geladen.container.journeys[journeyId];
    return (j && typeof j.position === "number") ? j.position : 0;
  }

  /**
   * Naechster Schritt der Lernreise. Rein - kein Storage-Zugriff.
   * Ueberspringt Audio-Schritte NICHT, sondern liefert sie mit; die UI
   * entscheidet ueber die Darstellung.
   */
  function naechsterSchritt(schritte, position) {
    if (position >= schritte.length) return null;
    return schritte[position];
  }

  function fortschritt(schritte, position) {
    var gesamt = schritte.length;
    return { position: position, gesamt: gesamt, prozent: gesamt ? Math.round((position / gesamt) * 100) : 0 };
  }

  return {
    SCHEMA_VERSION: SCHEMA_VERSION,
    containerKey: containerKey,
    leererContainer: leererContainer,
    ladeZustand: ladeZustand,
    verbucheErgebnis: verbucheErgebnis,
    holeStand: holeStand,
    merkePosition: merkePosition,
    holePosition: holePosition,
    naechsterSchritt: naechsterSchritt,
    fortschritt: fortschritt
  };
});
