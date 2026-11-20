// js/aesthetics/vaporwave/vhs-pop.js

import * as THREE from 'three';

export function createVhsPop() {
  const group = new THREE.Group();

  // 1. Unified VHS Videocassette Group (Draggable / Arrow-Key Interactive)
  const vhsGroup = new THREE.Group();

  // Matte Charcoal-Indigo VHS Cassette Shell (wider 16:9-ish videocassette proportions)
  const cassette = new THREE.Mesh(
    new THREE.BoxGeometry(2.05, 1.15, 0.26),
    new THREE.MeshPhysicalMaterial({
      color: 0x1e1b4b,
      roughness: 0.28,
      metalness: 0.25,
      clearcoat: 0.75,
    })
  );
  vhsGroup.add(cassette);

  // Hinged Top Tape-Guard Flip Door
  const topFlap = new THREE.Mesh(
    new THREE.BoxGeometry(2.07, 0.16, 0.28),
    new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.35,
      metalness: 0.4,
    })
  );
  topFlap.position.set(0, 0.51, 0);
  vhsGroup.add(topFlap);

  // Hot-Pink & Electric-Cyan Dual Broadcast Label Strip
  const pinkLabel = new THREE.Mesh(
    new THREE.BoxGeometry(1.72, 0.22, 0.28),
    new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 0.65,
    })
  );
  pinkLabel.position.set(0, 0.26, 0);
  vhsGroup.add(pinkLabel);

  const cyanStripe = new THREE.Mesh(
    new THREE.BoxGeometry(1.72, 0.06, 0.282),
    new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.75,
    })
  );
  cyanStripe.position.set(0, 0.12, 0);
  vhsGroup.add(cyanStripe);

  // Center Grip Ridge Between Viewing Windows
  const centerBridge = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.44, 0.275),
    new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.3 })
  );
  centerBridge.position.set(0, -0.18, 0);
  vhsGroup.add(centerBridge);

  // Spinning Left & Right VHS Tape Spools with Inner Drive Spokes
  const reelMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.45,
    roughness: 0.25,
  });

  function buildVhsReel(xPos) {
    const reelContainer = new THREE.Group();
    reelContainer.position.set(xPos, -0.18, 0.135);

    const outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.24, 0.055, 12, 28),
      reelMat
    );
    reelContainer.add(outerRing);

    // 3-Prong Inner Spool Spokes (so rotation is clearly visible)
    for (let i = 0; i < 3; i++) {
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.04, 0.03),
        reelMat
      );
      spoke.rotation.z = (i * Math.PI) / 3;
      reelContainer.add(spoke);
    }

    return reelContainer;
  }

  const leftReel = buildVhsReel(-0.54);
  const rightReel = buildVhsReel(0.54);
  vhsGroup.add(leftReel, rightReel);

  group.add(vhsGroup);

  // 2. Floating CRT Tracking & Scanline Bars
  const scanlines = [];
  for (let i = 0; i < 5; i++) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(2.6 + (i % 2) * 0.6, 0.022, 0.02),
      new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x22d3ee : 0xf472b6,
        transparent: true,
        opacity: 0.35,
      })
    );
    line.position.set(0, -0.75 + i * 0.38, -0.28);
    group.add(line);
    scanlines.push({ mesh: line, baseY: line.position.y, phase: i * 1.3 });
  }

  // 3. Vibrant 80s Magenta & Cyan Studio Rim Lights
  const pinkLight = new THREE.PointLight(0xf43f5e, 9, 12);
  pinkLight.position.set(-2.2, 1.6, 2.4);
  group.add(pinkLight);

  const cyanLight = new THREE.PointLight(0x22d3ee, 9, 12);
  cyanLight.position.set(2.2, -1.2, 2.4);
  group.add(cyanLight);

  return {
    group,
    draggable: vhsGroup,
    description:
      'Warm analog tape saturation, neon 80s synth-pop hooks, home-recorded MTV broadcasts, and pastel CRT tracking nostalgia.',
    background: 'radial-gradient(circle at 50% 35%, #ec4899 0%, #6d28d9 55%, #0f172a 100%)',
    update(t, bounce, spring) {
      vhsGroup.rotation.y = Math.sin(t * 0.65) * 0.32;
      vhsGroup.rotation.x = Math.cos(t * 0.5) * 0.14;
      vhsGroup.position.y = -bounce * 0.2;

      leftReel.rotation.z = -t * 2.4;
      rightReel.rotation.z = -t * 2.4;

      // Subtle CRT tracking glitch shimmer
      scanlines.forEach((s) => {
        s.mesh.position.y = s.baseY + Math.sin(t * 1.4 + s.phase) * 0.06;
        if (Math.sin(t * 8 + s.phase) > 0.96) {
          s.mesh.position.x = (Math.random() - 0.5) * 0.6;
          s.mesh.material.opacity = 0.75;
        } else {
          s.mesh.position.x *= 0.85;
          s.mesh.material.opacity = 0.3;
        }
      });

      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
