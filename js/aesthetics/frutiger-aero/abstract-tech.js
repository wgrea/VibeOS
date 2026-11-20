// js/aesthetics/frutiger-aero/abstract-tech.js
import * as THREE from 'three';

export function createAbstractTech() {
  const group = new THREE.Group();

  // 1. Smooth Glossy Cyan Energy Core
  const dataCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.58, 32, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      emissive: 0x0284c7,
      emissiveIntensity: 0.65,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0.9,
    })
  );
  group.add(dataCore);

  // 2. Clean Vector Edges Cage (no messy diagonal triangle cross-lines)
  const cageGeo = new THREE.IcosahedronGeometry(1.12, 0);
  const edgesGeo = new THREE.EdgesGeometry(cageGeo);
  const wireframe = new THREE.LineSegments(
    edgesGeo,
    new THREE.LineBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.85,
    })
  );
  group.add(wireframe);

  // 3. Precision HUD Latitude Rings
  const hudMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.45,
  });

  const ringOuter = new THREE.Mesh(new THREE.TorusGeometry(1.48, 0.012, 8, 64), hudMat);
  ringOuter.rotation.x = Math.PI / 2.3;
  group.add(ringOuter);

  const ringInner = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.01, 8, 64), hudMat);
  ringInner.rotation.set(Math.PI / 3, 0.4, 0);
  group.add(ringInner);

  // 4. Orbiting Glossy White & Cobalt Circuit Nodes
  const nodeMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    emissive: 0x3b82f6,
    emissiveIntensity: 0.45,
    roughness: 0.08,
    clearcoat: 1.0,
  });

  const nodes = [];
  for (let i = 0; i < 10; i++) {
    const node = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.14), nodeMat);
    const a = (i / 10) * Math.PI * 2;
    const r = 1.48;
    const baseY = (i % 2 === 0 ? 1 : -1) * 0.28;
    node.position.set(Math.cos(a) * r, baseY, Math.sin(a) * r);
    group.add(node);
    nodes.push({ mesh: node, angle: a, baseY });
  }

  return {
    group,
    description:
      'Emerging around 1999 in early Flash interfaces, corporate tech branding, and clean vector motion graphics, Abstract Tech trades Metalheart’s aggressive chrome spikes for geometric wireframes, glowing cyan data cores, HUD rings, and floating circuit nodes.',
    background: 'radial-gradient(circle at 50% 35%, #e0f2fe 0%, #0284c7 55%, #0f172a 100%)',
    update(t, bounce, spring) {
      dataCore.scale.setScalar(1 + Math.sin(t * 2.5) * 0.04);

      wireframe.rotation.y = -t * 0.35;
      wireframe.rotation.z = t * 0.25;

      ringOuter.rotation.z = t * 0.3;
      ringInner.rotation.y = -t * 0.5;

      nodes.forEach((n, idx) => {
        const a = n.angle + t * 0.55;
        n.mesh.position.x = Math.cos(a) * 1.48;
        n.mesh.position.z = Math.sin(a) * 1.48;
        n.mesh.position.y = n.baseY + Math.sin(t * 2 + idx) * 0.1;
        n.mesh.rotation.x = t * 1.4 + idx;
        n.mesh.rotation.y = t * 1.1;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
