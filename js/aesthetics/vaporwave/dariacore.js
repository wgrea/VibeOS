import * as THREE from 'three';

export function createDariacore() {
  const group = new THREE.Group();

  // Chaotic Hyperflip Multi-Primitive Mashup Core
  const colors = [0xff007f, 0x00f0ff, 0xffe600, 0x7000ff, 0x00ff66];
  const primitives = [];

  const geos = [
    new THREE.TorusKnotGeometry(0.55, 0.16, 48, 8, 2, 3),
    new THREE.ConeGeometry(0.35, 0.7, 5),
    new THREE.BoxGeometry(0.45, 0.45, 0.45),
    new THREE.OctahedronGeometry(0.38, 0),
    new THREE.TorusGeometry(0.42, 0.1, 12, 24),
  ];

  geos.forEach((geo, idx) => {
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshPhysicalMaterial({
        color: colors[idx],
        emissive: colors[idx],
        emissiveIntensity: 0.55,
        roughness: 0.08,
        clearcoat: 1.0,
      })
    );
    if (idx > 0) {
      const a = ((idx - 1) / 4) * Math.PI * 2;
      mesh.position.set(Math.cos(a) * 1.15, (idx % 2 === 0 ? 1 : -1) * 0.4, Math.sin(a) * 1.15);
    }
    group.add(mesh);
    primitives.push({ mesh, idx });
  });

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #db2777 0%, #4f46e5 55%, #090d16 100%)',
    update(t, bounce, spring) {
      // Hyper-kinetic, pitch-shifted rapid glitch-spin
      primitives.forEach(({ mesh, idx }) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        mesh.rotation.x = t * (1.8 + idx * 0.35) * dir;
        mesh.rotation.y = t * (2.2 + idx * 0.25) * -dir;
        if (idx > 0) {
          const a = ((idx - 1) / 4) * Math.PI * 2 + t * 1.9;
          mesh.position.x = Math.cos(a) * 1.15;
          mesh.position.z = Math.sin(a) * 1.15;
        }
      });

      group.scale.setScalar(1 + spring * 0.3);
    },
  };
}
