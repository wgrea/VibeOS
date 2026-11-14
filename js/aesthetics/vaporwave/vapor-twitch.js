import * as THREE from 'three';

export function createVaporTwitch() {
  const group = new THREE.Group();

  // Iridescent Neon-Violet Future-Bass Octahedron Core
  const crystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.85, 1),
    new THREE.MeshPhysicalMaterial({
      color: 0x8b5cf6,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.65,
      roughness: 0.08,
      metalness: 0.3,
      clearcoat: 1.0,
    })
  );
  group.add(crystal);

  // Snappy Elastic Synth Rings
  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(1.25, 0.05, 16, 64),
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
    })
  );
  group.add(ring1);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.48, 0.04, 16, 64),
    new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      emissive: 0xdb2777,
      emissiveIntensity: 0.9,
    })
  );
  group.add(ring2);

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #6d28d9 0%, #1e1b4b 60%, #090d16 100%)',
    update(t, bounce, spring) {
      // Elastic future-bass sidechain twitch pulse
      const sidechain = 1 + Math.pow(Math.sin(t * 3.8), 4) * 0.22;
      crystal.scale.setScalar(sidechain);
      crystal.rotation.y = t * 0.7;

      ring1.rotation.x = Math.sin(t * 1.9) * 1.1;
      ring1.rotation.y = t * 0.8;

      ring2.rotation.y = Math.cos(t * 1.9) * 1.1;
      ring2.rotation.z = -t * 0.6;

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
