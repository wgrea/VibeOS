// js/aesthetics/sci-fi/cassette-futurism.js
import * as THREE from 'three';

export function createCassetteFuturism({ camera, domElement, box }) {
  const group = new THREE.Group();
  const geometries = [];
  const materials = [];
  const textures = [];

  const trackGeo = (g) => (geometries.push(g), g);
  const trackMat = (m) => (materials.push(m), m);
  const trackTex = (t) => (textures.push(t), t);

  // --- Procedural Textures ---
  function makeBrushedMetalTex() {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#8b8d8a';
    ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y++) {
      const v = 122 + Math.floor(Math.random() * 34);
      ctx.fillStyle = `rgb(${v},${v},${v - 2})`;
      ctx.fillRect(0, y, 256, 1);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    tex.colorSpace = THREE.SRGBColorSpace;
    return trackTex(tex);
  }

  const crtCanvas = document.createElement('canvas');
  crtCanvas.width = 256;
  crtCanvas.height = 192;
  const crtCtx = crtCanvas.getContext('2d');
  const crtTex = trackTex(new THREE.CanvasTexture(crtCanvas));
  crtTex.colorSpace = THREE.SRGBColorSpace;

  function drawCrtScreen(step) {
    crtCtx.fillStyle = '#140c02';
    crtCtx.fillRect(0, 0, 256, 192);
    crtCtx.strokeStyle = 'rgba(255, 176, 0, 0.14)';
    for (let y = 0; y < 192; y += 4) {
      crtCtx.beginPath();
      crtCtx.moveTo(0, y);
      crtCtx.lineTo(256, y);
      crtCtx.stroke();
    }
    crtCtx.fillStyle = '#ffb000';
    crtCtx.font = 'bold 13px monospace';
    crtCtx.fillText('VIBE-OS // MK.IV TERMINAL', 14, 24);
    crtCtx.font = '11px monospace';
    crtCtx.fillText('DRIVE A: CASSETTE_01  [PLAY]', 14, 48);
    crtCtx.fillText('MEM: 64K OK   BIAS: 120uS', 14, 66);
    crtCtx.strokeStyle = '#ff9500';
    crtCtx.strokeRect(14, 82, 228, 56);
    for (let i = 0; i < 16; i++) {
      const h = 8 + Math.round((Math.sin(step * 0.7 + i * 0.6) * 0.5 + 0.5) * 34);
      crtCtx.fillStyle = i > 12 ? '#ff6a00' : '#ffb000';
      crtCtx.fillRect(22 + i * 13.5, 132 - h, 9, h);
    }
    crtCtx.fillStyle = '#ffb000';
    crtCtx.fillText('> STANDBY' + (step % 2 === 0 ? ' _' : ''), 14, 166);
    crtTex.needsUpdate = true;
  }
  drawCrtScreen(0);

  // --- Shared Materials ---
  const metalTex = makeBrushedMetalTex();
  const matDesk = trackMat(new THREE.MeshStandardMaterial({
    map: metalTex, color: 0x9aa09a, metalness: 0.85, roughness: 0.32
  }));
  const matChassis = trackMat(new THREE.MeshStandardMaterial({ color: 0x2c2822, roughness: 0.68, metalness: 0.25 }));
  const matPutty = trackMat(new THREE.MeshStandardMaterial({ color: 0xc2b8a3, roughness: 0.6, metalness: 0.1 }));
  const matDarkTrim = trackMat(new THREE.MeshStandardMaterial({ color: 0x171512, roughness: 0.75, metalness: 0.2 }));
  const matAccent = trackMat(new THREE.MeshStandardMaterial({ color: 0xd9531e, roughness: 0.45, metalness: 0.15 }));
  const matGlass = trackMat(new THREE.MeshPhysicalMaterial({
    color: 0x181004, roughness: 0.08, metalness: 0.05, clearcoat: 1.0,
    clearcoatRoughness: 0.06, transparent: true, opacity: 0.28
  }));

  // --- Lighting ---
  group.add(new THREE.AmbientLight(0xffb454, 0.35));
  group.add(new THREE.HemisphereLight(0x8899aa, 0x221810, 0.45));
  const crtLight = new THREE.PointLight(0xffa600, 2.2, 8);
  crtLight.position.set(-0.35, 1.75, 0.95);
  group.add(crtLight);
  const rimLight = new THREE.DirectionalLight(0xdbe8ff, 0.75);
  rimLight.position.set(3, 4, 2);
  group.add(rimLight);

  // --- Brushed Aluminum Desk ---
  const desk = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(5, 0.12, 3)), matDesk);
  desk.position.y = 0.64;
  group.add(desk);
  const deskTrim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(5.06, 0.06, 3.06)), matDarkTrim);
  deskTrim.position.y = 0.62;
  group.add(deskTrim);

  // --- Stepped CRT Monitor ---
  const crtGroup = new THREE.Group();
  crtGroup.position.set(-0.35, 0.7, -0.18);
  group.add(crtGroup);

  const stand = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.1, 0.08, 0.9)), matDarkTrim);
  stand.position.y = 0.04;
  const neck = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.65, 0.22, 0.55)), matChassis);
  neck.position.set(0, 0.16, -0.05);
  const rearTube = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.3, 1.02, 0.68)), matChassis);
  rearTube.position.set(0, 0.92, -0.62);
  const frontShell = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.96, 1.44, 0.74)), matPutty);
  frontShell.position.set(0, 0.96, 0);
  crtGroup.add(stand, neck, rearTube, frontShell);

  // Recessed bezel frame & side vents
  const bezelGeoH = trackGeo(new THREE.BoxGeometry(1.86, 0.14, 0.08));
  const bezelGeoV = trackGeo(new THREE.BoxGeometry(0.16, 1.12, 0.08));
  [1.56, 0.36].forEach((y) => {
    const b = new THREE.Mesh(bezelGeoH, matDarkTrim);
    b.position.set(0, y, 0.39);
    crtGroup.add(b);
  });
  [-0.85, 0.85].forEach((x) => {
    const b = new THREE.Mesh(bezelGeoV, matDarkTrim);
    b.position.set(x, 0.96, 0.39);
    crtGroup.add(b);
  });
  const ventGeo = trackGeo(new THREE.BoxGeometry(0.04, 0.06, 0.52));
  [-0.98, 0.98].forEach((x) => {
    for (let i = 0; i < 4; i++) {
      const vent = new THREE.Mesh(ventGeo, matDarkTrim);
      vent.position.set(x, 0.72 + i * 0.14, -0.05);
      crtGroup.add(vent);
    }
  });

  const screenMat = trackMat(new THREE.MeshBasicMaterial({ map: crtTex }));
  const screen = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(1.52, 1.04)), screenMat);
  screen.position.set(0, 0.96, 0.375);
  const crtGlass = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(1.54, 1.06)), matGlass);
  crtGlass.position.set(0, 0.96, 0.405);
  crtGroup.add(screen, crtGlass);

  // --- Mechanical Keyboard (Instanced Keycaps) ---
  const kbGroup = new THREE.Group();
  kbGroup.position.set(-0.35, 0.75, 0.72);
  kbGroup.rotation.x = 0.13;
  group.add(kbGroup);

  const kbBase = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.75, 0.09, 0.64)), matPutty);
  kbGroup.add(kbBase);
  const keyGeo = trackGeo(new THREE.BoxGeometry(0.09, 0.05, 0.09));
  const keys = new THREE.InstancedMesh(keyGeo, matChassis, 52);
  const dummy = new THREE.Object3D();
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 13; c++) {
      dummy.position.set(-0.72 + c * 0.12, 0.06, -0.18 + r * 0.12);
      dummy.updateMatrix();
      keys.setMatrixAt(r * 13 + c, dummy.matrix);
    }
  }
  const escKey = new THREE.Mesh(keyGeo, matAccent);
  escKey.position.set(-0.72, 0.064, -0.18);
  kbGroup.add(keys, escKey);

  // --- Desktop Cassette Deck + Spinning Reels ---
  const deckGroup = new THREE.Group();
  deckGroup.position.set(1.32, 0.91, -0.05);
  group.add(deckGroup);

  const deckBody = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.22, 0.42, 0.84)), matChassis);
  const deckFace = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.18, 0.38, 0.03)), matDesk);
  deckFace.position.z = 0.42;
  const tapeWell = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.68, 0.2, 0.02)), matDarkTrim);
  tapeWell.position.set(-0.14, 0.04, 0.432);
  const tapeGlass = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(0.68, 0.2)), matGlass);
  tapeGlass.position.set(-0.14, 0.04, 0.448);
  deckGroup.add(deckBody, deckFace, tapeWell, tapeGlass);

  const reelGeo = trackGeo(new THREE.CylinderGeometry(0.055, 0.055, 0.015, 6));
  reelGeo.rotateX(Math.PI / 2);
  const reelL = new THREE.Mesh(reelGeo, matPutty);
  const reelR = new THREE.Mesh(reelGeo, matPutty);
  reelL.position.set(-0.28, 0.04, 0.44);
  reelR.position.set(0.0, 0.04, 0.44);
  deckGroup.add(reelL, reelR);

  const btnGeo = trackGeo(new THREE.BoxGeometry(0.09, 0.05, 0.05));
  for (let i = 0; i < 5; i++) {
    const btn = new THREE.Mesh(btnGeo, i === 4 ? matAccent : matPutty);
    btn.position.set(-0.36 + i * 0.11, -0.12, 0.445);
    deckGroup.add(btn);
  }
  const ledMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xff9d00 }));
  const led = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.06, 0.025, 0.02)), ledMat);
  led.position.set(0.38, 0.08, 0.44);
  deckGroup.add(led);

  // --- Stacked Data Cassettes ---
  const tapeGeo = trackGeo(new THREE.BoxGeometry(0.5, 0.065, 0.32));
  [0, 1].forEach((i) => {
    const tape = new THREE.Mesh(tapeGeo, i === 0 ? matPutty : matAccent);
    tape.position.set(1.36, 0.732 + i * 0.066, 0.74);
    tape.rotation.y = i === 0 ? 0.14 : -0.18;
    group.add(tape);
  });

  let lastStep = -1;

  return {
    group,
    background: '#0d0b06',
    description: 'Amber phosphor CRT, brushed aluminum deck, spinning cassette reels.',
    update(t) {
      reelL.rotation.z = -t * 2.2;
      reelR.rotation.z = -t * 2.2;
      crtLight.intensity = 2.0 + Math.sin(t * 7.5) * 0.18;
      ledMat.color.setHex(Math.sin(t * 4) > 0 ? 0xff9d00 : 0x553000);
      const step = Math.floor(t * 4);
      if (step !== lastStep) {
        lastStep = step;
        drawCrtScreen(step);
      }
    },
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((tx) => tx.dispose());
    }
  };
}