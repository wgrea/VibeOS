// js/aesthetics/comfort/hopecore.js
import * as THREE from 'three';

function createMeadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(128, 128, 16, 128, 128, 130);
  grad.addColorStop(0, '#a3c962');
  grad.addColorStop(0.6, '#7cb356');
  grad.addColorStop(1, '#5d9142');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSoftSeedTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(16, 16, 1, 16, 16, 15);
  grad.addColorStop(0, 'rgba(255, 252, 230, 1)');
  grad.addColorStop(0.45, 'rgba(255, 232, 160, 0.75)');
  grad.addColorStop(1, 'rgba(255, 224, 130, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createHopecore({ camera, domElement, box } = {}) {
  const group = new THREE.Group();
  group.name = 'hopecore';

  const disposables = [];
  const track = (x) => (disposables.push(x), x);

  // 1. Rolling Golden-Hour Meadow Plateau (sealed base so dragging stays solid)
  const hillR = 4.2;
  const hillCenterY = -4.85;
  const hillY = (x, z) => hillCenterY + Math.sqrt(Math.max(0, hillR * hillR - x * x - z * z));

  const hill = new THREE.Mesh(
    track(new THREE.SphereGeometry(hillR, 36, 20, 0, Math.PI * 2, 0, Math.PI / 6)),
    track(new THREE.MeshStandardMaterial({ map: track(createMeadowTexture()), roughness: 0.92 }))
  );
  hill.position.y = hillCenterY;

  const earthBase = new THREE.Mesh(
    track(new THREE.CylinderGeometry(2.1, 1.85, 0.2, 36)),
    track(new THREE.MeshStandardMaterial({ color: 0x6b533b, roughness: 0.95 }))
  );
  earthBase.position.y = -1.31;
  group.add(hill, earthBase);

  // 2. Warm Sunbeam Shaft & Glowing Sun-Halo
  const beam = new THREE.Mesh(
    track(new THREE.ConeGeometry(1.45, 3.2, 24, 1, true)),
    track(
      new THREE.MeshBasicMaterial({
        color: 0xffe49e,
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
  );
  beam.position.set(0.45, 0.9, -0.15);
  beam.rotation.z = -0.24;
  group.add(beam);

  const sunOrb = new THREE.Mesh(
    track(new THREE.SphereGeometry(0.24, 20, 20)),
    track(
      new THREE.MeshStandardMaterial({
        color: 0xfff7cc,
        emissive: 0xffd166,
        emissiveIntensity: 1.4,
        roughness: 0.2,
      })
    )
  );
  sunOrb.position.set(0.85, 1.75, -0.65);
  group.add(sunOrb);

  // 3. Sunflowers Planted Firmly Along the Plateau Slope
  const stemMat = track(new THREE.MeshStandardMaterial({ color: 0x5c9646, roughness: 0.8 }));
  const petalMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.22,
      roughness: 0.45,
    })
  );
  const centerMat = track(new THREE.MeshStandardMaterial({ color: 0x4a2c16, roughness: 0.85 }));

  const stemGeo = track(new THREE.CylinderGeometry(0.02, 0.028, 1, 7));
  const leafGeo = track(new THREE.SphereGeometry(0.085, 10, 8));
  const petalGeo = track(new THREE.SphereGeometry(0.055, 8, 8));
  const discGeo = track(new THREE.CylinderGeometry(0.11, 0.11, 0.036, 16));

  const flowerSpecs = [
    [0.0, 0.05, 0.92, 1.15],   // Tall hero sunflower on the crest
    [-0.55, 0.45, 0.72, 0.95],
    [0.52, 0.42, 0.76, 0.98],
    [-1.05, -0.1, 0.65, 0.88],
    [1.02, -0.15, 0.68, 0.9],
    [-0.45, -0.65, 0.75, 0.92],
    [0.48, -0.7, 0.7, 0.88],
    [-1.25, 0.62, 0.56, 0.82],
    [1.18, 0.58, 0.58, 0.84],
    [0.05, 0.92, 0.6, 0.85],
  ];

  const sunflowers = flowerSpecs.map(([fx, fz, h, headScale], idx) => {
    const flower = new THREE.Group();
    flower.position.set(fx, hillY(fx, fz) - 0.04, fz);

    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.scale.y = h;
    stem.position.y = h / 2;
    flower.add(stem);

    [-1, 1].forEach((side) => {
      const leaf = new THREE.Mesh(leafGeo, stemMat);
      leaf.scale.set(0.65, 0.25, 1.35);
      leaf.position.set(side * 0.08, h * (side < 0 ? 0.45 : 0.62), 0.02);
      leaf.rotation.set(0.3, side * 0.5, side * -0.4);
      flower.add(leaf);
    });

    const head = new THREE.Group();
    head.position.set(0, h, 0.02);
    head.scale.setScalar(headScale);
    head.lookAt(sunOrb.position.clone().sub(flower.position));

    const disc = new THREE.Mesh(discGeo, centerMat);
    disc.rotation.x = Math.PI / 2;
    head.add(disc);

    const petalCount = 12;
    for (let p = 0; p < petalCount; p++) {
      const a = (p / petalCount) * Math.PI * 2;
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.scale.set(0.55, 1.45, 0.28);
      petal.position.set(Math.cos(a) * 0.145, Math.sin(a) * 0.145, -0.005);
      petal.rotation.z = a - Math.PI / 2;
      head.add(petal);
    }

    flower.add(head);
    group.add(flower);
    return { flower, phase: idx * 0.65 };
  });

  // 4. Soft Golden Dandelion & Sunflower Seeds Drifting Upward
  const seedCount = 48;
  const seedPositions = new Float32Array(seedCount * 3);
  for (let i = 0; i < seedCount; i++) {
    seedPositions[i * 3] = (Math.random() - 0.5) * 3.4;
    seedPositions[i * 3 + 1] = Math.random() * 2.6 - 0.8;
    seedPositions[i * 3 + 2] = (Math.random() - 0.5) * 2.6;
  }
  const seedGeo = track(new THREE.BufferGeometry());
  seedGeo.setAttribute('position', new THREE.BufferAttribute(seedPositions, 3));

  const seedMat = track(
    new THREE.PointsMaterial({
      map: track(createSoftSeedTexture()),
      color: 0xfff8dc,
      size: 0.11,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  const seeds = new THREE.Points(seedGeo, seedMat);
  group.add(seeds);

  return {
    group,
    description:
      'Hopecore — the uplifting counterpart to Corecore: a golden-hour plateau of sunlit sunflowers swaying toward the warmth, soft sunbeams, and drifting seeds of quiet resilience.',
    background:
      'radial-gradient(circle at 60% 20%, #fff7d6 0%, #ffd98e 38%, #a8d5f2 78%, #e6f4ff 100%)',
    update(t) {
      // Gentle warm breeze rippling across the sunflower field
      sunflowers.forEach(({ flower, phase }) => {
        flower.rotation.z = Math.sin(t * 1.15 + phase) * 0.06;
        flower.rotation.x = Math.cos(t * 0.85 + phase) * 0.04;
      });

      sunOrb.scale.setScalar(1 + Math.sin(t * 1.8) * 0.05);

      const pos = seeds.geometry.attributes.position.array;
      for (let i = 0; i < seedCount; i++) {
        pos[i * 3 + 1] += 0.0032;
        pos[i * 3] += Math.sin(t * 0.9 + i) * 0.0018;
        if (pos[i * 3 + 1] > 1.9) {
          pos[i * 3 + 1] = -0.8;
          pos[i * 3] = (Math.random() - 0.5) * 3.4;
        }
      }
      seeds.geometry.attributes.position.needsUpdate = true;
    },
    dispose() {
      disposables.forEach((d) => d.dispose?.());
    },
  };
}