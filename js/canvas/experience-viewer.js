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
      let era;
      try {
        era = factory({ camera, domElement: renderer.domElement, box });
      } catch (err) {
        console.error(`[viewer] FACTORY THREW for "${key}":`, err);
        return;
      }

      if (!era) {
        console.error(`[viewer] factory "${key}" returned ${era}`);
        return;
      }

      if (!era.group) {
        console.error(`[viewer] factory "${key}" returned object with no .group`);
        return;
      }

      if (!(era.group instanceof THREE.Group)) {
        console.error(
          `[viewer] factory "${key}" returned .group that is not a THREE.Group:`,
          era.group
        );
      }

      eras[key] = era;
      era.group.visible = key === activeEra;
      scene.add(era.group);

      if (era.draggable) makeMovable(era.draggable);
      if (era.attachMobileControls) era.attachMobileControls(renderer.domElement);
    });

    const nav = setupEraNav(section, {
      stageId,
      onSelect: (eraKey, shouldBounce) => selectEra(eraKey, shouldBounce)
    });

    function selectEra(eraKey, shouldBounce = true) {
      if (!eras[eraKey]) {
        console.error(
          `[selectEra] "${eraKey}" not in eras. Check that data-era in HTML matches an eraFactories key. Keys:`,
          Object.keys(eras)
        );
        return;
      }
      activeEra = eraKey;
      sessionStorage.setItem(storageKey, eraKey);

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

      try {
        currentEra?.update(t, bounce, spring);
      } catch (err) {
        console.error(`[animate] update() threw for "${activeEra}":`, err);
      }

      renderer.render(scene, camera);
    }

    animate();
  }

  document.addEventListener('htmx:afterSwap', init);
  init();
}