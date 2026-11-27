// js/aesthetics/frutiger-aero/windows-aero.js
import * as THREE from 'three';

export function createWindowsAero() {
  const group = new THREE.Group();

  // 1. Frosted Windows 7 Aero Glass Pane
  const paneGeo = new THREE.BoxGeometry(1.9, 1.3, 0.1);
  const glassPane = new THREE.Mesh(
    paneGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      emissive: 0x0284c7,
      emissiveIntensity: 0.22,
      roughness: 0.06,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
    })
  );
  group.add(glassPane);

  // 2. Crisp White & Ice-Blue Aero Window Bevel Border
  const paneEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(paneGeo),
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    })
  );
  glassPane.add(paneEdges);

  // 3. Diagonal Aero Glass Specular Streaks (iconic Vista / 7 window reflection)
  const streakMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.34,
  });

  const streakMain = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 1.48), streakMat);
  streakMain.position.set(-0.32, 0, 0.056);
  streakMain.rotation.z = -0.35;
  group.add(streakMain);

  const streakThin = new THREE.Mesh(
    new THREE.PlaneGeometry(0.11, 1.48),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
    })
  );
  streakThin.position.set(-0.04, 0, 0.056);
  streakThin.rotation.z = -0.35;
  group.add(streakThin);

  // 4. Glossy Glass Start Orb Halo (subtle translucent ring behind the flag)
  const orbHalo = new THREE.Mesh(
    new THREE.RingGeometry(0.56, 0.61, 48),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    })
  );
  orbHalo.position.set(0, 0.02, 0.12);
  group.add(orbHalo);

  // 5. Iconic Four-Color Floating Glossy Windows Flag Tiles
  const flagConfigs = [
    { color: 0xf97316, x: -0.22, y: 0.22, rz: 0.06 },  // Red-Orange
    { color: 0x84cc16, x: 0.22, y: 0.25, rz: -0.06 },  // Lime Green
    { color: 0x0ea5e9, x: -0.22, y: -0.19, rz: 0.06 }, // Sky Blue
    { color: 0xfacc15, x: 0.22, y: -0.16, rz: -0.06 }, // Warm Yellow
  ];

  const tiles = flagConfigs.map((cfg, idx) => {
    const tileGeo = new THREE.BoxGeometry(0.36, 0.32, 0.07);
    const tile = new THREE.Mesh(
      tileGeo,
      new THREE.MeshPhysicalMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.32,
        roughness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
      })
    );
    tile.position.set(cfg.x, cfg.y, 0.24);
    tile.rotation.z = cfg.rz;
    group.add(tile);
    return { mesh: tile, baseZ: 0.24, baseY: cfg.y, phase: idx * 0.85 };
  });

  return {
    group,
    description:
      'Introduced in 2006 with Windows Vista and perfected in Windows 7, Windows Aero defined mainstream Skeuomorphic glassmorphism through translucent frosted window panes, diagonal light streaks, glossy Start orbs, and vibrant four-color flag motifs.',
    background: 'radial-gradient(circle at 50% 30%, #e0f2fe 0%, #38bdf8 55%, #0369a1 100%)',
    update(t, bounce, spring){
      group.rotation.y = Math.sin(t * 0.55) * 0.24;
      group.rotation.x = Math.cos(t * 0.45) * 0.09;

      orbHalo.scale.setScalar(1 + Math.sin(t * 2) * 0.03);

      tiles.forEach((tile) => {
        tile.mesh.position.z = tile.baseZ + Math.sin(t * 2.2 + tile.phase) * 0.05;
        tile.mesh.position.y = tile.baseY + Math.cos(t * 1.8 + tile.phase) * 0.02;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
