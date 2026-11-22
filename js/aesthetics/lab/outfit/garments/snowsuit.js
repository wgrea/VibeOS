// js/aesthetics/lab/outfit/garments/snowsuit.js
import * as THREE from 'three';
import { buildClosure } from '../closures.js';

export function buildSnowsuit(initialHex = 0x1d4ed8) {
  const garmentGroup = new THREE.Group();

  const primaryMat = new THREE.MeshPhysicalMaterial({ color: initialHex });
  const secondaryMat = new THREE.MeshPhysicalMaterial({ color: 0xf1f5f9 });
  const accentMat = new THREE.MeshPhysicalMaterial({ color: 0x111318 });

  // Tall insulated storm collar
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.175, 0.17, 24), accentMat);
  collar.position.y = 0.92;
  garmentGroup.add(collar);

  // Puffy torso + quilted baffle rings
  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.355, 0.27, 0.56, 24), primaryMat);
  chest.position.y = 0.58;
  garmentGroup.add(chest);

  const chestYoke = new THREE.Mesh(new THREE.CylinderGeometry(0.358, 0.325, 0.18, 24), secondaryMat);
  chestYoke.position.y = 0.76;
  garmentGroup.add(chestYoke);

  const baffles = [];
  [0.64, 0.50, 0.36, 0.18, 0.02].forEach((yPos, idx) => {
    const r = yPos > 0.3 ? 0.31 - idx * 0.015 : 0.28 + (idx - 3) * 0.025;
    const baffle = new THREE.Mesh(new THREE.TorusGeometry(r, 0.028, 12, 28), primaryMat);
    baffle.rotation.x = Math.PI / 2;
    baffle.position.y = yPos;
    garmentGroup.add(baffle);
    baffles.push(baffle);
  });

  // Insulated hips & pelvis
  const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.345, 0.48, 24), primaryMat);
  hips.position.y = 0.08;
  garmentGroup.add(hips);

  const pelvisCap = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 16), primaryMat);
  pelvisCap.position.y = -0.14;
  garmentGroup.add(pelvisCap);

  // Storm flap + Front Closure
  const stormFlap = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.76, 0.02), secondaryMat);
  stormFlap.position.set(0, 0.52, 0.26);
  stormFlap.rotation.x = -0.055;
  garmentGroup.add(stormFlap);

  const { closureGroup, setClosureType, setDepth } = buildClosure({
    type: 'zipper',
    yTop: 0.88,
    yBottom: 0.15,
    zOffset: 0.272
  });
  garmentGroup.add(closureGroup);

  const arms = [];
  const legs = [];

  [-1, 1].forEach((side) => {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.122, 0.72, 10, 20), primaryMat);
    arm.position.set(side * 0.45, 0.39, 0);
    arm.rotation.z = side * -0.18;
    garmentGroup.add(arm);

    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.08, 16), accentMat);
    cuff.position.set(side * 0.51, 0.04, 0);
    cuff.rotation.z = side * -0.18;
    garmentGroup.add(cuff);

    arms.push({ mesh: arm, cuff, side });

    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.152, 0.90, 12, 24), primaryMat);
    leg.position.set(side * 0.16, -0.61, 0);
    leg.rotation.z = side * -0.04;
    garmentGroup.add(leg);

    const ankleGaiter = new THREE.Mesh(new THREE.CylinderGeometry(0.148, 0.156, 0.14, 18), accentMat);
    ankleGaiter.position.set(side * 0.175, -1.03, 0);
    ankleGaiter.rotation.z = side * -0.04;
    garmentGroup.add(ankleGaiter);

    legs.push({ mesh: leg, ankleGaiter, side });
  });

  function applyStyle(fabricPreset, colorPreset, palette) {
    [primaryMat, secondaryMat, accentMat].forEach((mat) => {
      Object.assign(mat, fabricPreset.mat);
      mat.needsUpdate = true;
    });

    if (palette && palette.primary !== null) {
      primaryMat.color.setHex(palette.primary);
      secondaryMat.color.setHex(palette.secondary);
      accentMat.color.setHex(palette.accent);
    } else {
      primaryMat.color.setHex(colorPreset.hex);
      secondaryMat.color.setHex(0xf1f5f9);
      accentMat.color.setHex(0x111318);
    }
    primaryMat.sheenColor?.copy(primaryMat.color);
  }

  function syncBody(profile) {
    chest.scale.set(...profile.chestScale);
    chestYoke.scale.set(...profile.chestScale);
    hips.scale.set(...profile.hipScale);
    pelvisCap.scale.set(profile.hipScale * 0.98, 0.72, profile.hipScale * 0.96);

    baffles.forEach((b, idx) => {
      const s = idx < 3 ? profile.chestScale : profile.hipScale;
      b.scale.set(s, s, 1);
    });

    const armScale = (profile.armRadius + 0.05) / 0.122;
    const legScale = (profile.legRadius + 0.054) / 0.152;

    arms.forEach(({ mesh, cuff, side }) => {
      mesh.position.x = side * (profile.armOffset + 0.01);
      mesh.scale.set(armScale, 1, armScale);
      cuff.position.x = side * (profile.armOffset + 0.07);
    });

    legs.forEach(({ mesh, ankleGaiter, side }) => {
      mesh.position.x = side * (profile.legOffset + 0.005);
      mesh.scale.set(legScale, 1, legScale);
      ankleGaiter.position.x = side * (profile.legOffset + 0.02);
    });

    const zFront = 0.355 * profile.chestScale + 0.008;
    stormFlap.position.z = zFront - 0.008;
    setDepth(zFront);
  }

  return { garmentGroup, applyStyle, syncBody, setClosureType };
}
