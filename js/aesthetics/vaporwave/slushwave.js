// js/aesthetics/vaporwave/slushwave.js

import * as THREE from 'three';

export function createSlushwave() {
  const group = new THREE.Group();

  // 1. Blurred Nocturnal Neon Mirror Surface
  const mirrorFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 14),
    new THREE.MeshPhysicalMaterial({
      color: 0x1e1b4b,
      roughness: 0.12,
      metalness: 0.75,
      clearcoat: 1.0,
    })
  );
  mirrorFloor.rotation.x = -Math.PI / 2;
  mirrorFloor.position.y = -1.2;
  group.add(mirrorFloor);

  // 2. Draggable Liquid-Melted Slushwave Core
  const slushGroup = new THREE.Group();

  const liquidGeo = new THREE.SphereGeometry(0.92, 48, 48);
  const liquidPos = liquidGeo.attributes.position;
  const basePos = new Float32Array(liquidPos.array);

  const liquidCore = new THREE.Mesh(
    liquidGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0xe879f9,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.55,
      roughness: 0.08,
      metalness: 0.25,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.82,
    })
  );
  slushGroup.add(liquidCore);

  // 3. Sweeping Phaser / Flanger Wave Ribbons
  const phaserRings = [];
  const ringColors = [0x38bdf8, 0xf472b6, 0xc084fc, 0x2dd4bf];

  ringColors.forEach((hex, i) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.18 + i * 0.14, 0.032, 16, 80),
      new THREE.MeshPhysicalMaterial({
        color: hex,
        emissive: hex,
        emissiveIntensity: 0.65,
        roughness: 0.1,
        transparent: true,
        opacity: 0.72,
      })
    );
    ring.rotation.x = Math.PI / 2.2 + i * 0.18;
    ring.rotation.y = i * 0.45;
    slushGroup.add(ring);
    phaserRings.push({ mesh: ring, speed: 0.28 - i * 0.04, phase: i * 1.1 });
  });

  group.add(slushGroup);

  // 4. Slow-Drifting Nocturnal Mist / Bokeh Droplets
  const bokehOrbs = [];
  for (let i = 0; i < 16; i++) {
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.06 + (i % 3) * 0.025, 14, 14),
      new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xf0abfc : 0x67e8f9,
        transparent: true,
        opacity: 0.45,
      })
    );
    const angle = (i / 16) * Math.PI * 2;
    const radius = 1.65 + (i % 4) * 0.25;
    orb.position.set(Math.cos(angle) * radius, -0.6 + (i % 5) * 0.35, Math.sin(angle) * radius);
    group.add(orb);
    bokehOrbs.push({ mesh: orb, angle, radius, baseY: orb.position.y, phase: i * 0.7 });
  }

  // 5. Lush Twilight Violet, Magenta & Cyan Lighting
  const magentaLight = new THREE.PointLight(0xf472b6, 11, 11);
  magentaLight.position.set(-2.2, 1.8, 2.2);
  group.add(magentaLight);

  const cyanLight = new THREE.PointLight(0x22d3ee, 11, 11);
  cyanLight.position.set(2.2, -1.2, 2.2);
  group.add(cyanLight);

  return {
    group,
    description:
      'Ultra-slowed, phaser-drenched 80s R&B and smooth-jazz loops submerged in liquid reverb, blurred neon city bokeh, and hypnotic twilight melancholy.',
    background: 'radial-gradient(circle at 50% 35%, #701a75 0%, #311042 55%, #090d16 100%)',
    update(t, bounce, spring) {
      // Heavy, liquid-slow phaser wave distortion on the core
      for (let i = 0; i < liquidPos.count; i++) {
        const bx = basePos[i * 3];
        const by = basePos[i * 3 + 1];
        const bz = basePos[i * 3 + 2];
        const slushWave =
          Math.sin(by * 3.2 - t * 1.3) * 0.08 + Math.cos(bx * 2.8 + t * 1.1) * 0.06;
        const scale = 1 + slushWave;
        liquidPos.setXYZ(i, bx * scale, by * scale, bz * scale);
      }
      liquidPos.needsUpdate = true;

      liquidCore.rotation.y = t * 0.18;
      slushGroup.position.y = Math.sin(t * 0.9) * 0.08 - bounce * 0.2;

      // Sweeping out-of-phase flanger ribbons
      phaserRings.forEach((r) => {
        r.mesh.rotation.z = t * r.speed;
        r.mesh.rotation.x = Math.PI / 2.2 + Math.sin(t * 0.55 + r.phase) * 0.28;
      });

      // Blurred neon bokeh drifting in slow motion
      bokehOrbs.forEach((b) => {
        const a = b.angle + t * 0.16;
        b.mesh.position.x = Math.cos(a) * b.radius;
        b.mesh.position.z = Math.sin(a) * b.radius;
        b.mesh.position.y = b.baseY + Math.sin(t * 0.8 + b.phase) * 0.15;
      });

      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
