import * as THREE from 'three';

export function createBrokenTransmission() {
  const group = new THREE.Group();

  // Retro CRT Monitor Chassis
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 1.5, 1.3),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.2 })
  );
  group.add(body);

  // Procedural Broadcast Color Bars + Static Texture
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const bars = ['#f8fafc', '#facc15', '#22d3ee', '#4ade80', '#e879f9', '#ef4444', '#3b82f6'];
  bars.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect((i * 128) / bars.length, 0, 128 / bars.length + 1, 96);
  });
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 96, 128, 32);

  const screenTex = new THREE.CanvasTexture(canvas);
  screenTex.wrapT = THREE.RepeatWrapping;

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.55, 1.15),
    new THREE.MeshBasicMaterial({ map: screenTex })
  );
  screen.position.z = 0.66;
  group.add(screen);

  // Rabbit-Ear Antennas
  const antennaMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.15 });
  [-1, 1].forEach((side) => {
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.1, 8), antennaMat);
    rod.position.set(side * 0.35, 1.15, -0.1);
    rod.rotation.z = -side * 0.45;
    group.add(rod);
  });

  return {
    group,
    background: 'radial-gradient(circle at 50% 40%, #312e81 0%, #1e1b4b 60%, #090d16 100%)',
    update(t, bounce, spring) {
      screenTex.offset.y = (t * 0.8 + bounce * 2) % 1;
      group.rotation.y = Math.sin(t * 0.9) * 0.3 + spring * 0.4;
      group.position.y = Math.sin(t * 1.6) * 0.08;
    },
  };
}
