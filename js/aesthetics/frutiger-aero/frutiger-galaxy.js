import * as THREE from 'three';

export function createFrutigerGalaxy() {
  const group = new THREE.Group();

  // Translucent Aqua-Violet Cosmic Core
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(0.95, 32, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x3b0764,
      emissiveIntensity: 0.75,
      roughness: 0.08,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      transparent: true,
      opacity: 0.92,
    })
  );
  group.add(planet);

  // Glossy Neon-Cyan Saturn Ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.55, 0.09, 16, 64),
    new THREE.MeshPhysicalMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      clearcoat: 1.0,
    })
  );
  ring.rotation.x = Math.PI / 2.6;
  ring.rotation.y = 0.25;
  group.add(ring);

  // Orbiting Glossy Micro-Orbs (Stars / Bubbles)
  const orbGroup = new THREE.Group();
  const orbColors = [0xa855f7, 0x34d399, 0x60a5fa, 0xf472b6];
  const orbs = [];

  for (let i = 0; i < 14; i++) {
    const angle = (i / 14) * Math.PI * 2;
    const radius = 1.3 + (i % 3) * 0.35;
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.08 + (i % 3) * 0.03, 16, 16),
      new THREE.MeshPhysicalMaterial({
        color: orbColors[i % orbColors.length],
        emissive: orbColors[i % orbColors.length],
        emissiveIntensity: 0.55,
        roughness: 0.05,
        clearcoat: 1.0,
      })
    );
    orb.position.set(
      Math.cos(angle) * radius,
      Math.sin(i * 1.4) * 0.55,
      Math.sin(angle) * radius
    );
    orbGroup.add(orb);
    orbs.push({ mesh: orb, baseY: orb.position.y, phase: i * 0.7 });
  }
  group.add(orbGroup);

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #3b0764 0%, #0c4a6e 55%, #030712 100%)',
    update(t, bounce, spring) {
      planet.rotation.y = t * 0.45;
      ring.rotation.z = t * 0.35;
      orbGroup.rotation.y = -t * 0.4;

      orbs.forEach((o) => {
        o.mesh.position.y = o.baseY + Math.sin(t * 2.2 + o.phase) * 0.12;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
