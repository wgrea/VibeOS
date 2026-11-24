import * as THREE from 'three';

export function createFoodCourt() {
  const foodCourt = new THREE.Group();

  // ---------- Shared materials ----------
  const counterMat = new THREE.MeshStandardMaterial({
    color: 0xfce7f3,
    roughness: 0.3,
  });
  const counterTopMat = new THREE.MeshStandardMaterial({
    color: 0xfdf2f8,
    roughness: 0.15,
    metalness: 0.1,
  });

  // ---------- 90s Taco Bell stall ----------
  // The centerpiece. 90s Taco Bell is the "Miami Vice" era: teal, pink,
  // purple, and yellow, with geometric Memphis-style accents and striped
  // booth seating [citation:9][citation:12].
  const tacoBell = createTacoBellStall(counterMat, counterTopMat);
  tacoBell.position.set(-6.2, 0, -2.2);
  tacoBell.rotation.y = Math.PI / 2;
  foodCourt.add(tacoBell);

  // ---------- Generic food court stall ----------
  // A plain second counter so the Taco Bell has something to contrast with.
  const generic = createGenericStall(counterMat, counterTopMat);
  generic.position.set(-6.2, 0, -4.2);
  generic.rotation.y = Math.PI / 2;
  foodCourt.add(generic);

  // ---------- Seating ----------
  // Striped booth benches and small round tables. The booths use the
  // Taco Bell palette so the seating reads as part of the same "zone".
  const boothPositions = [
    { x: -3.8, z: -1.6, ry: 0 },
    { x: -3.8, z: -3.0, ry: 0 },
    { x: -2.6, z: -1.6, ry: Math.PI },
    { x: -2.6, z: -3.0, ry: Math.PI },
  ];
  boothPositions.forEach(({ x, z, ry }) => {
    const booth = createBoothBench();
    booth.position.set(x, -1.0, z);
    booth.rotation.y = ry;
    foodCourt.add(booth);
  });

  // Two small tables between the booths
  for (let i = 0; i < 2; i++) {
    const table = createTable();
    table.position.set(-3.2, -1.0, -2.0 - i * 1.0);
    foodCourt.add(table);
  }

  return { group: foodCourt };
}

// ---------------------------------------------------------------------------
// 90s Taco Bell stall.
// ---------------------------------------------------------------------------
function createTacoBellStall(counterMat, counterTopMat) {
  const stall = new THREE.Group();

  // ---------- Counter ----------
  const counter = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.9, 0.8),
    counterMat
  );
  counter.position.y = -0.75;
  stall.add(counter);

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(1.65, 0.06, 0.85),
    counterTopMat
  );
  top.position.y = -0.28;
  stall.add(top);

  // ---------- Back wall: teal with purple stripe ----------
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.4, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x2dd4bf, roughness: 0.6 })
  );
  backWall.position.set(0, 0.4, -0.36);
  stall.add(backWall);

  // Purple horizontal band across the back wall
  const purpleBand = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.18, 0.08),
    new THREE.MeshBasicMaterial({ color: 0x7c3aed })
  );
  purpleBand.position.set(0, 0.2, -0.33);
  stall.add(purpleBand);

  // ---------- Memphis-style geometric accents ----------
  // Triangles and squiggles in pink and yellow. These are the signature
  // 90s Taco Bell graphic language [citation:9].
  const accentColors = [0xf472b6, 0xfbbf24, 0x7c3aed];

  // Triangle on the left of the back wall
  const triGeo = new THREE.ConeGeometry(0.16, 0.28, 3);
  const tri1 = new THREE.Mesh(
    triGeo,
    new THREE.MeshBasicMaterial({ color: accentColors[0] })
  );
  tri1.position.set(-0.55, 0.65, -0.3);
  tri1.rotation.z = Math.PI;
  stall.add(tri1);

  // Second triangle, flipped
  const tri2 = new THREE.Mesh(
    triGeo,
    new THREE.MeshBasicMaterial({ color: accentColors[1] })
  );
  tri2.position.set(0.55, 0.65, -0.3);
  stall.add(tri2);

  // Zigzag squiggle made from thin boxes
  const zigMat = new THREE.MeshBasicMaterial({ color: accentColors[2] });
  for (let i = 0; i < 3; i++) {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.18, 0.04),
      zigMat
    );
    bar.position.set(-0.18 + i * 0.18, 0.75 + (i % 2) * 0.08, -0.3);
    bar.rotation.z = (i % 2 === 0 ? 1 : -1) * 0.6;
    stall.add(bar);
  }

  // ---------- Sign: "TACO BELL" in the 90s style ----------
  // Pink/purple logo block with white text, plus a small bell shape.
  const signTex = makeTacoBellSignTexture();
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 0.3),
    new THREE.MeshBasicMaterial({ map: signTex, transparent: true })
  );
  sign.position.set(0, 0.95, -0.3);
  stall.add(sign);

  // ---------- Menu board ----------
  // Era-appropriate: the 59/79/99 cent value menu was introduced in 1990
  // and is a recognizable 90s Taco Bell detail [citation:14].
  const menuTex = makeTacoBellMenuTexture();
  const menu = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 0.5),
    new THREE.MeshBasicMaterial({ map: menuTex })
  );
  menu.position.set(0, 0.35, -0.28);
  stall.add(menu);

  // ---------- Counter-top details ----------
  // A small register and a stack of cups.
  const register = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.12, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.4 })
  );
  register.position.set(0.45, -0.19, 0.1);
  stall.add(register);

  const cupStack = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.05, 0.18, 8),
    new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.5 })
  );
  cupStack.position.set(-0.4, -0.16, 0.1);
  stall.add(cupStack);

  return stall;
}

// ---------------------------------------------------------------------------
// Generic stall.
// ---------------------------------------------------------------------------
function createGenericStall(counterMat, counterTopMat) {
  const stall = new THREE.Group();

  const counter = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.9, 0.8),
    counterMat
  );
  counter.position.y = -0.75;
  stall.add(counter);

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(1.45, 0.06, 0.85),
    counterTopMat
  );
  top.position.y = -0.28;
  stall.add(top);

  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.22, 0.05),
    new THREE.MeshBasicMaterial({ color: 0xfb923c })
  );
  sign.position.set(0, 0.3, -0.3);
  stall.add(sign);

  const menu = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.4, 0.03),
    new THREE.MeshBasicMaterial({ color: 0x1e1e2e })
  );
  menu.position.set(0, 0.0, -0.28);
  stall.add(menu);

  return stall;
}

// ---------------------------------------------------------------------------
// Booth bench with striped upholstery.
// ---------------------------------------------------------------------------
function createBoothBench() {
  const bench = new THREE.Group();

  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.12, 0.45),
    new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.6 })
  );
  seat.position.y = 0.45;
  bench.add(seat);

  // Stripes on the seat back
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.5, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x2dd4bf, roughness: 0.6 })
  );
  back.position.set(0, 0.7, -0.2);
  bench.add(back);

  // Pink stripe across the back
  const stripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.08, 0.12),
    new THREE.MeshBasicMaterial({ color: 0xf472b6 })
  );
  stripe.position.set(0, 0.7, -0.19);
  bench.add(stripe);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 6);
  const legMat = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.5 });
  for (const x of [-0.35, 0.35]) {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x, 0.2, 0);
    bench.add(leg);
  }

  return bench;
}

// ---------------------------------------------------------------------------
// Small round table.
// ---------------------------------------------------------------------------
function createTable() {
  const table = new THREE.Group();

  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.04, 12),
    new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.2 })
  );
  top.position.y = 0.5;
  table.add(top);

  const leg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.5, 6),
    new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.4 })
  );
  leg.position.y = 0.25;
  table.add(leg);

  return table;
}

// ---------------------------------------------------------------------------
// Canvas textures.
// ---------------------------------------------------------------------------

function makeTacoBellSignTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Pink/purple backing (the 90s logo era used pink/purple) 
  ctx.fillStyle = '#7c3aed';
  ctx.fillRect(0, 0, 512, 128);
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(4, 4, 504, 120);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 72px "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TACO BELL', 256, 64);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeTacoBellMenuTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 284;
  const ctx = canvas.getContext('2d');

  // Dark menu board
  ctx.fillStyle = '#1e1e2e';
  ctx.fillRect(0, 0, 512, 284);

  // Header
  ctx.fillStyle = '#2dd4bf';
  ctx.font = '700 28px "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('VALUE MENU', 256, 12);

  // Three price columns, matching the 59/79/99 cent structure from 1990
  // [citation:14]
  const columns = [
    { x: 90, price: '59¢', items: ['TACO', 'BURRITO', 'NACHOS'] },
    { x: 256, price: '79¢', items: ['BEAN BURRITO', 'TOSTADA', 'CHALUPA'] },
    { x: 422, price: '99¢', items: ['COMBO', 'GORDITA', 'MEXICAN PIZZA'] },
  ];

  columns.forEach(({ x, price, items }) => {
    ctx.fillStyle = '#fbbf24';
    ctx.font = '700 36px "Helvetica Neue", Arial, sans-serif';
    ctx.fillText(price, x, 48);

    ctx.fillStyle = '#e5e7eb';
    ctx.font = '500 16px "Helvetica Neue", Arial, sans-serif';
    items.forEach((item, i) => {
      ctx.fillText(item, x, 100 + i * 30);
    });
  });

  // Footer
  ctx.fillStyle = '#f472b6';
  ctx.font = '700 16px "Helvetica Neue", Arial, sans-serif';
  ctx.fillText('RUN FOR THE BORDER', 256, 248);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}