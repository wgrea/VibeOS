import * as THREE from 'three';

export function morphSweatshirtTorso(geo, chestScale, hipScale, yOffset = 0) {
  const pos = geo.attributes.position;
  const base = geo.userData.basePositions;

  const [hipX, , hipZ] = hipScale;
  const [chestX, , chestZ] = chestScale;

  for (let i = 0; i < pos.count; i++) {
    const bx = base[i * 3];
    const by = base[i * 3 + 1];
    const bz = base[i * 3 + 2];
    const worldY = by + yOffset;

    let sx, sz;
    if (worldY <= 0.14) {
      sx = hipX;
      sz = hipZ;
    } else if (worldY <= 0.875) {
      const t = THREE.MathUtils.smoothstep(worldY, 0.14, 0.56);
      sx = THREE.MathUtils.lerp(hipX, chestX, t);
      sz = THREE.MathUtils.lerp(hipZ, chestZ, t);
    } else {
      const t = THREE.MathUtils.smoothstep(worldY, 0.875, 0.93);
      sx = THREE.MathUtils.lerp(chestX, 1.03, t);
      sz = THREE.MathUtils.lerp(chestZ, 1.03, t);
    }

    pos.setXYZ(i, bx * sx, by, bz * sz);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
}