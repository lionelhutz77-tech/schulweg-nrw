/*
 * Deutsch (Joris) - Satzglieder bestimmen (Subjekt, Prädikat, Akkusativ-/Dativobjekt)
 * mit der Fragemethode. Aus seinen Arbeitsblättern (Prädikat/Akk./Dativobjekt),
 * eigene Beispielsätze. Zwei Themen: Tutor (lektionen) + Markieren (antippen).
 * Wird unter Klasse 4 UND 5 angeboten (falls Profil-Klasse abweicht).
 */
window.SCHULWEG = window.SCHULWEG || { faecher: {} };

window.SCHULWEG.faecher["deutsch-4"] = {
  fach: "Deutsch",
  klasse: 4,
  farbe: "deutsch",
  icon: "📖",
  themen: [
    {
      id: "tutor-satzglieder",
      titel: "Tutor: Satzglieder bestimmen",
      lektionen: [
        {
          titel: "1. Was sind Satzglieder?",
          erklaerung: [
            { text: "Ein Satz besteht aus Bausteinen – den Satzgliedern. Jedes Satzglied findest du mit einer bestimmten Frage. Die wichtigsten: Subjekt, Prädikat, Akkusativobjekt und Dativobjekt." },
            { titel: "Zwei Tricks", punkte: ["Fragemethode: die richtige Frage stellen (z. B. 'Wer?' findet das Subjekt).", "Umstellprobe: ein Satzglied lässt sich am Stück nach vorne schieben – so siehst du, was zusammengehört."] }
          ],
          check: {
            typ: "mc", frage: "Wie findest du ein Satzglied?",
            antworten: ["mit der passenden Frage", "indem ich rate", "mit der Anzahl der Buchstaben"],
            richtig: "mit der passenden Frage",
            erklaerung: "Jedes Satzglied hat seine eigene Frage.",
            fehler: { "indem ich rate": "Es gibt feste Fragen – damit musst du nicht raten.", "mit der Anzahl der Buchstaben": "Die Länge sagt nichts über das Satzglied. Es zählt die Frage." }
          }
        },
        {
          titel: "2. Das Subjekt (Wer oder was?)",
          erklaerung: [
            { text: "Das Subjekt ist die handelnde Person oder Sache. Du findest es mit der Frage 'Wer oder was?'." },
            { titel: "Beispiel", text: "Der kleine Hund bellt. – Frage: Wer bellt? → 'Der kleine Hund' (das ganze Satzglied!)." }
          ],
          check: {
            typ: "mc", frage: "Mit welcher Frage findest du das Subjekt?",
            antworten: ["Wer oder was?", "Wen oder was?", "Wem?"],
            richtig: "Wer oder was?",
            erklaerung: "Das Subjekt findest du mit 'Wer oder was?'.",
            fehler: { "Wen oder was?": "Das findet das Akkusativobjekt.", "Wem?": "Das findet das Dativobjekt." }
          }
        },
        {
          titel: "3. Das Prädikat (Was tut/geschieht?)",
          erklaerung: [
            { text: "Das Prädikat ist die Satzaussage – es sagt, was passiert. Frage: 'Was tut ...?' oder 'Was geschieht?'. Es ist immer ein Verb." },
            { titel: "Achtung: mehrteilig", text: "Manchmal besteht das Prädikat aus zwei Teilen, z. B. 'hat ... gefangen' (Hilfsverb + Vollverb) oder 'will ... spielen' (Modalverb + Vollverb)." }
          ],
          check: {
            typ: "mc", frage: "'Der Hund bellt laut.' – Was ist das Prädikat?",
            antworten: ["bellt", "Der Hund", "laut"],
            richtig: "bellt",
            erklaerung: "Frage: Was tut der Hund? → bellt.",
            fehler: { "Der Hund": "Das ist das Subjekt (Wer bellt?).", "laut": "Das beschreibt nur, WIE er bellt." }
          }
        },
        {
          titel: "4. Das Akkusativobjekt (Wen oder was?)",
          erklaerung: [
            { text: "Das Akkusativobjekt ist die Ergänzung, die auf die Frage 'Wen oder was?' antwortet." },
            { titel: "Beispiel", text: "Tom isst einen Apfel. – Frage: Wen oder was isst Tom? → 'einen Apfel'." }
          ],
          check: {
            typ: "mc", frage: "'Anna liest ein Buch.' – Was ist das Akkusativobjekt?",
            antworten: ["ein Buch", "Anna", "liest"],
            richtig: "ein Buch",
            erklaerung: "Frage: Wen oder was liest Anna? → ein Buch.",
            fehler: { "Anna": "Das ist das Subjekt (Wer liest?).", "liest": "Das ist das Prädikat (Was tut Anna?)." }
          }
        },
        {
          titel: "5. Das Dativobjekt (Wem?)",
          erklaerung: [
            { text: "Das Dativobjekt antwortet auf die Frage 'Wem?'. Oft steht es zusätzlich zum Akkusativobjekt im Satz." },
            { titel: "Beispiel", text: "Ich gebe dem Kind ein Buch. – Wem gebe ich ein Buch? → 'dem Kind' (Dativ). Wen oder was? → 'ein Buch' (Akkusativ)." }
          ],
          check: {
            typ: "mc", frage: "'Tom schenkt seiner Mutter Blumen.' – Was ist das Dativobjekt (Wem?)?",
            antworten: ["seiner Mutter", "Blumen", "Tom"],
            richtig: "seiner Mutter",
            erklaerung: "Frage: Wem schenkt Tom Blumen? → seiner Mutter.",
            fehler: { "Blumen": "Das ist das Akkusativobjekt (Was schenkt Tom?).", "Tom": "Das ist das Subjekt (Wer schenkt?)." }
          }
        },
        {
          titel: "6. Die Umstellprobe",
          erklaerung: [
            { text: "Mit der Umstellprobe prüfst du, was ein Satzglied ist: Schiebe es am Stück nach vorne. Bleibt der Satz richtig, war es ein Satzglied." },
            { titel: "Wichtig", text: "Im Aussagesatz steht das gebeugte Verb (Prädikat) immer an ZWEITER Stelle – egal, was vorne steht. Beispiel: 'Heute spielt Tom im Garten.'" }
          ],
          check: {
            typ: "mc", frage: "An welcher Stelle steht im Aussagesatz das gebeugte Verb?",
            antworten: ["an zweiter Stelle", "am Satzende", "an erster Stelle"],
            richtig: "an zweiter Stelle",
            erklaerung: "Im Aussagesatz steht das gebeugte Verb immer an zweiter Stelle.",
            fehler: { "am Satzende": "Das ist im Nebensatz so, nicht im normalen Aussagesatz.", "an erster Stelle": "An erster Stelle steht ein anderes Satzglied; das Verb folgt an zweiter Stelle." }
          }
        }
      ]
    },
    {
      id: "satzglieder-markieren",
      titel: "Satzglieder markieren",
      seiten: "antippen statt unterstreichen",
      voraussetzung: "die Fragen kennen (Wer? Was tut? Wen/was? Wem?)",
      intro: "Tippe im Satz die Wörter an, die das gefragte Satzglied bilden. Ein Satzglied kann aus mehreren Wörtern bestehen – tippe dann alle an. Dann auf Überprüfen.",
      aufgaben: [
        { typ: "markieren", frage: "Markiere das Prädikat.", satz: "Der Hund frisst einen Knochen.", richtig: [2], erklaerung: "Frage: Was tut der Hund? → frisst.", tipp: "Frag: Was tut der Hund?" },
        { typ: "markieren", frage: "Markiere das Subjekt.", satz: "Die Kinder spielen im Garten.", richtig: [0, 1], erklaerung: "Frage: Wer spielt? → Die Kinder (beide Wörter gehören dazu).", tipp: "Frag: Wer spielt?" },
        { typ: "markieren", frage: "Markiere das Prädikat.", satz: "Der Lehrer erklärt die Aufgabe.", richtig: [2], erklaerung: "Frage: Was tut der Lehrer? → erklärt.", tipp: "Frag: Was tut der Lehrer?" },
        { typ: "markieren", frage: "Markiere das Dativobjekt (Wem?).", satz: "Tom schenkt seiner Mutter Blumen.", richtig: [2, 3], erklaerung: "Frage: Wem schenkt Tom Blumen? → seiner Mutter.", tipp: "Frag: Wem ...?" },
        { typ: "markieren", frage: "Markiere das Akkusativobjekt (Wen oder was?).", satz: "Tom schenkt seiner Mutter Blumen.", richtig: [4], erklaerung: "Frage: Wen oder was schenkt Tom? → Blumen.", tipp: "Frag: Wen oder was ...?" },
        { typ: "markieren", frage: "Markiere das Akkusativobjekt.", satz: "Anna liest ein spannendes Buch.", richtig: [2, 3, 4], erklaerung: "Frage: Wen oder was liest Anna? → ein spannendes Buch (alle drei Wörter).", tipp: "Frag: Wen oder was liest Anna?" },
        { typ: "markieren", frage: "Markiere das Subjekt.", satz: "Die schwarze Katze schläft auf dem Sofa.", richtig: [0, 1, 2], erklaerung: "Frage: Wer schläft? → Die schwarze Katze.", tipp: "Frag: Wer schläft?" },
        { typ: "markieren", frage: "Markiere das Prädikat (es ist mehrteilig!).", satz: "Mein Bruder hat den Ball gefangen.", richtig: [2, 5], erklaerung: "Mehrteiliges Prädikat: hat (Hilfsverb) … gefangen (Vollverb). Beide Teile gehören dazu.", tipp: "Achte auf zwei Verb-Teile: hat … gefangen." }
      ]
    },
    {
      id: "satz-bauen",
      titel: "Sätze bauen (Umstellprobe)",
      voraussetzung: "die Satzglieder erkennen können",
      intro: "Tippe die Satzglieder der Reihe nach an, sodass ein richtiger Aussagesatz entsteht. Wichtig: Das gebeugte Verb steht an 2. Stelle. Oft gibt es mehrere richtige Lösungen!",
      aufgaben: [
        { typ: "satzbau", frage: "Baue einen richtigen Aussagesatz.", teile: ["Tom", "spielt", "im Garten"], praedikatIndex: 1, erklaerung: "Das Verb „spielt“ steht an 2. Stelle." },
        { typ: "satzbau", frage: "Baue einen richtigen Aussagesatz.", teile: ["Der Hund", "frisst", "einen Knochen"], praedikatIndex: 1, erklaerung: "Das Verb „frisst“ steht an 2. Stelle." },
        { typ: "satzbau", frage: "Baue einen richtigen Aussagesatz.", teile: ["Heute", "scheint", "die Sonne"], praedikatIndex: 1, erklaerung: "Auch wenn „Heute“ vorne steht: das Verb „scheint“ bleibt an 2. Stelle." },
        { typ: "satzbau", frage: "Baue einen richtigen Aussagesatz.", teile: ["Anna", "schenkt", "ihrer Freundin", "ein Buch"], praedikatIndex: 1, erklaerung: "„schenkt“ steht an 2. Stelle, danach folgen die Objekte." },
        { typ: "satzbau", frage: "Baue einen richtigen Aussagesatz.", teile: ["Am Morgen", "trinkt", "Papa", "einen Kaffee"], praedikatIndex: 1, erklaerung: "„trinkt“ bleibt an 2. Stelle, egal was vorne beginnt." },
        { typ: "satzbau", frage: "Baue einen richtigen Aussagesatz.", teile: ["Die Kinder", "bauen", "eine Sandburg"], praedikatIndex: 1, erklaerung: "„bauen“ steht an 2. Stelle." }
      ]
    }
  ]
};
