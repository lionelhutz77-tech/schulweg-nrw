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

    const modus = body.modus || "erklaerung";
    let system, user;

    if (modus === "freitext") {
      // Offene Schreibaufgabe wohlwollend bewerten (kein richtig/falsch)
      system =
        "Du bist ein freundlicher, ermutigender Englisch-Lernhelfer fuer ein Kind in Klasse " + klasse +
        " an einer Gesamtschule in Nordrhein-Westfalen. Bewerte den geschriebenen Text wohlwollend, " +
        "ohne Beschaemung, in der Du-Form. Antworte auf Deutsch.";
      user =
        "Aufgabe: " + frage + "\nDas Kind hat geschrieben:\n\"" + antwort + "\"\n\n" +
        "Gib kurzes, ermutigendes Feedback: Was ist gut gelungen? Nenne danach 1 bis 2 konkrete, einfache " +
        "Verbesserungen (Grammatik, fehlende geforderte Woerter, vollstaendige Saetze). " +
        'Antworte AUSSCHLIESSLICH als JSON: {"analyse":"1-2 Saetze Lob und Gesamteindruck","schritte":["Verbesserung 1","Verbesserung 2"]}';
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
    let out = { analyse: "", schritte: [] };
    try { out = JSON.parse(data.choices[0].message.content); } catch (e) { /* Fallback unten */ }
    if (!out.analyse) out.analyse = "Geh die Aufgabe einfach Schritt fuer Schritt durch.";
    if (!Array.isArray(out.schritte)) out.schritte = [];
    return json(out, 200);
  }
};
