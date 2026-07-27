// Inicialización compartida de Reveal.js
import Reveal from 'reveal.js';
import Markdown from 'reveal.js/plugin/markdown';
import Highlight from 'reveal.js/plugin/highlight';
import Notes from 'reveal.js/plugin/notes';
import setupLaserAndClicks from './laser.js';
import setupNavigation from './navigation.js';
import setupMagnify from './magnify.js';
import setupModals from './modal.js';
import setupHubDiagrams from './hubdiagram.js';
import setupActorGraphs from './actorgraph.js';
import setupBizagi from './bizagi.js';
import './route.css';
import './dcam.css';
import './recomendaciones.css';

import 'reveal.js/reveal.css';
import 'reveal.js/theme/black.css';
import 'reveal.js/plugin/highlight/monokai.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './palette.css';
import './theme.css';

const deck = new Reveal({
  hash: true,
  slideNumber: 'c/t',
  transition: 'slide',
  center: false, // el contenido se alinea hacia arriba
  plugins: [Markdown, Highlight, Notes],
});

deck.initialize().then(() => {
  setupNavigation(deck);
  setupLaserAndClicks(deck);
  setupMagnify(deck);
  setupModals();
  setupHubDiagrams(deck);
  setupActorGraphs(deck);
  setupBizagi();
});

export default deck;
