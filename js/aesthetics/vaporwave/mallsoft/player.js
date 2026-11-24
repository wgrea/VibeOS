import * as THREE from 'three';

// Camera eye height. Lower than a standing adult (~1.6) so the space reads
// a little taller; tunable in one place.
const EYE_HEIGHT = 1.4;

// Where the player starts / resets to. Kept together so reset() and the
// initial state can't drift apart.
const SPAWN = { x: 0, z: 6 };

// Movement clamp. The atrium walls sit at x/z = ±8.9; this keeps the player
// close enough to the walls to look up at them without clipping through.
const BOUND = 8.2;

// Walking speed per frame at 60fps. Slower than the previous 0.075 so the
// mall feels like it takes longer to cross.
const MOVE_SPEED = 0.055;

// Turn speed for arrow-key look. Mouse/touch drag uses its own factor.
const TURN_SPEED = 0.035;

export function createPlayer() {
  const player = {
    x: SPAWN.x,
    y: EYE_HEIGHT,
    z: SPAWN.z,
    yaw: 0,
    pitch: 0,
  };

  let isDragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let pointerTarget = null;
  let pointerBound = false;

  function applyLookDelta(dx, dy) {
    player.yaw -= dx * 0.005;
    player.pitch = THREE.MathUtils.clamp(
      player.pitch - dy * 0.004,
      -1.0,
      1.0
    );
  }

  function onPointerDown(e) {
    isDragging = true;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    if (e.pointerId !== undefined && e.target && e.target.setPointerCapture) {
      try {
        e.target.setPointerCapture(e.pointerId);
      } catch (_) {
        /* setPointerCapture can throw on some browsers; safe to ignore */
      }
    }
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - lastPointerX;
    const dy = e.clientY - lastPointerY;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    applyLookDelta(dx, dy);
  }

  function onPointerUp() {
    isDragging = false;
  }

  function bindLookControls(canvas) {
    if (!canvas || pointerBound) return;
    pointerTarget = canvas;
    pointerBound = true;
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);
  }

  function unbindLookControls() {
    if (!pointerTarget || !pointerBound) return;
    pointerTarget.removeEventListener('pointerdown', onPointerDown);
    pointerTarget.removeEventListener('pointermove', onPointerMove);
    pointerTarget.removeEventListener('pointerup', onPointerUp);
    pointerTarget.removeEventListener('pointercancel', onPointerUp);
    pointerTarget.removeEventListener('pointerleave', onPointerUp);
    pointerBound = false;
    pointerTarget = null;
    isDragging = false;
  }

  function moveForward(amount) {
    const nextX = player.x - Math.sin(player.yaw) * amount;
    const nextZ = player.z - Math.cos(player.yaw) * amount;
    player.x = THREE.MathUtils.clamp(nextX, -BOUND, BOUND);
    player.z = THREE.MathUtils.clamp(nextZ, -BOUND, BOUND);
  }

  function strafeRight(amount) {
    const rightX = Math.cos(player.yaw);
    const rightZ = -Math.sin(player.yaw);
    const nextX = player.x + rightX * amount;
    const nextZ = player.z + rightZ * amount;
    player.x = THREE.MathUtils.clamp(nextX, -BOUND, BOUND);
    player.z = THREE.MathUtils.clamp(nextZ, -BOUND, BOUND);
  }

  return {
    player,
    bindLookControls,
    unbindLookControls,

    reset() {
      player.x = SPAWN.x;
      player.y = EYE_HEIGHT;
      player.z = SPAWN.z;
      player.yaw = 0;
      player.pitch = 0;
    },

    updateFirstPerson(keys, camera) {
      // Arrow keys look around.
      if (keys['ArrowLeft']) player.yaw += TURN_SPEED;
      if (keys['ArrowRight']) player.yaw -= TURN_SPEED;
      if (keys['ArrowUp']) {
        player.pitch = THREE.MathUtils.clamp(
          player.pitch + 0.02,
          -1.0,
          1.0
        );
      }
      if (keys['ArrowDown']) {
        player.pitch = THREE.MathUtils.clamp(
          player.pitch - 0.02,
          -1.0,
          1.0
        );
      }

      // WASD moves (W/S forward/back, A/D strafe).
      if (keys['KeyW']) moveForward(MOVE_SPEED);
      if (keys['KeyS']) moveForward(-MOVE_SPEED);
      if (keys['KeyA']) strafeRight(-MOVE_SPEED);
      if (keys['KeyD']) strafeRight(MOVE_SPEED);

      camera.rotation.order = 'YXZ';
      camera.position.set(player.x, player.y, player.z);
      camera.rotation.set(player.pitch, player.yaw, 0);
    },
  };
}