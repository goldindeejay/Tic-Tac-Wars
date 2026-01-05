/**
 * Tic-Tac-Wars - Tutorial und Hilfe-Funktionen
 * Diese Datei enthält Funktionen für das Tutorial und die Hilfe-Funktionen
 */

document.addEventListener('DOMContentLoaded', () => {
    // Referenzen auf Tutorial-Elemente
    const tutorialContainer = document.querySelector('.tutorial-container');
    const tutorialSteps = document.querySelectorAll('.tutorial-step');
    const tutorialPrev = document.querySelector('.tutorial-prev');
    const tutorialNext = document.querySelector('.tutorial-next');
    const tutorialClose = document.querySelector('.tutorial-close');
    const tutorialDots = document.querySelector('.tutorial-dots');
    
    // Referenzen auf Legende-Elemente
    const legendContainer = document.querySelector('.legend-container');
    const legendClose = document.querySelector('.legend-close');
    const helpButton = document.querySelector('.help-button');
    
    // Aktueller Tutorial-Schritt
    let currentStep = 1;
    
    // Initialisiere Tutorial-Dots
    initTutorialDots();
    
    // Event-Listener für Tutorial-Navigation
    if (tutorialPrev) {
        tutorialPrev.addEventListener('click', () => {
            if (currentStep > 1) {
                showTutorialStep(currentStep - 1);
            }
        });
    }
    
    if (tutorialNext) {
        tutorialNext.addEventListener('click', () => {
            if (currentStep < tutorialSteps.length) {
                showTutorialStep(currentStep + 1);
            }
        });
    }
    
    if (tutorialClose) {
        tutorialClose.addEventListener('click', closeTutorial);
    }
    
    // Event-Listener für Legende
    if (legendClose) {
        legendClose.addEventListener('click', closeLegend);
    }
    
    if (helpButton) {
        helpButton.addEventListener('click', showLegend);
    }
    
    // Tastatur-Navigation für Tutorial
    document.addEventListener('keydown', (e) => {
        if (tutorialContainer && tutorialContainer.style.display === 'flex') {
            if (e.key === 'ArrowLeft' && currentStep > 1) {
                showTutorialStep(currentStep - 1);
            } else if (e.key === 'ArrowRight' && currentStep < tutorialSteps.length) {
                showTutorialStep(currentStep + 1);
            } else if (e.key === 'Escape') {
                closeTutorial();
            }
        } else if (legendContainer && legendContainer.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeLegend();
            }
        }
    });
    
    // Funktion zum Initialisieren der Tutorial-Dots
    function initTutorialDots() {
        if (!tutorialDots) return;
        
        // Leere vorhandene Dots
        tutorialDots.innerHTML = '';
        
        // Erstelle Dots für jeden Schritt
        for (let i = 0; i < tutorialSteps.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'tutorial-dot';
            if (i === 0) dot.classList.add('active');
            dot.dataset.step = i + 1;
            
            // Event-Listener für Dot-Klick
            dot.addEventListener('click', () => {
                showTutorialStep(i + 1);
            });
            
            tutorialDots.appendChild(dot);
        }
    }
    
    // Funktion zum Anzeigen eines bestimmten Tutorial-Schritts
    function showTutorialStep(step) {
        // Alle Schritte ausblenden
        tutorialSteps.forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        
        // Alle Dots zurücksetzen
        const dots = tutorialDots.querySelectorAll('.tutorial-dot');
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Aktuellen Schritt anzeigen
        const currentStepEl = document.querySelector(`.tutorial-step[data-step="${step}"]`);
        if (currentStepEl) {
            currentStepEl.classList.add('active');
        }
        
        // Aktuellen Dot markieren
        const currentDot = tutorialDots.querySelector(`.tutorial-dot[data-step="${step}"]`);
        if (currentDot) {
            currentDot.classList.add('active');
        }
        
        // Aktuellen Schritt aktualisieren
        currentStep = step;
        
        // Prev/Next-Buttons aktualisieren
        if (tutorialPrev) {
            tutorialPrev.disabled = step <= 1;
        }
        
        if (tutorialNext) {
            tutorialNext.disabled = step >= tutorialSteps.length;
        }
    }
    
    // Funktion zum Anzeigen des Tutorials
    window.showTutorial = function() {
        if (tutorialContainer) {
            tutorialContainer.style.display = 'flex';
            showTutorialStep(1);
        }
    };
    
    // Funktion zum Schließen des Tutorials
    function closeTutorial() {
        if (tutorialContainer) {
            tutorialContainer.style.display = 'none';
        }
    }
    
    // Funktion zum Anzeigen der Legende
    window.showLegend = function() {
        if (legendContainer) {
            legendContainer.style.display = 'flex';
        }
    };
    
    // Funktion zum Schließen der Legende
    function closeLegend() {
        if (legendContainer) {
            legendContainer.style.display = 'none';
        }
    }
    
    // Zeige das Tutorial beim ersten Laden der Seite
    setTimeout(() => {
        showTutorial();
    }, 500);
});
