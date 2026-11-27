// js/aesthetics/vaporwave/slopwave.js

import * as THREE from 'three';

export function createSlopwave() {
  const group = new THREE.Group();

  // Procedural "Over-Smooth Algorithmic Nostalgia" Reflection Map
  // Too-perfect pastel gradient with a faint uncanny seam — mass-produced gloss.
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 256;
  envCanvas.height = 128;
  const ctx = envCanvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 256, 128);
  grad.addColorStop(0.0, '#a5b4fc');
  grad.addColorStop(0.35, '#f9a8d4');
  grad.addColorStop(0.65, '#fcd34d');
  grad.addColorStop(1.0, '#7dd3fc');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 128);

  // The tell: one faint, slightly-wrong horizontal seam (compression artifact)
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(0, 62, 256, 2);

  const envMap = new THREE.CanvasTexture(envCanvas);
  envMap.mapping = THREE.EquirectangularReflectionMapping;

  // 1. Unified "Effortless Output" Assembly (Draggable / Arrow-Key Interactive)
  const slopAssembly = new THREE.Group();
  const coreGroup = new THREE.Group();

  // Over-smooth UV-sphere blob — the platonic "AI generated 3D render" object
  const slopGeo = new THREE.SphereGeometry(0.9, 96, 96);
  const basePositions = Float32Array.from(slopGeo.attributes.position.array);
  const baseNormals = Float32Array.from(slopGeo.attributes.normal.array);

  const slopBlob = new THREE.Mesh(
    slopGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0xfbcfe8,
      emissive: 0x6366f1,
      emissiveIntensity: 0.22,
      roughness: 0.02,       // unrealistically smooth
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      iridescence: 0.35,
      envMap,
      envMapIntensity: 1.9,  // too much reflection = "airbrushed gloss"
    })
  );
  coreGroup.add(slopBlob);

  slopAssembly.add(coreGroup);

  // 2. Uniform Chrome Halo — the stock "AI shiny ring" that appears in every render
  const chromeHalo = new THREE.Mesh(
    new THREE.TorusGeometry(1.34, 0.06, 32, 128),
    new THREE.MeshPhysicalMaterial({
      color: 0xe0e7ff,
      metalness: 1.0,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      envMap,
      envMapIntensity: 2.0,
    })
  );
  chromeHalo.rotation.x = Math.PI / 2.4;
  slopAssembly.add(chromeHalo);

  // Secondary pastel ring — the generic "AI pastel accent" trope
  const pastelRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.12, 0.03, 20, 96),
    new THREE.MeshStandardMaterial({
      color: 0xfcd34d,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.4,
      roughness: 0.15,
      metalness: 0.6,
      envMap,
    })
  );
  pastelRing.rotation.y = Math.PI / 3;
  pastelRing.rotation.z = Math.PI / 5;
  slopAssembly.add(pastelRing);

  // 3. Floating "Prompt Tokens" — identical glossy capsules, no variation
  //    (deliberately uniform = algorithmically mass-produced, unlike prompt-core's varied cubes)
  const capsules = [];
  const capsuleGeo = new THREE.CapsuleGeometry(0.05, 0.14, 6, 12);

  for (let i = 0; i < 14; i++) {
    const capsule = new THREE.Mesh(
      capsuleGeo,
      new THREE.MeshPhysicalMaterial({
        color: 0xfdf2f8,
        emissive: 0x818cf8,
        emissiveIntensity: 0.25,
        roughness: 0.04,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        envMap,
        envMapIntensity: 1.7,
      })
    );

    const a = (i / 14) * Math.PI * 2;
    const radius = 1.5 + (i % 2) * 0.16;
    const y = (i % 2 === 0 ? 1 : -1) * 0.34;
    capsule.position.set(Math.cos(a) * radius, y, Math.sin(a) * radius);
    capsule.rotation.set(a, a * 0.5, 0);

    slopAssembly.add(capsule);
    capsules.push({ mesh: capsule, angle: a, radius, baseY: y, idx: i });
  }

  group.add(slopAssembly);

  // 4. Flat "Generic Soft Studio" Lighting — no drama, no shadows, no authorship
  const softKey = new THREE.DirectionalLight(0xffffff, 2.2);
  softKey.position.set(2, 3, 3);
  group.add(softKey);

  const softFill = new THREE.DirectionalLight(0xc7d2fe, 1.6);
  softFill.position.set(-3, 1, 2);
  group.add(softFill);

  const softRim = new THREE.PointLight(0xf9a8d4, 1.4, 14);
  softRim.position.set(0, -2.5, -2.5);
  group.add(softRim);

  // Ambient wash kills all contrast — the "airbrushed" flattened look
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  group.add(ambient);

  return {
    group,
    description:
      'Mid-2020s AI-generated retro-futurism—over-smooth pastel blobs, uniform chrome halos, identical glossy tokens, and flat airbrushed lighting. The effortless, algorithmically mass-produced nostalgia that Prompt-Core critiques.',
    background: 'radial-gradient(circle at 50% 40%, #c7d2fe 0%, #fbcfe8 50%, #a5b4fc 100%)',
    update(t, bounce, spring) {
      slopAssembly.position.y = Math.sin(t * 0.9) * 0.05 - bounce * 0.18;

      // Slow, lazy, "rendered in one pass" vertex breathing — too smooth to be organic
      const posAttr = slopGeo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const i3 = i * 3;
        const bx = basePositions[i3];
        const by = basePositions[i3 + 1];
        const bz = basePositions[i3 + 2];

        const nx = baseNormals[i3];
        const ny = baseNormals[i3 + 1];
        const nz = baseNormals[i3 + 2];

        const wave =
          Math.sin(bx * 2.2 + t * 1.3) *
          Math.cos(bz * 2.2 - t * 1.1) *
          0.014;

        posAttr.setXYZ(i, bx + nx * wave, by + ny * wave, bz + nz * wave);
      }
      posAttr.needsUpdate = true;

      coreGroup.rotation.y = t * 0.4;
      coreGroup.rotation.x = Math.sin(t * 0.5) * 0.15;

      chromeHalo.rotation.z = t * 0.55;
      chromeHalo.rotation.y = Math.sin(t * 0.7) * 0.3;

      pastelRing.rotation.x = Math.sin(t * 0.6) * 0.4;
      pastelRing.rotation.z = Math.PI / 5 + t * 0.35;

      // Identical capsule drift — every token moves the same way (uniform = algorithmic)
      capsules.forEach((c) => {
        const a = c.angle + t * 0.45;
        c.mesh.position.x = Math.cos(a) * c.radius;
        c.mesh.position.z = Math.sin(a) * c.radius;
        c.mesh.position.y = c.baseY + Math.sin(t * 1.2 + c.idx * 0.5) * 0.08;
        c.mesh.rotation.y = a * 0.5 + t * 0.3;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}