// js/aesthetics/vaporwave/floral-shoppe.js

import * as THREE from 'three';

export function createFloralShoppe() {
  const group = new THREE.Group();

  // 1. Classic Black & White Checkered Floor
  const floorGroup = new THREE.Group();
  const tileSize = 0.85;
  const gridCount = 12;
  const whiteMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
  const blackMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
  const tileGeo = new THREE.PlaneGeometry(tileSize, tileSize);
  tileGeo.rotateX(-Math.PI / 2);

  for (let x = -gridCount / 2; x < gridCount / 2; x++) {
    for (let z = -gridCount / 2; z < gridCount / 2; z++) {
      const isWhite = (x + z) % 2 === 0;
      const tile = new THREE.Mesh(tileGeo, isWhite ? whiteMat : blackMat);
      tile.position.set(
        (x + 0.5) * tileSize,
        -1.3,
        (z + 0.5) * tileSize
      );
      floorGroup.add(tile);
    }
  }
  group.add(floorGroup);

  // 2. Striped 80s Vaporwave Sunset
  const sunGroup = new THREE.Group();
  sunGroup.add(
    new THREE.Mesh(
      new THREE.CircleGeometry(1.9, 32),
      new THREE.MeshBasicMaterial({ color: 0xff71ce })
    )
  );
  [-0.3, -0.7, -1.1, -1.45].forEach((y, i) => {
    const bar = new THREE.Mesh(
      new THREE.PlaneGeometry(3.9, 0.08 + i * 0.04),
      new THREE.MeshBasicMaterial({ color: 0x4c1d95 })
    );
    bar.position.set(0, y, 0.01);
    sunGroup.add(bar);
  });
  sunGroup.position.set(0, 0.65, -3.6);
  group.add(sunGroup);

  // 3. Flanking Classical Roman Columns
  const colMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4 });
  [-2.3, 2.3].forEach((x) => {
    const column = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 2.4, 16), colMat);
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.2, 0.65), colMat);
    base.position.y = -1.2;
    const capital = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.22, 0.68), colMat);
    capital.position.y = 1.2;

    column.add(shaft, base, capital);
    column.position.set(x, 0, -1.8);
    group.add(column);
  });

  // 4. Draggable Sculpted Marble Statue Bust (Helios)
  const statue = new THREE.Group();
  const marble = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.05
  });

  // Fluted Pedestal + Neck + Draped Shoulders
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.35, 16), marble);
  plinth.position.y = -1.1;
  statue.add(plinth);

  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.68, 0.65, 16), marble);
  chest.scale.set(1.25, 1, 0.65);
  chest.position.y = -0.6;
  statue.add(chest);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.35, 16), marble);
  neck.position.y = -0.15;
  statue.add(neck);

  // Sculpted Classical Head, Brow, Nose & Curls
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 24), marble);
  head.scale.set(0.85, 1.15, 0.95);
  head.position.y = 0.25;
  statue.add(head);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.22, 4), marble);
  nose.rotation.x = Math.PI / 2.3;
  nose.position.set(0, 0.23, 0.34);
  statue.add(nose);

  const brow = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.06, 0.12), marble);
  brow.position.set(0, 0.33, 0.29);
  statue.add(brow);

  // Curly Greco-Roman Hair Crown
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 1.4 - Math.PI * 0.2;
    const curl = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), marble);
    curl.position.set(Math.sin(angle) * 0.31, 0.52, Math.cos(angle) * 0.28 - 0.05);
    statue.add(curl);
  }

  group.add(statue);

  // 5. Vaporwave Cyan & Pink Studio Lighting
  const pinkLight = new THREE.PointLight(0xff71ce, 9, 12);
  pinkLight.position.set(-2.5, 2, 2.5);
  group.add(pinkLight);

  const cyanLight = new THREE.PointLight(0x01cdfe, 9, 12);
  cyanLight.position.set(2.5, 1.5, 2.5);
  group.add(cyanLight);

  return {
    group,
    draggable: statue,
    description:
      'Classic vaporwave iconography combining Greco-Roman marble busts, checkered floors, pastel pink-and-cyan gradients, and surreal 90s desktop nostalgia.',
    background: 'linear-gradient(180deg, #ff71ce 0%, #b967ff 55%, #01cdfe 100%)',
    update(t) {
      statue.rotation.y = Math.sin(t * 0.6) * 0.35;
    }
  };
}
