import * as THREE from 'three';
import { buildClosure } from '../../closures.js';
import { 
  createSweatshirtTorsoGeometry, 
  createSweatshirtSleeveGeometry, 
  createKangarooPocketMesh 
} from './geometries.js';
import { morphSweatshirtTorso } from './sizing.js';

export function buildSweatshirt(initialHex = 0x111318) {
  const garmentGroup = new THREE.Group();

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: initialHex,
    side: THREE.DoubleSide
  });

  const ribMat = new THREE.MeshPhysicalMaterial({
    color: initialHex,
    side: THREE.DoubleSide
  });

  const hardwareMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.82,
    roughness: 0.26
  });

  const torsoGeo = createSweatshirtTorsoGeometry();
  const chest = new THREE.Mesh(torsoGeo, bodyMat);
  chest.castShadow = true;
  chest.receiveShadow = true;
  garmentGroup.add(chest);

  const waistY = 0.289;
  const waistGeo = new THREE.CylinderGeometry(0.286, 0.268, 0.068, 48);
  waistGeo.userData.basePositions = new Float32Array(waistGeo.attributes.position.array);
  const waistBand = new THREE.Mesh(waistGeo, ribMat);
  waistBand.position.y = waistY;
  waistBand.castShadow = true;
  garmentGroup.add(waistBand);

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.152, 0.018, 14, 36), ribMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 0.910;
  garmentGroup.add(collar);

  const quarterZipCollar = new THREE.Group();
  quarterZipCollar.position.y = 0.942;

  const funnelWall = new THREE.Mesh(
    new THREE.CylinderGeometry(0.150, 0.168, 0.088, 36, 1, true, 0.24, Math.PI * 2 - 0.48),
    ribMat
  );
  quarterZipCollar.add(funnelWall);

  const funnelRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.150, 0.011, 10, 36, Math.PI * 2 - 0.48),
    ribMat
  );
  funnelRim.rotation.set(Math.PI / 2, 0, Math.PI / 2 + 0.24);
  funnelRim.position.y = 0.044;
  quarterZipCollar.add(funnelRim);
  garmentGroup.add(quarterZipCollar);

  const hoodieGroup = new THREE.Group();

  const hoodPivot = new THREE.Group();
  hoodPivot.position.set(0, 0.86, -0.26);

  const hood = new THREE.Mesh(new THREE.SphereGeometry(0.198, 24, 18), bodyMat);
  hood.scale.set(1.14, 0.75, 0.92);
  hood.rotation.x = 0.24;
  hood.castShadow = true;
  hoodPivot.add(hood);

  const hoodRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.172, 0.020, 12, 28, Math.PI * 1.15),
    bodyMat
  );
  hoodRim.rotation.set(Math.PI * 0.42, 0, -Math.PI * 0.075);
  hoodRim.position.set(0, 0.045, 0.02);
  hoodPivot.add(hoodRim);
  hoodieGroup.add(hoodPivot);

  const pocket = createKangarooPocketMesh(bodyMat, ribMat);
  hoodieGroup.add(pocket);

  const drawstringGroup = new THREE.Group();
  [-1, 1].forEach((side) => {
    const grommet = new THREE.Mesh(new THREE.TorusGeometry(0.008, 0.0025, 8, 16), hardwareMat);
    grommet.position.set(side * 0.042, 0.892, 0.282);
    drawstringGroup.add(grommet);

    const cordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.042, 0.892, 0.284),
      new THREE.Vector3(side * 0.048, 0.835, 0.346),
      new THREE.Vector3(side * 0.045, 0.735, 0.350),
      new THREE.Vector3(side * 0.043, 0.645, 0.350)
    ]);
    const cord = new THREE.Mesh(new THREE.TubeGeometry(cordCurve, 16, 0.0045, 8, false), ribMat);
    drawstringGroup.add(cord);

    const aglet = new THREE.Mesh(new THREE.CylinderGeometry(0.0048, 0.0042, 0.022, 10), hardwareMat);
    aglet.position.set(side * 0.043, 0.635, 0.350);
    drawstringGroup.add(aglet);
  });
  hoodieGroup.add(drawstringGroup);
  garmentGroup.add(hoodieGroup);

  const { closureGroup, setClosureType, setDepth } = buildClosure({
    type: 'none',
    yTop: 0.92,
    yBottom: 0.58,
    zOffset: 0.238,
    buttonCount: 3,
    waistDropZ: 0.015,
    topDropZ: 0.075
  });
  garmentGroup.add(closureGroup);

  const arms = [];
  const sleeveGeo = createSweatshirtSleeveGeometry({
    topR: 0.116,
    midR: 0.108,
    blouseR: 0.114,
    cuffR: 0.094,
    length: 0.74
  });

  [-1, 1].forEach((side) => {
    const shoulderCover = new THREE.Mesh(new THREE.SphereGeometry(0.116, 20, 16), bodyMat);
    shoulderCover.position.set(side * 0.325, 0.735, 0);
    garmentGroup.add(shoulderCover);

    const armPivot = new THREE.Group();
    armPivot.position.set(side * 0.44, 0.38, 0);
    armPivot.rotation.z = side * -0.18;

    const arm = new THREE.Mesh(sleeveGeo, bodyMat);
    arm.castShadow = true;
    arm.receiveShadow = true;
    armPivot.add(arm);

    const shoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.116, 20, 14), bodyMat);
    shoulderCap.position.y = 0.37;
    armPivot.add(shoulderCap);

    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.096, 0.092, 0.082, 24), ribMat);
    cuff.position.y = -0.365;
    armPivot.add(cuff);

    const cuffCap = new THREE.Mesh(new THREE.SphereGeometry(0.092, 18, 12), ribMat);
    cuffCap.position.y = -0.405;
    armPivot.add(cuffCap);

    garmentGroup.add(armPivot);
    arms.push({ mesh: armPivot, shoulderCover, side });
  });

  function setVariant(variant) {
    hoodieGroup.visible = variant === 'hoodie';
    collar.visible = variant !== 'quarter-zip';
    quarterZipCollar.visible = variant === 'quarter-zip';
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

    if (bodyMat.sheenColor) {
      bodyMat.sheenColor.setHex(mainHex).lerp(new THREE.Color(0xffffff), 0.35);
    }
    if (ribMat.sheenColor) {
      ribMat.sheenColor.setHex(trimHex).lerp(new THREE.Color(0xffffff), 0.3);
    }
  }

  function syncBody(profile) {
    const [chestX, , chestZ] = profile.chestScale;
    const [, , hipZ] = profile.hipScale;

    morphSweatshirtTorso(torsoGeo, profile.chestScale, profile.hipScale, 0);
    morphSweatshirtTorso(waistGeo, profile.chestScale, profile.hipScale, waistY);

    const collarX = THREE.MathUtils.lerp(chestX, 1.03, 0.60);
    const collarZ = THREE.MathUtils.lerp(chestZ, 1.03, 0.60);
    collar.scale.set(collarX, collarZ, 1);
    quarterZipCollar.scale.set(collarX, 1, collarZ);

    const armScale = (profile.armRadius + 0.034) / 0.106;
    arms.forEach(({ mesh, shoulderCover, side }) => {
      mesh.position.x = side * profile.armOffset;
      mesh.scale.set(armScale, 1, armScale);
      shoulderCover.position.set(side * (profile.armOffset - 0.115), 0.735, 0);
      shoulderCover.scale.setScalar(armScale);
    });

    const zFront = 0.342 * chestZ + 0.008;
    const midZ = THREE.MathUtils.lerp(hipZ, chestZ, THREE.MathUtils.smoothstep(0.385, 0.14, 0.56));
    pocket.position.z = 0.312 * midZ + 0.004;
    pocket.scale.set(Math.min(1.1, chestX * 0.94), 1, 1);
    hoodPivot.position.z = -0.342 * chestZ - 0.015;
    drawstringGroup.position.z = zFront - 0.344;
    setDepth(zFront);
  }

  setVariant('hoodie');
  return { garmentGroup, applyStyle, syncBody, setClosureType, setVariant };
}