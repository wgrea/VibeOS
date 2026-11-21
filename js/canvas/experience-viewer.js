// js/canvas/experience-viewer.js
import * as THREE from 'three';
import { createStage } from './stage.js';
import { setupEraNav } from './era-nav.js';

export function createExperienceViewer({
  containerId,
  stageId = null,
  defaultEra,
  eraFactories,
  eraDescriptions = {},
  allowFirstPerson = false
}) {
  const storageKey = `vibeos_era_${containerId}`;
  const savedEra = sessionStorage.getItem(storageKey);
  let activeEra = savedEra && eraFactories[savedEra] ? savedEra : defaultEra;
  let bounce = 0;

  function init() {
    const box = document.getElementById(containerId);
    if (!box || box.dataset.viewerInitialized === 'true') return;
    box.dataset.viewerInitialized = 'true';

    // Re-check sessionStorage each time the drawer re-mounts via HTMX
    const currentSaved = sessionStorage.getItem(storageKey);
    if (currentSaved && eraFactories[currentSaved]) {
      activeEra = currentSaved;
    }

    const section = box.closest('.aesthetic-section');
    const stage = createStage(containerId);
    const {
      scene,
      camera,
      renderer,
      controls,
      makeMovable,
      updateMovement,
      keys
    } = stage;

    const eras = {};

Object.entries(eraFactories).forEach(([key, factory]) => {
  eras[key] = factory({ camera, domElement: renderer.domElement, box });
  eras[key].group.visible = key === activeEra;
  scene.add(eras[key].group);

      if (eras[key].draggable) {
        makeMovable(eras[key].draggable);
      }

      if (eras[key].attachMobileControls) {
        eras[key].attachMobileControls(renderer.domElement);
      }
    });

    const nav = setupEraNav(section, {
      stageId,
      onSelect: (eraKey, shouldBounce) => selectEra(eraKey, shouldBounce)
    });

    function selectEra(eraKey, shouldBounce = true) {
      if (!eras[eraKey]) return;
      activeEra = eraKey;
      sessionStorage.setItem(storageKey, eraKey);

// Inside selectEra(eraKey, shouldBounce = true)
Object.entries(eras).forEach(([key, era]) => {
  const isActive = key === activeEra;
  era.group.visible = isActive;
  era.onSelect?.(isActive);
});

      if (eras[activeEra].background) {
        box.style.background = eras[activeEra].background;
      }

      if (allowFirstPerson && eras[activeEra].isFirstPerson) {
        controls.enabled = false;
        eras[activeEra].resetCamera?.(camera);
      } else {
        controls.enabled = true;
      }

      const descriptionText =
        eras[activeEra]?.description ||
        eraDescriptions[activeEra]?.text ||
        'Interactive 3D aesthetic primitive — full lore & visual breakdown queued for polish.';

      nav.sync(activeEra, descriptionText);

      if (shouldBounce) bounce = 0.22;
    }

    // Initial sync on load (no bounce)
    selectEra(activeEra, false);

    box.addEventListener('pointerdown', () => {
      bounce = 0.25;
    });

    const clock = new THREE.Clock();

    function animate() {
      if (!document.body.contains(box)) return;

      requestAnimationFrame(animate);

      const t = clock.getElapsedTime();
      bounce *= 0.88;
      const spring = Math.sin(t * 16) * bounce;
      const currentEra = eras[activeEra];

      if (allowFirstPerson && currentEra?.isFirstPerson) {
        currentEra.updateFirstPerson?.(keys, camera);
      } else {
        updateMovement();
        controls.update();
      }

      currentEra?.update(t, bounce, spring);
      renderer.render(scene, camera);
    }

    animate();
  }

  document.addEventListener('htmx:afterSwap', init);
  init();
}
