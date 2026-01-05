/* 
 * Tic-Tac-Wars - Finale Version
 * Kombinierte und verbesserte Version mit:
 * - Verschiedenen Spielfeldgrößen (3x3, 5x5, 7x7)
 * - Speziellen Feldern mit Extrazügen
 * - Innovativen Spielfeldtypen (Bomben, Schilde, Tausch, Joker, Kreuz, Diagonal)
 * - Comeback-Mechanismus für ausgewogeneres Spielerlebnis
 */

// Das gesamte Spiel wird in einem IIFE (Immediately Invoked Function Expression) gekapselt
const TicTacWars = (() => {
    // Kapselung des Spielzustands in einem Objekt
    const gameState = {
        board: [],
        boardSize: 3,
        requiredToWin: 3,
        currentPlayer: '',
        playerSymbol: 'X',
        computerSymbol: 'O',
        gameRunning: false,
        result: '',
        scores: {
            player: 0,
            computer: 0,
            ties: 0
        },
        playMode: 'computer',
        difficulty: 'middle',
        player1Name: "Spieler 1",
        player2Name: "Spieler 2",
        humanTurn: null,
        combinationArray: [],
        specialFields: {
            enabled: false,
            cornerFields: [],
            bombFields: [],
            shieldFields: [],
            swapFields: [],
            wildFields: [],
            crossFields: [],
            diagonalFields: []
        },
        activeSpecialEffects: {
            extraTurn: false,
            shield: null,
            swapMode: false,
            swapFirstCell: null
        },
        // Comeback-Mechanismus
        comebackMechanism: {
            enabled: true,
            playerAdvantage: null, // Spieler mit Vorteil (null = ausgeglichen)
            advantageLevel: 0      // Stärke des Vorteils (0-3)
        }
    };

    // Konstanten
    const delays = {
        botPlayDelay: 400,
        playDelay: 350,
        animationDelay: 300,
        explosionDelay: 500
    };

    // UI-Elemente in einem Objekt organisieren
    const ui = {
        // Spielmodus-Elemente
        modeContainer: document.querySelector('.mode-container'),
        gameContainer: document.querySelector('.game-container'),
        cellContainer: document.getElementById('cell-container'),
        statusText: document.querySelector('.status-text'),
        scoresText: document.getElementById('scores-text'),
        
        // Buttons
        playButtons: document.querySelectorAll('.mode-button'),
        difficultyButtons: document.querySelectorAll('.difficulty-button'),
        boardSizeButtons: document.querySelectorAll('.board-size-button'),
        symbolButtons: document.querySelectorAll('.symbol-button'),
        playButton: document.querySelector('.play-button'),
        restartButton: document.querySelector('.restart-button'),
        menuButton: document.querySelector('.menu-button'),
        helpButton: document.querySelector('.help-button'),
        
        // Spezielle Felder Toggles
        specialFieldsToggle: document.getElementById('special-fields-toggle'),
        bombFieldsToggle: document.getElementById('bomb-fields-toggle'),
        shieldFieldsToggle: document.getElementById('shield-fields-toggle'),
        swapFieldsToggle: document.getElementById('swap-fields-toggle'),
        wildFieldsToggle: document.getElementById('wild-fields-toggle'),
        crossFieldsToggle: null,  // Wird später initialisiert
        diagonalFieldsToggle: null, // Wird später initialisiert
        comebackToggle: null,     // Wird später initialisiert
        
        // Spieler-Namen Eingabefelder
        player1Input: document.getElementById('player1Name'),
        player2Input: document.getElementById('player2Name'),
        playerNamesContainer: document.getElementById('playerNamesContainer'),
        
        // Fehlertext
        errorText: document.getElementById('error-text'),
        
        // Tutorial und Legende
        tutorialContainer: document.querySelector('.tutorial-container'),
        legendContainer: document.querySelector('.legend-container'),
        tutorialSteps: document.querySelectorAll('.tutorial-step'),
        tutorialPrev: document.querySelector('.tutorial-prev'),
        tutorialNext: document.querySelector('.tutorial-next'),
        tutorialClose: document.querySelector('.tutorial-close'),
        tutorialDots: document.querySelector('.tutorial-dots'),
        legendClose: document.querySelector('.legend-close')
    };

    // Initialisierungsfunktion
    const init = () => {
        // Zeige Spielmodus-Ansicht
        ui.modeContainer.style.display = 'block';
        ui.gameContainer.style.display = 'none';
        
        // Event-Listener für Spielmodus-Buttons
        ui.playButtons.forEach(button => {
            button.addEventListener('click', () => {
                ui.playButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                gameState.playMode = button.id;
                
                // Zeige Spielernamen-Container, wenn Mensch vs. Mensch ausgewählt ist
                if (ui.playerNamesContainer) {
                    ui.playerNamesContainer.style.display = button.id === 'human' ? 'block' : 'none';
                }
                
                // Zeige/Verstecke Schwierigkeitsgrad-Container basierend auf Spielmodus
                const difficultyContainer = document.querySelector('.difficulty-container');
                if (difficultyContainer) {
                    difficultyContainer.style.display = button.id === 'computer' ? 'block' : 'none';
                }
            });
        });

        // Event-Listener für Schwierigkeitsgrad-Buttons
        ui.difficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                ui.difficultyButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                gameState.difficulty = button.id;
            });
        });

        // Event-Listener für Spielfeldgröße-Buttons
        ui.boardSizeButtons.forEach(button => {
            button.addEventListener('click', () => {
                ui.boardSizeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const sizeId = button.id;
                gameState.boardSize = parseInt(sizeId.split('-')[1]);
                
                // Setze die erforderliche Anzahl zum Gewinnen basierend auf der Spielfeldgröße
                if (gameState.boardSize === 3) {
                    gameState.requiredToWin = 3;
                } else if (gameState.boardSize === 5) {
                    gameState.requiredToWin = 4;
                } else if (gameState.boardSize === 7) {
                    gameState.requiredToWin = 5;
                }
            });
        });

        // Event-Listener für Symbol-Buttons
        ui.symbolButtons.forEach(button => {
            button.addEventListener('click', () => {
                ui.symbolButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                gameState.playerSymbol = button.textContent;
                gameState.computerSymbol = gameState.playerSymbol === 'X' ? 'O' : 'X';
            });
        });

        // Event-Listener für spezielle Felder Toggles
        if (ui.specialFieldsToggle) {
            ui.specialFieldsToggle.addEventListener('change', () => {
                gameState.specialFields.enabled = ui.specialFieldsToggle.checked;
                const specialFieldsOptions = document.querySelector('.special-fields-options');
                if (specialFieldsOptions) {
                    specialFieldsOptions.style.display = ui.specialFieldsToggle.checked ? 'block' : 'none';
                }
            });
        }

        // Event-Listener für Bombenfelder Toggle
        if (ui.bombFieldsToggle) {
            ui.bombFieldsToggle.addEventListener('change', () => {
                gameState.specialFields.bombEnabled = ui.bombFieldsToggle.checked;
            });
        }

        // Event-Listener für Schildfelder Toggle
        if (ui.shieldFieldsToggle) {
            ui.shieldFieldsToggle.addEventListener('change', () => {
                gameState.specialFields.shieldEnabled = ui.shieldFieldsToggle.checked;
            });
        }

        // Event-Listener für Tauschfelder Toggle
        if (ui.swapFieldsToggle) {
            ui.swapFieldsToggle.addEventListener('change', () => {
                gameState.specialFields.swapEnabled = ui.swapFieldsToggle.checked;
            });
        }

        // Event-Listener für Jokerfelder Toggle
        if (ui.wildFieldsToggle) {
            ui.wildFieldsToggle.addEventListener('change', () => {
                gameState.specialFields.wildEnabled = ui.wildFieldsToggle.checked;
            });
        }

        // Erstelle und initialisiere UI-Elemente für neue Spezialfelder
        createNewSpecialFieldsUI();

        // Event-Listener für Play-Button
        ui.playButton.addEventListener('click', handlePlayButtonClick);

        // Event-Listener für Restart-Button
        ui.restartButton.addEventListener('click', resetGame);

        // Event-Listener für Menu-Button
        ui.menuButton.addEventListener('click', returnToMainMenu);
        
        // Event-Listener für Help-Button
        ui.helpButton.addEventListener('click', showLegend);
        
        // Event-Listener für Tutorial und Legende
        initTutorialAndLegend();
        
        // Verstecke spezielle Felder Optionen standardmäßig
        const specialFieldsOptions = document.querySelector('.special-fields-options');
        if (specialFieldsOptions) {
            specialFieldsOptions.style.display = 'none';
        }
    };

    // Funktion zum Erstellen der UI-Elemente für neue Spezialfelder
    function createNewSpecialFieldsUI() {
        const specialFieldsOptions = document.querySelector('.special-fields-options');
        if (!specialFieldsOptions) return;

        // Kreuzfeld-Option
        const crossFieldOption = document.createElement('div');
        crossFieldOption.className = 'special-field-option';
        crossFieldOption.innerHTML = `
            <label class="switch">
                <input type="checkbox" id="cross-fields-toggle">
                <span class="slider round"></span>
            </label>
            <span class="toggle-label">Kreuzfelder</span>
        `;
        specialFieldsOptions.appendChild(crossFieldOption);

        const crossFieldDescription = document.createElement('div');
        crossFieldDescription.className = 'special-field-description';
        crossFieldDescription.textContent = 'Setzt in alle horizontalen und vertikalen Richtungen ein Symbol.';
        specialFieldsOptions.appendChild(crossFieldDescription);

        // Diagonalfeld-Option
        const diagonalFieldOption = document.createElement('div');
        diagonalFieldOption.className = 'special-field-option';
        diagonalFieldOption.innerHTML = `
            <label class="switch">
                <input type="checkbox" id="diagonal-fields-toggle">
                <span class="slider round"></span>
            </label>
            <span class="toggle-label">Diagonalfelder</span>
        `;
        specialFieldsOptions.appendChild(diagonalFieldOption);

        const diagonalFieldDescription = document.createElement('div');
        diagonalFieldDescription.className = 'special-field-description';
        diagonalFieldDescription.textContent = 'Setzt in alle diagonalen Richtungen ein Symbol.';
        specialFieldsOptions.appendChild(diagonalFieldDescription);

        // Comeback-Mechanismus-Option
        const comebackOption = document.createElement('div');
        comebackOption.className = 'special-field-option comeback-mode-container';
        comebackOption.innerHTML = `
            <div class="comeback-mode-title">Comeback-Mechanismus</div>
            <div class="comeback-mode-description">Spieler, die zurückliegen, haben eine höhere Chance, Spezialfelder zu aktivieren.</div>
            <label class="switch">
                <input type="checkbox" id="comeback-mechanism-toggle" checked>
                <span class="slider round"></span>
            </label>
            <span class="toggle-label">Aktiviert</span>
        `;
        specialFieldsOptions.appendChild(comebackOption);

        // Speichere Referenzen auf die neuen UI-Elemente
        ui.crossFieldsToggle = document.getElementById('cross-fields-toggle');
        ui.diagonalFieldsToggle = document.getElementById('diagonal-fields-toggle');
        ui.comebackToggle = document.getElementById('comeback-mechanism-toggle');

        // Event-Listener für die neuen Toggles
        ui.crossFieldsToggle.addEventListener('change', () => {
            gameState.specialFields.crossEnabled = ui.crossFieldsToggle.checked;
        });

        ui.diagonalFieldsToggle.addEventListener('change', () => {
            gameState.specialFields.diagonalEnabled = ui.diagonalFieldsToggle.checked;
        });

        ui.comebackToggle.addEventListener('change', () => {
            gameState.comebackMechanism.enabled = ui.comebackToggle.checked;
        });
    }
    
    // Funktion zum Initialisieren des Tutorials und der Legende
    function initTutorialAndLegend() {
        // Tutorial-Dots erstellen
        for (let i = 0; i < ui.tutorialSteps.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'tutorial-dot';
            dot.dataset.step = i + 1;
            dot.addEventListener('click', () => {
                showTutorialStep(i + 1);
            });
            ui.tutorialDots.appendChild(dot);
        }
        
        // Event-Listener für Tutorial-Navigation
        ui.tutorialPrev.addEventListener('click', () => {
            const currentStep = getCurrentTutorialStep();
            if (currentStep > 1) {
                showTutorialStep(currentStep - 1);
            }
        });
        
        ui.tutorialNext.addEventListener('click', () => {
            const currentStep = getCurrentTutorialStep();
            if (currentStep < ui.tutorialSteps.length) {
                showTutorialStep(currentStep + 1);
            }
        });
        
        ui.tutorialClose.addEventListener('click', closeTutorial);
        ui.legendClose.addEventListener('click', closeLegend);
        
        // Hilfe-Button zeigt die Legende an
        ui.helpButton.addEventListener('click', showLegend);
    }
    
    // Funktion zum Anzeigen des Tutorials
    function showTutorial() {
        ui.tutorialContainer.style.display = 'flex';
        showTutorialStep(1);
    }
    
    // Funktion zum Schließen des Tutorials
    function closeTutorial() {
        ui.tutorialContainer.style.display = 'none';
    }
    
    // Funktion zum Anzeigen der Legende
    function showLegend() {
        ui.legendContainer.style.display = 'flex';
    }
    
    // Funktion zum Schließen der Legende
    function closeLegend() {
        ui.legendContainer.style.display = 'none';
    }
    
    // Funktion zum Anzeigen eines bestimmten Tutorial-Schritts
    function showTutorialStep(step) {
        // Alle Schritte ausblenden
        ui.tutorialSteps.forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        
        // Alle Dots zurücksetzen
        const dots = ui.tutorialDots.querySelectorAll('.tutorial-dot');
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Aktuellen Schritt anzeigen
        const currentStep = ui.tutorialContainer.querySelector(`.tutorial-step[data-step="${step}"]`);
        if (currentStep) {
            currentStep.classList.add('active');
        }
        
        // Aktuellen Dot markieren
        const currentDot = ui.tutorialDots.querySelector(`.tutorial-dot[data-step="${step}"]`);
        if (currentDot) {
            currentDot.classList.add('active');
        }
        
        // Prev/Next-Buttons aktualisieren
        ui.tutorialPrev.disabled = step <= 1;
        ui.tutorialNext.disabled = step >= ui.tutorialSteps.length;
    }
    
    // Funktion zum Ermitteln des aktuellen Tutorial-Schritts
    function getCurrentTutorialStep() {
        const activeStep = ui.tutorialContainer.querySelector('.tutorial-step.active');
        return activeStep ? parseInt(activeStep.dataset.step) : 1;
    }

    // Funktion zum Behandeln des Play-Button-Klicks
    function handlePlayButtonClick() {
        const activePlayButton = document.querySelector('.mode-button.active');
        const activeDifficultyButton = document.querySelector('.difficulty-button.active');
        const activeSymbolButton = document.querySelector('.symbol-button.active');

        // Überprüfe, ob alle erforderlichen Optionen ausgewählt wurden
        if (activePlayButton && activeSymbolButton && 
            (activePlayButton.id !== 'computer' || activeDifficultyButton)) {
            // Fehler-Text ausblenden, wenn alles in Ordnung ist
            ui.errorText.style.display = 'none';
            
            // Vor dem Spielstart die Spieler-Namen speichern
            updatePlayerNames();
            
            // Spielvariablen initialisieren
            initGameVariables();
            
            // Spiel starten
            mainGame();
        } else {
            // Zeige Fehlermeldung, wenn nicht alle Optionen ausgewählt wurden
            handleInvalidSelection(activePlayButton, activeDifficultyButton, activeSymbolButton);
        }
    }

    // Funktion zum Behandeln ungültiger Auswahlen
    function handleInvalidSelection(activePlayButton, activeDifficultyButton, activeSymbolButton) {
        ui.errorText.style.display = 'block';
        
        if (!activePlayButton) {
            ui.errorText.textContent = 'Bitte wähle einen Spielmodus aus.';
        } else if (activePlayButton.id === 'computer' && !activeDifficultyButton) {
            ui.errorText.textContent = 'Bitte wähle eine Schwierigkeitsstufe aus.';
        } else if (!activeSymbolButton) {
            ui.errorText.textContent = 'Bitte wähle ein Symbol aus.';
        }
    }

    // Funktion zum Aktualisieren der Spielernamen
    function updatePlayerNames() {
        if (gameState.playMode === 'human') {
            gameState.player1Name = ui.player1Input.value || "Spieler 1";
            gameState.player2Name = ui.player2Input.value || "Spieler 2";
        } else {
            gameState.player1Name = "Spieler";
            gameState.player2Name = "Computer";
        }
    }

    // Funktion zum Initialisieren der Spielvariablen
    function initGameVariables() {
        // Wechsle zur Spielansicht
        ui.modeContainer.style.display = 'none';
        ui.gameContainer.style.display = 'block';
        
        // Spielfeldgröße aus der Auswahl übernehmen
        const activeBoardSizeButton = document.querySelector('.board-size-button.active');
        if (activeBoardSizeButton) {
            const sizeId = activeBoardSizeButton.id;
            gameState.boardSize = parseInt(sizeId.split('-')[1]);
            
            // Setze die erforderliche Anzahl zum Gewinnen basierend auf der Spielfeldgröße
            if (gameState.boardSize === 3) {
                gameState.requiredToWin = 3;
            } else if (gameState.boardSize === 5) {
                gameState.requiredToWin = 4;
            } else if (gameState.boardSize === 7) {
                gameState.requiredToWin = 5;
            }
        }
        
        // Spielsymbol aus der Auswahl übernehmen
        const activeSymbolButton = document.querySelector('.symbol-button.active');
        if (activeSymbolButton) {
            gameState.playerSymbol = activeSymbolButton.textContent;
            gameState.computerSymbol = gameState.playerSymbol === 'X' ? 'O' : 'X';
        }
        
        // Spielmodus aus der Auswahl übernehmen
        const activePlayButton = document.querySelector('.mode-button.active');
        if (activePlayButton) {
            gameState.playMode = activePlayButton.id;
        }
        
        // Schwierigkeitsgrad aus der Auswahl übernehmen
        const activeDifficultyButton = document.querySelector('.difficulty-button.active');
        if (activeDifficultyButton) {
            gameState.difficulty = activeDifficultyButton.id;
        }
        
        // Überprüfe, ob spezielle Felder aktiviert sind
        gameState.specialFields.enabled = ui.specialFieldsToggle && ui.specialFieldsToggle.checked;
        gameState.specialFields.bombEnabled = ui.bombFieldsToggle && ui.bombFieldsToggle.checked;
        gameState.specialFields.shieldEnabled = ui.shieldFieldsToggle && ui.shieldFieldsToggle.checked;
        gameState.specialFields.swapEnabled = ui.swapFieldsToggle && ui.swapFieldsToggle.checked;
        gameState.specialFields.wildEnabled = ui.wildFieldsToggle && ui.wildFieldsToggle.checked;
        gameState.specialFields.crossEnabled = ui.crossFieldsToggle && ui.crossFieldsToggle.checked;
        gameState.specialFields.diagonalEnabled = ui.diagonalFieldsToggle && ui.diagonalFieldsToggle.checked;
        gameState.comebackMechanism.enabled = ui.comebackToggle && ui.comebackToggle.checked;
        
        // Zurücksetzen der speziellen Feld-Zustände
        gameState.activeSpecialEffects.shield = null;
        gameState.activeSpecialEffects.swapMode = false;
        gameState.activeSpecialEffects.swapFirstCell = null;
        gameState.activeSpecialEffects.extraTurn = false;
        
        // Spielfeld initialisieren
        initializeBoard();
        
        // Punkte anzeigen beim Spielstart
        updateScoresDisplay();
    }

    // Funktion zum Initialisieren des Spielfelds
    function initializeBoard() {
        // Leeres Spielfeld erstellen
        gameState.board = Array(gameState.boardSize * gameState.boardSize).fill("");
        
        // Spielfeld-Container leeren
        ui.cellContainer.innerHTML = '';
        
        // CSS-Klasse für die Spielfeldgröße setzen
        ui.cellContainer.className = `cell-container size-${gameState.boardSize}`;
        ui.cellContainer.style.gridTemplateColumns = `repeat(${gameState.boardSize}, 1fr)`;
        ui.cellContainer.style.gridTemplateRows = `repeat(${gameState.boardSize}, 1fr)`;
        
        // Zellen erstellen
        for (let i = 0; i < gameState.boardSize * gameState.boardSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            ui.cellContainer.appendChild(cell);
        }
        
        // Spezielle Feldtypen platzieren, wenn aktiviert
        if (gameState.specialFields.enabled) {
            initializeSpecialFields();
        }
    }
    
    // Funktion zum Initialisieren spezieller Felder
    function initializeSpecialFields() {
        const totalCells = gameState.boardSize * gameState.boardSize;
        const cornerIndices = getCornerIndices();
        
        // Setze Eckfelder
        gameState.specialFields.cornerFields = cornerIndices;
        
        // Markiere Eckfelder im UI
        cornerIndices.forEach(index => {
            const cell = ui.cellContainer.children[index];
            cell.classList.add('corner-field');
        });
        
        // Verfügbare Zellen (ohne Ecken)
        let availableCells = [];
        for (let i = 0; i < totalCells; i++) {
            if (!cornerIndices.includes(i)) {
                availableCells.push(i);
            }
        }
        
        // Mische die verfügbaren Zellen
        shuffleArray(availableCells);
        
        // Maximal 20% spezielle Felder
        const maxSpecialCells = Math.floor(totalCells * 0.2);
        let enabledTypes = 0;
        
        if (gameState.specialFields.bombEnabled) enabledTypes++;
        if (gameState.specialFields.shieldEnabled) enabledTypes++;
        if (gameState.specialFields.swapEnabled) enabledTypes++;
        if (gameState.specialFields.wildEnabled) enabledTypes++;
        if (gameState.specialFields.crossEnabled) enabledTypes++;
        if (gameState.specialFields.diagonalEnabled) enabledTypes++;
        
        if (enabledTypes === 0) return;
        
        const fieldsPerType = Math.max(1, Math.floor(maxSpecialCells / enabledTypes));
        
        // Initialisiere Bombenfelder
        if (gameState.specialFields.bombEnabled && availableCells.length > 0) {
            gameState.specialFields.bombFields = availableCells.splice(0, fieldsPerType);
            
            // Markiere Bombenfelder im UI
            gameState.specialFields.bombFields.forEach(index => {
                const cell = ui.cellContainer.children[index];
                cell.classList.add('bomb-field');
            });
        }
        
        // Initialisiere Schildfelder
        if (gameState.specialFields.shieldEnabled && availableCells.length > 0) {
            gameState.specialFields.shieldFields = availableCells.splice(0, fieldsPerType);
            
            // Markiere Schildfelder im UI
            gameState.specialFields.shieldFields.forEach(index => {
                const cell = ui.cellContainer.children[index];
                cell.classList.add('shield-field');
            });
        }
        
        // Initialisiere Tauschfelder
        if (gameState.specialFields.swapEnabled && availableCells.length > 0) {
            gameState.specialFields.swapFields = availableCells.splice(0, fieldsPerType);
            
            // Markiere Tauschfelder im UI
            gameState.specialFields.swapFields.forEach(index => {
                const cell = ui.cellContainer.children[index];
                cell.classList.add('swap-field');
            });
        }
        
        // Initialisiere Jokerfelder
        if (gameState.specialFields.wildEnabled && availableCells.length > 0) {
            gameState.specialFields.wildFields = availableCells.splice(0, fieldsPerType);
            
            // Markiere Jokerfelder im UI
            gameState.specialFields.wildFields.forEach(index => {
                const cell = ui.cellContainer.children[index];
                cell.classList.add('wild-field');
            });
        }
        
        // Initialisiere Kreuzfelder
        if (gameState.specialFields.crossEnabled && availableCells.length > 0) {
            gameState.specialFields.crossFields = availableCells.splice(0, fieldsPerType);
            
            // Markiere Kreuzfelder im UI
            gameState.specialFields.crossFields.forEach(index => {
                const cell = ui.cellContainer.children[index];
                cell.classList.add('cross-field');
            });
        }
        
        // Initialisiere Diagonalfelder
        if (gameState.specialFields.diagonalEnabled && availableCells.length > 0) {
            gameState.specialFields.diagonalFields = availableCells.splice(0, fieldsPerType);
            
            // Markiere Diagonalfelder im UI
            gameState.specialFields.diagonalFields.forEach(index => {
                const cell = ui.cellContainer.children[index];
                cell.classList.add('diagonal-field');
            });
        }
    }
    
    // Funktion zum Ermitteln der Eckindizes
    function getCornerIndices() {
        const size = gameState.boardSize;
        return [
            0,                  // Oben links
            size - 1,           // Oben rechts
            size * (size - 1),  // Unten links
            size * size - 1     // Unten rechts
        ];
    }
    
    // Hilfsfunktion zum Mischen eines Arrays (Fisher-Yates-Algorithmus)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Funktion zum Überprüfen, ob eine Zelle eine Eckzelle ist
    function isCornerCell(index) {
        return gameState.specialFields.cornerFields.includes(parseInt(index));
    }
    
    // Funktion zum Überprüfen, ob eine Zelle ein spezielles Feld ist
    function isSpecialFieldType(index, type) {
        index = parseInt(index);
        switch(type) {
            case 'bomb':
                return gameState.specialFields.bombEnabled && gameState.specialFields.bombFields.includes(index);
            case 'shield':
                return gameState.specialFields.shieldEnabled && gameState.specialFields.shieldFields.includes(index);
            case 'swap':
                return gameState.specialFields.swapEnabled && gameState.specialFields.swapFields.includes(index);
            case 'wild':
                return gameState.specialFields.wildEnabled && gameState.specialFields.wildFields.includes(index);
            case 'cross':
                return gameState.specialFields.crossEnabled && gameState.specialFields.crossFields.includes(index);
            case 'diagonal':
                return gameState.specialFields.diagonalEnabled && gameState.specialFields.diagonalFields.includes(index);
            default:
                return false;
        }
    }
    
    // Funktion zum Aktualisieren der Punkteanzeige
    function updateScoresDisplay() {
        if (gameState.playMode === 'computer') {
            ui.scoresText.textContent = `${gameState.player1Name}: ${gameState.scores.player} | ${gameState.player2Name}: ${gameState.scores.computer} | Unentschieden: ${gameState.scores.ties}`;
        } else {
            ui.scoresText.textContent = `${gameState.player1Name} (X): ${gameState.scores.player} | ${gameState.player2Name} (O): ${gameState.scores.computer} | Unentschieden: ${gameState.scores.ties}`;
        }
        ui.scoresText.style.display = 'block';
    }
    
    // Funktion zum Zurücksetzen der Spielerpunkte
    function resetScores() {
        gameState.scores = {
            player: 0,
            computer: 0,
            ties: 0
        };
        updateScoresDisplay();
    }

    // Funktion zum Zurücksetzen des Spiels
    function resetGame() {
        // Spielvariablen zurücksetzen
        gameState.humanTurn = null;
        gameState.result = "";
        gameState.combinationArray = [];
        gameState.activeSpecialEffects.extraTurn = false;
        gameState.activeSpecialEffects.shield = null;
        gameState.activeSpecialEffects.swapMode = false;
        gameState.activeSpecialEffects.swapFirstCell = null;
        
        // Leeres Spielfeld erstellen
        gameState.board = Array(gameState.boardSize * gameState.boardSize).fill("");

        // Zellenanzeige und Klassen zurücksetzen
        const cells = ui.cellContainer.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('winner', 'symbol-placed', 'x-symbol', 'o-symbol', 
                               'bomb-active', 'shield-active', 'swap-active', 'wild-active', 
                               'cross-active', 'diagonal-active', 'swap-target');
        });

        // Extrazug-Indikator entfernen, falls vorhanden
        const extraMoveIndicator = document.querySelector('.extra-move-indicator');
        if (extraMoveIndicator) {
            extraMoveIndicator.remove();
        }
        
        // Spezialeffekt-Indikator entfernen, falls vorhanden
        const specialEffectIndicator = document.querySelector('.special-effect-indicator');
        if (specialEffectIndicator) {
            specialEffectIndicator.remove();
        }

        // Klick-Ereignisse während des Resets deaktivieren
        toggleCellClickListeners(false);

        // Klick-Ereignisse nach einer kurzen Verzögerung wieder aktivieren
        setTimeout(() => {
            toggleCellClickListeners(true);
        }, delays.playDelay);

        // Spiel neu starten
        startGame();
    }

    // Funktion zum Starten des Spiels
    function startGame() {
        gameState.gameRunning = false;
        gameState.humanTurn = determineStartingPlayer();
        gameState.result = "";
        
        if (gameState.playMode === 'computer') {
            gameState.currentPlayer = gameState.humanTurn ? gameState.playerSymbol : gameState.computerSymbol;
        } else {
            gameState.currentPlayer = 'X'; // Im Mensch vs. Mensch Modus startet X
        }
        
        // BUGFIX: Event-Listener für Zellen aktivieren
        toggleCellClickListeners(true);
        
        runGame();
    }

    // Funktion zum Bestimmen des startenden Spielers
    function determineStartingPlayer() {
        return Math.random() < 0.5;
    }

    // Funktion für den Spielablauf
    function runGame() {
        if (gameResult()) {
            if (gameState.result === "Tie") {
                ui.statusText.innerHTML = `Unentschieden!`;
                ui.statusText.classList.add('updated');
                setTimeout(() => {
                    ui.statusText.classList.remove('updated');
                }, 500);
                
                // Spielerpunkte aktualisieren
                gameState.scores.ties++;
            } else {
                changeWinnerBlockColor(gameState.combinationArray);
                
                if (gameState.result === gameState.playerSymbol) {
                    ui.statusText.innerHTML = `${gameState.player1Name} gewinnt!`;
                    gameState.scores.player++;
                } else {
                    ui.statusText.innerHTML = `${gameState.player2Name} gewinnt!`;
                    gameState.scores.computer++;
                }
            }
            
            // Punkteanzeige aktualisieren
            updateScoresDisplay();
        } else {
            // Wenn ein Extrazug verfügbar ist, zeige dies an
            if (gameState.activeSpecialEffects.extraTurn) {
                showExtraMoveIndicator();
            }
            
            // Wenn Tausch-Modus aktiv ist, warte auf zweiten Klick
            if (gameState.activeSpecialEffects.swapMode) {
                ui.statusText.innerHTML = `Wähle ein zweites Feld zum Tauschen.`;
                return;
            }
            
            if (gameState.playMode === 'computer') {
                if (gameState.humanTurn) {
                    ui.statusText.innerHTML = `Dein Zug (${gameState.playerSymbol})`;
                    humanPlay();
                } else {
                    ui.statusText.innerHTML = `Computer denkt nach...`;
                    botPlay();
                }
            } else { // Mensch vs. Mensch
                if (gameState.currentPlayer === 'X') {
                    ui.statusText.innerHTML = `${gameState.player1Name} ist am Zug (X)`;
                } else {
                    ui.statusText.innerHTML = `${gameState.player2Name} ist am Zug (O)`;
                }
                humanPlay();
            }
        }
    }

    // Funktion für das Spielende
    function gameResult() {
        gameState.result = checkWinner();
        if (gameState.result === "") {
            gameState.gameRunning = false;
            return false;
        } else {
            gameState.gameRunning = true;
            return true;
        }
    }

    // Funktion zum Ändern der Farbe der Gewinnerzellen
    function changeWinnerBlockColor(combination) {
        const cells = ui.cellContainer.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            if (combination.includes(index)) {
                cell.classList.add('winner');
                
                // Position für Partikeleffekt ermitteln
                const rect = cell.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                
                // Verzögerten Partikeleffekt für jede Gewinnerzelle auslösen
                setTimeout(() => {
                    triggerParticleEffect(x, y, ["#00ff00", "#ffff00", "#ffffff"]);
                }, 300);
            }
        });
        
        // Status-Text mit Animation aktualisieren
        ui.statusText.classList.add('updated');
        setTimeout(() => {
            ui.statusText.classList.remove('updated');
        }, 500);
    }

    // Funktion für den menschlichen Zug
    function humanPlay() {
        if (!gameState.gameRunning) {
            toggleCellClickListeners(true);
        }
    }

    // Funktion für den Zug des Computers
    function botPlay() {
        if (!gameState.gameRunning) {
            setTimeout(() => {
                let move;

                switch (gameState.difficulty) {
                    case 'easy':
                        move = getRandomMove();
                        break;
                    case 'middle':
                        move = mediumBotPlay();
                        break;
                    case 'hard':
                        move = bestMove();
                        break;
                    default:
                        move = getRandomMove();
                }

                // Symbol setzen mit Animation
                const cell = ui.cellContainer.children[move];
                cell.textContent = gameState.computerSymbol;
                cell.classList.add('symbol-placed');
                
                // Farbklasse basierend auf Symbol hinzufügen
                if (gameState.computerSymbol === 'X') {
                    cell.classList.add('x-symbol');
                } else {
                    cell.classList.add('o-symbol');
                }
                
                gameState.board[move] = gameState.computerSymbol;
                
                // Position für Partikeleffekt ermitteln
                const rect = cell.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                
                // Partikeleffekt für Computerzug
                if (gameState.difficulty === 'hard') {
                    // Stärkerer Effekt für schwierigen Modus
                    triggerParticleEffect(x, y, ["#ff0000", "#ff5500", "#ffaa00"]);
                } else {
                    triggerParticleEffect(x, y, ["#0000ff", "#00aaff", "#00ffff"]);
                }
                
                // Prüfe auf spezielle Feldtypen
                handleSpecialField(move);
            }, delays.botPlayDelay);
        }
    }
    
    // Funktion zum Behandeln spezieller Felder
    function handleSpecialField(index) {
        let specialFieldActivated = false;
        
        // Prüfe auf Bombenfeld
        if (isSpecialFieldType(index, 'bomb')) {
            specialFieldActivated = true;
            activateBombField(index);
            
            // Nach der Bombenexplosion fortfahren
            setTimeout(() => {
                checkForExtraMoveAndContinue(index);
            }, delays.explosionDelay + 100);
            return;
        }
        
        // Prüfe auf Schildfeld
        if (isSpecialFieldType(index, 'shield')) {
            specialFieldActivated = true;
            activateShieldField(index);
            
            // Nach der Schildaktivierung fortfahren
            setTimeout(() => {
                checkForExtraMoveAndContinue(index);
            }, delays.animationDelay + 100);
            return;
        }
        
        // Prüfe auf Tauschfeld
        if (isSpecialFieldType(index, 'swap')) {
            specialFieldActivated = true;
            
            if (gameState.playMode === 'computer') {
                // Computer wählt zufällig ein belegtes Feld zum Tauschen
                const occupiedCells = [];
                for (let i = 0; i < gameState.board.length; i++) {
                    if (i !== index && gameState.board[i] !== "") {
                        occupiedCells.push(i);
                    }
                }
                
                if (occupiedCells.length > 0) {
                    const targetIndex = occupiedCells[Math.floor(Math.random() * occupiedCells.length)];
                    
                    // Tausch durchführen
                    setTimeout(() => {
                        performSwap(index, targetIndex);
                        
                        // Nach dem Tausch fortfahren
                        setTimeout(() => {
                            checkForExtraMoveAndContinue(index);
                        }, delays.animationDelay + 100);
                    }, delays.animationDelay);
                    return;
                }
            } else {
                // Für menschliche Spieler: Aktiviere Tausch-Modus
                activateSwapField(index);
                return;
            }
        }
        
        // Prüfe auf Jokerfeld
        if (isSpecialFieldType(index, 'wild')) {
            specialFieldActivated = true;
            activateWildField(index);
            
            // Nach der Jokeraktivierung fortfahren
            setTimeout(() => {
                checkForExtraMoveAndContinue(index);
            }, delays.animationDelay + 100);
            return;
        }
        
        // Prüfe auf Kreuzfeld
        if (isSpecialFieldType(index, 'cross')) {
            specialFieldActivated = true;
            activateCrossField(index, gameState.board[index]);
            
            // Nach der Kreuzaktivierung fortfahren
            setTimeout(() => {
                checkForExtraMoveAndContinue(index);
            }, delays.animationDelay * gameState.boardSize + 100);
            return;
        }
        
        // Prüfe auf Diagonalfeld
        if (isSpecialFieldType(index, 'diagonal')) {
            specialFieldActivated = true;
            activateDiagonalField(index, gameState.board[index]);
            
            // Nach der Diagonalaktivierung fortfahren
            setTimeout(() => {
                checkForExtraMoveAndContinue(index);
            }, delays.animationDelay * gameState.boardSize + 100);
            return;
        }
        
        // Prüfe auf Eckfeld (Extrazug)
        if (isCornerCell(index) && gameState.specialFields.enabled) {
            specialFieldActivated = true;
            
            // Setze Flag für Extrazug
            gameState.activeSpecialEffects.extraTurn = true;
            
            // Zeige Extrazug-Indikator an
            showExtraMoveIndicator();
            
            // Spielerwechsel nicht durchführen bei Extrazug
            runGame();
            return;
        }
        
        // Kein spezielles Feld oder Extrazug
        checkForExtraMoveAndContinue(index);
    }
    
    // Funktion zum Prüfen auf Extrazug und Fortfahren
    function checkForExtraMoveAndContinue(index) {
        if (gameState.activeSpecialEffects.extraTurn) {
            // Extrazug bereits aktiviert, zurücksetzen und fortfahren
            gameState.activeSpecialEffects.extraTurn = false;
            
            // Entferne Extrazug-Indikator, falls vorhanden
            const indicator = document.querySelector('.extra-move-indicator');
            if (indicator) {
                indicator.remove();
            }
            
            // Kein Spielerwechsel bei Extrazug
            runGame();
        } else {
            // Normaler Zug, Spielerwechsel durchführen
            swapTurn();
            runGame();
        }
    }
    
    // Funktion zum Anzeigen des Extrazug-Indikators
    function showExtraMoveIndicator() {
        // Entferne vorhandenen Indikator, falls vorhanden
        const existingIndicator = document.querySelector('.extra-move-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Erstelle neuen Indikator
        const indicator = document.createElement('div');
        indicator.className = 'extra-move-indicator';
        indicator.textContent = 'Extrazug verfügbar!';
        ui.gameContainer.appendChild(indicator);
    }
    
    // Funktion zum Wechseln des Zuges
    function swapTurn() {
        if (gameState.playMode === 'computer') {
            gameState.humanTurn = !gameState.humanTurn;
            gameState.currentPlayer = gameState.humanTurn ? gameState.playerSymbol : gameState.computerSymbol;
        } else {
            gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
        }
    }
    
    // Funktion zum Aktivieren eines Bombenfelds
    function activateBombField(index) {
        const cell = ui.cellContainer.children[index];
        cell.classList.add('bomb-active');
        
        // Position für Partikeleffekt ermitteln
        const rect = cell.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Explosionseffekt auslösen
        triggerExplosionEffect(x, y);
        
        // Benachbarte Felder ermitteln
        const neighbors = getNeighborCells(index);
        
        // Statustext aktualisieren
        ui.statusText.innerHTML = `Bombenfeld aktiviert! Benachbarte Felder werden zerstört.`;
        ui.statusText.classList.add('updated');
        setTimeout(() => {
            ui.statusText.classList.remove('updated');
        }, 500);
        
        // Indikator für Bombeneffekt anzeigen
        showSpecialEffectIndicator('bomb', 'Bombenfeld aktiviert!');
        
        // Nach kurzer Verzögerung benachbarte Felder leeren
        setTimeout(() => {
            neighbors.forEach(neighborIndex => {
                // Wenn ein Nachbarfeld ein Schildfeld mit aktivem Schild ist, wird es nicht zerstört
                if (gameState.activeSpecialEffects.shield === neighborIndex) {
                    // Schildeffekt anzeigen
                    ui.cellContainer.children[neighborIndex].classList.add('shield-active');
                    
                    // Position für Schildeffekt ermitteln
                    const shieldRect = ui.cellContainer.children[neighborIndex].getBoundingClientRect();
                    const shieldX = shieldRect.left + shieldRect.width / 2;
                    const shieldY = shieldRect.top + shieldRect.height / 2;
                    
                    // Schildeffekt auslösen
                    triggerShieldEffect(shieldX, shieldY);
                    
                    // Schild verbrauchen
                    setTimeout(() => {
                        ui.cellContainer.children[neighborIndex].classList.remove('shield-active');
                        gameState.activeSpecialEffects.shield = null;
                    }, 1000);
                    
                    return;
                }
                
                // Feld leeren
                if (gameState.board[neighborIndex] !== "") {
                    gameState.board[neighborIndex] = "";
                    ui.cellContainer.children[neighborIndex].textContent = "";
                    ui.cellContainer.children[neighborIndex].classList.remove('symbol-placed', 'x-symbol', 'o-symbol');
                    
                    // Explosionseffekt für jedes zerstörte Feld
                    const neighborRect = ui.cellContainer.children[neighborIndex].getBoundingClientRect();
                    const neighborX = neighborRect.left + neighborRect.width / 2;
                    const neighborY = neighborRect.top + neighborRect.height / 2;
                    
                    triggerParticleEffect(neighborX, neighborY, ["#ff0000", "#ff5500"], 30, 8);
                }
            });
            
            // Bombenfeld-Klasse entfernen
            cell.classList.remove('bomb-active');
            
            // Indikator entfernen
            removeSpecialEffectIndicator();
            
            // Prüfen, ob das Spiel nach der Explosion gewonnen wurde
            checkGameStateAfterSpecialEffect();
        }, delays.explosionDelay);
    }
    
    // Funktion zum Aktivieren eines Schildfelds
    function activateShieldField(index) {
        const cell = ui.cellContainer.children[index];
        
        // Schild aktivieren
        gameState.activeSpecialEffects.shield = parseInt(index);
        cell.classList.add('shield-active');
        
        // Position für Partikeleffekt ermitteln
        const rect = cell.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Schildeffekt auslösen
        triggerShieldEffect(x, y);
        
        // Statustext aktualisieren
        ui.statusText.innerHTML = `Schildfeld aktiviert! Schützt vor dem nächsten Angriff.`;
        ui.statusText.classList.add('updated');
        setTimeout(() => {
            ui.statusText.classList.remove('updated');
        }, 500);
        
        // Indikator für Schildeffekt anzeigen
        showSpecialEffectIndicator('shield', 'Schild aktiviert!');
        
        // Nach kurzer Verzögerung Indikator entfernen
        setTimeout(() => {
            removeSpecialEffectIndicator();
        }, 2000);
    }
    
    // Funktion zum Aktivieren eines Tauschfelds
    function activateSwapField(index) {
        const cell = ui.cellContainer.children[index];
        
        // Tausch-Modus aktivieren
        gameState.activeSpecialEffects.swapMode = true;
        gameState.activeSpecialEffects.swapFirstCell = parseInt(index);
        cell.classList.add('swap-active');
        
        // Position für Partikeleffekt ermitteln
        const rect = cell.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Tauscheffekt auslösen
        triggerSwapEffect(x, y);
        
        // Statustext aktualisieren
        ui.statusText.innerHTML = `Tauschfeld aktiviert! Wähle ein zweites Feld zum Tauschen.`;
        ui.statusText.classList.add('updated');
        setTimeout(() => {
            ui.statusText.classList.remove('updated');
        }, 500);
        
        // Indikator für Tauscheffekt anzeigen
        showSpecialEffectIndicator('swap', 'Wähle ein Feld zum Tauschen!');
        
        // Markiere mögliche Tauschziele
        const cells = ui.cellContainer.querySelectorAll('.cell');
        cells.forEach((otherCell, otherIndex) => {
            if (otherIndex !== index && gameState.board[otherIndex] !== "") {
                otherCell.classList.add('swap-target');
            }
        });
    }
    
    // Funktion zum Durchführen eines Tauschs
    function performSwap(index1, index2) {
        index1 = parseInt(index1);
        index2 = parseInt(index2);
        
        // Symbole tauschen
        const temp = gameState.board[index1];
        gameState.board[index1] = gameState.board[index2];
        gameState.board[index2] = temp;
        
        // UI aktualisieren
        const cell1 = ui.cellContainer.children[index1];
        const cell2 = ui.cellContainer.children[index2];
        
        cell1.textContent = gameState.board[index1];
        cell2.textContent = gameState.board[index2];
        
        // Klassen aktualisieren
        cell1.classList.remove('x-symbol', 'o-symbol');
        cell2.classList.remove('x-symbol', 'o-symbol');
        
        if (gameState.board[index1] === 'X') {
            cell1.classList.add('x-symbol');
        } else if (gameState.board[index1] === 'O') {
            cell1.classList.add('o-symbol');
        }
        
        if (gameState.board[index2] === 'X') {
            cell2.classList.add('x-symbol');
        } else if (gameState.board[index2] === 'O') {
            cell2.classList.add('o-symbol');
        }
        
        // Tausch-Animation
        cell1.classList.add('swap-active');
        cell2.classList.add('swap-active');
        
        // Position für Partikeleffekte ermitteln
        const rect1 = cell1.getBoundingClientRect();
        const x1 = rect1.left + rect1.width / 2;
        const y1 = rect1.top + rect1.height / 2;
        
        const rect2 = cell2.getBoundingClientRect();
        const x2 = rect2.left + rect2.width / 2;
        const y2 = rect2.top + rect2.height / 2;
        
        // Tauscheffekte auslösen
        triggerSwapEffect(x1, y1);
        triggerSwapEffect(x2, y2);
        
        // Statustext aktualisieren
        ui.statusText.innerHTML = `Symbole getauscht!`;
        ui.statusText.classList.add('updated');
        setTimeout(() => {
            ui.statusText.classList.remove('updated');
        }, 500);
        
        // Entferne Tauschziel-Markierungen
        const cells = ui.cellContainer.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('swap-target');
        });
        
        // Nach kurzer Verzögerung Tausch-Modus zurücksetzen
        setTimeout(() => {
            cell1.classList.remove('swap-active');
            cell2.classList.remove('swap-active');
            gameState.activeSpecialEffects.swapMode = false;
            gameState.activeSpecialEffects.swapFirstCell = null;
            
            // Indikator entfernen
            removeSpecialEffectIndicator();
            
            // Prüfen, ob der Tausch zu einem Gewinn geführt hat
            checkGameStateAfterSpecialEffect();
            
            // Fortfahren mit dem Spiel
            checkForExtraMoveAndContinue(index1);
        }, delays.animationDelay);
    }
    
    // Funktion zum Aktivieren eines Jokerfelds
    function activateWildField(index) {
        const cell = ui.cellContainer.children[index];
        
        // Joker-Animation
        cell.classList.add('wild-active');
        
        // Position für Partikeleffekt ermitteln
        const rect = cell.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Jokereffekt auslösen
        triggerWildEffect(x, y);
        
        // Statustext aktualisieren
        ui.statusText.innerHTML = `Jokerfeld aktiviert! Zählt für beide Symbole.`;
        ui.statusText.classList.add('updated');
        setTimeout(() => {
            ui.statusText.classList.remove('updated');
        }, 500);
        
        // Indikator für Jokereffekt anzeigen
        showSpecialEffectIndicator('wild', 'Jokerfeld aktiviert!');
        
        // Nach kurzer Verzögerung Indikator entfernen
        setTimeout(() => {
            removeSpecialEffectIndicator();
            cell.classList.remove('wild-active');
            
            // Prüfen, ob das Jokerfeld zu einem Gewinn geführt hat
            checkGameStateAfterSpecialEffect();
        }, 2000);
    }
    
    // Funktion zum Aktivieren eines Kreuzfelds
    function activateCrossField(index, symbol) {
        const cell = ui.cellContainer.children[index];
        
        // Kreuz-Animation
        cell.classList.add('cross-active');
        
        // Position für Partikeleffekt ermitteln
        const rect = cell.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Kreuzeffekt auslösen
        triggerParticleEffect(x, y, ["#ff9800", "#ffcc80"], 70, 10);
        
        // Statustext aktualisieren
        ui.statusText.innerHTML = `Kreuzfeld aktiviert! Setzt Symbole in benachbarten horizontalen und vertikalen Zellen.`;
        ui.statusText.classList.add('updated');
        setTimeout(() => {
            ui.statusText.classList.remove('updated');
        }, 500);
        
        // Indikator für Kreuzeffekt anzeigen
        showSpecialEffectIndicator('cross', 'Kreuzfeld aktiviert!');
        
        // Setze das Symbol auf das ausgewählte Feld
        gameState.board[index] = symbol;
        
        const row = Math.floor(index / gameState.boardSize);
        const col = index % gameState.boardSize;
        
        // Nur die direkt benachbarten Zellen in horizontaler und vertikaler Richtung markieren
        const cellsToMark = [];
        
        // Zelle oben
        if (row > 0) {
            cellsToMark.push((row - 1) * gameState.boardSize + col);
        }
        
        // Zelle unten
        if (row < gameState.boardSize - 1) {
            cellsToMark.push((row + 1) * gameState.boardSize + col);
        }
        
        // Zelle links
        if (col > 0) {
            cellsToMark.push(row * gameState.boardSize + (col - 1));
        }
        
        // Zelle rechts
        if (col < gameState.boardSize - 1) {
            cellsToMark.push(row * gameState.boardSize + (col + 1));
        }
        
        // Markiere die ausgewählten Zellen, wenn sie leer sind und keine Spezialzellen
        let animationDelay = 0;
        cellsToMark.forEach((cellIndex, i) => {
            // Prüfe, ob die Zelle leer ist und keine Spezialzelle
            if (gameState.board[cellIndex] === '' && !isAnySpecialField(cellIndex)) {
                gameState.board[cellIndex] = symbol;
                
                // Animiere das Setzen des Symbols mit Verzögerung
                setTimeout(() => {
                    const targetCell = ui.cellContainer.children[cellIndex];
                    if (targetCell) {
                        targetCell.textContent = symbol;
                        targetCell.classList.add('cross-effect');
                        
                        // Farbklasse basierend auf Symbol hinzufügen
                        if (symbol === 'X') {
                            targetCell.classList.add('x-symbol');
                        } else {
                            targetCell.classList.add('o-symbol');
                        }
                        
                        setTimeout(() => {
                            targetCell.classList.remove('cross-effect');
                        }, 500);
                    }
                }, 200 * (i + 1));
                
                animationDelay = Math.max(animationDelay, 200 * (i + 1) + 500);
            }
        });
        
        // Nach kurzer Verzögerung Indikator entfernen
        setTimeout(() => {
            removeSpecialEffectIndicator();
            cell.classList.remove('cross-active');
            
            // Prüfen, ob das Kreuzfeld zu einem Gewinn geführt hat
            checkGameStateAfterSpecialEffect();
        }, animationDelay + 200);
    }
    
    // Funktion zum Aktivieren eines Diagonalfelds
    function activateDiagonalField(index, symbol) {
        const cell = ui.cellContainer.children[index];
        
        // Diagonal-Animation
        cell.classList.add('diagonal-active');
        
        // Position für Partikeleffekt ermitteln
        const rect = cell.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Diagonaleffekt auslösen
        triggerParticleEffect(x, y, ["#795548", "#a1887f"], 70, 10);
        
        // Statustext aktualisieren
        ui.statusText.innerHTML = `Diagonalfeld aktiviert! Setzt Symbole in benachbarten diagonalen Zellen.`;
        ui.statusText.classList.add('updated');
        setTimeout(() => {
            ui.statusText.classList.remove('updated');
        }, 500);
        
        // Indikator für Diagonaleffekt anzeigen
        showSpecialEffectIndicator('diagonal', 'Diagonalfeld aktiviert!');
        
        // Setze das Symbol auf das ausgewählte Feld
        gameState.board[index] = symbol;
        
        const row = Math.floor(index / gameState.boardSize);
        const col = index % gameState.boardSize;
        
        // Nur die direkt benachbarten Zellen in diagonaler Richtung markieren
        const cellsToMark = [];
        
        // Diagonal oben links
        if (row > 0 && col > 0) {
            cellsToMark.push((row - 1) * gameState.boardSize + (col - 1));
        }
        
        // Diagonal oben rechts
        if (row > 0 && col < gameState.boardSize - 1) {
            cellsToMark.push((row - 1) * gameState.boardSize + (col + 1));
        }
        
        // Diagonal unten links
        if (row < gameState.boardSize - 1 && col > 0) {
            cellsToMark.push((row + 1) * gameState.boardSize + (col - 1));
        }
        
        // Diagonal unten rechts
        if (row < gameState.boardSize - 1 && col < gameState.boardSize - 1) {
            cellsToMark.push((row + 1) * gameState.boardSize + (col + 1));
        }
        
        // Markiere die ausgewählten Zellen, wenn sie leer sind und keine Spezialzellen
        let animationDelay = 0;
        cellsToMark.forEach((cellIndex, i) => {
            // Prüfe, ob die Zelle leer ist und keine Spezialzelle
            if (gameState.board[cellIndex] === '' && !isAnySpecialField(cellIndex)) {
                gameState.board[cellIndex] = symbol;
                
                // Animiere das Setzen des Symbols mit Verzögerung
                setTimeout(() => {
                    const targetCell = ui.cellContainer.children[cellIndex];
                    if (targetCell) {
                        targetCell.textContent = symbol;
                        targetCell.classList.add('diagonal-effect');
                        
                        // Farbklasse basierend auf Symbol hinzufügen
                        if (symbol === 'X') {
                            targetCell.classList.add('x-symbol');
                        } else {
                            targetCell.classList.add('o-symbol');
                        }
                        
                        setTimeout(() => {
                            targetCell.classList.remove('diagonal-effect');
                        }, 500);
                    }
                }, 200 * (i + 1));
                
                animationDelay = Math.max(animationDelay, 200 * (i + 1) + 500);
            }
        });
        
        // Nach kurzer Verzögerung Indikator entfernen
        setTimeout(() => {
            removeSpecialEffectIndicator();
            cell.classList.remove('diagonal-active');
            
            // Prüfen, ob das Diagonalfeld zu einem Gewinn geführt hat
            checkGameStateAfterSpecialEffect();
        }, animationDelay + 200);
    }
    
    // Hilfsfunktion zum Überprüfen, ob eine Zelle ein beliebiges Spezialfeld ist
    function isAnySpecialField(index) {
        return isCornerCell(index) || 
               isSpecialFieldType(index, 'bomb') || 
               isSpecialFieldType(index, 'shield') || 
               isSpecialFieldType(index, 'swap') || 
               isSpecialFieldType(index, 'wild') || 
               isSpecialFieldType(index, 'cross') || 
               isSpecialFieldType(index, 'diagonal');
    }
    
    // Funktion zum Anzeigen eines Indikators für spezielle Effekte
    function showSpecialEffectIndicator(type, text) {
        // Vorhandenen Indikator entfernen
        removeSpecialEffectIndicator();
        
        // Neuen Indikator erstellen
        const indicator = document.createElement('div');
        indicator.className = `special-effect-indicator ${type}-indicator`;
        indicator.textContent = text;
        ui.gameContainer.appendChild(indicator);
    }
    
    // Funktion zum Entfernen des Indikators für spezielle Effekte
    function removeSpecialEffectIndicator() {
        const indicator = document.querySelector('.special-effect-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    // Funktion zum Ermitteln benachbarter Zellen
    function getNeighborCells(index) {
        index = parseInt(index);
        const size = gameState.boardSize;
        const row = Math.floor(index / size);
        const col = index % size;
        const neighbors = [];
        
        // Oben
        if (row > 0) {
            neighbors.push(index - size);
        }
        
        // Unten
        if (row < size - 1) {
            neighbors.push(index + size);
        }
        
        // Links
        if (col > 0) {
            neighbors.push(index - 1);
        }
        
        // Rechts
        if (col < size - 1) {
            neighbors.push(index + 1);
        }
        
        // Diagonal oben links
        if (row > 0 && col > 0) {
            neighbors.push(index - size - 1);
        }
        
        // Diagonal oben rechts
        if (row > 0 && col < size - 1) {
            neighbors.push(index - size + 1);
        }
        
        // Diagonal unten links
        if (row < size - 1 && col > 0) {
            neighbors.push(index + size - 1);
        }
        
        // Diagonal unten rechts
        if (row < size - 1 && col < size - 1) {
            neighbors.push(index + size + 1);
        }
        
        return neighbors;
    }
    
    // Funktion zum Überprüfen des Spielzustands nach einem speziellen Effekt
    function checkGameStateAfterSpecialEffect() {
        // Prüfe auf Gewinner
        const result = checkWinner();
        if (result !== "") {
            if (result === "Tie") {
                ui.statusText.innerHTML = `Unentschieden!`;
                ui.statusText.classList.add('updated');
                setTimeout(() => {
                    ui.statusText.classList.remove('updated');
                }, 500);
                
                // Spielerpunkte aktualisieren
                gameState.scores.ties++;
            } else {
                changeWinnerBlockColor(gameState.combinationArray);
                
                if (result === gameState.playerSymbol) {
                    ui.statusText.innerHTML = `${gameState.player1Name} gewinnt!`;
                    gameState.scores.player++;
                } else {
                    ui.statusText.innerHTML = `${gameState.player2Name} gewinnt!`;
                    gameState.scores.computer++;
                }
            }
            
            // Punkteanzeige aktualisieren
            updateScoresDisplay();
            
            // Spiel als beendet markieren
            gameState.gameRunning = true;
        }
    }
    
    // Funktion zum Zurückkehren zum Hauptmenü
    function returnToMainMenu() {
        // Spieler-Namen zurücksetzen
        if (ui.player1Input) ui.player1Input.value = "";
        if (ui.player2Input) ui.player2Input.value = "";
        if (ui.playerNamesContainer) ui.playerNamesContainer.style.display = 'none';

        // Klick-Ereignisse deaktivieren
        toggleCellClickListeners(false);

        // Zellenanzeige zurücksetzen
        const cells = ui.cellContainer.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('winner', 'symbol-placed', 'x-symbol', 'o-symbol', 'special-field',
                               'bomb-field', 'shield-field', 'swap-field', 'wild-field', 'cross-field', 'diagonal-field',
                               'bomb-active', 'shield-active', 'swap-active', 'wild-active', 'cross-active', 'diagonal-active', 'swap-target');
        });
        
        // Extrazug-Indikator entfernen, falls vorhanden
        const extraMoveIndicator = document.querySelector('.extra-move-indicator');
        if (extraMoveIndicator) {
            extraMoveIndicator.remove();
        }
        
        // Spezialeffekt-Indikator entfernen, falls vorhanden
        removeSpecialEffectIndicator();
        
        // Spielzustand zurücksetzen
        gameState.result = "";
        gameState.board = [];
        gameState.gameRunning = false;
        gameState.activeSpecialEffects.extraTurn = false;
        gameState.activeSpecialEffects.shield = null;
        gameState.activeSpecialEffects.swapMode = false;
        gameState.activeSpecialEffects.swapFirstCell = null;
        
        // UI-Ansicht wechseln
        ui.gameContainer.style.display = 'none';
        ui.modeContainer.style.display = 'block';
        
        // Buttons zurücksetzen
        ui.playButtons.forEach(btn => btn.classList.remove('active'));
        ui.difficultyButtons.forEach(btn => btn.classList.remove('active'));
        ui.symbolButtons.forEach(btn => btn.classList.remove('active'));
        ui.boardSizeButtons.forEach(btn => btn.classList.remove('active'));
        
        // Standardwerte setzen
        document.getElementById('computer').classList.add('active');
        document.getElementById('middle').classList.add('active');
        document.getElementById('size-3').classList.add('active');
        document.querySelector('.symbol-button').classList.add('active');
        
        // Toggles zurücksetzen
        if (ui.specialFieldsToggle) ui.specialFieldsToggle.checked = false;
        if (ui.bombFieldsToggle) ui.bombFieldsToggle.checked = false;
        if (ui.shieldFieldsToggle) ui.shieldFieldsToggle.checked = false;
        if (ui.swapFieldsToggle) ui.swapFieldsToggle.checked = false;
        if (ui.wildFieldsToggle) ui.wildFieldsToggle.checked = false;
        if (ui.crossFieldsToggle) ui.crossFieldsToggle.checked = false;
        if (ui.diagonalFieldsToggle) ui.diagonalFieldsToggle.checked = false;
        if (ui.comebackToggle) ui.comebackToggle.checked = true;
        
        // Spezielle Felder Optionen ausblenden
        const specialFieldsOptions = document.querySelector('.special-fields-options');
        if (specialFieldsOptions) {
            specialFieldsOptions.style.display = 'none';
        }
        
        // Punkte zurücksetzen und ausblenden beim Zurück zum Hauptmenü
        resetScores();
        ui.scoresText.style.display = 'none';
    }
    
    // Funktion zum Überprüfen des Gewinners
    function checkWinner() {
        // Prüfe auf Gewinner für beide Spieler
        if (checkWinnerForPlayer('X')) return 'X';
        if (checkWinnerForPlayer('O')) return 'O';
        
        // Prüfe auf Unentschieden
        if (gameState.board.every(cell => cell !== "")) {
            return "Tie";
        }
        
        return ""; // Spiel läuft noch
    }
    
    // Funktion zum Überprüfen des Gewinners für einen bestimmten Spieler
    function checkWinnerForPlayer(player) {
        const size = gameState.boardSize;
        const requiredToWin = gameState.requiredToWin;
        
        // Prüfe Zeilen
        for (let row = 0; row < size; row++) {
            for (let col = 0; col <= size - requiredToWin; col++) {
                let win = true;
                let combination = [];
                
                for (let i = 0; i < requiredToWin; i++) {
                    const index = row * size + col + i;
                    // Prüfe auf normales Symbol oder Joker
                    if (gameState.board[index] !== player && 
                        !(gameState.specialFields.wildEnabled && 
                          isSpecialFieldType(index, 'wild') && 
                          gameState.board[index] !== "")) {
                        win = false;
                        break;
                    }
                    combination.push(index);
                }
                
                if (win) {
                    gameState.combinationArray = combination;
                    return true;
                }
            }
        }
        
        // Prüfe Spalten
        for (let col = 0; col < size; col++) {
            for (let row = 0; row <= size - requiredToWin; row++) {
                let win = true;
                let combination = [];
                
                for (let i = 0; i < requiredToWin; i++) {
                    const index = (row + i) * size + col;
                    // Prüfe auf normales Symbol oder Joker
                    if (gameState.board[index] !== player && 
                        !(gameState.specialFields.wildEnabled && 
                          isSpecialFieldType(index, 'wild') && 
                          gameState.board[index] !== "")) {
                        win = false;
                        break;
                    }
                    combination.push(index);
                }
                
                if (win) {
                    gameState.combinationArray = combination;
                    return true;
                }
            }
        }
        
        // Prüfe Diagonalen (von links oben nach rechts unten)
        for (let row = 0; row <= size - requiredToWin; row++) {
            for (let col = 0; col <= size - requiredToWin; col++) {
                let win = true;
                let combination = [];
                
                for (let i = 0; i < requiredToWin; i++) {
                    const index = (row + i) * size + col + i;
                    // Prüfe auf normales Symbol oder Joker
                    if (gameState.board[index] !== player && 
                        !(gameState.specialFields.wildEnabled && 
                          isSpecialFieldType(index, 'wild') && 
                          gameState.board[index] !== "")) {
                        win = false;
                        break;
                    }
                    combination.push(index);
                }
                
                if (win) {
                    gameState.combinationArray = combination;
                    return true;
                }
            }
        }
        
        // Prüfe Diagonalen (von rechts oben nach links unten)
        for (let row = 0; row <= size - requiredToWin; row++) {
            for (let col = requiredToWin - 1; col < size; col++) {
                let win = true;
                let combination = [];
                
                for (let i = 0; i < requiredToWin; i++) {
                    const index = (row + i) * size + col - i;
                    // Prüfe auf normales Symbol oder Joker
                    if (gameState.board[index] !== player && 
                        !(gameState.specialFields.wildEnabled && 
                          isSpecialFieldType(index, 'wild') && 
                          gameState.board[index] !== "")) {
                        win = false;
                        break;
                    }
                    combination.push(index);
                }
                
                if (win) {
                    gameState.combinationArray = combination;
                    return true;
                }
            }
        }
        
        return false;
    }
    
    // Funktion für einen zufälligen Zug
    function getRandomMove() {
        let availableMoves = [];
        for (let i = 0; i < gameState.board.length; i++) {
            if (gameState.board[i] === "") {
                availableMoves.push(i);
            }
        }

        if (availableMoves.length > 0) {
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        } else {
            console.error("No available moves.");
            return -1;
        }
    }
    
    // Funktion für den Zug des mittelschweren Bots
    function mediumBotPlay() {
        if (Math.random() < 0.25) {
            return getRandomMove();
        } else {
            return bestMove();
        }
    }
    
    // Funktion für den besten Zug des Computers
    function bestMove() {
        // Für größere Spielfelder (5x5, 7x7) verwenden wir eine vereinfachte Strategie
        if (gameState.boardSize > 3) {
            return improvedMove();
        }
        
        // Für 3x3 verwenden wir den Minimax-Algorithmus
        let bestScore = -Infinity;
        let move;

        let score;
        for (let i = 0; i < gameState.board.length; i++) {
            if (gameState.board[i] === "") {
                gameState.board[i] = gameState.computerSymbol;
                score = minimax(gameState.board, false);
                gameState.board[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }

        if (move !== undefined) {
            return move;
        } else {
            console.error("No best move found.");
            return -1;
        }
    }
    
    // Verbesserte Strategie für größere Spielfelder
    function improvedMove() {
        // 1. Prüfe, ob der Computer gewinnen kann
        const winMove = findWinningMove(gameState.computerSymbol);
        if (winMove !== -1) return winMove;
        
        // 2. Prüfe, ob der Spieler gewinnen kann und blockiere
        const blockMove = findWinningMove(gameState.playerSymbol);
        if (blockMove !== -1) return blockMove;
        
        // 3. Bevorzuge Eckfelder, wenn spezielle Felder aktiviert sind
        if (gameState.specialFields.enabled) {
            const cornerMove = findEmptyCorner();
            if (cornerMove !== -1) return cornerMove;
        }
        
        // 4. Bevorzuge spezielle Feldtypen, wenn aktiviert
        if (gameState.specialFields.bombEnabled || gameState.specialFields.shieldEnabled || 
            gameState.specialFields.swapEnabled || gameState.specialFields.wildEnabled ||
            gameState.specialFields.crossEnabled || gameState.specialFields.diagonalEnabled) {
            const specialMove = findEmptySpecialField();
            if (specialMove !== -1) return specialMove;
        }
        
        // 5. Bevorzuge das Zentrum
        const center = findCenter();
        if (center !== -1) return center;
        
        // 6. Bevorzuge Felder, die eine Reihe bilden könnten
        const strategicMove = findStrategicMove();
        if (strategicMove !== -1) return strategicMove;
        
        // 7. Zufälliger Zug als Fallback
        return getRandomMove();
    }
    
    // Funktion zum Finden eines leeren speziellen Felds
    function findEmptySpecialField() {
        // Priorität: Kreuz > Diagonal > Schild > Bombe > Joker > Tausch
        if (gameState.specialFields.crossEnabled) {
            for (const cellIndex of gameState.specialFields.crossFields) {
                if (gameState.board[cellIndex] === "") {
                    return cellIndex;
                }
            }
        }
        
        if (gameState.specialFields.diagonalEnabled) {
            for (const cellIndex of gameState.specialFields.diagonalFields) {
                if (gameState.board[cellIndex] === "") {
                    return cellIndex;
                }
            }
        }
        
        if (gameState.specialFields.shieldEnabled) {
            for (const cellIndex of gameState.specialFields.shieldFields) {
                if (gameState.board[cellIndex] === "") {
                    return cellIndex;
                }
            }
        }
        
        if (gameState.specialFields.bombEnabled) {
            for (const cellIndex of gameState.specialFields.bombFields) {
                if (gameState.board[cellIndex] === "") {
                    return cellIndex;
                }
            }
        }
        
        if (gameState.specialFields.wildEnabled) {
            for (const cellIndex of gameState.specialFields.wildFields) {
                if (gameState.board[cellIndex] === "") {
                    return cellIndex;
                }
            }
        }
        
        if (gameState.specialFields.swapEnabled) {
            for (const cellIndex of gameState.specialFields.swapFields) {
                if (gameState.board[cellIndex] === "") {
                    return cellIndex;
                }
            }
        }
        
        return -1;
    }
    
    // Funktion zum Finden eines Zuges, der zum Sieg führt
    function findWinningMove(player) {
        for (let i = 0; i < gameState.board.length; i++) {
            if (gameState.board[i] === "") {
                gameState.board[i] = player;
                if (checkWinnerForPlayer(player)) {
                    gameState.board[i] = "";
                    return i;
                }
                gameState.board[i] = "";
            }
        }
        return -1;
    }
    
    // Funktion zum Finden einer leeren Ecke
    function findEmptyCorner() {
        for (const corner of gameState.specialFields.cornerFields) {
            if (gameState.board[corner] === "") {
                return corner;
            }
        }
        
        return -1;
    }
    
    // Funktion zum Finden des Zentrums
    function findCenter() {
        const center = Math.floor(gameState.board.length / 2);
        if (gameState.board[center] === "") {
            return center;
        }
        return -1;
    }
    
    // Funktion zum Finden eines strategischen Zuges
    function findStrategicMove() {
        // Bewerte jedes leere Feld
        let bestScore = -1;
        let bestMove = -1;
        
        for (let i = 0; i < gameState.board.length; i++) {
            if (gameState.board[i] === "") {
                let score = evaluateMove(i);
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        return bestMove;
    }
    
    // Funktion zum Bewerten eines Zuges
    function evaluateMove(index) {
        let score = 0;
        const size = gameState.boardSize;
        const row = Math.floor(index / size);
        const col = index % size;
        
        // Prüfe Zeile
        let rowCount = 0;
        for (let c = 0; c < size; c++) {
            const idx = row * size + c;
            if (gameState.board[idx] === gameState.computerSymbol) rowCount++;
            else if (gameState.board[idx] === gameState.playerSymbol) rowCount--;
        }
        score += rowCount;
        
        // Prüfe Spalte
        let colCount = 0;
        for (let r = 0; r < size; r++) {
            const idx = r * size + col;
            if (gameState.board[idx] === gameState.computerSymbol) colCount++;
            else if (gameState.board[idx] === gameState.playerSymbol) colCount--;
        }
        score += colCount;
        
        // Prüfe Diagonalen
        if (row === col) {
            let diagCount = 0;
            for (let i = 0; i < size; i++) {
                const idx = i * size + i;
                if (gameState.board[idx] === gameState.computerSymbol) diagCount++;
                else if (gameState.board[idx] === gameState.playerSymbol) diagCount--;
            }
            score += diagCount;
        }
        
        if (row + col === size - 1) {
            let diagCount = 0;
            for (let i = 0; i < size; i++) {
                const idx = i * size + (size - 1 - i);
                if (gameState.board[idx] === gameState.computerSymbol) diagCount++;
                else if (gameState.board[idx] === gameState.playerSymbol) diagCount--;
            }
            score += diagCount;
        }
        
        return score;
    }
    
    // Minimax-Algorithmus für den Computerzug (nur für 3x3)
    function minimax(board, isMaximizing) {
        let scoreValues = {
            X: gameState.playerSymbol === 'X' ? -1 : 1,
            O: gameState.playerSymbol === 'O' ? -1 : 1,
            Tie: 0,
        };
        
        // Prüfe auf Spielende
        const result = checkWinner();
        if (result !== "") {
            return scoreValues[result];
        }
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    board[i] = gameState.computerSymbol;
                    let score = minimax(board, false);
                    board[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    board[i] = gameState.playerSymbol;
                    let score = minimax(board, true);
                    board[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
    
    // Klick-Ereignis für Zellen
    function handleCellClick(e) {
        const index = parseInt(e.target.dataset.index);
        
        // Wenn Tausch-Modus aktiv ist und ein zweites Feld ausgewählt wird
        if (gameState.activeSpecialEffects.swapMode && gameState.activeSpecialEffects.swapFirstCell !== null) {
            // Prüfe, ob das Feld belegt ist (nur belegte Felder können getauscht werden)
            if (gameState.board[index] !== "" && index !== gameState.activeSpecialEffects.swapFirstCell) {
                performSwap(gameState.activeSpecialEffects.swapFirstCell, index);
            }
            return;
        }
        
        // Normaler Spielzug
        if (gameState.board[index] === '' && !gameState.gameRunning) {
            // Deaktiviere Klick-Ereignisse während des Zuges
            toggleCellClickListeners(false);
            
            // Symbol setzen
            const cell = e.target;
            const currentSymbol = gameState.playMode === 'computer' ? 
                                 gameState.playerSymbol : 
                                 gameState.currentPlayer;
            
            cell.textContent = currentSymbol;
            gameState.board[index] = currentSymbol;
            
            // Farbklasse basierend auf Symbol hinzufügen
            if (currentSymbol === 'X') {
                cell.classList.add('x-symbol');
            } else {
                cell.classList.add('o-symbol');
            }
            
            // Animation hinzufügen
            cell.classList.add('symbol-placed');
            
            // Position für Partikeleffekt ermitteln
            const rect = cell.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            // Partikeleffekt für Spielerzug
            triggerParticleEffect(x, y, ["#ffff00", "#ff9900", "#ff0000"]);
            
            // Prüfe auf spezielle Feldtypen
            setTimeout(() => {
                handleSpecialField(index);
            }, delays.animationDelay);
        }
    }
    
    // Funktion zum Aktivieren/Deaktivieren der Klick-Ereignisse für Zellen
    function toggleCellClickListeners(enable) {
        const cells = ui.cellContainer.querySelectorAll('.cell');
        cells.forEach(cell => {
            if (enable) {
                cell.addEventListener('click', handleCellClick);
            } else {
                cell.removeEventListener('click', handleCellClick);
            }
        });
    }
    
    // Hauptspiellogik
    function mainGame() {
        // Spielsymbol aus der Auswahl übernehmen
        const activeSymbolButton = document.querySelector('.symbol-button.active');
        if (activeSymbolButton) {
            gameState.playerSymbol = activeSymbolButton.textContent;
            gameState.computerSymbol = gameState.playerSymbol === 'X' ? 'O' : 'X';
        }
        
        startGame();
    }

    // Initialisierung beim Laden der Seite
    init();

    // Öffentliche API - nur die Funktionen, die von außen zugänglich sein sollen
    return {
        init,
        resetGame,
        returnToMainMenu,
        showTutorial,
        showLegend
    };
})();

// Zeige das Tutorial beim ersten Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        TicTacWars.showTutorial();
    }, 500);
});
