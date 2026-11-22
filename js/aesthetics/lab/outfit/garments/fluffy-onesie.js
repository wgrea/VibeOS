// js/aesthetics/lab/outfit/garments/fluffy-onesie.js
import * as THREE from 'three';
import { buildClosure } from '../closures.js';

/**
 * Builds a roomy, relaxed kigurumi/onesie torso with soft plush loft,
 * drop-crotch ease, and gentle fabric drape ripples.
 */
function createOnesieTorsoGeometry() {
  // Generous plush silhouette from drop-pelvis (-0.37) up to plush collar rim (0.91)
  const profilePoints = [
    [0.01, -0.375],
    [0.21, -0.355],
    [0.315, -0.295],
    [0.352, -0.205],
    [0.362, -0.115], // Relaxed hip volume
    [0.348, -0.015],
    [0.324, 0.085],
    [0.312, 0.165],  // Softly bloused waist
    [0.322, 0.265],
    [0.338, 0.375],
    [0.352, 0.495],
    [0.358, 0.615],  // Roomy plush chest
    [0.354, 0.745],
    [0.336, 0.835],  // Rounded plush shoulder slope (clears mannequin y = 0.85)
    [0.265, 0.878],
    [0.185, 0.895],  // Collar base
    [0.155, 0.918],  // Plush rolled collar outer
    [0.128, 0.918],  // Collar inner lip
    [0.128, 0.865]   // Inner collar lining
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

    // Organic plush loft & soft horizontal drape folds around waist/hips
    if (y > -0.22 && y < 0.78) {
      const puff = Math.sin(angle * 7.0 + y * 14.0) * 0.0025;
      const waistMask = Math.exp(-Math.pow((y - 0.14) / 0.28, 2));
      const drapeFold = (Math.sin(y * 36.0 + Math.cos(angle * 2.0) * 1.1) + 1.0) * 0.0038 * waistMask;
      const offset = puff + drapeFold;
      x += Math.cos(angle) * offset;
      z += Math.sin(angle) * offset;
    }

    pos.setXYZ(i, x, y, z);

    // Clean cylindrical UVs so Sherpa/Fleece bump & roughness maps tile evenly
    const u = (angle + Math.PI) / (Math.PI * 2);
    const v = (y + 0.38) / 1.30;
    uv.setXY(i, u, v);
  }

  geo.userData.basePositions = new Float32Array(pos.array);
  uv.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds a plush, softly bloused sleeve or pant leg that gathers slightly above a ribbed cuff.
 */
function createPlushLimbGeometry({ topR, midR, cuffGatherR, cuffR, length, radialSegs = 28, heightSegs = 32 }) {
  const geo = new THREE.CylinderGeometry(topR, cuffR, length, radialSegs, heightSegs, false);
  const pos = geo.attributes.position;
  const halfLen = length * 0.5;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    const t = (y + halfLen) / length; // 0 = cuff bottom, 1 = shoulder/hip top
    const angle = Math.atan2(z, x);

    let targetR;
    if (t < 0.09) {
      // Ribbed knit cuff band at wrist/ankle
      targetR = cuffR;
    } else if (t < 0.22) {
      // Soft fabric puff/blouse just above the ribbed cuff
      const u = (t - 0.09) / 0.13;
      targetR = THREE.MathUtils.lerp(cuffR, cuffGatherR, Math.sin(u * Math.PI * 0.5));
    } else if (t < 0.55) {
      const u = (t - 0.22) / 0.33;
      targetR = THREE.MathUtils.lerp(cuffGatherR, midR, u);
    } else {
      const u = (t - 0.55) / 0.45;
      targetR = THREE.MathUtils.lerp(midR, topR, Math.pow(u, 0.85));
    }

    // Soft gathering pleats just above the cuff (t between 0.09 and 0.26)
    if (t >= 0.09 && t <= 0.28) {
      const gatherMask = Math.sin(((t - 0.09) / 0.19) * Math.PI);
      targetR += (Math.cos(angle * 8.0) + 1.0) * 0.0032 * gatherMask;
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
 * Morphs torso vertices between hipScale and chestScale while keeping collar round.
 */
function morphOnesieTorso(geo, chestScale, hipScale) {
  const pos = geo.attributes.position;
  const base = geo.userData.basePositions;

  const [hipX, , hipZ] = hipScale;
  const [chestX, , chestZ] = chestScale;

  for (let i = 0; i < pos.count; i++) {
    const bx = base[i * 3];
    const by = base[i * 3 + 1];
    const bz = base[i * 3 + 2];

    let sx, sz;
    if (by <= 0.14) {
      sx = hipX;
      sz = hipZ;
    } else if (by <= 0.85) {
      const t = THREE.MathUtils.smoothstep(by, 0.14, 0.56);
      sx = THREE.MathUtils.lerp(hipX, chestX, t);
      sz = THREE.MathUtils.lerp(hipZ, chestZ, t);
    } else {
      const t = THREE.MathUtils.smoothstep(by, 0.85, 0.91);
      sx = THREE.MathUtils.lerp(chestX, 1.04, t);
      sz = THREE.MathUtils.lerp(chestZ, 1.04, t);
    }

    pos.setXYZ(i, bx * sx, by, bz * sz);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

export function buildFluffyOnesie(initialHex = 0x0284c7) {
  const garmentGroup = new THREE.Group();

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: initialHex,
    side: THREE.DoubleSide
  });

  const bellyMat = new THREE.MeshPhysicalMaterial({
    color: 0xf1f5f9,
    side: THREE.DoubleSide
  });

  // Slightly firmer ribbed knit material for cuffs & collar trim
  const cuffMat = new THREE.MeshPhysicalMaterial({
    color: initialHex,
    roughness: 0.92,
    metalness: 0.0
  });

  // 1. Continuous plush torso
  const torsoGeo = createOnesieTorsoGeometry();
  const torso = new THREE.Mesh(torsoGeo, bodyMat);
  torso.castShadow = true;
  torso.receiveShadow = true;
  garmentGroup.add(torso);

  // 2. Plush collar roll & draped back hood with lined ears
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.148, 0.026, 14, 32), cuffMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 0.895, 0.01);
  garmentGroup.add(collar);

  const hoodGroup = new THREE.Group();
  hoodGroup.position.set(0, 0.84, -0.145);

  // Outer draped hood cowl
  const hoodOuter = new THREE.Mesh(new THREE.SphereGeometry(0.205, 24, 18), bodyMat);
  hoodOuter.scale.set(1.18, 0.72, 0.88);
  hoodOuter.rotation.x = 0.25;
  hoodOuter.castShadow = true;
  hoodGroup.add(hoodOuter);

  // Hood folded rim lip
  const hoodRim = new THREE.Mesh(new THREE.TorusGeometry(0.175, 0.024, 12, 28, Math.PI * 1.15), bodyMat);
  hoodRim.rotation.set(Math.PI * 0.42, 0, -Math.PI * 0.075);
  hoodRim.position.set(0, 0.045, 0.02);
  hoodGroup.add(hoodRim);

  // Rounded plush ears with inner secondary-color lining
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
    zOffset: 0.285
  });
  garmentGroup.add(closureGroup);

  // 5. Roomy plush sleeves & pant legs with ribbed cuffs
  const arms = [];
  const legs = [];

  const armGeo = createPlushLimbGeometry({
    topR: 0.132,
    midR: 0.124,
    cuffGatherR: 0.130,
    cuffR: 0.092,
    length: 0.74
  });

  const legGeo = createPlushLimbGeometry({
    topR: 0.165,
    midR: 0.152,
    cuffGatherR: 0.158,
    cuffR: 0.116,
    length: 0.92
  });

  [-1, 1].forEach((side) => {
    const shoulderCover = new THREE.Mesh(new THREE.SphereGeometry(0.134, 20, 16), bodyMat);
    shoulderCover.position.set(side * 0.35, 0.75, 0);
    garmentGroup.add(shoulderCover);

    const armPivot = new THREE.Group();
    armPivot.position.set(side * 0.45, 0.38, 0);
    armPivot.rotation.z = side * -0.18;

    const arm = new THREE.Mesh(armGeo, bodyMat);
    arm.castShadow = true;
    arm.receiveShadow = true;
    armPivot.add(arm);

    const upperArmCap = new THREE.Mesh(new THREE.SphereGeometry(0.132, 20, 14), bodyMat);
    upperArmCap.position.y = 0.37;
    armPivot.add(upperArmCap);

    // Ribbed cuff band at wrist
    const wristCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.093, 0.090, 0.068, 24), cuffMat);
    wristCuff.position.y = -0.336;
    armPivot.add(wristCuff);

    const wristCap = new THREE.Mesh(new THREE.SphereGeometry(0.090, 18, 12), cuffMat);
    wristCap.position.y = -0.37;
    armPivot.add(wristCap);

    garmentGroup.add(armPivot);
    arms.push({ mesh: armPivot, shoulderCover, side });

    const legPivot = new THREE.Group();
    legPivot.position.set(side * 0.16, -0.62, 0);
    legPivot.rotation.z = side * -0.04;

    const leg = new THREE.Mesh(legGeo, bodyMat);
    leg.castShadow = true;
    leg.receiveShadow = true;
    legPivot.add(leg);

    const hipCap = new THREE.Mesh(new THREE.SphereGeometry(0.165, 20, 14), bodyMat);
    hipCap.position.y = 0.46;
    legPivot.add(hipCap);

    // Ribbed cuff band at ankle
    const ankleCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.117, 0.113, 0.082, 24), cuffMat);
    ankleCuff.position.y = -0.419;
    legPivot.add(ankleCuff);
const ankleCap = new THREE.Mesh(new THREE.SphereGeometry(0.113, 18, 12), cuffMat);
ankleCap.position.y = -0.46;
legPivot.add(ankleCap);
garmentGroup.add(legPivot);
legs.push({ mesh: legPivot, side });
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
if (bodyMat.sheenColor) {
bodyMat.sheenColor.setHex(mainHex).lerp(new THREE.Color(0xffffff), 0.35);
}
if (bellyMat.sheenColor) {
bellyMat.sheenColor.setHex(patchHex).lerp(new THREE.Color(0xffffff), 0.35);
}
// Ribbed knit cuffs & trim match primary color slightly deeper for tactile contrast
cuffMat.color.setHex(mainHex).multiplyScalar(0.84);
cuffMat.sheen = 0.65;
cuffMat.sheenRoughness = 0.85;
cuffMat.sheenColor = new THREE.Color(mainHex).lerp(new THREE.Color(0xffffff), 0.3);
cuffMat.needsUpdate = true;
}
function syncBody(profile) {
const [chestX, , chestZ] = profile.chestScale;
// 1. Morph plush torso smoothly between Boy and Girl proportions
morphOnesieTorso(torsoGeo, profile.chestScale, profile.hipScale);
// 2. Scale limbs & shoulder covers cleanly with zero mannequin clipping
const armScale = (profile.armRadius + 0.048) / 0.12;
const legScale = (profile.legRadius + 0.052) / 0.15;
arms.forEach(({ mesh, shoulderCover, side }) => {
mesh.position.x = side * (profile.armOffset + 0.01);
mesh.scale.set(armScale, 1, armScale);
shoulderCover.position.set(side * (profile.armOffset - 0.10), 0.75, 0);
shoulderCover.scale.set(armScale, armScale, armScale);
});
legs.forEach(({ mesh, side }) => {
mesh.position.x = side * (profile.legOffset + 0.005);
mesh.scale.set(legScale, 1, legScale);
});
// 3. Keep belly patch, hood & front closure flush against torso depth
const zFront = 0.352 * chestZ + 0.006;
bellyGroup.position.z = zFront - 0.042;
bellyGroup.scale.set(Math.min(1.08, chestX * 0.92), 1, 1);
hoodGroup.position.z = -0.336 * chestZ + 0.065;
setDepth(zFront + 0.016);
}
return { garmentGroup, applyStyle, syncBody, setClosureType };
}
