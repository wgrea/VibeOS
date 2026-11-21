// aesthetics/lab/dj/index.js
import * as THREE from 'three';
import { createPads } from './pads.js';
import { createPlayer } from './player.js';

export function createKeyboard({ camera, domElement, box } = {}) {
  const group = new THREE.Group();

  const pads = createPads({ camera, domElement });
  pads.group.position.set(-1.35, 0, 0.15);
  group.add(pads.group);

  const player = createPlayer({ camera, domElement, box });
  player.group.position.set(1.45, 0, 0.15);
  player.group.scale.setScalar(0.88);
  group.add(player.group);

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #1e1b4b 0%, #0f172a 60%, #020617 100%)',
    description: 'DJ Keyboard & Tune Deck — Pick a track above, hit the 3D Play pad, and jam along using QWER / ASDF / ZXCV.',
    onSelect(isActive) {
      pads.onSelect?.(isActive);
      player.onSelect?.(isActive);
    },
    update(t, bounce, spring) {
      pads.update?.(t, bounce, spring);
      player.update?.(t, bounce, spring);
    }
  };
}
