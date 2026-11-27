// js/canvas/indie-sleaze.js
import { createExperienceViewer } from './experience-viewer.js';

import { createClubSleaze }   from '../aesthetics/indie-sleaze/club.js';
import { createTumblrMySpace } from '../aesthetics/indie-sleaze/tumblr-myspace.js';

createExperienceViewer({
  containerId: 'indie-sleaze-canvas-container',

  defaultEra: 'club',

  eraFactories: {
    club:   createClubSleaze,
    tumblr: createTumblrMySpace,
  }
});