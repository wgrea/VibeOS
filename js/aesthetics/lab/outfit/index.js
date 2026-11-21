// js/aesthetics/lab/outfit/index.js
import * as THREE from 'three';
import { FABRICS, COLORS } from './presets.js';
import { buildCatsuit } from './catsuit.js';

export function createOutfit({ box } = {}) {
  const group = new THREE.Group();
  let currentFabric = 'latex';
  let currentColor = COLORS[0];

  const { suitGroup, applyStyle } = buildCatsuit(currentColor.hex);
  group.add(suitGroup);

  const section = box?.closest('.aesthetic-section') || document;
  const controls = section.querySelector('#outfit-controls');
  const swatchContainer = section.querySelector('#outfit-swatches');

  function syncOutfit() {
    const preset = FABRICS[currentFabric];
    applyStyle(preset, currentColor);
  }

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
        currentColor = c;
        syncOutfit();
      });
      swatchContainer.appendChild(btn);
    });
  }

  controls?.querySelectorAll('[data-fabric]').forEach((btn) => {
    btn.addEventListener('click', () => {
      controls.querySelectorAll('[data-fabric]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFabric = btn.dataset.fabric;
      syncOutfit();
    });
  });

  syncOutfit();

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #1e293b 0%, #0f172a 60%, #020617 100%)',
    description: 'Catsuit Material Lab — Switch between Latex, PVC, and Leather to compare surface gloss and color finishes.',
    onSelect(isActive) {
      if (controls) controls.hidden = !isActive;
    },
    update(t, bounce, spring) {
      suitGroup.rotation.y = t * 0.45;
      group.scale.setScalar(1 + spring * 0.12);
    }
  };
}
