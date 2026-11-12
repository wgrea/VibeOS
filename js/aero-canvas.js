import * as THREE from 'three';
import { createStage } from './stage.js';
import { createXpBliss } from './aesthetics/frutiger-aero/xp-bliss.js';
import { createWeb2Gloss } from './aesthetics/frutiger-aero/web2-gloss.js';
import { createVistaGlass } from './aesthetics/frutiger-aero/vista-glass.js';
import { createSkeuoDial } from './aesthetics/frutiger-aero/skeuo-dial.js';
import { createFlatCollapse } from './aesthetics/frutiger-aero/flat-collapse.js';

let activeEra = 'xp';
let bounce = 0;
let eras = {};
let currentBox = null;

function initAeroCanvas() {
  const box = document.getElementById('aero-canvas-container');
  if (!box || box === currentBox) return;
  currentBox = box;

  const { scene, camera, renderer, controls } = createStage('aero-canvas-container');

  eras = {
    xp: createXpBliss(),
    web2: createWeb2Gloss(),
    vista: createVistaGlass(),
    skeuo: createSkeuoDial(),
    flat: createFlatCollapse()
  };

  Object.entries(eras).forEach(([key, era]) => {
    era.group.visible = (key === activeEra);
    scene.add(era.group);
  });

  box.addEventListener('pointerdown', () => { bounce = 0.25; });

  const clock = new THREE.Clock();
  function animate() {
    if (!document.body.contains(box)) return;
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();
    bounce *= 0.88;
    const spring = Math.sin(t * 16) * bounce;

    eras[activeEra]?.update(t, bounce, spring);
    controls.update();
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

  if (currentBox) {
    currentBox.style.background = eras[activeEra].background;
  }
  bounce = 0.22;
});

document.addEventListener('htmx:afterSwap', initAeroCanvas);
initAeroCanvas();
