// Magnificar texto bajo el cursor mientras se mantiene Ctrl
//   - Al presionar/mantener Ctrl, el elemento de texto sobre el que está el
//     mouse aumenta un 30%. Al soltar Ctrl, vuelve a su tamaño.
//   - Mientras Ctrl sigue presionado, al mover el mouse el efecto salta al
//     nuevo elemento de texto.
//
// Uso:  setupMagnify(deck)

import './magnify.css';

const TEXT_SELECTOR = 'h1, h2, h3, h4, p, li, blockquote, span, td, th, dt, dd, figcaption';

export default function setupMagnify() {
  const slidesRoot = document.querySelector('.reveal .slides') || document.body;

  let ctrlDown = false;
  let lastPointer = { x: 0, y: 0 };
  let current = null;

  function textElementAt(x, y) {
    const el = document.elementFromPoint(x, y);
    if (!el) return null;
    const text = el.closest(TEXT_SELECTOR);
    // Solo dentro del área de diapositivas y con contenido de texto
    if (text && slidesRoot.contains(text) && text.textContent.trim()) {
      return text;
    }
    return null;
  }

  const FACTOR = 1.3; // +30%

  function clear() {
    if (current) {
      current.classList.remove('magnify-target');
      // Restaurar el tamaño de fuente original
      current.style.fontSize = current._magnifyPrevFontSize || '';
      delete current._magnifyPrevFontSize;
      current = null;
    }
  }

  function update() {
    if (!ctrlDown) return;
    const target = textElementAt(lastPointer.x, lastPointer.y);
    if (target === current) return;
    clear();
    if (target) {
      // Aumentar el font-size real (provoca reflow -> el texto salta de línea
      // dentro del slide en lugar de salirse de los bordes).
      const computed = parseFloat(getComputedStyle(target).fontSize) || 16;
      target._magnifyPrevFontSize = target.style.fontSize;
      target.style.fontSize = computed * FACTOR + 'px';
      target.classList.add('magnify-target');
      current = target;
    }
  }

  document.addEventListener('mousemove', (e) => {
    lastPointer = { x: e.clientX, y: e.clientY };
    if (ctrlDown) update();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Control' && !ctrlDown) {
      ctrlDown = true;
      update();
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'Control') {
      ctrlDown = false;
      clear();
    }
  });

  // Si la ventana pierde el foco, no dejar el efecto pegado
  window.addEventListener('blur', () => {
    ctrlDown = false;
    clear();
  });
}
