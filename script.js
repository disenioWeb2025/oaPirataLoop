// =======================
//  CONFIGURACIÓN GENERAL
// =======================

const STORAGE_KEY = "progresoPirata_v1";

const EJERCICIOS_REQUERIDOS = [
  "for-islas",
  "for-monedas",
  "for-numeros",
  "while-kraken",
  "while-tesoro",
  "while-practica",
  "desafio-tripulacion",
  "desafio-loro",
  "desafio-dados",
];

const TABS_REQUERIDOS = ["for-tab", "while-tab", "comparison-tab", "challenges-tab"];
const MONEDAS_PARA_GANAR = 12;

// =======================
//  ESTADO EN MEMORIA
// =======================

let monedasOro = 0;
let ejerciciosCompletados = new Set();
let tabsVisitados = new Set();

// Evitar que el navegador recuerde el scroll anterior
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// =======================
//  PERSISTENCIA (Storage)
// =======================

function guardarProgreso() {
  const data = {
    monedas: monedasOro,
    ejercicios: Array.from(ejerciciosCompletados),
    tabs: Array.from(tabsVisitados),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function cargarProgreso() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const data = JSON.parse(raw);
      monedasOro = Number.isFinite(data.monedas) ? data.monedas : 0;
      ejerciciosCompletados = new Set(Array.isArray(data.ejercicios) ? data.ejercicios : []);
      tabsVisitados = new Set(Array.isArray(data.tabs) ? data.tabs : []);
    } catch {
      // Si algo está corrupto, limpiamos
      monedasOro = 0;
      ejerciciosCompletados = new Set();
      tabsVisitados = new Set();
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  // Sincronizar UI inicial
  const contador = document.getElementById("contador-monedas");
  if (contador) contador.textContent = monedasOro;

  // Mostrar/ocultar el HUD de monedas según el valor actual
  const contenedor = document.querySelector(".contador-monedas-container");
  if (contenedor) contenedor.style.display = monedasOro > 0 ? "block" : "none";

  verificarVictoria();
}

// =======================
//  UI: MONEDAS Y TOASTS
// =======================

/**
 * Crea y muestra un toast con clases de estilo.
 * @param {"success"|"error"} tipo
 * @param {string} htmlContenido
 */
function crearToast(tipo, htmlContenido) {
  const toast = document.createElement("div");
  toast.className = `toast ${tipo === "success" ? "toast--success" : "toast--error"}`;
  toast.innerHTML = htmlContenido;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function actualizarMonedas() {
  const contador = document.getElementById("contador-monedas");
  const contenedor = document.querySelector(".contador-monedas-container");

  if (contador) {
    contador.textContent = monedasOro;
    // Animación del contador (solo clase, sin inline)
    contador.classList.add("coin-bounce");
    setTimeout(() => contador.classList.remove("coin-bounce"), 600);
  }

  // Mostrar solo si hay al menos 1 moneda
  if (contenedor) {
    contenedor.style.display = monedasOro > 0 ? "block" : "none";
  }

  guardarProgreso();
  verificarVictoria();
}

function mostrarRecompensa(cantidad, esDesafio = false) {
  const tipo = esDesafio ? "¡Desafío completado!" : "¡Ejemplo/Quiz!";
  crearToast(
    "success",
    `
      🪙 +${cantidad} Moneda${cantidad > 1 ? "s" : ""} de Oro<br>
      <span class="toast__msg-ok">✅ ¡Respuesta correcta!</span><br>
      <span class="toast__sub">🏴‍☠️ ${tipo}</span>
    `
  );
}

function mostrarErrorRespuesta() {
  crearToast(
    "error",
    `❌ Respuesta incorrecta<br><span class="toast__sub">Intenta de nuevo</span>`
  );
}

// =======================
//  PROGRESO Y VICTORIA
// =======================

function actualizarProgreso({ ejercicios, totalEjercicios, tabs, totalTabs, monedas, monedasRequeridas }) {
  const container = document.querySelector(".contador-monedas-container .monedas-info");
  if (!container) return;

  let progressDiv = container.querySelector(".progreso-container");
  if (!progressDiv) {
    progressDiv = document.createElement("div");
    progressDiv.className = "progreso-container";
    container.appendChild(progressDiv);
  }

  progressDiv.innerHTML = `
    📚 Ejercicios: ${ejercicios}/${totalEjercicios}<br>
    🗂️ Secciones: ${tabs}/${totalTabs}<br>
    🎯 Meta: ${monedasRequeridas} monedas (llevas ${monedas})
  `;
}

function verificarVictoria() {
  const ejerciciosCompletos = EJERCICIOS_REQUERIDOS.filter((id) => ejerciciosCompletados.has(id));
  const tabsCompletos = TABS_REQUERIDOS.filter((id) => tabsVisitados.has(id));

  const progreso = {
    ejercicios: ejerciciosCompletos.length,
    totalEjercicios: EJERCICIOS_REQUERIDOS.length,
    tabs: tabsCompletos.length,
    totalTabs: TABS_REQUERIDOS.length,
    monedas: monedasOro,
    monedasRequeridas: MONEDAS_PARA_GANAR,
  };

  actualizarProgreso(progreso);

  const cumpleTodo =
    progreso.ejercicios >= progreso.totalEjercicios &&
    progreso.tabs >= progreso.totalTabs &&
    progreso.monedas >= progreso.monedasRequeridas;

  if (cumpleTodo) setTimeout(mostrarVictoria, 600);
}

function mostrarVictoria() {
  // Evitar duplicados
  if (document.getElementById("overlay-victoria")) return;

  const overlay = document.createElement("div");
  overlay.id = "overlay-victoria";
  overlay.className = "overlay";

  overlay.innerHTML = `
    <div class="victory-card">
      <h2 class="victory-card__title">🏆 ¡VICTORIA PIRATA! 🏆</h2>
      <p class="victory-card__text">
        ¡Has ganado <b>${monedasOro}</b> monedas de oro y te has convertido en <b>Maestro de los Bucles</b>!
      </p>
      <div class="victory-card__coins">${"🪙".repeat(Math.min(monedasOro, 12))}</div>
      <div class="victory-actions">
        <button class="btn btn--primary" onclick="cerrarVictoria()">¡Seguir Navegando!</button>
        <button class="btn btn--danger" onclick="reiniciarProgreso()">🔄 Reiniciar Aventura</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Mensaje final oculto en index.html (si existe)
  const felicidades = document.getElementById("final-felicidades");
  if (felicidades) {
    felicidades.style.display = "block";
    felicidades.classList.add("fade-in");
  }
}

function cerrarVictoria() {
  const overlay = document.getElementById("overlay-victoria");
  if (overlay) overlay.remove();
}

function reiniciarProgreso() {
  monedasOro = 0;
  ejerciciosCompletados = new Set();
  tabsVisitados = new Set();
  localStorage.removeItem(STORAGE_KEY);

  actualizarMonedas();
  cerrarVictoria();
  window.scrollTo(0, 0);
  location.reload(); // Limpia marcas visuales previas
  window.location.href = "index.html";
}

// =======================
//  EJERCICIOS / QUIZ
// =======================

function marcarEjercicioCompletado(ejercicioId) {
  const iframe = document.querySelector(`iframe[data-exercise="${ejercicioId}"]`);
  if (!iframe) return;
  const container = iframe.closest(".code-container");
  if (!container) return;

  if (!container.querySelector(".ejercicio-completado")) {
    const marca = document.createElement("div");
    marca.className = "ejercicio-completado";
    marca.textContent = "✅ ¡Completado! +🪙";
    container.style.position = "relative";
    container.appendChild(marca);
  }
}

function ganarMonedas(ejercicioId, cantidad = 1, esDesafio = false) {
  if (ejerciciosCompletados.has(ejercicioId)) return; // evitar doble premio
  ejerciciosCompletados.add(ejercicioId);
  monedasOro += cantidad;
  actualizarMonedas();
  mostrarRecompensa(cantidad, esDesafio);
  marcarEjercicioCompletado(ejercicioId);
}

function verificarRespuesta(ejercicioId, respuestaCorrecta) {
  const seleccionada = document.querySelector(`input[name="quiz-${ejercicioId}"]:checked`);
  if (!seleccionada) {
    mostrarErrorRespuesta();
    return;
  }
  if (seleccionada.value === respuestaCorrecta) {
    const esDesafio = ejercicioId.startsWith("desafio");
    const cantidad = esDesafio ? 2 : 1;
    ganarMonedas(ejercicioId, cantidad, esDesafio);
  } else {
    mostrarErrorRespuesta();
  }
}

// =======================
//  SECCIONES VISITADAS
// =======================

function marcarTabVisitado(tabId) {
  if (!tabsVisitados.has(tabId)) {
    tabsVisitados.add(tabId);
    guardarProgreso();
    verificarVictoria();
  }
}

// =======================
//  INICIALIZACIÓN
// =======================

document.addEventListener("DOMContentLoaded", () => {
  // Siempre arrancar arriba
  window.scrollTo(0, 0);

  cargarProgreso();

  // Detectar página actual y marcar sección
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  let currentTab = "";
  switch (currentPage) {
    case "bucles-for.html": currentTab = "for-tab"; break;
    case "bucles-while.html": currentTab = "while-tab"; break;
    case "comparacion.html": currentTab = "comparison-tab"; break;
    case "desafios.html": currentTab = "challenges-tab"; break;
    // index.html (intro) no suma en TABS_REQUERIDOS a propósito
  }
  if (currentTab && TABS_REQUERIDOS.includes(currentTab)) {
    marcarTabVisitado(currentTab);
  }

  // Marcar visualmente ejercicios ya completados
  ejerciciosCompletados.forEach((id) => setTimeout(() => marcarEjercicioCompletado(id), 400));
});

// Refuerzo de scroll al terminar de cargar todo
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});
