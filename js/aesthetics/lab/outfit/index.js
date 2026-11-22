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

export function createOutfit({ box } = {}) {
  const group = new THREE.Group();
  const rigGroup = new THREE.Group();
  group.add(rigGroup);

  const state = {
    bodyType: 'boy',
    hasCatsuit: false,
    catsuitFabric: 'latex',
    catsuitColor: COLORS,
    onePiece: 'none', // 'none' | 'jumpsuit' | 'racing-suit' | 'snowsuit' | 'fluffy-onesie'
    top: 'none',      // 'none' | 'jacket' | 'sweatshirt'
    topVariant: 'moto',
    bottom: 'none',   // 'none' | 'pants'
    bottomVariant: 'cargo',
    fabric: 'leather',
    color: COLORS,
    palette: 'none',
    closure: 'zipper'
  };

  // 1. Neutral Grey Mannequin
  const { mannequinGroup, setBodyType, getProfile } = buildMannequin(state.bodyType);
  rigGroup.add(mannequinGroup);

  // 2. Thin Base Layer: Catsuit
  const catsuit = buildCatsuit(state.catsuitColor.hex);
  rigGroup.add(catsuit.suitGroup);

  // 3. One-Piece Outer Suits (Can wear over Catsuit; mutually exclusive with Tops/Bottoms)
  const onePieces = {
    jumpsuit: buildJumpsuit(state.color.hex),
    'racing-suit': buildRacingSuit(state.color.hex),
    snowsuit: buildSnowsuit(state.color.hex),
    'fluffy-onesie': buildFluffyOnesie(state.color.hex)
  };
  Object.values(onePieces).forEach((item) => {
    item.garmentGroup.visible = false;
    rigGroup.add(item.garmentGroup);
  });

  // 4. Separates (Can wear over Catsuit)
  const tops = {
    jacket: buildJacket(state.color.hex),
    sweatshirt: buildSweatshirt(state.color.hex)
  };
  Object.values(tops).forEach((item) => {
    item.garmentGroup.visible = false;
    rigGroup.add(item.garmentGroup);
  });

  const pants = buildPants(state.color.hex);
  pants.garmentGroup.visible = false;
  rigGroup.add(pants.garmentGroup);

  const section = box?.closest('.aesthetic-section') || document;
  const controls = section.querySelector('#outfit-controls');
  const swatchContainer = section.querySelector('#outfit-swatches');
  const variantRow = section.querySelector('#outfit-variant-row');

  function syncUIButtons() {
    if (!controls) return;
    controls.querySelectorAll('[data-onepiece]').forEach((b) => {
      b.classList.toggle('active', b.dataset.onepiece === state.onePiece);
    });
    controls.querySelectorAll('[data-top]').forEach((b) => {
      b.classList.toggle('active', b.dataset.top === state.top);
    });
    controls.querySelectorAll('[data-bottom]').forEach((b) => {
      b.classList.toggle('active', b.dataset.bottom === state.bottom);
    });

    // Show sub-style pills when Jacket, Sweatshirt, or Pants is active
    if (variantRow) {
      variantRow.querySelectorAll('[data-variant-group]').forEach((grp) => {
        const target = grp.dataset.variantGroup;
        grp.hidden = !(
          (target === 'jacket' && state.top === 'jacket') ||
          (target === 'sweatshirt' && state.top === 'sweatshirt') ||
          (target === 'pants' && state.bottom === 'pants')
        );
      });
    }
  }

  function syncOutfit() {
    setBodyType(state.bodyType);
    const profile = getProfile();
    const activeFabric = FABRICS[state.fabric] || FABRICS.leather;
    const activePalette = AESTHETIC_PALETTES[state.palette] || AESTHETIC_PALETTES.none;

    // Sync Catsuit Base
    catsuit.suitGroup.visible = state.hasCatsuit;
    if (state.hasCatsuit) {
      const baseFab = FABRICS[state.catsuitFabric] || FABRICS.latex;
      // If no outer layer is active, apply main color/fabric directly to the catsuit
      const useMainControls = state.onePiece === 'none' && state.top === 'none' && state.bottom === 'none';
      catsuit.syncBody(profile);
      catsuit.applyStyle(
        useMainControls ? activeFabric : baseFab,
        useMainControls ? state.color : state.catsuitColor
      );
      catsuit.setClosureType?.(state.closure);
    }

    // Sync One-Pieces
    Object.entries(onePieces).forEach(([key, item]) => {
      const isVisible = state.onePiece === key;
      item.garmentGroup.visible = isVisible;
      if (isVisible) {
        item.syncBody(profile);
        item.applyStyle(activeFabric, state.color, activePalette);
        item.setClosureType?.(state.closure);
      }
    });

    // Sync Tops
    Object.entries(tops).forEach(([key, item]) => {
      const isVisible = state.top === key;
      item.garmentGroup.visible = isVisible;
      if (isVisible) {
        item.setVariant?.(state.topVariant);
        item.syncBody(profile);
        item.applyStyle(activeFabric, state.color, activePalette);
        item.setClosureType?.(state.closure);
      }
    });

    // Sync Pants
    pants.garmentGroup.visible = state.bottom === 'pants';
    if (state.bottom === 'pants') {
      pants.setVariant(state.bottomVariant);
      pants.syncBody(profile);
      pants.applyStyle(activeFabric, state.color, activePalette);
    }

    syncUIButtons();
  }

  // Color Swatches
  if (swatchContainer && swatchContainer.children.length === 0) {
    COLORS.forEach((c, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `swatch-btn ${i === 0 ? 'active' : ''}`;
      btn.style.backgroundColor = c.css;
      btn.title = c.name;
      btn.setAttribute('aria-label', c.name);
      btn.addEventListener('click', () => {
        swatchContainer.querySelectorAll('.swatch-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.color = c;
        state.palette = 'none';
        controls?.querySelectorAll('[data-palette]').forEach((b) => {
          b.classList.toggle('active', b.dataset.palette === 'none');
        });
        syncOutfit();
      });
      swatchContainer.appendChild(btn);
    });
  }

  // Body Type (Boy / Girl)
  controls?.querySelectorAll('[data-body]').forEach((btn) => {
    btn.addEventListener('click', () => {
      controls.querySelectorAll('[data-body]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.bodyType = btn.dataset.body;
      syncOutfit();
    });
  });

  // Base Layer (Mannequin Only vs Catsuit Base)
  controls?.querySelectorAll('[data-base]').forEach((btn) => {
    btn.addEventListener('click', () => {
      controls.querySelectorAll('[data-base]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.hasCatsuit = btn.dataset.base === 'catsuit';
      syncOutfit();
    });
  });

  // One-Piece Selector (Auto-clears separates so jackets don't stack over bulky suits)
  controls?.querySelectorAll('[data-onepiece]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.onePiece = btn.dataset.onepiece;
      if (state.onePiece !== 'none') {
        state.top = 'none';
        state.bottom = 'none';
      }
      syncOutfit();
    });
  });

  // Top Selector (Auto-clears thick one-pieces; preserves Catsuit base)
  controls?.querySelectorAll('[data-top]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.top = btn.dataset.top;
      if (state.top !== 'none') {
        state.onePiece = 'none';
        state.topVariant = state.top === 'jacket' ? 'moto' : 'hoodie';
      }
      syncOutfit();
    });
  });

  // Bottom Selector (Auto-clears thick one-pieces; preserves Catsuit base)
  controls?.querySelectorAll('[data-bottom]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.bottom = btn.dataset.bottom;
      if (state.bottom !== 'none') {
        state.onePiece = 'none';
      }
      syncOutfit();
    });
  });

  // Sub-Style Variants (Moto/Bomber/Puffer/Windbreaker, Hoodie/Crewneck, Cargo/Track/Snow/Moto)
  controls?.querySelectorAll('[data-variant]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const grp = btn.closest('[data-variant-group]');
      grp?.querySelectorAll('[data-variant]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      if (grp?.dataset.variantGroup === 'pants') {
        state.bottomVariant = btn.dataset.variant;
      } else {
        state.topVariant = btn.dataset.variant;
      }
      syncOutfit();
    });
  });

  // Fabric Selector
  controls?.querySelectorAll('[data-fabric]').forEach((btn) => {
    btn.addEventListener('click', () => {
      controls.querySelectorAll('[data-fabric]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.fabric = btn.dataset.fabric;
      syncOutfit();
    });
  });

  // Aesthetic Palette Selector
  controls?.querySelectorAll('[data-palette]').forEach((btn) => {
    btn.addEventListener('click', () => {
      controls.querySelectorAll('[data-palette]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.palette = btn.dataset.palette;
      syncOutfit();
    });
  });

  // Closure Selector (Zipper / Buttons)
  controls?.querySelectorAll('[data-closure]').forEach((btn) => {
    btn.addEventListener('click', () => {
      controls.querySelectorAll('[data-closure]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.closure = btn.dataset.closure;
      syncOutfit();
    });
  });

  syncOutfit();

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #1e293b 0%, #0f172a 60%, #020617 100%)',
description: 'Outfit & Material Lab — Mix garments, fabrics, closures, and aesthetic palettes over a neutral mannequin or catsuit base.',
onSelect(isActive) {
if (controls) controls.hidden = !isActive;
},
update(t, bounce, spring) {
rigGroup.rotation.y = t * 0.45;
group.scale.setScalar(1 + spring * 0.12);
}
};
}