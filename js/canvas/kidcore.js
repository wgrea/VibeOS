// js/canvas/kidcore-canvas.js
import { createExperienceViewer } from './experience-viewer.js';

import { createKidCandy } from '../aesthetics/kidcore/kid-candy.js';
import { createKawaii } from '../aesthetics/kidcore/kawaii.js';
import { createPolynesianTropical } from '../aesthetics/kidcore/polynesian-tropical.js';
import { createToyurism } from '../aesthetics/kidcore/toyurism.js';
import { createDinosaur } from '../aesthetics/kidcore/dinosaur.js';
import { createImaginarium } from '../aesthetics/kidcore/imaginarium.js';
import { createWhimsical } from '../aesthetics/kidcore/whimsical.js';
import { createUtopianScholastic } from '../aesthetics/kidcore/utopian-scholastic.js';
import { createHeisei } from '../aesthetics/kidcore/heisei.js';

createExperienceViewer({
  containerId: 'kidcore-canvas-container',
  defaultEra: 'kid-candy',
  eraFactories: {
    'kid-candy': createKidCandy,
    kawaii: createKawaii,
    'polynesian-tropical': createPolynesianTropical,
    toyurism: createToyurism,
    dinosaur: createDinosaur,
    imaginarium: createImaginarium,
    whimsical: createWhimsical,
    'utopian-scholastic': createUtopianScholastic,
    heisei: createHeisei,
  },
});
