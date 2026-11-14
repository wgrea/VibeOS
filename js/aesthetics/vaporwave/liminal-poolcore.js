import * as THREE from 'three';

export function createLiminalPoolcore() {
  const group = new THREE.Group();

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
    roughness: 0.3,
  });

  // Tiled Pool Diorama Base & Back Wall
  const base = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.3, 2.6), tileMat);
  base.position.y = -0.95;
  group.add(base);

  const column = new THREE.Mesh(new THREE.BoxGeometry(0.65, 2.4, 0.65), tileMat);
  column.position.set(-1.05, 0.25, -0.7);
  group.add(column);

  // Shimmering Turquoise Water Volume
  const water = new THREE.Mesh(
    new THREE.BoxGeometry(2.9, 0.65, 2.3),
    new THREE.MeshPhysicalMaterial({
      color: 0x2dd4bf,
      transparent: true,
      opacity: 0.78,
      roughness: 0.08,
      clearcoat: 1.0,
    })
  );
  water.position.y = -0.48;
  group.add(water);

  // Chrome Pool Ladder Rails
  const railMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.9,
    roughness: 0.1,
  });
  [-0.25, 0.25].forEach((xOffset) => {
    const rail = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.04, 12, 24, Math.PI), railMat);
    rail.position.set(0.85 + xOffset, 0.1, 0.65);
    rail.rotation.y = Math.PI / 2;
    group.add(rail);
  });

  return {
    group,
    background: 'radial-gradient(circle at 50% 25%, #f0fdfa, #99f6e4 60%, #2dd4bf 100%)',
    update(t, bounce, spring) {
      group.rotation.y = Math.sin(t * 0.6) * 0.25;
      water.scale.y = 1 + Math.sin(t * 2.2) * 0.06 + spring * 0.25;
      water.position.y = -0.48 + Math.sin(t * 2.2) * 0.02;
    },
  };
}
