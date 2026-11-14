import * as THREE from 'three';

export function createFrutigerAurora() {
  const group = new THREE.Group();

  // Central Glossy Dew Sphere
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.65, 32, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    })
  );
  group.add(orb);

  // Flowing Aurora Ribbons
  const ribbons = [];
  const ribbonColors = [0x38ef7d, 0x00f2fe, 0xa855f7];

  ribbonColors.forEach((hex, idx) => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.1, -0.7 + idx * 0.35, -0.4),
      new THREE.Vector3(-0.7, 0.8 - idx * 0.25, 0.5),
      new THREE.Vector3(0.8, -0.6 + idx * 0.3, 0.4),
      new THREE.Vector3(2.1, 0.6 - idx * 0.2, -0.4),
    ]);

    const mesh = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 48, 0.11, 12, false),
      new THREE.MeshPhysicalMaterial({
        color: hex,
        emissive: hex,
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.82,
        roughness: 0.12,
        clearcoat: 1.0,
      })
    );
    mesh.rotation.z = (idx - 1) * 0.22;
    group.add(mesh);
    ribbons.push(mesh);
  });

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #ecfdf5 0%, #6ee7b7 45%, #0284c7 100%)',
    update(t, bounce, spring) {
      orb.scale.setScalar(1 + spring * 0.35);
      ribbons.forEach((r, i) => {
        r.rotation.y = Math.sin(t * 1.1 + i * 0.9) * 0.35;
        r.position.y = Math.sin(t * 1.4 + i) * 0.12 + bounce * 0.2;
      });
    },
  };
}
