import * as THREE from 'three';
import { buildClosure } from '../../closures.js';
import { createSnowsuitTorsoGeometry, createContouredBaffleGeometry, createInsulatedLimbGeometry } from './geometries.js';
import { morphSnowsuitVertices, morphStormFlap } from './sizing.js';

export function buildSnowsuit(initialHex = 0x1d4ed8) {
  const garmentGroup = new THREE.Group();

  const zoneMats = Array.from(
    { length: 8 },
    () => new THREE.MeshPhysicalMaterial({ color: initialHex, side: THREE.DoubleSide })
  );

  const hardwareMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.35,
    metalness: 0.65
  });

  // 1. Collar & Hood
  const collarGroup = new THREE.Group();
  collarGroup.position.y = 0.945;

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.178, 0.088, 40, 1, true), zoneMats[2]);
  collar.castShadow = true;
  collarGroup.add(collar);

  const collarBrim = new THREE.Mesh(new THREE.TorusGeometry(0.155, 0.014, 12, 40), zoneMats[3]);
  collarBrim.rotation.x = Math.PI / 2;
  collarBrim.position.y = 0.044;
  collarGroup.add(collarBrim);
  garmentGroup.add(collarGroup);

  const hoodGroup = new THREE.Group();
  hoodGroup.position.set(0, 0.865, -0.26);

  const hood = new THREE.Mesh(new THREE.SphereGeometry(0.205, 24, 18), zoneMats[4]);
  hood.scale.set(1.08, 0.72, 0.94);
  hood.rotation.x = 0.22;
  hood.castShadow = true;
  hoodGroup.add(hood);

  const hoodRim = new THREE.Mesh(new THREE.TorusGeometry(0.178, 0.022, 12, 28, Math.PI * 1.15), zoneMats[3]);
  hoodRim.rotation.set(Math.PI * 0.42, 0, -Math.PI * 0.075);
  hoodRim.position.set(0, 0.045, 0.02);
  hoodGroup.add(hoodRim);
  garmentGroup.add(hoodGroup);

  // 2. Torso
  const torsoGeo = createSnowsuitTorsoGeometry();
  const torso = new THREE.Mesh(torsoGeo, [zoneMats[0], zoneMats[1]]);
  torso.castShadow = true;
  torso.receiveShadow = true;
  garmentGroup.add(torso);

  // 3. Baffles
  const baffleSpecs = [
    { y: 0.62, r: 0.344, matIdx: 0 },
    { y: 0.49, r: 0.320, matIdx: 2 },
    { y: 0.36, r: 0.294, matIdx: 0 },
    { y: 0.18, r: 0.284, matIdx: 2 },
    { y: 0.02, r: 0.326, matIdx: 0 }
  ];

  const baffles = baffleSpecs.map(({ y, r, matIdx }) => {
    const geo = createContouredBaffleGeometry(r, y, 0.024);
    const mesh = new THREE.Mesh(geo, zoneMats[matIdx]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    garmentGroup.add(mesh);
    return mesh;
  });

  // 4. Waist Belt
  const waistBeltGroup = new THREE.Group();
  waistBeltGroup.position.y = 0.288;
  const waistBelt = new THREE.Mesh(new THREE.CylinderGeometry(0.287, 0.284, 0.066, 48), zoneMats[2]);
  waistBelt.castShadow = true;
  waistBeltGroup.add(waistBelt);

  [{ y: -0.031, r: 0.285 }, { y: 0.031, r: 0.288 }].forEach(({ y, r }) => {
    const beltEdge = new THREE.Mesh(new THREE.TorusGeometry(r, 0.0032, 8, 48), zoneMats[3]);
    beltEdge.rotation.x = Math.PI / 2;
    beltEdge.position.y = y;
    waistBeltGroup.add(beltEdge);
  });

  const buckleGroup = new THREE.Group();
  buckleGroup.position.set(0, 0, 0.318);
  const buckleBody = new THREE.Mesh(new THREE.BoxGeometry(0.088, 0.056, 0.018), hardwareMat);
  buckleGroup.add(buckleBody);

  [-0.046, 0.046].forEach((px) => {
    const prong = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.036, 0.020), hardwareMat);
    prong.position.x = px;
    buckleGroup.add(prong);
  });

  const claspAccent = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.044, 0.021), zoneMats[3]);
  buckleGroup.add(claspAccent);
  waistBeltGroup.add(buckleGroup);
  garmentGroup.add(waistBeltGroup);

  // 5. Storm Flap & Closure
  const stormFlapGeo = new THREE.BoxGeometry(0.062, 0.73, 0.016, 1, 28, 1);
  stormFlapGeo.translate(0, 0.515, 0);
  stormFlapGeo.userData.basePositions = new Float32Array(stormFlapGeo.attributes.position.array);
  const stormFlap = new THREE.Mesh(stormFlapGeo, zoneMats[3]);
  stormFlap.castShadow = true;
  garmentGroup.add(stormFlap);

  const { closureGroup, setClosureType, setDepth } = buildClosure({
    type: 'zipper',
    yTop: 0.88,
    yBottom: 0.15,
    zOffset: 0.272,
    waistDropZ: 0.048,
    topDropZ: 0.025
  });
  garmentGroup.add(closureGroup);

  // 6. Limbs
  const arms = [];
  const legs = [];
  const sleeveGeo = createInsulatedLimbGeometry({ topR: 0.128, midR: 0.120, bottomR: 0.108, length: 0.74 });
  const legGeo = createInsulatedLimbGeometry({ topR: 0.158, midR: 0.148, bottomR: 0.142, length: 0.92 });

  [-1, 1].forEach((side) => {
    const shoulderCover = new THREE.Mesh(new THREE.SphereGeometry(0.126, 20, 16), zoneMats[5]);
    shoulderCover.position.set(side * 0.34, 0.735, 0);
    garmentGroup.add(shoulderCover);

    const armPivot = new THREE.Group();
    armPivot.position.set(side * 0.45, 0.38, 0);
    armPivot.rotation.z = side * -0.18;

    const arm = new THREE.Mesh(sleeveGeo, zoneMats[5]);
    arm.castShadow = true;
    arm.receiveShadow = true;
    armPivot.add(arm);

    const upperArmCap = new THREE.Mesh(new THREE.SphereGeometry(0.128, 20, 14), zoneMats[5]);
    upperArmCap.position.y = 0.37;
    armPivot.add(upperArmCap);

    const armBaffleUpper = new THREE.Mesh(new THREE.TorusGeometry(0.122, 0.020, 12, 28), zoneMats[3]);
    armBaffleUpper.rotation.x = Math.PI / 2;
    armBaffleUpper.position.y = 0.15;
    armPivot.add(armBaffleUpper);

    const armBaffleLower = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.020, 12, 28), zoneMats[3]);
    armBaffleLower.rotation.x = Math.PI / 2;
    armBaffleLower.position.y = -0.14;
    armPivot.add(armBaffleLower);

    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.109, 0.106, 0.082, 24), zoneMats[2]);
    cuff.position.y = -0.365;
    armPivot.add(cuff);

    const cuffCap = new THREE.Mesh(new THREE.SphereGeometry(0.106, 18, 12), zoneMats[2]);
    cuffCap.position.y = -0.404;
    armPivot.add(cuffCap);

    const velcroTab = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.036, 0.055), hardwareMat);
    velcroTab.position.set(side * 0.108, -0.365, 0);
    armPivot.add(velcroTab);

    garmentGroup.add(armPivot);
    arms.push({ mesh: armPivot, shoulderCover, side });

    const legPivot = new THREE.Group();
    legPivot.position.set(side * 0.16, -0.62, 0);
    legPivot.rotation.z = side * -0.04;

    const leg = new THREE.Mesh(legGeo, zoneMats[0]);
    leg.castShadow = true;
    leg.receiveShadow = true;
    legPivot.add(leg);

    const hipCap = new THREE.Mesh(new THREE.SphereGeometry(0.158, 20, 14), zoneMats[0]);
    hipCap.position.y = 0.46;
    legPivot.add(hipCap);

    const thighBaffle = new THREE.Mesh(new THREE.TorusGeometry(0.151, 0.023, 12, 28), zoneMats[7]);
    thighBaffle.rotation.x = Math.PI / 2;
    thighBaffle.position.y = 0.24;
    legPivot.add(thighBaffle);

    const kneePatch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.154, 0.152, 0.18, 24, 1, false, -0.62, 1.24),
      zoneMats[6]
    );
    kneePatch.position.y = 0.01;
    kneePatch.castShadow = true;
    legPivot.add(kneePatch);

    const ankleGaiter = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.160, 0.155, 28), zoneMats[2]);
    ankleGaiter.position.y = -0.435;
    legPivot.add(ankleGaiter);

    const gaiterLip = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.005, 8, 28), zoneMats[3]);
    gaiterLip.rotation.x = Math.PI / 2;
    gaiterLip.position.y = -0.358;
    legPivot.add(gaiterLip);

    const gaiterCap = new THREE.Mesh(new THREE.SphereGeometry(0.158, 18, 12), zoneMats[2]);
    gaiterCap.position.y = -0.505;
    gaiterCap.scale.set(1.0, 0.65, 1.0);
    legPivot.add(gaiterCap);

    garmentGroup.add(legPivot);
    legs.push({ mesh: legPivot, side });
  });

  function applyStyle(fabricPreset, colorPreset, palette, multiColors = []) {
    zoneMats.forEach((mat) => {
      Object.assign(mat, fabricPreset.mat);
      mat.needsUpdate = true;
    });

    if (palette && palette.primary !== null) {
      const palList = [palette.primary, palette.secondary, palette.accent];
      zoneMats.forEach((mat, idx) => {
        mat.color.setHex(palList[idx % palList.length]);
        if (mat.sheenColor) {
          mat.sheenColor.copy(mat.color).lerp(new THREE.Color(0xffffff), 0.35);
        }
      });
      return;
    }

    if (Array.isArray(multiColors) && multiColors.length > 0) {
      zoneMats.forEach((mat, idx) => {
        const swatch = multiColors[idx % multiColors.length];
        mat.color.setHex(swatch.hex);
        if (mat.sheenColor) {
          mat.sheenColor.copy(mat.color).lerp(new THREE.Color(0xffffff), 0.35);
        }
      });
      return;
    }

    const fallback = [colorPreset.hex, 0xf1f5f9, 0x111318, 0xf1f5f9, 0x111318, colorPreset.hex, 0x111318, 0xf1f5f9];
    zoneMats.forEach((mat, idx) => {
      mat.color.setHex(fallback[idx]);
      if (mat.sheenColor) {
        mat.sheenColor.copy(mat.color).lerp(new THREE.Color(0xffffff), 0.35);
      }
    });
  }

  function syncBody(profile) {
    const [chestX, , chestZ] = profile.chestScale;
    const [hipX, , hipZ] = profile.hipScale;

    morphSnowsuitVertices(torsoGeo, profile.chestScale, profile.hipScale);
    baffles.forEach((b) => morphSnowsuitVertices(b.geometry, profile.chestScale, profile.hipScale));
    morphStormFlap(stormFlapGeo, profile.chestScale, profile.hipScale);

    const collarX = THREE.MathUtils.lerp(chestX, 1.04, 0.65);
    const collarZ = THREE.MathUtils.lerp(chestZ, 1.04, 0.65);
    collarGroup.scale.set(collarX, 1, collarZ);

    const beltT = THREE.MathUtils.smoothstep(0.288, 0.14, 0.56);
    waistBeltGroup.scale.set(
      THREE.MathUtils.lerp(hipX, chestX, beltT),
      1,
      THREE.MathUtils.lerp(hipZ, chestZ, beltT)
    );

    const armScale = (profile.armRadius + 0.05) / 0.122;
    const legScale = (profile.legRadius + 0.054) / 0.152;

    arms.forEach(({ mesh, shoulderCover, side }) => {
      mesh.position.x = side * (profile.armOffset + 0.01);
      mesh.scale.set(armScale, 1, armScale);
      shoulderCover.position.set(side * (profile.armOffset - 0.105), 0.735, 0);
      shoulderCover.scale.set(armScale * 1.05, armScale * 1.05, armScale * 1.05);
    });

    legs.forEach(({ mesh, side }) => {
      mesh.position.x = side * (profile.legOffset + 0.005);
      mesh.scale.set(legScale, 1, legScale);
    });

    const zFront = 0.370 * chestZ + 0.012;
    hoodGroup.position.z = -0.360 * chestZ - 0.015;
    setDepth(zFront + 0.006);
  }

  return { garmentGroup, applyStyle, syncBody, setClosureType };
}