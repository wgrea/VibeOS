import * as THREE from 'three';

export function createNeoAero() {
  const group = new THREE.Group();

  // Frosted Glass Hero Card
  const cardGeo = new THREE.BoxGeometry(2.4, 1.5, 0.1);
  const cardMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.55,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
  });
  const frontCard = new THREE.Mesh(cardGeo, cardMat);
  frontCard.position.set(0, 0, 0.2);
  group.add(frontCard);

  // Back Tinted Mint Card
  const backCard = new THREE.Mesh(
    cardGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.45,
      roughness: 0.15,
      clearcoat: 1.0,
    })
  );
  backCard.position.set(0.35, -0.25, -0.25);
  backCard.rotation.z = -0.12;
  group.add(backCard);

  // Glossy Floating Water Droplets
  const droplets = [];
  const dropGeo = new THREE.SphereGeometry(1, 24, 24);
  const dropMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    roughness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
  });

  const dropSpecs = [
    { pos: [-1.3, 0.7, 0.45], scale: 0.24 },
    { pos: [1.35, 0.55, 0.5], scale: 0.18 },
    { pos: [-1.05, -0.75, 0.4], scale: 0.15 },
    { pos: [1.15, -0.65, 0.45], scale: 0.28 },
    { pos: [0.0, 1.05, 0.3], scale: 0.14 },
  ];

  dropSpecs.forEach((d) => {
    const mesh = new THREE.Mesh(dropGeo, dropMat);
    mesh.position.set(...d.pos);
    mesh.scale.setScalar(d.scale);
    group.add(mesh);
    droplets.push({ mesh, baseY: d.pos });
  });

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #ecfeff, #a5f3fc 60%, #34d399 100%)',
    update(t, bounce, spring) {
      frontCard.rotation.y = Math.sin(t * 1.1) * 0.25;
      backCard.rotation.y = Math.sin(t * 1.1 - 0.5) * 0.25;
      group.scale.setScalar(1 - spring * 0.25);

      droplets.forEach((d, i) => {
        d.mesh.position.y = d.baseY + Math.sin(t * 1.8 + i) * 0.12 + bounce * 0.3;
      });
    },
  };
}
