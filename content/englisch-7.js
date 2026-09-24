/* Allgemeine, jahrgangsunabhängige Lernmethoden aus den lokal ausgewerteten Videos. */
window.SCHULWEG = window.SCHULWEG || { faecher: {} };
window.SCHULWEG.faecher["englisch-7"] = {
  fach: "Englisch",
  klasse: 7,
  farbe: "englisch",
  icon: "🇬🇧",
  themen: [{
    id: "lerntraining-aktiv",
    titel: "Englisch wirksam lernen",
    seiten: "allgemeine Lernroutine",
    voraussetzung: "ein aktuelles Englischthema aus der Schule",
    intro: "Lerne in kurzen Runden: erst ohne Hilfe erinnern, dann prüfen, Fehler gezielt wiederholen und die Wörter in eigenen Sätzen laut verwenden. Verteile das Lernen über mehrere Tage. Sobald konkrete Unterlagen für Klasse 7 vorliegen, kommen hier passende Aufgaben dazu.",
    aufgaben: [
      { typ: "mc", frage: "Which method helps you remember words for longer?", antworten: ["Short reviews on several days", "Reading the list once", "Copying every word ten times at once"], richtig: "Short reviews on several days", erklaerung: "Spaced practice strengthens memory over time." },
      { typ: "mc", frage: "What should you do before you look at the answer?", antworten: ["Try to remember it", "Skip the task", "Read the answer aloud first"], richtig: "Try to remember it", erklaerung: "Active recall makes your brain retrieve the knowledge." },
      { typ: "mc", frage: "How can you practise a new word actively?", antworten: ["Use it in your own sentence", "Only underline it", "Only read its German meaning"], richtig: "Use it in your own sentence", erklaerung: "Using a word in context connects meaning and grammar." },
      { typ: "mc", frage: "What is a useful final step after a mistake?", antworten: ["Explain the correction and try again", "Hide the mistake", "Start a completely new topic"], richtig: "Explain the correction and try again", erklaerung: "A correction becomes useful when you understand and retrieve it again." }
    ]
  }]
};
