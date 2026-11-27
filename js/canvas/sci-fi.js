// js/canvas/sci-fi.js
import { createExperienceViewer } from './experience-viewer.js';

import { createCyberpunk }
  from '../aesthetics/sci-fi/cyberpunk.js';
import { createCassetteFuturism }
  from '../aesthetics/sci-fi/cassette-futurism.js';
import { createSolarpunk }
  from '../aesthetics/sci-fi/solarpunk.js';

// Moved in from other families
import { createCybercore }
  from '../aesthetics/sci-fi/cybercore.js';          // was dark/cybercore.js
import { createDieselpunkSprite }
  from '../aesthetics/sci-fi/dieselpunk-sprite.js';  // was gaming/dieselpunk-sprite.js

createExperienceViewer({
  containerId: 'sci-fi-canvas-container',

  defaultEra: 'cyberpunk',

  eraFactories: {
    cyberpunk: createCyberpunk,
    cassette: createCassetteFuturism,
    solarpunk: createSolarpunk,
    cybercore: createCybercore,
    dieselpunk: createDieselpunkSprite,
  }
});