// aesthetics/lab/dj/pads/modern.js
// Instrument menu

const HIGH_NOTES = [
  { note: 'C5', f: 523.25 }, { note: 'D5', f: 587.33 }, { note: 'E5', f: 659.25 }, { note: 'F5', f: 698.46 },
  { note: 'G5', f: 783.99 }, { note: 'A5', f: 880.00 }, { note: 'B5', f: 987.77 }, { note: 'C6', f: 1046.50 },
  { note: 'D6', f: 1174.66 }, { note: 'E6', f: 1318.51 }, { note: 'G6', f: 1567.98 }, { note: 'A6', f: 1760.00 }
];

export const MODERN_ERA = {
  id: 'modern',
  label: 'MODERN',
  badgeColor: '#e879f9',

  // Keys 1-4 -> Left Hand (QWER / ASDF / ZXCV)
  leftBanks: [
    {
      key: '1',
      name: 'REESE BS',
      color: '#e879f9',
      pads: [
        { note: 'C2', freqs: Array.of(65.41), type: 'reeseBass', dur: 0.55 },
        { note: 'D2', freqs: Array.of(73.42), type: 'reeseBass', dur: 0.55 },
        { note: 'Eb2', freqs: Array.of(77.78), type: 'reeseBass', dur: 0.55 },
        { note: 'F2', freqs: Array.of(87.31), type: 'reeseBass', dur: 0.55 },
        { note: 'G2', freqs: Array.of(98.00), type: 'reeseBass', dur: 0.55 },
        { note: 'Ab2', freqs: Array.of(103.83), type: 'reeseBass', dur: 0.55 },
        { note: 'Bb2', freqs: Array.of(116.54), type: 'reeseBass', dur: 0.55 },
        { note: 'C3', freqs: Array.of(130.81), type: 'reeseBass', dur: 0.55 },
        { note: 'D3', freqs: Array.of(146.83), type: 'reeseBass', dur: 0.55 },
        { note: 'Eb3', freqs: Array.of(155.56), type: 'reeseBass', dur: 0.55 },
        { note: 'G3', freqs: Array.of(196.00), type: 'reeseBass', dur: 0.55 },
        { note: 'C4', freqs: Array.of(261.63), type: 'reeseBass', dur: 0.55 }
      ]
    },
    {
      key: '2',
      name: 'SUPERSAW',
      color: '#38bdf8',
      pads: [
        { note: 'Cm', freqs: [261.63, 311.13, 392.00], type: 'supersaw', dur: 0.52 },
        { note: 'Dm', freqs: [293.66, 349.23, 440.00], type: 'supersaw', dur: 0.52 },
        { note: 'Eb', freqs: [311.13, 392.00, 466.16], type: 'supersaw', dur: 0.52 },
        { note: 'Fm', freqs: [349.23, 415.30, 523.25], type: 'supersaw', dur: 0.52 },
        { note: 'Gm', freqs: [392.00, 466.16, 587.33], type: 'supersaw', dur: 0.52 },
        { note: 'Ab', freqs: [415.30, 523.25, 622.25], type: 'supersaw', dur: 0.52 },
        { note: 'Bb', freqs: [466.16, 587.33, 698.46], type: 'supersaw', dur: 0.52 },
        { note: 'Cm7', freqs: [261.63, 311.13, 466.16], type: 'supersaw', dur: 0.52 },
        { note: 'Fm9', freqs: [349.23, 415.30, 622.25], type: 'supersaw', dur: 0.52 },
        { note: 'G7', freqs: [392.00, 493.88, 587.33], type: 'supersaw', dur: 0.52 },
        { note: 'AbM7', freqs: [415.30, 523.25, 783.99], type: 'supersaw', dur: 0.52 },
        { note: 'Cm9', freqs: [311.13, 392.00, 587.33], type: 'supersaw', dur: 0.52 }
      ]
    },
    {
      key: '3',
      name: '808 SUB',
      color: '#818cf8',
      pads: [
        { note: 'C1', freqs: Array.of(48.99), type: 'sub808', dur: 0.65 },
        { note: 'D1', freqs: Array.of(55.00), type: 'sub808', dur: 0.65 },
        { note: 'Eb1', freqs: Array.of(58.27), type: 'sub808', dur: 0.65 },
        { note: 'F1', freqs: Array.of(65.41), type: 'sub808', dur: 0.65 },
        { note: 'G1', freqs: Array.of(73.42), type: 'sub808', dur: 0.65 },
        { note: 'Ab1', freqs: Array.of(77.78), type: 'sub808', dur: 0.65 },
        { note: 'Bb1', freqs: Array.of(87.31), type: 'sub808', dur: 0.65 },
        { note: 'C2', freqs: Array.of(98.00), type: 'sub808', dur: 0.65 },
        { note: 'D2', freqs: Array.of(110.00), type: 'sub808', dur: 0.65 },
        { note: 'Eb2', freqs: Array.of(116.54), type: 'sub808', dur: 0.65 },
        { note: 'G2', freqs: Array.of(146.83), type: 'sub808', dur: 0.65 },
        { note: 'C3', freqs: Array.of(196.00), type: 'sub808', dur: 0.65 }
      ]
    },
    {
      key: '4',
      name: 'ACID 303',
      color: '#2dd4bf',
      pads: [
        { note: 'C2', freqs: Array.of(65.41), type: 'acid303', dur: 0.34 },
        { note: 'D2', freqs: Array.of(73.42), type: 'acid303', dur: 0.34 },
        { note: 'Eb2', freqs: Array.of(77.78), type: 'acid303', dur: 0.34 },
        { note: 'F2', freqs: Array.of(87.31), type: 'acid303', dur: 0.34 },
        { note: 'G2', freqs: Array.of(98.00), type: 'acid303', dur: 0.34 },
        { note: 'Ab2', freqs: Array.of(103.83), type: 'acid303', dur: 0.34 },
        { note: 'Bb2', freqs: Array.of(116.54), type: 'acid303', dur: 0.34 },
        { note: 'C3', freqs: Array.of(130.81), type: 'acid303', dur: 0.34 },
        { note: 'D3', freqs: Array.of(146.83), type: 'acid303', dur: 0.34 },
        { note: 'Eb3', freqs: Array.of(155.56), type: 'acid303', dur: 0.34 },
        { note: 'G3', freqs: Array.of(196.00), type: 'acid303', dur: 0.34 },
        { note: 'C4', freqs: Array.of(261.63), type: 'acid303', dur: 0.34 }
      ]
    }
  ],

  // Keys 5-0 -> Right Hand (UIOP / JKL; / M,./)
  rightBanks: [
    {
      key: '5',
      name: 'HYPER LD',
      color: '#f472b6',
      pads: HIGH_NOTES.map((n) => ({ note: n.note, freqs: Array.of(n.f), type: 'hyperLead', dur: 0.34 }))
    },
    {
      key: '6',
      name: 'PLUCK',
      color: '#2dd4bf',
      pads: HIGH_NOTES.map((n) => ({ note: n.note, freqs: Array.of(n.f), type: 'trancePluck', dur: 0.28 }))
    },
    {
      key: '7',
      name: 'GLASS BL',
      color: '#c084fc',
      pads: HIGH_NOTES.map((n) => ({ note: n.note, freqs: Array.of(n.f), type: 'bell16', dur: 0.46 }))
    },
    {
      key: '8',
      name: 'FEST SAW',
      color: '#38bdf8',
      pads: HIGH_NOTES.map((n) => ({ note: n.note, freqs: [n.f * 0.5, n.f], type: 'supersaw', dur: 0.38 }))
    },
    {
      key: '9',
      name: 'HORN',
      color: '#fbbf24',
      pads: HIGH_NOTES.map((n) => ({ note: n.note, freqs: [n.f * 0.5, n.f], type: 'concertBrass', dur: 0.42 }))
    },
    {
      key: '0',
      name: 'CLUB FX',
      color: '#fb7185',
      pads: [
        { note: 'RISER', type: 'riser', dur: 0.72 },
        { note: 'IMPACT', type: 'bomb8', dur: 0.8 },
        { note: 'SUB DRP', type: 'drop', dur: 0.55 },
        { note: 'HORN', type: 'airhorn', dur: 0.52 },
        { note: 'SIREN', type: 'siren', dur: 0.44 },
        { note: 'ZAP', type: 'laser', dur: 0.24 },
        { note: 'TOM H', freqs: Array.of(240), type: 'tom', dur: 0.22 },
        { note: 'TOM L', freqs: Array.of(120), type: 'tom', dur: 0.28 },
        { note: 'CLAP', type: 'snare', dur: 0.2 },
        { note: 'HIHAT', type: 'hihat', dur: 0.08 },
        { note: '909 KCK', type: 'kick', dur: 0.3 },
        { note: '808 BM', type: 'sub808', freqs: Array.of(55), dur: 0.65 }
      ]
    }
  ],

  // Center Column (T Y G H B N) -> Modern Club Drums & Impact
  centerPads: {
    color: '#e879f9',
    pads: [
      { note: 'TOM H', freqs: Array.of(220), type: 'tom', dur: 0.24 },
      { note: 'IMPACT', type: 'bomb8', dur: 0.75 },
      { note: 'CLAP', type: 'snare', dur: 0.2 },
      { note: 'HIHAT', type: 'hihat', dur: 0.08 },
      { note: '909 KCK', type: 'kick', dur: 0.3 },
      { note: 'SUB DRP', type: 'drop', dur: 0.48 }
    ]
  }
};
