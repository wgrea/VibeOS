// js/aesthetics/vaporwave/hexd.js

import * as THREE from 'three';

export function createHexd() {
  const group = new THREE.Group();

  // 1. Unified Bitcrushed Hexagonal Prism & Clipped Waveform Assembly (Draggable / Arrow-Key Interactive)
  const hexdGroup = new THREE.Group();

  // Overdriven Bitcrushed Hexagonal Prism Core
  const hexCore = new THREE.Mesh(
    new THREE.CylinderGeometry(0.82, 0.82, 0.92, 6),
    new THREE.MeshStandardMaterial({
      color: 0x3b0764,
      emissive: 0xa855f7,
      emissiveIntensity: 0.9,
      roughness: 0.18,
      metalness: 0.85,
      flatShading: true,
    })
  );
  hexdGroup.add(hexCore);

  // Inner Glowing White-Violet Clipped Core Heart
  const innerClip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.42, 0.96, 6),
    new THREE.MeshBasicMaterial({ color: 0xf5d0fe })
  );
  hexdGroup.add(innerClip);

  // Jagged Neon-Magenta Bitcrush Wireframe Shell
  const crushShell = new THREE.Mesh(
    new THREE.CylinderGeometry(1.16, 1.16, 1.24, 6),
    new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      wireframe: true,
    })
  );
  hexdGroup.add(crushShell);

  // Chromatic-Aberration Cyan Offset Wireframe Shell
  const cyanShell = new THREE.Mesh(
    new THREE.CylinderGeometry(1.22, 1.22, 1.18, 6),
    new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    })
  );
  hexdGroup.add(cyanShell);

  // Brickwall-Clipped Square Waveform Ring around Core
  const clipSegments = [];
  const segCount = 24;
  const segMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
  for (let i = 0; i < segCount; i++) {
    const a = (i / segCount) * Math.PI * 2;
    const isHigh = i % 4 < 2;
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.11, isHigh ? 0.24 : 0.06, 0.05), segMat);
    bar.position.set(Math.cos(a) * 1.38, isHigh ? 0.09 : -0.09, Math.sin(a) * 1.38);
    bar.rotation.y = -a + Math.PI / 2;
    hexdGroup.add(bar);
    clipSegments.push({ mesh: bar, idx: i });
  }

  group.add(hexdGroup);

  // 2. Orbiting Surge Glitch Voxel Cubes
  const cubes = [];
  const cubeMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 1.05,
    roughness: 0.2,
  });

  for (let i = 0; i < 6; i++) {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.21, 0.21), cubeMat);
    const a = (i / 6) * Math.PI * 2;
    c.position.set(Math.cos(a) * 1.68, 0, Math.sin(a) * 1.68);
    group.add(c);
    cubes.push({ mesh: c, angle: a });
  }

  // 3. Harsh Overdriven Magenta & Cyan Rim Lighting
  const magentaLight = new THREE.PointLight(0xf43f5e, 11, 11);
  magentaLight.position.set(2.0, 1.6, 2.2);
  group.add(magentaLight);

  const cyanLight = new THREE.PointLight(0x22d3ee, 11, 11);
  cyanLight.position.set(-2.0, -1.6, 2.2);
  group.add(cyanLight);

  return {
    group,
    draggable: hexdGroup,
    description:
      'Blown-out SoundCloud bitcrush, brickwall-clipped audio distortion, nightcore-pitched pop fragments, and corrupted .hex glitch energy.',
    background: 'radial-gradient(circle at 50% 35%, #581c87 0%, #1e1b4b 55%, #020617 100%)',
    update(t, bounce, spring) {
      // Stepped / bitcrushed low-sample-rate quantized clock
      const steppedT = Math.floor(t * 10) / 10;

      hexCore.rotation.y = steppedT * 1.9;
      hexCore.rotation.x = Math.sin(steppedT * 1.5) * 0.42;
      innerClip.rotation.y = -steppedT * 2.4;

      crushShell.rotation.y = -steppedT * 1.3;
      crushShell.rotation.z = Math.cos(steppedT * 1.2) * 0.32;

      cyanShell.rotation.y = -steppedT * 1.3 + 0.14;
      cyanShell.rotation.z = Math.cos(steppedT * 1.2) * 0.32 - 0.08;

      hexdGroup.position.y = -bounce * 0.2;

      // Quantized square-wave clipping bars snapping high/low
      clipSegments.forEach((seg) => {
        const flip = Math.sin(steppedT * 8 + seg.idx * 0.8) > 0;
        seg.mesh.scale.y = flip ? 1.35 : 0.55;
      });

      // Stepped voxel cube orbit
      cubes.forEach((cb, idx) => {
        const a = cb.angle + steppedT * 1.6;
        cb.mesh.position.x = Math.cos(a) * 1.68;
        cb.mesh.position.z = Math.sin(a) * 1.68;
        cb.mesh.position.y = Math.sin(steppedT * 6 + idx) * 0.35 - bounce * 0.18;
        cb.mesh.rotation.x = steppedT * 2.2;
        cb.mesh.rotation.y = steppedT * 2.2;
      });

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
