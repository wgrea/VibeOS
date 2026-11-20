// js/aesthetics/frutiger-aero/dark-metro.js
import * as THREE from 'three';

export function createDarkMetro() {
  const group = new THREE.Group();

  // 1. Sleek Zune HD / Windows Phone Dark Slate Chassis
  const backingGeo = new THREE.BoxGeometry(2.28, 1.78, 0.08);
  const backing = new THREE.Mesh(
    backingGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0x09090b,
      roughness: 0.22,
      metalness: 0.65,
      clearcoat: 0.4,
    })
  );
  backing.position.z = -0.14;
  group.add(backing);

  // Subtle Gunmetal Bezel Edge
  const backingEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(backingGeo),
    new THREE.LineBasicMaterial({
      color: 0x3f3f46,
      transparent: true,
      opacity: 0.85,
    })
  );
  backing.add(backingEdges);

  // 2. Crisp Asymmetric Windows Phone / Zune Live Tiles
  const tileConfigs = [
    { w: 0.96, h: 0.96, x: -0.54, y: 0.34, z: 0.04, color: 0x0ea5e9 }, // Cyan Square
    { w: 0.96, h: 0.45, x: 0.52, y: 0.6, z: -0.02, color: 0xd946ef },  // Magenta Wide
    { w: 0.96, h: 0.45, x: 0.52, y: 0.08, z: 0.07, color: 0x10b981 },  // Emerald Wide
    { w: 1.48, h: 0.52, x: -0.28, y: -0.48, z: 0.05, color: 0xf97316 }, // Zune Orange Panoramic
    { w: 0.44, h: 0.52, x: 0.78, y: -0.48, z: -0.02, color: 0x6366f1 }, // Indigo Accent
  ];

  const labelMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.82,
  });

  const tiles = tileConfigs.map((cfg, idx) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.w, cfg.h, 0.1),
      new THREE.MeshPhysicalMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.38,
        roughness: 0.18,
        metalness: 0.12,
        clearcoat: 0.35,
      })
    );
    mesh.position.set(cfg.x, cfg.y, cfg.z);

    // Minimalist Segoe-style lowercase label bar in bottom-left corner of each tile
    const labelWidth = Math.min(cfg.w * 0.48, 0.44);
    const labelBar = new THREE.Mesh(new THREE.PlaneGeometry(labelWidth, 0.045), labelMat);
    labelBar.position.set(-cfg.w / 2 + labelWidth / 2 + 0.07, -cfg.h / 2 + 0.08, 0.052);
    mesh.add(labelBar);

    group.add(mesh);
    return { mesh, baseZ: cfg.z, phase: idx * 0.9 };
  });

  return {
    group,
    description:
      'Pioneered around 2009–2012 on Zune HD, Windows Phone 7, and Windows 8’s dark theme, Dark Metro stripped away glossy skeuomorphic chrome in favor of pitch-black backgrounds, razor-sharp asymmetric Live Tiles, vibrant jewel-tone accents, and kinetic grid typography.',
    background: 'radial-gradient(circle at 50% 40%, #18181b 0%, #09090b 75%, #000000 100%)',
    update(t, bounce, spring) {
      group.rotation.y = Math.sin(t * 0.6) * 0.24;
      group.rotation.x = Math.cos(t * 0.5) * 0.1;

      tiles.forEach((tile) => {
        tile.mesh.position.z = tile.baseZ + Math.sin(t * 2.2 + tile.phase) * 0.055;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
