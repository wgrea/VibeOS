import * as THREE from 'three';

export function createPhysicalMedia() {
  const group = new THREE.Group();

  // Materials
  const shelfWoodMat = new THREE.MeshStandardMaterial({ color: 0x3f2e21, roughness: 0.72 });
  const darkPlasticMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.42 });
  const grayCartMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.48 });
  const clearAcrylicMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe,
    transparent: true,
    opacity: 0.45,
    roughness: 0.1,
    clearcoat: 1.0,
  });

  const discMat = new THREE.MeshPhysicalMaterial({
    color: 0xe879f9,
    emissive: 0x0284c7,
    emissiveIntensity: 0.25,
    metalness: 0.92,
    roughness: 0.1,
    iridescence: 1.0,
    iridescenceIOR: 1.45,
    side: THREE.DoubleSide,
  });

  const spineColors = [0xef4444, 0x3b82f6, 0xfacc15, 0x10b981, 0xa855f7, 0xf97316, 0x06b6d4, 0xec4899];

  // Helper builders for mini floating physical media objects
  function makeVhsMesh(accentHex) {
    const g = new THREE.Group();
    const shell = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.19, 0.055), darkPlasticMat);
    const label = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.07, 0.06),
      new THREE.MeshStandardMaterial({ color: accentHex, roughness: 0.4 })
    );
    label.position.y = 0.035;
    const windowStrip = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.045, 0.06), clearAcrylicMat);
    windowStrip.position.y = -0.04;
    g.add(shell, label, windowStrip);
    return g;
  }

  function makeCartridgeMesh(shellHex, labelHex) {
    const g = new THREE.Group();
    const shell = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.28, 0.05),
      new THREE.MeshStandardMaterial({ color: shellHex, roughness: 0.45 })
    );
    const notch = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.054), darkPlasticMat);
    notch.position.y = 0.11;
    const art = new THREE.Mesh(
      new THREE.BoxGeometry(0.19, 0.15, 0.054),
      new THREE.MeshStandardMaterial({ color: labelHex, roughness: 0.35 })
    );
    art.position.y = -0.02;
    g.add(shell, notch, art);
    return g;
  }

  function makeCassetteMesh(labelHex) {
    const g = new THREE.Group();
    const shell = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.17, 0.038), darkPlasticMat);
    const label = new THREE.Mesh(
      new THREE.BoxGeometry(0.23, 0.1, 0.041),
      new THREE.MeshStandardMaterial({ color: labelHex, roughness: 0.4 })
    );
    label.position.y = 0.01;
    const reelL = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.044, 10), grayCartMat);
    reelL.rotation.x = Math.PI / 2;
    reelL.position.set(-0.058, 0.01, 0);
    const reelR = reelL.clone();
    reelR.position.x = 0.058;
    g.add(shell, label, reelL, reelR);
    return g;
  }

  // 1. Collector's Media Bookcase Unit (Draggable)
  const shelfUnit = new THREE.Group();
  shelfUnit.scale.setScalar(0.88);

  const sideGeo = new THREE.BoxGeometry(0.08, 1.88, 0.44);
  const leftSide = new THREE.Mesh(sideGeo, shelfWoodMat);
  leftSide.position.set(-0.92, 0, 0);
  const rightSide = leftSide.clone();
  rightSide.position.x = 0.92;

  const backBoard = new THREE.Mesh(
    new THREE.BoxGeometry(1.88, 1.88, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x291d15, roughness: 0.85 })
  );
  backBoard.position.z = -0.2;
  shelfUnit.add(leftSide, rightSide, backBoard);

  const plankGeo = new THREE.BoxGeometry(1.88, 0.06, 0.44);
  [-0.9, -0.3, 0.3, 0.9].forEach((py) => {
    const plank = new THREE.Mesh(plankGeo, shelfWoodMat);
    plank.position.y = py;
    shelfUnit.add(plank);
  });

  // Top Shelf: VHS Tapes + Cartridges
  let cursorX = -0.82;
  for (let i = 0; i < 6; i++) {
    const vhs = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.46, 0.28), darkPlasticMat);
    const spine = new THREE.Mesh(
      new THREE.BoxGeometry(0.087, 0.38, 0.02),
      new THREE.MeshStandardMaterial({ color: spineColors[i % spineColors.length], roughness: 0.4 })
    );
    spine.position.z = 0.135;
    const item = new THREE.Group();
    item.add(vhs, spine);
    item.position.set(cursorX, 0.56, 0.02);
    shelfUnit.add(item);
    cursorX += 0.1;
  }

  cursorX += 0.08;
  [0x94a3b8, 0xfacc15, 0xef4444, 0x3b82f6, 0x64748b].forEach((hex) => {
    const cart = new THREE.Mesh(
      new THREE.BoxGeometry(0.075, 0.34, 0.26),
      new THREE.MeshStandardMaterial({ color: hex, roughness: 0.45 })
    );
    cart.position.set(cursorX, 0.5, 0.02);
    shelfUnit.add(cart);
    cursorX += 0.095;
  });

  // Middle Shelf: DVDs & Blu-Rays
  cursorX = -0.83;
  for (let i = 0; i < 16; i++) {
    const isBluRay = i >= 9;
    const height = isBluRay ? 0.41 : 0.45;
    const dvd = new THREE.Group();
    const shell = new THREE.Mesh(
      new THREE.BoxGeometry(0.055, height, 0.28),
      new THREE.MeshStandardMaterial({ color: isBluRay ? 0x0284c7 : 0x18181b, roughness: 0.35 })
    );
    const spine = new THREE.Mesh(
      new THREE.BoxGeometry(0.057, height - 0.06, 0.015),
      new THREE.MeshStandardMaterial({ color: spineColors[(i * 3) % spineColors.length], roughness: 0.35 })
    );
    spine.position.z = 0.136;
    dvd.add(shell, spine);
    dvd.position.set(cursorX, -0.27 + height / 2, 0.02);
    shelfUnit.add(dvd);
    cursorX += 0.072;
  }

  // Bottom Shelf: Cassette Cases + Face-out Cassette
  cursorX = -0.82;
  for (let i = 0; i < 9; i++) {
    const cCase = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.28, 0.2), clearAcrylicMat);
    cCase.position.set(cursorX, -0.73, 0.04);
    shelfUnit.add(cCase);
    cursorX += 0.068;
  }

  const shelfCassette = makeCassetteMesh(0xfacc15);
  shelfCassette.position.set(0.55, -0.74, 0.1);
  shelfCassette.rotation.set(-0.22, -0.25, 0);
  shelfUnit.add(shelfCassette);
  group.add(shelfUnit);

  // 2. Orbiting Floating Physical Media (VHS, Cartridges, Cassettes, Optical Discs)
  const floaters = [];

  const disc1 = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.21, 32), discMat);
  const disc2 = new THREE.Mesh(new THREE.RingGeometry(0.05, 0.18, 32), discMat);

  const floaterConfigs = [
    { mesh: makeVhsMesh(0xec4899), x: -1.08, y: 0.45, z: 0.32, spin: 0.8, phase: 0.2 },
    { mesh: makeCartridgeMesh(0xfacc15, 0xef4444), x: 1.06, y: 0.48, z: 0.3, spin: -0.9, phase: 1.4 },
    { mesh: makeCassetteMesh(0x38bdf8), x: -1.04, y: -0.38, z: 0.36, spin: 1.1, phase: 2.6 },
    { mesh: makeCartridgeMesh(0x94a3b8, 0x3b82f6), x: 1.08, y: -0.42, z: 0.34, spin: -0.75, phase: 3.8 },
    { mesh: disc1, x: 0.96, y: 0.04, z: 0.42, spin: 1.6, phase: 4.9, isDisc: true },
    { mesh: disc2, x: -0.96, y: 0.06, z: 0.42, spin: -1.8, phase: 5.7, isDisc: true },
  ];

  floaterConfigs.forEach((cfg) => {
    cfg.mesh.position.set(cfg.x, cfg.y, cfg.z);
    group.add(cfg.mesh);
    floaters.push(cfg);
  });

    // Extra dense orbit of floating VHS tapes, cartridges, cassettes & optical discs
  const extraMedia = [
    { mesh: makeVhsMesh(0x38bdf8), x: -1.36, y: 0.72, z: -0.1, spin: -0.7, phase: 0.5 },
    { mesh: makeVhsMesh(0xfacc15), x: 1.38, y: 0.75, z: -0.15, spin: 0.85, phase: 1.9 },
    { mesh: makeVhsMesh(0xa855f7), x: -1.42, y: -0.18, z: -0.18, spin: 0.65, phase: 3.1 },
    { mesh: makeVhsMesh(0xf97316), x: 1.4, y: -0.68, z: 0.05, spin: -0.9, phase: 4.4 },
    { mesh: makeCartridgeMesh(0xef4444, 0xfef08a), x: -0.78, y: 0.96, z: 0.18, spin: 1.0, phase: 0.9 },
    { mesh: makeCartridgeMesh(0x10b981, 0xf8fafc), x: 0.76, y: 0.98, z: 0.16, spin: -1.05, phase: 2.3 },
    { mesh: makeCartridgeMesh(0x3b82f6, 0xfacc15), x: -1.34, y: -0.74, z: 0.08, spin: 0.8, phase: 3.7 },
    { mesh: makeCartridgeMesh(0x64748b, 0xec4899), x: 1.36, y: 0.24, z: -0.12, spin: -0.85, phase: 5.1 },
    { mesh: makeCassetteMesh(0xef4444), x: -0.32, y: 1.02, z: 0.24, spin: -1.15, phase: 1.2 },
    { mesh: makeCassetteMesh(0x10b981), x: 0.34, y: 1.0, z: 0.22, spin: 1.1, phase: 2.8 },
    { mesh: makeCassetteMesh(0xf97316), x: -0.72, y: -0.96, z: 0.22, spin: 0.95, phase: 4.0 },
    { mesh: makeCassetteMesh(0xe879f9), x: 0.72, y: -0.95, z: 0.24, spin: -1.0, phase: 5.5 },
    { mesh: new THREE.Mesh(new THREE.RingGeometry(0.05, 0.17, 32), discMat), x: -1.24, y: 0.26, z: 0.38, spin: 1.7, phase: 0.7, isDisc: true },
    { mesh: new THREE.Mesh(new THREE.RingGeometry(0.05, 0.16, 32), discMat), x: 1.24, y: -0.18, z: 0.4, spin: -1.9, phase: 3.3, isDisc: true },
    { mesh: new THREE.Mesh(new THREE.RingGeometry(0.04, 0.15, 32), discMat), x: 0.02, y: 1.06, z: 0.32, spin: 2.0, phase: 4.6, isDisc: true },
  ];

  extraMedia.forEach((cfg) => {
    cfg.mesh.scale.setScalar(0.86);
    cfg.mesh.position.set(cfg.x, cfg.y, cfg.z);
    group.add(cfg.mesh);
    floaters.push(cfg);
  });


  // 3. Lighting
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.55);
  keyLight.position.set(3, 4, 5);
  const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
  rimLight.position.set(-4, 2, 3);
  group.add(keyLight, rimLight, new THREE.AmbientLight(0xfef3c7, 0.85));

  return {
    group,
    description:
      'A 2026 physical-ownership revival celebrating tangible media collections—featuring shelves of DVDs and Blu-rays surrounded by floating VHS tapes, retro game cartridges, cassette tapes, and iridescent optical discs.',
    background: 'radial-gradient(circle at 50% 30%, #f1f5f9 0%, #cbd5e1 50%, #475569 100%)',
    update(t, bounce, spring) {
      shelfUnit.rotation.y = Math.sin(t * 0.55) * 0.25;
      shelfUnit.position.y = Math.sin(t * 1.6) * 0.02 - bounce * 0.25;

      floaters.forEach((f) => {
        f.mesh.position.y = f.y + Math.sin(t * 1.9 + f.phase) * 0.07 - bounce * 0.25;
        if (f.isDisc) {
          f.mesh.rotation.z = t * f.spin;
          f.mesh.rotation.y = Math.sin(t * 1.2 + f.phase) * 0.35;
        } else {
          f.mesh.rotation.y = Math.sin(t * 0.9 + f.phase) * 0.45;
          f.mesh.rotation.z = Math.cos(t * 1.1 + f.phase) * 0.16;
        }
      });

      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
