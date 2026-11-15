import * as THREE from 'three';

export function createTropicalCore() {
  const group = new THREE.Group();

  const coralMat = new THREE.MeshPhysicalMaterial({
    color: 0xfb7185,
    roughness: 0.25,
    clearcoat: 0.7,
  });

  const frondGreenMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    roughness: 0.35,
  });

  const lagoonMat = new THREE.MeshPhysicalMaterial({
    color: 0x06b6d4,
    transmission: 0.55,
    roughness: 0.1,
    thickness: 0.6,
  });

  // Tropical sun-coral sphere
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.46, 1), coralMat);
  group.add(core);

  // Palm frond fan ring
  const frondRing = new THREE.Group();
  const frondGeo = new THREE.ConeGeometry(0.22, 0.78, 5);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const frond = new THREE.Mesh(frondGeo, frondGreenMat);
    frond.position.set(Math.cos(a) * 0.85, Math.sin(a) * 0.85, 0);
    frond.rotation.z = a - Math.PI / 2;
    frondRing.add(frond);
  }
  frondRing.rotation.x = 0.4;
  group.add(frondRing);

  // Lagoon water ring
  const waterRing = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.08, 16, 40), lagoonMat);
  waterRing.rotation.x = Math.PI / 2;
  waterRing.position.y = -0.5;
  group.add(waterRing);

  return {
    group,
    background: 'linear-gradient(180deg, #fef08a 0%, #34d399 48%, #0891b2 100%)',
    update(t, bounce, spring) {
      frondRing.rotation.z = t * 0.4;
      core.rotation.y = -t * 0.6;
      waterRing.position.y = -0.5 + Math.sin(t * 2.2) * 0.06;
      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
