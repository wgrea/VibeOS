// js/aesthetics/dark/scammer.js
import * as THREE from 'three';

export function createScammer() {
  const group = new THREE.Group();

  // Materials: Alert Crimson, Classic Windows Blue, Dark Slate Window Body, Jackpot Gold, Hazard Yellow
  const windowBodyMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.4,
    metalness: 0.25,
  });

  const popupBlueMat = new THREE.MeshStandardMaterial({
    color: 0x2563eb,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.35,
    roughness: 0.3,
  });

  const alertRedMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 0.55,
    roughness: 0.25,
  });

  const goldCoinMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    emissive: 0xca8a04,
    emissiveIntensity: 0.35,
    metalness: 0.9,
    roughness: 0.14,
  });

  const limeBaitMat = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    emissive: 0x16a34a,
    emissiveIntensity: 0.65,
    roughness: 0.25,
  });

  const whiteMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
  const darkInkMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });

  // Helper to build a structured popup alert window
  function buildPopupModal(headerMat, hasWarningBadge) {
    const modal = new THREE.Group();

    // Window frame
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.18, 0.78, 0.06),
      windowBodyMat
    );
    modal.add(body);

    // Title bar
    const titleBar = new THREE.Mesh(
      new THREE.BoxGeometry(1.14, 0.14, 0.07),
      headerMat
    );
    titleBar.position.set(0, 0.3, 0.005);
    modal.add(titleBar);

    // Red [X] close button in top-right corner
    const closeBtn = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.075),
      alertRedMat
    );
    closeBtn.position.set(0.5, 0.3, 0.008);
    modal.add(closeBtn);

    if (hasWarningBadge) {
      // Yellow hazard warning triangle + exclamation mark
      const tri = new THREE.Mesh(
        new THREE.ConeGeometry(0.15, 0.26, 3),
        goldCoinMat
      );
      tri.position.set(-0.34, 0.02, 0.045);
      modal.add(tri);

      const bangBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.025, 0.09, 0.02),
        darkInkMat
      );
      bangBar.position.set(-0.34, 0.03, 0.06);

      const bangDot = new THREE.Mesh(
        new THREE.BoxGeometry(0.025, 0.025, 0.02),
        darkInkMat
      );
      bangDot.position.set(-0.34, -0.045, 0.06);
      modal.add(bangBar, bangDot);

      // Simulated urgent message lines
      const line1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.54, 0.045, 0.02),
        whiteMat
      );
      line1.position.set(0.14, 0.08, 0.04);

      const line2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.035, 0.02),
        headerMat
      );
      line2.position.set(0.08, 0.0, 0.04);

      // Flashing green "CLAIM NOW" bait CTA button
      const ctaBtn = new THREE.Mesh(
        new THREE.BoxGeometry(0.44, 0.12, 0.03),
        limeBaitMat
      );
      ctaBtn.position.set(0.12, -0.18, 0.045);

      modal.add(line1, line2, ctaBtn);
    }

    return modal;
  }

  // 1. Cascading Fake System Alert / Giveaway Modals
  const modalBack = buildPopupModal(popupBlueMat, false);
  modalBack.position.set(-0.26, 0.24, -0.2);

  const modalMid = buildPopupModal(alertRedMat, false);
  modalMid.position.set(-0.08, 0.08, -0.06);

  const modalFront = buildPopupModal(alertRedMat, true);
  modalFront.position.set(0.12, -0.1, 0.1);

  group.add(modalBack, modalMid, modalFront);

  // 2. Spinning "Free Jackpot / Crypto" Bait Coins
  function buildCoin(radius) {
    const coinGroup = new THREE.Group();
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, 0.065, 28),
      goldCoinMat
    );
    disc.rotation.x = Math.PI / 2;

    // Dollar / Token vertical bar emblem on both faces
    const emblem = new THREE.Mesh(
      new THREE.BoxGeometry(radius * 0.22, radius * 1.15, 0.085),
      darkInkMat
    );
    coinGroup.add(disc, emblem);
    return coinGroup;
  }

  const mainCoin = buildCoin(0.28);
  mainCoin.position.set(0.66, 0.46, 0.28);

  const smallCoin = buildCoin(0.17);
  smallCoin.position.set(-0.68, -0.42, 0.26);

  group.add(mainCoin, smallCoin);

  // 3. Metallic Phishing Hook Dangling From Above
  const hookGroup = new THREE.Group();
  hookGroup.position.set(-0.56, 0.62, 0.22);

  const hookShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.45, 10),
    whiteMat
  );
  hookShaft.position.y = 0.18;

  const hookCurve = new THREE.Mesh(
    new THREE.TorusGeometry(0.11, 0.016, 10, 24, Math.PI * 1.25),
    whiteMat
  );
  hookCurve.position.set(-0.09, -0.04, 0);
  hookCurve.rotation.z = Math.PI * 0.95;

  hookGroup.add(hookShaft, hookCurve);
  group.add(hookGroup);

  return {
    group,
    description:
      'Inspired by early-2000s adware popups, fake antivirus alerts, phishing hooks, and flashy "You Won!" giveaway banners, Scammer turns digital deception and urgent spam-mail energy into chaotic dark webcore.',
    background: 'radial-gradient(circle at 50% 35%, #7f1d1d 0%, #1e1b4b 55%, #05070d 100%)',
    update(t, bounce, spring) {
      // Rapid jackpot coin spin
      mainCoin.rotation.y = t * 3.2;
      mainCoin.position.y = 0.46 + Math.sin(t * 2.4) * 0.04;

      smallCoin.rotation.y = -t * 3.8;
      smallCoin.position.y = -0.42 + Math.cos(t * 2.4) * 0.04;

      // Urgent vibrating error shake on the front modal + pulsing bait button
      modalFront.position.x = 0.12 + Math.sin(t * 16) * 0.016;
      limeBaitMat.emissiveIntensity = 0.55 + Math.sin(t * 7.0) * 0.45;

      // Gentle phishing hook dangle
      hookGroup.rotation.z = Math.sin(t * 1.6) * 0.12;

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
