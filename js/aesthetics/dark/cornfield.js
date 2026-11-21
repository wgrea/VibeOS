// js/aesthetics/dark/cornfield.js
import * as THREE from 'three';

export function createCornfield() {
  const group = new THREE.Group();

  // Materials: Dried Harvest Cornstalk, Tattered Burlap, Jack-o'-Lantern Pumpkin, Blood/Harvest Moon
  const stalkMat = new THREE.MeshStandardMaterial({
    color: 0xa16207,
    roughness: 0.85,
  });

  const huskMat = new THREE.MeshStandardMaterial({
    color: 0x713f12,
    roughness: 0.9,
  });

  const burlapMat = new THREE.MeshStandardMaterial({
    color: 0x451a03,
    roughness: 0.92,
  });

  const pumpkinMat = new THREE.MeshStandardMaterial({
    color: 0xea580c,
    emissive: 0x9a3412,
    emissiveIntensity: 0.35,
    roughness: 0.48,
  });

  const glowEyeMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
  });

  const soilMat = new THREE.MeshStandardMaterial({
    color: 0x1c1917,
    roughness: 0.95,
  });

  const moonMat = new THREE.MeshBasicMaterial({
    color: 0xfde047,
  });

  // 1. Eerie Harvest Moon Backdrop
  const moon = new THREE.Mesh(new THREE.SphereGeometry(0.46, 24, 24), moonMat);
  moon.position.set(0.18, 0.58, -0.68);
  group.add(moon);

  // 2. Dark Soil Field Mound Base
  const ground = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.25, 0.1, 28),
    soilMat
  );
  ground.position.y = -0.82;
  group.add(ground);

  // 3. Central Pumpkin-Headed Scarecrow
  const scarecrowGroup = new THREE.Group();
  scarecrowGroup.position.y = -0.1;

  // Wooden cross-posts
  const postV = new THREE.Mesh(
    new THREE.CylinderGeometry(0.042, 0.055, 1.48, 10),
    huskMat
  );
  const postH = new THREE.Mesh(
    new THREE.CylinderGeometry(0.032, 0.032, 1.05, 10),
    huskMat
  );
  postH.rotation.z = Math.PI / 2;
  postH.position.y = 0.24;

  // Tattered scarecrow coat/tunic & crooked witch/field hat
  const tunic = new THREE.Mesh(
    new THREE.ConeGeometry(0.28, 0.68, 7),
    burlapMat
  );
  tunic.position.y = 0.02;

  const head = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.22, 1),
    pumpkinMat
  );
  head.position.y = 0.52;

  // Glowing carved triangle eyes
  const eyeGeo = new THREE.ConeGeometry(0.035, 0.055, 3);
  const eyeL = new THREE.Mesh(eyeGeo, glowEyeMat);
  eyeL.position.set(-0.075, 0.55, 0.19);

  const eyeR = new THREE.Mesh(eyeGeo, glowEyeMat);
  eyeR.position.set(0.075, 0.55, 0.19);

  // Crooked scarecrow hat
  const hatBrim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.32, 0.025, 16),
    burlapMat
  );
  hatBrim.position.set(0.02, 0.71, 0);
  hatBrim.rotation.z = -0.14;

  const hatCone = new THREE.Mesh(
    new THREE.ConeGeometry(0.18, 0.34, 10),
    burlapMat
  );
  hatCone.position.set(0.04, 0.86, 0);
  hatCone.rotation.z = -0.18;

  scarecrowGroup.add(postV, postH, tunic, head, eyeL, eyeR, hatBrim, hatCone);
  group.add(scarecrowGroup);

  // 4. Surrounding Wind-Swaying Dried Cornstalks
  const stalkConfigs = [
    { x: -0.78, z: -0.25, h: 1.45, phase: 0.2 },
    { x: -0.62, z: 0.35, h: 1.32, phase: 1.1 },
    { x: -0.88, z: 0.12, h: 1.52, phase: 2.0 },
    { x: -0.45, z: -0.48, h: 1.38, phase: 2.8 },
    { x: 0.76, z: -0.22, h: 1.48, phase: 0.7 },
    { x: 0.64, z: 0.36, h: 1.28, phase: 1.6 },
    { x: 0.88, z: 0.08, h: 1.55, phase: 2.5 },
    { x: 0.48, z: -0.45, h: 1.36, phase: 3.3 },
  ];

  const stalks = [];
  const leafGeo = new THREE.BoxGeometry(0.34, 0.035, 0.06);

  stalkConfigs.forEach((cfg) => {
    const stalkPivot = new THREE.Group();
    stalkPivot.position.set(cfg.x, -0.78, cfg.z);

    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.026, cfg.h, 8),
      stalkMat
    );
    stem.position.y = cfg.h / 2;
    stalkPivot.add(stem);

    // Add 3 drooping dried corn leaves along each stalk
    for (let l = 0; l < 3; l++) {
      const leaf = new THREE.Mesh(leafGeo, l % 2 === 0 ? stalkMat : huskMat);
      const side = l % 2 === 0 ? 1 : -1;
      leaf.position.set(side * 0.14, cfg.h * (0.35 + l * 0.22), 0);
      leaf.rotation.z = -side * 0.45;
      leaf.rotation.y = l * 0.8;
      stalkPivot.add(leaf);
    }

    group.add(stalkPivot);
    stalks.push({ pivot: stalkPivot, phase: cfg.phase });
  });

  return {
    group,
    description:
      'Rooted in rural folk horror, autumn harvest dread, and midnight slasher tropes, Horror Cornfield evokes towering rustling stalks, crooked scarecrows, glowing jack-o’-lanterns, and claustrophobic dusk skies.',
    background: 'linear-gradient(180deg, #090d16 0%, #3b0764 45%, #78350f 100%)',
    update(t, bounce, spring) {
      // Rustling autumn wind wave rippling through the cornstalks
      stalks.forEach((s) => {
        s.pivot.rotation.z = Math.sin(t * 1.9 + s.phase) * 0.09;
        s.pivot.rotation.x = Math.cos(t * 1.4 + s.phase) * 0.05;
      });

      // Eerie slow head turn on the pumpkin scarecrow
      const lookYaw = Math.sin(t * 0.85) * 0.38;
      head.rotation.y = lookYaw;
      eyeL.rotation.y = lookYaw;
      eyeR.rotation.y = lookYaw;

      // Subtle overall field sway
      group.rotation.y = Math.sin(t * 0.4) * 0.14;
      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
