import * as THREE from 'three';

export function createBrightTertiaries() {
  const group = new THREE.Group();

  // Four-Color Tertiary Palette (Lime, Magenta-Coral, Aqua-Teal, Marigold-Amber)
  const palette = [
    { color: 0xa3e635, pos: [-0.62, 0.55, 0.15] },
    { color: 0xf43f5e, pos: [0.62, 0.55, -0.15] },
    { color: 0x06b6d4, pos: [-0.62, -0.55, -0.15] },
    { color: 0xf59e0b, pos: [0.62, -0.55, 0.15] },
  ];

  const blocks = palette.map((item, idx) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.46, 28, 28),
      new THREE.MeshPhysicalMaterial({
        color: item.color,
        emissive: item.color,
        emissiveIntensity: 0.32,
        roughness: 0.06,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
      })
    );
    mesh.position.set(...item.pos);
    group.add(mesh);
    return { mesh, basePos: item.pos, phase: idx * 1.2 };
  });

  // Central White Glossy Connector Ring
  const hubRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.88, 0.07, 16, 64),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.06,
      clearcoat: 1.0,
    })
  );
  group.add(hubRing);

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #fef9c3 0%, #bae6fd 50%, #fbcfe8 100%)',
    update(t, bounce, spring) {
      group.rotation.y = Math.sin(t * 0.5) * 0.35;
      hubRing.rotation.z = t * 0.65;

      blocks.forEach((b) => {
        b.mesh.position.y = b.basePos[1] + Math.sin(t * 2.2 + b.phase) * 0.1;
        b.mesh.position.z = b.basePos[2] + Math.cos(t * 1.8 + b.phase) * 0.12;
      });

      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
