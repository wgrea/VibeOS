import * as THREE from 'three';
import { buildClosure } from '../../closures.js';
import { 
  createJacketShellGeometry, 
  createJacketSleeveGeometry, 
  createMotoLapelMesh 
} from './geometries.js';
import { morphJacketVertices } from './sizing.js';

export function buildJacket(initialHex = 0x111318) {
  const garmentGroup = new THREE.Group();

  const shellMat = new THREE.MeshPhysicalMaterial({
    color: initialHex,
    side: THREE.DoubleSide
  });

  const trimMat = new THREE.MeshPhysicalMaterial({
    color: 0x1e293b,
    side: THREE.DoubleSide
  });

  const hardwareMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.85,
    roughness: 0.25
  });

  const shellGeo = createJacketShellGeometry();
  const chest = new THREE.Mesh(shellGeo, shellMat);
  chest.castShadow = true;
  chest.receiveShadow = true;
  garmentGroup.add(chest);

  const waistHem = new THREE.Mesh(new THREE.CylinderGeometry(0.292, 0.288, 0.082, 48, 1, false), trimMat);
  waistHem.position.y = 0.275;
  garmentGroup.add(waistHem);

  const funnelCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.152, 0.168, 0.115, 40, 1, true), trimMat);
  funnelCollar.position.y = 0.905;
  garmentGroup.add(funnelCollar);

  const collarRim = new THREE.Mesh(new THREE.TorusGeometry(0.152, 0.011, 12, 40), trimMat);
  collarRim.rotation.x = Math.PI / 2;
  collarRim.position.y = 0.962;
  garmentGroup.add(collarRim);

  const motoLapels = new THREE.Group();
  [-1, 1].forEach((side) => {
    motoLapels.add(createMotoLapelMesh(side, shellMat, hardwareMat));

    const epaulet = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.012, 0.036), shellMat);
    epaulet.position.set(side * 0.235, 0.885, 0);
    epaulet.rotation.z = side * -0.18;
    motoLapels.add(epaulet);

    const epauletSnap = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.006, 12), hardwareMat);
    epauletSnap.position.set(side * 0.195, 0.896, 0);
    epauletSnap.rotation.z = side * -0.18;
    motoLapels.add(epauletSnap);

    const pocketWelt = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.014, 0.014), hardwareMat);
    pocketWelt.position.set(side * 0.135, 0.56, 0.242);
    pocketWelt.rotation.set(-0.08, side * 0.36, side * 0.25);
    motoLapels.add(pocketWelt);
  });
  garmentGroup.add(motoLapels);

  const pufferGroup = new THREE.Group();
  const baffleSpecs = [
    { y: 0.76, r: 0.326, tube: 0.030 },
    { y: 0.64, r: 0.324, tube: 0.034 },
    { y: 0.51, r: 0.306, tube: 0.034 },
    { y: 0.38, r: 0.282, tube: 0.032 }
  ];
  baffleSpecs.forEach(({ y, r, tube }) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 16, 48), shellMat);
    ring.rotation.x = Math.PI / 2;
    ring.scale.set(1, 1, 0.78);
    ring.position.y = y;
    ring.castShadow = true;
    ring.receiveShadow = true;
    pufferGroup.add(ring);
  });
  garmentGroup.add(pufferGroup);

  const windGroup = new THREE.Group();
  const windStripe = new THREE.Mesh(new THREE.CylinderGeometry(0.346, 0.338, 0.155, 48, 1, true), trimMat);
  windStripe.position.y = 0.64;
  windGroup.add(windStripe);

  const stormFlap = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.60, 0.014), shellMat);
  stormFlap.position.set(0.012, 0.56, 0.248);
  windGroup.add(stormFlap);
  garmentGroup.add(windGroup);

  const { closureGroup, setClosureType, setDepth } = buildClosure({
    type: 'zipper',
    yTop: 0.87,
    yBottom: 0.255,
    zOffset: 0.255,
    waistDropZ: 0.042,
    topDropZ: 0.02
  });
  garmentGroup.add(closureGroup);

  const arms = [];
  const sleeveGeo = createJacketSleeveGeometry({
    topR: 0.118,
    midR: 0.108,
    cuffR: 0.098,
    length: 0.68
  });

  [-1, 1].forEach((side) => {
    const armPivot = new THREE.Group();
    armPivot.position.set(side * 0.44, 0.40, 0);
    armPivot.rotation.z = side * -0.18;

    const arm = new THREE.Mesh(sleeveGeo, shellMat);
    arm.castShadow = true;
    arm.receiveShadow = true;
    armPivot.add(arm);

    const shoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.122, 22, 16), shellMat);
    shoulderCap.position.y = 0.35;
    shoulderCap.scale.set(1.02, 1.02, 1.02);
    armPivot.add(shoulderCap);

    const sleeveBaffles = new THREE.Group();
    [0.20, 0.04, -0.12].forEach((by, idx) => {
      const sRing = new THREE.Mesh(new THREE.TorusGeometry(0.106 - idx * 0.005, 0.020, 12, 28), shellMat);
      sRing.rotation.x = Math.PI / 2;
      sRing.position.y = by;
      sleeveBaffles.add(sRing);
    });
    armPivot.add(sleeveBaffles);

    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.098, 0.096, 0.072, 24), trimMat);
    cuff.position.y = -0.355;
    armPivot.add(cuff);

    const cuffCap = new THREE.Mesh(new THREE.SphereGeometry(0.096, 18, 12), trimMat);
    cuffCap.position.y = -0.39;
    armPivot.add(cuffCap);

    garmentGroup.add(armPivot);
    arms.push({ mesh: armPivot, sleeveBaffles, side });
  });

  let currentVariant = 'moto';
  function setVariant(variant) {
    currentVariant = variant;
    motoLapels.visible = variant === 'moto';
    pufferGroup.visible = variant === 'puffer';
    windGroup.visible = variant === 'windbreaker';
    waistHem.visible = variant === 'bomber' || variant === 'windbreaker';
    arms.forEach(({ sleeveBaffles }) => {
      sleeveBaffles.visible = variant === 'puffer';
    });
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

    if (shellMat.sheenColor) {
      shellMat.sheenColor.setHex(mainHex).lerp(new THREE.Color(0xffffff), 0.35);
    }
    if (trimMat.sheenColor) {
      trimMat.sheenColor.setHex(trimHex).lerp(new THREE.Color(0xffffff), 0.3);
    }
  }

  function syncBody(profile) {
    const [chestX, , chestZ] = profile.chestScale;
    const [hipX, , hipZ] = profile.hipScale;

    morphJacketVertices(shellGeo, profile.chestScale, profile.hipScale);

    const waistT = THREE.MathUtils.smoothstep(0.275, 0.14, 0.56);
    const waistX = THREE.MathUtils.lerp(hipX, chestX, waistT);
    const waistZ = THREE.MathUtils.lerp(hipZ, chestZ, waistT);
    waistHem.scale.set(waistX * 1.01, 1, waistZ * 1.01);
    windStripe.scale.set(chestX * 1.005, 1, chestZ * 1.005);

    funnelCollar.scale.set(
      THREE.MathUtils.lerp(1.0, chestX, 0.35),
      1,
      THREE.MathUtils.lerp(1.0, chestZ, 0.35)
    );
    collarRim.scale.set(
      THREE.MathUtils.lerp(1.0, chestX, 0.35),
      THREE.MathUtils.lerp(1.0, chestZ, 0.35),
      1
    );

    pufferGroup.children.forEach((ring, i) => {
      const t = 1 - i * 0.22;
      const bx = THREE.MathUtils.lerp(waistX, chestX, t);
      const bz = THREE.MathUtils.lerp(waistZ, chestZ, t);
      ring.scale.set(bx, bz, 0.85);
    });

    const armScale = (profile.armRadius + 0.034) / 0.104;
    arms.forEach(({ mesh, side }) => {
      mesh.position.x = side * profile.armOffset;
      mesh.scale.set(armScale, 1, armScale);
    });

    const zFront = 0.344 * chestZ + 0.008;
    motoLapels.position.z = zFront - 0.242;
    motoLapels.scale.set(Math.min(1.12, chestX * 0.95), 1, 1);
    stormFlap.position.z = zFront + 0.004;
    setDepth(zFront);
  }

  setVariant(currentVariant);
  return { garmentGroup, applyStyle, syncBody, setClosureType, setVariant };
}