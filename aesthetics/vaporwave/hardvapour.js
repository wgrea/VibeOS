// js/aesthetics/vaporwave/hardvapour.js

import * as THREE from 'three';

export function createHardvapour() {
  const group = new THREE.Group();

  // 1. Procedural Industrial Caution-Stripe Texture for Concrete Slabs
  const hazardCanvas = document.createElement('canvas');
  hazardCanvas.width = 128;
  hazardCanvas.height = 64;
  const hCtx = hazardCanvas.getContext('2d');
  hCtx.fillStyle = '#eab308';
  hCtx.fillRect(0, 0, 128, 64);
  hCtx.fillStyle = '#09090b';
  for (let x = -64; x < 192; x += 24) {
    hCtx.beginPath();
    hCtx.moveTo(x, 0);
    hCtx.lineTo(x + 12, 0);
    hCtx.lineTo(x - 20, 64);
    hCtx.lineTo(x - 32, 64);
    hCtx.closePath();
    hCtx.fill();
  }
  const hazardTex = new THREE.CanvasTexture(hazardCanvas);
  hazardTex.wrapS = THREE.RepeatWrapping;

  // 2. Unified Brutalist Spiked Iron Core & Hazard Cage (Draggable / Arrow-Key Interactive)
  const reactorGroup = new THREE.Group();

  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    emissive: 0x7f1d1d,
    emissiveIntensity: 0.45,
    metalness: 0.92,
    roughness: 0.22,
  });

  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.88, 0), ironMat);
  reactorGroup.add(core);

  // Heavy Forged-Iron Spikes on All 6 Octahedron Vertices
  const spikeGeo = new THREE.ConeGeometry(0.16, 0.58, 4);
  const spikeDirs = [, [-1, 0, 0],
, [0, -1, 0],
, [0, 0, -1],
  ];
  spikeDirs.forEach(([dx, dy, dz]) => {
    const spike = new THREE.Mesh(spikeGeo, ironMat);
    const dir = new THREE.Vector3(dx, dy, dz);
    spike.position.copy(dir).multiplyScalar(0.98);
    spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    core.add(spike);
  });

  // Glowing Crimson Reactor Heart inside Core
  const innerHeart = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.52, 1),
    new THREE.MeshBasicMaterial({ color: 0xef4444 })
  );
  reactorGroup.add(innerHeart);

  // Crimson Hazard Wireframe Cage
  const cage = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.36, 0),
    new THREE.MeshBasicMaterial({
      color: 0xef4444,
      wireframe: true,
    })
  );
  reactorGroup.add(cage);

  group.add(reactorGroup);

  // 3. Orbiting Heavy Brutalist Concrete Slabs with Hazard Trim
  const slabs = [];
  const slabMat = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    metalness: 0.7,
    roughness: 0.42,
  });
  const hazardMat = new THREE.MeshBasicMaterial({ map: hazardTex });

  for (let i = 0; i < 6; i++) {
    const slabGroup = new THREE.Group();

    const block = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.82, 0.34), slabMat);
    slabGroup.add(block);

    // Industrial Yellow/Black Caution Band
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.11, 0.35), hazardMat);
    stripe.position.y = -0.22;
    slabGroup.add(stripe);

    const a = (i / 6) * Math.PI * 2;
    slabGroup.position.set(Math.cos(a) * 1.62, 0, Math.sin(a) * 1.62);
    slabGroup.rotation.y = -a;
    group.add(slabGroup);
    slabs.push({ mesh: slabGroup, angle: a, index: i });
  }

  // 4. Harsh Industrial Crimson & Cold Steel Lighting
  const redStrobe = new THREE.PointLight(0xef4444, 12, 11);
  redStrobe.position.set(2.0, 1.8, 2.2);
  group.add(redStrobe);

  const steelRim = new THREE.PointLight(0xd4d4d8, 8, 11);
  steelRim.position.set(-2.2, -1.5, 2.2);
  group.add(steelRim);

  return {
    group,
    draggable: reactorGroup,
    description:
      'Aggressive Eastern European rave, gabber, and post-Soviet brutalist rebellion—replacing pastel mall nostalgia with distorted 909 kicks and industrial grit.',
    background: 'radial-gradient(circle at 50% 40%, #7f1d1d 0%, #18181b 60%, #000000 100%)',
    update(t, bounce, spring) {
      // Aggressive, heavy industrial rotation + distorted 909 bass thump
      const thump = Math.pow(Math.abs(Math.sin(t * 5.2)), 8);
      core.rotation.y = t * 1.35;
      core.rotation.x = t * 0.85;
      core.scale.setScalar(1 + thump * 0.16);
      innerHeart.scale.setScalar(0.85 + thump * 0.35);

      cage.rotation.y = -t * 0.9;
      cage.rotation.z = t * 0.5;
      reactorGroup.position.y = -bounce * 0.2;

      // Industrial strobe flash on kick peak
      redStrobe.intensity = 9 + thump * 14;

      slabs.forEach((s) => {
        const a = s.angle + t * 1.1;
        s.mesh.position.x = Math.cos(a) * 1.62;
        s.mesh.position.z = Math.sin(a) * 1.62;
        s.mesh.position.y = Math.sin(t * 5.2 + s.index) * 0.08 - bounce * 0.18;
        s.mesh.rotation.y = -a;
      });

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
