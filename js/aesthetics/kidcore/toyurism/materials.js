import * as THREE from 'three';

export function createMaterials() {
  return {
    blueEngineMat: new THREE.MeshPhysicalMaterial({ color: 0x0284c7, roughness: 0.2, clearcoat: 0.85 }),
    redEngineMat: new THREE.MeshPhysicalMaterial({ color: 0xdc2626, roughness: 0.2, clearcoat: 0.85 }),
    greenEngineMat: new THREE.MeshPhysicalMaterial({ color: 0x16a34a, roughness: 0.2, clearcoat: 0.85 }),
    coachOrangeMat: new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, roughness: 0.28, clearcoat: 0.65 }),
    coachRoofMat: new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.45 }),
    redChassisMat: new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.35 }),
    brassMat: new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.75, roughness: 0.22 }),
    faceGreyMat: new THREE.MeshPhysicalMaterial({ color: 0xd1d5db, roughness: 0.38, clearcoat: 0.3 }),
    truckWoodMat: new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.65 }),
    coalMat: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 }),
    railMat: new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.65 }),
    steelMat: new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.6, roughness: 0.3 }),
    grassMat: new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.65 }),
    hillGreenMat: new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 }),
    brickMat: new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.6 }),
    roofTerracottaMat: new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.5 }),
    stoneMat: new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.75 }),
    windowBlueMat: new THREE.MeshPhysicalMaterial({ color: 0xbae6fd, roughness: 0.15, clearcoat: 0.9 }),
    steamMat: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.4,
      transparent: true,
      opacity: 0.82,
    }),
    inkBlackMat: new THREE.MeshBasicMaterial({ color: 0x0f172a }),
    whiteMat: new THREE.MeshBasicMaterial({ color: 0xffffff }),
  };
}