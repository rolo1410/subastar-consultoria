// Diagrama tipo "hub": distribuye las tarjetas alrededor de un centro y dibuja
// líneas que conectan cada tarjeta con el nodo central (relación radial).
//
// Estructura esperada en el HTML:
//   <div class="hub-diagram">
//     <div class="hub">…centro…</div>
//     <button class="info-card" data-modal="…">…</button>  (x N)
//   </div>
//
// Uso:  setupHubDiagrams(deck)

import './hubdiagram.css';

const SVGNS = 'http://www.w3.org/2000/svg';

export default function setupHubDiagrams(deck) {
  const diagrams = Array.from(document.querySelectorAll('.hub-diagram')).map(create);

  function relayoutVisible() {
    diagrams.forEach((d) => {
      // offsetParent es null cuando el slide está oculto (display:none)
      if (d.container.offsetParent !== null) d.layout();
    });
  }

  if (deck) {
    deck.on('slidechanged', () => setTimeout(relayoutVisible, 0));
    deck.on('ready', () => setTimeout(relayoutVisible, 0));
  }
  window.addEventListener('resize', relayoutVisible);
  setTimeout(relayoutVisible, 0);
}

function create(container) {
  const hub = container.querySelector('.hub');
  const cards = Array.from(container.querySelectorAll('.info-card'));

  // Capa SVG para las líneas (detrás de las tarjetas y del hub)
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.classList.add('hub-diagram__lines');
  container.insertBefore(svg, container.firstChild);

  function layout() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;

    const cx = w / 2;
    const cy = h / 2;
    const rx = Math.min(w * 0.34, 360);
    const ry = Math.min(h * 0.36, 210);
    const n = cards.length;

    // Posicionar el hub en el centro
    hub.style.left = cx + 'px';
    hub.style.top = cy + 'px';

    // Posicionar tarjetas en círculo (empezando arriba)
    const points = cards.map((card, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      const x = cx + rx * Math.cos(angle);
      const y = cy + ry * Math.sin(angle);
      card.style.left = x + 'px';
      card.style.top = y + 'px';
      return { x, y };
    });

    // Dibujar líneas del centro a cada tarjeta
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.innerHTML = '';

    points.forEach(({ x, y }) => {
      const line = document.createElementNS(SVGNS, 'line');
      line.setAttribute('x1', cx);
      line.setAttribute('y1', cy);
      line.setAttribute('x2', x);
      line.setAttribute('y2', y);
      line.setAttribute('class', 'hub-line');
      svg.appendChild(line);
    });

    // Punto en el centro
    const dot = document.createElementNS(SVGNS, 'circle');
    dot.setAttribute('cx', cx);
    dot.setAttribute('cy', cy);
    dot.setAttribute('r', 5);
    dot.setAttribute('class', 'hub-line__dot');
    svg.appendChild(dot);
  }

  return { container, layout };
}
