// js/canvas/webcore.js
import { createExperienceViewer } from './experience-viewer.js';

import { createOldWeb }         from '../aesthetics/webcore/old.js';      // was old-web.js
import { createLiminalPoolcore } from '../aesthetics/webcore/poolcore.js'; // was liminal-poolcore.js
import { createZineRisograph }
  from '../aesthetics/webcore/zine-risograph.js';

// Moved in from other families
import { createDreamcore }
  from '../aesthetics/webcore/dreamcore.js';       // was dark/dreamcore.js
import { createWeirdcore }
  from '../aesthetics/webcore/weirdcore.js';       // was dark/weirdcore.js
import { createWebcoreCyberia }
  from '../aesthetics/webcore/cyberia.js';         // was vaporwave/webcore-cyberia.js

createExperienceViewer({
  containerId: 'webcore-canvas-container',

  defaultEra: 'oldweb',

  eraFactories: {
    oldweb: createOldWeb,
    zine: createZineRisograph,
    dream: createDreamcore,
    weird: createWeirdcore,
    poolcore: createLiminalPoolcore,
    cyberia: createWebcoreCyberia,
  }
});