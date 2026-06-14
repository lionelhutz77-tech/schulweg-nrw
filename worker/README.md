# KI-Zwischenserver (Cloudflare Worker)

Hält den Groq-Schlüssel geheim. Die App ruft diesen Worker, der Worker ruft Groq.

## Einmal einrichten

**1. Groq-Schlüssel holen (kostenlos)**
- Auf https://console.groq.com anmelden → „API Keys" → „Create API Key" → kopieren.

**2. Cloudflare-Konto anlegen (kostenlos)**
- Auf https://dash.cloudflare.com/sign-up registrieren.

**3. Worker veröffentlichen** (im Ordner `worker/`):
```powershell
cd C:\Users\HP\Documents\Claude\lern-nrw\worker
npx wrangler login          # öffnet den Browser, einmal bestätigen
npx wrangler secret put GROQ_API_KEY   # hier den Groq-Schlüssel einfügen
npx wrangler deploy
```
Am Ende zeigt der Befehl eine Adresse wie:
`https://schulweg-ki.DEINNAME.workers.dev`

**4. Adresse in die App eintragen**
- In `js/config.js` bei `kiEndpoint` diese Adresse einsetzen, dann committen + pushen.

Danach erscheint bei jeder falschen Antwort der Knopf „🤖 Erklär's mir nochmal anders".

## Kosten
Beides kostenlos: Groq (großzügiges Gratis-Kontingent) und Cloudflare Workers
(100.000 Anfragen/Tag gratis). Für eine Familie weit mehr als genug.

## Test (ohne App)
```powershell
curl -X POST https://schulweg-ki.DEINNAME.workers.dev `
  -H "Content-Type: application/json" `
  -d '{"fach":"Mathematik","klasse":"6","thema":"Winkel","frage":"Wie viel ist 2+3x4?","richtig":"14","antwort":"20"}'
```
