// js/aesthetics/dark/dreamcore.js
import * as THREE from 'three';

export function createDreamcore() {
  const group = new THREE.Group();

  // Materials: Pastel Twilight, Soft Cloud Matte, Luminescent Moon Gold, Portal Glow
  const archFrameMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    emissive: 0xc084fc,
    emissiveIntensity: 0.25,
    roughness: 0.35,
  });

  const portalVoidMat = new THREE.MeshBasicMaterial({
    color: 0xf0abfc,
  });

  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xe9d5ff,
    emissive: 0x7e22ce,
    emissiveIntensity: 0.2,
    roughness: 0.85,
  });

  const moonMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xfacc15,
    emissiveIntensity: 0.65,
    roughness: 0.25,
  });

  const tileLightMat = new THREE.MeshStandardMaterial({
    color: 0xf3e8ff,
    roughness: 0.4,
  });

  const tileDarkMat = new THREE.MeshStandardMaterial({
    color: 0x3b0764,
    roughness: 0.4,
  });

  // 1. Floating Liminal Doorway / Portal Arch
  const doorwayGroup = new THREE.Group();
  doorwayGroup.position.set(0, 0.12, 0);

  const pillarGeo = new THREE.BoxGeometry(0.14, 1.35, 0.16);
  const leftPillar = new THREE.Mesh(pillarGeo, archFrameMat);
  leftPillar.position.set(-0.42, 0, 0);

  const rightPillar = new THREE.Mesh(pillarGeo, archFrameMat);
  rightPillar.position.set(0.42, 0, 0);

  const lintel = new THREE.Mesh(
    new THREE.BoxGeometry(1.06, 0.14, 0.18),
    archFrameMat
  );
  lintel.position.set(0, 0.72, 0);

  const threshold = new THREE.Mesh(
    new THREE.BoxGeometry(1.12, 0.08, 0.24),
    archFrameMat
  );
  threshold.position.set(0, -0.68, 0.02);

  // Glowing pastel twilight portal interior
  const portalScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.7, 1.32),
    portalVoidMat
  );
  portalScreen.position.set(0, 0.01, 0);

  doorwayGroup.add(leftPillar, rightPillar, lintel, threshold, portalScreen);
  group.add(doorwayGroup);

  // 2. Surreal Checkered Dream-Floor Island Beneath the Doorway
  const floorGroup = new THREE.Group();
  floorGroup.position.set(0, -0.78, 0);
  const tileGeo = new THREE.BoxGeometry(0.28, 0.04, 0.28);

  for (let row = -2; row <= 2; row++) {
    for (let col = -2; col <= 2; col++) {
      const isLight = (row + col) % 2 === 0;
      const tile = new THREE.Mesh(tileGeo, isLight ? tileLightMat : tileDarkMat);
      tile.position.set(col * 0.29, 0, row * 0.29);
      floorGroup.add(tile);
    }
  }
  group.add(floorGroup);

  // 3. Soft Billowing Twilight Clouds
  const cloudGroup = new THREE.Group();
  const cloudPuffs = [
    { x: -0.78, y: -0.58, z: 0.25, r: 0.26 },
    { x: -0.52, y: -0.66, z: 0.32, r: 0.2 },
    { x: 0.76, y: -0.52, z: -0.18, r: 0.28 },
    { x: 0.54, y: -0.64, z: -0.1, r: 0.21 },
    { x: -0.68, y: 0.56, z: -0.35, r: 0.22 },
  ];

  cloudPuffs.forEach((p) => {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(p.r, 18, 18), cloudMat);
    puff.position.set(p.x, p.y, p.z);
    cloudGroup.add(puff);
  });
  group.add(cloudGroup);

  // 4. Glowing Crescent / Full Lucid Moon & Drifting Star Motes
  const moon = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), moonMat);
  moon.position.set(0.78, 0.85, -0.25);
  group.add(moon);

  const starGeo = new THREE.OctahedronGeometry(0.045, 0);
  const stars = [];
  const starCount = 12;

  for (let i = 0; i < starCount; i++) {
    const angle = (i / starCount) * Math.PI * 2;
    const radius = 1.15 + (i % 3) * 0.16;
    const baseY = Math.sin(i * 1.9) * 0.65;
    const star = new THREE.Mesh(starGeo, moonMat);
    star.position.set(Math.cos(angle) * radius, baseY, Math.sin(angle) * radius);
    group.add(star);
    stars.push({ mesh: star, angle, radius, baseY, speed: 0.28 + (i % 3) * 0.08 });
  }

  return {
    group,
    description:
      'A surrealist internet aesthetic evoking hazy childhood memories, lucid dreams, and bittersweet nostalgia—combining floating doorways, pastel twilight skies, soft clouds, and quiet, empty dreamscapes.',
    background: 'radial-gradient(circle at 50% 30%, #a855f7 0%, #3b0764 55%, #090d16 100%)',
    update(t, bounce, spring) {
      // Gentle dreamlike levitation of the doorway & checkered island
      doorwayGroup.position.y = 0.12 + Math.sin(t * 1.2) * 0.05;
      doorwayGroup.rotation.y = Math.sin(t * 0.55) * 0.18;

      floorGroup.position.y = -0.78 + Math.sin(t * 1.2 - 0.4) * 0.035;
      floorGroup.rotation.y = Math.sin(t * 0.55) * 0.18;

      // Soft cloud drift
      cloudGroup.position.x = Math.sin(t * 0.5) * 0.08;
      cloudGroup.position.y = Math.cos(t * 0.7) * 0.03;

      // Moon glow & slow star orbit
      moon.position.y = 0.85 + Math.sin(t * 0.9) * 0.04;
      stars.forEach((s, idx) => {
        const a = s.angle + t * s.speed;
        s.mesh.position.x = Math.cos(a) * s.radius;
        s.mesh.position.z = Math.sin(a) * s.radius;
        s.mesh.position.y = s.baseY + Math.sin(t * 1.8 + idx) * 0.07;
        s.mesh.rotation.y = t * 1.4;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
