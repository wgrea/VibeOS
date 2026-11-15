import * as THREE from 'three';

export function createPigglyWiggly() {
  const group = new THREE.Group();

  const piggyPinkMat = new THREE.MeshPhysicalMaterial({
    color: 0xf9a8d4,
    roughness: 0.25,
    clearcoat: 0.75,
  });

  const signRedMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    emissive: 0xb91c1c,
    emissiveIntensity: 0.25,
    roughness: 0.3,
  });

  const chromeCartMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.85,
    roughness: 0.2,
  });

  // Retro Americana grocery sign emblem
  const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.16, 28), signRedMat);
  badge.rotation.x = Math.PI / 2;
  group.add(badge);

  // Cheerful mascot snout center
  const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.35, 0.24, 24), piggyPinkMat);
  snout.rotation.x = Math.PI / 2;
  snout.position.z = 0.12;
  group.add(snout);

  // Chrome shopping basket wire ring
  const basketRing = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.05, 12, 36), chromeCartMat);
  group.add(basketRing);

  return {
    group,
    draggable: badge,
    background: 'radial-gradient(circle at 50% 30%, #fef2f2 0%, #fecaca 48%, #dc2626 100%)',
    update(t, bounce, spring) {
      badge.rotation.y = Math.sin(t * 1.1) * 0.4;
      snout.rotation.y = Math.sin(t * 1.1) * 0.4;
      basketRing.rotation.y = t * 0.75;
      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
