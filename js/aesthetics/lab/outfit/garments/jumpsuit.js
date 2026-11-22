// js/aesthetics/lab/outfit/garments/jumpsuit.js
import * as THREE from 'three';
import { buildClosure } from '../closures.js';

/**
 * Builds a continuous, tailored workwear jumpsuit torso + pelvis shell
 * with clearance over both the mannequin and catsuit base layer.
 */
function createJumpsuitTorsoGeometry() {
  const profilePoints = [
    [0.01, -0.36],
    [0.195, -0.34],
    [0.285, -0.275],
    [0.312, -0.195],
    [0.322, -0.115], // Hips
    [0.302, -0.025],
    [0.268, 0.075],
    [0.252, 0.175],  // Lower waist
    [0.250, 0.285],  // Waistband seat
    [0.264, 0.375],  // Ribcage
    [0.292, 0.485],
    [0.322, 0.595],  // Full chest
    [0.328, 0.725],  // Upper chest
    [0.324, 0.835],  // Clears top outer corner of mannequin chest (y = 0.85)
    [0.288, 0.875],  // Tailored shoulder slope
    [0.198, 0.895],  // Collar seam base
    [0.155, 0.905],  // Neckline throat
    [0.142, 0.865]   // Inner neckline lining
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

    // Subtle workwear fabric blousing just above & below the waistband (y ~ 0.29)
    if (y > 0.05 && y < 0.65) {
      const waistProx = Math.exp(-Math.pow((y - 0.29) / 0.18, 2));
      const crease = (Math.sin(y * 46.0 + Math.cos(angle * 2.0) * 1.2) + 1.0) * 0.0022 * waistProx;
      x += Math.cos(angle) * crease;
      z += Math.sin(angle) * crease;
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
 * Builds a tailored sleeve or straight-cut trouser leg with subtle joint articulation.
 */
function createWorkwearLimbGeometry({ topR, midR, bottomR, length, jointY = 0, radialSegs = 28, heightSegs = 32 }) {
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

    // Subtle knee/elbow fabric stack folds
    const distJoint = Math.abs(y - jointY);
    if (distJoint < 0.12) {
      const mask = 1.0 - distJoint / 0.12;
      targetR += (Math.sin(y * 74.0) + 1.0) * 0.0022 * mask;
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
 * Builds a beveled utility patch pocket with a buttoned top flap.
 */
function createUtilityPocket(width, height, trimMat, hardwareMat) {
  const pocketGroup = new THREE.Group();

  // Main pocket pouch with beveled edges
  const pouchShape = new THREE.Shape();
  const hw = width * 0.5;
  const hh = height * 0.5;
  pouchShape.moveTo(-hw, hh);
  pouchShape.lineTo(hw, hh);
  pouchShape.lineTo(hw, -hh + 0.015);
  pouchShape.lineTo(hw - 0.015, -hh);
  pouchShape.lineTo(-hw + 0.015, -hh);
  pouchShape.lineTo(-hw, -hh + 0.015);
  pouchShape.closePath();

  const pouchGeo = new THREE.ExtrudeGeometry(pouchShape, {
    depth: 0.012,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.003,
    bevelThickness: 0.003
  });
  const pouch = new THREE.Mesh(pouchGeo, trimMat);
  pouch.castShadow = true;
  pocketGroup.add(pouch);

  // Overhanging pocket flap
  const flapH = height * 0.34;
  const flapShape = new THREE.Shape();
  flapShape.moveTo(-hw - 0.003, 0);
  flapShape.lineTo(hw + 0.003, 0);
  flapShape.lineTo(hw + 0.003, -flapH * 0.65);
  flapShape.lineTo(0, -flapH);
  flapShape.lineTo(-hw - 0.003, -flapH * 0.65);
  flapShape.closePath();

  const flapGeo = new THREE.ExtrudeGeometry(flapShape, {
    depth: 0.007,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.002,
    bevelThickness: 0.002
  });
  const flap = new THREE.Mesh(flapGeo, trimMat);
  flap.position.set(0, hh + 0.004, 0.011);
  pocketGroup.add(flap);

  // Metallic snap button on flap point
  const button = new THREE.Mesh(new THREE.CylinderGeometry(0.0065, 0.0065, 0.005, 14), hardwareMat);
  button.rotation.x = Math.PI / 2;
  button.position.set(0, hh - flapH * 0.62, 0.019);
  pocketGroup.add(button);

  return pocketGroup;
}

/**
 * Morphs jumpsuit torso vertices between hipScale and chestScale, keeping collar round.
 */
function morphJumpsuitTorso(geo, chestScale, hipScale) {
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

  // 1. Continuous sculpted one-piece torso + pelvis
  const torsoGeo = createJumpsuitTorsoGeometry();
  const torso = new THREE.Mesh(torsoGeo, mainMat);
  torso.castShadow = true;
  torso.receiveShadow = true;
  garmentGroup.add(torso);

  // 2. Folded shirt-style spread collar with folded collar points
  const collarGroup = new THREE.Group();
  collarGroup.position.y = 0.895;

  // Standing collar band (open slightly at front center)
  const collarBand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.146, 0.164, 0.085, 36, 1, true, 0.28, Math.PI * 2 - 0.56),
    trimMat
  );
  collarBand.position.y = 0.032;
  collarGroup.add(collarBand);

  // Folded-over collar turnover rim
  const collarFold = new THREE.Mesh(
    new THREE.TorusGeometry(0.152, 0.015, 12, 36, Math.PI * 2 - 0.58),
    trimMat
  );
  collarFold.rotation.set(Math.PI / 2, 0, Math.PI / 2 + 0.29);
  collarFold.position.y = 0.068;
  collarGroup.add(collarFold);

  // Front folded collar point tabs
  [-1, 1].forEach((side) => {
    const tabShape = new THREE.Shape();
    tabShape.moveTo(0, 0.055);
    tabShape.lineTo(side * 0.068, 0.032);
    tabShape.lineTo(side * 0.052, -0.035);
    tabShape.lineTo(0, -0.015);
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
    tab.position.set(side * 0.022, 0.015, 0.142);
    tab.rotation.set(-0.28, side * 0.35, side * -0.15);
    collarGroup.add(tab);
  });

  garmentGroup.add(collarGroup);

  // 3. Chest utility patch pockets with flaps & snaps
  const chestPockets = [];
  [-1, 1].forEach((side) => {
    const pocket = createUtilityPocket(0.105, 0.125, trimMat, hardwareMat);
    pocket.position.set(side * 0.128, 0.62, 0.22);
    pocket.rotation.set(-0.06, side * 0.26, 0);
    garmentGroup.add(pocket);
    chestPockets.push({ mesh: pocket, side });
  });

  // 4. Seamed waistband with belt loops & side utility D-ring
  const waistGroup = new THREE.Group();
  waistGroup.position.y = 0.285;

  const waistBand = new THREE.Mesh(new THREE.CylinderGeometry(0.254, 0.256, 0.072, 48), trimMat);
  waistBand.castShadow = true;
  waistGroup.add(waistBand);

  // Top & bottom waistband stitch piping
  [-0.034, 0.034].forEach((offsetY) => {
    const stitchRing = new THREE.Mesh(new THREE.TorusGeometry(0.255, 0.003, 8, 48), trimMat);
    stitchRing.rotation.x = Math.PI / 2;
    stitchRing.position.y = offsetY;
    waistGroup.add(stitchRing);
  });

  // Belt loops around waistband
  [-2.3, -1.1, -0.35, 0.35, 1.1, 2.3].forEach((angle) => {
    const loop = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.082, 0.012), trimMat);
    loop.position.set(Math.sin(angle) * 0.257, 0, Math.cos(angle) * 0.257);
    loop.rotation.y = angle;
    waistGroup.add(loop);
  });

  // Side utility D-ring hardware on right hip
  const dRing = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.003, 8, 18), hardwareMat);
  dRing.position.set(0.258, -0.025, 0.04);
  dRing.rotation.y = Math.PI / 2;
  waistGroup.add(dRing);

  garmentGroup.add(waistGroup);

  // 5. Front Closure (Buttons or Zipper down to waist)
  const { closureGroup, setClosureType, setDepth } = buildClosure({
    type: 'buttons',
    yTop: 0.86,
    yBottom: 0.26,
    zOffset: 0.238,
    buttonCount: 5
  });
  garmentGroup.add(closureGroup);

  // 6. Tailored Sleeves & Straight-Cut Workwear Legs
  const arms = [];
  const legs = [];
const sleeveGeo = createWorkwearLimbGeometry({
topR: 0.112,
midR: 0.102,
bottomR: 0.092,
length: 0.70,
jointY: 0.01
});
const legGeo = createWorkwearLimbGeometry({
topR: 0.144,
midR: 0.136,
bottomR: 0.130,
length: 0.90,
jointY: 0.02
});
[-1, 1].forEach((side) => {
const armPivot = new THREE.Group();
armPivot.position.set(side * 0.44, 0.40, 0);
armPivot.rotation.z = side * -0.18;
const arm = new THREE.Mesh(sleeveGeo, mainMat);
arm.castShadow = true;
arm.receiveShadow = true;
armPivot.add(arm);
const shoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.112, 20, 14), mainMat);
shoulderCap.position.y = 0.35;
shoulderCap.scale.set(1.0, 0.85, 1.0);
armPivot.add(shoulderCap);
// Buttoned shirt-style sleeve cuff
const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.094, 0.093, 0.068, 24), trimMat);
cuff.position.y = -0.355;
armPivot.add(cuff);
const cuffCap = new THREE.Mesh(new THREE.SphereGeometry(0.093, 18, 12), trimMat);
cuffCap.position.y = -0.388;
armPivot.add(cuffCap);
const cuffBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.005, 12), hardwareMat);
cuffBtn.rotation.z = Math.PI / 2;
cuffBtn.position.set(side * 0.094, -0.355, -0.02);
armPivot.add(cuffBtn);
garmentGroup.add(armPivot);
arms.push({ mesh: armPivot, side });
const legPivot = new THREE.Group();
legPivot.position.set(side * 0.155, -0.61, 0);
legPivot.rotation.z = side * -0.04;
const leg = new THREE.Mesh(legGeo, mainMat);
leg.castShadow = true;
leg.receiveShadow = true;
legPivot.add(leg);
const hipCap = new THREE.Mesh(new THREE.SphereGeometry(0.144, 20, 14), mainMat);
hipCap.position.y = 0.45;
legPivot.add(hipCap);
// Side utility thigh pocket
const thighPocket = createUtilityPocket(0.085, 0.11, trimMat, hardwareMat);
thighPocket.position.set(side * 0.135, 0.14, 0.01);
thighPocket.rotation.y = side * Math.PI * 0.5;
legPivot.add(thighPocket);
// Turned-up straight-cut trouser hem cuff
const legHem = new THREE.Mesh(new THREE.CylinderGeometry(0.133, 0.133, 0.062, 24), trimMat);
legHem.position.y = -0.455;
legPivot.add(legHem);
const hemLip = new THREE.Mesh(new THREE.TorusGeometry(0.133, 0.0035, 8, 24), trimMat);
hemLip.rotation.x = Math.PI / 2;
hemLip.position.y = -0.424;
legPivot.add(hemLip);
const ankleCap = new THREE.Mesh(new THREE.SphereGeometry(0.132, 18, 12), trimMat);
ankleCap.position.y = -0.485;
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
// 1. Morph one-piece torso smoothly between Boy and Girl proportions
morphJumpsuitTorso(torsoGeo, profile.chestScale, profile.hipScale);
// 2. Align waistband to hip width & depth
waistGroup.scale.set(hipX, 1, hipZ);
// 3. Position & scale sleeves + straight-cut trouser legs
const armScale = (profile.armRadius + 0.03) / 0.102;
const legScale = (profile.legRadius + 0.034) / 0.132;
arms.forEach(({ mesh, side }) => {
mesh.position.x = side * profile.armOffset;
mesh.scale.set(armScale, 1, armScale);
});
legs.forEach(({ mesh, side }) => {
mesh.position.x = side * profile.legOffset;
mesh.scale.set(legScale, 1, legScale);
});
// 4. Keep chest pockets & front closure flush against chest Z-depth
const zFront = 0.324 * chestZ + 0.008;
chestPockets.forEach(({ mesh, side }) => {
mesh.position.x = side * (0.128 * chestX);
mesh.position.z = zFront - 0.018;
});
setDepth(zFront);
}
return { garmentGroup, applyStyle, syncBody, setClosureType };
}
