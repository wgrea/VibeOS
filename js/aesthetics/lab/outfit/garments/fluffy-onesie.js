// js/aesthetics/lab/outfit/garments/fluffy-onesie.js
import * as THREE from 'three';
import { buildClosure } from '../closures.js';

export function buildFluffyOnesie(initialHex = 0x0284c7) {
  const garmentGroup = new THREE.Group();

  const bodyMat = new THREE.MeshPhysicalMaterial({ color: initialHex });
  const bellyMat = new THREE.MeshPhysicalMaterial({ color: 0xf1f5f9 });

  // Plush collar + lowered hood with ears
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.032, 12, 24), bodyMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 0.87;
  garmentGroup.add(collar);

  const hoodRest = new THREE.Mesh(new THREE.SphereGeometry(0.19, 18, 16), bodyMat);
  hoodRest.scale.set(1.15, 0.72, 0.85);
  hoodRest.position.set(0, 0.85, -0.15);
  garmentGroup.add(hoodRest);

  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 14), bodyMat);
    ear.position.set(side * 0.13, 0.96, -0.18);
    garmentGroup.add(ear);
  });

  // Roomy plush torso & hips
  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.29, 0.56, 24), bodyMat);
  chest.position.y = 0.58;
  garmentGroup.add(chest);

  const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.35, 0.48, 24), bodyMat);
  hips.position.y = 0.08;
  garmentGroup.add(hips);

  const pelvisCap = new THREE.Mesh(new THREE.SphereGeometry(0.325, 24, 16), bodyMat);
  pelvisCap.position.y = -0.15;
  garmentGroup.add(pelvisCap);

  // Soft oval belly patch
  const bellyPatch = new THREE.Mesh(new THREE.SphereGeometry(0.23, 20, 20), bellyMat);
  bellyPatch.scale.set(0.88, 1.45, 0.35);
  bellyPatch.position.set(0, 0.36, 0.195);
  garmentGroup.add(bellyPatch);

  // Front closure
  const { closureGroup, setClosureType, setDepth } = buildClosure({
    type: 'zipper',
    yTop: 0.86,
    yBottom: 0.08,
    zOffset: 0.275
  });
  garmentGroup.add(closureGroup);

  const arms = [];
  const legs = [];

  [-1, 1].forEach((side) => {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.72, 10, 20), bodyMat);
    arm.position.set(side * 0.45, 0.39, 0);
    arm.rotation.z = side * -0.18;
    garmentGroup.add(arm);
    arms.push({ mesh: arm, side });

    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.90, 12, 24), bodyMat);
    leg.position.set(side * 0.16, -0.61, 0);
    leg.rotation.z = side * -0.04;
    garmentGroup.add(leg);
    legs.push({ mesh: leg, side });
  });

  function applyStyle(fabricPreset, colorPreset, palette) {
    const mainHex = palette && palette.primary !== null ? palette.primary : colorPreset.hex;
    const patchHex = palette && palette.secondary !== null ? palette.secondary : 0xf1f5f9;

    [bodyMat, bellyMat].forEach((mat) => {
      Object.assign(mat, fabricPreset.mat);
      mat.needsUpdate = true;
    });

    bodyMat.color.setHex(mainHex);
    bellyMat.color.setHex(patchHex);
    bodyMat.sheenColor?.copy(bodyMat.color);
  }

  function syncBody(profile) {
    chest.scale.set(...profile.chestScale);
    hips.scale.set(...profile.hipScale);
    pelvisCap.scale.set(profile.hipScale * 0.98, 0.74, profile.hipScale * 0.96);

    const armScale = (profile.armRadius + 0.048) / 0.12;
    const legScale = (profile.legRadius + 0.052) / 0.15;

    arms.forEach(({ mesh, side }) => {
      mesh.position.x = side * (profile.armOffset + 0.01);
      mesh.scale.set(armScale, 1, armScale);
    });

    legs.forEach(({ mesh, side }) => {
      mesh.position.x = side * (profile.legOffset + 0.005);
      mesh.scale.set(legScale, 1, legScale);
    });

    const zFront = 0.35 * profile.chestScale + 0.008;
    bellyPatch.position.z = zFront - 0.075;
    setDepth(zFront);
  }

  return { garmentGroup, applyStyle, syncBody, setClosureType };
}
