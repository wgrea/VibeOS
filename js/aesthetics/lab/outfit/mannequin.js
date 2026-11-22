// js/aesthetics/lab/outfit/mannequin.js
import * as THREE from 'three';

export const BODY_PROFILES = {
  boy: {
    label: 'Boy',
    chestScale: [1.16, 1, 0.72],
    hipScale: [1.05, 1, 0.74],
    armOffset: 0.44,
    armRadius: 0.072,
    legOffset: 0.155,
    legRadius: 0.098
  },
  girl: {
    label: 'Girl',
    chestScale: [1.02, 1, 0.68],
    hipScale: [1.13, 1, 0.76],
    armOffset: 0.40,
    armRadius: 0.064,
    legOffset: 0.16,
    legRadius: 0.094
  }
};

export function buildMannequin(initialType = 'boy') {
  const mannequinGroup = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0x8d939e,
    roughness: 0.72,
    metalness: 0.04
  });

  const jointMat = new THREE.MeshStandardMaterial({
    color: 0x767c87,
    roughness: 0.78,
    metalness: 0.06
  });

  // Head & Neck
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.165, 24, 24), skinMat);
  head.scale.set(0.92, 1.12, 0.98);
  head.position.y = 1.24;
  mannequinGroup.add(head);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.105, 0.18, 20), skinMat);
  neck.position.y = 1.02;
  mannequinGroup.add(neck);

  // Neutral Torso & Pelvis (aligned with catsuit.js y-positions)
  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.285, 0.205, 0.54, 24), skinMat);
  chest.position.y = 0.58;
  mannequinGroup.add(chest);

  const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.275, 0.46, 24), skinMat);
  hips.position.y = 0.08;
  mannequinGroup.add(hips);

  // Smooth rounded pelvis base (kept understated & gender-neutral)
  const pelvisCap = new THREE.Mesh(new THREE.SphereGeometry(0.255, 24, 16), skinMat);
  pelvisCap.position.y = -0.14;
  mannequinGroup.add(pelvisCap);

  // Limbs, Hands & Feet
  const arms = [];
  const hands = [];
  const legs = [];
  const feet = [];

  [-1, 1].forEach((side) => {
    // Shoulder cap
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), jointMat);
    shoulder.position.set(side * 0.34, 0.78, 0);
    mannequinGroup.add(shoulder);

    // Arm
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.072, 0.74, 10, 20), skinMat);
    arm.position.set(side * 0.44, 0.38, 0);
    arm.rotation.z = side * -0.18;
    mannequinGroup.add(arm);
    arms.push({ mesh: arm, shoulder, side });

    // Hand (extends slightly past sleeve cuffs)
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.062, 16, 16), skinMat);
    hand.scale.set(0.82, 1.35, 0.65);
    hand.position.set(side * 0.52, -0.05, 0.02);
    hand.rotation.z = side * -0.18;
    mannequinGroup.add(hand);
    hands.push({ mesh: hand, side });

    // Leg
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.098, 0.92, 12, 24), skinMat);
    leg.position.set(side * 0.155, -0.62, 0);
    leg.rotation.z = side * -0.04;
    mannequinGroup.add(leg);
    legs.push({ mesh: leg, side });

    // Foot (extends slightly below pant/suit cuffs)
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.075, 0.24), jointMat);
    foot.position.set(side * 0.175, -1.16, 0.05);
    mannequinGroup.add(foot);
    feet.push({ mesh: foot, side });
  });

  let activeProfile = BODY_PROFILES[initialType] || BODY_PROFILES.boy;

  function setBodyType(type) {
    const profile = BODY_PROFILES[type] || BODY_PROFILES.boy;
    activeProfile = profile;

    chest.scale.set(...profile.chestScale);
    hips.scale.set(...profile.hipScale);
    pelvisCap.scale.set(profile.hipScale[0] * 0.98, 0.72, profile.hipScale[2] * 0.96);

    const armScale = profile.armRadius / 0.072;
    const legScale = profile.legRadius / 0.098;

    arms.forEach(({ mesh, shoulder, side }) => {
      mesh.position.x = side * profile.armOffset;
      mesh.scale.set(armScale, 1, armScale);
      shoulder.position.x = side * (profile.armOffset - 0.10);
    });

    hands.forEach(({ mesh, side }) => {
      mesh.position.x = side * (profile.armOffset + 0.08);
    });

    legs.forEach(({ mesh, side }) => {
      mesh.position.x = side * profile.legOffset;
      mesh.scale.set(legScale, 1, legScale);
    });

    feet.forEach(({ mesh, side }) => {
      mesh.position.x = side * (profile.legOffset + 0.02);
    });
  }

  setBodyType(initialType);

  return {
    mannequinGroup,
    setBodyType,
    getProfile: () => activeProfile
  };
}
