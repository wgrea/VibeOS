import * as THREE from 'three';

export function createSanAndreas() {
  const group = new THREE.Group();

  const amberSmogMat = new THREE.MeshPhysicalMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 0.4,
    roughness: 0.3,
  });

  const groveGreenMat = new THREE.MeshPhysicalMaterial({
    color: 0x16a34a,
    roughness: 0.25,
    clearcoat: 0.85,
  });

  const chromeRimMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.9,
    roughness: 0.15,
  });

  // Lowrider hydraulic wheel / chrome rim centerpiece
  const wheel = new THREE.Group();
  const tire = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.18, 16, 36), groveGreenMat);
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.16, 18), chromeRimMat);
  rim.rotation.x = Math.PI / 2;
  wheel.add(tire, rim);
  group.add(wheel);

  // Warm 90s West Coast sun halo
  const halo = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.05, 12, 40), amberSmogMat);
  group.add(halo);

  return {
    group,
    draggable: wheel,
    background: 'linear-gradient(180deg, #78350f 0%, #d97706 48%, #fbbf24 85%, #fef3c7 100%)',
    update(t, bounce, spring) {
      // Hydraulic lowrider bounce
      wheel.position.y = Math.abs(Math.sin(t * 3.2)) * 0.22 - 0.08;
      wheel.rotation.z = Math.sin(t * 1.6) * 0.25;
      halo.rotation.y = t * 0.5;
      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
