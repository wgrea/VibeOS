import * as THREE from 'three';

export function createCabincore() {
  const group = new THREE.Group();

  const barkMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.9 });
  const mossMat = new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.85 });
  const emberMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0xea580c,
    emissiveIntensity: 0.85,
    roughness: 0.3,
  });

  // Crossed Timber Logs
  const logGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.8, 14);
  const log1 = new THREE.Mesh(logGeo, barkMat);
  log1.rotation.set(0, 0.4, Math.PI / 2);
  log1.position.y = -0.45;

  const log2 = new THREE.Mesh(logGeo, barkMat);
  log2.rotation.set(0, -0.5, Math.PI / 2);
  log2.position.y = -0.35;

  group.add(log1, log2);

  // Mossy Stones Ring
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.22, 0), mossMat);
    stone.position.set(Math.cos(a) * 1.15, -0.55, Math.sin(a) * 1.15);
    group.add(stone);
  }

  // Floating Hearth Flame Gem
  const flame = new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 0), emberMat);
  flame.position.y = 0.25;
  group.add(flame);

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #78350f 0%, #451a03 55%, #1c1917 100%)',
    update(t, bounce, spring) {
      flame.rotation.y = t * 0.9;
      flame.position.y = 0.25 + Math.sin(t * 3) * 0.08;
      flame.scale.setScalar(1 + Math.sin(t * 6) * 0.06);
      group.scale.setScalar(1 + spring * 0.22);
    },
  };
}
