import * as THREE from 'three';

export function createHardvapour() {
  const group = new THREE.Group();

  // Industrial Brutalist Spiked Iron Core
  const core = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.95, 0),
    new THREE.MeshStandardMaterial({
      color: 0x18181b,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.45,
      metalness: 0.9,
      roughness: 0.25,
    })
  );
  group.add(core);

  // Crimson Hazard Wireframe Cage
  const cage = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.32, 0),
    new THREE.MeshBasicMaterial({
      color: 0xef4444,
      wireframe: true,
    })
  );
  group.add(cage);

  // Orbiting Heavy Concrete / Steel Slabs
  const slabs = [];
  const slabMat = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    metalness: 0.85,
    roughness: 0.3,
  });

  for (let i = 0; i < 6; i++) {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.75, 0.32), slabMat);
    const a = (i / 6) * Math.PI * 2;
    slab.position.set(Math.cos(a) * 1.55, 0, Math.sin(a) * 1.55);
    slab.rotation.y = -a;
    group.add(slab);
    slabs.push({ mesh: slab, angle: a });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 40%, #7f1d1d 0%, #18181b 60%, #000000 100%)',
    update(t, bounce, spring) {
      // Aggressive, heavy industrial rotation + bass thump
      const thump = Math.pow(Math.abs(Math.sin(t * 5.2)), 8);
      core.rotation.y = t * 1.35;
      core.rotation.x = t * 0.85;
      core.scale.setScalar(1 + thump * 0.16);

      cage.rotation.y = -t * 0.9;
      cage.rotation.z = t * 0.5;

      slabs.forEach((s) => {
        const a = s.angle + t * 1.1;
        s.mesh.position.x = Math.cos(a) * 1.55;
        s.mesh.position.z = Math.sin(a) * 1.55;
        s.mesh.rotation.y = -a;
      });

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
