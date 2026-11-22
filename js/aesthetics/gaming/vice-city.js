import * as THREE from 'three';

export function createViceCity() {
  const group = new THREE.Group();

  // Procedural Striped 80s-to-Leonida Sunset Disc Texture
  function createViceSunTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.5, '#fb923c');
    grad.addColorStop(1, '#ec4899');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    // Classic horizontal scanline cutouts near bottom half
    ctx.fillStyle = '#4c1d95';
    const stripes = Array.of(150, 175, 198, 218, 236);
    stripes.forEach((y, idx) => {
      ctx.fillRect(0, y, 256, 3 + idx * 1.5);
    });

    return new THREE.CanvasTexture(canvas);
  }

  // Materials (Pastel Art Deco, Hot-Pink & Electric Cyan Neon, Glossy White Supercar)
  const boulevardMat = new THREE.MeshPhysicalMaterial({
    color: 0x1e1b4b,
    roughness: 0.22,
    metalness: 0.35,
    clearcoat: 0.9,
    clearcoatRoughness: 0.15,
  });

  const sidewalkPastelMat = new THREE.MeshStandardMaterial({
    color: 0xfce7f3,
    roughness: 0.55,
  });

  const decoWallMat = new THREE.MeshStandardMaterial({
    color: 0xfdf2f8,
    roughness: 0.4,
  });

  const decoTrimTealMat = new THREE.MeshStandardMaterial({
    color: 0x2dd4bf,
    roughness: 0.35,
  });

  const neonPinkMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
  const neonCyanMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
  const neonGoldMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });

  const carWhiteMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    emissive: 0xf472b6,
    emissiveIntensity: 0.12,
    roughness: 0.12,
    metalness: 0.2,
    clearcoat: 1.0,
  });

  const tintedGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0f172a,
    roughness: 0.08,
    metalness: 0.6,
    clearcoat: 1.0,
  });

  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    roughness: 0.75,
  });

  const chromeRimMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    metalness: 0.92,
    roughness: 0.12,
  });

  const palmTrunkMat = new THREE.MeshStandardMaterial({
    color: 0x581c87,
    roughness: 0.7,
  });

  const palmFrondMat = new THREE.MeshStandardMaterial({
    color: 0x0d9488,
    emissive: 0x0f766e,
    emissiveIntensity: 0.25,
    roughness: 0.45,
  });

  // Twilight Neon & Sunset Rim Lighting
  const ambientLight = new THREE.AmbientLight(0xf472b6, 0.75);
  const sunsetBackLight = new THREE.DirectionalLight(0xfb923c, 1.45);
  sunsetBackLight.position.set(-2.5, 3, -3.5);
  const neonRimLight = new THREE.DirectionalLight(0x22d3ee, 1.15);
  neonRimLight.position.set(3, 2.5, 3);
  group.add(ambientLight, sunsetBackLight, neonRimLight);

  // =========================================================================
  // 1. ANCHORED / STATIC STAGE: Ocean Drive Art Deco Strip & Sunset Horizon
  // =========================================================================
  const beachfront = new THREE.Group();

  // Wet Reflective Ocean Drive Asphalt Slab
  const road = new THREE.Mesh(new THREE.BoxGeometry(2.85, 0.12, 1.65), boulevardMat);
  road.position.set(0, -0.68, 0.05);
  beachfront.add(road);

  // Glowing Cyan Boulevard Lane & Curb Strips
  const curbGlow = new THREE.Mesh(new THREE.BoxGeometry(2.85, 0.025, 0.04), neonCyanMat);
  curbGlow.position.set(0, -0.61, -0.46);
  const centerDash = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.01, 0.025), neonPinkMat);
  centerDash.position.set(0, -0.618, 0.34);
  beachfront.add(curbGlow, centerDash);

  // Pastel Sidewalk Promenade
  const promenade = new THREE.Mesh(new THREE.BoxGeometry(2.85, 0.06, 0.55), sidewalkPastelMat);
  promenade.position.set(0, -0.6, -0.74);
  beachfront.add(promenade);

  // Striped Miami / Leonida Sunset Disc
  const sunDisc = new THREE.Mesh(
    new THREE.CircleGeometry(0.62, 36),
    new THREE.MeshBasicMaterial({ map: createViceSunTexture() })
  );
  sunDisc.position.set(0.55, 0.34, -1.18);
  beachfront.add(sunDisc);

  // Classic 1930s/1980s Ocean Drive Art Deco Boutique Hotel (Left/Center Back)
  const hotel = new THREE.Group();
  hotel.position.set(-0.56, -0.05, -0.72);

  const mainBlock = new THREE.Mesh(new THREE.BoxGeometry(1.08, 1.04, 0.42), decoWallMat);
  hotel.add(mainBlock);

  // Pastel Teal Eyebrow Window Ledges (Signature Miami Art Deco Feature)
  [-0.24, 0.08, 0.36].forEach((ly) => {
    const ledge = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.04, 0.5), decoTrimTealMat);
    ledge.position.y = ly;
    hotel.add(ledge);

    // Glowing Aqua Hotel Windows
    for (let wx = -0.36; wx <= 0.36; wx += 0.24) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.44), neonCyanMat);
      win.position.set(wx, ly - 0.1, 0);
      hotel.add(win);
    }
  });

  // Vertical Neon Rooftop Spire & Horizontal Neon Tube Trim
  const finTower = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.38, 0.18), decoWallMat);
  finTower.position.set(0.32, 0.18, 0.14);

  const verticalNeon = new THREE.Mesh(new THREE.BoxGeometry(0.035, 1.32, 0.21), neonPinkMat);
  verticalNeon.position.set(0.32, 0.19, 0.14);

  const roofNeonBar = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.035, 0.46), neonPinkMat);
  roofNeonBar.position.set(0, 0.52, 0);

  hotel.add(finTower, verticalNeon, roofNeonBar);
  beachfront.add(hotel);

  // Coastal Silhouetted Fan Palm Trees
  function createVicePalm(x, z, height, leanZ) {
    const palm = new THREE.Group();
    palm.position.set(x, -0.58, z);
    palm.rotation.z = leanZ;

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.05, height, 8),
      palmTrunkMat
    );
    trunk.position.y = height / 2;
    palm.add(trunk);

    const crown = new THREE.Group();
    crown.position.y = height;
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const frond = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.44, 5), palmFrondMat);
      frond.position.set(Math.cos(a) * 0.17, -0.04, Math.sin(a) * 0.17);
      frond.rotation.z = Math.cos(a) * -1.15;
      frond.rotation.x = Math.sin(a) * 1.15;
      crown.add(frond);
    }
    palm.add(crown);
    return palm;
  }

  beachfront.add(
    createVicePalm(0.35, -0.68, 1.28, 0.07),
    createVicePalm(0.95, -0.65, 1.44, -0.06),
    createVicePalm(-1.22, -0.64, 1.18, -0.08)
  );

  group.add(beachfront);

  // =========================================================================
  // 2. MOVING ELEMENT: Iconic White Wedge Supercar on Ocean Drive
  // =========================================================================
  const supercar = new THREE.Group();
  supercar.position.set(0.24, -0.51, 0.08);
  supercar.rotation.y = -0.24;

  // Low-Slung 80s/Modern Wedge Chassis
  const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.17, 0.6), carWhiteMat);
  lowerBody.position.y = 0.06;

  // Sloped Aerodynamic Nose Hood
  const noseWedge = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.11, 0.58), carWhiteMat);
  noseWedge.position.set(0.48, 0.08, 0);
  noseWedge.rotation.z = -0.16;

  // Sleek Tinted Glass Cabin Canopy
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.14, 0.5), tintedGlassMat);
  canopy.position.set(-0.04, 0.19, 0);

  // Signature Side Air-Intake Strakes (Testarossa / Vice Cheetah Vibe)
  [-0.305, 0.305].forEach((zSide) => {
    for (let s = 0; s < 3; s++) {
      const strake = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.014, 0.015), neonPinkMat);
      strake.position.set(-0.18, 0.04 + s * 0.032, zSide);
      supercar.add(strake);
    }
  });

  // Rear Wing Spoiler & Full-Width Neon Tail Light Bar
  const spoiler = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.025, 0.62), carWhiteMat);
  spoiler.position.set(-0.62, 0.21, 0);

  const tailBar = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 0.56), neonPinkMat);
  tailBar.position.set(-0.685, 0.09, 0);

  const frontLightBar = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.52), neonGoldMat);
  frontLightBar.position.set(0.695, 0.07, 0);

  supercar.add(lowerBody, noseWedge, canopy, spoiler, tailBar, frontLightBar);

  // 4 Low-Profile Alloy Wheels
  const wheelCoords = [
    [0.42, 0.3],
    [0.42, -0.3],
    [-0.42, 0.3],
    [-0.42, -0.3],
  ];
  const wheels = wheelCoords.map(([wx, wz]) => {
    const wGroup = new THREE.Group();
    wGroup.position.set(wx, -0.02, wz);

    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.09, 20), tireMat);
    tire.rotation.x = Math.PI / 2;

    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.096, 16), chromeRimMat);
    rim.rotation.x = Math.PI / 2;

    wGroup.add(tire, rim);
    supercar.add(wGroup);
    return wGroup;
  });

  group.add(supercar);

  return {
    group,
    description:
      'Ocean Drive twilight bridging 1980s Vice City neon and modern GTA VI Leonida nights—pastel Art Deco hotel trim, hot-pink and cyan neon tubes, coastal palms, a striped sunset disc, and a white wedge supercar.',
    background: 'linear-gradient(180deg, #1e1035 0%, #581c87 34%, #be185d 68%, #f97316 100%)',
update(t, bounce, spring) {
      // Subtle supercar engine/cruising hover along the wet boulevard
      supercar.position.y = -0.51 + Math.sin(t * 3.5) * 0.012;
      wheels.forEach((w) => {
        w.rotation.z = -t * 4.5;
      });

      // Gentle neon tube shimmer on the Art Deco hotel
      const neonPulse = 0.85 + Math.sin(t * 6) * 0.15;
      verticalNeon.scale.x = neonPulse;
      sunDisc.scale.setScalar(1 + Math.sin(t * 1.8) * 0.03);

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
