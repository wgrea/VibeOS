import * as THREE from 'three';

export function morphSnowsuitVertices(geo, chestScale, hipScale) {
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
      const t = THREE.MathUtils.smoothstep(by, 0.875, 0.93);
      sx = THREE.MathUtils.lerp(chestX, 1.04, t);
      sz = THREE.MathUtils.lerp(chestZ, 1.04, t);
    }

    pos.setXYZ(i, bx * sx, by, bz * sz);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

export function sampleEnvelopeRadius(y) {
  const stops = [
    [0.15, 0.310],
    [0.24, 0.308],
    [0.288, 0.298],
    [0.36, 0.322],
    [0.49, 0.346],
    [0.62, 0.370],
    [0.76, 0.366],
    [0.88, 0.324]
  ];
  if (y <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    const [y0, r0] = stops[i - 1];
    const [y1, r1] = stops[i];
    if (y <= y1) {
      return THREE.MathUtils.lerp(r0, r1, (y - y0) / (y1 - y0));
    }
  }
  return stops[stops.length - 1][1];
}

export function morphStormFlap(geo, chestScale, hipScale) {
  const pos = geo.attributes.position;
  const base = geo.userData.basePositions;

  const hipZ = hipScale[2];
  const chestZ = chestScale[2];

  for (let i = 0; i < pos.count; i++) {
    const bx = base[i * 3];
    const by = base[i * 3 + 1];
    const bz = base[i * 3 + 2];

    let sz;
    if (by <= 0.14) {
      sz = hipZ;
    } else if (by <= 0.875) {
      sz = THREE.MathUtils.lerp(hipZ, chestZ, THREE.MathUtils.smoothstep(by, 0.14, 0.56));
    } else {
      sz = THREE.MathUtils.lerp(chestZ, 1.04, THREE.MathUtils.smoothstep(by, 0.875, 0.93));
    }

    const envR = sampleEnvelopeRadius(by);
    pos.setXYZ(i, bx, by, envR * sz + 0.008 + bz);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
}