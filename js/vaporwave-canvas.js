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

import { createBrokenTransmission } from './aesthetics/vaporwave/broken-transmission.js';
import { createDreampunk } from './aesthetics/vaporwave/dreampunk.js';

import { createLateNightLofi }
  from './aesthetics/vaporwave/late-night-lofi.js';

import { createDolphin }
  from './aesthetics/vaporwave/dolphin.js';
  import { createVaportrap }
  from './aesthetics/vaporwave/vaportrap.js';

import { createSimpsonswave }
  from './aesthetics/vaporwave/simpsonswave.js';



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
    poolcore: createLiminalPoolcore,
signalwave: createBrokenTransmission,
dreampunk: createDreampunk,
    lofi: createLateNightLofi,
    dolphin: createDolphin,
        vaportrap: createVaportrap,
    simpsonswave: createSimpsonswave,


  }
});
