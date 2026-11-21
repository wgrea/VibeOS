import * as THREE from 'three';

export function createY2kArena() {
  const group = new THREE.Group();

  // Materials (Y2K 3D Kaiju Arena Fighter Palette)
  const neonGridMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.45,
    wireframe: true,
  });

  const arenaBaseMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.6,
    metalness: 0.4,
  });

  const playerKaijuMat = new THREE.MeshPhysicalMaterial({
    color: 0x10b981,
    emissive: 0x059669,
    emissiveIntensity: 0.3,
    roughness: 0.35,
    clearcoat: 0.6,
  });

  const dorsalFinMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0ea5e9,
    emissiveIntensity: 0.75,
    roughness: 0.2,
  });

  const rivalKaijuMat = new THREE.MeshPhysicalMaterial({
    color: 0xe11d48,
    emissive: 0x9f1239,
    emissiveIntensity: 0.3,
    roughness: 0.3,
    metalness: 0.55,
  });

  const rivalArmorMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    emissive: 0xd97706,
    emissiveIntensity: 0.45,
    roughness: 0.25,
  });

  const beamMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0,
  });

  // 1. 3D Fighter Arena Floor Disc
  const arenaFloor = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.5, 0.08, 24), arenaBaseMat);
  arenaFloor.position.y = -0.62;
  const arenaWire = new THREE.Mesh(new THREE.CylinderGeometry(1.46, 1.46, 0.09, 16), neonGridMat);
  arenaWire.position.y = -0.61;
  group.add(arenaFloor, arenaWire);

    // Coliseum Perimeter Wall & Y2K City Skyscrapers around the circular arena
  const stadiumGroup = new THREE.Group();
  const buildingMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.45,
    metalness: 0.5,
  });
  const windowGlowMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
  });
  const coliseumStoneMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.65,
  });

  // 16 Coliseum Pillars + Overhead Ring Beam framing the arena edge
  const pillarCount = 16;
  const ringRadius = 1.62;
  for (let i = 0; i < pillarCount; i++) {
    const angle = (i / pillarCount) * Math.PI * 2;
    const px = Math.cos(angle) * ringRadius;
    const pz = Math.sin(angle) * ringRadius;

    // Leave front-facing gap slightly lower so camera view stays clear
    const isFront = Math.sin(angle) > 0.55;
    const pillarH = isFront ? 0.24 : 0.48;

    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, pillarH, 0.14),
      coliseumStoneMat
    );
    pillar.position.set(px, -0.62 + pillarH / 2, pz);
    pillar.rotation.y = -angle;
    stadiumGroup.add(pillar);
  }

  // Outer Y2K City Skyscrapers behind the Coliseum (back & sides)
  const towerAngles = [-2.6, -2.15, -1.75, -1.35, -0.95, -0.5, 0.05, 3.08];
  towerAngles.forEach((ang, idx) => {
    const dist = 2.15 + (idx % 2) * 0.28;
    const h = 0.75 + (idx % 4) * 0.32;
    const w = 0.28 + (idx % 3) * 0.06;

    const tower = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), buildingMat);
    tower.position.set(Math.cos(ang) * dist, -0.62 + h / 2, Math.sin(ang) * dist);
    tower.rotation.y = -ang;

    // Glowing Y2K skyscraper window band
    const winBand = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.015, 0.06, w + 0.015),
      windowGlowMat
    );
    winBand.position.y = h * 0.25;
    tower.add(winBand);

    stadiumGroup.add(tower);
  });

  group.add(stadiumGroup);


  // Helper to build a chunky Y2K low-poly Kaiju monster
  function buildMonster(bodyMat, spikeMat) {
    const m = new THREE.Group();

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.38, 0.26), bodyMat);
    torso.position.y = 0.28;

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.2, 0.24), bodyMat);
    head.position.set(0, 0.54, 0.05);

    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.07, 0.2), spikeMat);
    jaw.position.set(0, 0.45, 0.07);

    // 3 Glowing Dorsal Spikes along the back
    [0.42, 0.28, 0.14].forEach((sy, idx) => {
      const fin = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.16 - idx * 0.02, 4), spikeMat);
      fin.position.set(0, sy, -0.16);
      fin.rotation.x = -0.65;
      m.add(fin);
    });

    // Heavy Tail
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.42, 6), bodyMat);
    tail.position.set(0, 0.14, -0.28);
    tail.rotation.x = -1.15;

    // Claws / Arms
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.12), bodyMat);
    armL.position.set(-0.21, 0.32, 0.08);
    armL.rotation.x = -0.45;
    const armR = armL.clone();
    armR.position.x = 0.21;

    // Stomping Legs
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.18, 0.14), bodyMat);
    legL.position.set(-0.1, 0.09, 0);
    const legR = legL.clone();
    legR.position.x = 0.1;

    m.add(torso, head, jaw, tail, armL, armR, legL, legR);
    return { root: m, legL, legR, head };
  }

  // 2. Player-Controlled Monster (Left Side — Move with WASD / Arrows, Space to Fire)
  const playerKaiju = buildMonster(playerKaijuMat, dorsalFinMat);
  playerKaiju.root.position.set(-0.72, -0.57, 0);
  playerKaiju.root.rotation.y = Math.PI / 2;

  // Atomic Breath Beam attached to Player Monster's head
  const atomicBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.09, 1.35, 10), beamMat);
  atomicBeam.rotation.x = Math.PI / 2;
  atomicBeam.position.set(0, 0.52, 0.82);
  playerKaiju.root.add(atomicBeam);
  group.add(playerKaiju.root);

  // 3. Stationary Rival Monster (Right Side — Stands still for now)
  const rivalKaiju = buildMonster(rivalKaijuMat, rivalArmorMat);
  rivalKaiju.root.position.set(0.75, -0.57, 0);
  rivalKaiju.root.rotation.y = -Math.PI / 2;
  group.add(rivalKaiju.root);

  // 4. Arena Spotlight & Rim Lighting
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
  keyLight.position.set(2, 5, 4);
  const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.1);
  rimLight.position.set(-3, 3, -3);
  group.add(keyLight, rimLight, new THREE.AmbientLight(0x312e81, 0.9));

  // 5. Keyboard Controls for Moving the Player Kaiju
  const keys = {};
  const monsterPos = { x: -0.72, z: 0, walkCycle: 0, beamTimer: 0 };

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => {
      keys[e.code] = true;
      if ((e.code === 'Space' || e.code === 'KeyF') && group.visible) {
        monsterPos.beamTimer = 14;
      }
    });
    window.addEventListener('keyup', (e) => {
      keys[e.code] = false;
    });
  }

  return {
    group,
        description:
      'Channeling early-2000s 3D arena brawlers like Godzilla: Destroy All Monsters Melee, War of the Monsters, and Power Stone—pitting giant kaiju, alien invaders, and colossal mechs against each other across destructible neon cityscapes.',
      background: 'radial-gradient(circle at 50% 30%, #1e3a8a 0%, #312e81 55%, #090d16 100%)',
    update(t, bounce, spring) {
      // Read WASD / Arrow movement for the Emerald Kaiju
      let mx = 0;
      let mz = 0;
      if (keys['KeyA'] || keys['ArrowLeft']) mx -= 1;
      if (keys['KeyD'] || keys['ArrowRight']) mx += 1;
      if (keys['KeyW'] || keys['ArrowUp']) mz -= 1;
      if (keys['KeyS'] || keys['ArrowDown']) mz += 1;

      const isMoving = mx !== 0 || mz !== 0;
      if (isMoving) {
        const len = Math.hypot(mx, mz);
        mx /= len;
        mz /= len;

        monsterPos.x += mx * 0.032;
        monsterPos.z += mz * 0.032;

        // Keep monster inside the circular arena platform (radius <= 1.15)
        const distFromCenter = Math.hypot(monsterPos.x, monsterPos.z);
        if (distFromCenter > 1.15) {
          monsterPos.x = (monsterPos.x / distFromCenter) * 1.15;
          monsterPos.z = (monsterPos.z / distFromCenter) * 1.15;
        }

        // Smoothly rotate monster toward movement direction
        const targetAngle = Math.atan2(mx, mz);
        playerKaiju.root.rotation.y = targetAngle;
        monsterPos.walkCycle += 0.25;
      }

      // Apply stomp animation to movable monster
      playerKaiju.legL.rotation.x = isMoving ? Math.sin(monsterPos.walkCycle) * 0.55 : 0;
      playerKaiju.legR.rotation.x = isMoving ? -Math.sin(monsterPos.walkCycle) * 0.55 : 0;
      playerKaiju.root.position.set(
        monsterPos.x,
        -0.57 + (isMoving ? Math.abs(Math.sin(monsterPos.walkCycle)) * 0.04 : 0) - bounce * 0.15,
        monsterPos.z
      );

      // Atomic breath pulse when Space/F is pressed
      if (monsterPos.beamTimer > 0) {
        monsterPos.beamTimer -= 1;
        beamMat.opacity = 0.85;
        atomicBeam.scale.set(1 + Math.sin(t * 40) * 0.25, 1, 1 + Math.cos(t * 40) * 0.25);
      } else {
        beamMat.opacity = 0;
      }

      // Rival monster stays stationary at its spot (subtle idle breathing only)
      rivalKaiju.root.position.y = -0.57 - bounce * 0.15;
      rivalKaiju.head.position.y = 0.54 + Math.sin(t * 2.5) * 0.012;

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
