// js/aesthetics/glam/catwalk.js
import * as THREE from 'three';

export function createCatwalk({ camera, domElement, box }) {
  const group = new THREE.Group();
  const geometries = [];
  const materials = [];
  const textures = [];

  const trackGeo = (g) => (geometries.push(g), g);
  const trackMat = (m) => (materials.push(m), m);
  const trackTex = (tx) => (textures.push(tx), tx);

  // --- Procedural CanvasTextures ---
  function makeRunwayTex() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#dde3ea';
    ctx.fillRect(0, 0, 256, 512);
    for (let y = 0; y < 512; y += 64) {
      ctx.fillStyle = 'rgba(20, 24, 34, 0.14)';
      ctx.fillRect(0, y, 256, 2);
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(18, 0, 6, 512);
    ctx.fillRect(232, 0, 6, 512);
    const tex = trackTex(new THREE.CanvasTexture(c));
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 3);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function makeBackdropTex() {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, '#fff0f7');
    g.addColorStop(1, '#c8dfff');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = 'rgba(20, 18, 28, 0.25)';
    ctx.lineWidth = 4;
    ctx.strokeRect(18, 18, 220, 220);
    ctx.fillStyle = '#181422';
    ctx.font = 'bold 26px serif';
    ctx.textAlign = 'center';
    ctx.fillText('VIBE // ATELIER', 128, 122);
    ctx.font = '12px sans-serif';
    ctx.fillText('AUTUMN  •  WINTER', 128, 148);
    const tex = trackTex(new THREE.CanvasTexture(c));
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  // --- Lighting ---
  group.add(new THREE.AmbientLight(0x28243a, 0.65));
  const key = new THREE.DirectionalLight(0xffffff, 1.25);
  key.position.set(4, 8, 5);
  group.add(key);

  const spotA = new THREE.SpotLight(0xffd4ee, 2.6, 22, Math.PI / 5, 0.45);
  spotA.position.set(-3.8, 5.2, 1.5);
  spotA.target.position.set(0, 0, -1);
  const spotB = new THREE.SpotLight(0xd4eeff, 2.6, 22, Math.PI / 5, 0.45);
  spotB.position.set(3.8, 5.2, 1.5);
  spotB.target.position.set(0, 0, -1);
  const portalGlow = new THREE.PointLight(0xffe6f4, 2.0, 10);
  portalGlow.position.set(0, 2.4, -5.8);
  group.add(spotA, spotA.target, spotB, spotB.target, portalGlow);

  // --- Reflective Black Floor & Clearcoat Chrome Runway ---
  const floor = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(24, 24)),
    trackMat(new THREE.MeshPhysicalMaterial({
      color: 0x09090f, metalness: 0.55, roughness: 0.22, clearcoat: 0.75, clearcoatRoughness: 0.16,
    }))
  );
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

  const runway = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.4, 0.1, 12)),
    trackMat(new THREE.MeshPhysicalMaterial({
      map: makeRunwayTex(), color: 0xeaf0f6, metalness: 0.92, roughness: 0.08,
      clearcoat: 1.0, clearcoatRoughness: 0.04,
    }))
  );
  runway.position.set(0, 0.05, -1);
  group.add(runway);

  const ledStripMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xffd1ea }));
  const ledGeo = trackGeo(new THREE.BoxGeometry(0.04, 0.03, 12));
  [-1.21, 1.21].forEach((x) => {
    const strip = new THREE.Mesh(ledGeo, ledStripMat);
    strip.position.set(x, 0.095, -1);
    group.add(strip);
  });

  // --- Backlit Runway Entrance Portal ---
  const chromeMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xd8dee6, metalness: 0.95, roughness: 0.12 }));
  const pillarGeo = trackGeo(new THREE.BoxGeometry(0.24, 3.6, 0.24));
  [-1.35, 1.35].forEach((x) => {
    const p = new THREE.Mesh(pillarGeo, chromeMat);
    p.position.set(x, 1.8, -7.0);
    group.add(p);
  });
  const header = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.94, 0.24, 0.24)), chromeMat);
  header.position.set(0, 3.6, -7.0);
  const backdrop = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(2.46, 3.45)),
    trackMat(new THREE.MeshBasicMaterial({ map: makeBackdropTex() }))
  );
  backdrop.position.set(0, 1.75, -7.02);
  group.add(header, backdrop);

  // --- Overhead Truss & Mirror Ball ---
  const trussMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x16161d, metalness: 0.8, roughness: 0.35 }));
  const trussBar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(8.2, 0.14, 0.18)), trussMat);
  trussBar.position.set(0, 5.2, 1.5);
  const rod = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8)), chromeMat);
  rod.position.set(0, 4.45, -1);
  group.add(trussBar, rod);

  const canGeo = trackGeo(new THREE.CylinderGeometry(0.12, 0.16, 0.34, 12));
  [-3.8, -1.6, 1.6, 3.8].forEach((x) => {
    const can = new THREE.Mesh(canGeo, trussMat);
    can.position.set(x, 5.05, 1.5);
    can.rotation.set(0.45, 0, x * 0.1);
    group.add(can);
  });

  const ball = new THREE.Mesh(
    trackGeo(new THREE.IcosahedronGeometry(0.7, 2)),
    trackMat(new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 1.0, roughness: 0.03, clearcoat: 1.0, flatShading: true,
    }))
  );
  ball.position.set(0, 3.6, -1);
  group.add(ball);

  // --- Brass Stanchions & True Draped Velvet Swag Ropes ---
  const ropeMat = trackMat(new THREE.MeshPhysicalMaterial({
    color: 0x6b0f1a, roughness: 0.88, sheen: 1.0, sheenColor: new THREE.Color(0xff4d6d), sheenRoughness: 0.45,
  }));
  const postMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xc9961a, metalness: 0.95, roughness: 0.22 }));

  const baseGeo = trackGeo(new THREE.CylinderGeometry(0.11, 0.13, 0.04, 16));
  const shaftGeo = trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 0.84, 12));
  const finialGeo = trackGeo(new THREE.SphereGeometry(0.055, 12, 10));
  const ropeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.8, 0),
    new THREE.Vector3(0, 0.64, 1),
    new THREE.Vector3(0, 0.8, 2),
  ]);
  const ropeGeo = trackGeo(new THREE.TubeGeometry(ropeCurve, 12, 0.032, 8, false));

  for (const side of [-1, 1]) {
    for (let z = -5; z <= 3; z += 2) {
      const x = side * 1.55;
      const base = new THREE.Mesh(baseGeo, postMat);
      base.position.set(x, 0.02, z);
      const shaft = new THREE.Mesh(shaftGeo, postMat);
      shaft.position.set(x, 0.44, z);
      const finial = new THREE.Mesh(finialGeo, postMat);
      finial.position.set(x, 0.89, z);
      group.add(base, shaft, finial);

      if (z < 3) {
        const rope = new THREE.Mesh(ropeGeo, ropeMat);
        rope.position.set(x, 0, z);
        group.add(rope);
      }
    }
  }

  // --- Flanking Audience Risers & Paparazzi Flash Sparkles ---
  const riserMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x13131b, roughness: 0.72 }));
  const riserGeo = trackGeo(new THREE.BoxGeometry(0.75, 0.28, 9.5));
  for (const side of [-1, 1]) {
    for (let i = 0; i < 2; i++) {
      const riser = new THREE.Mesh(riserGeo, riserMat);
      riser.position.set(side * (2.6 + i * 0.8), 0.14 + i * 0.28, -1);
      group.add(riser);
    }
  }

  const flashCount = 48;
  const flashPos = new Float32Array(flashCount * 3);
  for (let i = 0; i < flashCount; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    flashPos[i * 3] = side * (2.3 + Math.random() * 1.6);
    flashPos[i * 3 + 1] = 0.6 + Math.random() * 1.2;
    flashPos[i * 3 + 2] = -5 + Math.random() * 8;
  }
  const flashGeo = trackGeo(new THREE.BufferGeometry());
  flashGeo.setAttribute('position', new THREE.BufferAttribute(flashPos, 3));
  const flashMat = trackMat(new THREE.PointsMaterial({ color: 0xffffff, size: 0.14, transparent: true, opacity: 0.65 }));
  group.add(new THREE.Points(flashGeo, flashMat));

  return {
    group,
    background: 'radial-gradient(circle at 50% 25%, #1a1424 0%, #050508 70%)',
    description: 'Chrome catwalk, draped velvet stanchions, backlit atelier portal, mirror ball, and runway spots.',
    update(t, bounce, spring) {
      ball.rotation.y = t * 0.4;
      ball.rotation.x = Math.sin(t * 0.3) * 0.15;
      spotA.intensity = 2.4 + Math.sin(t * 2.1) * 0.4;
      spotB.intensity = 2.4 + Math.cos(t * 1.7) * 0.4;
      flashMat.opacity = Math.pow(Math.sin(t * 11) * 0.5 + 0.5, 4) * 0.9;
      group.rotation.z = spring * 0.004;
    },
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((tx) => tx.dispose());
    },
  };
}