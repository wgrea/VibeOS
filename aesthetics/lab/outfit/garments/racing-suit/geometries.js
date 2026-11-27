// js/aesthetics/lab/outfit/garments/racing-suit/geometries.js
import * as THREE from 'three';
export function createRacingTorsoGeometry() {
const profilePoints = [
[0.01, -0.355], // 0
[0.198, -0.335], // 1
[0.290, -0.27], // 2
[0.314, -0.19], // 3
[0.324, -0.11], // 4 Hips
[0.304, -0.02], // 5
[0.274, 0.08], // 6
[0.268, 0.18], // 7 Lower waist
[0.280, 0.285], // 8 Waist belt seat
[0.302, 0.38], // 9 Lower ribcage
[0.322, 0.48], // 10 Mid torso -> Group 0 ends at ring 10
[0.330, 0.545], // 11 Chest stripe bottom
[0.336, 0.625], // 12 Chest stripe top -> Group 1 ends at ring 12
[0.340, 0.725], // 13 Upper chest
[0.338, 0.835], // 14 Upper chest corner
[0.306, 0.875], // 15 Shoulder slope
[0.208, 0.895], // 16 Collar base
[0.168, 0.905] // 17 Neckline -> Group 2 ends at ring 17
];
const lathePoints = profilePoints.map(([r, y]) => new THREE.Vector2(r, y));
const radialSegs = 56;
const geo = new THREE.LatheGeometry(lathePoints, radialSegs);
geo.rotateY(Math.PI / 2);
geo.clearGroups();
const ringsCount = profilePoints.length - 1;
const indicesPerRing = radialSegs * 6;
geo.addGroup(0, 10 * indicesPerRing, 0);
geo.addGroup(10 * indicesPerRing, 2 * indicesPerRing, 1);
geo.addGroup(12 * indicesPerRing, (ringsCount - 12) * indicesPerRing, 2);
const pos = geo.attributes.position;
const uv = geo.attributes.uv;
for (let i = 0; i < pos.count; i++) {
let x = pos.getX(i);
let y = pos.getY(i);
let z = pos.getZ(i);
const angle = Math.atan2(z, x);

if (y > 0.08 && y < 0.52) {
  const waistMask = Math.exp(-Math.pow((y - 0.29) / 0.16, 2));
  const fold = (Math.sin(y * 52.0 + Math.cos(angle * 2.0) * 1.2) + 1.0) * 0.002 * waistMask;
  x += Math.cos(angle) * fold;
  z += Math.sin(angle) * fold;
}

pos.setXYZ(i, x, y, z);
uv.setXY(i, (angle + Math.PI) / (Math.PI * 2), (y + 0.36) / 1.27);
}
geo.userData.basePositions = new Float32Array(pos.array);
uv.needsUpdate = true;
geo.computeVertexNormals();
return geo;
}
export function createRacingLimbGeometry({ topR, midR, bottomR, length, jointY = 0, radialSegs = 28, heightSegs = 32 }) {
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
  targetR += (Math.sin(y * 78.0) + 1.0) * 0.002 * mask;
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