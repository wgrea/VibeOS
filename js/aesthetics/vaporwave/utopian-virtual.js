// js/aesthetics/vaporwave/utopian-virtual.js

import * as THREE from 'three';

export function createUtopianVirtual() {
  const group = new THREE.Group();

  // 1. Procedural Bryce 3D Sky & Horizon Environment Map
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 512;
  envCanvas.height = 256;
  const eCtx = envCanvas.getContext('2d');

  const skyGrad = eCtx.createLinearGradient(0, 0, 0, 128);
  skyGrad.addColorStop(0, '#0369a1');
  skyGrad.addColorStop(0.7, '#38bdf8');
  skyGrad.addColorStop(1, '#e0f2fe');
  eCtx.fillStyle = skyGrad;
  eCtx.fillRect(0, 0, 512, 128);

  const groundGrad = eCtx.createLinearGradient(0, 128, 0, 256);
  groundGrad.addColorStop(0, '#ffffff');
  groundGrad.addColorStop(0.3, '#1e3a8a');
  groundGrad.addColorStop(1, '#0f172a');
  eCtx.fillStyle = groundGrad;
  eCtx.fillRect(0, 128, 512, 128);

  eCtx.fillStyle = '#ffffff';
  eCtx.fillRect(0, 125, 512, 6);

  const envTex = new THREE.CanvasTexture(envCanvas);
  envTex.mapping = THREE.EquirectangularReflectionMapping;

  // 2. Procedural Checkerboard Disc Pedestal
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillRect(128, 128, 128, 128);

  const checkerTex = new THREE.CanvasTexture(canvas);
  checkerTex.wrapS = THREE.RepeatWrapping;
  checkerTex.wrapT = THREE.RepeatWrapping;
  checkerTex.repeat.set(4, 4);

  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(1.75, 1.88, 0.22, 40),
    new THREE.MeshStandardMaterial({
      map: checkerTex,
      roughness: 0.2,
      metalness: 0.1
    })
  );
  pedestal.position.y = -1.1;
  group.add(pedestal);

  // 3. Utopian Infrastructure: Elevated Monorail Loop & Pylons
  const infraMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.28,
    metalness: 0.12
  });

  const trackRadius = 2.45;
  const trackY = -0.68;

  // Sleek Circular Monorail Guideway Beam
  const monorailTrack = new THREE.Mesh(
    new THREE.TorusGeometry(trackRadius, 0.055, 12, 72),
    infraMat
  );
  monorailTrack.rotation.x = Math.PI / 2;
  monorailTrack.position.y = trackY;
  group.add(monorailTrack);

  // Tapered White Support Pylons around the Perimeter
  const pylonCount = 10;
  for (let i = 0; i < pylonCount; i++) {
    const angle = (i / pylonCount) * Math.PI * 2;
    const pylon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.065, 0.65, 12),
      infraMat
    );
    pylon.position.set(
      Math.cos(angle) * trackRadius,
      trackY - 0.32,
      Math.sin(angle) * trackRadius
    );
    group.add(pylon);
  }

  // Streamlined Futurist Monorail Train Car
  const trainGroup = new THREE.Group();
  const trainBody = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.085, 0.42, 8, 16),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.65,
      roughness: 0.15,
      envMap: envTex
    })
  );
  trainBody.rotation.z = Math.PI / 2;
  trainGroup.add(trainBody);

  // Cobalt Blue Window Stripe along Train
  const windowBand = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.055, 0.175),
    new THREE.MeshBasicMaterial({ color: 0x0284c7 })
  );
  windowBand.position.y = 0.015;
  trainGroup.add(windowBand);

  group.add(trainGroup);

  // 4. Classical Modernist Colonnade Viaduct Arches (Background Plaza)
  const colonnadeGroup = new THREE.Group();
  const archSpan = 0.68;
  for (let i = -3; i <= 3; i++) {
    const x = i * archSpan;
    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.95, 0.18),
      infraMat
    );
    pillar.position.set(x, -0.75, -2.55);
    colonnadeGroup.add(pillar);

    if (i < 3) {
      const arch = new THREE.Mesh(
        new THREE.TorusGeometry(archSpan / 2, 0.055, 10, 24, Math.PI),
        infraMat
      );
      arch.position.set(x + archSpan / 2, -0.32, -2.55);
      colonnadeGroup.add(arch);
    }
  }
  // Top Viaduct Deck Beam
  const topDeck = new THREE.Mesh(
    new THREE.BoxGeometry(4.4, 0.12, 0.24),
    infraMat
  );
  topDeck.position.set(0, 0.06, -2.55);
  colonnadeGroup.add(topDeck);
  group.add(colonnadeGroup);

  // 5. Mirror Chrome Centerpiece Sphere (Draggable / Arrow-Key Interactive)
  const chromeSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.82, 48, 48),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.96,
      roughness: 0.04,
      envMap: envTex,
      envMapIntensity: 1.35
    })
  );
  chromeSphere.position.y = 0.25;
  group.add(chromeSphere);

  // Sleek Gold Orbital Ring around Centerpiece
  const orbitRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.15, 0.018, 12, 64),
    new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      metalness: 0.85,
      roughness: 0.15,
      envMap: envTex
    })
  );
  orbitRing.rotation.set(Math.PI / 2.6, 0.25, 0);
  orbitRing.position.y = 0.25;
  group.add(orbitRing);

  // 6. Floating Raytraced Primitives: Golden Pyramid & Coral Torus
  const pyramid = new THREE.Mesh(
    new THREE.ConeGeometry(0.42, 0.85, 4),
    new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.75,
      roughness: 0.16,
      envMap: envTex
    })
  );
  pyramid.position.set(-1.32, 0.5, 0.2);
  group.add(pyramid);

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.4, 0.13, 20, 40),
    new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.2,
      metalness: 0.25,
      envMap: envTex
    })
  );
  torus.position.set(1.32, 0.45, 0.2);
  group.add(torus);

  // 7. Soft Bryce 3D Cumulus Cloud Clusters
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.85,
    transparent: true,
    opacity: 0.88
  });

  const clouds = [];
  const cloudCoords = [
    { x: -1.9, y: 1.5, z: -1.8, scale: 0.85 },
    { x: 2.0, y: 1.35, z: -2.1, scale: 0.95 }
  ];

  cloudCoords.forEach(({ x, y, z, scale }) => {
    const cloud = new THREE.Group();
    const puffs = [
      [0, 0, 0, 0.34],
      [-0.28, -0.05, 0.05, 0.25],
      [0.28, -0.04, -0.04, 0.27],
      [0.08, 0.16, 0.04, 0.24]
    ];
    puffs.forEach(([px, py, pz, r]) => {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), cloudMat);
      puff.position.set(px, py, pz);
      cloud.add(puff);
    });
    cloud.position.set(x, y, z);
    cloud.scale.setScalar(scale);
    group.add(cloud);
    clouds.push({ mesh: cloud, baseX: x });
  });

  // Crisp Daylight & Sky Fill Lighting
  const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
  sunLight.position.set(3, 5, 4);
  group.add(sunLight);

  const skyBounce = new THREE.AmbientLight(0xbae6fd, 1.1);
  group.add(skyBounce);

  return {
    group,
    description:
      'Early-90s Silicon Graphics and Bryce 3D raytraced optimism featuring mirror-chrome spheres, white monorail transit loops, classical colonnades, and corporate-utopian MIDI nostalgia.',
    background: 'linear-gradient(180deg, #0284c7 0%, #38bdf8 55%, #bae6fd 100%)',
    update(t, bounce, spring) {
      checkerTex.offset.y = (t * 0.25) % 1;

      // Monorail train gliding smoothly around the elevated circular guideway
      const trainAngle = t * 0.75;
      trainGroup.position.set(
        Math.cos(trainAngle) * trackRadius,
        trackY + 0.075,
        Math.sin(trainAngle) * trackRadius
      );
      trainGroup.rotation.y = -trainAngle - Math.PI / 2;

      const hoverY = 0.25 + Math.sin(t * 1.5) * 0.14 + Math.abs(spring) * 0.4 - bounce * 0.25;
      chromeSphere.position.y = hoverY;
      orbitRing.position.y = hoverY;
      orbitRing.rotation.z = t * 0.6;

      pyramid.rotation.y = t * 1.1;
      pyramid.position.y = 0.5 + Math.cos(t * 1.4) * 0.08 - bounce * 0.2;

      torus.rotation.x = t * 0.9;
      torus.rotation.y = t * 1.2;
      torus.position.y = 0.45 + Math.sin(t * 1.3) * 0.08 - bounce * 0.2;

      clouds.forEach((c, idx) => {
        c.mesh.position.x = c.baseX + Math.sin(t * 0.35 + idx) * 0.18;
      });
    },
  };
}
