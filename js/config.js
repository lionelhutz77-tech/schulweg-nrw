/*
 * Konfiguration fuer Schulweg NRW.
 * kiEndpoint: leer lassen = keine KI. Sobald der Cloudflare-Worker laeuft,
 * hier die Worker-Adresse eintragen, z. B. "https://schulweg-ki.DEINNAME.workers.dev".
 * Die Adresse ist NICHT geheim (der geheime Groq-Schluessel liegt im Worker).
 */
window.SCHULWEG_CONFIG = {
  kiEndpoint: "https://schulweg-ki.lernapp-nrw.workers.dev",
  // Kann spaeter durch die Adresse eines eigenen ChatGPT-Lernprojekts
  // ersetzt werden. Der Lernauftrag enthaelt keine Namen oder Freitexte.
  chatgptVoiceUrl: "https://chatgpt.com/"
};
