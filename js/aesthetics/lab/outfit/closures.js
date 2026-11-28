// js/aesthetics/lab/outfit/closures.js
import * as THREE from 'three';

export function buildClosure({
  type = 'zipper',
  yTop = 0.88,
  yBottom = 0.14,
  zOffset = 0.215,
  tiltX = 0,
  buttonCount = 5,
  slim = false,
  waistDropZ = 0.055,
  topDropZ = 0.015
} = {}) {
  const closureGroup = new THREE.Group();

  const hardwareMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.92,
    roughness: 0.16
  });

  const height = yTop - yBottom;
  const centerY = (yTop + yBottom) / 2;
  const depthScale = slim ? 0.35 : 1.0;

  // Contour offset relative to chest zOffset so waist/collar stay flush with torso
  function contourZ(localY) {
    const t = (localY + height / 2) / height; // 0 = bottom, 1 = top
    if (t < 0.55) {
      const u = 1 - t / 0.55;
      return -waistDropZ * u * u;
    }
    const u = (t - 0.55) / 0.45;
    return -topDropZ * u * u;
  }

  // 1. Zipper Assembly (Contoured Track + Slider + Pull Tab)
  const zipperGroup = new THREE.Group();
  const trackGeo = new THREE.BoxGeometry(
    slim ? 0.016 : 0.022,
    height,
    0.024 * depthScale,
    1,
    24,
    1
  );
  const pos = trackGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    pos.setZ(i, pos.getZ(i) + contourZ(y));
  }
  trackGeo.computeVertexNormals();

  const track = new THREE.Mesh(trackGeo, hardwareMat);
  zipperGroup.add(track);

  const sliderY = height / 2 - 0.06;
  const slider = new THREE.Mesh(
    new THREE.BoxGeometry(slim ? 0.026 : 0.036, slim ? 0.030 : 0.042, 0.036 * depthScale),
    hardwareMat
  );
  slider.position.set(0, sliderY, 0.008 * depthScale + contourZ(sliderY));
  zipperGroup.add(slider);

  const pullY = height / 2 - 0.10;
  const pullTab = new THREE.Mesh(
    new THREE.BoxGeometry(slim ? 0.018 : 0.024, slim ? 0.040 : 0.055, 0.012 * depthScale),
    hardwareMat
  );
  pullTab.position.set(0, pullY, 0.020 * depthScale + contourZ(pullY));
  pullTab.rotation.x = slim ? 0.06 : 0.18;
  zipperGroup.add(pullTab);

  closureGroup.add(zipperGroup);

  // 2. Buttons / Snaps Assembly
  const buttonsGroup = new THREE.Group();
  const buttonGeo = new THREE.CylinderGeometry(
    slim ? 0.016 : 0.022,
    slim ? 0.018 : 0.024,
    0.018 * depthScale,
    16
  );
  buttonGeo.rotateX(Math.PI / 2);

  for (let i = 0; i < buttonCount; i++) {
    const t = buttonCount === 1 ? 0.5 : i / (buttonCount - 1);
    const by = height / 2 - 0.05 - t * (height - 0.1);
    const btn = new THREE.Mesh(buttonGeo, hardwareMat);
    btn.position.set(0, by, 0.01 * depthScale + contourZ(by));
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