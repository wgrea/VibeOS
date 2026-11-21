// js/aesthetics/dark/weirdcore.js
import * as THREE from 'three';

export function createWeirdcore() {
  const group = new THREE.Group();

  // Shared Materials
  const scleraMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    roughness: 0.14,
    clearcoat: 0.95,
    clearcoatRoughness: 0.08,
  });

  const irisMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.45,
    roughness: 0.25,
  });

  const pupilMat = new THREE.MeshBasicMaterial({
    color: 0x05070d,
  });

  const wingPrimaryMat = new THREE.MeshStandardMaterial({
    color: 0xf3e8ff,
    emissive: 0x9333ea,
    emissiveIntensity: 0.28,
    roughness: 0.45,
  });

  const wingSecondaryMat = new THREE.MeshStandardMaterial({
    color: 0xd8b4fe,
    emissive: 0x7e22ce,
    emissiveIntensity: 0.22,
    roughness: 0.5,
  });

  const haloMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    emissive: 0xeab308,
    emissiveIntensity: 0.75,
    roughness: 0.2,
    metalness: 0.6,
  });

  // Helper to build an uncanny eyeball at any scale
  function buildEyeball(radius) {
    const eye = new THREE.Group();
    const sclera = new THREE.Mesh(new THREE.SphereGeometry(radius, 28, 28), scleraMat);

    const iris = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.5, 22, 22), irisMat);
    iris.position.z = radius * 0.66;

    const pupil = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.25, 16, 16), pupilMat);
    pupil.position.z = radius * 0.98;

    eye.add(sclera, iris, pupil);
    return eye;
  }

  // 1. Central Floating Weirdcore Eyeball
  const mainEye = buildEyeball(0.54);
  group.add(mainEye);

  // 2. Layered Seraphim Angel Wings (3 tiered feathers per side)
  function buildWing(sideSign) {
    const wingPivot = new THREE.Group();
    wingPivot.position.set(sideSign * 0.62, 0.08, -0.05);

    const featherConfigs = [
      { w: 0.88, h: 0.18, x: 0.42, y: 0.18, rotZ: 0.34, mat: wingPrimaryMat },
      { w: 0.74, h: 0.15, x: 0.34, y: 0.0, rotZ: 0.12, mat: wingSecondaryMat },
      { w: 0.58, h: 0.13, x: 0.26, y: -0.16, rotZ: -0.12, mat: wingPrimaryMat },
    ];

    featherConfigs.forEach((cfg) => {
      const feather = new THREE.Mesh(
        new THREE.BoxGeometry(cfg.w, cfg.h, 0.045),
        cfg.mat
      );
      feather.position.set(sideSign * cfg.x, cfg.y, 0);
      feather.rotation.z = sideSign * cfg.rotZ;
      wingPivot.add(feather);
    });

    return wingPivot;
  }

  const wingLeft = buildWing(-1);
  const wingRight = buildWing(1);
  group.add(wingLeft, wingRight);

  // 3. Surreal Seraphim Halo & Orbiting Satellite Eyes
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.46, 0.022, 12, 48),
    haloMat
  );
  halo.position.set(0, 0.82, -0.08);
  halo.rotation.x = Math.PI / 2.3;
  group.add(halo);

  const miniEyeLeft = buildEyeball(0.15);
  miniEyeLeft.position.set(-1.12, -0.52, 0.22);

  const miniEyeRight = buildEyeball(0.15);
  miniEyeRight.position.set(1.12, -0.52, 0.22);

  group.add(miniEyeLeft, miniEyeRight);

  // 4. Low-Fi Surveillance Bounding Box Frame
  const frameGeo = new THREE.BoxGeometry(2.55, 1.85, 1.35);
  const frameEdges = new THREE.EdgesGeometry(frameGeo);
  const surveillanceFrame = new THREE.LineSegments(
    frameEdges,
    new THREE.LineBasicMaterial({
      color: 0xe879f9,
      transparent: true,
      opacity: 0.32,
    })
  );
  group.add(surveillanceFrame);

  return {
    group,
    description:
      'An online surrealist aesthetic built around disorientation, uncanny dread, and early-internet amateur graphics—featuring disembodied eyes, winged seraphim motifs, cryptic text overlays, and empty liminal spaces.',
    background: 'radial-gradient(circle at 50% 35%, #7e22ce 0%, #3b0764 52%, #090d16 100%)',
    update(t, bounce, spring) {
      // Uncanny darting & scanning gaze on the central eyeball
      const lookX = Math.sin(t * 1.4) * 0.45 + Math.sin(t * 3.7) * 0.08;
      const lookY = Math.cos(t * 1.1) * 0.25;
      mainEye.rotation.y = lookX;
      mainEye.rotation.x = lookY;

      // Secondary watching eyes mirror the gaze slightly out of phase
      miniEyeLeft.rotation.y = Math.sin(t * 1.4 + 0.6) * 0.5;
      miniEyeLeft.rotation.x = Math.cos(t * 1.1 + 0.6) * 0.3;
      miniEyeLeft.position.y = -0.52 + Math.sin(t * 2.1) * 0.06;

      miniEyeRight.rotation.y = Math.sin(t * 1.4 - 0.6) * 0.5;
      miniEyeRight.rotation.x = Math.cos(t * 1.1 - 0.6) * 0.3;
      miniEyeRight.position.y = -0.52 + Math.cos(t * 2.1) * 0.06;

      // Seraphim wing flap
      wingLeft.rotation.z = Math.sin(t * 2.8) * 0.16;
      wingLeft.rotation.y = Math.cos(t * 2.8) * 0.12;

      wingRight.rotation.z = -Math.sin(t * 2.8) * 0.16;
      wingRight.rotation.y = -Math.cos(t * 2.8) * 0.12;

      // Floating halo hover
      halo.position.y = 0.82 + Math.sin(t * 2.2) * 0.045;
      halo.rotation.z = t * 0.5;

      // Subtle sway on the outer wireframe bounding box
      surveillanceFrame.rotation.y = Math.sin(t * 0.4) * 0.08;

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
