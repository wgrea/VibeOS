// js/aesthetics/kidcore/imaginarium.js
import * as THREE from 'three';

export function createImaginarium() {
  const group = new THREE.Group();

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.78,
    roughness: 0.18,
  });

  const violetMat = new THREE.MeshPhysicalMaterial({
    color: 0x8b5cf6,
    emissive: 0x6d28d9,
    emissiveIntensity: 0.35,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });

  const mintMat = new THREE.MeshPhysicalMaterial({
    color: 0x34d399,
    roughness: 0.22,
    clearcoat: 0.75,
  });

  const coralMat = new THREE.MeshPhysicalMaterial({
    color: 0xf43f5e,
    roughness: 0.2,
    clearcoat: 0.85,
  });

  const skyMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    roughness: 0.18,
    clearcoat: 0.85,
  });

  // 1. Nested Armillary / Gyroscope Discovery Toy
  const gimbal = new THREE.Group();

  const outerRing = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.045, 16, 56), goldMat);
  const meridianRing = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.038, 16, 48), goldMat);
  meridianRing.rotation.y = Math.PI / 2;

  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.048, 16, 48), mintMat);

  // Gimbal pivot pins
  const pinGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.36, 10);
  const topPin = new THREE.Mesh(pinGeo, goldMat);
  topPin.position.y = 0.98;
  const bottomPin = new THREE.Mesh(pinGeo, goldMat);
  bottomPin.position.y = -0.98;

  // Faceted Violet Crystal Prism Core
  const corePrism = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4, 0), violetMat);

  gimbal.add(outerRing, meridianRing, innerRing, topPin, bottomPin, corePrism);
  group.add(gimbal);

  // 2. Orbiting Glass Discovery Marbles
  const marbleData = [
    { mat: coralMat, radius: 1.48, speed: 0.9, offset: 0, yAmp: 0.22 },
    { mat: skyMat, radius: 1.48, speed: 0.9, offset: Math.PI, yAmp: -0.22 },
    { mat: goldMat, radius: 1.38, speed: -1.15, offset: Math.PI / 2, yAmp: 0.15 },
  ];

  const marbles = marbleData.map((cfg) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 20), cfg.mat);
    group.add(mesh);
    return { mesh, ...cfg };
  });

  return {
    group,
    draggable: gimbal,
    description:
      'Inspired by 90s discovery toy stores, science-museum gift shops, and hands-on planetarium kits, Imaginarium blends brass armillary gyroscopes, faceted violet prisms, and glossy glass marbles.',
    background: 'radial-gradient(circle at 50% 35%, #ddd6fe 0%, #8b5cf6 48%, #1e1b4b 100%)',
    update(t, bounce, spring) {
      outerRing.rotation.x = t * 0.55;
      outerRing.rotation.y = t * 0.35;

      meridianRing.rotation.z = t * 0.45;
      meridianRing.rotation.x = Math.sin(t * 0.6) * 0.4;

      innerRing.rotation.y = -t * 0.95;
      innerRing.rotation.z = t * 0.5;

      corePrism.rotation.y = t * 1.25;
      corePrism.rotation.x = Math.sin(t * 1.4) * 0.45;
      corePrism.position.y = Math.sin(t * 2.2) * 0.05;

      marbles.forEach((m, idx) => {
        const angle = t * m.speed + m.offset;
        m.mesh.position.x = Math.cos(angle) * m.radius;
        m.mesh.position.z = Math.sin(angle) * m.radius;
        m.mesh.position.y = Math.sin(t * 1.8 + idx) * m.yAmp;
      });

      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
