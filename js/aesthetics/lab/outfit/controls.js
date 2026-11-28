// js/aesthetics/lab/outfit/controls.js
import { COLORS } from './palettes.js';
import { initOutfitTrays } from './tray.js';

const ITEM_LABELS = {
  catsuit: 'Catsuit Base',
  jumpsuit: 'Jumpsuit',
  'racing-suit': 'Racing Suit',
  snowsuit: 'Snowsuit',
  onesie: 'Onesie',
  jacket: 'Jacket',
  sweatshirt: 'Sweatshirt',
  pants: 'Pants'
};

export function initOutfitControls({ section, state, onChange, onBodyChange }) {
  const wrap   = section.querySelector('#outfit-controls-wrap');
  const panel  = section.querySelector('#outfit-controls');
  const toggles = section.querySelectorAll('[aria-controls="outfit-controls"]');

  if (!wrap || !panel) {
    return { controls: null, syncUI: () => {}, setPanelOpen: () => {} };
  }

  // --- Collapsible panel wiring (top + bottom toggle) ---
  function setPanelOpen(open) {
    panel.classList.toggle('is-open', open);
    toggles.forEach((btn) => {
      btn.setAttribute('aria-expanded', String(open));
      // Bottom button's label is fixed ("Hide Outfit Menu") — skip it
      if (btn.classList.contains('lab-controls-toggle--bottom')) return;
      const label = btn.querySelector('.toggle-label');
      if (label) label.textContent = open ? 'Hide Outfit Menu' : 'Customize Outfit';
    });
  }

  toggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      setPanelOpen(!panel.classList.contains('is-open'));
    });
  });

  const swatchContainer = section.querySelector('#outfit-swatches');
  const variantRow = section.querySelector('#outfit-variant-row');
  const stylePanel = section.querySelector('#outfit-style-panel');
  const editingLabel = section.querySelector('#outfit-editing-label');

  function isMultiColorActive() {
    return (
      state.activeSlot === 'onePiece' &&
      (state.onePiece === 'racing-suit' || state.onePiece === 'snowsuit')
    );
  }

  function getEquippedList() {
    const list = [];
    if (state.hasCatsuit) list.push({ slot: 'catsuit', label: ITEM_LABELS.catsuit });
    if (state.onePiece !== 'none') list.push({ slot: 'onePiece', label: ITEM_LABELS[state.onePiece] });
    if (state.top !== 'none') list.push({ slot: 'top', label: ITEM_LABELS[state.top] });
    if (state.bottom !== 'none') list.push({ slot: 'bottom', label: ITEM_LABELS[state.bottom] });
    return list;
  }

function ensureValidActiveSlot() {
    let equipped = getEquippedList();
    if (equipped.length === 0) {
      // Default to Catsuit Base being equipped on startup
      state.hasCatsuit = true;
      state.activeSlot = 'catsuit';
      equipped = getEquippedList();
    }
    if (!equipped.some((item) => item.slot === state.activeSlot)) {
      state.activeSlot = equipped[equipped.length - 1].slot;
    }
  }

  const { renderTrays } = initOutfitTrays({
    section,
    state,
    isMultiColorActive,
    ensureValidActiveSlot,
    onChange
  });

  // 1. Color Swatches (Applies to state.activeSlot)
  if (swatchContainer && swatchContainer.children.length === 0) {
    COLORS.forEach((c) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'swatch-btn';
      btn.style.backgroundColor = c.css;
      btn.title = c.name;
      btn.setAttribute('aria-label', c.name);
      btn.addEventListener('click', () => {
        if (!state.activeSlot) return;
        const activeStyle = state.styles[state.activeSlot];
        activeStyle.palette = 'none';

        if (isMultiColorActive()) {
          activeStyle.colors.push(c);
          activeStyle.color = activeStyle.colors[0];
        } else {
          activeStyle.color = c;
          activeStyle.colors = [c];
        }
        onChange();
      });
      swatchContainer.appendChild(btn);
    });
  }

  // 2. Body Type (Boy / Girl)
  panel.querySelectorAll('[data-body]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.bodyType = btn.dataset.body;
      (onBodyChange || onChange)();
    });
  });

  // 3. Catsuit Base
  panel.querySelectorAll('[data-base="catsuit"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.hasCatsuit = !state.hasCatsuit;
      if (state.hasCatsuit) state.activeSlot = 'catsuit';
      ensureValidActiveSlot();
      onChange();
    });
  });

  // 4. One-Piece Suits
  panel.querySelectorAll('[data-onepiece]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.onepiece;
      state.onePiece = state.onePiece === val ? 'none' : val;
      if (state.onePiece !== 'none') {
        state.top = 'none';
        state.bottom = 'none';
        state.activeSlot = 'onePiece';
      }
      ensureValidActiveSlot();
      onChange();
    });
  });

  // 5. Tops
  panel.querySelectorAll('[data-top]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.top;
      state.top = state.top === val ? 'none' : val;
      if (state.top !== 'none') {
        state.onePiece = 'none';
        state.topVariant = state.top === 'jacket' ? 'moto' : 'hoodie';
        state.activeSlot = 'top';
      }
      ensureValidActiveSlot();
      onChange();
    });
  });

  // 6. Bottoms
  panel.querySelectorAll('[data-bottom]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.bottom;
      state.bottom = state.bottom === val ? 'none' : val;
      if (state.bottom !== 'none') {
        state.onePiece = 'none';
        state.bottomVariant = 'cargo';
        state.activeSlot = 'bottom';
      }
      ensureValidActiveSlot();
      onChange();
    });
  });

  // 7. Sub-Style Variants, Fabric, Palette & Closure
  panel.querySelectorAll('[data-variant]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const grp = btn.closest('[data-variant-group]');
      if (grp?.dataset.variantGroup === 'pants') {
        state.bottomVariant = btn.dataset.variant;
      } else {
        state.topVariant = btn.dataset.variant;
      }
      onChange();
    });
  });

  panel.querySelectorAll('[data-fabric]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!state.activeSlot) return;
      state.styles[state.activeSlot].fabric = btn.dataset.fabric;
      onChange();
    });
  });

  panel.querySelectorAll('[data-palette]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!state.activeSlot) return;
      state.styles[state.activeSlot].palette = btn.dataset.palette;
      onChange();
    });
  });

  panel.querySelectorAll('[data-closure]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.closure = btn.dataset.closure;
      onChange();
    });
  });

  function syncPillGroup(selector, isMatch) {
    panel.querySelectorAll(selector).forEach((btn) => {
      const active = isMatch(btn);
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function syncUI() {
    ensureValidActiveSlot();
    const equipped = getEquippedList();

    syncPillGroup('[data-body]', (b) => b.dataset.body === state.bodyType);
    syncPillGroup('[data-base="catsuit"]', () => state.hasCatsuit);
    syncPillGroup('[data-onepiece]', (b) => b.dataset.onepiece === state.onePiece);
    syncPillGroup('[data-top]', (b) => b.dataset.top === state.top);
    syncPillGroup('[data-bottom]', (b) => b.dataset.bottom === state.bottom);
    syncPillGroup('[data-closure]', (b) => b.dataset.closure === state.closure);

if (stylePanel) {
  stylePanel.removeAttribute('hidden');
}

    if (state.activeSlot) {
      const activeStyle = state.styles[state.activeSlot];
      const activeItem = equipped.find((i) => i.slot === state.activeSlot);
      if (editingLabel && activeItem) {
        editingLabel.textContent = activeItem.label;
      }

      syncPillGroup('[data-fabric]', (b) => b.dataset.fabric === activeStyle.fabric);
      syncPillGroup('[data-palette]', (b) => b.dataset.palette === activeStyle.palette);

      if (swatchContainer) {
        swatchContainer.querySelectorAll('.swatch-btn').forEach((b) => {
          b.classList.toggle(
            'active',
            b.title === activeStyle.color.name && activeStyle.palette === 'none'
          );
        });
      }
    }

    if (variantRow) {
      variantRow.querySelectorAll('[data-variant-group]').forEach((grp) => {
        const target = grp.dataset.variantGroup;
        const isVisible =
          (target === 'jacket' && state.top === 'jacket') ||
          (target === 'sweatshirt' && state.top === 'sweatshirt') ||
          (target === 'pants' && state.bottom === 'pants');

        grp.hidden = !isVisible;

        if (isVisible) {
          const activeVariant = target === 'pants' ? state.bottomVariant : state.topVariant;
          grp.querySelectorAll('[data-variant]').forEach((b) => {
            const active = b.dataset.variant === activeVariant;
            b.classList.toggle('active', active);
            b.setAttribute('aria-pressed', String(active));
          });
        }
      });
    }

    renderTrays(equipped);
  }

// Initial sync so catsuit, fabric, palette, and swatches are bound immediately
  syncUI();

  return { controls: wrap, syncUI, setPanelOpen };
}