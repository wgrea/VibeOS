import * as THREE from 'three';

export function createVistaGlass() {
  const group = new THREE.Group();

  // 3 Stacked Windows Vista "Flip 3D" Translucent Panes
  const panes = [];
  const paneMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0f7ff,
    transparent: true,
    opacity: 0.42,
    roughness: 0.04,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02
  });

  const edgeMat = new THREE.LineBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.85 });

  for (let i = 0; i < 3; i++) {
    const paneGroup = new THREE.Group();
    const geo = new THREE.BoxGeometry(2.3, 1.5, 0.05);
    const mesh = new THREE.Mesh(geo, paneMat);

    // Crisp refractive glass border
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat);
    mesh.add(edges);

    // Glossy Vista Window Title Header
    const header = new THREE.Mesh(
      new THREE.BoxGeometry(2.26, 0.22, 0.06),
      new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.65 })
    );
    header.position.y = 0.62;
    mesh.add(header);

    paneGroup.add(mesh);
    paneGroup.position.set((i - 1) * 0.65, (i - 1) * -0.12, (i - 1) * 0.75);
    paneGroup.rotation.y = -0.35; // Classic Flip 3D cascade angle
    group.add(paneGroup);
    panes.push(paneGroup);
  }

  // Floating Translucent Water Droplets Drifting Behind
  const droplets = [];
  const dropGeo = new THREE.SphereGeometry(0.18, 24, 24);
  const dropMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.75,
    roughness: 0.02,
    clearcoat: 1.0
  });

  [[-1.8, 0.9, -1.2], [1.9, -0.8, -0.9], [-0.4, -1.1, -1.4], [1.4, 1.1, -1.1]].forEach(([x, y, z], idx) => {
    const drop = new THREE.Mesh(dropGeo, dropMat);
    drop.position.set(x, y, z);
    drop.scale.setScalar(0.7 + (idx % 3) * 0.35);
    drop.userData = { baseY: y, speed: 1.1 + idx * 0.25 };
    group.add(drop);
    droplets.push(drop);
  });

  return {
    group,
    background: 'radial-gradient(circle at 50% 25%, #e0f2fe 0%, #38bdf8 55%, #0369a1 100%)',
    update(t, bounce, spring) {
      panes.forEach((pane, i) => {
        pane.position.y = (i - 1) * -0.12 + Math.sin(t * 1.8 + i) * 0.06;
        pane.position.z = (i - 1) * (0.75 + spring * 0.4);
      });
      droplets.forEach((drop) => {
        drop.position.y = drop.userData.baseY + Math.sin(t * drop.userData.speed) * 0.18;
      });
    }
  };
}
