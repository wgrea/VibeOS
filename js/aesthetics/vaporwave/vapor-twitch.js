// js/aesthetics/vaporwave/vapor-twitch.js

import * as THREE from 'three';

export function createVaporTwitch() {
  const group = new THREE.Group();

  // 1. Unified Elastic Future-Bass Crystal & Synth Rings (Draggable / Arrow-Key Interactive)
  const twitchGroup = new THREE.Group();

  // Iridescent Neon-Violet Future-Bass Octahedron Core
  const crystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.84, 1),
    new THREE.MeshPhysicalMaterial({
      color: 0x8b5cf6,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.65,
      roughness: 0.08,
      metalness: 0.35,
      clearcoat: 1.0,
    })
  );
  twitchGroup.add(crystal);

  // Crisp Cyan Wireframe Edge Cage over Crystal
  const crystalWire = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.88, 1),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    })
  );
  twitchGroup.add(crystalWire);

  // Snappy Elastic Synth Rings
  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(1.25, 0.048, 16, 64),
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      roughness: 0.15,
    })
  );
  twitchGroup.add(ring1);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.48, 0.038, 16, 64),
    new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      emissive: 0xdb2777,
      emissiveIntensity: 0.9,
      roughness: 0.15,
    })
  );
  twitchGroup.add(ring2);

  group.add(twitchGroup);

  // 2. Orbiting Micro-Chopped Vocal / Synth Shards
  const shards = [];
  const shardGeo = new THREE.OctahedronGeometry(0.11, 0);
  const shardMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xeab308,
    emissiveIntensity: 0.85,
    metalness: 0.5,
    roughness: 0.15,
  });

  for (let i = 0; i < 6; i++) {
    const shard = new THREE.Mesh(shardGeo, shardMat);
    const angle = (i / 6) * Math.PI * 2;
    group.add(shard);
    shards.push({ mesh: shard, angle, phase: i * 0.9 });
  }

  // 3. Vibrant Future-Bass Rim Lighting
  const cyanLight = new THREE.PointLight(0x38bdf8, 9, 11);
  cyanLight.position.set(2.2, 1.8, 2.4);
  group.add(cyanLight);

  const pinkLight = new THREE.PointLight(0xf472b6, 9, 11);
  pinkLight.position.set(-2.2, -1.6, 2.4);
  group.add(pinkLight);

  return {
    group,
    description:
      'Lush 80s and 90s vaporwave chords fused with elastic future-bass synths, heavy sidechain pumping, and glitchy micro-chopped vocal edits.',
    background: 'radial-gradient(circle at 50% 35%, #6d28d9 0%, #1e1b4b 60%, #090d16 100%)',
    update(t, bounce, spring) {
      // Elastic future-bass sidechain twitch pulse
      const pump = Math.pow(Math.sin(t * 3.8), 4);
      const sidechain = 1 + pump * 0.24;

      // Occasional crisp glitch-twitch micro-jitter
      const twitchSnap = Math.sin(t * 15.2) > 0.92 ? 0.12 : 0;

      crystal.scale.setScalar(sidechain);
      crystalWire.scale.setScalar(sidechain * 1.03);
      crystal.rotation.y = t * 0.7 + twitchSnap;
      crystalWire.rotation.y = -t * 0.5 - twitchSnap;

      ring1.rotation.x = Math.sin(t * 1.9) * 1.1 + twitchSnap;
      ring1.rotation.y = t * 0.85;

      ring2.rotation.y = Math.cos(t * 1.9) * 1.1 - twitchSnap;
      ring2.rotation.z = -t * 0.65;

      twitchGroup.position.y = -bounce * 0.2;

      // Orbiting vocal-chop shards snapping outward on each sidechain pump
      const orbitRadius = 1.72 + pump * 0.22;
      shards.forEach((s) => {
        const a = s.angle + t * 1.05;
        s.mesh.position.set(
          Math.cos(a) * orbitRadius,
          Math.sin(t * 3.8 + s.phase) * 0.32 - bounce * 0.2,
          Math.sin(a) * orbitRadius
        );
        s.mesh.rotation.x = t * 2.5 + twitchSnap * 4;
        s.mesh.rotation.y = t * 2.1;
      });

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
