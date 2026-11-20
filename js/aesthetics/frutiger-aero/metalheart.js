import * as THREE from 'three';

function createChromeEnvMap() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // High-contrast studio horizon bands for liquid-mercury specular streaks
  const grad = ctx.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0.0, '#ffffff');
  grad.addColorStop(0.28, '#93c5fd');
  grad.addColorStop(0.48, '#0f172a');
  grad.addColorStop(0.52, '#f8fafc');
  grad.addColorStop(0.75, '#1e3a8a');
  grad.addColorStop(1.0, '#e2e8f0');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 128);

  const tex = new THREE.CanvasTexture(canvas);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  return tex;
}

export function createMetalheart() {
  const group = new THREE.Group();
  const envMap = createChromeEnvMap();

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.98,
    roughness: 0.06,
    envMap,
    envMapIntensity: 1.35,
  });

  const cobaltMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.55,
    metalness: 0.85,
    roughness: 0.14,
    envMap,
  });

  // Smooth Liquid Mercury Core
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 32), chromeMat);
  group.add(core);

  // Asymmetric Needle-Thin Metalheart Thorns
  const spikeDirs = [
    { dir: [1, 1.2, 0.3], len: 2.1 },
    { dir: [-1.1, 0.9, -0.4], len: 1.85 },
    { dir: [0.8, -1.1, 0.5], len: 2.0 },
    { dir: [-0.9, -1.0, -0.3], len: 1.7 },
    { dir: [0.2, 0.4, 1.2], len: 1.9 },
    { dir: [-0.3, -0.5, -1.1], len: 1.6 },
    { dir: [1.3, -0.2, -0.5], len: 2.2 },
    { dir: [-1.3, 0.1, 0.6], len: 1.95 },
  ];

  spikeDirs.forEach(({ dir, len }) => {
    const spikeGeo = new THREE.ConeGeometry(0.075, len, 8);
    const spike = new THREE.Mesh(spikeGeo, chromeMat);
    const vec = new THREE.Vector3(...dir).normalize();
    spike.position.copy(vec).multiplyScalar(0.45 + len * 0.4);
    spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec);
    group.add(spike);
  });

  // Intersecting Vector Rings
  const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.045, 12, 64), cobaltMat);
  ringA.rotation.set(0.6, 0.4, 0);
  group.add(ringA);

  const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.03, 12, 64), chromeMat);
  ringB.rotation.set(-0.7, 0.5, 0.2);
  ringB.scale.set(1.25, 0.85, 1); // Dynamic oval vector swoosh
  group.add(ringB);

  return {
    group,
    description:
      'Born from late-90s 3D rendering software like Bryce 3D and early Photoshop layer styles, Metalheart fuses liquid chrome, razor-sharp vector thorns, orbital rings, and ice-blue gradients. It bridges sharp Y2K cyber-futurism with the softer, glossy optimism of Frutiger Aero.',
    background: 'radial-gradient(circle at 50% 35%, #dbeafe 0%, #93c5fd 45%, #1e3a8a 100%)',
    update(t, bounce, spring) {
      core.rotation.y = t * 0.9;
      core.rotation.z = t * 0.5;
      ringA.rotation.z = t * 1.2;
      ringB.rotation.z = -t * 0.8;
      group.scale.setScalar(1 + spring * 0.3);
    },
  };
}
