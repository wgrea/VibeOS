import * as THREE from 'three';

export function createViceCity() {
  const group = new THREE.Group();

  const neonPinkMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    emissive: 0xec4899,
    emissiveIntensity: 0.65,
    roughness: 0.2,
  });

  const cyanGridMat = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.55,
    wireframe: true,
  });

  const sunGoldMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
  });

  // 80s Sunset disc
  const sun = new THREE.Mesh(new THREE.CircleGeometry(0.65, 32), sunGoldMat);
  sun.position.set(0, 0.28, -0.4);
  group.add(sun);

  // Neon Ocean Drive palm / Art Deco spire
  const spire = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.15, 6), neonPinkMat);
  spire.position.set(0, -0.05, 0.1);
  group.add(spire);

  // Coastal synth grid floor
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.06, 20), cyanGridMat);
  floor.position.y = -0.62;
  group.add(floor);

  return {
    group,
    background: 'linear-gradient(180deg, #311042 0%, #db2777 52%, #fb923c 82%, #fef08a 100%)',
    update(t, bounce, spring) {
      spire.rotation.y = t * 0.75;
      floor.rotation.y = -t * 0.25;
      sun.scale.setScalar(1 + Math.sin(t * 2) * 0.04);
      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
