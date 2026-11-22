// js/aesthetics/lab/outfit/garments/racing-suit.js
import * as THREE from 'three';
import { buildClosure } from '../closures.js';

export function buildRacingSuit(initialHex = 0xb91c1c) {
  const garmentGroup = new THREE.Group();

  // Up to 8 independent color-block materials (cycles cleanly for any number of colors)
  const zoneMats = Array.from({ length: 8 }, () => new THREE.MeshPhysicalMaterial({ color: initialHex }));
  const hardwareMat = new THREE.MeshStandardMaterial({
    color: 0xd1d5db,
    roughness: 0.25,
    metalness: 0.85
  });

  // 1. High Stand-Up FIA/NASCAR Collar + Velcro Chin Strap
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.132, 0.15, 0.14, 24), zoneMats[2]);
  collar.position.y = 0.90;
  garmentGroup.add(collar);

  const collarStrap = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.048, 0.045), zoneMats[3]);
  collarStrap.position.set(0.03, 0.90, 0.135);
  collarStrap.rotation.y = 0.2;
  garmentGroup.add(collarStrap);

  // 2. Upper Chest Yoke + Lower Torso (Split so 2+ colors create real race-suit blocking)
  const upperChest = new THREE.Mesh(new THREE.CylinderGeometry(0.334, 0.302, 0.24, 24), zoneMats[1]);
  upperChest.position.y = 0.74;
  garmentGroup.add(upperChest);

  const chestBand = new THREE.Mesh(new THREE.CylinderGeometry(0.304, 0.285, 0.09, 24), zoneMats[3]);
  chestBand.position.y = 0.59;
  garmentGroup.add(chestBand);

  const lowerTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.286, 0.246, 0.26, 24), zoneMats[0]);
  lowerTorso.position.y = 0.43;
  garmentGroup.add(lowerTorso);

  // 3. Hips & Pelvis
  const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.246, 0.322, 0.48, 24), zoneMats[0]);
  hips.position.y = 0.08;
  garmentGroup.add(hips);

  const pelvisCap = new THREE.Mesh(new THREE.SphereGeometry(0.295, 24, 16), zoneMats[0]);
  pelvisCap.position.y = -0.14;
  garmentGroup.add(pelvisCap);

  // 4. Racing Waist Belt + Metal D-Ring Buckle
  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.252, 0.256, 0.075, 24), zoneMats[2]);
  belt.position.y = 0.29;
  garmentGroup.add(belt);

  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.065, 0.035), hardwareMat);
  buckle.position.set(0, 0.29, 0.185);
  garmentGroup.add(buckle);

  // 5. Front Closure (Storm flap zipper)
  const { closureGroup, setClosureType, setDepth } = buildClosure({
    type: 'zipper',
    yTop: 0.87,
    yBottom: 0.16,
    zOffset: 0.245
  });
  garmentGroup.add(closureGroup);

  const arms = [];
  const legs = [];

  [-1, 1].forEach((side) => {
    // Shoulder Extraction Epaulette Strap (Signature F1/NASCAR handle)
    const shoulderPad = new THREE.Mesh(new THREE.SphereGeometry(0.112, 16, 16), zoneMats[1]);
    shoulderPad.scale.set(1.15, 0.72, 1.05);
    shoulderPad.position.set(side * 0.35, 0.80, 0);
    garmentGroup.add(shoulderPad);

    const epaulette = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.028, 0.065), zoneMats[4]);
    epaulette.position.set(side * 0.26, 0.875, 0);
    epaulette.rotation.z = side * -0.18;
    garmentGroup.add(epaulette);

    // Sleeve + Bicep Stripe + Ribbed Knit Cuff
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.104, 0.72, 10, 20), zoneMats[5]);
    arm.position.set(side * 0.44, 0.39, 0);
    arm.rotation.z = side * -0.18;
    garmentGroup.add(arm);

    const sleeveBand = new THREE.Mesh(new THREE.CylinderGeometry(0.107, 0.107, 0.09, 16), zoneMats[3]);
    sleeveBand.position.set(side * 0.41, 0.54, 0);
    sleeveBand.rotation.z = side * -0.18;
    garmentGroup.add(sleeveBand);

    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.08, 16), zoneMats[2]);
    cuff.position.set(side * 0.50, 0.04, 0);
    cuff.rotation.z = side * -0.18;
    garmentGroup.add(cuff);

    arms.push({ mesh: arm, shoulderPad, epaulette, sleeveBand, cuff, side });

    // Leg + Articulated Knee Pad + Side Racing Stripe + Boot Cuff
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.134, 0.90, 12, 24), zoneMats[0]);
    leg.position.set(side * 0.155, -0.61, 0);
    leg.rotation.z = side * -0.04;
    garmentGroup.add(leg);

    const kneePad = new THREE.Mesh(new THREE.BoxGeometry(0.145, 0.16, 0.055), zoneMats[6]);
    kneePad.position.set(side * 0.155, -0.58, 0.125);
    kneePad.rotation.z = side * -0.04;
    garmentGroup.add(kneePad);

    const legStripe = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.84, 0.185), zoneMats[7]);
    legStripe.position.set(side * 0.275, -0.60, 0);
    legStripe.rotation.z = side * -0.04;
    garmentGroup.add(legStripe);

    const ankleCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.122, 0.118, 0.075, 16), zoneMats[2]);
    ankleCuff.position.set(side * 0.172, -1.06, 0);
    ankleCuff.rotation.z = side * -0.04;
    garmentGroup.add(ankleCuff);

    legs.push({ mesh: leg, kneePad, legStripe, ankleCuff, side });
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

    // 2. Unlimited Multi-Color List (cycles across all 8 suit zones)
    if (Array.isArray(multiColors) && multiColors.length > 0) {
      zoneMats.forEach((mat, idx) => {
        const swatch = multiColors[idx % multiColors.length];
        mat.color.setHex(swatch.hex);
        mat.sheenColor?.copy(mat.color);
      });
      return;
    }

    // 3. Single-Color Fallback with classic white/obsidian trim
    const fallback = [colorPreset.hex, 0xf8fafc, 0x111318, 0xf8fafc, 0x111318, colorPreset.hex, 0x111318, 0xf8fafc];
    zoneMats.forEach((mat, idx) => {
      mat.color.setHex(fallback[idx]);
      mat.sheenColor?.copy(mat.color);
    });
  }

  function syncBody(profile) {
    upperChest.scale.set(...profile.chestScale);
    chestBand.scale.set(...profile.chestScale);
    lowerTorso.scale.set(...profile.chestScale);
    hips.scale.set(...profile.hipScale);
    belt.scale.set(...profile.hipScale);
    buckle.position.z = 0.252 * profile.hipScale + 0.008;
    pelvisCap.scale.set(profile.hipScale * 0.98, 0.72, profile.hipScale * 0.96);

    const armScale = (profile.armRadius + 0.032) / 0.104;
    const legScale = (profile.legRadius + 0.036) / 0.134;

    arms.forEach(({ mesh, shoulderPad, epaulette, sleeveBand, cuff, side }) => {
      mesh.position.x = side * profile.armOffset;
      mesh.scale.set(armScale, 1, armScale);
      shoulderPad.position.x = side * (profile.armOffset - 0.09);
      epaulette.position.x = side * (profile.armOffset - 0.18);
      sleeveBand.position.x = side * (profile.armOffset - 0.03);
      sleeveBand.scale.set(armScale, 1, armScale);
      cuff.position.x = side * (profile.armOffset + 0.06);
      cuff.scale.set(armScale, 1, armScale);
    });

    legs.forEach(({ mesh, kneePad, legStripe, ankleCuff, side }) => {
      mesh.position.x = side * profile.legOffset;
      mesh.scale.set(legScale, 1, legScale);
      kneePad.position.x = side * profile.legOffset;
      legStripe.position.x = side * (profile.legOffset + 0.12);
      ankleCuff.position.x = side * (profile.legOffset + 0.017);
      ankleCuff.scale.set(legScale, 1, legScale);
    });

    setDepth(0.334 * profile.chestScale + 0.008);
  }

  return { garmentGroup, applyStyle, syncBody, setClosureType };
}
