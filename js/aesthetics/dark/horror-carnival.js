import * as THREE from 'three';

export function createHorrorCarnival() {
  const group = new THREE.Group();

  const crimsonMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    roughness: 0.45,
  });

  const tarnishedGoldMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.65,
    roughness: 0.35,
  });

  const eerieGlowMat = new THREE.MeshBasicMaterial({
    color: 0x84cc16,
  });

  // Tilted creepy Ferris wheel / carousel ring
  const wheel = new THREE.Group();
  const outerRim = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.05, 12, 32), crimsonMat);
  const innerRim = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.04, 12, 24), tarnishedGoldMat);
  wheel.add(outerRim, innerRim);

  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const car = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.18), eerieGlowMat);
    car.position.set(Math.cos(a) * 0.88, Math.sin(a) * 0.88, 0);
    wheel.add(car);
  }

  wheel.rotation.z = 0.2;
  group.add(wheel);

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #450a0a 0%, #1e1b4b 60%, #090d16 100%)',
    update(t, bounce, spring) {
      // Unsteady creaking carousel rotation
      wheel.rotation.z = t * 0.4 + Math.sin(t * 3) * 0.08;
      wheel.rotation.y = Math.sin(t * 0.6) * 0.25;
      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
