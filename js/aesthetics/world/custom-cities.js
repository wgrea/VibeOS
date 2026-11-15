import * as THREE from 'three';

export function createCustomCities() {
  const group = new THREE.Group();

  const glassTowerMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    roughness: 0.15,
    metalness: 0.3,
    clearcoat: 0.9,
  });

  const brickTowerMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    roughness: 0.45,
  });

  const transitRingMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    emissive: 0xeab308,
    emissiveIntensity: 0.3,
    roughness: 0.3,
  });

  // Stylized miniature skyline cluster (Chicago / Tokyo / Neo-Metropolis vibe)
  const skyline = new THREE.Group();

  const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.15, 0.32), glassTowerMat);
  b1.position.set(0, 0.05, 0);

  const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.82, 0.28), brickTowerMat);
  b2.position.set(-0.42, -0.12, 0.15);

  const b3 = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.92, 0.28), glassTowerMat);
  b3.position.set(0.42, -0.06, -0.12);

  skyline.add(b1, b2, b3);
  group.add(skyline);

  // Elevated transit loop track
  const elTrack = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.04, 12, 40), transitRingMat);
  elTrack.rotation.x = Math.PI / 2;
  elTrack.position.y = -0.38;
  group.add(elTrack);

  return {
    group,
    draggable: skyline,
    background: 'radial-gradient(circle at 50% 25%, #bae6fd 0%, #38bdf8 50%, #1e3a8a 100%)',
    update(t, bounce, spring) {
      skyline.rotation.y = t * 0.45;
      elTrack.rotation.z = -t * 0.6;
      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
