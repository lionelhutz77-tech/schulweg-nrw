/*
 * Englisch Klasse 6 - Klausurvorbereitung (Theme 5: will/won't, Wetter,
 * Adverbien, Bahnhof, E-Mail). Aufgaben aus ChatGPT-Analyse, von Claude
 * auf App-Schema geprueft/korrigiert. Eigene Aufgaben, keine Buchkopien.
 *
 * Typen: "mc" | "text" (eindeutige Antwort, Gross/Klein egal) |
 *        "freitext" (freie Antwort -> KI gibt Feedback, kein richtig/falsch)
 */
window.SCHULWEG = window.SCHULWEG || { faecher: {} };

window.SCHULWEG.faecher["englisch-6"] = {
  fach: "Englisch",
  klasse: 6,
  farbe: "englisch",
  icon: "🇬🇧",
  themen: [
    {
      id: "klausur-theme5",
      titel: "Klausurvorbereitung (Theme 5)",
      voraussetzung: "einfache Zukunftssätze mit 'I'll' und den wichtigsten Wortschatz",
      intro:
        "Diese Übungen sind genau auf deine Klassenarbeit zugeschnitten: will/won't, Wetter, Adverbien, Bahnhof und das E-Mail-Schreiben. Sie werden langsam schwerer.",
      aufgaben: [
        {
          typ: "mc",
          frage: "Tomorrow it ____ rain.",
          antworten: ["will", "won't", "is"],
          richtig: "will",
          erklaerung: "Für Vorhersagen in der Zukunft nutzt du 'will'.",
          schritte: ["Achte auf 'Tomorrow' → Zukunft.", "Nutze 'will'."],
          fehler: {
            "won't": "'won't' heißt, dass etwas NICHT passiert. Hier ist eine normale Vorhersage gemeint → will.",
            "is": "'is' ist Gegenwart. Für morgen brauchst du die Zukunft mit 'will'."
          }
        },
        {
          typ: "text",
          frage: "Complete: I think it ___ (be) sunny tomorrow.",
          richtig: "will be",
          erklaerung: "Nach 'I think' und für morgen nutzt du will + Grundform: 'will be'.",
          schritte: ["Denke an die Zukunft (tomorrow).", "Setze 'will be' ein."],
          fehler: {
            "is": "Das ist Gegenwart. Für morgen brauchst du 'will be'.",
            "be": "'be' allein reicht nicht – es fehlt 'will'.",
            "will": "Es fehlt das 'be': richtig ist 'will be'."
          }
        },
        {
          typ: "mc",
          frage: "Choose the correct word: She runs ____.",
          antworten: ["quick", "quickly", "careful"],
          richtig: "quickly",
          erklaerung: "Wie jemand etwas tut, beschreibt ein Adverb (oft mit -ly).",
          schritte: ["Suche das Verb: runs.", "Beschreibe das Verb mit einem Adverb: quickly."],
          fehler: {
            "quick": "'quick' ist ein Adjektiv. Für das Verb brauchst du das Adverb 'quickly'.",
            "careful": "Passt inhaltlich nicht – und ist außerdem ein Adjektiv."
          }
        },
        {
          typ: "text",
          frage: "Complete: He is very ___ (careful / carefully) with his work.",
          richtig: "careful",
          erklaerung: "Nach 'is' (Form von to be) steht ein Adjektiv.",
          schritte: ["Erkenne to be: 'is'.", "Nach to be nutzt du ein Adjektiv: careful."],
          fehler: {
            "carefully": "Nach 'is' braucht man ein Adjektiv, kein Adverb – also 'careful'."
          }
        },
        {
          typ: "mc",
          frage: "Which word belongs to the train station?",
          antworten: ["platform", "snow", "tent"],
          richtig: "platform",
          erklaerung: "'platform' (Bahnsteig) gehört zum Bahnhof.",
          schritte: ["Denke an den Bahnhof.", "Wähle das passende Wort."],
          fehler: {
            "snow": "'snow' (Schnee) gehört zum Wetter.",
            "tent": "'tent' (Zelt) gehört zum Camping."
          }
        },
        {
          typ: "text",
          frage: "Complete: The train ___ (leave) from Platform 4 at 9 a.m.",
          richtig: "leaves",
          erklaerung: "Feste Fahrpläne stehen im Simple Present – bei 'the train' (it) mit -s.",
          schritte: ["Es geht um einen Fahrplan → Simple Present.", "Bei 'the train' (it) kommt ein -s dran: leaves."],
          fehler: {
            "leave": "Bei 'the train' (it) fehlt das -s: richtig ist 'leaves'.",
            "will leave": "Bei einem festen Fahrplan nimmt man das Simple Present: 'leaves'."
          }
        },
        {
          typ: "mc",
          frage: "It's minus five degrees. It's ____.",
          antworten: ["windy", "freezing", "sunny"],
          richtig: "freezing",
          erklaerung: "Bei Minusgraden ist es eiskalt: freezing.",
          schritte: ["Lies die Temperatur: minus five.", "Wähle das Wort für eiskalt: freezing."],
          fehler: {
            "windy": "'windy' (windig) sagt nichts über die Temperatur.",
            "sunny": "'sunny' (sonnig) passt nicht zu minus fünf Grad."
          }
        },
        {
          typ: "text",
          frage: "Complete: I hope it ___ rain tomorrow.",
          richtig: "won't",
          erklaerung: "Wenn du hoffst, dass etwas NICHT passiert, nutzt du 'won't' (= will not).",
          schritte: ["Achte auf 'I hope' – du wünschst dir etwas.", "Du willst KEINEN Regen → won't."],
          fehler: {
            "will": "'will' würde heißen, dass es regnet – das Gegenteil von dem, was man hofft.",
            "will not": "Richtig gedacht! Schreib nur die Kurzform: won't.",
            "doesn't": "Es geht um morgen (Zukunft): nutze 'won't'."
          }
        },
        {
          typ: "freitext",
          frage: "Finish with your own idea: 'I'll take my rain gear because ___.' (Schreibe einen ganzen Grund.)",
          musterloesung: "I'll take my rain gear because it will rain.",
          tipp: "Am besten mit 'will', z. B. 'because it will rain'."
        },
        {
          typ: "freitext",
          frage: "Write one sentence about your weekend: 'On Saturday I'll ___.'",
          musterloesung: "On Saturday I'll play football with my friends.",
          tipp: "Beginne mit 'On Saturday I'll' und schreibe einen ganzen Satz."
        },
        {
          typ: "freitext",
          frage: "Write one sentence with a reason: 'I think I'll ___ because ___.'",
          musterloesung: "I think I'll stay at home because it will rain.",
          tipp: "Verbinde eine Zukunftsabsicht (I'll …) mit einem Grund (because …)."
        },
        {
          typ: "freitext",
          frage: "Mini-E-Mail (4 Sätze): Erzähle deiner Freundin/deinem Freund vom nächsten Wochenende. Benutze: I'll, won't, because und ein Wetterwort.",
          musterloesung: "Hi! Next weekend I'll go camping with my family. I hope it won't rain because we want to hike. It will be sunny, so I'll take my sunglasses. See you soon!",
          tipp: "Schreibe 4 ganze Sätze und benutze alle vier: I'll, won't, because und ein Wetterwort."
        }
      ]
    }
  ]
};
