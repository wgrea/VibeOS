import * as THREE from 'three';

export function createKawaii() {
  const group = new THREE.Group();

  const pastelPink = new THREE.MeshPhysicalMaterial({
    color: 0xf9a8d4,
    roughness: 0.25,
    clearcoat: 0.6,
  });

  const creamMat = new THREE.MeshPhysicalMaterial({
    color: 0xfffbeb,
    roughness: 0.3,
  });

  const ribbonMat = new THREE.MeshPhysicalMaterial({
    color: 0xf43f5e,
    roughness: 0.2,
    clearcoat: 0.8,
  });

  // Plump mascot head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.72, 28, 28), creamMat);
  head.scale.set(1.15, 0.95, 0.95);
  group.add(head);

  // Rounded ears
  const earGeo = new THREE.ConeGeometry(0.24, 0.48, 20);
  const leftEar = new THREE.Mesh(earGeo, creamMat);
  leftEar.position.set(-0.48, 0.68, 0);
  leftEar.rotation.z = 0.35;

  const rightEar = new THREE.Mesh(earGeo, creamMat);
  rightEar.position.set(0.48, 0.68, 0);
  rightEar.rotation.z = -0.35;
  group.add(leftEar, rightEar);

  // Iconic side bow
  const bowCenter = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), ribbonMat);
  const bowL = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), ribbonMat);
  bowL.scale.set(1.2, 0.85, 0.6);
  bowL.position.x = -0.2;
  const bowR = bowL.clone();
  bowR.position.x = 0.2;

  const bowGroup = new THREE.Group();
  bowGroup.add(bowCenter, bowL, bowR);
  bowGroup.position.set(0.55, 0.58, 0.32);
  bowGroup.rotation.z = -0.35;
  group.add(bowGroup);

  // Floating pastel hearts/charms ring
  const charmRing = new THREE.Group();
  const charmGeo = new THREE.OctahedronGeometry(0.16, 1);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const charm = new THREE.Mesh(charmGeo, pastelPink);
    charm.position.set(Math.cos(a) * 1.25, Math.sin(a) * 0.4, Math.sin(a) * 1.25);
    charmRing.add(charm);
  }
  group.add(charmRing);

  return {
    group,
    background: 'radial-gradient(circle at 50% 25%, #fff1f2 0%, #fbcfe8 55%, #bae6fd 100%)',
    update(t, bounce, spring) {
      head.position.y = Math.sin(t * 2.4) * 0.08;
      bowGroup.rotation.z = -0.35 + Math.sin(t * 4) * 0.1;
      charmRing.rotation.y = t * 0.7;
      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
