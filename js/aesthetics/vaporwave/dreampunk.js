import * as THREE from 'three';

export function createDreampunk() {
  const group = new THREE.Group();

  // Rain-Slicked Reflective Base Slab
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 0.16, 2.2),
    new THREE.MeshPhysicalMaterial({
      color: 0x090d16,
      roughness: 0.08,
      metalness: 0.6,
      clearcoat: 1.0,
    })
  );
  base.position.y = -1.0;
  group.add(base);

  // Cyberpunk Skyscraper Towers with Neon Trim
  const towerSpecs = [
    { pos: [-0.75, -0.1, -0.2], size: [0.55, 1.7, 0.55], glow: 0xf43f5e },
    { pos: [0.05, 0.25, 0.15], size: [0.65, 2.4, 0.65], glow: 0x06b6d4 },
    { pos: [0.85, -0.2, -0.25], size: [0.5, 1.5, 0.5], glow: 0xc084fc },
  ];

  const halos = [];
  towerSpecs.forEach((spec) => {
    const tower = new THREE.Mesh(
      new THREE.BoxGeometry(...spec.size),
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.2,
        metalness: 0.7,
      })
    );
    tower.position.set(...spec.pos);
    group.add(tower);

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.025, 12, 36),
      new THREE.MeshBasicMaterial({ color: spec.glow })
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.set(spec.pos[0], spec.pos[1] + spec.size[1] * 0.5 + 0.18, spec.pos[2]);
    group.add(halo);
    halos.push({ mesh: halo, baseY: halo.position.y });
  });

  return {
    group,
    background: 'linear-gradient(180deg, #090d16 0%, #1e1b4b 55%, #4c1d95 100%)',
    update(t, bounce, spring) {
      group.rotation.y = Math.sin(t * 0.5) * 0.35;
      group.scale.setScalar(1 + spring * 0.22);

      halos.forEach((h, i) => {
        h.mesh.position.y = h.baseY + Math.sin(t * 2.0 + i) * 0.08 + bounce * 0.25;
      });
    },
  };
}
