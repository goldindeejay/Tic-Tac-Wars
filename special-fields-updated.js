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
