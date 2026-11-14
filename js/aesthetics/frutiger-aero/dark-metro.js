import * as THREE from 'three';

export function createDarkMetro() {
  const group = new THREE.Group();

  // Sharp Zune / Windows Phone Dark Slate Tiles
  const tileConfigs = [
    { w: 0.95, h: 0.95, x: -0.55, y: 0.45, z: 0.05, color: 0x0ea5e9 },
    { w: 0.95, h: 0.44, x: 0.52, y: 0.70, z: -0.05, color: 0xd946ef },
    { w: 0.95, h: 0.44, x: 0.52, y: 0.18, z: 0.1, color: 0x10b981 },
    { w: 1.48, h: 0.55, x: -0.28, y: -0.42, z: 0.08, color: 0xf97316 },
    { w: 0.44, h: 0.55, x: 0.78, y: -0.42, z: -0.04, color: 0x6366f1 },
  ];

  const tiles = tileConfigs.map((cfg, idx) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.w, cfg.h, 0.12),
      new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.35,
        roughness: 0.25,
        metalness: 0.2,
      })
    );
    mesh.position.set(cfg.x, cfg.y, cfg.z);
    group.add(mesh);
    return { mesh, baseZ: cfg.z, phase: idx * 0.9 };
  });

  // Sleek Dark Obsidian Backing Frame
  const backing = new THREE.Mesh(
    new THREE.BoxGeometry(2.25, 1.75, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.3, metalness: 0.7 })
  );
  backing.position.z = -0.14;
  group.add(backing);

  return {
    group,
    background: 'radial-gradient(circle at 50% 40%, #18181b 0%, #09090b 75%, #000000 100%)',
    update(t, bounce, spring) {
      group.rotation.y = Math.sin(t * 0.6) * 0.24;
      group.rotation.x = Math.cos(t * 0.5) * 0.1;

      tiles.forEach((tile) => {
        tile.mesh.position.z = tile.baseZ + Math.sin(t * 2.2 + tile.phase) * 0.06;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
