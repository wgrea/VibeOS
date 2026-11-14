import * as THREE from 'three';

export function createHexd() {
  const group = new THREE.Group();

  // Overdriven Bitcrushed Hexagonal Prism Core
  const hexCore = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.85, 0.95, 6),
    new THREE.MeshStandardMaterial({
      color: 0x3b0764,
      emissive: 0xa855f7,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.8,
    })
  );
  group.add(hexCore);

  // Jagged Neon-Magenta Bitcrush Wireframe Shell
  const crushShell = new THREE.Mesh(
    new THREE.CylinderGeometry(1.18, 1.18, 1.25, 6),
    new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      wireframe: true,
    })
  );
  group.add(crushShell);

  // Orbiting Surge Glitch Cubes
  const cubes = [];
  const cubeMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 1.0,
  });

  for (let i = 0; i < 6; i++) {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.22), cubeMat);
    const a = (i / 6) * Math.PI * 2;
    c.position.set(Math.cos(a) * 1.52, 0, Math.sin(a) * 1.52);
    group.add(c);
    cubes.push({ mesh: c, angle: a });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #581c87 0%, #1e1b4b 55%, #020617 100%)',
    update(t, bounce, spring) {
      // Stepped / bitcrushed quantized rotation feel
      const steppedT = Math.floor(t * 12) / 12;
      hexCore.rotation.y = steppedT * 1.8;
      hexCore.rotation.x = Math.sin(steppedT * 1.4) * 0.4;

      crushShell.rotation.y = -t * 1.2;
      crushShell.rotation.z = Math.cos(t * 1.1) * 0.3;

      cubes.forEach((cb, idx) => {
        const a = cb.angle + t * 1.6;
        cb.mesh.position.x = Math.cos(a) * 1.52;
        cb.mesh.position.z = Math.sin(a) * 1.52;
        cb.mesh.position.y = Math.sin(steppedT * 6 + idx) * 0.35;
      });

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
