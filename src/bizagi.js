// Visor del diagrama Bizagi con zoom por Ctrl y minimapa
//   - Al mantener Ctrl y mover el cursor sobre el diagrama, la imagen se amplía
//     y se desplaza (pan) siguiendo el puntero.
//   - Mientras Ctrl sigue presionado, la rueda del mouse ajusta el nivel de
//     acercamiento (zoom in / zoom out).
//   - Un minimapa en la esquina indica, con un recuadro, la zona visible.
//   - Al soltar Ctrl la imagen vuelve a su vista completa y el minimapa se oculta.
//
// Estructura esperada en el HTML:
//   <div class="bizagi" data-bizagi>
//     <div class="bizagi__viewport"><img class="bizagi__img" src="..."></div>
//     <div class="bizagi__minimap">
//       <img src="..."><span class="bizagi__minimap-view"></span>
//     </div>
//   </div>
//
// Uso:  setupBizagi()

import './bizagi.css';

const MIN_SCALE = 1.6;
const MAX_SCALE = 6;
const DEFAULT_SCALE = 2.6;
const WHEEL_STEP = 0.4;

export default function setupBizagi() {
  document.querySelectorAll('[data-bizagi]').forEach(initViewer);
}

function initViewer(root) {
  const viewport = root.querySelector('.bizagi__viewport');
  const img = root.querySelector('.bizagi__img');
  const minimapView = root.querySelector('.bizagi__minimap-view');
  if (!viewport || !img) return;

  // Ajustar la relación de aspecto del viewport a la de la imagen para que la
  // imagen llene el contenedor sin bordes: así el mapeo cursor→imagen es exacto.
  function applyAspect() {
    if (img.naturalWidth && img.naturalHeight) {
      viewport.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
    }
  }
  if (img.complete) applyAspect();
  else img.addEventListener('load', applyAspect, { once: true });

  let ctrlDown = false;
  let hovering = false;
  let scale = DEFAULT_SCALE;
  let pointer = { fx: 0.5, fy: 0.5 }; // fracción [0..1] dentro del viewport

  function reset() {
    root.classList.remove('is-zooming');
    img.style.transform = 'translate(0px, 0px) scale(1)';
  }

  function apply() {
    const rect = viewport.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    // Trasladar para que el punto bajo el cursor permanezca bajo el cursor.
    const tx = -pointer.fx * w * (scale - 1);
    const ty = -pointer.fy * h * (scale - 1);
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;

    if (minimapView) {
      // Recuadro visible en el minimapa (en porcentaje del minimapa completo).
      minimapView.style.left = `${(pointer.fx * (scale - 1)) / scale * 100}%`;
      minimapView.style.top = `${(pointer.fy * (scale - 1)) / scale * 100}%`;
      minimapView.style.width = `${(1 / scale) * 100}%`;
      minimapView.style.height = `${(1 / scale) * 100}%`;
    }
  }

  function maybeActivate() {
    if (ctrlDown && hovering) {
      root.classList.add('is-zooming');
      apply();
    }
  }

  viewport.addEventListener('mouseenter', () => {
    hovering = true;
    maybeActivate();
  });

  viewport.addEventListener('mouseleave', () => {
    hovering = false;
    reset();
  });

  viewport.addEventListener('mousemove', (e) => {
    const rect = viewport.getBoundingClientRect();
    pointer.fx = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    pointer.fy = clamp((e.clientY - rect.top) / rect.height, 0, 1);
    if (ctrlDown && hovering) apply();
  });

  // Rueda: ajustar zoom (solo con Ctrl y el cursor sobre el diagrama).
  viewport.addEventListener(
    'wheel',
    (e) => {
      if (!ctrlDown || !hovering) return;
      e.preventDefault();
      const dir = e.deltaY < 0 ? 1 : -1;
      scale = clamp(scale + dir * WHEEL_STEP, MIN_SCALE, MAX_SCALE);
      apply();
    },
    { passive: false }
  );

  // Estado global de Ctrl (compartido por el documento).
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Control' && !ctrlDown) {
      ctrlDown = true;
      maybeActivate();
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'Control') {
      ctrlDown = false;
      reset();
    }
  });

  window.addEventListener('blur', () => {
    ctrlDown = false;
    reset();
  });
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
