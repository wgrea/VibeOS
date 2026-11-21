// js/lab-canvas.js
import { createExperienceViewer } from './experience-viewer.js';

import { createGlam } from '../aesthetics/lab/glam.js';
import { createOutfit } from '../aesthetics/lab/outfit.js';

createExperienceViewer({
  containerId: 'lab-canvas-container',
  defaultEra: 'glam',
  eraFactories: {
    glam: createGlam,
    outfit: createOutfit,
  },
});
