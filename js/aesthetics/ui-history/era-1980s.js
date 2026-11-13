// js/aesthetics/ui-history/era-1980s.js
export function createScene(THREE) {
  const group = new THREE.Group();

  // 1. Dynamic 1-Bit Monochrome Desktop & WIMP Canvas
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // Classic 50% 1-bit pixel checkerboard dither pattern
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = 2;
  patternCanvas.height = 2;
  const pCtx = patternCanvas.getContext('2d');
  pCtx.fillStyle = '#ffffff';
  pCtx.fillRect(0, 0, 2, 2);
  pCtx.fillStyle = '#000000';
  pCtx.fillRect(0, 0, 1, 1);
  pCtx.fillRect(1, 1, 1, 1);
  const ditherPattern = ctx.createPattern(patternCanvas, 'repeat');

  // Fill desktop background with 1-bit dither
  ctx.fillStyle = ditherPattern;
  ctx.fillRect(0, 0, 512, 384);

  // Top Menu Bar (Menus)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 26);
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 26, 512, 2);
  ctx.font = 'bold 15px "Geneva", "Courier New", monospace';
  ctx.fillText('   File   Edit   View   Special', 12, 18);

  // Desktop Metaphor Icons on Right (Icons)
  function drawDesktopIcon(x, y, label, isTrash = false) {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    if (isTrash) {
      ctx.fillRect(x + 8, y + 6, 24, 28);
      ctx.strokeRect(x + 8, y + 6, 24, 28);
      ctx.fillRect(x + 5, y + 2, 30, 4);
      ctx.strokeRect(x + 5, y + 2, 30, 4);
    } else {
      // Classic folder tab + body
      ctx.fillRect(x + 4, y + 2, 14, 5);
      ctx.strokeRect(x + 4, y + 2, 14, 5);
      ctx.fillRect(x + 4, y + 6, 32, 24);
      ctx.strokeRect(x + 4, y + 6, 32, 24);
    }
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 6, y + 36, 52, 15);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + 20, y + 47);
    ctx.textAlign = 'left';
  }

  drawDesktopIcon(442, 46, 'System');
  drawDesktopIcon(442, 122, 'Docs');
  drawDesktopIcon(442, 295, 'Trash', true);

  // 1-Bit Window with Hard Drop Shadow (Windows)
  const winX = 36, winY = 54, winW = 364, winH = 268;
  ctx.fillStyle = '#000000';
  ctx.fillRect(winX + 4, winY + 4, winW, winH);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(winX, winY, winW, winH);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.strokeRect(winX, winY, winW, winH);

  // Title Bar Horizontal Stripes + Close Box
  for (let sy = winY + 5; sy <= winY + 19; sy += 3) {
    ctx.fillRect(winX + 4, sy, winW - 8, 1);
  }
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(winX + 12, winY + 5, 14, 14);
  ctx.strokeRect(winX + 12, winY + 5, 14, 14);

  // Centered Window Title
  ctx.fillRect(winX + 125, winY + 3, 114, 18);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 14px "Courier New", monospace';
  ctx.fillText('Macintosh HD', winX + 132, winY + 17);
  ctx.fillRect(winX, winY + 24, winW, 2);

  // Right Scrollbar Track
  ctx.strokeRect(winX + winW - 18, winY + 24, 18, winH - 24);
  ctx.fillStyle = ditherPattern;
  ctx.fillRect(winX + winW - 17, winY + 42, 16, winH - 60);

  // Document Lines Inside Window
  ctx.fillStyle = '#000000';
  ctx.font = '14px "Courier New", monospace';
  ctx.fillText('1-Bit WIMP Interface (1984)', winX + 18, winY + 54);
  ctx.fillText('• Windows & Overlapping Frames', winX + 18, winY + 84);
  ctx.fillText('• Icons & Desktop Metaphor', winX + 18, winY + 110);
  ctx.fillText('• Pull-Down Menus', winX + 18, winY + 136);
  ctx.fillText('• Pixel Pointer + Mouse', winX + 18, winY + 162);

  const screenTex = new THREE.CanvasTexture(canvas);
  screenTex.magFilter = THREE.NearestFilter;
  screenTex.minFilter = THREE.NearestFilter;

  // 2. 3D Screen Slab & Hard 1-Bit Frame
  const screenSlab = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 3.15, 0.12),
    new THREE.MeshBasicMaterial({ map: screenTex })
  );
  group.add(screenSlab);

  const borderEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(4.22, 3.17, 0.14));
  group.add(new THREE.LineSegments(borderEdges, new THREE.LineBasicMaterial({ color: 0x000000 })));

  // 3. Floating Crisp 1-Bit Arrow Pointer (Pointer)
  const arrowShape = new THREE.Shape();
  arrowShape.moveTo(0, 0);
  arrowShape.lineTo(0, -0.46);
  arrowShape.lineTo(0.11, -0.35);
  arrowShape.lineTo(0.19, -0.52);
  arrowShape.lineTo(0.26, -0.49);
  arrowShape.lineTo(0.18, -0.32);
  arrowShape.lineTo(0.32, -0.32);
  arrowShape.closePath();

  const arrowGeo = new THREE.ShapeGeometry(arrowShape);
  const pointerArrow = new THREE.Mesh(arrowGeo, new THREE.MeshBasicMaterial({ color: 0x000000 }));
  pointerArrow.position.set(-0.3, 0.2, 0.14);

  const arrowOutline = new THREE.LineSegments(
    new THREE.EdgesGeometry(arrowGeo),
    new THREE.LineBasicMaterial({ color: 0xffffff })
  );
  pointerArrow.add(arrowOutline);
  group.add(pointerArrow);

  // 4. Classic Boxy 1980s Single-Button Mouse Beside the Screen
  const mouseGroup = new THREE.Group();
  mouseGroup.position.set(2.65, -1.05, 0.15);

  const puttyMat = new THREE.MeshStandardMaterial({ color: 0xd8d2c5, roughness: 0.6 });
  const darkBtnMat = new THREE.MeshStandardMaterial({ color: 0x8c857b, roughness: 0.5 });

  const mouseBody = new THREE.Mesh(new THREE.BoxGeometry(0.68, 1.05, 0.34), puttyMat);
  const mouseBtn = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.32, 0.06), darkBtnMat);
  mouseBtn.position.set(0, 0.28, 0.18);

  mouseGroup.add(mouseBody, mouseBtn);
  group.add(mouseGroup);

  return {
    group,
    update(time, pointer = { x: 0, y: 0 }) {
      // Smooth cursor glide across the window and menu bar
      const cursorX = -0.35 + Math.sin(time * 1.4) * 0.85;
      const cursorY = 0.15 + Math.cos(time * 1.1) * 0.55;
      pointerArrow.position.x = cursorX;
      pointerArrow.position.y = cursorY;

      // Sync mouse hardware motion with the on-screen pointer
      mouseGroup.position.x = 2.65 + Math.sin(time * 1.4) * 0.18;
      mouseGroup.position.y = -1.05 + Math.cos(time * 1.1) * 0.14;

      group.rotation.y = pointer.x * 0.3;
      group.rotation.x = -pointer.y * 0.2;
    }
  };
}
