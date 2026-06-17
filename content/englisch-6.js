/*
 * Englisch Klasse 6 - Klausurvorbereitung (Theme 5: will/won't, Wetter,
 * Adverbien, Bahnhof, E-Mail). Aufgaben aus ChatGPT-Analyse, von Claude
 * auf App-Schema geprueft/korrigiert. Eigene Aufgaben, keine Buchkopien.
 *
 * Typen: "mc" | "text" (eindeutige Antwort, Gross/Klein egal) |
 *        "freitext" (freie Antwort -> KI gibt Feedback, kein richtig/falsch)
 */
window.SCHULWEG = window.SCHULWEG || { faecher: {} };

window.SCHULWEG.faecher["englisch-6"] = {
  fach: "Englisch",
  klasse: 6,
  farbe: "englisch",
  icon: "🇬🇧",
  themen: [
    {
      id: "klausur-theme5",
      titel: "Klausurvorbereitung (Theme 5)",
      seiten: "S.94–96, 106–107, 157",
      voraussetzung: "einfache Zukunftssätze mit 'I'll' und den wichtigsten Wortschatz",
      intro:
        "Diese Übungen sind genau auf deine Klassenarbeit zugeschnitten: will/won't, Wetter, Adverbien, Bahnhof und das E-Mail-Schreiben. Sie werden langsam schwerer.",
      aufgaben: [
        {
          typ: "mc",
          frage: "Tomorrow it ____ rain.",
          antworten: ["will", "won't", "is"],
          richtig: "will",
          erklaerung: "Für Vorhersagen in der Zukunft nutzt du 'will'.",
          schritte: ["Achte auf 'Tomorrow' → Zukunft.", "Nutze 'will'."],
          fehler: {
            "won't": "'won't' heißt, dass etwas NICHT passiert. Hier ist eine normale Vorhersage gemeint → will.",
            "is": "'is' ist Gegenwart. Für morgen brauchst du die Zukunft mit 'will'."
          }
        },
        {
          typ: "text",
          frage: "Complete: I think it ___ (be) sunny tomorrow.",
          richtig: "will be",
          erklaerung: "Nach 'I think' und für morgen nutzt du will + Grundform: 'will be'.",
          schritte: ["Denke an die Zukunft (tomorrow).", "Setze 'will be' ein."],
          fehler: {
            "is": "Das ist Gegenwart. Für morgen brauchst du 'will be'.",
            "be": "'be' allein reicht nicht – es fehlt 'will'.",
            "will": "Es fehlt das 'be': richtig ist 'will be'."
          }
        },
        {
          typ: "mc",
          frage: "Choose the correct word: She runs ____.",
          antworten: ["quick", "quickly", "careful"],
          richtig: "quickly",
          erklaerung: "Wie jemand etwas tut, beschreibt ein Adverb (oft mit -ly).",
          schritte: ["Suche das Verb: runs.", "Beschreibe das Verb mit einem Adverb: quickly."],
          fehler: {
            "quick": "'quick' ist ein Adjektiv. Für das Verb brauchst du das Adverb 'quickly'.",
            "careful": "Passt inhaltlich nicht – und ist außerdem ein Adjektiv."
          }
        },
        {
          typ: "text",
          frage: "Complete: He is very ___ (careful / carefully) with his work.",
          richtig: "careful",
          erklaerung: "Nach 'is' (Form von to be) steht ein Adjektiv.",
          schritte: ["Erkenne to be: 'is'.", "Nach to be nutzt du ein Adjektiv: careful."],
          fehler: {
            "carefully": "Nach 'is' braucht man ein Adjektiv, kein Adverb – also 'careful'."
          }
        },
        {
          typ: "mc",
          frage: "Which word belongs to the train station?",
          antworten: ["platform", "snow", "tent"],
          richtig: "platform",
          erklaerung: "'platform' (Bahnsteig) gehört zum Bahnhof.",
          schritte: ["Denke an den Bahnhof.", "Wähle das passende Wort."],
          fehler: {
            "snow": "'snow' (Schnee) gehört zum Wetter.",
            "tent": "'tent' (Zelt) gehört zum Camping."
          }
        },
        {
          typ: "text",
          frage: "Complete: The train ___ (leave) from Platform 4 at 9 a.m.",
          richtig: "leaves",
          erklaerung: "Feste Fahrpläne stehen im Simple Present – bei 'the train' (it) mit -s.",
          schritte: ["Es geht um einen Fahrplan → Simple Present.", "Bei 'the train' (it) kommt ein -s dran: leaves."],
          fehler: {
            "leave": "Bei 'the train' (it) fehlt das -s: richtig ist 'leaves'.",
            "will leave": "Bei einem festen Fahrplan nimmt man das Simple Present: 'leaves'."
          }
        },
        {
          typ: "mc",
          frage: "It's minus five degrees. It's ____.",
          antworten: ["windy", "freezing", "sunny"],
          richtig: "freezing",
          erklaerung: "Bei Minusgraden ist es eiskalt: freezing.",
          schritte: ["Lies die Temperatur: minus five.", "Wähle das Wort für eiskalt: freezing."],
          fehler: {
            "windy": "'windy' (windig) sagt nichts über die Temperatur.",
            "sunny": "'sunny' (sonnig) passt nicht zu minus fünf Grad."
          }
        },
        {
          typ: "text",
          frage: "Complete: I hope it ___ rain tomorrow.",
          richtig: "won't",
          akzeptiert: ["will not"],
          erklaerung: "Wenn du hoffst, dass etwas NICHT passiert, nutzt du 'won't' (= will not).",
          schritte: ["Achte auf 'I hope' – du wünschst dir etwas.", "Du willst KEINEN Regen → won't."],
          fehler: {
            "will": "'will' würde heißen, dass es regnet – das Gegenteil von dem, was man hofft.",
            "will not": "Richtig gedacht! Schreib nur die Kurzform: won't.",
            "doesn't": "Es geht um morgen (Zukunft): nutze 'won't'."
          }
        },
        {
          typ: "mc",
          frage: "Look at the dark clouds! It ____ rain soon.",
          antworten: ["will", "won't", "does"],
          richtig: "will",
          erklaerung: "Anzeichen wie dunkle Wolken → Vorhersage mit will.",
          schritte: ["Dunkle Wolken = Anzeichen für Regen.", "Vorhersage mit 'will'."],
          fehler: {
            "won't": "Dunkle Wolken heißt: Es WIRD regnen. 'won't' wäre das Gegenteil.",
            "does": "'does' passt hier nicht – für eine Vorhersage nutzt du 'will'."
          }
        },
        {
          typ: "text",
          frage: "Make it negative: 'It will snow.' → 'It ___ snow.'",
          richtig: "won't",
          akzeptiert: ["will not"],
          erklaerung: "Die Verneinung von 'will' ist 'won't' (= will not).",
          schritte: ["will + not = won't.", "'It won't snow.'"],
          fehler: {
            "will": "Du sollst den Satz VERNEINEN: won't.",
            "doesn't": "Die Verneinung der Zukunft ist won't, nicht doesn't."
          }
        },
        {
          typ: "text",
          frage: "Adverb of 'slow' = ___",
          richtig: "slowly",
          erklaerung: "Aus dem Adjektiv 'slow' wird mit -ly das Adverb 'slowly'.",
          schritte: ["Adjektiv: slow.", "+ -ly = slowly."],
          fehler: {
            "slow": "Das ist das Adjektiv. Das Adverb ist slowly.",
            "slowley": "Fast! Die richtige Schreibweise ist slowly."
          }
        },
        {
          typ: "mc",
          frage: "He speaks very ____.",
          antworten: ["quiet", "quietly", "quietness"],
          richtig: "quietly",
          erklaerung: "Wie er spricht (Verb) → Adverb: quietly.",
          schritte: ["Verb: speaks.", "Beschreibe es mit einem Adverb: quietly."],
          fehler: {
            "quiet": "'quiet' ist ein Adjektiv. Das Verb 'speaks' braucht ein Adverb: quietly.",
            "quietness": "Das ist ein Nomen (die Stille)."
          }
        },
        {
          typ: "text",
          frage: "Complete: She is a ___ (careful / carefully) driver.",
          richtig: "careful",
          erklaerung: "Vor einem Nomen ('driver') steht ein Adjektiv.",
          schritte: ["'driver' ist ein Nomen.", "Davor steht ein Adjektiv: careful."],
          fehler: {
            "carefully": "Vor dem Nomen 'driver' steht ein Adjektiv: careful (nicht das Adverb)."
          }
        },
        {
          typ: "mc",
          frage: "She sings ____.",
          antworten: ["beautiful", "beautifully"],
          richtig: "beautifully",
          erklaerung: "Wie sie singt (Verb) → Adverb: beautifully.",
          schritte: ["Verb: sings.", "Adverb dazu: beautifully."],
          fehler: {
            "beautiful": "'beautiful' ist ein Adjektiv. Das Verb 'sings' braucht ein Adverb: beautifully."
          }
        },
        {
          typ: "mc",
          frage: "There is a lot of wind today. It's ____.",
          antworten: ["foggy", "windy", "hot"],
          richtig: "windy",
          erklaerung: "Viel Wind → it's windy.",
          schritte: ["Wind = wind.", "windig = windy."],
          fehler: {
            "foggy": "'foggy' heißt neblig.",
            "hot": "'hot' heißt heiß – das passt nicht zu Wind."
          }
        },
        {
          typ: "mc",
          frage: "I can't see far. There is a lot of ____.",
          antworten: ["fog", "sun", "snow"],
          richtig: "fog",
          erklaerung: "Schlechte Sicht → Nebel (fog).",
          schritte: ["Man sieht schlecht.", "Das Wort dafür ist fog (Nebel)."],
          fehler: {
            "sun": "Bei Sonne sieht man gut.",
            "snow": "Schnee ist möglich, aber das Wort für schlechte Sicht ist fog."
          }
        },
        {
          typ: "text",
          frage: "Translate into English: 'bewölkt' = ___",
          richtig: "cloudy",
          erklaerung: "Wolke = cloud, bewölkt = cloudy.",
          schritte: ["Wolke = cloud.", "bewölkt = cloudy."],
          fehler: {
            "clody": "Fast! Die Schreibweise ist cloudy.",
            "windy": "'windy' heißt windig, nicht bewölkt."
          }
        },
        {
          typ: "mc",
          frage: "You need a ____ to travel by train.",
          antworten: ["ticket", "tent", "towel"],
          richtig: "ticket",
          erklaerung: "Zum Bahnfahren brauchst du eine Fahrkarte: ticket.",
          schritte: ["Denke an den Bahnhof.", "Fahrkarte = ticket."],
          fehler: {
            "tent": "'tent' (Zelt) gehört zum Camping.",
            "towel": "'towel' heißt Handtuch."
          }
        },
        {
          typ: "text",
          frage: "Opposite of 'to arrive' (at the station) = to ___",
          richtig: "leave",
          akzeptiert: ["depart"],
          erklaerung: "ankommen = arrive, abfahren = leave (oder depart).",
          schritte: ["arrive = ankommen.", "Das Gegenteil ist leave (abfahren)."],
          fehler: {
            "arrive": "Das ist dasselbe Wort – das Gegenteil ist leave.",
            "go": "Zu allgemein. Am Bahnhof sagt man leave (oder depart)."
          }
        },
        {
          typ: "freitext",
          frage: "Finish with your own idea: 'I'll take my rain gear because ___.' (Schreibe einen ganzen Grund.)",
          musterloesung: "I'll take my rain gear because it will rain.",
          tipp: "Am besten mit 'will', z. B. 'because it will rain'."
        },
        {
          typ: "freitext",
          frage: "Write one sentence about your weekend: 'On Saturday I'll ___.'",
          musterloesung: "On Saturday I'll play football with my friends.",
          tipp: "Beginne mit 'On Saturday I'll' und schreibe einen ganzen Satz."
        },
        {
          typ: "freitext",
          frage: "Write one sentence with a reason: 'I think I'll ___ because ___.'",
          musterloesung: "I think I'll stay at home because it will rain.",
          tipp: "Verbinde eine Zukunftsabsicht (I'll …) mit einem Grund (because …)."
        },
        {
          typ: "freitext",
          frage: "Mini-E-Mail (4 Sätze): Erzähle deiner Freundin/deinem Freund vom nächsten Wochenende. Benutze: I'll, won't, because und ein Wetterwort.",
          musterloesung: "Hi! Next weekend I'll go camping with my family. I hope it won't rain because we want to hike. It will be sunny, so I'll take my sunglasses. See you soon!",
          tipp: "Schreibe 4 ganze Sätze und benutze alle vier: I'll, won't, because und ein Wetterwort."
        },
        {
          typ: "freitext",
          frage: "Write a weather forecast for tomorrow (2 sentences). Use 'will' and at least one weather word.",
          musterloesung: "Tomorrow it will be cloudy in the morning. In the afternoon it will be sunny and warm.",
          tipp: "Nutze 'will' und mindestens ein Wetterwort (sunny, cloudy, windy …)."
        }
      ]
    },
    {
      id: "vokabeln-unit5",
      titel: "Vokabeln Unit 5",
      seiten: "S.213–214 (Vokabelliste)",
      voraussetzung: "nichts Besonderes – einfach die neuen Wörter üben",
      intro: "Trainiere die wichtigen Vokabeln aus Unit 5. Tippe das englische Wort – Groß-/Kleinschreibung ist egal.",
      aufgaben: [
        { typ: "text", frage: "Wetter: 'windig' auf Englisch?", richtig: "windy", erklaerung: "windig = windy.", schritte: ["der Wind = wind", "windig = windy"] },
        { typ: "text", frage: "Wetter: 'der Wind' auf Englisch?", richtig: "wind", erklaerung: "der Wind = wind.", schritte: ["wind = der Wind"] },
        { typ: "text", frage: "Wetter: 'wolkig' auf Englisch?", richtig: "cloudy", erklaerung: "wolkig = cloudy.", schritte: ["die Wolke = cloud", "wolkig = cloudy"] },
        { typ: "text", frage: "Wetter: 'die Wolke' auf Englisch?", richtig: "cloud", erklaerung: "die Wolke = cloud.", schritte: ["cloud = die Wolke"] },
        { typ: "text", frage: "Wetter: 'eiskalt / eisig' auf Englisch?", richtig: "freezing", erklaerung: "eiskalt = freezing.", schritte: ["freeze = (ein)frieren", "freezing = eiskalt"] },
        { typ: "text", frage: "Wetter: 'der Schnee' auf Englisch?", richtig: "snow", erklaerung: "der Schnee = snow.", schritte: ["snow = der Schnee"] },
        { typ: "text", frage: "Wetter: 'verschneit / schneebedeckt' auf Englisch?", richtig: "snowy", erklaerung: "verschneit = snowy.", schritte: ["snow = Schnee", "snowy = verschneit"] },
        { typ: "text", frage: "Wetter: 'kühl' auf Englisch?", richtig: "cool", erklaerung: "kühl = cool.", schritte: ["cool = kühl"] },
        { typ: "text", frage: "Wetter: 'der Grad' (Temperatur) auf Englisch?", richtig: "degree", akzeptiert: ["degrees"], erklaerung: "der Grad = degree (Mehrzahl: degrees).", schritte: ["14 degrees = 14 Grad"] },
        { typ: "text", frage: "Wetter: 'die Jahreszeit' auf Englisch?", richtig: "season", erklaerung: "die Jahreszeit = season.", schritte: ["four seasons = vier Jahreszeiten"] },
        { typ: "text", frage: "Jahreszeit: 'der Frühling' auf Englisch?", richtig: "spring", erklaerung: "der Frühling = spring.", schritte: ["spring = Frühling"] },
        { typ: "text", frage: "Jahreszeit: 'der Sommer' auf Englisch?", richtig: "summer", erklaerung: "der Sommer = summer.", schritte: ["summer = Sommer"] },
        { typ: "text", frage: "Jahreszeit: 'der Herbst' auf Englisch?", richtig: "autumn", akzeptiert: ["fall"], erklaerung: "der Herbst = autumn (in den USA: fall).", schritte: ["autumn = Herbst"] },
        { typ: "text", frage: "Jahreszeit: 'der Winter' auf Englisch?", richtig: "winter", erklaerung: "der Winter = winter.", schritte: ["winter = Winter"] },
        { typ: "mc", frage: "Was bedeutet 'autumn'?", antworten: ["Herbst", "Frühling", "Sommer"], richtig: "Herbst", erklaerung: "autumn = Herbst.", schritte: ["autumn = Herbst"], fehler: { "Frühling": "Frühling heißt spring.", "Sommer": "Sommer heißt summer." } },
        { typ: "mc", frage: "Welches Wort bedeutet 'eiskalt'?", antworten: ["freezing", "cool", "windy"], richtig: "freezing", erklaerung: "eiskalt = freezing.", schritte: ["freezing = eiskalt"], fehler: { "cool": "cool heißt kühl.", "windy": "windy heißt windig." } },
        { typ: "text", frage: "Allgemein: 'die Zukunft' auf Englisch?", richtig: "future", erklaerung: "die Zukunft = future.", schritte: ["future = Zukunft"] },
        { typ: "text", frage: "Allgemein: 'der Zug' auf Englisch?", richtig: "train", erklaerung: "der Zug = train.", schritte: ["train = Zug"] },
        { typ: "text", frage: "Allgemein: 'fotografieren / Fotos machen' auf Englisch?", richtig: "take photos", akzeptiert: ["take a photo", "take photo", "take a picture"], erklaerung: "Fotos machen = take photos (NICHT make photos).", schritte: ["take a photo = ein Foto machen"] },
        { typ: "text", frage: "Adverb: 'langsam' (wie man etwas tut) auf Englisch?", richtig: "slowly", erklaerung: "langsam (Adverb) = slowly.", schritte: ["slow = langsam (Adjektiv)", "slowly = langsam (Adverb)"] },
        { typ: "text", frage: "Adverb: 'schnell' (wie man etwas tut) auf Englisch?", richtig: "quickly", erklaerung: "schnell (Adverb) = quickly.", schritte: ["quick = schnell (Adjektiv)", "quickly = schnell (Adverb)"] },
        { typ: "text", frage: "Weg: 'geradeaus' auf Englisch?", richtig: "straight on", akzeptiert: ["straight ahead"], erklaerung: "geradeaus = straight on.", schritte: ["Go straight on. = Geh geradeaus."] },
        { typ: "mc", frage: "Wie sagst du 'Bieg links ab'?", antworten: ["Turn left.", "Turn right.", "Go straight on."], richtig: "Turn left.", erklaerung: "links abbiegen = turn left.", schritte: ["left = links"], fehler: { "Turn right.": "Das heißt rechts abbiegen.", "Go straight on.": "Das heißt geradeaus gehen." } },
        { typ: "text", frage: "Weg: 'vorwärts / nach vorn' auf Englisch?", richtig: "forward", erklaerung: "nach vorn = forward.", schritte: ["one step forward = ein Schritt nach vorn"] },
        { typ: "text", frage: "Wortschatz: 'die Sicherheit' auf Englisch?", richtig: "safety", erklaerung: "die Sicherheit = safety.", schritte: ["safe = sicher", "safety = Sicherheit"] },
        { typ: "text", frage: "Wortschatz: 'der Kompass' auf Englisch?", richtig: "compass", erklaerung: "der Kompass = compass.", schritte: ["compass = Kompass"] },
        { typ: "text", frage: "Wortschatz: 'der Abfall / Müll' auf Englisch?", richtig: "litter", erklaerung: "der Abfall = litter.", schritte: ["litter bin = Mülleimer"] },
        { typ: "text", frage: "Wortschatz: 'der Mülleimer' auf Englisch?", richtig: "litter bin", akzeptiert: ["bin"], erklaerung: "der Mülleimer = litter bin.", schritte: ["litter = Abfall", "litter bin = Mülleimer"] },
        { typ: "text", frage: "Wortschatz: 'die Brücke' auf Englisch?", richtig: "bridge", erklaerung: "die Brücke = bridge.", schritte: ["bridge = Brücke"] },
        { typ: "text", frage: "Wortschatz: 'der Stein' auf Englisch?", richtig: "stone", erklaerung: "der Stein = stone.", schritte: ["stone = Stein"] }
      ]
    },
    {
      id: "durchsagen",
      titel: "Bahnhof: Durchsagen verstehen",
      seiten: "S.100",
      voraussetzung: "Bahnhofswortschatz (platform, train, leave …)",
      intro: "Lies die Durchsage genau und beantworte die Frage. So übst du, das Wichtigste herauszuhören – hier zum Lesen.",
      aufgaben: [
        {
          typ: "text",
          frage: "Announcement: 'The train to London leaves from platform 3.' — From which platform does the train leave? (number)",
          richtig: "3",
          erklaerung: "platform = Gleis/Bahnsteig. Hier: platform 3.",
          schritte: ["Suche das Wort 'platform' in der Durchsage.", "Dahinter steht die Zahl: 3."]
        },
        {
          typ: "text",
          frage: "Announcement: 'The train to Manchester is delayed by 10 minutes.' — How many minutes is the delay? (number)",
          richtig: "10",
          erklaerung: "delayed = verspätet. 10 minutes = 10 Minuten.",
          schritte: ["'delayed' = Verspätung.", "Suche die Zahl der Minuten: 10."]
        },
        {
          typ: "mc",
          frage: "Announcement: 'The 8 o'clock train to Bristol has been cancelled.' — What happened to the train?",
          antworten: ["It is cancelled.", "It is delayed.", "It is on time."],
          richtig: "It is cancelled.",
          erklaerung: "cancelled = fällt aus / gestrichen.",
          schritte: ["Suchwort: cancelled.", "cancelled = fällt aus."],
          fehler: {
            "It is delayed.": "'delayed' wäre verspätet. Hier steht 'cancelled' = fällt aus.",
            "It is on time.": "'cancelled' heißt, der Zug fährt gar nicht."
          }
        },
        {
          typ: "mc",
          frage: "Announcement: 'The next train to York will leave from platform 5.' — Where does the train leave from?",
          antworten: ["Platform 3", "Platform 5", "Platform 15"],
          richtig: "Platform 5",
          erklaerung: "In der Durchsage steht 'platform 5'.",
          schritte: ["Suche 'platform'.", "platform 5."],
          fehler: {
            "Platform 3": "In der Durchsage steht platform 5, nicht 3.",
            "Platform 15": "Es ist platform 5, nicht 15."
          }
        },
        {
          typ: "mc",
          frage: "Announcement: 'The train from Edinburgh is now arriving at platform 2.' — What is happening?",
          antworten: ["A train is arriving.", "A train is leaving.", "A train is cancelled."],
          richtig: "A train is arriving.",
          erklaerung: "arriving = ankommend – der Zug kommt gerade an.",
          schritte: ["Suchwort: arriving.", "arrive = ankommen."],
          fehler: {
            "A train is leaving.": "Abfahren wäre 'leaving' / 'departing'. Hier: 'arriving' = ankommen.",
            "A train is cancelled.": "Ausfallen wäre 'cancelled'. Hier kommt der Zug an."
          }
        },
        {
          typ: "mc",
          frage: "Announcement: 'Please mind the gap between the train and the platform.' — What should you watch out for?",
          antworten: ["The gap between the train and the platform.", "Your ticket.", "The weather."],
          richtig: "The gap between the train and the platform.",
          erklaerung: "mind the gap = Achte auf den Spalt (zwischen Zug und Bahnsteig).",
          schritte: ["mind = achte auf.", "gap = Spalt/Lücke."],
          fehler: {
            "Your ticket.": "Von einem Ticket ist hier nicht die Rede.",
            "The weather.": "Es geht um den Spalt am Bahnsteig, nicht ums Wetter."
          }
        },
        {
          typ: "text",
          frage: "Announcement: 'The train to Leeds leaves at a quarter to four.' — What time does the train leave? (e.g. 6:15)",
          richtig: "3:45",
          akzeptiert: ["15:45", "quarter to four", "a quarter to four"],
          erklaerung: "a quarter to four = Viertel vor vier = 3:45 (oder 15:45).",
          schritte: ["quarter to = 15 Minuten vor der vollen Stunde.", "quarter to four = 3:45."]
        },
        {
          typ: "mc",
          frage: "Which word means the train comes LATER than planned?",
          antworten: ["delayed", "cancelled", "on time"],
          richtig: "delayed",
          erklaerung: "delayed = verspätet (kommt später).",
          schritte: ["delay = Verzögerung.", "delayed = verspätet."],
          fehler: {
            "cancelled": "'cancelled' heißt: der Zug fällt ganz aus.",
            "on time": "'on time' heißt pünktlich."
          }
        }
      ]
    }
  ]
};
