import * as THREE from 'three';

export function createAdultAnimation() {
  const group = new THREE.Group();

  const crtBezelMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.45,
  });

  const screenGlowMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    emissive: 0x0ea5e9,
    emissiveIntensity: 0.45,
    roughness: 0.15,
    clearcoat: 0.9,
  });

  const couchOrangeMat = new THREE.MeshStandardMaterial({
    color: 0xea580c,
    roughness: 0.65,
  });

  // Living room CRT television & rabbit-ear antennas
  const tvSet = new THREE.Group();
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.85, 0.65), crtBezelMat);
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.64, 0.06), screenGlowMat);
  screen.position.z = 0.32;

  const antGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.55, 8);
  const antL = new THREE.Mesh(antGeo, crtBezelMat);
  antL.position.set(-0.2, 0.62, 0);
  antL.rotation.z = 0.45;

  const antR = new THREE.Mesh(antGeo, crtBezelMat);
  antR.position.set(0.2, 0.62, 0);
  antR.rotation.z = -0.45;

  tvSet.add(bezel, screen, antL, antR);
  tvSet.position.y = 0.12;
  group.add(tvSet);

  // Iconic sitcom couch cushion bar below
  const couch = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.26, 0.55), couchOrangeMat);
  couch.position.set(0, -0.56, 0.15);
  group.add(couch);

  return {
    group,
    draggable: tvSet,
    background: 'linear-gradient(180deg, #1e1b4b 0%, #4338ca 50%, #f59e0b 100%)',
    update(t, bounce, spring) {
      tvSet.rotation.y = Math.sin(t * 0.75) * 0.35;
      screenGlowMat.emissiveIntensity = 0.4 + Math.sin(t * 8) * 0.1;
      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
