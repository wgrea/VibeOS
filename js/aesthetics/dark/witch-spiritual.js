import * as THREE from 'three';

export function createWitchSpiritual() {
  const group = new THREE.Group();

  const amethystMat = new THREE.MeshPhysicalMaterial({
    color: 0x9333ea,
    emissive: 0x6b21a8,
    emissiveIntensity: 0.35,
    transmission: 0.45,
    roughness: 0.15,
    thickness: 0.8,
  });

  const brassRingMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.85,
    roughness: 0.2,
  });

  // Floating amethyst crystal obelisk
  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 0), amethystMat);
  crystal.scale.set(0.75, 1.45, 0.75);
  group.add(crystal);

  // Celestial astrolabe rings
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.03, 12, 42), brassRingMat);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.025, 12, 42), brassRingMat);
  group.add(ring1, ring2);

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #581c87 0%, #1e1b4b 55%, #020617 100%)',
    update(t, bounce, spring) {
      crystal.rotation.y = t * 0.65;
      crystal.position.y = Math.sin(t * 2) * 0.08;
      ring1.rotation.x = t * 0.5;
      ring1.rotation.y = t * 0.3;
      ring2.rotation.y = -t * 0.45;
      ring2.rotation.z = t * 0.25;
      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
