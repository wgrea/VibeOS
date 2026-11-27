// js/vaporwave-canvas.js
import { createExperienceViewer }
  from './experience-viewer.js';

import { createEccojams }
  from '../aesthetics/vaporwave/eccojams.js';

import { createFloralShoppe }
  from '../aesthetics/vaporwave/floral-shoppe.js';

import { createMallsoft }
  from '../aesthetics/vaporwave/mallsoft/index.js';

import { createFutureFunk }
  from '../aesthetics/vaporwave/future-funk.js';

import { createSlushwave }
  from '../aesthetics/vaporwave/slushwave.js';

import { createUtopianVirtual }
  from '../aesthetics/vaporwave/utopian-virtual.js';


import { createBrokenTransmission } from '../aesthetics/vaporwave/broken-transmission.js';
import { createDreampunk } from '../aesthetics/vaporwave/dreampunk.js';

import { createLateNightLofi }
  from '../aesthetics/vaporwave/late-night-lofi.js';

import { createDolphin }
  from '../aesthetics/vaporwave/dolphin.js';
  import { createVaportrap }
  from '../aesthetics/vaporwave/vaportrap.js';

import { createSimpsonswave }
  from '../aesthetics/vaporwave/simpsonswave.js';
import { createFauxUtopian }
  from '../aesthetics/vaporwave/faux-utopian.js';

import { createHardvapour }
  from '../aesthetics/vaporwave/hardvapour.js';

import { createVhsPop }
  from '../aesthetics/vaporwave/vhs-pop.js';

import { createOceanGrunge }
  from '../aesthetics/vaporwave/ocean-grunge.js';
import { createBarberBeats }
  from '../aesthetics/vaporwave/barber-beats.js';

import { createHypnagogicDrift }
  from '../aesthetics/vaporwave/hypnagogic-drift.js';

import { createVaporTwitch }
  from '../aesthetics/vaporwave/vapor-twitch.js';

import { createPhonk }
  from '../aesthetics/vaporwave/phonk.js';

import { createVoidgaze }
  from '../aesthetics/vaporwave/voidgaze.js';

import { createDariacore }
  from '../aesthetics/vaporwave/dariacore.js';

import { createHexd }
  from '../aesthetics/vaporwave/hexd.js';

import { createKrushclub }
  from '../aesthetics/vaporwave/krushclub.js';

import { createPluggnb }
  from '../aesthetics/vaporwave/pluggnb.js';

import { createPromptCore }
  from '../aesthetics/vaporwave/prompt-core.js';
  import { createScenecore } from '../aesthetics/vaporwave/scenecore.js';
import { createSlopwave }  from '../aesthetics/vaporwave/slopwave.js';

import { createGhostPop }
  from '../aesthetics/vaporwave/ghost-pop.js';
import { createCorecore } from '../aesthetics/vaporwave/corecore.js';

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
        phonk: createPhonk,
    voidgaze: createVoidgaze,
    dariacore: createDariacore,
    hexd: createHexd,
    pluggnb: createPluggnb,
    ghostpop: createGhostPop,
    corecore: createCorecore,
    krushclub:  createKrushclub,     // data-era="krushclub"
scenecore:  createScenecore,     // data-era="scenecore"
promptcore: createPromptCore,    // data-era="promptcore"
slopwave:   createSlopwave,      // data-era="slopwave"





  }
});


// --- Vaporwave Canvas Audio Controller (Scoped Strictly to Vaporwave) ---
const VAPORWAVE_TUNES = {
  mallsoft: new URL('../../tunes/mallsoft.mp3', import.meta.url).href,
};


// Reuse singleton audio player so tracks never overlap across families or HTMX swaps
if (!window.__vibeAudio) {
  window.__vibeAudio = new Audio();
  window.__vibeAudio.loop = true;
  window.__vibeAudio.volume = 0.5;
}
const vibeAudio = window.__vibeAudio;

function stopVaporwaveAudio() {
  if (!window.__vibeAudioOwner || window.__vibeAudioOwner === 'vaporwave') {
    vibeAudio.pause();
    vibeAudio.currentTime = 0;
    vibeAudio.removeAttribute('src');
    vibeAudio.load();
    window.__vibeTargetUrl = '';
  }
}

function playVaporwaveTrack(trackUrl) {
  window.__vibeAudioOwner = 'vaporwave';

  if (!trackUrl) {
    stopVaporwaveAudio();
    return;
  }

  if (window.__vibeTargetUrl !== trackUrl) {
    vibeAudio.pause();
    vibeAudio.currentTime = 0;
    window.__vibeTargetUrl = trackUrl;
    vibeAudio.src = trackUrl;
  }

  vibeAudio.play().catch(() => {
    // Unlocks on first pointerdown/keydown after a hard F5 refresh
  });
}

function syncVaporwaveAudio() {
  const vaporwaveSection = document.querySelector('.aesthetic-section[data-family="vaporwave"]');
  if (!vaporwaveSection) {
    stopVaporwaveAudio();
    return;
  }

  const activePill = vaporwaveSection.querySelector('.era-pill.active[data-era]');
  const eraSlug = activePill ? activePill.dataset.era : '';
  playVaporwaveTrack(VAPORWAVE_TUNES[eraSlug] || '');
}

// Unlock audio on first click/drag/keypress if refreshed directly on the Vaporwave page
if (!window.__vibeAudioUnlockBound) {
  window.__vibeAudioUnlockBound = true;
  const unlock = () => {
    if (window.__vibeTargetUrl && vibeAudio.paused) {
      vibeAudio.play().catch(() => {});
    }
  };
  window.addEventListener('pointerdown', unlock, { passive: true });
  window.addEventListener('keydown', unlock, { passive: true });
}

const vaporwaveObserver = new MutationObserver(() => syncVaporwaveAudio());

function attachVaporwaveObserver() {
  const pillBar = document.querySelector('.aesthetic-section[data-family="vaporwave"] .era-pill-bar');
  if (!pillBar) return;
  vaporwaveObserver.disconnect();
  vaporwaveObserver.observe(pillBar, {
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  });
}

attachVaporwaveObserver();
syncVaporwaveAudio();

document.addEventListener('click', (e) => {
  if (e.target.closest('.aesthetic-section[data-family="vaporwave"]')) {
    requestAnimationFrame(syncVaporwaveAudio);
  }
});

document.addEventListener('htmx:beforeSwap', () => {
  stopVaporwaveAudio();
});

document.addEventListener('htmx:afterSwap', () => {
  attachVaporwaveObserver();
  syncVaporwaveAudio();
});
