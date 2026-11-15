import * as THREE from 'three';

export function createForeignGrocery() {
  const group = new THREE.Group();

  const yuzuMat = new THREE.MeshPhysicalMaterial({
    color: 0xfacc15,
    roughness: 0.22,
    clearcoat: 0.8,
  });

  const matchaMat = new THREE.MeshPhysicalMaterial({
    color: 0x4ade80,
    roughness: 0.3,
  });

  const lanternRedMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 0.3,
    roughness: 0.35,
  });

  const konbiniBlueMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.3,
  });

  // International market / konbini colorful packaged goods stack
  const shelfGroup = new THREE.Group();

  const item1 = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.62, 0.32), lanternRedMat);
  item1.position.set(-0.32, 0.15, 0);

  const item2 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.58, 20), matchaMat);
  item2.position.set(0.32, 0.12, 0.08);

  const item3 = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 20), yuzuMat);
  item3.position.set(0, -0.32, 0.24);

  const tray = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.1, 0.72), konbiniBlueMat);
  tray.position.y = -0.62;

  shelfGroup.add(item1, item2, item3, tray);
  group.add(shelfGroup);

  return {
    group,
    draggable: shelfGroup,
    background: 'radial-gradient(circle at 50% 25%, #fef9c3 0%, #bbf7d0 48%, #0284c7 100%)',
    update(t, bounce, spring) {
      shelfGroup.rotation.y = Math.sin(t * 0.8) * 0.45;
      item3.rotation.y = t * 1.2;
      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
