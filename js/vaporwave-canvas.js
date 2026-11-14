// js/vaporwave-canvas.js
import { createExperienceViewer }
  from './experience-viewer.js';

import { createEccojams }
  from './aesthetics/vaporwave/eccojams.js';

import { createFloralShoppe }
  from './aesthetics/vaporwave/floral-shoppe.js';

import { createMallsoft }
  from './aesthetics/vaporwave/mallsoft.js';

import { createFutureFunk }
  from './aesthetics/vaporwave/future-funk.js';

import { createSlushwave }
  from './aesthetics/vaporwave/slushwave.js';

import { createUtopianVirtual }
  from './aesthetics/vaporwave/utopian-virtual.js';

import { createLiminalPoolcore }
  from './aesthetics/vaporwave/liminal-poolcore.js';

import { createBrokenTransmission } from './aesthetics/vaporwave/broken-transmission.js';
import { createDreampunk } from './aesthetics/vaporwave/dreampunk.js';

import { createLateNightLofi }
  from './aesthetics/vaporwave/late-night-lofi.js';

import { createDolphin }
  from './aesthetics/vaporwave/dolphin.js';
  import { createVaportrap }
  from './aesthetics/vaporwave/vaportrap.js';

import { createSimpsonswave }
  from './aesthetics/vaporwave/simpsonswave.js';
import { createFauxUtopian }
  from './aesthetics/vaporwave/faux-utopian.js';

import { createHardvapour }
  from './aesthetics/vaporwave/hardvapour.js';

import { createVhsPop }
  from './aesthetics/vaporwave/vhs-pop.js';

import { createOceanGrunge }
  from './aesthetics/vaporwave/ocean-grunge.js';
import { createBarberBeats }
  from './aesthetics/vaporwave/barber-beats.js';

import { createHypnagogicDrift }
  from './aesthetics/vaporwave/hypnagogic-drift.js';

import { createVaporTwitch }
  from './aesthetics/vaporwave/vapor-twitch.js';

import { createWebcoreCyberia }
  from './aesthetics/vaporwave/webcore-cyberia.js';
import { createPhonk }
  from './aesthetics/vaporwave/phonk.js';

import { createVoidgaze }
  from './aesthetics/vaporwave/voidgaze.js';

import { createDariacore }
  from './aesthetics/vaporwave/dariacore.js';

import { createHexd }
  from './aesthetics/vaporwave/hexd.js';

import { createKrushclub }
  from './aesthetics/vaporwave/krushclub.js';

import { createPluggnb }
  from './aesthetics/vaporwave/pluggnb.js';

import { createPromptCore }
  from './aesthetics/vaporwave/prompt-core.js';

import { createGhostPop }
  from './aesthetics/vaporwave/ghost-pop.js';


createExperienceViewer({
  containerId: 'vaporwave-canvas-container',

  defaultEra: 'eccojams',

  allowFirstPerson: true,

  eraFactories: {
    eccojams: createEccojams,
    floral: createFloralShoppe,
    mallsoft: createMallsoft,
    futurefunk: createFutureFunk,
    slushwave: createSlushwave,
    utopian: createUtopianVirtual,
    poolcore: createLiminalPoolcore,
signalwave: createBrokenTransmission,
dreampunk: createDreampunk,
    lofi: createLateNightLofi,
    dolphin: createDolphin,
        vaportrap: createVaportrap,
    simpsonswave: createSimpsonswave,
        fauxutopian: createFauxUtopian,
    hardvapour: createHardvapour,
    vhspop: createVhsPop,
    oceangrunge: createOceanGrunge,
        barberbeats: createBarberBeats,
    hypnagogic: createHypnagogicDrift,
    vaportwitch: createVaporTwitch,
    webcore: createWebcoreCyberia,
        phonk: createPhonk,
    voidgaze: createVoidgaze,
    dariacore: createDariacore,
    hexd: createHexd,
        krushclub: createKrushclub,
    pluggnb: createPluggnb,
    promptcore: createPromptCore,
    ghostpop: createGhostPop,





  }
});
