// ===== SISTEMA DE PUNTUACIÓN MULTI-PÁGINA =====
let monedasOro = 0;
let ejerciciosCompletados = new Set();
let tabsVisitados = new Set();

const PUNTOS = {
  EJECUTAR_EJEMPLO: 1,
  COMPLETAR_DESAFIO: 2,
  VISITAR_TAB: 0,
};

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

const MONEDAS_PARA_GANAR = 12;

const TABS_REQUERIDOS = [
  "for-tab",
  "while-tab", 
  "comparison-tab",
  "challenges-tab",
];

// ===== FUNCIONES DE ALMACENAMIENTO (IN-MEMORY) =====
function guardarProgreso() {
  // En el entorno de Claude, se usa almacenamiento en memoria
  // Los datos se perderán al recargar la página
  console.log('Progreso guardado en memoria:', {
    monedas: monedasOro,
    ejercicios: Array.from(ejerciciosCompletados),
    tabs: Array.from(tabsVisitados)
  });
}

function cargarProgreso() {
  const contadorMonedas = document.getElementById("contador-monedas");
  if (contadorMonedas) {
    contadorMonedas.textContent = monedasOro;
  }
  verificarVictoria();
}

// ===== FUNCIONES DE MONEDAS =====
function actualizarMonedas() {
  const contadorMonedas = document.getElementById("contador-monedas");
  if (contadorMonedas) {
    contadorMonedas.textContent = monedasOro;
    contadorMonedas.style.animation = "coinBounce 0.6s ease";
    setTimeout(() => {
      contadorMonedas.style.animation = "";
    }, 600);
  }
  guardarProgreso();
  verificarVictoria();
}

function ganarMonedas(ejercicioId, cantidad = 1, esDesafio = false) {
  if (!ejerciciosCompletados.has(ejercicioId)) {
    ejerciciosCompletados.add(ejercicioId);
    monedasOro += cantidad;
    actualizarMonedas();
    mostrarRecompensa(cantidad, esDesafio);
    marcarEjercicioCompletado(ejercicioId);
  }
}

function mostrarRecompensa(cantidad, esDesafio = false) {
  const recompensa = document.createElement("div");
  recompensa.style.cssText = `
    position: fixed;
    top: 20%;
    right: 20px;
    background: linear-gradient(45deg, #f1c40f, #f39c12);
    color: #2c3e50;
    padding: 20px 30px;
    border-radius: 15px;
    font-size: 1.3rem;
    font-weight: bold;
    text-align: center;
    box-shadow: 0 10px 30px rgba(241, 196, 15, 0.6);
    z-index: 2000;
    animation: rewardSlide 3s ease-in-out;
    border: 3px solid #e67e22;
    max-width: 300px;
  `;

  const tipoRecompensa = esDesafio
    ? "¡Desafío completado!"
    : "¡Ejemplo ejecutado!";
  recompensa.innerHTML = `
    💰 +${cantidad} Moneda${cantidad > 1 ? "s" : ""} de Oro!<br>
    <span style="font-size: 0.9em;">🏴‍☠️ ${tipoRecompensa}</span>
  `;

  document.body.appendChild(recompensa);
  setTimeout(() => recompensa.remove(), 3000);
}

// ===== VERIFICACIÓN DE VICTORIA =====
function verificarVictoria() {
  const ejerciciosCompletos = EJERCICIOS_REQUERIDOS.filter((ej) =>
    ejerciciosCompletados.has(ej)
  );
  const tabsCompletos = TABS_REQUERIDOS.filter((tab) => tabsVisitados.has(tab));

  const progreso = {
    ejercicios: ejerciciosCompletos.length,
    totalEjercicios: EJERCICIOS_REQUERIDOS.length,
    tabs: tabsCompletos.length,
    totalTabs: TABS_REQUERIDOS.length,
    monedas: monedasOro,
    monedasRequeridas: MONEDAS_PARA_GANAR,
  };

  actualizarProgreso(progreso);

  if (
    progreso.ejercicios >= progreso.totalEjercicios &&
    progreso.tabs >= progreso.totalTabs &&
    progreso.monedas >= progreso.monedasRequeridas
  ) {
    setTimeout(() => mostrarVictoria(), 1000);
  }
}

function actualizarProgreso(progreso) {
  const container = document.querySelector(
    ".contador-monedas-container .monedas-info"
  );
  if (container) {
    let progressDiv = container.querySelector(".progreso-container");
    if (!progressDiv) {
      progressDiv = document.createElement("div");
      progressDiv.className = "progreso-container";
      progressDiv.style.cssText = `
        margin-top: 10px;
        font-size: 0.8rem;
        color: #87ceeb;
      `;
      container.appendChild(progressDiv);
    }

    progressDiv.innerHTML = `
      📚 Ejercicios: ${progreso.ejercicios}/${progreso.totalEjercicios}<br>
      🗂️ Secciones: ${progreso.tabs}/${progreso.totalTabs}<br>
      🎯 Meta: ${progreso.monedasRequeridas || MONEDAS_PARA_GANAR} monedas
    `;
  }
}

function mostrarVictoria() {
  const victoria = document.createElement("div");
  victoria.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3000;
    animation: fadeIn 1s ease;
  `;

  victoria.innerHTML = `
    <div style="
      background: linear-gradient(45deg, #f1c40f, #e67e22);
      color: #2c3e50;
      padding: 40px;
      border-radius: 20px;
      text-align: center;
      max-width: 600px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
      animation: victoryBounce 1s ease;
    ">
      <h2 style="font-size: 2.5rem; margin-bottom: 20px;">🏆 ¡VICTORIA PIRATA! 🏆</h2>
      <p style="font-size: 1.3rem; margin-bottom: 15px;">
        ¡Has ganado ${monedasOro} monedas de oro y te has convertido en un 
        <strong>Maestro de los Bucles</strong>!
      </p>
      <p style="font-size: 1.1rem; margin-bottom: 20px;">
        🏴‍☠️ El Capitán CodeBeard está orgulloso de ti, marinero.
        ¡Ahora eres parte oficial de la tripulación!
      </p>
      <div style="font-size: 1.5rem; margin: 20px 0;">
        Has completado:<br>
        ✅ ${EJERCICIOS_REQUERIDOS.length} ejercicios de programación<br>
        ✅ ${TABS_REQUERIDOS.length} secciones de aprendizaje<br>
        ✅ Dominio de bucles FOR y WHILE
      </div>
      <div style="font-size: 2rem; margin: 20px 0;">
        ${"💰".repeat(Math.min(monedasOro, 10))}
      </div>
      <button onclick="cerrarVictoria()" style="
        background: #2c3e50;
        color: #f1c40f;
        border: none;
        padding: 15px 30px;
        border-radius: 10px;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        margin-top: 10px;
        margin-right: 10px;
      ">¡Continuar la Aventura!</button>
      <button onclick="reiniciarProgreso()" style="
        background: #e74c3c;
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 10px;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        margin-top: 10px;
      ">🔄 Reiniciar Aventura</button>
    </div>
  `;

  document.body.appendChild(victoria);
  mostrarMensajeFinal();
}

function cerrarVictoria() {
  const victoria = document.querySelector(
    '[style*="position: fixed"][style*="width: 100%"]'
  );
  if (victoria) victoria.remove();
}

function reiniciarProgreso() {
  // Reiniciar variables en memoria
  monedasOro = 0;
  ejerciciosCompletados = new Set();
  tabsVisitados = new Set();
  actualizarMonedas();
  cerrarVictoria();
  alert("¡Aventura reiniciada! Puedes empezar de nuevo.");
}

function mostrarMensajeFinal() {
  const felicidades = document.getElementById("final-felicidades");
  if (felicidades) {
    felicidades.style.display = "block";
    felicidades.style.animation = "fadeIn 1s ease";
  }
}

// ===== FUNCIONES DE EJERCICIOS =====
function marcarEjercicioCompletado(ejercicioId) {
  const iframe = document.querySelector(
    `iframe[data-exercise="${ejercicioId}"]`
  );
  if (iframe) {
    const container = iframe.closest(".code-container");
    if (container && !container.querySelector(".ejercicio-completado")) {
      const marca = document.createElement("div");
      marca.className = "ejercicio-completado";
      marca.innerHTML = "✅ ¡Completado! +💰";
      marca.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: #2ecc71;
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 0.9rem;
        font-weight: bold;
        z-index: 10;
        animation: slideInRight 0.5s ease;
      `;
      container.style.position = "relative";
      container.appendChild(marca);
    }
  }
}

function verificarRespuesta(ejercicioId, respuestaCorrecta) {
  const seleccionada = document.querySelector(
    `input[name="quiz-${ejercicioId}"]:checked`
  );
  if (seleccionada && seleccionada.value === respuestaCorrecta) {
    const esDesafio = ejercicioId.startsWith("desafio");
    const cantidad = esDesafio ? 2 : 1;
    ganarMonedas(ejercicioId, cantidad, esDesafio);
    alert(
      `✅ ¡Correcto! ${cantidad} moneda${cantidad > 1 ? "s" : ""} ganada${
        cantidad > 1 ? "s" : ""
      }.`
    );
  } else {
    alert("❌ Incorrecto. ¡Intenta de nuevo!");
  }
}

// ===== FUNCIONES DE NAVEGACIÓN =====
function marcarTabVisitado(tabId) {
  if (!tabsVisitados.has(tabId)) {
    tabsVisitados.add(tabId);
    guardarProgreso();
    verificarVictoria();
  }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
  // Cargar progreso al cargar la página
  cargarProgreso();
  
  // Marcar tab actual como visitado basado en la página
  const currentPage = window.location.pathname.split('/').pop();
  let currentTab = '';
  
  switch(currentPage) {
    case 'index.html':
    case '':
      currentTab = 'intro-tab';
      break;
    case 'for-loops.html':
      currentTab = 'for-tab';
      break;
    case 'while-loops.html':
      currentTab = 'while-tab';
      break;
    case 'comparison.html':
      currentTab = 'comparison-tab';
      break;
    case 'challenges.html':
      currentTab = 'challenges-tab';
      break;
  }
  
  if (currentTab && TABS_REQUERIDOS.includes(currentTab)) {
    marcarTabVisitado(currentTab);
  }
  
  // Marcar ejercicios ya completados visualmente
  ejerciciosCompletados.forEach(ejercicioId => {
    setTimeout(() => marcarEjercicioCompletado(ejercicioId), 500);
  });
});

// ===== FUNCIONES LEGACY (para compatibilidad) =====
function showTab(tabId, el) {
  // Esta función ya no es necesaria en el sistema multi-página
  // pero se mantiene para compatibilidad
  console.log('showTab called - redirecting to multi-page navigation');
}