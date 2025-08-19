// ===== MOSTRAR/OCULTAR AYUDAS =====
function toggleHint(hintId) {
    const hint = document.getElementById(hintId);
    if (hint.classList.contains("show")) {
        hint.classList.remove("show");
    } else {
        // Ocultar todas las otras ayudas primero
        document.querySelectorAll(".hint-box").forEach((box) => {
            box.classList.remove("show");
        });
        hint.classList.add("show");
    }
}

function showSolution(editorId, solution) {
    document.getElementById(editorId).value = solution;
    showCelebration(
        "✨ ¡Solución mostrada! Ahora ejecútala para ver el resultado"
    );
}

function runForNumbers() {
    const output = document.getElementById("for-numbers-output");
    let result = "💰 Contando las monedas de oro:\n\n";

    for (let i = 1; i <= 10; i++) {
        result += `Moneda número ${i}: ¡BRILLANTE! ✨\n`;
    }

    result += `\n🎉 ¡Tenemos 10 monedas de oro!`;

    typeWriter(output, result, 100);
}

function runWhileExample() {
    const output = document.getElementById("while-output");
    let vidaKraken = 100;
    let disparos = 0;
    let result =
        "🦑 ¡El Kraken aparece! Vida: 100\n💣 ¡Preparar los cañones!\n\n";

    while (vidaKraken > 0) {
        disparos++;
        const daño = 25;
        vidaKraken -= daño;

        result += `💥 ¡BOOM! Disparo #${disparos}\n`;
        result += `🦑 Vida del Kraken: ${vidaKraken}\n`;

        if (vidaKraken > 0) {
            result += `😤 ¡El Kraken sigue luchando!\n\n`;
        } else {
            result += `🎉 ¡VICTORIA! ¡El Kraken ha sido derrotado!\n`;
        }
    }

    result += `\n⚔️ Batalla completada en ${disparos} disparos!`;

    typeWriter(output, result, 80);
}

function runWhileTreasure() {
    const output = document.getElementById("while-treasure-output");
    let tesoroEncontrado = false;
    let intentos = 0;
    let result = "🔍 Buscando el cofre dorado...\n\n";

    while (!tesoroEncontrado) {
        intentos++;
        result += `🕳️ Excavando en el lugar #${intentos}...\n`;

        if (intentos === 3) {
            tesoroEncontrado = true;
            result += `💎 ¡EUREKA! ¡Cofre dorado encontrado!\n`;
        } else {
            result += `🪨 Solo tierra y rocas... sigamos buscando\n\n`;
        }
    }

    result += `\n🎯 Misión completada en ${intentos} intentos!`;

    typeWriter(output, result, 120);
}

// ===== FUNCIÓN DE EFECTO TYPEWRITER =====
function typeWriter(element, text, speed) {
    element.innerHTML = "";
    let i = 0;

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Añadir efecto de completado
            element.style.border = "2px solid #2ecc71";
            setTimeout(() => {
                element.style.border = "2px solid #2ecc71";
            }, 2000);
        }
    }

    type();
}

// ===== FUNCIÓN PARA MOSTRAR CELEBRACIONES =====
function showCelebration(message) {
    const celebration = document.createElement("div");
    celebration.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(45deg, #f1c40f, #e67e22);
          color: #2c3e50;
          padding: 30px 40px;
          border-radius: 20px;
          font-size: 1.5rem;
          font-weight: bold;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          z-index: 2000;
          animation: celebration 2s ease-in-out;
          max-width: 400px;
      `;
    celebration.innerHTML = message;
    document.body.appendChild(celebration);

    setTimeout(() => {
        celebration.remove();
    }, 2000);
}

// ===== INICIALIZACIÓN Y EFECTOS =====
document.addEventListener("DOMContentLoaded", function () {
    // Efecto de ondas en los botones
    const buttons = document.querySelectorAll(".btn, .editor-btn, .help-btn");
    buttons.forEach((button) => {
        button.addEventListener("click", function (e) {
            let ripple = document.createElement("span");
            ripple.style.position = "absolute";
            ripple.style.borderRadius = "50%";
            ripple.style.background = "rgba(255, 255, 255, 0.6)";
            ripple.style.transform = "scale(0)";
            ripple.style.animation = "ripple 0.6s linear";
            ripple.style.left = e.offsetX + "px";
            ripple.style.top = e.offsetY + "px";
            ripple.style.pointerEvents = "none";

            this.style.position = "relative";
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Mensaje de bienvenida
    setTimeout(() => {
        const welcome = document.createElement("div");
        welcome.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              background: rgba(255, 215, 0, 0.9);
              color: #2c3e50;
              padding: 15px 25px;
              border-radius: 15px;
              font-weight: bold;
              box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
              z-index: 1000;
              animation: slideIn 0.5s ease-out;
              max-width: 300px;
          `;
        welcome.innerHTML =
            "🏴‍☠️ ¡Bienvenido a bordo, marinero! Recuerda: ¡la indentación es clave en Python!";
        document.body.appendChild(welcome);

        setTimeout(() => {
            welcome.style.animation = "slideOut 0.5s ease-in forwards";
            setTimeout(() => welcome.remove(), 500);
        }, 5000);
    }, 1000);

    // Efectos de scroll suaves para las secciones
    const sections = document.querySelectorAll(".lesson-section");
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }
            });
        },
        {
            threshold: 0.1,
        }
    );

    sections.forEach((section) => {
        section.style.opacity = "0";
        section.style.transform = "translateY(50px)";
        section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(section);
    });
});


// ===== ATAJOS DE TECLADO =====
document.addEventListener("keydown", function (e) {
    // Ctrl/Cmd + Enter para ejecutar código
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains("code-textarea")) {
            e.preventDefault();
            const editorId = activeElement.id;
            let outputId;

            // Determinar el ID de salida basado en el editor
            if (editorId === "editor1") outputId = "output1";
            else if (editorId === "editor2") outputId = "output2";
            else if (editorId === "editor3") outputId = "output3";
            else if (editorId === "challenge1") outputId = "challenge1-output";
            else if (editorId === "challenge2") outputId = "challenge2-output";
            else if (editorId === "challenge3") outputId = "challenge3-output";

            if (outputId) {
                runPythonCode(editorId, outputId);
            }
        }
    }
});

// Registra desafíos nuevos si no estaban definidos
function registrarDesafio(idEditor, idSalida) {
    const ejecutarBtn = document.querySelector(
        `[onclick*="runPythonCode('${idEditor}'"]`
    );
    const limpiarBtn = document.querySelector(
        `[onclick*="clearEditor('${idEditor}'"]`
    );
    if (ejecutarBtn)
        ejecutarBtn.onclick = () => runPythonCode(idEditor, idSalida);
    if (limpiarBtn) limpiarBtn.onclick = () => clearEditor(idEditor, idSalida);
}

// Inicializa soporte para los desafíos
function inicializarDesafios() {
    registrarDesafio("challengeEditor1", "challengeOutput1");
    registrarDesafio("challengeEditor2", "challengeOutput2");
    registrarDesafio("challengeEditor3", "challengeOutput3");
}

// Llamar a esta función al cargar la página o cuando se rendericen los desafíos
window.addEventListener("DOMContentLoaded", () => {
    if (typeof inicializarDesafios === "function") {
        inicializarDesafios();
    }
});

// ===== SISTEMA DE PESTAÑAS =====

// Lista de tabs que se deben visitar
const requiredTabs = ["for-tab", "while-tab", "comparison-tab", "challenges-tab"];
let visitedTabs = new Set();

function showTab(tabId, el) {
    // Ocultar todos los contenidos
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.remove("active");
        tab.style.display = "none";
    });

    // Desactivar todos los botones
    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active");
    });

    // Mostrar el contenido seleccionado
    const currentTab = document.getElementById(tabId);
    if (currentTab) {
        currentTab.classList.add("active");
        currentTab.style.display = "block";
    }

    // Activar el botón clickeado
    if (el) {
        el.classList.add("active");
    }

    // Marcar como visitado
    visitedTabs.add(tabId);

    // Si ya visitó todos, mostrar "Felicidades"
    if (requiredTabs.every(t => visitedTabs.has(t))) {
        const felicidades = document.getElementById("final-felicidades");
        if (felicidades) {
            felicidades.style.display = "block";
            felicidades.style.animation = "fadeIn 1s ease";
        }
    }
}
