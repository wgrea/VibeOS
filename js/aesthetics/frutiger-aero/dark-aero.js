// js/aesthetics/frutiger-aero/dark-aero.js
import * as THREE from 'three';

function createAuroraCoreTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0.0, '#0284c7');
  grad.addColorStop(0.45, '#22d3ee');
  grad.addColorStop(0.75, '#10b981');
  grad.addColorStop(1.0, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Bioluminescent aurora energy ribbons
  ctx.globalAlpha = 0.45;
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = i % 2 === 0 ? '#a5f3fc' : '#6ee7b7';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(0, 35 + i * 46);
    ctx.bezierCurveTo(85, i * 40, 170, 90 + i * 32, 256, 40 + i * 44);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createAeroPaneGeo(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);

  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.028,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.01,
    bevelThickness: 0.01,
  });
  geo.center();
  return geo;
}

export function createDarkAero() {
  const group = new THREE.Group();
  const disposables = [];
  const track = (x) => (disposables.push(x), x);

  const coreGroup = new THREE.Group();
  group.add(coreGroup);

  // 1. Swirling Cyan-Emerald Aurora Core
  const auroraTex = track(createAuroraCoreTexture());
  const coreMesh = new THREE.Mesh(
    track(new THREE.OctahedronGeometry(0.46, 2)),
    track(
      new THREE.MeshStandardMaterial({
        map: auroraTex,
        emissiveMap: auroraTex,
        emissive: 0x22d3ee,
        emissiveIntensity: 1.15,
        roughness: 0.1,
      })
    )
  );
  coreGroup.add(coreMesh);

  // 2. Refractive Smoked Obsidian Glass Prism + Crisp Vista Specular Edges
  const prismGeo = track(new THREE.OctahedronGeometry(0.98, 0));
  const smokedGlassMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x334155,
      metalness: 0.08,
      roughness: 0.04,
      transmission: 0.84,
      thickness: 0.9,
      ior: 1.52,
      attenuationColor: new THREE.Color(0x020617),
      attenuationDistance: 0.72,
      iridescence: 0.65,
      iridescenceIOR: 1.32,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    })
  );
  const prism = new THREE.Mesh(prismGeo, smokedGlassMat);
  const prismEdges = new THREE.LineSegments(
    track(new THREE.EdgesGeometry(prismGeo)),
    track(new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 }))
  );
  prism.add(prismEdges);
  coreGroup.add(prism);

  // 3. Flanking Smoked-Glass Vista Aero HUD Panes
  const paneGeo = track(createAeroPaneGeo(0.58, 0.42, 0.06));
  const paneEdgeGeo = track(new THREE.EdgesGeometry(paneGeo));
  const paneEdgeMat = track(new THREE.LineBasicMaterial({ color: 0x6ee7b7, transparent: true, opacity: 0.55 }));

  const panes = [-1, 1].map((side) => {
    const pane = new THREE.Mesh(paneGeo, smokedGlassMat);
    pane.add(new THREE.LineSegments(paneEdgeGeo, paneEdgeMat));
    pane.position.set(side * 1.06, side * 0.14, -0.25);
    pane.rotation.set(side * 0.12, -side * 0.45, side * 0.08);
    coreGroup.add(pane);
    return { mesh: pane, side, baseY: side * 0.14 };
  });

  // 4. Glossy Aurora & Teal Orbital Rings with Kinetic Light Nodes
  const emeraldRingMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.65,
      roughness: 0.05,
      clearcoat: 1.0,
    })
  );
  const cyanRingMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9,
      emissive: 0x0284c7,
      emissiveIntensity: 0.7,
      roughness: 0.05,
      clearcoat: 1.0,
    })
  );

  const ringOuter = new THREE.Group();
  ringOuter.rotation.x = Math.PI / 2.6;
  ringOuter.add(new THREE.Mesh(track(new THREE.TorusGeometry(1.56, 0.028, 14, 64)), emeraldRingMat));
  const nodeGeo = track(new THREE.SphereGeometry(0.055, 14, 14));
  [0, Math.PI].forEach((a) => {
    const n = new THREE.Mesh(nodeGeo, cyanRingMat);
    n.position.set(Math.cos(a) * 1.56, Math.sin(a) * 1.56, 0);
    ringOuter.add(n);
  });

  const ringInner = new THREE.Group();
  ringInner.rotation.set(Math.PI / 4, 0.35, 0);
  ringInner.add(new THREE.Mesh(track(new THREE.TorusGeometry(1.26, 0.022, 14, 64)), cyanRingMat));
  group.add(ringOuter, ringInner);

  // 5. Orbiting Bioluminescent Glass Droplets
  const dropGeo = track(new THREE.SphereGeometry(0.082, 20, 20));
  const dropMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x67e8f9,
      emissive: 0x10b981,
      emissiveIntensity: 0.45,
      roughness: 0.02,
      transmission: 0.85,
      thickness: 0.25,
      ior: 1.35,
      clearcoat: 1.0,
    })
  );

  const droplets = Array.from({ length: 8 }, (_, i) => {
    const drop = new THREE.Mesh(dropGeo, dropMat);
    const angle = (i / 8) * Math.PI * 2;
    const baseY = (i % 2 === 0 ? 1 : -1) * 0.24;
    drop.position.set(Math.cos(angle) * 1.56, baseY, Math.sin(angle) * 1.56);
    group.add(drop);
    return { mesh: drop, angle, baseY };
  });

  return {
    group,
    description:
      'Popularized around 2006–2009 by Windows Vista’s smoked Aero Glass, Zune media players, and dark-mode desktop skins, Dark Aero reimagines Frutiger Aero’s sunlit optimism as nocturnal translucent obsidian, glowing cyan cores, and bioluminescent emerald auroras.',
    background: 'radial-gradient(circle at 50% 35%, #0c4a6e 0%, #090d16 65%, #020617 100%)',
    update(t, bounce = 0, spring = 0) {
      coreGroup.position.y = Math.sin(t * 1.5) * 0.04 - bounce * 0.35;

      coreMesh.rotation.y = -t * 1.1;
      coreMesh.scale.setScalar(1 + Math.sin(t * 2.4) * 0.06);

      prism.rotation.y = t * 0.45;
      prism.rotation.x = Math.sin(t * 0.5) * 0.18;

      panes.forEach((p) => {
        p.mesh.position.y = p.baseY + Math.sin(t * 1.8 + p.side) * 0.06;
      });

      ringOuter.rotation.z = t * 0.42;
      ringInner.rotation.y = -t * 0.55;

      droplets.forEach((d, idx) => {
        const a = d.angle + t * 0.5;
        d.mesh.position.set(Math.cos(a) * 1.56, d.baseY + Math.sin(t * 1.8 + idx) * 0.12, Math.sin(a) * 1.56);
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
    dispose() {
      disposables.forEach((d) => d.dispose?.());
    },
  };
}