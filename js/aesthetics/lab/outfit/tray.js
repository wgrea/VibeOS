// js/aesthetics/lab/outfit/tray.js
import { COLORS } from './presets.js';

export function initOutfitTrays({
  section,
  state,
  isMultiColorActive,
  ensureValidActiveSlot,
  onChange
}) {
  const selectedTray = section.querySelector('#outfit-selected-tray');
  const multiColorBar = section.querySelector('#outfit-multicolor-bar');
  const multiColorList = section.querySelector('#outfit-multicolor-list');
  const multiColorClear = section.querySelector('#outfit-multicolor-clear');

  // 1. Selected Garment Tray Events (Bound once)
  if (selectedTray) {
    selectedTray.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-clear-slot]');
      if (removeBtn) {
        const slot = removeBtn.dataset.clearSlot;
        if (slot === 'catsuit') state.hasCatsuit = false;
        if (slot === 'onePiece') state.onePiece = 'none';
        if (slot === 'top') state.top = 'none';
        if (slot === 'bottom') state.bottom = 'none';
        ensureValidActiveSlot();
        onChange();
        return;
      }

      const focusChip = e.target.closest('[data-focus-slot]');
      if (focusChip) {
        state.activeSlot = focusChip.dataset.focusSlot;
        onChange();
      }
    });
  }

  // 2. Multi-Color Strip Events (Bound once)
  if (multiColorList) {
    multiColorList.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-remove-color-idx]');
      if (!removeBtn || !isMultiColorActive()) return;

      const idx = Number(removeBtn.dataset.removeColorIdx);
      const activeStyle = state.styles.onePiece;
      if (activeStyle.colors.length > 1) {
        activeStyle.colors.splice(idx, 1);
        activeStyle.color = activeStyle.colors[0];
        onChange();
      }
    });
  }

  if (multiColorClear) {
    multiColorClear.addEventListener('click', () => {
      if (!isMultiColorActive()) return;
      const activeStyle = state.styles.onePiece;
      activeStyle.colors = [activeStyle.colors[0] || COLORS[0]];
      activeStyle.color = activeStyle.colors[0];
      onChange();
    });
  }

  // 3. Render Both Trays
  function renderTrays(equipped) {
    if (selectedTray) {
      if (equipped.length === 0) {
        selectedTray.innerHTML = `<span class="outfit-tray-empty">Grey Figure (Select a garment to customize colors)</span>`;
      } else {
        selectedTray.innerHTML = equipped
          .map((item) => {
            const isFocused = item.slot === state.activeSlot;
            const slotStyle = state.styles[item.slot];
            return `
              <span
                class="outfit-selected-chip ${isFocused ? 'is-editing' : ''}"
                data-focus-slot="${item.slot}"
                title="Click to edit ${item.label} color & fabric"
              >
                <span class="chip-color-dot" style="background:${slotStyle.color.css};"></span>
                ${item.label}
                <button type="button" class="outfit-chip-x" data-clear-slot="${item.slot}" aria-label="Remove ${item.label}">×</button>
              </span>
            `;
          })
          .join('');
      }
    }

    if (multiColorBar && multiColorList) {
      const showMulti = isMultiColorActive() && state.styles.onePiece.palette === 'none';
      multiColorBar.hidden = !showMulti;

      if (showMulti) {
        const colors = state.styles.onePiece.colors;
        multiColorList.innerHTML = colors
          .map(
            (c, idx) => `
              <span class="multicolor-chip">
                <i class="multicolor-dot" style="background:${c.css};"></i>
                <span>${idx + 1}</span>
                ${
                  colors.length > 1
                    ? `<button type="button" class="outfit-chip-x" data-remove-color-idx="${idx}" aria-label="Remove color ${idx + 1}">×</button>`
                    : ''
                }
              </span>
            `
          )
          .join('');
      }
    }
  }

  return { renderTrays };
}
