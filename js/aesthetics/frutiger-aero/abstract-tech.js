import * as THREE from 'three';

export function createAbstractTech() {
  const group = new THREE.Group();

  // Translucent Aqua-Cyan Tech Data Core
  const dataCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.68, 1),
    new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.55,
      roughness: 0.05,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.88,
    })
  );
  group.add(dataCore);

  // Precision Wireframe Tech Lattice Shell
  const wireframe = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.15, 1),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    })
  );
  group.add(wireframe);

  // Orbiting Glossy White & Cobalt Circuit Nodes
  const nodeMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    emissive: 0x3b82f6,
    emissiveIntensity: 0.4,
    roughness: 0.08,
    clearcoat: 1.0,
  });

  const nodes = [];
  for (let i = 0; i < 10; i++) {
    const node = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.16), nodeMat);
    const a = (i / 10) * Math.PI * 2;
    const r = 1.48;
    node.position.set(Math.cos(a) * r, (i % 2 === 0 ? 1 : -1) * 0.35, Math.sin(a) * r);
    group.add(node);
    nodes.push({ mesh: node, angle: a });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #e0f2fe 0%, #0284c7 55%, #0f172a 100%)',
    update(t, bounce, spring) {
      dataCore.rotation.y = t * 0.65;
      dataCore.rotation.x = t * 0.35;

      wireframe.rotation.y = -t * 0.35;
      wireframe.rotation.z = t * 0.25;

      nodes.forEach((n, idx) => {
        const a = n.angle + t * 0.55;
        n.mesh.position.x = Math.cos(a) * 1.48;
        n.mesh.position.z = Math.sin(a) * 1.48;
        n.mesh.rotation.x = t * 1.4 + idx;
        n.mesh.rotation.y = t * 1.1;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
