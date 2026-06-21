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
          kriterien: "Präsens (Gegenwart); eigene Worte; KEINE eigene Meinung und keine Gefühle; im Einleitungssatz Titel, Autorin, Erscheinungsjahr (1921) und Textart (Gedicht) genannt (TATTE); Inhalt knapp und sachlich.",
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
    },
    {
      id: "tutor-gedicht",
      titel: "Tutor: Gedicht untersuchen (Schritt für Schritt)",
      seiten: "Klartext S.110–111 (Methode)",
      lektionen: [
        {
          titel: "1. Die Aufgabe aufschlüsseln",
          erklaerung: [
            { text: "Bevor du losschreibst, schlüssle die Aufgabe auf. Markiere die OPERATOREN – das sind die Tu-Wörter wie 'untersuche', 'erkläre', 'beschreibe', 'nimm Stellung'. Jeder Operator sagt dir, WAS du tun sollst." },
            { titel: "Der rote Faden", text: "Eine Gedichtuntersuchung folgt fast immer dieser Reihenfolge: Einleitung (TATT) → Inhalt → Form → sprachliche Bilder & Deutung → Stellungnahme. TATT steht für Titel, Autor, Textsorte, Thema. (Steht ein Erscheinungsjahr dabei, wird daraus TATTE – dazu mehr in Lektion 2.)" }
          ],
          check: {
            typ: "mc", frage: "Wofür steht TATT im Einleitungssatz?",
            antworten: ["Titel, Autor, Textsorte, Thema", "Text, Aufgabe, Tabelle, Thema", "Titel, Absatz, Text, These"],
            richtig: "Titel, Autor, Textsorte, Thema",
            erklaerung: "TATT = Titel, Autor, Textsorte, Thema.",
            fehler: { "Text, Aufgabe, Tabelle, Thema": "Fast – aber es geht um Titel, Autor, Textsorte, Thema.", "Titel, Absatz, Text, These": "Nicht ganz: Titel, Autor, Textsorte, Thema." }
          }
        },
        {
          titel: "2. Der Einleitungssatz (TATT / TATTE)",
          erklaerung: [
            { text: "Der Einleitungssatz nennt in EINEM Satz: Titel (in Anführungszeichen), Autor(in), Textsorte (Gedicht) und worum es geht (Thema) – alles im Präsens. Merkhilfe: TATT." },
            { titel: "Wenn ein Jahr dabeisteht: TATTE", text: "Steht beim Gedicht ein Erscheinungsjahr, gehört es auch in den Einleitungssatz! Dann wird aus TATT → TATTE (das E steht für Erscheinungsjahr). Also: Titel, Autor, Textsorte, Thema UND das Jahr." },
            { titel: "Beispiel mit Jahr", text: "In dem Gedicht 'Sturmnacht' von Lena Berg aus dem Jahr 1995 geht es um einen nächtlichen Sturm, der ein kleines Dorf erschreckt." }
          ],
          check: {
            typ: "freitext",
            frage: "Schreibe einen Einleitungssatz für ein (erfundenes) Gedicht mit dem Titel 'Der erste Schnee' von Tom Velten aus dem Jahr 1987, in dem es um einen Jungen geht, der sich über den ersten Schnee freut.",
            kriterien: "Enthält Titel, Autor, Textsorte (Gedicht), das Erscheinungsjahr (1987) und das Thema; im Präsens; ein einziger Satz.",
            musterloesung: "In dem Gedicht 'Der erste Schnee' von Tom Velten aus dem Jahr 1987 geht es um einen Jungen, der sich über den ersten Schnee des Winters freut.",
            tipp: "Titel, Autor, 'Gedicht', das Erscheinungsjahr und das Thema – im Präsens."
          }
        },
        {
          titel: "3. Den Inhalt zusammenfassen",
          erklaerung: [
            { text: "Fasse den Inhalt in eigenen Worten zusammen – Strophe für Strophe nur das Wichtigste. Tipp: Gib jeder Strophe zuerst eine kurze Überschrift, daraus schreibst du dann die Zusammenfassung." },
            { titel: "Wichtig", punkte: ["Präsens (Gegenwart).", "Eigene Worte – keine Zitate, keine Reime nachsprechen.", "KEINE eigene Meinung (die kommt erst ganz am Ende)."] }
          ],
          check: {
            typ: "mc", frage: "Was gehört NICHT in die Inhaltszusammenfassung?",
            antworten: ["deine eigene Meinung", "das Thema", "der Ablauf der Strophen"],
            richtig: "deine eigene Meinung",
            erklaerung: "Die Zusammenfassung ist sachlich – deine Meinung kommt erst in der Stellungnahme.",
            fehler: { "das Thema": "Das Thema gehört durchaus hinein.", "der Ablauf der Strophen": "Genau den fasst du ja zusammen." }
          }
        },
        {
          titel: "4. Die Form beschreiben",
          erklaerung: [
            { text: "Bei der Form beschreibst du den Aufbau: Wie viele Strophen? Wie viele Verse (Zeilen) pro Strophe? Und das Reimschema." },
            { titel: "Die drei häufigsten Reimschemata", punkte: ["Paarreim (aabb): Zeile 1+2 reimen, 3+4 reimen.", "Kreuzreim (abab): Zeile 1+3 und 2+4 reimen.", "umarmender Reim (abba): Zeile 1+4 und 2+3 reimen."] }
          ],
          check: {
            typ: "mc", frage: "Ein Gedicht reimt sich so: Zeile 1 mit Zeile 3, Zeile 2 mit Zeile 4. Welches Reimschema ist das?",
            antworten: ["Kreuzreim (abab)", "Paarreim (aabb)", "umarmender Reim (abba)"],
            richtig: "Kreuzreim (abab)",
            erklaerung: "1+3 und 2+4 → das ist der Kreuzreim (abab).",
            fehler: { "Paarreim (aabb)": "Beim Paarreim reimen sich direkt aufeinanderfolgende Zeilen (1+2, 3+4).", "umarmender Reim (abba)": "Beim umarmenden Reim umschließt der äußere Reim (1+4) den inneren (2+3)." }
          }
        },
        {
          titel: "5. Sprachliche Bilder erkennen",
          erklaerung: [
            { text: "Sprachliche Bilder machen ein Gedicht anschaulich. Drei sind besonders wichtig:" },
            { punkte: ["Vergleich: mit 'wie' oder 'als' (z. B. 'kalt wie Eis').", "Personifikation: ein Ding/Tier/die Natur tut etwas Menschliches (z. B. 'die Sonne lacht').", "Metapher: ein bildlicher Ausdruck OHNE 'wie' (z. B. 'ein Meer aus Schnee')."] },
            { titel: "Schreib es in eine Tabelle", text: "Drei Spalten: Textstelle | Sprachliches Mittel | Erklärung → Wirkung." }
          ],
          check: {
            typ: "mc", frage: "'Der Wind tanzt durch die Nacht.' – welches sprachliche Bild ist das?",
            antworten: ["Personifikation", "Vergleich", "Metapher"],
            richtig: "Personifikation",
            erklaerung: "Der Wind 'tanzt' – das ist menschlich → Personifikation.",
            fehler: { "Vergleich": "Es gibt kein 'wie'. Der Wind selbst tanzt → Personifikation.", "Metapher": "Hier handelt ein Ding menschlich (tanzen) → Personifikation." }
          }
        },
        {
          titel: "6. Die Wirkung deuten",
          erklaerung: [
            { text: "Beim Deuten erklärst du die WIRKUNG: Was bewirkt das Bild beim Leser? Wirkt etwas lebendig, bedrohlich, fröhlich? Welche Stimmung entsteht?" },
            { titel: "Beispiel", text: "'Der Wind tanzt durch die Nacht' ist eine Personifikation. Wirkung: Der Wind wirkt lebendig und verspielt, fast wie ein Mensch, der tanzt." }
          ],
          check: {
            typ: "freitext",
            frage: "Erkläre die Wirkung von 'Die Sonne lacht vom Himmel' in 1–2 Sätzen.",
            kriterien: "benennt die Personifikation; erklärt die Wirkung (z. B. fröhlich, lebendig, die Sonne wirkt wie ein Mensch).",
            musterloesung: "'Die Sonne lacht' ist eine Personifikation. Sie bewirkt, dass der Tag fröhlich und freundlich wirkt, als würde sich die Sonne freuen.",
            tipp: "Nenne erst das Bild, dann die Wirkung."
          }
        },
        {
          titel: "7. Stellung nehmen",
          erklaerung: [
            { text: "Ganz am Ende sagst du deine eigene Meinung – aber IMMER begründet. Nutze das Wort 'weil'. Achtung: Deine Meinung gehört NUR hierher, nicht in die Inhaltszusammenfassung." }
          ],
          check: {
            typ: "freitext",
            frage: "Eine Schülerin sagt: 'Gedichte sind langweilig.' Nimm kurz begründet Stellung (1–2 Sätze).",
            kriterien: "enthält eine eigene Meinung und mindestens eine Begründung (z. B. mit 'weil').",
            musterloesung: "Ich finde nicht, dass Gedichte langweilig sind, weil sie mit wenigen Worten starke Bilder im Kopf erzeugen können.",
            tipp: "Meinung + Begründung mit 'weil'."
          }
        },
        {
          titel: "8. Dein Bauplan – fertig!",
          erklaerung: [
            { titel: "So gehst du jede Gedichtuntersuchung an", schritte: ["Aufgabe aufschlüsseln (Operatoren markieren).", "Einleitungssatz nach TATT.", "Inhalt zusammenfassen (Präsens, eigene Worte, keine Meinung).", "Form beschreiben (Strophen, Verse, Reimschema).", "Sprachliche Bilder + ihre Wirkung (Tabelle).", "Stellung nehmen – begründet."] },
            { text: "Tipp zum Schluss: Überarbeite deinen Text mit der Checkliste (Klartext S. 110)." }
          ]
        }
      ]
    }
  ]
};
