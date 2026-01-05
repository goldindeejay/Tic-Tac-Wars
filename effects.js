/**
 * Tic-Tac-Wars - Effekte und Animationen
 * Diese Datei enthält Funktionen für visuelle Effekte und Animationen
 */

// Partikeleffekte für das Spielfeld
document.addEventListener('DOMContentLoaded', () => {
    // Initialisiere tsParticles
    tsParticles.load("tsparticles", {
        fullScreen: {
            enable: false
        },
        fpsLimit: 60,
        particles: {
            number: {
                value: 0
            },
            color: {
                value: "#ffffff"
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.5
            },
            size: {
                value: 3
            },
            move: {
                enable: true,
                speed: 3,
                direction: "none",
                random: true,
                straight: false,
                outModes: "out"
            }
        },
        detectRetina: true
    });
});

// Animiere den Titel
document.addEventListener('DOMContentLoaded', () => {
    const titleLetters = document.querySelectorAll('.game-title div');
    
    // Verzögerte Animation für jeden Buchstaben
    titleLetters.forEach((letter, index) => {
        setTimeout(() => {
            letter.style.opacity = '1';
            letter.style.transform = 'translateY(0)';
        }, 100 * index);
    });
});

// Funktion zum Animieren von Elementen beim Erscheinen
function animateElement(element, animationClass, duration = 500) {
    element.classList.add(animationClass);
    setTimeout(() => {
        element.classList.remove(animationClass);
    }, duration);
}

// Funktion zum Erstellen eines Konfetti-Effekts bei Spielgewinn
function createConfettiEffect() {
    tsParticles.load("tsparticles", {
        fullScreen: {
            enable: true,
            zIndex: 1
        },
        particles: {
            number: {
                value: 0
            },
            color: {
                value: ["#00FFFC", "#FC00FF", "#fffc00"]
            },
            shape: {
                type: ["circle", "square"]
            },
            opacity: {
                value: { min: 0.3, max: 0.8 }
            },
            size: {
                value: { min: 1, max: 5 }
            },
            move: {
                enable: true,
                speed: 3,
                direction: "none",
                random: true,
                straight: false,
                outModes: "out"
            }
        },
        detectRetina: true,
        emitters: [
            {
                direction: "top-right",
                rate: {
                    delay: 0.1,
                    quantity: 10
                },
                position: {
                    x: 0,
                    y: 100
                },
                size: {
                    width: 0,
                    height: 0
                },
                life: {
                    duration: 0.3,
                    count: 1
                }
            },
            {
                direction: "top-left",
                rate: {
                    delay: 0.1,
                    quantity: 10
                },
                position: {
                    x: 100,
                    y: 100
                },
                size: {
                    width: 0,
                    height: 0
                },
                life: {
                    duration: 0.3,
                    count: 1
                }
            }
        ]
    });
    
    // Entferne den Konfetti-Effekt nach 3 Sekunden
    setTimeout(() => {
        tsParticles.load("tsparticles", {
            fullScreen: {
                enable: false
            },
            particles: {
                number: {
                    value: 0
                }
            }
        });
    }, 3000);
}

// Funktion zum Erstellen eines Pulseffekts für Elemente
function createPulseEffect(element, color = "#ff9900", duration = 1000) {
    const originalBoxShadow = element.style.boxShadow;
    const originalTransition = element.style.transition;
    
    element.style.transition = `all ${duration / 1000}s ease-in-out`;
    element.style.boxShadow = `0 0 20px ${color}`;
    
    setTimeout(() => {
        element.style.boxShadow = originalBoxShadow;
        element.style.transition = originalTransition;
    }, duration);
}

// Funktion zum Erstellen eines Shake-Effekts für Elemente
function createShakeEffect(element, duration = 500) {
    element.classList.add('shake-animation');
    
    setTimeout(() => {
        element.classList.remove('shake-animation');
    }, duration);
}

// Füge CSS für Shake-Animation hinzu
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake-animation {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake-animation {
            animation: shake-animation 0.5s;
        }
    `;
    document.head.appendChild(style);
});
