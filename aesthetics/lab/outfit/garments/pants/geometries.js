import * as THREE from 'three';

export function createPantsPelvisGeometry() {
  const profilePoints = [
    [0.01, -0.36],
    [0.198, -0.34],
    [0.288, -0.27],
    [0.312, -0.19],
    [0.322, -0.11], // Hips
    [0.302, -0.02],
    [0.272, 0.065],
    [0.260, 0.145], // Lower waist
    [0.256, 0.215], // Waistband seat
    [0.259, 0.255], // Top waist rim
    [0.254, 0.255]  // Inner waist return
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

    if (y > -0.24 && y < 0.14) {
      const creaseMask = Math.exp(-Math.pow((y + 0.08) / 0.14, 2));
      const ripple = (Math.sin(y * 54.0 + Math.cos(angle * 2.0) * 1.4) + 1.0) * 0.002 * creaseMask;
      x += Math.cos(angle) * ripple;
      z += Math.sin(angle) * ripple;
    }

    pos.setXYZ(i, x, y, z);
    uv.setXY(i, (angle + Math.PI) / (Math.PI * 2), (y + 0.36) / 0.62);
  }

  geo.userData.basePositions = new Float32Array(pos.array);
  uv.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

export function createPantLegGeometry({ topR, midR, bottomR, length, radialSegs = 28, heightSegs = 36 }) {
  const geo = new THREE.CylinderGeometry(topR, bottomR, length, radialSegs, heightSegs, false);
  const pos = geo.attributes.position;
  const halfLen = length * 0.5;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    const t = THREE.MathUtils.clamp((y + halfLen) / length, 0, 1);
    let targetR = t > 0.5 
      ? THREE.MathUtils.lerp(midR, topR, Math.pow((t - 0.5) * 2, 0.85))
      : THREE.MathUtils.lerp(bottomR, midR, Math.pow(t * 2, 0.82));

    const distKnee = Math.abs(y - 0.02);
    if (distKnee < 0.13) {
      const kneeMask = 1.0 - distKnee / 0.13;
      targetR += (Math.sin(y * 74.0) + 1.0) * 0.0022 * kneeMask;
    }

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

export function createCargoPocketMesh(side, mainMat, trimMat, hardwareMat) {
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

  const snap = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.005, 14), hardwareMat);
  snap.rotation.x = Math.PI / 2;
  snap.position.set(0, hh - flapH * 0.62, 0.031);
  group.add(snap);

  group.rotation.y = side * Math.PI * 0.5;
  group.position.set(side * 0.128, 0.19, 0);

  return group;
}

export function createTrackStripeGroup(side, trimMat) {
  const group = new THREE.Group();

  [-0.015, 0.015].forEach((zOffset) => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.139, 0.43, zOffset),
      new THREE.Vector3(side * 0.134, 0.21, zOffset),
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

export function createMotoKneeRibbing(trimMat) {
  const group = new THREE.Group();
  group.position.set(0, 0.02, 0);

  const patchGeo = new THREE.CylinderGeometry(0.134, 0.132, 0.155, 24, 1, true, -0.58, 1.16);
  const patch = new THREE.Mesh(patchGeo, trimMat);
  group.add(patch);

  [-0.052, -0.026, 0.0, 0.026, 0.052].forEach((yOff) => {
    const rib = new THREE.Mesh(
      new THREE.TorusGeometry(0.133, 0.006, 10, 24, 1.12),
      trimMat
    );
    rib.rotation.set(Math.PI / 2, 0, Math.PI / 2 - 0.56);
    rib.position.y = yOff;
    rib.castShadow = true;
    group.add(rib);
  });

  return group;
}