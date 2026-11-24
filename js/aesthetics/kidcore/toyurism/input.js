import * as THREE from 'three';

export function setupInput({ group, tracksData, clickableMeshes, options, state }) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const targetElement =
    options.domElement || document.querySelector('canvas') || window;
  const activeCamera = options.camera || null;

  function toggleTrainCruise(trackIdx) {
    const trackInfo = tracksData[trackIdx];
    if (!trackInfo) return;
    state.selectedTrack = trackIdx;
    trackInfo.tapBounce = 0.055;

    if (Math.abs(trackInfo.velocity) > 0.1) {
      trackInfo.velocity = 0;
    } else {
      trackInfo.velocity = 0.85;
    }
  }

  function handlePointerDown(e) {
    if (!group.visible || !activeCamera) return;

    const rect = targetElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    group.updateWorldMatrix(true, true);
    activeCamera.updateMatrixWorld();
    raycaster.setFromCamera(pointer, activeCamera);

    const hits = raycaster.intersectObjects(clickableMeshes, false);
    if (hits.length > 0) {
      const hitTrack = hits[0].object.userData.trackIndex;
      if (typeof hitTrack === 'number') {
        toggleTrainCruise(hitTrack);
      }
    }
  }

  const onKeyDown = (e) => {
    const k = e.key.toLowerCase();
    if (['a', 'd', 'arrowleft', 'arrowright'].includes(k)) {
      state.keysPressed[k] = true;
    }
  };
  const onKeyUp = (e) => {
    const k = e.key.toLowerCase();
    state.keysPressed[k] = false;
  };

  targetElement.addEventListener('pointerdown', handlePointerDown);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  return {
    dispose() {
      targetElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    },
  };
}