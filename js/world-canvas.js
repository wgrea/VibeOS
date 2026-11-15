// js/world-canvas.js
import { createExperienceViewer } from './experience-viewer.js';

import { createViceCity } from './aesthetics/world/vice-city.js';
import { createSanAndreas } from './aesthetics/world/san-andreas.js';
import { createCustomCities } from './aesthetics/world/custom-cities.js';
import { createTropicalCore } from './aesthetics/world/tropical-core.js';
import { createPigglyWiggly } from './aesthetics/world/piggly-wiggly.js';
import { createForeignGrocery } from './aesthetics/world/foreign-grocery.js';
import { createAdultAnimation } from './aesthetics/world/adult-animation.js';

createExperienceViewer({
  containerId: 'world-canvas-container',
  defaultEra: 'vice-city',
  eraFactories: {
    'vice-city': createViceCity,
    'san-andreas': createSanAndreas,
    'custom-cities': createCustomCities,
    'tropical-core': createTropicalCore,
    'piggly-wiggly': createPigglyWiggly,
    'foreign-grocery': createForeignGrocery,
    'adult-animation': createAdultAnimation,
  },
});
