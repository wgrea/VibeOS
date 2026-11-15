import * as THREE from 'three';

export function createLatexPvc() {
  const group = new THREE.Group();

  const fabricMat = new THREE.MeshPhysicalMaterial({
    color: 0x18181b,
    roughness: 0.08,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
  });

  const hardwareMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.95,
    roughness: 0.15,
  });

  // Sculpted bodysuit / catsuit mannequin torso + limbs
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.26, 0.82, 24), fabricMat);
  torso.position.y = 0.25;

  const zipper = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.78, 0.04), hardwareMat);
  zipper.position.set(0, 0.25, 0.29);

  // Arms (toggleable for sleeveless)
  const armGeo = new THREE.CylinderGeometry(0.085, 0.075, 0.68, 16);
  const armL = new THREE.Mesh(armGeo, fabricMat);
  armL.position.set(-0.44, 0.24, 0);
  armL.rotation.z = 0.22;

  const armR = new THREE.Mesh(armGeo, fabricMat);
  armR.position.set(0.44, 0.24, 0);
  armR.rotation.z = -0.22;

  // Legs (toggleable for shorts / full leg)
  const legGeo = new THREE.CylinderGeometry(0.11, 0.085, 0.82, 16);
  const legL = new THREE.Mesh(legGeo, fabricMat);
  legL.position.set(-0.15, -0.52, 0);

  const legR = new THREE.Mesh(legGeo, fabricMat);
  legR.position.set(0.15, -0.52, 0);

  group.add(torso, zipper, armL, armR, legL, legR);

  // Live customizer listeners
  let sleeveless = false;
  let shortLegs = false;

  document.addEventListener('input', (e) => {
    if (e.target.id === 'lab-color-picker') {
      fabricMat.color.set(e.target.value);
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.id === 'lab-finish-select') {
      const mode = e.target.value;
      if (mode === 'latex') {
        fabricMat.roughness = 0.08;
        fabricMat.clearcoat = 1.0;
        fabricMat.clearcoatRoughness = 0.04;
      } else if (mode === 'pvc') {
        fabricMat.roughness = 0.03;
        fabricMat.clearcoat = 1.0;
        fabricMat.clearcoatRoughness = 0.01;
      } else if (mode === 'leather') {
        fabricMat.roughness = 0.36;
        fabricMat.clearcoat = 0.35;
        fabricMat.clearcoatRoughness = 0.28;
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.id === 'lab-toggle-sleeves') {
      sleeveless = !sleeveless;
      armL.visible = !sleeveless;
      armR.visible = !sleeveless;
    }
    if (e.target.id === 'lab-toggle-legs') {
      shortLegs = !shortLegs;
      legL.scale.y = shortLegs ? 0.35 : 1.0;
      legR.scale.y = shortLegs ? 0.35 : 1.0;
      legL.position.y = shortLegs ? -0.26 : -0.52;
      legR.position.y = shortLegs ? -0.26 : -0.52;
    }
  });

  return {
    group,
    draggable: group,
    background: 'radial-gradient(circle at 50% 25%, #3f3f46 0%, #18181b 55%, #09090b 100%)',
    update(t, bounce, spring) {
      group.rotation.y = Math.sin(t * 0.7) * 0.45;
      group.scale.setScalar(1 + spring * 0.22);
    },
  };
}
