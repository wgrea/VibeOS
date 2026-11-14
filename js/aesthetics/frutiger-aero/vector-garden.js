import * as THREE from 'three';

export function createVectorGarden() {
  const group = new THREE.Group();

  // Rolling Lime-Green Vector Hill Mound
  const hill = new THREE.Mesh(
    new THREE.SphereGeometry(1.15, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshPhysicalMaterial({
      color: 0x4ade80,
      emissive: 0x15803d,
      emissiveIntensity: 0.25,
      roughness: 0.15,
      clearcoat: 1.0,
    })
  );
  hill.position.y = -0.65;
  group.add(hill);

  // Glossy Vector Flower / Pinwheel Petals
  const flowerGroup = new THREE.Group();
  flowerGroup.position.set(0, 0.55, 0);

  const petalMat = new THREE.MeshPhysicalMaterial({
    color: 0xfacc15,
    emissive: 0xeab308,
    emissiveIntensity: 0.3,
    roughness: 0.08,
    clearcoat: 1.0,
  });

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 20), petalMat);
    petal.scale.set(0.65, 1.45, 0.3);
    petal.position.set(Math.cos(angle) * 0.36, Math.sin(angle) * 0.36, 0);
    petal.rotation.z = angle - Math.PI / 2;
    flowerGroup.add(petal);
  }

  const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 24, 24),
    new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, roughness: 0.05, clearcoat: 1.0 })
  );
  flowerGroup.add(center);
  group.add(flowerGroup);

  // Floating Glossy Dew Drops
  const dewDrops = [];
  const dewMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe,
    roughness: 0.02,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.85,
  });

  for (let i = 0; i < 8; i++) {
    const dew = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), dewMat);
    const a = (i / 8) * Math.PI * 2;
    dew.position.set(Math.cos(a) * 1.25, 0.1 + (i % 3) * 0.35, Math.sin(a) * 1.25);
    group.add(dew);
    dewDrops.push({ mesh: dew, baseY: dew.position.y, phase: i });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 25%, #e0f2fe 0%, #7dd3fc 50%, #22c55e 100%)',
    update(t, bounce, spring) {
      flowerGroup.rotation.z = t * 0.7;
      group.rotation.y = Math.sin(t * 0.4) * 0.3;

      dewDrops.forEach((d) => {
        d.mesh.position.y = d.baseY + Math.sin(t * 2.5 + d.phase) * 0.12;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
