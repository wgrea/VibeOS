import * as THREE from 'three';

export function createDorfic() {
  const group = new THREE.Group();

  const whiteGlossMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.08,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
  });

  const orangeGlossMat = new THREE.MeshPhysicalMaterial({
    color: 0xff6b00,
    emissive: 0xea580c,
    emissiveIntensity: 0.35,
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
  });

  // Clean White-Orange Capsule Core
  const core = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.55, 0.75, 16, 32),
    whiteGlossMat
  );
  core.rotation.z = Math.PI / 6;
  group.add(core);

  // Sculpted Tangerine Ring Band
  const band = new THREE.Mesh(
    new THREE.TorusGeometry(0.72, 0.11, 20, 48),
    orangeGlossMat
  );
  band.rotation.z = Math.PI / 6;
  band.rotation.x = Math.PI / 2;
  group.add(band);

  // Orbiting Minimalist White & Orange Pill Satellites
  const satellites = [];
  for (let i = 0; i < 6; i++) {
    const sat = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 24, 24),
      i % 2 === 0 ? orangeGlossMat : whiteGlossMat
    );
    const angle = (i / 6) * Math.PI * 2;
    sat.position.set(Math.cos(angle) * 1.45, Math.sin(angle) * 0.4, Math.sin(angle) * 1.45);
    group.add(sat);
    satellites.push({ mesh: sat, angle });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #ffedd5 55%, #fb923c 100%)',
    update(t, bounce, spring) {
      core.rotation.y = t * 0.6;
      band.rotation.y = t * 0.6;

      satellites.forEach((s, idx) => {
        const a = s.angle + t * 0.75;
        s.mesh.position.x = Math.cos(a) * 1.45;
        s.mesh.position.z = Math.sin(a) * 1.45;
        s.mesh.position.y = Math.sin(t * 2 + idx) * 0.35;
      });

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
