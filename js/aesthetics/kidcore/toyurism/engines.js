import * as THREE from 'three';
import { buildTrainFace } from './trainFace.js';

export function buildEngine(materials, bodyMat, scale = 0.78) {
  const { redChassisMat, inkBlackMat, brassMat, steelMat } = materials;
  const eng = new THREE.Group();

  const boiler = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.38, 18), bodyMat);
  boiler.rotation.z = Math.PI / 2;
  boiler.position.set(0.05, 0.15, 0);

  const cab = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.28), bodyMat);
  cab.position.set(-0.16, 0.21, 0);
  const cabRoof = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.028, 0.31), inkBlackMat);
  cabRoof.position.set(-0.16, 0.37, 0);

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.055, 0.3), redChassisMat);
  chassis.position.set(0, 0.045, 0);

  const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.034, 0.13, 12), inkBlackMat);
  funnel.position.set(0.16, 0.32, 0);

  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 12), brassMat);
  dome.position.set(0.01, 0.29, 0);

  const face = buildTrainFace(materials, 0.125);
  face.position.set(0.245, 0.15, 0);

  const wheelGeo = new THREE.CylinderGeometry(0.058, 0.058, 0.028, 14);
  wheelGeo.rotateX(Math.PI / 2);
  [-0.14, 0, 0.14].forEach((wx) => {
    [-0.14, 0.14].forEach((wz) => {
      const wheel = new THREE.Mesh(wheelGeo, steelMat);
      wheel.position.set(wx, 0.038, wz);
      eng.add(wheel);
    });
  });

  eng.add(boiler, cab, cabRoof, chassis, funnel, dome, face);
  eng.scale.setScalar(scale);
  return eng;
}

export function buildCoach(materials, scale = 0.78) {
  const { coachOrangeMat, coachRoofMat, inkBlackMat, windowBlueMat, steelMat } = materials;
  const coach = new THREE.Group();

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.24, 0.26), coachOrangeMat);
  body.position.y = 0.16;

  const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.44, 14), coachRoofMat);
  roof.rotation.z = Math.PI / 2;
  roof.scale.set(0.45, 1, 1);
  roof.position.y = 0.29;

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.045, 0.28), inkBlackMat);
  chassis.position.y = 0.04;

  const winGeo = new THREE.BoxGeometry(0.08, 0.08, 0.27);
  [-0.11, 0, 0.11].forEach((wx) => {
    const win = new THREE.Mesh(winGeo, windowBlueMat);
    win.position.set(wx, 0.18, 0);
    coach.add(win);
  });

  const face = buildTrainFace(materials, 0.095);
  face.position.set(0.215, 0.16, 0);

  const wheelGeo = new THREE.CylinderGeometry(0.052, 0.052, 0.026, 12);
  wheelGeo.rotateX(Math.PI / 2);
  [-0.13, 0.13].forEach((wx) => {
    [-0.13, 0.13].forEach((wz) => {
      const w = new THREE.Mesh(wheelGeo, steelMat);
      w.position.set(wx, 0.035, wz);
      coach.add(w);
    });
  });

  coach.add(body, roof, chassis, face);
  coach.scale.setScalar(scale);
  return coach;
}

export function buildTruck(materials, scale = 0.78) {
  const { truckWoodMat, coalMat, steelMat } = materials;
  const truck = new THREE.Group();

  const box = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.17, 0.24), truckWoodMat);
  box.position.y = 0.12;
  const coal = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), coalMat);
  coal.scale.set(1.3, 0.55, 0.9);
  coal.position.y = 0.2;

  const wheelGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.026, 12);
  wheelGeo.rotateX(Math.PI / 2);
  [-0.09, 0.09].forEach((wx) => {
    [-0.12, 0.12].forEach((wz) => {
      const w = new THREE.Mesh(wheelGeo, steelMat);
      w.position.set(wx, 0.035, wz);
      truck.add(w);
    });
  });

  truck.add(box, coal);
  truck.scale.setScalar(scale);
  return truck;
}