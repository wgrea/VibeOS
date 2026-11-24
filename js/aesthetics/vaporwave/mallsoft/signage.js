import * as THREE from 'three';

// Text/canvas helper is shared with storefronts conceptually, but kept local
// here so signage stays self-contained. If a third caller appears, lift this
// into a `textures.js` module.

export function createSignage() {
  const signage = new THREE.Group();

  // ---------- Directory board near the fountain ----------
  // A freestanding "YOU ARE HERE" board on a post. The board face is a
  // canvas texture so the store names are legible, with a colored map dot
  // grid on the right half and a text listing on the left.
  const directory = createDirectoryBoard();
  directory.position.set(0.9, 0.3, 2.4);
  directory.rotation.y = -0.25;
  signage.add(directory);

  // ---------- Hanging "LEVEL 1" marker above the fountain ----------
  // Thin horizontal banner suspended from two cables. Reads as the level
  // indicator you see in real atriums when the ceiling is very tall.
  const levelMarker = createLevelMarker('LEVEL 1');
  levelMarker.position.set(0, 3.2, -2.5);
  signage.add(levelMarker);

  // ---------- Pillar-mounted wayfinding ----------
  // Small signs mounted on the inside faces of the four colonnade pillars.
  // Each points toward a different destination.
  const pillarSigns = [
    { text: 'RESTROOMS →', color: 0x60a5fa, x: -3.9, z: -1,   ry: 0 },
    { text: 'FOOD COURT',   color: 0xfb923c, x:  3.9, z: -1,   ry: Math.PI },
    { text: 'ELEVATOR',     color: 0x2dd4bf, x: -3.9, z: -5.5, ry: 0 },
    { text: 'CINEMA ↓',     color: 0xf472b6, x:  3.9, z: -5.5, ry: Math.PI },
  ];
  pillarSigns.forEach(({ text, color, x, z, ry }) => {
    const sign = createWallSign(text, color, 1.1, 0.22);
    sign.position.set(x, 1.4, z);
    sign.rotation.y = ry;
    signage.add(sign);
  });

  // ---------- Wall-mounted exit signs ----------
  // Small green "EXIT" signs on the back and side walls. Very subtle but a
  // strong mall-authenticity cue.
  const exitSigns = [
    { x: -8.7, z: 6.5, ry:  Math.PI / 2 },
    { x:  8.7, z: 6.5, ry: -Math.PI / 2 },
    { x: -8.7, z: -6.0, ry:  Math.PI / 2 },
    { x:  8.7, z: -6.0, ry: -Math.PI / 2 },
  ];
  exitSigns.forEach(({ x, z, ry }) => {
    const exit = createExitSign();
    exit.position.set(x, 1.7, z);
    exit.rotation.y = ry;
    signage.add(exit);
  });

  return { group: signage };
}

// ---------------------------------------------------------------------------
// Directory board: dark panel with a text listing on the left and a small
// schematic map on the right, mounted on a post.
// ---------------------------------------------------------------------------
function createDirectoryBoard() {
  const board = new THREE.Group();

  const pxW = 640;
  const pxH = 400;
  const canvas = document.createElement('canvas');
  canvas.width = pxW;
  canvas.height = pxH;
  const ctx = canvas.getContext('2d');

  // Panel background
  ctx.fillStyle = '#1e1e2e';
  ctx.fillRect(0, 0, pxW, pxH);

  // Thin accent border
  ctx.strokeStyle = 'rgba(244, 114, 182, 0.8)';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, pxW - 16, pxH - 16);

  // Header
  ctx.fillStyle = '#fce7f3';
  ctx.font = '700 34px "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('MALL DIRECTORY', 28, 28);

  ctx.fillStyle = 'rgba(244, 114, 182, 0.9)';
  ctx.fillRect(28, 74, pxW - 56, 2);

  // Store listing (left column)
  const stores = [
    ['◆', 'CRYSTAL BOUTIQUE', '#a78bfa'],
    ['◆', 'CINNAMON SWIRL',   '#fb923c'],
    ['◆', 'GAME FORCE',       '#f472b6'],
    ['◆', 'RADIO SHACK',      '#fbbf24'],
    ['◆', 'BATH & BODY',      '#a7f3d0'],
    ['◆', 'SAM GOODY',        '#c084fc'],
    ['◆', 'ORANGE JULIUS',    '#fde68a'],
    ['◆', 'WALDENBOOKS',      '#fb7185'],
    ['◆', 'THE LIMITED',      '#93c5fd'],
    ['◆', 'JCPENNEY',         '#fca5a5'],
  ];

  ctx.font = '500 20px "Helvetica Neue", Arial, sans-serif';
  stores.forEach(([, name, color], i) => {
    const y = 100 + i * 26;
    ctx.fillStyle = color;
    ctx.fillText('◆', 28, y);
    ctx.fillStyle = '#e5e7eb';
    ctx.fillText(name, 56, y);
  });

  // "YOU ARE HERE" marker (right side, above the map)
  ctx.fillStyle = '#f472b6';
  ctx.font = '700 18px "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('YOU ARE HERE', pxW - 28, 100);

  // Simple schematic map (right side) — a few labeled rectangles.
  const mapX = pxW - 300;
  const mapY = 140;
  ctx.strokeStyle = 'rgba(252, 231, 243, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(mapX, mapY, 260, 200);

  // Filled blocks representing zones on the map
  const blocks = [
    { x: mapX + 12,  y: mapY + 12,  w: 76, h: 44, color: '#fb923c', label: 'FOOD' },
    { x: mapX + 100, y: mapY + 12,  w: 76, h: 44, color: '#c084fc', label: 'SHOPS' },
    { x: mapX + 188, y: mapY + 12,  w: 60, h: 44, color: '#f472b6', label: 'CINEMA' },
    { x: mapX + 12,  y: mapY + 70,  w: 130, h: 60, color: '#2dd4bf', label: 'ATRIUM' },
    { x: mapX + 152, y: mapY + 70,  w: 96, h: 60, color: '#a7f3d0', label: 'RESTROOMS' },
  ];
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  blocks.forEach(({ x, y, w, h, color, label }) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#1e1e2e';
    ctx.font = '700 12px "Helvetica Neue", Arial, sans-serif';
    ctx.fillText(label, x + w / 2, y + h / 2);
  });

  // "You are here" pin on the map
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(mapX + 77, mapY + 100, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1e1e2e';
  ctx.lineWidth = 2;
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

  // Panel
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 1.0),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  panel.position.set(0, 0.15, 0.04);
  board.add(panel);

  // Backing box behind the panel (so it has thickness when seen from the side)
  const backing = new THREE.Mesh(
    new THREE.BoxGeometry(1.68, 1.08, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x1e1e2e, roughness: 0.6 })
  );
  backing.position.set(0, 0.15, 0);
  board.add(backing);

  // Post
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 1.2, 6),
    new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.5 })
  );
  post.position.y = -0.65;
  board.add(post);

  return board;
}

// ---------------------------------------------------------------------------
// Hanging level marker: a thin banner with "LEVEL 1" text, suspended from
// two thin cables. Reads from both sides, so it uses DoubleSide.
// ---------------------------------------------------------------------------
function createLevelMarker(text) {
  const marker = new THREE.Group();

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 80;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1e1e2e';
  ctx.fillRect(0, 0, 512, 80);
  ctx.strokeStyle = 'rgba(45, 212, 191, 0.9)';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, 508, 76);

  ctx.fillStyle = '#ecfeff';
  ctx.font = '700 44px "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 42);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;

  const banner = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 0.5),
    new THREE.MeshBasicMaterial({
      map: tex,
      side: THREE.DoubleSide,
    })
  );
  marker.add(banner);

  // Cables
  const cableMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.7,
  });
  const cableGeo = new THREE.CylinderGeometry(0.008, 0.008, 1.2, 4);
  for (const x of [-1.4, 1.4]) {
    const cable = new THREE.Mesh(cableGeo, cableMat);
    cable.position.set(x, 0.85, 0);
    marker.add(cable);
  }

  return marker;
}

// ---------------------------------------------------------------------------
// Generic wall sign: colored backing with white text. Used for wayfinding
// (RESTROOMS, FOOD COURT, etc.) and can be reused for anything text-bearing.
// ---------------------------------------------------------------------------
function createWallSign(text, color, width, height) {
  const pxW = 512;
  const pxH = Math.round((pxW * height) / width);
  const canvas = document.createElement('canvas');
  canvas.width = pxW;
  canvas.height = pxH;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
  ctx.fillRect(0, 0, pxW, pxH);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, pxW - 4, pxH - 4);

  const fontSize = Math.min(pxH * 0.55, (pxW / Math.max(text.length, 1)) * 1.4);
  ctx.fillStyle = '#1e1e2e';
  ctx.font = `700 ${fontSize}px "Helvetica Neue", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, pxW / 2, pxH / 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;

  return new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide })
  );
}

// ---------------------------------------------------------------------------
// Small green EXIT sign.
// ---------------------------------------------------------------------------
function createExitSign() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#16a34a';
  ctx.fillRect(0, 0, 256, 96);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.strokeRect(3, 3, 250, 90);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 52px "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('EXIT', 128, 50);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;

  return new THREE.Mesh(
    new THREE.PlaneGeometry(0.42, 0.16),
    new THREE.MeshBasicMaterial({
      map: tex,
      side: THREE.DoubleSide,
    })
  );
}