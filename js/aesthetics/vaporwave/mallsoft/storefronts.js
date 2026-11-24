import * as THREE from 'three';

// A storefront is a 2.2-unit-wide slot: frame + interior + sign + optional
// shutter. Rows are laid out by `layoutRow` below, which handles spacing and
// rotation so adding shops is just adding entries to the spec arrays.

const SLOT_WIDTH = 2.2;
const SLOT_HEIGHT = 2.4;
const SLOT_Y = -0.2;       // world Y of the slot's center
const FRAME_DEPTH = 0.08;
const SLOT_Y_FLOOR2 = 3.9; // world Y of the slot's center on the mezzanine

// Per-wall layout config. Each wall runs along a row of slots.
// `axis` is the wall's running direction ('x' or 'z'). `face` is which way
// the storefronts look (used to rotate the frame so its sign faces inward).
const WALLS = {
  left:  { axis: 'z', fixed: -8.75, dir: -1, faceY: Math.PI / 2 },
  right: { axis: 'z', fixed:  8.75, dir:  1, faceY: -Math.PI / 2 },
  back:  { axis: 'x', fixed: -8.75, dir:  1, faceY: 0 },
};

// Shop roster. `shuttered: true` swaps the interior for a corrugated gate,
// which is the single strongest "dead mall" cue at this scale.
const SHOPS = [
  // ---- Left wall ----
  { wall: 'left', name: 'CRYSTAL BOUTIQUE', color: 0xa78bfa, hue: 0.75, shuttered: false },
  { wall: 'left', name: 'CINNAMON SWIRL',   color: 0xfb923c, hue: 0.08, shuttered: false },
  { wall: 'left', name: 'SUNGLASS HUT',     color: 0x22d3ee, hue: 0.52, shuttered: true  },
  { wall: 'left', name: 'GAME FORCE',       color: 0xf472b6, hue: 0.9,  shuttered: false },
  { wall: 'left', name: 'RADIO SHACK',      color: 0xfbbf24, hue: 0.12, shuttered: false },

  // ---- Right wall ----
  { wall: 'right', name: 'SEARS',           color: 0x60a5fa, hue: 0.6,  shuttered: true  },
  { wall: 'right', name: 'BATH & BODY',     color: 0xa7f3d0, hue: 0.4,  shuttered: false },
  { wall: 'right', name: 'SAM GOODY',       color: 0xc084fc, hue: 0.78, shuttered: false },
  { wall: 'right', name: 'ORANGE JULIUS',   color: 0xfde68a, hue: 0.13, shuttered: false },
  { wall: 'right', name: 'CHAMPS SPORTS',   color: 0x34d399, hue: 0.42, shuttered: true  },

  // ---- Back wall ----
  { wall: 'back',  name: 'WALDENBOOKS',     color: 0xfb7185, hue: 0.95, shuttered: false },
  { wall: 'back',  name: 'THE LIMITED',     color: 0x93c5fd, hue: 0.58, shuttered: false },
  { wall: 'back',  name: 'JCPENNEY',        color: 0xfca5a5, hue: 0.02, shuttered: false },
];

// Second-floor shops. Same slot format as the ground floor, but they sit
// on the mezzanine (SLOT_Y_FLOOR2). The roster is intentionally different
// from the ground floor — upper levels in mallsoft malls are specialty
// shops, not anchors.
const SHOPS_FLOOR2 = [
  // ---- Left wall ----
  { wall: 'left', name: 'SUNCOAST VIDEO', color: 0x60a5fa, shuttered: false },
  { wall: 'left', name: 'THE DISNEY STORE', color: 0xf472b6, shuttered: false },
  { wall: 'left', name: 'PRETZEL TIME',   color: 0xfbbf24, shuttered: false },

  // ---- Right wall ----
  { wall: 'right', name: 'KB TOYS',       color: 0x34d399, shuttered: true  },
  { wall: 'right', name: 'ZALES',         color: 0xa7f3d0, shuttered: false },
  { wall: 'right', name: 'FOOT LOCKER',   color: 0xfb923c, shuttered: false },

  // ---- Back wall ----
  { wall: 'back',  name: 'BORDERS',       color: 0xfb7185, shuttered: false },
  { wall: 'back',  name: 'STRUCTURE',     color: 0x93c5fd, shuttered: false },
];

export function createStorefronts() {
  const storefronts = new THREE.Group();

  // Shared materials — created once and reused across every shop.
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0xfdf2f8,
    roughness: 0.3,
    metalness: 0.05,
  });
  const interiorMat = new THREE.MeshStandardMaterial({
    color: 0x1e1e2e,
    roughness: 0.9,
  });
  const shutterMat = new THREE.MeshStandardMaterial({
    color: 0x9ca3af,
    roughness: 0.7,
    metalness: 0.4,
  });

  // Group shops by wall and lay out each row in order.
  for (const wallKey of Object.keys(WALLS)) {
    const wall = WALLS[wallKey];
    const shopsOnWall = SHOPS.filter((s) => s.wall === wallKey);
    // Center the row on the wall, evenly spaced.
    const rowLength = shopsOnWall.length * SLOT_WIDTH;
    const start = -rowLength / 2 + SLOT_WIDTH / 2;

    shopsOnWall.forEach((shop, i) => {
      const along = start + i * SLOT_WIDTH;
      const x = wall.axis === 'x' ? along : wall.fixed;
      const z = wall.axis === 'z' ? along : wall.fixed;

      const store = createShop(shop, { frameMat, interiorMat, shutterMat });
      store.position.set(x, SLOT_Y, z);
      store.rotation.y = wall.faceY;
      storefronts.add(store);
    });
  }

    // Second-floor shops: same layout math, just offset to the mezzanine Y.
  for (const wallKey of Object.keys(WALLS)) {
    const wall = WALLS[wallKey];
    const shopsOnWall = SHOPS_FLOOR2.filter((s) => s.wall === wallKey);
    if (shopsOnWall.length === 0) continue;

    const rowLength = shopsOnWall.length * SLOT_WIDTH;
    const start = -rowLength / 2 + SLOT_WIDTH / 2;

    shopsOnWall.forEach((shop, i) => {
      const along = start + i * SLOT_WIDTH;
      const x = wall.axis === 'x' ? along : wall.fixed;
      const z = wall.axis === 'z' ? along : wall.fixed;

      const store = createShop(shop, { frameMat, interiorMat, shutterMat });
      store.position.set(x, SLOT_Y_FLOOR2, z);
      store.rotation.y = wall.faceY;
      storefronts.add(store);
    });
  }
  
  return { group: storefronts };
}

// ---------------------------------------------------------------------------
// One storefront slot. Returns a Group positioned at the slot's local origin,
// facing +Z in its own local space. The caller rotates/positions the group.
// ---------------------------------------------------------------------------
function createShop(shop, mats) {
  const store = new THREE.Group();

  // Frame: four thin boxes around the opening so the interior looks recessed.
  const halfW = SLOT_WIDTH / 2;
  const halfH = SLOT_HEIGHT / 2;

  const sideGeo = new THREE.BoxGeometry(0.08, SLOT_HEIGHT, FRAME_DEPTH);
  const topGeo = new THREE.BoxGeometry(SLOT_WIDTH + 0.08, 0.08, FRAME_DEPTH);

  const left = new THREE.Mesh(sideGeo, mats.frameMat);
  left.position.set(-halfW, 0, 0);
  store.add(left);

  const right = new THREE.Mesh(sideGeo, mats.frameMat);
  right.position.set(halfW, 0, 0);
  store.add(right);

  const top = new THREE.Mesh(topGeo, mats.frameMat);
  top.position.set(0, halfH, 0);
  store.add(top);

  const bottom = new THREE.Mesh(topGeo, mats.frameMat);
  bottom.position.set(0, -halfH, 0);
  store.add(bottom);

  // Interior: dark plane behind the frame. Slightly inset so the frame reads
  // as a frame rather than a sticker.
  const interior = new THREE.Mesh(
    new THREE.PlaneGeometry(SLOT_WIDTH - 0.08, SLOT_HEIGHT - 0.08),
    mats.interiorMat
  );
  interior.position.set(0, 0, -0.02);
  store.add(interior);

  // Shuttered variant: corrugated gate mesh in front of the interior.
  if (shop.shuttered) {
    const gate = new THREE.Mesh(
      new THREE.PlaneGeometry(SLOT_WIDTH - 0.12, SLOT_HEIGHT - 0.12),
      mats.shutterMat
    );
    gate.position.set(0, 0, 0.02);
    store.add(gate);

    // Thin dark lines to suggest corrugation without a texture.
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x4b5563 });
    const lineGeo = new THREE.PlaneGeometry(SLOT_WIDTH - 0.14, 0.02);
    for (let y = -halfH + 0.15; y < halfH; y += 0.18) {
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.set(0, y, 0.03);
      store.add(line);
    }
  }

  // Sign: a colored box above the opening, with procedural text on a canvas
  // texture so each shop reads as a real store name.
  const signMesh = createSignMesh(shop.name, shop.color, SLOT_WIDTH - 0.12, 0.26);
  signMesh.position.set(0, halfH + 0.2, 0.04);
  store.add(signMesh);

  return store;
}

// ---------------------------------------------------------------------------
// Procedural sign: a colored backing with the shop name drawn on top.
// Returns a single Mesh so callers can position it like any other object.
// ---------------------------------------------------------------------------
function createSignMesh(text, color, width, height) {
  const pxW = 512;
  const pxH = Math.round((pxW * height) / width);
  const canvas = document.createElement('canvas');
  canvas.width = pxW;
  canvas.height = pxH;
  const ctx = canvas.getContext('2d');

  // Backing
  ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
  ctx.fillRect(0, 0, pxW, pxH);

  // Subtle inner border so the sign reads as a sign, not a colored strip.
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, pxW - 6, pxH - 6);

  // Text. Font size scaled to height so longer names shrink to fit.
  const fontSize = Math.min(pxH * 0.55, (pxW / Math.max(text.length, 1)) * 1.3);
  ctx.fillStyle = 'rgba(30, 30, 46, 0.92)';
  ctx.font = `700 ${fontSize}px "Helvetica Neue", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, pxW / 2, pxH / 2 + fontSize * 0.02);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

  const geo = new THREE.PlaneGeometry(width, height);
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
  return new THREE.Mesh(geo, mat);
}