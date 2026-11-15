import * as THREE from 'three';

export function createSnowsuit() {
  const group = new THREE.Group();

  const primaryMat = new THREE.MeshPhysicalMaterial({
    color: 0x0284c7,
    roughness: 0.32,
    clearcoat: 0.45,
  });

  const accentMat = new THREE.MeshPhysicalMaterial({
    color: 0xf43f5e,
    roughness: 0.32,
    clearcoat: 0.45,
  });

  const beltMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.4,
  });

  // Padded insulated ski suit silhouette
  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.34, 0.46, 20), accentMat);
  chest.position.y = 0.42;

  const lowerTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.32, 0.42, 20), primaryMat);
  lowerTorso.position.y = 0.02;

  const waistBelt = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.045, 12, 28), beltMat);
  waistBelt.rotation.x = Math.PI / 2;
  waistBelt.position.y = 0.18;

  const armGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.68, 16);
  const armL = new THREE.Mesh(armGeo, accentMat);
  armL.position.set(-0.5, 0.24, 0);
  armL.rotation.z = 0.28;

  const armR = new THREE.Mesh(armGeo, accentMat);
  armR.position.set(0.5, 0.24, 0);
  armR.rotation.z = -0.28;

  const legGeo = new THREE.CylinderGeometry(0.14, 0.13, 0.78, 16);
  const legL = new THREE.Mesh(legGeo, primaryMat);
  legL.position.set(-0.18, -0.52, 0);

  const legR = new THREE.Mesh(legGeo, primaryMat);
  legR.position.set(0.18, -0.52, 0);

  group.add(chest, lowerTorso, waistBelt, armL, armR, legL, legR);

  // Switch between Vintage, Classic Ski, and Modern Ski Suit
  document.addEventListener('change', (e) => {
    if (e.target.id === 'lab-snowsuit-type') {
      const style = e.target.value;
      if (style === 'vintage') {
        primaryMat.color.set(0x0284c7);
        accentMat.color.set(0xf43f5e);
        beltMat.color.set(0xfacc15);
        chest.scale.set(1.08, 1, 1.08);
      } else if (style === 'classic') {
        primaryMat.color.set(0x1e293b);
        accentMat.color.set(0x38bdf8);
        beltMat.color.set(0xf8fafc);
        chest.scale.set(1.0, 1, 1.0);
      } else if (style === 'modern') {
        primaryMat.color.set(0xf8fafc);
        accentMat.color.set(0xe2e8f0);
        beltMat.color.set(0x0f172a);
        chest.scale.set(0.92, 1, 0.92);
      }
    }
  });

  return {
    group,
    draggable: group,
    background: 'linear-gradient(180deg, #bae6fd 0%, #e0f2fe 55%, #f8fafc 100%)',
    update(t, bounce, spring) {
      group.rotation.y = Math.sin(t * 0.65) * 0.45;
      group.scale.setScalar(1 + spring * 0.22);
    },
  };
}
