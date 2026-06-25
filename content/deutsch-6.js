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
          titel: "Noch mehr Stilmittel",
          erklaerung: [
            { text: "Neben Vergleich, Personifikation und Metapher gibt es weitere Stilmittel, die in Gedichten oft vorkommen:" },
            { punkte: ["Alliteration: mehrere Wörter beginnen mit demselben Laut (z. B. 'Milch macht müde Männer munter').", "Hyperbel: eine starke Übertreibung (z. B. 'Ich habe einen Riesenhunger').", "Wiederholung: ein Wort oder eine Zeile wird wiederholt, um etwas zu betonen.", "Lautmalerei: Wörter, die ein Geräusch nachahmen (z. B. 'zisch', 'summ')."] }
          ],
          check: {
            typ: "mc", frage: "'Wind und Wellen wüten wild.' – welches Stilmittel steckt darin?",
            antworten: ["Alliteration", "Hyperbel", "Vergleich"],
            richtig: "Alliteration",
            erklaerung: "Mehrere Wörter beginnen mit demselben Laut (W) → Alliteration.",
            fehler: { "Hyperbel": "Eine Hyperbel ist eine Übertreibung. Hier ist es der gleiche Anfangslaut → Alliteration.", "Vergleich": "Ein Vergleich hätte ein 'wie'. Hier zählt der gleiche Anfangslaut → Alliteration." }
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
    },
    {
      id: "gedichte-profi",
      titel: "Gedichte: mehr Übung (schwerer)",
      seiten: "extra: Stilmittel, Reim & Form",
      voraussetzung: "die Grundlagen (Vergleich/Personifikation/Metapher) kennen",
      intro: "Ein großer Übungsfundus für die Arbeit: sprachliche Bilder (auch Alliteration & Hyperbel), Reimschema, Verse & Strophen, Wirkung deuten und Zusammenfassen. Lass dir Zeit und übe in Ruhe.",
      aufgaben: [
        { typ: "mc", frage: "'Der Mond ist eine Silbermünze am Himmel.' – welches sprachliche Bild ist das?", antworten: ["Metapher", "Vergleich", "Personifikation"], richtig: "Metapher", erklaerung: "Bildlicher Ausdruck OHNE 'wie' → Metapher.", schritte: ["Kein 'wie' vorhanden.", "Der Mond wird bildlich zu einer Silbermünze → Metapher."], fehler: { "Vergleich": "Ein Vergleich hätte ein 'wie' (z. B. 'wie eine Silbermünze').", "Personifikation": "Hier bekommt der Mond keine menschliche Handlung." } },
        { typ: "mc", frage: "'Müde Möwen segeln über das Meer.' – welches Stilmittel steckt in den M-Wörtern?", antworten: ["Alliteration", "Vergleich", "Hyperbel"], richtig: "Alliteration", erklaerung: "Mehrere Wörter mit demselben Anfangslaut (M) → Alliteration.", schritte: ["Achte auf den Anfangslaut.", "Müde, Möwen, Meer beginnen mit M → Alliteration."], fehler: { "Vergleich": "Es gibt kein 'wie'.", "Hyperbel": "Es wird nichts übertrieben." } },
        { typ: "mc", frage: "'Ich habe dir das schon tausendmal gesagt!' – welches Stilmittel?", antworten: ["Hyperbel (Übertreibung)", "Vergleich", "Metapher"], richtig: "Hyperbel (Übertreibung)", erklaerung: "'tausendmal' ist stark übertrieben → Hyperbel.", schritte: ["Ist das wörtlich gemeint? Nein.", "Es ist eine starke Übertreibung → Hyperbel."], fehler: { "Vergleich": "Kein 'wie' und kein Vergleich zweier Dinge.", "Metapher": "Es ist kein bildlicher Begriff, sondern eine Übertreibung." } },
        { typ: "mc", frage: "'Der Wind flüstert leise durch die Bäume.' – welches Bild?", antworten: ["Personifikation", "Vergleich", "Metapher"], richtig: "Personifikation", erklaerung: "Der Wind 'flüstert' wie ein Mensch → Personifikation.", schritte: ["Tut hier etwas Menschliches? Ja: flüstern.", "→ Personifikation."], fehler: { "Vergleich": "Es fehlt das 'wie'.", "Metapher": "Hier handelt der Wind menschlich → Personifikation." } },
        { typ: "mc", frage: "'Stark wie ein Löwe kämpfte der Ritter.' – welches Bild?", antworten: ["Vergleich", "Metapher", "Personifikation"], richtig: "Vergleich", erklaerung: "Das Wort 'wie' macht es zum Vergleich.", schritte: ["Signalwort 'wie' suchen.", "→ Vergleich."], fehler: { "Metapher": "Eine Metapher hat KEIN 'wie'.", "Personifikation": "Es wird nichts vermenschlicht." } },
        { typ: "mc", frage: "'Nie, nie, nie gebe ich auf!' – welches Stilmittel?", antworten: ["Wiederholung", "Alliteration", "Vergleich"], richtig: "Wiederholung", erklaerung: "Das Wort 'nie' wird wiederholt, um es zu betonen.", schritte: ["Welches Wort kommt mehrfach? 'nie'.", "→ Wiederholung."], fehler: { "Alliteration": "Bei der Alliteration beginnen verschiedene Wörter mit demselben Laut.", "Vergleich": "Es gibt kein 'wie'." } },
        { typ: "text", frage: "Wie nennt man ein sprachliches Bild MIT dem Wort 'wie'?", richtig: "Vergleich", erklaerung: "Mit 'wie' oder 'als' → Vergleich.", schritte: ["'wie' ist das Signalwort.", "→ Vergleich."], fehler: { "Metapher": "Die Metapher hat KEIN 'wie'.", "Personifikation": "Die Personifikation vermenschlicht etwas." } },
        { typ: "text", frage: "Wie nennt man eine starke Übertreibung wie 'Ich sterbe vor Hunger'?", richtig: "Hyperbel", erklaerung: "Starke Übertreibung → Hyperbel.", schritte: ["Etwas wird stark übertrieben.", "→ Hyperbel."], fehler: { "Vergleich": "Eine Übertreibung ist kein Vergleich.", "Metapher": "Es ist eine Übertreibung, kein bildlicher Begriff." } },
        { typ: "mc", frage: "Ein Gedicht reimt sich so: Zeile 1+2 reimen, Zeile 3+4 reimen. Welches Reimschema?", antworten: ["Paarreim (aabb)", "Kreuzreim (abab)", "umarmender Reim (abba)"], richtig: "Paarreim (aabb)", erklaerung: "Direkt aufeinanderfolgende Zeilen reimen → Paarreim (aabb).", schritte: ["1+2 und 3+4 → aabb.", "Das ist der Paarreim."], fehler: { "Kreuzreim (abab)": "Beim Kreuzreim reimen 1+3 und 2+4.", "umarmender Reim (abba)": "Beim umarmenden Reim reimen 1+4 und 2+3." } },
        { typ: "mc", frage: "Zeile 1 reimt mit Zeile 4, Zeile 2 mit Zeile 3. Welches Reimschema?", antworten: ["umarmender Reim (abba)", "Paarreim (aabb)", "Kreuzreim (abab)"], richtig: "umarmender Reim (abba)", erklaerung: "Der äußere Reim (1+4) umschließt den inneren (2+3) → abba.", schritte: ["1+4 außen, 2+3 innen.", "→ umarmender Reim (abba)."], fehler: { "Paarreim (aabb)": "Beim Paarreim reimen 1+2 und 3+4.", "Kreuzreim (abab)": "Beim Kreuzreim reimen 1+3 und 2+4." } },
        { typ: "text", frage: "Wie heißt eine einzelne Zeile in einem Gedicht (Fachwort)?", richtig: "Vers", erklaerung: "Eine Zeile im Gedicht heißt Vers.", schritte: ["Fachwort für die Zeile.", "→ Vers."], fehler: { "Zeile": "Richtig gedacht – das Fachwort dafür ist 'Vers'.", "Strophe": "Eine Strophe ist ein Block aus mehreren Versen." } },
        { typ: "text", frage: "Wie heißt ein Block aus mehreren Versen (Fachwort)?", richtig: "Strophe", erklaerung: "Mehrere Verse bilden eine Strophe.", schritte: ["Mehrere Verse zusammen.", "→ Strophe."], fehler: { "Vers": "Ein Vers ist nur eine einzelne Zeile.", "Absatz": "Im Gedicht heißt der Block 'Strophe'." } },
        { typ: "mc", frage: "In welcher Zeitform schreibst du die Inhaltszusammenfassung?", antworten: ["Präsens", "Präteritum", "Futur"], richtig: "Präsens", erklaerung: "Zusammenfassungen stehen im Präsens.", schritte: ["Inhaltsangabe → immer Präsens."], fehler: { "Präteritum": "Auch bei alten Gedichten: Präsens.", "Futur": "Die Zukunft passt nicht." } },
        { typ: "mc", frage: "Ein Erscheinungsjahr ist angegeben. Was gehört in den Einleitungssatz?", antworten: ["Titel, Autor, Textsorte, Thema UND das Jahr (TATTE)", "nur der Titel", "nur die eigene Meinung"], richtig: "Titel, Autor, Textsorte, Thema UND das Jahr (TATTE)", erklaerung: "Mit Jahr wird aus TATT → TATTE (E = Erscheinungsjahr).", schritte: ["Steht ein Jahr dabei?", "Dann gehört es mit in den Einleitungssatz → TATTE."], fehler: { "nur der Titel": "Es gehören Titel, Autor, Textsorte, Thema und das Jahr hinein.", "nur die eigene Meinung": "Die Meinung kommt erst in der Stellungnahme." } },
        { typ: "freitext", frage: "Erkläre die Wirkung dieser Personifikation: 'Die alten Bäume ächzen im Sturm.'", kriterien: "benennt die Personifikation; erklärt die Wirkung (z. B. die Bäume wirken lebendig/leidend, es entsteht eine bedrohliche Stimmung).", musterloesung: "'Die Bäume ächzen' ist eine Personifikation. Sie bewirkt, dass die Bäume wie leidende Lebewesen wirken und eine bedrohliche, unheimliche Stimmung entsteht.", tipp: "Erst das Bild benennen, dann die Wirkung/Stimmung erklären." },
        { typ: "freitext", frage: "Schreibe selbst einen Satz mit einer Personifikation über das Wetter.", kriterien: "enthält eine Personifikation (etwas Unbelebtes tut etwas Menschliches); ein vollständiger, sinnvoller Satz.", musterloesung: "Die Sonne lächelt warm über den Feldern.", tipp: "Lass das Wetter etwas Menschliches tun (lachen, weinen, flüstern …)." },
        { typ: "freitext", frage: "Korrigiere diese Zusammenfassung, damit sie SACHLICH ist: 'Ich finde das Gedicht voll schön, es geht glaube ich um den Herbst.'", kriterien: "ohne eigene Meinung; sachlich; im Präsens; nennt das Thema klar.", musterloesung: "In dem Gedicht geht es um den Herbst.", tipp: "Meinung weg, keine Unsicherheit ('glaube ich'), sachlich im Präsens." }
      ]
    }
  ]
};
