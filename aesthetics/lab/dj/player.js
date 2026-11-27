// aesthetics/lab/dj/player.js
// 3D Music Player Deck
import * as THREE from 'three';
import { TRACKS } from './tracks.js';

// Filter tracks for the DJ deck (or include all TRACKS if you want Jukebox tracks here too)
const DECK_TUNES = TRACKS;

function makeButtonTexture(symbol, bgHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 256, 128);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol, 128, 66);

  return new THREE.CanvasTexture(canvas);
}

// Singleton audio state so re-entering the page never spawns a second Audio instance
function getAudioSingleton() {
  if (!window.__vibeDjAudio) {
    const audio = new Audio(DECK_TUNES.src);
    audio.loop = true;
    window.__vibeDjAudio = {
      audio,
      trackIndex: 0,
      audioCtx: null,
      analyser: null,
      freqData: null
    };
  }
  return window.__vibeDjAudio;
}

export function createPlayer({ camera, domElement, box } = {}) {
  const state = getAudioSingleton();
  const { audio } = state;

  // Clean up any leftover listeners from a previous mount
  if (state.cleanupController) {
    state.cleanupController.abort();
  }
  const controller = new AbortController();
  state.cleanupController = controller;
  const { signal } = controller;

  const group = new THREE.Group();
  const buttons = [];
  let isActiveEra = false;

  function ensureAudioGraph() {
    if (state.audioCtx) {
      if (state.audioCtx.state === 'suspended') state.audioCtx.resume();
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    state.audioCtx = new AudioCtx();
    const source = state.audioCtx.createMediaElementSource(audio);
    state.analyser = state.audioCtx.createAnalyser();
    state.analyser.fftSize = 64;
    state.freqData = new Uint8Array(state.analyser.frequencyBinCount);
    source.connect(state.analyser);
    state.analyser.connect(state.audioCtx.destination);
  }

  // 1. 3D Player Deck Body
  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.22, 2.0),
    new THREE.MeshPhysicalMaterial({ color: 0x0f172a, roughness: 0.2, clearcoat: 0.9 })
  );
  group.add(deck);

  // 2. Spinning Vinyl / CD Disc
  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 0.04, 32),
    new THREE.MeshPhysicalMaterial({ color: 0x111827, roughness: 0.15, clearcoat: 1.0 })
  );
  disc.position.set(-0.6, 0.14, 0.05);
  group.add(disc);

  // 3. 3D LCD Screen on Deck
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 256;
  screenCanvas.height = 64;
  const screenCtx = screenCanvas.getContext('2d');
  const screenTex = new THREE.CanvasTexture(screenCanvas);

  function updateScreen(isPlaying = !audio.paused) {
    const currentTune = DECK_TUNES[state.trackIndex] || DECK_TUNES[0];
    screenCtx.fillStyle = '#020617';
    screenCtx.fillRect(0, 0, 256, 64);
    screenCtx.strokeStyle = '#38bdf8';
    screenCtx.lineWidth = 4;
    screenCtx.strokeRect(2, 2, 252, 60);

    screenCtx.fillStyle = isPlaying ? '#34d399' : '#38bdf8';
    screenCtx.font = 'bold 20px monospace';
    screenCtx.textAlign = 'center';
    screenCtx.textBaseline = 'middle';
    const prefix = isPlaying ? '▶ ' : '❚❚ ';
    screenCtx.fillText(`${prefix}${currentTune.title.toUpperCase()}`, 128, 33);
    screenTex.needsUpdate = true;
  }

  // 4. Single 3D Play / Pause Button on Deck
  const playMat = new THREE.MeshStandardMaterial({
    map: makeButtonTexture('▶ / ❚❚', '#059669'),
    emissive: 0x10b981,
    emissiveIntensity: audio.paused ? 0.25 : 1.1
  });
  const playBtn = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.15, 0.42), playMat);
  playBtn.position.set(0.58, 0.17, 0.46);
  playBtn.userData = { action: 'play', baseY: playBtn.position.y };
  group.add(playBtn);
  buttons.push(playBtn);

  const screenMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.18, 0.06, 0.34),
    new THREE.MeshBasicMaterial({ map: screenTex })
  );
  screenMesh.position.set(0.58, 0.14, -0.64);
  group.add(screenMesh);

  // 5. 3D Beat-Reactive Equalizer Bars
  const eqBars = [];
  for (let i = 0; i < 6; i++) {
    const barMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      emissive: 0xf472b6,
      emissiveIntensity: 0.5
    });
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.38, 0.13), barMat);
    bar.position.set(0.16 + i * 0.17, 0.28, -0.1);
    group.add(bar);
    eqBars.push(bar);
  }

  group.rotation.x = 0.42;
  updateScreen(!audio.paused);

  // 6. Populate Song Dropdown Menu in #lab-stage
  const section = box?.closest('.aesthetic-section') || document;
  const djControls = section.querySelector('#dj-controls');
  const trackSelect = section.querySelector('#dj-track-select');

  if (trackSelect) {
    trackSelect.innerHTML = DECK_TUNES.map((tune, i) => {
      const note = tune.jukeboxOnly ? 'Jukebox Only' : `Played in ${tune.locationLabel}`;
      const selected = i === state.trackIndex ? 'selected' : '';
      return `<option value="${i}" ${selected}>${tune.title} — ${note}</option>`;
    }).join('');


    trackSelect.addEventListener('change', (e) => {
      ensureAudioGraph();
      state.trackIndex = Number(e.target.value);
      const wasPlaying = !audio.paused;
      audio.src = DECK_TUNES[state.trackIndex].src;

      if (wasPlaying) {
        audio.play();
        playMat.emissiveIntensity = 1.1;
        updateScreen(true);
      } else {
        updateScreen(false);
      }
    }, { signal });
  }

  // 7. Raycast Clicks on the 3D Play/Pause Button
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  domElement?.addEventListener('pointerdown', (e) => {
    if (!isActiveEra) return;
    const rect = domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(buttons, false);
    if (hits.length > 0) {
      ensureAudioGraph();
      playBtn.position.y = playBtn.userData.baseY - 0.05;
      setTimeout(() => { playBtn.position.y = playBtn.userData.baseY; }, 160);

      if (audio.paused) {
        audio.play();
        playMat.emissiveIntensity = 1.1;
        updateScreen(true);
      } else {
        audio.pause();
        playMat.emissiveIntensity = 0.25;
        updateScreen(false);
      }
    }
  }, { signal });

  // 8. Stop audio & clean up listeners when navigating away via HTMX
  function stopAndCleanup() {
    if (!audio.paused) {
      audio.pause();
    }
    playMat.emissiveIntensity = 0.25;
    updateScreen(false);
    controller.abort();
  }

  document.body.addEventListener('htmx:beforeSwap', stopAndCleanup, { signal });
  window.addEventListener('pagehide', stopAndCleanup, { signal });

  return {
    group,
    onSelect(isActive) {
      isActiveEra = isActive;
      if (djControls) djControls.hidden = !isActive;

      if (!isActive && !audio.paused) {
        audio.pause();
        playMat.emissiveIntensity = 0.25;
        updateScreen(false);
      } else {
        updateScreen(!audio.paused);
      }
    },
    update(t, bounce, spring) {
      group.position.y = spring * 0.1;
      if (!audio.paused && state.analyser) {
        disc.rotation.y = -t * 2.5;
        state.analyser.getByteFrequencyData(state.freqData);
        eqBars.forEach((bar, i) => {
          const val = (state.freqData[i * 2] || 0) / 255;
          bar.scale.y = Math.max(0.15, val * 1.6);
        });
      } else {
        eqBars.forEach((bar) => { bar.scale.y = 0.2; });
      }
    }
  };
}
