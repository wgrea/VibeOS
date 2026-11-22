import * as THREE from 'three';

export function createForeignGrocery() {
  const group = new THREE.Group();

  // =========================================================================
  // PROCEDURAL INTERNATIONAL GROCERY TILE TEXTURES
  // =========================================================================
  // 1. Floor Tile Texture: Blend of European Terracotta/Cream Checkerboard
  //    & Latin American / Mediterranean Geometric Corner Rosettes
  function createGlobalFloorTileTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const size = 128;
    // Quadrant colors: Warm Terracotta (Europe/LatAm) & Cream Stone
    const colors = ['#c2410c', '#fef3c7', '#fef3c7', '#b45309'];
    const coords = [,
      [size, 0],
      [0, size],
      [size, size],
    ];

    coords.forEach(([x, y], idx) => {
      ctx.fillStyle = colors[idx];
      ctx.fillRect(x, y, size, size);

      // Subtle ceramic speckle & grout border
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 4;
      ctx.strokeRect(x + 2, y + 2, size - 4, size - 4);

      // Talavera / Zellij cobalt & teal diamond inlay on cream tiles
      if (idx === 1 || idx === 2) {
        const cx = x + size / 2;
        const cy = y + size / 2;
        ctx.fillStyle = '#0369a1';
        ctx.beginPath();
        ctx.moveTo(cx, cy - 26);
        ctx.lineTo(cx + 26, cy);
        ctx.lineTo(cx, cy + 26);
        ctx.lineTo(cx - 26, cy);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(cx, cy, 9, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(5, 3);
    return tex;
  }

  // 2. Wall Wainscot Tile Texture: European Glossy Metro Subway Tiles
  //    topped with a Pan-Global Mosaic Border (MENA Zellij, LatAm Talavera, Asian Red/Gold)
  function createGlobalWallTileTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Glossy off-white European / Asian supermarket subway tile field
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 512, 256);

    const rows = 6;
    const cols = 8;
    const tileW = 512 / cols;
    const tileH = 192 / rows;

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    for (let r = 0; r < rows; r++) {
      const offset = (r % 2) * (tileW / 2);
      for (let c = -1; c <= cols; c++) {
        ctx.strokeRect(c * tileW + offset, 64 + r * tileH, tileW, tileH);
      }
    }

    // Top Decorative Cultural Mosaic Band (64px tall)
    const bandCols = 8;
    const bw = 512 / bandCols;
    const bandPalette = ['#0d9488', '#dc2626', '#1d4ed8', '#eab308']; // MENA teal, Asia red, LatAm cobalt, Africa/Global gold

    for (let i = 0; i < bandCols; i++) {
      const bx = i * bw;
      ctx.fillStyle = bandPalette[i % bandPalette.length];
      ctx.fillRect(bx, 0, bw, 64);

      // 8-point Zellij / Moroccan-Iberian star motif inside each mosaic tile
      const cx = bx + bw / 2;
      const cy = 32;
      ctx.fillStyle = '#fef9c3';
      ctx.fillRect(cx - 14, cy - 14, 28, 28);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = '#fef9c3';
      ctx.fillRect(-14, -14, 28, 28);
      ctx.restore();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx + 1, 1, bw - 2, 62);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.repeat.set(2, 1);
    return tex;
  }

  // Procedural Canvas Textures for Multilingual Labels & Signage
  function createLabelTexture(bgHex, stripeHex, accentHex, symbolText) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, 128, 128);

    ctx.fillStyle = stripeHex;
    ctx.fillRect(0, 0, 128, 26);
    ctx.fillRect(0, 102, 128, 26);

    ctx.fillStyle = accentHex;
    ctx.beginPath();
    ctx.arc(64, 64, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbolText, 64, 65);

    return new THREE.CanvasTexture(canvas);
  }

  function createBannerTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fef08a';
    ctx.fillRect(0, 0, 256, 64);

    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 250, 58);

    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★ IMPORT MARKET ★', 128, 33);

    return new THREE.CanvasTexture(canvas);
  }

  // Materials (including Glossy Ceramic Global Floor & Wall Tiles)
  const floorTileMat = new THREE.MeshPhysicalMaterial({
    map: createGlobalFloorTileTexture(),
    roughness: 0.24,
    clearcoat: 0.65,
    clearcoatRoughness: 0.2,
  });

  const wallTileMat = new THREE.MeshPhysicalMaterial({
    map: createGlobalWallTileTexture(),
    roughness: 0.18,
    clearcoat: 0.8,
    clearcoatRoughness: 0.15,
  });

  const shelfSteelMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.65,
    roughness: 0.35,
  });

  const woodCrateMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    roughness: 0.75,
  });

  const coolerFrameMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.28,
    metalness: 0.2,
  });

  const glassDoorMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe,
    transparent: true,
    opacity: 0.32,
    roughness: 0.1,
    clearcoat: 1.0,
  });

  const coolerGlowMat = new THREE.MeshBasicMaterial({ color: 0xf0f9ff });

  const snackRedMat = new THREE.MeshStandardMaterial({
    map: createLabelTexture('#ef4444', '#facc15', '#ffffff', '辛'),
    roughness: 0.35,
  });

  const biscuitPinkMat = new THREE.MeshStandardMaterial({
    map: createLabelTexture('#f472b6', '#be185d', '#fef9c3', '苺'),
    roughness: 0.35,
  });

  const teaGreenMat = new THREE.MeshStandardMaterial({
    map: createLabelTexture('#16a34a', '#fef08a', '#dcfce7', '茶'),
    roughness: 0.3,
  });

  const curryGoldMat = new THREE.MeshStandardMaterial({
    map: createLabelTexture('#eab308', '#991b1b', '#fef3c7', 'カレー'),
    roughness: 0.4,
  });

  const oliveOilMat = new THREE.MeshPhysicalMaterial({
    color: 0x4d7c0f,
    roughness: 0.18,
    clearcoat: 0.85,
  });

  const sodaCanCyanMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    metalness: 0.55,
    roughness: 0.25,
  });

  const sodaCanOrangeMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    metalness: 0.55,
    roughness: 0.25,
  });

  const yuzuMat = new THREE.MeshPhysicalMaterial({
    color: 0xfacc15,
    roughness: 0.28,
    clearcoat: 0.6,
  });

  const dragonfruitMat = new THREE.MeshStandardMaterial({
    color: 0xdb2777,
    roughness: 0.45,
  });

  const lanternMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    emissive: 0xef4444,
    emissiveIntensity: 0.45,
    roughness: 0.4,
  });

  const priceTagMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

  // Bright Overhead Fluorescent Market Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  const fluorescentLight = new THREE.DirectionalLight(0xfefce8, 1.25);
  fluorescentLight.position.set(1.5, 4.5, 3);
  const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.6);
  fillLight.position.set(-3, 2, 2);
  group.add(ambientLight, fluorescentLight, fillLight);

  // =========================================================================
  // 1. ANCHORED / STATIC AISLE: Tiled Floor & Wall, Shelves, Cooler & Produce
  // =========================================================================
  const storeAisle = new THREE.Group();

  // Glossy International Ceramic Floor (Terracotta/Cream Quarry + Talavera Diamond Inlays)
  const floor = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.1, 1.6), floorTileMat);
  floor.position.set(0, -0.78, 0);
  storeAisle.add(floor);

  // Tiled Back Wainscot Wall (European Metro Subway Tiles + MENA/LatAm/Asian Mosaic Border)
  const backTileWall = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.15, 0.08), wallTileMat);
  backTileWall.position.set(0, -0.16, -0.76);
  storeAisle.add(backTileWall);

  // --- LEFT / CENTER: Multi-Tier Import Grocery Gondola Shelf ---
  const gondola = new THREE.Group();
  gondola.position.set(-0.32, -0.1, -0.18);

  const backPanel = new THREE.Mesh(new THREE.BoxGeometry(1.38, 1.26, 0.05), shelfSteelMat);
  backPanel.position.set(0, 0, -0.22);
  gondola.add(backPanel);

  const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(1.34, 0.2, 0.06),
    new THREE.MeshBasicMaterial({ map: createBannerTexture() })
  );
  signBoard.position.set(0, 0.72, -0.2);
  gondola.add(signBoard);

  const shelfYPositions = [-0.55, -0.12, 0.32];
  shelfYPositions.forEach((y) => {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.04, 0.46), shelfSteelMat);
    plank.position.set(0, y, 0);

    const priceStrip = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.032, 0.01), priceTagMat);
    priceStrip.position.set(0, y, 0.235);

    gondola.add(plank, priceStrip);
  });

  // Top Shelf: Matcha Tea Tins & Imported Olive Oil Bottles
  for (let i = 0; i < 3; i++) {
const teaTin = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.24, 16), teaGreenMat);
teaTin.position.set(-0.46 + i * 0.2, 0.46, 0.04);
gondola.add(teaTin);
}
for (let i = 0; i < 3; i++) {
const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.26, 12), oliveOilMat);
bottle.position.set(0.18 + i * 0.18, 0.47, 0.04);
const cap = new THREE.Mesh(
new THREE.CylinderGeometry(0.025, 0.025, 0.05, 10),
new THREE.MeshStandardMaterial({ color: 0xfacc15 })
);
cap.position.y = 0.15;
bottle.add(cap);
gondola.add(bottle);
}
// Middle Shelf: Instant Ramen Cups & Strawberry Biscuit Packs
for (let i = 0; i < 3; i++) {
const ramenCup = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.072, 0.19, 16), snackRedMat);
ramenCup.position.set(-0.46 + i * 0.22, 0.0, 0.05);
gondola.add(ramenCup);
}
for (let i = 0; i < 3; i++) {
const biscuitBox = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.24, 0.08), biscuitPinkMat);
biscuitBox.position.set(0.2 + i * 0.18, 0.02, 0.05);
gondola.add(biscuitBox);
}
// Bottom Shelf: Curry Spice Boxes & Bulk Rice Bag
for (let i = 0; i < 3; i++) {
const curryBox = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.12), curryGoldMat);
curryBox.position.set(-0.42 + i * 0.25, -0.45, 0.06);
gondola.add(curryBox);
}
const riceBag = new THREE.Mesh(
new THREE.BoxGeometry(0.36, 0.26, 0.24),
new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.6 })
);
riceBag.position.set(0.38, -0.4, 0.04);
gondola.add(riceBag);
storeAisle.add(gondola);
// --- RIGHT SIDE: Chilled Import Beverage Cooler ---
const cooler = new THREE.Group();
cooler.position.set(0.76, -0.08, -0.08);
const coolerBody = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.3, 0.52), coolerFrameMat);
const coolerInterior = new THREE.Mesh(new THREE.BoxGeometry(0.52, 1.08, 0.04), coolerGlowMat);
coolerInterior.position.set(0, 0.02, 0.245);
const coolerGlass = new THREE.Mesh(new THREE.BoxGeometry(0.54, 1.1, 0.02), glassDoorMat);
coolerGlass.position.set(0, 0.02, 0.27);
cooler.add(coolerBody, coolerInterior, coolerGlass);
const coolerRows = [-0.36, -0.08, 0.2, 0.44];
coolerRows.forEach((ry, rIdx) => {
for (let c = 0; c < 4; c++) {
const canMat = (rIdx + c) % 2 === 0 ? sodaCanCyanMat : sodaCanOrangeMat;
const can = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.14, 12), canMat);
can.position.set(-0.17 + c * 0.115, ry, 0.255);
cooler.add(can);
}
});
storeAisle.add(cooler);
// --- FOREGROUND LEFT: Angled Wooden Produce Crate ---
const crateGroup = new THREE.Group();
crateGroup.position.set(-0.86, -0.56, 0.36);
crateGroup.rotation.set(0.22, 0.32, 0);
const crateBox = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.18, 0.46), woodCrateMat);
crateGroup.add(crateBox);
for (let i = 0; i < 6; i++) {
const isYuzu = i % 2 === 0;
const fruit = new THREE.Mesh(
new THREE.SphereGeometry(0.085, 14, 14),
isYuzu ? yuzuMat : dragonfruitMat
);
fruit.scale.set(1, isYuzu ? 0.92 : 1.18, 1);
fruit.position.set(-0.2 + (i % 3) * 0.2, 0.11, i < 3 ? -0.09 : 0.1);
crateGroup.add(fruit);
}
storeAisle.add(crateGroup);
// --- FOREGROUND RIGHT: Handheld Plastic Shopping Basket ---
const basketGroup = new THREE.Group();
basketGroup.position.set(0.22, -0.64, 0.42);
basketGroup.rotation.y = -0.25;
const basketBody = new THREE.Mesh(
new THREE.BoxGeometry(0.42, 0.18, 0.3),
new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 })
);
const basketItem1 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, 0.08), biscuitPinkMat);
basketItem1.position.set(-0.08, 0.12, 0);
basketItem1.rotation.z = 0.18;
const basketItem2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.2, 12), teaGreenMat);
basketItem2.position.set(0.09, 0.11, 0.02);
basketItem2.rotation.z = -0.15;
basketGroup.add(basketBody, basketItem1, basketItem2);
storeAisle.add(basketGroup);
group.add(storeAisle);
// =========================================================================
// 2. MOVING ELEMENTS: Hanging Market Paper Lanterns Swaying Gently
// =========================================================================
const lanternLeft = new THREE.Group();
lanternLeft.position.set(-1.12, 0.72, 0.25);
const cordL = new THREE.Mesh(
new THREE.CylinderGeometry(0.008, 0.008, 0.22, 6),
shelfSteelMat
);
cordL.position.y = -0.11;
const bulbL = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), lanternMat);
bulbL.scale.set(0.9, 1.25, 0.9);
bulbL.position.y = -0.32;
lanternLeft.add(cordL, bulbL);
const lanternRight = lanternLeft.clone();
lanternRight.position.set(1.16, 0.72, 0.28);
group.add(lanternLeft, lanternRight);
return {
group,
description:
'International grocery store aisle featuring regional ceramic tilework—European terracotta quarry floors and metro subway walls, Latin American Talavera diamond inlays, MENA 8-point Zellij mosaic borders, and East Asian market shelves.',
background: 'radial-gradient(circle at 50% 25%, #fef9c3 0%, #bbf7d0 48%, #0284c7 100%)',
update(t, bounce, spring) {
lanternLeft.rotation.z = Math.sin(t * 1.4) * 0.08;
lanternRight.rotation.z = Math.sin(t * 1.4 + 1.1) * 0.08;
coolerGlowMat.color.setHex(Math.sin(t * 18) > -0.92 ? 0xf0f9ff : 0xe0f2fe);
group.scale.setScalar(1 + spring * 0.25);
},
};
}