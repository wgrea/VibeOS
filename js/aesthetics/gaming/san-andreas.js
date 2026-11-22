import * as THREE from 'three';

export function createSanAndreas() {
  const group = new THREE.Group();

  // Procedural Asphalt & Yellow Centerline Street Texture
  function createStreetTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Warm PS2-era sun-baked asphalt
    ctx.fillStyle = '#292524';
    ctx.fillRect(0, 0, 256, 256);

    // Subtle concrete grain
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.12)';
      ctx.fillRect((i * 73) % 256, (i * 137) % 256, 2, 2);
    }

    // Double yellow West Coast road divider lines
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(0, 121, 256, 4);
    ctx.fillRect(0, 131, 256, 4);

    // Sidewalk curb edge strips
    ctx.fillStyle = '#a8a29e';
    ctx.fillRect(0, 0, 256, 22);
    ctx.fillRect(0, 234, 256, 22);

    return new THREE.CanvasTexture(canvas);
  }

  // Materials (PS2 Golden-Hour Amber Smog, Grove Green Lacquer, Chrome & Whitewalls)
  const streetMat = new THREE.MeshStandardMaterial({
    map: createStreetTexture(),
    roughness: 0.85,
  });

  const sidewalkMat = new THREE.MeshStandardMaterial({
    color: 0xd6d3d1,
    roughness: 0.75,
  });

  const groveGreenMat = new THREE.MeshPhysicalMaterial({
    color: 0x15803d,
    emissive: 0x052e16,
    emissiveIntensity: 0.25,
    roughness: 0.18,
    metalness: 0.35,
    clearcoat: 1.0,
    clearcoatRoughness: 0.12,
  });

  const creamInteriorMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    roughness: 0.55,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    metalness: 0.92,
    roughness: 0.12,
  });

  const tireBlackMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.8,
  });

  const whitewallMat = new THREE.MeshBasicMaterial({ color: 0xfefce8 });

  const headlightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const taillightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

  const palmTrunkMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.85,
  });

  const palmFrondMat = new THREE.MeshStandardMaterial({
    color: 0x3f6212,
    roughness: 0.65,
  });

  const sunsetSunMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });

  // Warm 1992 Los Santos Amber Smog Lighting
  const ambientLight = new THREE.AmbientLight(0xfbbf24, 0.85);
  const sunsetKeyLight = new THREE.DirectionalLight(0xf59e0b, 1.55);
  sunsetKeyLight.position.set(-3.5, 2.8, -2.5);
  const frontFillLight = new THREE.DirectionalLight(0xfef3c7, 0.85);
  frontFillLight.position.set(2.5, 3, 3.5);
  group.add(ambientLight, sunsetKeyLight, frontFillLight);

  // =========================================================================
  // 1. ANCHORED / STATIC STAGE: Asphalt Street, Palm Trees & Sunset Horizon
  // =========================================================================
  const environment = new THREE.Group();

  // Asphalt Road Block
  const roadSlab = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.14, 1.65), streetMat);
  roadSlab.position.set(0, -0.68, 0);
  environment.add(roadSlab);

  // Back Concrete Sidewalk & Curb
  const curb = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.08, 0.34), sidewalkMat);
  curb.position.set(0, -0.59, -0.66);
  environment.add(curb);

  // Low-Poly Golden Sunset Sun Disc
  const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(0.58, 32), sunsetSunMat);
  sunDisc.position.set(-0.65, 0.35, -1.15);
  environment.add(sunDisc);

  // Helper to build iconic tall California Fan Palm Trees
  function createPalmTree(x, z, height, leanZ) {
    const palm = new THREE.Group();
    palm.position.set(x, -0.55, z);
    palm.rotation.z = leanZ;

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.055, height, 8),
      palmTrunkMat
    );
    trunk.position.y = height / 2;
    palm.add(trunk);

    const crown = new THREE.Group();
    crown.position.y = height;
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const frond = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.46, 5), palmFrondMat);
      frond.position.set(Math.cos(angle) * 0.18, -0.04, Math.sin(angle) * 0.18);
      frond.rotation.z = Math.cos(angle) * -1.15;
      frond.rotation.x = Math.sin(angle) * 1.15;
      crown.add(frond);
    }
    palm.add(crown);
    return palm;
  }

  environment.add(
    createPalmTree(-1.08, -0.64, 1.38, -0.06),
    createPalmTree(-0.78, -0.68, 1.12, 0.05),
    createPalmTree(1.06, -0.64, 1.45, 0.06)
  );

  group.add(environment);

  // =========================================================================
  // 2. MOVING ELEMENT: Hydraulic '64 Grove-Green Lowrider Convertible
  // =========================================================================
  const lowrider = new THREE.Group();
  lowrider.position.set(0.05, -0.45, 0.06);
  lowrider.rotation.y = -0.32;

  // Chassis Pivot (Bounces from the rear axle like real front-switch hydraulics)
  const bodyChassis = new THREE.Group();
  bodyChassis.position.set(-0.45, 0, 0);

  const carBody = new THREE.Group();
  carBody.position.set(0.45, 0, 0);

  // Long Classic '64 Slab Body
  const lowerHull = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.22, 0.62), groveGreenMat);
  lowerHull.position.set(0, 0.08, 0);

  // Chrome Side Trim Spears
  const sideTrimL = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.025, 0.64), chromeMat);
  sideTrimL.position.set(0, 0.12, 0);

  // Open Convertible Cabin & Cream Bench Seats
  const cabinTub = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.1, 0.52), creamInteriorMat);
  cabinTub.position.set(-0.04, 0.19, 0);

  const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 0.5), creamInteriorMat);
  seatBack.position.set(-0.26, 0.25, 0);

  // Chrome Windshield Frame
  const windshield = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 0.18, 0.54),
    new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
    })
  );
  windshield.position.set(0.24, 0.26, 0);
  windshield.rotation.z = 0.35;

  // Heavy Chrome Front & Rear Bumpers + Grille
  const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.66), chromeMat);
  frontBumper.position.set(0.75, 0.03, 0);

  const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.66), chromeMat);
  rearBumper.position.set(-0.75, 0.03, 0);

  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.48), chromeMat);
  grille.position.set(0.74, 0.11, 0);

  // Dual Round Headlights & Red Taillights
  [-0.2, 0.2].forEach((zOff) => {
    const hl = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.03, 12), headlightMat);
    hl.rotation.z = Math.PI / 2;
    hl.position.set(0.745, 0.12, zOff);

    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.045, 0.1), taillightMat);
    tl.position.set(-0.745, 0.12, zOff);

    carBody.add(hl, tl);
  });

  carBody.add(
    lowerHull,
    sideTrimL,
    cabinTub,
    seatBack,
    windshield,
    frontBumper,
    rearBumper,
    grille
  );
  bodyChassis.add(carBody);
  lowrider.add(bodyChassis);

  // 4 Whitewall Tires with Chrome Daytons / Wire Rims
  function createLowriderWheel(x, z) {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(x, -0.04, z);

    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.09, 20), tireBlackMat);
    tire.rotation.x = Math.PI / 2;

    const whitewall = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.094, 20),
      whitewallMat
    );
    whitewall.rotation.x = Math.PI / 2;

    const chromeHub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.072, 0.072, 0.098, 16),
      chromeMat
    );
    chromeHub.rotation.x = Math.PI / 2;

    const spinner = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.02, 0.105), chromeMat);

    wheelGroup.add(tire, whitewall, chromeHub, spinner);
    return wheelGroup;
  }

  const wheelFL = createLowriderWheel(0.45, 0.31);
  const wheelFR = createLowriderWheel(0.45, -0.31);
  const wheelRL = createLowriderWheel(-0.45, 0.31);
  const wheelRR = createLowriderWheel(-0.45, -0.31);

  lowrider.add(wheelFL, wheelFR, wheelRL, wheelRR);
  group.add(lowrider);

  return {
    group,
    description:
      'Early-90s West Coast San Andreas street corner bathed in amber smog sunset light, featuring tall California fan palms, cracked asphalt lines, and a Grove-green lowrider convertible bouncing on front hydraulics.',
    background: 'linear-gradient(180deg, #713f12 0%, #b45309 38%, #eab308 74%, #fde68a 100%)',
update(t, bounce, spring) {
      // Authentic front-switch lowrider hydraulic hop
      const hopCycle = Math.max(0, Math.sin(t * 3.4));
      const hydraulicLift = Math.pow(hopCycle, 3) * 0.24;

      bodyChassis.rotation.z = hydraulicLift;
      wheelFL.position.y = -0.04 + hydraulicLift * 0.45;
      wheelFR.position.y = -0.04 + hydraulicLift * 0.45;

      // Subtle chrome spinner glint
      [wheelFL, wheelFR, wheelRL, wheelRR].forEach((w) => {
        w.rotation.z = Math.sin(t * 1.2) * 0.15;
      });

      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
