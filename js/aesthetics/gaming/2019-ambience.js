import * as THREE from 'three';

export function create2019Ambience() {
  const group = new THREE.Group();

  const warmLampMat = new THREE.MeshPhysicalMaterial({
    color: 0xfdba74,
    emissive: 0xf97316,
    emissiveIntensity: 0.55,
    roughness: 0.35,
  });

  const duskPurpleMat = new THREE.MeshPhysicalMaterial({
    color: 0x818cf8,
    roughness: 0.3,
    clearcoat: 0.5,
  });

  const plantGreenMat = new THREE.MeshStandardMaterial({
    color: 0x34d399,
    roughness: 0.5,
  });

  // Lo-fi study window frame & warm dusk lamp
  const windowFrame = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.95, 0.08), duskPurpleMat);
  windowFrame.position.z = -0.25;
  group.add(windowFrame);

  const warmOrb = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 24), warmLampMat);
  warmOrb.position.set(-0.32, 0.1, 0.15);
  group.add(warmOrb);

  // Cozy desk succulent / monstera sphere
  const plant = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 1), plantGreenMat);
  plant.position.set(0.42, -0.25, 0.22);
  group.add(plant);

  return {
    group,
    background: 'linear-gradient(180deg, #312e81 0%, #6d28d9 48%, #f472b6 82%, #fed7aa 100%)',
    update(t, bounce, spring) {
      warmOrb.scale.setScalar(1 + Math.sin(t * 1.8) * 0.05);
      plant.rotation.y = t * 0.4;
      group.rotation.y = Math.sin(t * 0.5) * 0.25;
      group.scale.setScalar(1 + spring * 0.22);
    },
  };
}
