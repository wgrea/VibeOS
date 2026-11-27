// js/canvas/academia.js
import { createExperienceViewer } from './experience-viewer.js';

import { createDarkAcademia }  from '../aesthetics/academia/dark.js';   // was dark-academia.js
import { createLightAcademia } from '../aesthetics/academia/light.js';  // was light-academia.js
createExperienceViewer({
  containerId: 'academia-canvas-container',

  defaultEra: 'dark-academia',

  eraFactories: {
    'dark-academia': createDarkAcademia,
    'light-academia': createLightAcademia,
  }
});