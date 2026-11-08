# Holvana Webshop

Statische Website (HTML, CSS, JavaScript), ohne Backend. Warenkorb, Kasse, Kontaktformular und Cookie-Einwilligung sind gemockt und speichern nur im Browser (localStorage).

## Auf GitHub Pages veröffentlichen

1. Neues öffentliches Repository auf GitHub anlegen, z. B. `holvana`.
2. Den **Inhalt** dieses Ordners hochladen (die Datei `index.html` muss direkt im Repository liegen, nicht in einem Unterordner).
3. Im Repository: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, Branch `main`, Ordner `/ (root)`, speichern.
4. Nach ein bis zwei Minuten ist die Seite unter `https://<benutzername>.github.io/holvana/` erreichbar. Diesen Link geben Sie ab.

Alle Links sind relativ, deshalb funktioniert die Seite auch im Unterordner `/holvana/`.

## Lokal ansehen

Im Ordner ein Terminal öffnen und `python3 -m http.server` ausführen, dann `http://localhost:8000` im Browser öffnen.

## Ordnerstruktur

```
index.html            Startseite
produkt/ preise/ download/ hilfe/ ueber-uns/ kontakt/
warenkorb/ kasse/ bestellung/              Kaufprozess (gemockt)
impressum/ datenschutz/ cookies/ lizenz/ agb/ ruecktritt/ barrierefreiheit/ credits/
404.html
assets/css/style.css  Farben, Schrift, Layout
assets/js/main.js     Warenkorb, Kasse, Formulare, Cookie-Hinweis, Produktkatalog
assets/fonts/         Inter (lokal) + OFL.txt (Lizenztext)
assets/img/           Logo-Varianten, Bildschirmfotos, Schema, Produktgrafiken
assets/audio/         Klangmarke
assets/video/         Demo-Video, Untertitel (.vtt), Vorschaubild (nicht mehr eingebunden)
```

Kopf- und Fußzeile stehen in jeder HTML-Datei. Wenn Sie dort etwas ändern (z. B. die Adresse), ändern Sie es mit „Suchen und Ersetzen in Dateien“ im Editor (z. B. VS Code) in allen Dateien gleichzeitig.

## Prüfung

Am 8. November 2026 wurden alle 19 Seiten bei 1280 und 320 Pixel Breite sowie 11 Bedienzustände mit axe-core 4.10.3 (WCAG 2.0/2.1/2.2 A und AA, Best Practices) geprüft: keine Verstöße. Außerdem geprüft: Farbkontraste, Tastaturdurchlauf, Links und Darstellung bei 320 Pixel Breite. Noch nicht durchgeführt: WAVE und ein Screenreader-Test (NVDA oder VoiceOver).
