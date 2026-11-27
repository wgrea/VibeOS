// js/aesthetics/sci-fi/solarpunk.js
import * as THREE from 'three';

export function createSolarpunk({ camera, domElement, box }) {
  const group = new THREE.Group();
  const geometries = [];
  const materials = [];
  const textures = [];

  const trackGeo = (g) => (geometries.push(g), g);
  const trackMat = (m) => (materials.push(m), m);
  const trackTex = (tx) => (textures.push(tx), tx);

  // --- Procedural CanvasTextures ---
  function makeMeadowTex() {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#53944c';
    ctx.fillRect(0, 0, 256, 256);
    const shades = ['#62a858', '#468240', '#74b862', '#89c468'];
    for (let i = 0; i < 420; i++) {
      ctx.fillStyle = shades[i % shades.length];
      const x = (i * 73) % 256;
      const y = (i * 137) % 256;
      ctx.beginPath();
      ctx.arc(x, y, 2 + (i % 4), 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = trackTex(new THREE.CanvasTexture(c));
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function makeSolarTex() {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#0c3b5e';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    for (let i = 0; i <= 256; i += 32) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(130, 220, 255, 0.25)';
    ctx.lineWidth = 1;
    for (let i = 16; i < 256; i += 32) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
    }
    const tex = trackTex(new THREE.CanvasTexture(c));
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function makeWoodTex() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#9c6635';
    ctx.fillRect(0, 0, 128, 128);
    for (let y = 0; y < 128; y += 3) {
      ctx.fillStyle = y % 6 === 0 ? 'rgba(65, 38, 15, 0.25)' : 'rgba(220, 165, 100, 0.16)';
      ctx.fillRect(0, y, 128, 2);
    }
    const tex = trackTex(new THREE.CanvasTexture(c));
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 1);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  // --- Shared Materials ---
  const matBrass = trackMat(new THREE.MeshStandardMaterial({ color: 0xc99a2e, metalness: 0.88, roughness: 0.24 }));
  const matCopper = trackMat(new THREE.MeshStandardMaterial({ color: 0xb86f43, metalness: 0.85, roughness: 0.3 }));
  const matCeramic = trackMat(new THREE.MeshStandardMaterial({ color: 0xf4efe6, roughness: 0.45, metalness: 0.08 }));
  const matWood = trackMat(new THREE.MeshStandardMaterial({ map: makeWoodTex(), roughness: 0.72, metalness: 0.05 }));
  const matSolar = trackMat(new THREE.MeshPhysicalMaterial({
    map: makeSolarTex(), roughness: 0.16, metalness: 0.65, clearcoat: 1.0, clearcoatRoughness: 0.06,
  }));
  const matGlass = trackMat(new THREE.MeshPhysicalMaterial({
    color: 0xbaf7e2, roughness: 0.08, metalness: 0.05, clearcoat: 1.0,
    clearcoatRoughness: 0.05, transparent: true, opacity: 0.26, side: THREE.DoubleSide, depthWrite: false,
  }));

  // --- Warm Daylight & Sky Fill ---
  const sun = new THREE.DirectionalLight(0xfff0ba, 1.85);
  sun.position.set(7, 11, 6);
  group.add(sun);
  group.add(new THREE.HemisphereLight(0xd8f8ee, 0x456b3c, 0.75));
  const domeLanternLight = new THREE.PointLight(0xffd275, 1.4, 7);
  domeLanternLight.position.set(0, 2.2, 0);
  group.add(domeLanternLight);

  // --- Meadow Ground & Stone Path ---
  const ground = new THREE.Mesh(
    trackGeo(new THREE.CircleGeometry(16, 64)),
    trackMat(new THREE.MeshStandardMaterial({ map: makeMeadowTex(), roughness: 0.88 }))
  );
  ground.rotation.x = -Math.PI / 2;
  group.add(ground);

  const pathMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xded2ba, roughness: 0.85 }));
  for (let i = 0; i < 6; i++) {
    const step = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.45, 0.48, 0.05, 8)), pathMat);
    step.position.set(Math.sin(i * 0.4) * 0.35, 0.025, 3.9 + i * 1.15);
    group.add(step);
  }

  // --- Botanical Bio-Dome & Brass Conservatory Frame ---
  const domeRadius = 3.4;
  const baseRim = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(domeRadius + 0.16, domeRadius + 0.24, 0.32, 48, 1, true)),
    matWood
  );
  baseRim.position.y = 0.16;
  const soilBed = new THREE.Mesh(
    trackGeo(new THREE.CircleGeometry(domeRadius + 0.1, 48)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0x3f2e21, roughness: 0.95 }))
  );
  soilBed.rotation.x = -Math.PI / 2;
  soilBed.position.y = 0.04;
  group.add(baseRim, soilBed);

  // Interior Canopy Tree & Flowers
  const trunk = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.16, 0.34, 1.85, 10)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0x6e4a2e, roughness: 0.9 }))
  );
  trunk.position.y = 0.92;
  group.add(trunk);

  const leafColors = [0x2e8b57, 0x3fa35b, 0x66bb6a, 0x8bc34a];
  [
    [0, 2.25, 0, 0.95], [-0.72, 1.9, 0.35, 0.68], [0.74, 1.95, -0.25, 0.72],
    [0.15, 1.85, 0.68, 0.62], [-0.25, 2.0, -0.65, 0.64],
  ].forEach(([x, y, z, r], i) => {
    const puff = new THREE.Mesh(
      trackGeo(new THREE.IcosahedronGeometry(r, 1)),
      trackMat(new THREE.MeshStandardMaterial({ color: leafColors[i % leafColors.length], roughness: 0.8, flatShading: true }))
    );
    puff.position.set(x, y, z);
    group.add(puff);
  });

  const bloomMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xffb703, emissive: 0xff8800, emissiveIntensity: 0.25 }));
  const bloomGeo = trackGeo(new THREE.SphereGeometry(0.1, 8, 8));
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const rad = 1.65 + (i % 3) * 0.42;
    const flower = new THREE.Mesh(bloomGeo, bloomMat);
    flower.position.set(Math.cos(a) * rad, 0.16, Math.sin(a) * rad);
    group.add(flower);
  }

  // Brass Arches + Collar Rings + Physical Clearcoat Glass
  const archGeo = trackGeo(new THREE.TorusGeometry(domeRadius + 0.02, 0.045, 8, 48, Math.PI));
  for (let i = 0; i < 4; i++) {
    const arch = new THREE.Mesh(archGeo, matBrass);
    arch.position.y = 0.2;
    arch.rotation.y = (i * Math.PI) / 4;
    group.add(arch);
  }
  [
    [1.2, 3.21],
    [2.3, 2.55],
  ].forEach(([y, r]) => {
    const collar = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(r, 0.035, 8, 48)), matCopper);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = y;
    group.add(collar);
  });

  const dome = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(domeRadius, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2)),
    matGlass
  );
  dome.position.y = 0.2;
  group.add(dome);

  // --- Wind Turbine Mast & Properly Aligned Rotor ---
  const turbine = new THREE.Group();
  turbine.position.set(4.6, 0, -3.4);
  turbine.rotation.y = -0.35;
  group.add(turbine);

  const mast = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.11, 0.24, 6.2, 16)), matCeramic);
  mast.position.y = 3.1;
  const mastRing = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.22, 0.25, 0.25, 16)), matBrass);
  mastRing.position.y = 1.8;
  const nacelle = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.2, 0.2, 0.78, 16)), matBrass);
  nacelle.rotation.x = Math.PI / 2;
  nacelle.position.set(0, 6.2, -0.05);
  turbine.add(mast, mastRing, nacelle);

  const rotor = new THREE.Group();
  rotor.position.set(0, 6.2, 0.36);
  turbine.add(rotor);
  const nose = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.16, 0.34, 16)), matCopper);
  nose.rotation.x = Math.PI / 2;
  nose.position.z = 0.12;
  rotor.add(nose);

  const bladeGeo = trackGeo(new THREE.BoxGeometry(0.18, 2.1, 0.04));
  for (let i = 0; i < 3; i++) {
    const holder = new THREE.Group();
    holder.rotation.z = (i * Math.PI * 2) / 3;
    const blade = new THREE.Mesh(bladeGeo, matCeramic);
    blade.position.y = 1.1;
    blade.rotation.y = 0.22;
    holder.add(blade);
    rotor.add(holder);
  }

  // --- Sun-Tracking Photovoltaic Arrays ---
  [
    [-4.8, -2.2],
    [-4.2, 1.5],
  ].forEach(([x, z]) => {
    const post = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.08, 0.12, 1.1, 10)), matBrass);
    post.position.set(x, 0.55, z);
    const panel = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.1, 0.07, 1.35)), matSolar);
    panel.position.set(x, 1.15, z);
    panel.rotation.set(0.55, 0.45, 0);
    group.add(post, panel);
  });

  // --- Floating Golden Sun-Motes ---
  const moteCount = 120;
  const motePos = new Float32Array(moteCount * 3);
  for (let i = 0; i < moteCount; i++) {
    motePos[i * 3] = (Math.random() - 0.5) * 12;
    motePos[i * 3 + 1] = 0.4 + Math.random() * 5.2;
    motePos[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }
  const moteGeo = trackGeo(new THREE.BufferGeometry());
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
  const motes = new THREE.Points(
    moteGeo,
    trackMat(new THREE.PointsMaterial({ color: 0xffe484, size: 0.08, transparent: true, opacity: 0.75 }))
  );
  group.add(motes);

  return {
    group,
    background: '#bfe6d6',
    description: 'Art-nouveau glass bio-domes, brass wind turbines, solar arrays, and sunlit gardens.',
    update(t) {
      rotor.rotation.z = -t * 1.4;
      domeLanternLight.intensity = 1.3 + Math.sin(t * 2.1) * 0.25;
      motes.rotation.y = t * 0.04;
      motes.position.y = Math.sin(t * 0.9) * 0.12;
    },
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((tx) => tx.dispose());
    },
  };
}