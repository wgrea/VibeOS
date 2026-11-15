import * as THREE from 'three';

export function createImaginarium() {
  const group = new THREE.Group();

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.75,
    roughness: 0.2,
  });

  const violetMat = new THREE.MeshPhysicalMaterial({
    color: 0x8b5cf6,
    emissive: 0x6d28d9,
    emissiveIntensity: 0.25,
    roughness: 0.2,
    clearcoat: 0.85,
  });

  const mintMat = new THREE.MeshPhysicalMaterial({
    color: 0x34d399,
    roughness: 0.25,
  });

  // Whimsical gyroscope rings
  const outerRing = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.05, 16, 48), goldMat);
  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.05, 16, 48), mintMat);
  const coreStar = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 0), violetMat);

  group.add(outerRing, innerRing, coreStar);

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #ddd6fe 0%, #a78bfa 45%, #312e81 100%)',
    update(t, bounce, spring) {
      outerRing.rotation.x = t * 0.65;
      outerRing.rotation.y = t * 0.4;
      innerRing.rotation.y = -t * 0.95;
      innerRing.rotation.z = t * 0.5;
      coreStar.rotation.y = t * 1.2;
      coreStar.rotation.x = Math.sin(t * 1.5) * 0.4;
      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
