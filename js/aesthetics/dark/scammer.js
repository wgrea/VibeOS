import * as THREE from 'three';

export function createScammer() {
  const group = new THREE.Group();

  const alertRedMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 0.55,
    roughness: 0.25,
  });

  const goldCoinMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    metalness: 0.9,
    roughness: 0.15,
  });

  const popupBlueMat = new THREE.MeshStandardMaterial({
    color: 0x2563eb,
    roughness: 0.3,
  });

  // Stacked fake Windows error / popup modals
  const modalBack = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.78, 0.08), popupBlueMat);
  modalBack.position.set(-0.18, 0.16, -0.15);

  const modalFront = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.78, 0.08), alertRedMat);
  modalFront.position.set(0.18, -0.12, 0.12);

  // Spinning crypto / jackpot token
  const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 24), goldCoinMat);
  coin.rotation.x = Math.PI / 2;
  coin.position.set(0.55, 0.48, 0.35);

  group.add(modalBack, modalFront, coin);

  return {
    group,
    draggable: modalFront,
    background: 'radial-gradient(circle at 50% 30%, #fef08a 0%, #dc2626 50%, #111827 100%)',
    update(t, bounce, spring) {
      coin.rotation.z = t * 3.0;
      modalFront.position.x = 0.18 + Math.sin(t * 14) * 0.02;
      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
