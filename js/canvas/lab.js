// js/canvas/lab.js
import { createExperienceViewer } from './experience-viewer.js';

import { createOutfit } from '../aesthetics/lab/outfit/index.js';
import { createKeyboard } from '../aesthetics/lab/dj/index.js';

createExperienceViewer({
  containerId: 'lab-canvas-container',
  stageId: 'lab-stage',
  defaultEra: 'outfit',
  eraFactories: {
    outfit: createOutfit,
    keyboard: createKeyboard
  },
});
