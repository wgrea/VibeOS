// js/aesthetics/liminal/liminal-poolcore.js

import * as THREE from 'three';

export function createLiminalPoolcore() {
  const group = new THREE.Group();

  // 1. Unified Liminal Pool Diorama (Draggable / Arrow-Key Interactive)
  const poolDiorama = new THREE.Group();

  // Procedural Ceramic Grid Tile Texture
  const tileCanvas = document.createElement('canvas');
  tileCanvas.width = 128;
  tileCanvas.height = 128;
  const ctx = tileCanvas.getContext('2d');
  ctx.fillStyle = '#f0fdfa';
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = '#99f6e4';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, 60, 60);
  ctx.strokeRect(66, 2, 60, 60);
  ctx.strokeRect(2, 66, 60, 60);
  ctx.strokeRect(66, 66, 60, 60);

  const tileTex = new THREE.CanvasTexture(tileCanvas);
  tileTex.wrapS = THREE.RepeatWrapping;
  tileTex.wrapT = THREE.RepeatWrapping;
  tileTex.repeat.set(4, 4);

  const tileMat = new THREE.MeshStandardMaterial({
    map: tileTex,
    roughness: 0.25,
    metalness: 0.05,
  });

  // Tiled Pool Floor Base & Back Corner Walls
  const base = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.28, 2.6), tileMat);
  base.position.y = -0.95;
  poolDiorama.add(base);

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.4, 0.22), tileMat);
  backWall.position.set(0, 0.25, -1.25);
  poolDiorama.add(backWall);

  // Tiled Architectural Support Column
  const column = new THREE.Mesh(new THREE.BoxGeometry(0.65, 2.4, 0.65), tileMat);
  column.position.set(-1.05, 0.25, -0.7);
  poolDiorama.add(column);

  // Submerged Ceramic Pool Steps (Left Side)
  for (let i = 0; i < 3; i++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(0.85 - i * 0.22, 0.16, 1.35),
      tileMat
    );
    step.position.set(-1.05 - i * 0.08, -0.74 + i * 0.16, 0.45);
    poolDiorama.add(step);
  }

  // Shimmering Turquoise Water Volume
  const water = new THREE.Mesh(
    new THREE.BoxGeometry(3.05, 0.65, 2.42),
    new THREE.MeshPhysicalMaterial({
      color: 0x2dd4bf,
      transparent: true,
      opacity: 0.76,
      roughness: 0.06,
      clearcoat: 1.0,
    })
  );
  water.position.set(0, -0.48, 0.05);
  poolDiorama.add(water);

  // Subtle Surface Caustic Ripple Rings
  const ripples = [];
  for (let i = 0; i < 2; i++) {
    const ripple = new THREE.Mesh(
      new THREE.RingGeometry(0.35, 0.39, 36),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      })
    );
    ripple.rotation.x = -Math.PI / 2;
    ripple.position.set(0.2, -0.145, 0.15);
    poolDiorama.add(ripple);
    ripples.push({ mesh: ripple, offset: i * 0.5 });
  }

  // Chrome Pool Ladder Rails & Rungs
  const railMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.92,
    roughness: 0.1,
  });

  [-0.22, 0.22].forEach((xOffset) => {
    const rail = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.036, 12, 24, Math.PI), railMat);
    rail.position.set(0.88 + xOffset, 0.12, 0.68);
    rail.rotation.y = Math.PI / 2;
    poolDiorama.add(rail);

    // Vertical Ladder Posts descending into water
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.85, 10), railMat);
    post.position.set(0.88 + xOffset, -0.3, 0.36);
    poolDiorama.add(post);
  });

  // Horizontal Chrome Ladder Steps
  [-0.12, -0.38].forEach((rungY) => {
    const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.44, 10), railMat);
    rung.rotation.z = Math.PI / 2;
    rung.position.set(0.88, rungY, 0.36);
    poolDiorama.add(rung);
  });

  group.add(poolDiorama);

  // 2. Sterile Skylight & Turquoise Pool Bounce Lighting
  const skylight = new THREE.DirectionalLight(0xffffff, 1.6);
  skylight.position.set(1.5, 4.5, 2.5);
  group.add(skylight);

  const poolBounce = new THREE.PointLight(0x2dd4bf, 7, 9);
  poolBounce.position.set(0, -0.2, 1.4);
  group.add(poolBounce);

  return {
    group,
    description:
      'Surreal, deserted indoor natatoriums tiled in pristine white and turquoise ceramics—defined by echoing water stillness, chrome ladders, and dreamlike architectural solitude.',
    background: 'radial-gradient(circle at 50% 25%, #f0fdfa, #99f6e4 60%, #2dd4bf 100%)',
    update(t, bounce, spring) {
      poolDiorama.rotation.y = Math.sin(t * 0.55) * 0.25;
      poolDiorama.position.y = -bounce * 0.15;

      water.scale.y = 1 + Math.sin(t * 2.2) * 0.06 + spring * 0.25;
      water.position.y = -0.48 + Math.sin(t * 2.2) * 0.02;

      // Gentle expanding caustic ripples on the still water surface
      ripples.forEach((r) => {
        const cycle = (t * 0.3 + r.offset) % 1;
        r.mesh.scale.setScalar(0.6 + cycle * 2.1);
        r.mesh.material.opacity = (1 - cycle) * 0.32;
      });
    },
  };
}
