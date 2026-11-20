import * as THREE from 'three';

export function createFrutigerAurora() {
  const group = new THREE.Group();
  const coreGroup = new THREE.Group();
  group.add(coreGroup);

  // 1. Procedural Aurora Sky Reflection Map (for wet glass specular bands on the dew orb)
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 256;
  envCanvas.height = 128;
  const ctx = envCanvas.getContext('2d');
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 128);
  skyGrad.addColorStop(0.0, '#ecfdf5');
  skyGrad.addColorStop(0.3, '#6ee7b7');
  skyGrad.addColorStop(0.6, '#38bdf8');
  skyGrad.addColorStop(1.0, '#818cf8');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 256, 128);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillRect(25, 16, 100, 14);
  ctx.fillRect(140, 24, 90, 12);

  const envTex = new THREE.CanvasTexture(envCanvas);
  envTex.mapping = THREE.EquirectangularReflectionMapping;
  envTex.colorSpace = THREE.SRGBColorSpace;

  // 2. Central Refractive Iridescent Dew Orb + Inner Aurora Core
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.66, 48, 48),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.03,
      metalness: 0.0,
      transmission: 0.9,
      thickness: 1.1,
      ior: 1.46,
      iridescence: 1.0,
      iridescenceIOR: 1.38,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      envMap: envTex,
      envMapIntensity: 1.4,
    })
  );
  coreGroup.add(orb);

  // Glowing emerald-aqua core suspended inside the glass orb
  const innerGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xa7f3d0,
      transparent: true,
      opacity: 0.85,
    })
  );
  coreGroup.add(innerGlow);

  // Delicate glossy glass halo ring tilted around the dew orb
  const haloRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.86, 0.018, 16, 72),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0x6ee7b7,
      emissiveIntensity: 0.35,
      roughness: 0.05,
      clearcoat: 1.0,
      envMap: envTex,
    })
  );
  haloRing.rotation.set(Math.PI / 2.6, 0.25, 0);
  coreGroup.add(haloRing);

  // 3. Flowing Translucent Silk Aurora Curtains (wide sculpted ribbons with base wave storage)
  const ribbonSpecs = [
    { color: 0x34d399, emissive: 0x10b981, yOffset: -0.22, zOffset: -0.35, width: 0.58, phase: 0.0 },
    { color: 0x22d3ee, emissive: 0x06b6d4, yOffset: 0.08, zOffset: 0.15, width: 0.64, phase: 1.4 },
    { color: 0xc084fc, emissive: 0x9333ea, yOffset: 0.34, zOffset: -0.15, width: 0.52, phase: 2.8 },
  ];

  const ribbons = ribbonSpecs.map((spec) => {
    const segX = 64;
    const segY = 12;
    const geom = new THREE.PlaneGeometry(4.2, spec.width, segX, segY);
    const pos = geom.attributes.position;
    const baseCoords = new Float32Array(pos.array.length);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const nx = x / 2.1;

      const waveY = Math.sin(nx * Math.PI * 1.35 + spec.phase) * 0.42;
      const waveZ = Math.cos(nx * Math.PI * 1.15 + spec.phase) * 0.48;

      pos.setXYZ(i, x, y + waveY, waveZ);
    }
    pos.needsUpdate = true;
    baseCoords.set(pos.array);
    geom.computeVertexNormals();

    const mat = new THREE.MeshPhysicalMaterial({
      color: spec.color,
      emissive: spec.emissive,
      emissiveIntensity: 0.45,
      roughness: 0.14,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0.68,
      side: THREE.DoubleSide,
      depthWrite: false,
      envMap: envTex,
    });

    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(0, spec.yOffset, spec.zOffset);
    mesh.rotation.z = (spec.phase - 1.4) * 0.08;
    group.add(mesh);

    return { mesh, geom, baseCoords, spec };
  });

  // 4. Drifting Bioluminescent Bokeh Motes
  const moteColors = [0xa7f3d0, 0x67e8f9, 0xe9d5ff, 0xffffff];
  const motes = Array.from({ length: 18 }, (_, i) => {
    const hex = moteColors[i % moteColors.length];
    const mote = new THREE.Mesh(
      new THREE.SphereGeometry(0.038 + (i % 3) * 0.018, 12, 12),
      new THREE.MeshBasicMaterial({
        color: hex,
        transparent: true,
        opacity: 0.85,
      })
    );

    const x = ((i % 6) - 2.5) * 0.72 + Math.sin(i) * 0.2;
    const y = ((i % 4) - 1.5) * 0.55;
    const z = ((i % 5) - 2) * 0.45;
    mote.position.set(x, y, z);
    group.add(mote);

    return { mesh: mote, baseX: x, baseY: y, baseZ: z, phase: i * 0.65 };
  });

  return {
    group,
    description:
      'Merging crisp Frutiger Aero glass with celestial northern lights, Frutiger Aurora layers translucent emerald, cyan, and twilight-violet silk curtains around an iridescent dew sphere and drifting bokeh motes.',
    background: 'radial-gradient(circle at 50% 30%, #ecfdf5 0%, #6ee7b7 45%, #0284c7 100%)',
    update(t, bounce, spring) {
      coreGroup.position.y = Math.sin(t * 1.6) * 0.05 - bounce * 0.35;
      coreGroup.rotation.y = t * 0.25;

      orb.scale.setScalar(1 + spring * 0.32);
      innerGlow.scale.setScalar(1 + Math.sin(t * 2.6) * 0.12);
      haloRing.rotation.z = t * 0.4;

      ribbons.forEach(({ mesh, geom, baseCoords, spec }, idx) => {
        const pos = geom.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const ix = i * 3;
          const bx = baseCoords[ix];
          const by = baseCoords[ix + 1];
          const bz = baseCoords[ix + 2];

          const rippleY = Math.sin(bx * 1.6 + t * 1.45 + spec.phase) * 0.14;
          const rippleZ = Math.cos(bx * 1.4 + t * 1.2 + spec.phase) * 0.18;

          pos.setXYZ(i, bx, by + rippleY, bz + rippleZ);
        }
        pos.needsUpdate = true;

        mesh.position.y = spec.yOffset + Math.sin(t * 1.3 + idx) * 0.08 + bounce * 0.2;
        mesh.rotation.y = Math.sin(t * 0.7 + idx * 0.9) * 0.18;
      });

      motes.forEach((m) => {
        m.mesh.position.y = m.baseY + Math.sin(t * 1.5 + m.phase) * 0.14;
        m.mesh.position.x = m.baseX + Math.cos(t * 1.1 + m.phase) * 0.1;
        m.mesh.scale.setScalar(0.85 + Math.sin(t * 3.0 + m.phase) * 0.25);
      });

      group.scale.setScalar(1 + spring * 0.22);
    },
  };
}
