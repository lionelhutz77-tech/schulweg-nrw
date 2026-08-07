/*
 * Audio-Player: die EINZIGE Stelle, die tatsaechlich Ton erzeugt.
 * Die Lernlogik ruft niemals speechSynthesis oder <audio> direkt auf.
 *
 * Robustheit: fehlende Sprachsynthese, fehlende Datei oder ein Fehler beim
 * Abspielen duerfen die App nie zum Absturz bringen - es wird lediglich
 * "false" gemeldet, die Aufgabe laeuft mit sichtbarem Text weiter.
 */
(function (root, factory) {
  var api = factory(
    typeof module !== "undefined" && module.exports ? require("./registry.js") : root.SCHULWEG_AUDIO.registry
  );
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else { root.SCHULWEG_AUDIO = root.SCHULWEG_AUDIO || {}; root.SCHULWEG_AUDIO.player = api; }
})(typeof window !== "undefined" ? window : global, function (registry) {
  "use strict";

  function ttsVerfuegbar(umgebung) {
    var w = umgebung || (typeof window !== "undefined" ? window : null);
    return !!(w && w.speechSynthesis && typeof w.SpeechSynthesisUtterance === "function");
  }

  function faehigkeiten(umgebung) {
    return { dateien: registry.DATEIEN, ttsVerfuegbar: ttsVerfuegbar(umgebung) };
  }

  /**
   * Spielt eine AudioRef ab.
   * @returns {{gespielt: boolean, typ: string, text: string}}
   *   gespielt=false ist KEIN Fehler - der Aufrufer zeigt dann nur den Text.
   */
  function spiele(ref, umgebung) {
    var w = umgebung || (typeof window !== "undefined" ? window : null);
    var quelle = registry.loese(ref, faehigkeiten(w));

    if (quelle.typ === "tts") {
      try {
        w.speechSynthesis.cancel();
        var u = new w.SpeechSynthesisUtterance(quelle.text);
        u.lang = quelle.lang;
        u.rate = 0.9;            // etwas langsamer - Lernende Klasse 5/6
        w.speechSynthesis.speak(u);
        return { gespielt: true, typ: "tts", text: quelle.text };
      } catch (e) {
        return { gespielt: false, typ: "keins", text: quelle.text };
      }
    }

    if (quelle.typ === "datei") {
      try {
        var a = new w.Audio(quelle.url);
        var p = a.play();
        if (p && typeof p.catch === "function") p.catch(function () { /* still */ });
        return { gespielt: true, typ: "datei", text: quelle.text };
      } catch (e) {
        return { gespielt: false, typ: "keins", text: quelle.text };
      }
    }

    return { gespielt: false, typ: "keins", text: quelle.text };
  }

  function stoppe(umgebung) {
    var w = umgebung || (typeof window !== "undefined" ? window : null);
    try { if (w && w.speechSynthesis) w.speechSynthesis.cancel(); } catch (e) { /* still */ }
  }

  function kannAbspielen(ref, umgebung) {
    var w = umgebung || (typeof window !== "undefined" ? window : null);
    return registry.istVerfuegbar(ref, faehigkeiten(w));
  }

  return { spiele: spiele, stoppe: stoppe, kannAbspielen: kannAbspielen, ttsVerfuegbar: ttsVerfuegbar };
});
