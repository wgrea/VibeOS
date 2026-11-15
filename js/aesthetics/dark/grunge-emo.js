import * as THREE from 'three';

export function createGrungeEmo() {
  const group = new THREE.Group();

  const matteBlackMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.7,
  });

  const crimsonPlaidMat = new THREE.MeshStandardMaterial({
    color: 0xbe123c,
    roughness: 0.55,
  });

  const silverStudMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.9,
    roughness: 0.2,
  });

  // Studded wristband / choker ring
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.16, 16, 36), matteBlackMat);
  group.add(band);

  // Pyramid studs around the ring
  const studGeo = new THREE.ConeGeometry(0.11, 0.22, 4);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const stud = new THREE.Mesh(studGeo, silverStudMat);
    stud.position.set(Math.cos(a) * 0.94, Math.sin(a) * 0.94, 0);
    stud.rotation.z = a - Math.PI / 2;
    group.add(stud);
  }

  // Cracked crimson heart center
  const heartCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.36, 0), crimsonPlaidMat);
  group.add(heartCore);

  return {
    group,
    draggable: heartCore,
    background: 'radial-gradient(circle at 50% 30%, #881337 0%, #27272a 55%, #09090b 100%)',
    update(t, bounce, spring) {
      band.rotation.x = 0.55;
      band.rotation.z = t * 0.55;
      heartCore.rotation.y = -t * 0.9;
      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
