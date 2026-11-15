import * as THREE from 'three';

export function createSegaTribute() {
  const group = new THREE.Group();

  const goldRingMat = new THREE.MeshPhysicalMaterial({
    color: 0xfacc15,
    emissive: 0xeab308,
    emissiveIntensity: 0.3,
    metalness: 0.85,
    roughness: 0.15,
  });

  const segaBlueMat = new THREE.MeshPhysicalMaterial({
    color: 0x0284c7,
    roughness: 0.2,
    clearcoat: 0.9,
  });

  const checkerDark = new THREE.MeshStandardMaterial({
    color: 0x92400e,
    roughness: 0.6,
  });

  // Iconic spinning golden ring
  const goldRing = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.12, 18, 42), goldRingMat);
  group.add(goldRing);

  // Cobalt speed sphere inside the ring
  const speedOrb = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 24), segaBlueMat);
  group.add(speedOrb);

  // Green Hill style checkered ground band
  const groundBand = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.16, 16), checkerDark);
  groundBand.position.y = -0.92;
  group.add(groundBand);

  return {
    group,
    draggable: speedOrb,
    background: 'linear-gradient(180deg, #0284c7 0%, #38bdf8 55%, #22c55e 56%, #15803d 100%)',
    update(t, bounce, spring) {
      goldRing.rotation.y = t * 2.2;
      speedOrb.position.y = Math.sin(t * 3.5) * 0.12;
      groundBand.rotation.y = -t * 0.8;
      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
