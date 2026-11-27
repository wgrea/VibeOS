// js/canvas/y2k.js
import { createExperienceViewer } from './experience-viewer.js';

import { createCyberY2k } from '../aesthetics/y2k/cyber.js';
import { createY2kArena } from '../aesthetics/y2k/arena.js';
import { createMcBling } from '../aesthetics/y2k/mcbling.js';

createExperienceViewer({
  containerId: 'y2k-canvas-container',

  defaultEra: 'cyber',

  eraFactories: {
    cyber: createCyberY2k,
    arena: createY2kArena,
    mcbling: createMcBling,
  },
});

// --- Y2K Canvas Audio Controller (Scoped Strictly to Y2K) ---
const ERA_TUNES = {
  'arena': new URL('../../tunes/y2karena.mp3', import.meta.url).href,
  // future tracks keyed by the same data-era slugs above:
  // cyber:   new URL('../../tunes/y2k-cyber.mp3', import.meta.url).href,
  // mcbling: new URL('../../tunes/y2k-mcbling.mp3', import.meta.url).href,
};

// Shared singleton audio player so menu & family canvases never overlap
if (!window.__vibeAudio) {
  window.__vibeAudio = new Audio();
  window.__vibeAudio.loop = true;
  window.__vibeAudio.volume = 0.5;
}
const vibeAudio = window.__vibeAudio;

function stopY2kAudio() {
  if (!window.__vibeAudioOwner || window.__vibeAudioOwner === 'y2k') {
    vibeAudio.pause();
    vibeAudio.currentTime = 0;
    vibeAudio.removeAttribute('src');
    vibeAudio.load();
    window.__vibeTargetUrl = '';
  }
}

function playY2kTrack(trackUrl) {
  window.__vibeAudioOwner = 'y2k';

  if (!trackUrl) {
    stopY2kAudio();
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

function syncY2kAudio() {
  const y2kSection = document.querySelector('.aesthetic-section[data-family="y2k"]');
  if (!y2kSection) {
    stopY2kAudio();
    return;
  }

  const activePill = y2kSection.querySelector('.era-pill.active[data-era]');
  const eraSlug = activePill ? activePill.dataset.era : '';
  playY2kTrack(ERA_TUNES[eraSlug] || '');
}

// Unlock audio on first click/drag/keypress if refreshed directly on the Y2K page
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

const y2kPillObserver = new MutationObserver(() => syncY2kAudio());

function attachY2kObserver() {
  const pillBar = document.querySelector('.aesthetic-section[data-family="y2k"] .era-pill-bar');
  if (!pillBar) return;
  y2kPillObserver.disconnect();
  y2kPillObserver.observe(pillBar, {
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  });
}

attachY2kObserver();
syncY2kAudio();

document.addEventListener('click', (e) => {
  if (e.target.closest('.aesthetic-section[data-family="y2k"]')) {
    requestAnimationFrame(syncY2kAudio);
  }
});

document.addEventListener('htmx:beforeSwap', () => {
  stopY2kAudio();
});

document.addEventListener('htmx:afterSwap', () => {
  attachY2kObserver();
  syncY2kAudio();
});