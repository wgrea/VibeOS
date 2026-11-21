// js/aesthetics/vaporwave/dreampunk.js

import * as THREE from 'three';

export function createDreampunk() {
  const group = new THREE.Group();

  // 1. Unified Rain-Slicked Megacity Diorama (Draggable / Arrow-Key Interactive)
  const cityGroup = new THREE.Group();

  // Procedural Megastructure Lit-Window Texture
  const winCanvas = document.createElement('canvas');
  winCanvas.width = 128;
  winCanvas.height = 256;
  const wCtx = winCanvas.getContext('2d');
  wCtx.fillStyle = '#090d16';
  wCtx.fillRect(0, 0, 128, 256);

  const winColors = ['#22d3ee', '#f43f5e', '#e879f9', '#fde68a', '#38bdf8'];
  for (let y = 10; y < 246; y += 12) {
    for (let x = 10; x < 118; x += 14) {
      if (Math.random() > 0.42) {
        wCtx.fillStyle = winColors[Math.floor(Math.random() * winColors.length)];
        wCtx.globalAlpha = 0.35 + Math.random() * 0.65;
        wCtx.fillRect(x, y, 7, 5);
      }
    }
  }
  wCtx.globalAlpha = 1.0;

  const facadeTex = new THREE.CanvasTexture(winCanvas);
  facadeTex.wrapS = THREE.RepeatWrapping;
  facadeTex.wrapT = THREE.RepeatWrapping;

  // Rain-Slicked Reflective Street Slab
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(3.1, 0.16, 2.5),
    new THREE.MeshPhysicalMaterial({
      color: 0x060911,
      roughness: 0.06,
      metalness: 0.75,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    })
  );
  base.position.y = -1.05;
  cityGroup.add(base);

  // Glowing Wet-Puddle Neon Reflection Strips on Street
  const puddleSpecs = [
    { x: -0.75, z: 0.55, w: 0.55, color: 0xf43f5e },
    { x: 0.05, z: 0.78, w: 0.75, color: 0x22d3ee },
    { x: 0.85, z: 0.45, w: 0.5, color: 0xc084fc },
  ];
  puddleSpecs.forEach(({ x, z, w, color }) => {
    const streak = new THREE.Mesh(
      new THREE.PlaneGeometry(w, 0.35),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.25,
      })
    );
    streak.rotation.x = -Math.PI / 2;
    streak.position.set(x, -0.968, z);
    cityGroup.add(streak);
  });

  // 2. Cyberpunk Skyscraper Towers with Neon Blade Signs & Spires
  const towerSpecs = [
    { pos: [-0.82, -0.1, -0.22], size: [0.58, 1.85, 0.58], glow: 0xf43f5e, signSide: -1 },
    { pos: [0.05, 0.28, 0.12], size: [0.68, 2.6, 0.68], glow: 0x22d3ee, signSide: 1 },
    { pos: [0.88, -0.22, -0.25], size: [0.54, 1.6, 0.54], glow: 0xc084fc, signSide: 1 },
    { pos: [-0.32, -0.42, -0.58], size: [0.46, 1.2, 0.46], glow: 0x38bdf8, signSide: 0 },
  ];

  const halos = [];
  const beacons = [];

  towerSpecs.forEach((spec) => {
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      map: facadeTex,
      emissive: 0x1e1b4b,
      emissiveMap: facadeTex,
      emissiveIntensity: 0.85,
      roughness: 0.22,
      metalness: 0.65,
    });

    const tower = new THREE.Mesh(new THREE.BoxGeometry(...spec.size), towerMat);
    tower.position.set(...spec.pos);
    cityGroup.add(tower);

    // Glowing Vertical Holographic Neon Blade Sign
    if (spec.signSide !== 0) {
      const signHeight = spec.size[1] * 0.55;
      const neonSign = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, signHeight, 0.14),
        new THREE.MeshBasicMaterial({ color: spec.glow })
      );
      neonSign.position.set(
        spec.pos[0] + spec.signSide * (spec.size[0] * 0.5 + 0.04),
        spec.pos[1] + 0.1,
        spec.pos[2] + 0.12
      );
      cityGroup.add(neonSign);
    }

    // Rooftop Comms Spire & Blinking Aircraft Beacon
    const topY = spec.pos[1] + spec.size[1] * 0.5;
    const spire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.025, 0.42, 8),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85 })
    );
    spire.position.set(spec.pos[0], topY + 0.21, spec.pos[2]);
    cityGroup.add(spire);

    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.028, 10, 10),
      new THREE.MeshBasicMaterial({ color: spec.glow })
    );
    beacon.position.set(spec.pos[0], topY + 0.43, spec.pos[2]);
    cityGroup.add(beacon);
    beacons.push({ mesh: beacon, phase: beacons.length * 1.4 });

    // Floating Holographic Rooftop Halo Ring
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.02, 12, 48),
      new THREE.MeshBasicMaterial({
        color: spec.glow,
        transparent: true,
        opacity: 0.85,
      })
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.set(spec.pos[0], topY + 0.14, spec.pos[2]);
    cityGroup.add(halo);
    halos.push({ mesh: halo, baseY: halo.position.y });
  });

  // Elevated Neon Skybridge connecting Left & Center Towers
  const skybridge = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 0.09, 0.14),
    new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.55,
    })
  );
  skybridge.position.set(-0.38, 0.15, -0.05);
  cityGroup.add(skybridge);

  // 3. Drifting Midnight Hover-Traffic Streaks
  const traffic = [];
  [
    { y: -0.25, z: 0.58, dir: 1, color: 0x22d3ee, speed: 0.9 },
    { y: 0.35, z: -0.52, dir: -1, color: 0xf43f5e, speed: 0.7 },
  ].forEach((car) => {
    const pod = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.035, 0.05),
      new THREE.MeshBasicMaterial({ color: car.color })
    );
    pod.position.set(0, car.y, car.z);
    cityGroup.add(pod);
    traffic.push({ mesh: pod, ...car });
  });

  group.add(cityGroup);

  // 4. Slanted Cyberpunk Rainfall across the Skyline
  const rainDrops = [];
  const rainGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.26, 6);
  const rainMat = new THREE.MeshBasicMaterial({
    color: 0x7dd3fc,
    transparent: true,
    opacity: 0.5,
  });

  for (let i = 0; i < 36; i++) {
    const drop = new THREE.Mesh(rainGeo, rainMat);
    drop.position.set(
      (Math.random() - 0.5) * 3.2,
      (Math.random() - 0.5) * 2.8,
      (Math.random() - 0.5) * 2.4
    );
    drop.rotation.z = -0.14;
    group.add(drop);
    rainDrops.push({ mesh: drop, speed: 1.8 + Math.random() * 1.4 });
  }

  // 5. Moody Blade-Runner Neon Rim Lights
  const cyanCityLight = new THREE.PointLight(0x22d3ee, 11, 10);
  cyanCityLight.position.set(1.6, 1.5, 1.8);
  group.add(cyanCityLight);

  const roseCityLight = new THREE.PointLight(0xf43f5e, 11, 10);
  roseCityLight.position.set(-1.6, 1.0, 1.8);
  group.add(roseCityLight);

  return {
    group,
    description:
      'Cinematic, rain-soaked cyberpunk ambient inspired by 2814—towering obsidian megastructures, holographic neon signage, wet street reflections, and lonely midnight transit.',
    background: 'linear-gradient(180deg, #090d16 0%, #1e1b4b 55%, #4c1d95 100%)',
    update(t, bounce, spring) {
      cityGroup.rotation.y = Math.sin(t * 0.45) * 0.35;
      group.scale.setScalar(1 + spring * 0.22);

      halos.forEach((h, i) => {
        h.mesh.position.y = h.baseY + Math.sin(t * 2.0 + i) * 0.07 + bounce * 0.25;
      });

      // Blinking rooftop aircraft warning beacons
      beacons.forEach((b) => {
        const pulse = Math.sin(t * 4.5 + b.phase) > 0.2 ? 1.2 : 0.35;
        b.mesh.scale.setScalar(pulse);
      });

      // Looping hover-traffic pods gliding past towers
      traffic.forEach((car) => {
        const span = 3.0;
        const raw = ((t * car.speed) % 1) * span - span / 2;
        car.mesh.position.x = raw * car.dir;
      });

      // Continuous diagonal rain
      rainDrops.forEach((r) => {
        r.mesh.position.y -= r.speed * 0.032;
        r.mesh.position.x -= r.speed * 0.0045;
        if (r.mesh.position.y < -1.2) {
          r.mesh.position.y = 1.65;
          r.mesh.position.x = (Math.random() - 0.5) * 3.2;
        }
      });
    },
  };
}
