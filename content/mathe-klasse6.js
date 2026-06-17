/*
 * Mathematik Klasse 6 - Thema WINKEL (NRW, passend zu "Dreifach Mathe 6", Cornelsen, S. 84-89).
 * Eigene Uebungsaufgaben (keine Buchkopien) fuer die naechste Klausur.
 * Felder siehe content/mathe-klasse5.js.
 */
window.SCHULWEG = window.SCHULWEG || { faecher: {} };

window.SCHULWEG.faecher["mathe-6"] = {
  fach: "Mathematik",
  klasse: 6,
  farbe: "mathe",
  icon: "math-symbols",
  themen: [
    {
      id: "winkelarten",
      titel: "Winkelarten erkennen",
      voraussetzung: "Was ein Winkel ist (Scheitelpunkt, Schenkel)",
      intro:
        "Winkel teilt man nach ihrer Größe ein: spitz (kleiner 90°), recht (genau 90°), stumpf (zwischen 90° und 180°), gestreckt (genau 180°), überstumpf (zwischen 180° und 360°) und Vollwinkel (genau 360°).",
      explorer: { modus: "winkelarten" },
      aufgaben: [
        {
          typ: "mc",
          frage: "Ein Winkel misst 50°. Welche Winkelart ist das?",
          bild: { art: "winkel", grad: 50 },
          antworten: ["spitz", "recht", "stumpf"],
          richtig: "spitz",
          erklaerung: "Spitze Winkel sind größer als 0° und kleiner als 90°.",
          schritte: ["Spitz heißt: größer als 0° und kleiner als 90°.", "50° liegt zwischen 0° und 90° → spitz."],
          fehler: {
            "stumpf": "Stumpfe Winkel sind größer als 90°. 50° ist kleiner als 90° – also spitz.",
            "recht": "Ein rechter Winkel ist genau 90°. 50° ist kleiner – also spitz."
          }
        },
        {
          typ: "mc",
          frage: "Ein Winkel misst 130°. Welche Winkelart ist das?",
          antworten: ["spitz", "stumpf", "überstumpf"],
          richtig: "stumpf",
          erklaerung: "Stumpfe Winkel sind größer als 90° und kleiner als 180°.",
          schritte: ["Stumpf heißt: größer als 90° und kleiner als 180°.", "130° liegt dazwischen → stumpf."],
          fehler: {
            "spitz": "Spitze Winkel sind kleiner als 90°. 130° ist größer als 90° – also stumpf.",
            "überstumpf": "Überstumpfe Winkel sind größer als 180°. 130° ist kleiner als 180° – also stumpf."
          }
        },
        {
          typ: "mc",
          frage: "Ein Winkel misst 200°. Welche Winkelart ist das?",
          antworten: ["stumpf", "gestreckt", "überstumpf"],
          richtig: "überstumpf",
          erklaerung: "Überstumpfe Winkel sind größer als 180° und kleiner als 360°.",
          schritte: ["Bis 180° heißt der Winkel gestreckt.", "200° ist größer als 180° (aber kleiner als 360°) → überstumpf."],
          fehler: {
            "stumpf": "Stumpf gilt nur bis 180°. 200° ist größer – also überstumpf.",
            "gestreckt": "Gestreckt ist genau 180°. 200° ist größer – also überstumpf."
          }
        },
        {
          typ: "zahl",
          frage: "Wie viel Grad hat ein gestreckter Winkel?",
          richtig: "180",
          erklaerung: "Ein gestreckter Winkel bildet eine gerade Linie und misst 180°.",
          schritte: ["Ein Vollwinkel hat 360°.", "Der gestreckte Winkel ist die Hälfte davon: 360° : 2 = 180°."],
          fehler: {
            "360": "360° ist der Vollwinkel. Der gestreckte Winkel ist nur die Hälfte: 180°.",
            "90": "90° ist der rechte Winkel. Der gestreckte Winkel ist 180°."
          }
        },
        {
          typ: "mc",
          frage: "Wie heißt der Punkt, an dem die beiden Schenkel zusammentreffen?",
          antworten: ["Scheitelpunkt", "Winkelbogen", "Nullpunkt"],
          richtig: "Scheitelpunkt",
          erklaerung: "Die Schenkel beginnen im Scheitelpunkt S.",
          schritte: ["Die beiden geraden Linien heißen Schenkel.", "Ihr gemeinsamer Anfangspunkt ist der Scheitelpunkt."],
          fehler: {
            "Winkelbogen": "Der Winkelbogen ist der kleine Bogen, der den Winkel markiert. Der Treffpunkt der Schenkel heißt Scheitelpunkt.",
            "Nullpunkt": "Der Nullpunkt sitzt auf dem Geodreieck. Am Winkel selbst heißt der Treffpunkt Scheitelpunkt."
          }
        },
        {
          typ: "zahl",
          frage: "Schätze: Wie groß ist dieser Winkel ungefähr? (in Grad)",
          bild: { art: "winkel", grad: 70, opts: { zeigeGrad: false } },
          richtig: "70",
          toleranz: 12,
          erklaerung: "Der Winkel ist spitz (kleiner als 90°), ungefähr 70°.",
          schritte: ["Vergleiche mit einem rechten Winkel (90°).", "Der Winkel ist etwas kleiner → ungefähr 70°."]
        },
        {
          typ: "mc",
          frage: "Welche Winkelart zeigt das Bild?",
          bild: { art: "winkel", grad: 115, opts: { zeigeGrad: false } },
          antworten: ["spitz", "stumpf", "überstumpf"],
          richtig: "stumpf",
          erklaerung: "Der Winkel ist größer als 90°, aber kleiner als 180° → stumpf.",
          schritte: ["Vergleiche mit dem rechten Winkel (90°): der Winkel ist größer.", "Aber kleiner als eine gerade Linie (180°).", "Also stumpf."],
          fehler: {
            "spitz": "Spitz wäre kleiner als 90°. Hier ist der Winkel deutlich größer.",
            "überstumpf": "Überstumpf wäre größer als 180° (mehr als eine gerade Linie). Hier nicht."
          }
        }
      ]
    },
    {
      id: "winkel-uhr",
      titel: "Winkel an der Uhr",
      voraussetzung: "Winkelarten und dass ein Vollkreis 360° hat",
      intro:
        "Das Ziffernblatt einer Uhr ist ein Vollkreis mit 360°. Es hat 12 gleiche Abschnitte. Zwischen zwei benachbarten Zahlen liegen also 360° : 12 = 30°.",
      aufgaben: [
        {
          typ: "zahl",
          frage: "Wie viel Grad liegen zwischen zwei benachbarten Stundenzahlen (z. B. 12 und 1)?",
          richtig: "30",
          erklaerung: "360° geteilt durch 12 Abschnitte sind 30°.",
          schritte: ["Ein Vollkreis hat 360°.", "Die Uhr hat 12 gleiche Abschnitte.", "360° : 12 = 30°."],
          fehler: {
            "60": "Die Uhr hat 12 Abschnitte, nicht 6. 360° : 12 = 30°.",
            "12": "12 ist die Anzahl der Abschnitte, nicht die Gradzahl. 360° : 12 = 30°."
          }
        },
        {
          typ: "zahl",
          frage: "Es ist genau 3 Uhr. Welchen Winkel bilden Stunden- und Minutenzeiger? (in Grad)",
          bild: { art: "uhr", stunde: 3 },
          richtig: "90",
          erklaerung: "Von der 12 bis zur 3 sind es 3 Abschnitte: 3 × 30° = 90°.",
          schritte: ["Von 12 bis 3 sind es 3 Abschnitte.", "Jeder Abschnitt ist 30°.", "3 × 30° = 90°."],
          fehler: {
            "30": "Das ist nur ein Abschnitt. Von der 12 bis zur 3 sind es 3 Abschnitte: 3 × 30° = 90°.",
            "3": "Du hast die Stunden gezählt, nicht die Grad. 3 Abschnitte × 30° = 90°."
          }
        },
        {
          typ: "mc",
          frage: "Es ist 3 Uhr. Welche Winkelart bilden die Zeiger?",
          bild: { art: "uhr", stunde: 3 },
          antworten: ["spitz", "recht", "stumpf"],
          richtig: "recht",
          erklaerung: "Die Zeiger bilden 90° – das ist ein rechter Winkel.",
          schritte: ["Bei 3 Uhr bilden die Zeiger 90°.", "Genau 90° ist ein rechter Winkel."],
          fehler: {
            "spitz": "Spitz wäre kleiner als 90°. Bei 3 Uhr sind es genau 90° – ein rechter Winkel.",
            "stumpf": "Stumpf wäre größer als 90°. Bei 3 Uhr sind es genau 90° – ein rechter Winkel."
          }
        },
        {
          typ: "zahl",
          frage: "Es ist genau 6 Uhr. Welchen Winkel bilden die Zeiger? (in Grad)",
          bild: { art: "uhr", stunde: 6 },
          richtig: "180",
          erklaerung: "Von der 12 bis zur 6 sind es 6 Abschnitte: 6 × 30° = 180°.",
          schritte: ["Von 12 bis 6 sind es 6 Abschnitte.", "6 × 30° = 180°."],
          fehler: {
            "60": "Du hast nur 2 × 30° gerechnet. Von 12 bis 6 sind es 6 Abschnitte: 6 × 30° = 180°.",
            "360": "360° wäre ein ganzer Kreis. Die Zeiger stehen sich gegenüber: das ist die Hälfte, 180°."
          }
        }
      ]
    },
    {
      id: "messen-geodreieck",
      titel: "Mit dem Geodreieck messen",
      voraussetzung: "Winkelarten (spitz/stumpf) als Kontrolle",
      intro:
        "Zum Messen legst du die Zeichenkante des Geodreiecks an einen Schenkel und den Nullpunkt genau auf den Scheitelpunkt. Es gibt zwei Skalen (innere und äußere). Du liest die Skala ab, die am angelegten Schenkel bei 0° beginnt.",
      explorer: { modus: "geodreieck" },
      aufgaben: [
        {
          typ: "mc",
          frage: "Du misst einen spitzen Winkel. Das Geodreieck zeigt an einer Skala 40°, an der anderen 140°. Welcher Wert stimmt?",
          bild: { art: "geodreieck", grad: 40 },
          antworten: ["40°", "140°"],
          richtig: "40°",
          erklaerung: "Der Winkel ist spitz, also kleiner als 90°. Richtig sind 40°.",
          schritte: ["Schau zuerst: spitz oder stumpf? Hier spitz, also kleiner als 90°.", "Nimm die Skala, die am angelegten Schenkel bei 0° beginnt.", "Das ergibt 40°."],
          fehler: {
            "140°": "Der Winkel ist spitz – also kleiner als 90°. 140° wäre stumpf. Du hast die falsche Skala abgelesen. Richtig sind 40°."
          }
        },
        {
          typ: "mc",
          frage: "Was legst du beim Messen genau auf den Scheitelpunkt des Winkels?",
          antworten: ["den Nullpunkt", "die Zeichenkante", "die innere Skala"],
          richtig: "den Nullpunkt",
          erklaerung: "Der Nullpunkt des Geodreiecks kommt auf den Scheitelpunkt.",
          schritte: ["Die Zeichenkante legst du an einen Schenkel.", "Den Nullpunkt legst du auf den Scheitelpunkt."],
          fehler: {
            "die Zeichenkante": "Die Zeichenkante legst du an einen Schenkel. Auf den Scheitelpunkt kommt der Nullpunkt.",
            "die innere Skala": "Die Skala dient zum Ablesen, nicht zum Anlegen. Auf den Scheitelpunkt kommt der Nullpunkt."
          }
        },
        {
          typ: "mc",
          frage: "Welche Skala liest du beim Messen ab?",
          antworten: ["die, die am angelegten Schenkel bei 0° beginnt", "immer die äußere Skala", "immer die innere Skala"],
          richtig: "die, die am angelegten Schenkel bei 0° beginnt",
          erklaerung: "Mal ist es die innere, mal die äußere Skala – je nachdem, wie du anlegst.",
          schritte: ["Lege das Geodreieck an.", "Suche die Skala, deren 0° genau auf dem angelegten Schenkel liegt.", "An dieser Skala liest du am anderen Schenkel ab."],
          fehler: {
            "immer die äußere Skala": "Nicht immer – es hängt davon ab, wie du anlegst. Richtig ist die Skala, die am angelegten Schenkel bei 0° startet.",
            "immer die innere Skala": "Nicht immer – mal innen, mal außen. Nimm die Skala, die am angelegten Schenkel bei 0° beginnt."
          }
        },
        {
          typ: "mc",
          frage: "Ein Winkel sieht fast wie ein rechter Winkel aus, ist aber etwas größer. Welcher Messwert passt?",
          antworten: ["75°", "95°", "135°"],
          richtig: "95°",
          erklaerung: "Etwas größer als 90° heißt knapp über 90° – also 95°.",
          schritte: ["Ein rechter Winkel ist 90°.", "'Etwas größer' heißt nur knapp darüber.", "95° passt; 135° wäre schon deutlich stumpf."],
          fehler: {
            "75°": "75° ist kleiner als 90° – der Winkel soll aber größer als ein rechter Winkel sein.",
            "135°": "135° ist deutlich stumpf. 'Nur etwas größer als rechtwinklig' passt besser zu 95°."
          }
        }
      ]
    },
    {
      id: "dezimal-rechnen",
      titel: "Mit Dezimalzahlen rechnen",
      seiten: "S.50–63 (Kap. 5)",
      voraussetzung: "Kommazahlen lesen und Stellenwerte (Zehntel, Hundertstel)",
      intro: "Beim Rechnen mit Kommazahlen: Kommas untereinander beim Plus/Minus, und bei ×/: mit 10, 100, 1000 wandert das Komma. Auch hier gilt Punkt vor Strich.",
      aufgaben: [
        { typ: "zahl", frage: "12,5 + 3,75 = ?", richtig: "16,25", erklaerung: "Kommas untereinander, dann addieren: 12,50 + 3,75 = 16,25.", schritte: ["Schreibe 12,50 (Null anhängen).", "12,50 + 3,75 = 16,25."], fehler: { "15,25": "Stellen verrutscht. Schreibe die Kommas untereinander: 12,50 + 3,75 = 16,25." } },
        { typ: "zahl", frage: "3,4 × 100 = ?", richtig: "340", erklaerung: "× 100 verschiebt das Komma 2 Stellen nach rechts.", schritte: ["× 100 → 2 Stellen nach rechts.", "3,4 → 340."], fehler: { "34": "× 100 sind 2 Stellen: 3,4 → 340.", "3400": "Das wäre × 1000. Bei × 100 nur 2 Stellen: 340." } },
        { typ: "zahl", frage: "56,8 : 10 = ?", richtig: "5,68", erklaerung: ": 10 verschiebt das Komma 1 Stelle nach links.", schritte: [": 10 → 1 Stelle nach links.", "56,8 → 5,68."], fehler: { "568": "Bei : 10 wandert das Komma nach LINKS: 5,68." } },
        { typ: "zahl", frage: "0,5 × 0,4 = ?", richtig: "0,2", erklaerung: "5 × 4 = 20, zwei Nachkommastellen → 0,20 = 0,2.", schritte: ["Ohne Komma: 5 × 4 = 20.", "Zwei Nachkommastellen → 0,20 = 0,2."], fehler: { "2": "Achte aufs Komma: 0,5 × 0,4 = 0,2 (nicht 2)." } },
        { typ: "zahl", frage: "7,2 : 0,8 = ?", richtig: "9", erklaerung: "Beide mal 10: 72 : 8 = 9.", schritte: ["Komma weg (beide × 10): 72 : 8.", "72 : 8 = 9."], fehler: { "0,9": "Rechne 72 : 8 = 9 (beide × 10).", "90": "72 : 8 = 9, nicht 90." } },
        { typ: "zahl", frage: "2 + 0,5 × 4 = ?", richtig: "4", erklaerung: "Punkt vor Strich: erst 0,5 × 4 = 2, dann 2 + 2 = 4.", schritte: ["Zuerst 0,5 × 4 = 2.", "Dann 2 + 2 = 4."], fehler: { "10": "Punkt vor Strich: erst 0,5 × 4 = 2, dann + 2 = 4 (nicht (2 + 0,5) × 4)." } },
        { typ: "mc", frage: "Was rechnest du zuerst:  6,4 − 1,2 × 3 ?", antworten: ["1,2 × 3", "6,4 − 1,2"], richtig: "1,2 × 3", erklaerung: "Mal kommt vor Minus (Punkt vor Strich).", schritte: ["Mal zuerst: 1,2 × 3 = 3,6.", "Dann 6,4 − 3,6 = 2,8."], fehler: { "6,4 − 1,2": "Minus ist ein Strich-Rechen – das kommt nach dem Mal." } },
        { typ: "zahl", frage: "9,6 : 4 = ?", richtig: "2,4", erklaerung: "9,6 : 4 = 2,4.", schritte: ["96 : 4 = 24.", "Komma setzen: 2,4."], fehler: { "24": "Achte aufs Komma: 9,6 : 4 = 2,4." } }
      ]
    },
    {
      id: "koerper-volumen",
      titel: "Körper: Volumen & Oberfläche",
      seiten: "S.64–79 (Kap. 6)",
      voraussetzung: "Multiplizieren und die Begriffe Länge, Breite, Höhe",
      intro: "Das Volumen eines Quaders ist V = Länge · Breite · Höhe. Die Oberfläche ist die Summe aller Flächen. 1 Liter = 1000 cm³.",
      aufgaben: [
        { typ: "zahl", frage: "Volumen eines Quaders mit a = 3 cm, b = 4 cm, c = 5 cm? (in cm³)", richtig: "60", erklaerung: "V = a · b · c = 3 · 4 · 5 = 60.", schritte: ["V = Länge · Breite · Höhe.", "3 · 4 · 5 = 60."], fehler: { "12": "Du hast nur 3 · 4 gerechnet. V = 3 · 4 · 5 = 60.", "47": "Volumen ist Multiplikation: 3 · 4 · 5 = 60 (nicht addieren)." } },
        { typ: "zahl", frage: "Volumen eines Würfels mit Kante a = 2 cm? (in cm³)", richtig: "8", erklaerung: "Würfel: V = a · a · a = 2 · 2 · 2 = 8.", schritte: ["Alle Kanten gleich: 2 · 2 · 2.", "= 8."], fehler: { "6": "Würfel: 2 · 2 · 2 = 8 (nicht 2 · 3).", "4": "Das ist nur 2 · 2. Würfel: 2 · 2 · 2 = 8." } },
        { typ: "zahl", frage: "Oberfläche eines Würfels mit Kante 3 cm? (in cm²)", richtig: "54", erklaerung: "Ein Würfel hat 6 Flächen: 6 · (3 · 3) = 6 · 9 = 54.", schritte: ["Eine Fläche: 3 · 3 = 9.", "6 Flächen: 6 · 9 = 54."], fehler: { "9": "Das ist nur eine Fläche. Ein Würfel hat 6: 6 · 9 = 54.", "27": "27 ist das Volumen (3³). Oberfläche = 6 · 9 = 54." } },
        { typ: "zahl", frage: "1 Liter = ? cm³", richtig: "1000", erklaerung: "1 l = 1000 cm³.", schritte: ["1 l entspricht 1000 cm³."], fehler: { "100": "1 l = 1000 cm³ (nicht 100).", "1": "1 l sind 1000 cm³." } },
        { typ: "zahl", frage: "1 m³ = ? Liter", richtig: "1000", erklaerung: "1 m³ = 1000 l.", schritte: ["1 Kubikmeter fasst 1000 Liter."], fehler: { "100": "1 m³ = 1000 l." } },
        { typ: "zahl", frage: "Volumen eines Quaders mit a = 10 cm, b = 2 cm, c = 5 cm? (in cm³)", richtig: "100", erklaerung: "V = 10 · 2 · 5 = 100.", schritte: ["10 · 2 = 20.", "20 · 5 = 100."], fehler: { "17": "Volumen wird multipliziert: 10 · 2 · 5 = 100." } },
        { typ: "mc", frage: "Welcher Körper hat 6 gleich große quadratische Flächen?", antworten: ["Würfel", "Quader", "Kugel"], richtig: "Würfel", erklaerung: "Der Würfel hat 6 gleiche Quadrate.", schritte: ["6 gleiche Quadrate → Würfel."], fehler: { "Quader": "Ein Quader hat Rechtecke (nicht alle gleich).", "Kugel": "Eine Kugel hat gar keine ebenen Flächen." } },
        { typ: "zahl", frage: "Oberfläche eines Quaders mit a = 2, b = 3, c = 4 cm?  O = 2 · (a·b + a·c + b·c) (in cm²)", richtig: "52", erklaerung: "O = 2 · (2·3 + 2·4 + 3·4) = 2 · (6 + 8 + 12) = 2 · 26 = 52.", schritte: ["Flächen: 6 + 8 + 12 = 26.", "Mal 2: 52."], fehler: { "24": "24 ist das Volumen (2·3·4). Oberfläche = 2 · 26 = 52.", "26": "Du hast das · 2 vergessen: 2 · 26 = 52." } }
      ]
    },
    {
      id: "zuordnungen-negative",
      titel: "Zuordnungen & negative Zahlen",
      seiten: "S.80–91 (Kap. 7)",
      voraussetzung: "Zahlenstrahl und Plus/Minus",
      intro: "Negative Zahlen liegen links von der 0. Je weiter links, desto kleiner. Bei Zuordnungen gehören zwei Größen zusammen (z. B. Menge und Preis).",
      aufgaben: [
        { typ: "mc", frage: "Welche Zahl ist größer:  −3  oder  −5 ?", antworten: ["−3", "−5"], richtig: "−3", erklaerung: "Auf dem Zahlenstrahl liegt −3 weiter rechts (näher an 0) → größer.", schritte: ["Beide sind negativ.", "−3 ist näher an 0 → größer."], fehler: { "−5": "5 ist zwar größer als 3, aber bei negativen Zahlen ist −3 größer (näher an 0)." } },
        { typ: "zahl", frage: "Es ist −4 °C. Es wird 6 °C wärmer. Wie viel °C sind es jetzt?", richtig: "2", erklaerung: "−4 + 6 = 2.", schritte: ["Von −4 erst 4 Grad bis 0.", "Dann noch 2 weiter: 2 °C."], fehler: { "10": "Nicht 4 + 6. Es ist −4 + 6 = 2.", "-10": "Es wird wärmer: −4 + 6 = 2." } },
        { typ: "zahl", frage: "Wie groß ist der Unterschied zwischen −3 °C und 5 °C? (in °C)", richtig: "8", erklaerung: "Von −3 bis 5 sind es 8 Schritte (über die 0).", schritte: ["Von −3 bis 0 sind 3.", "Von 0 bis 5 sind 5. 3 + 5 = 8."], fehler: { "2": "Achtung über die 0: von −3 bis 0 sind 3, dann + 5 = 8.", "-8": "Der Unterschied ist immer positiv: 8." } },
        { typ: "mc", frage: "Welche Zahl ist die kleinste:  −1,  −7,  3,  0 ?", antworten: ["−7", "−1", "0"], richtig: "−7", erklaerung: "Am weitesten links auf dem Zahlenstrahl ist die kleinste: −7.", schritte: ["Negative sind kleiner als 0.", "−7 liegt am weitesten links."], fehler: { "−1": "−1 ist größer als −7.", "0": "0 ist größer als jede negative Zahl." } },
        { typ: "zahl", frage: "3 Brötchen kosten 1,20 €. Was kosten 6 Brötchen? (in €)", richtig: "2,40", erklaerung: "6 ist das Doppelte von 3 → doppelter Preis: 2,40 €.", schritte: ["6 = 2 · 3.", "2 · 1,20 € = 2,40 €."], fehler: { "1,20": "6 Brötchen sind das Doppelte: 2,40 €.", "4,80": "Das wäre das Vierfache. 6 ist das Doppelte von 3 → 2,40 €." } },
        { typ: "zahl", frage: "1 Heft kostet 0,80 €. Was kosten 5 Hefte? (in €)", richtig: "4", erklaerung: "5 · 0,80 € = 4,00 €.", schritte: ["5 · 0,80.", "= 4,00 €."], fehler: { "0,80": "Das ist 1 Heft. 5 · 0,80 = 4,00 €." } },
        { typ: "mc", frage: "Welche Temperatur ist am kältesten?", antworten: ["−2 °C", "0 °C", "−8 °C"], richtig: "−8 °C", erklaerung: "−8 liegt am weitesten links → am kältesten.", schritte: ["Je kleiner die Zahl, desto kälter.", "−8 ist die kleinste."], fehler: { "−2 °C": "−2 ist wärmer als −8.", "0 °C": "0 ist wärmer als jede Minustemperatur." } },
        { typ: "zahl", frage: "Welche Zahl liegt genau in der Mitte zwischen −2 und 4?", richtig: "1", erklaerung: "Mitte = (−2 + 4) : 2 = 2 : 2 = 1.", schritte: ["−2 + 4 = 2.", "2 : 2 = 1."], fehler: { "2": "Das ist die Summe. Die Mitte ist 2 : 2 = 1.", "0": "Die Mitte zwischen −2 und 4 ist 1 (nicht 0)." } }
      ]
    },
    {
      id: "daten",
      titel: "Daten: Mittelwert, Median & Diagramme",
      seiten: "S.92–105 (Kap. 8)",
      voraussetzung: "Addieren, Teilen und Prozent-Grundidee",
      intro: "Das arithmetische Mittel (Durchschnitt) = Summe : Anzahl. Der Median ist der mittlere Wert, wenn man sortiert. Im Kreisdiagramm sind 100 % = 360°.",
      aufgaben: [
        { typ: "zahl", frage: "Berechne das arithmetische Mittel (Durchschnitt) von 4, 6, 8.", richtig: "6", erklaerung: "Summe 18 : 3 Werte = 6.", schritte: ["4 + 6 + 8 = 18.", "18 : 3 = 6."], fehler: { "18": "Du hast nur addiert. Mittelwert = Summe : Anzahl = 18 : 3 = 6.", "9": "Teile durch die Anzahl (3): 18 : 3 = 6." } },
        { typ: "zahl", frage: "Mittelwert von 2, 4, 6, 8?", richtig: "5", erklaerung: "Summe 20 : 4 = 5.", schritte: ["2 + 4 + 6 + 8 = 20.", "20 : 4 = 5."], fehler: { "20": "Noch durch die Anzahl teilen: 20 : 4 = 5." } },
        { typ: "zahl", frage: "Median von 3, 7, 5 (der mittlere Wert nach dem Sortieren)?", richtig: "5", erklaerung: "Sortiert: 3, 5, 7 → die Mitte ist 5.", schritte: ["Sortiere: 3, 5, 7.", "Der mittlere Wert ist 5."], fehler: { "7": "Erst sortieren: 3, 5, 7. Die Mitte ist 5.", "3": "Sortiert 3, 5, 7 → Mitte ist 5." } },
        { typ: "zahl", frage: "Median von 2, 8, 4, 6, 10?", richtig: "6", erklaerung: "Sortiert 2, 4, 6, 8, 10 → die Mitte ist 6.", schritte: ["Sortiere: 2, 4, 6, 8, 10.", "Mittlerer Wert: 6."], fehler: { "8": "Sortiere zuerst: 2, 4, 6, 8, 10 → Mitte ist 6." } },
        { typ: "mc", frage: "Im Kreisdiagramm sind 25 %. Wie groß ist der Winkel?", antworten: ["90°", "180°", "25°"], richtig: "90°", erklaerung: "25 % von 360° = 90°.", schritte: ["100 % = 360°.", "25 % = ein Viertel = 90°."], fehler: { "180°": "180° wären 50 %.", "25°": "Prozent ist nicht gleich Grad: 25 % von 360° = 90°." } },
        { typ: "zahl", frage: "Wie viel Grad sind 50 % in einem Kreisdiagramm?", richtig: "180", erklaerung: "50 % von 360° = 180°.", schritte: ["100 % = 360°.", "Die Hälfte: 180°."], fehler: { "50": "Prozent ≠ Grad: 50 % von 360° = 180°." } },
        { typ: "zahl", frage: "Von 20 Kindern mögen 5 Fußball. Wie viel Prozent ist das?", richtig: "25", erklaerung: "5 von 20 = 1/4 = 25 %.", schritte: ["5 : 20 = 0,25.", "0,25 = 25 %."], fehler: { "5": "5 ist die Anzahl, nicht der Prozentsatz: 5 von 20 = 25 %." } },
        { typ: "mc", frage: "Was ist der 'Median'?", antworten: ["der mittlere Wert (nach dem Sortieren)", "der Durchschnitt", "der größte Wert"], richtig: "der mittlere Wert (nach dem Sortieren)", erklaerung: "Median = der mittlere Wert, wenn man die Zahlen sortiert.", schritte: ["Sortieren.", "Die Zahl in der Mitte ist der Median."], fehler: { "der Durchschnitt": "Das ist das arithmetische Mittel. Der Median ist der mittlere Wert.", "der größte Wert": "Das ist das Maximum, nicht der Median." } }
      ]
    }
  ]
};
