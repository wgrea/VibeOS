// js/aesthetics/dark/bastardcore.js
import * as THREE from 'three';

export function createBastardcore() {
  const group = new THREE.Group();

  // Materials: Scarred Concrete, Blood-Crimson Emissive, Corroded Steel, Dark Obsidian
  const monolithMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.85,
    metalness: 0.25,
  });

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x3f3f46,
    roughness: 0.35,
    metalness: 0.85,
  });

  const crimsonMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    emissive: 0x991b1b,
    emissiveIntensity: 0.85,
    roughness: 0.2,
  });

  const wireCrimsonMat = new THREE.LineBasicMaterial({
    color: 0xef4444,
    transparent: true,
    opacity: 0.65,
  });

  // 1. Fractured Brutalist Core Monolith (asymmetric stacked blocks)
  const coreGroup = new THREE.Group();

  const lowerSlab = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.55, 0.85), monolithMat);
  lowerSlab.position.set(-0.04, -0.45, 0);
  lowerSlab.rotation.y = 0.12;
  coreGroup.add(lowerSlab);

  const midFracture = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.48, 0.78), monolithMat);
  midFracture.position.set(0.06, 0.08, -0.03);
  midFracture.rotation.set(0.04, -0.18, -0.05);
  coreGroup.add(midFracture);

  const upperBlock = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.42, 0.65), monolithMat);
  upperBlock.position.set(-0.03, 0.55, 0.04);
  upperBlock.rotation.set(-0.06, 0.24, 0.07);
  coreGroup.add(upperBlock);

  // Glowing crimson fault-line seams wedged between the concrete slabs
  const seam1 = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.045, 0.82), crimsonMat);
  seam1.position.set(0.01, -0.16, 0);
  seam1.rotation.z = -0.03;
  coreGroup.add(seam1);

  const seam2 = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.045, 0.7), crimsonMat);
  seam2.position.set(0.02, 0.33, 0.01);
  seam2.rotation.z = 0.04;
  coreGroup.add(seam2);

  group.add(coreGroup);

  // 2. Jagged Iron Spikes Piercing Through the Monolith
  const spikeGroup = new THREE.Group();
  const spikeGeo = new THREE.ConeGeometry(0.065, 1.65, 4);

  const spikeConfigs = [
    { pos: [0, 0.1, 0], rot: [0.35, 0.2, 0.65] },
    { pos: [0.05, -0.05, 0.05], rot: [-0.45, 0.5, -0.75] },
    { pos: [-0.08, 0.2, -0.05], rot: [0.85, -0.3, 0.25] },
    { pos: [0.04, -0.25, -0.04], rot: [-0.75, -0.4, 0.55] },
  ];

  spikeConfigs.forEach((cfg) => {
    const spike = new THREE.Mesh(spikeGeo, steelMat);
    spike.position.set(...cfg.pos);
    spike.rotation.set(...cfg.rot);
    spikeGroup.add(spike);
  });

  group.add(spikeGroup);

  // 3. Orbiting Shattered Crown / Barbed Halo Shards
  const shardGroup = new THREE.Group();
  const shardGeo = new THREE.TetrahedronGeometry(0.14, 0);
  const shards = [];
  const shardCount = 10;

  for (let i = 0; i < shardCount; i++) {
    const angle = (i / shardCount) * Math.PI * 2;
    const radius = 1.05 + (i % 3) * 0.14;
    const shard = new THREE.Mesh(shardGeo, i % 3 === 0 ? crimsonMat : steelMat);

    shard.position.set(
      Math.cos(angle) * radius,
      Math.sin(i * 1.7) * 0.35,
      Math.sin(angle) * radius
    );
    shard.rotation.set(i * 0.8, i * 1.1, i * 0.5);

    shardGroup.add(shard);
    shards.push({
      mesh: shard,
      angle,
      radius,
      yOffset: shard.position.y,
      speed: 0.45 + (i % 4) * 0.12,
    });
  }

  group.add(shardGroup);

  // 4. Angular Wireframe Containment Frame
  const cageGeo = new THREE.OctahedronGeometry(1.42, 0);
  const cageEdges = new THREE.EdgesGeometry(cageGeo);
  const containmentCage = new THREE.LineSegments(cageEdges, wireCrimsonMat);
  group.add(containmentCage);

  return {
    group,
    description:
      'Rooted in anti-establishment punk, dark industrial noise, and gritty underground subcultures, Bastardcore embraces raw distortion, brutalist textures, corroded metal, and defiant, unapologetic visual chaos.',
    background: 'radial-gradient(circle at 50% 40%, #270909 0%, #11090c 55%, #050505 100%)',
    update(t, bounce, spring) {
      // Heavy, industrial micro-tremor on the fractured monolith
      coreGroup.rotation.y = Math.sin(t * 0.5) * 0.22;
      coreGroup.position.y = Math.sin(t * 1.6) * 0.03;

      // Pulse the crimson fault-line seams
      const pulse = 0.65 + Math.sin(t * 3.8) * 0.35;
      crimsonMat.emissiveIntensity = pulse;

      // Orbit the jagged shrapnel shards
      shards.forEach((item, idx) => {
        const currentAngle = item.angle + t * item.speed;
        item.mesh.position.x = Math.cos(currentAngle) * item.radius;
        item.mesh.position.z = Math.sin(currentAngle) * item.radius;
        item.mesh.position.y = item.yOffset + Math.sin(t * 2.1 + idx) * 0.06;
        item.mesh.rotation.x += 0.015;
        item.mesh.rotation.y -= 0.02;
      });

      // Counter-rotate the outer crimson containment octahedron
      containmentCage.rotation.y = -t * 0.25;
      containmentCage.rotation.z = Math.sin(t * 0.4) * 0.15;

      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
