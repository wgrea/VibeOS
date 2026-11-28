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
      roughness: 0.02,          // Ultra-smooth mirror-like finish
      metalness: 0.08,          // Subtle plastic dielectric sheen
      ior: 1.62,                // High glass/polymer refraction index
      clearcoat: 1.0,           // Full polymer gloss layer
      clearcoatRoughness: 0.01, // Zero-distortion liquid shine
      reflectivity: 1.0,
      sheen: 0.0,
      bumpMap: TEX_CACHE.cotton,
      bumpScale: 0.0003         // Extremely faint calendar roll grain
    }
  },
  latex: {
    label: 'Latex',
    stats: { shine: 88, flex: 95, cost: 85 },
    mat: {
      roughness: 0.06,          // Slick, highly polished rubber
      metalness: 0.02,
      ior: 1.54,
      clearcoat: 0.95,          // Deep wet-look polymer sheen
      clearcoatRoughness: 0.03,
      reflectivity: 0.95,
      sheen: 0.25,              // Soft rubbery edge scatter
      sheenRoughness: 0.2,
      sheenColor: WHITE,
      bumpMap: TEX_CACHE.cotton,
      bumpScale: 0.0005         // Fine, tight rubber grain
    }
  },
  leather: {
    label: 'Leather',
    stats: { shine: 25, flex: 60, cost: 95 },
    mat: {
      roughness: 0.52,
      roughnessMap: TEX_CACHE.leather,
      metalness: 0.02,
      ior: 1.48,
      clearcoat: 0.25,
      clearcoatRoughness: 0.38,
      reflectivity: 0.45,
      sheen: 0.35,
      sheenRoughness: 0.55,
      sheenColor: WHITE,
      bumpMap: TEX_CACHE.leather,
      bumpScale: 0.012
    }
  },
  nylon: {
    label: 'Ripstop Nylon',
    stats: { shine: 45, flex: 80, cost: 60 },
    mat: {
      roughness: 0.42,
      roughnessMap: TEX_CACHE.ripstop,
      metalness: 0.06,
      ior: 1.46,
      clearcoat: 0.25,
      clearcoatRoughness: 0.32,
      reflectivity: 0.6,
      sheen: 0.6,
      sheenRoughness: 0.3,
      sheenColor: WHITE,
      bumpMap: TEX_CACHE.ripstop,
      bumpScale: 0.010
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
      bumpMap: TEX_CACHE.nomex, // Fixed typo here (`TEX_Cache` -> `TEX_CACHE`)
      bumpScale: 0.018
    }
  },
  raceSatin: {
    label: 'Race Satin',
    stats: { shine: 65, flex: 80, cost: 70 },
    mat: {
      roughness: 0.28,
      roughnessMap: TEX_CACHE.ripstop,
      metalness: 0.15,
      ior: 1.48,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      reflectivity: 0.82,
      sheen: 0.95,
      sheenRoughness: 0.18,
      sheenColor: WHITE,
      bumpMap: TEX_CACHE.ripstop,
      bumpScale: 0.005
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
    stats: { shine: 12, flex: 55, cost: 50 },
    mat: {
      roughness: 0.82,
      roughnessMap: TEX_CACHE.denim,
      metalness: 0.0,
      ior: 1.45,
      clearcoat: 0.0,
      clearcoatRoughness: 1.0,
      reflectivity: 0.18,
      // Sheen simulates millions of cotton fuzz fibers catching light along the twill ridges
      sheen: 0.85,
      sheenRoughness: 0.45,
      sheenColor: WHITE,
      // Uses your custom canvas-generated twill lines as a physical surface bump map
      bumpMap: TEX_CACHE.denim,
      bumpScale: 0.032         // Pronounced diagonal yarn depth
    }
  },
  corduroy: {
    label: 'Corduroy',
    stats: { shine: 12, flex: 65, cost: 55 },
    mat: {
      roughness: 0.90,
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
      sheen: 0.55,             // Soft cotton fiber scatter
      sheenRoughness: 0.7,
      sheenColor: WHITE,
      bumpMap: TEX_CACHE.cotton,
      bumpScale: 0.014         // Subtle breathable cotton weave depth
    }
  }
};