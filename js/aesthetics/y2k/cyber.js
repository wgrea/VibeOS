
import * as THREE from 'three';

export function createCyberY2k() {
  const group = new THREE.Group();

  // Glossy Y2K Fashion & Tech Materials (Zero wireframes)
  const chromeMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    metalness: 0.95,
    roughness: 0.08,
    clearcoat: 1.0,
  });

  const glossyVinylPink = new THREE.MeshPhysicalMaterial({
    color: 0xf472b6,
    emissive: 0xdb2777,
    emissiveIntensity: 0.25,
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  });

  const glossyVinylBlue = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.25,
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  });

  const bondiGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.72,
    roughness: 0.08,
    clearcoat: 1.0,
  });

  const atomicVioletMat = new THREE.MeshPhysicalMaterial({
    color: 0xa855f7,
    transparent: true,
    opacity: 0.75,
    roughness: 0.1,
    clearcoat: 1.0,
  });

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.45 });
  const hairMat = new THREE.MeshPhysicalMaterial({
    color: 0xfef08a,
    roughness: 0.22,
    clearcoat: 0.7,
  });
  const whiteMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.15,
    clearcoat: 0.85,
  });
  const visorMat = new THREE.MeshPhysicalMaterial({
    color: 0x312e81,
    emissive: 0x4f46e5,
    emissiveIntensity: 0.4,
    metalness: 0.8,
    roughness: 0.06,
    iridescence: 1.0,
  });

  // 1. Glossy Millennium Runway Disc
  const stageDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(1.38, 1.44, 0.08, 36),
    new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      metalness: 0.35,
      roughness: 0.12,
      clearcoat: 1.0,
    })
  );
  stageDisc.position.y = -0.68;

  const stageTrim = new THREE.Mesh(
    new THREE.TorusGeometry(1.41, 0.028, 12, 48),
    glossyVinylPink
  );
  stageTrim.rotation.x = Math.PI / 2;
  stageTrim.position.y = -0.64;
  group.add(stageDisc, stageTrim);

  // 2. Movable Girl Wearing Glossy Y2K Fashion (PVC Jacket, Silver Pants, Visor & Platforms)
  const character = new THREE.Group();
  character.position.set(0, -0.64, 0);

  // Chunky White Platform Boots + Glossy Metallic Silver Flare Pants
  const legL = new THREE.Group();
  legL.position.set(-0.085, 0.42, 0);
  const pantL = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.075, 0.34, 12), chromeMat);
  pantL.position.y = -0.17;
  const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.1, 0.17), whiteMat);
  bootL.position.set(0, -0.37, 0.025);
  legL.add(pantL, bootL);

  const legR = legL.clone();
  legR.position.x = 0.085;

  // Glossy Magenta Vinyl Crop Jacket + Chrome Belt
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.3, 14), glossyVinylPink);
  torso.position.y = 0.57;
  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.125, 0.016, 8, 20), chromeMat);
  belt.rotation.x = Math.PI / 2;
  belt.position.y = 0.43;

  // Glossy Sleeves
  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.044, 0.26, 10), glossyVinylPink);
  armL.position.set(-0.16, 0.56, 0.03);
  armL.rotation.set(-0.35, 0, 0.25);
  const armR = armL.clone();
  armR.position.x = 0.16;
  armR.rotation.z = -0.25;

  // Head, Space-Buns / Pigtails & Tinted Wrap-Around Visor Sunglasses
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.125, 18, 18), skinMat);
  head.position.y = 0.83;

  const bunL = new THREE.Mesh(new THREE.SphereGeometry(0.068, 14, 14), hairMat);
  bunL.position.set(-0.12, 0.92, -0.02);
  const bunR = bunL.clone();
  bunR.position.x = 0.12;

  const visor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.132, 0.132, 0.055, 16, 1, true, -0.85, 1.7),
    visorMat
  );
  visor.position.set(0, 0.84, 0.01);

  const headphones = new THREE.Mesh(
    new THREE.TorusGeometry(0.145, 0.015, 8, 24, Math.PI),
    chromeMat
  );
  headphones.position.y = 0.84;

  character.add(legL, legR, torso, belt, armL, armR, head, bunL, bunR, visor, headphones);
  group.add(character);

  // 3. Dense Orbit of Floating Y2K Fashion & Tech Items
  function makeFlipPhone() {
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.18, 0.025), chromeMat);
    const lid = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.16, 0.022), glossyVinylPink);
    lid.position.set(0, 0.14, -0.04);
    lid.rotation.x = -0.55;
    g.add(base, lid);
    return g;
  }

  function makeMiniImac() {
    const g = new THREE.Group();
    const shell = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.21, 0.21), bondiGlassMat);
    const face = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.19, 0.025), whiteMat);
    face.position.z = 0.1;
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.13), visorMat);
    screen.position.z = 0.115;
    g.add(shell, face, screen);
    return g;
  }

  function makePlatformBoot() {
    const g = new THREE.Group();
    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.075, 0.09), whiteMat);
    sole.position.y = -0.08;
    const upper = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.08, 0.085), glossyVinylBlue);
    upper.position.y = -0.01;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.16, 12), atomicVioletMat);
    shaft.position.set(-0.04, 0.09, 0);
    g.add(sole, upper, shaft);
    return g;
  }

  function makeStarClip(mat) {
    const g = new THREE.Group();
    const a = new THREE.Mesh(new THREE.OctahedronGeometry(0.085, 0), mat);
    a.scale.set(1.2, 1.2, 0.35);
    g.add(a);
    return g;
  }

  function makeCdPlayer() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.032, 20), chromeMat);
    body.rotation.x = Math.PI / 2;
    const windowDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.036, 16), bondiGlassMat);
    windowDisc.rotation.x = Math.PI / 2;
    g.add(body, windowDisc);
    return g;
  }

  const orbiters = [];
  const itemTemplates = [
    () => makeMiniImac(),
    () => makeFlipPhone(),
    () => makePlatformBoot(),
    () => makeCdPlayer(),
    () => makeStarClip(glossyVinylPink),
    () => makeStarClip(glossyVinylBlue),
    () => new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.04, 12, 24), atomicVioletMat), // Inflatable ring
    () => new THREE.Mesh(new THREE.SphereGeometry(0.095, 16, 16), bondiGlassMat), // Translucent tech pod
  ];

  const totalItems = 14;
  for (let i = 0; i < totalItems; i++) {
    const mesh = itemTemplates[i % itemTemplates.length]();
    const angle = (i / totalItems) * Math.PI * 2;
    const radius = i % 2 === 0 ? 1.18 : 1.48;
    const baseY = -0.25 + (i % 5) * 0.28;
    mesh.position.set(Math.cos(angle) * radius, baseY, Math.sin(angle) * radius);
    group.add(mesh);
    orbiters.push({ mesh, angle, radius, baseY, speed: i % 2 === 0 ? 0.45 : -0.35, phase: i * 0.8 });
  }

  // 4. High-Gloss Studio & Iridescent Rim Lighting
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.9);
  keyLight.position.set(3, 5, 4);
  const pinkRim = new THREE.DirectionalLight(0xf472b6, 1.35);
  pinkRim.position.set(-4, 2, 3);
  const cyanRim = new THREE.DirectionalLight(0x38bdf8, 1.35);
  cyanRim.position.set(4, -2, -3);
  group.add(keyLight, pinkRim, cyanRim, new THREE.AmbientLight(0xe0f2fe, 0.95));

  // 5. Character Movement & Spin Controls (WASD / Arrow Keys + Spacebar)
  const keys = {};
  const state = { x: 0, z: 0, walkCycle: 0, spinTimer: 0 };

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => {
      keys[e.code] = true;
      if (e.code === 'Space' && group.visible && state.spinTimer <= 0) {
        state.spinTimer = 24;
      }
    });
    window.addEventListener('keyup', (e) => {
      keys[e.code] = false;
    });
  }

  return {
    group,
    description:
      'Turn-of-the-millennium cyber-pop culture (1998–2002) featuring a movable character in glossy PVC outerwear, metallic pants, visor shades, and platform boots (WASD / Arrows + Spacebar spin) surrounded by floating flip phones, translucent iMacs, portable CD players, and inflatable rings.',
       background: 'radial-gradient(circle at 50% 35%, #1e1b4b 0%, #0f172a 48%, #050811 100%)',
update(t, bounce, spring) {
      let mx = 0;
      let mz = 0;
      if (keys['KeyA'] || keys['ArrowLeft']) mx -= 1;
      if (keys['KeyD'] || keys['ArrowRight']) mx += 1;
      if (keys['KeyW'] || keys['ArrowUp']) mz -= 1;
      if (keys['KeyS'] || keys['ArrowDown']) mz += 1;

      const moving = mx !== 0 || mz !== 0;
      if (moving) {
        const len = Math.hypot(mx, mz);
        state.x += (mx / len) * 0.032;
        state.z += (mz / len) * 0.032;

        // Keep character on the glossy runway disc
        const dist = Math.hypot(state.x, state.z);
        if (dist > 0.95) {
          state.x = (state.x / dist) * 0.95;
          state.z = (state.z / dist) * 0.95;
        }
        character.rotation.y = Math.atan2(mx, mz);
        state.walkCycle += 0.24;
      }

      // Celebratory Y2K pop-star jump & spin on Spacebar
      let jumpOffset = 0;
      if (state.spinTimer > 0) {
        state.spinTimer -= 1;
        const progress = 1 - state.spinTimer / 24;
        jumpOffset = Math.sin(progress * Math.PI) * 0.28;
        character.rotation.y += 0.26;
      }

      legL.rotation.x = moving ? Math.sin(state.walkCycle) * 0.55 : 0;
      legR.rotation.x = moving ? -Math.sin(state.walkCycle) * 0.55 : 0;
      character.position.set(
        state.x,
        -0.64 + (moving ? Math.abs(Math.sin(state.walkCycle)) * 0.035 : 0) + jumpOffset - bounce * 0.15,
        state.z
      );

      // Orbit all 14 Y2K fashion & tech items around the runway
      orbiters.forEach((o) => {
        const a = o.angle + t * o.speed;
        o.mesh.position.x = Math.cos(a) * o.radius;
        o.mesh.position.z = Math.sin(a) * o.radius;
        o.mesh.position.y = o.baseY + Math.sin(t * 2.0 + o.phase) * 0.07 - bounce * 0.18;
o.mesh.rotation.y = t * 1.1 + o.phase;
o.mesh.rotation.z = Math.sin(t * 1.4 + o.phase) * 0.25;
});
group.scale.setScalar(1 + spring * 0.24);
},
};
}