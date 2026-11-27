// js/aesthetics/vaporwave/scenecore.js

import * as THREE from 'three';

export function createScenecore() {
  const group = new THREE.Group();

  // Procedural Raw-HTML / Band-Poster Collage Reflection Map
  // Deliberately flat, banded, and "unpolished" — no smooth gradients.
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 256;
  envCanvas.height = 128;
  const ctx = envCanvas.getContext('2d');

  // Hard-edged horizontal bands (MySpace profile background energy)
  const bands = ['#ff2d95', '#0a0a0a', '#39ff14', '#ffffff', '#ff2d95', '#0a0a0a'];
  const bandH = Math.ceil(128 / bands.length);
  bands.forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.fillRect(0, i * bandH, 256, bandH);
  });

  // Scanned-paper grain streaks (handmade proof-of-labor texture)
  for (let i = 0; i < 220; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.22)';
    ctx.fillRect(Math.random() * 256, Math.random() * 128, Math.random() * 18 + 2, 1);
  }

  const envMap = new THREE.CanvasTexture(envCanvas);
  envMap.mapping = THREE.EquirectangularReflectionMapping;

  // 1. Unified Collage Assembly (Draggable / Arrow-Key Interactive)
  const scenecoreAssembly = new THREE.Group();
  const coreGroup = new THREE.Group();

  // Torn zine-page silhouette (irregular extruded polygon, NOT a clean star)
  const tornShape = new THREE.Shape();
  const tornPts = [
    [-0.92, 0.28], [-0.55, 0.74], [-0.08, 0.58], [0.22, 0.86],
    [0.68, 0.52], [0.88, 0.08], [0.52, -0.34], [0.16, -0.78],
    [-0.36, -0.66], [-0.72, -0.4], [-0.94, -0.06],
  ];
  tornPts.forEach(([x, y], i) => (i === 0 ? tornShape.moveTo(x, y) : tornShape.lineTo(x, y)));
  tornShape.closePath();

  const tornGeo = new THREE.ExtrudeGeometry(tornShape, {
    depth: 0.06,
    bevelEnabled: false,
  });
  tornGeo.center();

  // Flat matte "print" material — no clearcoat, no iridescence. Zine, not jewelry.
  const tornPaper = new THREE.Mesh(
    tornGeo,
    new THREE.MeshStandardMaterial({
      color: 0xff2d95,
      emissive: 0x7a0033,
      emissiveIntensity: 0.35,
      roughness: 0.92,
      metalness: 0.0,
      flatShading: true,
      envMap,
      envMapIntensity: 0.4,
    })
  );
  coreGroup.add(tornPaper);

  // Duplicated offset "misregistered print" layer (riso / screenprint misprint)
  const misprint = new THREE.Mesh(
    tornGeo,
    new THREE.MeshBasicMaterial({
      color: 0x39ff14,
      transparent: true,
      opacity: 0.28,
      wireframe: false,
    })
  );
  misprint.position.set(0.06, -0.05, -0.03);
  coreGroup.add(misprint);

  scenecoreAssembly.add(coreGroup);

  // 2. Raw HTML Grid Cage (wireframe box = the browser window / table layout)
  const gridCage = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 2.2, 2.2),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    })
  );
  scenecoreAssembly.add(gridCage);

  // 3. Orbiting "Band Poster" Quads (flat unlit planes, deliberately un-3D)
  const posters = [];
  const posterColors = [0xff2d95, 0x39ff14, 0xffffff, 0x0a0a0a];
  const posterGeo = new THREE.PlaneGeometry(0.34, 0.46);

  for (let i = 0; i < 12; i++) {
    const col = posterColors[i % posterColors.length];
    const isBlack = col === 0x0a0a0a;
    const poster = new THREE.Mesh(
      posterGeo,
      new THREE.MeshBasicMaterial({
        color: col,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isBlack ? 0.85 : 0.92,
      })
    );

    const a = (i / 12) * Math.PI * 2;
    const radius = 1.42;
    const y = (i % 2 === 0 ? 1 : -1) * (0.3 + (i % 3) * 0.18);
    poster.position.set(Math.cos(a) * radius, y, Math.sin(a) * radius);
    // Deliberately awkward rotations — crooked handmade placement
    poster.rotation.y = -a + (Math.random() - 0.5) * 0.6;
    poster.rotation.z = (Math.random() - 0.5) * 0.35;

    scenecoreAssembly.add(poster);
    posters.push({ mesh: poster, angle: a, radius, baseY: y, rotZ0: poster.rotation.z });
  }

  // 4. Glitch Scan Bars (horizontal planes that snap vertically = VHS/Myspace glitch)
  const scanBars = [];
  for (let i = 0; i < 3; i++) {
    const bar = new THREE.Mesh(
      new THREE.PlaneGeometry(3.0, 0.04),
      new THREE.MeshBasicMaterial({
        color: i === 1 ? 0x39ff14 : 0xff2d95,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      })
    );
    scenecoreAssembly.add(bar);
    scanBars.push({ mesh: bar, phase: i * 1.7, speed: 0.7 + i * 0.35 });
  }

  group.add(scenecoreAssembly);

  // 5. Flat Overhead "Flash Photo" Lighting — no moody rim, just blown-out flash
  const flashLight = new THREE.DirectionalLight(0xffffff, 2.6);
  flashLight.position.set(0, 6, 1);
  group.add(flashLight);

  const neonFill = new THREE.PointLight(0xff2d95, 1.4, 12);
  neonFill.position.set(-2.4, 0.5, 1.6);
  group.add(neonFill);

  const limeFill = new THREE.PointLight(0x39ff14, 1.2, 12);
  limeFill.position.set(2.4, -0.5, 1.6);
  group.add(limeFill);

  return {
    group,
    description:
      'Mid-2020s scene-kid revival—torn zine pages, misregistered riso print, crooked band posters, hard HTML wireframe grids, and blown-out flash-photo lighting. Deliberately raw, handmade, and anti-gloss.',
    background: 'radial-gradient(circle at 50% 40%, #ff2d95 0%, #0a0a0a 60%, #000000 100%)',
    update(t, bounce, spring) {
      scenecoreAssembly.position.y = Math.sin(t * 1.7) * 0.04 - bounce * 0.2;

      // Erratic "misregistered jitter" — the paper never sits still
      coreGroup.position.x = Math.sin(t * 9.3) * 0.018;
      coreGroup.position.y = Math.cos(t * 7.1) * 0.022;
      coreGroup.rotation.y = t * 0.9 + Math.sin(t * 3.1) * 0.18;
      coreGroup.rotation.z = Math.sin(t * 2.6) * 0.14;

      // Misprint layer drifts opposite for double-vision effect
      misprint.position.x = 0.06 + Math.sin(t * 5.5) * 0.03;
      misprint.position.y = -0.05 + Math.cos(t * 4.2) * 0.025;

      // Slow grid cage rotation
      gridCage.rotation.y = -t * 0.22;
      gridCage.rotation.x = Math.sin(t * 0.5) * 0.1;

      // Poster orbit + crooked wobble
      posters.forEach((p, idx) => {
        const a = p.angle + t * 0.32;
        p.mesh.position.x = Math.cos(a) * p.radius;
        p.mesh.position.z = Math.sin(a) * p.radius;
        p.mesh.position.y = p.baseY + Math.sin(t * 1.4 + idx * 0.9) * 0.06;
        p.mesh.rotation.y = -a + Math.sin(t * 2.1 + idx) * 0.25;
        p.mesh.rotation.z = p.rotZ0 + Math.sin(t * 3.3 + idx * 1.3) * 0.12;
      });

      // Snap-glitch scan bars
      scanBars.forEach((sb) => {
        const snapped = Math.floor(t * sb.speed * 6 + sb.phase) / 6;
        sb.mesh.position.y = ((snapped % 2.4) - 1.2);
        sb.mesh.material.opacity = 0.25 + Math.abs(Math.sin(t * 8 + sb.phase)) * 0.35;
      });

      group.scale.setScalar(1 + spring * 0.22);
    },
  };
}