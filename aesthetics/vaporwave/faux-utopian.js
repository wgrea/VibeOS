// js/aesthetics/vaporwave/faux-utopian.js

import * as THREE from 'three';

export function createFauxUtopian() {
  const group = new THREE.Group();

  // 1. Sterile Corporate 90s CAD Gloss-and-Wireframe Globe
  const globeGroup = new THREE.Group();

  const globeCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.82, 24, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0xcbd5e1,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25,
      roughness: 0.12,
      metalness: 0.45,
      clearcoat: 1.0,
    })
  );
  globeGroup.add(globeCore);

  // Crisp CAD Wireframe Cage (90s Telecom / Enterprise Graphic)
  const wireCage = new THREE.Mesh(
    new THREE.SphereGeometry(0.845, 16, 12),
    new THREE.MeshBasicMaterial({
      color: 0xe0f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    })
  );
  globeGroup.add(wireCage);

  group.add(globeGroup);

  // 2. Clean Corporate Synergy Orbit Rings
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    emissive: 0x0369a1,
    emissiveIntensity: 0.45,
    metalness: 0.75,
    roughness: 0.18,
  });

  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.04, 16, 64), ringMat);
  ring1.rotation.x = Math.PI / 3;
  group.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.04, 16, 64), ringMat);
  ring2.rotation.x = -Math.PI / 3;
  group.add(ring2);

  // 3. Ascending Corporate Growth-Chart / Atrium Monoliths
  const pillars = [];
  const glassTowerMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    emissive: 0x1e3a8a,
    emissiveIntensity: 0.18,
    roughness: 0.12,
    metalness: 0.35,
    clearcoat: 1.0,
  });

  const dataStripMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

  for (let i = 0; i < 4; i++) {
    const towerGroup = new THREE.Group();
    const h = 0.5 + i * 0.24;

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.26, h, 0.26), glassTowerMat);
    towerGroup.add(body);

    // Sterile Cyan Architectural Trim Band near Top
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.275, 0.04, 0.275), dataStripMat);
    trim.position.y = h / 2 - 0.08;
    towerGroup.add(trim);

    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    towerGroup.position.set(Math.cos(a) * 1.65, -0.4 + h / 2, Math.sin(a) * 1.65);
    group.add(towerGroup);
    pillars.push({ mesh: towerGroup, baseY: towerGroup.position.y, phase: i * 0.7 });
  }

  // 4. Cold Sterile Atrium Grid Floor
  const grid = new THREE.GridHelper(12, 24, 0x38bdf8, 0x1e3a8a);
  grid.position.y = -1.25;
  grid.material.transparent = true;
  grid.material.opacity = 0.4;
  group.add(grid);

  // Cool Clinical Studio Lighting
  const topLight = new THREE.DirectionalLight(0xffffff, 1.8);
  topLight.position.set(2, 4, 3);
  group.add(topLight);

  const coolFill = new THREE.AmbientLight(0x93c5fd, 1.0);
  group.add(coolFill);

  return {
    group,
    draggable: globeGroup,
    description:
      'Sterile 90s corporate futurism and hollow enterprise optimism—glossy CAD globes, ascending growth monoliths, and icy blue-grey boardroom-utopia muzak.',
    background: 'radial-gradient(circle at 50% 30%, #f1f5f9 0%, #93c5fd 55%, #1e3a8a 100%)',
    update(t, bounce, spring) {
      globeGroup.rotation.y = t * 0.45;
      ring1.rotation.z = t * 0.6;
      ring2.rotation.z = -t * 0.6;

      pillars.forEach((p) => {
        p.mesh.position.y = p.baseY + Math.sin(t * 2 + p.phase) * 0.08 - bounce * 0.15;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
