# Schulweg NRW

Lern-App für die Gesamtschule NRW (Klasse 5–7) – Mathe, Deutsch, Englisch.
Kein Zeitdruck, echte Fehleranalyse statt nur „falsch/richtig“, Lernbox (falsche Aufgaben kommen wieder).

Gebaut als **PWA** (läuft auf iPad/iPhone/Android/PC im Browser, lässt sich auf den Home-Bildschirm legen). Kein Build-Schritt, kein Server nötig.

## Stand
- ✅ Profile (mehrere Kinder), Fächer-Auswahl, Themen, Intro „Wozu brauche ich das?“
- ✅ Quiz mit Lernbox, flexible Mathe-Eingabe (`0,5` = `0.5` = `1/2`)
- ✅ Fehleranalyse pro typischer Falschantwort + Schritt-für-Schritt-Lernsequenz
- ✅ Warmes Orange statt Rot, „Versuch’s nochmal“ statt Beschämung
- ✅ Offline-fähig (Service Worker)
- ⏳ Inhalte: Mathe Klasse 5 (Punkt vor Strich, Brüche) – Deutsch/Englisch folgen
- ⏳ Eltern-Dashboard (Statistik + Lernplan) – Platzhalter
- ⏳ Groq-KI-Schicht für unvorhergesehene Fehler – Phase 2

## Lokal ausprobieren (Windows)
Wegen Browser-Sicherheit am besten über einen kleinen lokalen Server starten
(Doppelklick auf `index.html` funktioniert meist auch, da Inhalte als `.js` geladen werden):

```powershell
cd C:\Users\HP\Documents\Claude\lern-nrw
python -m http.server 8000
```
Dann im Browser: http://localhost:8000

## Aufs iPad bringen
1. Projekt auf GitHub Pages hochladen (kostenlos, HTTPS).
2. Auf dem iPad in **Safari** die Adresse öffnen.
3. Teilen-Symbol → „Zum Home-Bildschirm“. Fertig: eigenes Icon, Vollbild, offline.

## Neue Aufgaben hinzufügen
In `content/mathe-klasse5.js` einfach einen Eintrag im `aufgaben`-Array ergänzen.
Felder sind oben in der Datei dokumentiert. Für ein neues Fach eine neue Datei
nach demselben Muster anlegen und in `index.html` als `<script>` einbinden.
