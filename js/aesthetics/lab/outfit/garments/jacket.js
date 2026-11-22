// js/aesthetics/lab/outfit/garments/jacket.js
import * as THREE from 'three';
import { buildClosure } from '../closures.js';

export function buildJacket(initialHex = 0x111318) {
  const garmentGroup = new THREE.Group();

  const shellMat = new THREE.MeshPhysicalMaterial({ color: initialHex });
  const trimMat = new THREE.MeshPhysicalMaterial({ color: 0x1e293b });

  // Torso shell (clearance +0.045 over mannequin, sits cleanly over catsuit)
  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.245, 0.56, 24), shellMat);
  chest.position.y = 0.58;
  garmentGroup.add(chest);

  // Waist hem / ribbed band (Bomber & Windbreaker)
  const waistHem = new THREE.Mesh(new THREE.CylinderGeometry(0.246, 0.252, 0.085, 24), trimMat);
  waistHem.position.y = 0.28;
  garmentGroup.add(waistHem);

  // Collar & Lapel Variations
  const funnelCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.16, 0.13, 24), trimMat);
  funnelCollar.position.y = 0.89;
  garmentGroup.add(funnelCollar);

  const motoLapels = new THREE.Group();
  [-1, 1].forEach((side) => {
    const lapel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.025), shellMat);
    lapel.position.set(side * 0.075, 0.79, 0.235);
    lapel.rotation.set(-0.15, side * 0.25, side * -0.22);
    motoLapels.add(lapel);
  });
  garmentGroup.add(motoLapels);

  // Puffer horizontal baffles (toggled when variant === 'puffer')
  const pufferGroup = new THREE.Group();
  [0.72, 0.58, 0.44].forEach((yPos, i) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.315 - i * 0.02, 0.026, 12, 28), shellMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = yPos;
    pufferGroup.add(ring);
  });
  garmentGroup.add(pufferGroup);

  // Windbreaker chest color-block stripe
  const windStripe = new THREE.Mesh(new THREE.CylinderGeometry(0.305, 0.285, 0.13, 24), trimMat);
  windStripe.position.y = 0.65;
  garmentGroup.add(windStripe);

  // Front Closure
  const { closureGroup, setClosureType, setDepth } = buildClosure({
    type: 'zipper',
    yTop: 0.86,
    yBottom: 0.25,
    zOffset: 0.245
  });
  garmentGroup.add(closureGroup);

  // Sleeves & Cuffs
  const arms = [];
  [-1, 1].forEach((side) => {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.104, 0.68, 10, 20), shellMat);
    arm.position.set(side * 0.44, 0.41, 0);
    arm.rotation.z = side * -0.18;
    garmentGroup.add(arm);

    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.092, 0.075, 16), trimMat);
    cuff.position.set(side * 0.50, 0.07, 0);
    cuff.rotation.z = side * -0.18;
    garmentGroup.add(cuff);

    arms.push({ mesh: arm, cuff, side });
  });

  let currentVariant = 'moto';

  function setVariant(variant) {
    currentVariant = variant;
    motoLapels.visible = variant === 'moto';
    pufferGroup.visible = variant === 'puffer';
    windStripe.visible = variant === 'windbreaker';
    waistHem.visible = variant === 'bomber' || variant === 'windbreaker';
  }

  function applyStyle(fabricPreset, colorPreset, palette) {
    const mainHex = palette && palette.primary !== null ? palette.primary : colorPreset.hex;
    const trimHex = palette && palette.secondary !== null ? palette.secondary : 0x1e293b;

    [shellMat, trimMat].forEach((mat) => {
      Object.assign(mat, fabricPreset.mat);
      mat.needsUpdate = true;
    });

    shellMat.color.setHex(mainHex);
    trimMat.color.setHex(trimHex);
    shellMat.sheenColor?.copy(shellMat.color);
  }

  function syncBody(profile) {
    chest.scale.set(...profile.chestScale);
    waistHem.scale.set(...profile.chestScale);
    windStripe.scale.set(...profile.chestScale);
    pufferGroup.children.forEach((ring) => ring.scale.set(profile.chestScale[0], profile.chestScale[2], 1));

    const armScale = (profile.armRadius + 0.032) / 0.104;
    arms.forEach(({ mesh, cuff, side }) => {
      mesh.position.x = side * profile.armOffset;
      mesh.scale.set(armScale, 1, armScale);
      cuff.position.x = side * (profile.armOffset + 0.06);
    });

    const zFront = 0.33 * profile.chestScale[2] + 0.008;
    motoLapels.position.z = zFront - 0.24;
    setDepth(zFront);
  }

  setVariant(currentVariant);

  return { garmentGroup, applyStyle, syncBody, setClosureType, setVariant };
}
