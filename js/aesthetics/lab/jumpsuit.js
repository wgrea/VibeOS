import * as THREE from 'three';

export function createJumpsuit() {
  const group = new THREE.Group();

  const suitMat = new THREE.MeshPhysicalMaterial({
    color: 0xea580c,
    roughness: 0.55,
    clearcoat: 0.15,
  });

  const collarMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.45,
  });

  // One-piece utilitarian / funnel-neck jumpsuit silhouette
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.3, 0.84, 22), suitMat);
  torso.position.y = 0.24;

  const funnelNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.16, 20), collarMat);
  funnelNeck.position.y = 0.72;

  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 22), collarMat);
  belt.position.y = 0.05;

  const armGeo = new THREE.CylinderGeometry(0.095, 0.085, 0.68, 16);
  const armL = new THREE.Mesh(armGeo, suitMat);
  armL.position.set(-0.46, 0.24, 0);
  armL.rotation.z = 0.22;

  const armR = new THREE.Mesh(armGeo, suitMat);
  armR.position.set(0.46, 0.24, 0);
  armR.rotation.z = -0.22;

  const legGeo = new THREE.CylinderGeometry(0.125, 0.11, 0.82, 16);
  const legL = new THREE.Mesh(legGeo, suitMat);
  legL.position.set(-0.16, -0.52, 0);

  const legR = new THREE.Mesh(legGeo, suitMat);
  legR.position.set(0.16, -0.52, 0);

  group.add(torso, funnelNeck, belt, armL, armR, legL, legR);

  // Live color & fabric switcher
  document.addEventListener('input', (e) => {
    if (e.target.id === 'lab-color-picker') {
      suitMat.color.set(e.target.value);
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.id === 'lab-finish-select') {
      const fabric = e.target.value;
      if (fabric === 'denim') {
        suitMat.roughness = 0.75;
        suitMat.clearcoat = 0.0;
      } else if (fabric === 'leather') {
        suitMat.roughness = 0.35;
        suitMat.clearcoat = 0.4;
      } else if (fabric === 'nylon') {
        suitMat.roughness = 0.28;
        suitMat.clearcoat = 0.55;
      } else {
        suitMat.roughness = 0.1;
        suitMat.clearcoat = 0.95;
      }
    }
  });

  return {
    group,
    draggable: group,
    background: 'radial-gradient(circle at 50% 30%, #fed7aa 0%, #fb923c 50%, #431407 100%)',
    update(t, bounce, spring) {
      group.rotation.y = Math.sin(t * 0.7) * 0.45;
      group.scale.setScalar(1 + spring * 0.22);
    },
  };
}
