import * as THREE from 'three';

export function createCybercore() {
  const group = new THREE.Group();

  const acidGreenMat = new THREE.MeshStandardMaterial({
    color: 0x4ade80,
    emissive: 0x22c55e,
    emissiveIntensity: 0.65,
    wireframe: true,
  });

  const obsidianMat = new THREE.MeshPhysicalMaterial({
    color: 0x090d16,
    metalness: 0.85,
    roughness: 0.15,
    clearcoat: 1.0,
  });

  // Liquid obsidian core wrapped in cyber wireframe cage
  const core = new THREE.Mesh(new THREE.TorusKnotGeometry(0.45, 0.14, 80, 16), obsidianMat);
  const cage = new THREE.Mesh(new THREE.IcosahedronGeometry(0.98, 1), acidGreenMat);

  group.add(core, cage);

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #064e3b 0%, #022c22 50%, #000000 100%)',
    update(t, bounce, spring) {
      core.rotation.x = t * 0.7;
      core.rotation.y = t * 0.9;
      cage.rotation.y = -t * 0.45;
      cage.rotation.z = t * 0.3;
      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
