// js/aesthetics/vaporwave/eccojams.js

import * as THREE from 'three';

export function createEccojams() {
  const group = new THREE.Group();

  // Dark VHS Static Grid Floor
  const grid = new THREE.GridHelper(12, 24, 0x9333ea, 0x1e1b4b);
  grid.position.y = -1.6;
  group.add(grid);

  // Clear-Plastic Cassette Tape Shell
  const tapeGroup = new THREE.Group();
  const shell = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 1.75, 0.28),
    new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0, transparent: true, opacity: 0.35, roughness: 0.1, clearcoat: 1.0
    })
  );
  tapeGroup.add(shell);

  // Retro Label Strip Across Top
  const label = new THREE.Mesh(
    new THREE.BoxGeometry(2.45, 0.55, 0.3),
    new THREE.MeshBasicMaterial({ color: 0xf43f5e })
  );
  label.position.set(0, 0.42, 0);
  tapeGroup.add(label);

  // Two Exposed Magnetic Tape Reels
  const reels = [];
  const reelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.32, 16);
  reelGeo.rotateX(Math.PI / 2);
  const reelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });

  [-0.65, 0.65].forEach((x) => {
    const reel = new THREE.Mesh(reelGeo, reelMat);
    reel.position.set(x, -0.15, 0);
    // White teeth spokes inside reel
    const spoke = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.08, 0.34),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    reel.add(spoke);
    tapeGroup.add(reel);
    reels.push(reel);
  });

  group.add(tapeGroup);

  return {
    group,
    background: 'radial-gradient(circle at 50% 40%, #3b0764 0%, #1e1b4b 65%, #09090b 100%)',
    update(t, bounce) {
      // Slowed-down "chopped & screwed" cassette wobble
      reels.forEach((r) => { r.rotation.z -= 0.015; });
      tapeGroup.rotation.y = Math.sin(t * 0.9) * 0.35;
      tapeGroup.position.y = Math.sin(t * 1.5) * 0.08 - bounce * 0.4;
    }
  };
}
