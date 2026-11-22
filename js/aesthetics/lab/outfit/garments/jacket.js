// js/aesthetics/lab/outfit/garments/jacket.js
import * as THREE from 'three';
import { buildClosure } from '../closures.js';

/**
 * Builds a structured outerwear torso shell with clearance over both the mannequin
 * and inner base layers (catsuit), including rounded shoulders and a turned-under hem.
 */
function createJacketShellGeometry() {
  const profilePoints = [
    [0.238, 0.255],  // Inner bottom hem return
    [0.258, 0.255],  // Outer bottom hem edge
    [0.264, 0.305],  // Lower waist
    [0.278, 0.385],  // Mid torso
    [0.304, 0.485],  // Ribcage
    [0.328, 0.585],  // Full chest
    [0.334, 0.715],  // Upper chest
    [0.330, 0.835],  // Clears top outer corner of mannequin chest (y = 0.85)
    [0.295, 0.875],  // Structured shoulder slope
    [0.205, 0.895],  // Collar seam base
    [0.162, 0.905],  // Collar throat
    [0.148, 0.865]   // Inner collar lining
  ];

  const lathePoints = profilePoints.map(([r, y]) => new THREE.Vector2(r, y));
  const geo = new THREE.LatheGeometry(lathePoints, 56);
  geo.rotateY(Math.PI / 2);

  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);
    const angle = Math.atan2(z, x);

    // Subtle fabric drape ripples above the waistband & near the back
    if (y > 0.28 && y < 0.76) {
      const lowerMask = Math.exp(-Math.pow((y - 0.36) / 0.16, 2));
      const fold = (Math.sin(y * 42.0 + Math.cos(angle * 2.0) * 1.3) + 1.0) * 0.0022 * lowerMask;
      x += Math.cos(angle) * fold;
      z += Math.sin(angle) * fold;
    }

    pos.setXYZ(i, x, y, z);

    const u = (angle + Math.PI) / (Math.PI * 2);
    const v = (y - 0.25) / 0.66;
    uv.setXY(i, u, v);
  }

  geo.userData.basePositions = new Float32Array(pos.array);
  uv.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds a tailored jacket sleeve with deltoid shoulder cap, subtle elbow articulation,
 * and clean cylindrical UVs.
 */
function createJacketSleeveGeometry({ topR, midR, cuffR, length, radialSegs = 28, heightSegs = 32 }) {
  const geo = new THREE.CylinderGeometry(topR, cuffR, length, radialSegs, heightSegs, false);
  const pos = geo.attributes.position;
  const halfLen = length * 0.5;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    const t = (y + halfLen) / length; // 0 = cuff, 1 = shoulder

    let targetR;
    if (t > 0.5) {
      const u = (t - 0.5) * 2;
      targetR = THREE.MathUtils.lerp(midR, topR, Math.pow(u, 0.85));
    } else {
      const u = t * 2;
      targetR = THREE.MathUtils.lerp(cuffR, midR, Math.pow(u, 0.82));
    }

    // Subtle elbow stack folds around t = 0.45..0.55
    const distElbow = Math.abs(y);
    if (distElbow < 0.11) {
      const mask = 1.0 - distElbow / 0.11;
      targetR += (Math.sin(y * 76.0) + 1.0) * 0.0022 * mask;
    }

    const currentR = Math.hypot(x, z);
    if (currentR > 0.0001) {
      const scale = targetR / currentR;
      x *= scale;
      z *= scale;
    }

    pos.setXYZ(i, x, y, z);
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds a sculpted notched moto lapel using ExtrudeGeometry with beveling.
 */
function createMotoLapelMesh(side, shellMat, hardwareMat) {
  const lapelGroup = new THREE.Group();

  const shape = new THREE.Shape();
  shape.moveTo(0, 0.09);
  shape.lineTo(side * 0.088, 0.055);
  shape.lineTo(side * 0.062, 0.01);
  shape.lineTo(side * 0.082, -0.025);
  shape.lineTo(side * 0.018, -0.115);
  shape.lineTo(0, -0.115);
  shape.closePath();

  const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.012,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.004,
    bevelThickness: 0.004
  });

  const lapelMesh = new THREE.Mesh(extrudeGeo, shellMat);
  lapelMesh.castShadow = true;
  lapelGroup.add(lapelMesh);

  // Metallic collar snap stud on lapel corner
  const snap = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.006, 14), hardwareMat);
  snap.rotation.x = Math.PI / 2;
  snap.position.set(side * 0.064, 0.045, 0.016);
  lapelGroup.add(snap);

  lapelGroup.position.set(side * 0.018, 0.77, 0.242);
  lapelGroup.rotation.set(-0.22, side * 0.34, side * -0.14);

  return lapelGroup;
}

/**
 * Morphs jacket torso vertices between hipScale (at waist) and chestScale (at upper chest),
 * keeping the collar neck ring circular.
 */
function morphJacketVertices(geo, chestScale, hipScale) {
  const pos = geo.attributes.position;
  const base = geo.userData.basePositions;

  const [hipX, , hipZ] = hipScale;
  const [chestX, , chestZ] = chestScale;

  // Blend waist between hipScale and chestScale so jacket waistband sits cleanly over hips
  const waistX = THREE.MathUtils.lerp(hipX, chestX, 0.45);
  const waistZ = THREE.MathUtils.lerp(hipZ, chestZ, 0.45);

  for (let i = 0; i < pos.count; i++) {
    const bx = base[i * 3];
    const by = base[i * 3 + 1];
    const bz = base[i * 3 + 2];

    let sx, sz;
    if (by <= 0.85) {
      const t = THREE.MathUtils.smoothstep(by, 0.25, 0.58);
      sx = THREE.MathUtils.lerp(waistX, chestX, t);
      sz = THREE.MathUtils.lerp(waistZ, chestZ, t);
    } else {
      const t = THREE.MathUtils.smoothstep(by, 0.85, 0.905);
      sx = THREE.MathUtils.lerp(chestX, 1.04, t);
      sz = THREE.MathUtils.lerp(chestZ, 1.04, t);
    }

    pos.setXYZ(i, bx * sx, by, bz * sz);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

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

  // 1. Continuous sculpted outer jacket shell
  const shellGeo = createJacketShellGeometry();
  const chest = new THREE.Mesh(shellGeo, shellMat);
  chest.castShadow = true;
  chest.receiveShadow = true;
  garmentGroup.add(chest);

  // 2. Ribbed knit waistband (Bomber & Windbreaker)
  const waistHem = new THREE.Mesh(new THREE.CylinderGeometry(0.262, 0.256, 0.082, 48, 1, false), trimMat);
  waistHem.position.y = 0.275;
  garmentGroup.add(waistHem);

  // 3. Double-walled Funnel / Ribbed Stand Collar
  const funnelCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.152, 0.168, 0.115, 40, 1, true), trimMat);
  funnelCollar.position.y = 0.905;
  garmentGroup.add(funnelCollar);

  const collarRim = new THREE.Mesh(new THREE.TorusGeometry(0.152, 0.011, 12, 40), trimMat);
  collarRim.rotation.x = Math.PI / 2;
  collarRim.position.y = 0.962;
  garmentGroup.add(collarRim);

  // 4. Moto Variant Details: Notched lapels, shoulder epaulets & angled zip welts
  const motoLapels = new THREE.Group();
  [-1, 1].forEach((side) => {
    motoLapels.add(createMotoLapelMesh(side, shellMat, hardwareMat));

    // Shoulder epaulet strap
    const epaulet = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.012, 0.036), shellMat);
    epaulet.position.set(side * 0.235, 0.885, 0);
    epaulet.rotation.z = side * -0.18;
    motoLapels.add(epaulet);

    const epauletSnap = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.006, 12), hardwareMat);
    epauletSnap.position.set(side * 0.195, 0.896, 0);
    epauletSnap.rotation.z = side * -0.18;
    motoLapels.add(epauletSnap);

    // Angled chest pocket welt
    const pocketWelt = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.014, 0.014), hardwareMat);
    pocketWelt.position.set(side * 0.135, 0.56, 0.242);
    pocketWelt.rotation.set(-0.08, side * 0.36, side * 0.25);
    motoLapels.add(pocketWelt);
  });
  garmentGroup.add(motoLapels);

  // 5. Puffer Variant Details: Quilted down baffles around torso
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

  // 6. Windbreaker Variant Details: Color-blocked chest yoke & storm flap
  const windGroup = new THREE.Group();
  const windStripe = new THREE.Mesh(new THREE.CylinderGeometry(0.334, 0.312, 0.155, 48, 1, true), trimMat);
  windStripe.position.y = 0.64;
  windGroup.add(windStripe);

  const stormFlap = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.60, 0.014), shellMat);
  stormFlap.position.set(0.012, 0.56, 0.248);
  windGroup.add(stormFlap);
  garmentGroup.add(windGroup);

  // 7. Front Closure
  const { closureGroup, setClosureType, setDepth } = buildClosure({
    type: 'zipper',
    yTop: 0.87,
    yBottom: 0.255,
    zOffset: 0.255
  });
  garmentGroup.add(closureGroup);

  // 8. Unified Sleeves, Shoulder Caps, Puffer Sleeve Rings & Ribbed Cuffs
  const arms = [];
  const sleeveGeo = createJacketSleeveGeometry({
    topR: 0.114,
    midR: 0.104,
    cuffR: 0.092,
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

    // Structured deltoid shoulder cap
    const shoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.114, 22, 16), shellMat);
    shoulderCap.position.y = 0.34;
    shoulderCap.scale.set(1.02, 0.85, 1.02);
    armPivot.add(shoulderCap);
// Puffer quilted sleeve baffles (visible only in puffer mode)
const sleeveBaffles = new THREE.Group();
[0.20, 0.04, -0.12].forEach((by, idx) => {
const sRing = new THREE.Mesh(new THREE.TorusGeometry(0.106 - idx * 0.005, 0.020, 12, 28), shellMat);
sRing.rotation.x = Math.PI / 2;
sRing.position.y = by;
sleeveBaffles.add(sRing);
});
armPivot.add(sleeveBaffles);
// Ribbed knit cuff at wrist end of sleeve
const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.091, 0.088, 0.072, 24), trimMat);
cuff.position.y = -0.355;
armPivot.add(cuff);
const cuffCap = new THREE.Mesh(new THREE.SphereGeometry(0.088, 18, 12), trimMat);
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
// 1. Morph outer shell smoothly to match Boy & Girl torso proportions
morphJacketVertices(shellGeo, profile.chestScale, profile.hipScale);
// 2. Align waistband & windbreaker yoke
const waistX = THREE.MathUtils.lerp(hipX, chestX, 0.45);
const waistZ = THREE.MathUtils.lerp(hipZ, chestZ, 0.45);
waistHem.scale.set(waistX * 1.01, 1, waistZ * 1.01);
windStripe.scale.set(chestX * 1.005, 1, chestZ * 1.005);
// 3. Scale puffer baffles along chest depth & width
pufferGroup.children.forEach((ring, i) => {
const t = 1 - i * 0.22;
const bx = THREE.MathUtils.lerp(waistX, chestX, t);
const bz = THREE.MathUtils.lerp(waistZ, chestZ, t);
ring.scale.set(bx, bz, 0.85);
});
// 4. Position & scale sleeves + cuffs
const armScale = (profile.armRadius + 0.032) / 0.104;
arms.forEach(({ mesh, side }) => {
mesh.position.x = side * profile.armOffset;
mesh.scale.set(armScale, 1, armScale);
});
// 5. Keep moto lapels, storm flap & closure flush against chest Z-depth
const zFront = 0.332 * chestZ + 0.008;
motoLapels.position.z = zFront - 0.242;
motoLapels.scale.set(Math.min(1.12, chestX * 0.95), 1, 1);
stormFlap.position.z = zFront + 0.004;
setDepth(zFront);
}
setVariant(currentVariant);
return { garmentGroup, applyStyle, syncBody, setClosureType, setVariant };
}
