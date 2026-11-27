import * as THREE from 'three';
import { buildClosure } from '../../closures.js';
import { createOnesieTorsoGeometry, createOnesieLimbGeometry } from './geometries.js';
import { morphOnesieTorso } from './sizing.js';

export function buildOnesie(initialHex = 0x0284c7) {
  const garmentGroup = new THREE.Group();

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: initialHex,
    side: THREE.DoubleSide
  });

  const bellyMat = new THREE.MeshPhysicalMaterial({
    color: 0xf1f5f9,
    side: THREE.DoubleSide
  });

  const cuffMat = new THREE.MeshPhysicalMaterial({
    color: initialHex,
    side: THREE.DoubleSide
  });

  // 1. Continuous torso
  const torsoGeo = createOnesieTorsoGeometry();
  const torso = new THREE.Mesh(torsoGeo, bodyMat);
  torso.castShadow = true;
  torso.receiveShadow = true;
  garmentGroup.add(torso);

  // 2. Collar roll & draped back hood with lined ears
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.158, 0.026, 14, 32), cuffMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 0.905, 0);
  garmentGroup.add(collar);

  const hoodGroup = new THREE.Group();
  hoodGroup.position.set(0, 0.84, -0.145);

  const hoodOuter = new THREE.Mesh(new THREE.SphereGeometry(0.205, 24, 18), bodyMat);
  hoodOuter.scale.set(1.18, 0.72, 0.88);
  hoodOuter.rotation.x = 0.25;
  hoodOuter.castShadow = true;
  hoodGroup.add(hoodOuter);

  const hoodRim = new THREE.Mesh(new THREE.TorusGeometry(0.175, 0.024, 12, 28, Math.PI * 1.15), bodyMat);
  hoodRim.rotation.set(Math.PI * 0.42, 0, -Math.PI * 0.075);
  hoodRim.position.set(0, 0.045, 0.02);
  hoodGroup.add(hoodRim);

  [-1, 1].forEach((side) => {
    const earPivot = new THREE.Group();
    earPivot.position.set(side * 0.135, 0.125, -0.035);
    earPivot.rotation.set(-0.22, side * 0.18, side * -0.35);

    const earOuter = new THREE.Mesh(new THREE.SphereGeometry(0.058, 16, 16), bodyMat);
    earOuter.scale.set(1.0, 1.05, 0.65);
    earPivot.add(earOuter);

    const earInner = new THREE.Mesh(new THREE.SphereGeometry(0.038, 14, 14), bellyMat);
    earInner.scale.set(0.95, 1.0, 0.45);
    earInner.position.set(0, -0.004, 0.022);
    earPivot.add(earInner);

    hoodGroup.add(earPivot);
  });

  garmentGroup.add(hoodGroup);

  // 3. Sculpted oval belly patch + stitched piping border
  const bellyGroup = new THREE.Group();
  bellyGroup.position.set(0, 0.36, 0.22);

  const bellyPatch = new THREE.Mesh(new THREE.SphereGeometry(0.225, 24, 24), bellyMat);
  bellyPatch.scale.set(0.86, 1.48, 0.26);
  bellyGroup.add(bellyPatch);

  const bellyTrim = new THREE.Mesh(new THREE.TorusGeometry(0.224, 0.0055, 10, 40), cuffMat);
  bellyTrim.scale.set(0.86, 1.48, 0.45);
  bellyTrim.position.z = 0.018;
  bellyGroup.add(bellyTrim);

  garmentGroup.add(bellyGroup);

  // 4. Front closure (zipper / snaps)
  const { closureGroup, setClosureType, setDepth } = buildClosure({
    type: 'zipper',
    yTop: 0.87,
    yBottom: 0.08,
    zOffset: 0.285,
    waistDropZ: 0.036,
    topDropZ: 0.022
  });
  garmentGroup.add(closureGroup);

  // 5. Roomy sleeves & pant legs with ribbed cuffs (strictly > catsuit cuffs)
  const arms = [];
  const legs = [];

  const armGeo = createOnesieLimbGeometry({
    topR: 0.136,
    midR: 0.126,
    cuffGatherR: 0.132,
    cuffR: 0.100,
    length: 0.74
  });

  const legGeo = createOnesieLimbGeometry({
    topR: 0.168,
    midR: 0.154,
    cuffGatherR: 0.160,
    cuffR: 0.126,
    length: 0.92
  });

  [-1, 1].forEach((side) => {
    const shoulderCover = new THREE.Mesh(new THREE.SphereGeometry(0.136, 20, 16), bodyMat);
    shoulderCover.position.set(side * 0.345, 0.735, 0);
    garmentGroup.add(shoulderCover);

    const armPivot = new THREE.Group();
    armPivot.position.set(side * 0.44, 0.38, 0);
    armPivot.rotation.z = side * -0.18;

    const arm = new THREE.Mesh(armGeo, bodyMat);
    arm.castShadow = true;
    arm.receiveShadow = true;
    armPivot.add(arm);

    const upperArmCap = new THREE.Mesh(new THREE.SphereGeometry(0.136, 20, 14), bodyMat);
    upperArmCap.position.y = 0.37;
    armPivot.add(upperArmCap);

    const wristCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.101, 0.098, 0.068, 24), cuffMat);
    wristCuff.position.y = -0.336;
    armPivot.add(wristCuff);

    const wristCap = new THREE.Mesh(new THREE.SphereGeometry(0.098, 18, 12), cuffMat);
    wristCap.position.y = -0.37;
    armPivot.add(wristCap);

    garmentGroup.add(armPivot);
    arms.push({ mesh: armPivot, shoulderCover, side });

    const legPivot = new THREE.Group();
    legPivot.position.set(side * 0.155, -0.62, 0);
    legPivot.rotation.z = side * -0.04;

    const leg = new THREE.Mesh(legGeo, bodyMat);
    leg.castShadow = true;
    leg.receiveShadow = true;
    legPivot.add(leg);

    const hipCap = new THREE.Mesh(new THREE.SphereGeometry(0.168, 20, 14), bodyMat);
    hipCap.position.y = 0.46;
    legPivot.add(hipCap);

    const ankleCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.127, 0.124, 0.082, 24), cuffMat);
    ankleCuff.position.y = -0.419;
    legPivot.add(ankleCuff);

    const ankleCap = new THREE.Mesh(new THREE.SphereGeometry(0.124, 18, 12), cuffMat);
    ankleCap.position.y = -0.46;
    legPivot.add(ankleCap);

    garmentGroup.add(legPivot);
    legs.push({ mesh: legPivot, side });
  });

  function applyStyle(fabricPreset, colorPreset, palette) {
    const mainHex = palette && palette.primary !== null ? palette.primary : colorPreset.hex;
    const patchHex = palette && palette.secondary !== null ? palette.secondary : 0xf1f5f9;

    [bodyMat, bellyMat, cuffMat].forEach((mat) => {
      Object.assign(mat, fabricPreset.mat);
      mat.needsUpdate = true;
    });

    bodyMat.color.setHex(mainHex);
    bellyMat.color.setHex(patchHex);
    cuffMat.color.setHex(mainHex).multiplyScalar(0.84);
    cuffMat.roughness = Math.min(1.0, (fabricPreset.mat.roughness ?? 0.5) + 0.12);

    if (bodyMat.sheenColor) {
      bodyMat.sheenColor.setHex(mainHex).lerp(new THREE.Color(0xffffff), 0.35);
    }
    if (bellyMat.sheenColor) {
      bellyMat.sheenColor.setHex(patchHex).lerp(new THREE.Color(0xffffff), 0.35);
    }
    if (cuffMat.sheenColor) {
      cuffMat.sheenColor.setHex(mainHex).lerp(new THREE.Color(0xffffff), 0.3);
    }
    cuffMat.needsUpdate = true;
  }

  function syncBody(profile) {
    const [chestX, , chestZ] = profile.chestScale;

    morphOnesieTorso(torsoGeo, profile.chestScale, profile.hipScale);

    collar.scale.set(
      THREE.MathUtils.lerp(1.0, chestX, 0.35),
      THREE.MathUtils.lerp(1.0, chestZ, 0.35),
      1
    );

    const armScale = (profile.armRadius + 0.048) / 0.12;
    const legScale = (profile.legRadius + 0.052) / 0.15;

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

    const zFront = 0.352 * chestZ + 0.006;
    bellyGroup.position.z = zFront - 0.042;
    bellyGroup.scale.set(Math.min(1.08, chestX * 0.92), 1, 1);
    hoodGroup.position.z = -0.336 * chestZ + 0.065;
    setDepth(zFront + 0.016);
  }

  return { garmentGroup, applyStyle, syncBody, setClosureType };
}