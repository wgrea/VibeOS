// js/aesthetics/comfort/plaza-avatar.js
import * as THREE from 'three';

export function createPlazaAvatar() {
  const group = new THREE.Group();

  // 1. Wuhu Island Meadow Green Ground & Warm Plaza Path Circle
  const plazaMat = new THREE.MeshPhysicalMaterial({
    color: 0x4ade80, // Vibrant Wuhu Island grass green
    roughness: 0.45,
    clearcoat: 0.25,
  });

  const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.48, 1.54, 0.1, 48), plazaMat);
  disc.position.y = -0.45;
  group.add(disc);

  // Sandy Stone Plaza Path Ring (under the marching Miis)
  const pathMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7, // Warm sunlit plaza stone / sand path
    roughness: 0.65,
  });

  const pathDisc = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.12, 0.106, 48), pathMat);
  pathDisc.position.y = -0.45;
  group.add(pathDisc);

  // Inner Grassy Fountain Island inside the Path Ring
  const centerGrass = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.112, 36), plazaMat);
  centerGrass.position.y = -0.45;
  group.add(centerGrass);

  // Crisp White Stone Curb Borders around the Path
  const curbMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
  });

  const outerRing = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.025, 12, 64), curbMat);
  outerRing.rotation.x = Math.PI / 2;
  outerRing.position.y = -0.395;
  group.add(outerRing);

  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.022, 12, 48), curbMat);
  innerRing.rotation.x = Math.PI / 2;
  innerRing.position.y = -0.392;
  group.add(innerRing);


    // 1B. Wuhu Island & Mii Plaza Perimeter Landmarks
  const landmarksGroup = new THREE.Group();

  // StreetPass Mii Plaza Archway Gate (at back-left of the disc)
  const gateGroup = new THREE.Group();
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.25 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0xfb7185, roughness: 0.3 });

  const leftPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.65, 16), pillarMat);
  leftPillar.position.set(-0.26, 0.32, 0);
  const rightPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.65, 16), pillarMat);
  rightPillar.position.set(0.26, 0.32, 0);

  const archBeam = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.12, 0.14), roofMat);
  archBeam.position.set(0, 0.66, 0);

  const archCrest = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 0.3 })
  );
  archCrest.position.set(0, 0.77, 0);

  gateGroup.add(leftPillar, rightPillar, archBeam, archCrest);
  gateGroup.position.set(-0.98, -0.4, -0.98);
  gateGroup.rotation.y = Math.PI / 4;
  landmarksGroup.add(gateGroup);

  // Miniature Wuhu Island Lighthouse / Town Clocktower (at back-right of the disc)
  const towerGroup = new THREE.Group();
  const towerBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.16, 0.78, 20),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
  );
  towerBody.position.y = 0.39;

  const towerStripe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.128, 0.142, 0.22, 20),
    new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.35 })
  );
  towerStripe.position.y = 0.42;

  const towerTop = new THREE.Mesh(
    new THREE.ConeGeometry(0.15, 0.24, 20),
    new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 })
  );
  towerTop.position.y = 0.9;

  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 14, 14),
    new THREE.MeshBasicMaterial({ color: 0xfef08a })
  );
  beacon.position.y = 0.78;

  towerGroup.add(towerBody, towerStripe, towerTop, beacon);
  towerGroup.position.set(1.02, -0.4, -0.95);
  landmarksGroup.add(towerGroup);

  // Toyetic Wuhu Island Cypress Trees (3 clustered around the rim)
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.45 });

  const treeCoords = [
    [-1.32, 0.22, 0.95],
    [1.34, 0.18, 1.05],
    [0.12, -1.36, 0.85],
  ];

  treeCoords.forEach(([tx, tz, scale]) => {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.22, 10), trunkMat);
    trunk.position.y = 0.11;
    const foliage = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.45, 14), leafMat);
    foliage.position.y = 0.4;
    tree.add(trunk, foliage);
    tree.position.set(tx, -0.4, tz);
    tree.scale.setScalar(scale);
    landmarksGroup.add(tree);
  });

  // Floating Golden StreetPass Play Coins around the outer rim
  const coinMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.35,
    metalness: 0.65,
    roughness: 0.2,
  });

  const playCoins = [];
  for (let i = 0; i < 4; i++) {
    const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.022, 20), coinMat);
    coin.rotation.x = Math.PI / 2;
    const angle = (i / 4) * Math.PI * 2 + 0.4;
    coin.position.set(Math.cos(angle) * 1.32, 0.18, Math.sin(angle) * 1.32);
    landmarksGroup.add(coin);
    playCoins.push({ mesh: coin, baseY: 0.18, phase: i * 1.5 });
  }

  group.add(landmarksGroup);


  // 2. Toyetic Mii-Style Plaza Avatars with Floating Hands & Speech Bubbles
  const colors = [0x38bdf8, 0xfb7185, 0x4ade80, 0xfacc15, 0xc084fc];
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.4 });
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
  const bubbleMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.1,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.9,
  });

  const avatars = [];

  colors.forEach((hex, i) => {
    const pawn = new THREE.Group();
    const outfitMat = new THREE.MeshStandardMaterial({ color: hex, roughness: 0.3 });

    // Shirt / Torso Cone
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.4, 20), outfitMat);
    body.position.y = 0.2;

    // Head + Colored Hair/Hat Cap
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.145, 20, 20), skinMat);
    head.position.y = 0.51;

    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.48),
      outfitMat
    );
    cap.position.y = 0.525;
    cap.rotation.x = -0.2;

    // Dot Eyes
    const eyeGeo = new THREE.SphereGeometry(0.015, 8, 8);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.045, 0.51, 0.136);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.045, 0.51, 0.136);

    // Floating Mii Hands
    const handGeo = new THREE.SphereGeometry(0.036, 12, 12);
    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.set(-0.18, 0.24, 0.04);
    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.set(0.18, 0.24, 0.04);

    // Mini WaraWara Chat Bubble above every other avatar
    let bubble = null;
    if (i % 2 === 0) {
      bubble = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), bubbleMat);
      bubble.scale.set(1.35, 0.85, 0.45);
      bubble.position.set(0.14, 0.76, 0);
      pawn.add(bubble);
    }

    pawn.add(body, head, cap, leftEye, rightEye, leftHand, rightHand);

    const angle = (i / colors.length) * Math.PI * 2;
    pawn.position.set(Math.cos(angle) * 0.88, -0.4, Math.sin(angle) * 0.88);
    pawn.rotation.y = -angle; // Face along the parade circle
    group.add(pawn);

    avatars.push({
      mesh: pawn,
      leftHand,
      rightHand,
      bubble,
      angle,
      phase: i * 1.25,
    });
  });

  return {
    group,
    description:
      'Channeling Wii-era Mii Plaza and WaraWara social hubs, Plaza Avatar brings toyetic pastel characters, glossy white podiums, floating chat bubbles, and cheerful parade motion into a bright digital gathering space.',
    background: 'radial-gradient(circle at 50% 25%, #ffffff 0%, #e0f2fe 55%, #bae6fd 100%)',
    update(t, bounce, spring) {
      avatars.forEach((a) => {
        const currentAngle = a.angle + t * 0.45;
        a.mesh.position.x = Math.cos(currentAngle) * 0.88;
        a.mesh.position.z = Math.sin(currentAngle) * 0.88;
        a.mesh.position.y = -0.4 + Math.abs(Math.sin(t * 3.8 + a.phase)) * 0.14;

        // Keep each Mii facing forward around the plaza circle
        a.mesh.rotation.y = -currentAngle;

        // Cheerful arm swing & chat bubble bob
        a.leftHand.position.y = 0.24 + Math.sin(t * 5 + a.phase) * 0.04;
        a.rightHand.position.y = 0.24 - Math.sin(t * 5 + a.phase) * 0.04;
        if (a.bubble) {
          a.bubble.position.y = 0.76 + Math.sin(t * 2.5 + a.phase) * 0.03;
        }
      });

      group.scale.setScalar(1 + spring * 0.25);
            playCoins.forEach((c) => {
        c.mesh.rotation.z = t * 2.4 + c.phase;
        c.mesh.position.y = c.baseY + Math.sin(t * 2.6 + c.phase) * 0.06;
      });
      beacon.scale.setScalar(1 + Math.sin(t * 4) * 0.18);

    },
  };
}
