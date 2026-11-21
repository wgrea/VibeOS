import * as THREE from 'three';

export function create2000sFps() {
  const group = new THREE.Group();

  // 1. Materials (2000s Snow-Ops Palette)
  const snowMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.88 });
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.78 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
  const gunMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.3 });
  const polyMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.55 });
  const hudMat = new THREE.MeshBasicMaterial({ color: 0x84cc16 });
  const tracerMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const flashMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0 });

  // 2. Empty Snow Courtyard & Concrete Bunker Walls
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(22, 22), snowMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.2;
  group.add(floor);

  const grid = new THREE.GridHelper(22, 22, 0x94a3b8, 0xcbd5e1);
  grid.position.y = -1.19;
  group.add(grid);

  [
    [22, 3.6, 0.8, 0, -11],
    [22, 3.6, 0.8, 0, 11],
    [0.8, 3.6, 22, -11, 0],
    [0.8, 3.6, 22, 11, 0],
  ].forEach(([w, h, d, x, z]) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
    wall.position.set(x, 0.6, z);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(w + 0.04, 0.16, d + 0.04), trimMat);
    stripe.position.set(x, -0.35, z);
    group.add(wall, stripe);
  });

  // 3. Falling Snow Particles
  const snowCount = 140;
  const snowPos = new Float32Array(snowCount * 3);
  for (let i = 0; i < snowCount * 3; i += 3) {
    snowPos[i] = (Math.random() - 0.5) * 20;
    snowPos[i + 1] = Math.random() * 8 - 1;
    snowPos[i + 2] = (Math.random() - 0.5) * 20;
  }
  const snowGeo = new THREE.BufferGeometry();
  snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));
  const snow = new THREE.Points(snowGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.11 }));
  group.add(snow);

  // 4. Winter Lighting
  const sun = new THREE.DirectionalLight(0xe0f2fe, 1.45);
  sun.position.set(4, 9, 5);
  group.add(sun, new THREE.AmbientLight(0xcbd5e1, 1.1));

  // 5. First-Person Viewmodel Rifle & Crosshair
  const viewRig = new THREE.Group();
  const gun = new THREE.Group();

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 0.44), gunMat);
  const guard = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.095, 0.28), polyMat);
  guard.position.set(0, 0.005, -0.32);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.24, 8), gunMat);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.015, -0.54);

  const mag = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.18, 0.09), polyMat);
  mag.position.set(0, -0.12, -0.1);
  mag.rotation.x = 0.22;

  const flash = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.24), flashMat);
  flash.position.set(0, 0.015, -0.68);

  gun.add(body, guard, barrel, mag, flash);
  gun.position.set(0.28, -0.24, -0.52);

  const chH = new THREE.Mesh(new THREE.PlaneGeometry(0.036, 0.0022), hudMat);
  const chV = new THREE.Mesh(new THREE.PlaneGeometry(0.0022, 0.036), hudMat);
  const ch = new THREE.Group();
  ch.add(chH, chV);
  ch.position.set(0, 0, -0.55);

  viewRig.add(gun, ch);
  group.add(viewRig);

  // 6. Player State & Shooting Logic
  const player = { x: 0, y: 0.15, z: 6.5, yaw: 0, pitch: 0, recoil: 0, cooldown: 0 };
  const tracers = [];
  let touchX = 0;
  let touchY = 0;
  let touchWalk = 0;

  function shoot() {
    if (!group.visible || player.cooldown > 0) return;
    player.cooldown = 8;
    player.recoil = 1;
    flashMat.opacity = 0.95;

    const dir = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(player.pitch, player.yaw, 0, 'YXZ'));
    const bolt = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.65), tracerMat);
    bolt.position.set(player.x, player.y - 0.12, player.z).addScaledVector(dir, 1.0);
    bolt.rotation.set(player.pitch, player.yaw, 0, 'YXZ');
    group.add(bolt);
    tracers.push({ mesh: bolt, dir, life: 35 });
  }

  function walk(dist) {
    player.x = THREE.MathUtils.clamp(player.x - Math.sin(player.yaw) * dist, -9.2, 9.2);
    player.z = THREE.MathUtils.clamp(player.z - Math.cos(player.yaw) * dist, -9.2, 9.2);
  }

  return {
    group,
    isFirstPerson: true,
    description: 'A winter-ops tribute to 2000s first-person shooters with snow bunker walls, falling snow, and a working tactical rifle.',
    background: 'linear-gradient(180deg, #cbd5e1 0%, #94a3b8 55%, #334155 100%)',
    resetCamera(camera) {
      Object.assign(player, { x: 0, y: 0.15, z: 6.5, yaw: 0, pitch: 0, recoil: 0 });
      camera.rotation.order = 'YXZ';
      camera.position.set(0, 0.15, 6.5);
      camera.rotation.set(0, 0, 0);
    },
    attachMobileControls(canvas) {
      canvas.addEventListener('mousedown', (e) => {
        if (group.visible && e.button === 0) shoot();
      });
      canvas.addEventListener('touchstart', (e) => {
        if (!group.visible || !e.touches[0]) return;
        touchX = e.touches[0].clientX;
        touchY = e.touches[0].clientY;
        shoot();
      }, { passive: true });
      canvas.addEventListener('touchmove', (e) => {
        if (!group.visible || !e.touches[0]) return;
        player.yaw -= (e.touches[0].clientX - touchX) * 0.007;
        player.pitch = THREE.MathUtils.clamp(player.pitch - (e.touches[0].clientY - touchY) * 0.004, -0.45, 0.45);
        touchWalk = THREE.MathUtils.clamp(-(e.touches[0].clientY - touchY) * 0.003, -0.08, 0.08);
        touchX = e.touches[0].clientX;
        touchY = e.touches[0].clientY;
      }, { passive: true });
      canvas.addEventListener('touchend', () => { touchWalk = 0; });
    },
    updateFirstPerson(keys, camera) {
      if (keys['KeyA'] || keys['ArrowLeft']) player.yaw += 0.035;
      if (keys['KeyD'] || keys['ArrowRight']) player.yaw -= 0.035;
      if (keys['KeyW'] || keys['ArrowUp']) walk(0.08);
      else if (keys['KeyS'] || keys['ArrowDown']) walk(-0.08);
      else if (touchWalk !== 0) walk(touchWalk);
      if (keys['Space'] || keys['KeyF']) shoot();

      camera.rotation.order = 'YXZ';
      camera.position.set(player.x, player.y, player.z);
      camera.rotation.set(player.pitch, player.yaw, 0);
      viewRig.position.copy(camera.position);
      viewRig.rotation.copy(camera.rotation);
    },
    update() {
      if (player.cooldown > 0) player.cooldown -= 1;
      player.recoil *= 0.78;
      flashMat.opacity *= 0.65;
      gun.position.z = -0.52 + player.recoil * 0.08;
      gun.rotation.x = player.recoil * 0.14;

      for (let i = tracers.length - 1; i >= 0; i--) {
        tracers[i].mesh.position.addScaledVector(tracers[i].dir, 0.85);
        if (--tracers[i].life <= 0) {
          group.remove(tracers[i].mesh);
          tracers.splice(i, 1);
        }
      }

      const pos = snow.geometry.attributes.position;
      for (let i = 0; i < snowCount; i++) {
        let y = pos.getY(i) - 0.03;
        if (y < -1.15) y = 6.5;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    },
  };
}
