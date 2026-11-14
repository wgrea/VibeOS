import * as THREE from 'three';

export function createFrutigerPaleo() {
  const group = new THREE.Group();

  // Translucent Amber-Moss Fossil Resin Sphere
  const amber = new THREE.Mesh(
    new THREE.SphereGeometry(1.05, 32, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0xd97706,
      emissive: 0x78350f,
      emissiveIntensity: 0.3,
      roughness: 0.06,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.78,
    })
  );
  group.add(amber);

  // Trapped Prehistoric Nautilus / Spiral Crystal Inside
  const fossil = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.42, 0.11, 64, 12, 2, 3),
    new THREE.MeshPhysicalMaterial({
      color: 0x4ade80,
      emissive: 0x166534,
      emissiveIntensity: 0.45,
      roughness: 0.15,
      clearcoat: 1.0,
    })
  );
  group.add(fossil);

  // Orbiting Fern-Green & Aqua Leaf Spores
  const spores = [];
  const sporeMat = new THREE.MeshPhysicalMaterial({
    color: 0x34d399,
    roughness: 0.08,
    clearcoat: 1.0,
  });

  for (let i = 0; i < 8; i++) {
    const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), sporeMat);
    const a = (i / 8) * Math.PI * 2;
    s.position.set(Math.cos(a) * 1.48, (i % 2 === 0 ? 1 : -1) * 0.35, Math.sin(a) * 1.48);
    group.add(s);
    spores.push({ mesh: s, angle: a });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #fef3c7 0%, #86efac 50%, #065f46 100%)',
    update(t, bounce, spring) {
      fossil.rotation.y = t * 0.6;
      fossil.rotation.x = Math.sin(t * 0.5) * 0.3;
      amber.rotation.y = -t * 0.2;

      spores.forEach((sp, idx) => {
        const a = sp.angle + t * 0.5;
        sp.mesh.position.x = Math.cos(a) * 1.48;
        sp.mesh.position.z = Math.sin(a) * 1.48;
        sp.mesh.rotation.y = t * 1.5 + idx;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
