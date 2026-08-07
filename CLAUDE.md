# CLAUDE.md — Schulweg NRW (Lern-App)

PWA-Lernapp für die eigenen Kinder (Gesamtschule NRW Kl. 5–7, Mathe/Deutsch/Englisch). Kein Build, kein Framework. Übersicht: `README.md`.

## Inhalts-/Auswertungsregeln
Skill **lern-auswertung** anwenden (Fehleranalyse, Zielsprache-Regel, Lernstand-Vergleich, Urheberrecht). Fertige Lern-Prompts: im Skill unter `references/lern-prompts.md`.

## Lokal & Deploy
- Lokal: `python -m http.server 8000` → http://localhost:8000
- Live: GitHub Pages, Repo `lionelhutz77-tech/schulweg-nrw`, Branch `main`. **Deploy = `git push`** (~1 Min bis live). Aufs iPad via Safari → Teilen → „Zum Home-Bildschirm".
- Service Worker ist **network-first** (sonst kommen Updates nicht an).

## Aufbau
- `index.html` (bindet Inhalte als `<script>`), `js/` (app.js, config.js mit Worker-Endpoint, winkel.js für SVG-Interaktiv), `content/` (mathe-klasse5.js, mathe-klasse6.js, englisch-6.js), `service-worker.js`, `prompts/` (ChatGPT-Prompt für Inhaltserfassung), `quelle/` (Buchquellen, **nie öffentlich**, gitignored).
- KI-Schicht: Cloudflare Worker in `worker/` (`groq-worker.js`, ruft Groq `llama-3.3-70b-versatile`). Endpoint: `https://schulweg-ki.lernapp-nrw.workers.dev`. Modi: erklaerung / freitext / neue_aufgabe.

## Konventionen / Gotchas
- Worker-Deploy: `cd worker && npx wrangler deploy` (OAuth-Creds liegen lokal → ich kann selbst deployen). `GROQ_API_KEY` bleibt als Worker-Secret erhalten.
- **Eigene** Aufgaben erstellen (andere Zahlen als im Buch), keine Buchkopien (Urheberrecht).
- Fremdsprachen-Aufgaben in der Zielsprache (Text + Optionen); Feedback darf Deutsch sein.
- Mathe-Eingabe tolerant (`0,5`=`0.5`=`1/2`), Uhrzeiten 12h/24h. iPad-Tastatur: autocapitalize/autocorrect aus.
- Ton: warm, „Versuch's nochmal", kein Zeitdruck, keine Bestenlisten.

## Arbeitsweise
Skill **bau-qualitaet**: nach Code-/Inhaltsänderung verifizieren (lokal laden / Worker-Request) vor „fertig".
