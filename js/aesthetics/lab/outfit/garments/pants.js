// js/aesthetics/lab/outfit/garments/pants.js
import * as THREE from 'three';

/**
 * Builds a continuous hip & pelvis trouser shell with clearance over both
 * the mannequin and catsuit base layer, plus subtle seat/hip drape creases.
 */
function createPantsPelvisGeometry() {
  const profilePoints = [
    [0.01, -0.355],
    [0.19, -0.335],
    [0.278, -0.27],
    [0.305, -0.19],
    [0.314, -0.11], // Hips (clears mannequin 0.275 + catsuit)
    [0.296, -0.02],
    [0.264, 0.08],
    [0.244, 0.18],  // Upper hip
    [0.236, 0.255], // Waistband seat
    [0.220, 0.255]  // Inner waist return
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

    // Subtle horizontal fabric tension creases across upper thighs & seat
    if (y > -0.24 && y < 0.14) {
      const creaseMask = Math.exp(-Math.pow((y + 0.08) / 0.14, 2));
      const ripple = (Math.sin(y * 54.0 + Math.cos(angle * 2.0) * 1.4) + 1.0) * 0.002 * creaseMask;
      x += Math.cos(angle) * ripple;
      z += Math.sin(angle) * ripple;
    }

    pos.setXYZ(i, x, y, z);

    const u = (angle + Math.PI) / (Math.PI * 2);
    const v = (y + 0.36) / 0.62;
    uv.setXY(i, u, v);
  }

  uv.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds a tailored pant leg with thigh-to-ankle taper, knee articulation folds,
 * and subtle ankle stacking above the hem.
 */
function createPantLegGeometry({ topR, midR, bottomR, length, radialSegs = 28, heightSegs = 36 }) {
  const geo = new THREE.CylinderGeometry(topR, bottomR, length, radialSegs, heightSegs, false);
  const pos = geo.attributes.position;
  const halfLen = length * 0.5;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    const t = (y + halfLen) / length; // 0 = ankle hem, 1 = hip/thigh top

    let targetR;
    if (t > 0.5) {
      const u = (t - 0.5) * 2;
      targetR = THREE.MathUtils.lerp(midR, topR, Math.pow(u, 0.85));
    } else {
      const u = t * 2;
      targetR = THREE.MathUtils.lerp(bottomR, midR, Math.pow(u, 0.82));
    }

    // Subtle fabric bunching behind/around the knee (y ~ 0.02)
    const distKnee = Math.abs(y - 0.02);
    if (distKnee < 0.13) {
      const kneeMask = 1.0 - distKnee / 0.13;
      targetR += (Math.sin(y * 74.0) + 1.0) * 0.0022 * kneeMask;
    }

    // Subtle trouser break / stack fold just above ankle hem (t between 0.04 and 0.18)
    if (t > 0.04 && t < 0.18) {
      const stackMask = Math.sin(((t - 0.04) / 0.14) * Math.PI);
      targetR += (Math.sin(y * 92.0) + 1.0) * 0.0024 * stackMask;
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
 * Builds a beveled 3D cargo thigh pocket with an overhanging buttoned flap.
 */
function createCargoPocketMesh(side, mainMat, trimMat, hardwareMat) {
  const group = new THREE.Group();

  const w = 0.135;
  const h = 0.185;
  const hw = w * 0.5;
  const hh = h * 0.5;

  const pouchShape = new THREE.Shape();
  pouchShape.moveTo(-hw, hh);
  pouchShape.lineTo(hw, hh);
  pouchShape.lineTo(hw, -hh + 0.015);
  pouchShape.lineTo(hw - 0.015, -hh);
  pouchShape.lineTo(-hw + 0.015, -hh);
  pouchShape.lineTo(-hw, -hh + 0.015);
  pouchShape.closePath();

  const pouchGeo = new THREE.ExtrudeGeometry(pouchShape, {
    depth: 0.024,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.004,
    bevelThickness: 0.004
  });
  const pouch = new THREE.Mesh(pouchGeo, mainMat);
  pouch.castShadow = true;
  group.add(pouch);

  // Overhanging pocket flap
  const flapH = 0.056;
  const flapShape = new THREE.Shape();
  flapShape.moveTo(-hw - 0.004, 0);
  flapShape.lineTo(hw + 0.004, 0);
  flapShape.lineTo(hw + 0.004, -flapH * 0.65);
  flapShape.lineTo(0, -flapH);
  flapShape.lineTo(-hw - 0.004, -flapH * 0.65);
  flapShape.closePath();

  const flapGeo = new THREE.ExtrudeGeometry(flapShape, {
    depth: 0.009,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.002,
    bevelThickness: 0.002
  });
  const flap = new THREE.Mesh(flapGeo, trimMat);
  flap.position.set(0, hh + 0.004, 0.021);
  group.add(flap);

  // Metallic snap closure
  const snap = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.005, 14), hardwareMat);
  snap.rotation.x = Math.PI / 2;
  snap.position.set(0, hh - flapH * 0.62, 0.031);
  group.add(snap);

  group.rotation.y = side * Math.PI * 0.5;
  group.position.set(side * 0.132, 0.19, 0);

  return group;
}

/**
 * Builds a curved, contoured dual-piping track stripe along the outer leg seam.
 */
function createTrackStripeGroup(side, trimMat) {
  const group = new THREE.Group();

  // Follows outer leg profile from upper thigh (y = 0.42) down to ankle cuff (y = -0.44)
  [-0.015, 0.015].forEach((zOffset) => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.139, 0.42, zOffset),
      new THREE.Vector3(side * 0.134, 0.20, zOffset),
      new THREE.Vector3(side * 0.129, 0.0, zOffset),
      new THREE.Vector3(side * 0.125, -0.22, zOffset),
      new THREE.Vector3(side * 0.122, -0.44, zOffset)
    ]);
    const stripeGeo = new THREE.TubeGeometry(curve, 24, 0.0065, 8, false);
    const stripeMesh = new THREE.Mesh(stripeGeo, trimMat);
    group.add(stripeMesh);
  });

  return group;
}

/**
 * Builds curved, padded accordion leather-moto knee ribbing that wraps the front knee.
 */
function createMotoKneeRibbing(trimMat) {
  const group = new THREE.Group();
  group.position.set(0, 0.03, 0.124);

  // Base padded knee patch
  const patchGeo = new THREE.CylinderGeometry(0.131, 0.129, 0.155, 24, 1, true, -0.58, 1.16);
  const patch = new THREE.Mesh(patchGeo, trimMat);
  group.add(patch);

  // Horizontal padded accordion rib bolsters
  [-0.052, -0.026, 0.0, 0.026, 0.052].forEach((yOff) => {
    const rib = new THREE.Mesh(
      new THREE.TorusGeometry(0.130, 0.0065, 10, 24, 1.12),
      trimMat
    );
    rib.rotation.set(Math.PI / 2, 0, Math.PI / 2 - 0.56);
    rib.position.y = yOff;
    rib.castShadow = true;
    group.add(rib);
  });

  return group;
}

export function buildPants(initialHex = 0x111318) {
  const garmentGroup = new THREE.Group();

  const mainMat = new THREE.MeshPhysicalMaterial({
    color: initialHex,
    side: THREE.DoubleSide
  });

  const trimMat = new THREE.MeshPhysicalMaterial({
    color: 0xf1f5f9,
    side: THREE.DoubleSide
  });

  const hardwareMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.85,
    roughness: 0.25
  });

  // 1. Continuous pelvis & hip shell
  const pelvis = new THREE.Mesh(createPantsPelvisGeometry(), mainMat);
  pelvis.castShadow = true;
  pelvis.receiveShadow = true;
  garmentGroup.add(pelvis);

  // 2. Tailored waistband with belt loops, front fly placket & top button
  const waistGroup = new THREE.Group();
  waistGroup.position.y = 0.265;

  const waistBand = new THREE.Mesh(new THREE.CylinderGeometry(0.236, 0.244, 0.088, 48), trimMat);
  waistBand.castShadow = true;
  waistGroup.add(waistBand);

  // Top & bottom waistband stitch piping
  [-0.04, 0.04].forEach((yOff) => {
    const stitch = new THREE.Mesh(new THREE.TorusGeometry(0.240, 0.003, 8, 48), trimMat);
    stitch.rotation.x = Math.PI / 2;
    stitch.position.y = yOff;
    waistGroup.add(stitch);
  });

  // Front waist button
  const waistBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.008, 16), hardwareMat);
  waistBtn.rotation.x = Math.PI / 2;
  waistBtn.position.set(0, 0.005, 0.241);
  waistGroup.add(waistBtn);

  // Belt loops around waistband
  [-2.35, -1.15, -0.38, 0.38, 1.15, 2.35].forEach((angle) => {
    const loop = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.096, 0.012), trimMat);
    loop.position.set(Math.sin(angle) * 0.243, 0, Math.cos(angle) * 0.243);
    loop.rotation.y = angle;
    waistGroup.add(loop);
  });

  garmentGroup.add(waistGroup);

  // Front fly placket below waistband
  const flyPlacket = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.16, 0.014), mainMat);
  flyPlacket.position.set(0.008, 0.145, 0.246);
  flyPlacket.rotation.x = -0.14;
  garmentGroup.add(flyPlacket);

  // 3. Unified Pant Leg Pivots + Style Detail Groups
  const legs = [];
  const cargoPockets = [];
  const trackStripes = [];
  const motoRibs = [];
  const snowGaiters = [];

  const legGeo = createPantLegGeometry({
    topR: 0.140,
    midR: 0.129,
    bottomR: 0.121,
    length: 0.90
  });

  let activeProfile = null;
  let currentVariant = 'cargo';

  [-1, 1].forEach((side) => {
    const legPivot = new THREE.Group();
    legPivot.position.set(side * 0.155, -0.61, 0);
    legPivot.rotation.z = side * -0.04;

    const leg = new THREE.Mesh(legGeo, mainMat);
    leg.castShadow = true;
    leg.receiveShadow = true;
    legPivot.add(leg);

    // Upper thigh blend cap
    const hipCap = new THREE.Mesh(new THREE.SphereGeometry(0.140, 20, 14), mainMat);
    hipCap.position.y = 0.45;
    legPivot.add(hipCap);

    // Turned-up ankle hem & bottom cap
    const ankleHem = new THREE.Mesh(new THREE.CylinderGeometry(0.123, 0.123, 0.055, 24), trimMat);
    ankleHem.position.y = -0.455;
    legPivot.add(ankleHem);

    const hemLip = new THREE.Mesh(new THREE.TorusGeometry(0.123, 0.0035, 8, 24), trimMat);
    hemLip.rotation.x = Math.PI / 2;
    hemLip.position.y = -0.427;
    legPivot.add(hemLip);

    const ankleCap = new THREE.Mesh(new THREE.SphereGeometry(0.122, 18, 12), trimMat);
    ankleCap.position.y = -0.482;
    legPivot.add(ankleCap);

    // Variant 1: Beveled Cargo Thigh Pocket
const pocket = createCargoPocketMesh(side, mainMat, trimMat, hardwareMat);
legPivot.add(pocket);
cargoPockets.push(pocket);
// Variant 2: Contoured Track Pant Side Stripes
const stripe = createTrackStripeGroup(side, trimMat);
legPivot.add(stripe);
trackStripes.push(stripe);
// Variant 3: Curved Leather-Moto Knee Ribbing
const kneeRib = createMotoKneeRibbing(trimMat);
legPivot.add(kneeRib);
motoRibs.push(kneeRib);
// Variant 4: Snow Pant Reinforced Ankle Scuff Guard
const snowCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.127, 0.129, 0.12, 24), trimMat);
snowCuff.position.y = -0.42;
legPivot.add(snowCuff);
snowGaiters.push(snowCuff);
garmentGroup.add(legPivot);
legs.push({ mesh: legPivot, side });
});
function applyLegScaling() {
const baseRadius = activeProfile ? activeProfile.legRadius : 0.102;
const bulk = currentVariant === 'snow' ? 1.18 : 1.0;
const legScale = ((baseRadius + 0.028) / 0.126) * bulk;
legs.forEach(({ mesh, side }) => {
if (activeProfile) {
mesh.position.x = side * activeProfile.legOffset;
}
mesh.scale.set(legScale, 1, legScale);
});
}
function setVariant(variant) {
currentVariant = variant;
cargoPockets.forEach((m) => (m.visible = variant === 'cargo'));
trackStripes.forEach((m) => (m.visible = variant === 'track'));
motoRibs.forEach((m) => (m.visible = variant === 'leather-moto'));
snowGaiters.forEach((m) => (m.visible = variant === 'snow'));
applyLegScaling();
}
function applyStyle(fabricPreset, colorPreset, palette) {
const mainHex = palette && palette.primary !== null ? palette.primary : colorPreset.hex;
const trimHex = palette && palette.secondary !== null ? palette.secondary : 0x1e293b;
[mainMat, trimMat].forEach((mat) => {
Object.assign(mat, fabricPreset.mat);
mat.needsUpdate = true;
});
mainMat.color.setHex(mainHex);
trimMat.color.setHex(trimHex);
if (mainMat.sheenColor) {
mainMat.sheenColor.setHex(mainHex).lerp(new THREE.Color(0xffffff), 0.35);
}
if (trimMat.sheenColor) {
trimMat.sheenColor.setHex(trimHex).lerp(new THREE.Color(0xffffff), 0.3);
}
}
function syncBody(profile) {
activeProfile = profile;
const [hipX, , hipZ] = profile.hipScale;
waistGroup.scale.set(hipX, 1, hipZ);
pelvis.scale.set(hipX, 1, hipZ);
flyPlacket.position.z = 0.246 * hipZ + 0.004;
applyLegScaling();
}
setVariant(currentVariant);
return { garmentGroup, applyStyle, syncBody, setVariant };
}