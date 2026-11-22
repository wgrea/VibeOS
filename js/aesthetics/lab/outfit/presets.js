// js/aesthetics/lab/outfit/presets.js
import * as THREE from 'three';
import { TEXTURES } from './textures.js';
export { COLORS, AESTHETIC_PALETTES } from './palettes.js';

// Cache generated procedural maps once so multiple presets share GPU memory
const TEX_CACHE = {
  leather: TEXTURES.leather(),
  ripstop: TEXTURES.ripstop(),
  fleece: TEXTURES.fleece(),
  plush: TEXTURES.plush(),
  denim: TEXTURES.denim(),
  corduroy: TEXTURES.corduroy(),
  cotton: TEXTURES.cotton(),
  nomex: TEXTURES.nomex()
};

const WHITE = new THREE.Color(0xffffff);

export const FABRICS = {
  pvc: {
    label: 'PVC',
    stats: { shine: 98, flex: 45, cost: 40 },
    mat: {
      roughness: 0.06,
      metalness: 0.04,
      ior: 1.53,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 1.0,
      sheen: 0.0,
      bumpMap: TEX_CACHE.leather,
      bumpScale: 0.0012
    }
  },
  latex: {
    label: 'Latex',
    stats: { shine: 88, flex: 95, cost: 85 },
    mat: {
      roughness: 0.14,
      metalness: 0.02,
      ior: 1.51,
      clearcoat: 0.88,
      clearcoatRoughness: 0.08,
      reflectivity: 0.92,
      sheen: 0.0,
      bumpMap: TEX_CACHE.cotton,
      bumpScale: 0.0008
    }
  },
  leather: {
    label: 'Leather',
    stats: { shine: 25, flex: 60, cost: 95 },
    mat: {
      roughness: 0.58,
      roughnessMap: TEX_CACHE.leather,
      metalness: 0.02,
      ior: 1.48,
      clearcoat: 0.22,
      clearcoatRoughness: 0.42,
      reflectivity: 0.45,
      sheen: 0.35,
      sheenRoughness: 0.55,
      sheenColor: WHITE,
      bumpMap: TEX_CACHE.leather,
      bumpScale: 0.014
    }
  },
  nylon: {
    label: 'Ripstop Nylon',
    stats: { shine: 45, flex: 80, cost: 60 },
    mat: {
      roughness: 0.46,
      roughnessMap: TEX_CACHE.ripstop,
      metalness: 0.06,
      ior: 1.46,
      clearcoat: 0.2,
      clearcoatRoughness: 0.38,
      reflectivity: 0.55,
      sheen: 0.55,
      sheenRoughness: 0.32,
      sheenColor: WHITE,
      bumpMap: TEX_CACHE.ripstop,
      bumpScale: 0.011
    }
  },
  nomex: {
    label: 'Nomex Aramid',
    stats: { shine: 18, flex: 72, cost: 100 },
    mat: {
      roughness: 0.82,
      roughnessMap: TEX_CACHE.nomex,
      metalness: 0.02,
      ior: 1.45,
      clearcoat: 0.0,
      clearcoatRoughness: 1.0,
      reflectivity: 0.22,
      sheen: 0.65,
      sheenRoughness: 0.68,
      sheenColor: WHITE,
      bumpMap: TEX_CACHE.nomex,
      bumpScale: 0.018
    }
  },
  raceSatin: {
    label: 'Race Satin',
    stats: { shine: 65, flex: 80, cost: 70 },
    mat: {
      roughness: 0.32,
      roughnessMap: TEX_CACHE.ripstop,
      metalness: 0.12,
      ior: 1.48,
      clearcoat: 0.3,
      clearcoatRoughness: 0.26,
      reflectivity: 0.78,
      sheen: 0.9,
      sheenRoughness: 0.22,
      sheenColor: WHITE,
      bumpMap: TEX_CACHE.ripstop,
      bumpScale: 0.006
    }
  },
  fleece: {
    label: 'Cotton Fleece',
    stats: { shine: 5, flex: 85, cost: 35 },
    mat: {
      roughness: 0.96,
      roughnessMap: TEX_CACHE.fleece,
      metalness: 0.0,
      ior: 1.42,
      clearcoat: 0.0,
      clearcoatRoughness: 1.0,
      reflectivity: 0.06,
      sheen: 0.85,
      sheenRoughness: 0.88,
      sheenColor: WHITE,
      bumpMap: TEX_CACHE.fleece,
      bumpScale: 0.024
    }
  },
  plush: {
    label: 'Plush Sherpa',
    stats: { shine: 2, flex: 90, cost: 50 },
    mat: {
      roughness: 1.0,
      roughnessMap: TEX_CACHE.plush,
      metalness: 0.0,
      ior: 1.4,
      clearcoat: 0.0,
      clearcoatRoughness: 1.0,
      reflectivity: 0.04,
      sheen: 1.0,
      sheenRoughness: 0.94,
      sheenColor: WHITE,
      bumpMap: TEX_CACHE.plush,
      bumpScale: 0.042
    }
  },
  denim: {
    label: 'Denim',
    stats: { shine: 10, flex: 55, cost: 50 },
    mat: {
      roughness: 0.9,
      roughnessMap: TEX_CACHE.denim,
      metalness: 0.0,
      ior: 1.44,
      clearcoat: 0.0,
      clearcoatRoughness: 1.0,
      reflectivity: 0.14,
      sheen: 0.55,
      sheenRoughness: 0.76,
      sheenColor: WHITE,
      bumpMap: TEX_CACHE.denim,
      bumpScale: 0.017
    }
  },
  corduroy: {
    label: 'Corduroy',
    stats: { shine: 12, flex: 65, cost: 55 },
    mat: {
      roughness: 0.94,
      roughnessMap: TEX_CACHE.corduroy,
      metalness: 0.0,
      ior: 1.43,
      clearcoat: 0.0,
      clearcoatRoughness: 1.0,
      reflectivity: 0.12,
      sheen: 0.9,
      sheenRoughness: 0.52,
      sheenColor: WHITE,
      bumpMap: TEX_CACHE.corduroy,
      bumpScale: 0.036
    }
  },
  cotton: {
    label: 'Cotton',
    stats: { shine: 8, flex: 75, cost: 30 },
    mat: {
      roughness: 0.88,
      roughnessMap: TEX_CACHE.cotton,
      metalness: 0.0,
      ior: 1.44,
      clearcoat: 0.0,
      clearcoatRoughness: 1.0,
      reflectivity: 0.1,
      sheen: 0.4,
      sheenRoughness: 0.82,
      sheenColor: WHITE,
      bumpMap: TEX_CACHE.cotton,
      bumpScale: 0.009
    }
  }
};
