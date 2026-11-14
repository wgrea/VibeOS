import * as THREE from 'three';
import { createStage } from '../../js/stage.js';
import { createScene as create1920s } from '../../js/aesthetics/ui-history/era-1920s.js';
import { createScene as create1950s } from '../../js/aesthetics/ui-history/era-1950s.js';
import { createScene as create1970s } from '../../js/aesthetics/ui-history/era-1970s.js';
import { createScene as create1980s } from '../../js/aesthetics/ui-history/era-1980s.js';
import { createScene as create1990s } from '../../js/aesthetics/ui-history/era-1990s.js';
import { createScene as create2000s } from '../../js/aesthetics/ui-history/era-2000s.js';
import { createScene as create2020s } from '../../js/aesthetics/ui-history/era-2020s.js';

const ERA_DATA = {
  '1920s': {
    heading: 'Mechanical & Rotary Controls',
    desc: 'Before screens existed, interfaces were physical. Bakelite radio dials, brass toggles, and rotary phones established the tactile metaphors—like radio buttons and sliders—that digital UI still uses.',
    builder: create1920s
  },
  '1950s': {
    heading: 'Analog Control Rooms & Nixie Tubes',
    desc: 'Industrial consoles paired heavy push-buttons with glowing Nixie tubes and oscilloscope grids. High-contrast labels helped operators read system states at a glance.',
    builder: create1950s
  },
  '1970s': {
    heading: 'Command Line & Phosphor CRTs',
    desc: 'Interfaces moved onto green and amber CRT monitors. Without a mouse, users navigated purely through typed commands, blinking cursors, and structured text menus.',
    builder: create1970s
  },
  '1980s': {
    heading: 'Early 1-Bit WIMP (Windows, Icons, Menus, Pointer)',
    desc: 'Xerox Star and the early Macintosh replaced typed commands with crisp 1-bit pixel windows, desktop metaphors, and mouse pointers. Real 80s UI was utilitarian monochrome—very different from neon retro nostalgia.',
    builder: create1980s
  },
  '1990s': {
    heading: '3D Gray Bevels & Taskbars',
    desc: 'As color monitors became standard, interfaces used raised and sunken gray borders (bevels) to signal which elements were clickable buttons versus recessed text fields.',
    builder: create1990s
  },
  '2000s': {
    heading: 'Skeuomorphism & Glossy Humanism',
    desc: 'High-resolution displays enabled glass textures, drop shadows, and nature-inspired palettes to make personal computing feel friendly and approachable.',
    builder: create2000s
  },
  '2020s': {
    heading: 'Flat, Adaptive & Spatial UI',
    desc: 'Modern interfaces strip away heavy textures in favor of clean typography, responsive layouts, dark modes, and subtle translucent depth across phones, desktops, and headsets.',
    builder: create2020s
  }
};

function initUiHistory() {
  const sandbox = document.getElementById('uiHistorySandbox');
  const stageContainer = document.getElementById('uiHistoryStage');
  if (!sandbox || !stageContainer || sandbox.dataset.initialized === 'true') return;
  sandbox.dataset.initialized = 'true';

  const stage = createStage('uiHistoryStage');
  const eraScenes = {};
  let activeEra = '1920s';

  // Resize canvas once the HTMX drawer finishes expanding
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        stage.camera.aspect = width / height;
        stage.camera.updateProjectionMatrix();
        stage.renderer.setSize(width, height);
      }
    }
  });
  resizeObserver.observe(stageContainer);

  Object.entries(ERA_DATA).forEach(([eraKey, config]) => {
    const parentWrapper = new THREE.Group();
    parentWrapper.visible = eraKey === activeEra;

    const built = config.builder(THREE);
    parentWrapper.add(built.group);
    stage.scene.add(parentWrapper);
    stage.makeMovable(built.group);

    eraScenes[eraKey] = {
      parent: parentWrapper,
      update: built.update
    };
  });

  const clock = new THREE.Clock();
  const hoverPointer = { x: 0, y: 0 };

  stageContainer.addEventListener('pointermove', (e) => {
    const rect = stageContainer.getBoundingClientRect();
    hoverPointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    hoverPointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  });

  function animate() {
    // Clean up WebGL context when HTMX clears .family-drawer
    if (!document.body.contains(sandbox)) {
      resizeObserver.disconnect();
      stage.renderer.dispose();
      return;
    }

    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();
    stage.controls.update();
    stage.updateMovement();

    if (eraScenes[activeEra]?.update) {
      eraScenes[activeEra].update(elapsed, hoverPointer);
    }

    stage.renderer.render(stage.scene, stage.camera);
  }
  animate();

  // Era Tab Switching
  const tabs = sandbox.querySelectorAll('.era-tab[data-target-era]');
  const headingEl = sandbox.querySelector('#eraHeading');
  const descEl = sandbox.querySelector('#eraDescription');
  const vaporwaveBridge = sandbox.querySelector('#vaporwaveBridge');
  const aeroBridge = sandbox.querySelector('#aeroBridge');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const era = tab.getAttribute('data-target-era');
      const info = ERA_DATA[era];
      if (!info) return;

      activeEra = era;
      sandbox.setAttribute('data-era', era);

      tabs.forEach((t) => t.setAttribute('aria-selected', 'false'));
      tab.setAttribute('aria-selected', 'true');

      Object.entries(eraScenes).forEach(([key, entry]) => {
        entry.parent.visible = key === era;
      });

headingEl.textContent = info.heading;
descEl.textContent = info.desc;

const showVaporwave = era === '1980s' || era === '1990s';
vaporwaveBridge.hidden = !showVaporwave;
vaporwaveBridge.classList.toggle('hidden-note', !showVaporwave);

const showAero = era === '2000s';
aeroBridge.hidden = !showAero;
aeroBridge.classList.toggle('hidden-note', !showAero);

    });
  });

  // Bridge buttons trigger your existing .family-card buttons (which also runs your htmx:beforeRequest cleanup!)
  sandbox.querySelectorAll('[data-jump-family]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetFamily = btn.getAttribute('data-jump-family');
      const targetCard = document.querySelector(`.family-card[data-family="${targetFamily}"]`);

      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.click();
      }
    });
  });
}

initUiHistory();
document.body.addEventListener('htmx:afterSwap', initUiHistory);
