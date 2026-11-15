import * as THREE from 'three';

export function createHorrorCornfield() {
  const group = new THREE.Group();

  const stalkMat = new THREE.MeshStandardMaterial({
    color: 0xa16207,
    roughness: 0.75,
  });

  const pumpkinMat = new THREE.MeshStandardMaterial({
    color: 0xea580c,
    emissive: 0xc2410c,
    emissiveIntensity: 0.25,
    roughness: 0.5,
  });

  const moonMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
  });

  // Harvest moon backdrop
  const moon = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 24), moonMat);
  moon.position.set(0, 0.45, -0.5);
  group.add(moon);

  // Scarecrow / cornstalk cross
  const postV = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.35, 10), stalkMat);
  const postH = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.95, 10), stalkMat);
  postH.rotation.z = Math.PI / 2;
  postH.position.y = 0.22;

  const head = new THREE.Mesh(new THREE.DodecahedronGeometry(0.26, 1), pumpkinMat);
  head.position.y = 0.52;

  group.add(postV, postH, head);

  return {
    group,
    background: 'linear-gradient(180deg, #090d16 0%, #3b0764 45%, #78350f 100%)',
    update(t, bounce, spring) {
      group.rotation.z = Math.sin(t * 1.4) * 0.06;
      head.rotation.y = Math.sin(t * 0.8) * 0.35;
      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
