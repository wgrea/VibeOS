// aesthetics/lab/dj/pads/synth/index.js
// Audio Engine & Envelope Router
import { RETRO_VOICES } from './retroVoices.js';
import { MODERN_VOICES } from './modernVoices.js';
import { SHARED_VOICES } from './sharedVoices.js';

const ALL_VOICES = {
  ...RETRO_VOICES,
  ...MODERN_VOICES,
  ...SHARED_VOICES
};

// One-shot sounds that should finish naturally instead of cutting off early on keyup
const ONE_SHOT_TYPES = new Set([
  'gbBomb', 'gbFuse', 'gbNoiseHit', 'arcadeJump', 'arcadeZap', 'arcadeWarp',
  'coin', 'powerup', 'bomb8', 'kick', 'snare', 'hihat', 'tom', 'laser', 'drop'
]);

export function createSynthEngine() {
  let ctx = null;
  let masterOut = null;
  let whiteNoiseBuffer = null;
  let gbNoiseBuffer = null;

  function ensureContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioCtx();

      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-16, ctx.currentTime);
      compressor.knee.setValueAtTime(18, ctx.currentTime);
      compressor.ratio.setValueAtTime(6, ctx.currentTime);
      compressor.attack.setValueAtTime(0.005, ctx.currentTime);
      compressor.release.setValueAtTime(0.15, ctx.currentTime);

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(1.18, ctx.currentTime);

      compressor.connect(masterGain);
      masterGain.connect(ctx.destination);
      masterOut = compressor;

      const sr = ctx.sampleRate;

      whiteNoiseBuffer = ctx.createBuffer(1, sr, sr);
      const wData = whiteNoiseBuffer.getChannelData(0);
      for (let i = 0; i < sr; i++) {
        wData[i] = Math.random() * 2 - 1;
      }

      gbNoiseBuffer = ctx.createBuffer(1, sr, sr);
      const gData = gbNoiseBuffer.getChannelData(0);
      let hold = 1;
      for (let i = 0; i < sr; i++) {
        if (i % 18 === 0) hold = Math.random() > 0.5 ? 1 : -1;
        gData[i] = hold;
      }
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Starts a note and returns a release() callback to stop it when the key/mouse lifts
  function startNote(pad) {
    if (!pad) return () => {};
    const handler = ALL_VOICES[pad.type];
    if (!handler) return () => {};

    const ac = ensureContext();
    const isOneShot = ONE_SHOT_TYPES.has(pad.type);

    // Create a dedicated envelope node for sustained notes so holding keeps it alive
    const noteGain = ac.createGain();
    noteGain.gain.setValueAtTime(1, ac.currentTime);
    noteGain.connect(masterOut);

    // Give sustained notes up to 8 seconds max hold time; one-shots use their normal duration
    const holdDur = isOneShot ? (pad.dur || 0.35) : 8.0;

    handler({
      ac,
      masterOut: noteGain,
      whiteNoiseBuffer,
      gbNoiseBuffer,
      pad,
      now: ac.currentTime,
      dur: holdDur,
      isSustained: !isOneShot
    });

    let released = false;
    return function releaseNote() {
      if (released || isOneShot) return;
      released = true;

      const t = ac.currentTime;
      noteGain.gain.cancelScheduledValues(t);
      noteGain.gain.setValueAtTime(noteGain.gain.value, t);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      setTimeout(() => {
        noteGain.disconnect();
      }, 160);
    };
  }

  function close() {
    if (ctx && ctx.state !== 'closed') {
      ctx.close().catch(() => {});
    }
  }

  return { startNote, close };
}
