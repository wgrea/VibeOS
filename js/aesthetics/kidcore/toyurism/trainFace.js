import * as THREE from 'three';

export function buildTrainFace(materials, radius = 0.105) {
  const { faceGreyMat, whiteMat, inkBlackMat } = materials;
  const face = new THREE.Group();

  const disc = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.032, 18), faceGreyMat);
  disc.rotation.z = Math.PI / 2;
  face.add(disc);

  [-radius * 0.34, radius * 0.34].forEach((zEye) => {
    const eyeW = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.2, 10, 10), whiteMat);
    eyeW.position.set(0.016, radius * 0.22, zEye);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.11, 8, 8), inkBlackMat);
    pupil.position.set(0.03, radius * 0.22, zEye);
    const brow = new THREE.Mesh(
      new THREE.BoxGeometry(0.008, radius * 0.09, radius * 0.32),
      inkBlackMat
    );
    brow.position.set(0.022, radius * 0.5, zEye);
    face.add(eyeW, pupil, brow);
  });

  const nose = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.15, 10, 10), faceGreyMat);
  nose.position.set(0.026, -radius * 0.04, 0);

  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(radius * 0.28, radius * 0.06, 8, 14, Math.PI),
    inkBlackMat
  );
  smile.rotation.y = Math.PI / 2;
  smile.rotation.x = Math.PI;
  smile.position.set(0.02, -radius * 0.2, 0);

  face.add(nose, smile);
  return face;
}