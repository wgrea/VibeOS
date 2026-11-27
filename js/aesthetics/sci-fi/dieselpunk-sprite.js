import * as THREE from 'three';

export function createDieselpunkSprite() {
  const group = new THREE.Group();

  // Materials (90s/2000s Arcade Pixel-Sprite Palette)
  const oliveMat = new THREE.MeshStandardMaterial({
    color: 0x4d7c0f,
    roughness: 0.6,
    metalness: 0.25,
  });

  const darkOliveMat = new THREE.MeshStandardMaterial({
    color: 0x365314,
    roughness: 0.7,
    metalness: 0.2,
  });

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x71717a,
    metalness: 0.82,
    roughness: 0.32,
  });

  const treadMat = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    metalness: 0.6,
    roughness: 0.65,
  });

  const hazardMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 0.45,
    roughness: 0.35,
  });

  const groundDirtMat = new THREE.MeshStandardMaterial({
    color: 0x3f2e21,
    roughness: 0.92,
  });

  const groundTopMat = new THREE.MeshStandardMaterial({
    color: 0x4d3b2b,
    roughness: 0.85,
  });

  const smokeMat = new THREE.MeshBasicMaterial({
    color: 0x57534e,
    transparent: true,
    opacity: 0.65,
  });

  // 1. Solid Ground Strip (Keeps tank anchored to terrain when orbiting)
  const groundGroup = new THREE.Group();
  const groundBase = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.28, 1.9), groundDirtMat);
  groundBase.position.y = -0.55;
  const groundTop = new THREE.Mesh(new THREE.BoxGeometry(5.64, 0.05, 1.94), groundTopMat);
  groundTop.position.y = -0.41;
  groundGroup.add(groundBase, groundTop);

  // Scrolling ground tread marks / gravel stones
  const stones = [];
  const stoneGeo = new THREE.BoxGeometry(0.16, 0.04, 0.14);
  for (let i = 0; i < 14; i++) {
    const stone = new THREE.Mesh(stoneGeo, darkOliveMat);
    const sx = -2.5 + (i / 14) * 5.0;
    const sz = i % 2 === 0 ? 0.68 : -0.68;
    stone.position.set(sx, -0.38, sz);
    groundGroup.add(stone);
    stones.push(stone);
  }
  group.add(groundGroup);

  // 2. Chunky Metal Slug / Advance Wars Super-Vehicle Tank
  const tank = new THREE.Group();
  tank.position.y = 0; // Treads sit flush at y = -0.41

  // Squashed Hull + Front Bumper
  const hull = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.44, 0.68), oliveMat);
  const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.72), darkOliveMat);
  frontBumper.position.set(0.52, -0.06, 0);
  hull.add(frontBumper);

  // Armor Rivets
  const rivetGeo = new THREE.SphereGeometry(0.024, 6, 6);
  [-0.36, -0.12, 0.12, 0.36].forEach((rx) => {
    const rL = new THREE.Mesh(rivetGeo, steelMat);
    rL.position.set(rx, 0.14, 0.35);
    const rR = rL.clone();
    rR.position.z = -0.35;
    hull.add(rL, rR);
  });

  // Twin Rear Smokestacks
  const stackGeo = new THREE.CylinderGeometry(0.045, 0.055, 0.36, 10);
  const stackL = new THREE.Mesh(stackGeo, steelMat);
  stackL.position.set(-0.46, 0.3, 0.2);
  stackL.rotation.z = 0.18;
  const stackR = stackL.clone();
  stackR.position.z = -0.2;
  hull.add(stackL, stackR);

  // Domed Turret + Stubby Arcade Cannon
  const turret = new THREE.Group();
  turret.position.set(-0.04, 0.28, 0);

  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 14), oliveMat);
  dome.scale.set(1.05, 0.85, 0.95);

  const hatch = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.1, 12), darkOliveMat);
  hatch.position.set(-0.06, 0.28, 0);

  const cannonGroup = new THREE.Group();
  cannonGroup.position.set(0.28, 0.02, 0);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.125, 0.56, 14), steelMat);
  barrel.rotation.z = -Math.PI / 2;
  barrel.position.x = 0.25;

  const muzzleBrake = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.14, 14), treadMat);
  muzzleBrake.rotation.z = -Math.PI / 2;
  muzzleBrake.position.x = 0.54;

  cannonGroup.add(barrel, muzzleBrake);
  turret.add(dome, hatch, cannonGroup);

  // Heavy Treads & Spinning Road Wheels (Bottom sits at y = -0.41)
  const treadL = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.26, 0.2), treadMat);
  treadL.position.set(0, -0.28, 0.34);
  const treadR = treadL.clone();
  treadR.position.z = -0.34;

  const wheels = [];
  const wheelGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.22, 8);
  wheelGeo.rotateX(Math.PI / 2);
  [-0.36, 0, 0.36].forEach((wx) => {
    const wL = new THREE.Mesh(wheelGeo, steelMat);
    wL.position.set(wx, -0.28, 0.34);
    const wR = wL.clone();
    wR.position.z = -0.34;
    tank.add(wL, wR);
    wheels.push(wL, wR);
  });

  // Glowing Arcade Shell Projectile
  const heavyShell = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), hazardMat);
  heavyShell.scale.set(1.35, 0.9, 0.9);
  heavyShell.position.set(1.05, 0.3, 0);

  // Puffing Diesel Exhaust Smoke
  const puffs = [];
  const puffGeo = new THREE.DodecahedronGeometry(0.075, 0);
  for (let i = 0; i < 6; i++) {
    const puff = new THREE.Mesh(puffGeo, smokeMat);
    tank.add(puff);
    puffs.push({ mesh: puff, offset: i / 6, side: i % 2 === 0 ? 0.2 : -0.2 });
  }

  tank.add(hull, turret, treadL, treadR, heavyShell);
  group.add(tank);

  // Lighting
  const keyLight = new THREE.DirectionalLight(0xfef3c7, 1.5);
  keyLight.position.set(3, 5, 4);
  group.add(keyLight, new THREE.AmbientLight(0xd97706, 0.55));

  // Keyboard Controls: A / Left = Drive Left, D / Right = Drive Right
  const moveKeys = { left: false, right: false };
  let tankX = 0;
  let facingDir = 1; // 1 = facing right, -1 = facing left
  let wheelSpin = 0;

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') moveKeys.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') moveKeys.right = true;
    });
    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') moveKeys.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') moveKeys.right = false;
    });
  }

  return {
    group,
    description:
  'Born from 1990s and 2000s 2D arcade run-and-gun classics like Metal Slug and Advance Wars, Dieselpunk Sprites pack riveted olive steel, stubby oversized cannons, and bouncy squash-and-stretch machinery into expressive pixel-art silhouettes. Move the tank with the Left/Right Arrow keys or A and D.',
  background: 'linear-gradient(180deg, #92400e 0%, #d97706 48%, #365314 50%, #1a2e05 100%)',
    update(t, bounce, spring) {
      // Drive Left / Right along the ground strip with A/D or Arrow keys
      let drive = 0;
      if (moveKeys.left) drive -= 1;
      if (moveKeys.right) drive += 1;

      if (drive !== 0) {
        tankX = THREE.MathUtils.clamp(tankX + drive * 0.045, -1.9, 1.9);
        facingDir = drive;
        wheelSpin -= drive * 0.18;

        // Scroll ground stones subtly under the treads
        stones.forEach((s) => {
          s.position.x -= drive * 0.035;
          if (s.position.x < -2.6) s.position.x = 2.6;
          if (s.position.x > 2.6) s.position.x = -2.6;
        });
      }

      // Smoothly turn tank left or right while keeping treads planted on the ground
      const targetRotY = facingDir === 1 ? 0 : Math.PI;
      tank.rotation.y = THREE.MathUtils.lerp(tank.rotation.y, targetRotY, 0.16);
      tank.position.set(tankX, 0, 0);

      wheels.forEach((w) => {
        w.rotation.z = wheelSpin;
      });

      // Bouncy 2D sprite idle engine chug (hull & turret bounce, treads stay planted)
      const chug = Math.sin(t * 18);
      hull.position.y = chug * 0.016 - bounce * 0.12;
      hull.scale.set(1 - chug * 0.015, 1 + chug * 0.025, 1);
      turret.position.y = 0.28 + chug * 0.022 - bounce * 0.12;

      // Cannon fire cycle & recoil
      const fireCycle = (t * 1.6) % 1;
      const recoil = Math.max(0, 1 - fireCycle * 4);
      cannonGroup.position.x = 0.28 - recoil * 0.14;
      cannonGroup.scale.set(1 - recoil * 0.12, 1 + recoil * 0.15, 1 + recoil * 0.15);

      heavyShell.position.x = 0.98 + fireCycle * 0.85;
      heavyShell.scale.set(
        1.35 * (1 - fireCycle * 0.45),
        0.9 * (1 - fireCycle * 0.45),
        0.9 * (1 - fireCycle * 0.45)
      );

      // Rising diesel exhaust puffs
      puffs.forEach((p) => {
        const life = (t * 1.1 + p.offset) % 1;
        p.mesh.position.set(
          -0.5 - life * 0.45,
          0.48 + life * 0.55,
          p.side + Math.sin(t * 4 + p.offset * 6) * 0.04
        );
        const s = 0.5 + life * 1.2;
        p.mesh.scale.setScalar(s * (1 - life * 0.5));
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
