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

// ===== SOLUCIONES DE LOS DESAFÍOS =====
const solution1 = `tripulacion = ['Jack', 'Anne', 'Barbanegra', 'Mary']

for pirata in tripulacion:
    print(f'¡Ahoy, {pirata}!')`;

const solution2 = `numero = 1

while numero <= 5:
    print(f'🦜 ¡{numero}!')
    numero += 1

print('🦜 ¡ALTO! Ya no puedo contar más')`;

const solution3 = `import random

resultado = 0
lanzamientos = 0

print('🎲 ¡Comenzando el juego!')
print('🎯 Objetivo: ¡Sacar un 6!')

while resultado != 6:
    lanzamientos += 1
    resultado = random.randint(1, 6)
    print(f'🎲 Lanzamiento #{lanzamientos}: ¡Salió un {resultado}!')
    
    if resultado != 6:
        print('🏴‍☠️ ¡Sigue intentando!')

print(f'🎉 ¡ÉXITO! Lo lograste en {lanzamientos} intentos')`;

function showSolution(editorId, solution) {
  document.getElementById(editorId).value = solution;
  showCelebration(
    "✨ ¡Solución mostrada! Ahora ejecútala para ver el resultado"
  );
}

// ===== SISTEMA DE PESTAÑAS =====
function showTab(tabId) {
  // Ocultar todos los contenidos
  const contents = document.querySelectorAll(".tab-content");
  contents.forEach((content) => content.classList.remove("active"));

  // Desactivar todos los tabs
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => tab.classList.remove("active"));

  // Mostrar el contenido seleccionado
  document.getElementById(tabId).classList.add("active");

  // Activar el tab correspondiente
  event.target.classList.add("active");
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

  // Inicializar editores con contenido predeterminado
  setTimeout(() => {
    const editor1 = document.getElementById("editor1");
    const editor2 = document.getElementById("editor2");
    const editor3 = document.getElementById("editor3");
    const challenge1 = document.getElementById("challenge1");
    const challenge2 = document.getElementById("challenge2");
    const challenge3 = document.getElementById("challenge3");

    if (editor1 && !editor1.value.trim()) {
      editor1.value = `# 🏴‍☠️ ¡Escribe tu código aquí!
# Ejemplo: crear una lista de tesoros
tesoros = ['Monedas de oro', 'Perlas', 'Rubíes', 'Diamantes']
for tesoro in tesoros:
    print(f'💎 Encontramos: {tesoro}')`;
    }

    if (editor2 && !editor2.value.trim()) {
      editor2.value = `# 🔢 Experimenta con números
for numero in range(1, 6):
    print(f'🏴‍☠️ Pirata número {numero}')
    
# Prueba otros rangos:
# range(0, 10, 2) para números pares
# range(10, 0, -1) para contar hacia atrás`;
    }

    if (editor3 && !editor3.value.trim()) {
      editor3.value = `# ⚔️ Bucle WHILE - ¡Cuidado con los infinitos!
contador = 1
while contador <= 5:
    print(f'⚔️ Contador: {contador}')
    contador += 1  # ¡MUY IMPORTANTE!

print('🎉 ¡Contador completado!')`;
    }

    // Inicializar desafíos con código incompleto
    if (challenge1 && !challenge1.value.trim()) {
      challenge1.value = `tripulacion = ['Jack', 'Anne', 'Barbanegra', 'Mary']

# ¿Puedes completar este código?
for _____ in _____:
    print(f'¡Ahoy, _____!')`;
    }

    if (challenge2 && !challenge2.value.trim()) {
      challenge2.value = `numero = 1

# El loro cuenta hasta 5
while _____ <= _____:
    print(f'🦜 ¡{numero}!')
    _____ += _____

print('🦜 ¡ALTO! Ya no puedo contar más')`;
    }

    if (challenge3 && !challenge3.value.trim()) {
      challenge3.value = `import random

# ¡Programa tu juego de dados aquí!
# Pista: usa random.randint(1, 6) para simular un dado

resultado = 0  # Inicializar
lanzamientos = 0

print('🎲 ¡Comenzando el juego!')
# Tu código aquí...`;
    }
  }, 500);
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
// script.js (fragmento agregado para integrar desafíos sin romper funcionalidades existentes)

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
