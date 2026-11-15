import * as THREE from 'three';

export function createDinosaur() {
  const group = new THREE.Group();

  const dinoGreen = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    roughness: 0.45,
  });

  const spineOrange = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.35,
  });

  const amberMat = new THREE.MeshPhysicalMaterial({
    color: 0xf59e0b,
    transmission: 0.65,
    roughness: 0.1,
    thickness: 0.8,
  });

  // Chunky plastic toy dino silhouette
  const dino = new THREE.Group();

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.55, 0.48), dinoGreen);
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.65, 0.28), dinoGreen);
  neck.position.set(0.38, 0.45, 0);
  neck.rotation.z = -0.25;

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.26, 0.32), dinoGreen);
  head.position.set(0.55, 0.72, 0);

  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.75, 12), dinoGreen);
  tail.rotation.z = Math.PI / 2 + 0.25;
  tail.position.set(-0.72, 0.05, 0);

  dino.add(torso, neck, head, tail);

  // Dorsal plates
  const plateGeo = new THREE.ConeGeometry(0.11, 0.22, 4);
  for (let i = 0; i < 4; i++) {
    const plate = new THREE.Mesh(plateGeo, spineOrange);
    plate.position.set(-0.28 + i * 0.2, 0.36, 0);
    dino.add(plate);
  }

  group.add(dino);

  // Orbiting fossil amber gem
  const amber = new THREE.Mesh(new THREE.DodecahedronGeometry(0.22, 0), amberMat);
  amber.position.set(1.1, 0.5, 0.4);
  group.add(amber);

  return {
    group,
    draggable: dino,
    background: 'radial-gradient(circle at 50% 30%, #fef08a 0%, #86efac 50%, #15803d 100%)',
    update(t, bounce, spring) {
      dino.rotation.y = Math.sin(t * 0.8) * 0.55;
      dino.position.y = Math.abs(Math.sin(t * 3.2)) * 0.14;
      amber.rotation.x = t * 1.1;
      amber.rotation.y = t * 1.4;
      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
