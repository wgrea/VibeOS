// js/gaming-canvas.js
import { createExperienceViewer } from './experience-viewer.js';

import { createNeoGeoStreet } from './aesthetics/gaming/neo-geo-street.js';
import { createDieselpunkSprite } from './aesthetics/gaming/dieselpunk-sprite.js';
import { createY2kArena } from './aesthetics/gaming/y2k-arena.js';
import { createY2k } from './aesthetics/gaming/y2k.js';
import { create2000sFps } from './aesthetics/gaming/2000s-fps.js';
import { createSegaTribute } from './aesthetics/gaming/sega-tribute.js';
import { createPhysicalMedia } from './aesthetics/gaming/physical-media.js';
import { create2019Ambience } from './aesthetics/gaming/2019-ambience.js';

createExperienceViewer({
  containerId: 'gaming-canvas-container',
  defaultEra: 'neo-geo-street',
  eraFactories: {
    'neo-geo-street': createNeoGeoStreet,
    'dieselpunk-sprite': createDieselpunkSprite,
    'y2k-arena': createY2kArena,
    y2k: createY2k,
    '2000s-fps': create2000sFps,
    'sega-tribute': createSegaTribute,
    'physical-media': createPhysicalMedia,
    '2019-ambience': create2019Ambience,
  },
});
