import * as THREE from 'three';

export function createY2kArena() {
  const group = new THREE.Group();

  const neonGridMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.45,
    wireframe: true,
  });

  const kaijuMat = new THREE.MeshPhysicalMaterial({
    color: 0x10b981,
    emissive: 0x059669,
    emissiveIntensity: 0.35,
    roughness: 0.25,
    clearcoat: 0.8,
  });

  const energyRingMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    emissive: 0xe11d48,
    emissiveIntensity: 0.6,
    roughness: 0.2,
  });

  // 3D Fighter / Kaiju arena floor disc
  const arenaFloor = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.08, 24), neonGridMat);
  arenaFloor.position.y = -0.55;
  group.add(arenaFloor);

  // Glowing dorsal crystal / fighter core
  const coreCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 0), kaijuMat);
  coreCrystal.scale.set(0.85, 1.35, 0.85);
  group.add(coreCrystal);

  // Combo shockwave ring
  const shockRing = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.04, 12, 36), energyRingMat);
  shockRing.rotation.x = Math.PI / 2;
  group.add(shockRing);

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #1e3a8a 0%, #312e81 55%, #090d16 100%)',
    update(t, bounce, spring) {
      arenaFloor.rotation.y = t * 0.3;
      coreCrystal.rotation.y = -t * 1.1;
      coreCrystal.position.y = Math.sin(t * 2.5) * 0.08;
      shockRing.scale.setScalar(0.85 + ((t * 0.9) % 0.55));
      shockRing.position.y = -0.35 + ((t * 0.9) % 0.55) * 0.8;
      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
