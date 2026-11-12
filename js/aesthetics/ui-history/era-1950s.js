export function createScene(THREE) {
  const group = new THREE.Group();

  // 1. Industrial Steel Console Chassis
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x2c3531,
    roughness: 0.48,
    metalness: 0.72
  });
  const baseChassis = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.75, 2.2), chassisMat);
  baseChassis.position.set(0, -1.1, 0);
  group.add(baseChassis);

  // Back vertical console housing for the oscilloscope & labels
  const backPanel = new THREE.Mesh(new THREE.BoxGeometry(5.4, 2.1, 0.6), chassisMat);
  backPanel.position.set(0, 0.25, -0.75);
  group.add(backPanel);

  // -----------------------------------------
  // 2. LEFT: Three Glowing Nixie Tubes
  // -----------------------------------------
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.26,
    roughness: 0.1,
    transmission: 0.6
  });

  const meshCageMat = new THREE.MeshBasicMaterial({
    color: 0x8a7968,
    wireframe: true,
    transparent: true,
    opacity: 0.25
  });

  const filamentMat = new THREE.MeshStandardMaterial({
    color: 0xff7b00,
    emissive: 0xff5500,
    emissiveIntensity: 2.4
  });

  const filaments = [];

  for (let i = 0; i < 3; i++) {
    const tubeGroup = new THREE.Group();
    tubeGroup.position.set(-1.95 + i * 0.95, 0.05, 0.25);

    // Outer glass envelope
    const cylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.34, 1.5, 24),
      glassMat
    );
    tubeGroup.add(cylinder);

    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.34, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      glassMat
    );
    cap.position.y = 0.75;
    tubeGroup.add(cap);

    // Internal fine wire anode mesh (authentic Nixie detail)
    const anodeCage = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 1.15, 12, 6, true),
      meshCageMat
    );
    tubeGroup.add(anodeCage);

    // Glowing orange cathode numeral ring
    const filament = new THREE.Mesh(
      new THREE.TorusGeometry(0.17, 0.03, 12, 24),
      filamentMat.clone()
    );
    tubeGroup.add(filament);
    filaments.push(filament);

    group.add(tubeGroup);
  }

  // -----------------------------------------
  // 3. RIGHT: Oscilloscope Screen & Live Grid
  // -----------------------------------------
  const scopeGroup = new THREE.Group();
  scopeGroup.position.set(1.45, 0.3, -0.42);

  // Bezel around CRT
  const bezel = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 1.65, 0.15),
    new THREE.MeshStandardMaterial({ color: 0x161b19, roughness: 0.4, metalness: 0.6 })
  );
  scopeGroup.add(bezel);

  // Phosphor screen backing
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.85, 1.4),
    new THREE.MeshBasicMaterial({ color: 0x062112 })
  );
  screen.position.z = 0.08;
  scopeGroup.add(screen);

  // Oscilloscope reticle grid
  const grid = new THREE.GridHelper(1.38, 8, 0x22c55e, 0x14532d);
  grid.rotation.x = Math.PI / 2;
  grid.scale.set(1.32, 1, 1);
  grid.position.z = 0.09;
  scopeGroup.add(grid);

  // Animated oscilloscope sine wave line
  const wavePointsCount = 48;
  const wavePositions = new Float32Array(wavePointsCount * 3);
  const waveGeo = new THREE.BufferGeometry();
  waveGeo.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));
  const waveLine = new THREE.Line(
    waveGeo,
    new THREE.LineBasicMaterial({ color: 0x4ade80 })
  );
  waveLine.position.z = 0.11;
  scopeGroup.add(waveLine);

  group.add(scopeGroup);

  // -----------------------------------------
  // 4. FRONT DECK: Heavy Push-Buttons & High-Contrast Labels
  // -----------------------------------------
  const buttons = [];
  const buttonColors = [0xdc2626, 0xf59e0b, 0x16a34a]; // Red, Amber, Green industrial caps

  // High-contrast label plate texture helper
  function createLabelTexture(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f1210';
    ctx.fillRect(0, 0, 256, 64);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 248, 56);
    ctx.fillStyle = '#f9fafb';
    ctx.font = 'bold 26px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 34);
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  const labelNames = ['PWR', 'GAIN', 'SYNC'];

  for (let i = 0; i < 3; i++) {
    const xPos = 0.65 + i * 0.8;

    // Chrome button collar
    const collar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.27, 0.12, 20),
      new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.85, roughness: 0.2 })
    );
    collar.position.set(xPos, -0.7, 0.45);
    group.add(collar);

    // Heavy phenolic push-button plunger
    const btnMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.19, 0.22, 20),
      new THREE.MeshStandardMaterial({ color: buttonColors[i], roughness: 0.35 })
    );
    btnMesh.position.set(xPos, -0.62, 0.45);
    group.add(btnMesh);
    buttons.push(btnMesh);

    // High-contrast label plate mounted in front of each button
    const labelPlate = new THREE.Mesh(
      new THREE.PlaneGeometry(0.62, 0.18),
      new THREE.MeshBasicMaterial({ map: createLabelTexture(labelNames[i]) })
    );
    labelPlate.rotation.x = -Math.PI / 2.2;
    labelPlate.position.set(xPos, -0.71, 0.85);
    group.add(labelPlate);
  }

  return {
    group,
    update(time, pointer = { x: 0, y: 0 }) {
      // 1. Nixie filament glow pulse
      filaments.forEach((fil, idx) => {
        const pulse = 1.7 + Math.sin(time * 5 + idx * 1.8) * 0.8;
        fil.material.emissiveIntensity = pulse;
        fil.rotation.y = time * 0.6 + idx;
      });

      // 2. Oscilloscope sine wave sweep
      const posAttr = waveGeo.getAttribute('position');
      for (let i = 0; i < wavePointsCount; i++) {
        const u = i / (wavePointsCount - 1);
        const x = (u - 0.5) * 1.75;
        const y = Math.sin(u * Math.PI * 4 - time * 6) * 0.38;
        posAttr.setXYZ(i, x, y, 0);
      }
      posAttr.needsUpdate = true;

      // 3. Heavy push-buttons depressing sequentially
      buttons.forEach((btn, idx) => {
        const isPressed = Math.sin(time * 2.5 - idx * 1.2) > 0.75;
        btn.position.y = isPressed ? -0.68 : -0.62;
      });

      group.rotation.y = pointer.x * 0.3;
      group.rotation.x = -pointer.y * 0.2;
    }
  };
}
