import * as THREE from 'three';
import { createStage } from './stage.js';
import { createEccojams } from './aesthetics/vaporwave/eccojams.js';
import { createFloralShoppe } from './aesthetics/vaporwave/floral-shoppe.js';
import { createMallsoft } from './aesthetics/vaporwave/mallsoft.js';
import { createFutureFunk } from './aesthetics/vaporwave/future-funk.js';
import { createSlushwave } from './aesthetics/vaporwave/slushwave.js';

let activeEra = 'eccojams';
let bounce = 0;
let eras = {};
let currentBox = null;
let stageCamera = null;
let stageControls = null;

function initVaporwaveCanvas() {
  const box = document.getElementById('vaporwave-canvas-container');
  if (!box || box === currentBox) return;
  currentBox = box;

  const { scene, camera, renderer, controls, makeMovable, updateMovement, keys } = createStage('vaporwave-canvas-container');
  stageCamera = camera;
  stageControls = controls;

  eras = {
    eccojams: createEccojams(),
    floral: createFloralShoppe(),
    mallsoft: createMallsoft(),
    futurefunk: createFutureFunk(),
    slushwave: createSlushwave()
  };

  Object.entries(eras).forEach(([key, era]) => {
    era.group.visible = (key === activeEra);
    scene.add(era.group);
    if (era.draggable) makeMovable(era.draggable);
    if (era.attachMobileControls) era.attachMobileControls(renderer.domElement);
  });


  box.addEventListener('pointerdown', () => { bounce = 0.25; });

  const clock = new THREE.Clock();
  function animate() {
    if (!document.body.contains(box)) return;
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();
    bounce *= 0.88;
    const spring = Math.sin(t * 16) * bounce;

    const currentEra = eras[activeEra];
    if (currentEra?.isFirstPerson) {
      currentEra.updateFirstPerson(keys, camera);
    } else {
      updateMovement();
      controls.update();
    }

    currentEra?.update(t, bounce, spring);
    renderer.render(scene, camera);
  }
  animate();
}

document.addEventListener('click', (e) => {
  const pill = e.target.closest('.era-pill');
  if (!pill || !eras[pill.dataset.era]) return;

  activeEra = pill.dataset.era;
  Object.entries(eras).forEach(([key, era]) => {
    era.group.visible = (key === activeEra);
  });

  const currentEra = eras[activeEra];
  if (currentBox) {
    currentBox.style.background = currentEra.background;
  }

  // Switch between First-Person Mode (Mallsoft) and Orbit Camera Mode
  if (stageControls && stageCamera) {
    if (currentEra.isFirstPerson) {
      stageControls.enabled = false;
      currentEra.resetCamera(stageCamera);
    } else {
      stageControls.enabled = true;
      stageCamera.position.set(0, 1.4, 6.2);
      stageCamera.lookAt(0, 0, 0);
    }
  }
  bounce = 0.22;
});

document.addEventListener('htmx:afterSwap', initVaporwaveCanvas);
initVaporwaveCanvas();
