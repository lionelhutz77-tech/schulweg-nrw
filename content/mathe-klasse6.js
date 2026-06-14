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
    }
  ]
};
