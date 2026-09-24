/*
 * Englisch Klasse 5 - Nice to meet you!
 * Fachliche Grundlage: Lighthouse Band 1, S. 8-14 sowie Wortschatz S. 180-182.
 * Alle Aufgaben und Beispielsätze sind eigenständig formuliert; keine Buchtexte.
 */
window.SCHULWEG = window.SCHULWEG || { faecher: {} };

(function () {
  "use strict";

  function text(frage, richtig, erklaerung, akzeptiert) {
    var a = {
      typ: "text",
      frage: frage,
      richtig: richtig,
      erklaerung: erklaerung,
      schritte: ["Lies genau, in welche Sprache du übersetzen sollst.", "Prüfe am Ende jedes Wort und die Schreibweise."]
    };
    if (akzeptiert) a.akzeptiert = akzeptiert;
    return a;
  }

  var pruefungA = [
    text("Translate into English: ‚die Lieblingsfarbe‘", "favourite colour", "Im britischen Englisch heißt es favourite colour.", ["favorite color"]),
    text("Translate into German: ‘student’", "Schüler", "student = Schüler oder Schülerin.", ["Schülerin", "Schüler/in", "Student", "Studentin"]),
    text("Translate into English: ‚schwimmen‘", "swim", "schwimmen = swim"),
    text("Translate into German: ‘beach’", "Strand", "beach = Strand", ["der Strand"]),
    text("Translate into English: ‚dreizehn‘", "thirteen", "dreizehn = thirteen"),
    text("Translate into German: ‘purple’", "lila", "purple = lila oder violett.", ["violett", "lila / violett"]),
    text("Translate into English: ‚das Hobby‘", "hobby", "das Hobby = hobby"),
    text("Translate into German: ‘meet’", "kennenlernen", "meet kann kennenlernen oder treffen bedeuten.", ["treffen", "kennenlernen / treffen"]),
    text("Translate into English: ‚unser/e‘", "our", "unser/e = our"),
    text("Translate the full sentence into English: ‚Meine Lieblingsfarbe ist grün.‘", "My favourite colour is green.", "Ein vollständiger Satz beginnt groß und endet mit einem Punkt.", ["My favourite colour is green", "My favorite color is green.", "My favorite color is green"])
  ];

  var pruefungB = [
    text("Translate into German: ‘What’s your name?’", "Wie heißt du?", "Die Frage fragt nach dem Namen.", ["Wie ist dein Name?", "Was ist dein Name?"]),
    text("Translate into English: ‚spielen‘", "play", "spielen = play"),
    text("Translate into German: ‘yellow’", "gelb", "yellow = gelb"),
    text("Translate into English: ‚vierzehn‘", "fourteen", "vierzehn = fourteen"),
    text("Translate into German: ‘watch TV’", "fernsehen", "watch TV = fernsehen"),
    text("Translate into English: ‚das Tier‘", "animal", "das Tier = animal"),
    text("Translate into German: ‘too’", "auch", "too bedeutet hier auch."),
    text("Translate into English: ‚Ich komme aus Deutschland.‘", "I'm from Germany.", "Für die Herkunft nutzt du I'm from ...", ["I am from Germany.", "I'm from Germany", "I am from Germany"]),
    text("Translate into German: ‘favourite colour’", "Lieblingsfarbe", "favourite colour = Lieblingsfarbe", ["die Lieblingsfarbe"]),
    text("Translate the full sentence into German: ‘I like reading and playing games.’", "Ich lese und spiele gern Spiele.", "Hier werden zwei Hobbys mit and verbunden.", ["Ich mag Lesen und Spiele spielen.", "Ich lese gern und spiele gern Spiele.", "Ich mag lesen und Spiele spielen."])
  ];

  var arbeit = [
    { typ: "mc", frage: "Choose the best reply: ‘Hi, I’m Alex.’", antworten: ["Nice to meet you!", "I’m a beach.", "It’s purple."], richtig: "Nice to meet you!", erklaerung: "So begrüßt du eine Person freundlich." },
    text("Complete the question: ‘What’s ___ name?’", "your", "Die feste Frage lautet: What’s your name?"),
    text("Complete: ‘I’m ___ Germany.’", "from", "Für Herkunft benutzt du from."),
    { typ: "mc", frage: "Which sentence talks about a hobby?", antworten: ["I like dancing.", "I’m from England.", "My name is Kim."], richtig: "I like dancing.", erklaerung: "I like + -ing kann ein Hobby ausdrücken." },
    text("Complete: ‘My favourite colour ___ blue.’", "is", "Bei einer Sache steht is."),
    { typ: "mc", frage: "Choose the correct article.", antworten: ["an elephant", "a elephant", "an dog"], richtig: "an elephant", erklaerung: "Vor einem gesprochenen Vokal steht an." },
    text("Complete: ‘I don’t ___ snakes.’", "like", "Nach don't steht die Grundform like."),
    text("Translate into English: ‚Ich habe einen Hamster.‘", "I have a hamster.", "have = haben; vor hamster steht a.", ["I have a hamster"]),
    { typ: "mc", frage: "Which sentence is correct?", antworten: ["It’s a small cat.", "It’s an small cat.", "It a small cat."], richtig: "It’s a small cat.", erklaerung: "Vor small steht a; It's bedeutet It is." },
    text("Translate into English: ‚Mein Fahrrad ist großartig.‘", "My bike is great.", "my bike = mein Fahrrad; great = großartig.", ["My bike is great"]),
    { typ: "mc", frage: "What are your hobbies?", antworten: ["I like swimming and reading.", "I am eleven years.", "My colour from blue."], richtig: "I like swimming and reading.", erklaerung: "Die Antwort nennt zwei Hobbys." },
    text("Write the missing number: eleven, twelve, ___, fourteen", "thirteen", "Nach twelve folgt thirteen."),
    text("Translate into German: ‘Can you remember the animals?’", "Kannst du dich an die Tiere erinnern?", "remember = sich erinnern.", ["Kannst du dich an die Tiere erinnern", "Könnt ihr euch an die Tiere erinnern?", "Könnt ihr euch an die Tiere erinnern"])
  ];

  var seite182 = [
    text("Translate into English: ‚das Kaninchen‘", "rabbit", "das Kaninchen = rabbit"),
    text("Translate into German: ‘snake’", "Schlange", "snake = Schlange", ["die Schlange"]),
    text("Translate into English: ‚der Vogel‘", "bird", "der Vogel = bird"),
    text("Translate into German: ‘wild’", "wild", "wild = wild", ["wild lebend"]),
    text("Translate into English: ‚das Haustier‘", "pet", "das Haustier = pet"),
    { typ: "mc", frage: "Choose the correct article.", antworten: ["a tiger", "an tiger", "a elephant"], richtig: "a tiger", erklaerung: "tiger beginnt mit einem gesprochenen Konsonanten: a tiger." },
    text("Complete: ‘A fish — ___ yellow.’", "it's", "It's ist die Kurzform von it is.", ["it is"]),
    text("Translate into English: ‚klein‘", "small", "klein = small"),
    text("Translate into German: ‘on a bike’", "auf einem Fahrrad", "on = auf; bike = Fahrrad.", ["auf dem Fahrrad"]),
    text("Translate the sentence into English: ‚Reiten macht Spaß.‘", "Riding is fun.", "Für die Tätigkeit steht hier Riding; is fun = macht Spaß.", ["Riding is fun"])
  ];

  window.SCHULWEG.faecher["englisch-5"] = {
    fach: "Englisch",
    klasse: 5,
    farbe: "englisch",
    icon: "🇬🇧",
    themen: [
      {
        id: "vokabeltest-180-181-a",
        titel: "Vokabeltest – Probe A",
        seiten: "S. 180–181",
        voraussetzung: "Wortschatz zu Begrüßung, Farben und Hobbys",
        intro: "Wie im angekündigten Test: neun Vokabeln und ein Satz, gemischt Deutsch–Englisch und Englisch–Deutsch. Der Satz zählt in der Schule zwei Punkte. Arbeite ohne Zeitdruck und kontrolliere die Schreibweise.",
        aufgaben: pruefungA
      },
      {
        id: "vokabeltest-180-181-b",
        titel: "Vokabeltest – Probe B",
        seiten: "S. 180–181",
        voraussetzung: "Wortschatz zu Namen, Herkunft, Zahlen und Freizeit",
        intro: "Eine zweite vollständige Probe mit neun Vokabeln und einem Satz. Sprich jedes englische Wort nach der Lösung einmal laut aus.",
        aufgaben: pruefungB
      },
      {
        id: "arbeit-nice-to-meet-you",
        titel: "Englischarbeit: Nice to meet you",
        seiten: "S. 8–14 und S. 180–182",
        voraussetzung: "Begrüßung, Name, Herkunft, Farben, Hobbys und Tiere",
        intro: "Vorbereitung auf die Englischarbeit am 16.10.2026: Hier verknüpfst du Wörter mit eigenen neuen Sätzen – vorstellen, nachfragen, Vorlieben nennen und Tiere beschreiben. Das ist aktives Abrufen statt bloßes Wiederlesen.",
        aufgaben: arbeit
      },
      {
        id: "vokabeln-182",
        titel: "5-Minuten-Runde: Tiere & mehr",
        seiten: "S. 182",
        voraussetzung: "die neuen Tierwörter einmal angesehen",
        intro: "Eine kurze gemischte Runde für die Projektwoche. Übe lieber täglich fünf bis zehn Minuten als alles auf einmal.",
        aufgaben: seite182
      }
    ]
  };

  // Vollständiger Lernwortschatz der drei bereitgestellten Seiten. Phrasen und
  // Zahlen bleiben eigene Karten, weil genau sie laut Lehrkraft geprüft werden.
  var vocab = [
    ["Freut mich, dich/euch kennenzulernen.", "Nice to meet you!"], ["nett / schön", "nice"], ["kennenlernen / treffen", "meet"],
    ["du / dich / dir; ihr / euch", "you"], ["Hallo", "hello", ["hi"]], ["Ich bin … / Ich heiße …", "I'm …"], ["der Krebs", "crab"],
    ["Wie heißt du?", "What's your name?"], ["was?", "what?"], ["dein/e; euer/eure", "your"], ["der Name", "name"],
    ["eins", "one"], ["zwei", "two"], ["drei", "three"], ["vier", "four"], ["fünf", "five"], ["sechs", "six"],
    ["sieben", "seven"], ["acht", "eight"], ["neun", "nine"], ["zehn", "ten"], ["elf", "eleven"], ["zwölf", "twelve"],
    ["dreizehn", "thirteen"], ["vierzehn", "fourteen"], ["Und du? / Und was ist mit dir?", "What about you?"],
    ["Ich komme aus …", "I'm from …"], ["in England", "in England"], ["in Deutschland", "in Germany"], ["die Klasse", "class"],
    ["können", "can"], ["und", "and"], ["der Strand", "beach"], ["das Lied / der Song", "song"], ["mein/e", "my"],
    ["die Lieblingsfarbe", "favourite colour", ["favorite color"]], ["die Farbe", "colour", ["color"]], ["Willkommen in …", "Welcome to …"],
    ["rot", "red"], ["gelb", "yellow"], ["blau", "blue"], ["grün", "green"], ["braun", "brown"], ["orange", "orange"],
    ["grau", "grey", ["gray"]], ["rosa / pink", "pink"], ["lila / violett", "purple"], ["weiß", "white"], ["schwarz", "black"],
    ["Ich mag Rot.", "I like red."], ["Ich mag Blau nicht.", "I don't like blue."], ["mögen / gernhaben", "like"],
    ["Meine Lieblingsfarbe ist …", "My favourite colour is …", ["My favorite color is …"]], ["der/die Schüler/in", "student"],
    ["der Sport / die Sportart", "sport"], ["das Hobby", "hobby"], ["der Fußball", "football"], ["die Musik", "music"],
    ["Ich sehe gern fern.", "I like watching TV."], ["fernsehen", "watch TV"], ["der Fernseher / das Fernsehen", "TV"], ["auch", "too"],
    ["tanzen", "dance"], ["spielen", "play"], ["das Spiel", "game"], ["lesen", "read"], ["das Buch", "book"], ["reiten", "ride"],
    ["Skateboard fahren", "skateboard"], ["schwimmen", "swim"], ["Was sind …?", "What are …?"], ["unser/e", "our"],
    ["das Tier", "animal"], ["haben", "have"], ["das Pony", "pony"], ["lieben / sehr mögen", "love"], ["die Katze", "cat"],
    ["der Bär", "bear"], ["die Ratte", "rat"], ["der Affe", "monkey"], ["der Vogel", "bird"], ["die Schlange", "snake"],
    ["der Hund", "dog"], ["das Krokodil", "crocodile"], ["das Kaninchen", "rabbit"], ["der Hamster", "hamster"],
    ["der Fisch / die Fische", "fish"], ["der Tiger", "tiger"], ["ein Elefant", "an elephant"],
    ["Kannst du dich an die Tiere erinnern?", "Can you remember the animals?"], ["sich erinnern (an)", "remember"],
    ["das Haustier", "pet"], ["wild / wild lebend", "wild"], ["das Paar", "pair"], ["das Ding / die Sache", "thing"],
    ["es ist", "it's", ["it is"]], ["gehen / fahren", "go"], ["zu / nach", "to"], ["der Park", "park"], ["auf", "on"],
    ["das Fahrrad", "bike"], ["großartig / prima", "great"], ["es macht Spaß", "it's fun", ["it is fun"]],
    ["klein", "small"], ["groß", "big"], ["alt", "old"],
    ["wo? / woher?", "where"], ["das Alter", "age"]
  ];
  window.SCHULWEG.faecher["englisch-5"].vokabeltrainer = vocab.map(function (v, i) {
    var item = { id: "en5_" + String(i + 1).padStart(4, "0"), de: v[0], en: v[1] };
    if (v[2]) item.alt = v[2];
    return item;
  });

  // Die vorhandenen lokalen Dialog-Lernreisen werden für Klasse 5 getrennt
  // geklont. Fortschritt und Vokabelstand bleiben dadurch pro Klassenbereich.
  window.SCHULWEG.lernreisen = window.SCHULWEG.lernreisen || [];
  var idZuEnglisch = {
    en6_0074: "hello", en6_0006: "name", en6_0004: "what?", en6_0005: "your",
    en6_0012: "my", en6_0001: "nice", en6_0002: "meet", en6_0033: "too",
    en6_0104: "where", en6_0069: "old", en6_0094: "age"
  };
  var englischZuId = {};
  window.SCHULWEG.faecher["englisch-5"].vokabeltrainer.forEach(function (v) {
    englischZuId[v.en.toLowerCase()] = v.id;
    (v.alt || []).forEach(function (a) { englischZuId[a.toLowerCase()] = v.id; });
  });
  [window.SCHULWEG.unit1, window.SCHULWEG.unit1k2].forEach(function (quelle) {
    if (!quelle) return;
    var reise = JSON.parse(JSON.stringify(quelle));
    reise.fachKey = "englisch-5";
    if (reise.kompetenz && Array.isArray(reise.kompetenz.vokabelIds)) {
      reise.kompetenz.vokabelIds = reise.kompetenz.vokabelIds.map(function (id) {
        return englischZuId[idZuEnglisch[id]];
      }).filter(Boolean);
    }
    window.SCHULWEG.lernreisen.push(reise);
  });
})();
