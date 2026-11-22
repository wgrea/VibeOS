// js/aesthetics/lab/outfit/catsuit.js
import * as THREE from 'three';
import { buildClosure } from '../closures.js';

export function buildCatsuit(initialHex) {
  const suitGroup = new THREE.Group();
  const suitMat = new THREE.MeshPhysicalMaterial({ color: initialHex });

  // Mock-neck collar (fits over mannequin neck radius 0.105)
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.135, 0.16, 24), suitMat);
  collar.position.y = 0.92;
  suitGroup.add(collar);

  // Upper torso / shoulders (fits over mannequin chest radius 0.285)
  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.305, 0.222, 0.55, 24), suitMat);
  chest.position.y = 0.58;
  suitGroup.add(chest);

  // Waist & hips (fits over mannequin hips radius 0.275)
  const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.222, 0.295, 0.48, 24), suitMat);
  hips.position.y = 0.08;
  suitGroup.add(hips);

  // Smooth pelvis cap (fits over mannequin pelvis radius 0.255)
  const pelvisCap = new THREE.Mesh(new THREE.SphereGeometry(0.272, 24, 16), suitMat);
  pelvisCap.position.y = -0.14;
  suitGroup.add(pelvisCap);

  // Front closure
  const { closureGroup, setClosureType, setDepth } = buildClosure({
    type: 'zipper',
    yTop: 0.88,
    yBottom: 0.14,
    zOffset: 0.215
  });
  suitGroup.add(closureGroup);

  // Sleeves & Legs
  const arms = [];
  const legs = [];

  [-1, 1].forEach((side) => {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.086, 0.72, 10, 20), suitMat);
    arm.position.set(side * 0.44, 0.39, 0);
    arm.rotation.z = side * -0.18;
    suitGroup.add(arm);
    arms.push({ mesh: arm, side });

    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.114, 0.90, 12, 24), suitMat);
    leg.position.set(side * 0.155, -0.61, 0);
    leg.rotation.z = side * -0.04;
    suitGroup.add(leg);
    legs.push({ mesh: leg, side });
  });

  function applyStyle(fabricPreset, colorPreset) {
    Object.assign(suitMat, fabricPreset.mat);
    suitMat.color.setHex(colorPreset.hex);
    suitMat.sheenColor?.setHex(colorPreset.hex);
    suitMat.needsUpdate = true;
  }

  function syncBody(profile) {
    chest.scale.set(...profile.chestScale);
    hips.scale.set(...profile.hipScale);
    pelvisCap.scale.set(profile.hipScale * 0.98, 0.72, profile.hipScale * 0.96);

    const armScale = (profile.armRadius + 0.014) / 0.086;
    const legScale = (profile.legRadius + 0.016) / 0.114;

    arms.forEach(({ mesh, side }) => {
      mesh.position.x = side * profile.armOffset;
      mesh.scale.set(armScale, 1, armScale);
    });

    legs.forEach(({ mesh, side }) => {
      mesh.position.x = side * profile.legOffset;
      mesh.scale.set(legScale, 1, legScale);
    });

    // Keep zipper flush against chest Z-depth for both Boy (0.72) and Girl (0.68)
    setDepth(0.285 * profile.chestScale[2] + 0.008);
  }

  return { suitGroup, applyStyle, syncBody, setClosureType };
}
