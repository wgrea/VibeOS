// js/aesthetics/lab/outfit/index.js
import * as THREE from 'three';
import { FABRICS, COLORS, AESTHETIC_PALETTES } from './presets.js';
import { buildMannequin } from './mannequin.js';
import { buildCatsuit } from './garments/catsuit.js';
import { buildJumpsuit } from './garments/jumpsuit.js';
import { buildRacingSuit } from './garments/racing-suit.js';
import { buildSnowsuit } from './garments/snowsuit.js';
import { buildFluffyOnesie } from './garments/fluffy-onesie.js';
import { buildJacket } from './garments/jacket.js';
import { buildSweatshirt } from './garments/sweatshirt.js';
import { buildPants } from './garments/pants.js';
import { initOutfitControls } from './controls.js';

function createSlotStyle(fabric = 'leather', color = COLORS[0]) {
  return {
    fabric,
    color,
    colors: [color],
    palette: 'none'
  };
}

export function createOutfit({ box } = {}) {
  const group = new THREE.Group();
  const rigGroup = new THREE.Group();
  group.add(rigGroup);

  let morphPulse = 0;
  const defaultHex = COLORS[0].hex;

  const state = {
    bodyType: 'boy',
    hasCatsuit: false,
    onePiece: 'none', // 'none' | 'jumpsuit' | 'racing-suit' | 'snowsuit' | 'fluffy-onesie'
    top: 'none',      // 'none' | 'jacket' | 'sweatshirt'
    topVariant: 'moto',
    bottom: 'none',   // 'none' | 'pants'
    bottomVariant: 'cargo',
    closure: 'zipper',
    activeSlot: null, // 'catsuit' | 'onePiece' | 'top' | 'bottom' | null
    styles: {
      catsuit: createSlotStyle('latex', COLORS[0]),
      onePiece: createSlotStyle('leather', COLORS[0]),
      top: createSlotStyle('leather', COLORS[0]),
      bottom: createSlotStyle('denim', COLORS[0])
    }
  };

  // 1. Neutral Grey Mannequin
  const { mannequinGroup, setBodyType, getProfile } = buildMannequin(state.bodyType);
  rigGroup.add(mannequinGroup);

  // 2. Thin Base Layer: Catsuit
  const catsuit = buildCatsuit(defaultHex);
  rigGroup.add(catsuit.suitGroup);

  // 3. One-Piece Outer Suits
  const onePieces = {
    jumpsuit: buildJumpsuit(defaultHex),
    'racing-suit': buildRacingSuit(defaultHex),
    snowsuit: buildSnowsuit(defaultHex),
    'fluffy-onesie': buildFluffyOnesie(defaultHex)
  };
  Object.values(onePieces).forEach((item) => {
    item.garmentGroup.visible = false;
    rigGroup.add(item.garmentGroup);
  });

  // 4. Separates
  const tops = {
    jacket: buildJacket(defaultHex),
    sweatshirt: buildSweatshirt(defaultHex)
  };
  Object.values(tops).forEach((item) => {
    item.garmentGroup.visible = false;
    rigGroup.add(item.garmentGroup);
  });

  const pants = buildPants(defaultHex);
  pants.garmentGroup.visible = false;
  rigGroup.add(pants.garmentGroup);

  const section = box?.closest('.aesthetic-section') || document;
  const { controls, syncUI } = initOutfitControls({
    section,
    state,
    onChange: syncOutfit,
    onBodyChange: () => {
      morphPulse = 1;
      syncOutfit();
    }
  });

  function resolveStyle(slotKey) {
    const s = state.styles[slotKey];
    return {
      fabric: FABRICS[s.fabric] || FABRICS.leather,
      color: s.color || COLORS[0],
      colors: s.colors || [COLORS[0]],
      palette: AESTHETIC_PALETTES[s.palette] || AESTHETIC_PALETTES.none
    };
  }

  function syncOutfit() {
    setBodyType(state.bodyType);
    const profile = getProfile();

    // Sync Catsuit Base
    catsuit.suitGroup.visible = state.hasCatsuit;
    if (state.hasCatsuit) {
      const { fabric, color, palette } = resolveStyle('catsuit');
      catsuit.syncBody(profile);
      catsuit.applyStyle(fabric, color, palette);
      catsuit.setClosureType?.(state.closure);
    }

    // Sync One-Pieces
    Object.entries(onePieces).forEach(([key, item]) => {
      const isVisible = state.onePiece === key;
      item.garmentGroup.visible = isVisible;
      if (isVisible) {
        const { fabric, color, palette, colors } = resolveStyle('onePiece');
        item.syncBody(profile);
        item.applyStyle(fabric, color, palette, colors);
        item.setClosureType?.(state.closure);
      }
    });

    // Sync Tops
    Object.entries(tops).forEach(([key, item]) => {
      const isVisible = state.top === key;
      item.garmentGroup.visible = isVisible;
      if (isVisible) {
        const { fabric, color, palette } = resolveStyle('top');
        item.setVariant?.(state.topVariant);
        item.syncBody(profile);
        item.applyStyle(fabric, color, palette);
        item.setClosureType?.(state.closure);
      }
    });

    // Sync Pants
    pants.garmentGroup.visible = state.bottom === 'pants';
    if (state.bottom === 'pants') {
      const { fabric, color, palette } = resolveStyle('bottom');
      pants.setVariant(state.bottomVariant);
      pants.syncBody(profile);
      pants.applyStyle(fabric, color, palette);
    }

    syncUI();
  }

  syncOutfit();

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #1e293b 0%, #0f172a 60%, #020617 100%)',
    description:
      'Outfit & Material Lab — Mix garments, fabrics, closures, and aesthetic palettes over a neutral mannequin or catsuit base.',
    onSelect(isActive) {
      if (controls) controls.hidden = !isActive;
    },
    update(t, bounce, spring) {
      rigGroup.rotation.y = t * 0.45;
      morphPulse = Math.max(0, morphPulse - 0.06);
      const pulseScale = 1 + Math.sin(morphPulse * Math.PI) * 0.05;
      group.scale.setScalar((1 + spring * 0.12) * pulseScale);
    }
  };
}
