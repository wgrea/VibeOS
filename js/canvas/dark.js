// js/dark-canvas.js
import { createExperienceViewer } from './experience-viewer.js';

import { createCornfield } from '../aesthetics/dark/cornfield.js';
import { createCarnival } from '../aesthetics/dark/carnival.js';
import { createWitch } from '../aesthetics/dark/witch.js';
import { createScammer } from '../aesthetics/dark/scammer.js';
import { createCaptchacore } from '../aesthetics/dark/captchacore.js';
import { createBastardcore } from '../aesthetics/dark/bastardcore.js';
import { createGybercore } from '../aesthetics/dark/gybercore.js';
import { createGrunge } from '../aesthetics/dark/grunge.js';
import { createEmo } from '../aesthetics/dark/emo.js';
import { createSurveillance } from '../aesthetics/dark/surveillance.js';
import { createCCTVcore } from '../aesthetics/dark/cctvcore.js';


createExperienceViewer({
  containerId: 'dark-canvas-container',
  defaultEra: 'cornfield',
  eraFactories: {
    cornfield: createCornfield,
    carnival: createCarnival,
    witch: createWitch,
    scammer: createScammer,
    captchacore: createCaptchacore,
    bastardcore: createBastardcore,
    gybercore: createGybercore,
    grunge: createGrunge,
    emo: createEmo,
    surveillance: createSurveillance,
    cctv: createCCTVcore
  },
});
