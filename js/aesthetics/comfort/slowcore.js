// js/aesthetics/comfort/slowcore.js
import * as THREE from 'three';

export function createSlowcore() {
  const group = new THREE.Group();

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x451a03,
    roughness: 0.65,
  });

  const vinylMat = new THREE.MeshPhysicalMaterial({
    color: 0x18181b,
    roughness: 0.18,
    metalness: 0.35,
    clearcoat: 0.85,
  });

  const grooveMat = new THREE.MeshStandardMaterial({
    color: 0x3f3f46,
    roughness: 0.3,
    metalness: 0.5,
  });

  const labelMat = new THREE.MeshStandardMaterial({
    color: 0xf4a261,
    emissive: 0xe76f51,
    emissiveIntensity: 0.35,
    roughness: 0.5,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.85,
    roughness: 0.2,
  });

  const lampMat = new THREE.MeshPhysicalMaterial({
    color: 0xfde68a,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.65,
    roughness: 0.2,
    clearcoat: 0.8,
  });

  // 1. Tilted Turntable Plinth, Vinyl Disc, Grooves & Tonearm
  const recordGroup = new THREE.Group();

  const plinth = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.16, 2.2), woodMat);
  plinth.position.set(0.08, -0.1, 0);
  recordGroup.add(plinth);

  const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.02, 0.035, 48), vinylMat);
  disc.position.x = -0.1;

  const label = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.042, 32), labelMat);
  label.position.x = -0.1;

  const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.08, 12), chromeMat);
  spindle.position.set(-0.1, 0.02, 0);

  // Subtle Concentric Vinyl Groove Rings
  [0.54, 0.72, 0.88].forEach((r) => {
    const groove = new THREE.Mesh(new THREE.TorusGeometry(r, 0.005, 8, 48), grooveMat);
    groove.rotation.x = Math.PI / 2;
    groove.position.set(-0.1, 0.02, 0);
    recordGroup.add(groove);
  });

  // Tonearm Assembly Resting on the Record
  const pivotBase = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.08, 18), chromeMat);
  pivotBase.position.set(1.02, 0.03, -0.68);

  const tonearm = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.15, 10), chromeMat);
  tonearm.rotation.set(Math.PI / 2, 0, 0.42);
  tonearm.position.set(0.8, 0.075, -0.16);

  const cartridge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.11), labelMat);
  cartridge.position.set(0.56, 0.06, 0.34);
  cartridge.rotation.y = -0.42;

  recordGroup.add(disc, label, spindle, pivotBase, tonearm, cartridge);
  recordGroup.rotation.set(0.48, -0.15, -0.22);
  group.add(recordGroup);

  // 2. Warm Midnight Mushroom Desk Lamp
  const lampGroup = new THREE.Group();
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.32, 20), chromeMat);
  lampBase.position.y = -0.18;

  const lampShade = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.58),
    lampMat
  );
  lampShade.position.y = -0.04;

  const lampLight = new THREE.PointLight(0xfbbf24, 1.8, 4.5);
  lampLight.position.set(0, -0.05, 0.2);

  lampGroup.add(lampBase, lampShade, lampLight);
  lampGroup.position.set(1.15, 0.82, -0.45);
  group.add(lampGroup);

  return {
    group,
    description:
      'Embracing quiet late-night stillness and unhurried analog warmth, Slowcore centers on spinning vinyl records, warm amber desk lamps, deep indigo shadows, and gentle introspection.',
    background: 'radial-gradient(circle at 50% 35%, #312e81 0%, #1e1b4b 55%, #0f172a 100%)',
    update(t, bounce, spring) {
      // Unhurried 33 RPM-inspired analog spin
      disc.rotation.y = t * 0.65;
      label.rotation.y = t * 0.65;

      // Subtle tonearm tracking sway
      tonearm.rotation.z = 0.42 + Math.sin(t * 0.8) * 0.015;

      recordGroup.position.y = Math.sin(t * 1.1) * 0.06;
      lampGroup.position.y = 0.82 + Math.cos(t * 1.0) * 0.05;
      group.scale.setScalar(1 + spring * 0.2);
    },
  };
}
