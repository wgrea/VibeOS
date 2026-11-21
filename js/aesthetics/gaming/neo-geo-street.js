import * as THREE from 'three';

export function createNeoGeoStreet() {
  const group = new THREE.Group();

  // Materials (90s SNK Fatal Fury & Arcade-Pop Palette)
  const cartBlackMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.35,
    metalness: 0.15,
  });

  const cartTrimMat = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    roughness: 0.5,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    metalness: 0.8,
    roughness: 0.22,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe4e4e7,
    metalness: 0.9,
    roughness: 0.15,
  });

  const fatalRedMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    roughness: 0.45,
  });

  const whitePanelMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.5,
  });

  const glossyBombMat = new THREE.MeshPhysicalMaterial({
    color: 0x0f172a,
    roughness: 0.15,
    metalness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });

  const sparkMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
  });

  const sparkCoreMat = new THREE.MeshBasicMaterial({
    color: 0xf97316,
  });

  // 1. Oversized Neo Geo AES Cartridge (Draggable)
  const cart = new THREE.Group();
  cart.position.set(-0.24, 0.08, 0);

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.88, 0.22), cartBlackMat);
  const topLip = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.1, 0.25), cartTrimMat);
  topLip.position.y = 0.42;

  const goldStripe = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.11, 0.23), goldMat);
  goldStripe.position.y = 0.24;

  const artLabel = new THREE.Mesh(
    new THREE.BoxGeometry(0.86, 0.46, 0.23),
    new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      emissive: 0x312e81,
      emissiveIntensity: 0.35,
      roughness: 0.3,
    })
  );
  artLabel.position.y = -0.06;

  for (let i = 0; i < 4; i++) {
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.025, 0.24), cartTrimMat);
    ridge.position.y = -0.34 + i * 0.055;
    cart.add(ridge);
  }

  // Terry Bogard's Signature Red & White Trucker Cap perched on top-left corner
  const capGroup = new THREE.Group();
  capGroup.position.set(-0.34, 0.54, 0.04);
  capGroup.rotation.set(0.14, 0.32, 0.22);

  const crown = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
    fatalRedMat
  );
  const whiteFront = new THREE.Mesh(
    new THREE.CylinderGeometry(0.21, 0.235, 0.14, 14, 1, false, -0.65, 1.3),
    whitePanelMat
  );
  whiteFront.position.y = 0.07;

  const starBadge = new THREE.Mesh(new THREE.OctahedronGeometry(0.045, 0), goldMat);
  starBadge.position.set(0, 0.09, 0.235);

  const brim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.23, 0.25, 0.02, 16, 1, false, -0.8, 1.6),
    fatalRedMat
  );
  brim.position.set(0, 0.01, 0.14);
  brim.scale.set(1.05, 1, 1.35);

  capGroup.add(crown, whiteFront, starBadge, brim);
  cart.add(body, topLip, goldStripe, artLabel, capGroup);
  group.add(cart);

  // 2. Classic 90s Bomberman-Style Glossy Cobalt Bomb & Cross-Spark
  const bombGroup = new THREE.Group();
  bombGroup.position.set(-0.74, -0.34, 0.36);

  // Glossy deep navy-cobalt sphere (classic Bomberman bomb hue)
  const arcadeBombMat = new THREE.MeshPhysicalMaterial({
    color: 0x1e3a8a,
    emissive: 0x172554,
    emissiveIntensity: 0.35,
    roughness: 0.12,
    metalness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  });
  const bombSphere = new THREE.Mesh(new THREE.SphereGeometry(0.26, 24, 24), arcadeBombMat);

  // Wide metallic fuse cap collar on top
  const fuseCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.11, 0.065, 16), chromeMat);
  fuseCollar.position.y = 0.245;

  // Curved multi-segment thick white/cream fuse
  const fuseMat = new THREE.MeshStandardMaterial({ color: 0xfef9c3, roughness: 0.7 });
  const fuseLower = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.026, 0.11, 10), fuseMat);
  fuseLower.position.set(0.015, 0.31, 0);
  fuseLower.rotation.z = -0.22;

  const fuseUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.024, 0.1, 10), fuseMat);
  fuseUpper.position.set(0.055, 0.39, 0);
  fuseUpper.rotation.z = -0.68;

  // Bright 4-point cross-shaped arcade spark burst
  const sparkStar = new THREE.Group();
  sparkStar.position.set(0.095, 0.43, 0);
  const flareH = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.026, 0.026), sparkMat);
  const flareV = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.18, 0.026), sparkMat);
  const flareDiag = new THREE.Mesh(new THREE.OctahedronGeometry(0.055, 0), sparkCoreMat);
  sparkStar.add(flareH, flareV, flareDiag);

  bombGroup.add(bombSphere, fuseCollar, fuseLower, fuseUpper, sparkStar);
  group.add(bombGroup);

  // 3. SNK Arcade Fightstick & 4-Button A-B-C-D Layout
  const arcadeDeck = new THREE.Group();
  arcadeDeck.position.set(0.55, -0.38, 0.32);
  arcadeDeck.rotation.set(0.28, -0.35, 0);

  const deckBase = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.14, 0.56), cartBlackMat);
  const deckGoldTrim = new THREE.Mesh(new THREE.BoxGeometry(0.97, 0.025, 0.58), goldMat);
  deckGoldTrim.position.y = 0.065;
  arcadeDeck.add(deckBase, deckGoldTrim);

  // Red Ball-Top Joystick
  const stickGroup = new THREE.Group();
  stickGroup.position.set(-0.24, 0.08, 0.02);

  const washer = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.015, 16), cartTrimMat);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.34, 12), chromeMat);
  shaft.position.y = 0.17;

  const ballTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.125, 20, 20),
    new THREE.MeshPhysicalMaterial({ color: 0xef4444, roughness: 0.18, clearcoat: 0.9 })
  );
  ballTop.position.y = 0.36;

  stickGroup.add(washer, shaft, ballTop);
  arcadeDeck.add(stickGroup);

  // Classic Neo Geo Red, Yellow, Green, Blue Pushbuttons
  const btnColors = [0xef4444, 0xfacc15, 0x22c55e, 0x3b82f6];
  const buttons = [];
  btnColors.forEach((hex, idx) => {
    const btnMat = new THREE.MeshPhysicalMaterial({ color: hex, roughness: 0.22, clearcoat: 0.8 });
    const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.045, 16), btnMat);
    btn.position.set(0.04 + idx * 0.115, 0.085, 0.04 - (idx % 2) * 0.06);
    arcadeDeck.add(btn);
    buttons.push(btn);
  });

  group.add(arcadeDeck);

  // 4. Southtown Sunset Lighting
  const sunLight = new THREE.DirectionalLight(0xfef08a, 1.5);
  sunLight.position.set(3, 5, 4);
  group.add(sunLight, new THREE.AmbientLight(0xf97316, 0.55));

  return {
    group,
    draggable: cart,
    description:
      'Capturing both the street-fighter swagger and toyetic charm of 1990s arcade games, 90s Arcade-Pop pairs oversized gold-striped Neo Geo cartridges, red trucker caps, and four-button fightsticks with glossy cartoon bombs and sizzling fuse sparks.',
    background: 'radial-gradient(circle at 50% 25%, #f97316 0%, #dc2626 50%, #1e1b4b 100%)',
    update(t, bounce, spring) {
      cart.rotation.y = Math.sin(t * 0.9) * 0.42;
      cart.position.y = 0.08 + Math.sin(t * 2.1) * 0.05 - bounce * 0.25;

      // Bomberman countdown squash-and-stretch + red-hot flash before "detonation"
      const fuseCycle = (t * 1.8) % 1;
      const pulse = 1 + Math.sin(t * 12) * 0.075;
      bombSphere.scale.set(pulse, 1 / Math.sqrt(pulse), pulse);
      arcadeBombMat.emissive.setHex(fuseCycle > 0.75 && Math.sin(t * 45) > 0 ? 0xdc2626 : 0x172554);

      bombGroup.position.y = -0.34 + Math.abs(Math.sin(t * 4.5)) * 0.05 - bounce * 0.2;
      sparkStar.rotation.z = t * 16;
      sparkStar.scale.setScalar(0.75 + Math.sin(t * 28) * 0.4);

      // Quarter-circle Power Wave input on the joystick
      stickGroup.rotation.z = Math.sin(t * 5.2) * 0.24;
      stickGroup.rotation.x = Math.cos(t * 5.2) * 0.18;

      buttons.forEach((btn, idx) => {
        const press = Math.max(0, Math.sin(t * 9 - idx * 1.4));
        btn.position.y = 0.085 - press * 0.018;
      });

      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
