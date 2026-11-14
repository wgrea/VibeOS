import * as THREE from 'three';

export function createBloomcore() {
  const group = new THREE.Group();

  const sunCoreMat = new THREE.MeshPhysicalMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.45,
    roughness: 0.15,
    clearcoat: 0.8,
  });

  const petalMat = new THREE.MeshPhysicalMaterial({
    color: 0xfda4af,
    emissive: 0xf43f5e,
    emissiveIntensity: 0.2,
    roughness: 0.25,
    transparent: true,
    opacity: 0.9,
  });

  const core = new THREE.Mesh(new THREE.SphereGeometry(0.48, 28, 28), sunCoreMat);
  group.add(core);

  const petalRing = new THREE.Group();
  const petalGeo = new THREE.SphereGeometry(0.42, 16, 16);
  petalGeo.scale(0.65, 1.35, 0.25);

  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const petal = new THREE.Mesh(petalGeo, petalMat);
    petal.position.set(Math.cos(a) * 0.85, Math.sin(a) * 0.85, 0);
    petal.rotation.z = a - Math.PI / 2;
    petalRing.add(petal);
  }
  petalRing.rotation.x = -0.35;
  group.add(petalRing);

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #fef08a 0%, #fdba74 45%, #fb7185 100%)',
    update(t, bounce, spring) {
      petalRing.rotation.z = t * 0.35;
      core.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
