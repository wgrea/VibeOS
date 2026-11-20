// js/aesthetics/vaporwave/simpsonswave.js

import * as THREE from 'three';

export function createSimpsonswave() {
  const group = new THREE.Group();

  // 1. Unified Retro Living-Room CRT Television Set (Draggable / Arrow-Key Interactive)
  const tvGroup = new THREE.Group();

  const casingMat = new THREE.MeshStandardMaterial({
    color: 0x3b2f4a,
    roughness: 0.42,
    metalness: 0.28,
  });

  // Main Retro TV Cabinet
  const tvBody = new THREE.Mesh(new THREE.BoxGeometry(1.82, 1.36, 1.05), casingMat);
  tvBody.position.z = 0.05;
  tvGroup.add(tvBody);

  // Tapered Rear Cathode-Ray Tube Housing
  const rearHousing = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.88, 0.45), casingMat);
  rearHousing.position.z = -0.58;
  tvGroup.add(rearHousing);

  // Mid-Century Tapered TV Legs
  const legMat = new THREE.MeshStandardMaterial({ color: 0x581c87, roughness: 0.5 });
  [-0.65, 0.65].forEach((lx) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.025, 0.36, 10), legMat);
    leg.position.set(lx, -0.82, 0.15);
    leg.rotation.z = lx > 0 ? 0.18 : -0.18;
    tvGroup.add(leg);
  });

  // Nostalgic Sunset-Amber & VHS Purple CRT Screen
  const screen = new THREE.Mesh(
    new THREE.BoxGeometry(1.36, 1.02, 0.06),
    new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xd946ef,
      emissiveIntensity: 0.85,
      roughness: 0.12,
    })
  );
  screen.position.set(-0.1, 0.02, 0.56);
  tvGroup.add(screen);

  // Glowing Golden-Yellow Sunset & Fluffy Clouds Inside the VHS Screen
  const sunDisc = new THREE.Mesh(
    new THREE.CircleGeometry(0.28, 24),
    new THREE.MeshBasicMaterial({ color: 0xfef08a })
  );
  sunDisc.position.set(-0.1, 0.06, 0.595);
  tvGroup.add(sunDisc);

  const cloudMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.88,
  });
  const screenClouds = [];
  [
    { x: -0.36, y: 0.24, s: 0.85 },
    { x: 0.18, y: 0.18, s: 0.72 },
  ].forEach(({ x, y, s }) => {
    const cGroup = new THREE.Group();
    [
      [0, 0, 0.11],
      [-0.09, -0.02, 0.08],
      [0.09, -0.02, 0.085],
    ].forEach(([px, py, r]) => {
      const puff = new THREE.Mesh(new THREE.CircleGeometry(r, 16), cloudMat);
      puff.position.set(px, py, 0);
      cGroup.add(puff);
    });
    cGroup.position.set(x, y, 0.6);
    cGroup.scale.setScalar(s);
    tvGroup.add(cGroup);
    screenClouds.push({ mesh: cGroup, baseX: x });
  });

  // VHS Tracking Scanline Bars across Screen
  const scanlines = [];
  for (let i = 0; i < 5; i++) {
    const line = new THREE.Mesh(
      new THREE.PlaneGeometry(1.32, 0.032),
      new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.48 })
    );
    line.position.set(-0.1, -0.4 + i * 0.2, 0.605);
    tvGroup.add(line);
    scanlines.push(line);
  }

  // Right-Side Rotary Channel & Volume Dials
  const dialMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    metalness: 0.5,
    roughness: 0.3,
  });
  [0.24, -0.02].forEach((dy) => {
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 16), dialMat);
    dial.rotation.x = Math.PI / 2;
    dial.position.set(0.73, dy, 0.58);
    tvGroup.add(dial);
  });

  // Classic Rabbit-Ear V-Antennas
  const antMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.9,
    roughness: 0.15,
  });
  const antLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.95, 8), antMat);
  antLeft.position.set(-0.25, 1.05, -0.05);
  antLeft.rotation.z = 0.42;
  tvGroup.add(antLeft);

  const antRight = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.95, 8), antMat);
  antRight.position.set(0.25, 1.05, -0.05);
  antRight.rotation.z = -0.42;
  tvGroup.add(antRight);

  group.add(tvGroup);

  // 2. Orbiting Pink-Frosted Sprinkle Donut Halo
  const donutGroup = new THREE.Group();
  const dough = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.13, 16, 32),
    new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.55 })
  );
  donutGroup.add(dough);

  const frosting = new THREE.Mesh(
    new THREE.TorusGeometry(0.325, 0.125, 16, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0xf472b6,
      emissive: 0xdb2777,
      emissiveIntensity: 0.35,
      roughness: 0.18,
      clearcoat: 0.9,
    })
  );
  frosting.position.z = 0.018;
  donutGroup.add(frosting);

  const sprinkleColors = [0x38bdf8, 0xfef08a, 0xffffff, 0xc084fc];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const sprinkle = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.014, 0.035, 4, 8),
      new THREE.MeshBasicMaterial({ color: sprinkleColors[i % sprinkleColors.length] })
    );
    sprinkle.position.set(Math.cos(a) * 0.32, Math.sin(a) * 0.32, 0.14);
    sprinkle.rotation.z = a + 0.6;
    donutGroup.add(sprinkle);
  }
  group.add(donutGroup);

  // 3. Warm VHS Magenta & Sunset Amber Studio Lighting
  const magentaGlow = new THREE.PointLight(0xe879f9, 10, 10);
  magentaGlow.position.set(0, 0.2, 2.0);
  group.add(magentaGlow);

  const amberRim = new THREE.PointLight(0xfacc15, 8, 10);
  amberRim.position.set(-2.0, 1.5, 1.8);
  group.add(amberRim);

  return {
    group,
    draggable: tvGroup,
    description:
      'Bittersweet 90s cartoon nostalgia filtered through purple-tinted VHS tracking, warm amber CRT glow, and slowed-down synthwave melancholy.',
    background: 'radial-gradient(circle at 50% 35%, #a21caf 0%, #4c1d95 55%, #0f172a 100%)',
    update(t, bounce, spring) {
      tvGroup.rotation.y = Math.sin(t * 0.55) * 0.28;
      tvGroup.position.y = Math.sin(t * 1.4) * 0.08 - bounce * 0.18;

      // Gentle cloud drift inside the VHS screen
      screenClouds.forEach((c, idx) => {
        c.mesh.position.x = c.baseX + Math.sin(t * 0.8 + idx) * 0.08;
      });

      // Rolling VHS scanlines
      scanlines.forEach((line, idx) => {
        line.position.y = -0.44 + ((t * 0.45 + idx * 0.2) % 0.94);
      });

      // Orbiting pink-frosted donut
      const dAngle = t * 0.7;
      donutGroup.position.set(
        Math.cos(dAngle) * 1.65,
        0.55 + Math.sin(t * 1.8) * 0.18 - bounce * 0.2,
        Math.sin(dAngle) * 1.65
      );
      donutGroup.rotation.x = t * 1.1;
      donutGroup.rotation.y = t * 0.9;

      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
