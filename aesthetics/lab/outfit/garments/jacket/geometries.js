import * as THREE from 'three';

export function createJacketShellGeometry() {
  const profilePoints = [
    [0.268, 0.255],  // Inner bottom hem return
    [0.288, 0.255],  // Outer bottom hem edge
    [0.294, 0.305],  // Lower waist
    [0.308, 0.385],  // Mid torso
    [0.326, 0.485],  // Ribcage
    [0.340, 0.585],  // Full chest
    [0.344, 0.715],  // Upper chest
    [0.340, 0.835],  // Clears top outer corner
    [0.324, 0.865],  // Fuller shoulder crest
    [0.275, 0.888],  // Shoulder-to-collar slope
    [0.195, 0.902],  // Collar seam base
    [0.168, 0.910],  // Collar throat
    [0.154, 0.865]   // Inner collar lining
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

    if (y > 0.28 && y < 0.76) {
      const lowerMask = Math.exp(-Math.pow((y - 0.36) / 0.16, 2));
      const fold = (Math.sin(y * 42.0 + Math.cos(angle * 2.0) * 1.3) + 1.0) * 0.0022 * lowerMask;
      x += Math.cos(angle) * fold;
      z += Math.sin(angle) * fold;
    }

    pos.setXYZ(i, x, y, z);
    uv.setXY(i, (angle + Math.PI) / (Math.PI * 2), (y - 0.25) / 0.66);
  }

  geo.userData.basePositions = new Float32Array(pos.array);
  uv.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

export function createJacketSleeveGeometry({ topR, midR, cuffR, length, radialSegs = 28, heightSegs = 32 }) {
  const geo = new THREE.CylinderGeometry(topR, cuffR, length, radialSegs, heightSegs, false);
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
      targetR = THREE.MathUtils.lerp(cuffR, midR, Math.pow(u, 0.82));
    }

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

export function createMotoLapelMesh(side, shellMat, hardwareMat) {
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

  const snap = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.006, 14), hardwareMat);
  snap.rotation.x = Math.PI / 2;
  snap.position.set(side * 0.064, 0.045, 0.016);
  lapelGroup.add(snap);

  lapelGroup.position.set(side * 0.018, 0.77, 0.242);
  lapelGroup.rotation.set(-0.22, side * 0.34, side * -0.14);

  return lapelGroup;
}