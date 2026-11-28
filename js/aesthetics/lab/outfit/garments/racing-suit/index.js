// js/aesthetics/lab/outfit/garments/racing-suit/index.js
import * as THREE from 'three';
import { buildClosure } from '../../closures.js';
import { createRacingTorsoGeometry, createRacingLimbGeometry } from './geometries.js';
import { morphRacingTorso } from './sizing.js';
export function buildRacingSuit(initialHex = 0xb91c1c) {
const garmentGroup = new THREE.Group();
const zoneMats = Array.from(
{ length: 8 },
() => new THREE.MeshPhysicalMaterial({ color: initialHex, side: THREE.DoubleSide })
);
const hardwareMat = new THREE.MeshStandardMaterial({
color: 0xd1d5db,
roughness: 0.24,
metalness: 0.88
});
// 1. Collar
const collarGroup = new THREE.Group();
collarGroup.position.y = 0.935;
const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.146, 0.168, 0.080, 40, 1, true), zoneMats[2]);
collar.castShadow = true;
collarGroup.add(collar);
const collarLip = new THREE.Mesh(new THREE.TorusGeometry(0.146, 0.008, 10, 40), zoneMats[2]);
collarLip.rotation.x = Math.PI / 2;
collarLip.position.y = 0.040;
collarGroup.add(collarLip);
const collarStrap = new THREE.Mesh(
new THREE.CylinderGeometry(0.154, 0.164, 0.044, 20, 1, false, -0.35, 0.95),
zoneMats[3]
);
collarStrap.position.set(0, -0.008, 0.004);
collarGroup.add(collarStrap);
const strapRivet = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.006, 12), hardwareMat);
strapRivet.rotation.x = Math.PI / 2;
strapRivet.position.set(0.102, -0.008, 0.125);
collarGroup.add(strapRivet);
garmentGroup.add(collarGroup);
// 2. Torso
const torsoGeo = createRacingTorsoGeometry();
const torso = new THREE.Mesh(torsoGeo, [zoneMats[0], zoneMats[3], zoneMats[1]]);
torso.castShadow = true;
torso.receiveShadow = true;
garmentGroup.add(torso);
// 3. Waist Belt
const beltGroup = new THREE.Group();
beltGroup.position.y = 0.288;
const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.287, 0.278, 0.068, 48), zoneMats[2]);
belt.castShadow = true;
beltGroup.add(belt);
[{ y: -0.032, r: 0.279 }, { y: 0.032, r: 0.287 }].forEach(({ y, r }) => {
const beltPiping = new THREE.Mesh(new THREE.TorusGeometry(r, 0.0032, 8, 48), zoneMats[3]);
beltPiping.rotation.x = Math.PI / 2;
beltPiping.position.y = y;
beltGroup.add(beltPiping);
});
const buckleGroup = new THREE.Group();
buckleGroup.position.set(0, 0, 0.286);
const buckleFrame = new THREE.Mesh(new THREE.BoxGeometry(0.086, 0.058, 0.014), hardwareMat);
buckleGroup.add(buckleFrame);
const buckleCenter = new THREE.Mesh(new THREE.BoxGeometry(0.058, 0.036, 0.016), zoneMats[2]);
buckleGroup.add(buckleCenter);
const buckleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.054, 10), hardwareMat);
buckleBar.position.z = 0.008;
buckleGroup.add(buckleBar);
beltGroup.add(buckleGroup);
garmentGroup.add(beltGroup);
// 4. Closure
const { closureGroup, setClosureType, setDepth } = buildClosure({
type: 'zipper',
yTop: 0.88,
yBottom: 0.16,
zOffset: 0.245,
waistDropZ: 0.045,
topDropZ: 0.025
});
garmentGroup.add(closureGroup);
// 5. Limbs & Epaulettes
const arms = [];
const legs = [];
const sleeveGeo = createRacingLimbGeometry({ topR: 0.114, midR: 0.105, bottomR: 0.095, length: 0.74, jointY: 0.01 });
const legGeo = createRacingLimbGeometry({ topR: 0.144, midR: 0.133, bottomR: 0.123, length: 0.92, jointY: 0.03 });
[-1, 1].forEach((side) => {
const shoulderCover = new THREE.Mesh(new THREE.SphereGeometry(0.116, 20, 16), zoneMats[1]);
shoulderCover.position.set(side * 0.325, 0.735, 0);
garmentGroup.add(shoulderCover);

const shoulderPad = new THREE.Mesh(new THREE.SphereGeometry(0.114, 20, 16), zoneMats[1]);
shoulderPad.scale.set(1.15, 0.74, 1.05);
shoulderPad.position.set(side * 0.35, 0.79, 0);
garmentGroup.add(shoulderPad);

const epauletteGroup = new THREE.Group();
epauletteGroup.position.set(side * 0.245, 0.892, 0);
epauletteGroup.rotation.z = side * -0.18;

const strapBase = new THREE.Mesh(new THREE.BoxGeometry(0.135, 0.016, 0.058), zoneMats[4]);
strapBase.castShadow = true;
epauletteGroup.add(strapBase);

const grabLoop = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.0075, 10, 20, Math.PI), zoneMats[3]);
grabLoop.scale.set(1.3, 0.45, 1.0);
grabLoop.position.y = 0.006;
epauletteGroup.add(grabLoop);

[-0.056, 0.056].forEach((rx) => {
  const rivet = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.006, 12), hardwareMat);
  rivet.position.set(rx, 0.009, 0);
  epauletteGroup.add(rivet);
});
garmentGroup.add(epauletteGroup);

const armPivot = new THREE.Group();
armPivot.position.set(side * 0.44, 0.38, 0);
armPivot.rotation.z = side * -0.18;

const arm = new THREE.Mesh(sleeveGeo, zoneMats[5]);
arm.castShadow = true;
arm.receiveShadow = true;
armPivot.add(arm);

const upperArmCap = new THREE.Mesh(new THREE.SphereGeometry(0.114, 20, 14), zoneMats[5]);
upperArmCap.position.y = 0.37;
armPivot.add(upperArmCap);

const sleeveBand = new THREE.Mesh(new THREE.CylinderGeometry(0.111, 0.109, 0.088, 28, 1, true), zoneMats[3]);
sleeveBand.position.y = 0.16;
armPivot.add(sleeveBand);

const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.097, 0.094, 0.078, 24), zoneMats[2]);
cuff.position.y = -0.365;
armPivot.add(cuff);

const cuffCap = new THREE.Mesh(new THREE.SphereGeometry(0.094, 18, 12), zoneMats[2]);
cuffCap.position.y = -0.402;
armPivot.add(cuffCap);

garmentGroup.add(armPivot);
arms.push({ mesh: armPivot, shoulderCover, shoulderPad, epaulette: epauletteGroup, side });

const legPivot = new THREE.Group();
legPivot.position.set(side * 0.155, -0.62, 0);
legPivot.rotation.z = side * -0.04;

const leg = new THREE.Mesh(legGeo, zoneMats[0]);
leg.castShadow = true;
leg.receiveShadow = true;
legPivot.add(leg);

const hipCap = new THREE.Mesh(new THREE.SphereGeometry(0.144, 20, 14), zoneMats[0]);
hipCap.position.y = 0.46;
legPivot.add(hipCap);

const kneeGroup = new THREE.Group();
kneeGroup.position.set(0, 0.03, 0);
const kneeBase = new THREE.Mesh(
  new THREE.CylinderGeometry(0.138, 0.136, 0.165, 24, 1, false, -0.58, 1.16),
  zoneMats[6]
);
kneeBase.castShadow = true;
kneeGroup.add(kneeBase);

[-0.048, -0.016, 0.016, 0.048].forEach((ky) => {
  const bolster = new THREE.Mesh(new THREE.TorusGeometry(0.137, 0.0055, 8, 24, 1.12), zoneMats[3]);
  bolster.rotation.set(Math.PI / 2, 0, Math.PI / 2 - 0.56);
  bolster.position.y = ky;
  kneeGroup.add(bolster);
});
legPivot.add(kneeGroup);

const stripeStartAngle = side === 1 ? Math.PI * 0.5 - 0.34 : -Math.PI * 0.5 - 0.34;
const legStripe = new THREE.Mesh(
  new THREE.CylinderGeometry(0.145, 0.126, 0.88, 20, 1, true, stripeStartAngle, 0.68),
  zoneMats[7]
);
legStripe.position.y = 0.01;
legPivot.add(legStripe);

const ankleCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.126, 0.122, 0.075, 24), zoneMats[2]);
ankleCuff.position.y = -0.465;
legPivot.add(ankleCuff);

const ankleCap = new THREE.Mesh(new THREE.SphereGeometry(0.122, 18, 12), zoneMats[2]);
ankleCap.position.y = -0.50;
legPivot.add(ankleCap);

garmentGroup.add(legPivot);
legs.push({ mesh: legPivot, side });
});
function applyStyle(fabricPreset, colorPreset, palette, multiColors = []) {
zoneMats.forEach((mat) => {
Object.assign(mat, fabricPreset.mat);
mat.needsUpdate = true;
});

if (palette && palette.primary !== null) {
  const palList = [palette.primary, palette.secondary, palette.accent];
  zoneMats.forEach((mat, idx) => {
    mat.color.setHex(palList[idx % palList.length]);
    if (mat.sheenColor) {
      mat.sheenColor.copy(mat.color).lerp(new THREE.Color(0xffffff), 0.35);
    }
  });
  return;
}

if (Array.isArray(multiColors) && multiColors.length > 0) {
  zoneMats.forEach((mat, idx) => {
    const swatch = multiColors[idx % multiColors.length];
    mat.color.setHex(swatch.hex);
    if (mat.sheenColor) {
      mat.sheenColor.copy(mat.color).lerp(new THREE.Color(0xffffff), 0.35);
    }
  });
  return;
}

const fallback = [colorPreset.hex, 0xf8fafc, 0x111318, 0xf8fafc, 0x111318, colorPreset.hex, 0x111318, 0xf8fafc];
zoneMats.forEach((mat, idx) => {
  mat.color.setHex(fallback[idx]);
  if (mat.sheenColor) {
    mat.sheenColor.copy(mat.color).lerp(new THREE.Color(0xffffff), 0.35);
  }
});
}
function syncBody(profile) {
const [chestX, , chestZ] = profile.chestScale;
const [hipX, , hipZ] = profile.hipScale;

morphRacingTorso(torsoGeo, profile.chestScale, profile.hipScale);

const collarX = THREE.MathUtils.lerp(chestX, 1.03, 0.60);
const collarZ = THREE.MathUtils.lerp(chestZ, 1.03, 0.60);
collarGroup.scale.set(collarX, 1, collarZ);

const beltT = THREE.MathUtils.smoothstep(0.288, 0.14, 0.56);
beltGroup.scale.set(
  THREE.MathUtils.lerp(hipX, chestX, beltT),
  1,
  THREE.MathUtils.lerp(hipZ, chestZ, beltT)
);

const armScale = (profile.armRadius + 0.032) / 0.104;
const legScale = (profile.legRadius + 0.036) / 0.134;

arms.forEach(({ mesh, shoulderCover, shoulderPad, epaulette, side }) => {
  mesh.position.x = side * profile.armOffset;
  mesh.scale.set(armScale, 1, armScale);
  shoulderCover.position.set(side * (profile.armOffset - 0.115), 0.735, 0);
  shoulderCover.scale.setScalar(armScale);
  shoulderPad.position.x = side * (profile.armOffset - 0.09);
  shoulderPad.scale.set(armScale * 1.15, armScale * 0.74, armScale * 1.05);
  epaulette.position.x = side * (0.245 * chestX);
});

legs.forEach(({ mesh, side }) => {
  mesh.position.x = side * profile.legOffset;
  mesh.scale.set(legScale, 1, legScale);
});

setDepth(0.340 * chestZ + 0.008);
}
return { garmentGroup, applyStyle, syncBody, setClosureType };
}