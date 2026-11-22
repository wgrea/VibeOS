// js/aesthetics/lab/outfit/closures.js
import * as THREE from 'three';

export function buildClosure({
  type = 'zipper',
  yTop = 0.88,
  yBottom = 0.14,
  zOffset = 0.215,
  tiltX = -0.055,
  buttonCount = 5
} = {}) {
  const closureGroup = new THREE.Group();

  const hardwareMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.92,
    roughness: 0.16
  });

  const height = yTop - yBottom;
  const centerY = (yTop + yBottom) / 2;

  // 1. Zipper Assembly (Track + Pull Tab)
  const zipperGroup = new THREE.Group();
  const track = new THREE.Mesh(new THREE.BoxGeometry(0.022, height, 0.024), hardwareMat);
  zipperGroup.add(track);

  const slider = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.042, 0.036), hardwareMat);
  slider.position.set(0, height / 2 - 0.06, 0.008);
  zipperGroup.add(slider);

  const pullTab = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.055, 0.012), hardwareMat);
  pullTab.position.set(0, height / 2 - 0.10, 0.022);
  pullTab.rotation.x = 0.18;
  zipperGroup.add(pullTab);

  closureGroup.add(zipperGroup);

  // 2. Buttons / Snaps Assembly
  const buttonsGroup = new THREE.Group();
  const buttonGeo = new THREE.CylinderGeometry(0.022, 0.024, 0.018, 16);
  buttonGeo.rotateX(Math.PI / 2);

  for (let i = 0; i < buttonCount; i++) {
    const t = buttonCount === 1 ? 0.5 : i / (buttonCount - 1);
    const btn = new THREE.Mesh(buttonGeo, hardwareMat);
    btn.position.set(0, height / 2 - 0.05 - t * (height - 0.1), 0.01);
    buttonsGroup.add(btn);
  }
  closureGroup.add(buttonsGroup);

  closureGroup.position.set(0, centerY, zOffset);
  closureGroup.rotation.x = tiltX;

  function setClosureType(nextType) {
    zipperGroup.visible = nextType === 'zipper';
    buttonsGroup.visible = nextType === 'buttons';
    closureGroup.visible = nextType !== 'none';
  }

  function setDepth(nextZ) {
    closureGroup.position.z = nextZ;
  }

  setClosureType(type);

  return { closureGroup, setClosureType, setDepth };
}
