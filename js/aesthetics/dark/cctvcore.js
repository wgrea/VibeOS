// js/aesthetics/dark/cctvcore.js
import * as THREE from 'three';

export function createCCTVcore({ camera, domElement, box }) {
const group = new THREE.Group();
  group.name = 'cctv';

  // Simple room corner — the "scene being filmed"
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3),
    new THREE.MeshStandardMaterial({ color: 0x1a221a, roughness: 0.9 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.6;
  group.add(floor);

  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 1.6),
    new THREE.MeshStandardMaterial({ color: 0x1a221a, roughness: 0.9 })
  );
  wall.position.set(0, 0.2, -1.5);
  group.add(wall);

  // A chair (the classic "found footage" object to establish scale)
  const chairSeat = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.05, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x2a332a, roughness: 0.8 })
  );
  chairSeat.position.set(0.4, -0.3, 0.2);
  group.add(chairSeat);

  const chairBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.5, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x2a332a, roughness: 0.8 })
  );
  chairBack.position.set(0.4, -0.05, 0.02);
  group.add(chairBack);

  // Night-vision green point light — the whole scene is lit green
  const nvLight = new THREE.PointLight(0x66ff88, 2.0, 8);
  nvLight.position.set(-1, 1.5, 1.5);
  group.add(nvLight);

  const ambient = new THREE.AmbientLight(0x1a3a1a, 0.6);
  group.add(ambient);

  // HUD overlay — a separate scene rendered on top later, but we
  // simulate it here with a couple of HUD meshes floating in front.
  // "REC" tally dot
  const recMat = new THREE.MeshBasicMaterial({ color: 0xff2a2a });
  const recDot = new THREE.Mesh(new THREE.CircleGeometry(0.05, 16), recMat);
  recDot.position.set(-1.35, 0.85, 0.5);
  group.add(recDot);

  // Timestamp bar — a dark strip with timestamp text rendered via CanvasTexture
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 512, 64);
  ctx.fillStyle = '#88ff99';
  ctx.font = 'bold 32px monospace';
  ctx.textBaseline = 'middle';
  ctx.fillText('CAM 04  02:14:37', 20, 32);

  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;

  const tsBar = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 0.2),
    new THREE.MeshBasicMaterial({ map: tex, transparent: false })
  );
  tsBar.position.set(0, -0.85, 0.5);
  group.add(tsBar);

  // Scan-line overlay — thin horizontal lines moving down the view
  const scanlineMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.25,
  });
  const scanlines = [];
  for (let i = 0; i < 6; i++) {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 0.02), scanlineMat.clone());
    line.position.set(0, 1.2 - i * 0.4, 0.6);
    line.userData.phase = i * 0.3;
    group.add(line);
    scanlines.push(line);
  }

  return {
    group,
    description:
      'CCTV Core — found-footage liminal horror: night-vision green, a single grainy feed, timestamp overlay, REC tally, and VHS-style degradation.',
    background:
      'radial-gradient(circle at 50% 50%, #1a3a1a 0%, #0a1a0a 60%, #000000 100%)',
    update(t) {
      // REC tally blinks once per second
      recMat.color.setHex(Math.floor(t) % 2 === 0 ? 0xff2a2a : 0x330000);

      // Scanlines drift down
      scanlines.forEach((line) => {
        line.position.y = ((t * 0.15 + line.userData.phase) % 1.4) - 0.7;
      });

      // Subtle camera shake — emulate a slightly unstable mount
      group.position.x = Math.sin(t * 0.7) * 0.005;
      group.position.y = Math.cos(t * 1.1) * 0.005;
    },
  };
}