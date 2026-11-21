// js/aesthetics/dark/captchacore.js
import * as THREE from 'three';

export function createCaptchacore() {
  const group = new THREE.Group();

  // 1. Sleek Dark Modal Backing Frame (reCAPTCHA Challenge Window)
  const frameGroup = new THREE.Group();
  const modalBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.48, 1.88, 0.06),
    new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.45,
      metalness: 0.2,
    })
  );
  frameGroup.add(modalBody);

  // Header Banner ("Select all squares with...")
  const headerBar = new THREE.Mesh(
    new THREE.BoxGeometry(1.36, 0.34, 0.08),
    new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.35,
      roughness: 0.3,
    })
  );
  headerBar.position.set(0, 0.68, 0.02);
  frameGroup.add(headerBar);

  // Simulated header prompt lines
  const promptLine1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 0.045, 0.09),
    new THREE.MeshBasicMaterial({ color: 0x93c5fd })
  );
  promptLine1.position.set(-0.18, 0.74, 0.025);
  frameGroup.add(promptLine1);

  const promptLine2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.07, 0.09),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  promptLine2.position.set(-0.33, 0.63, 0.025);
  frameGroup.add(promptLine2);

  // Footer Verify Pill Button
  const verifyBtn = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.14, 0.08),
    new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x2563eb,
      emissiveIntensity: 0.4,
      roughness: 0.25,
    })
  );
  verifyBtn.position.set(0.44, -0.78, 0.02);
  frameGroup.add(verifyBtn);

  // 2. 3x3 Captcha Verification Grid Tiles
  const tileSelectedMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    emissive: 0x1e40af,
    emissiveIntensity: 0.4,
    roughness: 0.25,
  });

  const tileUnselectedMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.5,
  });

  const checkBadgeMat = new THREE.MeshBasicMaterial({
    color: 0x22c55e,
  });

  const tileGeo = new THREE.BoxGeometry(0.38, 0.38, 0.07);
  const badgeGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.03, 16);
  badgeGeo.rotateX(Math.PI / 2);

  const tiles = [];
  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      const isSelected = (row + col) % 2 === 0;
      const tile = new THREE.Mesh(tileGeo, isSelected ? tileSelectedMat : tileUnselectedMat);
      const baseZ = isSelected ? 0.09 : 0.04;
      tile.position.set(col * 0.43, row * 0.43 - 0.12, baseZ);
      frameGroup.add(tile);

      if (isSelected) {
        const badge = new THREE.Mesh(badgeGeo, checkBadgeMat);
        badge.position.set(-0.13, 0.13, 0.04);
        tile.add(badge);
      }

      tiles.push({
        mesh: tile,
        isSelected,
        baseZ,
        phase: (row + 2) * 1.3 + (col + 2) * 0.9,
      });
    }
  }

  group.add(frameGroup);

  // 3. Computer-Vision / Bot-Detection Wireframe Scanner Cage
  const scannerGeo = new THREE.IcosahedronGeometry(1.38, 1);
  const scannerEdges = new THREE.EdgesGeometry(scannerGeo);
  const scannerCage = new THREE.LineSegments(
    scannerEdges,
    new THREE.LineBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.38,
    })
  );
  group.add(scannerCage);

  // 4. Floating "Humanity Verified" Green Checkmark Orb
  const orbGroup = new THREE.Group();
  orbGroup.position.set(0.86, 0.88, 0.25);

  const orbRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.025, 12, 32),
    new THREE.MeshBasicMaterial({ color: 0x22c55e })
  );
  orbGroup.add(orbRing);

  // Checkmark geometry built from two angled bars
  const checkMat = new THREE.MeshBasicMaterial({ color: 0x4ade80 });
  const checkShort = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.11, 0.03), checkMat);
  checkShort.position.set(-0.045, -0.02, 0);
  checkShort.rotation.z = Math.PI / 4;
  orbGroup.add(checkShort);

  const checkLong = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.21, 0.03), checkMat);
  checkLong.position.set(0.04, 0.015, 0);
  checkLong.rotation.z = -Math.PI / 4;
  orbGroup.add(checkLong);

  group.add(orbGroup);

  return {
    group,
    description:
      'Born from internet surrealism, bot-detection anxiety, and early-2020s webcore, Captchacore transforms mundane security gates—3×3 traffic-light grids, warped text puzzles, and "I\'m not a robot" checkboxes—into existential digital art questioning human authenticity online.',
    background: 'radial-gradient(circle at 50% 35%, #1e293b 0%, #0f172a 55%, #020617 100%)',
    update(t, bounce, spring) {
      // Subtle floating sway of the challenge modal
      frameGroup.rotation.y = Math.sin(t * 0.85) * 0.28;
      frameGroup.rotation.x = Math.cos(t * 0.65) * 0.08;

      // Selected tiles pulse forward as if being clicked by a user
      tiles.forEach((item) => {
        if (item.isSelected) {
          item.mesh.position.z = item.baseZ + Math.sin(t * 2.6 + item.phase) * 0.025;
        }
      });

      // Slow rotation of the outer computer-vision verification lattice
      scannerCage.rotation.x = t * 0.25;
      scannerCage.rotation.y = -t * 0.35;

      // Gentle bobbing of the verification badge
      orbGroup.position.y = 0.88 + Math.sin(t * 2.2) * 0.05;
      orbGroup.rotation.y = Math.sin(t * 1.4) * 0.35;

      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
