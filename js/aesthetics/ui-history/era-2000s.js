export function createScene(THREE) {
  const group = new THREE.Group();

  // Helper: Draw a rounded rectangle path on 2D canvas
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // -----------------------------------------
  // 1. Soft Ambient Drop Shadow Behind the Glass Window
  // -----------------------------------------
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const sCtx = shadowCanvas.getContext('2d');
  const radGrad = sCtx.createRadialGradient(128, 128, 30, 128, 128, 124);
  radGrad.addColorStop(0, 'rgba(0, 35, 75, 0.55)');
  radGrad.addColorStop(1, 'rgba(0, 35, 75, 0)');
  sCtx.fillStyle = radGrad;
  sCtx.fillRect(0, 0, 256, 256);

  const dropShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(4.8, 3.4),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(shadowCanvas),
      transparent: true,
      depthWrite: false
    })
  );
  dropShadow.position.set(0.08, -0.14, -0.25);
  group.add(dropShadow);

  // -----------------------------------------
  // 2. Nature-Inspired Sky & Grass Backdrop Card
  // -----------------------------------------
  const bgCanvas = document.createElement('canvas');
  bgCanvas.width = 512;
  bgCanvas.height = 352;
  const ctx = bgCanvas.getContext('2d');

  // Vibrant sky-to-aqua gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 352);
  skyGrad.addColorStop(0, '#0284c7');
  skyGrad.addColorStop(0.55, '#7dd3fc');
  skyGrad.addColorStop(1, '#e0f2fe');
  roundRect(ctx, 8, 8, 496, 336, 28);
  ctx.fillStyle = skyGrad;
  ctx.fill();

  // Soft sunlit bokeh circles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.beginPath();
  ctx.arc(110, 95, 52, 0, Math.PI * 2);
  ctx.arc(165, 130, 30, 0, Math.PI * 2);
  ctx.fill();

  // Rolling lime-green nature hill wave at bottom
  ctx.save();
  roundRect(ctx, 8, 8, 496, 336, 28);
  ctx.clip();

  const hillGrad = ctx.createLinearGradient(0, 220, 0, 352);
  hillGrad.addColorStop(0, '#84cc16');
  hillGrad.addColorStop(1, '#15803d');
  ctx.fillStyle = hillGrad;
  ctx.beginPath();
  ctx.moveTo(0, 265);
  ctx.bezierCurveTo(160, 215, 330, 305, 512, 240);
  ctx.lineTo(512, 352);
  ctx.lineTo(0, 352);
  ctx.closePath();
  ctx.fill();

  // Translucent Aero glass window frame overlay
  roundRect(ctx, 28, 28, 456, 296, 20);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.stroke();

  // Glossy window title bar reflection
  roundRect(ctx, 30, 30, 452, 42, 18);
  const titleGloss = ctx.createLinearGradient(0, 30, 0, 72);
  titleGloss.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
  titleGloss.addColorStop(1, 'rgba(255, 255, 255, 0.15)');
  ctx.fillStyle = titleGloss;
  ctx.fill();

  // Friendly humanist window title & traffic-light orbs
  ctx.fillStyle = '#0c4a6e';
  ctx.font = 'bold 18px "Trebuchet MS", "Segoe UI", sans-serif';
  ctx.fillText('Aqua & Aero Glass Desktop', 52, 57);

  // Glossy red/amber/green window orbs
  ['#ef4444', '#f59e0b', '#22c55e'].forEach((col, i) => {
    const cx = 415 + i * 22;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(cx, 51, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.arc(cx - 2, 49, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();

  const backdropPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(4.2, 2.9),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(bgCanvas),
      transparent: true
    })
  );
  backdropPlane.position.z = -0.05;
  group.add(backdropPlane);

  // -----------------------------------------
  // 3. Thick Frosted Glass Pane Overlay
  // -----------------------------------------
  const glassPane = new THREE.Mesh(
    new THREE.BoxGeometry(3.85, 2.5, 0.08),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.05,
      transmission: 0.72,
      transparent: true,
      opacity: 0.45,
      ior: 1.45
    })
  );
  glassPane.position.z = 0.06;
  group.add(glassPane);

  // -----------------------------------------
  // 4. Floating Skeuomorphic Glossy Gel Orb & Aqua Pill Button
  // -----------------------------------------
  const orbGroup = new THREE.Group();
  orbGroup.position.set(-0.95, -0.05, 0.36);

  const gelOrb = new THREE.Mesh(
    new THREE.SphereGeometry(0.58, 36, 36),
    new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9,
      emissive: 0x0369a1,
      emissiveIntensity: 0.35,
      roughness: 0.06,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    })
  );
  orbGroup.add(gelOrb);

  // Specular wet-glass highlight crescent on the orb
  const specDot = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })
  );
  specDot.scale.set(1.3, 0.75, 0.5);
  specDot.position.set(-0.18, 0.25, 0.46);
  specDot.rotation.z = 0.4;
  orbGroup.add(specDot);

  group.add(orbGroup);

  // Rounded glossy leaf-green & sky-blue gel capsule buttons on the right
  function createGelPill(colorHex, yPos) {
    const pillGeo = new THREE.CapsuleGeometry(0.18, 0.95, 12, 24);
    pillGeo.rotateZ(Math.PI / 2);
    const pillMat = new THREE.MeshPhysicalMaterial({
      color: colorHex,
      roughness: 0.1,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06
    });
    const pill = new THREE.Mesh(pillGeo, pillMat);
    pill.position.set(0.75, yPos, 0.28);
    return pill;
  }

  const skyPill = createGelPill(0x0284c7, 0.22);
  const leafPill = createGelPill(0x65a30d, -0.32);
  group.add(skyPill, leafPill);

  return {
    group,
    update(time, pointer = { x: 0, y: 0 }) {
      // Gentle buoyancy float for the water-droplet orb and gel pills
      orbGroup.position.y = -0.05 + Math.sin(time * 2.2) * 0.08;
      skyPill.position.z = 0.28 + Math.sin(time * 2.0) * 0.03;
      leafPill.position.z = 0.28 + Math.cos(time * 2.0) * 0.03;

      group.rotation.y = pointer.x * 0.32;
      group.rotation.x = -pointer.y * 0.22;
    }
  };
}
