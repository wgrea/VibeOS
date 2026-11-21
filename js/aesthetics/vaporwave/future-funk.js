// js/aesthetics/vaporwave/future-funk.js

import * as THREE from 'three';

export function createFutureFunk() {
  const group = new THREE.Group();

  // 1. Glossy 80s Nightclub Dancefloor & Glowing Disco Tiles
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 14),
    new THREE.MeshPhysicalMaterial({ color: 0x1e1b4b, roughness: 0.1, clearcoat: 1.0 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.3;
  group.add(floor);

  const neonGrid = new THREE.GridHelper(14, 14, 0xfacc15, 0xf43f5e);
  neonGrid.position.y = -1.29;
  group.add(neonGrid);

  // Illuminated Pulsing Dancefloor Squares
  const floorTiles = [];
  const tileColors = [0xff007f, 0xfacc15, 0x22d3ee, 0xc084fc];
  const tileGeo = new THREE.PlaneGeometry(0.92, 0.92);
  tileGeo.rotateX(-Math.PI / 2);

  for (let x = -3; x <= 3; x++) {
    for (let z = -3; z <= 3; z++) {
      if ((x + z) % 2 !== 0) continue;
      const color = tileColors[Math.abs(x * 3 + z) % tileColors.length];
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.35,
      });
      const tile = new THREE.Mesh(tileGeo, mat);
      tile.position.set(x, -1.285, z);
      group.add(tile);
      floorTiles.push({ mesh: tile, phase: (x + z) * 0.8 });
    }
  }

  // 2. Faceted Chrome Disco Ball Suspended Overhead (Draggable / Arrow-Key Interactive)
  const discoBall = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.1, 2),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.95,
      flatShading: true,
    })
  );
  discoBall.position.y = 0.55;
  group.add(discoBall);

  // Hanging Cord
  const cord = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8),
    new THREE.MeshBasicMaterial({ color: 0x94a3b8 })
  );
  cord.position.y = 2.1;
  group.add(cord);

  // 3. Orbiting 80s City-Pop / Disco 12" Vinyl Records
  const records = [];
  const vinylMat = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    roughness: 0.2,
    metalness: 0.65,
  });

  [
    { labelColor: 0xff007f, angle: 0 },
    { labelColor: 0xfacc15, angle: Math.PI },
  ].forEach(({ labelColor, angle }) => {
    const disc = new THREE.Group();

    const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.025, 32), vinylMat);
    wax.rotation.x = Math.PI / 2.4;
    disc.add(wax);

    const centerLabel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.19, 0.028, 24),
      new THREE.MeshBasicMaterial({ color: labelColor })
    );
    centerLabel.rotation.x = Math.PI / 2.4;
    disc.add(centerLabel);

    group.add(disc);
    records.push({ mesh: disc, angle });
  });

  // 4. Scattered Mirror-Ball Light Sparkles
  const sparkles = [];
  const sparkleGeo = new THREE.SphereGeometry(0.045, 8, 8);
  for (let i = 0; i < 12; i++) {
    const sp = new THREE.Mesh(
      sparkleGeo,
      new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xfacc15 : 0xff71ce,
        transparent: true,
        opacity: 0.85,
      })
    );
    group.add(sp);
    sparkles.push({
      mesh: sp,
      radius: 1.75 + (i % 3) * 0.45,
      yOffset: -0.5 + (i % 4) * 0.55,
      phase: (i / 12) * Math.PI * 2,
    });
  }

  // 5. Energetic Magenta, Gold & Cyan Club Spotlights
  const pinkSpot = new THREE.PointLight(0xff007f, 8, 12);
  pinkSpot.position.set(-2.2, 0.8, 2);
  group.add(pinkSpot);

  const goldSpot = new THREE.PointLight(0xfacc15, 8, 12);
  goldSpot.position.set(2.2, 0.8, 2);
  group.add(goldSpot);

  const cyanRim = new THREE.PointLight(0x22d3ee, 5, 12);
  cyanRim.position.set(0, -0.5, 2.8);
  group.add(cyanRim);

  return {
    group,
    description:
      'High-BPM 80s Japanese City Pop and French House disco samples wrapped in glittering mirror balls, neon dancefloors, and upbeat retro anime nightlife.',
    background: 'radial-gradient(circle at 50% 25%, #831843 0%, #311042 55%, #09090b 100%)',
    update(t, bounce, spring) {
      discoBall.rotation.y = t * 1.15;
      discoBall.position.y = 0.55 - bounce * 0.2;
      discoBall.scale.setScalar(1 + spring * 0.25);

      // Orbiting 12" vinyl records
      records.forEach((rec, idx) => {
        const a = rec.angle + t * 0.95;
        rec.mesh.position.set(
          Math.cos(a) * 1.95,
          0.35 + Math.sin(t * 2.5 + idx) * 0.18 - bounce * 0.25,
          Math.sin(a) * 1.95
        );
        rec.mesh.rotation.z = t * 2.4;
      });

      // Pulsing disco floor tiles synced to upbeat 128 BPM groove
      floorTiles.forEach((tile) => {
        const pulse = Math.max(0, Math.sin(t * 5.5 + tile.phase));
        tile.mesh.material.opacity = 0.15 + pulse * 0.55;
      });

      // Sweeping mirror-ball light reflections
      sparkles.forEach((s) => {
        const a = t * 1.15 + s.phase;
        s.mesh.position.set(
          Math.cos(a) * s.radius,
          s.yOffset + Math.sin(t * 3 + s.phase) * 0.12,
          Math.sin(a) * s.radius
        );
      });

      // Orbiting club light flares
      pinkSpot.position.x = Math.cos(t * 2.2) * 2.5;
      pinkSpot.position.z = Math.sin(t * 2.2) * 2.5;
      goldSpot.position.x = Math.cos(t * 2.2 + Math.PI) * 2.5;
      goldSpot.position.z = Math.sin(t * 2.2 + Math.PI) * 2.5;
    },
  };
}
