// aesthetics/lab/outfit/catsuit.js
import * as THREE from 'three';

export function buildCatsuit(initialHex) {
  const suitGroup = new THREE.Group();

  const suitMat = new THREE.MeshPhysicalMaterial({ color: initialHex });
  const zipperMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.92,
    roughness: 0.15
  });

  // Mock-neck collar
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.16, 24), suitMat);
  collar.position.y = 0.92;
  suitGroup.add(collar);

  // Upper torso / shoulders
  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.23, 0.55, 24), suitMat);
  chest.scale.set(1.15, 1, 0.72);
  chest.position.y = 0.58;
  suitGroup.add(chest);

  // Waist & hips
  const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.31, 0.48, 24), suitMat);
  hips.scale.set(1.12, 1, 0.76);
  hips.position.y = 0.08;
  suitGroup.add(hips);

  // Front chrome zipper
  const zipper = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.78, 0.03), zipperMat);
  zipper.position.set(0, 0.52, 0.22);
  zipper.rotation.x = -0.06;
  suitGroup.add(zipper);

  // Sleeves & Legs
  [-1, 1].forEach((side) => {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.78, 10, 20), suitMat);
    arm.position.set(side * 0.44, 0.38, 0);
    arm.rotation.z = side * -0.18;
    suitGroup.add(arm);

    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.115, 0.95, 12, 24), suitMat);
    leg.position.set(side * 0.16, -0.62, 0);
    leg.rotation.z = side * -0.04;
    suitGroup.add(leg);
  });

  function applyStyle(fabricPreset, colorPreset) {
    Object.assign(suitMat, fabricPreset.mat);
    suitMat.color.setHex(colorPreset.hex);
    suitMat.sheenColor?.setHex(colorPreset.hex);
    suitMat.needsUpdate = true;
  }

  return { suitGroup, applyStyle };
}
