// js/aesthetics/frutiger-aero/abla-aero.js

import * as THREE from 'three';

function createWaveRibbonGeometry(radius, waveAmp, waveFreq, widthScale, phaseOffset = 0) {
  const points = [];
  const segments = 96;

  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 2;
    const r = radius + Math.sin(angle * waveFreq + phaseOffset) * (waveAmp * 0.6);
    const y = Math.cos(angle * waveFreq + phaseOffset) * waveAmp;
    points.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
  }

  const curve = new THREE.CatmullRomCurve3(points, true);
  const tubeGeo = new THREE.TubeGeometry(curve, 120, 0.085, 12, true);

  // Flatten the circular tube cross-section into a sleek, flowing silk/liquid ribbon
  const pos = tubeGeo.attributes.position;
  const v = new THREE.Vector3();
  const center = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    const ringIndex = Math.floor(i / 13);
    const u = (ringIndex % 120) / 120;
    curve.getPointAt(u, center);

    v.fromBufferAttribute(pos, i).sub(center);
    v.y *= widthScale;
    v.x *= 0.45;
    v.z *= 0.45;
    v.add(center);

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  tubeGeo.computeVertexNormals();
  return tubeGeo;
}

export function createAblaAero() {
  const group = new THREE.Group();

  // 1. Dual-Layer Sunlit Coral & Golden-Hour Glass Core
  const coreGroup = new THREE.Group();

  const innerSun = new THREE.Mesh(
    new THREE.SphereGeometry(0.58, 32, 32),
    new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.55,
      roughness: 0.18,
    })
  );
  coreGroup.add(innerSun);

  const outerGlassOrb = new THREE.Mesh(
    new THREE.SphereGeometry(0.84, 40, 40),
    new THREE.MeshPhysicalMaterial({
      color: 0xfb7185,
      emissive: 0xe11d48,
      emissiveIntensity: 0.2,
      roughness: 0.04,
      transmission: 0.88,
      thickness: 0.95,
      ior: 1.43,
      iridescence: 0.65,
      iridescenceIOR: 1.32,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    })
  );
  coreGroup.add(outerGlassOrb);
  group.add(coreGroup);

  // 2. Sculpted Flowing Sunset Silk & Liquid Wave Ribbons
  const goldRibbonMat = new THREE.MeshPhysicalMaterial({
    color: 0xfbbf24,
    emissive: 0xd97706,
    emissiveIntensity: 0.3,
    roughness: 0.07,
    transmission: 0.55,
    thickness: 0.3,
    ior: 1.4,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.92,
  });

  const coralRibbonMat = new THREE.MeshPhysicalMaterial({
    color: 0xf43f5e,
    emissive: 0xbe123c,
    emissiveIntensity: 0.28,
    roughness: 0.06,
    transmission: 0.6,
    thickness: 0.3,
    ior: 1.42,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.9,
  });

  const ribbon1 = new THREE.Mesh(
    createWaveRibbonGeometry(1.28, 0.24, 3, 1.85, 0),
    goldRibbonMat
  );
  ribbon1.rotation.x = Math.PI / 3.4;
  group.add(ribbon1);

  const ribbon2 = new THREE.Mesh(
    createWaveRibbonGeometry(1.16, 0.22, 2, 1.7, Math.PI / 2),
    coralRibbonMat
  );
  ribbon2.rotation.y = Math.PI / 2.6;
  ribbon2.rotation.z = -0.3;
  group.add(ribbon2);

  // 3. Translucent Iridescent Golden-Hour Bokeh Bubbles
  const bubbleMat = new THREE.MeshPhysicalMaterial({
    color: 0xfef3c7,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.18,
    roughness: 0.02,
    transmission: 0.92,
    thickness: 0.35,
    ior: 1.34,
    iridescence: 1.0,
    iridescenceIOR: 1.3,
    clearcoat: 1.0,
  });

  const bubbles = [];
  const bubbleCount = 9;
  for (let i = 0; i < bubbleCount; i++) {
    const radius = 0.07 + (i % 3) * 0.032;
    const b = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 20), bubbleMat);
    const a = (i / bubbleCount) * Math.PI * 2;
    const orbitR = 1.45 + (i % 2) * 0.18;
    const baseY = Math.sin(i * 1.4) * 0.46;

    b.position.set(Math.cos(a) * orbitR, baseY, Math.sin(a) * orbitR);
    group.add(b);
    bubbles.push({ mesh: b, angle: a, orbitR, baseY, phase: i * 0.85 });
  }

  return {
    group,
    description:
      'A warm, golden-hour evolution of Frutiger Aero, Abla Aero trades cool cyans for sunset coral, rose-tinted glass, flowing silk wave ribbons, and iridescent dusk-lit bokeh bubbles.',
    background: 'radial-gradient(circle at 50% 30%, #ffe4e6 0%, #fda4af 45%, #f59e0b 100%)',
    update(t, bounce, spring) {
      coreGroup.rotation.y = t * 0.35;
      coreGroup.position.y = Math.sin(t * 1.9) * 0.05 - bounce * 0.4;
      innerSun.scale.setScalar(1 + Math.sin(t * 2.8) * 0.05);

      ribbon1.rotation.y = t * 0.45;
      ribbon1.rotation.z = Math.sin(t * 0.6) * 0.18;

      ribbon2.rotation.x = -t * 0.52;
      ribbon2.rotation.y = Math.PI / 2.6 + t * 0.3;

      bubbles.forEach((b) => {
        const a = b.angle + t * 0.38;
        b.mesh.position.x = Math.cos(a) * b.orbitR;
        b.mesh.position.z = Math.sin(a) * b.orbitR;
        b.mesh.position.y = b.baseY + Math.sin(t * 2.1 + b.phase) * 0.14;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
