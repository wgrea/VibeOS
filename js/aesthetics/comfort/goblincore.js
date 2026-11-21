// js/aesthetics/comfort/goblincore.js
import * as THREE from 'three';

export function createGoblincore() {
  const group = new THREE.Group();

  const mossMat = new THREE.MeshStandardMaterial({ color: 0x3f6212, roughness: 0.9 });
  const soilMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.95 });
  const capRedMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.45 });
  const stemMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.6 });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    metalness: 0.8,
    roughness: 0.25,
  });
  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0x34d399,
    emissive: 0x059669,
    emissiveIntensity: 0.3,
    roughness: 0.1,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.88,
  });

  // 1. Damp Mossy Forest Mound
  const mound = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.4, 0.28, 28), mossMat);
  mound.position.y = -0.5;
  const dirtBase = new THREE.Mesh(new THREE.CylinderGeometry(1.38, 1.32, 0.14, 28), soilMat);
  dirtBase.position.y = -0.66;
  group.add(mound, dirtBase);

  // 2. Cluster of Spotted Toadstool Mushrooms
  const mushrooms = [];
  const shroomConfigs = [
    { x: -0.22, z: -0.1, scale: 1.15, tilt: 0.12 },
    { x: 0.32, z: -0.25, scale: 0.85, tilt: -0.18 },
    { x: -0.52, z: 0.25, scale: 0.68, tilt: 0.22 },
  ];

  shroomConfigs.forEach((cfg) => {
    const shroom = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.55, 14), stemMat);
    stem.position.y = 0.27;

    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55),
      capRedMat
    );
    cap.position.y = 0.5;

    // Cream Spots on Toadstool Cap
    for (let s = 0; s < 5; s++) {
      const sa = (s / 5) * Math.PI * 2;
      const spot = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), stemMat);
      spot.position.set(Math.cos(sa) * 0.22, 0.62, Math.sin(sa) * 0.22);
      shroom.add(spot);
    }

    shroom.add(stem, cap);
    shroom.position.set(cfg.x, -0.38, cfg.z);
    shroom.scale.setScalar(cfg.scale);
    shroom.rotation.z = cfg.tilt;
    group.add(shroom);
    mushrooms.push(shroom);
  });

  // 3. Foraged Goblin Trinkets (Shiny Brass Coin/Button, Mossy Quartz & Pebbles)
  const trinketCoin = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.03, 20), brassMat);
  trinketCoin.position.set(0.45, -0.34, 0.42);
  trinketCoin.rotation.set(0.25, 0.4, 0.15);

  const quartz = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 0), crystalMat);
  quartz.scale.set(0.75, 1.35, 0.75);
  quartz.position.set(-0.15, -0.28, 0.52);
  quartz.rotation.set(0.3, 0.5, -0.25);

  group.add(trinketCoin, quartz);

    // 3B. Tiny Woodland Snail & Smooth River Pebbles
  const shellMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.5 });
  const snailBodyMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.7 });
  const pebbleMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.6 });

  const snailGroup = new THREE.Group();
  const snailFoot = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.14, 6, 12), snailBodyMat);
  snailFoot.rotation.z = Math.PI / 2;
  snailFoot.position.y = 0.03;

  const snailShell = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.032, 12, 20), shellMat);
  snailShell.position.set(-0.01, 0.085, 0);

  snailGroup.add(snailFoot, snailShell);
  snailGroup.position.set(0.16, -0.36, 0.62);
  snailGroup.rotation.y = -0.5;
  group.add(snailGroup);

  // Foraged River Pebbles
  [
    [-0.68, -0.36, -0.25, 0.09],
    [0.66, -0.36, -0.05, 0.07],
    [-0.45, -0.36, 0.62, 0.08],
  ].forEach(([px, py, pz, pr]) => {
    const pebble = new THREE.Mesh(new THREE.DodecahedronGeometry(pr, 1), pebbleMat);
    pebble.scale.set(1.2, 0.65, 1.0);
    pebble.position.set(px, py, pz);
    group.add(pebble);
  });


  // 4. Floating Glowing Forest Spores
  const sporeMat = new THREE.MeshBasicMaterial({ color: 0xd9f99d });
  const spores = [];
  for (let i = 0; i < 12; i++) {
    const spore = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), sporeMat);
    const a = (i / 12) * Math.PI * 2;
    const r = 0.5 + (i % 4) * 0.22;
    const baseY = -0.1 + (i % 5) * 0.18;
    spore.position.set(Math.cos(a) * r, baseY, Math.sin(a) * r);
    group.add(spore);
    spores.push({ mesh: spore, angle: a, r, baseY, phase: i * 0.8 });
  }

  return {
    group,
    description:
      'Celebrating messy woodland foraging and earthy curiosity, Goblincore gathers spotted toadstools, damp moss mounds, shiny found trinkets, raw quartz, and glowing forest spores.',
    background: 'radial-gradient(circle at 50% 35%, #4d7c0f 0%, #365314 55%, #1a2e05 100%)',
    update(t, bounce, spring) {
      mushrooms.forEach((m, idx) => {
        m.rotation.x = Math.sin(t * 1.4 + idx) * 0.04;
      });

      quartz.rotation.y = t * 0.6;
      trinketCoin.rotation.y = t * 0.8;

      spores.forEach((s) => {
        const a = s.angle + t * 0.3;
        s.mesh.position.x = Math.cos(a) * s.r;
        s.mesh.position.z = Math.sin(a) * s.r;
        s.mesh.position.y = s.baseY + Math.sin(t * 1.6 + s.phase) * 0.09;
      });

      group.scale.setScalar(1 + spring * 0.22);
    },
  };
}
