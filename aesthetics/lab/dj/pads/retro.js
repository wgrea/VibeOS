// aesthetics/lab/dj/pads/retro.js
// Instrument menu

const HIGH_NOTES = [
  { note: 'C5', f: 523.25 }, { note: 'D5', f: 587.33 }, { note: 'E5', f: 659.25 }, { note: 'F5', f: 698.46 },
  { note: 'G5', f: 783.99 }, { note: 'A5', f: 880.00 }, { note: 'B5', f: 987.77 }, { note: 'C6', f: 1046.50 },
  { note: 'D6', f: 1174.66 }, { note: 'E6', f: 1318.51 }, { note: 'G6', f: 1567.98 }, { note: 'A6', f: 1760.00 }
];

export const RETRO_ERA = {
  id: 'retro',
  label: 'RETRO',
  badgeColor: '#38bdf8',

  // Keys 1-4 -> Left Hand (QWER / ASDF / ZXCV)
  leftBanks: [
    {
      key: '1',
      name: '16BIT BS',
      color: '#38bdf8',
      pads: [
        { note: 'C2', freqs: Array.of(65.41), type: 'fm16Bass', dur: 0.44 },
        { note: 'D2', freqs: Array.of(73.42), type: 'fm16Bass', dur: 0.44 },
        { note: 'E2', freqs: Array.of(82.41), type: 'fm16Bass', dur: 0.44 },
        { note: 'F2', freqs: Array.of(87.31), type: 'fm16Bass', dur: 0.44 },
        { note: 'G2', freqs: Array.of(98.00), type: 'fm16Bass', dur: 0.44 },
        { note: 'A2', freqs: Array.of(110.00), type: 'fm16Bass', dur: 0.44 },
        { note: 'B2', freqs: Array.of(123.47), type: 'fm16Bass', dur: 0.44 },
        { note: 'C3', freqs: Array.of(130.81), type: 'fm16Bass', dur: 0.44 },
        { note: 'D3', freqs: Array.of(146.83), type: 'fm16Bass', dur: 0.44 },
        { note: 'E3', freqs: Array.of(164.81), type: 'fm16Bass', dur: 0.44 },
        { note: 'G3', freqs: Array.of(196.00), type: 'fm16Bass', dur: 0.44 },
        { note: 'A3', freqs: Array.of(220.00), type: 'fm16Bass', dur: 0.44 }
      ]
    },
    {
      key: '2',
      name: '90s STAB',
      color: '#34d399',
      pads: [
        { note: 'Cm', freqs: [261.63, 311.13, 392.00], type: 'raveStab', dur: 0.42 },
        { note: 'Dm', freqs: [293.66, 349.23, 440.00], type: 'raveStab', dur: 0.42 },
        { note: 'Eb', freqs: [311.13, 392.00, 466.16], type: 'raveStab', dur: 0.42 },
        { note: 'Fm', freqs: [349.23, 415.30, 523.25], type: 'raveStab', dur: 0.42 },
        { note: 'Gm', freqs: [392.00, 466.16, 587.33], type: 'raveStab', dur: 0.42 },
        { note: 'Ab', freqs: [415.30, 523.25, 622.25], type: 'raveStab', dur: 0.42 },
        { note: 'Bb', freqs: [466.16, 587.33, 698.46], type: 'raveStab', dur: 0.42 },
        { note: 'Cm7', freqs: [261.63, 311.13, 466.16], type: 'raveStab', dur: 0.42 },
        { note: 'F9', freqs: [349.23, 440.00, 523.25], type: 'raveStab', dur: 0.42 },
        { note: 'G7', freqs: [392.00, 493.88, 587.33], type: 'raveStab', dur: 0.42 },
        { note: 'AbM7', freqs: [415.30, 523.25, 783.99], type: 'raveStab', dur: 0.42 },
        { note: 'Cm9', freqs: [311.13, 392.00, 587.33], type: 'raveStab', dur: 0.42 }
      ]
    },
    {
      key: '3',
      name: 'HOOVER',
      color: '#f472b6',
      pads: [
        { note: 'C3', freqs: [130.81, 261.63], type: 'hoover', dur: 0.5 },
        { note: 'D3', freqs: [146.83, 293.66], type: 'hoover', dur: 0.5 },
        { note: 'Eb3', freqs: [155.56, 311.13], type: 'hoover', dur: 0.5 },
        { note: 'F3', freqs: [174.61, 349.23], type: 'hoover', dur: 0.5 },
        { note: 'G3', freqs: [196.00, 392.00], type: 'hoover', dur: 0.5 },
        { note: 'Ab3', freqs: [207.65, 415.30], type: 'hoover', dur: 0.5 },
        { note: 'Bb3', freqs: [233.08, 466.16], type: 'hoover', dur: 0.5 },
        { note: 'C4', freqs: [261.63, 523.25], type: 'hoover', dur: 0.5 },
        { note: 'D4', freqs: [293.66, 587.33], type: 'hoover', dur: 0.5 },
        { note: 'Eb4', freqs: [311.13, 622.25], type: 'hoover', dur: 0.5 },
        { note: 'G4', freqs: [392.00, 783.99], type: 'hoover', dur: 0.5 },
        { note: 'C5', freqs: [523.25, 1046.50], type: 'hoover', dur: 0.5 }
      ]
    },
    {
      key: '4',
      name: 'GB PULSE',
      color: '#a3e635',
      pads: [
        { note: 'C3', freqs: Array.of(130.81), type: 'chip8', dur: 0.28 },
        { note: 'D3', freqs: Array.of(146.83), type: 'chip8', dur: 0.28 },
        { note: 'Eb3', freqs: Array.of(155.56), type: 'chip8', dur: 0.28 },
        { note: 'F3', freqs: Array.of(174.61), type: 'chip8', dur: 0.28 },
        { note: 'G3', freqs: Array.of(196.00), type: 'chip8', dur: 0.28 },
        { note: 'Ab3', freqs: Array.of(207.65), type: 'chip8', dur: 0.28 },
        { note: 'Bb3', freqs: Array.of(233.08), type: 'chip8', dur: 0.28 },
        { note: 'C4', freqs: Array.of(261.63), type: 'chip8', dur: 0.28 },
        { note: 'D4', freqs: Array.of(293.66), type: 'chip8', dur: 0.28 },
        { note: 'Eb4', freqs: Array.of(311.13), type: 'chip8', dur: 0.28 },
        { note: 'G4', freqs: Array.of(392.00), type: 'chip8', dur: 0.28 },
        { note: 'C5', freqs: Array.of(523.25), type: 'chip8', dur: 0.28 }
      ]
    }
  ],

  // Keys 5-0 -> Right Hand (UIOP / JKL; / M,./)
  rightBanks: [
    {
      key: '5',
      name: '16BIT LD',
      color: '#38bdf8',
      pads: HIGH_NOTES.map((n) => ({ note: n.note, freqs: Array.of(n.f), type: 'fm16', dur: 0.36 }))
    },
    {
      key: '6',
      name: 'SNES BEL',
      color: '#c084fc',
      pads: HIGH_NOTES.map((n) => ({ note: n.note, freqs: Array.of(n.f), type: 'bell16', dur: 0.48 }))
    },
    {
      key: '7',
      name: '8BIT LD',
      color: '#a3e635',
      pads: HIGH_NOTES.map((n) => ({ note: n.note, freqs: Array.of(n.f), type: 'chip8', dur: 0.24 }))
    },
    {
      key: '8',
      name: '16B BRAS',
      color: '#fbbf24',
      pads: HIGH_NOTES.map((n) => ({ note: n.note, freqs: [n.f * 0.5, n.f], type: 'concertBrass', dur: 0.4 }))
    },
    {
      key: '9',
      name: 'GB BOMB',
      color: '#fb923c',
      pads: [
        { note: 'GB BOMB', type: 'gbBomb', dur: 0.72 },
        { note: 'FUSE', type: 'gbFuse', dur: 0.45 },
        { note: 'MEGA BM', type: 'bomb8', dur: 0.85 },
        { note: 'SHRAPNL', type: 'gbNoiseHit', dur: 0.26 },
        { note: '1-UP', type: 'powerup', dur: 0.38 },
        { note: 'COIN', freqs: [987.77, 1318.51], type: 'coin', dur: 0.24 },
        { note: 'LASER 1', type: 'laser', dur: 0.22 },
        { note: 'LASER 2', type: 'arcadeZap', dur: 0.26 },
        { note: 'JUMP', type: 'arcadeJump', dur: 0.22 },
        { note: 'WARP', type: 'arcadeWarp', dur: 0.45 },
        { note: 'HIT', type: 'snare', dur: 0.18 },
        { note: 'THUD', type: 'kick', dur: 0.28 }
      ]
    },
    {
      key: '0',
      name: 'ARCADE',
      color: '#f87171',
      pads: [
        { note: 'COIN', freqs: [987.77, 1318.51], type: 'coin', dur: 0.24 },
        { note: '1-UP', type: 'powerup', dur: 0.38 },
        { note: 'JUMP', type: 'arcadeJump', dur: 0.22 },
        { note: 'ZAP', type: 'arcadeZap', dur: 0.25 },
        { note: 'GB BOMB', type: 'gbBomb', dur: 0.72 },
        { note: 'WARP', type: 'arcadeWarp', dur: 0.45 },
        { note: 'BOSS', type: 'drop', dur: 0.5 },
        { note: 'ALARM', type: 'siren', dur: 0.4 },
        { note: 'LASER', type: 'laser', dur: 0.22 },
        { note: 'AIRHORN', type: 'airhorn', dur: 0.48 },
        { note: '16B TOM', freqs: Array.of(220), type: 'tom', dur: 0.24 },
        { note: '16B KCK', type: 'kick', dur: 0.28 }
      ]
    }
  ],

  // Center Column (T Y G H B N) -> Always ready Game Boy Bomb + Retro Rhythm
  centerPads: {
    color: '#fb923c',
    pads: [
      { note: 'GB BOMB', type: 'gbBomb', dur: 0.72 },
      { note: '1-UP', type: 'powerup', dur: 0.38 },
      { note: '8B SNAR', type: 'snare', dur: 0.18 },
      { note: '8B HAT', type: 'hihat', dur: 0.08 },
      { note: '8B KICK', type: 'kick', dur: 0.26 },
      { note: 'COIN', freqs: [987.77, 1318.51], type: 'coin', dur: 0.24 }
    ]
  }
};
