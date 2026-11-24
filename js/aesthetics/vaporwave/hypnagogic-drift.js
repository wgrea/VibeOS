// js/aesthetics/vaporwave/hypnagogic-drift.js

import * as THREE from 'three';

export function createHypnagogicDrift() {
  const group = new THREE.Group();

  // 1. Unified Trippy Dream-State Core & Nested Knots (Draggable / Arrow-Key Interactive)
  const driftGroup = new THREE.Group();

  // Psychedelic Liquid-Warping Mist Core
  const hazeGeo = new THREE.IcosahedronGeometry(0.88, 4);
  const hazePos = hazeGeo.attributes.position;
  const basePositions = new Float32Array(hazePos.array);

  const hazeOrb = new THREE.Mesh(
    hazeGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0xd946ef,
      emissive: 0x6b21a8,
      emissiveIntensity: 0.65,
      roughness: 0.12,
      metalness: 0.25,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.72,
    })
  );
  driftGroup.add(hazeOrb);

  // Outer Melted Rose-Magenta Ribbon Knot
  const outerKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.18, 0.11, 120, 20, 2, 3),
    new THREE.MeshPhysicalMaterial({
      color: 0xf472b6,
      emissive: 0xdb2777,
      emissiveIntensity: 0.55,
      roughness: 0.12,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.82,
    })
  );
  driftGroup.add(outerKnot);

  // Inner Counter-Rotating Cyan-Violet Interfering Knot
  const innerKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.96, 0.075, 120, 16, 3, 5),
    new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.65,
      roughness: 0.1,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.65,
    })
  );
  driftGroup.add(innerKnot);

  group.add(driftGroup);

  // 2. Echoing Memory Orbs with Trailing Ghost Afterimages
  const echoes = [];
  const echoMat = new THREE.MeshBasicMaterial({
    color: 0xf5d0fe,
    transparent: true,
    opacity: 0.8,
  });
  const trailMat = new THREE.MeshBasicMaterial({
    color: 0xc084fc,
    transparent: true,
    opacity: 0.28,
  });

  for (let i = 0; i < 12; i++) {
    const orbContainer = new THREE.Group();
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 14), echoMat);
    orbContainer.add(orb);

    // Two trailing ghost echoes per orb for lucid-dream motion blur
    const ghost1 = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 10), trailMat);
    ghost1.position.set(-0.12, -0.04, 0.08);
    const ghost2 = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), trailMat);
    ghost2.position.set(-0.22, -0.08, 0.15);
    orbContainer.add(ghost1, ghost2);

    const a = (i / 12) * Math.PI * 2;
    group.add(orbContainer);
    echoes.push({
      mesh: orbContainer,
      angle: a,
      baseY: Math.sin(i * 1.4) * 0.55,
      phase: i * 0.6,
    });
  }

  // 3. Psychedelic Color-Shifting Lights
  const innerGlow = new THREE.PointLight(0xf0abfc, 10, 9);
  group.add(innerGlow);

  const cyanLight = new THREE.PointLight(0x22d3ee, 8, 11);
  cyanLight.position.set(2.2, 1.5, 2.0);
  group.add(cyanLight);

  const magentaLight = new THREE.PointLight(0xf43f5e, 8, 11);
  magentaLight.position.set(-2.2, -1.5, 2.0);
  group.add(magentaLight);

  return {
    group,
    description:
      'Early 2012–2013 hypnagogic vaporwave—warped tape loops, woozy pitched-down memories, and lucid dream-state haze that paved the way for slushwave.',
    background: 'radial-gradient(circle at 50% 35%, #6b21a8 0%, #3b0764 55%, #090d16 100%)',
    update(t, bounce, spring) {
      // Trippy multi-axis counter-rotation
      hazeOrb.rotation.y = t * 0.28;
      hazeOrb.rotation.z = Math.sin(t * 0.4) * 0.25;

      outerKnot.rotation.x = t * 0.24;
      outerKnot.rotation.y = -t * 0.32;

      innerKnot.rotation.x = -t * 0.36;
      innerKnot.rotation.z = t * 0.28;

      driftGroup.position.y = Math.sin(t * 1.1) * 0.1 - bounce * 0.2;

      // Liquid-mercury multi-wave vertex distortion on core
      for (let i = 0; i < hazePos.count; i++) {
        const bx = basePositions[i * 3];
        const by = basePositions[i * 3 + 1];
        const bz = basePositions[i * 3 + 2];
        const wave1 = Math.sin(t * 2.1 + by * 4.5 + bx * 3.0);
        const wave2 = Math.cos(t * 1.7 + bz * 4.0 - by * 2.5);
        const warp = 1 + (wave1 + wave2) * 0.075;
        hazePos.setXYZ(i, bx * warp, by * warp, bz * warp);
      }
      hazePos.needsUpdate = true;

      // Breathing spiral orbit for trailing memory orbs
      const breatheRadius = 1.62 + Math.sin(t * 0.9) * 0.2;
      echoes.forEach((e) => {
        // Slow lateral drift, in addition to the spiral orbit
        const a = e.angle + t * 0.35;
        const driftX = Math.sin(t * 0.18 + e.phase) * 0.4;   // side-to-side drift
        const driftZ = Math.cos(t * 0.14 + e.phase) * 0.4;

        e.mesh.position.x = Math.cos(a) * breatheRadius + driftX;
        e.mesh.position.z = Math.sin(a) * breatheRadius + driftZ;
        e.mesh.position.y = e.baseY + Math.sin(t * 1.4 + e.phase) * 0.24;

        // Fade in and out like a memory surfacing and sinking
        const fade = 0.5 + Math.sin(t * 0.5 + e.phase) * 0.5;
        e.mesh.children.forEach((c) => {
          c.material.opacity = (c.material === echoMat ? 0.8 : 0.28) * fade;
        });

        e.mesh.rotation.y = -a;
      });

      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
