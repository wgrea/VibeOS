// js/aesthetics/kidcore/dinosaur.js
import * as THREE from 'three';

export function createDinosaur() {
  const group = new THREE.Group();

  const dinoGreen = new THREE.MeshPhysicalMaterial({
    color: 0x16a34a,
    roughness: 0.35,
    clearcoat: 0.45,
    clearcoatRoughness: 0.25,
  });

  const bellyOlive = new THREE.MeshPhysicalMaterial({
    color: 0xa3e635,
    roughness: 0.4,
    clearcoat: 0.3,
  });

  const spineOrange = new THREE.MeshPhysicalMaterial({
    color: 0xea580c,
    roughness: 0.3,
    clearcoat: 0.55,
  });

  const amberMat = new THREE.MeshPhysicalMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 0.45,
    roughness: 0.08,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.88,
  });

  // 1. Chunky Prehistoric Dino
  const dino = new THREE.Group();

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.52, 0.48), dinoGreen);
  const belly = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.14, 0.42), bellyOlive);
  belly.position.y = -0.22;

  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.62, 0.28), dinoGreen);
  neck.position.set(0.38, 0.42, 0);
  neck.rotation.z = -0.25;

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.28, 0.34), dinoGreen);
  head.position.set(0.55, 0.7, 0);

  // Eyes
  const whiteMat = new THREE.MeshBasicMaterial({ color: 0xfef9c3 });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });

  [-0.17, 0.17].forEach((zSide) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), whiteMat);
    eye.position.set(0.62, 0.74, zSide);

    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 10), pupilMat);
    pupil.position.set(0.66, 0.74, zSide * 1.15);

    dino.add(eye, pupil);
  });

  // Four Stubby Legs
  const legGeo = new THREE.CylinderGeometry(0.1, 0.11, 0.28, 14);
  const legPositions = [
    [-0.26, -0.34, 0.15],
    [-0.26, -0.34, -0.15],
    [0.26, -0.34, 0.15],
    [0.26, -0.34, -0.15],
  ];

  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeo, dinoGreen);
    leg.position.set(x, y, z);
    dino.add(leg);
  });

  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.23, 0.75, 14), dinoGreen);
  tail.rotation.z = Math.PI / 2 + 0.25;
  tail.position.set(-0.72, 0.04, 0);

  dino.add(torso, belly, neck, head, tail);

  // Dorsal Plates
  const plateGeo = new THREE.ConeGeometry(0.11, 0.22, 4);
  for (let i = 0; i < 4; i++) {
    const plate = new THREE.Mesh(plateGeo, spineOrange);
    plate.position.set(-0.28 + i * 0.2, 0.35, 0);
    dino.add(plate);
  }

  group.add(dino);

  // 2. Orbiting Glowing Fossil Amber & Volcanic Embers
  const amber = new THREE.Mesh(new THREE.DodecahedronGeometry(0.21, 0), amberMat);
  group.add(amber);

  const emberMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
  const embers = [];
  for (let i = 0; i < 8; i++) {
    const ember = new THREE.Mesh(new THREE.OctahedronGeometry(0.045, 0), emberMat);
    const angle = (i / 8) * Math.PI * 2;
    group.add(ember);
    embers.push({ mesh: ember, angle, baseY: -0.4 + (i % 3) * 0.35 });
  }

  return {
    group,
    draggable: dino,
    description:
      'Rooted in 90s dinosaur mania, prehistoric picture books, and 16-bit jungle stages, this Kidcore variant pairs a chunky sauropod with glowing fossil amber and drifting volcanic embers.',
    background: 'radial-gradient(circle at 50% 35%, #14532d 0%, #052e16 55%, #020617 100%)',
    update(t, bounce, spring) {
      dino.rotation.y = Math.sin(t * 0.8) * 0.45;
      dino.position.y = Math.abs(Math.sin(t * 3.2)) * 0.14;

      amber.position.x = Math.cos(t * 1.1) * 1.3;
      amber.position.z = Math.sin(t * 1.1) * 1.3;
      amber.position.y = 0.35 + Math.sin(t * 2.2) * 0.15;
      amber.rotation.x = t * 1.2;
      amber.rotation.y = t * 1.5;

      embers.forEach((e, idx) => {
        const a = e.angle - t * 0.55;
        e.mesh.position.x = Math.cos(a) * 1.42;
        e.mesh.position.z = Math.sin(a) * 1.42;
        e.mesh.position.y = e.baseY + Math.sin(t * 2.0 + idx) * 0.18;
        e.mesh.rotation.y = t * 1.8;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
