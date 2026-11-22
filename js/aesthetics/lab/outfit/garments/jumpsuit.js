// js/aesthetics/lab/outfit/garments/jumpsuit.js
import * as THREE from 'three';
import { buildClosure } from '../closures.js';

export function buildJumpsuit(initialHex = 0x6b1426) {
  const garmentGroup = new THREE.Group();

  const mainMat = new THREE.MeshPhysicalMaterial({ color: initialHex });
  const trimMat = new THREE.MeshPhysicalMaterial({ color: initialHex });

  // Folded shirt-style collar
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.165, 0.11, 24), trimMat);
  collar.position.y = 0.89;
  garmentGroup.add(collar);

  // Tailored torso (clearance +0.038 over mannequin, fits cleanly over catsuit)
  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.324, 0.246, 0.56, 24), mainMat);
  chest.position.y = 0.58;
  garmentGroup.add(chest);

  // Chest utility patch pockets
  const chestPockets = [];
  [-1, 1].forEach((side) => {
    const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.13, 0.025), trimMat);
    pocket.position.set(side * 0.13, 0.64, 0.215);
    pocket.rotation.set(-0.05, side * 0.18, 0);
    garmentGroup.add(pocket);
    chestPockets.push({ mesh: pocket, side });
  });

  // Seamed waistband
  const waistBand = new THREE.Mesh(new THREE.CylinderGeometry(0.246, 0.252, 0.075, 24), trimMat);
  waistBand.position.y = 0.29;
  garmentGroup.add(waistBand);

  // Hips & Pelvis
  const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.318, 0.46, 24), mainMat);
  hips.position.y = 0.07;
  garmentGroup.add(hips);

  const pelvisCap = new THREE.Mesh(new THREE.SphereGeometry(0.292, 24, 16), mainMat);
  pelvisCap.position.y = -0.15;
  garmentGroup.add(pelvisCap);

  // Front Closure (Zipper or Buttons down to waist)
  const { closureGroup, setClosureType, setDepth } = buildClosure({
    type: 'buttons',
    yTop: 0.86,
    yBottom: 0.26,
    zOffset: 0.238,
    buttonCount: 5
  });
  garmentGroup.add(closureGroup);

  // Sleeves & Straight-Cut Legs
  const arms = [];
  const legs = [];

  [-1, 1].forEach((side) => {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.102, 0.70, 10, 20), mainMat);
    arm.position.set(side * 0.44, 0.40, 0);
    arm.rotation.z = side * -0.18;
    garmentGroup.add(arm);

    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.092, 0.092, 0.065, 16), trimMat);
    cuff.position.set(side * 0.50, 0.05, 0);
    cuff.rotation.z = side * -0.18;
    garmentGroup.add(cuff);

    arms.push({ mesh: arm, cuff, side });

    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.132, 0.90, 12, 24), mainMat);
    leg.position.set(side * 0.155, -0.61, 0);
    leg.rotation.z = side * -0.04;
    garmentGroup.add(leg);

    const legHem = new THREE.Mesh(new THREE.CylinderGeometry(0.128, 0.13, 0.06, 16), trimMat);
    legHem.position.set(side * 0.172, -1.06, 0);
    legHem.rotation.z = side * -0.04;
    garmentGroup.add(legHem);

    legs.push({ mesh: leg, legHem, side });
  });

  function applyStyle(fabricPreset, colorPreset, palette) {
    const baseHex = palette && palette.primary !== null ? palette.primary : colorPreset.hex;
    const trimHex = palette && palette.secondary !== null ? palette.secondary : baseHex;

    [mainMat, trimMat].forEach((mat) => {
      Object.assign(mat, fabricPreset.mat);
      mat.needsUpdate = true;
    });

    mainMat.color.setHex(baseHex);
    trimMat.color.setHex(trimHex);
    if (!palette || palette.secondary === null) {
      trimMat.color.offsetHSL(0, 0, -0.04);
    }
    mainMat.sheenColor?.copy(mainMat.color);
  }

  function syncBody(profile) {
    chest.scale.set(...profile.chestScale);
    waistBand.scale.set(...profile.hipScale);
    hips.scale.set(...profile.hipScale);
    pelvisCap.scale.set(profile.hipScale * 0.98, 0.72, profile.hipScale * 0.96);

    const armScale = (profile.armRadius + 0.03) / 0.102;
    const legScale = (profile.legRadius + 0.034) / 0.132;

    arms.forEach(({ mesh, cuff, side }) => {
      mesh.position.x = side * profile.armOffset;
      mesh.scale.set(armScale, 1, armScale);
      cuff.position.x = side * (profile.armOffset + 0.06);
    });

    legs.forEach(({ mesh, legHem, side }) => {
      mesh.position.x = side * profile.legOffset;
      mesh.scale.set(legScale, 1, legScale);
      legHem.position.x = side * (profile.legOffset + 0.017);
    });

    const zFront = 0.324 * profile.chestScale + 0.008;
    chestPockets.forEach(({ mesh }) => (mesh.position.z = zFront - 0.03));
    setDepth(zFront);
  }

  return { garmentGroup, applyStyle, syncBody, setClosureType };
}
