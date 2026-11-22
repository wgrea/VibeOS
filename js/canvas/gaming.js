// js/gaming-canvas.js
import { createExperienceViewer } from './experience-viewer.js';

import { createNeoGeoStreet } from '../aesthetics/gaming/neo-geo-street.js';
import { createDieselpunkSprite } from '../aesthetics/gaming/dieselpunk-sprite.js';
import { createY2kArena } from '../aesthetics/gaming/y2k-arena.js';
import { createY2k } from '../aesthetics/gaming/y2k.js';
import { create2000sFps } from '../aesthetics/gaming/2000s-fps.js';
import { createViceCity } from '../aesthetics/gaming/vice-city.js';
import { createSanAndreas } from '../aesthetics/gaming/san-andreas.js';
import { createPhysicalMedia } from '../aesthetics/gaming/physical-media.js';
import { create2019Ambience } from '../aesthetics/gaming/2019-ambience.js';

createExperienceViewer({
  containerId: 'gaming-canvas-container',
  defaultEra: 'neo-geo-street',
  eraFactories: {
    'neo-geo-street': createNeoGeoStreet,
    'dieselpunk-sprite': createDieselpunkSprite,
    'y2k-arena': createY2kArena,
    y2k: createY2k,
    '2000s-fps': create2000sFps,
        'vice-city': createViceCity,
    'san-andreas': createSanAndreas,
    'physical-media': createPhysicalMedia,
    '2019-ambience': create2019Ambience,
  },
});
// --- Gaming Canvas Audio Controller (Scoped Strictly to Gaming) ---
const ERA_TUNES = {
  'y2k-arena': new URL('../../tunes/y2karena.mp3', import.meta.url).href,
  // More for 2019-ambience and mallsoft y2k: new URL('../../tunes/y2k.mp3', import.meta.url).href,
};

// Shared singleton audio player so menu & family canvases never overlap
if (!window.__vibeAudio) {
  window.__vibeAudio = new Audio();
  window.__vibeAudio.loop = true;
  window.__vibeAudio.volume = 0.5;
}
const vibeAudio = window.__vibeAudio;

function stopGamingAudio() {
  if (!window.__vibeAudioOwner || window.__vibeAudioOwner === 'gaming') {
    vibeAudio.pause();
    vibeAudio.currentTime = 0;
    vibeAudio.removeAttribute('src');
    vibeAudio.load();
    window.__vibeTargetUrl = '';
  }
}

function playGamingTrack(trackUrl) {
  window.__vibeAudioOwner = 'gaming';

  if (!trackUrl) {
    stopGamingAudio();
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

function syncGamingAudio() {
  const gamingSection = document.querySelector('.aesthetic-section[data-family="gaming"]');
  if (!gamingSection) {
    stopGamingAudio();
    return;
  }

  const activePill = gamingSection.querySelector('.era-pill.active[data-era]');
  const eraSlug = activePill ? activePill.dataset.era : '';
  playGamingTrack(ERA_TUNES[eraSlug] || '');
}

// Unlock audio on first click/drag/keypress if refreshed directly on the Gaming page
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

const pillObserver = new MutationObserver(() => syncGamingAudio());

function attachGamingObserver() {
  const pillBar = document.querySelector('.aesthetic-section[data-family="gaming"] .era-pill-bar');
  if (!pillBar) return;
  pillObserver.disconnect();
  pillObserver.observe(pillBar, {
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  });
}

attachGamingObserver();
syncGamingAudio();

document.addEventListener('click', (e) => {
  if (e.target.closest('.aesthetic-section[data-family="gaming"]')) {
    requestAnimationFrame(syncGamingAudio);
  }
});

document.addEventListener('htmx:beforeSwap', () => {
  stopGamingAudio();
});

document.addEventListener('htmx:afterSwap', () => {
  attachGamingObserver();
  syncGamingAudio();
});
