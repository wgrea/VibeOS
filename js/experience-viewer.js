// js/experience-viewer.js
import * as THREE from 'three';
import { createStage } from './stage.js';

export function createExperienceViewer({
  containerId,
  defaultEra,
  eraFactories,
  allowFirstPerson = false
}) {
  let activeEra = defaultEra;
  let bounce = 0;

  function init() {
    const box = document.getElementById(containerId);

    if (!box) return;

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
      eras[key] = factory();

      eras[key].group.visible = key === activeEra;

      scene.add(eras[key].group);

      if (eras[key].draggable) {
        makeMovable(eras[key].draggable);
      }

      if (eras[key].attachMobileControls) {
        eras[key].attachMobileControls(renderer.domElement);
      }
    });

    box.addEventListener('pointerdown', () => {
      bounce = 0.25;
    });

    document.addEventListener('click', (e) => {
      const pill = e.target.closest('.era-pill');

      if (!pill) return;
      if (!eras[pill.dataset.era]) return;

      activeEra = pill.dataset.era;

      Object.entries(eras).forEach(([key, era]) => {
        era.group.visible = key === activeEra;
      });

      if (eras[activeEra].background) {
        box.style.background =
          eras[activeEra].background;
      }

      if (
        allowFirstPerson &&
        eras[activeEra].isFirstPerson
      ) {
        controls.enabled = false;
        eras[activeEra].resetCamera?.(camera);
      } else {
        controls.enabled = true;
      }

      bounce = 0.22;
    });

    const clock = new THREE.Clock();

    function animate() {
      if (!document.body.contains(box)) return;

      requestAnimationFrame(animate);

      const t = clock.getElapsedTime();

      bounce *= 0.88;

      const spring =
        Math.sin(t * 16) * bounce;

      const currentEra = eras[activeEra];

      if (
        allowFirstPerson &&
        currentEra?.isFirstPerson
      ) {
        currentEra.updateFirstPerson?.(
          keys,
          camera
        );
      } else {
        updateMovement();
        controls.update();
      }

      currentEra?.update(
        t,
        bounce,
        spring
      );

      renderer.render(scene, camera);
    }

    animate();
  }

  document.addEventListener(
    'htmx:afterSwap',
    init
  );

  init();
}