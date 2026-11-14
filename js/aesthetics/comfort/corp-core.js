import * as THREE from 'three';

export function createCorpCore() {
  const group = new THREE.Group();

  const beigeMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.8 });
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    emissive: 0x0369a1,
    emissiveIntensity: 0.45,
    roughness: 0.2,
  });
  const mugMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });

  // Stacked Cubicle Monoliths
  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.35, 0.85), beigeMat);
  tower.position.set(-0.25, -0.1, 0);
  group.add(tower);

  // Glowing Spreadsheet Screen
  const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.42, 0.06), screenMat);
  monitor.position.set(-0.25, 0.15, 0.45);
  group.add(monitor);

  // Floating "No Overtime" Yellow Coffee Mug
  const mugGroup = new THREE.Group();
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.16, 0.34, 20), mugMat);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 10, 20), mugMat);
  handle.position.x = 0.18;
  mugGroup.add(cup, handle);
  mugGroup.position.set(0.75, 0.35, 0.3);
  group.add(mugGroup);

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #e7e5e4 0%, #a8a29e 55%, #57534e 100%)',
    update(t, bounce, spring) {
      mugGroup.position.y = 0.35 + Math.sin(t * 2.2) * 0.12;
      mugGroup.rotation.y = t * 0.8;
      mugGroup.rotation.z = Math.sin(t * 1.5) * 0.15;
      group.scale.setScalar(1 + spring * 0.2);
    },
  };
}
