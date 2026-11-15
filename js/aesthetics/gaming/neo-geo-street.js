import * as THREE from 'three';

export function createNeoGeoStreet() {
  const group = new THREE.Group();

  const cartBlackMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.35,
  });

  const goldStripeMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    metalness: 0.75,
    roughness: 0.2,
  });

  const redCapMat = new THREE.MeshPhysicalMaterial({
    color: 0xef4444,
    roughness: 0.2,
    clearcoat: 0.85,
  });

  // Neo Geo AES style oversized cartridge
  const cart = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.9, 0.22), cartBlackMat);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.17, 0.14, 0.23), goldStripeMat);
  stripe.position.y = 0.16;
  cart.add(body, stripe);
  group.add(cart);

  // Arcade joystick & red ball-top
  const stickGroup = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.55, 12), goldStripeMat);
  const ballTop = new THREE.Mesh(new THREE.SphereGeometry(0.19, 20, 20), redCapMat);
  ballTop.position.y = 0.3;
  stickGroup.add(shaft, ballTop);
  stickGroup.position.set(0.88, -0.1, 0.35);
  stickGroup.rotation.z = -0.25;
  group.add(stickGroup);

  return {
    group,
    draggable: cart,
    background: 'radial-gradient(circle at 50% 25%, #f97316 0%, #dc2626 50%, #1e1b4b 100%)',
    update(t, bounce, spring) {
      cart.rotation.y = Math.sin(t * 0.9) * 0.45;
      cart.position.y = Math.sin(t * 2) * 0.06;
      stickGroup.rotation.z = -0.25 + Math.sin(t * 5) * 0.18;
      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
