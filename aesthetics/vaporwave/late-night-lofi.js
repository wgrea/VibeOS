// js/aesthetics/vaporwave/late-night-lofi.js

import * as THREE from 'three';

export function createLateNightLofi() {
  const group = new THREE.Group();

  // 1. Midnight Rainy Window Diorama Group (Draggable / Arrow-Key Interactive)
  const windowGroup = new THREE.Group();

  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x1e1b4b,
    roughness: 0.4,
    metalness: 0.45,
  });

  // Outer Window Frame
  const frame = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.55, 0.16), frameMat);
  windowGroup.add(frame);

  // Deep Midnight Sky Glass Pane
  const pane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.96, 1.32),
    new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      emissive: 0x312e81,
      emissiveIntensity: 0.65,
      roughness: 0.12,
    })
  );
  pane.position.z = 0.085;
  windowGroup.add(pane);

  // Warm Golden Crescent / Full Moon
  const moon = new THREE.Mesh(
    new THREE.CircleGeometry(0.26, 32),
    new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
  );
  moon.position.set(0.52, 0.32, 0.092);
  windowGroup.add(moon);

  // Distant Midnight City Skyline Silhouettes & Glowing Windows
  const buildingMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
  const litWinMat = new THREE.MeshBasicMaterial({ color: 0xfde68a });
  const buildings = [
    { x: -0.68, w: 0.34, h: 0.62 },
    { x: -0.32, w: 0.32, h: 0.84 },
    { x: 0.04, w: 0.36, h: 0.54 },
    { x: 0.42, w: 0.32, h: 0.72 },
    { x: 0.76, w: 0.28, h: 0.48 },
  ];

  buildings.forEach(({ x, w, h }, bIdx) => {
    const bMesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), buildingMat);
    bMesh.position.set(x, -0.66 + h / 2, 0.096);
    windowGroup.add(bMesh);

    // Tiny glowing apartment windows
    for (let row = 0; row < 3; row++) {
      const wy = -0.55 + row * 0.16;
      if (wy < -0.66 + h - 0.1) {
        const win = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.05), litWinMat);
        win.position.set(x + (bIdx % 2 === 0 ? -0.05 : 0.05), wy, 0.1);
        windowGroup.add(win);
      }
    }
  });

  // Window Pane Cross Mullions
  const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.36, 0.06), frameMat);
  vBar.position.z = 0.11;
  windowGroup.add(vBar);

  const hBar = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.05, 0.06), frameMat);
  hBar.position.z = 0.11;
  windowGroup.add(hBar);

  // Cozy Windowsill Ledge
  const sill = new THREE.Mesh(
    new THREE.BoxGeometry(2.42, 0.11, 0.48),
    new THREE.MeshStandardMaterial({ color: 0x2e1065, roughness: 0.45 })
  );
  sill.position.set(0, -0.82, 0.16);
  windowGroup.add(sill);

  // Warm Lo-Fi Desk Lamp on Left Sill
  const lampBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.12, 0.05, 16),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6, roughness: 0.25 })
  );
  lampBase.position.set(-0.76, -0.74, 0.24);
  windowGroup.add(lampBase);

  const lampStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.018, 0.28, 8),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6 })
  );
  lampStem.position.set(-0.76, -0.6, 0.24);
  windowGroup.add(lampStem);

  const lampShade = new THREE.Mesh(
    new THREE.ConeGeometry(0.16, 0.18, 16),
    new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.9,
      roughness: 0.3,
    })
  );
  lampShade.position.set(-0.76, -0.45, 0.24);
  windowGroup.add(lampShade);

  // Steaming Ceramic Coffee / Tea Mug on Right Sill
  const mug = new THREE.Mesh(
    new THREE.CylinderGeometry(0.085, 0.075, 0.16, 16),
    new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.25 })
  );
  mug.position.set(0.68, -0.68, 0.25);
  windowGroup.add(mug);

  const steamWisps = [];
  const steamMat = new THREE.MeshBasicMaterial({
    color: 0xe0f2fe,
    transparent: true,
    opacity: 0.45,
  });
  for (let i = 0; i < 3; i++) {
    const wisp = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), steamMat.clone());
    wisp.position.set(0.68, -0.54 + i * 0.09, 0.25);
    windowGroup.add(wisp);
    steamWisps.push({ mesh: wisp, offset: i * 1.1 });
  }

  group.add(windowGroup);

  // 2. Falling Neon Raindrops
  const drops = [];
  const dropGeo = new THREE.CylinderGeometry(0.011, 0.011, 0.22, 8);
  const dropMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.72,
  });

  for (let i = 0; i < 24; i++) {
    const drop = new THREE.Mesh(dropGeo, dropMat);
    drop.position.set(
      (Math.random() - 0.5) * 2.5,
      (Math.random() - 0.5) * 2.0,
      0.24 + Math.random() * 0.32
    );
    drop.rotation.z = -0.15;
    group.add(drop);
    drops.push({ mesh: drop, speed: 1.4 + Math.random() * 1.1 });
  }

  // 3. Cozy Warm Lamp Glow vs. Cool Midnight Rim Lighting
  const lampGlow = new THREE.PointLight(0xfbbf24, 7, 8);
  lampGlow.position.set(-0.75, -0.35, 0.65);
  group.add(lampGlow);

  const rainRim = new THREE.PointLight(0x38bdf8, 6, 10);
  rainRim.position.set(1.8, 1.4, 2.2);
  group.add(rainRim);

  return {
    group,
    draggable: windowGroup,
    description:
      'Rainy 2:00 AM apartment windows overlooking neon city skylines, warm amber desk lamps, steaming mugs, and dusty vinyl-crackle chillhop beats.',
    background: 'radial-gradient(circle at 50% 35%, #312e81 0%, #1e1b4b 60%, #090d16 100%)',
    update(t, bounce, spring) {
      windowGroup.rotation.y = Math.sin(t * 0.5) * 0.18;
      windowGroup.position.y = -bounce * 0.15;

      // Gentle rising steam over the mug
      steamWisps.forEach((s) => {
        const cycle = (t * 0.65 + s.offset) % 1;
        s.mesh.position.y = -0.56 + cycle * 0.28;
        s.mesh.position.x = 0.68 + Math.sin(t * 3 + s.offset) * 0.025;
        s.mesh.material.opacity = (1 - cycle) * 0.45;
      });

      // Continuous midnight rainfall
      drops.forEach((d) => {
        d.mesh.position.y -= d.speed * 0.025;
        if (d.mesh.position.y < -1.15) {
          d.mesh.position.y = 1.15;
        }
      });

      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
