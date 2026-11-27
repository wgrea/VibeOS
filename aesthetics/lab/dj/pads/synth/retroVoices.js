// aesthetics/lab/dj/pads/synth/retroVoices.js
// Retro Sound Recipes)

export const RETRO_VOICES = {
  gbBomb({ ac, masterOut, gbNoiseBuffer, now, dur }) {
    const noise = ac.createBufferSource();
    noise.buffer = gbNoiseBuffer;

    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(95, now + dur);

    const nGain = ac.createGain();
    nGain.gain.setValueAtTime(0.58, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(masterOut);
    noise.start(now);
    noise.stop(now + dur);

    const sub = ac.createOscillator();
    const sGain = ac.createGain();
    sub.type = 'square';
    sub.frequency.setValueAtTime(110, now);
    sub.frequency.exponentialRampToValueAtTime(32, now + dur * 0.65);
    sGain.gain.setValueAtTime(0.32, now);
    sGain.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.65);
    sub.connect(sGain);
    sGain.connect(masterOut);
    sub.start(now);
    sub.stop(now + dur * 0.65);
  },

  gbFuse({ ac, masterOut, gbNoiseBuffer, now, dur }) {
    const noise = ac.createBufferSource();
    noise.buffer = gbNoiseBuffer;
    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2600, now);
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterOut);
    noise.start(now);
    noise.stop(now + dur);
  },

  gbNoiseHit({ ac, masterOut, gbNoiseBuffer, now, dur }) {
    const noise = ac.createBufferSource();
    noise.buffer = gbNoiseBuffer;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.42, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    noise.connect(gain);
    gain.connect(masterOut);
    noise.start(now);
    noise.stop(now + dur);
  },

  arcadeJump({ ac, masterOut, now, dur }) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + dur);
    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain);
    gain.connect(masterOut);
    osc.start(now);
    osc.stop(now + dur);
  },

  arcadeZap({ ac, masterOut, now, dur }) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1600, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + dur);
    gain.gain.setValueAtTime(0.26, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain);
    gain.connect(masterOut);
    osc.start(now);
    osc.stop(now + dur);
  },

  arcadeWarp({ ac, masterOut, now, dur }) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(180, now + dur * 0.33);
    osc.frequency.linearRampToValueAtTime(480, now + dur * 0.66);
    osc.frequency.linearRampToValueAtTime(220, now + dur);
    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain);
    gain.connect(masterOut);
    osc.start(now);
    osc.stop(now + dur);
  },

  fm16Bass({ ac, masterOut, pad, now, dur }) {
    const freq = pad.freqs.at(0);
    const carrier = ac.createOscillator();
    const mod = ac.createOscillator();
    const modGain = ac.createGain();
    const outGain = ac.createGain();

    carrier.type = 'triangle';
    carrier.frequency.setValueAtTime(freq, now);

    mod.type = 'sawtooth';
    mod.frequency.setValueAtTime(freq * 2, now);
    modGain.gain.setValueAtTime(freq * 2.4, now);
    modGain.gain.exponentialRampToValueAtTime(15, now + dur * 0.6);

    outGain.gain.setValueAtTime(0.55, now);
    outGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    mod.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(outGain);
    outGain.connect(masterOut);

    carrier.start(now);
    mod.start(now);
    carrier.stop(now + dur);
    mod.stop(now + dur);
  },

  fm16({ ac, masterOut, pad, now, dur }) {
    const freq = pad.freqs.at(0);
    const carrier = ac.createOscillator();
    const mod = ac.createOscillator();
    const modGain = ac.createGain();
    const outGain = ac.createGain();

    carrier.type = 'triangle';
    carrier.frequency.setValueAtTime(freq, now);

    mod.type = 'sine';
    mod.frequency.setValueAtTime(freq * 2, now);
    modGain.gain.setValueAtTime(freq * 1.6, now);
    modGain.gain.exponentialRampToValueAtTime(10, now + dur * 0.7);

    outGain.gain.setValueAtTime(0.32, now);
    outGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    mod.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(outGain);
    outGain.connect(masterOut);

    carrier.start(now);
    mod.start(now);
    carrier.stop(now + dur);
    mod.stop(now + dur);
  },

  bell16({ ac, masterOut, pad, now, dur }) {
    const f = pad.freqs.at(0);
    [f, f * 2.5].forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(i === 0 ? 0.28 : 0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(gain);
      gain.connect(masterOut);
      osc.start(now);
      osc.stop(now + dur);
    });
  },

  chip8({ ac, masterOut, pad, now, dur }) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(pad.freqs.at(0), now);
    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain);
    gain.connect(masterOut);
    osc.start(now);
    osc.stop(now + dur);
  },

  coin({ ac, masterOut, pad, now }) {
    pad.freqs.forEach((f, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      const start = now + i * 0.075;
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, start);
      gain.gain.setValueAtTime(0.24, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
      osc.connect(gain);
      gain.connect(masterOut);
      osc.start(start);
      osc.stop(start + 0.18);
    });
  },

  powerup({ ac, masterOut, now }) {
    const notes = [330, 392, 659.25, 523.25, 587.33, 783.99];
    notes.forEach((f, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      const start = now + i * 0.055;
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, start);
      gain.gain.setValueAtTime(0.22, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.08);
      osc.connect(gain);
      gain.connect(masterOut);
      osc.start(start);
      osc.stop(start + 0.08);
    });
  }
};
