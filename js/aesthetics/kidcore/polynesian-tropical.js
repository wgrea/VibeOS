import * as THREE from 'three';

export function createPolynesianTropical() {
  const group = new THREE.Group();

  const hibiscusMat = new THREE.MeshPhysicalMaterial({
    color: 0xff5e7e,
    emissive: 0xf43f5e,
    emissiveIntensity: 0.15,
    roughness: 0.3,
  });

  const bambooMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.55,
  });

  const aquaMat = new THREE.MeshPhysicalMaterial({
    color: 0x2dd4bf,
    roughness: 0.15,
    transmission: 0.35,
    transparent: true,
    opacity: 0.85,
  });

  // Tiki totem cylinder
  const totem = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 1.35, 18), bambooMat);
  group.add(totem);

  // Hibiscus flower crown
  const flower = new THREE.Group();
  const petalGeo = new THREE.SphereGeometry(0.28, 16, 16);
  petalGeo.scale(0.8, 1.3, 0.2);

  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const petal = new THREE.Mesh(petalGeo, hibiscusMat);
    petal.position.set(Math.cos(a) * 0.36, 0, Math.sin(a) * 0.36);
    petal.rotation.x = Math.PI / 2;
    petal.rotation.z = -a;
    flower.add(petal);
  }
  flower.position.y = 0.78;
  group.add(flower);

  // Floating lagoon bubbles
  const bubbleGroup = new THREE.Group();
  const bubbleGeo = new THREE.SphereGeometry(0.14, 16, 16);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const b = new THREE.Mesh(bubbleGeo, aquaMat);
    b.position.set(Math.cos(a) * 1.05, ((i % 3) - 1) * 0.45, Math.sin(a) * 1.05);
    bubbleGroup.add(b);
  }
  group.add(bubbleGroup);

  return {
    group,
    background: 'linear-gradient(180deg, #38bdf8 0%, #2dd4bf 55%, #fde047 100%)',
    update(t, bounce, spring) {
      totem.rotation.y = Math.sin(t * 0.7) * 0.35;
      flower.rotation.y = t * 0.9;
      bubbleGroup.rotation.y = -t * 0.6;
      bubbleGroup.position.y = Math.sin(t * 2.2) * 0.1;
      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
