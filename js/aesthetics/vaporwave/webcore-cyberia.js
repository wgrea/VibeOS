// js/aesthetics/vaporwave/webcore-cyberia.js

import * as THREE from 'three';

export function createWebcoreCyberia() {
  const group = new THREE.Group();

  // 1. Unified Y2K PS1 Cyber-Angel & Pop-Up Core (Draggable / Arrow-Key Interactive)
  const cyberGroup = new THREE.Group();

  // Y2K PS1-Era Low-Poly Wireframe Torus Knot
  const cyberCore = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.74, 0.2, 48, 8, 3, 4),
    new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x15803d,
      emissiveIntensity: 0.85,
      wireframe: true,
    })
  );
  cyberGroup.add(cyberCore);

  // Solid Inner Chrome Glitch Cube
  const innerCube = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.55,
      metalness: 0.92,
      roughness: 0.08,
      clearcoat: 1.0,
    })
  );
  cyberGroup.add(innerCube);

  // Early-Web Pop-Up Window Wireframe Border around Inner Core
  const popupFrame = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.95, 0.72, 0.06)),
    new THREE.LineBasicMaterial({ color: 0x38bdf8 })
  );
  cyberGroup.add(popupFrame);

  // Low-Poly PS1 Cyber-Angel Wireframe Wings
  const wingMat = new THREE.MeshBasicMaterial({
    color: 0xa3e635,
    wireframe: true,
    transparent: true,
    opacity: 0.75,
  });
  [-1, 1].forEach((side) => {
    const wingGeo = new THREE.ConeGeometry(0.38, 1.05, 3);
    const wing = new THREE.Mesh(wingGeo, wingMat);
    wing.position.set(side * 1.05, 0.18, -0.15);
    wing.rotation.z = -side * 1.15;
    wing.rotation.y = side * 0.25;
    cyberGroup.add(wing);
  });

  group.add(cyberGroup);

  // 2. Fast-Orbiting Amen-Break / Early-Web Pop-Up Shards
  const shards = [];
  const shardColors = [0x38bdf8, 0xf43f5e, 0xa3e635, 0xc084fc];

  for (let i = 0; i < 8; i++) {
    const shard = new THREE.Mesh(
      new THREE.TetrahedronGeometry(0.17, 0),
      new THREE.MeshStandardMaterial({
        color: shardColors[i % shardColors.length],
        emissive: shardColors[i % shardColors.length],
        emissiveIntensity: 0.75,
        flatShading: true,
      })
    );
    const a = (i / 8) * Math.PI * 2;
    const baseY = (i % 2 === 0 ? 1 : -1) * 0.35;
    shard.position.set(Math.cos(a) * 1.52, baseY, Math.sin(a) * 1.52);
    group.add(shard);
    shards.push({ mesh: shard, angle: a, baseY });
  }

  // 3. Acid-Green Y2K Cyberspace Grid Floor & Rim Lighting
  const grid = new THREE.GridHelper(12, 24, 0x22c55e, 0x1e1b4b);
  grid.position.y = -1.25;
  grid.material.transparent = true;
  grid.material.opacity = 0.45;
  group.add(grid);

  const limeLight = new THREE.PointLight(0x4ade80, 10, 11);
  limeLight.position.set(2.0, 1.6, 2.2);
  group.add(limeLight);

  const cyanLight = new THREE.PointLight(0x38bdf8, 9, 11);
  cyanLight.position.set(-2.0, -1.4, 2.2);
  group.add(cyanLight);

  return {
    group,
    description:
      'Chaotic Y2K net-art, PS1 low-poly cyber-angels, Lain-era CRT mysticism, and high-BPM jungle/breakcore Amen-break energy.',
    background: 'radial-gradient(circle at 50% 35%, #064e3b 0%, #1e1b4b 55%, #020617 100%)',
    update(t, bounce, spring) {
      // High-BPM Jungle / Breakcore kinetic spin + Amen-break stutter
      const amenSnap = Math.sin(t * 18) > 0.9 ? 0.14 : 0;

      cyberCore.rotation.y = t * 1.4 + amenSnap;
      cyberCore.rotation.z = t * 0.9;

      innerCube.rotation.x = -t * 1.8;
      innerCube.rotation.y = -t * 1.5 - amenSnap;

      popupFrame.rotation.y = Math.sin(t * 1.2) * 0.45;
      cyberGroup.position.y = -bounce * 0.2;

      shards.forEach((s, idx) => {
        const a = s.angle + t * 2.1;
        s.mesh.position.x = Math.cos(a) * 1.52;
        s.mesh.position.z = Math.sin(a) * 1.52;
        s.mesh.position.y = s.baseY + Math.sin(t * 6 + idx) * 0.12 + amenSnap - bounce * 0.18;
        s.mesh.rotation.x = t * 3 + idx;
        s.mesh.rotation.y = t * 2.5;
      });

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
