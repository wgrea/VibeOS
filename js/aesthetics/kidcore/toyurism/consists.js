import * as THREE from 'three';
import { TRACK_Y } from './constants.js';
import { buildEngine, buildCoach, buildTruck } from './engines.js';

/**
 * Creates the tracksData array, positions every car around its ring,
 * attaches invisible hit-boxes, collects clickable meshes, and registers
 * engine offsets that steam puffs will anchor to.
 *
 * Returns { tracksData, clickableMeshes, steamAnchors }.
 */
export function buildConsists(materials) {
  const tracksData = [
    {
      radius: 1.48,
      direction: 1,
      velocity: 0,
      tapBounce: 0,
      pivot: new THREE.Group(),
      cars: [
        { mesh: buildEngine(materials, materials.blueEngineMat, 0.8), offset: 1.4, isEngine: true },
        { mesh: buildCoach(materials, 0.78), offset: 1.74, isEngine: false },
        { mesh: buildCoach(materials, 0.78), offset: 2.08, isEngine: false },
      ],
    },
    {
      radius: 1.18,
      direction: -1,
      velocity: 0,
      tapBounce: 0,
      pivot: new THREE.Group(),
      cars: [
        { mesh: buildEngine(materials, materials.greenEngineMat, 0.76), offset: 1.8, isEngine: true },
        { mesh: buildTruck(materials, 0.76), offset: 1.44, isEngine: false },
        { mesh: buildTruck(materials, 0.76), offset: 1.14, isEngine: false },
      ],
    },
    {
      radius: 0.88,
      direction: 1,
      velocity: 0,
      tapBounce: 0,
      pivot: new THREE.Group(),
      cars: [
        { mesh: buildEngine(materials, materials.redEngineMat, 0.72), offset: 1.1, isEngine: true },
        { mesh: buildCoach(materials, 0.7), offset: 1.56, isEngine: false },
        { mesh: buildTruck(materials, 0.7), offset: 1.96, isEngine: false },
      ],
    },
  ];

  const clickableMeshes = [];
  const steamAnchors = []; // { trackIndex, radius, baseA, direction, phases:[0,1,2] }

  tracksData.forEach((trackInfo, tIdx) => {
    trackInfo.cars.forEach((car) => {
      const a = car.offset;
      car.mesh.position.set(
        Math.cos(a) * trackInfo.radius,
        TRACK_Y + 0.015,
        Math.sin(a) * trackInfo.radius
      );
      car.mesh.rotation.y =
        trackInfo.direction === 1 ? -a + Math.PI / 2 : -a - Math.PI / 2;

      // Invisible enlarged hit-box (mobile-friendly)
      const hitBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.58, 0.45, 0.42),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitBox.position.y = 0.2;
      hitBox.userData.trackIndex = tIdx;
      car.mesh.add(hitBox);
      clickableMeshes.push(hitBox);

      car.mesh.traverse((child) => {
        if (child.isMesh) {
          child.userData.trackIndex = tIdx;
          clickableMeshes.push(child);
        }
      });

      trackInfo.pivot.add(car.mesh);

      if (car.isEngine) {
        steamAnchors.push({
          trackIndex: tIdx,
          radius: trackInfo.radius,
          baseA: a,
          direction: trackInfo.direction,
        });
      }
    });
    trackInfo.angle = 0;
  });

  return { tracksData, clickableMeshes, steamAnchors };
}