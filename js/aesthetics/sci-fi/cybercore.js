// js/aesthetics/dark/cybercore.js
import * as THREE from 'three';

export function createCybercore() {
  const group = new THREE.Group();
  const geometries = [];
  const materials = [];
  const textures = [];

  const trackGeo = (g) => (geometries.push(g), g);
  const trackMat = (m) => (materials.push(m), m);
  const trackTex = (tx) => (textures.push(tx), tx);

  // --- Procedural CanvasTextures ---
  function makeCircuitTex() {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#030806';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    for (let i = 0; i < 24; i++) {
      const x = (i * 37) % 240 + 8;
      const y = (i * 53) % 240 + 8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo((x + 48) % 256, y);
      ctx.lineTo((x + 48) % 256, (y + 36) % 256);
      ctx.stroke();
      ctx.fillStyle = '#86efac';
      ctx.fillRect(x - 2, y - 2, 5, 5);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return trackTex(tex);
  }

  function makeHudDialTex() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 64;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 512, 64);
    for (let x = 0; x < 512; x += 8) {
      const major = x % 32 === 0;
      ctx.fillStyle = major ? 'rgba(134, 239, 172, 0.9)' : 'rgba(34, 197, 94, 0.45)';
      ctx.fillRect(x, major ? 12 : 22, 2, major ? 40 : 20);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.repeat.set(3, 1);
    tex.colorSpace = THREE.SRGBColorSpace;
    return trackTex(tex);
  }

  const circuitTex = makeCircuitTex();
  const hudDialTex = makeHudDialTex();

  // --- Core & Rim Lighting ---
  const coreLight = new THREE.PointLight(0x22c55e, 2.4, 5);
  group.add(coreLight);
  const rimLight = new THREE.DirectionalLight(0x86efac, 0.9);
  rimLight.position.set(2, 3, 2);
  group.add(rimLight);

  // 1. Split Obsidian Armor Caps + Inner Glowing Matrix Cube (replaces TorusKnot)
  const obsidianMat = trackMat(new THREE.MeshPhysicalMaterial({
    color: 0x090d16,
    emissive: 0x0a3a1e,
    emissiveMap: circuitTex,
    emissiveIntensity: 0.85,
    metalness: 0.9,
    roughness: 0.14,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    flatShading: true,
  }));

  const capGeo = trackGeo(new THREE.CylinderGeometry(0.14, 0.48, 0.42, 6));
  const topCap = new THREE.Mesh(capGeo, obsidianMat);
  topCap.position.y = 0.28;
  const botCap = new THREE.Mesh(capGeo, obsidianMat);
  botCap.position.y = -0.28;
  botCap.rotation.x = Math.PI;
  group.add(topCap, botCap);

  const innerCoreMat = trackMat(new THREE.MeshStandardMaterial({
    color: 0x4ade80,
    map: circuitTex,
    emissive: 0x22c55e,
    emissiveMap: circuitTex,
    emissiveIntensity: 1.5,
    roughness: 0.2,
  }));
  const innerCore = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.28, 0.28, 0.28)), innerCoreMat);
  group.add(innerCore);

  // 2. Clean Vector Geodesic Containment Cage
  const cageSource = trackGeo(new THREE.IcosahedronGeometry(0.96, 1));
  const cageEdges = trackGeo(new THREE.EdgesGeometry(cageSource));
  const cage = new THREE.LineSegments(
    cageEdges,
    trackMat(new THREE.LineBasicMaterial({ color: 0x4ade80, transparent: true, opacity: 0.78 }))
  );
  group.add(cage);

  // 3. Dual Tactical Gyroscopic HUD Rings + Telemetry Band
  const outerRing = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(1.32, 0.012, 8, 72)),
    trackMat(new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.55 }))
  );
  outerRing.rotation.x = Math.PI / 2.2;

  const innerRing = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(1.14, 0.009, 8, 64)),
    trackMat(new THREE.MeshBasicMaterial({ color: 0x86efac, transparent: true, opacity: 0.35 }))
  );
  innerRing.rotation.set(Math.PI / 3, 0.45, 0);

  const hudBand = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.06, 1.06, 0.14, 48, 1, true)),
    trackMat(new THREE.MeshBasicMaterial({
      map: hudDialTex, transparent: true, opacity: 0.65, side: THREE.DoubleSide, depthWrite: false
    }))
  );
  hudBand.rotation.z = 0.22;
  group.add(outerRing, innerRing, hudBand);

  // 4. Orbiting Acid-Green Matrix Data Packets
  const packetMat = trackMat(new THREE.MeshStandardMaterial({
    color: 0x4ade80, emissive: 0x22c55e, emissiveIntensity: 0.95, roughness: 0.2,
  }));
  const packetGeo = trackGeo(new THREE.OctahedronGeometry(0.065, 0));
  const packets = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const mesh = new THREE.Mesh(packetGeo, packetMat);
    const radius = 1.32;
    const baseY = (i % 2 === 0 ? 1 : -1) * 0.22;
    mesh.position.set(Math.cos(angle) * radius, baseY, Math.sin(angle) * radius);
    group.add(mesh);
    packets.push({ mesh, angle, radius, baseY });
  }

  return {
    group,
    description:
      'Rooted in late-1990s hacker cinema, Y2K cyber-thrillers, and early tactical UI design, Cybercore pairs pitch-black obsidian hardware with glowing acid-green vector wireframes, terminal telemetry rings, and high-speed data streams.',
    background: 'radial-gradient(circle at 50% 30%, #064e3b 0%, #022c22 50%, #000000 100%)',
    update(t, bounce, spring) {
      const hover = Math.sin(t * 2.2) * 0.04;
      topCap.position.y = 0.28 + hover;
      botCap.position.y = -0.28 - hover;
      topCap.rotation.y = t * 0.55;
      botCap.rotation.y = -t * 0.55;

      innerCore.rotation.set(t * 1.1, t * 1.4, t * 0.7);
      coreLight.intensity = 2.1 + Math.sin(t * 4) * 0.4;

      cage.rotation.y = -t * 0.4;
      cage.rotation.z = t * 0.25;

      outerRing.rotation.z = t * 0.35;
      innerRing.rotation.y = -t * 0.55;
      hudBand.rotation.y = t * 0.45;
      hudDialTex.offset.x = t * 0.12;

      packets.forEach((p, idx) => {
        const a = p.angle + t * 0.6;
        p.mesh.position.set(
          Math.cos(a) * p.radius,
          p.baseY + Math.sin(t * 2.2 + idx) * 0.08,
          Math.sin(a) * p.radius
        );
        p.mesh.rotation.y = t * 1.5;
      });

      group.scale.setScalar(1 + spring * 0.28);
    },
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((tx) => tx.dispose());
    },
  };
}