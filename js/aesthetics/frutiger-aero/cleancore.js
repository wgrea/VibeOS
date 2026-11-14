import * as THREE from 'three';

export function createCleancore() {
  const group = new THREE.Group();

  // Ultra-Pure Frosted Crystal Soap / Glass Cube
  const pureCube = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 1.15, 1.15),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xe0f2fe,
      emissiveIntensity: 0.25,
      roughness: 0.03,
      metalness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      transparent: true,
      opacity: 0.78,
    })
  );
  group.add(pureCube);

  // Soft Mint-Aqua Inner Pure Core Sphere
  const mintCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 32, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0x6ee7b7,
      emissive: 0x34d399,
      emissiveIntensity: 0.35,
      roughness: 0.04,
      clearcoat: 1.0,
    })
  );
  group.add(mintCore);

  // Floating Crystal Soap Bubbles (High & Low Cleancore)
  const bubbleMat = new THREE.MeshPhysicalMaterial({
    color: 0xf0f9ff,
    roughness: 0.01,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.85,
  });

  const bubbles = [];
  for (let i = 0; i < 12; i++) {
    const size = 0.08 + (i % 3) * 0.05;
    const bubble = new THREE.Mesh(new THREE.SphereGeometry(size, 20, 20), bubbleMat);
    const a = (i / 12) * Math.PI * 2;
    const r = 1.25 + (i % 2) * 0.35;
    bubble.position.set(Math.cos(a) * r, Math.sin(i * 1.7) * 0.65, Math.sin(a) * r);
    group.add(bubble);
    bubbles.push({ mesh: bubble, baseY: bubble.position.y, phase: i * 0.6 });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 25%, #ffffff 0%, #f0f9ff 55%, #bae6fd 100%)',
    update(t, bounce, spring) {
      pureCube.rotation.y = t * 0.4;
      pureCube.rotation.x = Math.sin(t * 0.45) * 0.2;
      mintCore.position.y = Math.sin(t * 1.6) * 0.08;

      bubbles.forEach((b) => {
        b.mesh.position.y = b.baseY + Math.sin(t * 1.8 + b.phase) * 0.14;
      });

      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
