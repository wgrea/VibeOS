// js/aesthetics/vaporwave/eccojams.js

import * as THREE from 'three';

export function createEccojams() {
  const group = new THREE.Group();

  // 1. Deep Ocean / CRT Horizon Grid
  const grid = new THREE.GridHelper(16, 32, 0x06b6d4, 0x1e1b4b);
  grid.position.y = -1.75;
  grid.material.transparent = true;
  grid.material.opacity = 0.55;
  group.add(grid);

  // 2. Central Warped Cassette Tape
  const tapeGroup = new THREE.Group();

  const shell = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 1.55, 0.24),
    new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      clearcoat: 1.0
    })
  );
  tapeGroup.add(shell);

  // Sunset / Aqua Label Strip
  const label = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.45, 0.26),
    new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0x9f1239,
      emissiveIntensity: 0.35
    })
  );
  label.position.set(0, 0.42, 0);
  tapeGroup.add(label);

  // Exposed Magnetic Tape Reels
  const reels = [];
  const reelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.28, 16);
  reelGeo.rotateX(Math.PI / 2);
  const reelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });

  [-0.55, 0.55].forEach((x) => {
    const reel = new THREE.Mesh(reelGeo, reelMat);
    reel.position.set(x, -0.1, 0);
    const spoke = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.06, 0.3),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    reel.add(spoke);
    tapeGroup.add(reel);
    reels.push(reel);
  });

  group.add(tapeGroup);

  // 3. Procedural Geometric Dolphins (Ecco the Dolphin Cover Tribute)
  function createDolphin() {
    const dolphin = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.3,
      roughness: 0.25,
      metalness: 0.2
    });

    // Streamlined Torso
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.65, 8, 16), bodyMat);
    torso.rotation.z = Math.PI / 2;
    dolphin.add(torso);

    // Snout / Rostrum
    const snout = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.32, 12), bodyMat);
    snout.rotation.z = -Math.PI / 2;
    snout.position.set(0.55, -0.04, 0);
    dolphin.add(snout);

    // Dorsal Fin
    const dorsal = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.28, 4), bodyMat);
    dorsal.position.set(-0.05, 0.24, 0);
    dorsal.rotation.z = 0.35;
    dolphin.add(dorsal);

    // Tail Fluke
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.38), bodyMat);
    tail.position.set(-0.55, 0, 0);
    tail.rotation.z = -0.25;
    dolphin.add(tail);

    return dolphin;
  }

  const dolphins = [];
  for (let i = 0; i < 3; i++) {
    const d = createDolphin();
    d.scale.setScalar(0.85);
    group.add(d);
    dolphins.push({
      mesh: d,
      angleOffset: (i * Math.PI * 2) / 3,
      radius: 2.35 + i * 0.25
    });
  }

  // 4. Sonar / Ocean Ripples
  const sonarRing = new THREE.Mesh(
    new THREE.RingGeometry(1.75, 1.82, 48),
    new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45
    })
  );
  sonarRing.rotation.x = Math.PI / 2;
  sonarRing.position.y = -1.72;
  group.add(sonarRing);

  // Aquatic & Sunset Rim Lighting
  const cyanLight = new THREE.PointLight(0x22d3ee, 10, 12);
  cyanLight.position.set(2.5, 2.5, 3);
  group.add(cyanLight);

  const magentaLight = new THREE.PointLight(0xf43f5e, 6, 12);
  magentaLight.position.set(-2.5, -1, 2.5);
  group.add(magentaLight);

  return {
    group,
    description:
      'Hypnagogic cassette loops, pitched-down 80s pop fragments, and 16-bit Ecco the Dolphin aquatic surrealism.',
    background:
      'radial-gradient(circle at 50% 35%, #0e7490 0%, #1e1b4b 55%, #09090b 100%)',
    update(t, bounce) {
      // Chopped & screwed cassette loop drag
      const drag = 0.015 + Math.sin(t * 2.1) * 0.008;
      reels.forEach((r) => { r.rotation.z -= drag; });

      tapeGroup.rotation.y = Math.sin(t * 0.8) * 0.3;
      tapeGroup.position.y = Math.sin(t * 1.4) * 0.08 - bounce * 0.35;

      // Dolphins leaping in an orbital wave around the cassette
      dolphins.forEach((d) => {
        const angle = t * 0.75 + d.angleOffset;
        const leapY = Math.sin(angle * 2) * 0.75;

        d.mesh.position.set(
          Math.cos(angle) * d.radius,
          leapY,
          Math.sin(angle) * d.radius
        );

        // Orient dolphin along its orbital tangent + pitch with the leap
        d.mesh.rotation.y = -angle - Math.PI / 2;
        d.mesh.rotation.z = Math.cos(angle * 2) * 0.55;
      });

      // Expanding 16-bit sonar pulse
      const pulse = (t * 0.6) % 1;
      sonarRing.scale.setScalar(0.8 + pulse * 1.4);
      sonarRing.material.opacity = (1 - pulse) * 0.5;
    }
  };
}
