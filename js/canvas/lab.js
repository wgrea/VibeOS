// js/lab-canvas.js
import { createExperienceViewer } from './experience-viewer.js';

import { createGlam } from '../aesthetics/lab/glam.js';
import { createLatexPvc } from '../aesthetics/lab/latex-pvc.js';
import { createSnowsuit } from '../aesthetics/lab/snowsuit.js';
import { createJumpsuit } from '../aesthetics/lab/jumpsuit.js';

createExperienceViewer({
  containerId: 'lab-canvas-container',
  defaultEra: 'glam',
  eraFactories: {
    glam: createGlam,
    'latex-pvc': createLatexPvc,
    snowsuit: createSnowsuit,
    jumpsuit: createJumpsuit,
  },
});
