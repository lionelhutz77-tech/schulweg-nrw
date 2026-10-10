/* Altersgerechte, datensparsame Lernwerkzeuge fuer alle Faecher. */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else {
    root.SCHULWEG = root.SCHULWEG || { faecher: {} };
    root.SCHULWEG.lernWerkzeuge = api;
  }
})(typeof window !== "undefined" ? window : global, function () {
  "use strict";

  var MODI = [
    { id: "mindmap", icon: "🧠", label: "Mindmap", auftrag: "Erstelle eine einfache Mindmap mit einem Hauptbegriff und hoechstens drei Ebenen." },
    { id: "summary", icon: "📝", label: "Zusammenfassung", auftrag: "Fasse das Thema in hoechstens sieben kurzen Stichpunkten zusammen." },
    { id: "simple", icon: "🌱", label: "Ganz einfach", auftrag: "Erklaere das Thema in besonders einfachen Saetzen und fuehre neue Fachwoerter einzeln ein." },
    { id: "explain", icon: "💡", label: "Erklaeren", auftrag: "Erklaere zuerst die Grundidee und danach den wichtigsten Zusammenhang Schritt fuer Schritt." },
    { id: "example", icon: "🎯", label: "Beispiel", auftrag: "Zeige zwei neue, altersgerechte Beispiele und erklaere jeweils den Loesungsweg." },
    { id: "analogy", icon: "🌉", label: "Vergleich", auftrag: "Nutze einen passenden Alltagsvergleich und sage auch, wo der Vergleich nicht mehr passt." },
    { id: "steps", icon: "👣", label: "Schritte", auftrag: "Gib eine kurze Schritt-fuer-Schritt-Anleitung, die ich beim Ueben abarbeiten kann." },
    { id: "flashcards", icon: "🗂️", label: "Lernkarten", auftrag: "Erstelle acht kurze Frage-Antwort-Lernkarten ohne die Antwort in der Frage zu verraten." },
    { id: "quiz", icon: "🎲", label: "Quiz", auftrag: "Stelle fuenf abwechslungsreiche Fragen nacheinander. Warte jeweils meine Antwort ab und erklaere Fehler freundlich." },
    { id: "questions", icon: "❓", label: "Fragen", auftrag: "Stelle mir erst drei Verstaendnisfragen und passe die naechste Frage an meine vorherige Antwort an." },
    { id: "compare", icon: "⚖️", label: "Vergleichen", auftrag: "Vergleiche die zwei wichtigsten Begriffe oder Vorgehensweisen in einer kleinen Tabelle." },
    { id: "review", icon: "🔁", label: "Wiederholen", auftrag: "Fuehre eine kurze aktive Wiederholung durch: abrufen, Rueckmeldung, neuer Versuch, Abschlusscheck." }
  ];

  function findeModus(id) {
    return MODI.filter(function (modus) { return modus.id === id; })[0] || null;
  }

  function baueAuftrag(optionen) {
    var modus = findeModus(optionen.modus);
    if (!modus) throw new Error("Unbekanntes Lernwerkzeug.");
    var klasse = Number(optionen.klasse);
    if (!Number.isInteger(klasse) || klasse < 4 || klasse > 7) throw new Error("Ungueltige Klassenstufe.");
    var fach = String(optionen.fach || "").trim().slice(0, 40);
    var thema = String(optionen.thema || "").trim().slice(0, 100);
    if (!fach || !thema) throw new Error("Fach und Thema werden benoetigt.");
    var seiten = String(optionen.seiten || "").trim().slice(0, 50);
    return [
      "Du bist ein geduldiger Lernbegleiter fuer Klasse " + klasse + " an einer Gesamtschule in NRW.",
      "Fach: " + fach + ". Thema: " + thema + (seiten ? ". Orientierung: " + seiten : "") + ".",
      modus.auftrag,
      "Nutze eigene Beispiele und kopiere keine Schulbuchtexte. Setze kein Vorwissen voraus, das nicht genannt wurde.",
      "Kein Zeitdruck, keine Rangliste und keine beschämende Sprache. Bei Fehlern: erst Denkfehler erklaeren, dann einen kleinen Hinweis geben und einen neuen Versuch ermoeglichen.",
      "Frage nicht nach Name, Schule, Adresse, Wohnort oder anderen persoenlichen Daten."
    ].join("\n");
  }

  return { MODI: MODI, findeModus: findeModus, baueAuftrag: baueAuftrag };
});
