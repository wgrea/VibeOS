// js/aesthetics/vaporwave/dariacore.js

import * as THREE from 'three';

export function createDariacore() {
  const group = new THREE.Group();

  // Procedural High-Saturation Candy-Chrome Studio Reflection Map
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 256;
  envCanvas.height = 128;
  const ctx = envCanvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 256, 128);
  grad.addColorStop(0.0, '#ff007f');
  grad.addColorStop(0.28, '#ffffff');
  grad.addColorStop(0.55, '#00f0ff');
  grad.addColorStop(0.8, '#ffe600');
  grad.addColorStop(1.0, '#7000ff');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 128);

  const envMap = new THREE.CanvasTexture(envCanvas);
  envMap.mapping = THREE.EquirectangularReflectionMapping;

  const palette = [0xff007f, 0x00f0ff, 0xffe600, 0x7000ff, 0x00ff66];

  // 1. Unified Hyperflip Mashup Core & Splice Cage (Draggable / Arrow-Key Interactive)
  const dariacoreAssembly = new THREE.Group();
  const coreGroup = new THREE.Group();

  // Glossy Hot-Pink Candy Torus Knot Core
  const mainKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.48, 0.14, 72, 14, 2, 3),
    new THREE.MeshPhysicalMaterial({
      color: 0xff007f,
      emissive: 0xdb2777,
      emissiveIntensity: 0.48,
      roughness: 0.05,
      metalness: 0.25,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      iridescence: 0.95,
      envMap,
      envMapIntensity: 1.65,
    })
  );
  coreGroup.add(mainKnot);

  // Oversized Cyan Wireframe Splice Cage
  const wireCage = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.82, 0),
    new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    })
  );
  coreGroup.add(wireCage);

  // Stuttering SoundCloud Waveform Equalizer Ring around the Core
  const eqBars = [];
  const barCount = 24;
  const barGeo = new THREE.BoxGeometry(0.045, 0.22, 0.045);

  for (let i = 0; i < barCount; i++) {
    const col = palette[i % palette.length];
    const bar = new THREE.Mesh(
      barGeo,
      new THREE.MeshBasicMaterial({ color: col })
    );
    const a = (i / barCount) * Math.PI * 2;
    const r = 0.95;
    bar.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    bar.rotation.y = -a;
    coreGroup.add(bar);
    eqBars.push({ mesh: bar, idx: i });
  }

  dariacoreAssembly.add(coreGroup);

  // 2. Crossed High-BPM Breakbeat Orbit Tracks
  const track1 = new THREE.Mesh(
    new THREE.TorusGeometry(1.26, 0.016, 12, 84),
    new THREE.MeshBasicMaterial({
      color: 0xffe600,
      transparent: true,
      opacity: 0.7,
    })
  );
  track1.rotation.x = Math.PI / 2.2;
  track1.rotation.y = 0.25;
  dariacoreAssembly.add(track1);

  const track2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.46, 0.014, 12, 84),
    new THREE.MeshBasicMaterial({
      color: 0x00ff66,
      transparent: true,
      opacity: 0.55,
    })
  );
  track2.rotation.x = -Math.PI / 2.4;
  track2.rotation.y = -0.35;
  dariacoreAssembly.add(track2);

  group.add(dariacoreAssembly);

  // 3. Pitched-Up Sample Discs & Hyperpop Geometric Mashup Primitives
  const primitives = [];
  const geos = [
    new THREE.CylinderGeometry(0.32, 0.32, 0.04, 24), // Sampled pop CD / vinyl disc
    new THREE.ConeGeometry(0.3, 0.64, 5), // Sharp synth spike
    new THREE.BoxGeometry(0.4, 0.4, 0.4), // Chopped beat block
    new THREE.OctahedronGeometry(0.34, 0), // Nightcore crystal
  ];

  geos.forEach((geo, idx) => {
    const color = palette[idx + 1];
    const pivot = new THREE.Group();

    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshPhysicalMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.52,
        roughness: 0.06,
        metalness: 0.25,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        envMap,
        envMapIntensity: 1.55,
      })
    );

    // Contrasting neon splice ring around each orbiting sample primitive
    const accentRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.015, 8, 32),
      new THREE.MeshBasicMaterial({
        color: palette[(idx + 2) % palette.length],
      })
    );
    accentRing.rotation.x = Math.PI / 3;

    pivot.add(mesh, accentRing);

    const a = (idx / geos.length) * Math.PI * 2;
    const baseY = (idx % 2 === 0 ? 1 : -1) * 0.36;
    pivot.position.set(Math.cos(a) * 1.26, baseY, Math.sin(a) * 1.26);

    group.add(pivot);
    primitives.push({
      pivot,
      mesh,
      accentRing,
      idx,
      baseAngle: a,
      baseY,
    });
  });

  // 4. Rapid-Fire Confetti / Sample-Chop Sparks
  const sparks = [];
  const sparkGeo = new THREE.TetrahedronGeometry(0.075, 0);
  for (let i = 0; i < 16; i++) {
    const c = palette[i % palette.length];
    const spark = new THREE.Mesh(
      sparkGeo,
      new THREE.MeshBasicMaterial({ color: c })
    );
    const a = (i / 16) * Math.PI * 2;
    const r = 1.54 + (i % 3) * 0.22;
    const y = Math.sin(i * 1.9) * 0.65;
    spark.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
    group.add(spark);
    sparks.push({ mesh: spark, angle: a, radius: r, baseY: y, idx: i });
  }

  // Punchy Neon Studio Lights
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(2.5, 4.0, 3.0);
  group.add(keyLight);

  const rimLight = new THREE.PointLight(0x00f0ff, 2.8, 8);
  rimLight.position.set(-2.0, -1.5, 2.0);
  group.add(rimLight);

  return {
    group,
    description:
      'Early-2020s SoundCloud hyperflip maximalism—pitch-shifted pop samples, oversaturated candy-chrome gloss, stuttering waveforms, and rapid-fire breakbeat splice chaos.',
    background: 'radial-gradient(circle at 50% 35%, #db2777 0%, #4f46e5 55%, #090d16 100%)',
    update(t, bounce, spring) {
      dariacoreAssembly.position.y = Math.sin(t * 1.6) * 0.06 - bounce * 0.18;

      // Quantized stutter step mixed with high-BPM spin
      const chop = Math.floor(t * 12) / 12;
      const stutterPulse = 1 + Math.pow(Math.sin(t * 6.5), 6) * 0.15;

      mainKnot.rotation.x = t * 1.75;
      mainKnot.rotation.y = -t * 2.2;
      mainKnot.scale.setScalar(stutterPulse);

      wireCage.rotation.y = chop * 1.5;
      wireCage.rotation.z = -chop * 1.2;

      // Stuttering SoundCloud waveform bars reacting to quantized beats
      eqBars.forEach(({ mesh, idx }) => {
        const beat = Math.abs(Math.sin(chop * 9.0 + idx * 0.85));
        mesh.scale.y = 0.35 + Math.pow(beat, 2) * 2.1;
      });

      // Rapid pitch-shifted orbital sample primitives
      primitives.forEach(({ pivot, mesh, accentRing, idx, baseAngle, baseY }) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        mesh.rotation.x = t * (2.3 + idx * 0.4) * dir;
        mesh.rotation.y = t * (2.7 + idx * 0.3) * -dir;
        accentRing.rotation.z = t * 3.4 * dir;

        const a = baseAngle + t * 1.9;
        pivot.position.x = Math.cos(a) * 1.26;
        pivot.position.z = Math.sin(a) * 1.26;
        pivot.position.y = baseY + Math.sin(t * 3.8 + idx * 1.5) * 0.18;
      });

      // Gyroscopic breakbeat track wobble
      track1.rotation.z = t * 1.35;
      track2.rotation.z = -t * 1.65;

      // Sample-chop confetti orbit
      sparks.forEach((sp) => {
        const a = sp.angle - t * 1.45;
        sp.mesh.position.x = Math.cos(a) * sp.radius;
        sp.mesh.position.z = Math.sin(a) * sp.radius;
        sp.mesh.position.y = sp.baseY + Math.cos(chop * 5.5 + sp.idx) * 0.16;
        sp.mesh.rotation.x = t * 4.2 + sp.idx;
        sp.mesh.rotation.y = t * 3.6;
      });

      group.scale.setScalar(1 + spring * 0.3);
    },
  };
}
