import * as THREE from 'three';

/**
 * Morphs torso vertices between hipScale and chestScale while keeping collar round.
 */
export function morphOnesieTorso(geo, chestScale, hipScale) {
  const pos = geo.attributes.position;
  const base = geo.userData.basePositions;

  const [hipX, , hipZ] = hipScale;
  const [chestX, , chestZ] = chestScale;

  for (let i = 0; i < pos.count; i++) {
    const bx = base[i * 3];
    const by = base[i * 3 + 1];
    const bz = base[i * 3 + 2];

    let sx, sz;
    if (by <= 0.14) {
      sx = hipX;
      sz = hipZ;
    } else if (by <= 0.875) {
      const t = THREE.MathUtils.smoothstep(by, 0.14, 0.56);
      sx = THREE.MathUtils.lerp(hipX, chestX, t);
      sz = THREE.MathUtils.lerp(hipZ, chestZ, t);
    } else {
      const t = THREE.MathUtils.smoothstep(by, 0.875, 0.92);
      sx = THREE.MathUtils.lerp(chestX, 1.04, t);
      sz = THREE.MathUtils.lerp(chestZ, 1.04, t);
    }

    pos.setXYZ(i, bx * sx, by, bz * sz);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
}