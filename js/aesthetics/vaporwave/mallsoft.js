import * as THREE from 'three';

export function createMallsoft() {
  const group = new THREE.Group();

  // 1. Glossy Pastel Checkerboard Mall Atrium Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 18),
    new THREE.MeshStandardMaterial({ color: 0xfce7f3, roughness: 0.25 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.2;
  group.add(floor);

  const tileGrid = new THREE.GridHelper(18, 18, 0x2dd4bf, 0xf472b6);
  tileGrid.position.y = -1.19;
  group.add(tileGrid);

  // 2. Central Tiered Mall Fountain with Turquoise Water
  const fountain = new THREE.Group();
  const marbleMat = new THREE.MeshStandardMaterial({ color: 0xfdf2f8, roughness: 0.3 });
  const waterMat = new THREE.MeshPhysicalMaterial({
    color: 0x22d3ee, transparent: true, opacity: 0.8, roughness: 0.05, clearcoat: 1.0
  });

  const basin = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.85, 0.45, 24), marbleMat);
  basin.position.y = -0.98;
  fountain.add(basin);

  const basinWater = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.47, 24), waterMat);
  basinWater.position.y = -0.97;
  fountain.add(basinWater);

  const upperTier = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 0.25, 24), marbleMat);
  upperTier.position.y = -0.25;
  fountain.add(upperTier);

  const centerPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 1.3, 16), marbleMat);
  centerPillar.position.y = -0.55;
  fountain.add(centerPillar);

  fountain.position.set(0, 0, -2.5);
  group.add(fountain);

  // 3. Mall Colonade Pillars & Potted Indoor Palms
  const pillarGeo = new THREE.CylinderGeometry(0.28, 0.32, 4.2, 16);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.5 });

  [[-4.2, -1], [4.2, -1], [-4.2, -5.5], [4.2, -5.5]].forEach(([x, z]) => {
    const pillar = new THREE.Mesh(pillarGeo, marbleMat);
    pillar.position.set(x, 0.9, z);
    group.add(pillar);

    const palm = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.2, 8), trunkMat);
    trunk.position.y = -0.6;
    palm.add(trunk);

    for (let i = 0; i < 5; i++) {
      const frond = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.9, 5), leafMat);
      frond.position.y = 0.05;
      frond.rotation.z = 0.85;
      frond.rotation.y = (i / 5) * Math.PI * 2;
      palm.add(frond);
    }
    palm.position.set(x * 0.78, 0, z + 0.6);
    group.add(palm);
  });

  // First-person player state (yaw = left/right look, pitch = subtle up/down look)
  const player = { x: 0, y: 0.15, z: 4.5, yaw: 0, pitch: 0 };
  let touchStartX = 0;
  let touchStartY = 0;
  let touchWalkSpeed = 0;

  function moveForward(amount) {
    const nextX = player.x - Math.sin(player.yaw) * amount;
    const nextZ = player.z - Math.cos(player.yaw) * amount;
    player.x = THREE.MathUtils.clamp(nextX, -7.2, 7.2);
    player.z = THREE.MathUtils.clamp(nextZ, -7.2, 7.2);
  }

  return {
    group,
    isFirstPerson: true,
    background: 'linear-gradient(180deg, #f9a8d4 0%, #fbcfe8 50%, #99f6e4 100%)',
    resetCamera(camera) {
      player.x = 0;
      player.y = 0.15;
      player.z = 4.5;
      player.yaw = 0;
      player.pitch = 0;
      camera.rotation.order = 'YXZ'; // Prevents camera tilt when looking left/right + up/down
      camera.position.set(player.x, player.y, player.z);
      camera.rotation.set(0, 0, 0);
    },
    attachMobileControls(canvas) {
      canvas.addEventListener('touchstart', (e) => {
        if (!group.visible || e.touches.length === 0) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchWalkSpeed = 0;
      }, { passive: true });

      canvas.addEventListener('touchmove', (e) => {
        if (!group.visible || e.touches.length === 0) return;
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;

        // Horizontal finger drag rotates camera left/right
        player.yaw -= dx * 0.007;

        // Vertical finger drag tilts look slightly & walks forward/backward
        player.pitch = THREE.MathUtils.clamp(player.pitch - dy * 0.004, -0.45, 0.45);
        touchWalkSpeed = THREE.MathUtils.clamp(-dy * 0.003, -0.08, 0.08);

        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      canvas.addEventListener('touchend', () => {
        touchWalkSpeed = 0;
      });
    },
    updateFirstPerson(keys, camera) {
      const turnSpeed = 0.035;
      const moveSpeed = 0.075;

      // Desktop Keyboard Controls
      if (keys['KeyA'] || keys['ArrowLeft']) player.yaw += turnSpeed;
      if (keys['KeyD'] || keys['ArrowRight']) player.yaw -= turnSpeed;

      let forward = 0;
      if (keys['KeyW'] || keys['ArrowUp']) forward += 1;
      if (keys['KeyS'] || keys['ArrowDown']) forward -= 1;

      if (forward !== 0) {
        moveForward(forward * moveSpeed);
      } else if (touchWalkSpeed !== 0) {
        moveForward(touchWalkSpeed);
      }

      camera.rotation.order = 'YXZ';
      camera.position.set(player.x, player.y, player.z);
      camera.rotation.set(player.pitch, player.yaw, 0);
    },
    update(t) {
      basinWater.position.y = -0.97 + Math.sin(t * 2.5) * 0.015;
    }
  };
}
