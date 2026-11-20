// js/dark-canvas.js
import { createExperienceViewer } from './experience-viewer.js';

import { createDreamWeird } from '../aesthetics/dark/dream-weird.js';
import { createHorrorCornfield } from '../aesthetics/dark/horror-cornfield.js';
import { createHorrorCarnival } from '../aesthetics/dark/horror-carnival.js';
import { createWitchSpiritual } from '../aesthetics/dark/witch-spiritual.js';
import { createScammer } from '../aesthetics/dark/scammer.js';
import { createCaptchacore } from '../aesthetics/dark/captchacore.js';
import { createCybercore } from '../aesthetics/dark/cybercore.js';
import { createGrungeEmo } from '../aesthetics/dark/grunge-emo.js';

createExperienceViewer({
  containerId: 'dark-canvas-container',
  defaultEra: 'dream-weird',
  eraFactories: {
    'dream-weird': createDreamWeird,
    'horror-cornfield': createHorrorCornfield,
    'horror-carnival': createHorrorCarnival,
    'witch-spiritual': createWitchSpiritual,
    scammer: createScammer,
    captchacore: createCaptchacore,
    cybercore: createCybercore,
    'grunge-emo': createGrungeEmo,
  },
});
