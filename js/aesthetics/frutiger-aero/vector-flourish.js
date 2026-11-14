import * as THREE from 'three';

export function createVectorFlourish() {
  const group = new THREE.Group();

  // Glossy Eco-Office Earth Globe Core
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(0.78, 32, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9,
      emissive: 0x0369a1,
      emissiveIntensity: 0.3,
      roughness: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    })
  );
  group.add(globe);

  // Sweeping Lime-Green Vector Flourish Swirl Ribbon
  const flourish = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.12, 0.075, 96, 16, 2, 3),
    new THREE.MeshPhysicalMaterial({
      color: 0x84cc16,
      emissive: 0x4d7c0f,
      emissiveIntensity: 0.35,
      roughness: 0.08,
      clearcoat: 1.0,
    })
  );
  group.add(flourish);

  // Floating Glossy Vector Leaves & Water Droplets
  const leafMat = new THREE.MeshPhysicalMaterial({
    color: 0x4ade80,
    emissive: 0x16a34a,
    emissiveIntensity: 0.3,
    roughness: 0.08,
    clearcoat: 1.0,
  });

  const leaves = [];
  for (let i = 0; i < 6; i++) {
    const leaf = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), leafMat);
    leaf.scale.set(0.65, 1.5, 0.25);
    const a = (i / 6) * Math.PI * 2;
    leaf.position.set(Math.cos(a) * 1.55, Math.sin(i * 1.3) * 0.45, Math.sin(a) * 1.55);
    group.add(leaf);
    leaves.push({ mesh: leaf, angle: a, baseY: leaf.position.y });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 25%, #ffffff 0%, #dcfce7 50%, #38bdf8 100%)',
    update(t, bounce, spring) {
      globe.rotation.y = t * 0.45;
      flourish.rotation.y = -t * 0.5;
      flourish.rotation.x = Math.sin(t * 0.4) * 0.25;

      leaves.forEach((l, idx) => {
        const a = l.angle + t * 0.6;
        l.mesh.position.x = Math.cos(a) * 1.55;
        l.mesh.position.z = Math.sin(a) * 1.55;
        l.mesh.position.y = l.baseY + Math.sin(t * 2 + idx) * 0.14;
        l.mesh.rotation.z = t * 1.2 + idx;
      });

      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
