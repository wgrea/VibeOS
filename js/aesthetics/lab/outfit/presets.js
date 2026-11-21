// aesthetics/lab/outfit/presets.js
export const FABRICS = {
  latex: {
    label: 'Latex',
    stats: { shine: 95, flex: 90, cost: 85 },
    mat: {
      roughness: 0.05,
      metalness: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 1.0,
      sheen: 0.0
    }
  },
  pvc: {
    label: 'PVC',
    stats: { shine: 80, flex: 45, cost: 40 },
    mat: {
      roughness: 0.16,
      metalness: 0.12,
      clearcoat: 0.75,
      clearcoatRoughness: 0.18,
      reflectivity: 0.85,
      sheen: 0.2
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
  }
};

export const COLORS = [
  { name: 'Obsidian Black', hex: 0x111318, css: '#111318' },
  { name: 'Crimson Red', hex: 0xb91c1c, css: '#b91c1c' },
  { name: 'Cyber Cobalt', hex: 0x1d4ed8, css: '#1d4ed8' },
  { name: 'Acid Emerald', hex: 0x047857, css: '#047857' },
  { name: 'Pearl White', hex: 0xf1f5f9, css: '#f1f5f9' },
  { name: 'Ultraviolet', hex: 0x6d28d9, css: '#6d28d9' },
  { name: 'Bubblegum Pink', hex: 0xdb2777, css: '#db2777' },
  { name: 'Espresso Bronze', hex: 0x451a03, css: '#451a03' }
];
