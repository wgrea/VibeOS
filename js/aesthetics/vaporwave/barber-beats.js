import * as THREE from 'three';

export function createBarberBeats() {
  const group = new THREE.Group();

  // Smooth Gold-Foil Lounge Vinyl Record
  const vinyl = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.15, 0.06, 48),
    new THREE.MeshPhysicalMaterial({
      color: 0x1c1917,
      roughness: 0.15,
      metalness: 0.6,
      clearcoat: 1.0,
    })
  );
  vinyl.rotation.x = Math.PI / 3;
  group.add(vinyl);

  // Warm Gold Center Label
  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.07, 32),
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.45,
      metalness: 0.8,
      roughness: 0.2,
    })
  );
  label.rotation.x = Math.PI / 3;
  group.add(label);

  // Classic Red-White-Blue Barber Pole Accent Pillar
  const poleGroup = new THREE.Group();
  poleGroup.position.set(1.38, 0, 0.2);

  const glassCase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 1.45, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.05,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.5,
    })
  );
  poleGroup.add(glassCase);

  const stripeSpiral = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.11, 0.035, 64, 8, 1, 4),
    new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xb91c1c,
      emissiveIntensity: 0.5,
    })
  );
  stripeSpiral.scale.set(1, 3.8, 1);
  poleGroup.add(stripeSpiral);

  group.add(poleGroup);

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #78350f 0%, #292524 60%, #0c0a09 100%)',
    update(t, bounce, spring) {
      vinyl.rotation.y = t * 0.8;
      label.rotation.y = t * 0.8;
      stripeSpiral.rotation.y = t * 1.6;

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
