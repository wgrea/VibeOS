// js/aesthetics/dark/cybercore.js
import * as THREE from 'three';

export function createCybercore() {
  const group = new THREE.Group();

  // 1. Liquid Obsidian Torus-Knot Core
  const obsidianMat = new THREE.MeshPhysicalMaterial({
    color: 0x090d16,
    emissive: 0x052e16,
    emissiveIntensity: 0.35,
    metalness: 0.9,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  });

  const core = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.44, 0.13, 100, 20),
    obsidianMat
  );
  group.add(core);

  // 2. Clean Vector Geodesic Containment Cage
  const cageGeo = new THREE.IcosahedronGeometry(0.96, 1);
  const cageEdges = new THREE.EdgesGeometry(cageGeo);
  const cage = new THREE.LineSegments(
    cageEdges,
    new THREE.LineBasicMaterial({
      color: 0x4ade80,
      transparent: true,
      opacity: 0.78,
    })
  );
  group.add(cage);

  // 3. Dual Tactical Gyroscopic HUD Rings
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x22c55e,
    transparent: true,
    opacity: 0.5,
  });

  const outerRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.32, 0.012, 8, 72),
    ringMat
  );
  outerRing.rotation.x = Math.PI / 2.2;
  group.add(outerRing);

  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.14, 0.009, 8, 64),
    new THREE.MeshBasicMaterial({
      color: 0x86efac,
      transparent: true,
      opacity: 0.35,
    })
  );
  innerRing.rotation.set(Math.PI / 3, 0.45, 0);
  group.add(innerRing);

  // 4. Orbiting Acid-Green Matrix Data Packets
  const packetMat = new THREE.MeshStandardMaterial({
    color: 0x4ade80,
    emissive: 0x22c55e,
    emissiveIntensity: 0.95,
    roughness: 0.2,
  });

  const packetGeo = new THREE.OctahedronGeometry(0.065, 0);
  const packets = [];
  const packetCount = 8;

  for (let i = 0; i < packetCount; i++) {
    const angle = (i / packetCount) * Math.PI * 2;
    const packet = new THREE.Mesh(packetGeo, packetMat);
    const radius = 1.32;
    const baseY = (i % 2 === 0 ? 1 : -1) * 0.22;

    packet.position.set(Math.cos(angle) * radius, baseY, Math.sin(angle) * radius);
    group.add(packet);
    packets.push({ mesh: packet, angle, radius, baseY });
  }

  return {
    group,
    description:
      'Rooted in late-1990s hacker cinema, Y2K cyber-thrillers, and early tactical UI design, Cybercore pairs pitch-black obsidian hardware with glowing acid-green vector wireframes, terminal telemetry rings, and high-speed data streams.',
    background: 'radial-gradient(circle at 50% 30%, #064e3b 0%, #022c22 50%, #000000 100%)',
    update(t, bounce, spring) {
      // Smooth continuous rotation of the liquid obsidian core
      core.rotation.x = t * 0.65;
      core.rotation.y = t * 0.85;

      // Counter-rotating geodesic wireframe shell
      cage.rotation.y = -t * 0.4;
      cage.rotation.z = t * 0.25;

      // Gyroscopic HUD ring precession
      outerRing.rotation.z = t * 0.35;
      innerRing.rotation.y = -t * 0.55;

      // Orbiting data packets with subtle vertical wave
      packets.forEach((p, idx) => {
        const a = p.angle + t * 0.6;
        p.mesh.position.x = Math.cos(a) * p.radius;
        p.mesh.position.z = Math.sin(a) * p.radius;
        p.mesh.position.y = p.baseY + Math.sin(t * 2.2 + idx) * 0.08;
        p.mesh.rotation.y = t * 1.5;
      });

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
