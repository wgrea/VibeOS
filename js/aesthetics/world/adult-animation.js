import * as THREE from 'three';

export function createAdultAnimation() {
  const group = new THREE.Group();

  // Cel-shaded toon materials with bold black ink outlines
  function addInkOutline(mesh, thickness = 0.03) {
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x09090b,
      side: THREE.BackSide,
    });
    const outline = new THREE.Mesh(mesh.geometry, outlineMat);
    outline.scale.setScalar(1 + thickness);
    mesh.add(outline);
    return mesh;
  }

  // Western Prime-Time Sitcom Palette (Muted Sage, Burgundy, Warm Human Skin Tone)
  const wallSageMat = new THREE.MeshToonMaterial({ color: 0xa7c4b5 });
  const trimCreamMat = new THREE.MeshToonMaterial({ color: 0xfef3c7 });
  const floorWoodMat = new THREE.MeshToonMaterial({ color: 0x92400e });
  const rugMustardMat = new THREE.MeshToonMaterial({ color: 0xd97706 });
  const couchBurgundyMat = new THREE.MeshToonMaterial({ color: 0x881337 });
  const cushionPlumMat = new THREE.MeshToonMaterial({ color: 0x9f1239 });
  const curtainNavyMat = new THREE.MeshToonMaterial({ color: 0x1e3a8a });
  const plantGreenMat = new THREE.MeshToonMaterial({ color: 0x15803d });
  const potTerracottaMat = new THREE.MeshToonMaterial({ color: 0xc2410c });
  const tvSlateMat = new THREE.MeshToonMaterial({ color: 0x334155 });
  const screenGlowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

  // Character Materials (Natural Human Skin Tone, Dark Hair, Casual Sitcom Outfit)
  const humanSkinMat = new THREE.MeshToonMaterial({ color: 0xeab696 });
  const hairBrownMat = new THREE.MeshToonMaterial({ color: 0x291d18 });
  const hoodieTealMat = new THREE.MeshToonMaterial({ color: 0x0f766e });
  const jeansDenimMat = new THREE.MeshToonMaterial({ color: 0x1e3a8a });
  const sneakerWhiteMat = new THREE.MeshToonMaterial({ color: 0xf1f5f9 });
  const inkBlackMat = new THREE.MeshBasicMaterial({ color: 0x09090b });

  // Flat Toon Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.88);
  const keyLight = new THREE.DirectionalLight(0xfffbeb, 0.85);
  keyLight.position.set(2.5, 4, 3);
  group.add(ambientLight, keyLight);

  // =========================================================================
  // 1. ANCHORED / STATIC STAGE: Suburban Sitcom Living Room
  // =========================================================================
  const room = new THREE.Group();

  const floor = addInkOutline(
    new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.14, 2.4), floorWoodMat),
    0.015
  );
  floor.position.set(0, -0.82, 0);

  const backWall = addInkOutline(
    new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.9, 0.12), wallSageMat),
    0.015
  );
  backWall.position.set(0, 0.08, -1.14);

  const baseboard = addInkOutline(
    new THREE.Mesh(new THREE.BoxGeometry(3.42, 0.14, 0.14), trimCreamMat),
    0.015
  );
  baseboard.position.set(0, -0.68, -1.13);

  const rug = addInkOutline(
    new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.03, 1.3), rugMustardMat),
    0.02
  );
  rug.position.set(-0.05, -0.74, 0.18);

  // Suburban Living Room Window with Curtains & Yard View
  const windowGroup = new THREE.Group();
  const windowFrame = addInkOutline(
    new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.66, 0.05), trimCreamMat),
    0.03
  );
  const windowSky = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.54, 0.06),
    new THREE.MeshBasicMaterial({ color: 0xbae6fd })
  );
  const windowBushes = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.18, 0.065),
    plantGreenMat
  );
  windowBushes.position.y = -0.18;

  const mullionV = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.54, 0.075), trimCreamMat);
  const mullionH = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.03, 0.075), trimCreamMat);

  const curtainL = addInkOutline(
    new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.74, 0.08), curtainNavyMat),
    0.04
  );
  curtainL.position.set(-0.46, -0.02, 0.02);

  const curtainR = curtainL.clone();
  curtainR.position.set(0.46, -0.02, 0.02);

  windowGroup.add(windowFrame, windowSky, windowBushes, mullionV, mullionH, curtainL, curtainR);
  windowGroup.position.set(-0.2, 0.42, -1.06);

  // Corner Potted Houseplant
  const plantGroup = new THREE.Group();
  const pot = addInkOutline(
    new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.26, 12), potTerracottaMat),
    0.04
  );
  const leaves = addInkOutline(
    new THREE.Mesh(new THREE.DodecahedronGeometry(0.24, 0), plantGreenMat),
    0.04
  );
  leaves.position.y = 0.26;
  plantGroup.add(pot, leaves);
  plantGroup.position.set(-1.32, -0.62, -0.75);

  room.add(floor, backWall, baseboard, rug, windowGroup, plantGroup);

  // Burgundy Sitcom Sofa
  const couch = new THREE.Group();
  const couchBase = addInkOutline(
    new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.32, 0.6), couchBurgundyMat),
    0.025
  );
  const couchBack = addInkOutline(
    new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 0.2), cushionPlumMat),
    0.025
  );
  couchBack.position.set(0, 0.3, -0.2);

  const armL = addInkOutline(
    new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.44, 0.62), couchBurgundyMat),
    0.035
  );
  armL.position.set(-0.72, 0.08, 0);
  const armR = armL.clone();
  armR.position.set(0.72, 0.08, 0);

  couch.add(couchBase, couchBack, armL, armR);
  couch.position.set(-0.2, -0.59, -0.68);
  room.add(couch);

  // Retro CRT TV on Credenza
  const tvSet = new THREE.Group();
  const stand = addInkOutline(
    new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.34, 0.46), floorWoodMat),
    0.03
  );
  stand.position.y = -0.17;

  const bezel = addInkOutline(
    new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.48, 0.44), tvSlateMat),
    0.035
  );
  bezel.position.y = 0.23;

  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.34, 0.04), screenGlowMat);
  screen.position.set(-0.03, 0.23, 0.21);

  const antGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.32, 6);
  const antL = addInkOutline(new THREE.Mesh(antGeo, inkBlackMat), 0.15);
  antL.position.set(-0.1, 0.58, 0);
  antL.rotation.z = 0.42;

  const antR = addInkOutline(new THREE.Mesh(antGeo, inkBlackMat), 0.15);
  antR.position.set(0.1, 0.58, 0);
  antR.rotation.z = -0.42;

  tvSet.add(stand, bezel, screen, antL, antR);
  tvSet.position.set(1.08, -0.4, 0.35);
  tvSet.rotation.y = -0.68;
  room.add(tvSet);

  group.add(room);

  // =========================================================================
  // 2. MOVABLE ELEMENT: Original Adult-Animation Character
  // =========================================================================
  const character = new THREE.Group();

  const legL = addInkOutline(
    new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.062, 0.34, 10), jeansDenimMat),
    0.06
  );
  legL.position.set(-0.085, 0.19, 0);

  const legR = legL.clone();
  legR.position.set(0.085, 0.19, 0);

  const shoeL = addInkOutline(
    new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.075, 0.21), sneakerWhiteMat),
    0.07
  );
  shoeL.position.set(-0.085, 0.04, 0.035);

  const shoeR = shoeL.clone();
  shoeR.position.set(0.085, 0.04, 0.035);

  const torso = addInkOutline(
    new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.42, 12), hoodieTealMat),
    0.045
  );
  torso.position.set(0, 0.54, 0);

  const armLGroup = new THREE.Group();
  const sleeveL = addInkOutline(
    new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.048, 0.24, 8), hoodieTealMat),
    0.07
  );
  const handL = addInkOutline(
    new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 10), humanSkinMat),
    0.08
  );
  handL.position.y = -0.14;
  armLGroup.add(sleeveL, handL);
  armLGroup.position.set(-0.21, 0.56, 0);
  armLGroup.rotation.z = 0.18;

  const armRGroup = armLGroup.clone();
  armRGroup.position.set(0.21, 0.56, 0);
  armRGroup.rotation.z = -0.18;

  const head = addInkOutline(
    new THREE.Mesh(new THREE.SphereGeometry(0.155, 16, 16), humanSkinMat),
    0.045
  );
  head.scale.set(0.95, 1.08, 0.95);
  head.position.set(0, 0.89, 0);

  const hairCap = addInkOutline(
    new THREE.Mesh(
      new THREE.SphereGeometry(0.162, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
      hairBrownMat
    ),
    0.045
  );
  hairCap.position.set(0, 0.91, -0.01);
  hairCap.rotation.x = -0.18;

  const eyeGeo = new THREE.SphereGeometry(0.036, 10, 10);
  const pupilGeo = new THREE.SphereGeometry(0.014, 8, 8);

  const eyeL = addInkOutline(new THREE.Mesh(eyeGeo, sneakerWhiteMat), 0.1);
  eyeL.position.set(-0.05, 0.9, 0.135);
  const pupilL = new THREE.Mesh(pupilGeo, inkBlackMat);
  pupilL.position.set(0, 0, 0.032);
  eyeL.add(pupilL);

  const eyeR = addInkOutline(new THREE.Mesh(eyeGeo, sneakerWhiteMat), 0.1);
  eyeR.position.set(0.05, 0.9, 0.135);
  const pupilR = new THREE.Mesh(pupilGeo, inkBlackMat);
  pupilR.position.set(0, 0, 0.032);
  eyeR.add(pupilR);

  const nose = addInkOutline(
    new THREE.Mesh(new THREE.ConeGeometry(0.024, 0.06, 8), humanSkinMat),
    0.08
  );
  nose.rotation.x = Math.PI / 2;
  nose.position.set(0, 0.87, 0.165);

  character.add(
    legL,
    legR,
    shoeL,
    shoeR,
    torso,
    armLGroup,
    armRGroup,
    head,
    hairCap,
    eyeL,
    eyeR,
    nose
  );
  character.position.set(-0.15, -0.74, 0.25);
  group.add(character);

  // =========================================================================
  // 3. CONTINUOUS HOLD MOVEMENT (WASD + ARROW KEYS)
  // =========================================================================
  const bounds = { minX: -1.15, maxX: 0.62, minZ: -0.22, maxZ: 0.82 };
  const heldKeys = new Set();
  const moveSpeed = 1.25; // units per second
  let walkCycle = 0;
  let lastTime = null;

  function moveCharacter(dx, dz) {
    character.position.x = THREE.MathUtils.clamp(character.position.x + dx, bounds.minX, bounds.maxX);
    character.position.z = THREE.MathUtils.clamp(character.position.z + dz, bounds.minZ, bounds.maxZ);

    if (dx !== 0 || dz !== 0) {
      character.rotation.y = Math.atan2(dx, dz);
    }
  }

  const handleKeyDown = (e) => {
if (!group.parent) return;
const tag = e.target && e.target.tagName;
if (tag === 'INPUT' || tag === 'TEXTAREA') return;
const key = e.key.toLowerCase();
if (
key === 'arrowleft' ||
key === 'arrowright' ||
key === 'arrowup' ||
key === 'arrowdown' ||
key === 'w' ||
key === 'a' ||
key === 's' ||
key === 'd'
) {
e.preventDefault();
heldKeys.add(key);
}
};
const handleKeyUp = (e) => {
heldKeys.delete(e.key.toLowerCase());
};
const handleBlur = () => {
heldKeys.clear();
};
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
window.addEventListener('blur', handleBlur);
return {
group,
description:
'Cel-shaded prime-time sitcom living room with sage-green walls, a burgundy sofa, black ink outlines, and a movable character (hold Arrow keys or WASD to walk continuously around the rug).',
moveCharacter,
dispose() {
window.removeEventListener('keydown', handleKeyDown);
window.removeEventListener('keyup', handleKeyUp);
window.removeEventListener('blur', handleBlur);
heldKeys.clear();
},
background: 'linear-gradient(180deg, #334155 0%, #64748b 50%, #d97706 100%)',
update(t, bounce, spring) {
const dt = lastTime === null ? 0.016 : Math.min(t - lastTime, 0.05);
lastTime = t;
// Continuous movement while any direction key is held
let inputX = 0;
let inputZ = 0;
if (heldKeys.has('arrowleft') || heldKeys.has('a')) inputX -= 1;
if (heldKeys.has('arrowright') || heldKeys.has('d')) inputX += 1;
if (heldKeys.has('arrowup') || heldKeys.has('w')) inputZ -= 1;
if (heldKeys.has('arrowdown') || heldKeys.has('s')) inputZ += 1;
if (inputX !== 0 || inputZ !== 0) {
const len = Math.hypot(inputX, inputZ);
const dx = (inputX / len) * moveSpeed * dt;
const dz = (inputZ / len) * moveSpeed * dt;
moveCharacter(dx, dz);
walkCycle += dt * 11;
} else {
// Smoothly return limbs to neutral idle stance when keys are released
walkCycle *= 0.85;
}
const stride = Math.sin(walkCycle) * 0.55;
legL.rotation.x = stride;
legR.rotation.x = -stride;
armLGroup.rotation.x = -stride * 0.75;
armRGroup.rotation.x = stride * 0.75;
// Quantized low-FPS TV flicker & subtle head nod
const stepped = Math.floor(t * 8) / 8;
screenGlowMat.color.setHex(Math.sin(stepped * 12) > 0 ? 0x38bdf8 : 0x7dd3fc);
head.rotation.z = Math.sin(stepped * 2.5) * 0.035;
hairCap.rotation.z = head.rotation.z;
group.scale.setScalar(1 + spring * 0.24);
},
};
}