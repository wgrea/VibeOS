// js/aesthetics/dark/carnival.js
import * as THREE from 'three';

export function createCarnival() {
  const group = new THREE.Group();

  // Materials: Dried-Blood Crimson, Tarnished Brass/Gold, Wrought Iron, Sickly Carnival Lime Glow
  const crimsonMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    roughness: 0.48,
    metalness: 0.2,
  });

  const tarnishedGoldMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.72,
    roughness: 0.32,
  });

  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    metalness: 0.8,
    roughness: 0.45,
  });

  const eerieGlowMat = new THREE.MeshStandardMaterial({
    color: 0x84cc16,
    emissive: 0x65a30d,
    emissiveIntensity: 0.9,
    roughness: 0.25,
  });

  const bulbMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
  });

  // 1. Grounded A-Frame Support Tower & Dark Midway Base
  const baseGroup = new THREE.Group();
  baseGroup.position.y = -0.15;

  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 1.05, 0.08, 24),
    ironMat
  );
  platform.position.y = -0.92;
  baseGroup.add(platform);

  const legGeo = new THREE.CylinderGeometry(0.035, 0.045, 1.15, 10);
  const legConfigs = [
    { x: -0.34, z: 0.22, rotZ: -0.3 },
    { x: 0.34, z: 0.22, rotZ: 0.3 },
    { x: -0.34, z: -0.22, rotZ: -0.3 },
    { x: 0.34, z: -0.22, rotZ: 0.3 },
  ];

  legConfigs.forEach((cfg) => {
    const leg = new THREE.Mesh(legGeo, ironMat);
    leg.position.set(cfg.x, -0.42, cfg.z);
    leg.rotation.z = cfg.rotZ;
    baseGroup.add(leg);
  });

  // Central axle bar connecting front and back A-frames
  const axle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.56, 14),
    tarnishedGoldMat
  );
  axle.rotation.x = Math.PI / 2;
  axle.position.y = 0.08;
  baseGroup.add(axle);

  group.add(baseGroup);

  // 2. Creaking Haunted Ferris Wheel Assembly
  const wheel = new THREE.Group();
  wheel.position.y = 0.08;

  // Dual front/back rims for real 3D depth
  const rimOffsets = [-0.14, 0.14];
  rimOffsets.forEach((zOff) => {
    const outerRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.84, 0.032, 12, 42),
      crimsonMat
    );
    outerRim.position.z = zOff;

    const innerRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.44, 0.024, 10, 32),
      tarnishedGoldMat
    );
    innerRim.position.z = zOff;

    wheel.add(outerRim, innerRim);
  });

  // Glowing cursed marquee center medallion
  const centerHub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.34, 16),
    crimsonMat
  );
  centerHub.rotation.x = Math.PI / 2;
  wheel.add(centerHub);

  const centerCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.14, 0),
    eerieGlowMat
  );
  centerCore.position.z = 0.18;
  wheel.add(centerCore);

  // 8 Radial Spokes, Flickering Carnival Bulbs, & Swinging Passenger Gondolas
  const gondolaCount = 8;
  const gondolas = [];
  const bulbs = [];
  const spokeGeo = new THREE.CylinderGeometry(0.014, 0.014, 1.68, 8);
  const bulbGeo = new THREE.SphereGeometry(0.026, 8, 8);

  for (let i = 0; i < gondolaCount; i++) {
    const angle = (i / gondolaCount) * Math.PI * 2;

    // Front & back spokes
    rimOffsets.forEach((zOff) => {
      const spoke = new THREE.Mesh(spokeGeo, tarnishedGoldMat);
      spoke.position.z = zOff;
      spoke.rotation.z = angle;
      wheel.add(spoke);
    });

    // Rim carnival light bulb (every other bulb flickers eerie lime vs warm yellow)
    const bulb = new THREE.Mesh(bulbGeo, i % 2 === 0 ? eerieGlowMat : bulbMat);
    bulb.position.set(Math.cos(angle) * 0.84, Math.sin(angle) * 0.84, 0.17);
    wheel.add(bulb);
    bulbs.push({ mesh: bulb, phase: i * 1.4, isLime: i % 2 === 0 });

    // Hanging passenger gondola pivoted at rim so it stays upright as wheel spins
    const gondolaPivot = new THREE.Group();
    gondolaPivot.position.set(Math.cos(angle) * 0.84, Math.sin(angle) * 0.84, 0);

    const hangerBar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.28, 8),
      ironMat
    );
    hangerBar.rotation.x = Math.PI / 2;

    const canopy = new THREE.Mesh(
      new THREE.ConeGeometry(0.13, 0.09, 4),
      crimsonMat
    );
    canopy.position.y = -0.05;
    canopy.rotation.y = Math.PI / 4;

    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.12, 0.16),
      i % 2 === 0 ? eerieGlowMat : tarnishedGoldMat
    );
    cabin.position.y = -0.14;

    gondolaPivot.add(hangerBar, canopy, cabin);
    wheel.add(gondolaPivot);
    gondolas.push({ pivot: gondolaPivot, phase: i * 0.9 });
  }

  group.add(wheel);

  return {
    group,
    description:
      'Rooted in abandoned amusement parks, crooked midways, and sinister circus folklore, Horror Carnival twists nostalgic fairground rides into rusted iron silhouettes, flickering bulbs, and eerie, haunted spectacle.',
    background: 'radial-gradient(circle at 50% 30%, #450a0a 0%, #1e1b4b 60%, #090d16 100%)',
    update(t, bounce, spring) {
      // Unsteady, rusted-gear rotation with subtle mechanical hitching
      const wheelAngle = t * 0.42 + Math.sin(t * 2.4) * 0.09;
      wheel.rotation.z = wheelAngle;

      // Gentle overall stage sway
      group.rotation.y = Math.sin(t * 0.55) * 0.22;

      // Counter-rotate gondolas so gravity keeps them hanging downward + creaking sway
      gondolas.forEach((g) => {
        g.pivot.rotation.z = -wheelAngle + Math.sin(t * 3.1 + g.phase) * 0.12;
      });

      // Sickly carnival bulb flicker
      const pulse = 0.65 + Math.sin(t * 7.5) * 0.35;
      eerieGlowMat.emissiveIntensity = pulse;

      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
