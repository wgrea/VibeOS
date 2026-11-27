// js/aesthetics/academia/light.js
import * as THREE from 'three';

function createOakTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#c8a97e';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 64; i++) {
    ctx.fillStyle = i % 2 === 0 ? 'rgba(145, 108, 62, 0.22)' : 'rgba(232, 206, 168, 0.22)';
    ctx.fillRect(0, i * 4 + Math.sin(i * 0.7) * 2, 256, 2.5);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 1.5);
  return tex;
}

function createScriptPageTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fbf5e6';
  ctx.fillRect(0, 0, 256, 320);

  ctx.strokeStyle = 'rgba(180, 142, 105, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(18, 20, 220, 280);

  ctx.fillStyle = 'rgba(87, 68, 52, 0.55)';
  for (let y = 44; y < 276; y += 15) {
    const w = y > 180 && y < 245 ? 110 : 165 + ((y * 13) % 32);
    ctx.fillRect(30, y, w, 2.5);
  }
  // Tiny botanical margin sketch
  ctx.strokeStyle = 'rgba(101, 128, 92, 0.65)';
  ctx.beginPath();
  ctx.ellipse(196, 215, 14, 24, 0.35, 0, Math.PI * 2);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createCurvedPageGeometry(w, h) {
  const geo = new THREE.PlaneGeometry(w, h, 8, 4);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, Math.sin((x / w) * Math.PI) * 0.06 + Math.cos((y / h) * Math.PI) * 0.025);
  }
  geo.computeVertexNormals();
  return geo;
}

export function createLightAcademia({ camera, domElement, box } = {}) {
  const group = new THREE.Group();
  const disposables = [];
  const track = (x) => (disposables.push(x), x);

  // Warm morning window sunlight
  group.add(new THREE.AmbientLight(0xfffaf0, 0.78));
  group.add(new THREE.HemisphereLight(0xfffbeb, 0xd6c7b2, 0.85));
  const sun = new THREE.DirectionalLight(0xfff3d6, 1.55);
  sun.position.set(4.5, 7.5, 4);
  group.add(sun);

  // 1. Sunlit Honey-Oak Study Desk
  const oakTex = track(createOakTexture());
  const deskMat = track(new THREE.MeshStandardMaterial({ map: oakTex, roughness: 0.62 }));
  const desk = new THREE.Mesh(track(new THREE.BoxGeometry(4.8, 0.14, 2.6)), deskMat);
  desk.position.set(0, 0.78, -0.2);
  group.add(desk);
  const deskTopY = 0.85;

  // 2. Stack of Cream, Sage & Linen Books (Back Left)
  const pageMat = track(new THREE.MeshStandardMaterial({ color: 0xfbf5e6, roughness: 0.88 }));
  const stackSpecs = [
    { w: 1.18, h: 0.18, d: 0.86, color: 0xe6dcc8, ry: 0.08 },
    { w: 1.06, h: 0.16, d: 0.78, color: 0x9ca986, ry: -0.14 },
    { w: 0.96, h: 0.15, d: 0.72, color: 0xd4a373, ry: 0.06 },
  ];
  let stackY = deskTopY;
  stackSpecs.forEach(({ w, h, d, color, ry }) => {
    const book = new THREE.Group();
    const cover = new THREE.Mesh(
      track(new THREE.BoxGeometry(w, h, d)),
      track(new THREE.MeshStandardMaterial({ color, roughness: 0.8 }))
    );
    const block = new THREE.Mesh(track(new THREE.BoxGeometry(w * 0.94, h * 0.78, d * 0.93)), pageMat);
    block.position.x = 0.025;
    book.add(cover, block);
    book.position.set(-1.35, stackY + h / 2, -0.5);
    book.rotation.y = ry;
    stackY += h;
    group.add(book);
  });

  // 3. Open Poetry Book & Brass Fountain Pen (Center)
  const scriptTex = track(createScriptPageTexture());
  const scriptMat = track(new THREE.MeshStandardMaterial({ map: scriptTex, roughness: 0.85, side: THREE.DoubleSide }));
  const openBook = new THREE.Group();
  openBook.position.set(-0.05, deskTopY + 0.02, 0.22);
  openBook.rotation.y = 0.12;

  const coverBoard = new THREE.Mesh(
    track(new THREE.BoxGeometry(1.16, 0.03, 0.82)),
    track(new THREE.MeshStandardMaterial({ color: 0x8d6e53, roughness: 0.75 }))
  );
  const openPageGeo = track(createCurvedPageGeometry(0.54, 0.76));
  const leftPage = new THREE.Mesh(openPageGeo, scriptMat);
  leftPage.rotation.set(-Math.PI / 2, 0.12, 0);
  leftPage.position.set(-0.27, 0.03, 0);
  const rightPage = new THREE.Mesh(openPageGeo, scriptMat);
  rightPage.rotation.set(-Math.PI / 2, -0.12, 0);
  rightPage.position.set(0.27, 0.03, 0);
  openBook.add(coverBoard, leftPage, rightPage);

  const brassMat = track(new THREE.MeshStandardMaterial({ color: 0xc99a2e, metalness: 0.85, roughness: 0.25 }));
  const pen = new THREE.Mesh(track(new THREE.CylinderGeometry(0.016, 0.01, 0.56, 10)), brassMat);
  pen.rotation.set(Math.PI / 2, 0, -0.45);
  pen.position.set(0.75, deskTopY + 0.018, 0.45);
  group.add(openBook, pen);

  // 4. Porcelain Teacup & Saucer with Rising Steam (Right)
  const chinaMat = track(new THREE.MeshPhysicalMaterial({ color: 0xfdfbf7, roughness: 0.16, clearcoat: 0.85 }));
  const teaGroup = new THREE.Group();
  teaGroup.position.set(1.38, deskTopY, 0.22);

  const saucer = new THREE.Mesh(track(new THREE.CylinderGeometry(0.28, 0.18, 0.035, 24)), chinaMat);
  saucer.position.y = 0.018;
  const cupPts = [
    new THREE.Vector2(0.09, 0.03),
    new THREE.Vector2(0.14, 0.08),
    new THREE.Vector2(0.18, 0.24),
    new THREE.Vector2(0.165, 0.24),
    new THREE.Vector2(0.12, 0.06),
  ];
  const cup = new THREE.Mesh(track(new THREE.LatheGeometry(cupPts, 24)), chinaMat);
  const handle = new THREE.Mesh(track(new THREE.TorusGeometry(0.065, 0.014, 10, 18, Math.PI)), chinaMat);
  handle.position.set(0.16, 0.15, 0);
  handle.rotation.z = -Math.PI / 2;
  const teaLiquid = new THREE.Mesh(
    track(new THREE.CircleGeometry(0.155, 20)),
    track(new THREE.MeshPhysicalMaterial({ color: 0xb45309, roughness: 0.08, clearcoat: 1.0 }))
  );
  teaLiquid.rotation.x = -Math.PI / 2;
  teaLiquid.position.y = 0.21;
  teaGroup.add(saucer, cup, handle, teaLiquid);
  group.add(teaGroup);

  const steamGeo = track(new THREE.SphereGeometry(0.038, 10, 10));
  const steamMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 }));
  const steamPuffs = Array.from({ length: 4 }, (_, i) => {
    const s = new THREE.Mesh(steamGeo, steamMat);
    s.position.set(1.38 + (i % 2 ? 0.02 : -0.02), deskTopY + 0.3 + i * 0.11, 0.22);
    group.add(s);
    return { mesh: s, phase: i * 1.4 };
  });

  // 5. Ceramic Vase with Sunlit Botanicals (Front Left)
  const vase = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.11, 0.16, 0.34, 20)),
    track(new THREE.MeshStandardMaterial({ color: 0xe7dfd1, roughness: 0.7 }))
  );
  vase.position.set(-1.72, deskTopY + 0.17, 0.38);
  const stemMat = track(new THREE.MeshStandardMaterial({ color: 0x65805c, roughness: 0.7 }));
  const bloomMat = track(new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.5 }));
  [-0.14, 0.04, 0.18].forEach((rz, i) => {
    const sprig = new THREE.Mesh(track(new THREE.CylinderGeometry(0.01, 0.012, 0.42, 8)), stemMat);
    sprig.position.set(-1.72 + i * 0.03 - 0.03, deskTopY + 0.44, 0.38);
    sprig.rotation.z = rz;
    const bloom = new THREE.Mesh(track(new THREE.SphereGeometry(0.042, 10, 10)), bloomMat);
    bloom.position.set(-1.72 + i * 0.03 - 0.03 - Math.sin(rz) * 0.2, deskTopY + 0.64, 0.38);
    group.add(sprig, bloom);
  });
  group.add(vase);

  // 6. Curved Floating Parchment Pages Drifting in the Morning Breeze
  const floatPageGeo = track(createCurvedPageGeometry(0.68, 0.92));
  const pages = Array.from({ length: 9 }, (_, i) => {
    const p = new THREE.Mesh(floatPageGeo, scriptMat);
    const bx = ((i * 1.73) % 4.0) - 2.0;
    const by = 1.6 + ((i * 0.67) % 1.6);
    const bz = ((i * 1.19) % 2.4) - 1.2;
    p.position.set(bx, by, bz);
    p.rotation.set(0.25 + (i % 3) * 0.18, (i * 1.1) % Math.PI, ((i % 5) - 2) * 0.12);
    group.add(p);
    return {
      mesh: p,
      baseY: by,
      baseRx: p.rotation.x,
      baseRz: p.rotation.z,
      speed: 0.55 + (i % 4) * 0.18,
      phase: i * 0.9,
    };
  });

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #fffdf7 0%, #f5efe2 58%, #e2d5be 100%)',
    description:
      'Step into sunlit morning libraries, handwritten poetry, and quiet classical warmth—where curved parchment pages drift above honey-oak desks, linen-bound books, and steaming porcelain tea.',
    update(t) {
      pages.forEach((p) => {
        p.mesh.position.y = p.baseY + Math.sin(t * p.speed + p.phase) * 0.16;
        p.mesh.rotation.x = p.baseRx + Math.sin(t * p.speed * 0.8 + p.phase) * 0.08;
        p.mesh.rotation.z = p.baseRz + Math.cos(t * p.speed * 0.7 + p.phase) * 0.1;
      });

      steamPuffs.forEach((s) => {
        const cycle = ((t * 0.35 + s.phase) % 1);
        s.mesh.position.y = deskTopY + 0.28 + cycle * 0.45;
        s.mesh.position.x = 1.38 + Math.sin(t * 2 + s.phase) * 0.04;
        s.mesh.scale.setScalar(0.65 + cycle * 0.8);
      });
    },
    dispose() {
      disposables.forEach((d) => d.dispose?.());
    },
  };
}