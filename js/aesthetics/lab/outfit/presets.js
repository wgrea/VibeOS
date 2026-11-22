// js/aesthetics/lab/outfit/presets.js
export const FABRICS = {
  pvc: {
    label: 'PVC',
    stats: { shine: 98, flex: 45, cost: 40 },
    mat: {
      roughness: 0.04,
      metalness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 1.0,
      sheen: 0.15
    }
  },
  latex: {
    label: 'Latex',
    stats: { shine: 88, flex: 95, cost: 85 },
    mat: {
      roughness: 0.12,
      metalness: 0.05,
      clearcoat: 0.85,
      clearcoatRoughness: 0.09,
      reflectivity: 0.9,
      sheen: 0.0
    }
  },
  leather: {
    label: 'Leather',
    stats: { shine: 25, flex: 60, cost: 95 },
    mat: {
      roughness: 0.58,
      metalness: 0.04,
      clearcoat: 0.15,
      clearcoatRoughness: 0.5,
      reflectivity: 0.4,
      sheen: 0.65,
      sheenRoughness: 0.45
    }
  },
  nylon: {
    label: 'Ripstop Nylon',
    stats: { shine: 45, flex: 80, cost: 60 },
    mat: {
      roughness: 0.42,
      metalness: 0.08,
      clearcoat: 0.25,
      clearcoatRoughness: 0.35,
      reflectivity: 0.55,
      sheen: 0.5,
      sheenRoughness: 0.35
    }
  },
  fleece: {
    label: 'Cotton Fleece',
    stats: { shine: 5, flex: 85, cost: 35 },
    mat: {
      roughness: 0.92,
      metalness: 0.0,
      clearcoat: 0.0,
      clearcoatRoughness: 1.0,
      reflectivity: 0.1,
      sheen: 0.35,
      sheenRoughness: 0.85
    }
  },
  plush: {
    label: 'Plush Sherpa',
    stats: { shine: 2, flex: 90, cost: 50 },
    mat: {
      roughness: 1.0,
      metalness: 0.0,
      clearcoat: 0.0,
      clearcoatRoughness: 1.0,
      reflectivity: 0.05,
      sheen: 0.95,
      sheenRoughness: 0.9
    }
  },
  denim: {
    label: 'Denim',
    stats: { shine: 10, flex: 55, cost: 50 },
    mat: {
      roughness: 0.88,
      metalness: 0.02,
      clearcoat: 0.0,
      clearcoatRoughness: 1.0,
      reflectivity: 0.15,
      sheen: 0.4,
      sheenRoughness: 0.75
    }
  },
  corduroy: {
    label: 'Corduroy',
    stats: { shine: 12, flex: 65, cost: 55 },
    mat: {
      roughness: 0.94,
      metalness: 0.0,
      clearcoat: 0.0,
      clearcoatRoughness: 1.0,
      reflectivity: 0.12,
      sheen: 0.65,
      sheenRoughness: 0.6
    }
  },
  cotton: {
    label: 'Cotton',
    stats: { shine: 8, flex: 75, cost: 30 },
    mat: {
      roughness: 0.85,
      metalness: 0.0,
      clearcoat: 0.0,
      clearcoatRoughness: 1.0,
      reflectivity: 0.12,
      sheen: 0.25,
      sheenRoughness: 0.8
    }
  }
};

export const COLORS = [
  { name: 'Obsidian Black', hex: 0x111318, css: '#111318' },
  { name: 'Burgundy', hex: 0x6b1426, css: '#6b1426' },
  { name: 'Crimson Red', hex: 0xb91c1c, css: '#b91c1c' },
  { name: 'Indigo Denim', hex: 0x1e3a5f, css: '#1e3a5f' },
  { name: 'Cyber Cobalt', hex: 0x1d4ed8, css: '#1d4ed8' },
  { name: 'Acid Emerald', hex: 0x047857, css: '#047857' },
  { name: 'Pearl White', hex: 0xf1f5f9, css: '#f1f5f9' },
  { name: 'Ultraviolet', hex: 0x6d28d9, css: '#6d28d9' },
  { name: 'Bubblegum Pink', hex: 0xdb2777, css: '#db2777' },
  { name: 'Espresso Bronze', hex: 0x451a03, css: '#451a03' }
];

export const AESTHETIC_PALETTES = {
  none: {
    label: 'Single Color',
    primary: null,
    secondary: null,
    accent: null
  },
  frutigerAero: {
    label: 'Frutiger Aero',
    primary: 0xf1f5f9,
    secondary: 0x0284c7,
    accent: 0x10b981
  },
  vaporwave: {
    label: 'Vaporwave',
    primary: 0x1e1b4b,
    secondary: 0xdb2777,
    accent: 0x06b6d4
  },
  darkNeon: {
    label: 'Dark Neon',
    primary: 0x090b10,
    secondary: 0x6d28d9,
    accent: 0x22d3ee
  },
  gpCrimson: {
    label: 'GP Crimson',
    primary: 0xb91c1c,
    secondary: 0xf8fafc,
    accent: 0x111318
  }
};
