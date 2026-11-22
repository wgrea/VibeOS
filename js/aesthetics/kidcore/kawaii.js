// js/aesthetics/kidcore/kawaii.js
import * as THREE from 'three';

export function createKawaii() {
  const group = new THREE.Group();

  // Shared Materials
  const pastelPink = new THREE.MeshPhysicalMaterial({ color: 0xf9a8d4, roughness: 0.25, clearcoat: 0.65 });
  const puffPink = new THREE.MeshPhysicalMaterial({ color: 0xf472b6, roughness: 0.28, clearcoat: 0.55 });
  const creamMat = new THREE.MeshPhysicalMaterial({ color: 0xfffbeb, roughness: 0.3, clearcoat: 0.4 });
  const ribbonMat = new THREE.MeshPhysicalMaterial({ color: 0xf43f5e, roughness: 0.2, clearcoat: 0.8 });
  const shoeRedMat = new THREE.MeshPhysicalMaterial({ color: 0xe11d48, roughness: 0.25, clearcoat: 0.7 });
  const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.28 });
  const tealMat = new THREE.MeshPhysicalMaterial({ color: 0x2dd4bf, roughness: 0.28, clearcoat: 0.6 });
  const robotBlueMat = new THREE.MeshPhysicalMaterial({ color: 0x0ea5e9, roughness: 0.25, clearcoat: 0.7 });
  const peachMat = new THREE.MeshPhysicalMaterial({ color: 0xfed7aa, roughness: 0.35, clearcoat: 0.35 });
  const lavenderMat = new THREE.MeshPhysicalMaterial({ color: 0xc4b5fd, roughness: 0.3, clearcoat: 0.45 });
  const mintGrassMat = new THREE.MeshPhysicalMaterial({ color: 0x86efac, roughness: 0.45, clearcoat: 0.2 });
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6 });
  const cloudMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.35, clearcoat: 0.3 });
  const inkBlackMat = new THREE.MeshBasicMaterial({ color: 0x1e1b4b });
  const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  // 1. Buddy #1: Cream Cat Mascot (same chibi scale as the rest of the circle)
  const catBuddy = new THREE.Group();
  const catHead = new THREE.Mesh(new THREE.SphereGeometry(0.22, 22, 22), creamMat);
  catHead.scale.set(1.15, 0.95, 0.95);

  const earGeo = new THREE.ConeGeometry(0.072, 0.145, 16);
  const leftEar = new THREE.Mesh(earGeo, creamMat);
  leftEar.position.set(-0.15, 0.21, 0);
  leftEar.rotation.z = 0.35;

  const rightEar = new THREE.Mesh(earGeo, creamMat);
  rightEar.position.set(0.15, 0.21, 0);
  rightEar.rotation.z = -0.35;

  [-0.085, 0.085].forEach((xSide) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 12), inkBlackMat);
    eye.scale.set(0.85, 1.25, 0.6);
    eye.position.set(xSide, 0.015, 0.2);

    const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), pastelPink);
    cheek.scale.set(1.2, 0.75, 0.4);
    cheek.position.set(xSide * 1.45, -0.032, 0.185);
    catBuddy.add(eye, cheek);
  });

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 12), yellowMat);
  nose.scale.set(1.3, 0.85, 0.7);
  nose.position.set(0, -0.015, 0.21);

  const bowCenter = new THREE.Mesh(new THREE.SphereGeometry(0.044, 12, 12), ribbonMat);
  const bowL = new THREE.Mesh(new THREE.SphereGeometry(0.062, 12, 12), ribbonMat);
  bowL.scale.set(1.2, 0.85, 0.6);
  bowL.position.x = -0.062;
  const bowR = bowL.clone();
  bowR.position.x = 0.062;

  const bowGroup = new THREE.Group();
  bowGroup.add(bowCenter, bowL, bowR);
  bowGroup.position.set(0.17, 0.18, 0.1);
  bowGroup.rotation.z = -0.35;

  catBuddy.add(catHead, leftEar, rightEar, nose, bowGroup);

  // 2. Buddy #2: Pink Puffball (Kirby-inspired)
  const puffball = new THREE.Group();
  const puffBody = new THREE.Mesh(new THREE.SphereGeometry(0.21, 20, 20), puffPink);
  const armGeo = new THREE.SphereGeometry(0.07, 12, 12);
  const pArmL = new THREE.Mesh(armGeo, puffPink);
  pArmL.position.set(-0.19, 0.04, 0.03);
  const pArmR = new THREE.Mesh(armGeo, puffPink);
  pArmR.position.set(0.19, 0.04, 0.03);

  const footGeo = new THREE.SphereGeometry(0.088, 12, 12);
  footGeo.scale(1.1, 0.65, 1.45);
  const pFootL = new THREE.Mesh(footGeo, shoeRedMat);
  pFootL.position.set(-0.082, -0.175, 0.04);
  const pFootR = new THREE.Mesh(footGeo, shoeRedMat);
  pFootR.position.set(0.082, -0.175, 0.04);

  [-0.06, 0.06].forEach((x) => {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.026, 10, 10), inkBlackMat);
    e.scale.set(0.75, 1.4, 0.6);
    e.position.set(x, 0.04, 0.198);
    puffball.add(e);
  });
  puffball.add(puffBody, pArmL, pArmR, pFootL, pFootR);

  // 3. Buddy #3: Teal Fish-Mascot (Hangyodon-inspired)
  const fishBuddy = new THREE.Group();
  const fishHead = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), tealMat);
  fishHead.scale.set(1.08, 1.0, 0.95);

  const upperLip = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.03, 10, 20), pastelPink);
  upperLip.scale.set(1.35, 0.65, 0.8);
  upperLip.position.set(0, -0.068, 0.198);

  const dorsalFin = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.165, 12), yellowMat);
  dorsalFin.position.set(0, 0.24, -0.02);

  [-0.075, 0.075].forEach((x) => {
    const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.052, 12, 12), whiteMat);
    eyeWhite.position.set(x, 0.068, 0.178);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 10), inkBlackMat);
    pupil.position.set(x, 0.068, 0.224);
    fishBuddy.add(eyeWhite, pupil);
  });
  fishBuddy.add(fishHead, upperLip, dorsalFin);

  // 4. Buddy #4: Blue Robot-Cat (Doraemon-inspired)
  const roboCat = new THREE.Group();
  const roboHead = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), robotBlueMat);
  const roboFace = new THREE.Mesh(new THREE.SphereGeometry(0.182, 18, 18), whiteMat);
  roboFace.position.set(0, -0.02, 0.062);
  const roboNose = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 12), ribbonMat);
  roboNose.position.set(0, 0.04, 0.235);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.025, 10, 24), ribbonMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = -0.16;
  const bell = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), yellowMat);
  bell.position.set(0, -0.17, 0.162);
  roboCat.add(roboHead, roboFace, roboNose, collar, bell);

  // 5. Buddy #5: Cheeky Chibi Kid (Shin-chan-inspired)
  const chibiKid = new THREE.Group();
  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.185, 18, 18), peachMat);
  cranium.position.y = 0.035;
  const chubbyCheek = new THREE.Mesh(new THREE.SphereGeometry(0.152, 18, 18), peachMat);
  chubbyCheek.scale.set(1.25, 0.85, 0.95);
  chubbyCheek.position.set(0.058, -0.075, 0.036);

  const hairCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.19, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.52),
    inkBlackMat
  );
  hairCap.position.y = 0.04;

  [-0.06, 0.06].forEach((x, idx) => {
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.025, 0.022), inkBlackMat);
    brow.position.set(x, 0.068, 0.188);
    brow.rotation.z = idx === 0 ? 0.2 : -0.2;
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.021, 10, 10), inkBlackMat);
    eye.position.set(x, 0.015, 0.188);
    chibiKid.add(brow, eye);
  });

  const shirtBand = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.135, 0.095, 16), ribbonMat);
  shirtBand.position.y = -0.188;
  const shortsBand = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.125, 0.068, 16), yellowMat);
  shortsBand.position.y = -0.265;
  chibiKid.add(cranium, chubbyCheek, hairCap, shirtBand, shortsBand);

  // Equal 5-Mascot Floating Circle
  const mascotMeshes = [catBuddy, puffball, fishBuddy, roboCat, chibiKid];
  const buddies = mascotMeshes.map((mesh, idx) => {
    group.add(mesh);
    return {
      mesh,
      offset: (idx / mascotMeshes.length) * Math.PI * 2,
      yBase: 0.25 + (idx % 2 === 0 ? 0.14 : -0.08),
    };
  });

  // 6. Kawaii Anime Neighborhood Ground Island
  const townIsland = new THREE.Group();
  townIsland.position.y = -0.92;

  const hillBase = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.35, 0.22, 32), mintGrassMat);
  const soilBase = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 0.95, 0.18, 32), peachMat);
  soilBase.position.y = -0.18;
  townIsland.add(hillBase, soilBase);

  const street = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.02, 0.34), roadMat);
  street.position.set(0, 0.115, 0.25);
  townIsland.add(street);

  for (let i = -2; i <= 2; i++) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.025, 0.22), whiteMat);
    stripe.position.set(i * 0.16, 0.118, 0.25);
    townIsland.add(stripe);
  }

  const houseConfigs = [
    { x: -0.82, z: -0.35, w: 0.36, h: 0.28, d: 0.32, wall: creamMat, roof: ribbonMat, rotY: 0.2 },
    { x: -0.25, z: -0.68, w: 0.42, h: 0.34, d: 0.34, wall: pastelPink, roof: robotBlueMat, rotY: 0.05 },
    { x: 0.38, z: -0.62, w: 0.38, h: 0.3, d: 0.3, wall: yellowMat, roof: ribbonMat, rotY: -0.12 },
    { x: 0.86, z: -0.28, w: 0.34, h: 0.28, d: 0.32, wall: lavenderMat, roof: tealMat, rotY: -0.28 },
    { x: -0.78, z: 0.72, w: 0.32, h: 0.24, d: 0.28, wall: yellowMat, roof: robotBlueMat, rotY: 0.35 },
    { x: 0.76, z: 0.74, w: 0.34, h: 0.26, d: 0.28, wall: creamMat, roof: puffPink, rotY: -0.35 },
  ];

  houseConfigs.forEach((cfg) => {
    const house = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d), cfg.wall);
    body.position.y = cfg.h / 2;

    const roof = new THREE.Mesh(new THREE.ConeGeometry(cfg.w * 0.82, cfg.h * 0.72, 4), cfg.roof);
    roof.position.y = cfg.h + cfg.h * 0.34;
    roof.rotation.y = Math.PI / 4;

    const door = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.w * 0.24, cfg.h * 0.45, 0.02),
      ribbonMat
    );
    door.position.set(0, cfg.h * 0.225, cfg.d / 2 + 0.005);

    house.add(body, roof, door);
    house.position.set(cfg.x, 0.11, cfg.z);
    house.rotation.y = cfg.rotY;
    townIsland.add(house);
  });

  const treeCoords = [
    [-1.12, 0.15],
    [-0.55, -0.45],
    [0.05, -0.82],
    [0.64, -0.42],
    [1.1, 0.2],
    [-0.35, 0.78],
    [0.35, 0.82],
  ];
  treeCoords.forEach(([tx, tz], idx) => {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.16, 10), peachMat);
    trunk.position.y = 0.08;
const crown = new THREE.Mesh(
new THREE.SphereGeometry(0.11, 14, 14),
idx % 2 === 0 ? mintGrassMat : tealMat
);
crown.position.y = 0.2;
tree.add(trunk, crown);
tree.position.set(tx, 0.11, tz);
townIsland.add(tree);
});
group.add(townIsland);
// 7. Fluffy Background Clouds
const cloudConfigs = [
{ x: -1.45, y: 0.95, z: -1.1, scale: 0.9, speed: 0.22 },
{ x: 1.4, y: 1.05, z: -1.25, scale: 1.05, speed: 0.18 },
{ x: -1.65, y: 0.25, z: -0.85, scale: 0.72, speed: 0.28 },
{ x: 1.6, y: 0.35, z: -0.95, scale: 0.78, speed: 0.24 },
];
const clouds = cloudConfigs.map((cfg) => {
const cGroup = new THREE.Group();
const puffs = [
[0, 0, 0, 0.24],
[-0.2, -0.03, 0.04, 0.18],
[0.2, -0.03, -0.03, 0.19],
[0.07, 0.09, 0.05, 0.17],
];
puffs.forEach(([px, py, pz, r]) => {
const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 14), cloudMat);
puff.position.set(px, py, pz);
cGroup.add(puff);
});
cGroup.position.set(cfg.x, cfg.y, cfg.z);
cGroup.scale.setScalar(cfg.scale);
group.add(cGroup);
return { mesh: cGroup, baseX: cfg.x, baseY: cfg.y, speed: cfg.speed };
});
return {
group,
description:
'Step into sunny pastel sweetness, chibi toy-charm nostalgia, and offbeat busu-kawaii humor—where five chibi mascots circle freely over a pastel anime neighborhood beneath fluffy blue-sky clouds.',
background: 'radial-gradient(circle at 50% 25%, #e0f2fe 0%, #7dd3fc 55%, #38bdf8 100%)',
update(t, bounce, spring) {
bowGroup.rotation.z = -0.35 + Math.sin(t * 4) * 0.1;
buddies.forEach((b, idx) => {
const a = t * 0.68 + b.offset;
b.mesh.position.x = Math.cos(a) * 1.15;
b.mesh.position.z = Math.sin(a) * 1.15;
b.mesh.position.y = b.yBase + Math.sin(t * 3.0 + idx * 1.25) * 0.1;
b.mesh.rotation.y = -a + Math.PI / 2;
b.mesh.rotation.z = Math.sin(t * 3.0 + idx) * 0.14;
});
townIsland.rotation.y = Math.sin(t * 0.28) * 0.35;
clouds.forEach((c, idx) => {
c.mesh.position.x = c.baseX + Math.sin(t * c.speed + idx) * 0.22;
c.mesh.position.y = c.baseY + Math.cos(t * (c.speed * 1.5) + idx) * 0.06;
});
group.scale.setScalar(1 + spring * 0.25);
},
};
}
