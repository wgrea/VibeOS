import * as THREE from 'three';
import { TRACK_Y } from './constants.js';

export function buildVillage(materials) {
  const {
    brickMat, roofTerracottaMat, stoneMat, redEngineMat,
    truckWoodMat, hillGreenMat,
  } = materials;

  const village = new THREE.Group();
  village.position.y = TRACK_Y - 0.03;

  const platform = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.07, 0.46), stoneMat);
  platform.position.set(-0.08, 0.035, 0.1);

  const stationBody = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.28), brickMat);
  stationBody.position.set(-0.08, 0.22, 0.05);

  const stationRoof = new THREE.Mesh(new THREE.ConeGeometry(0.39, 0.19, 4), roofTerracottaMat);
  stationRoof.position.set(-0.08, 0.46, 0.05);
  stationRoof.rotation.y = Math.PI / 4;

  const awning = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.02, 0.14), redEngineMat);
  awning.position.set(-0.08, 0.27, 0.24);
  awning.rotation.x = 0.25;

  const cottageBody = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.2, 0.22), brickMat);
  cottageBody.position.set(0.36, 0.1, -0.18);
  const cottageRoof = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.14, 4), roofTerracottaMat);
  cottageRoof.position.set(0.36, 0.27, -0.18);
  cottageRoof.rotation.y = Math.PI / 4;

  village.add(platform, stationBody, stationRoof, awning, cottageBody, cottageRoof);

  const treePositions = [
    [-0.48, -0.22],
    [0.12, -0.36],
    [0.44, 0.18],
    [-0.42, 0.34],
  ];
  treePositions.forEach(([tx, tz]) => {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.024, 0.13, 8), truckWoodMat);
    trunk.position.y = 0.065;
    const foliage = new THREE.Mesh(new THREE.SphereGeometry(0.095, 12, 12), hillGreenMat);
    foliage.position.y = 0.17;
    tree.add(trunk, foliage);
    tree.position.set(tx, 0, tz);
    village.add(tree);
  });

  return village;
}