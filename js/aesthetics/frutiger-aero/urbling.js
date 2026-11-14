import * as THREE from 'three';

export function createUrbling() {
  const group = new THREE.Group();

  // Glossy Playful Graffiti-Vector Cube Core
  const urbanCube = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 0.95, 0.95),
    new THREE.MeshPhysicalMaterial({
      color: 0xf97316,
      emissive: 0xc2410c,
      emissiveIntensity: 0.3,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
    })
  );
  group.add(urbanCube);

  // Bold Urban Vinyl Turntable / Speaker Ring
  const speakerRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.25, 0.14, 16, 48),
    new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9,
      emissive: 0x0369a1,
      emissiveIntensity: 0.35,
      roughness: 0.1,
      clearcoat: 1.0,
    })
  );
  speakerRing.rotation.x = Math.PI / 3;
  group.add(speakerRing);

  // Floating Glossy Urban Street Stars & Arrows (Lime, Cyan, Pink)
  const tagColors = [0x84cc16, 0xec4899, 0xfacc15, 0x22d3ee];
  const tags = [];

  for (let i = 0; i < 8; i++) {
    const tag = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.18, 0),
      new THREE.MeshPhysicalMaterial({
        color: tagColors[i % tagColors.length],
        emissive: tagColors[i % tagColors.length],
        emissiveIntensity: 0.3,
        roughness: 0.06,
        clearcoat: 1.0,
      })
    );
    const a = (i / 8) * Math.PI * 2;
    tag.position.set(Math.cos(a) * 1.55, Math.sin(i * 1.5) * 0.45, Math.sin(a) * 1.55);
    group.add(tag);
    tags.push({ mesh: tag, angle: a, baseY: tag.position.y });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #fef08a 0%, #fb923c 50%, #0284c7 100%)',
    update(t, bounce, spring) {
      urbanCube.rotation.y = t * 0.75;
      urbanCube.rotation.x = Math.sin(t * 0.6) * 0.35;
      speakerRing.rotation.z = -t * 0.65;

      tags.forEach((tg, idx) => {
        const a = tg.angle + t * 0.85;
        tg.mesh.position.x = Math.cos(a) * 1.55;
        tg.mesh.position.z = Math.sin(a) * 1.55;
        tg.mesh.position.y = tg.baseY + Math.sin(t * 2.6 + idx) * 0.14;
        tg.mesh.rotation.y = t * 1.8;
      });

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
