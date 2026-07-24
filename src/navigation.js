// Header con el título + slider de navegación entre slides para Reveal.js
//   - Header fijo en la parte superior izquierda con el título de la presentación
//     (se toma de <body data-deck-title="...">, con fallback al <title>)
//   - Slider (barra) para navegar entre todas las diapositivas
//
// Uso:  setupNavigation(deck)   // deck = instancia de Reveal ya inicializada

import './navigation.css';

export default function setupNavigation(deck) {
  const title =
    document.body.dataset.deckTitle ||
    (document.title || '').split('—')[0].trim() ||
    'Presentación';

  // --- Header ---------------------------------------------------------------
  //   Izquierda: título del slide actual (dinámico)
  //   Derecha:   título de la presentación (fijo)
  const header = document.createElement('header');
  header.className = 'deck-header';
  header.innerHTML = `
    <div class="deck-header__left">
      <span class="deck-header__bar"></span>
      <span class="deck-header__slide"></span>
    </div>
    <div class="deck-header__right">
      <span class="deck-header__title">${title}</span>
    </div>
  `;
  document.body.appendChild(header);

  const slideTitleEl = header.querySelector('.deck-header__slide');

  function updateSlideTitle() {
    const slide = deck.getCurrentSlide();
    let text = '';
    if (slide) {
      const h = slide.querySelector('h1, h2, h3, h4');
      // data-title tiene prioridad; si no, el encabezado del slide
      text = slide.dataset.title || (h ? h.textContent.trim() : '');
    }
    slideTitleEl.textContent = text;

    // El header no se muestra en la primera página (portada)
    header.classList.toggle('is-hidden', deck.getSlidePastCount() === 0);
  }

  // --- Slider de navegación ------------------------------------------------
  const nav = document.createElement('div');
  nav.className = 'deck-nav';

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.className = 'deck-nav__slider';
  slider.min = '0';
  slider.step = '1';

  const counter = document.createElement('span');
  counter.className = 'deck-nav__counter';

  // Botón de pantalla completa
  const fsBtn = document.createElement('button');
  fsBtn.type = 'button';
  fsBtn.className = 'deck-nav__fs';
  fsBtn.title = 'Pantalla completa (F)';
  fsBtn.setAttribute('aria-label', 'Pantalla completa');

  const ICON_ENTER =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>';
  const ICON_EXIT =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/></svg>';

  function isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }
  function updateFsIcon() {
    fsBtn.innerHTML = isFullscreen() ? ICON_EXIT : ICON_ENTER;
  }
  function toggleFullscreen() {
    const root = document.documentElement;
    if (!isFullscreen()) {
      (root.requestFullscreen || root.webkitRequestFullscreen).call(root);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    }
  }
  fsBtn.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', updateFsIcon);
  document.addEventListener('webkitfullscreenchange', updateFsIcon);
  updateFsIcon();

  nav.appendChild(slider);
  nav.appendChild(counter);
  nav.appendChild(fsBtn);
  document.body.appendChild(nav);

  // Lista plana de todas las diapositivas (incluye verticales, si las hubiera)
  function getSlides() {
    return Array.from(deck.getSlides());
  }

  function sync() {
    const slides = getSlides();
    const total = slides.length;
    const current = deck.getSlidePastCount(); // índice 0-based de la slide actual
    slider.max = String(Math.max(0, total - 1));
    slider.value = String(current);
    counter.textContent = `${current + 1} / ${total}`;
  }

  // Navegar al mover el slider
  slider.addEventListener('input', () => {
    const slides = getSlides();
    const target = slides[Number(slider.value)];
    if (!target) return;
    const { h, v } = deck.getIndices(target);
    deck.slide(h, v);
  });

  // Mantener el slider y el título del slide sincronizados con la navegación
  deck.on('slidechanged', () => {
    sync();
    updateSlideTitle();
  });
  deck.on('ready', () => {
    sync();
    updateSlideTitle();
  });
  sync();
  updateSlideTitle();
}
