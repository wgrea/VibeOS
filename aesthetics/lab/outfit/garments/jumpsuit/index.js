import * as THREE from 'three';
import { buildClosure } from '../../closures.js';
import { createJumpsuitTorsoGeometry, createWorkwearLimbGeometry, createUtilityPocket } from './geometries.js';
import { morphJumpsuitTorso } from './sizing.js';

export function buildJumpsuit(initialHex = 0x6b1426) {
  const garmentGroup = new THREE.Group();

  const mainMat = new THREE.MeshPhysicalMaterial({
    color: initialHex,
    side: THREE.DoubleSide
  });

  const trimMat = new THREE.MeshPhysicalMaterial({
    color: initialHex,
    side: THREE.DoubleSide
  });

  const hardwareMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.82,
    roughness: 0.28
  });

  const torsoGeo = createJumpsuitTorsoGeometry();
  const torso = new THREE.Mesh(torsoGeo, mainMat);
  torso.castShadow = true;
  torso.receiveShadow = true;
  garmentGroup.add(torso);

  const collarGroup = new THREE.Group();
  collarGroup.position.y = 0.900;

  const collarBand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.150, 0.168, 0.072, 36, 1, true, 0.28, Math.PI * 2 - 0.56),
    trimMat
  );
  collarBand.position.y = 0.036;
  collarGroup.add(collarBand);

  const collarFold = new THREE.Mesh(
    new THREE.TorusGeometry(0.154, 0.014, 12, 36, Math.PI * 2 - 0.58),
    trimMat
  );
  collarFold.rotation.set(Math.PI / 2, 0, Math.PI / 2 + 0.29);
  collarFold.position.y = 0.068;
  collarGroup.add(collarFold);

  [-1, 1].forEach((side) => {
    const tabShape = new THREE.Shape();
    tabShape.moveTo(0, 0.052);
    tabShape.lineTo(side * 0.068, 0.030);
    tabShape.lineTo(side * 0.050, -0.022);
    tabShape.lineTo(0, -0.008);
    tabShape.closePath();

    const tabGeo = new THREE.ExtrudeGeometry(tabShape, {
      depth: 0.008,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.002,
      bevelThickness: 0.002
    });
    const tab = new THREE.Mesh(tabGeo, trimMat);
    tab.position.set(side * 0.022, 0.028, 0.154);
    tab.rotation.set(-0.52, side * 0.35, side * -0.15);
    collarGroup.add(tab);
  });

  garmentGroup.add(collarGroup);

  const chestPockets = [];
  [-1, 1].forEach((side) => {
    const pocket = createUtilityPocket(0.105, 0.125, trimMat, hardwareMat);
    pocket.position.set(side * 0.128, 0.62, 0.24);
    pocket.rotation.set(-0.06, side * 0.34, 0);
    garmentGroup.add(pocket);
    chestPockets.push({ mesh: pocket, side });
  });

  const waistGroup = new THREE.Group();
  waistGroup.position.y = 0.280;

  const waistBand = new THREE.Mesh(new THREE.CylinderGeometry(0.285, 0.278, 0.070, 48), trimMat);
  waistBand.castShadow = true;
  waistGroup.add(waistBand);

  [{ y: -0.033, r: 0.279 }, { y: 0.033, r: 0.285 }].forEach(({ y, r }) => {
    const stitchRing = new THREE.Mesh(new THREE.TorusGeometry(r, 0.003, 8, 48), trimMat);
    stitchRing.rotation.x = Math.PI / 2;
    stitchRing.position.y = y;
    waistGroup.add(stitchRing);
  });

  [-2.3, -1.1, -0.35, 0.35, 1.1, 2.3].forEach((angle) => {
    const loop = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.080, 0.012), trimMat);
    loop.position.set(Math.sin(angle) * 0.285, 0, Math.cos(angle) * 0.285);
    loop.rotation.y = angle;
    waistGroup.add(loop);
  });

  const dRing = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.003, 8, 18), hardwareMat);
  dRing.position.set(0.288, -0.022, 0.04);
  dRing.rotation.y = Math.PI / 2;
  waistGroup.add(dRing);

  garmentGroup.add(waistGroup);

  const { closureGroup, setClosureType, setDepth } = buildClosure({
    type: 'buttons',
    yTop: 0.86,
    yBottom: 0.28,
    zOffset: 0.238,
    buttonCount: 5,
    waistDropZ: 0.032,
    topDropZ: 0.016
  });
  garmentGroup.add(closureGroup);

  const arms = [];
  const legs = [];

  const sleeveGeo = createWorkwearLimbGeometry({ topR: 0.114, midR: 0.104, bottomR: 0.094, length: 0.74, jointY: 0.01 });
  const legGeo = createWorkwearLimbGeometry({ topR: 0.146, midR: 0.138, bottomR: 0.132, length: 0.92, jointY: 0.02 });

  [-1, 1].forEach((side) => {
    const shoulderCover = new THREE.Mesh(new THREE.SphereGeometry(0.116, 20, 16), mainMat);
    shoulderCover.position.set(side * 0.325, 0.735, 0);
    garmentGroup.add(shoulderCover);

    const armPivot = new THREE.Group();
    armPivot.position.set(side * 0.44, 0.38, 0);
    armPivot.rotation.z = side * -0.18;

    const arm = new THREE.Mesh(sleeveGeo, mainMat);
    arm.castShadow = true;
    arm.receiveShadow = true;
    armPivot.add(arm);

    const shoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.114, 20, 14), mainMat);
    shoulderCap.position.y = 0.37;
    armPivot.add(shoulderCap);

    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.096, 0.095, 0.068, 24), trimMat);
    cuff.position.y = -0.365;
    armPivot.add(cuff);

    const cuffCap = new THREE.Mesh(new THREE.SphereGeometry(0.095, 18, 12), trimMat);
    cuffCap.position.y = -0.398;
    armPivot.add(cuffCap);

    const cuffBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.005, 12), hardwareMat);
    cuffBtn.rotation.z = Math.PI / 2;
    cuffBtn.position.set(side * 0.097, -0.365, -0.02);
    armPivot.add(cuffBtn);

    garmentGroup.add(armPivot);
    arms.push({ mesh: armPivot, shoulderCover, side });

    const legPivot = new THREE.Group();
    legPivot.position.set(side * 0.155, -0.62, 0);
    legPivot.rotation.z = side * -0.04;

    const leg = new THREE.Mesh(legGeo, mainMat);
    leg.castShadow = true;
    leg.receiveShadow = true;
    legPivot.add(leg);

    const hipCap = new THREE.Mesh(new THREE.SphereGeometry(0.146, 20, 14), mainMat);
    hipCap.position.y = 0.46;
    legPivot.add(hipCap);

    const thighPocket = createUtilityPocket(0.085, 0.11, trimMat, hardwareMat);
    thighPocket.position.set(side * 0.138, 0.14, 0.01);
    thighPocket.rotation.y = side * Math.PI * 0.5;
    legPivot.add(thighPocket);

    const legHem = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.062, 24), trimMat);
    legHem.position.y = -0.465;
    legPivot.add(legHem);

    const hemLip = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.0035, 8, 24), trimMat);
    hemLip.rotation.x = Math.PI / 2;
    hemLip.position.y = -0.434;
    legPivot.add(hemLip);

    const ankleCap = new THREE.Mesh(new THREE.SphereGeometry(0.134, 18, 12), trimMat);
    ankleCap.position.y = -0.495;
    legPivot.add(ankleCap);

    garmentGroup.add(legPivot);
    legs.push({ mesh: legPivot, side });
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
      trimMat.color.offsetHSL(0, 0, -0.045);
    }

    if (mainMat.sheenColor) {
      mainMat.sheenColor.setHex(baseHex).lerp(new THREE.Color(0xffffff), 0.35);
    }
    if (trimMat.sheenColor) {
      trimMat.sheenColor.setHex(trimHex).lerp(new THREE.Color(0xffffff), 0.3);
    }
  }

  function syncBody(profile) {
    const [chestX, , chestZ] = profile.chestScale;
    const [hipX, , hipZ] = profile.hipScale;

    morphJumpsuitTorso(torsoGeo, profile.chestScale, profile.hipScale);

    const collarX = THREE.MathUtils.lerp(chestX, 1.03, 0.55);
    const collarZ = THREE.MathUtils.lerp(chestZ, 1.03, 0.55);
    collarGroup.scale.set(collarX, 1, collarZ);

    const waistT = THREE.MathUtils.smoothstep(0.28, 0.14, 0.56);
    const waistX = THREE.MathUtils.lerp(hipX, chestX, waistT);
    const waistZ = THREE.MathUtils.lerp(hipZ, chestZ, waistT);
    waistGroup.scale.set(waistX, 1, waistZ);

    const armScale = (profile.armRadius + 0.03) / 0.102;
    const legScale = (profile.legRadius + 0.034) / 0.132;

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

    const zFront = 0.338 * chestZ + 0.008;
    chestPockets.forEach(({ mesh, side }) => {
      mesh.position.x = side * (0.128 * chestX);
      mesh.position.z = zFront - 0.014;
    });
    setDepth(zFront);
  }

  return { garmentGroup, applyStyle, syncBody, setClosureType };
}