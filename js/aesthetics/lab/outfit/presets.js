// js/aesthetics/lab/outfit/presets.js
import { TEXTURES } from './textures.js';
export { COLORS, AESTHETIC_PALETTES } from './palettes.js';

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
      sheen: 0.15,
      bumpMap: null,
      bumpScale: 0
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
      sheen: 0.0,
      bumpMap: null,
      bumpScale: 0
    }
  },
  leather: {
    label: 'Leather',
    stats: { shine: 25, flex: 60, cost: 95 },
    mat: {
      roughness: 0.56,
      metalness: 0.04,
      clearcoat: 0.18,
      clearcoatRoughness: 0.48,
      reflectivity: 0.4,
      sheen: 0.65,
      sheenRoughness: 0.45,
      bumpMap: TEXTURES.leather(),
      bumpScale: 0.012
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
      sheenRoughness: 0.35,
      bumpMap: TEXTURES.ripstop(),
      bumpScale: 0.009
    }
  },
  nomex: {
    label: 'Nomex Aramid',
    stats: { shine: 18, flex: 72, cost: 100 },
    mat: {
      roughness: 0.78,
      metalness: 0.03,
      clearcoat: 0.05,
      clearcoatRoughness: 0.85,
      reflectivity: 0.2,
      sheen: 0.55,
      sheenRoughness: 0.65,
      bumpMap: TEXTURES.nomex(),
      bumpScale: 0.016
    }
  },
  raceSatin: {
    label: 'Race Satin',
    stats: { shine: 65, flex: 80, cost: 70 },
    mat: {
      roughness: 0.34,
      metalness: 0.14,
      clearcoat: 0.35,
      clearcoatRoughness: 0.28,
      reflectivity: 0.75,
      sheen: 0.85,
      sheenRoughness: 0.25,
      bumpMap: TEXTURES.ripstop(),
      bumpScale: 0.006
    }
  },
  fleece: {
    label: 'Cotton Fleece',
    stats: { shine: 5, flex: 85, cost: 35 },
    mat: {
      roughness: 0.94,
      metalness: 0.0,
      clearcoat: 0.0,
      clearcoatRoughness: 1.0,
      reflectivity: 0.08,
      sheen: 0.75,
      sheenRoughness: 0.88,
      bumpMap: TEXTURES.fleece(),
      bumpScale: 0.022
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
      reflectivity: 0.04,
      sheen: 1.0,
      sheenRoughness: 0.92,
      bumpMap: TEXTURES.plush(),
      bumpScale: 0.038
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
      sheen: 0.45,
      sheenRoughness: 0.75,
      bumpMap: TEXTURES.denim(),
      bumpScale: 0.015
    }
  },
  corduroy: {
    label: 'Corduroy',
    stats: { shine: 12, flex: 65, cost: 55 },
    mat: {
      roughness: 0.92,
      metalness: 0.0,
      clearcoat: 0.0,
      clearcoatRoughness: 1.0,
      reflectivity: 0.12,
      sheen: 0.8,
      sheenRoughness: 0.55,
      bumpMap: TEXTURES.corduroy(),
      bumpScale: 0.032
    }
  },
  cotton: {
    label: 'Cotton',
    stats: { shine: 8, flex: 75, cost: 30 },
    mat: {
      roughness: 0.86,
      metalness: 0.0,
      clearcoat: 0.0,
      clearcoatRoughness: 1.0,
      reflectivity: 0.12,
      sheen: 0.3,
      sheenRoughness: 0.8,
      bumpMap: TEXTURES.cotton(),
      bumpScale: 0.008
    }
  }
};
