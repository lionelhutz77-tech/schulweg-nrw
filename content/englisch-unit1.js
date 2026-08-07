/*
 * Englisch Unit 1 - Lernreise, Slice 1: Kompetenz "Sich vorstellen".
 *
 * WICHTIG (Urheberrecht): Alle Dialoge, Namen und Saetze hier sind EIGENE
 * Formulierungen. Aus dem Schulbuch stammt ausschliesslich das Lernziel und
 * der Wortschatzbedarf - keine Originaltexte, keine Buchfiguren, keine
 * Seitenkopien. Die Buchseiten dienen nur als fachliche Quellenreferenz.
 *
 * Eigene Figuren dieses Slices: Sam (Gastgeber), Mia (Transfer).
 *
 * Aktivitaetstypen (activityType) - bewusst wenige, alle bereits vorhanden
 * oder minimal ergaenzt:
 *   hoerauswahl | lesezuordnung | satzbau | eingabe | nachsprechen | dialog
 * Fertigkeiten (skill): listening | reading | speaking | writing
 */
window.SCHULWEG = window.SCHULWEG || { faecher: {} };
window.SCHULWEG.unit1 = {
  fachKey: "englisch-6",
  kompetenz: {
    id: "u1.k1.introduce",
    titel: "Sich vorstellen",
    kurz: "Sagen, wie du heißt, woher du kommst und wie alt du bist – und andere danach fragen.",
    quelle: "Lighthouse Band 1, Unit 1 (nur als fachliche Referenz)",
    // Referenzen auf den BESTEHENDEN Vokabelpool - keine Duplikate.
    vokabelIds: [
      "en6_0074", // hello
      "en6_0006", // name
      "en6_0004", // what
      "en6_0005", // your
      "en6_0012", // my
      "en6_0001", // nice
      "en6_0002", // meet
      "en6_0033", // too
      "en6_0104", // where
      "en6_0069", // old
      "en6_0388", // year
      "en6_0094"  // age
    ]
  },

  schritte: [
    // ---------- A. ANKOMMEN ----------
    {
      id: "a-ankommen",
      art: "szene",
      titel: "Der erste Morgen",
      text: "Du bist neu an einer Schule in England. In der Pause kommt ein Junge auf dich zu.",
      audio: { kind: "sentence", key: "u1.k1.sam-hello", text: "Hello! I'm Sam. What's your name?", lang: "en-GB" },
      sprecher: "Sam",
      hinweis: "Hör erst einmal nur zu. Du musst noch nichts sagen."
    },

    // ---------- B. HÖREN & VERSTEHEN ----------
    {
      id: "b-hoeren",
      art: "aufgabe",
      activityType: "hoerauswahl",
      skill: "listening",
      titel: "Gut zugehört?",
      audio: { kind: "sentence", key: "u1.k1.sam-hello", text: "Hello! I'm Sam. What's your name?", lang: "en-GB" },
      frage: "Wie heißt der Junge?",
      typ: "mc",
      antworten: ["Sam", "Tom", "Ben"],
      richtig: "Sam",
      erklaerung: "Er sagt: „I'm Sam.“ – „I'm …“ heißt „Ich bin …“.",
      hilfe: "Hör noch einmal zu und achte auf den Namen nach „I'm“."
    },
    {
      id: "b-hoeren-2",
      art: "aufgabe",
      activityType: "hoerauswahl",
      skill: "listening",
      titel: "Was will Sam wissen?",
      audio: { kind: "sentence", key: "u1.k1.sam-hello", text: "Hello! I'm Sam. What's your name?", lang: "en-GB" },
      frage: "Was fragt Sam dich?",
      typ: "mc",
      antworten: ["Wie du heißt", "Wie alt du bist", "Woher du kommst"],
      richtig: "Wie du heißt",
      erklaerung: "„What's your name?“ heißt „Wie heißt du?“.",
      hilfe: "„name“ steckt schon im englischen Satz – das Wort kennst du."
    },

    // ---------- C. MUSTER ENTDECKEN ----------
    {
      id: "c-muster",
      art: "muster",
      titel: "Das Muster: I'm …",
      beispiele: [
        { en: "I'm Sam.", de: "Ich bin Sam." },
        { en: "I'm Mia.", de: "Ich bin Mia." },
        { en: "I'm from London.", de: "Ich komme aus London." },
        { en: "I'm eleven.", de: "Ich bin elf." }
      ],
      merksatz: "Mit „I'm …“ sagst du, wer du bist, woher du kommst und wie alt du bist.",
      audio: { kind: "sentence", key: "u1.k1.muster-im", text: "I'm Sam. I'm from London. I'm eleven.", lang: "en-GB" }
    },
    {
      id: "c-zuordnen",
      art: "aufgabe",
      activityType: "lesezuordnung",
      skill: "reading",
      titel: "Was bedeutet das?",
      frage: "I'm from Manchester.",
      typ: "mc",
      antworten: ["Ich komme aus Manchester.", "Ich heiße Manchester.", "Ich bin elf Jahre alt."],
      richtig: "Ich komme aus Manchester.",
      erklaerung: "„from“ heißt „aus/von“ – es geht um den Ort.",
      hilfe: "Achte auf das kleine Wort „from“."
    },
    {
      id: "c-satzbau",
      art: "aufgabe",
      activityType: "satzbau",
      skill: "writing",
      titel: "Bau den Satz",
      frage: "Sag auf Englisch: „Ich bin zwölf.“",
      typ: "bausteine",
      teile: ["I'm", "twelve", "."],
      loesung: "I'm twelve .",
      erklaerung: "Erst „I'm“, dann die Zahl.",
      hilfe: "Fang mit „I'm“ an."
    },

    // ---------- D. SELBST ANTWORTEN ----------
    {
      id: "d-antwort-name",
      art: "aufgabe",
      activityType: "eingabe",
      skill: "writing",
      titel: "Jetzt du",
      frage: "Sam fragt: „What's your name?“ – Antworte auf Englisch.",
      typ: "freieingabe",
      muster: "^\\s*(hi|hello)?[,\\s]*(i'?m|my name is)\\s+\\S+",
      beispiel: "I'm …  oder  My name is …",
      erklaerung: "Beides ist richtig: „I'm Enya.“ oder „My name is Enya.“",
      hilfe: "Schreib „I'm“ und dann deinen Namen."
    },
    {
      id: "d-antwort-herkunft",
      art: "aufgabe",
      activityType: "eingabe",
      skill: "writing",
      titel: "Woher kommst du?",
      frage: "Sam fragt: „Where are you from?“ – Antworte auf Englisch.",
      typ: "freieingabe",
      muster: "^\\s*i'?m\\s+from\\s+\\S+",
      beispiel: "I'm from …",
      erklaerung: "„I'm from Oberhausen.“ – nach „from“ kommt der Ort.",
      hilfe: "Fang an mit „I'm from“."
    },
    {
      id: "d-nachsprechen",
      art: "aufgabe",
      activityType: "nachsprechen",
      skill: "speaking",
      titel: "Sprich es laut",
      satz: "Nice to meet you.",
      uebersetzung: "Schön, dich kennenzulernen.",
      audio: { kind: "sentence", key: "u1.k1.nice-to-meet", text: "Nice to meet you.", lang: "en-GB" },
      hinweis: "Hör zu und sprich den Satz laut nach. Niemand hört mit – du bestätigst selbst.",
      selbstbestaetigung: true
    },

    // ---------- E. MINI-DIALOG ----------
    {
      id: "e-dialog",
      art: "dialog",
      activityType: "dialog",
      skill: "writing",
      titel: "Dein erstes Gespräch",
      partner: "Sam",
      einleitung: "Sam spricht dich an. Antworte Schritt für Schritt.",
      zuege: [
        {
          sam: "Hello! What's your name?",
          audio: { kind: "sentence", key: "u1.k1.d-name", text: "Hello! What's your name?", lang: "en-GB" },
          erwartet: "^\\s*(hi|hello)?[,\\s]*(i'?m|my name is)\\s+(\\S+)",
          merkeGruppe: 3,
          beispiel: "I'm …",
          antwortSam: "Nice to meet you, {0}!"
        },
        {
          sam: "Where are you from?",
          audio: { kind: "sentence", key: "u1.k1.d-from", text: "Where are you from?", lang: "en-GB" },
          erwartet: "^\\s*i'?m\\s+from\\s+(\\S+)",
          merkeGruppe: 1,
          beispiel: "I'm from …",
          antwortSam: "{0}? Cool! I'm from London."
        },
        {
          sam: "How old are you?",
          audio: { kind: "sentence", key: "u1.k1.d-old", text: "How old are you?", lang: "en-GB" },
          erwartet: "^\\s*i'?m\\s+(\\S+)",
          merkeGruppe: 1,
          beispiel: "I'm …",
          antwortSam: "I'm twelve. Nice to meet you!"
        }
      ],
      abschluss: "Das war dein erstes englisches Gespräch. 🎉"
    },

    // ---------- F. TRANSFER ----------
    {
      id: "f-transfer",
      art: "aufgabe",
      activityType: "hoerauswahl",
      skill: "listening",
      titel: "Neue Person, neue Infos",
      einleitung: "Am nächsten Tag stellt sich ein Mädchen vor.",
      audio: { kind: "sentence", key: "u1.k1.mia", text: "Hi! I'm Mia. I'm from Bristol. I'm eleven.", lang: "en-GB" },
      sprecher: "Mia",
      frage: "Woher kommt Mia?",
      typ: "mc",
      antworten: ["Aus Bristol", "Aus London", "Aus Manchester"],
      richtig: "Aus Bristol",
      erklaerung: "Sie sagt „I'm from Bristol.“",
      hilfe: "Achte auf den Ort nach „from“."
    },
    {
      id: "f-reagieren",
      art: "aufgabe",
      activityType: "eingabe",
      skill: "writing",
      titel: "Antworte Mia",
      frage: "Mia hat sich vorgestellt. Sag ihr, dass du dich freust – auf Englisch.",
      typ: "freieingabe",
      muster: "nice\\s+to\\s+meet\\s+you",
      beispiel: "Nice to meet you.",
      erklaerung: "„Nice to meet you (too).“ passt immer, wenn sich jemand vorstellt.",
      hilfe: "Der Satz beginnt mit „Nice …“."
    },

    // ---------- G. MINI-CHECK ----------
    {
      id: "g-check-rezeptiv",
      art: "aufgabe",
      activityType: "lesezuordnung",
      skill: "reading",
      titel: "Mini-Check: verstehen",
      frage: "„How old are you?“ – Was will die Person wissen?",
      typ: "mc",
      antworten: ["Wie alt du bist", "Wie du heißt", "Woher du kommst"],
      richtig: "Wie alt du bist",
      erklaerung: "„old“ = alt. Die Frage geht ums Alter.",
      hilfe: "Das Wort „old“ kennst du."
    },
    {
      id: "g-check-produktiv",
      art: "aufgabe",
      activityType: "eingabe",
      skill: "writing",
      titel: "Mini-Check: selbst schreiben",
      frage: "Stell dich vor: Name UND Alter, in einem oder zwei Sätzen.",
      typ: "freieingabe",
      muster: "(i'?m|my name is)\\s+\\S+[\\s\\S]*\\b(i'?m\\s+)?(\\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen)\\b",
      beispiel: "I'm Enya. I'm eleven.",
      erklaerung: "Zwei kurze Sätze reichen völlig.",
      hilfe: "Erst der Name („I'm …“), dann das Alter („I'm eleven.“)."
    }
  ]
};
