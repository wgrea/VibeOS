// js/canvas/aero.js
import { createExperienceViewer }
  from './experience-viewer.js';

import { createXpBliss }
  from '../aesthetics/frutiger-aero/xp-bliss.js';

import { createWeb2Gloss }
  from '../aesthetics/frutiger-aero/web2-gloss.js';

import { createVistaGlass }
  from '../aesthetics/frutiger-aero/vista-glass.js';

import { createSkeuoDial }
  from '../aesthetics/frutiger-aero/skeuo-dial.js';

import { createFlatCollapse }
  from '../aesthetics/frutiger-aero/flat-collapse.js';

import { createNeoAero }
  from '../aesthetics/frutiger-aero/neo-aero.js';

import { createDarkAero }
  from '../aesthetics/frutiger-aero/dark-aero.js';

import { createFrutigerAurora } from '../aesthetics/frutiger-aero/frutiger-aurora.js';
import { createMetalheart } from '../aesthetics/frutiger-aero/metalheart.js';

import { createFrutigerGalaxy }
  from '../aesthetics/frutiger-aero/frutiger-galaxy.js';

import { createDorfic }
  from '../aesthetics/frutiger-aero/dorfic.js';
import { createVectorGarden }
  from '../aesthetics/frutiger-aero/vector-garden.js';

import { createDarkMetro }
  from '../aesthetics/frutiger-aero/dark-metro.js';

import { createAblaAero }
  from '../aesthetics/frutiger-aero/abla-aero.js';

import { createFuturismAero }
  from '../aesthetics/frutiger-aero/futurism-aero.js';

import { createFrutigerPaleo }
  from '../aesthetics/frutiger-aero/frutiger-paleo.js';

import { createHelveticaAqua }
  from '../aesthetics/frutiger-aero/helvetica-aqua.js';
import { createWindowsAero }
  from '../aesthetics/frutiger-aero/windows-aero.js';

import { createVectorFlourish }
  from '../aesthetics/frutiger-aero/vector-flourish.js';

import { createBrightTertiaries }
  from '../aesthetics/frutiger-aero/bright-tertiaries.js';
import { createUrbling }
  from '../aesthetics/frutiger-aero/urbling.js';

import { createAbstractTech }
  from '../aesthetics/frutiger-aero/abstract-tech.js';

import { createCleancore }
  from '../aesthetics/frutiger-aero/cleancore.js';

createExperienceViewer({
  containerId: 'aero-canvas-container',

  defaultEra: 'xp',

  eraFactories: {
    xp: createXpBliss,
    web2: createWeb2Gloss,
    vista: createVistaGlass,
    skeuo: createSkeuoDial,
    flat: createFlatCollapse,
    neo: createNeoAero,
    dark: createDarkAero,
aurora: createFrutigerAurora,
metalheart: createMetalheart,
  galaxy: createFrutigerGalaxy,
    dorfic: createDorfic,
        garden: createVectorGarden,
    darkmetro: createDarkMetro,
        abla: createAblaAero,
    futurism: createFuturismAero,
    paleo: createFrutigerPaleo,
    aqua: createHelveticaAqua,
    windowsaero: createWindowsAero,
    flourish: createVectorFlourish,
    tertiaries: createBrightTertiaries,
    urbling: createUrbling,
    abstracttech: createAbstractTech,
    cleancore: createCleancore,



  }
});
