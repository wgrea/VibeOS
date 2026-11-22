// js/aesthetics/lab/outfit/garments/sweatshirt.js
import * as THREE from 'three';
import { buildClosure } from '../closures.js';

export function buildSweatshirt(initialHex = 0x111318) {
  const garmentGroup = new THREE.Group();

  const bodyMat = new THREE.MeshPhysicalMaterial({ color: initialHex });
  const ribMat = new THREE.MeshPhysicalMaterial({ color: initialHex });

  // Relaxed torso (clearance +0.036 over mannequin)
  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.322, 0.252, 0.56, 24), bodyMat);
  chest.position.y = 0.58;
  garmentGroup.add(chest);

  // Ribbed waist band
  const waistBand = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.256, 0.09, 24), ribMat);
  waistBand.position.y = 0.27;
  garmentGroup.add(waistBand);

  // Crewneck collar ring
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.024, 12, 24), ribMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 0.86;
  garmentGroup.add(collar);

  // Hoodie-specific meshes (hood + kangaroo pocket + drawstrings)
  const hoodieGroup = new THREE.Group();
  const hood = new THREE.Mesh(new THREE.SphereGeometry(0.185, 18, 16), bodyMat);
  hood.scale.set(1.12, 0.78, 0.9);
  hood.position.set(0, 0.85, -0.15);
  hoodieGroup.add(hood);

  const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 0.045), bodyMat);
  pocket.position.set(0, 0.38, 0.21);
  pocket.rotation.x = -0.05;
  hoodieGroup.add(pocket);

  [-1, 1].forEach((side) => {
    const string = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.18, 8), ribMat);
    string.position.set(side * 0.045, 0.74, 0.235);
    hoodieGroup.add(string);
  });
  garmentGroup.add(hoodieGroup);

  // Optional Quarter-Zip / Front Closure
  const { closureGroup, setClosureType, setDepth } = buildClosure({
    type: 'none',
    yTop: 0.85,
    yBottom: 0.58,
    zOffset: 0.238,
    buttonCount: 3
  });
  garmentGroup.add(closureGroup);

  // Sleeves & Ribbed Cuffs
  const arms = [];
  [-1, 1].forEach((side) => {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.106, 0.68, 10, 20), bodyMat);
    arm.position.set(side * 0.44, 0.41, 0);
    arm.rotation.z = side * -0.18;
    garmentGroup.add(arm);

    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.086, 0.082, 0.085, 16), ribMat);
    cuff.position.set(side * 0.50, 0.06, 0);
    cuff.rotation.z = side * -0.18;
    garmentGroup.add(cuff);

    arms.push({ mesh: arm, cuff, side });
  });

  function setVariant(variant) {
    hoodieGroup.visible = variant === 'hoodie';
    setClosureType(variant === 'quarter-zip' ? 'zipper' : 'none');
  }

  function applyStyle(fabricPreset, colorPreset, palette) {
    const mainHex = palette && palette.primary !== null ? palette.primary : colorPreset.hex;
    const trimHex = palette && palette.accent !== null ? palette.accent : mainHex;

    [bodyMat, ribMat].forEach((mat) => {
      Object.assign(mat, fabricPreset.mat);
      mat.needsUpdate = true;
    });

    bodyMat.color.setHex(mainHex);
    ribMat.color.setHex(trimHex);
    if (!palette || palette.accent === null) {
      ribMat.color.offsetHSL(0, 0, -0.05);
    }
    bodyMat.sheenColor?.copy(bodyMat.color);
  }

  function syncBody(profile) {
    chest.scale.set(...profile.chestScale);
    waistBand.scale.set(...profile.chestScale);

    const armScale = (profile.armRadius + 0.034) / 0.106;
    arms.forEach(({ mesh, cuff, side }) => {
      mesh.position.x = side * profile.armOffset;
      mesh.scale.set(armScale, 1, armScale);
      cuff.position.x = side * (profile.armOffset + 0.06);
    });

    const zFront = 0.322 * profile.chestScale[2] + 0.008;
    pocket.position.z = zFront - 0.025;
    setDepth(zFront);
  }

  setVariant('hoodie');

  return { garmentGroup, applyStyle, syncBody, setClosureType, setVariant };
}
