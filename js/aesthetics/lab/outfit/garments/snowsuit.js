// js/aesthetics/lab/outfit/garments/snowsuit.js
import * as THREE from 'three';
import { buildClosure } from '../closures.js';

export function buildSnowsuit(initialHex = 0x1d4ed8) {
  const garmentGroup = new THREE.Group();

  // Up to 8 independent color-block materials (cycles cleanly for any number of colors)
  const zoneMats = Array.from({ length: 8 }, () => new THREE.MeshPhysicalMaterial({ color: initialHex }));
  const hardwareMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.35,
    metalness: 0.65
  });

  // 1. Tall Insulated Fleece/Nylon Storm Collar + Folded Winter Hood
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.178, 0.17, 24), zoneMats);
  collar.position.y = 0.92;
  garmentGroup.add(collar);

  const hood = new THREE.Mesh(new THREE.SphereGeometry(0.195, 20, 16), zoneMats);
  hood.scale.set(1.05, 0.72, 0.95);
  hood.position.set(0, 0.85, -0.14);
  garmentGroup.add(hood);

  // 2. Contrast Alpine Chest Yoke + Puffy Torso
  const chestYoke = new THREE.Mesh(new THREE.CylinderGeometry(0.358, 0.326, 0.19, 24), zoneMats);
  chestYoke.position.y = 0.76;
  garmentGroup.add(chestYoke);

  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.355, 0.27, 0.56, 24), zoneMats);
  chest.position.y = 0.58;
  garmentGroup.add(chest);

  // Quilted Torso & Hip Baffle Rings (alternating zones so multi-colors stripe cleanly)
  const baffles = [];
  [0.64, 0.50, 0.36, 0.18, 0.02].forEach((yPos, idx) => {
    const r = yPos > 0.3 ? 0.312 - idx * 0.015 : 0.282 + (idx - 3) * 0.025;
    const matIdx = idx % 2 === 0 ? 0 : 2;
    const baffle = new THREE.Mesh(new THREE.TorusGeometry(r, 0.03, 12, 28), zoneMats[matIdx]);
    baffle.rotation.x = Math.PI / 2;
    baffle.position.y = yPos;
    garmentGroup.add(baffle);
    baffles.push(baffle);
  });

  // 3. Insulated Hips & Pelvis
  const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.345, 0.48, 24), zoneMats);
  hips.position.y = 0.08;
  garmentGroup.add(hips);

  const pelvisCap = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 16), zoneMats);
  pelvisCap.position.y = -0.14;
  garmentGroup.add(pelvisCap);

  // 4. Snowsuit Waist Belt + Clip Buckle
  const waistBelt = new THREE.Mesh(new THREE.CylinderGeometry(0.276, 0.28, 0.07, 24), zoneMats);
  waistBelt.position.y = 0.29;
  garmentGroup.add(waistBelt);

  const beltBuckle = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.06, 0.035), hardwareMat);
  beltBuckle.position.set(0, 0.29, 0.21);
  garmentGroup.add(beltBuckle);

  // 5. Windproof Storm Flap + Front Closure
  const stormFlap = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.76, 0.022), zoneMats);
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
    // Puffy Sleeve + Quilted Arm Baffles + Velcro Wrist Cuff
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.122, 0.72, 10, 20), zoneMats);
    arm.position.set(side * 0.45, 0.39, 0);
    arm.rotation.z = side * -0.18;
    garmentGroup.add(arm);

    const armBaffleUpper = new THREE.Mesh(new THREE.TorusGeometry(0.118, 0.022, 10, 20), zoneMats);
    armBaffleUpper.position.set(side * 0.41, 0.54, 0);
    armBaffleUpper.rotation.x = Math.PI / 2;
    armBaffleUpper.rotation.y = side * -0.18;
    garmentGroup.add(armBaffleUpper);

    const armBaffleLower = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.022, 10, 20), zoneMats);
    armBaffleLower.position.set(side * 0.47, 0.24, 0);
    armBaffleLower.rotation.x = Math.PI / 2;
    armBaffleLower.rotation.y = side * -0.18;
    garmentGroup.add(armBaffleLower);

    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.108, 0.108, 0.085, 16), zoneMats);
    cuff.position.set(side * 0.51, 0.04, 0);
    cuff.rotation.z = side * -0.18;
    garmentGroup.add(cuff);

    arms.push({ mesh: arm, armBaffleUpper, armBaffleLower, cuff, side });

    // Insulated Leg + Thigh Baffle + Reinforced Knee Patch + Elastic Snow Gaiter
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.152, 0.90, 12, 24), zoneMats);
    leg.position.set(side * 0.16, -0.61, 0);
    leg.rotation.z = side * -0.04;
    garmentGroup.add(leg);

    const thighBaffle = new THREE.Mesh(new THREE.TorusGeometry(0.148, 0.025, 10, 22), zoneMats);
    thighBaffle.position.set(side * 0.155, -0.36, 0);
    thighBaffle.rotation.x = Math.PI / 2;
    thighBaffle.rotation.y = side * -0.04;
    garmentGroup.add(thighBaffle);

    const kneePatch = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.18, 0.045), zoneMats);
    kneePatch.position.set(side * 0.16, -0.60, 0.14);
    kneePatch.rotation.z = side * -0.04;
    garmentGroup.add(kneePatch);

    const ankleGaiter = new THREE.Mesh(new THREE.CylinderGeometry(0.148, 0.158, 0.15, 18), zoneMats);
    ankleGaiter.position.set(side * 0.175, -1.03, 0);
    ankleGaiter.rotation.z = side * -0.04;
    garmentGroup.add(ankleGaiter);

    legs.push({ mesh: leg, thighBaffle, kneePatch, ankleGaiter, side });
  });

  function applyStyle(fabricPreset, colorPreset, palette, multiColors = []) {
    zoneMats.forEach((mat) => {
      Object.assign(mat, fabricPreset.mat);
      mat.needsUpdate = true;
    });

    // 1. Aesthetic Palette overrides if active
    if (palette && palette.primary !== null) {
      const palList = [palette.primary, palette.secondary, palette.accent];
      zoneMats.forEach((mat, idx) => {
        mat.color.setHex(palList[idx % palList.length]);
        mat.sheenColor?.copy(mat.color);
      });
      return;
    }

    // 2. Unlimited Multi-Color List (cycles across all 8 snowsuit zones)
    if (Array.isArray(multiColors) && multiColors.length > 0) {
      zoneMats.forEach((mat, idx) => {
        const swatch = multiColors[idx % multiColors.length];
        mat.color.setHex(swatch.hex);
        mat.sheenColor?.copy(mat.color);
      });
      return;
    }

    // 3. Single-Color Fallback with crisp alpine contrast trim
    const fallback = [colorPreset.hex, 0xf1f5f9, 0x111318, 0xf1f5f9, 0x111318, colorPreset.hex, 0x111318, 0xf1f5f9];
    zoneMats.forEach((mat, idx) => {
      mat.color.setHex(fallback[idx]);
      mat.sheenColor?.copy(mat.color);
    });
  }

  function syncBody(profile) {
    chest.scale.set(...profile.chestScale);
    chestYoke.scale.set(...profile.chestScale);
    hips.scale.set(...profile.hipScale);
    waistBelt.scale.set(...profile.hipScale);
    beltBuckle.position.z = 0.276 * profile.hipScale + 0.008;
    pelvisCap.scale.set(profile.hipScale * 0.98, 0.72, profile.hipScale * 0.96);

    baffles.forEach((b, idx) => {
      const s = idx < 3 ? profile.chestScale : profile.hipScale;
      b.scale.set(s, s, 1);
    });

    const armScale = (profile.armRadius + 0.05) / 0.122;
    const legScale = (profile.legRadius + 0.054) / 0.152;

    arms.forEach(({ mesh, armBaffleUpper, armBaffleLower, cuff, side }) => {
      mesh.position.x = side * (profile.armOffset + 0.01);
      mesh.scale.set(armScale, 1, armScale);
      armBaffleUpper.position.x = side * (profile.armOffset - 0.03);
      armBaffleUpper.scale.set(armScale, armScale, 1);
      armBaffleLower.position.x = side * (profile.armOffset + 0.03);
      armBaffleLower.scale.set(armScale, armScale, 1);
      cuff.position.x = side * (profile.armOffset + 0.07);
      cuff.scale.set(armScale, 1, armScale);
    });

    legs.forEach(({ mesh, thighBaffle, kneePatch, ankleGaiter, side }) => {
      mesh.position.x = side * (profile.legOffset + 0.005);
      mesh.scale.set(legScale, 1, legScale);
      thighBaffle.position.x = side * profile.legOffset;
      thighBaffle.scale.set(legScale, legScale, 1);
      kneePatch.position.x = side * (profile.legOffset + 0.005);
      ankleGaiter.position.x = side * (profile.legOffset + 0.02);
      ankleGaiter.scale.set(legScale, 1, legScale);
    });

    const zFront = 0.355 * profile.chestScale + 0.008;
    stormFlap.position.z = zFront - 0.008;
    setDepth(zFront);
  }

  return { garmentGroup, applyStyle, syncBody, setClosureType };
}
