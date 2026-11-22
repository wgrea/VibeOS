// js/aesthetics/lab/outfit/garments/racing-suit.js
import * as THREE from 'three';
import { buildClosure } from '../closures.js';

export function buildRacingSuit(initialHex = 0xb91c1c) {
  const garmentGroup = new THREE.Group();

  const primaryMat = new THREE.MeshPhysicalMaterial({ color: initialHex });
  const secondaryMat = new THREE.MeshPhysicalMaterial({ color: 0xf8fafc });
  const accentMat = new THREE.MeshPhysicalMaterial({ color: 0x111318 });

  // High racing collar with Velcro strap tab
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.132, 0.15, 0.14, 24), accentMat);
  collar.position.y = 0.90;
  garmentGroup.add(collar);

  // Torso (clearance +0.048 over mannequin)
  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.332, 0.245, 0.56, 24), primaryMat);
  chest.position.y = 0.58;
  garmentGroup.add(chest);

  // Chest racing stripe band
  const chestBand = new THREE.Mesh(new THREE.CylinderGeometry(0.305, 0.282, 0.15, 24), secondaryMat);
  chestBand.position.y = 0.65;
  garmentGroup.add(chestBand);

  // Hips & Pelvis
  const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.245, 0.322, 0.48, 24), primaryMat);
  hips.position.y = 0.08;
  garmentGroup.add(hips);

  const pelvisCap = new THREE.Mesh(new THREE.SphereGeometry(0.295, 24, 16), primaryMat);
  pelvisCap.position.y = -0.14;
  garmentGroup.add(pelvisCap);

  // Racing waist belt
  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.248, 0.252, 0.075, 24), accentMat);
  belt.position.y = 0.29;
  garmentGroup.add(belt);

  // Front Closure
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
    // Shoulder pad
    const shoulderPad = new THREE.Mesh(new THREE.SphereGeometry(0.112, 16, 16), secondaryMat);
    shoulderPad.scale.set(1.15, 0.75, 1.05);
    shoulderPad.position.set(side * 0.35, 0.80, 0);
    garmentGroup.add(shoulderPad);

    // Sleeve + Cuff
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.104, 0.72, 10, 20), primaryMat);
    arm.position.set(side * 0.44, 0.39, 0);
    arm.rotation.z = side * -0.18;
    garmentGroup.add(arm);

    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.098, 0.098, 0.07, 16), accentMat);
    cuff.position.set(side * 0.50, 0.04, 0);
    cuff.rotation.z = side * -0.18;
    garmentGroup.add(cuff);

    arms.push({ mesh: arm, shoulderPad, cuff, side });

    // Leg + Knee Pad + Side Stripe
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.134, 0.90, 12, 24), primaryMat);
    leg.position.set(side * 0.155, -0.61, 0);
    leg.rotation.z = side * -0.04;
    garmentGroup.add(leg);

    const kneePad = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.15, 0.06), accentMat);
    kneePad.position.set(side * 0.155, -0.58, 0.125);
    kneePad.rotation.z = side * -0.04;
    garmentGroup.add(kneePad);

    const legStripe = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.84, 0.18), secondaryMat);
    legStripe.position.set(side * 0.275, -0.60, 0);
    legStripe.rotation.z = side * -0.04;
    garmentGroup.add(legStripe);

    legs.push({ mesh: leg, kneePad, legStripe, side });
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
    chestBand.scale.set(...profile.chestScale);
    hips.scale.set(...profile.hipScale);
    belt.scale.set(...profile.hipScale);
    pelvisCap.scale.set(profile.hipScale * 0.98, 0.72, profile.hipScale * 0.96);

    const armScale = (profile.armRadius + 0.032) / 0.104;
    const legScale = (profile.legRadius + 0.036) / 0.134;

    arms.forEach(({ mesh, shoulderPad, cuff, side }) => {
      mesh.position.x = side * profile.armOffset;
      mesh.scale.set(armScale, 1, armScale);
      shoulderPad.position.x = side * (profile.armOffset - 0.09);
      cuff.position.x = side * (profile.armOffset + 0.06);
    });

    legs.forEach(({ mesh, kneePad, legStripe, side }) => {
      mesh.position.x = side * profile.legOffset;
      mesh.scale.set(legScale, 1, legScale);
      kneePad.position.x = side * profile.legOffset;
      legStripe.position.x = side * (profile.legOffset + 0.12);
    });

    setDepth(0.332 * profile.chestScale + 0.008);
  }

  return { garmentGroup, applyStyle, syncBody, setClosureType };
}
