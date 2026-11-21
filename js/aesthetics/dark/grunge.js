// js/aesthetics/dark/grunge.js
import * as THREE from 'three';

export function createGrunge() {
  const group = new THREE.Group();

  // Materials: Battered Olive-Steel Chassis, Distressed Rust-Red Flannel, Tarnished Brass, Warm Tube Amber
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x292524,
    roughness: 0.78,
    metalness: 0.45,
  });

  const olivePlateMat = new THREE.MeshStandardMaterial({
    color: 0x3f4a3c,
    roughness: 0.85,
    metalness: 0.25,
  });

  const rustFlannelMat = new THREE.MeshStandardMaterial({
    color: 0x7f1d1d,
    roughness: 0.92,
  });

  const darkPlaidMat = new THREE.MeshStandardMaterial({
    color: 0x1c1917,
    roughness: 0.9,
  });

  const tarnishedMetalMat = new THREE.MeshStandardMaterial({
    color: 0xa8a29e,
    metalness: 0.82,
    roughness: 0.35,
  });

  const amberLedMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 0.95,
    roughness: 0.2,
  });

  // 1. Central Battered Guitar Distortion Pedal ("FUZZ / GRUNGE" Stompbox)
  const pedalGroup = new THREE.Group();
  pedalGroup.rotation.x = 0.22;

  const pedalBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.86, 1.32, 0.34),
    chassisMat
  );
  pedalGroup.add(pedalBody);

  // Scuffed olive top faceplate
  const facePlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.76, 1.2, 0.04),
    olivePlateMat
  );
  facePlate.position.z = 0.18;
  pedalGroup.add(facePlate);

  // Three rotary tone/gain/level knobs
  const knobGeo = new THREE.CylinderGeometry(0.085, 0.095, 0.12, 16);
  knobGeo.rotateX(Math.PI / 2);

  [-0.24, 0, 0.24].forEach((xPos) => {
    const knob = new THREE.Mesh(knobGeo, tarnishedMetalMat);
    knob.position.set(xPos, 0.38, 0.23);
    pedalGroup.add(knob);
  });

  // Glowing amber distortion indicator LED
  const led = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 16, 16),
    amberLedMat
  );
  led.position.set(0, 0.12, 0.21);
  pedalGroup.add(led);

  // Rubberized stomp footswitch plate
  const footPad = new THREE.Mesh(
    new THREE.BoxGeometry(0.64, 0.44, 0.07),
    darkPlaidMat
  );
  footPad.position.set(0, -0.32, 0.19);
  pedalGroup.add(footPad);

  // Quarter-inch guitar input/output jacks on left and right sides
  const jackGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.14, 14);
  jackGeo.rotateZ(Math.PI / 2);

  const jackLeft = new THREE.Mesh(jackGeo, tarnishedMetalMat);
  jackLeft.position.set(-0.48, -0.08, 0);

  const jackRight = new THREE.Mesh(jackGeo, tarnishedMetalMat);
  jackRight.position.set(0.48, -0.08, 0);

  pedalGroup.add(jackLeft, jackRight);
  group.add(pedalGroup);

  // 2. Woven 3D Flannel Plaid Backdrop Lattice
  const plaidGroup = new THREE.Group();
  plaidGroup.position.set(0, 0, -0.45);
  plaidGroup.rotation.z = 0.12;

  for (let i = -2; i <= 2; i++) {
    const vStripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 1.85, 0.03),
      i % 2 === 0 ? rustFlannelMat : darkPlaidMat
    );
    vStripe.position.set(i * 0.34, 0, 0);
    plaidGroup.add(vStripe);

    const hStripe = new THREE.Mesh(
      new THREE.BoxGeometry(1.85, 0.16, 0.03),
      i % 2 === 0 ? darkPlaidMat : rustFlannelMat
    );
    hStripe.position.set(0, i * 0.34, 0.015);
    plaidGroup.add(hStripe);
  }
  group.add(plaidGroup);

  // 3. Orbiting Analog Demo Cassette Tapes
  function buildCassette() {
    const tape = new THREE.Group();
    const shell = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.28, 0.055),
      darkPlaidMat
    );
    const label = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.16, 0.06),
      rustFlannelMat
    );
    label.position.y = 0.02;

    const reelGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.07, 12);
    reelGeo.rotateX(Math.PI / 2);

    const reelL = new THREE.Mesh(reelGeo, tarnishedMetalMat);
    reelL.position.set(-0.09, 0.02, 0);

    const reelR = new THREE.Mesh(reelGeo, tarnishedMetalMat);
    reelR.position.set(0.09, 0.02, 0);

    tape.add(shell, label, reelL, reelR);
    return tape;
  }

  const cassette1 = buildCassette();
  cassette1.position.set(-0.98, 0.55, 0.25);
  cassette1.rotation.set(0.2, 0.4, -0.25);

  const cassette2 = buildCassette();
  cassette2.position.set(1.02, -0.48, 0.3);
  cassette2.rotation.set(-0.15, -0.45, 0.3);

  group.add(cassette1, cassette2);

  return {
    group,
    description:
      'Born from 1990s Seattle alternative rock and DIY garage culture, Grunge rejects polished perfection in favor of distressed flannel plaid, battered distortion pedals, analog cassette demos, and gritty, earthy tones.',
    background: 'radial-gradient(circle at 50% 35%, #451a1a 0%, #1c1917 55%, #09090b 100%)',
    update(t, bounce, spring) {
      // Heavy, grounded sway of the distortion stompbox
      pedalGroup.rotation.y = Math.sin(t * 0.65) * 0.28;
      pedalGroup.position.y = Math.sin(t * 1.1) * 0.035;

      // Warm tube-amp amber LED flicker
      amberLedMat.emissiveIntensity = 0.75 + Math.sin(t * 6.5) * 0.25;

      // Subtle counter-sway on the flannel plaid backdrop
      plaidGroup.rotation.y = Math.sin(t * 0.45) * 0.14;

      // Floating demo cassettes
      cassette1.position.y = 0.55 + Math.sin(t * 1.5) * 0.06;
      cassette1.rotation.z = -0.25 + Math.cos(t * 1.2) * 0.08;

      cassette2.position.y = -0.48 + Math.cos(t * 1.4) * 0.06;
      cassette2.rotation.z = 0.3 + Math.sin(t * 1.1) * 0.08;

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
