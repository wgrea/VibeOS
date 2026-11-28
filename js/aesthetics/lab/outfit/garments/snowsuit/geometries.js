import * as THREE from 'three';

export function createSnowsuitTorsoGeometry() {
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
    [0.304, 0.385],  // 9 Lower ribcage
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

  geo.addGroup(0, 11 * indicesPerRing, 0);
  geo.addGroup(11 * indicesPerRing, (ringsCount - 11) * indicesPerRing, 1);

  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);
    const angle = Math.atan2(z, x);

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

export function createContouredBaffleGeometry(radius, yPos, tubeRadius = 0.025) {
  const geo = new THREE.TorusGeometry(radius, tubeRadius, 14, 56);
  geo.rotateX(Math.PI / 2);
  geo.translate(0, yPos, 0);
  geo.userData.basePositions = new Float32Array(geo.attributes.position.array);
  return geo;
}

export function createInsulatedLimbGeometry({ topR, midR, bottomR, length, radialSegs = 28, heightSegs = 32 }) {
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