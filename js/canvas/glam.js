// js/canvas/glam.js
import { createExperienceViewer } from './experience-viewer.js';

import { createCatwalk } from '../aesthetics/glam/catwalk.js';
import { createDisco }   from '../aesthetics/glam/disco.js';

createExperienceViewer({
  containerId: 'glam-canvas-container',

  defaultEra: 'catwalk',

  eraFactories: {
    catwalk: createCatwalk,
    disco:   createDisco,
  }
});