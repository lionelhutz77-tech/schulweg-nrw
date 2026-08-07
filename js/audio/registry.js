/*
 * Audio-Registry: loest eine AudioRef zu einer abspielbaren Quelle auf.
 * Anbieterneutral - die Lernlogik kennt NUR AudioRefs, nie einen Player
 * oder eine TTS-Implementierung.
 *
 * AudioRef: { kind: "word"|"sentence"|"dialogue", key, lang, text }
 *   - key  : stabile fachliche Kennung (z. B. "u1.k1.hello-introduction")
 *   - text : der zu sprechende/anzuzeigende Wortlaut (Fallback-Anzeige)
 *
 * Aufloesungsreihenfolge (erste verfuegbare gewinnt):
 *   1. lizenzierte/vorgerenderte Datei   -> { typ: "datei", url }
 *   2. Sprachsynthese zur Laufzeit       -> { typ: "tts", text, lang }
 *   3. nichts verfuegbar                 -> { typ: "keins", text }
 *
 * "keins" ist ein regulaerer Zustand, kein Fehler: die Aufgabe bleibt mit
 * sichtbarem Text nutzbar.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else { root.SCHULWEG_AUDIO = root.SCHULWEG_AUDIO || {}; root.SCHULWEG_AUDIO.registry = api; }
})(typeof window !== "undefined" ? window : global, function () {
  "use strict";

  // Bekannte vorgerenderte/lizenzierte Dateien: key -> url.
  // Bleibt in diesem Slice bewusst leer; spaetere Phasen fuellen sie.
  var DATEIEN = {};

  function istGueltigeRef(ref) {
    return !!(ref && typeof ref === "object" && ref.key && ref.lang &&
      (ref.kind === "word" || ref.kind === "sentence" || ref.kind === "dialogue"));
  }

  /**
   * @param {object} ref AudioRef
   * @param {object} faehigkeiten { dateien?: {key:url}, ttsVerfuegbar?: boolean }
   *   wird injiziert -> testbar ohne Browser
   */
  function loese(ref, faehigkeiten) {
    faehigkeiten = faehigkeiten || {};
    if (!istGueltigeRef(ref)) return { typ: "keins", text: (ref && ref.text) || "" };

    var dateien = faehigkeiten.dateien || DATEIEN;
    if (Object.prototype.hasOwnProperty.call(dateien, ref.key)) {
      return { typ: "datei", url: dateien[ref.key], text: ref.text || "" };
    }
    if (faehigkeiten.ttsVerfuegbar && ref.text) {
      return { typ: "tts", text: ref.text, lang: ref.lang };
    }
    return { typ: "keins", text: ref.text || "" };
  }

  function istVerfuegbar(ref, faehigkeiten) {
    return loese(ref, faehigkeiten).typ !== "keins";
  }

  function machRef(kind, key, text, lang) {
    return { kind: kind, key: key, text: text, lang: lang || "en-GB" };
  }

  return {
    loese: loese,
    istVerfuegbar: istVerfuegbar,
    istGueltigeRef: istGueltigeRef,
    machRef: machRef,
    DATEIEN: DATEIEN
  };
});
