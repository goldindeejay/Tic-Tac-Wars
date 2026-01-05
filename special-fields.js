/**
 * Tic-Tac-Wars - Spezialfeld-Funktionen
 * Diese Datei enthält Funktionen für die Spezialfelder und deren Effekte
 */

// Spezialfeld-Funktionen werden im Hauptspiel-Objekt definiert
// Diese Datei dient als Erweiterung für die Hauptspiellogik

// Partikeleffekte für Spezialfelder
function triggerParticleEffect(x, y, colors = ["#ffffff"], particleCount = 50, size = 5) {
    tsParticles.load("tsparticles", {
        fullScreen: {
            enable: false
        },
        particles: {
            number: {
                value: particleCount
            },
            color: {
                value: colors
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: { min: 0.3, max: 0.8 }
            },
            size: {
                value: { min: 1, max: size }
            },
            move: {
                enable: true,
                speed: 3,
                direction: "none",
                random: true,
                straight: false,
                outModes: "out",
                attract: {
                    enable: false
                }
            },
            life: {
                duration: {
                    sync: false,
                    value: 2
                },
                count: 1
            }
        },
        detectRetina: true,
        emitters: {
            direction: "none",
            rate: {
                quantity: 1,
                delay: 0
            },
            size: {
                width: 0,
                height: 0
            },
            position: {
                x: x,
                y: y
            },
            life: {
                count: 1,
                duration: 0.1
            }
        }
    });
}

// Explosionseffekt für Bombenfelder
function triggerExplosionEffect(x, y) {
    tsParticles.load("tsparticles", {
        fullScreen: {
            enable: false
        },
        particles: {
            number: {
                value: 80
            },
            color: {
                value: ["#ff0000", "#ff5500", "#ffaa00", "#ffff00"]
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: { min: 0.5, max: 1 }
            },
            size: {
                value: { min: 2, max: 8 }
            },
            move: {
                enable: true,
                speed: 6,
                direction: "none",
                random: true,
                straight: false,
                outModes: "out",
                attract: {
                    enable: false
                }
            },
            life: {
                duration: {
                    sync: false,
                    value: 1.5
                },
                count: 1
            }
        },
        detectRetina: true,
        emitters: {
            direction: "none",
            rate: {
                quantity: 1,
                delay: 0
            },
            size: {
                width: 0,
                height: 0
            },
            position: {
                x: x,
                y: y
            },
            life: {
                count: 1,
                duration: 0.1
            }
        }
    });
}

// Schildeffekt für Schildfelder
function triggerShieldEffect(x, y) {
    tsParticles.load("tsparticles", {
        fullScreen: {
            enable: false
        },
        particles: {
            number: {
                value: 60
            },
            color: {
                value: ["#4361ee", "#00aaff", "#00ffff"]
            },
            shape: {
                type: "circle"
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
                random: false,
                straight: false,
                outModes: "out",
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            },
            life: {
                duration: {
                    sync: false,
                    value: 2
                },
                count: 1
            }
        },
        detectRetina: true,
        emitters: {
            direction: "none",
            rate: {
                quantity: 1,
                delay: 0
            },
            size: {
                width: 0,
                height: 0
            },
            position: {
                x: x,
                y: y
            },
            life: {
                count: 1,
                duration: 0.1
            }
        }
    });
}

// Tauscheffekt für Tauschfelder
function triggerSwapEffect(x, y) {
    tsParticles.load("tsparticles", {
        fullScreen: {
            enable: false
        },
        particles: {
            number: {
                value: 40
            },
            color: {
                value: ["#9c27b0", "#ba68c8", "#e1bee7"]
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: { min: 0.3, max: 0.8 }
            },
            size: {
                value: { min: 1, max: 5 }
            },
            move: {
                enable: true,
                speed: 4,
                direction: "none",
                random: true,
                straight: false,
                outModes: "out",
                attract: {
                    enable: false
                }
            },
            rotate: {
                value: 45,
                random: true,
                direction: "clockwise",
                animation: {
                    enable: true,
                    speed: 5,
                    sync: false
                }
            },
            life: {
                duration: {
                    sync: false,
                    value: 2
                },
                count: 1
            }
        },
        detectRetina: true,
        emitters: {
            direction: "none",
            rate: {
                quantity: 1,
                delay: 0
            },
            size: {
                width: 0,
                height: 0
            },
            position: {
                x: x,
                y: y
            },
            life: {
                count: 1,
                duration: 0.1
            }
        }
    });
}

// Jokereffekt für Jokerfelder
function triggerWildEffect(x, y) {
    tsParticles.load("tsparticles", {
        fullScreen: {
            enable: false
        },
        particles: {
            number: {
                value: 50
            },
            color: {
                value: ["#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800"]
            },
            shape: {
                type: "circle"
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
                outModes: "out",
                attract: {
                    enable: false
                }
            },
            life: {
                duration: {
                    sync: false,
                    value: 2
                },
                count: 1
            }
        },
        detectRetina: true,
        emitters: {
            direction: "none",
            rate: {
                quantity: 1,
                delay: 0
            },
            size: {
                width: 0,
                height: 0
            },
            position: {
                x: x,
                y: y
            },
            life: {
                count: 1,
                duration: 0.1
            }
        }
    });
}
