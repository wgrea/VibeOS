// js/aesthetics/vaporwave/vaportrap.js

import * as THREE from 'three';

export function createVaportrap() {
  const group = new THREE.Group();

  // 1. Unified 808 Sub-Speaker Cabinet Group (Draggable / Arrow-Key Interactive)
  const speakerGroup = new THREE.Group();

  // Heavy Metallic Chrome-Indigo 808 Sub-Speaker Cube
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1.32, 1.32, 1.32),
    new THREE.MeshPhysicalMaterial({
      color: 0x1e1b4b,
      metalness: 0.85,
      roughness: 0.14,
      clearcoat: 1.0,
    })
  );
  speakerGroup.add(box);

  // Subtle Neon Cyan Edge Frame around Speaker Cabinet
  const cabinetEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(1.34, 1.34, 1.34)),
    new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.55 })
  );
  speakerGroup.add(cabinetEdges);

  // Dark Acoustic Woofer Cone Backing
  const coneBacking = new THREE.Mesh(
    new THREE.CircleGeometry(0.46, 36),
    new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.6, metalness: 0.3 })
  );
  coneBacking.position.z = 0.665;
  speakerGroup.add(coneBacking);

  // Neon Magenta Bass Surround Ring
  const woofer = new THREE.Mesh(
    new THREE.TorusGeometry(0.45, 0.075, 16, 48),
    new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 1.35,
      roughness: 0.2,
    })
  );
  woofer.position.z = 0.67;
  speakerGroup.add(woofer);

  // Glossy Center Dust Cap
  const dustCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.45),
    new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.45,
      roughness: 0.1,
      clearcoat: 1.0,
    })
  );
  dustCap.rotation.x = Math.PI / 2;
  dustCap.position.z = 0.64;
  speakerGroup.add(dustCap);

  group.add(speakerGroup);

  // 2. Expanding 808 Sub-Bass Shockwave Ring
  const shockwave = new THREE.Mesh(
    new THREE.TorusGeometry(0.95, 0.018, 12, 64),
    new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.6,
    })
  );
  shockwave.rotation.x = Math.PI / 2;
  shockwave.position.y = -0.85;
  group.add(shockwave);

  // 3. Floating Trap Hi-Hat / Synth Pyramids
  const pyramids = [];
  const pyrMat = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.85,
    metalness: 0.65,
    roughness: 0.18,
  });

  for (let i = 0; i < 4; i++) {
    const pyr = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.38, 4), pyrMat);
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    pyr.position.set(Math.cos(a) * 1.48, 0, Math.sin(a) * 1.48);
    group.add(pyr);
    pyramids.push({ mesh: pyr, angle: a });
  }

  // 4. Dark Neon Cyberpunk Grid Floor & Rim Lights
  const grid = new THREE.GridHelper(12, 24, 0xf43f5e, 0x1e1b4b);
  grid.position.y = -1.25;
  grid.material.transparent = true;
  grid.material.opacity = 0.45;
  group.add(grid);

  const magentaLight = new THREE.PointLight(0xf43f5e, 10, 12);
  magentaLight.position.set(2.2, 1.8, 2.8);
  group.add(magentaLight);

  const cyanLight = new THREE.PointLight(0x22d3ee, 10, 12);
  cyanLight.position.set(-2.2, -1.2, 2.8);
  group.add(cyanLight);

  return {
    group,
    draggable: speakerGroup,
    description:
      'Dreamy 90s vaporwave synth pads fused with booming 808 sub-bass, crisp TR-808 hi-hat rolls, and dark neon cyberpunk energy.',
    background: 'radial-gradient(circle at 50% 35%, #4c1d95 0%, #1e1b4b 55%, #090d16 100%)',
    update(t, bounce, spring) {
      // Rhythmic 808 bass pulse
      const beat = Math.pow(Math.abs(Math.sin(t * 4.2)), 6);
      const pulse = 1 + beat * 0.24;

      woofer.scale.set(pulse, pulse, 1);
      dustCap.position.z = 0.64 + beat * 0.06;

      speakerGroup.rotation.y = t * 0.5;
      speakerGroup.rotation.x = Math.sin(t * 0.7) * 0.2;

      // 808 shockwave ripple synced to beat
      const waveExpand = 1 + beat * 0.65;
      shockwave.scale.set(waveExpand, waveExpand, 1);
      shockwave.material.opacity = 0.2 + beat * 0.55;

      // Orbiting pyramids with rapid hi-hat roll micro-stutter
      const hiHatRoll = Math.sin(t * 24) * 0.035;
      pyramids.forEach((p, idx) => {
        const a = p.angle + t * 0.9;
        p.mesh.position.x = Math.cos(a) * 1.48;
        p.mesh.position.z = Math.sin(a) * 1.48;
        p.mesh.position.y = Math.sin(t * 4.2 + idx) * 0.24 + hiHatRoll - bounce * 0.2;
        p.mesh.rotation.y = -t * 1.8;
      });

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
