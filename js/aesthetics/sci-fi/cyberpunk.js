// js/aesthetics/sci-fi/cyberpunk.js
import * as THREE from 'three';

export function createCyberpunk({ camera, domElement, box }) {
  const group = new THREE.Group();
  const geometries = [];
  const materials = [];
  const textures = [];

  const trackGeo = (g) => (geometries.push(g), g);
  const trackMat = (m) => (materials.push(m), m);
  const trackTex = (tx) => (textures.push(tx), tx);

  // --- Procedural CanvasTextures ---
  function makeRoadTextures() {
    const cCol = document.createElement('canvas');
    const cRgh = document.createElement('canvas');
    cCol.width = cCol.height = cRgh.width = cRgh.height = 256;
    const ctxC = cCol.getContext('2d');
    const ctxR = cRgh.getContext('2d');

    ctxC.fillStyle = '#0c0d16';
    ctxC.fillRect(0, 0, 256, 256);
    ctxC.fillStyle = 'rgba(255, 196, 40, 0.35)';
    for (let y = 12; y < 256; y += 48) ctxC.fillRect(125, y, 6, 24);

    ctxR.fillStyle = '#8a8a8a';
    ctxR.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 18; i++) {
      const px = (i * 67) % 220 + 18;
      const py = (i * 97) % 220 + 18;
      const r = 16 + (i % 4) * 9;
      const grad = ctxR.createRadialGradient(px, py, 2, px, py, r);
      grad.addColorStop(0, '#0a0a0a');
      grad.addColorStop(1, 'rgba(138,138,138,0)');
      ctxR.fillStyle = grad;
      ctxR.beginPath();
      ctxR.arc(px, py, r, 0, Math.PI * 2);
      ctxR.fill();
    }

    const colTex = trackTex(new THREE.CanvasTexture(cCol));
    colTex.wrapS = colTex.wrapT = THREE.RepeatWrapping;
    colTex.repeat.set(1, 4);
    colTex.colorSpace = THREE.SRGBColorSpace;

    const rghTex = trackTex(new THREE.CanvasTexture(cRgh));
    rghTex.wrapS = rghTex.wrapT = THREE.RepeatWrapping;
    rghTex.repeat.set(2, 4);
    return { colTex, rghTex };
  }

  function makeWindowTex() {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#07080f';
    ctx.fillRect(0, 0, 256, 256);
    const palette = ['#00ffe0', '#ff2266', '#ffb84d', '#66aaff'];
    for (let y = 8; y < 252; y += 14) {
      for (let x = 8; x < 252; x += 16) {
        if (((x * 13 + y * 29) % 11) < 4) {
          ctx.fillStyle = palette[(x + y) % palette.length];
          ctx.fillRect(x, y, 9, 7);
        } else {
          ctx.fillStyle = '#111320';
          ctx.fillRect(x, y, 9, 7);
        }
      }
    }
    const tex = trackTex(new THREE.CanvasTexture(c));
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 4);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function makeHoloTex() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 128;
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'rgba(255, 0, 140, 0.16)';
    ctx.fillRect(0, 0, 256, 128);
    ctx.strokeStyle = '#ff2288';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, 244, 116);
    ctx.fillStyle = '#00ffe0';
    ctx.font = 'bold 26px monospace';
    ctx.fillText('NEON // 2099', 24, 58);
    ctx.fillStyle = '#ff66bb';
    ctx.font = '14px monospace';
    ctx.fillText('SYNTH-LINK ONLINE >>>', 26, 88);
    ctx.fillStyle = 'rgba(0, 255, 224, 0.18)';
    for (let y = 0; y < 128; y += 6) ctx.fillRect(0, y, 256, 2);
    const tex = trackTex(new THREE.CanvasTexture(c));
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const { colTex, rghTex } = makeRoadTextures();
  const winTex = makeWindowTex();
  const holoTex = makeHoloTex();

  // --- Lighting ---
  group.add(new THREE.AmbientLight(0x1f2b4d, 0.55));
  const sign1 = new THREE.PointLight(0xff2266, 3.2, 22);
  sign1.position.set(2.8, 3.4, -1.2);
  const sign2 = new THREE.PointLight(0x00ffe0, 3.0, 22);
  sign2.position.set(-3.2, 2.8, 0.2);
  const skyFill = new THREE.DirectionalLight(0x4466aa, 0.5);
  skyFill.position.set(0, 10, 4);
  group.add(sign1, sign2, skyFill);

  // --- Wet Puddle Street & Curbs ---
  const street = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(24, 24)),
    trackMat(new THREE.MeshPhysicalMaterial({
      map: colTex, roughnessMap: rghTex, color: 0x161824,
      roughness: 0.72, metalness: 0.45, clearcoat: 0.92, clearcoatRoughness: 0.12,
    }))
  );
  street.rotation.x = -Math.PI / 2;
  group.add(street);

  const matCurb = trackMat(new THREE.MeshStandardMaterial({ color: 0x181a24, roughness: 0.6, metalness: 0.2 }));
  const curbGeo = trackGeo(new THREE.BoxGeometry(2.2, 0.16, 24));
  [-4.4, 4.4].forEach((x) => {
    const curb = new THREE.Mesh(curbGeo, matCurb);
    curb.position.set(x, 0.08, 0);
    group.add(curb);
  });

  // --- Stepped Alley Towers & Overpass ---
  const matBuilding = trackMat(new THREE.MeshStandardMaterial({
    color: 0x101320, map: winTex, emissive: 0xffffff, emissiveMap: winTex,
    emissiveIntensity: 0.7, roughness: 0.55, metalness: 0.35,
  }));
  const matDarkMetal = trackMat(new THREE.MeshStandardMaterial({ color: 0x14161f, roughness: 0.5, metalness: 0.7 }));

  [
    [-6.6, 5.5, -2.0, 3.8, 11, 16],
    [6.6, 5.0, -2.5, 3.8, 10, 15],
    [0.0, 7.5, -13.0, 10, 15, 4],
  ].forEach(([x, y, z, w, h, d]) => {
    const b = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(w, h, d)), matBuilding);
    b.position.set(x, y, z);
    group.add(b);
  });

  const overpass = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(11, 0.75, 1.4)), matDarkMetal);
  overpass.position.set(0, 5.6, -8.5);
  group.add(overpass);

  // --- Braced Holographic Billboard & Vertical Neon Sign ---
  const arm = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.2, 0.08, 0.08)), matDarkMetal);
  arm.position.set(4.1, 3.2, -1.8);
  group.add(arm);

  const holoMat = trackMat(new THREE.MeshBasicMaterial({
    map: holoTex, transparent: true, opacity: 0.85,
    side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  const board = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(2.9, 1.45)), holoMat);
  board.position.set(2.8, 3.2, -1.8);
  board.rotation.y = -0.35;
  group.add(board);

  const cyanNeonMat = trackMat(new THREE.MeshBasicMaterial({ color: 0x00ffe0 }));
  const bladeSign = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.16, 2.4, 0.55)), cyanNeonMat);
  bladeSign.position.set(-4.35, 2.9, -0.3);
  group.add(bladeSign);

  // --- Hover-Traffic Pods ---
  const podA = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.65, 0.14, 0.25)), trackMat(new THREE.MeshBasicMaterial({ color: 0xff2266 })));
  const podB = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.65, 0.14, 0.25)), cyanNeonMat);
  podA.position.set(-5, 6.3, -8.1);
  podB.position.set(5, 6.7, -8.9);
  group.add(podA, podB);

  // --- Streaking Neon Rain (LineSegments) ---
  const rainCount = 700;
  const rainPos = new Float32Array(rainCount * 6);
  for (let i = 0; i < rainCount; i++) {
    const x = (Math.random() - 0.5) * 16;
    const y = Math.random() * 14;
    const z = (Math.random() - 0.5) * 20;
    rainPos.set([x, y, z, x - 0.04, y + 0.42, z], i * 6);
  }
  const rainGeo = trackGeo(new THREE.BufferGeometry());
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
  const rain = new THREE.LineSegments(
    rainGeo,
    trackMat(new THREE.LineBasicMaterial({ color: 0x77ddff, transparent: true, opacity: 0.55 }))
  );
  group.add(rain);

  let lastT = null;

  return {
    group,
    background: '#08080f',
    description: 'Rain-slicked puddle asphalt, neon blade signage, alley towers, and holographic ads.',
    update(t) {
      const dt = lastT !== null ? Math.min(Math.max(t - lastT, 0), 0.05) : 0.016;
      lastT = t;

      const arr = rain.geometry.attributes.position.array;
      const drop = dt * 13;
      for (let i = 0; i < rainCount; i++) {
        const idx = i * 6;
        arr[idx + 1] -= drop;
        arr[idx + 4] -= drop;
        if (arr[idx + 4] < 0) {
          arr[idx + 1] += 14;
          arr[idx + 4] += 14;
        }
      }
      rain.geometry.attributes.position.needsUpdate = true;

      holoMat.opacity = 0.72 + Math.sin(t * 7) * 0.12;
      holoTex.offset.y = -(t * 0.15) % 1;
      sign1.intensity = 2.9 + Math.sin(t * 9) * 0.4;
      podA.position.x = ((t * 5) % 16) - 8;
      podB.position.x = 8 - ((t * 4.2) % 16);
    },
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((tx) => tx.dispose());
    },
  };
}