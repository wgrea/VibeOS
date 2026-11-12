import * as THREE from 'three';

export function createFloralShoppe() {
  const group = new THREE.Group();

  // Neon Cyan & Magenta Grid Floor
  const grid = new THREE.GridHelper(16, 20, 0x06b6d4, 0xec4899);
  grid.position.y = -1.3;
  group.add(grid);

  // Striped 80s Sunset
  const sunGroup = new THREE.Group();
  sunGroup.add(new THREE.Mesh(
    new THREE.CircleGeometry(1.9, 32),
    new THREE.MeshBasicMaterial({ color: 0xf472b6 })
  ));
  [-0.3, -0.7, -1.1, -1.45].forEach((y, i) => {
    const bar = new THREE.Mesh(
      new THREE.PlaneGeometry(3.9, 0.08 + i * 0.04),
      new THREE.MeshBasicMaterial({ color: 0x3b0764 })
    );
    bar.position.set(0, y, 0.01);
    sunGroup.add(bar);
  });
  sunGroup.position.set(0, 0.6, -3.5);
  group.add(sunGroup);

  // Draggable Sculpted Marble Statue Bust
  const statue = new THREE.Group();
  const marble = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 });

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

  return {
    group,
    draggable: statue,
    background: 'linear-gradient(180deg, #ff71ce 0%, #b967ff 55%, #01cdfe 100%)',
    update(t) {
      statue.rotation.y = Math.sin(t * 0.6) * 0.35;
    }
  };
}
