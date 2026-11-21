// js/canvas/lab.js
import { createExperienceViewer } from './experience-viewer.js';

import { createGlam } from '../aesthetics/lab/glam.js';
import { createOutfit } from '../aesthetics/lab/outfit/index.js';
import { createKeyboard } from '../aesthetics/lab/dj/index.js';

createExperienceViewer({
  containerId: 'lab-canvas-container',
  stageId: 'lab-stage',
  defaultEra: 'glam',
  eraFactories: {
    glam: createGlam,
    outfit: createOutfit,
    keyboard: createKeyboard
  },
});
