// js/aesthetics/academia/dark.js
import * as THREE from 'three';

function createWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#2d160c';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 65; i++) {
    ctx.fillStyle = i % 2 === 0 ? 'rgba(18, 7, 3, 0.35)' : 'rgba(92, 46, 24, 0.2)';
    ctx.fillRect(0, i * 4 + Math.sin(i) * 2, 256, 2.5);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

function createParchmentTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#dfd0b4';
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = 'rgba(62, 39, 24, 0.55)';
  for (let y = 32; y < 224; y += 16) {
    ctx.fillRect(24, y, 165 + ((y * 17) % 45), 3);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createDarkAcademia({ camera, domElement, box } = {}) {
  const group = new THREE.Group();
  const disposables = [];
  const track = (x) => (disposables.push(x), x);

  // Lighting: warm flickering candlelight + cool moonlit gothic window rim
  group.add(new THREE.AmbientLight(0x5c3d24, 0.85));
  group.add(new THREE.HemisphereLight(0x94a3b8, 0x231209, 0.55));

  const moonRim = new THREE.DirectionalLight(0x93c5fd, 1.15);
  moonRim.position.set(-4, 5, -3);
  group.add(moonRim);

  const candle = new THREE.PointLight(0xffa94d, 5.5, 14, 1.2);
  candle.position.set(1.3, 1.55, 0.25);
  group.add(candle);

  const deskFill = new THREE.PointLight(0xffb86c, 2.2, 10, 1.2);
  deskFill.position.set(-0.4, 2.4, 1.8);
  group.add(deskFill);

  // Shared Materials
  const mahoganyMat = track(new THREE.MeshStandardMaterial({ map: createWoodTexture(), roughness: 0.55, metalness: 0.08 }));
  disposables.push(mahoganyMat.map);
  const brassMat = track(new THREE.MeshStandardMaterial({ color: 0xd4a017, metalness: 0.9, roughness: 0.22 }));
  const pageMat = track(new THREE.MeshStandardMaterial({ color: 0xdfd3bc, roughness: 0.9 }));
  const marbleMat = track(new THREE.MeshStandardMaterial({ color: 0xd6cbb8, roughness: 0.58, metalness: 0.04 }));

  // 1. Mahogany Study Desk Surface
  const desk = new THREE.Mesh(track(new THREE.BoxGeometry(5.2, 0.16, 3.0)), mahoganyMat);
  desk.position.set(-0.2, 0.48, -0.35);
  group.add(desk);
  const deskTopY = 0.56;

  // 2. Antique Leather-Bound Book Stack (with recessed pages & gold spine ribs)
  const stack = new THREE.Group();
  const bookSpecs = [
    { w: 1.58, h: 0.22, d: 1.12, color: 0x451a1a, ry: 0.06 },
    { w: 1.46, h: 0.2, d: 1.04, color: 0x1b3324, ry: -0.14 },
    { w: 1.38, h: 0.19, d: 0.98, color: 0x3b1f10, ry: 0.11 },
    { w: 1.22, h: 0.17, d: 0.88, color: 0x1e293b, ry: -0.07 },
  ];
  let curY = deskTopY;
  bookSpecs.forEach(({ w, h, d, color, ry }) => {
    const book = new THREE.Group();
    const coverMat = track(new THREE.MeshStandardMaterial({ color, roughness: 0.72 }));
    const cover = new THREE.Mesh(track(new THREE.BoxGeometry(w, h, d)), coverMat);
    const pages = new THREE.Mesh(track(new THREE.BoxGeometry(w * 0.94, h * 0.78, d * 0.93)), pageMat);
    pages.position.x = 0.03;

    // Gold-leaf spine ribs along -X spine
    const ribGeo = track(new THREE.BoxGeometry(0.03, h * 0.86, 0.045));
    [-d * 0.28, 0, d * 0.28].forEach((rz) => {
      const rib = new THREE.Mesh(ribGeo, brassMat);
      rib.position.set(-w / 2 - 0.005, 0, rz);
      book.add(rib);
    });

    book.add(cover, pages);
    book.position.y = curY + h / 2;
    book.rotation.y = ry;
    curY += h;
    stack.add(book);
  });
  stack.position.set(0.05, 0, -0.15);
  group.add(stack);

  // Parchment note & inkwell on desk
  const parchmentMat = track(new THREE.MeshStandardMaterial({ map: createParchmentTexture(), roughness: 0.88 }));
  disposables.push(parchmentMat.map);
  const sheet = new THREE.Mesh(track(new THREE.BoxGeometry(0.95, 0.012, 0.7)), parchmentMat);
  sheet.position.set(1.42, deskTopY + 0.008, 0.42);
  sheet.rotation.y = -0.28;
  const inkwell = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.07, 0.09, 0.12, 16)),
    track(new THREE.MeshPhysicalMaterial({ color: 0x0f172a, roughness: 0.1, clearcoat: 1.0 }))
  );
  inkwell.position.set(1.75, deskTopY + 0.06, -0.05);
  group.add(sheet, inkwell);

  // 3. Turned Brass Candlestick & Flickering Wax Candle
  const candleGroup = new THREE.Group();
  candleGroup.position.set(1.3, deskTopY, 0.25);

  const holderPts = [
    new THREE.Vector2(0.2, 0),
    new THREE.Vector2(0.18, 0.04),
    new THREE.Vector2(0.05, 0.14),
    new THREE.Vector2(0.08, 0.24),
    new THREE.Vector2(0.045, 0.34),
    new THREE.Vector2(0.13, 0.4),
    new THREE.Vector2(0.09, 0.42),
  ];
  const holder = new THREE.Mesh(track(new THREE.LatheGeometry(holderPts, 24)), brassMat);
  const wax = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.068, 0.072, 0.42, 18)),
    track(new THREE.MeshStandardMaterial({ color: 0xf5ebd6, roughness: 0.65 }))
  );
  wax.position.y = 0.61;
  const flameMat = track(
    new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xff8c00, emissiveIntensity: 2.2, roughness: 0.2 })
  );
  const flame = new THREE.Mesh(track(new THREE.ConeGeometry(0.032, 0.11, 12)), flameMat);
  flame.position.y = 0.89;
  candleGroup.add(holder, wax, flame);
  group.add(candleGroup);

  // 4. Multi-Ring Brass Armillary Astrolabe on Pedestal
  const astroBase = new THREE.Mesh(track(new THREE.CylinderGeometry(0.28, 0.36, 0.16, 24)), mahoganyMat);
  astroBase.position.set(0, deskTopY + 0.08, -1.0);
  const astroStem = new THREE.Mesh(track(new THREE.CylinderGeometry(0.045, 0.06, 0.95, 16)), brassMat);
  astroStem.position.set(0, deskTopY + 0.62, -1.0);
  group.add(astroBase, astroStem);

  const astroGroup = new THREE.Group();
  astroGroup.position.set(0, 2.35, -1.0);
  const ring1 = new THREE.Mesh(track(new THREE.TorusGeometry(1.12, 0.042, 12, 60)), brassMat);
  const ring2 = new THREE.Mesh(track(new THREE.TorusGeometry(0.92, 0.032, 12, 56)), brassMat);
  ring2.rotation.x = Math.PI / 3;
  const ring3 = new THREE.Mesh(track(new THREE.TorusGeometry(0.7, 0.026, 12, 48)), brassMat);
  ring3.rotation.y = Math.PI / 4;
  const celestialCore = new THREE.Mesh(
    track(new THREE.SphereGeometry(0.22, 24, 18)),
    track(new THREE.MeshStandardMaterial({ color: 0x1e3a5f, metalness: 0.5, roughness: 0.35 }))
  );
  astroGroup.add(ring1, ring2, ring3, celestialCore);
  group.add(astroGroup);

  // 5. Classical Sculpted Marble Bust on Fluted Pedestal
  const bustGroup = new THREE.Group();
  bustGroup.position.set(-1.8, deskTopY, -0.95);
  bustGroup.rotation.y = 0.38;

  const plinth = new THREE.Mesh(track(new THREE.CylinderGeometry(0.32, 0.38, 0.56, 16)), marbleMat);
  plinth.position.y = 0.28;
  const shoulders = new THREE.Mesh(track(new THREE.CylinderGeometry(0.22, 0.44, 0.42, 20)), marbleMat);
  shoulders.scale.z = 0.58;
  shoulders.position.y = 0.75;
  const neck = new THREE.Mesh(track(new THREE.CylinderGeometry(0.11, 0.13, 0.18, 16)), marbleMat);
  neck.position.y = 1.02;
  const head = new THREE.Mesh(track(new THREE.SphereGeometry(0.24, 24, 20)), marbleMat);
  head.scale.set(0.84, 1.12, 0.94);
  head.position.y = 1.26;
  const nose = new THREE.Mesh(track(new THREE.BoxGeometry(0.05, 0.11, 0.08)), marbleMat);
  nose.position.set(0, 1.24, 0.21);
  const curls = new THREE.Mesh(track(new THREE.TorusGeometry(0.21, 0.065, 10, 24, Math.PI * 1.25)), marbleMat);
  curls.position.set(0, 1.33, -0.02);
  curls.rotation.set(0.3, Math.PI / 2, 0);
  bustGroup.add(plinth, shoulders, neck, head, nose, curls);
  group.add(bustGroup);

  // 6. Drifting Candlelit Dust Motes
  const moteGeo = track(new THREE.SphereGeometry(0.018, 6, 6));
  const moteMat = track(new THREE.MeshBasicMaterial({ color: 0xfde68a, transparent: true, opacity: 0.65 }));
  const motes = Array.from({ length: 14 }, (_, i) => {
    const m = new THREE.Mesh(moteGeo, moteMat);
    const bx = ((i * 1.37) % 4.2) - 2.1;
    const by = 0.9 + ((i * 0.73) % 2.1);
    const bz = ((i * 0.91) % 2.2) - 1.2;
    m.position.set(bx, by, bz);
    group.add(m);
    return { mesh: m, bx, by, bz, phase: i * 0.9 };
  });

  return {
    group,
    background: 'radial-gradient(circle at 55% 45%, #24160d 0%, #0e0a06 65%, #050302 100%)',
    description:
      'Step into candlelit study nights and classical scholarship—where mahogany desks, gilt-spined leather tomes, brass armillary astrolabes, and weathered marble busts glow in the quiet stillness.',
    update(t) {
      ring1.rotation.y = t * 0.16;
      ring2.rotation.z = -t * 0.24;
      ring3.rotation.x = t * 0.32;
      celestialCore.rotation.y = -t * 0.2;

      const flicker = 1 + Math.sin(t * 11.3) * 0.08 + Math.sin(t * 19.7) * 0.05;
      candle.intensity = 5.4 * flicker;
      flame.scale.set(1, flicker, 1);
      flame.rotation.z = Math.sin(t * 7.5) * 0.06;

      motes.forEach((m) => {
        m.mesh.position.y = m.by + Math.sin(t * 0.7 + m.phase) * 0.14;
        m.mesh.position.x = m.bx + Math.cos(t * 0.5 + m.phase) * 0.08;
      });
    },
    dispose() {
      disposables.forEach((d) => d.dispose?.());
    },
  };
}