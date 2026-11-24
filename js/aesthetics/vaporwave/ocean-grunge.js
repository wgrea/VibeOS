// js/aesthetics/vaporwave/ocean-grunge.js

import * as THREE from 'three';

export function createOceanGrunge() {
  const group = new THREE.Group();

  // 1. Deep Abyssal Teal Wireframe Seafloor Terrain (Infinite Ocean)
  const SEA_SIZE = 24;
  const SEA_SEGMENTS = 96;
  const seaGeo = new THREE.PlaneGeometry(
    SEA_SIZE,
    SEA_SIZE,
    SEA_SEGMENTS,
    SEA_SEGMENTS
  );
  const seaPlane = new THREE.Mesh(
    seaGeo,
    new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      wireframe: true,
      transparent: true,
      opacity: 0.32,
      fog: true,
    })
  );
  seaPlane.rotation.x = -Math.PI / 2.15;
  seaPlane.position.y = -0.85;
  group.add(seaPlane);

  const seaPos = seaGeo.attributes.position;
  const baseX = new Float32Array(seaPos.count);
  const baseY = new Float32Array(seaPos.count);
  for (let i = 0; i < seaPos.count; i++) {
    baseX[i] = seaPos.getX(i);
    baseY[i] = seaPos.getY(i);
  }

  // Snap coordinate to grid cell so the plane can "teleport"
  // in whole cells invisibly (world-space displacement hides it).
  const SNAP = SEA_SIZE / SEA_SEGMENTS;
  const snap = (v) => Math.round(v / SNAP) * SNAP;

  // Optional deep parallax floor — an extra faint seaplane far below.
  const deepSea = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40, 40, 40),
    new THREE.MeshBasicMaterial({
      color: 0x115e59,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      fog: true,
    })
  );
  deepSea.rotation.x = -Math.PI / 2.15;
  deepSea.position.y = -2.6;
  group.add(deepSea);

  // ============================================================
  // 2. THE RELIC — 90s grunge artifacts, half-remembered.
  //    A warped cassette, a distorted guitar body, a shattered
  //    CRT, and a flannel fragment — all oxidized in the abyss.
  //    Colors are unchanged: teal/oxidized/sea-foam/amber.
  // ============================================================
  const relicGroup = new THREE.Group();

  // --- 2a. Oxidized Cassette Tape (the "keepsake") ---
  // Two spools + a warped shell. Reads instantly as "a tape
  // you can't quite play anymore."
  const tapeGroup = new THREE.Group();

  const tapeShell = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.58, 0.12),
    new THREE.MeshPhysicalMaterial({
      color: 0x0f766e,          // same oxidized monolith teal
      emissive: 0x115e59,
      emissiveIntensity: 0.45,
      roughness: 0.45,
      metalness: 0.35,
      clearcoat: 0.6,
    })
  );
  tapeGroup.add(tapeShell);

  // Two reels (cylinders lying flat inside the shell)
  const reelMat = new THREE.MeshStandardMaterial({
    color: 0x134e4a,            // same ruin color
    roughness: 0.7,
    metalness: 0.25,
  });
  const reelGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.14, 20);
  const reelL = new THREE.Mesh(reelGeo, reelMat);
  reelL.rotation.x = Math.PI / 2;
  reelL.position.set(-0.22, 0, 0);
  tapeGroup.add(reelL);
  const reelR = reelL.clone();
  reelR.position.x = 0.22;
  tapeGroup.add(reelR);

  // The magnetic tape spool between the reels
  const tapeSpool = new THREE.Mesh(
    new THREE.TorusGeometry(0.09, 0.025, 8, 20),
    new THREE.MeshStandardMaterial({
      color: 0x5eead4,          // sea-foam highlight, same cage color
      emissive: 0x2dd4bf,
      emissiveIntensity: 0.3,
      roughness: 0.6,
    })
  );
  tapeSpool.rotation.x = Math.PI / 2;
  tapeSpool.position.z = 0.02;
  tapeGroup.add(tapeSpool);

  // Warped label: a thin amber plane on the front of the shell,
  // the "warmth of childhood" still visible under the oxidation.
  const tapeLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.6, 0.22),
    new THREE.MeshBasicMaterial({
      color: 0xffb36b,          // same memory-ember amber
      transparent: true,
      opacity: 0.55,
    })
  );
  tapeLabel.position.set(0, 0.12, 0.065);
  tapeGroup.add(tapeLabel);

  tapeGroup.position.y = 0.25;
  relicGroup.add(tapeGroup);

  // --- 2b. Distorted Guitar Body (the "instrument you played") ---
  // A sunken electric guitar body: a flattened, stretched
  // dodecahedron reads as a warped offset-waist guitar shape.
  const guitarBody = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.55, 0),
    new THREE.MeshPhysicalMaterial({
      color: 0x0f766e,
      emissive: 0x115e59,
      emissiveIntensity: 0.4,
      roughness: 0.5,
      metalness: 0.3,
      clearcoat: 0.5,
    })
  );
  guitarBody.scale.set(0.75, 1.35, 0.18);  // guitar-ish silhouette
  guitarBody.position.set(0.75, -0.1, -0.15);
  guitarBody.rotation.set(0.2, -0.5, 0.35);
  relicGroup.add(guitarBody);

  // The neck: a thin box + headstock, drifting loose.
  const guitarNeck = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.9, 0.07),
    new THREE.MeshStandardMaterial({
      color: 0x134e4a,
      roughness: 0.8,
      metalness: 0.15,
    })
  );
  guitarNeck.position.set(0.95, 0.6, -0.15);
  guitarNeck.rotation.set(0.1, -0.5, -0.35);
  relicGroup.add(guitarNeck);

  // --- 2c. Shattered CRT Monitor (the "screen you stared at") ---
  // A chunky box with a displaced front face — the screen is
  // cracked and the picture long gone.
  const crtGroup = new THREE.Group();

  const crtShell = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.6, 0.5),
    new THREE.MeshStandardMaterial({
      color: 0x134e4a,
      roughness: 0.85,
      metalness: 0.1,
    })
  );
  crtGroup.add(crtShell);

  // Cracked screen face: a plane with high emissive, flickering.
  const crtScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.52, 0.44),
    new THREE.MeshBasicMaterial({
      color: 0x5eead4,
      transparent: true,
      opacity: 0.35,
    })
  );
  crtScreen.position.z = 0.251;
  crtGroup.add(crtScreen);

  crtGroup.position.set(-0.85, -0.3, -0.2);
  crtGroup.rotation.set(-0.1, 0.5, 0.15);
  relicGroup.add(crtGroup);

  // --- 2d. Flannel Fragment (the "shirt you wore") ---
  // A tilted plane with a subtle wireframe over it. Reads as
  // a scrap of flannel caught in the current.
  const flannel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.4, 4, 4),
    new THREE.MeshStandardMaterial({
      color: 0x134e4a,
      roughness: 0.95,
      metalness: 0.0,
      side: THREE.DoubleSide,
    })
  );
  flannel.position.set(-0.35, -0.55, 0.4);
  flannel.rotation.set(0.6, 0.2, 1.1);
  relicGroup.add(flannel);

  // Wireframe overlay on the flannel: the plaid pattern, faded.
  const flannelPlaid = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.4, 4, 4),
    new THREE.MeshBasicMaterial({
      color: 0x5eead4,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    })
  );
  flannelPlaid.position.copy(flannel.position);
  flannelPlaid.rotation.copy(flannel.rotation);
  relicGroup.add(flannelPlaid);

  group.add(relicGroup);

  // ============================================================
  // 3. DRIFTING MEMORY-FOAM — bubbles that rise like
  //    fragments of a forgotten summer day. Each one is
  //    a tiny, unreadable "frame" of a memory.
  // ============================================================
  const particles = [];
  const pMat = new THREE.MeshBasicMaterial({
    color: 0x99f6e4,
    transparent: true,
    opacity: 0.75,
  });

  for (let i = 0; i < 26; i++) {
    const radius = 0.02 + (i % 3) * 0.014;
    const p = new THREE.Mesh(new THREE.SphereGeometry(radius, 10, 10), pMat);
    p.position.set(
      (Math.random() - 0.5) * 2.6,
      (Math.random() - 0.5) * 1.8,
      (Math.random() - 0.5) * 2.6
    );
    group.add(p);
    particles.push({
      mesh: p,
      baseX: p.position.x,
      baseY: p.position.y,
      phase: i * 0.65,
      drift: 0.05 + Math.random() * 0.05,
    });
  }

  // ============================================================
  // 4. CAUSTIC MEMORY-LIGHT — the surface of the water far
  //    above, the "present," the world you're sinking away
  //    from. A cold teal glow that pulses like a hospital
  //    monitor / a CRT left on at 3am.
  // ============================================================
  const causticLight = new THREE.PointLight(0x5eead4, 9, 10);
  causticLight.position.set(0.5, 2.2, 1.8);
  group.add(causticLight);

  const deepRim = new THREE.PointLight(0x0d9488, 7, 10);
  deepRim.position.set(-1.8, -0.8, 1.5);
  group.add(deepRim);

  // A new, faint "memory ember" — warm amber, the last
  // warmth of childhood, almost extinguished by the depths.
  const memoryEmber = new THREE.PointLight(0xffb36b, 2.2, 6);
  memoryEmber.position.set(0, 0.1, 0);
  group.add(memoryEmber);

  // ============================================================
  // 5. BACKGROUND — the abyss gradient, now with a faint
  //    "VHS sunset" band near the top: the surface of memory.
  // ============================================================
background:
      'radial-gradient(ellipse at 50% 16%, #f0a868 0%, #0d9488 26%, #115e59 58%, #021617 100%)';
   return {
    group,
    description:
      'Drowning in a beautiful, forgotten 90s memory at the bottom of the sea — slowed-down grunge guitars warping through cavernous reverb, a half-recalled childhood keepsake oxidized in the abyss, and the last warm ember of a summer you can almost touch.',
    background:
      'radial-gradient(ellipse at 50% 16%, #f0a868 0%, #0d9488 26%, #115e59 58%, #021617 100%)',
    update(t, bounce, spring) {
      // --- Relic cluster: the whole memory drifts and turns ---
      relicGroup.rotation.y = t * 0.15;
      relicGroup.position.y = Math.sin(t * 0.9) * 0.12 - bounce * 0.2;

      // Cassette spool spins like a tape that's still trying to play
      tapeSpool.rotation.z = t * 0.8;
      reelL.rotation.y = t * 1.6;
      reelR.rotation.y = t * 1.6;

      // Guitar drifts and rolls slightly
      guitarBody.rotation.z = 0.35 + Math.sin(t * 0.4) * 0.08;
      guitarNeck.rotation.z = -0.35 + Math.sin(t * 0.4 + 1) * 0.06;

      // CRT screen flickers like a dying tube
      crtScreen.material.opacity = 0.25 + Math.sin(t * 8) * 0.15
        + (Math.sin(t * 23) > 0.9 ? 0.2 : 0);

      // Flannel drifts in the current
      flannel.rotation.z = 1.1 + Math.sin(t * 0.6) * 0.15;
      flannelPlaid.rotation.copy(flannel.rotation);

      // Memory ember pulses like a slowing heartbeat (unchanged)
      const emberPulse = 0.5 + Math.sin(t * 0.8) * 0.5;
      memoryEmber.intensity = 1.2 + emberPulse * 1.8;

      // …rest of update() unchanged (ocean, deep sea, bubbles, breath)…
      // --- Seafloor: world-space swell + VHS jitter ---
      // Follow the group in snapped cells so the ocean appears
      // infinite (no visible seam as it recenters).
      seaPlane.position.x = snap(group.position.x);
      seaPlane.position.z = snap(group.position.z);
      const worldOffsetX = seaPlane.position.x;
      const worldOffsetZ = seaPlane.position.z;

      for (let i = 0; i < seaPos.count; i++) {
        const wx = baseX[i] + worldOffsetX;
        const wy = baseY[i] + worldOffsetZ;

        const swell =
          Math.sin(wx * 1.7 + t * 0.9) * 0.06 +
          Math.cos(wy * 1.9 + t * 0.7) * 0.06 +
          Math.sin((wx + wy) * 1.1 + t * 1.3) * 0.04;

        const jitter = Math.sin(t * 11 + (wx + wy) * 0.5) * 0.004;

        seaPos.setZ(i, swell + jitter);
      }
      seaPos.needsUpdate = true;

      // --- Deep parallax floor: same treatment, slower ---
      const dpos = deepSea.geometry.attributes.position;
      if (!deepSea.userData._bx) {
        const bx = new Float32Array(dpos.count);
        const by = new Float32Array(dpos.count);
        for (let i = 0; i < dpos.count; i++) {
          bx[i] = dpos.getX(i);
          by[i] = dpos.getY(i);
        }
        deepSea.userData._bx = bx;
        deepSea.userData._by = by;
      }
      deepSea.position.x = snap(group.position.x);
      deepSea.position.z = snap(group.position.z);
      const dBX = deepSea.userData._bx;
      const dBY = deepSea.userData._by;
      for (let i = 0; i < dpos.count; i++) {
        const wx = dBX[i] + deepSea.position.x;
        const wy = dBY[i] + deepSea.position.z;
        dpos.setZ(
          i,
          Math.sin(wx * 0.6 + t * 0.35) * 0.18 +
            Math.cos(wy * 0.5 + t * 0.3) * 0.18
        );
      }
      dpos.needsUpdate = true;

      // --- Bubbles: rise + glitch ---
      particles.forEach((pt, idx) => {
        pt.mesh.position.y =
          pt.baseY + Math.sin(t * 1.4 + pt.phase) * 0.2 + ((t * pt.drift) % 0.4);
        pt.mesh.position.x = pt.baseX + Math.cos(t * 0.9 + pt.phase) * 0.07;

        const glitch = Math.sin(t * 7 + idx) > 0.985 ? 0.15 : 0;
        pt.mesh.scale.setScalar(1 + Math.sin(t * 2 + pt.phase) * 0.1 + glitch);
      });

      // --- Breathing scale + spring ---
      const breath = 1 + Math.sin(t * 0.6) * 0.008;
      group.scale.setScalar(breath + spring * 0.25);
    },
  };
}