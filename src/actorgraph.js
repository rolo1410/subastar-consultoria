// Grafo de actores: círculos posicionados que se conectan con líneas según sus
// relaciones. Al pasar el mouse sobre un actor:
//   - se amplía y despliega su detalle
//   - se resaltan sus líneas de relación y los nodos conectados
//   - los nodos sin relación directa se reducen y se atenúan
//
// Estructura esperada:
//   <div class="actor-graph" data-edges='[["a","b"],["b","c","anon"]]'>
//     <div class="actor-node" data-id="a" data-x="50" data-y="50" data-group="...">
//       <div class="actor-node__circle"><i class="fa-..."></i></div>
//       <div class="actor-node__name">Nombre</div>
//       <div class="actor-node__detail"><h4>…</h4><p>…</p></div>
//     </div>
//     …
//   </div>
//
// Uso:  setupActorGraphs(deck)

import './actorgraph.css';

const SVGNS = 'http://www.w3.org/2000/svg';

export default function setupActorGraphs(deck) {
  const graphs = Array.from(document.querySelectorAll('.actor-graph')).map(create);

  function relayoutVisible() {
    graphs.forEach((g) => {
      if (g.container.offsetParent !== null) g.layout();
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
  const nodes = {};
  Array.from(container.querySelectorAll('.actor-node')).forEach((n) => {
    nodes[n.dataset.id] = n;
    const x = parseFloat(n.dataset.x);
    const y = parseFloat(n.dataset.y);
    n.style.left = x + '%';
    n.style.top = y + '%';
    n.classList.add(y > 55 ? 'detail-up' : 'detail-down');
    if (x < 26) n.classList.add('detail-left');
    else if (x > 74) n.classList.add('detail-right');
    // Nombre al costado en la columna derecha (evita chocar con el nodo de abajo)
    if (x > 84) n.classList.add('name-right');
  });

  let edges = [];
  try {
    edges = JSON.parse(container.dataset.edges || '[]');
  } catch (e) {
    edges = [];
  }

  // Adyacencia (nodos conectados directamente)
  const neighbors = {};
  Object.keys(nodes).forEach((id) => (neighbors[id] = new Set()));
  edges.forEach(([a, b]) => {
    if (neighbors[a]) neighbors[a].add(b);
    if (neighbors[b]) neighbors[b].add(a);
  });

  const svg = document.createElementNS(SVGNS, 'svg');
  svg.classList.add('actor-graph__lines');
  container.insertBefore(svg, container.firstChild);

  let lineRefs = []; // { el, a, b }

  function layout() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;

    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.innerHTML = '';
    lineRefs = [];

    edges.forEach((edge) => {
      const [a, b, type] = edge;
      const na = nodes[a];
      const nb = nodes[b];
      if (!na || !nb) return;

      const x1 = (parseFloat(na.dataset.x) / 100) * w;
      const y1 = (parseFloat(na.dataset.y) / 100) * h;
      const x2 = (parseFloat(nb.dataset.x) / 100) * w;
      const y2 = (parseFloat(nb.dataset.y) / 100) * h;

      const line = document.createElementNS(SVGNS, 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('class', 'actor-edge' + (type ? ' actor-edge--' + type : ''));
      svg.appendChild(line);
      lineRefs.push({ el: line, a, b });

      if (type === 'anon') {
        const label = document.createElementNS(SVGNS, 'text');
        label.setAttribute('x', (x1 + x2) / 2 + 56);
        label.setAttribute('y', (y1 + y2) / 2 + 5);
        label.setAttribute('class', 'actor-edge__label');
        label.setAttribute('text-anchor', 'start');
        label.textContent = 'Relación anónima';
        svg.appendChild(label);
      }
    });
  }

  // --- Enfoque (resalta líneas relacionadas / atenúa las demás) ------------
  let selectedId = null;

  function focus(id) {
    container.classList.add('has-focus');
    Object.keys(nodes).forEach((nid) => {
      const n = nodes[nid];
      const isFocus = nid === id;
      const isNeighbor = neighbors[id].has(nid);
      n.classList.toggle('is-focus', isFocus);
      n.classList.toggle('is-neighbor', isNeighbor);
      n.classList.toggle('is-dim', !isFocus && !isNeighbor);
    });
    lineRefs.forEach(({ el, a, b }) => {
      const active = a === id || b === id;
      el.classList.toggle('is-active', active);
      el.classList.toggle('is-dim', !active);
    });
  }

  function clearFocus() {
    container.classList.remove('has-focus');
    Object.values(nodes).forEach((n) =>
      n.classList.remove('is-focus', 'is-neighbor', 'is-dim')
    );
    lineRefs.forEach(({ el }) => el.classList.remove('is-active', 'is-dim'));
  }

  // --- Detalle: solo al hacer clic sobre el nodo ---------------------------
  function select(id) {
    selectedId = id;
    Object.entries(nodes).forEach(([nid, n]) =>
      n.classList.toggle('is-open', nid === id)
    );
    focus(id);
  }

  function deselect() {
    selectedId = null;
    Object.values(nodes).forEach((n) => n.classList.remove('is-open'));
    clearFocus();
  }

  Object.entries(nodes).forEach(([id, n]) => {
    // Hover: resaltado temporal (si no hay nada seleccionado)
    n.addEventListener('mouseenter', () => {
      if (!selectedId) focus(id);
    });
    n.addEventListener('mouseleave', () => {
      if (!selectedId) clearFocus();
    });
    // Clic: abre/cierra el detalle del nodo
    n.addEventListener('click', (e) => {
      e.stopPropagation();
      if (selectedId === id) deselect();
      else select(id);
    });
  });

  // Clic en el área vacía del grafo cierra el detalle
  container.addEventListener('click', () => {
    if (selectedId) deselect();
  });

  return { container, layout };
}
