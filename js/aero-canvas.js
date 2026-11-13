// js/aero-canvas.js
import { createExperienceViewer }
  from './experience-viewer.js';

import { createXpBliss }
  from './aesthetics/frutiger-aero/xp-bliss.js';

import { createWeb2Gloss }
  from './aesthetics/frutiger-aero/web2-gloss.js';

import { createVistaGlass }
  from './aesthetics/frutiger-aero/vista-glass.js';

import { createSkeuoDial }
  from './aesthetics/frutiger-aero/skeuo-dial.js';

import { createFlatCollapse }
  from './aesthetics/frutiger-aero/flat-collapse.js';

createExperienceViewer({
  containerId: 'aero-canvas-container',

  defaultEra: 'xp',

  eraFactories: {
    xp: createXpBliss,
    web2: createWeb2Gloss,
    vista: createVistaGlass,
    skeuo: createSkeuoDial,
    flat: createFlatCollapse
  }
});