export function createScene(THREE) {
  const group = new THREE.Group();

  // Helper to draw authentic 1990s raised or sunken 2px bevel borders
  function drawBevel(ctx, x, y, w, h, sunken = false, fill = '#c0c0c0') {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);

    const topLeftOuter = sunken ? '#808080' : '#ffffff';
    const topLeftInner = sunken ? '#000000' : '#dfdfdf';
    const bottomRightOuter = sunken ? '#ffffff' : '#000000';
    const bottomRightInner = sunken ? '#dfdfdf' : '#808080';

    // Outer 1px border
    ctx.fillStyle = topLeftOuter;
    ctx.fillRect(x, y, w, 2);
    ctx.fillRect(x, y, 2, h);

    ctx.fillStyle = bottomRightOuter;
    ctx.fillRect(x, y + h - 2, w, 2);
    ctx.fillRect(x + w - 2, y, 2, h);

    // Inner 1px border
    ctx.fillStyle = topLeftInner;
    ctx.fillRect(x + 2, y + 2, w - 4, 2);
    ctx.fillRect(x + 2, y + 2, 2, h - 4);

    ctx.fillStyle = bottomRightInner;
    ctx.fillRect(x + 2, y + h - 4, w - 4, 2);
    ctx.fillRect(x + w - 4, y + 2, 2, h - 4);
  }

  // -----------------------------------------
  // 1. Dialog Window Face Texture (Raised Frame + Sunken Text Field)
  // -----------------------------------------
  const winCanvas = document.createElement('canvas');
  winCanvas.width = 512;
  winCanvas.height = 330;
  const ctx = winCanvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // Outer raised dialog border
  drawBevel(ctx, 0, 0, 512, 330, false, '#c0c0c0');

  // Navy blue title bar + classic [ _ ] [ □ ] [ X ] raised buttons
  ctx.fillStyle = '#000080';
  ctx.fillRect(6, 6, 500, 34);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px "Tahoma", "Arial", sans-serif';
  ctx.fillText('System Properties', 16, 29);

  ['_', '□', 'X'].forEach((symbol, i) => {
    const bx = 422 + i * 26;
    drawBevel(ctx, bx, 10, 24, 24, false, '#c0c0c0');
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px "Arial", sans-serif';
    ctx.fillText(symbol, bx + 7, 27);
  });

  // Form label + Sunken white text input field
  ctx.fillStyle = '#000000';
  ctx.font = '16px "Tahoma", "Arial", sans-serif';
  ctx.fillText('User Name (Sunken Text Field):', 36, 86);
  drawBevel(ctx, 36, 100, 440, 40, true, '#ffffff');
  ctx.fillStyle = '#000000';
  ctx.font = '17px "Courier New", monospace';
  ctx.fillText('Administrator_', 48, 126);

  // Sunken status well above buttons
  drawBevel(ctx, 36, 160, 440, 46, true, '#b8b8b8');
  ctx.fillStyle = '#000000';
  ctx.font = '15px "Tahoma", "Arial", sans-serif';
  ctx.fillText('Raised bevels = Clickable   |   Sunken bevels = Input', 54, 188);

  const winTex = new THREE.CanvasTexture(winCanvas);
  winTex.magFilter = THREE.NearestFilter;

  const dialogMat = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    roughness: 0.6,
    metalness: 0.1
  });

  const dialogMaterials = [
    dialogMat, // right
    dialogMat, // left
    dialogMat, // top
    dialogMat, // bottom
    new THREE.MeshBasicMaterial({ map: winTex }), // front face
    dialogMat  // back
  ];

  const dialog = new THREE.Mesh(new THREE.BoxGeometry(4.0, 2.55, 0.22), dialogMaterials);
  dialog.position.set(0, 0.32, 0);
  group.add(dialog);

  // -----------------------------------------
  // 2. Extruded 3D Raised "OK" & "Cancel" Buttons
  // -----------------------------------------
  function createButtonTexture(label, focused = false) {
    const bCanvas = document.createElement('canvas');
    bCanvas.width = 160;
    bCanvas.height = 56;
    const bCtx = bCanvas.getContext('2d');
    drawBevel(bCtx, 0, 0, 160, 56, false, '#c0c0c0');
    if (focused) {
      bCtx.strokeStyle = '#000000';
      bCtx.setLineDash([2, 2]);
      bCtx.strokeRect(8, 8, 144, 40);
    }
    bCtx.fillStyle = '#000000';
    bCtx.font = 'bold 20px "Tahoma", "Arial", sans-serif';
    bCtx.textAlign = 'center';
    bCtx.textBaseline = 'middle';
    bCtx.fillText(label, 80, 29);
    const tex = new THREE.CanvasTexture(bCanvas);
    tex.magFilter = THREE.NearestFilter;
    return tex;
  }

  const okBtn = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 0.4, 0.14),
    [
      dialogMat, dialogMat, dialogMat, dialogMat,
      new THREE.MeshBasicMaterial({ map: createButtonTexture('OK', true) }),
      dialogMat
    ]
  );
  okBtn.position.set(-0.72, -0.52, 0.16);
  group.add(okBtn);

  const cancelBtn = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 0.4, 0.14),
    [
      dialogMat, dialogMat, dialogMat, dialogMat,
      new THREE.MeshBasicMaterial({ map: createButtonTexture('Cancel', false) }),
      dialogMat
    ]
  );
  cancelBtn.position.set(0.72, -0.52, 0.16);
  group.add(cancelBtn);

  // -----------------------------------------
  // 3. Bottom 1990s Taskbar (Start Button + Active Task + Sunken Clock Tray)
  // -----------------------------------------
  const tbCanvas = document.createElement('canvas');
  tbCanvas.width = 640;
  tbCanvas.height = 56;
  const tbCtx = tbCanvas.getContext('2d');
  tbCtx.imageSmoothingEnabled = false;

  drawBevel(tbCtx, 0, 0, 640, 56, false, '#c0c0c0');

  // Raised Start button
  drawBevel(tbCtx, 6, 6, 108, 44, false, '#c0c0c0');
  tbCtx.fillStyle = '#000000';
  tbCtx.font = 'bold 20px "Tahoma", "Arial", sans-serif';
  tbCtx.fillText('❖ Start', 20, 35);

  // Depressed active window taskbar tab
  drawBevel(tbCtx, 124, 6, 220, 44, true, '#dfdfdf');
  tbCtx.fillStyle = '#000000';
  tbCtx.font = 'bold 17px "Tahoma", "Arial", sans-serif';
  tbCtx.fillText('System Properties', 142, 34);

  // Sunken system tray clock
  drawBevel(tbCtx, 514, 6, 118, 44, true, '#c0c0c0');
  tbCtx.fillStyle = '#000000';
  tbCtx.font = '17px "Tahoma", "Arial", sans-serif';
  tbCtx.fillText('12:00 PM', 534, 34);

  const tbTex = new THREE.CanvasTexture(tbCanvas);
  tbTex.magFilter = THREE.NearestFilter;

  const taskbar = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 0.42, 0.24),
    [
      dialogMat, dialogMat, dialogMat, dialogMat,
      new THREE.MeshBasicMaterial({ map: tbTex }),
      dialogMat
    ]
  );
  taskbar.position.set(0, -1.35, 0.05);
  group.add(taskbar);

  return {
    group,
    update(time, pointer = { x: 0, y: 0 }) {
      // Simulate physical 3D OK button press inward
      const isPressed = Math.sin(time * 3) > 0.7;
      okBtn.position.z = isPressed ? 0.11 : 0.16;

      group.rotation.y = pointer.x * 0.3;
      group.rotation.x = -pointer.y * 0.2;
    }
  };
}
