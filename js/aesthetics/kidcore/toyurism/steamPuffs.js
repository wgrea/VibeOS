import * as THREE from 'three';
import { TRACK_Y } from './constants.js';

export function createSteamPuffs(materials, tracksData, steamAnchors) {
  const { steamMat } = materials;
  const steamPuffs = [];

  steamAnchors.forEach(({ trackIndex, radius, baseA, direction }) => {
    for (let p = 0; p < 3; p++) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 10), steamMat);
      puff.scale.setScalar(0);
      tracksData[trackIndex].pivot.add(puff);
      steamPuffs.push({
        mesh: puff,
        trackIndex,
        radius,
        baseA,
        direction,
        phase: trackIndex * 0.65 + p * 0.33,
      });
    }
  });

  return steamPuffs;
}

export function updateSteamPuffs(steamPuffs, tracksData, t) {
  steamPuffs.forEach((sp) => {
    const trackInfo = tracksData[sp.trackIndex];
    const speedAbs = Math.abs(trackInfo.velocity);
    if (speedAbs < 0.05) {
      sp.mesh.scale.setScalar(0);
      return;
    }

    const life = (t * 0.9 + sp.phase) % 1;
    const lagDir = sp.direction * Math.sign(trackInfo.velocity);
    const lagAngle = sp.baseA + life * 0.2 * lagDir;
    sp.mesh.position.set(
      Math.cos(lagAngle) * sp.radius,
      TRACK_Y + 0.34 + life * 0.28,
      Math.sin(lagAngle) * sp.radius
    );
    const s = Math.min(speedAbs, 1) * (1 - life * 0.5) * (0.55 + life * 0.85);
    sp.mesh.scale.setScalar(s);
  });
}