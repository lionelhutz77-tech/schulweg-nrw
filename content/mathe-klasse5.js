/*
 * Inhalte fuer Mathematik Klasse 5 (NRW-Kernlehrplan Gesamtschule).
 * Neue Aufgaben einfach im "aufgaben"-Array ergaenzen.
 *
 * Aufgaben-Felder:
 *   typ        "mc" (Multiple Choice) | "zahl" (freie Eingabe, akzeptiert 0,5 / 0.5 / 1/2)
 *   frage      Aufgabentext
 *   antworten  nur bei "mc": Liste der Auswahlmoeglichkeiten
 *   richtig    die korrekte Antwort
 *   erklaerung kurze allgemeine Erklaerung (immer gezeigt)
 *   schritte   Schritt-fuer-Schritt-Lernsequenz
 *   fehler     Diagnose pro typischem Falschwert  ->  "warum war DAS falsch"
 */
window.SCHULWEG = window.SCHULWEG || { faecher: {} };

window.SCHULWEG.faecher["mathe-5"] = {
  fach: "Mathematik",
  klasse: 5,
  farbe: "mathe",
  icon: "math-symbols",
  themen: [
    {
      id: "rechenregeln",
      titel: "Punkt vor Strich",
      voraussetzung: "Plus, Minus, Mal und Geteilt",
      intro:
        "Wenn in einer Aufgabe Plus/Minus UND Mal/Geteilt vorkommen, wird Mal und Geteilt immer zuerst gerechnet. Das nennt man „Punkt vor Strich“.",
      aufgaben: [
        {
          typ: "zahl",
          frage: "Wie viel ist 2 + 3 × 4 ?",
          richtig: "14",
          erklaerung: "Punkt vor Strich: erst 3 × 4, dann + 2.",
          schritte: ["Zuerst der Mal-Teil: 3 × 4 = 12", "Dann der Plus-Teil: 2 + 12 = 14"],
          fehler: {
            "20": "Du hast von links nach rechts gerechnet: erst 2 + 3 = 5, dann 5 × 4 = 20. Aber Mal kommt vor Plus."
          }
        },
        {
          typ: "zahl",
          frage: "Wie viel ist 10 - 2 × 3 ?",
          richtig: "4",
          erklaerung: "Erst 2 × 3 = 6, dann 10 - 6 = 4.",
          schritte: ["Zuerst der Mal-Teil: 2 × 3 = 6", "Dann der Minus-Teil: 10 - 6 = 4"],
          fehler: {
            "24": "Du hast erst 10 - 2 = 8 gerechnet und dann × 3. Aber Mal kommt vor Minus.",
            "8": "Du hast nur 10 - 2 gerechnet und das × 3 vergessen."
          }
        },
        {
          typ: "mc",
          frage: "Welche Rechnung wird zuerst ausgeführt:  5 + 6 ÷ 2 ?",
          antworten: ["6 ÷ 2", "5 + 6"],
          richtig: "6 ÷ 2",
          erklaerung: "Geteilt ist ein Punkt-Rechen, kommt also vor dem Plus.",
          schritte: ["6 ÷ 2 = 3 (zuerst)", "Dann 5 + 3 = 8"],
          fehler: {
            "5 + 6": "Plus ist ein Strich-Rechen – das kommt erst nach dem Geteilt."
          }
        }
      ]
    },
    {
      id: "brueche",
      titel: "Brüche – Einführung",
      voraussetzung: "Teilen und Anteile (z. B. „die Hälfte“)",
      intro:
        "Ein Bruch zeigt einen Anteil von einem Ganzen. Unten steht, in wie viele gleiche Teile geteilt wird (Nenner), oben, wie viele Teile gemeint sind (Zähler).",
      aufgaben: [
        {
          typ: "zahl",
          frage: "Schreibe „die Hälfte“ als Bruch. (Tipp: Zähler/Nenner)",
          richtig: "1/2",
          erklaerung: "Die Hälfte heisst: 1 Teil von 2 gleichen Teilen – also 1/2.",
          schritte: ["Das Ganze wird in 2 Teile geteilt → Nenner = 2", "Wir nehmen 1 Teil davon → Zähler = 1"],
          fehler: {
            "2/1": "Du hast Zähler und Nenner vertauscht. Unten steht die Anzahl der Teile (2), oben die genommenen (1)."
          }
        },
        {
          typ: "mc",
          frage: "Welcher Bruch ist grösser:  1/2  oder  1/4 ?",
          antworten: ["1/2", "1/4"],
          richtig: "1/2",
          erklaerung: "Je grösser der Nenner, desto kleiner die einzelnen Stücke.",
          schritte: ["Teile eine Pizza in 2 Stücke → jedes Stück ist gross", "Teile sie in 4 Stücke → jedes Stück ist kleiner", "Also ist 1/2 mehr als 1/4"],
          fehler: {
            "1/4": "4 ist zwar grösser als 2 – aber bei Brüchen heisst grösserer Nenner KLEINERE Stücke."
          }
        }
      ]
    }
  ]
};
