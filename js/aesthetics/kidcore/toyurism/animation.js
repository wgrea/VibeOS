import * as THREE from 'three';
import { TRACK_Y } from './constants.js';
import { updateSteamPuffs } from './steamPuffs.js';

export function createAnimationLoop({ group, tracksData, steamPuffs, state }) {
  return function update(t, bounce, spring) {
    // Keyboard forward/reverse on the most recently clicked train
    const activeTrain = tracksData[state.selectedTrack];
    if (activeTrain) {
      if (state.keysPressed['d'] || state.keysPressed['arrowright']) {
        activeTrain.velocity = THREE.MathUtils.lerp(activeTrain.velocity, 1.35, 0.1);
      } else if (state.keysPressed['a'] || state.keysPressed['arrowleft']) {
        activeTrain.velocity = THREE.MathUtils.lerp(activeTrain.velocity, -1.25, 0.1);
      }
    }

    tracksData.forEach((trackInfo, tIdx) => {
      trackInfo.tapBounce *= 0.85;

      const step = trackInfo.velocity * trackInfo.direction * 0.016;
      trackInfo.angle += step;
      trackInfo.pivot.rotation.y = trackInfo.angle;

      const speedAbs = Math.abs(trackInfo.velocity);
      trackInfo.cars.forEach((car, cIdx) => {
        const chug =
          speedAbs > 0.02
            ? Math.abs(Math.sin(t * 12 * speedAbs + tIdx + cIdx)) * 0.01
            : 0;
        car.mesh.position.y = TRACK_Y + 0.015 + chug + trackInfo.tapBounce;
      });
    });

    updateSteamPuffs(steamPuffs, tracksData, t);

    group.scale.setScalar(1 + spring * 0.22);
  };
}