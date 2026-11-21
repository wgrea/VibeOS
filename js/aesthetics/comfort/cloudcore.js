// js/aesthetics/comfort/cloudcore.js
import * as THREE from 'three';

export function createCloudcore() {
  const group = new THREE.Group();

  const puffMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xe0f2fe,
    emissiveIntensity: 0.25,
    roughness: 0.72,
  });

  const subCloudMat = new THREE.MeshStandardMaterial({
    color: 0xf0f9ff,
    emissive: 0xbae6fd,
    emissiveIntensity: 0.2,
    roughness: 0.75,
    transparent: true,
    opacity: 0.92,
  });

  const starMat = new THREE.MeshPhysicalMaterial({
    color: 0xfef08a,
    emissive: 0xfde047,
    emissiveIntensity: 0.55,
    roughness: 0.15,
    clearcoat: 1.0,
  });

  // 1. Main Pillowy Cumulus Cloud Cluster
  const cloud = new THREE.Group();
  const puffs = [
    [0, 0, 0, 0.66],
    [-0.62, -0.12, 0.1, 0.5],
    [0.65, -0.1, -0.05, 0.53],
    [-0.28, 0.32, -0.15, 0.46],
    [0.3, 0.28, 0.15, 0.44],
    [0, -0.18, 0.28, 0.42],
  ];

  puffs.forEach(([x, y, z, r]) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 24), puffMat);
    mesh.position.set(x, y, z);
    cloud.add(mesh);
  });
  group.add(cloud);

  // 2. Smaller Drifting Companion Cloudlets
  const cloudletLeft = new THREE.Group();
  [
    [0, 0, 0, 0.24],
    [-0.2, -0.05, 0.04, 0.18],
    [0.2, -0.04, -0.04, 0.19],
  ].forEach(([x, y, z, r]) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), subCloudMat);
    m.position.set(x, y, z);
    cloudletLeft.add(m);
  });
  cloudletLeft.position.set(-1.15, 0.55, -0.35);
  group.add(cloudletLeft);

  const cloudletRight = new THREE.Group();
  [
    [0, 0, 0, 0.22],
    [-0.18, -0.05, 0.03, 0.16],
    [0.18, -0.04, -0.03, 0.17],
  ].forEach(([x, y, z, r]) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), subCloudMat);
    m.position.set(x, y, z);
    cloudletRight.add(m);
  });
  cloudletRight.position.set(1.18, -0.42, 0.25);
  group.add(cloudletRight);

  // 3. Soft Daydream Star & Raindrop Gems
  const stars = [];
  const starCoords = [
    [-0.75, 0.85, 0.2],
    [0.72, 0.78, -0.15],
    [0.85, 0.25, 0.35],
    [-0.85, -0.45, 0.25],
  ];

  starCoords.forEach(([sx, sy, sz], idx) => {
    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.085, 0), starMat);
    star.scale.set(0.8, 1.35, 0.8);
    star.position.set(sx, sy, sz);
    group.add(star);
    stars.push({ mesh: star, baseY: sy, phase: idx * 1.1 });
  });

    // 4. Pastel Crescent Moon Peeking Behind the Cloud
  const moonShape = new THREE.Shape();
  moonShape.absarc(0, 0, 0.34, Math.PI * 0.28, Math.PI * 1.72, false);
  moonShape.absarc(0.16, 0, 0.28, Math.PI * 1.62, Math.PI * 0.38, true);

  const moonGeo = new THREE.ExtrudeGeometry(moonShape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.025,
    bevelSegments: 4,
    curveSegments: 24,
  });
  moonGeo.center();

  const moonMat = new THREE.MeshPhysicalMaterial({
    color: 0xfde68a,
    emissive: 0xfef08a,
    emissiveIntensity: 0.45,
    roughness: 0.18,
    clearcoat: 0.9,
  });

  const crescentMoon = new THREE.Mesh(moonGeo, moonMat);
  crescentMoon.position.set(-0.58, 0.72, -0.22);
  crescentMoon.rotation.set(0.1, 0.15, 0.35);
  group.add(crescentMoon);


  return {
    group,
    description:
      'Built around weightless daydreaming and soft-focus skyscapes, Cloudcore layers pillowy cumulus forms, pastel sky gradients, twinkling star charms, and serene weightlessness.',
    background: 'radial-gradient(circle at 50% 25%, #ffffff 0%, #bae6fd 50%, #c7d2fe 100%)',
    update(t, bounce, spring) {
      cloud.position.y = Math.sin(t * 1.3) * 0.09;
      cloud.rotation.y = Math.sin(t * 0.5) * 0.08;

      cloudletLeft.position.y = 0.55 + Math.sin(t * 1.1 + 1.0) * 0.07;
      cloudletRight.position.y = -0.42 + Math.cos(t * 1.2) * 0.07;

      stars.forEach((s) => {
        s.mesh.rotation.y = t * 1.2 + s.phase;
        s.mesh.position.y = s.baseY + Math.sin(t * 1.8 + s.phase) * 0.06;
      });

            crescentMoon.position.y = 0.72 + Math.sin(t * 1.1 + 0.4) * 0.07;
      crescentMoon.rotation.z = 0.35 + Math.sin(t * 0.8) * 0.08;


      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
