import * as THREE from 'three';
import { TRACK_Y, TRACK_RADII } from './constants.js';

export function buildTracks(materials) {
  const { grassMat, railMat, truckWoodMat } = materials;
  const trackGroup = new THREE.Group();

  const sodorBase = new THREE.Mesh(new THREE.CylinderGeometry(1.85, 2.0, 0.2, 40), grassMat);
  sodorBase.position.y = TRACK_Y - 0.13;
  trackGroup.add(sodorBase);

  const tieGeo = new THREE.BoxGeometry(0.18, 0.018, 0.04);

  TRACK_RADII.forEach((radius, laneIdx) => {
    const outerRail = new THREE.Mesh(new THREE.TorusGeometry(radius + 0.055, 0.018, 8, 56), railMat);
    outerRail.rotation.x = Math.PI / 2;
    outerRail.position.y = TRACK_Y;

    const innerRail = new THREE.Mesh(new THREE.TorusGeometry(radius - 0.055, 0.018, 8, 56), railMat);
    innerRail.rotation.x = Math.PI / 2;
    innerRail.position.y = TRACK_Y;
    trackGroup.add(outerRail, innerRail);

    const tieCount = 28 + laneIdx * 6;
    for (let i = 0; i < tieCount; i++) {
      const a = (i / tieCount) * Math.PI * 2;
      const tie = new THREE.Mesh(tieGeo, truckWoodMat);
      tie.position.set(Math.cos(a) * radius, TRACK_Y - 0.012, Math.sin(a) * radius);
      tie.rotation.y = -a;
      trackGroup.add(tie);
    }
  });

  return trackGroup;
}