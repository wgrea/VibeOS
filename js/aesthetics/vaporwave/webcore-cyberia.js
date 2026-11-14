import * as THREE from 'three';

export function createWebcoreCyberia() {
  const group = new THREE.Group();

  // Y2K PS1-Era Low-Poly Cyber Angel / Wireframe Torus Knot
  const cyberCore = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.75, 0.22, 48, 8, 3, 4),
    new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x15803d,
      emissiveIntensity: 0.75,
      wireframe: true,
    })
  );
  group.add(cyberCore);

  // Solid Inner Chrome Glitch Cube
  const innerCube = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.55, 0.55),
    new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.1,
    })
  );
  group.add(innerCube);

  // Fast-Orbiting Amen-Break / Early-Web Pop-Up Shards
  const shards = [];
  const shardColors = [0x38bdf8, 0xf43f5e, 0xa3e635, 0xc084fc];

  for (let i = 0; i < 8; i++) {
    const shard = new THREE.Mesh(
      new THREE.TetrahedronGeometry(0.18, 0),
      new THREE.MeshStandardMaterial({
        color: shardColors[i % shardColors.length],
        emissive: shardColors[i % shardColors.length],
        emissiveIntensity: 0.7,
      })
    );
    const a = (i / 8) * Math.PI * 2;
    shard.position.set(Math.cos(a) * 1.48, (i % 2 === 0 ? 1 : -1) * 0.35, Math.sin(a) * 1.48);
    group.add(shard);
    shards.push({ mesh: shard, angle: a });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #064e3b 0%, #1e1b4b 55%, #020617 100%)',
    update(t, bounce, spring) {
      // High-BPM Jungle / Breakcore kinetic spin
      cyberCore.rotation.y = t * 1.4;
      cyberCore.rotation.z = t * 0.9;

      innerCube.rotation.x = -t * 1.8;
      innerCube.rotation.y = -t * 1.5;

      shards.forEach((s, idx) => {
        const a = s.angle + t * 2.1;
        s.mesh.position.x = Math.cos(a) * 1.48;
        s.mesh.position.z = Math.sin(a) * 1.48;
        s.mesh.rotation.x = t * 3 + idx;
        s.mesh.rotation.y = t * 2.5;
      });

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
