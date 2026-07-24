// Puntero láser + navegación con clics del ratón para Reveal.js
//   - Puntero láser: un punto luminoso que sigue al cursor sobre las diapositivas
//   - Clic izquierdo  -> siguiente diapositiva
//   - Clic derecho    -> diapositiva anterior (sin menú contextual)
//   - Tecla "l"       -> activa/desactiva el láser
//
// Uso:  setupLaserAndClicks(deck)   // deck = instancia de Reveal ya inicializada

import './laser.css';

export default function setupLaserAndClicks(deck) {
  const viewport =
    document.querySelector('.reveal-viewport') ||
    document.querySelector('.reveal') ||
    document.body;

  // --- Puntero láser -------------------------------------------------------
  const dot = document.createElement('div');
  dot.className = 'laser-dot';
  dot.style.display = 'none';
  document.body.appendChild(dot);

  let laserOn = true;

  function moveDot(e) {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
  }

  function showLaser() {
    if (laserOn) {
      dot.style.display = 'block';
      viewport.classList.add('laser-active');
    }
  }
  function hideLaser() {
    dot.style.display = 'none';
    viewport.classList.remove('laser-active');
  }

  // --- Botón para activar/desactivar el modo puntero -----------------------
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'deck-nav__laser';
  btn.setAttribute('aria-pressed', 'true');
  btn.title = 'Modo puntero láser (L)';
  btn.setAttribute('aria-label', 'Modo puntero láser');
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/></svg>';

  function updateBtn() {
    btn.classList.toggle('is-active', laserOn);
    btn.setAttribute('aria-pressed', String(laserOn));
  }

  function setLaser(on) {
    laserOn = on;
    if (!laserOn) hideLaser();
    updateBtn();
  }

  btn.addEventListener('click', () => setLaser(!laserOn));

  const navBar = document.querySelector('.deck-nav');
  (navBar || document.body).appendChild(btn);
  updateBtn();

  viewport.addEventListener('mousemove', (e) => {
    moveDot(e);
    showLaser();
  });
  viewport.addEventListener('mouseleave', hideLaser);

  // Alternar el láser con la tecla "l"
  document.addEventListener('keydown', (e) => {
    if (e.key === 'l' || e.key === 'L') {
      setLaser(!laserOn);
    }
  });

  // --- Navegación con clics del ratón -------------------------------------
  // No navegar si se hizo clic en controles, enlaces o el menú de Reveal.
  function isInteractive(target) {
    return !!(
      target.closest &&
      target.closest('a, button, .modal, .modal-overlay, .actor-node, .actor-graph, .hub-diagram, .controls, .slide-menu, .navigate-left, .navigate-right, .navigate-up, .navigate-down, .reveal-viewport .controls')
    );
  }

  // Clic izquierdo -> siguiente
  viewport.addEventListener('click', (e) => {
    if (e.button !== 0) return;
    if (isInteractive(e.target)) return;
    deck.next();
  });

  // Clic derecho -> anterior (y sin menú contextual)
  viewport.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (isInteractive(e.target)) return;
    deck.prev();
  });
}
