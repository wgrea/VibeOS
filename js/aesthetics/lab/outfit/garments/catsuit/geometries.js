import * as THREE from 'three';

export function createSculptedTorsoGeometry() {
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

export function createTailoredLimbGeometry({ topR, midR, bottomR, length, jointY = 0, radialSegs = 28, heightSegs = 32 }) {
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

export function createSeamTube(points, radius, seamMat) {
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, 28, radius, 8, false);
  geo.userData.basePositions = new Float32Array(geo.attributes.position.array);
  return new THREE.Mesh(geo, seamMat);
}