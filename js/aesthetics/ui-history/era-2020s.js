export function createScene(THREE) {
  const group = new THREE.Group();

  // Helper: Draw rounded rectangle on 2D canvas
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
  // 1. BACK LAYER: Desktop Dark-Mode Responsive Grid
  // -----------------------------------------
  const deskCanvas = document.createElement('canvas');
  deskCanvas.width = 512;
  deskCanvas.height = 320;
  const dCtx = deskCanvas.getContext('2d');

  roundRect(dCtx, 4, 4, 504, 312, 22);
  dCtx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  dCtx.fill();
  dCtx.lineWidth = 2;
  dCtx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
  dCtx.stroke();

  // Clean sans-serif header + Dark Mode pill badge
  dCtx.fillStyle = '#f8fafc';
  dCtx.font = 'bold 20px system-ui, -apple-system, sans-serif';
  dCtx.fillText('Adaptive Workspace', 28, 44);

  roundRect(dCtx, 366, 24, 118, 28, 14);
  dCtx.fillStyle = 'rgba(56, 189, 248, 0.18)';
  dCtx.fill();
  dCtx.strokeStyle = '#38bdf8';
  dCtx.lineWidth = 1.5;
  dCtx.stroke();
  dCtx.fillStyle = '#38bdf8';
  dCtx.font = 'bold 12px system-ui, sans-serif';
  dCtx.fillText('● DARK MODE', 382, 42);

  // 3-Column Responsive Bento Cards
  for (let col = 0; col < 3; col++) {
    const cx = 28 + col * 156;
    roundRect(dCtx, cx, 72, 144, 110, 14);
    dCtx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    dCtx.fill();
    dCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    dCtx.stroke();

    // Minimalist flat skeleton bars
    dCtx.fillStyle = col === 0 ? '#38bdf8' : '#64748b';
    dCtx.fillRect(cx + 16, 94, 48, 8);
    dCtx.fillStyle = '#cbd5e1';
    dCtx.fillRect(cx + 16, 116, 108, 6);
    dCtx.fillStyle = '#475569';
    dCtx.fillRect(cx + 16, 132, 84, 6);
  }

  // Bottom wide responsive bar
  roundRect(dCtx, 28, 198, 456, 92, 14);
  dCtx.fillStyle = 'rgba(30, 41, 59, 0.75)';
  dCtx.fill();
  dCtx.fillStyle = '#94a3b8';
  dCtx.font = '14px system-ui, sans-serif';
  dCtx.fillText('Fluid Grid • Variable Typography • Zero Heavy Bevels', 48, 250);

  const desktopCard = new THREE.Mesh(
    new THREE.PlaneGeometry(3.8, 2.38),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(deskCanvas),
      transparent: true
    })
  );
  desktopCard.position.set(-0.25, 0.1, -0.55);
  group.add(desktopCard);

  // -----------------------------------------
  // 2. MIDDLE LAYER: Mobile Adaptive Viewport (Left-Front)
  // -----------------------------------------
  const mobCanvas = document.createElement('canvas');
  mobCanvas.width = 220;
  mobCanvas.height = 380;
  const mCtx = mobCanvas.getContext('2d');

  roundRect(mCtx, 4, 4, 212, 372, 28);
  mCtx.fillStyle = 'rgba(17, 24, 39, 0.92)';
  mCtx.fill();
  mCtx.lineWidth = 2.5;
  mCtx.strokeStyle = 'rgba(248, 250, 252, 0.35)';
  mCtx.stroke();

  // Dynamic Island / Status pill
  roundRect(mCtx, 74, 16, 72, 14, 7);
  mCtx.fillStyle = '#000000';
  mCtx.fill();

  mCtx.fillStyle = '#f8fafc';
  mCtx.font = 'bold 16px system-ui, sans-serif';
  mCtx.fillText('Mobile View', 24, 64);

  // Stacked single-column adaptive cards
  for (let row = 0; row < 3; row++) {
    const ry = 84 + row * 82;
    roundRect(mCtx, 22, ry, 176, 68, 14);
    mCtx.fillStyle = 'rgba(51, 65, 85, 0.7)';
    mCtx.fill();
    mCtx.fillStyle = row === 0 ? '#38bdf8' : '#94a3b8';
    mCtx.fillRect(36, ry + 20, 64, 7);
    mCtx.fillStyle = '#e2e8f0';
    mCtx.fillRect(36, ry + 38, 132, 6);
  }

  // Bottom gesture home bar
  roundRect(mCtx, 72, 354, 76, 5, 2.5);
  mCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  mCtx.fill();

  const mobileCard = new THREE.Mesh(
    new THREE.PlaneGeometry(1.18, 2.04),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(mobCanvas),
      transparent: true
    })
  );
  mobileCard.position.set(-1.55, -0.25, 0.25);
  group.add(mobileCard);

  // -----------------------------------------
  // 3. FRONT LAYER: Spatial Headset Translucent Glass Widget
  // -----------------------------------------
  const spCanvas = document.createElement('canvas');
  spCanvas.width = 320;
  spCanvas.height = 200;
  const sCtx = spCanvas.getContext('2d');

  roundRect(sCtx, 4, 4, 312, 192, 32);
  sCtx.fillStyle = 'rgba(30, 41, 59, 0.55)';
  sCtx.fill();
  sCtx.lineWidth = 2.5;
  sCtx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
  sCtx.stroke();

  sCtx.fillStyle = '#ffffff';
  sCtx.font = 'bold 18px system-ui, sans-serif';
  sCtx.fillText('Spatial Glass Layer', 28, 48);

  sCtx.fillStyle = '#bae6fd';
  sCtx.font = '14px system-ui, sans-serif';
  sCtx.fillText('Eye-Tracked • Translucent Depth', 28, 76);

  // Floating spatial pill controls
  roundRect(sCtx, 28, 108, 124, 44, 22);
  sCtx.fillStyle = 'rgba(56, 189, 248, 0.35)';
  sCtx.fill();
  sCtx.strokeStyle = '#7dd3fc';
  sCtx.lineWidth = 1.5;
  sCtx.stroke();
  sCtx.fillStyle = '#ffffff';
  sCtx.font = 'bold 14px system-ui, sans-serif';
  sCtx.fillText('Spatial Pinch', 46, 135);

  // Gaze focus reticle ring
  sCtx.strokeStyle = '#ffffff';
  sCtx.lineWidth = 2;
  sCtx.beginPath();
  sCtx.arc(240, 130, 20, 0, Math.PI * 2);
  sCtx.stroke();
  sCtx.fillStyle = 'rgba(56, 189, 248, 0.6)';
  sCtx.beginPath();
  sCtx.arc(240, 130, 7, 0, Math.PI * 2);
  sCtx.fill();

  const spatialCard = new THREE.Mesh(
    new THREE.PlaneGeometry(2.15, 1.35),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(spCanvas),
      transparent: true
    })
  );
  spatialCard.position.set(1.15, -0.3, 0.85);
  group.add(spatialCard);

  return {
    group,
    update(time, pointer = { x: 0, y: 0 }) {
      // Subtle Z-depth parallax across Desktop -> Mobile -> Spatial Headset layers
      desktopCard.position.x = -0.25 + pointer.x * 0.1;
      desktopCard.position.y = 0.1 + pointer.y * 0.08;

      mobileCard.position.x = -1.55 + pointer.x * 0.22;
      mobileCard.position.y = -0.25 + pointer.y * 0.18 + Math.sin(time * 1.8) * 0.04;

      spatialCard.position.x = 1.15 + pointer.x * 0.36;
      spatialCard.position.y = -0.3 + pointer.y * 0.28 + Math.cos(time * 2.0) * 0.05;
      spatialCard.position.z = 0.85 + Math.sin(time * 1.5) * 0.06;

      group.rotation.y = pointer.x * 0.24;
      group.rotation.x = -pointer.y * 0.18;
    }
  };
}
