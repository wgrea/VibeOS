// js/aesthetics/frutiger-aero/chrome.js
import * as THREE from 'three';

export function createChrome({ camera, domElement, box }) {
  const group = new THREE.Group();
  group.name = 'chrome';

  // Liquid-mercury chrome material — full metalness, near-zero roughness
  const chromeMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 1.0,
    roughness: 0.04,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    envMapIntensity: 1.8,
  });

  // Metaball cluster — overlapping spheres that read as one liquid mass
  const blobs = [
    { pos: [0, 0, 0],            r: 0.55 },
    { pos: [0.55, 0.15, 0],      r: 0.38 },
    { pos: [-0.5, -0.1, 0],      r: 0.42 },
    { pos: [0.1, 0.55, 0.1],     r: 0.32 },
    { pos: [-0.15, -0.55, -0.1], r: 0.36 },
  ];

  const blobsMeshes = [];
  blobs.forEach(({ pos, r }) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 48), chromeMat);
    mesh.position.set(...pos);
    group.add(mesh);
    blobsMeshes.push(mesh);
  });

  // Spiky silver star emblems orbiting the cluster
  const starMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1.0,
    roughness: 0.1,
  });
  for (let i = 0; i < 6; i++) {
    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.08, 0), starMat);
    const angle = (i / 6) * Math.PI * 2;
    star.position.set(Math.cos(angle) * 1.15, Math.sin(angle) * 0.75, 0.3);
    star.userData.phase = angle;
    group.add(star);
  }

  // Cool lighting to make the chrome sparkle
  const key = new THREE.PointLight(0xffffff, 2.2, 12);
  key.position.set(2, 2, 3);
  group.add(key);

  const fill = new THREE.PointLight(0x88ccff, 1.4, 12);
  fill.position.set(-2, 0, 2);
  group.add(fill);

  const rim = new THREE.PointLight(0xff88cc, 1.0, 12);
  rim.position.set(0, -2, -2);
  group.add(rim);

  return {
    group,
    description:
      'Chrome — liquid mercury futurism: mirrored metaball masses, silver star emblems, and cold reflective light. The metallic heartbeat of the Y2K lineage.',
    background:
      'radial-gradient(circle at 50% 30%, #ffffff 0%, #c7d2fe 45%, #1e1b4b 100%)',
    draggable: group,
    update(t) {
      // Slow orbit so reflections sweep across the metal
      group.rotation.y = t * 0.12;
      // Subtle breathing pulse on each blob
      blobsMeshes.forEach((m, i) => {
        const s = 1 + Math.sin(t * 1.1 + i) * 0.03;
        m.scale.setScalar(s);
      });
    },
  };
}