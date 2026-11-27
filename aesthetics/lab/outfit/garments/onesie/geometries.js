import * as THREE from 'three';

/**
 * Builds a roomy, relaxed kigurumi/onesie torso with soft loft,
 * drop-crotch ease, and gentle fabric drape ripples.
 */
export function createOnesieTorsoGeometry() {
  // Generous silhouette from drop-pelvis (-0.375) up to rolled collar rim (0.925)
  const profilePoints = [
    [0.01, -0.375],
    [0.21, -0.355],
    [0.315, -0.295],
    [0.352, -0.205],
    [0.362, -0.115], // Relaxed hip volume
    [0.348, -0.015],
    [0.324, 0.085],
    [0.312, 0.165],  // Softly bloused waist
    [0.322, 0.265],
    [0.338, 0.375],
    [0.352, 0.495],
    [0.358, 0.615],  // Roomy chest
    [0.354, 0.745],
    [0.346, 0.835],  // Clears mannequin + catsuit shoulder corner
    [0.332, 0.868],  // Full upper-shoulder crest over catsuit (0.285 at 0.872)
    [0.275, 0.890],  // Shoulder-to-collar slope
    [0.195, 0.905],  // Collar base
    [0.165, 0.925],  // Rolled collar outer
    [0.138, 0.925],  // Collar inner lip (clears catsuit 0.125)
    [0.138, 0.870]   // Inner collar lining
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

    // Organic loft & soft horizontal drape folds around waist/hips
    if (y > -0.22 && y < 0.78) {
      const puff = Math.sin(angle * 7.0 + y * 14.0) * 0.0025;
      const waistMask = Math.exp(-Math.pow((y - 0.14) / 0.28, 2));
      const drapeFold = (Math.sin(y * 36.0 + Math.cos(angle * 2.0) * 1.1) + 1.0) * 0.0038 * waistMask;
      const offset = puff + drapeFold;
      x += Math.cos(angle) * offset;
      z += Math.sin(angle) * offset;
    }

    pos.setXYZ(i, x, y, z);

    const u = (angle + Math.PI) / (Math.PI * 2);
    const v = (y + 0.38) / 1.31;
    uv.setXY(i, u, v);
  }

  geo.userData.basePositions = new Float32Array(pos.array);
  uv.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds a softly bloused sleeve or pant leg that gathers slightly above a ribbed cuff.
 */
export function createOnesieLimbGeometry({ topR, midR, cuffGatherR, cuffR, length, radialSegs = 28, heightSegs = 32 }) {
  const geo = new THREE.CylinderGeometry(topR, cuffR, length, radialSegs, heightSegs, false);
  const pos = geo.attributes.position;
  const halfLen = length * 0.5;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    const t = (y + halfLen) / length; // 0 = cuff bottom, 1 = shoulder/hip top
    const angle = Math.atan2(z, x);

    let targetR;
    if (t < 0.09) {
      targetR = cuffR;
    } else if (t < 0.22) {
      const u = (t - 0.09) / 0.13;
      targetR = THREE.MathUtils.lerp(cuffR, cuffGatherR, Math.sin(u * Math.PI * 0.5));
    } else if (t < 0.55) {
      const u = (t - 0.22) / 0.33;
      targetR = THREE.MathUtils.lerp(cuffGatherR, midR, u);
    } else {
      const u = (t - 0.55) / 0.45;
      targetR = THREE.MathUtils.lerp(midR, topR, Math.pow(u, 0.85));
    }

    if (t >= 0.09 && t <= 0.28) {
      const gatherMask = Math.sin(((t - 0.09) / 0.19) * Math.PI);
      targetR += (Math.cos(angle * 8.0) + 1.0) * 0.0032 * gatherMask;
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