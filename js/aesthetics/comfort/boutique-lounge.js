import * as THREE from 'three';

export function createBoutiqueLounge() {
  const group = new THREE.Group();

  const floorMat = new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.5 });
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x99f6e4, roughness: 0.6 });
  const sofaMat = new THREE.MeshStandardMaterial({ color: 0xfb7185, roughness: 0.45 });
  const rugMat = new THREE.MeshStandardMaterial({ color: 0xc4b5fd, roughness: 0.7 });

  const room = new THREE.Group();

  // Isometric Cutaway Floor & Walls
  const floor = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 1.8), floorMat);
  floor.position.y = -0.55;

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 0.12), wallMat);
  backWall.position.set(0, 0, -0.84);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 1.8), wallMat);
  leftWall.position.set(-0.84, 0, 0);

  // Cozy Rug & Mini Couch
  const rug = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.03, 28), rugMat);
  rug.position.set(0.15, -0.48, 0.15);

  const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.28, 0.42), sofaMat);
  sofaBase.position.set(-0.15, -0.35, -0.45);

  const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.35, 0.14), sofaMat);
  sofaBack.position.set(-0.15, -0.15, -0.6);

  room.add(floor, backWall, leftWall, rug, sofaBase, sofaBack);
  room.rotation.set(0.25, -Math.PI / 4, 0);
  group.add(room);

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #fef3c7 0%, #a7f3d0 50%, #6ee7b7 100%)',
    update(t, bounce, spring) {
      room.rotation.y = -Math.PI / 4 + Math.sin(t * 0.7) * 0.22;
      room.position.y = Math.sin(t * 1.5) * 0.06;
      group.scale.setScalar(1 + spring * 0.22);
    },
  };
}
