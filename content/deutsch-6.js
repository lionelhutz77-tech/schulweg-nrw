/*
 * Deutsch Klasse 6 - Kurz-Klassenarbeit Nr. 6: Gedichte.
 * Schwerpunkt: STRATEGIE (lernweg) - wie man die Aufgabe angeht -,
 * dann Übungen + Schreibaufgaben mit KI-Feedback.
 * Quelle: Lehrer-Mail (Themen) + Gedicht "Ich und mein Regenschirm"
 * (Hanna Harnisch 1921, Klartext 6 S.111). Nur kurze Zitat-Schnipsel,
 * kein voller Gedichttext (Urheberrecht; Kind hat das Buch).
 */
window.SCHULWEG = window.SCHULWEG || { faecher: {} };

window.SCHULWEG.faecher["deutsch-6"] = {
  fach: "Deutsch",
  klasse: 6,
  farbe: "deutsch",
  icon: "📖",
  themen: [
    {
      id: "gedichte-strategie",
      titel: "Gedichte: Inhalt & sprachliche Bilder",
      seiten: "Klartext S.22, 23, 111",
      wozu: "Damit du bei JEDEM Gedicht weißt, wie du rangehst – egal welches in der Arbeit drankommt.",
      lernweg: [
        {
          titel: "Was wird in der Arbeit verlangt?",
          text: "Zwei Dinge: (1) Du schreibst eine kurze Inhaltszusammenfassung eines Gedichts. (2) Du erkennst die sprachlichen Bilder (Vergleich, Personifikation, Metapher), markierst sie und schreibst sie mit ihrer Wirkung in eine Tabelle."
        },
        {
          titel: "Strategie 1: Eine Inhaltszusammenfassung schreiben",
          schritte: [
            "Lies das Gedicht zweimal in Ruhe.",
            "Einleitungssatz: Titel, Autor(in), Jahr, Textart (Gedicht) und das Thema in EINEM Satz.",
            "Fasse den Inhalt knapp in EIGENEN Worten zusammen – Strophe für Strophe nur das Wichtigste.",
            "Schreibe im Präsens (Gegenwart).",
            "Keine Zitate, keine Reime nachsprechen, KEINE eigene Meinung.",
            "Kurz und sachlich halten."
          ]
        },
        {
          titel: "Die drei sprachlichen Bilder",
          punkte: [
            "Vergleich: Zwei Dinge werden mit 'wie' oder 'als' verglichen. Erkennungszeichen: das Wort 'wie'. Beispiel: stark 'wie' ein Bär. Wirkung: macht etwas anschaulich.",
            "Personifikation: Ein Gegenstand, ein Tier oder die Natur bekommt menschliche Eigenschaften oder tut etwas Menschliches. Erkennung: ein Ding 'lacht', 'schimpft', 'schläft'. Wirkung: macht lebendig und gibt Gefühle.",
            "Metapher: Ein bildlicher Ausdruck, der nicht wörtlich gemeint ist (OHNE 'wie'). Beispiel: 'ein Meer aus Tränen'. Wirkung: verdichtet ein Bild, macht es anschaulich."
          ]
        },
        {
          titel: "Strategie 2: Sprachliche Bilder finden & deuten",
          schritte: [
            "Geh das Gedicht Zeile für Zeile durch.",
            "Frag bei jeder Stelle: Tut hier ein Ding etwas, das nur Menschen können? → Personifikation. Steht ein 'wie'/'als'? → Vergleich. Ist ein Ausdruck bildlich (nicht wörtlich)? → Metapher.",
            "Schreibe eine Tabelle mit drei Spalten: Textstelle | Art des Bildes | Wirkung.",
            "Erkläre die Wirkung: Was bewirkt das Bild beim Leser (z. B. lebendig, anschaulich, lustig)?"
          ]
        },
        {
          titel: "Das Gedicht in dieser Arbeit",
          text: "'Ich und mein Regenschirm' von Hanna Harnisch (1921) – du findest es in Klartext 6, S. 111. Leg es dir beim Üben daneben. Tipp: Im ganzen Gedicht wird der Regenschirm wie eine Person behandelt – ein perfektes Jagdrevier für Personifikationen."
        },
        {
          titel: "Beispiel: So sieht die Tabelle aus",
          punkte: [
            "'Mein Schirm lacht' → Personifikation. Wirkung: Der Schirm wirkt fröhlich und lebendig, fast wie ein guter Freund.",
            "'mault mein Schirm' / 'schimpft aufs Wetter' → Personifikation. Wirkung: Der Schirm bekommt schlechte Laune wie ein Mensch.",
            "'Arm in Arm gehen wir spaziern' → Personifikation. Wirkung: Schirm und Ich wirken wie ein Paar, das zusammen unterwegs ist.",
            "'seine Laune bessern muss' → Personifikation. Wirkung: Der Schirm hat Launen wie ein Mensch."
          ]
        }
      ],
      aufgaben: [
        {
          typ: "mc",
          frage: "'stark wie ein Bär' – welches sprachliche Bild ist das?",
          antworten: ["Vergleich", "Personifikation", "Metapher"],
          richtig: "Vergleich",
          erklaerung: "Das Wort 'wie' ist das Erkennungszeichen für einen Vergleich.",
          schritte: ["Suche das Signalwort: 'wie'.", "'wie' → Vergleich."],
          fehler: {
            "Personifikation": "Hier bekommt nichts menschliche Eigenschaften. Das 'wie' macht es zum Vergleich.",
            "Metapher": "Eine Metapher hat KEIN 'wie'. Hier steht 'wie' → also Vergleich."
          }
        },
        {
          typ: "mc",
          frage: "'Der Wind heult um das Haus.' – welches Bild ist das?",
          antworten: ["Personifikation", "Vergleich", "Metapher"],
          richtig: "Personifikation",
          erklaerung: "Heulen ist menschlich/tierisch – der Wind bekommt es → Personifikation.",
          schritte: ["Tut hier ein Ding etwas Menschliches? Ja: heulen.", "→ Personifikation."],
          fehler: {
            "Vergleich": "Es gibt kein 'wie'. Der Wind selbst 'heult' → Personifikation.",
            "Metapher": "Hier handelt ein Ding menschlich (heulen) → das ist eine Personifikation."
          }
        },
        {
          typ: "mc",
          frage: "Im Gedicht: 'Mein Schirm lacht.' – welches Bild ist das?",
          antworten: ["Personifikation", "Vergleich", "Metapher"],
          richtig: "Personifikation",
          erklaerung: "Der Schirm 'lacht' wie ein Mensch → Personifikation.",
          schritte: ["Ein Schirm kann nicht wirklich lachen.", "Er bekommt eine menschliche Handlung → Personifikation."],
          fehler: {
            "Vergleich": "Es fehlt das 'wie'. Der Schirm selbst lacht → Personifikation.",
            "Metapher": "Hier handelt der Schirm menschlich (lachen) → Personifikation."
          }
        },
        {
          typ: "mc",
          frage: "Was gehört NICHT in eine Inhaltszusammenfassung?",
          antworten: ["die eigene Meinung", "der Titel und die Autorin", "das Thema"],
          richtig: "die eigene Meinung",
          erklaerung: "Eine Zusammenfassung ist sachlich – ohne eigene Meinung.",
          schritte: ["Zusammenfassung = nur der Inhalt, sachlich.", "Meinung gehört nicht hinein."],
          fehler: {
            "der Titel und die Autorin": "Die gehören in den Einleitungssatz – also schon hinein.",
            "das Thema": "Das Thema nennst du im Einleitungssatz – gehört hinein."
          }
        },
        {
          typ: "mc",
          frage: "In welcher Zeitform schreibt man eine Inhaltszusammenfassung?",
          antworten: ["Präsens (Gegenwart)", "Präteritum (Vergangenheit)", "Futur (Zukunft)"],
          richtig: "Präsens (Gegenwart)",
          erklaerung: "Zusammenfassungen schreibt man im Präsens.",
          schritte: ["Inhaltsangabe/Zusammenfassung → immer Präsens.", "Also Gegenwart."],
          fehler: {
            "Präteritum (Vergangenheit)": "Auch wenn das Gedicht alt ist – die Zusammenfassung steht im Präsens.",
            "Futur (Zukunft)": "Die Zukunft passt nicht. Zusammenfassungen stehen im Präsens."
          }
        },
        {
          typ: "freitext",
          frage: "Schreibe eine kurze Inhaltszusammenfassung (3–4 Sätze) zum Gedicht 'Ich und mein Regenschirm'. Denk an: Titel, Autorin, Textart (Gedicht) und worum es geht.",
          kriterien: "Präsens (Gegenwart); eigene Worte; KEINE eigene Meinung und keine Gefühle; Titel, Autorin und Textart (Gedicht) im Einleitungssatz genannt; Inhalt knapp und sachlich.",
          musterloesung: "In dem Gedicht 'Ich und mein Regenschirm' von Hanna Harnisch (1921) geht es um einen Regenschirm, der wie ein Mensch beschrieben wird. Wenn es regnet, ist der Schirm fröhlich und begleitet das Ich beim Spaziergang. Scheint die Sonne, ist der Schirm schlecht gelaunt und steht nutzlos herum. Am Ende stellt sich das Ich extra in den Regen, damit der Schirm wieder gute Laune bekommt.",
          tipp: "Präsens, eigene Worte, keine Meinung. Beginne mit einem Einleitungssatz (Titel, Autorin, Gedicht)."
        },
        {
          typ: "freitext",
          frage: "Suche eine Personifikation im Gedicht und erkläre ihre Wirkung in 1–2 Sätzen.",
          kriterien: "Eine konkrete Textstelle aus dem Gedicht genannt; richtig als Personifikation erkannt; die Wirkung auf den Leser erklärt (z. B. lebendig, fröhlich).",
          musterloesung: "'Mein Schirm lacht' ist eine Personifikation. Sie bewirkt, dass der Schirm fröhlich und lebendig wirkt, fast wie ein guter Freund des Ichs.",
          tipp: "Nenne die Textstelle und erkläre, was sie beim Leser bewirkt (z. B. lebendig, fröhlich)."
        }
      ]
    }
  ]
};
