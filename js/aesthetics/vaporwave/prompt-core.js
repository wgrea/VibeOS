// js/aesthetics/vaporwave/prompt-core.js

import * as THREE from 'three';

export function createPromptCore() {
  const group = new THREE.Group();

  // Procedural Iridescent Brass-to-Ultraviolet Latent Reflection Map
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 256;
  envCanvas.height = 128;
  const ctx = envCanvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 256, 128);
  grad.addColorStop(0.0, '#fbbf24');
  grad.addColorStop(0.32, '#ec4899');
  grad.addColorStop(0.65, '#7c3aed');
  grad.addColorStop(1.0, '#22d3ee');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 128);

  const envMap = new THREE.CanvasTexture(envCanvas);
  envMap.mapping = THREE.EquirectangularReflectionMapping;

  // 1. Unified Latent-Space Manifold & Harmonic Lattice (Draggable / Arrow-Key Interactive)
  const promptAssembly = new THREE.Group();
  const coreGroup = new THREE.Group();

  // Surreal Morphing Latent-Space Torus Knot
  const knotGeo = new THREE.TorusKnotGeometry(0.74, 0.22, 128, 24, 3, 5);
  const basePositions = Float32Array.from(knotGeo.attributes.position.array);
  const baseNormals = Float32Array.from(knotGeo.attributes.normal.array);

  const latentBlob = new THREE.Mesh(
    knotGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.48,
      roughness: 0.1,
      metalness: 0.72,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      iridescence: 1.0,
      iridescenceIOR: 1.5,
      envMap,
      envMapIntensity: 1.65,
    })
  );
  coreGroup.add(latentBlob);

  // Inner Bioluminescent Singularity Core
  const innerCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.34, 1),
    new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    })
  );
  coreGroup.add(innerCore);
  promptAssembly.add(coreGroup);

  // 2. Nested Brass Jazz-Harmonic & Latent Lattice Cages
  const cageGroup = new THREE.Group();

  const outerJazzCage = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.32, 0),
    new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    })
  );
  cageGroup.add(outerJazzCage);

  const innerSynthCage = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.08, 0),
    new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    })
  );
  cageGroup.add(innerSynthCage);

  // Metallic Brass Equinox Orbit Ring
  const brassEquator = new THREE.Mesh(
    new THREE.TorusGeometry(1.38, 0.016, 12, 84),
    new THREE.MeshStandardMaterial({
      color: 0xfcd34d,
      emissive: 0xb45309,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.2,
      envMap,
    })
  );
  brassEquator.rotation.x = Math.PI / 2.3;
  cageGroup.add(brassEquator);

  promptAssembly.add(cageGroup);
  group.add(promptAssembly);

  // 3. Orbiting Uncanny Token Cubes with Tensor Frames & Attention Rays
  const tokens = [];
  const tokenColors = [0xec4899, 0x22d3ee, 0xfbbf24, 0xa855f7];

  for (let i = 0; i < 10; i++) {
    const col = tokenColors[i % tokenColors.length];
    const tokenPivot = new THREE.Group();

    const outerCube = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.2),
      new THREE.MeshPhysicalMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 0.45,
        roughness: 0.08,
        metalness: 0.3,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.85,
        envMap,
      })
    );

    const wireCube = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.25, 0.25),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      })
    );

    tokenPivot.add(outerCube, wireCube);

    // Dynamic attention vector connecting orbiting token to latent origin
    const beamGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1, 0, 0),
    ]);
    const beamMat = new THREE.LineBasicMaterial({
      color: col,
      transparent: true,
      opacity: 0.28,
    });
    const beam = new THREE.Line(beamGeo, beamMat);
    group.add(beam);

    const a = (i / 10) * Math.PI * 2;
    const radius = 1.54 + (i % 2) * 0.14;
    const baseY = (i % 2 === 0 ? 1 : -1) * 0.42;
    tokenPivot.position.set(Math.cos(a) * radius, baseY, Math.sin(a) * radius);

    group.add(tokenPivot);
    tokens.push({
      mesh: tokenPivot,
      beam,
      angle: a,
      radius,
      baseY,
      idx: i,
    });
  }

  // 4. Surreal Warm-Brass & Ultraviolet Studio Lighting
  const brassLight = new THREE.PointLight(0xfbbf24, 2.8, 9);
  brassLight.position.set(2.0, 2.2, 2.0);
  group.add(brassLight);

  const violetLight = new THREE.PointLight(0x8b5cf6, 2.6, 9);
  violetLight.position.set(-2.2, -1.8, 1.8);
  group.add(violetLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
  keyLight.position.set(0, 4, 3);
  group.add(keyLight);

  return {
    group,
    description:
      'Mid-2020s surreal latent-space hallucination—uncanny synthetic jazz brass, shimmering iridescent manifolds, and orbiting semantic token cubes.',
    background: 'radial-gradient(circle at 50% 35%, #78350f 0%, #4c1d95 55%, #090d16 100%)',
    update(t, bounce, spring) {
      promptAssembly.position.y = Math.sin(t * 1.1) * 0.06 - bounce * 0.16;

      // Organic latent-space vertex breathing along normals
      const posAttr = knotGeo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const i3 = i * 3;
        const bx = basePositions[i3];
        const by = basePositions[i3 + 1];
        const bz = basePositions[i3 + 2];

        const nx = baseNormals[i3];
        const ny = baseNormals[i3 + 1];
        const nz = baseNormals[i3 + 2];

        const wave =
          Math.sin(bx * 3.5 + t * 2.4) *
          Math.cos(by * 3.5 - t * 1.9) *
          0.032;

        posAttr.setXYZ(i, bx + nx * wave, by + ny * wave, bz + nz * wave);
      }
      posAttr.needsUpdate = true;

      coreGroup.rotation.x = t * 0.65;
      coreGroup.rotation.y = t * 0.95;
      innerCore.rotation.y = -t * 1.6;

      // Counter-rotating brass & violet lattice cages
      outerJazzCage.rotation.y = -t * 0.42;
      outerJazzCage.rotation.z = t * 0.32;

      innerSynthCage.rotation.x = t * 0.55;
      innerSynthCage.rotation.y = t * 0.48;

      brassEquator.rotation.z = t * 0.7;

      // Orbiting semantic token cubes & live attention vectors
      tokens.forEach((tk) => {
        const a = tk.angle + t * 0.88;
        const px = Math.cos(a) * tk.radius;
        const pz = Math.sin(a) * tk.radius;
        const py = tk.baseY + Math.sin(t * 1.8 + tk.idx * 1.1) * 0.16;

        tk.mesh.position.set(px, py, pz);
        tk.mesh.rotation.x = t * 1.9 + tk.idx;
        tk.mesh.rotation.y = -t * 1.6;

        const linePos = tk.beam.geometry.attributes.position;
        linePos.setXYZ(1, px, py, pz);
        linePos.needsUpdate = true;
      });

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
