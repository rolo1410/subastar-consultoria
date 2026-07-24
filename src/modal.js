// Modales para tarjetas informativas
//   - Cualquier elemento con [data-modal="ID"] abre un modal
//   - El contenido se toma de <template id="ID">...</template>
//   - Cierre con la X, clic en el fondo o tecla Esc
//
// Uso:  setupModals()

import './modal.css';

export default function setupModals() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <button class="modal__close" aria-label="Cerrar">&times;</button>
      <div class="modal__body"></div>
    </div>`;
  document.body.appendChild(overlay);

  const modal = overlay.querySelector('.modal');
  const body = overlay.querySelector('.modal__body');
  const closeBtn = overlay.querySelector('.modal__close');

  function open(id) {
    const tpl = document.getElementById(id);
    if (!tpl || !('content' in tpl)) return;
    body.innerHTML = '';
    body.appendChild(tpl.content.cloneNode(true));
    overlay.classList.add('is-open');
    // Mientras el modal está abierto: puntero visible (se desactiva el láser)
    document.body.classList.add('modal-open');
    modal.scrollTop = 0;
  }

  function close() {
    overlay.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    body.innerHTML = '';
  }

  document.querySelectorAll('[data-modal]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      open(el.getAttribute('data-modal'));
    });
  });

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // Mientras el modal está abierto, bloquear la navegación por teclado de Reveal.
  // Esc cierra el modal. (Fase de captura, antes que los listeners de Reveal.)
  document.addEventListener(
    'keydown',
    (e) => {
      if (!overlay.classList.contains('is-open')) return;
      e.stopImmediatePropagation();
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    },
    true
  );
}
