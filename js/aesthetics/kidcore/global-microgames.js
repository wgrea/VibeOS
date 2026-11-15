import * as THREE from 'three';

export function createGlobalMicrogames() {
  const group = new THREE.Group();

  const yellowMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    emissive: 0xeab308,
    emissiveIntensity: 0.2,
    roughness: 0.3,
  });

  const magentaMat = new THREE.MeshStandardMaterial({
    color: 0xec4899,
    roughness: 0.25,
  });

  const cyanMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    roughness: 0.25,
  });

  // Zero-timer rapid-fire microgame cartridge / lightning emblem
  const cart = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.05, 0.24), yellowMat);
  group.add(cart);

  // Snappy orbiting arcade buttons (A / B / D-pad shapes)
  const btnA = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 20), magentaMat);
  btnA.rotation.x = Math.PI / 2;
  btnA.position.set(-0.95, 0.45, 0.2);

  const btnB = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 20), cyanMat);
  btnB.rotation.x = Math.PI / 2;
  btnB.position.set(0.95, -0.45, 0.2);

  const lightning = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.75, 4), magentaMat);
  lightning.position.set(0, 0, 0.22);

  group.add(btnA, btnB, lightning);

  return {
    group,
    draggable: cart,
    background: 'radial-gradient(circle at 50% 50%, #fef08a 0%, #f43f5e 55%, #4f46e5 100%)',
    update(t, bounce, spring) {
      // Snappy quantized microgame beat motion
      const beat = Math.floor(t * 4);
      cart.rotation.z = (beat % 2 === 0 ? 1 : -1) * 0.12;
      cart.rotation.y = Math.sin(t * 2) * 0.35;
      btnA.scale.setScalar(1 + (beat % 2) * 0.18);
      btnB.scale.setScalar(1 + ((beat + 1) % 2) * 0.18);
      lightning.rotation.z = t * 2.5;
      group.scale.setScalar(1 + spring * 0.3);
    },
  };
}
