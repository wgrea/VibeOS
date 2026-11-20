// js/stage.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createStage(containerId) {
  const box = document.getElementById(containerId);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, (box.clientWidth || 600) / (box.clientHeight || 340), 0.1, 100);
  camera.position.set(0, 1.4, 6.2);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(box.clientWidth || 600, box.clientHeight || 340);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.touchAction = 'none'; // Prevents mobile page scroll during finger drag
  box.innerHTML = '';
  box.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false;

  scene.add(new THREE.AmbientLight(0xffffff, 1.3));
  const sun = new THREE.DirectionalLight(0xffffff, 2.5);
  sun.position.set(3, 6, 5);
  scene.add(sun);

  // ==========================================
  // 1. KEYBOARD INPUT (WASD & ARROW KEYS)
  // ==========================================
  const keys = {};
  window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault(); // Stops page from scrolling when pressing arrow keys
    }
    keys[e.code] = true;
  });
  window.addEventListener('keyup', (e) => { keys[e.code] = false; });

  // ==========================================
  // 2. MOBILE TOUCH & POINTER FLOOR DRAG
  // ==========================================
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hitPoint = new THREE.Vector3();
  const movables = [];
  let activeDrag = null;

  function updatePointer(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
  }

  renderer.domElement.addEventListener('pointerdown', (e) => {
    updatePointer(e);
    const visibleItems = movables.filter((obj) => obj.parent?.visible !== false);
    const hits = raycaster.intersectObjects(visibleItems, true);
    if (hits.length > 0) {
      let target = hits[0].object;
      while (target.parent && !movables.includes(target)) target = target.parent;
      activeDrag = target;
      floorPlane.constant = -activeDrag.position.y;
      controls.enabled = false;
    }
  });

  window.addEventListener('pointermove', (e) => {
    if (!activeDrag) return;
    updatePointer(e);
    if (raycaster.ray.intersectPlane(floorPlane, hitPoint)) {
      activeDrag.position.x = THREE.MathUtils.clamp(hitPoint.x, -3.5, 3.5);
      activeDrag.position.z = THREE.MathUtils.clamp(hitPoint.z, -2.5, 2.5);
    }
  });

  window.addEventListener('pointerup', () => {
    if (!activeDrag) return;
    activeDrag = null;
    controls.enabled = true;
  });

  function makeMovable(object3D) {
    movables.push(object3D);
  }

  // Call this inside animate() to move whichever object is visible on screen
  function updateMovement() {
    const target = movables.find((obj) => obj.parent?.visible !== false);
    if (!target || activeDrag) return;

    let moveX = 0;
    let moveZ = 0;
    if (keys['ArrowLeft'] || keys['KeyA']) moveX -= 1;
    if (keys['ArrowRight'] || keys['KeyD']) moveX += 1;
    if (keys['ArrowUp'] || keys['KeyW']) moveZ -= 1;
    if (keys['ArrowDown'] || keys['KeyS']) moveZ += 1;

    if (moveX !== 0 || moveZ !== 0) {
      const speed = 0.065;
      target.position.x = THREE.MathUtils.clamp(target.position.x + moveX * speed, -3.5, 3.5);
      target.position.z = THREE.MathUtils.clamp(target.position.z + moveZ * speed, -2.5, 2.5);
      // Smoothly turn statue/flamingo to face movement direction
      const targetAngle = Math.atan2(moveX, moveZ);
      target.rotation.y += (targetAngle - target.rotation.y) * 0.15;
    }
  }

  window.addEventListener('resize', () => {
    if (!box.clientWidth) return;
    camera.aspect = box.clientWidth / box.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(box.clientWidth, box.clientHeight);
  });

    return { box, scene, camera, renderer, controls, makeMovable, updateMovement, keys };
}
