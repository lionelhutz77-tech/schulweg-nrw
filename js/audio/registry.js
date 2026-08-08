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

  // Vorgerenderte Audiodateien (Microsoft en-GB-LibbyNeural)
  // Key -> URL für lokale MP3-Dateien
  var DATEIEN = {
    "u1.k1.d-name": "/audio/english/unit1/u1_k1_d-name.mp3",
    "u1.k1.muster-im": "/audio/english/unit1/u1_k1_muster-im.mp3",
    "u1.k2.ankommen": "/audio/english/unit1/u1_k2_ankommen.mp3",
    "u1.k1.r-james": "/audio/english/unit1/u1_k1_r-james.mp3",
    "u1.k2.mia-intro": "/audio/english/unit1/u1_k2_mia-intro.mp3",
    "u1.k1.nice-to-meet": "/audio/english/unit1/u1_k1_nice-to-meet.mp3",
    "u1.k2.r-hoer-neu": "/audio/english/unit1/u1_k2_r-hoer-neu.mp3",
    "u1.k2.ben-intro": "/audio/english/unit1/u1_k2_ben-intro.mp3",
    "u1.k2.muster-pronouns": "/audio/english/unit1/u1_k2_muster-pronouns.mp3",
    "u1.k1.sam-hello": "/audio/english/unit1/u1_k1_sam-hello.mp3",
    "u1.k1.d-from": "/audio/english/unit1/u1_k1_d-from.mp3",
    "u1.k2.where-ben-from": "/audio/english/unit1/u1_k2_where-ben-from.mp3",
    "u1.k2.do-you-like": "/audio/english/unit1/u1_k2_do-you-like.mp3",
    "u1.k2.r-do-you-know": "/audio/english/unit1/u1_k2_r-do-you-know.mp3",
    "u1.k2.r-recap": "/audio/english/unit1/u1_k2_r-recap.mp3",
    "u1.k2.r-where-mia": "/audio/english/unit1/u1_k2_r-where-mia.mp3",
    "u1.k1.d-old": "/audio/english/unit1/u1_k1_d-old.mp3",
    "u1.k2.check-hoer": "/audio/english/unit1/u1_k2_check-hoer.mp3",
    "u1.k1.mia": "/audio/english/unit1/u1_k1_mia.mp3",
    "u1.k1.refresh1": "/audio/english/unit1/u1_k1_refresh1.mp3",
    "u1.k2.b-hoer1": "/audio/english/unit1/u1_k2_b-hoer1.mp3",
    "u1.k2.alex-intro": "/audio/english/unit1/u1_k2_alex-intro.mp3",
    "u1.k2.sophie-intro": "/audio/english/unit1/u1_k2_sophie-intro.mp3"
  };

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
