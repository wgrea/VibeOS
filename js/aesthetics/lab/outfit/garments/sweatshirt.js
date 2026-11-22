// js/aesthetics/lab/outfit/garments/sweatshirt.js
import * as THREE from 'three';
import { buildClosure } from '../closures.js';

/**
 * Builds a relaxed, heavyweight sweatshirt torso with soft blousing above
 * the ribbed waistband and full shoulder clearance over the mannequin.
 */
function createSweatshirtTorsoGeometry() {
  const profilePoints = [
    [0.242, 0.255],  // Inner bottom hem return
    [0.262, 0.255],  // Waistband seat
    [0.276, 0.305],  // Soft fabric blouse just above ribbed hem
    [0.286, 0.375],  // Lower torso
    [0.306, 0.475],  // Mid torso
    [0.328, 0.585],  // Full chest
    [0.334, 0.715],  // Upper chest
    [0.330, 0.835],  // Clears top outer corner of mannequin chest (y = 0.85)
    [0.292, 0.875],  // Relaxed drop-shoulder slope
    [0.195, 0.895],  // Collar rib seam
    [0.145, 0.902],  // Neckline throat
    [0.132, 0.865]   // Inner neckline lining
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

    // Subtle fleece drape folds near the waist & lower back
    if (y > 0.27 && y < 0.74) {
      const blouseMask = Math.exp(-Math.pow((y - 0.34) / 0.14, 2));
      const fold = (Math.sin(y * 44.0 + Math.cos(angle * 2.0) * 1.2) + 1.0) * 0.0024 * blouseMask;
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
 * Builds a relaxed sweatshirt sleeve that blouses softly above a tapered ribbed cuff.
 */
function createSweatshirtSleeveGeometry({ topR, midR, blouseR, cuffR, length, radialSegs = 28, heightSegs = 32 }) {
  const geo = new THREE.CylinderGeometry(topR, cuffR, length, radialSegs, heightSegs, false);
  const pos = geo.attributes.position;
  const halfLen = length * 0.5;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    const t = (y + halfLen) / length; // 0 = wrist, 1 = shoulder
    const angle = Math.atan2(z, x);

    let targetR;
    if (t < 0.15) {
      const u = t / 0.15;
      targetR = THREE.MathUtils.lerp(cuffR, blouseR, Math.sin(u * Math.PI * 0.5));
    } else if (t < 0.52) {
      const u = (t - 0.15) / 0.37;
      targetR = THREE.MathUtils.lerp(blouseR, midR, u);
    } else {
      const u = (t - 0.52) / 0.48;
      targetR = THREE.MathUtils.lerp(midR, topR, Math.pow(u, 0.85));
    }

    // Subtle fabric stacking pleats just above the ribbed wrist cuff
    if (t >= 0.04 && t <= 0.24) {
      const stackMask = Math.sin(((t - 0.04) / 0.20) * Math.PI);
      targetR += (Math.cos(angle * 6.0) + 1.0) * 0.0022 * stackMask;
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
 * Builds an authentic trapezoid kangaroo pouch pocket with slanted side hand openings.
 */
function createKangarooPocketMesh(bodyMat, ribMat) {
  const group = new THREE.Group();

  const shape = new THREE.Shape();
  shape.moveTo(-0.085, 0.075);   // Top left
  shape.lineTo(0.085, 0.075);    // Top right
  shape.lineTo(0.145, -0.015);   // Slanted right hand-opening corner
  shape.lineTo(0.132, -0.082);   // Bottom right
  shape.lineTo(-0.132, -0.082);  // Bottom left
  shape.lineTo(-0.145, -0.015);  // Slanted left hand-opening corner
  shape.closePath();

  const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.024,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.006,
    bevelThickness: 0.006
  });

  const pouch = new THREE.Mesh(extrudeGeo, bodyMat);
  pouch.castShadow = true;
  pouch.receiveShadow = true;
  group.add(pouch);

  // Ribbed trim welts along the slanted left/right hand-entry openings
  [-1, 1].forEach((side) => {
    const welt = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.105, 0.028), ribMat);
    welt.position.set(side * 0.118, 0.028, 0.013);
    welt.rotation.z = side * 0.56;
    group.add(welt);
  });

  group.position.set(0, 0.385, 0.215);
  group.rotation.x = -0.055;

  return group;
}

/**
 * Morphs sweatshirt torso vertices cleanly between hipScale (at hem) and chestScale (at upper chest).
 */
function morphSweatshirtTorso(geo, chestScale, hipScale) {
  const pos = geo.attributes.position;
  const base = geo.userData.basePositions;

  const [hipX, , hipZ] = hipScale;
  const [chestX, , chestZ] = chestScale;

  const hemX = THREE.MathUtils.lerp(hipX, chestX, 0.45);
  const hemZ = THREE.MathUtils.lerp(hipZ, chestZ, 0.45);

  for (let i = 0; i < pos.count; i++) {
    const bx = base[i * 3];
    const by = base[i * 3 + 1];
    const bz = base[i * 3 + 2];

    let sx, sz;
    if (by <= 0.85) {
      const t = THREE.MathUtils.smoothstep(by, 0.25, 0.58);
      sx = THREE.MathUtils.lerp(hemX, chestX, t);
      sz = THREE.MathUtils.lerp(hemZ, chestZ, t);
    } else {
      const t = THREE.MathUtils.smoothstep(by, 0.85, 0.902);
      sx = THREE.MathUtils.lerp(chestX, 1.03, t);
      sz = THREE.MathUtils.lerp(chestZ, 1.03, t);
    }

    pos.setXYZ(i, bx * sx, by, bz * sz);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

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

  // 1. Relaxed Fleece Torso
  const torsoGeo = createSweatshirtTorsoGeometry();
  const chest = new THREE.Mesh(torsoGeo, bodyMat);
  chest.castShadow = true;
  chest.receiveShadow = true;
  garmentGroup.add(chest);

  // 2. Ribbed Knit Waistband
  const waistBand = new THREE.Mesh(new THREE.CylinderGeometry(0.258, 0.252, 0.088, 48), ribMat);
  waistBand.position.y = 0.268;
  waistBand.castShadow = true;
  garmentGroup.add(waistBand);

  // 3. Crewneck Collar Ring (Crewneck & Hoodie variants)
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.142, 0.022, 14, 36), ribMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 0.885;
  garmentGroup.add(collar);

  // Quarter-Zip Funnel Collar (Quarter-Zip variant)
  const quarterZipCollar = new THREE.Group();
  quarterZipCollar.position.y = 0.905;

  const funnelWall = new THREE.Mesh(
    new THREE.CylinderGeometry(0.146, 0.162, 0.11, 36, 1, false, 0.24, Math.PI * 2 - 0.48),
    ribMat
  );
  quarterZipCollar.add(funnelWall);

  const funnelRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.146, 0.011, 10, 36, Math.PI * 2 - 0.48),
    ribMat
  );
  funnelRim.rotation.set(Math.PI / 2, 0, Math.PI / 2 + 0.24);
  funnelRim.position.y = 0.054;
  quarterZipCollar.add(funnelRim);

  garmentGroup.add(quarterZipCollar);

  // 4. Hoodie-Specific Meshes (Draped Hood + Center Seam + Kangaroo Pocket + Grommet Drawstrings)
  const hoodieGroup = new THREE.Group();

  const hoodPivot = new THREE.Group();
  hoodPivot.position.set(0, 0.84, -0.145);

  const hood = new THREE.Mesh(new THREE.SphereGeometry(0.198, 24, 18), bodyMat);
  hood.scale.set(1.14, 0.75, 0.92);
  hood.rotation.x = 0.24;
  hood.castShadow = true;
  hoodPivot.add(hood);

  // Folded hood brim rim
  const hoodRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.172, 0.020, 12, 28, Math.PI * 1.15),
    bodyMat
  );
  hoodRim.rotation.set(Math.PI * 0.42, 0, -Math.PI * 0.075);
  hoodRim.position.set(0, 0.045, 0.02);
  hoodPivot.add(hoodRim);

  hoodieGroup.add(hoodPivot);

  // Kangaroo pouch pocket
  const pocket = createKangarooPocketMesh(bodyMat, ribMat);
  hoodieGroup.add(pocket);

  // Collar grommets & curved drawstrings with metallic aglet tips
  const drawstringGroup = new THREE.Group();
  [-1, 1].forEach((side) => {
    const grommet = new THREE.Mesh(new THREE.TorusGeometry(0.008, 0.0025, 8, 16), hardwareMat);
    grommet.position.set(side * 0.042, 0.855, 0.145);
    drawstringGroup.add(grommet);

    const cordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.042, 0.855, 0.148),
      new THREE.Vector3(side * 0.048, 0.785, 0.215),
      new THREE.Vector3(side * 0.045, 0.715, 0.236),
      new THREE.Vector3(side * 0.043, 0.655, 0.242)
    ]);
    const cord = new THREE.Mesh(new THREE.TubeGeometry(cordCurve, 16, 0.0045, 8, false), ribMat);
    drawstringGroup.add(cord);

    // Metallic aglet tip at end of drawstring
    const aglet = new THREE.Mesh(new THREE.CylinderGeometry(0.0048, 0.0042, 0.022, 10), hardwareMat);
    aglet.position.set(side * 0.043, 0.646, 0.242);
    drawstringGroup.add(aglet);
  });
  hoodieGroup.add(drawstringGroup);

  garmentGroup.add(hoodieGroup);

  // 5. Optional Quarter-Zip Front Closure
  const { closureGroup, setClosureType, setDepth } = buildClosure({
    type: 'none',
    yTop: 0.92,
    yBottom: 0.58,
    zOffset: 0.238,
    buttonCount: 3
  });
  garmentGroup.add(closureGroup);

  // 6. Unified Drop-Shoulder Sleeves & Tapered Ribbed Knit Cuffs
  const arms = [];
  const sleeveGeo = createSweatshirtSleeveGeometry({
    topR: 0.114,
    midR: 0.106,
    blouseR: 0.110,
    cuffR: 0.088,
    length: 0.68
  });

  [-1, 1].forEach((side) => {
    const armPivot = new THREE.Group();
    armPivot.position.set(side * 0.44, 0.40, 0);
    armPivot.rotation.z = side * -0.18;
const arm = new THREE.Mesh(sleeveGeo, bodyMat);
arm.castShadow = true;
arm.receiveShadow = true;
armPivot.add(arm);
const shoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.114, 20, 14), bodyMat);
shoulderCap.position.y = 0.34;
shoulderCap.scale.set(1.0, 0.85, 1.0);
armPivot.add(shoulderCap);
// Tapered ribbed knit wrist cuff
const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.089, 0.084, 0.082, 24), ribMat);
cuff.position.y = -0.355;
armPivot.add(cuff);
const cuffCap = new THREE.Mesh(new THREE.SphereGeometry(0.084, 18, 12), ribMat);
cuffCap.position.y = -0.395;
armPivot.add(cuffCap);
garmentGroup.add(armPivot);
arms.push({ mesh: armPivot, side });
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
const [hipX, , hipZ] = profile.hipScale;
// 1. Morph relaxed fleece torso between Boy & Girl proportions
morphSweatshirtTorso(torsoGeo, profile.chestScale, profile.hipScale);
// 2. Align ribbed waistband
const hemX = THREE.MathUtils.lerp(hipX, chestX, 0.45);
const hemZ = THREE.MathUtils.lerp(hipZ, chestZ, 0.45);
waistBand.scale.set(hemX, 1, hemZ);
// 3. Position & scale sleeves + ribbed cuffs
const armScale = (profile.armRadius + 0.034) / 0.106;
arms.forEach(({ mesh, side }) => {
mesh.position.x = side * profile.armOffset;
mesh.scale.set(armScale, 1, armScale);
});
// 4. Keep kangaroo pocket, hood, drawstrings & quarter-zip flush with torso depth
const zFront = 0.328 * chestZ + 0.008;
pocket.position.z = zFront - 0.024;
pocket.scale.set(Math.min(1.1, chestX * 0.94), 1, 1);
hoodPivot.position.z = -0.334 * chestZ + 0.075;
drawstringGroup.position.z = zFront - 0.242;
setDepth(zFront);
}
setVariant('hoodie');
return { garmentGroup, applyStyle, syncBody, setClosureType, setVariant };
}
