import * as THREE from 'three';

export function createCottagecore() {
  const group = new THREE.Group();

  const stemMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.75 });
  const capMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.55 });
  const spotMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.6 });
  const sporeMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });

  // Stem & Cap
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.34, 1.0, 24), stemMat);
  stem.position.y = -0.35;
  group.add(stem);

  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.95, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.52),
    capMat
  );
  cap.position.y = 0.05;
  group.add(cap);

  // White Spots around the Cap
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const spot = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), spotMat);
    spot.position.set(Math.cos(angle) * 0.68, 0.52, Math.sin(angle) * 0.68);
    spot.scale.set(1, 0.5, 1);
    group.add(spot);
  }

  // Drifting Meadow Spores
  const spores = [];
  for (let i = 0; i < 10; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), sporeMat);
    const a = (i / 10) * Math.PI * 2;
    s.position.set(Math.cos(a) * 1.35, (i % 3) * 0.35 - 0.2, Math.sin(a) * 1.35);
    group.add(s);
    spores.push({ mesh: s, baseY: s.position.y, phase: i * 0.7 });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #fef9c3 0%, #bef264 48%, #4d7c0f 100%)',
    update(t, bounce, spring) {
      group.rotation.y = Math.sin(t * 0.5) * 0.25;
      spores.forEach((s) => {
        s.mesh.position.y = s.baseY + Math.sin(t * 1.8 + s.phase) * 0.15;
      });
      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
