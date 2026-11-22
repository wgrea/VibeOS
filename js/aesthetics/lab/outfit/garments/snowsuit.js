// js/aesthetics/lab/outfit/garments/snowsuit.js
import * as THREE from 'three';
import { buildClosure } from '../closures.js';

/**
 * Builds a continuous insulated alpine snowsuit torso + pelvis shell,
 * partitioned into 2 material groups for crisp color-blocked chest yoke styling:
 *   Group 0: Main torso, waist & insulated pelvis (zoneMats[0])
 *   Group 1: Contrast alpine upper chest & shoulder yoke (zoneMats[1])
 */
function createSnowsuitTorsoGeometry() {
  const profilePoints = [
    [0.01, -0.375],  // 0
    [0.215, -0.355], // 1
    [0.315, -0.285], // 2
    [0.345, -0.195], // 3
    [0.356, -0.11],  // 4 Hips
    [0.336, -0.015], // 5
    [0.305, 0.085],  // 6
    [0.285, 0.185],  // 7 Lower waist
    [0.280, 0.285],  // 8 Waist belt channel
    [0.296, 0.385],  // 9 Lower ribcage
    [0.324, 0.495],  // 10 Mid torso
    [0.348, 0.615],  // 11 Chest -> Group 0 ends at ring 11
    [0.358, 0.725],  // 12 Upper chest yoke
    [0.360, 0.845],  // 13 Clears mannequin chest top corner (y = 0.85)
    [0.320, 0.882],  // 14 Insulated shoulder slope
    [0.220, 0.905],  // 15 Collar seam base
    [0.168, 0.918]   // 16 Neckline throat -> Group 1 ends at ring 16
  ];

  const lathePoints = profilePoints.map(([r, y]) => new THREE.Vector2(r, y));
  const radialSegs = 56;
  const geo = new THREE.LatheGeometry(lathePoints, radialSegs);
  geo.rotateY(Math.PI / 2);

  geo.clearGroups();
  const ringsCount = profilePoints.length - 1;
  const indicesPerRing = radialSegs * 6;

  // Group 0: Rings 0..10 (pelvis -> y = 0.615) -> zoneMats[0]
  geo.addGroup(0, 11 * indicesPerRing, 0);
  // Group 1: Rings 11..15 (y = 0.615 -> 0.918 alpine chest yoke) -> zoneMats[1]
  geo.addGroup(11 * indicesPerRing, (ringsCount - 11) * indicesPerRing, 1);

  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);
    const angle = Math.atan2(z, x);

    // Subtle down-loft puffiness between quilted baffle channels
    if (y > -0.05 && y < 0.72) {
      const quiltWave = Math.abs(Math.sin(((y - 0.02) / 0.145) * Math.PI)) * 0.0045;
      x += Math.cos(angle) * quiltWave;
      z += Math.sin(angle) * quiltWave;
    }

    pos.setXYZ(i, x, y, z);

    const u = (angle + Math.PI) / (Math.PI * 2);
    const v = (y + 0.38) / 1.30;
    uv.setXY(i, u, v);
  }

  geo.userData.basePositions = new Float32Array(pos.array);
  uv.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

function createContouredBaffleGeometry(radius, yPos, tubeRadius = 0.025) {
  const geo = new THREE.TorusGeometry(radius, tubeRadius, 14, 56);
  geo.rotateX(Math.PI / 2);
  geo.translate(0, yPos, 0);
  geo.userData.basePositions = new Float32Array(geo.attributes.position.array);
  return geo;
}

function createInsulatedLimbGeometry({ topR, midR, bottomR, length, radialSegs = 28, heightSegs = 32 }) {
  const geo = new THREE.CylinderGeometry(topR, bottomR, length, radialSegs, heightSegs, false);
  const pos = geo.attributes.position;
  const halfLen = length * 0.5;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    const t = (y + halfLen) / length;

    let targetR;
    if (t > 0.5) {
      const u = (t - 0.5) * 2;
      targetR = THREE.MathUtils.lerp(midR, topR, Math.pow(u, 0.85));
    } else {
      const u = t * 2;
      targetR = THREE.MathUtils.lerp(bottomR, midR, Math.pow(u, 0.82));
    }

    const loft = Math.sin(t * Math.PI * 4.0) * 0.0025;
    targetR += Math.max(0, loft);

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

function morphSnowsuitVertices(geo, chestScale, hipScale) {
  const pos = geo.attributes.position;
  const base = geo.userData.basePositions;

  const [hipX, , hipZ] = hipScale;
  const [chestX, , chestZ] = chestScale;

  for (let i = 0; i < pos.count; i++) {
    const bx = base[i * 3];
    const by = base[i * 3 + 1];
    const bz = base[i * 3 + 2];

    let sx, sz;
    if (by <= 0.28) {
      sx = hipX;
      sz = hipZ;
    } else if (by <= 0.87) {
      const t = THREE.MathUtils.smoothstep(by, 0.28, 0.58);
      sx = THREE.MathUtils.lerp(hipX, chestX, t);
      sz = THREE.MathUtils.lerp(hipZ, chestZ, t);
    } else {
      const t = THREE.MathUtils.smoothstep(by, 0.87, 0.918);
      sx = THREE.MathUtils.lerp(chestX, 1.04, t);
      sz = THREE.MathUtils.lerp(chestZ, 1.04, t);
    }

    pos.setXYZ(i, bx * sx, by, bz * sz);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

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

  // 1. Tall Insulated Fleece/Nylon Storm Collar + Draped Insulated Hood
  const collarGroup = new THREE.Group();
  collarGroup.position.y = 0.92;

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.178, 0.155, 40), zoneMats[2]);
  collar.castShadow = true;
  collarGroup.add(collar);

  const collarBrim = new THREE.Mesh(new THREE.TorusGeometry(0.155, 0.014, 12, 40), zoneMats[3]);
  collarBrim.rotation.x = Math.PI / 2;
  collarBrim.position.y = 0.076;
  collarGroup.add(collarBrim);

  garmentGroup.add(collarGroup);

  const hoodGroup = new THREE.Group();
  hoodGroup.position.set(0, 0.85, -0.145);

  const hood = new THREE.Mesh(new THREE.SphereGeometry(0.205, 24, 18), zoneMats[4]);
  hood.scale.set(1.08, 0.72, 0.94);
  hood.rotation.x = 0.22;
  hood.castShadow = true;
  hoodGroup.add(hood);

  const hoodRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.178, 0.022, 12, 28, Math.PI * 1.15),
    zoneMats[3]
  );
  hoodRim.rotation.set(Math.PI * 0.42, 0, -Math.PI * 0.075);
  hoodRim.position.set(0, 0.045, 0.02);
  hoodGroup.add(hoodRim);

  garmentGroup.add(hoodGroup);

  // 2. Continuous Insulated Torso + Contrast Alpine Chest Yoke (zoneMats[0], zoneMats[1])
  const torsoGeo = createSnowsuitTorsoGeometry();
  const torso = new THREE.Mesh(torsoGeo, [zoneMats[0], zoneMats[1]]);
  torso.castShadow = true;
  torso.receiveShadow = true;
  garmentGroup.add(torso);

  // 3. Contoured Quilted Torso & Hip Baffle Channels
  const baffleSpecs = [
    { y: 0.62, r: 0.344, matIdx: 0 },
    { y: 0.49, r: 0.320, matIdx: 2 },
    { y: 0.36, r: 0.290, matIdx: 0 },
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

  // 4. Snowsuit Webbing Waist Belt + Quick-Release Ski Clip Buckle
  const waistBeltGroup = new THREE.Group();
  waistBeltGroup.position.y = 0.288;

  const waistBelt = new THREE.Mesh(new THREE.CylinderGeometry(0.282, 0.285, 0.066, 48), zoneMats[2]);
  waistBelt.castShadow = true;
  waistBeltGroup.add(waistBelt);

  [-0.031, 0.031].forEach((yOff) => {
    const beltEdge = new THREE.Mesh(new THREE.TorusGeometry(0.284, 0.0032, 8, 48), zoneMats[3]);
    beltEdge.rotation.x = Math.PI / 2;
    beltEdge.position.y = yOff;
    waistBeltGroup.add(beltEdge);
  });

  const buckleGroup = new THREE.Group();
  buckleGroup.position.set(0, 0, 0.286);

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

  // 5. Windproof Storm Flap + Front Closure
  const stormFlap = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.74, 0.018), zoneMats[3]);
  stormFlap.position.set(0, 0.52, 0.26);
  stormFlap.rotation.x = -0.055;
  garmentGroup.add(stormFlap);

  const { closureGroup, setClosureType, setDepth } = buildClosure({
    type: 'zipper',
    yTop: 0.88,
    yBottom: 0.15,
    zOffset: 0.272
  });
  garmentGroup.add(closureGroup);

  // 6. Unified Insulated Sleeves & Legs
  const arms = [];
  const legs = [];

  const sleeveGeo = createInsulatedLimbGeometry({
    topR: 0.128,
    midR: 0.120,
    bottomR: 0.108,
    length: 0.72
  });

  const legGeo = createInsulatedLimbGeometry({
    topR: 0.158,
    midR: 0.148,
    bottomR: 0.142,
    length: 0.90
  });

  [-1, 1].forEach((side) => {
    // Dedicated insulated shoulder joint cover (clears mannequin shoulder at y = 0.735..0.78)
    const shoulderCover = new THREE.Mesh(new THREE.SphereGeometry(0.126, 20, 16), zoneMats[5]);
    shoulderCover.position.set(side * 0.34, 0.75, 0);
    garmentGroup.add(shoulderCover);

    const armPivot = new THREE.Group();
    armPivot.position.set(side * 0.45, 0.39, 0);
    armPivot.rotation.z = side * -0.18;

    const arm = new THREE.Mesh(sleeveGeo, zoneMats[5]);
    arm.castShadow = true;
    arm.receiveShadow = true;
    armPivot.add(arm);

    const upperArmCap = new THREE.Mesh(new THREE.SphereGeometry(0.128, 20, 14), zoneMats[5]);
    upperArmCap.position.y = 0.36;
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
legPivot.position.set(side * 0.16, -0.61, 0);
legPivot.rotation.z = side * -0.04;
const leg = new THREE.Mesh(legGeo, zoneMats[0]);
leg.castShadow = true;
leg.receiveShadow = true;
legPivot.add(leg);
const hipCap = new THREE.Mesh(new THREE.SphereGeometry(0.158, 20, 14), zoneMats[0]);
hipCap.position.y = 0.45;
legPivot.add(hipCap);
const thighBaffle = new THREE.Mesh(new THREE.TorusGeometry(0.151, 0.023, 12, 28), zoneMats[7]);
thighBaffle.rotation.x = Math.PI / 2;
thighBaffle.position.y = 0.24;
legPivot.add(thighBaffle);
const kneePatch = new THREE.Mesh(
new THREE.CylinderGeometry(0.151, 0.149, 0.18, 24, 1, false, -0.62, 1.24),
zoneMats[6]
);
kneePatch.position.y = 0.01;
kneePatch.castShadow = true;
legPivot.add(kneePatch);
const ankleGaiter = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.160, 0.155, 28), zoneMats[2]);
ankleGaiter.position.y = -0.425;
legPivot.add(ankleGaiter);
const gaiterLip = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.005, 8, 28), zoneMats[3]);
gaiterLip.rotation.x = Math.PI / 2;
gaiterLip.position.y = -0.348;
legPivot.add(gaiterLip);
const gaiterCap = new THREE.Mesh(new THREE.SphereGeometry(0.158, 18, 12), zoneMats[2]);
gaiterCap.position.y = -0.495;
gaiterCap.scale.set(1.0, 0.55, 1.0);
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
const [, , chestZ] = profile.chestScale;
const [hipX, , hipZ] = profile.hipScale;
morphSnowsuitVertices(torsoGeo, profile.chestScale, profile.hipScale);
baffles.forEach((b) => morphSnowsuitVertices(b.geometry, profile.chestScale, profile.hipScale));
waistBeltGroup.scale.set(hipX, 1, hipZ);
const armScale = (profile.armRadius + 0.05) / 0.122;
const legScale = (profile.legRadius + 0.054) / 0.152;
arms.forEach(({ mesh, shoulderCover, side }) => {
mesh.position.x = side * (profile.armOffset + 0.01);
mesh.scale.set(armScale, 1, armScale);
shoulderCover.position.set(side * (profile.armOffset - 0.105), 0.75, 0);
shoulderCover.scale.set(armScale * 1.05, armScale * 1.05, armScale * 1.05);
});
legs.forEach(({ mesh, side }) => {
mesh.position.x = side * (profile.legOffset + 0.005);
mesh.scale.set(legScale, 1, legScale);
});
const zFront = 0.350 * chestZ + 0.014;
hoodGroup.position.z = -0.358 * chestZ + 0.075;
stormFlap.position.z = zFront - 0.008;
setDepth(zFront + 0.006);
}
return { garmentGroup, applyStyle, syncBody, setClosureType };
}
