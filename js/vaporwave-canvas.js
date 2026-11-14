// js/vaporwave-canvas.js
import { createExperienceViewer }
  from './experience-viewer.js';

import { createEccojams }
  from './aesthetics/vaporwave/eccojams.js';

import { createFloralShoppe }
  from './aesthetics/vaporwave/floral-shoppe.js';

import { createMallsoft }
  from './aesthetics/vaporwave/mallsoft.js';

import { createFutureFunk }
  from './aesthetics/vaporwave/future-funk.js';

import { createSlushwave }
  from './aesthetics/vaporwave/slushwave.js';

import { createUtopianVirtual }
  from './aesthetics/vaporwave/utopian-virtual.js';

import { createLiminalPoolcore }
  from './aesthetics/vaporwave/liminal-poolcore.js';

createExperienceViewer({
  containerId: 'vaporwave-canvas-container',

  defaultEra: 'eccojams',

  allowFirstPerson: true,

  eraFactories: {
    eccojams: createEccojams,
    floral: createFloralShoppe,
    mallsoft: createMallsoft,
    futurefunk: createFutureFunk,
    slushwave: createSlushwave,
    utopian: createUtopianVirtual,
    poolcore: createLiminalPoolcore
  }
});
