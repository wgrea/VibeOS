// js/aesthetics/vaporwave/broken-transmission.js

import * as THREE from 'three';

export function createBrokenTransmission() {
  const group = new THREE.Group();

  // 1. Unified Retro CRT Television Set (Draggable / Arrow-Key Interactive)
  const tvGroup = new THREE.Group();

  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.45,
    metalness: 0.25,
  });

  // Main Front CRT Cabinet
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.95, 1.52, 0.95), chassisMat);
  body.position.z = 0.15;
  tvGroup.add(body);

  // Tapered Rear Cathode-Ray Tube Neck Housing
  const rearTube = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.92, 0.55), chassisMat);
  rearTube.position.z = -0.55;
  tvGroup.add(rearTube);

  // Raised Front Bezel Frame
  const bezel = new THREE.Mesh(
    new THREE.BoxGeometry(1.82, 1.38, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.55 })
  );
  bezel.position.z = 0.63;
  tvGroup.add(bezel);

  // 2. Procedural SMPTE Broadcast Color Bars + CRT Scanline Static Texture
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  const bars = ['#f8fafc', '#facc15', '#22d3ee', '#4ade80', '#e879f9', '#ef4444', '#3b82f6'];
  bars.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect((i * 128) / bars.length, 0, 128 / bars.length + 1, 92);
  });

  // Lower Sync / Static Band
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 92, 128, 36);
  for (let i = 0; i < 180; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.45)' : 'rgba(56,189,248,0.35)';
    ctx.fillRect(Math.random() * 128, 92 + Math.random() * 36, 4, 2);
  }

  // Subtle Horizontal CRT Scanlines
  ctx.fillStyle = 'rgba(9, 13, 22, 0.28)';
  for (let y = 0; y < 128; y += 4) {
    ctx.fillRect(0, y, 128, 1.5);
  }

  const screenTex = new THREE.CanvasTexture(canvas);
  screenTex.wrapS = THREE.RepeatWrapping;
  screenTex.wrapT = THREE.RepeatWrapping;

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.42, 1.12),
    new THREE.MeshBasicMaterial({ map: screenTex })
  );
  screen.position.set(-0.1, 0, 0.675);
  tvGroup.add(screen);

  // Rotary Channel & Volume Dials on Right Control Strip
  const dialMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.75,
    roughness: 0.25,
  });
  [0.32, 0.05].forEach((dialY) => {
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.07, 16), dialMat);
    dial.rotation.x = Math.PI / 2;
    dial.position.set(0.75, dialY, 0.67);
    tvGroup.add(dial);
  });

  // Glowing Power LED
  const powerLed = new THREE.Mesh(
    new THREE.SphereGeometry(0.022, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xef4444 })
  );
  powerLed.position.set(0.75, -0.42, 0.675);
  tvGroup.add(powerLed);

  // 3. Rabbit-Ear Antennas with Glowing Signal Tips
  const antennaMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.9,
    roughness: 0.15,
  });
  const tipMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });

  [-1, 1].forEach((side) => {
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.1, 8), antennaMat);
    rod.position.set(side * 0.35, 1.18, 0.05);
    rod.rotation.z = -side * 0.45;
    tvGroup.add(rod);

    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.042, 12, 12), tipMat);
    tip.position.set(side * 0.58, 1.66, 0.05);
    tvGroup.add(tip);
  });

  group.add(tvGroup);

  // 4. Midnight Broadcast Studio Rim Lighting
  const screenGlow = new THREE.PointLight(0x38bdf8, 7, 8);
  screenGlow.position.set(0, 0.1, 1.65);
  group.add(screenGlow);

  const magentaRim = new THREE.PointLight(0xe879f9, 6, 10);
  magentaRim.position.set(-2.0, 1.5, -1.5);
  group.add(magentaRim);

  return {
    group,
    draggable: tvGroup,
    description:
      'Late-night channel-surfing surrealism built from hijacked TV signals, SMPTE color-bar test cards, static snow, and fragmented commercial broadcasts.',
    background: 'radial-gradient(circle at 50% 40%, #312e81 0%, #1e1b4b 60%, #090d16 100%)',
    update(t, bounce, spring) {
      // Vertical V-hold roll + occasional horizontal sync tear
      screenTex.offset.y = (t * 0.8 + bounce * 2) % 1;
      if (Math.sin(t * 9.5) > 0.94) {
        screenTex.offset.x = (Math.random() - 0.5) * 0.18;
      } else {
        screenTex.offset.x *= 0.8;
      }

      tvGroup.rotation.y = Math.sin(t * 0.9) * 0.3 + spring * 0.4;
      tvGroup.position.y = Math.sin(t * 1.6) * 0.08 - bounce * 0.15;
    },
  };
}
