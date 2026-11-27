// js/aesthetics/glam/disco.js
import * as THREE from 'three';

export function createDisco({ camera, domElement, box }) {
  const group = new THREE.Group();
  const geometries = [];
  const materials = [];
  const textures = [];

  const trackGeo = (g) => (geometries.push(g), g);
  const trackMat = (m) => (materials.push(m), m);
  const trackTex = (tx) => (textures.push(tx), tx);

  // --- Procedural Illuminated Disco Tile Texture ---
  function makeDiscoFloorTex() {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#08020d';
    ctx.fillRect(0, 0, 512, 512);
    const palette = ['#ff00aa', '#00f5d4', '#ffcc00', '#9b5de5', '#ff4d6d'];
    const size = 32;
    for (let y = 0; y < 512; y += size) {
      for (let x = 0; x < 512; x += size) {
        const idx = ((x / size) * 7 + (y / size) * 13) % palette.length;
        ctx.fillStyle = palette[idx];
        ctx.fillRect(x + 3, y + 3, size - 6, size - 6);
        ctx.fillStyle = 'rgba(255,255,255,0.28)';
        ctx.fillRect(x + 6, y + 6, size - 12, size - 12);
      }
    }
    const tex = trackTex(new THREE.CanvasTexture(c));
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const floorTex = makeDiscoFloorTex();

  // --- Lighting ---
  group.add(new THREE.AmbientLight(0x240630, 0.75));
  const topSpot = new THREE.SpotLight(0xfff0ff, 2.2, 22, Math.PI / 4, 0.5);
  topSpot.position.set(0, 7.5, 2);
  group.add(topSpot);

  const lights = [];
  const colors = [0xff00aa, 0x00ffcc, 0xffcc00, 0xaa00ff];
  colors.forEach((c, i) => {
    const l = new THREE.PointLight(c, 2.5, 18);
    const angle = (i / colors.length) * Math.PI * 2;
    l.position.set(Math.cos(angle) * 4.2, 2.6, Math.sin(angle) * 4.2);
    group.add(l);
    lights.push({ light: l, angle });
  });

  // --- Dark Club Floor & Illuminated Clearcoat Dance Deck ---
  const outerFloor = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(26, 26)),
    trackMat(new THREE.MeshPhysicalMaterial({
      color: 0x09020f, metalness: 0.7, roughness: 0.14, clearcoat: 0.9, clearcoatRoughness: 0.1,
    }))
  );
  outerFloor.rotation.x = -Math.PI / 2;
  group.add(outerFloor);

  const tileMat = trackMat(new THREE.MeshPhysicalMaterial({
    map: floorTex, emissive: 0xffffff, emissiveMap: floorTex, emissiveIntensity: 0.95,
    roughness: 0.08, metalness: 0.25, clearcoat: 1.0, clearcoatRoughness: 0.05,
  }));
  const danceDeck = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(10.4, 0.1, 10.4)), tileMat);
  danceDeck.position.y = 0.05;
  group.add(danceDeck);

  const chromeMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.96, roughness: 0.12 }));
  const deckTrim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(10.7, 0.08, 10.7)), chromeMat);
  deckTrim.position.y = 0.035;
  group.add(deckTrim);

  // --- Giant Mirror Ball, Canopy Rod & Sweeping Light Cones ---
  const ball = new THREE.Mesh(
    trackGeo(new THREE.IcosahedronGeometry(1.12, 2)),
    trackMat(new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 1.0, roughness: 0.02, clearcoat: 1.0, flatShading: true,
    }))
  );
  ball.position.set(0, 4.2, 0);
  const chain = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.03, 0.03, 2.8, 8)), chromeMat);
  chain.position.set(0, 5.7, 0);
  group.add(ball, chain);

  const beamRig = new THREE.Group();
  beamRig.position.set(0, 4.2, 0);
  group.add(beamRig);
  const beamGeo = trackGeo(new THREE.ConeGeometry(1.2, 6.4, 16, 1, true));
  beamGeo.translate(0, -3.2, 0);
  colors.forEach((c, i) => {
    const beamMat = trackMat(new THREE.MeshBasicMaterial({
      color: c, transparent: true, opacity: 0.085, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.rotation.set(0.72, (i / colors.length) * Math.PI * 2, 0);
    beamRig.add(beam);
  });

  // --- Orbiting Sparkle Shards (Centered on Mirror Ball) ---
  const sparkles = new THREE.Group();
  sparkles.position.set(0, 4.2, 0);
  const shardGeo = trackGeo(new THREE.TetrahedronGeometry(0.055));
  const shardMats = colors.map((c) => trackMat(new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.9 })));
  for (let i = 0; i < 40; i++) {
    const s = new THREE.Mesh(shardGeo, shardMats[i % shardMats.length]);
    const r = 1.65 + (i % 5) * 0.22;
    const theta = (i * 2.39996) % (Math.PI * 2);
    const phi = Math.acos(1 - (2 * (i + 0.5)) / 40);
    s.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
    s.userData.phase = i * 0.7;
    sparkles.add(s);
  }
  group.add(sparkles);

  // --- Retro Vinyl DJ Booth (Back Perimeter) ---
  const booth = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(3.2, 1.05, 1.1)),
    trackMat(new THREE.MeshPhysicalMaterial({ color: 0x1a0826, roughness: 0.35, clearcoat: 0.8 }))
  );
  booth.position.set(0, 0.525, -6.1);
  const neonTrim = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(3.26, 0.06, 1.14)),
    trackMat(new THREE.MeshBasicMaterial({ color: 0xff00aa }))
  );
  neonTrim.position.set(0, 1.02, -6.1);
  group.add(booth, neonTrim);

  const vinylGeo = trackGeo(new THREE.CylinderGeometry(0.32, 0.32, 0.03, 24));
  const vinylMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.3, roughness: 0.25 }));
  const discs = [-0.65, 0.65].map((x) => {
    const d = new THREE.Mesh(vinylGeo, vinylMat);
    d.position.set(x, 1.07, -6.1);
    group.add(d);
    return d;
  });

  // --- Brass Stanchions + Draped Velvet Ropes Around Dance Deck ---
  const postMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xc9961a, metalness: 0.94, roughness: 0.24 }));
  const ropeMat = trackMat(new THREE.MeshPhysicalMaterial({
    color: 0x7a0d1c, roughness: 0.88, sheen: 1.0, sheenColor: new THREE.Color(0xff4d6d), sheenRoughness: 0.45,
  }));
  const count = 10;
  const ringR = 6.7;
  const chord = 2 * ringR * Math.sin(Math.PI / count);
  const postGeo = trackGeo(new THREE.CylinderGeometry(0.045, 0.045, 0.86, 10));
  const baseGeo = trackGeo(new THREE.CylinderGeometry(0.12, 0.14, 0.04, 14));
  const finialGeo = trackGeo(new THREE.SphereGeometry(0.065, 10, 10));
  const ropeGeo = trackGeo(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.82, 0),
    new THREE.Vector3(chord * 0.5, 0.62, 0),
    new THREE.Vector3(chord, 0.82, 0),
  ]), 12, 0.034, 8, false));

  for (let i = 0; i < count; i++) {
    const a1 = (i / count) * Math.PI * 2;
    const a2 = ((i + 1) / count) * Math.PI * 2;
    const x1 = Math.cos(a1) * ringR, z1 = Math.sin(a1) * ringR;
    const x2 = Math.cos(a2) * ringR, z2 = Math.sin(a2) * ringR;

    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(x1, 0.43, z1);
    const base = new THREE.Mesh(baseGeo, postMat);
    base.position.set(x1, 0.02, z1);
    const finial = new THREE.Mesh(finialGeo, postMat);
    finial.position.set(x1, 0.9, z1);
    group.add(post, base, finial);

    const rope = new THREE.Mesh(ropeGeo, ropeMat);
    rope.position.set(x1, 0, z1);
    rope.rotation.y = Math.atan2(-(z2 - z1), x2 - x1);
    group.add(rope);
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #2a0525 0%, #050005 70%)',
    description: 'Disco maximalism — illuminated tile deck, mirror ball beams, vinyl booth, and orbiting lights.',
    update(t, bounce = 0, spring = 0) {
      ball.rotation.y = t * 0.6;
      ball.rotation.x = Math.sin(t * 0.4) * 0.18;
      beamRig.rotation.y = -t * 0.35;
      sparkles.rotation.y = t * 0.8;
      discs.forEach((d) => { d.rotation.y = t * 3.0; });
      tileMat.emissiveIntensity = 0.85 + Math.sin(t * 3.5) * 0.2 + bounce * 0.45;

      lights.forEach(({ light, angle }) => {
        const a = angle + t * 0.5;
        light.position.set(Math.cos(a) * 4.2, 2.6, Math.sin(a) * 4.2);
        light.intensity = 2.1 + Math.sin(t * 3 + angle) * 0.5;
      });
      sparkles.children.forEach((s) => {
        s.scale.setScalar(1 + Math.sin(t * 4 + s.userData.phase) * 0.3);
      });

      group.rotation.z = spring * 0.005;
    },
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((tx) => tx.dispose());
    },
  };
}