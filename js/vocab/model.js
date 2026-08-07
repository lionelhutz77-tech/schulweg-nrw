/*
 * Reines Datenmodell-Modul fuer den Vokabeltrainer.
 * Keine Storage-, DOM- oder Zeit-/Zufallsabhaengigkeiten.
 * Laeuft identisch in node:test (require) und im Browser (window.SCHULWEG_VOCAB.model).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else { root.SCHULWEG_VOCAB = root.SCHULWEG_VOCAB || {}; root.SCHULWEG_VOCAB.model = api; }
})(typeof window !== "undefined" ? window : global, function () {
  "use strict";

  // Ergaenzt fehlende optionale Felder mit null-Defaults. Verlangt KEIN
  // vorhandenes `id` (Vollstaendigkeit wird separat per validiereVokabelPool
  // geprueft, damit ein fehlerhafter Datensatz den Trainer kontrolliert
  // blockiert statt die App zum Absturz zu bringen).
  function normalisiereVokabel(eintrag) {
    return {
      id: eintrag.id || null,
      de: eintrag.de,
      en: eintrag.en,
      alt: eintrag.alt || [],
      wordType: eintrag.wordType != null ? eintrag.wordType : null,
      exampleEn: eintrag.exampleEn != null ? eintrag.exampleEn : null,
      exampleDe: eintrag.exampleDe != null ? eintrag.exampleDe : null,
      unit: eintrag.unit != null ? eintrag.unit : null,
      topic: eintrag.topic != null ? eintrag.topic : null,
      hint: eintrag.hint != null ? eintrag.hint : null,
      audio: eintrag.audio != null ? eintrag.audio : null
    };
  }

  function normalisierePool(alle) {
    return alle.map(normalisiereVokabel);
  }

  // Prueft Vollstaendigkeit + Eindeutigkeit der IDs im aktiven Pool.
  // Wird von der UI VOR Sitzungsstart aufgerufen; bei ok:false darf keine
  // Sitzung gestartet werden (kontrollierte Blockade, kein Fallback-ID).
  function validiereVokabelPool(pool) {
    var fehlendeIndizes = [];
    var gesehen = {};
    var doppelteIds = [];
    pool.forEach(function (v, i) {
      if (!v.id) { fehlendeIndizes.push(i); return; }
      if (gesehen[v.id] !== undefined) {
        doppelteIds.push({ id: v.id, indices: [gesehen[v.id], i] });
      } else {
        gesehen[v.id] = i;
      }
    });
    return {
      ok: fehlendeIndizes.length === 0 && doppelteIds.length === 0,
      fehlendeIndizes: fehlendeIndizes,
      doppelteIds: doppelteIds
    };
  }

  // Erzeugt eine unveraenderliche Profil-ID. Weder Profilname noch reiner
  // Zeitstempel fliessen ein. cryptoObj wird injiziert (Testbarkeit,
  // Punkt 8 der Korrekturvorgabe).
  function erzeugeProfilId(cryptoObj) {
    if (cryptoObj && typeof cryptoObj.randomUUID === "function") {
      return "profile_" + cryptoObj.randomUUID();
    }
    if (cryptoObj && typeof cryptoObj.getRandomValues === "function") {
      var b = cryptoObj.getRandomValues(new Uint8Array(16));
      b[6] = (b[6] & 0x0f) | 0x40;
      b[8] = (b[8] & 0x3f) | 0x80;
      var hex = Array.prototype.map.call(b, function (x) {
        var h = x.toString(16);
        return h.length === 1 ? "0" + h : h;
      }).join("");
      return "profile_" + hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" +
        hex.slice(12, 16) + "-" + hex.slice(16, 20) + "-" + hex.slice(20);
    }
    throw new Error("Kein sicherer ID-Generator verfuegbar (weder randomUUID noch getRandomValues)");
  }

  // Idempotente Profil-ID-Migration (reine Funktion, ohne DOM/localStorage -
  // js/app.js ruft dies auf und speichert das Ergebnis sofort). Profile mit
  // bereits vorhandener profileId werden NIE veraendert; name/klasse/avatar/
  // fortschritt bleiben unangetastet.
  function migriereProfilIds(profile, idGen) {
    var geaendert = false;
    var neu = profile.map(function (p) {
      if (p.profileId) return p;
      geaendert = true;
      var kopie = {};
      Object.keys(p).forEach(function (k) { kopie[k] = p[k]; });
      kopie.profileId = idGen();
      return kopie;
    });
    return { profile: neu, geaendert: geaendert };
  }

  return {
    normalisiereVokabel: normalisiereVokabel,
    normalisierePool: normalisierePool,
    validiereVokabelPool: validiereVokabelPool,
    erzeugeProfilId: erzeugeProfilId,
    migriereProfilIds: migriereProfilIds
  };
});
