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
assets/video/         Demo-Video, Untertitel (.vtt), Vorschaubild
```

Kopf- und Fußzeile stehen in jeder HTML-Datei. Wenn Sie dort etwas ändern (z. B. die Adresse), ändern Sie es mit „Suchen und Ersetzen in Dateien“ im Editor (z. B. VS Code) in allen Dateien gleichzeitig.

## Noch offen (vor der Abgabe)

Gelb gestrichelte Kästen mit „TODO – Hinweis für dich“ markieren Stellen, an denen Sie selbst Inhalte schreiben müssen. Vor der Abgabe ersetzen und die Kästen löschen. Suche nach `class="todo"` und `[TODO` bzw. `[Straße`.

Annahmen, die Sie prüfen oder ändern sollten:

- Preise 49 € / 89 € und Lizenzumfang (Einzel- / Familienlizenz) – in den HTML-Seiten und in `assets/js/main.js` (`PRODUCTS`)
- Testversion 30 Tage
- Plattformen und Systemanforderungen (Produktseite, Download)
- E-Mail-Adresse `office@holvana.example` (die Endung `.example` ist reserviert und gehört niemandem)
- Klangmarke (zwei Töne E5 → A5) als Vorschlag für die dritte Markenform

## Prüfung

Alle Seiten wurden mit axe-core 4.10 (WCAG 2.0/2.1/2.2 A und AA, Best Practices) geprüft: keine Verstöße. Zusätzlich empfohlen: WAVE, Tastaturtest, Zoom auf 200 % und ein Screenreader-Test (NVDA oder VoiceOver).
