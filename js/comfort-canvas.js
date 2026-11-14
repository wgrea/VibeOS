// js/comfort-canvas.js
import { createExperienceViewer } from './experience-viewer.js';

import { createSlowcore } from './aesthetics/comfort/slowcore.js';
import { createCottagecore } from './aesthetics/comfort/cottagecore.js';
import { createCabincore } from './aesthetics/comfort/cabincore.js';
import { createBloomcore } from './aesthetics/comfort/bloomcore.js';
import { createCloudcore } from './aesthetics/comfort/cloudcore.js';
import { createBoutiqueLounge } from './aesthetics/comfort/boutique-lounge.js';
import { createPlazaAvatar } from './aesthetics/comfort/plaza-avatar.js';
import { createCorpCore } from './aesthetics/comfort/corp-core.js';

createExperienceViewer({
  containerId: 'comfort-canvas-container',
  defaultEra: 'slowcore',
  eraFactories: {
    slowcore: createSlowcore,
    cottagecore: createCottagecore,
    cabincore: createCabincore,
    bloomcore: createBloomcore,
    cloudcore: createCloudcore,
    boutique: createBoutiqueLounge,
    plaza: createPlazaAvatar,
    corp: createCorpCore
  }
});
