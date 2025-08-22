// ======= CONFIG =======
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

// ======= ESTADO =======
let monedasOro = 0;
let ejerciciosCompletados = new Set();
let tabsVisitados = new Set();

// Evitar que el navegador recuerde el scroll anterior
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// ======= STORAGE =======
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
  // Sync UI inicial
  const contador = document.getElementById("contador-monedas");
  if (contador) contador.textContent = monedasOro;
  verificarVictoria(); // también construye el progreso en la UI
}

// ======= MONEDAS / UI =======
function actualizarMonedas() {
  const contador = document.getElementById("contador-monedas");
  if (contador) {
    contador.textContent = monedasOro;
    contador.style.animation = "coinBounce 0.6s ease";
    setTimeout(() => (contador.style.animation = ""), 600);
  }
  guardarProgreso();
  verificarVictoria();
}

function mostrarRecompensa(cantidad, esDesafio = false) {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed; top: 20%; right: 20px;
    background: linear-gradient(45deg,#f1c40f,#f39c12);
    color:#2c3e50; padding:20px 30px; border-radius:15px;
    font-size:1.2rem; font-weight:700; text-align:center;
    box-shadow:0 10px 30px rgba(241,196,15,.6);
    z-index:2000; border:3px solid #e67e22; max-width:320px;
    animation: rewardSlide 3s ease-in-out;
  `;
  const tipo = esDesafio ? "¡Desafío completado!" : "¡Ejemplo/Quiz!";
  toast.innerHTML = `
    💰 +${cantidad} Moneda${cantidad > 1 ? "s" : ""} de Oro<br>
    <span style="font-size:.95rem;color:#27ae60">✅ ¡Respuesta correcta!</span><br>
    <span style="font-size:.85rem">🏴‍☠️ ${tipo}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function mostrarErrorRespuesta() {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed; top: 20%; right: 20px;
    background: linear-gradient(45deg,#e74c3c,#c0392b);
    color:#fff; padding:20px 30px; border-radius:15px;
    font-size:1.2rem; font-weight:700; text-align:center;
    box-shadow:0 10px 30px rgba(192,57,43,.6);
    z-index:2000; border:3px solid #e74c3c; max-width:320px;
    animation: rewardSlide 3s ease-in-out;
  `;
  toast.innerHTML = `❌ Respuesta incorrecta<br><span style="font-size:.95rem">Intenta de nuevo</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ======= PROGRESO / VICTORIA =======
function actualizarProgreso({ ejercicios, totalEjercicios, tabs, totalTabs, monedas, monedasRequeridas }) {
  const container = document.querySelector(".contador-monedas-container .monedas-info");
  if (!container) return;

  let progressDiv = container.querySelector(".progreso-container");
  if (!progressDiv) {
    progressDiv = document.createElement("div");
    progressDiv.className = "progreso-container";
    progressDiv.style.cssText = `margin-top:10px;font-size:.85rem;color:#87ceeb;line-height:1.3`;
    container.appendChild(progressDiv);
  }
  progressDiv.innerHTML = `
    📚 Ejercicios: ${ejercicios}/${totalEjercicios}<br>
    🗂️ Secciones: ${tabs}/${totalTabs}<br>
    🎯 Meta: ${monedasRequeridas} monedas (llevas ${monedas})
  `;
}

function verificarVictoria() {
  const ejerciciosCompletos = EJERCICIOS_REQUERIDOS.filter(id => ejerciciosCompletados.has(id));
  const tabsCompletos = TABS_REQUERIDOS.filter(id => tabsVisitados.has(id));

  const progreso = {
    ejercicios: ejerciciosCompletos.length,
    totalEjercicios: EJERCICIOS_REQUERIDOS.length,
    tabs: tabsCompletos.length,
    totalTabs: TABS_REQUERIDOS.length,
    monedas: monedasOro,
    monedasRequeridas: MONEDAS_PARA_GANAR
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
  overlay.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,.9);
    display:flex; justify-content:center; align-items:center; z-index:3000;
  `;

  overlay.innerHTML = `
    <div style="
      background: linear-gradient(45deg,#f1c40f,#e67e22);
      color:#2c3e50; padding:40px; border-radius:20px; text-align:center; max-width:640px;
      box-shadow:0 20px 50px rgba(0,0,0,.8);
    ">
      <h2 style="font-size:2.2rem;margin:0 0 16px">🏆 ¡VICTORIA PIRATA! 🏆</h2>
      <p style="font-size:1.15rem;margin:0 0 10px">
        ¡Has ganado <b>${monedasOro}</b> monedas de oro y te has convertido en <b>Maestro de los Bucles</b>!
      </p>
      <div style="font-size:1.4rem;margin:18px 0">${"💰".repeat(Math.min(monedasOro, 12))}</div>
      <div style="display:flex;gap:12px;justify-content:center;margin-top:8px;flex-wrap:wrap">
        <button onclick="cerrarVictoria()" style="
          background:#2c3e50;color:#f1c40f;border:none;padding:12px 22px;border-radius:10px;
          font-weight:700;cursor:pointer
        ">¡Seguir Navegando!</button>
        <button onclick="reiniciarProgreso()" style="
          background:#e74c3c;color:#fff;border:none;padding:12px 22px;border-radius:10px;
          font-weight:700;cursor:pointer
        ">🔄 Reiniciar Aventura</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Mensaje final oculto en index.html (si existe)
  const felicidades = document.getElementById("final-felicidades");
  if (felicidades) {
    felicidades.style.display = "block";
    felicidades.style.animation = "fadeIn 1s ease";
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

  // Refrescar UI y volver arriba
  actualizarMonedas();
  cerrarVictoria();
  window.scrollTo(0, 0);

  // Recargar para limpiar marcas visuales previas
  location.reload();
}

// ======= EJERCICIOS / QUIZ =======
function marcarEjercicioCompletado(ejercicioId) {
  const iframe = document.querySelector(`iframe[data-exercise="${ejercicioId}"]`);
  if (!iframe) return;
  const container = iframe.closest(".code-container");
  if (!container) return;

  if (!container.querySelector(".ejercicio-completado")) {
    const marca = document.createElement("div");
    marca.className = "ejercicio-completado";
    marca.textContent = "✅ ¡Completado! +💰";
    marca.style.cssText = `
      position:absolute; top:10px; right:10px; background:#2ecc71; color:#fff;
      padding:6px 10px; border-radius:14px; font-size:.9rem; font-weight:700; z-index:10
    `;
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

// ======= SECCIONES =======
function marcarTabVisitado(tabId) {
  if (!tabsVisitados.has(tabId)) {
    tabsVisitados.add(tabId);
    guardarProgreso();
    verificarVictoria();
  }
}

// ======= INICIO =======
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

// ======= LEGACY NO-OP =======
function showTab() {
  // Compatibilidad con versiones viejas (no hace nada en multipágina)
  console.log("showTab: multipágina activa");
}

// ✅ Refuerzo: cuando toda la página terminó de cargarse
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});
