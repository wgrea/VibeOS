// js/aesthetics/vaporwave/ghostpop.js

import * as THREE from 'three';

export function createGhostPop() {
  const group = new THREE.Group();

  // Procedural Warm Candlelight / Tarnished Brass Reflection Map
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 256;
  envCanvas.height = 128;
  const ctx = envCanvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0.0, '#fef9c3');
  grad.addColorStop(0.35, '#f59e0b');
  grad.addColorStop(0.7, '#78350f');
  grad.addColorStop(1.0, '#0c0a09');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 128);

  const envMap = new THREE.CanvasTexture(envCanvas);
  envMap.mapping = THREE.EquirectangularReflectionMapping;

  // 1. Unified Spectral Porcelain & Gramophone Assembly (Draggable / Arrow-Key Interactive)
  const ghostAssembly = new THREE.Group();
  const spiritGroup = new THREE.Group();

  // Warm glowing memory ember at the center
  const innerEmber = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xfde68a,
      transparent: true,
      opacity: 0.48,
    })
  );
  spiritGroup.add(innerEmber);

  // Translucent Pearl / Porcelain Spirit Shell
  const spiritOrb = new THREE.Mesh(
    new THREE.SphereGeometry(0.84, 48, 48),
    new THREE.MeshPhysicalMaterial({
      color: 0xfef3c7,
      emissive: 0xfbbf24,
      emissiveIntensity: 0.22,
      roughness: 0.14,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      transmission: 0.45,
      ior: 1.38,
      transparent: true,
      opacity: 0.72,
      envMap,
      envMapIntensity: 1.35,
    })
  );
  spiritGroup.add(spiritOrb);

  // Delicate Filigree Meridian Rings cradling the pearl orb
  const filigreeMat = new THREE.MeshStandardMaterial({
    color: 0xfcd34d,
    emissive: 0xb45309,
    emissiveIntensity: 0.35,
    metalness: 0.88,
    roughness: 0.25,
    envMap,
  });

  const meridian1 = new THREE.Mesh(new THREE.TorusGeometry(0.87, 0.012, 12, 72), filigreeMat);
  meridian1.rotation.y = Math.PI / 4;
  spiritGroup.add(meridian1);

  const meridian2 = new THREE.Mesh(new THREE.TorusGeometry(0.87, 0.012, 12, 72), filigreeMat);
  meridian2.rotation.x = Math.PI / 2;
  spiritGroup.add(meridian2);

  ghostAssembly.add(spiritGroup);

  // 2. Tarnished Antique Brass Gramophone Halo & Vinyl Grooves
  const haloGroup = new THREE.Group();
  haloGroup.rotation.x = Math.PI / 2.75;
  haloGroup.rotation.y = 0.16;

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    emissive: 0x92400e,
    emissiveIntensity: 0.42,
    metalness: 0.88,
    roughness: 0.26,
    envMap,
    envMapIntensity: 1.4,
  });

  // Outer carved brass ring
  const antiqueRing = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.048, 20, 96), brassMat);
  haloGroup.add(antiqueRing);

  // Inner concentric record-groove brass wire
  const grooveRing = new THREE.Mesh(new THREE.TorusGeometry(1.14, 0.016, 12, 96), filigreeMat);
  haloGroup.add(grooveRing);

  // Translucent smoked-amber vinyl disc sheen between rings
  const vinylDisc = new THREE.Mesh(
    new THREE.RingGeometry(1.02, 1.3, 72),
    new THREE.MeshPhysicalMaterial({
      color: 0x451a03,
      emissive: 0x78350f,
      emissiveIntensity: 0.25,
      roughness: 0.18,
      metalness: 0.5,
      transparent: true,
      opacity: 0.34,
      side: THREE.DoubleSide,
      envMap,
    })
  );
  haloGroup.add(vinylDisc);

  // Ornate brass cardinal studs around the halo
  for (let i = 0; i < 8; i++) {
    const stud = new THREE.Mesh(new THREE.OctahedronGeometry(0.055, 0), filigreeMat);
    const a = (i / 8) * Math.PI * 2;
    stud.position.set(Math.cos(a) * 1.32, Math.sin(a) * 1.32, 0);
    stud.rotation.z = a;
    haloGroup.add(stud);
  }

  ghostAssembly.add(haloGroup);
  group.add(ghostAssembly);

  // 3. Fading Sepia Memory Wisps & Soft Aura Halos
  const wisps = [];
  const wispCoreMat = new THREE.MeshBasicMaterial({
    color: 0xfef9c3,
    transparent: true,
    opacity: 0.8,
  });
  const wispHaloMat = new THREE.MeshBasicMaterial({
    color: 0xfde68a,
    transparent: true,
    opacity: 0.24,
  });

  for (let i = 0; i < 12; i++) {
    const wispPivot = new THREE.Group();
    const scale = 0.65 + (i % 4) * 0.25;

    const core = new THREE.Mesh(new THREE.SphereGeometry(0.045 * scale, 12, 12), wispCoreMat);
    const aura = new THREE.Mesh(new THREE.SphereGeometry(0.11 * scale, 12, 12), wispHaloMat);
    wispPivot.add(core, aura);

    const a = (i / 12) * Math.PI * 2;
    const r = 1.48 + (i % 3) * 0.18;
    const baseY = Math.sin(i * 1.6) * 0.52;

    wispPivot.position.set(Math.cos(a) * r, baseY, Math.sin(a) * r);
    group.add(wispPivot);

    wisps.push({
      mesh: wispPivot,
      aura,
      angle: a,
      radius: r,
      baseY,
      speed: 0.22 + (i % 3) * 0.06,
      phase: i * 0.9,
    });
  }

  // 4. Floating Sepia Vinyl Dust Motes
  const dustCount = 75;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const rad = 1.05 + Math.random() * 1.05;
    dustPositions[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
    dustPositions[i * 3 + 1] = rad * Math.cos(phi) * 0.75;
    dustPositions[i * 3 + 2] = rad * Math.sin(phi) * Math.sin(theta);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  const dustPoints = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      color: 0xfde68a,
      size: 0.022,
      transparent: true,
      opacity: 0.5,
    })
  );
  group.add(dustPoints);

  // Warm Ballroom Candlelight Illumination
  const candleLight = new THREE.PointLight(0xfbbf24, 2.8, 8);
  candleLight.position.set(0, 0.2, 0);
  group.add(candleLight);

  const rimLight = new THREE.DirectionalLight(0xfef3c7, 1.8);
  rimLight.position.set(2.5, 3.5, 2.5);
  group.add(rimLight);

  return {
    group,
    draggable: ghostAssembly,
    description:
      'Early-to-mid 2010s hauntological ballroom nostalgia—crackling vinyl warmth, tarnished antique brass, and spectral porcelain melodies fading through sepia static.',
    background: 'radial-gradient(circle at 50% 35%, #78350f 0%, #451a03 55%, #0c0a09 100%)',
    update(t, bounce, spring) {
      ghostAssembly.position.y = Math.sin(t * 0.9) * 0.06 - bounce * 0.15;

      // Gentle spectral bob & inner ember flicker
      spiritGroup.position.y = Math.sin(t * 1.2) * 0.12;
      spiritGroup.rotation.y = t * 0.28;
      innerEmber.scale.setScalar(0.95 + Math.sin(t * 3.2) * 0.08);
      candleLight.intensity = 2.6 + Math.sin(t * 4.1) * 0.35;

      // Gramophone turntable rotation & subtle tilt
      haloGroup.rotation.z = t * 0.35;
      haloGroup.rotation.y = 0.16 + Math.sin(t * 0.4) * 0.18;

      // Drifting sepia memory wisps
      wisps.forEach((wp) => {
        const a = wp.angle + t * wp.speed;
        wp.mesh.position.x = Math.cos(a) * wp.radius;
        wp.mesh.position.z = Math.sin(a) * wp.radius;
        wp.mesh.position.y = wp.baseY + Math.sin(t * 1.3 + wp.phase) * 0.18;
        wp.aura.scale.setScalar(0.85 + Math.sin(t * 2.2 + wp.phase) * 0.25);
      });

      // Slow dust mote drift
      dustPoints.rotation.y = -t * 0.09;
      dustPoints.position.y = Math.sin(t * 0.7) * 0.05;

      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
