import * as THREE from 'three';

export function createKrushclub() {
  const group = new THREE.Group();

  // Hot-Pink & Lime-Green Scenecore Kandi Star Core
  const starCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.85, 0),
    new THREE.MeshPhysicalMaterial({
      color: 0xff007f,
      emissive: 0xdb2777,
      emissiveIntensity: 0.9,
      roughness: 0.08,
      clearcoat: 1.0,
    })
  );
  group.add(starCore);

  // Electric Lime & Cyan Club Strobe Ring
  const clubRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.28, 0.08, 12, 32),
    new THREE.MeshStandardMaterial({
      color: 0xa3e635,
      emissive: 0x65a30d,
      emissiveIntensity: 1.0,
    })
  );
  group.add(clubRing);

  // Orbiting Neon Kandi Beads (Pink, Lime, Cyan, Black)
  const beadColors = [0xff007f, 0xa3e635, 0x00f0ff, 0x18181b];
  const beads = [];

  for (let i = 0; i < 12; i++) {
    const bead = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.14, 16),
      new THREE.MeshPhysicalMaterial({
        color: beadColors[i % beadColors.length],
        emissive: beadColors[i % beadColors.length],
        emissiveIntensity: 0.45,
        roughness: 0.1,
        clearcoat: 1.0,
      })
    );
    const a = (i / 12) * Math.PI * 2;
    bead.position.set(Math.cos(a) * 1.52, (i % 2 === 0 ? 1 : -1) * 0.28, Math.sin(a) * 1.52);
    bead.rotation.z = Math.PI / 2;
    group.add(bead);
    beads.push({ mesh: bead, angle: a });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #be185d 0%, #3b0764 55%, #09090b 100%)',
    update(t, bounce, spring) {
      // High-energy club bounce + fast kandi spin
      const clubBounce = Math.abs(Math.sin(t * 4.8)) * 0.16;
      starCore.position.y = clubBounce;
      starCore.rotation.y = t * 1.9;
      starCore.rotation.z = t * 1.2;

      clubRing.rotation.x = t * 1.4;
      clubRing.rotation.y = -t * 1.1;

      beads.forEach((b, idx) => {
        const a = b.angle + t * 1.7;
        b.mesh.position.x = Math.cos(a) * 1.52;
        b.mesh.position.z = Math.sin(a) * 1.52;
        b.mesh.rotation.y = -a + idx;
      });

      group.scale.setScalar(1 + spring * 0.3);
    },
  };
}
