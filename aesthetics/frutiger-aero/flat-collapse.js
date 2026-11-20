// js/aesthetics/frutiger-aero/flat-collapse.js
import * as THREE from 'three';

export function createFlatCollapse() {
  const group = new THREE.Group();

  // 1. Paper-Thin Unlit 2D UI Canvas & Pastel Cards (Zero shadows, zero gloss, zero Z-depth)
  const cards = [
    { w: 2.8, h: 1.8, color: 0xffffff, x: 0, y: 0, z: 0.0, border: 0xcbd5e1 },
    { w: 2.8, h: 0.34, color: 0x38bdf8, x: 0, y: 0.73, z: 0.002 },
    { w: 1.15, h: 0.62, color: 0xf472b6, x: -0.65, y: -0.22, z: 0.002 },
    { w: 1.15, h: 0.62, color: 0x34d399, x: 0.65, y: -0.22, z: 0.002 },
  ];

  cards.forEach((c) => {
    const geo = new THREE.PlaneGeometry(c.w, c.h);
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ color: c.color }) // Completely unlit flat color
    );
    mesh.position.set(c.x, c.y, c.z);

    // Optional razor-thin 2D hairline border on the white card base
    if (c.border) {
      const outline = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: c.border })
      );
      mesh.add(outline);
    }

    group.add(mesh);
  });

  // 2. Minimalist Flat UI Header Dots & Wireframe Content Bars
  const navDotColors = [0xf87171, 0xfbbf24, 0x4ade80];
  navDotColors.forEach((hex, idx) => {
    const dot = new THREE.Mesh(
      new THREE.CircleGeometry(0.042, 20),
      new THREE.MeshBasicMaterial({ color: hex })
    );
    dot.position.set(-1.22 + idx * 0.14, 0.73, 0.004);
    group.add(dot);
  });

  const barMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });
  const topBar = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.08), barMat);
  topBar.position.set(-0.42, 0.34, 0.004);
  group.add(topBar);

  const subBar = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.055), barMat);
  subBar.position.set(-0.695, 0.21, 0.004);
  group.add(subBar);

  // Flat white vector icon badges inside the two pastel tiles
  const badgeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const leftBadge = new THREE.Mesh(new THREE.CircleGeometry(0.12, 24), badgeMat);
  leftBadge.position.set(-0.65, -0.15, 0.004);
  group.add(leftBadge);

  const rightBadge = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), badgeMat);
  rightBadge.position.set(0.65, -0.15, 0.004);
  group.add(rightBadge);

  return {
    group,
    description:
      'Arriving in 2013 with iOS 7, Windows 8, and early Material Design, Flat Collapse abruptly erased skeuomorphic glass, drop shadows, and glossy 3D depth in favor of paper-thin pastel cards, unlit solid colors, and rigid 2D layouts.',
    background: '#f1f5f9', // Stark, matte off-white flat background
    update(t, bounce, spring) {
      // Rigid, zero-depth 2D snap when clicked (no 3D tilt or jelly physics)
      group.rotation.set(0, 0, 0);
      group.scale.setScalar(1 - bounce * 0.12);
    },
  };
}
