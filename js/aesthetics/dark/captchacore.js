import * as THREE from 'three';

export function createCaptchacore() {
  const group = new THREE.Group();

  const tileBlueMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    roughness: 0.35,
  });

  const tileWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.4,
  });

  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x22c55e,
    wireframe: true,
  });

  // 3x3 Captcha Verification Grid Tiles
  const gridGroup = new THREE.Group();
  const tileGeo = new THREE.BoxGeometry(0.34, 0.34, 0.08);

  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      const isSelected = (row + col) % 2 === 0;
      const tile = new THREE.Mesh(tileGeo, isSelected ? tileBlueMat : tileWhiteMat);
      tile.position.set(col * 0.4, row * 0.4, isSelected ? 0.08 : 0);
      gridGroup.add(tile);
    }
  }
  group.add(gridGroup);

  // Distorted verification mesh overlay
  const distortSphere = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 1), wireMat);
  group.add(distortSphere);

  return {
    group,
    draggable: gridGroup,
    background: 'linear-gradient(180deg, #e2e8f0 0%, #94a3b8 50%, #1e293b 100%)',
    update(t, bounce, spring) {
      gridGroup.rotation.y = Math.sin(t * 0.85) * 0.35;
      distortSphere.rotation.x = t * 0.4;
      distortSphere.rotation.y = -t * 0.5;
      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
