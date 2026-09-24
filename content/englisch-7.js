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
