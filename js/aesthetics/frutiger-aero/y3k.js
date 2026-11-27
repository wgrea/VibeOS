// js/aesthetics/frutiger-aero/y3k-chrome.js
import * as THREE from 'three';

export function createY3k({ camera, domElement, box }) {
  const group = new THREE.Group();
  group.name = 'y3k';

  // Same liquid-mercury core as `chrome.js`, but a bit more
  // "hyper" — higher metalness, cooler color, larger cluster.
  const chromeMat = new THREE.MeshPhysicalMaterial({
    color: 0xeaf2ff,
    metalness: 1.0,
    roughness: 0.03,
    clearcoat: 1.0,
    clearcoatRoughness: 0.01,
    envMapIntensity: 2.0,
  });

  const blobs = [
    { pos: [0, 0.05, 0],         r: 0.6 },
    { pos: [0.6, 0.2, 0.1],      r: 0.42 },
    { pos: [-0.55, -0.1, 0],     r: 0.46 },
    { pos: [0.12, 0.6, 0.15],    r: 0.34 },
    { pos: [-0.18, -0.6, -0.1],  r: 0.38 },
    { pos: [0.85, -0.35, 0.1],   r: 0.26 },
  ];

  const blobsMeshes = [];
  blobs.forEach(({ pos, r }) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 48), chromeMat);
    mesh.position.set(...pos);
    group.add(mesh);
    blobsMeshes.push(mesh);
  });

  // Iridescent holo visor — the Y3K signature
  const visor = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 0.55),
    new THREE.MeshPhysicalMaterial({
      color: 0xd0e7ff,
      metalness: 0.4,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 0.4,
      iridescence: 1.0,
      iridescenceIOR: 1.4,
      iridescenceThicknessRange: [100, 400],
    })
  );
  visor.position.set(0, -0.95, 0.35);
  visor.rotation.x = -0.15;
  group.add(visor);

  // Spiky silver star emblems — larger and sharper than `chrome.js`
  const starMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1.0,
    roughness: 0.05,
  });
  for (let i = 0; i < 8; i++) {
    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), starMat);
    const angle = (i / 8) * Math.PI * 2;
    star.position.set(Math.cos(angle) * 1.3, Math.sin(angle) * 0.9, 0.4);
    star.userData.phase = angle;
    group.add(star);
  }

  // Cool-toned lighting with a holographic warm accent
  const key = new THREE.PointLight(0xffffff, 2.4, 14);
  key.position.set(2.2, 2.2, 3);
  group.add(key);

  const fill = new THREE.PointLight(0x88ccff, 1.6, 14);
  fill.position.set(-2.2, 0, 2);
  group.add(fill);

  const holoRim = new THREE.PointLight(0xff66ff, 1.2, 14);
  holoRim.position.set(0, -2.2, -2);
  group.add(holoRim);

  const warmAccent = new THREE.PointLight(0xffaa88, 0.8, 10);
  warmAccent.position.set(2, -1.5, 1);
  group.add(warmAccent);

  return {
    group,
    description:
      'Y3K / Hyper-Chrome Futurism — the Gen-Z/Alpha evolution of Y2K: liquid mercury metaballs, iridescent holographic glass visors, and spiky silver star emblems.',
    background:
      'radial-gradient(circle at 50% 30%, #f0f9ff 0%, #c7d2fe 45%, #1e1b4b 100%)',
    draggable: group,
    update(t) {
      group.rotation.y = t * 0.15;
      blobsMeshes.forEach((m, i) => {
        const s = 1 + Math.sin(t * 1.3 + i) * 0.04;
        m.scale.setScalar(s);
      });
      visor.material.iridescenceThicknessRange = [
        100 + Math.sin(t * 0.6) * 80,
        400 + Math.sin(t * 0.6) * 80,
      ];
    },
  };
}