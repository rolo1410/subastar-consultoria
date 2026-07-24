// Descargas de fuentes dentro del slide de "Preguntas"
//   - Lee la lista de archivos desde <template id="deck-sources"> en el HTML.
//     Cada fuente es un <a href="..." data-type="..." data-label="...">.
//   - Renderiza un panel con las fuentes descargables únicamente dentro del
//     slide de cierre "Preguntas" (el que tiene el icono fa-circle-question).
//
// Uso:  setupDownloads()   // llamar después de setupNavigation()

import './downloads.css';

const TYPES = {
  word:  { icon: 'fa-file-word',       cls: 'is-word' },
  excel: { icon: 'fa-file-excel',      cls: 'is-excel' },
  ppt:   { icon: 'fa-file-powerpoint', cls: 'is-ppt' },
  img:   { icon: 'fa-file-image',      cls: 'is-img' },
  bpm:   { icon: 'fa-diagram-project', cls: 'is-bpm' },
};

// Localiza el slide de "Preguntas" (icono fa-circle-question). Si no existe,
// cae al último slide de la presentación.
function findQuestionsSlide() {
  const icon = document.querySelector('.reveal .slides section h1 i.fa-circle-question');
  if (icon) return icon.closest('section');
  const sections = document.querySelectorAll('.reveal .slides > section');
  return sections.length ? sections[sections.length - 1] : null;
}

export default function setupDownloads() {
  const tpl = document.getElementById('deck-sources');
  if (!tpl) return;

  const sources = Array.from(tpl.content.querySelectorAll('a[href]'));
  if (!sources.length) return;

  const slide = findQuestionsSlide();
  if (!slide) return;

  const panel = document.createElement('div');
  panel.className = 'deck-sources-panel';

  const heading = document.createElement('h2');
  heading.className = 'deck-sources-panel__title';
  heading.innerHTML = '<i class="fa-solid fa-download"></i> Fuentes descargables';
  panel.appendChild(heading);

  const list = document.createElement('div');
  list.className = 'deck-sources-panel__list';
  list.setAttribute('role', 'group');
  list.setAttribute('aria-label', 'Descargar fuentes');

  for (const src of sources) {
    const type = src.dataset.type || 'word';
    const label = src.dataset.label || 'Descargar';
    const meta = TYPES[type] || TYPES.word;

    const a = document.createElement('a');
    a.className = `deck-source ${meta.cls}`;
    a.href = src.getAttribute('href');
    a.setAttribute('download', '');
    a.setAttribute('aria-label', `Descargar: ${label}`);
    a.innerHTML = `<i class="fa-solid ${meta.icon}"></i><span>${label}</span>`;
    list.appendChild(a);
  }

  panel.appendChild(list);
  slide.appendChild(panel);
}
