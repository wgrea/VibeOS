import * as THREE from 'three';

export function createJumpsuitTorsoGeometry() {
  const profilePoints = [
    [0.01, -0.36],
    [0.200, -0.34],
    [0.290, -0.275],
    [0.312, -0.195],
    [0.324, -0.115], // Hips
    [0.304, -0.025],
    [0.274, 0.065],
    [0.266, 0.145],  // Waist
    [0.272, 0.235],
    [0.280, 0.280],  // Waistband seat
    [0.294, 0.345],  // Lower ribcage
    [0.318, 0.445],  // Mid ribcage
    [0.334, 0.555],  // Chest
    [0.338, 0.725],  // Upper chest
    [0.335, 0.835],  // Clears top outer corner
    [0.304, 0.875],  // Shoulder slope
    [0.205, 0.895],  // Collar base
    [0.160, 0.910],  // Neckline outer lip
    [0.152, 0.905],  // Neckline inner lip
    [0.152, 0.900]   // Inner lining stop
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

    if (y > 0.05 && y < 0.65) {
      const waistProx = Math.exp(-Math.pow((y - 0.28) / 0.18, 2));
      const crease = (Math.sin(y * 46.0 + Math.cos(angle * 2.0) * 1.2) + 1.0) * 0.0020 * waistProx;
      x += Math.cos(angle) * crease;
      z += Math.sin(angle) * crease;
    }

    pos.setXYZ(i, x, y, z);
    uv.setXY(i, (angle + Math.PI) / (Math.PI * 2), (y + 0.36) / 1.27);
  }

  geo.userData.basePositions = new Float32Array(pos.array);
  uv.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

export function createWorkwearLimbGeometry({ topR, midR, bottomR, length, jointY = 0, radialSegs = 28, heightSegs = 32 }) {
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

export function createUtilityPocket(width, height, trimMat, hardwareMat) {
  const pocketGroup = new THREE.Group();

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

  const button = new THREE.Mesh(new THREE.CylinderGeometry(0.0065, 0.0065, 0.005, 14), hardwareMat);
  button.rotation.x = Math.PI / 2;
  button.position.set(0, hh - flapH * 0.62, 0.019);
  pocketGroup.add(button);

  return pocketGroup;
}