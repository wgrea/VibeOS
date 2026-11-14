import * as THREE from 'three';

export function createFuturismAero() {
  const group = new THREE.Group();

  // Sleek White & Cyan Aerodynamic Gimbal Core
  const pearlMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    roughness: 0.06,
    metalness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
  });

  const cyanGlowMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x06b6d4,
    emissiveIntensity: 1.1,
    roughness: 0.1,
  });

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.65, 2), cyanGlowMat);
  group.add(core);

  // Triple Gyroscopic White-Chrome Rings
  const g1 = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.055, 16, 64), pearlMat);
  const g2 = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.055, 16, 64), pearlMat);
  const g3 = new THREE.Mesh(new THREE.TorusGeometry(1.58, 0.045, 16, 64), cyanGlowMat);

  group.add(g1, g2, g3);

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #e0f2fe 0%, #38bdf8 55%, #0369a1 100%)',
    update(t, bounce, spring) {
      core.rotation.y = -t * 0.8;
      g1.rotation.x = t * 0.9;
      g1.rotation.y = t * 0.4;

      g2.rotation.y = -t * 0.7;
      g2.rotation.z = t * 0.5;

      g3.rotation.x = Math.PI / 3 + Math.sin(t * 0.6) * 0.3;
      g3.rotation.z = t * 0.35;

      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
