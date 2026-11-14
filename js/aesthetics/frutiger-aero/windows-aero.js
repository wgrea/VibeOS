import * as THREE from 'three';

export function createWindowsAero() {
  const group = new THREE.Group();

  // Frosted Windows 7 Aero Glass Pane
  const glassPane = new THREE.Mesh(
    new THREE.BoxGeometry(1.85, 1.25, 0.1),
    new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25,
      roughness: 0.08,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transparent: true,
      opacity: 0.72,
    })
  );
  group.add(glassPane);

  // Diagonal Aero Glass Specular Streak
  const streak = new THREE.Mesh(
    new THREE.PlaneGeometry(0.42, 1.45),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.32,
    })
  );
  streak.position.set(-0.25, 0, 0.055);
  streak.rotation.z = -0.35;
  group.add(streak);

  // Iconic Four-Color Floating Windows Flag Orbs in Front
  const flagColors = [
    { color: 0xf97316, x: -0.24, y: 0.22 }, // Red-Orange
    { color: 0x84cc16, x: 0.24, y: 0.26 },  // Lime Green
    { color: 0x0ea5e9, x: -0.24, y: -0.22 }, // Sky Blue
    { color: 0xfacc15, x: 0.24, y: -0.18 }, // Warm Yellow
  ];

  const tiles = flagColors.map((cfg, idx) => {
    const tile = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.34, 0.08),
      new THREE.MeshPhysicalMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.35,
        roughness: 0.06,
        clearcoat: 1.0,
      })
    );
    tile.position.set(cfg.x, cfg.y, 0.24);
    group.add(tile);
    return { mesh: tile, baseZ: 0.24, phase: idx * 0.8 };
  });

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #e0f2fe 0%, #38bdf8 55%, #0369a1 100%)',
    update(t, bounce, spring) {
      group.rotation.y = Math.sin(t * 0.55) * 0.25;
      group.rotation.x = Math.cos(t * 0.45) * 0.1;

      tiles.forEach((tile) => {
        tile.mesh.position.z = tile.baseZ + Math.sin(t * 2.2 + tile.phase) * 0.05;
      });

      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
