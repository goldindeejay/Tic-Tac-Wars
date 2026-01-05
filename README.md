# Tic-Tac-Wars
Tic-Tac-Wars ist eine moderne und erweiterte Version des klassischen Tic-Tac-Toe,
die durch innovative Spielfeldgrößen, spezielle Felder und einen intelligenten KI-Gegner ein strategischeres und dynamischeres Spielerlebnis bietet.




🚀 Funktionen

Diese Version kombiniert die besten Elemente aus früheren Iterationen und führt neue, spannende Mechaniken ein:

🎮 Spielmodi

•Gegen Computer: Spiele gegen einen KI-Gegner mit drei verschiedenen Schwierigkeitsgraden.

•Mensch vs. Mensch: Spiele gegen einen Freund auf demselben Gerät.

Noch in Entwicklung: Gegen KI

⚙️ Anpassbare Spieloptionen

| Option | Beschreibung | Verfügbare Einstellungen |
| --- | --- | --- |
| **Spielfeldgröße** | Bestimmt die Größe des Spielfelds und die erforderliche Anzahl an Symbolen in einer Reihe zum Gewinnen. | 3x3 (3 in einer Reihe), 5x5 (4 in einer Reihe), 7x7 (5 in einer Reihe) |
| **Schwierigkeitsgrad** | Beeinflusst die Strategie des KI-Gegners (nur im Computermodus). | Leicht (Zufall), Mittel (Strategie & Zufall), Schwer (Optimale Strategie) |
| **Spezialfelder** | Kann optional aktiviert werden, um das Spiel strategischer zu gestalten. | Aktiviert / Deaktiviert |

✨ Spezialfelder

Spezialfelder sind einzigartige Zellen auf dem Spielfeld, die bei Aktivierung besondere Effekte auslösen:
| Feldtyp | Symbol | Effekt |
| --- | --- | --- |
| **Bombenfeld** | 💣 | Entfernt alle Symbole in einem 3x3-Bereich. |
| **Schildfeld** | 🛡️ | Schützt vor Bomben und anderen negativen Effekten. |
| **Tauschfeld** | 🔄 | Ermöglicht das Tauschen von zwei Feldern. |
| **Jokerfeld** | 🃏 | Zählt als beliebiges Symbol für Gewinnkombinationen. |
| **Kreuzfeld** | ➕ | Setzt Symbole in die direkt benachbarten horizontalen und vertikalen Zellen (plus die angeklickte Zelle selbst). |
| **Diagonalfeld** | ✖️ | Setzt Symbole in die direkt benachbarten diagonalen Zellen (plus die angeklickte Zelle selbst). |
| **Eckfeld** | ⭐ | Gewährt dem Spieler einen Extrazug. |




🆕 Neue und verbesserte Mechaniken

•Comeback-Mechanismus: Ein Mechanismus, der für ein ausgewogeneres Spielerlebnis sorgt.

•Tutorial: Ein umfassendes, interaktives Tutorial erklärt alle Spielfunktionen und Spezialfelder.

•Fehlerbehebung: Ein kritischer Fehler, der die Symbolplatzierung beim ersten Start verhinderte, wurde behoben.

•Verbesserte Spezialfelder: Die Logik der Kreuz- und Diagonalfelder wurde angepasst, um nur direkt benachbarte Zellen zu beeinflussen und andere Spezialfelder zu respektieren.




🛠️ Technologie-Stack

Das Spiel ist eine reine Webanwendung, die mit folgenden Technologien entwickelt wurde:

•HTML5 (index.html): Für die Struktur und das Layout der Benutzeroberfläche.

•CSS3 (styles.css): Für das moderne, aufgeräumte UI-Design und das responsive Layout (mittels CSS-Grid).

•JavaScript (game-logic.js, special-fields.js, effects.js, tutorial.js): Für die gesamte Spiellogik, die KI, die Spezialeffekte und das Tutorial.

•tsParticles: Eine externe Bibliothek zur Erzeugung von Partikeleffekten und Animationen.




📦 Projektstruktur

| Datei | Beschreibung |
| --- | --- |
| `index.html` | Die Hauptdatei mit der HTML-Struktur des Spiels. |
| `styles.css` | Enthält alle CSS-Regeln für das Styling und das responsive Design. |
| `game-logic.js` | Die zentrale Logik des Spiels, einschließlich Spielzustand, Rundenverwaltung und KI-Implementierung. |
| `special-fields.js` | Enthält die spezifische Logik für die Aktivierung und die Effekte der Spezialfelder. |
| `effects.js` | Verantwortlich für visuelle Effekte, Animationen und die Integration von `tsParticles`. |
| `tutorial.js` | Steuert das interaktive Tutorial und die Hilfefunktionen. |
| `documentation.md` | Detaillierte Dokumentation der vorgenommenen Änderungen und Funktionen. |
| `special-fields-updated.js` | Eine möglicherweise veraltete oder alternative Version der Spezialfeld-Logik, die durch `special-fields.js` ersetzt oder integriert wurde. |







🚀 Installation und Start

Da es sich um eine reine Frontend-Anwendung handelt, ist die Installation sehr einfach:

1.Entpacken Sie die TicTacWars.zip-Datei in ein beliebiges Verzeichnis.

2.Öffnen Sie die Datei index.html mit einem modernen Webbrowser (z.B. Chrome, Firefox, Edge oder Safari).

Das Spiel startet automatisch und Sie können sofort mit der Konfiguration Ihrer Partie beginnen.




📝 Autor

Readme erstellt von Manus AI auf Basis der bereitgestellten Quelldateien.

Viel Spaß beim Spielen von Tic-Tac-Wars!

