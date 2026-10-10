/*
 * Englisch Klasse 7 – Unit 1: London, S. 8–16.
 * Die lokalen Buchfotos dienten nur zur Stoffabgrenzung. Alle Aufgaben,
 * Dialoge und Beispiele hier sind neu formuliert und enthalten keine Scans.
 */
window.SCHULWEG = window.SCHULWEG || { faecher: {} };

(function () {
  "use strict";

  function text(frage, richtig, erklaerung, akzeptiert) {
    var a = { typ: "text", frage: frage, richtig: richtig, erklaerung: erklaerung };
    if (akzeptiert) a.akzeptiert = akzeptiert;
    return a;
  }

  var london = [
    { typ: "mc", frage: "Which place is a large observation wheel?", antworten: ["The London Eye", "The Tube", "A market"], richtig: "The London Eye", erklaerung: "The London Eye is a wheel with views across the city." },
    { typ: "mc", frage: "What do Londoners usually mean by ‘the Tube’?", antworten: ["The underground railway", "A river boat", "A football stadium"], richtig: "The underground railway", erklaerung: "The Tube is London's underground train system." },
    text("Complete: ‘London has many interesting places for ___.’", "tourists", "People who visit a city are tourists."),
    { typ: "mc", frage: "Choose the best reason: ‘I would visit a street market because …’", antworten: ["you can discover unusual things there", "trains always stop there", "it is a school rule"], richtig: "you can discover unusual things there", erklaerung: "The answer gives a clear reason connected to a market." },
    text("Translate into English: ‚London ist aufregend, aber manchmal laut.‘", "London is exciting, but sometimes noisy.", "Use but to connect two different ideas.", ["London is exciting but sometimes noisy."]),
    { typ: "freitext", frage: "Give a visitor two different tips for a day in London. Write 2–3 English sentences and give one reason.", kriterien: "2–3 vollständige englische Sätze; zwei passende Aktivitäten oder Orte; mindestens eine Begründung mit because; verständliche Wortstellung.", musterloesung: "You can visit a museum in the morning. Then go to a market because you can find interesting things there.", tipp: "Use: You can … / Then … / because …" }
  ];

  var reading = [
    { typ: "mc", frage: "A group misses one friend on the underground. What is the safest sensible plan?", antworten: ["Wait together at the next station", "Split up without a plan", "Leave the city"], richtig: "Wait together at the next station", erklaerung: "A clear meeting point helps the group find one another again." },
    { typ: "mc", frage: "Why might a shop ask young visitors to enter with an adult?", antworten: ["It has a rule for younger visitors", "Museums are always closed", "The Tube is too slow"], richtig: "It has a rule for younger visitors", erklaerung: "The clue is a rule about being allowed in." },
    text("Complete the past tense: ‘The friends ___ to a free museum.’ (go)", "went", "go is irregular: go → went."),
    text("Complete the negative: ‘They ___ see the problem at first.’", "didn't", "Simple Past negative: didn't + base form.", ["did not"]),
    { typ: "mc", frage: "Which sentence gives a reason?", antworten: ["They chose the museum because it was free.", "They chose the museum yesterday.", "Did they choose the museum?"], richtig: "They chose the museum because it was free.", erklaerung: "because introduces the reason." },
    { typ: "freitext", frage: "Retell a short city adventure in 3 English sentences: a problem, an idea and a good ending.", kriterien: "drei vollständige Sätze; sinnvolle Reihenfolge; mindestens zwei Verben im Simple Past; Problem und Lösung erkennbar.", musterloesung: "We missed our bus. I found a map and chose another route. In the end, we arrived at the museum.", tipp: "Use: First … / Then … / In the end …" }
  ];

  var writing = [
    { typ: "mc", frage: "What should you do before writing about your neighbourhood?", antworten: ["Collect and group ideas", "Write the last sentence first and stop", "Copy a complete model text"], richtig: "Collect and group ideas", erklaerung: "A word bank helps you plan before you write." },
    { typ: "mc", frage: "Which group is useful for a neighbourhood word bank?", antworten: ["transport – shopping – sport – other places", "red – Monday – twelve – quickly", "past – present – future – never"], richtig: "transport – shopping – sport – other places", erklaerung: "These headings organise ideas about an area." },
    text("Complete: ‘There ___ lots of small cafés near the park.’", "are", "Use there are with a plural noun."),
    text("Complete: ‘Our nearest bus stop is five minutes ___.’", "away", "The useful phrase is five minutes away."),
    { typ: "freitext", frage: "Write a short text about an invented neighbourhood. Say what is there, what young people can do and give one positive or negative opinion.", kriterien: "40 bis 60 englische Wörter; mindestens drei vollständige Sätze; mindestens zwei Orte; eine Aktivität mit can; eine begründete Meinung; keine echten Namen, Adressen oder Wohnorte.", musterloesung: "My invented neighbourhood is near a river. There are two cafés, a sports centre and a quiet park. Young people can meet friends or play basketball. I like the area because the park is free, but the main road is sometimes noisy.", tipp: "Plan four groups first: places, transport, activities and opinion." }
  ];

  var vokabelCheck = [
    text("Translate into English: ‚die U-Bahn‘", "the Tube", "In London, the underground is often called the Tube.", ["Tube"]),
    text("Translate into German: ‘expensive’", "teuer", "expensive = teuer"),
    text("Translate into English: ‚der Markt‘", "market", "der Markt = market"),
    text("Translate into German: ‘neighbourhood’", "Nachbarschaft", "neighbourhood = Nachbarschaft / Wohngegend", ["Wohngegend", "die Nachbarschaft"]),
    text("Translate into English: ‚erlaubt sein‘", "be allowed to", "be allowed to = etwas tun dürfen"),
    text("Translate into German: ‘shopping centre’", "Einkaufszentrum", "shopping centre = Einkaufszentrum", ["das Einkaufszentrum"]),
    text("Complete: ‘The street is full of cars. It is very ___.’", "busy", "A road with a lot of traffic is busy."),
    text("Complete: ‘I like the park ___ it is quiet.’", "because", "because introduces a reason."),
    { typ: "mc", frage: "Which word means the negative side of something?", antworten: ["downside", "culture", "stadium"], richtig: "downside", erklaerung: "A downside is a disadvantage or negative aspect." },
    { typ: "mc", frage: "Which person protects a shop?", antworten: ["a security guard", "a tourist", "a football fan"], richtig: "a security guard", erklaerung: "A security guard helps keep a place safe." }
  ];

  var lerntraining = [
    { typ: "mc", frage: "Which method helps you remember words for longer?", antworten: ["Short reviews on several days", "Reading the list once", "Copying everything once"], richtig: "Short reviews on several days", erklaerung: "Spaced practice strengthens memory." },
    { typ: "mc", frage: "What should you do before looking at an answer?", antworten: ["Try to remember it", "Skip the task", "Read the solution first"], richtig: "Try to remember it", erklaerung: "Active recall makes memory stronger." },
    { typ: "mc", frage: "How can speaking help with vocabulary?", antworten: ["Use the word in a new sentence", "Only say the German word", "Avoid corrections"], richtig: "Use the word in a new sentence", erklaerung: "Speaking connects meaning, sound and grammar." }
  ];

  var roheVokabeln = [
    ["die U-Bahn", "the Tube"], ["der Zug", "train"], ["der Bahnhof", "station"], ["der Bahnsteig", "platform"],
    ["der Bus", "bus"], ["das Taxi", "taxi"], ["die Fahrkarte", "ticket"], ["reisen", "travel"],
    ["der Tourist / die Touristin", "tourist"], ["berühmt", "famous"], ["der Palast", "palace"], ["der Turm", "tower"],
    ["die Brücke", "bridge"], ["der Fluss", "river"], ["das Stadion", "stadium"], ["der Detektiv", "detective"],
    ["der Markt", "market"], ["das Einkaufszentrum", "shopping centre"], ["das Geschäft", "shop"], ["die Kleidung", "clothes"],
    ["einkaufen gehen", "go shopping"], ["billig", "cheap"], ["teuer", "expensive"], ["aufregend", "exciting"],
    ["interessant", "interesting"], ["langweilig", "boring"], ["laut", "noisy"], ["freundlich", "friendly"],
    ["die Kultur", "culture"], ["das Konzert", "concert"], ["der Fußballverein", "football club"], ["der Fußballfan", "football fan"],
    ["die negative Seite", "downside"], ["erlaubt sein", "be allowed to"], ["der Erwachsene", "adult"], ["die Sicherheitskraft", "security guard"],
    ["der Rucksack", "backpack", ["rucksack"]], ["das Handy", "mobile phone", ["mobile"]], ["das Museum", "museum"], ["der Dinosaurier", "dinosaur"],
    ["die Idee", "idea"], ["warten", "wait"], ["vermissen / verpassen", "miss"], ["schnell", "quickly"],
    ["hinter", "behind"], ["weglaufen", "run away"], ["kostenlos", "free"], ["besonders", "especially"],
    ["die Nachbarschaft / Wohngegend", "neighbourhood", ["neighborhood"]], ["der Verkehr", "transport"], ["die Straße", "road"], ["belebt / viel befahren", "busy"],
    ["der Flughafen", "airport"], ["das Krankenhaus", "hospital"], ["am nächsten gelegen", "nearest"], ["entfernt", "away"],
    ["zustimmen", "agree"], ["nicht zustimmen", "disagree"], ["meinen / denken", "think"], ["weil", "because"],
    ["es gibt (Einzahl)", "there is"], ["es gibt (Mehrzahl)", "there are"], ["man kann", "you can"], ["das Beste an …", "the best thing about …"]
  ];

  var fach = {
    fach: "Englisch",
    klasse: 7,
    farbe: "englisch",
    icon: "🇬🇧",
    sprachcoach: { unit: "Unit 1", stoff: "S. 8–16", titel: "London Speaking Coach" },
    lerncheck: {
      id: "en7-unit1-2026-10-08",
      titel: "1er-Mission: Englisch-Arbeit",
      datum: "08.10.2026",
      ziel: "Sehr gut vorbereitet: Unit-1-Wörter aktiv abrufen, Texte sicher verstehen und einen eigenen englischen Text planen.",
      hinweis: "Die App enthält eigene Unit-1-Übungen. Buch- und Workbook-Aufgaben bleiben Seitenaufträge, bis die Originalseiten vorliegen – so wird nichts aus dem Buch nacherfunden.",
      fehlendeSeiten: [
        "Workbook S. 3–8 (Nr. 1, 2, 3a, 3b, 5a, 6, 7, 9a–c, 10a–b)",
        "Textbook S. 14–16 für die konkreten Lese- und Schreibaufgaben",
        "Textbook S. 95 (More Practice 4 und Nr. 1b)",
        "die noch offenen Aufgaben aus dem Unterricht (Foto oder genauer Auftrag)"
      ],
      tage: [
        {
          datum: "28.09.", titel: "Startklar", minuten: "15–20 Min.",
          fokus: "Überblick schaffen und die ersten Wörter aktiv abrufen.",
          aufgaben: [
            { id: "start-check", text: "Lerncheck anschauen und alle Materialien bereitlegen.", art: "manuell" },
            { id: "start-vocab", text: "10 Unit-1-Vokabeln aktiv trainieren.", art: "vokabeln" },
            { id: "start-reading", text: "Textbook S. 14–15 einmal ohne Wörterbuch lesen.", art: "manuell", buch: true }
          ]
        },
        {
          datum: "29.09.", titel: "Reading I", minuten: "20–25 Min.",
          fokus: "Beim Lesen Schlüsselwörter, Personen und Reihenfolge finden.",
          aufgaben: [
            { id: "r1-book", text: "Textbook S. 14–15 noch einmal lesen; unbekannte Wörter markieren.", art: "manuell", buch: true },
            { id: "r1-app", text: "App-Training: Eine London-Geschichte verstehen.", art: "thema", thema: "u1-story" },
            { id: "r1-wb", text: "Workbook S. 3, Nr. 1 + 2 bearbeiten.", art: "manuell", buch: true }
          ]
        },
        {
          datum: "30.09.", titel: "Wortschatz festigen", minuten: "20 Min.",
          fokus: "Wörter Deutsch → Englisch abrufen und in Sätzen sehen.",
          aufgaben: [
            { id: "vocab-1", text: "10–15 Unit-1-Vokabeln trainieren; schwierige Wörter laut sagen.", art: "vokabeln" },
            { id: "wb-4", text: "Workbook S. 4, Nr. 3a + 3b bearbeiten.", art: "manuell", buch: true },
            { id: "vocab-check-1", text: "App-Mini-Check: Unit-1-Vokabeln.", art: "thema", thema: "u1-vocab-check" }
          ]
        },
        {
          datum: "01.10.", titel: "Reading II", minuten: "20–25 Min.",
          fokus: "Eine Geschichte in der richtigen Reihenfolge nacherzählen.",
          aufgaben: [
            { id: "wb-5", text: "Workbook S. 5, Nr. 5a bearbeiten.", art: "manuell", buch: true },
            { id: "reading-retell", text: "App-Training: Geschichte mit Problem, Idee und Ende nacherzählen.", art: "thema", thema: "u1-story" },
            { id: "class-open", text: "Offene Aufgaben aus dem Unterricht bearbeiten, falls es welche gibt.", art: "manuell", buch: true }
          ]
        },
        {
          datum: "02.10.", titel: "Workbook-Tag", minuten: "20 Min.",
          fokus: "Genau arbeiten; Fehler nicht übergehen, sondern markieren.",
          aufgaben: [
            { id: "wb-6", text: "Workbook S. 6, Nr. 6 + 7 bearbeiten.", art: "manuell", buch: true },
            { id: "mp4", text: "Textbook S. 95, More Practice 4 bearbeiten.", art: "manuell", buch: true },
            { id: "vocab-2", text: "10 Unit-1-Vokabeln wiederholen.", art: "vokabeln" }
          ]
        },
        {
          datum: "03.10.", titel: "Writing I", minuten: "20–25 Min.",
          fokus: "Ideen sortieren, klare Sätze bauen und eine Meinung begründen.",
          aufgaben: [
            { id: "writing-app", text: "App-Training: My neighbourhood planen und schreiben.", art: "thema", thema: "u1-writing-neighbourhood" },
            { id: "tb-16", text: "Textbook S. 16 bearbeiten.", art: "manuell", buch: true },
            { id: "vocab-3", text: "Schwierige Wörter aus dem Schreiben in die Wiederholungsrunde nehmen.", art: "vokabeln" }
          ]
        },
        {
          datum: "04.10.", titel: "Workbook II", minuten: "20–25 Min.",
          fokus: "Genau hinschauen und anschließend Fehler verbessern.",
          aufgaben: [
            { id: "wb-7", text: "Workbook S. 7, Nr. 9a, 9b, 9c bearbeiten.", art: "manuell", buch: true },
            { id: "wb-8", text: "Workbook S. 8, Nr. 10a + 10b bearbeiten.", art: "manuell", buch: true },
            { id: "reading-repeat", text: "Textbook S. 14–15 flüssig noch einmal lesen.", art: "manuell", buch: true }
          ]
        },
        {
          datum: "05.10.", titel: "Writing II", minuten: "20–25 Min.",
          fokus: "Schreibaufgaben selbstständig planen und mit Checkliste prüfen.",
          aufgaben: [
            { id: "mp1b", text: "Textbook S. 95, Nr. 1b bearbeiten.", art: "manuell", buch: true },
            { id: "writing-repeat", text: "App-Schreibtraining wiederholen; danach die eigene Checkliste nutzen.", art: "thema", thema: "u1-writing-neighbourhood" },
            { id: "vocab-check-2", text: "App-Mini-Check: Unit-1-Vokabeln ohne Hilfe.", art: "thema", thema: "u1-vocab-check" }
          ]
        },
        {
          datum: "06.10.", titel: "Mini-Generalprobe", minuten: "25 Min.",
          fokus: "Lesen, Wortschatz und Schreiben gemischt üben – wie vor einer Arbeit.",
          aufgaben: [
            { id: "mixed-check", text: "App-Mini-Check: Reading + Writing + Vocabulary gemischt.", art: "mischcheck", themen: ["u1-story", "u1-writing-neighbourhood", "u1-vocab-check"] },
            { id: "error-list", text: "Alle Fehler der Workbook-Seiten verbessern oder mit einem Stern markieren.", art: "manuell", buch: true }
          ]
        },
        {
          datum: "07.10.", titel: "Sicher werden", minuten: "15–20 Min.",
          fokus: "Nur noch Lücken schließen, nicht alles neu anfangen.",
          aufgaben: [
            { id: "weak-vocab", text: "Vokabeltrainer: nur die schwierigen Wörter wiederholen.", art: "vokabeln" },
            { id: "reading-final", text: "Textbook S. 14–15 lesen und Inhalt in 3 eigenen englischen Sätzen erzählen.", art: "manuell", buch: true },
            { id: "writing-list", text: "Schreib-Check: vollständige Sätze, passende Wörter, because/Meinung prüfen.", art: "manuell" }
          ]
        },
        {
          datum: "08.10.", titel: "Arbeitsmorgen", minuten: "10–12 Min.",
          fokus: "Ruhig abrufen, Selbstvertrauen mitnehmen – nichts Neues mehr lernen.",
          aufgaben: [
            { id: "final-vocab", text: "5–10 schwierige Vokabeln einmal aktiv abrufen.", art: "vokabeln" },
            { id: "final-plan", text: "Mini-Plan im Kopf: Reading erst genau lesen, Writing erst planen, dann prüfen.", art: "manuell" },
            { id: "final-win", text: "Mission abschließen: Du bist vorbereitet. Viel Erfolg!", art: "manuell" }
          ]
        }
      ]
    },
    themen: [
      { id: "u1-london", titel: "Unit 1: London entdecken", seiten: "S. 8–13", voraussetzung: "erste Unit-1-Wörter", intro: "Wozu? Du kannst über London sprechen, Tipps geben und deine Meinung begründen.", aufgaben: london },
      { id: "u1-story", titel: "Eine London-Geschichte verstehen", seiten: "S. 14–15", voraussetzung: "Orte und Aktivitäten in London", intro: "Wozu? Du erkennst Problem, Lösung und Reihenfolge einer Geschichte und erzählst sie mit eigenen Sätzen nach.", aufgaben: reading },
      { id: "u1-writing-neighbourhood", titel: "Writing Course 1: My neighbourhood", seiten: "S. 16", voraussetzung: "Orte, Aktivitäten und Meinungen", intro: "Wozu? Du sammelst Ideen, ordnest sie und schreibst daraus einen verständlichen eigenen Text.", aufgaben: writing },
      { id: "u1-vocab-check", titel: "Unit 1: Vokabel-Check", seiten: "S. 8–16", voraussetzung: "Unit-1-Wortschatz einmal angesehen", intro: "Wozu? Du rufst wichtige Wörter aktiv ab und benutzt sie im passenden Zusammenhang.", aufgaben: vokabelCheck },
      { id: "lerntraining-aktiv", titel: "Englisch wirksam lernen", seiten: "Lernroutine", voraussetzung: "ein aktuelles Englischthema", intro: "Wozu? Kurze, verteilte Abrufrunden helfen dir mehr als bloßes Wiederlesen.", aufgaben: lerntraining }
    ]
  };

  fach.vokabeltrainer = roheVokabeln.map(function (v, i) {
    var item = { id: "en7_" + String(i + 1).padStart(4, "0"), de: v[0], en: v[1], unit: "Unit 1", topic: "London S. 8–16" };
    if (v[2]) item.alt = v[2];
    return item;
  });

  window.SCHULWEG.faecher["englisch-7"] = fach;
})();
