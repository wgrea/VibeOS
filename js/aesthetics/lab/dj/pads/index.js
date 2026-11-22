// aesthetics/lab/dj/pads/index.js
// 3D Keyboard & Input Handler
import * as THREE from 'three';
import { RETRO_ERA } from './retro.js';
import { MODERN_ERA } from './modern.js';
import { createSynthEngine } from './synth/index.js';

const LEFT_KEYS = ['Q', 'W', 'E', 'R', 'A', 'S', 'D', 'F', 'Z', 'X', 'C', 'V'];
const CENTER_KEYS = ['T', 'Y', 'G', 'H', 'B', 'N'];
const RIGHT_KEYS = ['U', 'I', 'O', 'P', 'J', 'K', 'L', ';', 'M', ',', '.', '/'];

const KEYBOARD_ROWS = [
  { keys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'], offsetX: 0 },
  { keys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'], offsetX: 0.14 },
  { keys: ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'], offsetX: 0.28 }
];

const ERAS = [RETRO_ERA, MODERN_ERA];

function makeKeyTexture(keyLabel, noteLabel, accentHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 128, 128);

  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 7;
  ctx.strokeRect(5, 5, 118, 118);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 46px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(keyLabel, 64, 66);

  ctx.fillStyle = accentHex;
  ctx.font = 'bold 20px monospace';
  ctx.fillText(noteLabel, 64, 104);

  return new THREE.CanvasTexture(canvas);
}

function makeSelectorTexture(label, accentHex, isActive) {
  const canvas = document.createElement('canvas');
  canvas.width = 144;
  canvas.height = 48;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = isActive ? accentHex : '#0f172a';
  ctx.fillRect(0, 0, 144, 48);

  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, 140, 44);

  ctx.fillStyle = isActive ? '#020617' : '#f8fafc';
  ctx.font = 'bold 17px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 72, 25);

  return new THREE.CanvasTexture(canvas);
}

export function createPads({ camera, domElement } = {}) {
  const controller = new AbortController();
  const { signal } = controller;
  const synth = createSynthEngine();

  const group = new THREE.Group();
  const keyMeshes = [];
  const keyMeshMap = new Map();
  const selectorMeshes = [];
  const activeNotes = new Map();
  let isActiveEra = false;
  let eraIdx = 0;
  let leftBankIdx = 0;
  let rightBankIdx = 0;

  function activeEra() {
    return ERAS.at(eraIdx);
  }

  function getKeyBinding(keyChar) {
    const era = activeEra();

    const leftIdx = LEFT_KEYS.indexOf(keyChar);
    if (leftIdx !== -1) {
      const bank = era.leftBanks.at(leftBankIdx);
      return { pad: bank.pads.at(leftIdx), color: bank.color };
    }

    const rightIdx = RIGHT_KEYS.indexOf(keyChar);
    if (rightIdx !== -1) {
      const bank = era.rightBanks.at(rightBankIdx);
      return { pad: bank.pads.at(rightIdx), color: bank.color };
    }

    const centerIdx = CENTER_KEYS.indexOf(keyChar);
    if (centerIdx !== -1) {
      return { pad: era.centerPads.pads.at(centerIdx), color: era.centerPads.color };
    }

    return null;
  }

  // 1. Wide 3D Concert Keyboard Chassis
  const chassis = new THREE.Mesh(
    new THREE.BoxGeometry(4.65, 0.22, 1.98),
    new THREE.MeshPhysicalMaterial({
      color: 0x090d16,
      roughness: 0.22,
      clearcoat: 0.9
    })
  );
  group.add(chassis);

  // 2. Top Control Bar: [1-4 Left Hand] + [5-0 Right Hand] + [= : RETRO/MODERN]
  const selGeo = new THREE.BoxGeometry(0.37, 0.12, 0.24);
  const eraGeo = new THREE.BoxGeometry(0.56, 0.13, 0.24);

  for (let i = 0; i < 4; i++) {
    const bank = activeEra().leftBanks.at(i);
    const mat = new THREE.MeshStandardMaterial({
      map: makeSelectorTexture(`${bank.key}:${bank.name}`, bank.color, i === 0),
      emissive: new THREE.Color(bank.color),
      emissiveIntensity: i === 0 ? 0.5 : 0.1
    });
    const btn = new THREE.Mesh(selGeo, mat);
    btn.position.set((i - 5.2) * 0.39, 0.15, -0.73);
    btn.userData = { kind: 'left', idx: i, mat };
    group.add(btn);
    selectorMeshes.push(btn);
  }

  for (let i = 0; i < 6; i++) {
    const bank = activeEra().rightBanks.at(i);
    const mat = new THREE.MeshStandardMaterial({
      map: makeSelectorTexture(`${bank.key}:${bank.name}`, bank.color, i === 0),
      emissive: new THREE.Color(bank.color),
      emissiveIntensity: i === 0 ? 0.5 : 0.1
    });
    const btn = new THREE.Mesh(selGeo, mat);
    btn.position.set((i - 1.0) * 0.39, 0.15, -0.73);
    btn.userData = { kind: 'right', idx: i, mat };
    group.add(btn);
    selectorMeshes.push(btn);
  }

  const eraMat = new THREE.MeshStandardMaterial({
    map: makeSelectorTexture(`=:${activeEra().label}`, activeEra().badgeColor, true),
    emissive: new THREE.Color(activeEra().badgeColor),
    emissiveIntensity: 0.6
  });
  const eraBtn = new THREE.Mesh(eraGeo, eraMat);
  eraBtn.position.set(1.98, 0.155, -0.73);
  eraBtn.userData = { kind: 'era', mat: eraMat };
  group.add(eraBtn);
  selectorMeshes.push(eraBtn);

  // 3. Build All 30 Physical 3D Keys Across 3 Staggered QWERTY Rows
  const keySpacingX = 0.41;
  const rowSpacingZ = 0.4;
  const keyGeo = new THREE.BoxGeometry(0.36, 0.13, 0.35);

  KEYBOARD_ROWS.forEach((rowObj, rowIdx) => {
    rowObj.keys.forEach((keyChar, colIdx) => {
      const binding = getKeyBinding(keyChar);
      const sideMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        emissive: new THREE.Color(binding.color),
        emissiveIntensity: 0.18,
        roughness: 0.3
      });
      const topMat = new THREE.MeshStandardMaterial({
        map: makeKeyTexture(keyChar, binding.pad.note, binding.color),
        emissive: new THREE.Color(binding.color),
        emissiveIntensity: 0.15,
        roughness: 0.25
      });

      const materials = Array.of(sideMat, sideMat, topMat, sideMat, sideMat, sideMat);
      const mesh = new THREE.Mesh(keyGeo, materials);
      const xPos = (colIdx - 4.5) * keySpacingX + rowObj.offsetX - 0.12;
      const zPos = (rowIdx - 0.75) * rowSpacingZ;
      mesh.position.set(xPos, 0.16, zPos);
      mesh.userData = {
        keyChar,
        baseY: mesh.position.y,
        topMat,
        sideMat
      };

      group.add(mesh);
      keyMeshes.push(mesh);
      keyMeshMap.set(keyChar, mesh);
    });
  });

  function refreshBoard() {
    const era = activeEra();

    selectorMeshes.forEach((btn) => {
      if (btn.userData.kind === 'era') {
        if (btn.userData.mat.map) btn.userData.mat.map.dispose();
        btn.userData.mat.map = makeSelectorTexture(`=:${era.label}`, era.badgeColor, true);
        btn.userData.mat.needsUpdate = true;
        btn.userData.mat.emissive.set(era.badgeColor);
        return;
      }

      const isLeft = btn.userData.kind === 'left';
      const bank = isLeft ? era.leftBanks.at(btn.userData.idx) : era.rightBanks.at(btn.userData.idx);
      const active = isLeft ? btn.userData.idx === leftBankIdx : btn.userData.idx === rightBankIdx;

      if (btn.userData.mat.map) btn.userData.mat.map.dispose();
      btn.userData.mat.map = makeSelectorTexture(`${bank.key}:${bank.name}`, bank.color, active);
      btn.userData.mat.needsUpdate = true;
      btn.userData.mat.emissive.set(bank.color);
      btn.userData.mat.emissiveIntensity = active ? 0.5 : 0.1;
    });

    keyMeshes.forEach((mesh) => {
      const binding = getKeyBinding(mesh.userData.keyChar);
      if (!binding) return;
      if (mesh.userData.topMat.map) mesh.userData.topMat.map.dispose();
      mesh.userData.topMat.map = makeKeyTexture(mesh.userData.keyChar, binding.pad.note, binding.color);
      mesh.userData.topMat.needsUpdate = true;
      mesh.userData.topMat.emissive.set(binding.color);
      mesh.userData.sideMat.emissive.set(binding.color);
    });
  }

  function pressKey(keyChar) {
    if (activeNotes.has(keyChar)) return;
    const binding = getKeyBinding(keyChar);
    const mesh = keyMeshMap.get(keyChar);
    if (!binding || !mesh) return;

    const releaseFn = synth.startNote(binding.pad);
    activeNotes.set(keyChar, releaseFn);

    mesh.position.y = mesh.userData.baseY - 0.05;
    mesh.userData.topMat.emissiveIntensity = 1.25;
    mesh.userData.sideMat.emissiveIntensity = 1.45;
  }

  function releaseKey(keyChar) {
    const releaseFn = activeNotes.get(keyChar);
    if (!releaseFn) return;

    releaseFn();
    activeNotes.delete(keyChar);

    const mesh = keyMeshMap.get(keyChar);
    if (mesh) {
      mesh.position.y = mesh.userData.baseY;
      mesh.userData.topMat.emissiveIntensity = 0.15;
      mesh.userData.sideMat.emissiveIntensity = 0.18;
    }
  }

  function releaseAllKeys() {
    Array.from(activeNotes.keys()).forEach(releaseKey);
  }

  group.rotation.x = 0.42;

  // 4. Hold & Release Directly on 3D Keys with Mouse / Touch
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let pointerHeldKey = null;

  domElement?.addEventListener('pointerdown', (e) => {
    if (!isActiveEra) return;
    const rect = domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const selHits = raycaster.intersectObjects(selectorMeshes, false);
    if (selHits.length > 0) {
      const { kind, idx } = selHits.at(0).object.userData;
      if (kind === 'era') eraIdx = (eraIdx + 1) % ERAS.length;
      if (kind === 'left') leftBankIdx = idx;
      if (kind === 'right') rightBankIdx = idx;
      refreshBoard();
      return;
    }

    const keyHits = raycaster.intersectObjects(keyMeshes, false);
    if (keyHits.length > 0) {
      pointerHeldKey = keyHits.at(0).object.userData.keyChar;
      pressKey(pointerHeldKey);
    }
  }, { signal });

  window.addEventListener('pointerup', () => {
    if (pointerHeldKey) {
      releaseKey(pointerHeldKey);
      pointerHeldKey = null;
    }
  }, { signal });

  // 5. Physical Computer Keyboard Hold & Release (keydown + keyup)
const leftNumberKeys = ['1', '2', '3', '4'];
const rightNumberKeys = ['5', '6', '7', '8', '9', '0'];
window.addEventListener('keydown', (e) => {
if (!isActiveEra || e.repeat || e.target.matches('input, textarea, select')) return;
if (e.key === '=' || e.key === '+') {
eraIdx = (eraIdx + 1) % ERAS.length;
refreshBoard();
return;
}
const lIdx = leftNumberKeys.indexOf(e.key);
if (lIdx !== -1) {
leftBankIdx = lIdx;
refreshBoard();
return;
}
const rIdx = rightNumberKeys.indexOf(e.key);
if (rIdx !== -1) {
rightBankIdx = rIdx;
refreshBoard();
return;
}
const upper = e.key.toUpperCase();
if (keyMeshMap.has(upper)) {
pressKey(upper);
}
}, { signal });
window.addEventListener('keyup', (e) => {
const upper = e.key.toUpperCase();
if (activeNotes.has(upper)) {
releaseKey(upper);
}
}, { signal });
window.addEventListener('blur', releaseAllKeys, { signal });
// 6. Clean up on HTMX swap
function cleanup() {
releaseAllKeys();
controller.abort();
synth.close();
}
document.body.addEventListener('htmx:beforeSwap', cleanup, { signal });
window.addEventListener('pagehide', cleanup, { signal });
return {
group,
onSelect(isActive) {
isActiveEra = isActive;
if (!isActive) releaseAllKeys();
},
update(t, bounce, spring) {
group.position.y = spring * 0.1;
}
};
}