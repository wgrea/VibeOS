import * as THREE from 'three';

export function createDieselpunkSprite() {
  const group = new THREE.Group();

  const oliveMat = new THREE.MeshStandardMaterial({
    color: 0x4d7c0f,
    roughness: 0.65,
    metalness: 0.25,
  });

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x71717a,
    metalness: 0.8,
    roughness: 0.35,
  });

  const hazardMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 0.25,
    roughness: 0.4,
  });

  // Chunky Metal Slug style super-vehicle tank silhouette
  const tank = new THREE.Group();

  const hull = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.48, 0.72), oliveMat);
  const turret = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 16), oliveMat);
  turret.position.set(-0.05, 0.32, 0);

  const cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.65, 14), steelMat);
  cannon.rotation.z = -Math.PI / 2;
  cannon.position.set(0.55, 0.32, 0);

  const treadL = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.26, 0.2), steelMat);
  treadL.position.set(0, -0.28, 0.34);
  const treadR = treadL.clone();
  treadR.position.z = -0.34;

  const heavyShell = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 14), hazardMat);
  heavyShell.position.set(1.15, 0.32, 0);

  tank.add(hull, turret, cannon, treadL, treadR, heavyShell);
  group.add(tank);

  return {
    group,
    draggable: tank,
    background: 'linear-gradient(180deg, #92400e 0%, #d97706 48%, #365314 50%, #1a2e05 100%)',
    update(t, bounce, spring) {
      tank.rotation.y = Math.sin(t * 0.65) * 0.4;
      // Diesel idle engine chug
      hull.position.y = Math.sin(t * 18) * 0.015;
      turret.position.y = 0.32 + Math.sin(t * 18) * 0.02;
      heavyShell.position.x = 1.05 + ((t * 1.6) % 1) * 0.75;
      heavyShell.scale.setScalar(1 - ((t * 1.6) % 1) * 0.5);
      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
