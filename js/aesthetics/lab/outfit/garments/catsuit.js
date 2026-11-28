// js/aesthetics/lab/outfit/catsuit.js
import * as THREE from 'three';
import { buildClosure } from '../closures.js';

function createSculptedTorsoGeometry() {
  // Clears mannequin chest cylinder top edge (y = 0.85, r = 0.285) + shoulder joint
  const profilePoints = [
    [0.01, -0.35],
    [0.19, -0.33],
    [0.275, -0.265],
    [0.295, -0.185],
    [0.305, -0.115], // Hips (mannequin 0.275 + 0.030 clearance)
    [0.285, -0.025],
    [0.252, 0.065],
    [0.242, 0.145],  // Waist (mannequin 0.205 + 0.027 clearance)
    [0.245, 0.235],
    [0.270, 0.335],
    [0.295, 0.445],
    [0.312, 0.555],  // Chest (mannequin 0.285 + 0.027 clearance)
    [0.318, 0.725],  // Upper chest
    [0.316, 0.835],  // Clears top outer corner of mannequin chest cylinder at y = 0.85!
    [0.285, 0.872],  // Smooth shoulder-to-trapezius curve above y = 0.85
[0.185, 0.892],  // Collar base
 [0.125, 0.912],  // Crew-neck rim outer
 [0.112, 0.922],  // Collar top lip
 [0.106, 0.912],  // Collar inner lip
 [0.106, 0.880]   // Inner collar lining
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

    // Subtle outward fabric tension ripples along torso sides
    if (y > 0.04 && y < 0.64) {
      const ripple = (Math.sin(y * 62.0 + Math.cos(angle * 2.0) * 1.2) + 1.0) * 0.0014;
      const sideMask = Math.pow(Math.abs(Math.cos(angle)), 1.4);
      x += Math.cos(angle) * ripple * sideMask;
      z += Math.sin(angle) * ripple * sideMask;
    }

    pos.setXYZ(i, x, y, z);

    const u = (angle + Math.PI) / (Math.PI * 2);
    const v = (y + 0.35) / 1.37;
    uv.setXY(i, u, v);
  }

  geo.userData.basePositions = new Float32Array(pos.array);
  uv.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

function createTailoredLimbGeometry({ topR, midR, bottomR, length, jointY = 0, radialSegs = 28, heightSegs = 32 }) {
  const geo = new THREE.CylinderGeometry(topR, bottomR, length, radialSegs, heightSegs, false);
  const pos = geo.attributes.position;
  const halfLen = length * 0.5;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    const t = THREE.MathUtils.clamp((y + halfLen) / length, 0, 1);

    let targetR;
    if (t > 0.5) {
      const u = (t - 0.5) * 2;
      targetR = THREE.MathUtils.lerp(midR, topR, Math.pow(u, 0.85));
    } else {
      const u = t * 2;
      targetR = THREE.MathUtils.lerp(bottomR, midR, Math.pow(u, 0.8));
    }

    const distFromJoint = Math.abs(y - jointY);
    if (distFromJoint < 0.13) {
      const jointMask = 1.0 - distFromJoint / 0.13;
      const crease = (Math.sin(y * 80.0) + 1.0) * 0.0016 * jointMask;
      targetR += crease;
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

function createSeamTube(points, radius, seamMat) {
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, 28, radius, 8, false);
  geo.userData.basePositions = new Float32Array(geo.attributes.position.array);
  return new THREE.Mesh(geo, seamMat);
}

function morphTorsoVertices(geo, chestScale, hipScale) {
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
    } else if (by <= 0.87) {
      const t = THREE.MathUtils.smoothstep(by, 0.14, 0.56);
      sx = THREE.MathUtils.lerp(hipX, chestX, t);
      sz = THREE.MathUtils.lerp(hipZ, chestZ, t);
    } else {
      // Taper cleanly onto cylindrical neck (radius 0.105) above y = 0.87
      const t = THREE.MathUtils.smoothstep(by, 0.87, 0.93);
      sx = THREE.MathUtils.lerp(chestX, 1.02, t);
      sz = THREE.MathUtils.lerp(chestZ, 1.02, t);
    }

    pos.setXYZ(i, bx * sx, by, bz * sz);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

export function buildCatsuit(initialHex) {
  const suitGroup = new THREE.Group();

  const suitMat = new THREE.MeshPhysicalMaterial({
    color: initialHex,
    side: THREE.DoubleSide
  });

  const seamMat = new THREE.MeshPhysicalMaterial({
    color: initialHex,
    roughness: 0.45,
    metalness: 0.05
  });

  // 1. Continuous sculpted torso + mock-neck collar
  const torsoGeo = createSculptedTorsoGeometry();
  const torso = new THREE.Mesh(torsoGeo, suitMat);
  torso.castShadow = true;
  torso.receiveShadow = true;
  suitGroup.add(torso);

  // 2. Front princess seams, center-back spine seam & collar piping
  const seamMeshes = [];

  [-1, 1].forEach((side) => {
    const princessSeam = createSeamTube(
      [
        new THREE.Vector3(side * 0.168, -0.22, 0.162),
        new THREE.Vector3(side * 0.158, -0.05, 0.205),
        new THREE.Vector3(side * 0.138, 0.14, 0.194),
        new THREE.Vector3(side * 0.148, 0.34, 0.224),
        new THREE.Vector3(side * 0.168, 0.54, 0.244),
        new THREE.Vector3(side * 0.195, 0.76, 0.215),
        new THREE.Vector3(side * 0.165, 0.88, 0.095)
      ],
      0.0036,
      seamMat
    );
    torso.add(princessSeam);
    seamMeshes.push(princessSeam);
  });

const backSpineSeam = createSeamTube(
  [
    new THREE.Vector3(0, -0.28, -0.230),
    new THREE.Vector3(0, -0.10, -0.303),
    new THREE.Vector3(0, 0.14, -0.230),
    new THREE.Vector3(0, 0.44, -0.293),
    new THREE.Vector3(0, 0.76, -0.316),
    new THREE.Vector3(0, 0.905, -0.130)
  ],
  0.0030,
  seamMat
);
  torso.add(backSpineSeam);
  seamMeshes.push(backSpineSeam);

const collarRing = new THREE.Mesh(new THREE.TorusGeometry(0.122, 0.0022, 10, 36), seamMat);
collarRing.rotation.x = Math.PI / 2;
collarRing.position.y = 0.912;

  // 3. Front closure
const { closureGroup, setClosureType, setDepth } = buildClosure({
  type: 'zipper',
  yTop: 0.89,
  yBottom: 0.26,
  zOffset: 0.215,
  slim: true,
  waistDropZ: 0.048,
  topDropZ: 0.025
});
  suitGroup.add(closureGroup);

  // 4. Full-length sleeves & legs aligned to mannequin.js
  const arms = [];
  const legs = [];

  const armGeo = createTailoredLimbGeometry({
    topR: 0.095,
    midR: 0.088,
    bottomR: 0.085,
    length: 0.74,
    jointY: 0.01
  });

  const legGeo = createTailoredLimbGeometry({
    topR: 0.130,
    midR: 0.119,
    bottomR: 0.113,
    length: 0.92,
    jointY: 0.02
  });

  [-1, 1].forEach((side) => {
const shoulderCover = new THREE.Mesh(new THREE.SphereGeometry(0.095, 20, 16), suitMat);
shoulderCover.position.set(side * 0.345, 0.735, 0);
    suitGroup.add(shoulderCover);

    const armPivot = new THREE.Group();
    armPivot.position.set(side * 0.44, 0.38, 0);
    armPivot.rotation.z = side * -0.18;

    const arm = new THREE.Mesh(armGeo, suitMat);
    arm.castShadow = true;
    arm.receiveShadow = true;
    armPivot.add(arm);

    const upperArmCap = new THREE.Mesh(new THREE.SphereGeometry(0.095, 20, 14), suitMat);
    upperArmCap.position.y = 0.37;
    armPivot.add(upperArmCap);

    const wristCap = new THREE.Mesh(new THREE.SphereGeometry(0.085, 20, 14), suitMat);
    wristCap.position.y = -0.37;
    armPivot.add(wristCap);

const wristCuff = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.0018, 8, 24), seamMat);
    wristCuff.rotation.x = Math.PI / 2;
    wristCuff.position.y = -0.36;
    armPivot.add(wristCuff);

    suitGroup.add(armPivot);
    arms.push({ mesh: armPivot, shoulderCover, side });

    const legPivot = new THREE.Group();
    legPivot.position.set(side * 0.155, -0.62, 0);
    legPivot.rotation.z = side * -0.04;

    const leg = new THREE.Mesh(legGeo, suitMat);
    leg.castShadow = true;
    leg.receiveShadow = true;
    legPivot.add(leg);

    const hipCap = new THREE.Mesh(new THREE.SphereGeometry(0.130, 20, 14), suitMat);
    hipCap.position.y = 0.46;
    legPivot.add(hipCap);

    const ankleCap = new THREE.Mesh(new THREE.SphereGeometry(0.113, 20, 14), suitMat);
    ankleCap.position.y = -0.46;
    legPivot.add(ankleCap);

const ankleCuff = new THREE.Mesh(new THREE.TorusGeometry(0.113, 0.0018, 8, 24), seamMat);
    ankleCuff.rotation.x = Math.PI / 2;
    ankleCuff.position.y = -0.45;
    legPivot.add(ankleCuff);

    suitGroup.add(legPivot);
    legs.push({ mesh: legPivot, side });
  });

  function applyStyle(fabricPreset, colorPreset) {
    Object.assign(suitMat, fabricPreset.mat);
    suitMat.color.setHex(colorPreset.hex);
    if (suitMat.sheenColor) {
      suitMat.sheenColor.setHex(colorPreset.hex).lerp(new THREE.Color(0xffffff), 0.35);
    }
    suitMat.needsUpdate = true;

    seamMat.color.setHex(colorPreset.hex).multiplyScalar(0.76);
    seamMat.roughness = Math.min(1.0, (fabricPreset.mat.roughness ?? 0.5) + 0.15);
    seamMat.clearcoat = (fabricPreset.mat.clearcoat ?? 0) * 0.5;
    seamMat.needsUpdate = true;
  }

  function syncBody(profile) {
    const [, , chestZ] = profile.chestScale;

    morphTorsoVertices(torsoGeo, profile.chestScale, profile.hipScale);
    seamMeshes.forEach((m) => morphTorsoVertices(m.geometry, profile.chestScale, profile.hipScale));

const armScale = (profile.armRadius + 0.011) / 0.085;
const legScale = (profile.legRadius + 0.012) / 0.113;

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
// Keep zipper flush against chest Z-depth for Boy (0.78) and Girl (0.64)
setDepth(0.314 * chestZ + 0.003);
}
return { suitGroup, applyStyle, syncBody, setClosureType };
}