// js/aesthetics/frutiger-aero/frutiger-galaxy.js
import * as THREE from 'three';

export function createFrutigerGalaxy() {
  const group = new THREE.Group();

  // 1. Glowing Violet Nebula Core (visible inside the translucent aqua shell)
  const innerCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.46, 24, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0xc084fc,
      emissive: 0x9333ea,
      emissiveIntensity: 1.15,
      roughness: 0.08,
      clearcoat: 1.0,
    })
  );
  group.add(innerCore);

  // 2. Translucent Aqua-Sky Cosmic Planet Shell
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(0.92, 32, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x1e1b4b,
      emissiveIntensity: 0.55,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transparent: true,
      opacity: 0.76,
      depthWrite: false,
    })
  );
  group.add(planet);

  // 3. Sweeping Translucent Aurora Nebula Ribbon (classic OS X / Wii cosmic wave)
  const auroraPoints = [];
  for (let i = 0; i <= 40; i++) {
    const u = i / 40;
    const angle = (u - 0.5) * Math.PI * 1.45;
    const r = 1.45 + Math.sin(u * Math.PI) * 0.25;
    const y = (u - 0.5) * 1.1;
    auroraPoints.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
  }
  const auroraRibbon = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(auroraPoints), 64, 0.09, 12, false),
    new THREE.MeshPhysicalMaterial({
      color: 0xe879f9,
      emissive: 0xa855f7,
      emissiveIntensity: 0.7,
      roughness: 0.05,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
    })
  );
  auroraRibbon.rotation.z = 0.35;
  group.add(auroraRibbon);

  // 4. Orbiting Glossy 4-Point Star-Sparkles & Translucent Bokeh Bubbles
  const orbGroup = new THREE.Group();
  const orbColors = [0xa855f7, 0x34d399, 0x67e8f9, 0xf472b6];
  const orbs = [];

  for (let i = 0; i < 14; i++) {
    const angle = (i / 14) * Math.PI * 2;
    const radius = 1.32 + (i % 3) * 0.34;
    const isStar = i % 2 === 0;

    const orb = new THREE.Mesh(
      isStar
        ? new THREE.OctahedronGeometry(0.11, 0)
        : new THREE.SphereGeometry(0.085, 16, 16),
      new THREE.MeshPhysicalMaterial({
        color: orbColors[i % orbColors.length],
        emissive: orbColors[i % orbColors.length],
        emissiveIntensity: isStar ? 0.85 : 0.45,
        roughness: 0.04,
        clearcoat: 1.0,
        transparent: !isStar,
        opacity: isStar ? 1.0 : 0.78,
      })
    );

    if (isStar) {
      orb.scale.set(0.65, 1.45, 0.65);
    }

    orb.position.set(
      Math.cos(angle) * radius,
      Math.sin(i * 1.4) * 0.52,
      Math.sin(angle) * radius
    );
    orbGroup.add(orb);
    orbs.push({ mesh: orb, baseY: orb.position.y, phase: i * 0.7, isStar });
  }
  group.add(orbGroup);


  return {
    group,
    description:
      'Blending early-2010s space wallpapers, OS X Lion/Mountain Lion cosmic backdrops, and aquatic bokeh lighting, Frutiger Galaxy fuses deep violet nebulae with glowing aqua planets, translucent Saturn rings, and floating bioluminescent star-bubbles.',
    background: 'radial-gradient(circle at 50% 35%, #3b0764 0%, #0c4a6e 55%, #030712 100%)',
    update(t, bounce, spring) {
      innerCore.scale.setScalar(1 + Math.sin(t * 2.4) * 0.06);
      planet.rotation.y = t * 0.45;
      auroraRibbon.rotation.y = Math.sin(t * 0.4) * 0.25;
      orbGroup.rotation.y = -t * 0.4;

      orbs.forEach((o) => {
        o.mesh.position.y = o.baseY + Math.sin(t * 2.2 + o.phase) * 0.12;
        if (o.isStar) {
          o.mesh.rotation.y = t * 1.6;
        }
      });

      group.scale.setScalar(1 + spring * 0.25);
    },

  };
}
