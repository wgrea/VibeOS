import * as THREE from 'three';

export function createSkeuoDial() {
  const group = new THREE.Group();

  // 1. Rich Brown Stitched-Leather Camera Body Backing
  const leatherBody = new THREE.Mesh(
    new THREE.BoxGeometry(3.1, 2.3, 0.38),
    new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.85, metalness: 0.05 })
  );
  leatherBody.position.z = -0.22;
  group.add(leatherBody);

  // Silver Chrome Top Plate Trim
  const chromeTop = new THREE.Mesh(
    new THREE.BoxGeometry(3.12, 0.38, 0.4),
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.22, metalness: 0.88 })
  );
  chromeTop.position.set(0, 0.98, -0.22);
  group.add(chromeTop);

  // 2. Brushed-Metal Camera Lens Barrel & Tactile Ridged Dial
  const dialGroup = new THREE.Group();

  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 1.0, 0.55, 36),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.85 })
  );
  barrel.rotation.x = Math.PI / 2;
  dialGroup.add(barrel);

  // 24 Physical Grip Ridges Around the Focus Ring
  const ridgeGeo = new THREE.BoxGeometry(0.05, 0.08, 0.26);
  const ridgeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.25, metalness: 0.9 });
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);
    ridge.position.set(Math.cos(angle) * 0.98, Math.sin(angle) * 0.98, 0.08);
    ridge.rotation.z = angle;
    dialGroup.add(ridge);
  }

  // Deep Optical Glass Lens Element Inside
  const lensGlass = new THREE.Mesh(
    new THREE.SphereGeometry(0.72, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.35),
    new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.35,
      roughness: 0.02,
      clearcoat: 1.0
    })
  );
  lensGlass.rotation.x = Math.PI / 2;
  lensGlass.position.z = -0.18;
  dialGroup.add(lensGlass);

  group.add(dialGroup);

  let spinSpeed = 0.005;

  return {
    group,
    background: 'radial-gradient(circle at 50% 40%, #fef3c7 0%, #d97706 65%, #78350f 100%)',
    update(t, bounce) {
      // Clicking gives the tactile dial a mechanical flick
      if (bounce > 0.18) spinSpeed = 0.14;
      spinSpeed = Math.max(0.005, spinSpeed * 0.94);
      dialGroup.rotation.z -= spinSpeed;
    }
  };
}
