// js/aesthetics/lab/outfit/garments/racing-suit.js
import * as THREE from 'three';
import { buildClosure } from '../closures.js';

/**
 * Builds a continuous sculpted FIA/NASCAR racing suit torso + pelvis geometry,
 * partitioned into 3 material groups so multi-color blocking stays razor-sharp
 * on a seamless mesh:
 *   Group 0: Lower torso, hips & pelvis (zoneMats[0])
 *   Group 1: Chest racing stripe band (zoneMats[3])
 *   Group 2: Upper chest & shoulder yoke (zoneMats[1])
 */
function createRacingTorsoGeometry() {
  // Ordered bottom-to-top profile points [radius, y]
  const profilePoints = [
    [0.01, -0.355],  // 0
    [0.195, -0.335], // 1
    [0.285, -0.27],  // 2
    [0.312, -0.19],  // 3
    [0.322, -0.11],  // 4 Hips
    [0.302, -0.02],  // 5
    [0.268, 0.08],   // 6
    [0.252, 0.18],   // 7 Lower waist
    [0.250, 0.285],  // 8 Waist belt seat
    [0.264, 0.38],   // 9 Lower ribcage
    [0.284, 0.48],   // 10 Mid torso -> Group 0 ends at ring 10
    [0.296, 0.545],  // 11 Chest stripe bottom
    [0.310, 0.625],  // 12 Chest stripe top -> Group 1 ends at ring 12
    [0.326, 0.725],  // 13 Upper chest
    [0.332, 0.835],  // 14 Clears mannequin chest top corner (y = 0.85)
    [0.292, 0.875],  // 15 Shoulder slope
    [0.198, 0.895],  // 16 Collar base
    [0.148, 0.905]   // 17 Neckline -> Group 2 ends at ring 17
  ];

  const lathePoints = profilePoints.map(([r, y]) => new THREE.Vector2(r, y));
  const radialSegs = 56;
  const geo = new THREE.LatheGeometry(lathePoints, radialSegs);
  geo.rotateY(Math.PI / 2);

  // Assign material groups by vertical ring index for crisp color-blocked panels
  geo.clearGroups();
  const ringsCount = profilePoints.length - 1; // 17 vertical quads per column
  const indicesPerRing = radialSegs * 6;

  // Group 0: Rings 0..9 (pelvis -> y = 0.48) -> zoneMats[0]
  geo.addGroup(0, 10 * indicesPerRing, 0);
  // Group 1: Rings 10..11 (y = 0.48 -> 0.625 chest band) -> zoneMats[3]
  geo.addGroup(10 * indicesPerRing, 2 * indicesPerRing, 1);
  // Group 2: Rings 12..16 (y = 0.625 -> 0.905 upper chest yoke) -> zoneMats[1]
  geo.addGroup(12 * indicesPerRing, (ringsCount - 12) * indicesPerRing, 2);

  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);
    const angle = Math.atan2(z, x);

    // Subtle lumbar/waist gusset tension creases
    if (y > 0.08 && y < 0.52) {
      const waistMask = Math.exp(-Math.pow((y - 0.29) / 0.16, 2));
      const fold = (Math.sin(y * 52.0 + Math.cos(angle * 2.0) * 1.2) + 1.0) * 0.002 * waistMask;
      x += Math.cos(angle) * fold;
      z += Math.sin(angle) * fold;
    }

    pos.setXYZ(i, x, y, z);

    const u = (angle + Math.PI) / (Math.PI * 2);
    const v = (y + 0.36) / 1.27;
    uv.setXY(i, u, v);
  }

  geo.userData.basePositions = new Float32Array(pos.array);
  uv.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds a tailored racing sleeve or leg with muscle contour & joint articulation.
 */
function createRacingLimbGeometry({ topR, midR, bottomR, length, jointY = 0, radialSegs = 28, heightSegs = 32 }) {
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

    // Subtle fabric bunching around elbow/knee flex zones
    const distJoint = Math.abs(y - jointY);
    if (distJoint < 0.12) {
      const mask = 1.0 - distJoint / 0.12;
      targetR += (Math.sin(y * 78.0) + 1.0) * 0.002 * mask;
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
 * Morphs racing suit torso vertices cleanly between hipScale and chestScale.
 */
function morphRacingTorso(geo, chestScale, hipScale) {
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
    } else if (by <= 0.86) {
      const t = THREE.MathUtils.smoothstep(by, 0.28, 0.58);
      sx = THREE.MathUtils.lerp(hipX, chestX, t);
      sz = THREE.MathUtils.lerp(hipZ, chestZ, t);
    } else {
      const t = THREE.MathUtils.smoothstep(by, 0.86, 0.905);
      sx = THREE.MathUtils.lerp(chestX, 1.03, t);
      sz = THREE.MathUtils.lerp(chestZ, 1.03, t);
    }

    pos.setXYZ(i, bx * sx, by, bz * sz);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

export function buildRacingSuit(initialHex = 0xb91c1c) {
  const garmentGroup = new THREE.Group();

  // Up to 8 independent color-block materials (cycles cleanly for any number of colors)
  const zoneMats = Array.from(
    { length: 8 },
    () => new THREE.MeshPhysicalMaterial({ color: initialHex, side: THREE.DoubleSide })
  );

  const hardwareMat = new THREE.MeshStandardMaterial({
    color: 0xd1d5db,
    roughness: 0.24,
    metalness: 0.88
  });

  // 1. High Stand-Up FIA/NASCAR Collar + Contoured Velcro Chin Strap
  const collarGroup = new THREE.Group();
  collarGroup.position.y = 0.90;

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.134, 0.152, 0.125, 40), zoneMats[2]);
  collar.castShadow = true;
  collarGroup.add(collar);

  // Rolled Nomex collar top binding
  const collarLip = new THREE.Mesh(new THREE.TorusGeometry(0.134, 0.008, 10, 40), zoneMats[2]);
  collarLip.rotation.x = Math.PI / 2;
  collarLip.position.y = 0.062;
  collarGroup.add(collarLip);

  // Curved Velcro chin closure tab
  const collarStrap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.148, 0.152, 0.046, 20, 1, false, -0.35, 0.95),
    zoneMats[3]
  );
  collarStrap.position.set(0, 0.005, 0.004);
  collarGroup.add(collarStrap);

  const strapRivet = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.006, 12), hardwareMat);
  strapRivet.rotation.x = Math.PI / 2;
  strapRivet.position.set(0.095, 0.005, 0.118);
  collarGroup.add(strapRivet);

  garmentGroup.add(collarGroup);

  // 2. Continuous Multi-Zone Sculpted Torso & Pelvis (zoneMats[0], zoneMats[3], zoneMats[1])
  const torsoGeo = createRacingTorsoGeometry();
  const torso = new THREE.Mesh(torsoGeo, [zoneMats[0], zoneMats[3], zoneMats[1]]);
  torso.castShadow = true;
  torso.receiveShadow = true;
  garmentGroup.add(torso);

  // 3. Contoured Racing Waist Belt + Dual-Loop Metal D-Ring Buckle
  const beltGroup = new THREE.Group();
  beltGroup.position.y = 0.288;

  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.253, 0.256, 0.068, 48), zoneMats[2]);
  belt.castShadow = true;
  beltGroup.add(belt);

  // Top & bottom contrast belt piping
  [-0.032, 0.032].forEach((yOff) => {
    const beltPiping = new THREE.Mesh(new THREE.TorusGeometry(0.255, 0.0032, 8, 48), zoneMats[3]);
    beltPiping.rotation.x = Math.PI / 2;
    beltPiping.position.y = yOff;
    beltGroup.add(beltPiping);
  });

  // Metallic FIA racing belt buckle frame + center prong bar
  const buckleGroup = new THREE.Group();
  buckleGroup.position.set(0, 0, 0.258);

  const buckleFrame = new THREE.Mesh(new THREE.BoxGeometry(0.086, 0.058, 0.014), hardwareMat);
  buckleGroup.add(buckleFrame);

  const buckleCenter = new THREE.Mesh(new THREE.BoxGeometry(0.058, 0.036, 0.016), zoneMats[2]);
  buckleGroup.add(buckleCenter);

  const buckleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.054, 10), hardwareMat);
  buckleBar.position.z = 0.008;
  buckleGroup.add(buckleBar);

  beltGroup.add(buckleGroup);
  garmentGroup.add(beltGroup);

  // 4. Front Closure (Storm flap zipper)
  const { closureGroup, setClosureType, setDepth } = buildClosure({
    type: 'zipper',
    yTop: 0.87,
    yBottom: 0.16,
    zOffset: 0.245
  });
  garmentGroup.add(closureGroup);

  // 5. Sleeves, Extraction Epaulettes, Quilted Knee Pads & Contoured Leg Stripes
  const arms = [];
  const legs = [];

  const sleeveGeo = createRacingLimbGeometry({
    topR: 0.112,
    midR: 0.103,
    bottomR: 0.094,
    length: 0.72,
    jointY: 0.01
  });

  const legGeo = createRacingLimbGeometry({
    topR: 0.142,
    midR: 0.132,
    bottomR: 0.122,
    length: 0.90,
    jointY: 0.03
  });

  [-1, 1].forEach((side) => {
    // Shoulder Gusset & FIA Extraction Grab-Handle Epaulette
    const shoulderPad = new THREE.Mesh(new THREE.SphereGeometry(0.114, 20, 16), zoneMats[1]);
    shoulderPad.scale.set(1.15, 0.74, 1.05);
    shoulderPad.position.set(side * 0.35, 0.79, 0);
    garmentGroup.add(shoulderPad);

    const epauletteGroup = new THREE.Group();
    epauletteGroup.position.set(side * 0.25, 0.882, 0);
    epauletteGroup.rotation.z = side * -0.16;

    // Padded extraction strap base
    const strapBase = new THREE.Mesh(new THREE.BoxGeometry(0.135, 0.016, 0.058), zoneMats[4]);
    strapBase.castShadow = true;
    epauletteGroup.add(strapBase);

    // Raised arched grab-handle loop
    const grabLoop = new THREE.Mesh(
      new THREE.TorusGeometry(0.042, 0.0075, 10, 20, Math.PI),
      zoneMats[3]
    );
    grabLoop.scale.set(1.3, 0.45, 1.0);
    grabLoop.position.y = 0.006;
    epauletteGroup.add(grabLoop);

    // End anchor rivets
    [-0.056, 0.056].forEach((rx) => {
      const rivet = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.006, 12), hardwareMat);
rivet.position.set(rx, 0.009, 0);
epauletteGroup.add(rivet);
});
garmentGroup.add(epauletteGroup);
// Unified Sleeve Pivot (Sleeve + Bicep Color Band + Ribbed Nomex Cuff)
const armPivot = new THREE.Group();
armPivot.position.set(side * 0.44, 0.39, 0);
armPivot.rotation.z = side * -0.18;
const arm = new THREE.Mesh(sleeveGeo, zoneMats[5]);
arm.castShadow = true;
arm.receiveShadow = true;
armPivot.add(arm);
const upperArmCap = new THREE.Mesh(new THREE.SphereGeometry(0.112, 20, 14), zoneMats[5]);
upperArmCap.position.y = 0.36;
armPivot.add(upperArmCap);
// Bicep racing stripe band
const sleeveBand = new THREE.Mesh(
new THREE.CylinderGeometry(0.109, 0.107, 0.088, 28, 1, true),
zoneMats[3]
);
sleeveBand.position.y = 0.16;
armPivot.add(sleeveBand);
// Ribbed Nomex knit wrist cuff
const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.092, 0.078, 24), zoneMats[2]);
cuff.position.y = -0.365;
armPivot.add(cuff);
const cuffCap = new THREE.Mesh(new THREE.SphereGeometry(0.092, 18, 12), zoneMats[2]);
cuffCap.position.y = -0.402;
armPivot.add(cuffCap);
garmentGroup.add(armPivot);
arms.push({ mesh: armPivot, shoulderPad, epaulette: epauletteGroup, side });
// Unified Leg Pivot (Leg + Curved Quilted Knee Pad + Contoured Racing Stripe + Boot Cuff)
const legPivot = new THREE.Group();
legPivot.position.set(side * 0.155, -0.61, 0);
legPivot.rotation.z = side * -0.04;
const leg = new THREE.Mesh(legGeo, zoneMats[0]);
leg.castShadow = true;
leg.receiveShadow = true;
legPivot.add(leg);
const hipCap = new THREE.Mesh(new THREE.SphereGeometry(0.142, 20, 14), zoneMats[0]);
hipCap.position.y = 0.45;
legPivot.add(hipCap);
// Curved anatomical quilted knee pad (wraps cleanly around front of knee)
const kneeGroup = new THREE.Group();
kneeGroup.position.set(0, 0.03, 0);
const kneeBase = new THREE.Mesh(
new THREE.CylinderGeometry(0.135, 0.133, 0.165, 24, 1, false, -0.58, 1.16),
zoneMats[6]
);
kneeBase.castShadow = true;
kneeGroup.add(kneeBase);
// Quilted horizontal knee pad bolsters
[-0.048, -0.016, 0.016, 0.048].forEach((ky) => {
const bolster = new THREE.Mesh(
new THREE.TorusGeometry(0.134, 0.0055, 8, 24, 1.12),
zoneMats[3]
);
bolster.rotation.set(Math.PI / 2, 0, Math.PI / 2 - 0.56);
bolster.position.y = ky;
kneeGroup.add(bolster);
});
legPivot.add(kneeGroup);
// Contoured outer leg racing stripe (curved arc hugging leg surface)
const stripeStartAngle = side === 1 ? Math.PI * 0.5 - 0.34 : -Math.PI * 0.5 - 0.34;
const legStripe = new THREE.Mesh(
new THREE.CylinderGeometry(0.143, 0.124, 0.86, 20, 1, false, stripeStartAngle, 0.68),
zoneMats[7]
);
legStripe.position.y = 0.01;
legPivot.add(legStripe);
// Ribbed Nomex ankle / boot cuff
const ankleCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.123, 0.119, 0.075, 24), zoneMats[2]);
ankleCuff.position.y = -0.455;
legPivot.add(ankleCuff);
const ankleCap = new THREE.Mesh(new THREE.SphereGeometry(0.119, 18, 12), zoneMats[2]);
ankleCap.position.y = -0.49;
legPivot.add(ankleCap);
garmentGroup.add(legPivot);
legs.push({ mesh: legPivot, side });
});
function applyStyle(fabricPreset, colorPreset, palette, multiColors = []) {
zoneMats.forEach((mat) => {
Object.assign(mat, fabricPreset.mat);
mat.needsUpdate = true;
});
// 1. Aesthetic Palette overrides if active
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
// 2. Unlimited Multi-Color List (cycles across all 8 suit zones)
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
// 3. Single-Color Fallback with classic white/obsidian trim
const fallback = [colorPreset.hex, 0xf8fafc, 0x111318, 0xf8fafc, 0x111318, colorPreset.hex, 0x111318, 0xf8fafc];
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
// 1. Morph multi-zone torso cleanly between Boy & Girl silhouettes
morphRacingTorso(torsoGeo, profile.chestScale, profile.hipScale);
// 2. Align racing belt & buckle to hip width/depth
beltGroup.scale.set(hipX, 1, hipZ);
// 3. Position & scale sleeves + extraction epaulettes
const armScale = (profile.armRadius + 0.032) / 0.104;
const legScale = (profile.legRadius + 0.036) / 0.134;
arms.forEach(({ mesh, shoulderPad, epaulette, side }) => {
mesh.position.x = side * profile.armOffset;
mesh.scale.set(armScale, 1, armScale);
shoulderPad.position.x = side * (profile.armOffset - 0.09);
shoulderPad.scale.set(armScale * 1.15, armScale * 0.74, armScale * 1.05);
epaulette.position.x = side * (profile.armOffset - 0.18 * chestX);
});
// 4. Position & scale legs (knee pad, side stripe & ankle cuff scale automatically inside legPivot)
legs.forEach(({ mesh, side }) => {
mesh.position.x = side * profile.legOffset;
mesh.scale.set(legScale, 1, legScale);
});
// 5. Keep zipper flush against chest Z-depth
setDepth(0.328 * chestZ + 0.008);
}
return { garmentGroup, applyStyle, syncBody, setClosureType };
}