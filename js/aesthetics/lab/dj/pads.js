// aesthetics/lab/dj/pads.js
import * as THREE from 'three';

const PADS = [
  { note: 'C4', key: 'Q', freq: 261.63, color: '#38bdf8' },
  { note: 'D4', key: 'W', freq: 293.66, color: '#38bdf8' },
  { note: 'E4', key: 'E', freq: 329.63, color: '#38bdf8' },
  { note: 'F4', key: 'R', freq: 349.23, color: '#38bdf8' },
  { note: 'G4', key: 'A', freq: 392.00, color: '#818cf8' },
  { note: 'A4', key: 'S', freq: 440.00, color: '#818cf8' },
  { note: 'B4', key: 'D', freq: 493.88, color: '#818cf8' },
  { note: 'C5', key: 'F', freq: 523.25, color: '#818cf8' },
  { note: 'D5', key: 'Z', freq: 587.33, color: '#f472b6' },
  { note: 'E5', key: 'X', freq: 659.25, color: '#f472b6' },
  { note: 'G5', key: 'C', freq: 783.99, color: '#f472b6' },
  { note: 'A5', key: 'V', freq: 880.00, color: '#f472b6' }
];

function makePadTexture(keyLabel, noteLabel, accentHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 128, 128);

  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 116, 116);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 42px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(keyLabel, 64, 68);

  ctx.fillStyle = accentHex;
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(noteLabel, 64, 102);

  return new THREE.CanvasTexture(canvas);
}

export function createPads({ camera, domElement } = {}) {
  const group = new THREE.Group();
  const padMeshes = [];
  const padByShortcut = new Map();
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let isActiveEra = false;

  // 1. 3D Controller Chassis
  const chassis = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.22, 2.0),
    new THREE.MeshPhysicalMaterial({ color: 0x0f172a, roughness: 0.25, clearcoat: 0.85 })
  );
  group.add(chassis);

  // 2. 4x3 Grid of Clickable 3D Box Pads
  const cols = 4;
  const spacing = 0.55;
  const padGeo = new THREE.BoxGeometry(0.42, 0.14, 0.42);

  PADS.forEach((item, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    const sideMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      emissive: new THREE.Color(item.color),
      emissiveIntensity: 0.2,
      roughness: 0.3
    });
    const topMat = new THREE.MeshStandardMaterial({
      map: makePadTexture(item.key, item.note, item.color),
      emissive: new THREE.Color(item.color),
      emissiveIntensity: 0.15,
      roughness: 0.25
    });

    const mesh = new THREE.Mesh(padGeo, [sideMat, sideMat, topMat, sideMat, sideMat, sideMat]);
    mesh.position.set((col - 1.5) * spacing, 0.16, (row - 1) * spacing);
    mesh.userData = { ...item, baseY: mesh.position.y, topMat, sideMat };

    group.add(mesh);
    padMeshes.push(mesh);
    padByShortcut.set(item.key.toLowerCase(), mesh);
  });

  group.rotation.x = 0.42;

  function triggerPad(mesh) {
    if (!mesh) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = mesh.userData.freq;
    gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.32);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.32);

    mesh.position.y = mesh.userData.baseY - 0.05;
    mesh.userData.topMat.emissiveIntensity = 1.1;
    mesh.userData.sideMat.emissiveIntensity = 1.3;
    setTimeout(() => {
      mesh.position.y = mesh.userData.baseY;
      mesh.userData.topMat.emissiveIntensity = 0.15;
      mesh.userData.sideMat.emissiveIntensity = 0.2;
    }, 180);
  }

  // 3. Click Directly on 3D Pads
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  domElement?.addEventListener('pointerdown', (e) => {
    if (!isActiveEra) return;
    const rect = domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(padMeshes, false);
    if (hits.length > 0) {
      triggerPad(hits[0].object);
    }
  });

  // 4. Computer Keyboard Input (QWER / ASDF / ZXCV)
  window.addEventListener('keydown', (e) => {
    if (!isActiveEra || e.repeat || e.target.matches('input, textarea')) return;
    const mesh = padByShortcut.get(e.key.toLowerCase());
    if (mesh) triggerPad(mesh);
  });

  return {
    group,
    onSelect(isActive) {
      isActiveEra = isActive;
    },
    update(t, bounce, spring) {
      group.position.y = spring * 0.1;
    }
  };
}
