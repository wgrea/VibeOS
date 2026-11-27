import * as THREE from 'three';
import { buildClosure } from '../../closures.js';
import { createSculptedTorsoGeometry, createTailoredLimbGeometry, createSeamTube } from './geometries.js';
import { morphTorsoVertices } from './sizing.js';

export function buildCatsuit(initialHex) {
  const suitGroup = new THREE.Group();

  const suitMat = new THREE.MeshPhysicalMaterial({
    color: initialHex,
    side: THREE.DoubleSide
  });

  const seamMat = new THREE.MeshPhysicalMaterial({
    color: initialHex,
    roughness: 0.45,
    metalness: 0.05
  });

  // 1. Continuous sculpted torso + mock-neck collar
  const torsoGeo = createSculptedTorsoGeometry();
  const torso = new THREE.Mesh(torsoGeo, suitMat);
  torso.castShadow = true;
  torso.receiveShadow = true;
  suitGroup.add(torso);

  // 2. Front princess seams, center-back spine seam & collar piping
  const seamMeshes = [];

  [-1, 1].forEach((side) => {
    const princessSeam = createSeamTube(
      [
        new THREE.Vector3(side * 0.168, -0.22, 0.162),
        new THREE.Vector3(side * 0.158, -0.05, 0.205),
        new THREE.Vector3(side * 0.138, 0.14, 0.194),
        new THREE.Vector3(side * 0.148, 0.34, 0.224),
        new THREE.Vector3(side * 0.168, 0.54, 0.244),
        new THREE.Vector3(side * 0.195, 0.76, 0.215),
        new THREE.Vector3(side * 0.165, 0.88, 0.095)
      ],
      0.0036,
      seamMat
    );
    torso.add(princessSeam);
    seamMeshes.push(princessSeam);
  });

  const backSpineSeam = createSeamTube(
    [
      new THREE.Vector3(0, -0.28, -0.230),
      new THREE.Vector3(0, -0.10, -0.303),
      new THREE.Vector3(0, 0.14, -0.230),
      new THREE.Vector3(0, 0.44, -0.293),
      new THREE.Vector3(0, 0.76, -0.316),
      new THREE.Vector3(0, 0.905, -0.130)
    ],
    0.0030,
    seamMat
  );
  torso.add(backSpineSeam);
  seamMeshes.push(backSpineSeam);

  const collarRing = new THREE.Mesh(new THREE.TorusGeometry(0.122, 0.0022, 10, 36), seamMat);
  collarRing.rotation.x = Math.PI / 2;
  collarRing.position.y = 0.912;
  torso.add(collarRing);

  // 3. Front closure
  const { closureGroup, setClosureType, setDepth } = buildClosure({
    type: 'zipper',
    yTop: 0.89,
    yBottom: 0.26,
    zOffset: 0.215,
    slim: true,
    waistDropZ: 0.048,
    topDropZ: 0.025
  });
  suitGroup.add(closureGroup);

  // 4. Full-length sleeves & legs aligned to mannequin.js
  const arms = [];
  const legs = [];

  const armGeo = createTailoredLimbGeometry({
    topR: 0.095,
    midR: 0.088,
    bottomR: 0.085,
    length: 0.74,
    jointY: 0.01
  });

  const legGeo = createTailoredLimbGeometry({
    topR: 0.130,
    midR: 0.119,
    bottomR: 0.113,
    length: 0.92,
    jointY: 0.02
  });

  [-1, 1].forEach((side) => {
    const shoulderCover = new THREE.Mesh(new THREE.SphereGeometry(0.095, 20, 16), suitMat);
    shoulderCover.position.set(side * 0.345, 0.735, 0);
    suitGroup.add(shoulderCover);

    const armPivot = new THREE.Group();
    armPivot.position.set(side * 0.44, 0.38, 0);
    armPivot.rotation.z = side * -0.18;

    const arm = new THREE.Mesh(armGeo, suitMat);
    arm.castShadow = true;
    arm.receiveShadow = true;
    armPivot.add(arm);

    const upperArmCap = new THREE.Mesh(new THREE.SphereGeometry(0.095, 20, 14), suitMat);
    upperArmCap.position.y = 0.37;
    armPivot.add(upperArmCap);

    const wristCap = new THREE.Mesh(new THREE.SphereGeometry(0.085, 20, 14), suitMat);
    wristCap.position.y = -0.37;
    armPivot.add(wristCap);

    const wristCuff = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.0018, 8, 24), seamMat);
    wristCuff.rotation.x = Math.PI / 2;
    wristCuff.position.y = -0.36;
    armPivot.add(wristCuff);

    suitGroup.add(armPivot);
    arms.push({ mesh: armPivot, shoulderCover, side });

    const legPivot = new THREE.Group();
    legPivot.position.set(side * 0.155, -0.62, 0);
    legPivot.rotation.z = side * -0.04;

    const leg = new THREE.Mesh(legGeo, suitMat);
    leg.castShadow = true;
    leg.receiveShadow = true;
    legPivot.add(leg);

    const hipCap = new THREE.Mesh(new THREE.SphereGeometry(0.130, 20, 14), suitMat);
    hipCap.position.y = 0.46;
    legPivot.add(hipCap);

    const ankleCap = new THREE.Mesh(new THREE.SphereGeometry(0.113, 20, 14), suitMat);
    ankleCap.position.y = -0.46;
    legPivot.add(ankleCap);

    const ankleCuff = new THREE.Mesh(new THREE.TorusGeometry(0.113, 0.0018, 8, 24), seamMat);
    ankleCuff.rotation.x = Math.PI / 2;
    ankleCuff.position.y = -0.45;
    legPivot.add(ankleCuff);

    suitGroup.add(legPivot);
    legs.push({ mesh: legPivot, side });
  });

  function applyStyle(fabricPreset, colorPreset) {
    Object.assign(suitMat, fabricPreset.mat);
    suitMat.color.setHex(colorPreset.hex);
    if (suitMat.sheenColor) {
      suitMat.sheenColor.setHex(colorPreset.hex).lerp(new THREE.Color(0xffffff), 0.35);
    }
    suitMat.needsUpdate = true;

    seamMat.color.setHex(colorPreset.hex).multiplyScalar(0.76);
    seamMat.roughness = Math.min(1.0, (fabricPreset.mat.roughness ?? 0.5) + 0.15);
    seamMat.clearcoat = (fabricPreset.mat.clearcoat ?? 0) * 0.5;
    seamMat.needsUpdate = true;
  }

  function syncBody(profile) {
    const [, , chestZ] = profile.chestScale;

    morphTorsoVertices(torsoGeo, profile.chestScale, profile.hipScale);
    seamMeshes.forEach((m) => morphTorsoVertices(m.geometry, profile.chestScale, profile.hipScale));

    const armScale = (profile.armRadius + 0.011) / 0.085;
    const legScale = (profile.legRadius + 0.012) / 0.113;

    arms.forEach(({ mesh, shoulderCover, side }) => {
      mesh.position.x = side * profile.armOffset;
      mesh.scale.set(armScale, 1, armScale);
      shoulderCover.position.set(side * (profile.armOffset - 0.115), 0.735, 0);
      shoulderCover.scale.setScalar(armScale);
    });
    legs.forEach(({ mesh, side }) => {
      mesh.position.x = side * profile.legOffset;
      mesh.scale.set(legScale, 1, legScale);
    });
    // Keep zipper flush against chest Z-depth for Boy (0.78) and Girl (0.64)
    setDepth(0.314 * chestZ + 0.003);
  }

  return { suitGroup, applyStyle, syncBody, setClosureType };
}