// aesthetics/lab/dj/pads/synth/sharedVoices.js
// Shared Club & Drum Recipes

export const SHARED_VOICES = {
  raveStab({ ac, masterOut, pad, now, dur }) {
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2800, now);
    filter.frequency.exponentialRampToValueAtTime(420, now + dur);

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    filter.connect(gain);
    gain.connect(masterOut);

    pad.freqs.forEach((f) => {
      [-7, 7].forEach((detune) => {
        const osc = ac.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now);
        osc.detune.setValueAtTime(detune, now);
        osc.connect(filter);
        osc.start(now);
        osc.stop(now + dur);
      });
    });
  },

  hoover({ ac, masterOut, pad, now, dur }) {
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    gain.connect(masterOut);

    pad.freqs.forEach((f, idx) => {
      const osc = ac.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f * 1.35, now);
      osc.frequency.exponentialRampToValueAtTime(f, now + 0.14);
      osc.detune.setValueAtTime(idx === 0 ? -12 : 12, now);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + dur);
    });
  },

  concertBrass({ ac, masterOut, pad, now, dur }) {
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(3400, now + 0.07);
    filter.frequency.exponentialRampToValueAtTime(1400, now + dur);

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.34, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    filter.connect(gain);
    gain.connect(masterOut);

    pad.freqs.forEach((f, idx) => {
      const osc = ac.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now);
      osc.detune.setValueAtTime(idx === 0 ? -5 : 6, now);
      osc.connect(filter);
      osc.start(now);
      osc.stop(now + dur);
    });
  },

  trancePluck({ ac, masterOut, pad, now, dur }) {
    const osc = ac.createOscillator();
    const filter = ac.createBiquadFilter();
    const gain = ac.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(pad.freqs.at(0), now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(4200, now);
    filter.frequency.exponentialRampToValueAtTime(320, now + dur);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterOut);
    osc.start(now);
    osc.stop(now + dur);
  },

  bomb8({ ac, masterOut, whiteNoiseBuffer, now, dur }) {
    const noise = ac.createBufferSource();
    noise.buffer = whiteNoiseBuffer;
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, now);
    filter.frequency.exponentialRampToValueAtTime(75, now + dur);
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.55, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterOut);
    noise.start(now);
    noise.stop(now + dur);
  },

  kick({ ac, masterOut, now, dur }) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(165, now);
    osc.frequency.exponentialRampToValueAtTime(34, now + dur);
    gain.gain.setValueAtTime(0.65, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain);
    gain.connect(masterOut);
    osc.start(now);
    osc.stop(now + dur);
  },

  snare({ ac, masterOut, whiteNoiseBuffer, now, dur }) {
    const noise = ac.createBufferSource();
    noise.buffer = whiteNoiseBuffer;
    const filter = ac.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(700, now);
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.42, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterOut);
    noise.start(now);
    noise.stop(now + dur);
  },

  hihat({ ac, masterOut, whiteNoiseBuffer, now, dur }) {
    const noise = ac.createBufferSource();
    noise.buffer = whiteNoiseBuffer;
    const filter = ac.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(5500, now);
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterOut);
    noise.start(now);
    noise.stop(now + dur);
  },

  tom({ ac, masterOut, pad, now, dur }) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const startFreq = pad.freqs.at(0);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 0.45, now + dur);
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain);
    gain.connect(masterOut);
    osc.start(now);
    osc.stop(now + dur);
  },

  laser({ ac, masterOut, now, dur }) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1250, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + dur);
    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain);
    gain.connect(masterOut);
    osc.start(now);
    osc.stop(now + dur);
  },

  airhorn({ ac, masterOut, now, dur }) {
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.setValueAtTime(0.3, now + dur * 0.75);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    gain.connect(masterOut);

    [440, 554.37, 659.25].forEach((f) => {
      const osc = ac.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f * 0.92, now);
      osc.frequency.linearRampToValueAtTime(f, now + 0.05);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + dur);
    });
  },

  riser({ ac, masterOut, now, dur }) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(1450, now + dur);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.36, now + dur * 0.85);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain);
    gain.connect(masterOut);
    osc.start(now);
    osc.stop(now + dur);
  },

  drop({ ac, masterOut, now, dur }) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + dur);
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain);
    gain.connect(masterOut);
    osc.start(now);
    osc.stop(now + dur);
  },

  siren({ ac, masterOut, now, dur }) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.linearRampToValueAtTime(980, now + dur * 0.5);
    osc.frequency.linearRampToValueAtTime(620, now + dur);
    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain);
    gain.connect(masterOut);
    osc.start(now);
    osc.stop(now + dur);
  }
};
