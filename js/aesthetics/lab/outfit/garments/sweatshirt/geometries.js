import * as THREE from 'three';

export function createSweatshirtTorsoGeometry() {
  const profilePoints = [
    [0.264, 0.255],  // Inner bottom hem return
    [0.268, 0.255],  // Waistband hem seat
    [0.286, 0.305],  // Soft fabric blouse
    [0.302, 0.375],  // Lower torso
    [0.324, 0.475],  // Mid torso
    [0.338, 0.585],  // Full chest
    [0.342, 0.715],  // Upper chest
    [0.338, 0.835],  // Chest top corner
    [0.306, 0.875],  // Relaxed drop-shoulder slope
    [0.205, 0.895],  // Collar rib seam
    [0.168, 0.908],  // Neckline outer lip
    [0.156, 0.905],  // Neckline inner lip
    [0.156, 0.900]   // Inner neckline stop
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

    if (y > 0.27 && y < 0.74) {
      const blouseMask = Math.exp(-Math.pow((y - 0.34) / 0.14, 2));
      const fold = (Math.sin(y * 44.0 + Math.cos(angle * 2.0) * 1.2) + 1.0) * 0.0022 * blouseMask;
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

export function createSweatshirtSleeveGeometry({ topR, midR, blouseR, cuffR, length, radialSegs = 28, heightSegs = 32 }) {
  const geo = new THREE.CylinderGeometry(topR, cuffR, length, radialSegs, heightSegs, false);
  const pos = geo.attributes.position;
  const halfLen = length * 0.5;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    const t = THREE.MathUtils.clamp((y + halfLen) / length, 0, 1);
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

export function createKangarooPocketMesh(bodyMat, ribMat) {
  const group = new THREE.Group();

  const shape = new THREE.Shape();
  shape.moveTo(-0.085, 0.075);
  shape.lineTo(0.085, 0.075);
  shape.lineTo(0.145, -0.015);
  shape.lineTo(0.132, -0.082);
  shape.lineTo(-0.132, -0.082);
  shape.lineTo(-0.145, -0.015);
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

  [-1, 1].forEach((side) => {
    const welt = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.105, 0.028), ribMat);
    welt.position.set(side * 0.118, 0.028, 0.013);
    welt.rotation.z = side * 0.56;
    group.add(welt);
  });

  group.position.set(0, 0.385, 0.22);
  group.rotation.x = -0.055;

  return group;
}