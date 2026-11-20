// js/aesthetics/vaporwave/voidgaze.js

import * as THREE from 'three';

export function createVoidgaze() {
  const group = new THREE.Group();

  // Procedural Cold Starlight / Silver Reflection Map
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 256;
  envCanvas.height = 128;
  const ctx = envCanvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0.0, '#e2e8f0');
  grad.addColorStop(0.3, '#60a5fa');
  grad.addColorStop(0.65, '#0f172a');
  grad.addColorStop(1.0, '#000000');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 128);

  const envMap = new THREE.CanvasTexture(envCanvas);
  envMap.mapping = THREE.EquirectangularReflectionMapping;

  // 1. Abyssal Event Horizon & Accretion Assembly (Draggable / Arrow-Key Interactive)
  const voidAssembly = new THREE.Group();

  const blackHole = new THREE.Mesh(
    new THREE.SphereGeometry(0.84, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );
  voidAssembly.add(blackHole);

  // Subtle razor-thin photon ring framing the black void
  const photonRing = new THREE.Mesh(
    new THREE.RingGeometry(0.845, 0.885, 64),
    new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    })
  );
  voidAssembly.add(photonRing);

  // Faint outer static aura sphere
  const auraSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.92, 32, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide,
    })
  );
  voidAssembly.add(auraSphere);

  // 2. Multi-Layered Accretion Disk
  const diskGroup = new THREE.Group();
  diskGroup.rotation.x = Math.PI / 2.55;
  diskGroup.rotation.y = -0.18;

  const primaryHalo = new THREE.Mesh(
    new THREE.TorusGeometry(1.22, 0.042, 20, 96),
    new THREE.MeshPhysicalMaterial({
      color: 0xf1f5f9,
      emissive: 0x60a5fa,
      emissiveIntensity: 0.95,
      roughness: 0.08,
      metalness: 0.6,
      clearcoat: 1.0,
      envMap,
      envMapIntensity: 1.4,
    })
  );
  diskGroup.add(primaryHalo);

  const innerHalo = new THREE.Mesh(
    new THREE.TorusGeometry(1.03, 0.016, 12, 96),
    new THREE.MeshStandardMaterial({
      color: 0xbfdbfe,
      emissive: 0x93c5fd,
      emissiveIntensity: 1.25,
      roughness: 0.15,
      transparent: true,
      opacity: 0.85,
    })
  );
  diskGroup.add(innerHalo);

  const outerHaze = new THREE.Mesh(
    new THREE.RingGeometry(1.28, 1.62, 72),
    new THREE.MeshBasicMaterial({
      color: 0x64748b,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    })
  );
  diskGroup.add(outerHaze);

  voidAssembly.add(diskGroup);
  group.add(voidAssembly);

  // 3. Shoegaze Static Distortion Shards (Dual-layer wireframe + dark metallic core)
  const shards = [];
  const wireMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    emissive: 0x3b82f6,
    emissiveIntensity: 0.65,
    wireframe: true,
  });

  const shardCoreMat = new THREE.MeshPhysicalMaterial({
    color: 0x0f172a,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.3,
    roughness: 0.1,
    metalness: 0.85,
    envMap,
  });

  for (let i = 0; i < 16; i++) {
    const shardPivot = new THREE.Group();
    const scale = 0.7 + (i % 4) * 0.25;

    const wire = new THREE.Mesh(new THREE.OctahedronGeometry(0.13 * scale, 0), wireMat);
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.075 * scale, 0), shardCoreMat);
    shardPivot.add(wire, core);

    const a = (i / 16) * Math.PI * 2;
    const r = 1.48 + (i % 3) * 0.22;
    const baseY = Math.sin(i * 1.7) * 0.42;

    shardPivot.position.set(Math.cos(a) * r, baseY, Math.sin(a) * r);
    group.add(shardPivot);

    shards.push({
      mesh: shardPivot,
      angle: a,
      radius: r,
      baseY,
      spinSpeed: (i % 2 === 0 ? 1 : -1) * (0.9 + (i % 3) * 0.35),
      orbitSpeed: 0.28 + (i % 3) * 0.06,
    });
  }

  // 4. Fine Ambient Static Dust Field
  const dustCount = 90;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const rad = 1.15 + Math.random() * 1.15;
    dustPositions[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
    dustPositions[i * 3 + 1] = rad * Math.cos(phi) * 0.65;
    dustPositions[i * 3 + 2] = rad * Math.sin(phi) * Math.sin(theta);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  const dustPoints = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.024,
      transparent: true,
      opacity: 0.65,
    })
  );
  group.add(dustPoints);

  // Cold Nocturnal Rim Lighting
  const rimLight = new THREE.DirectionalLight(0xbfdbfe, 2.0);
  rimLight.position.set(-2.5, 3.5, 2.5);
  group.add(rimLight);

  const voidPulseLight = new THREE.PointLight(0x3b82f6, 2.2, 7);
  voidPulseLight.position.set(0, 0, 0);
  group.add(voidPulseLight);

  return {
    group,
    draggable: voidAssembly,
    description:
      'Early-to-mid 2020s cosmic shoegaze & post-vaporwave—pitch-black event horizon minimalism, pale silver-cobalt accretion halos, and cold nocturnal static.',
    background: 'radial-gradient(circle at 50% 35%, #1e293b 0%, #090d16 58%, #000000 100%)',
    update(t, bounce, spring) {
      voidAssembly.position.y = Math.sin(t * 0.9) * 0.06 - bounce * 0.15;

      photonRing.scale.setScalar(1 + Math.sin(t * 1.8) * 0.015);
      auraSphere.scale.setScalar(1 + Math.cos(t * 1.4) * 0.03);

      primaryHalo.rotation.z = t * 0.45;
      innerHalo.rotation.z = -t * 0.95;
      diskGroup.rotation.y = -0.18 + Math.sin(t * 0.45) * 0.22;
      diskGroup.rotation.z = Math.cos(t * 0.35) * 0.12;

      shards.forEach((sh, idx) => {
        const a = sh.angle + t * sh.orbitSpeed;
        sh.mesh.position.x = Math.cos(a) * sh.radius;
        sh.mesh.position.z = Math.sin(a) * sh.radius;
        sh.mesh.position.y = sh.baseY + Math.sin(t * 1.5 + idx) * 0.14;
        sh.mesh.rotation.x = t * sh.spinSpeed;
        sh.mesh.rotation.y = t * sh.spinSpeed * 0.7;
      });

      dustPoints.rotation.y = t * 0.12;
      dustPoints.rotation.x = Math.sin(t * 0.25) * 0.08;

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
