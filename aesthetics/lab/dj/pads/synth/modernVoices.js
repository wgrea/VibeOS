// aesthetics/lab/dj/pads/synth/modernVoices.js
// Modern Rave Recipes

export const MODERN_VOICES = {
  reeseBass({ ac, masterOut, pad, now, dur }) {
    const freq = pad.freqs.at(0);
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(480, now);
    filter.frequency.exponentialRampToValueAtTime(140, now + dur);

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.42, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    filter.connect(gain);
    gain.connect(masterOut);

    [-14, 14].forEach((detune) => {
      const osc = ac.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(detune, now);
      osc.connect(filter);
      osc.start(now);
      osc.stop(now + dur);
    });
  },

  supersaw({ ac, masterOut, pad, now, dur }) {
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3600, now);
    filter.frequency.exponentialRampToValueAtTime(900, now + dur);

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    filter.connect(gain);
    gain.connect(masterOut);

    const detunes = [-18, -7, 0, 7, 18];
    pad.freqs.forEach((f) => {
      detunes.forEach((d) => {
        const osc = ac.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now);
        osc.detune.setValueAtTime(d, now);
        osc.connect(filter);
        osc.start(now);
        osc.stop(now + dur);
      });
    });
  },

  sub808({ ac, masterOut, pad, now, dur }) {
    const freq = pad.freqs.at(0);
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 1.9, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.06);

    gain.gain.setValueAtTime(0.68, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(gain);
    gain.connect(masterOut);
    osc.start(now);
    osc.stop(now + dur);
  },

  acid303({ ac, masterOut, pad, now, dur }) {
    const freq = pad.freqs.at(0);
    const osc = ac.createOscillator();
    const filter = ac.createBiquadFilter();
    const gain = ac.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.Q.setValueAtTime(14, now);
    filter.frequency.setValueAtTime(2400, now);
    filter.frequency.exponentialRampToValueAtTime(220, now + dur);

    gain.gain.setValueAtTime(0.36, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterOut);
    osc.start(now);
    osc.stop(now + dur);
  },

  hyperLead({ ac, masterOut, pad, now, dur }) {
    const freq = pad.freqs.at(0);
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq * 1.12, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.035);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(gain);
    gain.connect(masterOut);
    osc.start(now);
    osc.stop(now + dur);
  }
};
