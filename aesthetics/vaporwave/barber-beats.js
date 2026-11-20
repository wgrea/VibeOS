// js/aesthetics/vaporwave/barber-beats.js

import * as THREE from 'three';

export function createBarberBeats() {
  const group = new THREE.Group();

  // 1. Unified Lounge Turntable & Barber Pole Assembly (Draggable / Arrow-Key Interactive)
  const loungeGroup = new THREE.Group();

  // Turntable Platter / Vinyl Assembly
  const recordGroup = new THREE.Group();
  recordGroup.position.set(-0.28, -0.05, 0);
  recordGroup.rotation.x = Math.PI / 3;

  // Smooth Obsidian Lounge Vinyl Record
  const vinyl = new THREE.Mesh(
    new THREE.CylinderGeometry(1.12, 1.12, 0.05, 48),
    new THREE.MeshPhysicalMaterial({
      color: 0x1c1917,
      roughness: 0.14,
      metalness: 0.65,
      clearcoat: 1.0,
    })
  );
  recordGroup.add(vinyl);

  // Subtle Concentric Vinyl Groove Rings (makes rotation clearly visible)
  const grooveMat = new THREE.MeshBasicMaterial({
    color: 0x44403c,
    transparent: true,
    opacity: 0.55,
  });
  [0.58, 0.78, 0.96].forEach((r) => {
    const groove = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.012, 48), grooveMat);
    groove.rotation.x = -Math.PI / 2;
    groove.position.y = 0.027;
    recordGroup.add(groove);
  });

  // Warm Gold-Foil Center Label & Spindle
  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.36, 0.06, 32),
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.45,
      metalness: 0.85,
      roughness: 0.18,
    })
  );
  recordGroup.add(label);

  const spindle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.12, 12),
    new THREE.MeshStandardMaterial({ color: 0xfef3c7, metalness: 0.9, roughness: 0.1 })
  );
  recordGroup.add(spindle);

  loungeGroup.add(recordGroup);

  // Sleek Chrome Turntable Tonearm Resting on Vinyl
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xf5f5f4,
    metalness: 0.92,
    roughness: 0.12,
  });
  const tonearmPivot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.14, 16), chromeMat);
  tonearmPivot.position.set(0.72, 0.48, -0.35);
  loungeGroup.add(tonearmPivot);

  const tonearmRod = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.05, 10), chromeMat);
  tonearmRod.position.set(0.45, 0.18, 0.02);
  tonearmRod.rotation.set(0.65, 0, 0.52);
  loungeGroup.add(tonearmRod);

  // 2. Classic Red-White-Blue Spinning Barber Pole Pillar
  const poleGroup = new THREE.Group();
  poleGroup.position.set(1.36, 0.05, 0.15);

  // Procedural Diagonal Red, White & Royal-Blue Barber Stripes
  const stripeCanvas = document.createElement('canvas');
  stripeCanvas.width = 128;
  stripeCanvas.height = 128;
  const sCtx = stripeCanvas.getContext('2d');
  sCtx.fillStyle = '#ffffff';
  sCtx.fillRect(0, 0, 128, 128);

  const stripePalette = ['#ef4444', '#ffffff', '#2563eb', '#ffffff'];
  for (let y = -128; y < 256; y += 32) {
    stripePalette.forEach((col, idx) => {
      sCtx.fillStyle = col;
      sCtx.beginPath();
      sCtx.moveTo(0, y + idx * 8);
      sCtx.lineTo(128, y + idx * 8 - 64);
      sCtx.lineTo(128, y + idx * 8 - 56);
      sCtx.lineTo(0, y + idx * 8 + 8);
      sCtx.closePath();
      sCtx.fill();
    });
  }

  const barberTex = new THREE.CanvasTexture(stripeCanvas);
  barberTex.wrapS = THREE.RepeatWrapping;
  barberTex.wrapT = THREE.RepeatWrapping;
  barberTex.repeat.set(1, 2);

  // Inner Rotating Striped Cylinder
  const innerPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.135, 0.135, 1.36, 24),
    new THREE.MeshStandardMaterial({
      map: barberTex,
      roughness: 0.25,
      metalness: 0.15,
    })
  );
  poleGroup.add(innerPole);

  // Outer Clear Glass Cylinder Case
  const glassCase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.175, 0.175, 1.4, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.05,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.35,
    })
  );
  poleGroup.add(glassCase);

  // Chrome End Caps & Finial Balls
  [-0.74, 0.74].forEach((capY) => {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.08, 24), chromeMat);
    cap.position.y = capY;
    poleGroup.add(cap);

    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.065, 14, 14), chromeMat);
    finial.position.y = capY + (capY > 0 ? 0.08 : -0.08);
    poleGroup.add(finial);
  });

  loungeGroup.add(poleGroup);
  group.add(loungeGroup);

  // 3. Warm Vintage Lounge Amber & Tungsten Rim Lighting
  const amberLight = new THREE.PointLight(0xf59e0b, 11, 10);
  amberLight.position.set(-1.6, 1.8, 2.2);
  group.add(amberLight);

  const warmFill = new THREE.PointLight(0xfef3c7, 7, 10);
  warmFill.position.set(2.0, 1.0, 2.2);
  group.add(warmFill);

  return {
    group,
    draggable: loungeGroup,
    description:
      'Slowed, mid-tempo lounge jazz, bossa nova, and neo-soul loops steeped in warm vinyl crackle, vintage barbershop imagery, and smoky downtempo class.',
    background: 'radial-gradient(circle at 50% 35%, #78350f 0%, #292524 60%, #0c0a09 100%)',
    update(t, bounce, spring) {
      recordGroup.rotation.y = t * 0.85;
      loungeGroup.position.y = -bounce * 0.16;

      // Continuous upward spiral barber-pole scroll
      innerPole.rotation.y = t * 1.8;
      barberTex.offset.y = (t * 0.45) % 1;

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
