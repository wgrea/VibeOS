// js/aesthetics/vaporwave/phonk.js

import * as THREE from 'three';

export function createPhonk() {
  const group = new THREE.Group();

  // 1. Unified JDM Drift Wheel & Brake Rotor Assembly (Draggable / Arrow-Key Interactive)
  const wheelGroup = new THREE.Group();

  // Spinning Rim + Spokes Container
  const spinningRim = new THREE.Group();

  // Low-Profile Rubber Drift Tire
  const tire = new THREE.Mesh(
    new THREE.TorusGeometry(0.92, 0.22, 18, 44),
    new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.72,
      metalness: 0.15,
    })
  );
  spinningRim.add(tire);

  // Glossy Dark-Chrome Deep-Dish Wheel Barrel
  const barrelMat = new THREE.MeshPhysicalMaterial({
    color: 0x27272a,
    metalness: 0.94,
    roughness: 0.12,
    clearcoat: 1.0,
  });
  const barrel = new THREE.Mesh(new THREE.TorusGeometry(0.74, 0.055, 14, 40), barrelMat);
  spinningRim.add(barrel);

  // 6 Forged JDM Alloy Wheel Spokes
  for (let i = 0; i < 6; i++) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.085, 1.44, 0.06), barrelMat);
    spoke.rotation.z = (i * Math.PI) / 3;
    spinningRim.add(spoke);
  }

  wheelGroup.add(spinningRim);

  // Drilled Steel Brake Rotor Disc (Stationary behind spokes)
  const rotor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.58, 0.04, 32),
    new THREE.MeshStandardMaterial({
      color: 0x71717a,
      metalness: 0.88,
      roughness: 0.25,
    })
  );
  rotor.rotation.x = Math.PI / 2;
  wheelGroup.add(rotor);

  // Glowing Crimson Brembo-Style Brake Caliper
  const caliper = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.44, 0.16),
    new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 1.15,
      metalness: 0.65,
      roughness: 0.2,
    })
  );
  caliper.position.set(0.46, 0.18, 0.04);
  caliper.rotation.z = -0.35;
  wheelGroup.add(caliper);

  // Glowing Crimson-Violet Center Hub
  const hub = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.26, 0),
    new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 1.2,
      metalness: 0.75,
      roughness: 0.18,
    })
  );
  hub.position.z = 0.05;
  wheelGroup.add(hub);

  group.add(wheelGroup);

  // 2. Orbiting Violet Drift Halo & Expanding Burnout Tire Smoke Rings
  const driftRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.42, 0.04, 12, 56),
    new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.9,
    })
  );
  driftRing.rotation.x = Math.PI / 2.35;
  group.add(driftRing);

  const smokeRings = [];
  for (let i = 0; i < 3; i++) {
    const smoke = new THREE.Mesh(
      new THREE.TorusGeometry(0.85, 0.06, 10, 36),
      new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xc084fc : 0xf43f5e,
        transparent: true,
        opacity: 0.35,
      })
    );
    smoke.rotation.x = Math.PI / 2;
    smoke.position.y = -0.95;
    group.add(smoke);
    smokeRings.push({ mesh: smoke, offset: i / 3 });
  }

  // 3. Midnight Streetlight Crimson & Violet Rim Lighting
  const redLight = new THREE.PointLight(0xef4444, 12, 11);
  redLight.position.set(2.0, 1.5, 2.4);
  group.add(redLight);

  const violetLight = new THREE.PointLight(0xa855f7, 10, 11);
  violetLight.position.set(-2.0, -1.4, 2.4);
  group.add(violetLight);

  return {
    group,
    description:
      'Gritty 90s Memphis rap cassette loops paired with metallic 808 cowbell melodies, distorted sub-bass, and midnight JDM street-drifting visuals.',
    background: 'radial-gradient(circle at 50% 35%, #7f1d1d 0%, #3b0764 55%, #09090b 100%)',
    update(t, bounce, spring) {
      // Aggressive 808 cowbell / sub-bass thump + high-RPM drift wheel spin
      const kick = Math.pow(Math.abs(Math.sin(t * 5.6)), 8);

      spinningRim.rotation.z = -t * 4.5;
      wheelGroup.rotation.y = Math.sin(t * 0.85) * 0.38;
      wheelGroup.position.y = -bounce * 0.2;

      hub.rotation.z = t * 2.2;
      hub.scale.setScalar(1 + kick * 0.24);
      caliper.scale.setScalar(1 + kick * 0.12);

      driftRing.rotation.z = t * 1.4;

      // Expanding burnout tire smoke plumes beneath wheel
      smokeRings.forEach((s) => {
        const cycle = (t * 0.75 + s.offset) % 1;
        s.mesh.scale.setScalar(0.8 + cycle * 1.15);
        s.mesh.position.y = -0.95 - cycle * 0.35;
        s.mesh.material.opacity = (1 - cycle) * 0.38;
      });

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
