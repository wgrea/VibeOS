// js/aesthetics/kidcore/polynesian-tropical.js
import * as THREE from 'three';

export function createPolynesianTropical() {
  const group = new THREE.Group();

  const hibiscusPink = new THREE.MeshPhysicalMaterial({
    color: 0xff5e7e,
    emissive: 0xf43f5e,
    emissiveIntensity: 0.18,
    roughness: 0.3,
    clearcoat: 0.4,
  });

  const tikiWoodMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.52,
  });

  const tikiCarveMat = new THREE.MeshStandardMaterial({
    color: 0x92400e,
    roughness: 0.65,
  });

  const palmGreenMat = new THREE.MeshPhysicalMaterial({
    color: 0x22c55e,
    roughness: 0.32,
    clearcoat: 0.4,
  });

  const fieldGrassMat = new THREE.MeshStandardMaterial({
    color: 0x84cc16,
    roughness: 0.58,
  });

  const sandMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    roughness: 0.72,
  });

  const sandSpeckleMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.8,
  });

  const coralTubeMat = new THREE.MeshPhysicalMaterial({
    color: 0xfb7185,
    roughness: 0.4,
    clearcoat: 0.3,
  });

  const jellyPinkMat = new THREE.MeshPhysicalMaterial({
    color: 0xf472b6,
    emissive: 0xec4899,
    emissiveIntensity: 0.32,
    roughness: 0.15,
    clearcoat: 0.85,
    transparent: true,
    opacity: 0.8,
  });

  const jellyBlueMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.35,
    roughness: 0.15,
    clearcoat: 0.85,
    transparent: true,
    opacity: 0.82,
  });

  const aquaBubbleMat = new THREE.MeshPhysicalMaterial({
    color: 0x67e8f9,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.25,
    roughness: 0.08,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.72,
  });

  const yellowEyeMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x1e1b4b });

  function buildJellyfish(mat, scale = 1) {
    const jf = new THREE.Group();
    const bell = new THREE.Mesh(
      new THREE.SphereGeometry(0.19 * scale, 18, 16, 0, Math.PI * 2, 0, Math.PI * 0.58),
      mat
    );
    jf.add(bell);

    const tentacles = [];
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const ten = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012 * scale, 0.008 * scale, 0.26 * scale, 8),
        mat
      );
      ten.position.set(Math.cos(a) * 0.08 * scale, -0.14 * scale, Math.sin(a) * 0.08 * scale);
      jf.add(ten);
      tentacles.push(ten);
    }
    return { mesh: jf, bell, tentacles };
  }

  // 1. Carved Bikini Bottom Tiki Totem
  const tikiGroup = new THREE.Group();
  const totem = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 1.2, 20), tikiWoodMat);
  tikiGroup.add(totem);

  const brow = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.1, 0.2), tikiCarveMat);
  brow.position.set(0, 0.25, 0.36);

  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.26, 0.22), tikiCarveMat);
  nose.position.set(0, 0.06, 0.4);

  const mouthFrame = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.2, 0.17), tikiCarveMat);
  mouthFrame.position.set(0, -0.23, 0.37);

  for (let i = -2; i <= 2; i++) {
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.072, 0.11, 0.05), yellowEyeMat);
    tooth.position.set(i * 0.09, -0.23, 0.45);
    tikiGroup.add(tooth);
  }

  [-0.16, 0.16].forEach((xSide) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 14), yellowEyeMat);
    eye.position.set(xSide, 0.13, 0.4);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.038, 10, 10), pupilMat);
    pupil.position.set(xSide, 0.13, 0.47);
    tikiGroup.add(eye, pupil);
  });

  tikiGroup.add(brow, nose, mouthFrame);

  // Tropical Leaf & Hibiscus Crown
  const crown = new THREE.Group();
  crown.position.y = 0.65;

  const leafGeo = new THREE.ConeGeometry(0.13, 0.52, 8);
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const leaf = new THREE.Mesh(leafGeo, palmGreenMat);
    leaf.position.set(Math.cos(a) * 0.21, 0.17, Math.sin(a) * 0.21);
    leaf.rotation.z = -Math.cos(a) * 0.55;
    leaf.rotation.x = Math.sin(a) * 0.55;
    crown.add(leaf);
  }

  const flower = new THREE.Group();
  const petalGeo = new THREE.SphereGeometry(0.2, 16, 16);
  petalGeo.scale(0.8, 1.3, 0.2);

  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const petal = new THREE.Mesh(petalGeo, hibiscusPink);
    petal.position.set(Math.cos(a) * 0.24, 0, Math.sin(a) * 0.24);
    petal.rotation.x = Math.PI / 2;
    petal.rotation.z = -a;
    flower.add(petal);
  }
  const stamen = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 12), yellowEyeMat);
  flower.add(stamen);
  flower.position.set(0.22, 0.11, 0.32);
  flower.rotation.x = 0.65;
  crown.add(flower);

  tikiGroup.add(crown);
  group.add(tikiGroup);

  // 2. Speckled Sand Floor + Separate Jellyfish Fields Grass Patch
  const floorGroup = new THREE.Group();
  floorGroup.position.y = -0.68;

  // Main speckled sand island
  const sandFloor = new THREE.Mesh(new THREE.CylinderGeometry(1.38, 1.56, 0.18, 32), sandMat);
  sandFloor.position.x = -0.18;
  floorGroup.add(sandFloor);

  // Speckled sand dots (purely on the sand, no grass on sand)
  const dotGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.015, 8);
  for (let i = 0; i < 45; i++) {
    const angle = i * 2.39996;
    const radius = 0.46 + (i / 45) * 0.84;
    const dot = new THREE.Mesh(dotGeo, sandSpeckleMat);
    dot.scale.setScalar(0.65 + (i % 4) * 0.28);
    dot.position.set(-0.18 + Math.cos(angle) * radius, 0.092, Math.sin(angle) * radius);
    floorGroup.add(dot);
  }

  // Separate Jellyfish Fields Green Grass Mound Set to the Right
  const fieldPatch = new THREE.Group();
  fieldPatch.position.set(1.08, 0.02, 0.12);

  const grassMound = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.78, 0.19, 24), fieldGrassMat);
  fieldPatch.add(grassMound);

  const grassBlades = [];
  const bladeGeo = new THREE.ConeGeometry(0.026, 0.26, 6);
  bladeGeo.translate(0, 0.13, 0);
  const patchOffsets = [
    [-0.22, -0.18],
    [0.12, -0.25],
    [0.28, 0.08],
    [-0.08, 0.24],
    [0.05, 0.02],
  ];

  patchOffsets.forEach(([bx, bz], idx) => {
    for (let b = 0; b < 3; b++) {
      const blade = new THREE.Mesh(bladeGeo, palmGreenMat);
      blade.scale.y = 0.72 + (b % 3) * 0.22;
      blade.position.set(bx + (b - 1) * 0.035, 0.09, bz + (b % 2) * 0.025);
      blade.rotation.z = (b - 1) * 0.2;
      fieldPatch.add(blade);
      grassBlades.push({ mesh: blade, baseZ: (b - 1) * 0.2, phase: idx + b });
    }
  });

  floorGroup.add(fieldPatch);

  // Wooden Ship Barrel on the sand
  const barrel = new THREE.Group();
  const barrelBody = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.14, 0.32, 14), tikiWoodMat);
  barrelBody.position.y = 0.16;
  const hoopGeo = new THREE.TorusGeometry(0.148, 0.013, 8, 18);
  hoopGeo.rotateX(Math.PI / 2);
  const hoopTop = new THREE.Mesh(hoopGeo, tikiCarveMat);
  hoopTop.position.y = 0.25;
  const hoopBot = new THREE.Mesh(hoopGeo, tikiCarveMat);
  hoopBot.position.y = 0.08;
  barrel.add(barrelBody, hoopTop, hoopBot);
  barrel.position.set(-0.95, 0.08, 0.34);
  barrel.rotation.z = 0.12;
  floorGroup.add(barrel);

  // Pink Sea-Coral Tube Cluster on the grass edge
  const coralCluster = new THREE.Group();
  const tube1 = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.084, 0.28, 12), coralTubeMat);
  tube1.position.y = 0.14;
  const tube2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.064, 0.19, 12), coralTubeMat);
  tube2.position.set(0.1, 0.095, 0.04);
  tube2.rotation.z = -0.22;
  coralCluster.add(tube1, tube2);
  coralCluster.position.set(1.38, 0.09, 0.36);
  floorGroup.add(coralCluster);

    // Iconic Rounded SpongeBob Purple Pillars (Jellyfish Fields)
  const purpleRockMat = new THREE.MeshStandardMaterial({
    color: 0x7e22ce,
    roughness: 0.72,
  });

  const rockConfigs = [
    { x: -1.15, z: -0.68, rx: 0.28, ry: 0.56, rz: 0.26, tiltZ: 0.06 },
    { x: -0.82, z: -0.82, rx: 0.22, ry: 0.38, rz: 0.21, tiltZ: -0.05 },
    { x: 1.18, z: -0.62, rx: 0.3, ry: 0.62, rz: 0.28, tiltZ: -0.06 },
    { x: 0.85, z: -0.78, rx: 0.2, ry: 0.34, rz: 0.2, tiltZ: 0.04 },
  ];

  rockConfigs.forEach((cfg) => {
    // High-segment sphere scaled vertically creates smooth, bulbous cartoon rock domes
    const rock = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 18), purpleRockMat);
    rock.scale.set(cfg.rx, cfg.ry, cfg.rz);
    rock.position.set(cfg.x, cfg.ry * 0.65, cfg.z);
    rock.rotation.z = cfg.tiltZ;
    floorGroup.add(rock);
  });


  group.add(floorGroup);

  // 3. Controllable Hero Jellyfish (WASD / Arrow Keys + Draggable)
  const heroJelly = buildJellyfish(jellyPinkMat, 1.15);
  heroJelly.mesh.position.set(0.95, 0.58, 0.35);
  group.add(heroJelly.mesh);

  const keysPressed = {};
  const onKeyDown = (e) => {
    const k = e.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
      keysPressed[k] = true;
    }
  };
  const onKeyUp = (e) => {
    const k = e.key.toLowerCase();
    keysPressed[k] = false;
  };
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  // 4. Ambient Swarm of Jellyfish Fields Jellyfish
  const ambientConfigs = [
    { mat: jellyPinkMat, scale: 0.78, x: -1.02, y: 0.68, z: 0.15, speed: 1.1, phase: 0 },
    { mat: jellyBlueMat, scale: 0.85, x: -0.78, y: 0.12, z: -0.45, speed: 0.9, phase: 2.1 },
    { mat: jellyPinkMat, scale: 0.68, x: 0.72, y: 0.08, z: -0.52, speed: 1.25, phase: 4.2 },
  ];

  const ambientJellies = ambientConfigs.map((cfg) => {
    const jf = buildJellyfish(cfg.mat, cfg.scale);
    jf.mesh.position.set(cfg.x, cfg.y, cfg.z);
    group.add(jf.mesh);
    return { ...jf, ...cfg };
  });

  // 5. Dense Bikini Bottom Line-Art Sky-Flowers (12 Outline Loops)
  const skyFlowerConfigs = [
    { x: -1.55, y: 1.12, z: -1.0, scale: 0.88, color: 0xff5e7e, speed: 0.35 },
    { x: -0.95, y: 1.32, z: -1.18, scale: 0.62, color: 0x38bdf8, speed: 0.28 },
    { x: -0.35, y: 1.18, z: -1.1, scale: 0.54, color: 0xfacc15, speed: -0.34 },
    { x: 0.38, y: 1.26, z: -1.15, scale: 0.66, color: 0xa3e635, speed: 0.31 },
    { x: 0.96, y: 1.28, z: -1.12, scale: 0.6, color: 0xff5e7e, speed: -0.32 },
    { x: 1.56, y: 1.05, z: -1.02, scale: 0.92, color: 0xc084fc, speed: -0.3 },
    { x: -1.68, y: 0.45, z: -0.9, scale: 0.72, color: 0xa3e635, speed: 0.45 },
    { x: -1.22, y: 0.62, z: -1.05, scale: 0.52, color: 0xfacc15, speed: -0.38 },
    { x: 1.24, y: 0.66, z: -1.04, scale: 0.56, color: 0x38bdf8, speed: 0.42 },
    { x: 1.66, y: 0.38, z: -0.92, scale: 0.76, color: 0xfacc15, speed: -0.4 },
    { x: -1.48, y: -0.15, z: -0.85, scale: 0.64, color: 0xc084fc, speed: 0.36 },
{ x: 1.52, y: -0.18, z: -0.88, scale: 0.68, color: 0xff5e7e, speed: -0.35 },
];
const skyFlowers = skyFlowerConfigs.map((cfg) => {
const sf = new THREE.Group();
const lineMat = new THREE.MeshBasicMaterial({
color: cfg.color,
transparent: true,
opacity: 0.68,
});
const petalRingGeo = new THREE.TorusGeometry(0.11, 0.011, 8, 20);
for (let i = 0; i < 5; i++) {
const a = (i / 5) * Math.PI * 2;
const loop = new THREE.Mesh(petalRingGeo, lineMat);
loop.position.set(Math.cos(a) * 0.16, Math.sin(a) * 0.16, 0);
sf.add(loop);
}
const centerLoop = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.011, 8, 20), lineMat);
sf.add(centerLoop);
sf.position.set(cfg.x, cfg.y, cfg.z);
sf.scale.setScalar(cfg.scale);
group.add(sf);
return { mesh: sf, baseY: cfg.y, speed: cfg.speed };
});
// 6. Rising Underwater Lagoon Bubbles
const bubbles = [];
for (let i = 0; i < 12; i++) {
const radius = 0.055 + (i % 3) * 0.03;
const b = new THREE.Mesh(new THREE.SphereGeometry(radius, 14, 14), aquaBubbleMat);
const angle = (i / 12) * Math.PI * 2;
const dist = 0.78 + (i % 3) * 0.22;
b.position.set(Math.cos(angle) * dist, -0.55 + (i / 12) * 1.4, Math.sin(angle) * dist);
group.add(b);
bubbles.push({
mesh: b,
angle,
dist,
speed: 0.35 + (i % 4) * 0.12,
offset: i * 0.55,
});
}
return {
group,
draggable: heroJelly.mesh,
description:
'Step into sunny undersea slapstick, Jellyfish Fields meadows, and Polynesian tiki charm—steer the floating jellyfish with WASD or Arrow keys across speckled sands and sky-flower waters.',
background: 'linear-gradient(180deg, #38bdf8 0%, #2dd4bf 58%, #fde047 100%)',
dispose() {
window.removeEventListener('keydown', onKeyDown);
window.removeEventListener('keyup', onKeyUp);
},
update(t, bounce, spring) {
tikiGroup.rotation.y = Math.sin(t * 0.7) * 0.3;
crown.rotation.y = Math.sin(t * 1.2) * 0.15;
// Swaying grass blades on the separate Jellyfish Fields patch
grassBlades.forEach((gb) => {
gb.mesh.rotation.z = gb.baseZ + Math.sin(t * 2.1 + gb.phase) * 0.16;
});
// Hero Jellyfish WASD / Arrow movement + rhythmic swim pulse
const moveSpeed = 0.028;
let vx = 0;
let vy = 0;
if (keysPressed['a'] || keysPressed['arrowleft']) vx -= moveSpeed;
if (keysPressed['d'] || keysPressed['arrowright']) vx += moveSpeed;
if (keysPressed['w'] || keysPressed['arrowup']) vy += moveSpeed;
if (keysPressed['s'] || keysPressed['arrowdown']) vy -= moveSpeed;
heroJelly.mesh.position.x = THREE.MathUtils.clamp(heroJelly.mesh.position.x + vx, -1.65, 1.65);
heroJelly.mesh.position.y = THREE.MathUtils.clamp(
heroJelly.mesh.position.y + vy + Math.sin(t * 3.2) * 0.003,
-0.35,
1.35
);
heroJelly.mesh.rotation.z = THREE.MathUtils.lerp(
heroJelly.mesh.rotation.z,
-vx * 14,
0.15
);
const heroPulse = Math.sin(t * 3.2);
heroJelly.bell.scale.set(1 + heroPulse * 0.1, 1 - heroPulse * 0.12, 1 + heroPulse * 0.1);
heroJelly.tentacles.forEach((ten, i) => {
ten.rotation.z = Math.sin(t * 3.5 + i) * 0.18;
});
// Ambient jellyfish swarm bobbing
ambientJellies.forEach((jf, idx) => {
const pulse = Math.sin(t * 3.0 + jf.phase);
jf.mesh.position.y = jf.y + pulse * 0.11;
jf.mesh.position.x = jf.x + Math.cos(t * jf.speed + jf.phase) * 0.09;
jf.bell.scale.set(1 + pulse * 0.09, 1 - pulse * 0.11, 1 + pulse * 0.09);
jf.tentacles.forEach((ten, i) => {
ten.rotation.z = Math.sin(t * 3.4 + i + idx) * 0.18;
});
});
skyFlowers.forEach((sf, idx) => {
sf.mesh.rotation.z = t * sf.speed;
sf.mesh.position.y = sf.baseY + Math.sin(t * 1.4 + idx) * 0.07;
});
bubbles.forEach((b) => {
const cycle = ((t * b.speed + b.offset) % 1.55) - 0.6;
b.mesh.position.y = cycle;
b.mesh.position.x = Math.cos(b.angle + t * 0.4) * b.dist + Math.sin(t * 3 + b.offset) * 0.04;
b.mesh.position.z = Math.sin(b.angle + t * 0.4) * b.dist;
});
group.scale.setScalar(1 + spring * 0.24);
},
};
}