// js/world-canvas.js
import { createExperienceViewer } from './experience-viewer.js';

import { createForeignGrocery } from '../aesthetics/world/foreign-grocery.js';
import { createAdultAnimation } from '../aesthetics/world/adult-animation.js';

createExperienceViewer({
  containerId: 'world-canvas-container',
  defaultEra: 'vice-city',
  eraFactories: {
    'foreign-grocery': createForeignGrocery,
    'adult-animation': createAdultAnimation,
  },
});
