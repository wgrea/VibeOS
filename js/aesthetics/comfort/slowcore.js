import * as THREE from 'three';

export function createSlowcore() {
  const group = new THREE.Group();

  const vinylMat = new THREE.MeshStandardMaterial({
    color: 0x1e1b2e,
    roughness: 0.25,
    metalness: 0.4,
  });

  const labelMat = new THREE.MeshStandardMaterial({
    color: 0xf4a261,
    emissive: 0xe76f51,
    emissiveIntensity: 0.35,
    roughness: 0.5,
  });

  const lampMat = new THREE.MeshPhysicalMaterial({
    color: 0xfde68a,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    transmission: 0.4,
  });

  // Tilted Spinning Vinyl Disc
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.04, 48), vinylMat);
  const label = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.05, 32), labelMat);
  const recordGroup = new THREE.Group();
  recordGroup.add(disc, label);
  recordGroup.rotation.set(0.45, 0, -0.25);
  group.add(recordGroup);

  // Soft Glowing Desk Lamp Sphere
  const lampOrb = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 24), lampMat);
  lampOrb.position.set(1.1, 0.85, -0.4);
  group.add(lampOrb);

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #312e81 0%, #1e1b4b 55%, #0f172a 100%)',
    update(t, bounce, spring) {
      disc.rotation.y = t * 1.1;
      label.rotation.y = t * 1.1;
      recordGroup.position.y = Math.sin(t * 1.4) * 0.08;
      lampOrb.position.y = 0.85 + Math.cos(t * 1.2) * 0.06;
      group.scale.setScalar(1 + spring * 0.2);
    },
  };
}
