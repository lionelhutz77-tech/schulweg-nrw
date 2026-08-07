/*
 * Englisch Unit 1 - Kompetenz 2: "Meet my Friends"
 * Fähigkeit: einfache Informationen über andere Personen verstehen und formulieren
 *
 * Grammatik: he/she/they mit is/are, has, likes, from
 * Basiert auf K1 ("Sich vorstellen"), führt diese natürlich weiter
 *
 * Kinder erleben zuerst Sprache (Figuren), dann die Grammatik.
 *
 * WICHTIG (Urheberrecht): Alle Dialoge, Namen und Sätze sind EIGENE Formulierungen.
 * Keine Buchkopien. Keine Originaltexte. Nur fachliche Referenz zum Lehrwerk.
 *
 * Figuren dieses Slices: Mia, Ben, Alex, Sophie
 */
window.SCHULWEG = window.SCHULWEG || { faecher: {} };
window.SCHULWEG.unit1k2 = {
  fachKey: "englisch-6",
  kompetenz: {
    id: "u1.k2.describe-others",
    titel: "Personen beschreiben",
    kurz: "Sagen, wie andere Personen heißen, woher sie kommen, wie alt sie sind und was sie mögen.",
    quelle: "Lighthouse Band 1, Unit 2–3 (nur als fachliche Referenz)"
  },

  // ===== EIGENE FIGUREN für K2 =====
  figuren: {
    mia: { name: "Mia", age: 11, from: "Bristol", likes: "music", pronoun: "she" },
    ben: { name: "Ben", age: 12, from: "Manchester", likes: "football", pronoun: "he" },
    alex: { name: "Alex", age: 11, from: "London", likes: "reading", pronoun: "he" },
    sophie: { name: "Sophie", age: 12, from: "Glasgow", likes: "art", pronoun: "she" }
  },

  schritte: [
    // ========== A. FIGUREN KENNENLERNEN ==========
    {
      id: "k2-a-ankommen",
      art: "szene",
      titel: "Neue Freunde",
      text: "Hallo! Ich möchte dir meine Freunde vorstellen. Sie sind alle verschieden.",
      audio: { kind: "sentence", key: "u1.k2.ankommen", text: "Hello! I want to introduce you to my friends. They are all different.", lang: "en-GB" },
      sprecher: "Ich",
      hinweis: "Höre zu und schau die Bilder an."
    },

    // ------- Figur 1 -------
    {
      id: "k2-a-mia",
      art: "szene",
      titel: "Das ist Mia",
      text: "Das ist Mia. Sie ist elf Jahre alt und kommt aus Bristol. Sie mag Musik.",
      audio: { kind: "sentence", key: "u1.k2.mia-intro", text: "This is Mia. She is eleven. She is from Bristol. She likes music.", lang: "en-GB" },
      sprecher: "Mia",
      hinweis: "Keine Fragen noch – höre nur zu."
    },

    // ------- Figur 2 -------
    {
      id: "k2-a-ben",
      art: "szene",
      titel: "Das ist Ben",
      text: "Das ist Ben. Er ist zwölf Jahre alt und kommt aus Manchester. Er mag Fußball.",
      audio: { kind: "sentence", key: "u1.k2.ben-intro", text: "This is Ben. He is twelve. He is from Manchester. He likes football.", lang: "en-GB" },
      sprecher: "Ben",
      hinweis: "Höre genau hin – Ben und Mia unterscheiden sich."
    },

    // ------- Figur 3 -------
    {
      id: "k2-a-alex",
      art: "szene",
      titel: "Das ist Alex",
      text: "Das ist Alex. Er ist elf Jahre alt und kommt aus London. Er mag lesen.",
      audio: { kind: "sentence", key: "u1.k2.alex-intro", text: "This is Alex. He is eleven. He is from London. He likes reading.", lang: "en-GB" },
      sprecher: "Alex",
      hinweis: "Alle vier sind unterschiedlich."
    },

    // ------- Figur 4 -------
    {
      id: "k2-a-sophie",
      art: "szene",
      titel: "Das ist Sophie",
      text: "Das ist Sophie. Sie ist zwölf Jahre alt und kommt aus Glasgow. Sie mag Kunst.",
      audio: { kind: "sentence", key: "u1.k2.sophie-intro", text: "This is Sophie. She is twelve. She is from Glasgow. She likes art.", lang: "en-GB" },
      sprecher: "Sophie",
      hinweis: "Jetzt kennst du alle vier!"
    },

    // ========== B. VERSTEHEN ==========
    {
      id: "k2-b-hoer-wer",
      art: "aufgabe",
      activityType: "hoerauswahl",
      skill: "listening",
      titel: "Höre hin – wer ist das?",
      audio: { kind: "sentence", key: "u1.k2.b-hoer1", text: "She is twelve. She is from Glasgow. She likes art.", lang: "en-GB" },
      frage: "Wer ist das?",
      typ: "mc",
      antworten: ["Mia", "Ben", "Sophie"],
      richtig: "Sophie",
      erklaerung: "Sophie ist aus Glasgow und mag Kunst.",
      hilfe: "Achte auf ‚She' (Mädchen) und Glasgow."
    },

    {
      id: "k2-b-lese-alter",
      art: "aufgabe",
      activityType: "lesezuordnung",
      skill: "reading",
      titel: "Lies und ordne zu",
      frage: "He is eleven. He is from London. He likes reading.",
      typ: "mc",
      antworten: ["Ben (12, Manchester)", "Alex (11, London)", "Mia (11, Bristol)"],
      richtig: "Alex (11, London)",
      erklaerung: "Richtig – das ist Alex.",
      hilfe: "Achte auf das Alter (eleven) und die Stadt (London)."
    },

    // ========== C. MUSTER ENTDECKEN ==========
    {
      id: "k2-c-muster",
      art: "muster",
      titel: "Das Muster: he, she, they",
      beispiele: [
        { en: "I'm from Bristol.", de: "Ich komme aus Bristol." },
        { en: "She is from Bristol.", de: "Sie kommt aus Bristol." },
        { en: "He is from London.", de: "Er kommt aus London." },
        { en: "They are friends.", de: "Sie (Plural) sind Freunde." }
      ],
      merksatz: "Mit ‚he' und ‚she' sprechen wir über andere. Mit ‚they' über mehrere Personen.",
      audio: { kind: "sentence", key: "u1.k2.muster-pronouns", text: "I'm from Bristol. She is from Bristol. He is from London. They are friends.", lang: "en-GB" }
    },

    {
      id: "k2-c-entdecken",
      art: "aufgabe",
      activityType: "satzbau",
      skill: "reading",
      titel: "Vervollständige",
      frage: "__ is twelve. He is from Manchester. He likes football.",
      typ: "bausteine",
      teile: ["This is Ben.", "Ben", "He"],
      loesung: "Ben is twelve . He is from Manchester . He likes football .",
      erklaerung: "Mit dem Namen oder ‚He' – beides geht.",
      hilfe: "Schreib zuerst den Namen, dann die neuen Sätze."
    },

    // ========== D. PRONOMEN-ZUORDNUNG ==========
    {
      id: "k2-d-pronomen",
      art: "aufgabe",
      activityType: "lesezuordnung",
      skill: "reading",
      titel: "Person → Pronomen",
      frage: "Wer wird mit ‚she' genannt?",
      typ: "mc",
      antworten: ["Ben", "Mia", "Alex"],
      richtig: "Mia",
      erklaerung: "Mia ist ein Mädchen → ‚she'.",
      hilfe: "Mädchen = she, Junge = he."
    },

    // ========== E. IS / ARE MUSTER ==========
    {
      id: "k2-e-is-are",
      art: "aufgabe",
      activityType: "satzbau",
      skill: "writing",
      titel: "is oder are?",
      frage: "Sophie __ twelve.",
      typ: "bausteine",
      teile: ["is", "are", "."],
      loesung: "Sophie is twelve .",
      erklaerung: "Bei einer Person: is. Bei mehreren: are.",
      hilfe: "Eine Person = is. Mehrere = are."
    },

    // ========== F. PERSONEN-DETEKTIV ==========
    {
      id: "k2-f-detektiv-text",
      art: "aufgabe",
      activityType: "lesezuordnung",
      skill: "reading",
      titel: "Personen-Detektiv",
      frage: "He is from Manchester. He likes football. Wer ist das?",
      typ: "mc",
      antworten: ["Mia", "Ben", "Alex"],
      richtig: "Ben",
      erklaerung: "Das passt auf Ben – Manchester und Fußball.",
      hilfe: "Manchester ist Bens Stadt."
    },

    // ========== G. MINI-DIALOG ==========
    {
      id: "k2-g-dialog",
      art: "aufgabe",
      activityType: "dialog",
      skill: "writing",
      titel: "Mit einer Freundin sprechen",
      partner: "Mia",
      einleitung: "Mia fragt dich nach ihren Freunden.",
      zuege: [
        {
          mia: "Do you like my friends?",
          audio: { kind: "sentence", key: "u1.k2.do-you-like", text: "Do you like my friends?", lang: "en-GB" },
          erwartet: "^\\s*(yes|yeah)",
          merkeGruppe: 0,
          beispiel: "Yes.",
          antwortMia: "Good! Let me tell you about them."
        },
        {
          mia: "What does Ben like?",
          audio: { kind: "sentence", key: "u1.k2.what-ben-like", text: "What does Ben like?", lang: "en-GB" },
          erwartet: "^\\s*(he\\s+)?likes\\s+football",
          merkeGruppe: 0,
          beispiel: "He likes football.",
          antwortMia: "Right! Ben loves football."
        }
      ],
      abschluss: "Gut gesprochen! Du kennst meine Freunde jetzt."
    },

    // ========== H. TRANSFER: NEUE PERSON ==========
    {
      id: "k2-h-transfer-leo",
      art: "aufgabe",
      activityType: "eingabe",
      skill: "writing",
      titel: "Neue Person: Leo",
      frage: "Das ist Leo. Er ist 10 Jahre alt, kommt aus Edinburgh und mag Basketball. Schreib auf Englisch: ‚He is ... .'",
      typ: "freieingabe",
      muster: "^\\s*he\\s+is\\s+\\d+",
      beispiel: "He is ten.",
      erklaerung: "Genau! Mit ‚He' beginnst du, dann die Zahl.",
      hilfe: "Schreib: ‚He is ...' und dann das Alter."
    },

    // ========== I. MINI-CHECK ==========
    {
      id: "k2-i-check-hoer",
      art: "aufgabe",
      activityType: "hoerauswahl",
      skill: "listening",
      titel: "Mini-Check: Hörverständnis",
      audio: { kind: "sentence", key: "u1.k2.check-hoer", text: "She is from Glasgow. She likes art.", lang: "en-GB" },
      frage: "Wer ist das?",
      typ: "mc",
      antworten: ["Mia", "Sophie", "Alex"],
      richtig: "Sophie",
      erklaerung: "Sophie ist aus Glasgow.",
      hilfe: "Glasgow ist Sophies Stadt."
    },

    {
      id: "k2-i-check-schreib",
      art: "aufgabe",
      activityType: "eingabe",
      skill: "writing",
      titel: "Mini-Check: Schreiben",
      frage: "Schreib einen Satz über Alex (from London, likes reading): ‚He is ...'",
      typ: "freieingabe",
      muster: "^\\s*he\\s+is\\s+(from\\s+)?london",
      beispiel: "He is from London.",
      erklaerung: "Sehr gut!",
      hilfe: "Schreib ‚He is from London.'"
    }
  ],

  // ===== REFRESH-MISSION K2 =====
  refreshSchritte: [
    {
      id: "k2-r-recap",
      art: "szene",
      titel: "Alte Freunde, neue Geschichte",
      text: "Erinnerst du dich an Mias Freunde? Lass mich dir noch mehr erzählen.",
      audio: { kind: "sentence", key: "u1.k2.r-recap", text: "Remember my friends? Let me tell you more.", lang: "en-GB" },
      sprecher: "Mia",
      hinweis: "Spaced Repetition – du kennst diese Figuren schon."
    },

    {
      id: "k2-r-hoer-neu",
      art: "aufgabe",
      activityType: "hoerauswahl",
      skill: "listening",
      titel: "Wer mag Basketball?",
      audio: { kind: "sentence", key: "u1.k2.r-hoer-neu", text: "He is from Manchester. He likes football.", lang: "en-GB" },
      frage: "Wer ist das?",
      typ: "mc",
      antworten: ["Sophie", "Ben", "Mia"],
      richtig: "Ben",
      erklaerung: "Manchester und Fußball = Ben.",
      hilfe: "Achte auf die Stadt."
    },

    {
      id: "k2-r-schreib-beschreibung",
      art: "aufgabe",
      activityType: "eingabe",
      skill: "writing",
      titel: "Beschreib Sophie",
      frage: "Schreib: ‚She is from ... She likes ...'",
      typ: "freieingabe",
      muster: "^\\s*she\\s+is\\s+from\\s+glasgow.*likes\\s+art",
      beispiel: "She is from Glasgow. She likes art.",
      erklaerung: "Perfekt!",
      hilfe: "Glasgow und art sind Sophies Merkmale."
    },

    {
      id: "k2-r-transfer-personen-detektiv",
      art: "aufgabe",
      activityType: "lesezuordnung",
      skill: "reading",
      titel: "Personen-Detektiv (Transfer)",
      frage: "She is eleven. She likes music. Wer ist das?",
      typ: "mc",
      antworten: ["Sophie", "Mia", "Ben"],
      richtig: "Mia",
      erklaerung: "Elf Jahre und Musik = Mia.",
      hilfe: "Achte auf das Alter und das Hobby."
    },

    {
      id: "k2-r-dialog-mini",
      art: "aufgabe",
      activityType: "dialog",
      skill: "writing",
      titel: "Dialog mit Ben",
      partner: "Ben",
      einleitung: "Ben fragt dich jetzt.",
      zuege: [
        {
          ben: "Do you know my friend Alex?",
          audio: { kind: "sentence", key: "u1.k2.r-do-you-know", text: "Do you know my friend Alex?", lang: "en-GB" },
          erwartet: "^\\s*(yes|yeah)",
          merkeGruppe: 0,
          beispiel: "Yes.",
          antwortBen: "Cool! What does Alex like?"
        },
        {
          ben: "Where is Mia from?",
          audio: { kind: "sentence", key: "u1.k2.r-where-mia", text: "Where is Mia from?", lang: "en-GB" },
          erwartet: "^\\s*(she\\s+is\\s+from\\s+)?bristol",
          merkeGruppe: 0,
          beispiel: "She is from Bristol.",
          antwortBen: "Yes! Mia is cool."
        }
      ],
      abschluss: "Du kennst meine Freunde besser als gedacht!"
    }
  ]
};
