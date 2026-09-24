/*
 * Deutsch Klasse 7 - sachlich ueber Ereignisse berichten.
 * Fachliche Referenz: Klartext 7, Buch S. 56-68, Arbeitsheft S. 21-24.
 * Alle Faelle und Formulierungen sind neu erstellt; keine Buchtexte.
 */
window.SCHULWEG = window.SCHULWEG || { faecher: {} };

window.SCHULWEG.faecher["deutsch-7"] = {
  fach: "Deutsch",
  klasse: 7,
  farbe: "deutsch",
  icon: "📖",
  themen: [
    {
      id: "tutor-sachlicher-bericht",
      titel: "Tutor: Einen Bericht schreiben",
      seiten: "Klartext 7 S. 56–68 · Arbeitsheft S. 21–24",
      lektionen: [
        {
          titel: "1. Bericht oder Erzählung?",
          erklaerung: [
            { text: "Wozu brauchst du das? Mit einem Bericht informierst du eine Person, die beim Ereignis nicht dabei war. Sie soll genau verstehen, was geschehen ist." },
            { titel: "Der wichtigste Unterschied", punkte: ["Bericht: sachlich, genau und überprüfbar.", "Erzählung: darf spannend, persönlich und ausschmückend sein.", "In einen Bericht gehören keine Gefühle, Übertreibungen oder Vermutungen als Tatsachen."] }
          ],
          check: {
            typ: "mc",
            frage: "Welcher Satz passt in einen sachlichen Bericht?",
            antworten: ["Der Schüler stürzte auf der nassen Treppe.", "Plötzlich passierte das unfassbare Unglück!", "Ich fand den Sturz richtig schrecklich."],
            richtig: "Der Schüler stürzte auf der nassen Treppe.",
            erklaerung: "Der Satz nennt eine beobachtbare Tatsache ohne Wertung.",
            fehler: {
              "Plötzlich passierte das unfassbare Unglück!": "‚unfassbar‘ erzeugt Spannung und wertet. Ein Bericht nennt nüchtern, was geschah.",
              "Ich fand den Sturz richtig schrecklich.": "Die eigene Meinung gehört nicht in einen sachlichen Bericht."
            }
          }
        },
        {
          titel: "2. Informationen mit W-Fragen sichern",
          erklaerung: [
            { text: "Bevor du schreibst, sammelst du die Fakten in einem Schreibplan. Nutze: Was geschah? Wer war beteiligt? Wann? Wo? Wie lief es ab? Warum geschah es? Welche Folgen gab es?" },
            { titel: "Wichtig oder unwichtig?", text: "Behalte Informationen, die eine W-Frage beantworten oder den Ablauf verständlich machen. Lieblingsfarben, Meinungen über Personen und Nebengespräche lässt du weg." }
          ],
          check: {
            typ: "mc",
            frage: "Welche Information ist für einen Unfallbericht am wichtigsten?",
            antworten: ["Der Unfall geschah um 10:15 Uhr in der Sporthalle.", "Ein Zuschauer trug neue Turnschuhe.", "Die Pausenmusik war besonders laut."],
            richtig: "Der Unfall geschah um 10:15 Uhr in der Sporthalle.",
            erklaerung: "Die Angabe beantwortet Wann? und Wo?",
            fehler: {
              "Ein Zuschauer trug neue Turnschuhe.": "Die Kleidung erklärt weder das Ereignis noch seinen Ablauf.",
              "Die Pausenmusik war besonders laut.": "Das wäre nur wichtig, wenn die Musik nachweislich zum Unfall beigetragen hätte."
            }
          }
        },
        {
          titel: "3. Den Ablauf ordnen",
          erklaerung: [
            { text: "Ordne die Fakten zuerst zeitlich. Ein klarer Bericht hat Einleitung, Hauptteil und Schluss." },
            { titel: "Bauplan", punkte: ["Einleitung: Datum, Ort, Beteiligte und Ereignis knapp nennen.", "Hauptteil: den Ablauf in zeitlicher Reihenfolge erklären.", "Schluss: Folgen und Maßnahmen nennen.", "Verknüpfe Schritte mit zunächst, danach, währenddessen, anschließend und schließlich."] }
          ],
          check: {
            typ: "mc",
            frage: "Welche Reihenfolge ist logisch?",
            antworten: ["Ball rollt weg → Schüler rutscht aus → Lehrerin leistet Hilfe", "Lehrerin leistet Hilfe → Schüler rutscht aus → Ball rollt weg", "Schüler rutscht aus → Ball rollt weg → Unterricht beginnt"],
            richtig: "Ball rollt weg → Schüler rutscht aus → Lehrerin leistet Hilfe",
            erklaerung: "Ursache, Ereignis und Folge stehen in zeitlicher Reihenfolge.",
            fehler: {
              "Lehrerin leistet Hilfe → Schüler rutscht aus → Ball rollt weg": "Hilfe kann erst nach dem Sturz geleistet werden.",
              "Schüler rutscht aus → Ball rollt weg → Unterricht beginnt": "Hier steht die Ursache nach dem Ereignis und der Ablauf bleibt unklar."
            }
          }
        },
        {
          titel: "4. Die richtigen Zeitformen",
          erklaerung: [
            { text: "Einen Bericht über ein vergangenes Ereignis schreibst du hauptsächlich im Präteritum: ging, sah, rief, stürzte." },
            { titel: "Was geschah noch früher?", text: "Für etwas, das bereits vorher abgeschlossen war, nutzt du das Plusquamperfekt: hatte geöffnet, war gegangen. Beispiel: Nachdem die Lehrerin das Fenster geöffnet hatte, fiel ein Ordner vom Fensterbrett." }
          ],
          check: {
            typ: "mc",
            frage: "Welche Form zeigt, dass etwas schon vorher geschehen war?",
            antworten: ["Der Hausmeister hatte das Schild aufgestellt.", "Der Hausmeister stellte das Schild auf.", "Der Hausmeister stellt das Schild auf."],
            richtig: "Der Hausmeister hatte das Schild aufgestellt.",
            erklaerung: "‚hatte aufgestellt‘ ist Plusquamperfekt und markiert die Vorzeitigkeit.",
            fehler: {
              "Der Hausmeister stellte das Schild auf.": "Das ist Präteritum. Für die noch frühere Handlung brauchst du ‚hatte aufgestellt‘.",
              "Der Hausmeister stellt das Schild auf.": "Das ist Präsens. Der Bericht handelt von einem vergangenen Ereignis."
            }
          }
        },
        {
          titel: "5. Aussagen sachlich wiedergeben",
          erklaerung: [
            { text: "Übernimm aus Aussagen nur belegte Informationen. Kennzeichne unsichere Angaben: ‚Nach Aussage der Zeugin …‘ oder ‚Vermutlich …‘. Eine Vermutung darf nie wie eine bewiesene Tatsache klingen." },
            { titel: "Keine wörtliche Rede nötig", text: "Formuliere Aussagen knapp und sachlich: Die Zeugin erklärte, sie habe den Vorfall vom Eingang aus beobachtet." }
          ],
          check: {
            typ: "mc",
            frage: "Welche Formulierung trennt Aussage und Tatsache sauber?",
            antworten: ["Nach Aussage des Zeugen fuhr das Fahrrad sehr schnell.", "Das Fahrrad fuhr auf jeden Fall viel zu schnell!", "Bestimmt war der Fahrer unvorsichtig."],
            richtig: "Nach Aussage des Zeugen fuhr das Fahrrad sehr schnell.",
            erklaerung: "Die Quelle der Information wird genannt, ohne die Aussage als bewiesen auszugeben.",
            fehler: {
              "Das Fahrrad fuhr auf jeden Fall viel zu schnell!": "‚auf jeden Fall‘ behauptet Gewissheit und das Ausrufezeichen wirkt wertend.",
              "Bestimmt war der Fahrer unvorsichtig.": "Das ist eine unbelegte Vermutung über eine Person."
            }
          }
        },
        {
          titel: "6. Mit der Checkliste überarbeiten",
          erklaerung: [
            { titel: "Der letzte Kontrollgang", punkte: ["Sind alle wichtigen W-Fragen beantwortet?", "Stehen die Ereignisse in zeitlicher Reihenfolge?", "Sind Datum und Ort genau?", "Ist die Sprache sachlich und ohne persönliche Kommentare?", "Steht der Bericht überwiegend im Präteritum?", "Ist eine frühere Handlung im Plusquamperfekt markiert?", "Sind Wiederholungen und unwichtige Einzelheiten gestrichen?"] },
            { text: "Lies zum Schluss nur auf einen Prüfpunkt gleichzeitig: zuerst Inhalt, dann Reihenfolge, danach Sprache und Zeitformen. So übersiehst du weniger." }
          ],
          check: {
            typ: "mc",
            frage: "Was prüfst du am besten zuerst?",
            antworten: ["Ob alle wichtigen Informationen vorhanden sind", "Ob jedes Wort besonders spannend klingt", "Ob möglichst viele Ausrufezeichen vorkommen"],
            richtig: "Ob alle wichtigen Informationen vorhanden sind",
            erklaerung: "Ohne vollständige Fakten kann der Bericht seinen Zweck nicht erfüllen.",
            fehler: {
              "Ob jedes Wort besonders spannend klingt": "Spannung ist ein Ziel von Erzählungen, nicht von Berichten.",
              "Ob möglichst viele Ausrufezeichen vorkommen": "Ein sachlicher Bericht braucht normalerweise keine Ausrufezeichen."
            }
          }
        }
      ]
    },
    {
      id: "bericht-detektiv",
      titel: "Bericht-Detektiv: Fehler finden",
      seiten: "Klartext 7 S. 60–68 · Arbeitsheft S. 22–24",
      voraussetzung: "W-Fragen und Grundform des Präteritums",
      intro: "Wozu brauchst du das? Wenn du fremde Berichte verbessern kannst, erkennst du dieselben Fehler leichter in deinem eigenen Text. Jede Falschantwort erklärt dir genau, was noch nicht passt.",
      aufgaben: [
        {
          typ: "mc", frage: "Welche Überschrift ist sachlich?",
          antworten: ["Zusammenstoß auf dem Schulhof", "Das unglaubliche Pausen-Drama", "Schock! Schon wieder Chaos!"],
          richtig: "Zusammenstoß auf dem Schulhof", erklaerung: "Sie nennt das Ereignis knapp und ohne Wertung.",
          fehler: { "Das unglaubliche Pausen-Drama": "‚unglaublich‘ und ‚Drama‘ werten und übertreiben.", "Schock! Schon wieder Chaos!": "Die Ausrufe und das Wort ‚Chaos‘ sollen Gefühle erzeugen." }
        },
        {
          typ: "mc", frage: "Welche Angabe beantwortet die Frage ‚Wann?‘ am genauesten?",
          antworten: ["am Dienstag um 10:15 Uhr", "irgendwann am Vormittag", "in einer langen Pause"],
          richtig: "am Dienstag um 10:15 Uhr", erklaerung: "Datum beziehungsweise Wochentag und Uhrzeit sind überprüfbar und genau.",
          fehler: { "irgendwann am Vormittag": "‚irgendwann‘ ist zu ungenau.", "in einer langen Pause": "Die Angabe nennt keinen eindeutigen Zeitpunkt." }
        },
        {
          typ: "mc", frage: "Welche Information gehört nicht in den Bericht über einen Sturz in der Sporthalle?",
          antworten: ["Die Lehrerin trug eine grüne Jacke.", "Ein Ball rollte auf das Spielfeld.", "Der Schüler kühlte anschließend seinen Knöchel."],
          richtig: "Die Lehrerin trug eine grüne Jacke.", erklaerung: "Die Jackenfarbe erklärt weder Ursache, Ablauf noch Folge.",
          fehler: { "Ein Ball rollte auf das Spielfeld.": "Das kann die Ursache des Sturzes erklären und ist deshalb wichtig.", "Der Schüler kühlte anschließend seinen Knöchel.": "Das ist eine Folge beziehungsweise Maßnahme nach dem Sturz." }
        },
        {
          typ: "mc", frage: "Welcher Satz ist eine unbelegte Vermutung?",
          antworten: ["Der Fahrer war bestimmt abgelenkt.", "Die Zeugin beobachtete den Vorfall vom Eingang aus.", "Der Bus hielt um 8:04 Uhr an."],
          richtig: "Der Fahrer war bestimmt abgelenkt.", erklaerung: "‚bestimmt‘ macht eine nicht belegte Annahme zur scheinbaren Tatsache.",
          fehler: { "Die Zeugin beobachtete den Vorfall vom Eingang aus.": "Das ist eine konkrete, einer Person zugeordnete Beobachtung.", "Der Bus hielt um 8:04 Uhr an.": "Das ist eine überprüfbare Zeitangabe." }
        },
        {
          typ: "mc", frage: "Welche Satzfolge ist zeitlich sinnvoll?",
          antworten: ["Die Flasche fiel um. Wasser lief aus. Danach rutschte ein Schüler aus.", "Ein Schüler rutschte aus. Danach fiel die Flasche um. Vorher lief Wasser aus.", "Wasser lief aus. Die Flasche fiel später um. Zuvor rutschte ein Schüler aus."],
          richtig: "Die Flasche fiel um. Wasser lief aus. Danach rutschte ein Schüler aus.", erklaerung: "Die Ursache steht vor dem Ereignis und seiner Folge.",
          fehler: { "Ein Schüler rutschte aus. Danach fiel die Flasche um. Vorher lief Wasser aus.": "‚danach‘ und ‚vorher‘ widersprechen dem dargestellten Ablauf.", "Wasser lief aus. Die Flasche fiel später um. Zuvor rutschte ein Schüler aus.": "Wasser kann in diesem Fall erst nach dem Umfallen auslaufen." }
        },
        {
          typ: "text", frage: "Setze das Verb ins Präteritum: ‚Die Aufsicht ___ sofort Hilfe.‘ (rufen)",
          richtig: "rief", erklaerung: "rufen ist unregelmäßig: rufen – rief – gerufen.",
          schritte: ["Der Bericht steht in der Vergangenheit.", "Die Präteritumform von rufen lautet rief."],
          fehler: { "rufte": "‚rufen‘ ist unregelmäßig. Es heißt im Präteritum ‚rief‘.", "ruft": "‚ruft‘ ist Präsens. Der Bericht braucht hier das Präteritum." }
        },
        {
          typ: "text", frage: "Ergänze die Vorzeitigkeit: ‚Nachdem der Hausmeister das Warnschild ___, begann die Pause.‘ (aufstellen)",
          richtig: "aufgestellt hatte", akzeptiert: ["hatte aufgestellt"],
          erklaerung: "Die frühere Handlung steht im Plusquamperfekt: hatte aufgestellt.",
          schritte: ["Das Aufstellen war vor Beginn der Pause abgeschlossen.", "Plusquamperfekt = hatte + Partizip II."],
          fehler: { "aufstellte": "Das Präteritum zeigt die Vorzeitigkeit hier nicht deutlich. Nutze Plusquamperfekt.", "aufgestellt hat": "Das ist Perfekt. Für die Vorvergangenheit brauchst du ‚aufgestellt hatte‘." }
        },
        {
          typ: "mc", frage: "Welche Einleitung beantwortet die wichtigsten W-Fragen knapp?",
          antworten: ["Am Dienstag, dem 22. September, stürzte ein Schüler um 10:15 Uhr in der Sporthalle der Gesamtschule.", "Es war ein ganz normaler Tag, doch niemand ahnte, was gleich passieren würde.", "Ich erzähle jetzt von einem wirklich schlimmen Unfall."],
          richtig: "Am Dienstag, dem 22. September, stürzte ein Schüler um 10:15 Uhr in der Sporthalle der Gesamtschule.",
          erklaerung: "Der Satz nennt Zeitpunkt, Beteiligten, Ort und Ereignis ohne Spannung oder Meinung.",
          fehler: { "Es war ein ganz normaler Tag, doch niemand ahnte, was gleich passieren würde.": "Das ist ein spannender Erzähleinstieg und enthält kaum Fakten.", "Ich erzähle jetzt von einem wirklich schlimmen Unfall.": "Ich-Form und ‚wirklich schlimm‘ sind persönliche Wertungen." }
        },
        {
          typ: "mc", frage: "Welche Verbindung zeigt eine Folge?",
          antworten: ["Deshalb verständigte die Lehrerin das Sekretariat.", "Übrigens mochte die Lehrerin den Unterricht.", "Zum Glück war die Pause bald vorbei."],
          richtig: "Deshalb verständigte die Lehrerin das Sekretariat.", erklaerung: "‚Deshalb‘ verbindet Ursache und Folge sachlich.",
          fehler: { "Übrigens mochte die Lehrerin den Unterricht.": "Das ist eine unwichtige Nebeninformation.", "Zum Glück war die Pause bald vorbei.": "‚Zum Glück‘ ist eine persönliche Wertung." }
        },
        {
          typ: "mc", frage: "Welche Überarbeitung ist am sachlichsten? Ausgangssatz: ‚Der total verrückte Fahrer raste wie ein Irrer los.‘",
          antworten: ["Nach Aussage der Zeugin fuhr der Fahrer mit hoher Geschwindigkeit an.", "Der wahnsinnige Fahrer gab brutal Gas.", "Ich glaube, der Fahrer war völlig durchgedreht."],
          richtig: "Nach Aussage der Zeugin fuhr der Fahrer mit hoher Geschwindigkeit an.",
          erklaerung: "Die Beobachtung wird einer Quelle zugeordnet und ohne Beleidigung formuliert.",
          fehler: { "Der wahnsinnige Fahrer gab brutal Gas.": "‚wahnsinnig‘ und ‚brutal‘ bewerten die Person.", "Ich glaube, der Fahrer war völlig durchgedreht.": "Eine persönliche Vermutung und abwertende Sprache gehören nicht in den Bericht." }
        }
      ]
    },
    {
      id: "bericht-werkstatt-lokal",
      titel: "Bericht-Werkstatt: selbst schreiben",
      seiten: "Klartext 7 S. 64–68 · Arbeitsheft S. 24",
      voraussetzung: "den Tutor oder das Bericht-Detektiv-Quiz",
      intro: "Wozu brauchst du das? Hier setzt du den ganzen Bauplan selbst um. Dein Text bleibt auf diesem Gerät. Danach vergleichst du ihn Schritt für Schritt mit einer Checkliste und einem möglichen Beispiel.",
      aufgaben: [
        {
          typ: "freitext",
          nurLokal: true,
          frage: "Schreibe einen sachlichen Bericht aus diesen Notizen: Donnerstag, 24.09.; 11:20 Uhr; Schulbibliothek; Trinkflasche fällt vom Tisch; Wasser läuft auf den Boden; ein Schüler rutscht aus und stößt mit dem Knie an einen Stuhl; Bibliotheksaufsicht holt ein Kühlpad und informiert das Sekretariat; der Schüler kann nach kurzer Pause wieder gehen. Erfinde keine weiteren Fakten.",
          musterloesung: "Am Donnerstag, dem 24. September, ereignete sich um 11:20 Uhr in der Schulbibliothek ein Unfall. Eine Trinkflasche fiel von einem Tisch, sodass Wasser auf den Boden lief. Kurz darauf rutschte ein Schüler auf der nassen Stelle aus und stieß mit dem Knie an einen Stuhl. Die Bibliotheksaufsicht holte anschließend ein Kühlpad und informierte das Sekretariat. Nach einer kurzen Pause konnte der Schüler die Bibliothek wieder selbstständig verlassen.",
          checkliste: ["Einleitung nennt Datum, Uhrzeit, Ort und Ereignis.", "Alle wichtigen W-Fragen sind beantwortet.", "Der Ablauf ist zeitlich geordnet.", "Der Text ist sachlich und enthält keine erfundenen Angaben.", "Die Verben stehen überwiegend im Präteritum.", "Folgen und Maßnahmen stehen am Schluss."]
        }
      ]
    }
  ]
};
