/*
 * Schulweg NRW - KI-Zwischenserver (Cloudflare Worker).
 * Nimmt eine falsche Antwort entgegen, fragt Groq nach einer kindgerechten
 * Erklaerung und gibt sie als JSON zurueck. Der Groq-Schluessel liegt als
 * geheime Variable GROQ_API_KEY im Worker - NIE im Browser/Code.
 */
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status,
    headers: Object.assign({ "Content-Type": "application/json" }, CORS)
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    if (request.method !== "POST") return json({ error: "Nur POST erlaubt" }, 405);

    let body;
    try { body = await request.json(); } catch (e) { return json({ error: "Ungueltiges JSON" }, 400); }

    const fach = body.fach || "Mathematik";
    const klasse = body.klasse || "6";
    const thema = body.thema || "";
    const frage = body.frage || "";
    const richtig = body.richtig || "";
    const antwort = body.antwort || "";
    const kriterien = body.kriterien || "";
    const kontext = body.kontext || "";
    const frageText = body.frage_text || "";

    const modus = body.modus || "erklaerung";
    let system, user;

    if (modus === "freitext") {
      // Offene Schreibaufgabe wohlwollend bewerten (kein richtig/falsch)
      system =
        "Du bist ein freundlicher, ermutigender Lernhelfer fuer das Fach " + fach + " fuer ein Kind in Klasse " + klasse +
        " an einer Gesamtschule in Nordrhein-Westfalen. Bewerte den geschriebenen Text wohlwollend, " +
        "ohne Beschaemung, in der Du-Form. Antworte auf Deutsch.";
      user =
        "Aufgabe: " + frage +
        (kriterien ? "\nDie Loesung soll diese Kriterien erfuellen: " + kriterien : "") +
        "\nDas Kind hat geschrieben:\n\"" + antwort + "\"\n\n" +
        "Gib kurzes, ermutigendes Feedback: Was ist gut gelungen? Nenne danach 1 bis 2 konkrete Verbesserungen, " +
        "die sich an den genannten Kriterien orientieren (weise auch hin, wenn etwas Gefordertes fehlt oder etwas Unerwuenschtes wie eine eigene Meinung enthalten ist). " +
        'Antworte AUSSCHLIESSLICH als JSON: {"analyse":"1-2 Saetze Lob und Gesamteindruck","schritte":["Verbesserung 1","Verbesserung 2"]}';
    } else if (modus === "frage") {
      // Kind stellt dem Tutor eine Verstaendnisfrage zur aktuellen Lektion
      system =
        "Du bist ein geduldiger, freundlicher Tutor fuer das Fach " + fach + " fuer ein Kind in Klasse " + klasse +
        " an einer Gesamtschule in NRW. Erklaere einfach, kindgerecht und ermutigend auf Deutsch, ohne Beschaemung.";
      user =
        "Das Kind lernt gerade: " + thema + ".\nKontext der Lektion: " + kontext +
        "\nDas Kind fragt: '" + frageText + "'" +
        "\n\nBeantworte GENAU diese Frage direkt, einfach und kindgerecht, am besten mit einem kurzen Beispiel. " +
        "Mach KEINE Annahme darueber, was das Kind falsch macht. " +
        'Antworte AUSSCHLIESSLICH als JSON: {"analyse":"die direkte, einfache Antwort in 1 bis 3 Saetzen","schritte":["optional ein kurzes Beispiel"]}';
    } else if (modus === "neue_aufgabe") {
      // Eine neue, aehnliche Uebungsaufgabe zum selben Lernziel erzeugen
      system =
        "Du bist Lehrkraft und erstellst EINE neue Uebungsaufgabe fuer ein Kind in Klasse " + klasse +
        " an einer Gesamtschule in NRW, Fach " + fach + ". Kindgerecht, gleiches Niveau und gleiches " +
        "Lernziel wie die Beispielaufgabe, aber mit anderen Woertern/Zahlen. Erklaerungen auf Deutsch.";
      user =
        "Thema: " + thema + "\nBeispielaufgabe (hatte das Kind falsch): " + frage +
        "\nRichtige Antwort war: " + richtig + "\nFalsche Antwort des Kindes: " + antwort +
        "\n\nErstelle EINE neue, aehnliche Aufgabe zum selben Lernziel. Antworte AUSSCHLIESSLICH als JSON: " +
        '{"typ":"mc oder text","frage":"...","antworten":["..."],"richtig":"...","erklaerung":"1 Satz mit der Regel",' +
        '"schritte":["inhaltlicher Denkschritt 1","inhaltlicher Denkschritt 2"],"fehler":{"<konkrete falsche Antwort>":"freundliche Erklaerung des Denkfehlers"}}. ' +
        "Regeln: Bei typ mc muss 'richtig' genau eine der 'antworten' sein (2-4 Optionen), und die Schluessel in 'fehler' muessen ECHTE falsche Optionen aus 'antworten' sein. " +
        "Bei typ text lass 'antworten' weg; 'fehler'-Schluessel sind typische Falschschreibungen. " +
        "'schritte' sollen erklaeren WIE man denkt (nicht 'Frage lesen'). Halte es einfach.";
    } else {
      // Falsche Antwort erklaeren (Denkfehler)
      system =
        "Du bist ein geduldiger, freundlicher Lernhelfer fuer ein Kind in Klasse " + klasse +
        " an einer Gesamtschule in Nordrhein-Westfalen. Erklaere kindgerecht, warm und ohne Beschaemung. " +
        "Sprich das Kind mit 'du' an. Halte dich kurz und einfach.";
      user =
        "Fach: " + fach + "\nThema: " + thema + "\nAufgabe: " + frage +
        "\nRichtige Antwort: " + richtig + "\nFalsche Antwort des Kindes: " + antwort +
        "\n\nErklaere dem Kind freundlich, welcher Denkfehler wahrscheinlich dahintersteckt und wie es richtig denkt. " +
        'Antworte AUSSCHLIESSLICH als JSON: {"analyse":"1 bis 3 kurze Saetze","schritte":["Schritt 1","Schritt 2","Schritt 3"]}';
    }

    let groqRes;
    try {
      groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + env.GROQ_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.3,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: user }
          ]
        })
      });
    } catch (e) {
      return json({ error: "Groq nicht erreichbar" }, 502);
    }

    if (!groqRes.ok) return json({ error: "Groq-Fehler", status: groqRes.status }, 502);

    const data = await groqRes.json();
    let out = {};
    try { out = JSON.parse(data.choices[0].message.content); } catch (e) { out = {}; }
    if (modus !== "neue_aufgabe") {
      if (!out.analyse) out.analyse = "Geh die Aufgabe einfach Schritt fuer Schritt durch.";
      if (!Array.isArray(out.schritte)) out.schritte = [];
    }
    return json(out, 200);
  }
};
