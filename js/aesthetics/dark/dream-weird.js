import * as THREE from 'three';

export function createDreamWeird() {
  const group = new THREE.Group();

  const scleraMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    roughness: 0.15,
    clearcoat: 0.9,
  });

  const irisMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    emissive: 0x2563eb,
    emissiveIntensity: 0.35,
  });

  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });

  const wingMat = new THREE.MeshStandardMaterial({
    color: 0xe9d5ff,
    emissive: 0xa855f7,
    emissiveIntensity: 0.25,
    roughness: 0.4,
  });

  // Central floating Weirdcore eyeball
  const eyeGroup = new THREE.Group();
  const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.55, 28, 28), scleraMat);
  const iris = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 20), irisMat);
  iris.position.z = 0.36;
  const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), pupilMat);
  pupil.position.z = 0.54;
  eyeGroup.add(sclera, iris, pupil);
  group.add(eyeGroup);

  // Surreal angel wing slabs
  const wingGeo = new THREE.BoxGeometry(0.75, 0.22, 0.06);
  const wingL = new THREE.Mesh(wingGeo, wingMat);
  wingL.position.set(-0.88, 0.1, 0);
  wingL.rotation.z = 0.3;

  const wingR = new THREE.Mesh(wingGeo, wingMat);
  wingR.position.set(0.88, 0.1, 0);
  wingR.rotation.z = -0.3;
  group.add(wingL, wingR);

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #c084fc 0%, #4c1d95 55%, #090d16 100%)',
    update(t, bounce, spring) {
      eyeGroup.rotation.y = Math.sin(t * 1.3) * 0.45;
      eyeGroup.rotation.x = Math.cos(t * 0.9) * 0.25;
      wingL.rotation.z = 0.3 + Math.sin(t * 3) * 0.15;
      wingR.rotation.z = -0.3 - Math.sin(t * 3) * 0.15;
      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
