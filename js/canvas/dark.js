// js/dark-canvas.js
import { createExperienceViewer } from './experience-viewer.js';

import { createDreamcore } from '../aesthetics/dark/dreamcore.js';
import { createWeirdcore } from '../aesthetics/dark/weirdcore.js';
import { createCornfield } from '../aesthetics/dark/cornfield.js';
import { createCarnival } from '../aesthetics/dark/carnival.js';
import { createWitch } from '../aesthetics/dark/witch.js';
import { createScammer } from '../aesthetics/dark/scammer.js';
import { createCaptchacore } from '../aesthetics/dark/captchacore.js';
import { createBastardcore } from '../aesthetics/dark/bastardcore.js';
import { createCybercore } from '../aesthetics/dark/cybercore.js';
import { createGybercore } from '../aesthetics/dark/gybercore.js';
import { createGrunge } from '../aesthetics/dark/grunge.js';
import { createEmo } from '../aesthetics/dark/emo.js';

createExperienceViewer({
  containerId: 'dark-canvas-container',
  defaultEra: 'dream-weird',
  eraFactories: {
    dreamcore: createDreamcore,
    weirdcore: createWeirdcore,
    cornfield: createCornfield,
    carnival: createCarnival,
    witch: createWitch,
    scammer: createScammer,
    captchacore: createCaptchacore,
    bastardcore: createBastardcore,
    cybercore: createCybercore,
    gybercore: createGybercore,
    grunge: createGrunge,
    emo: createEmo
  },
});
