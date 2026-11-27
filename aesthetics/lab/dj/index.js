// aesthetics/lab/dj/index.js
// stage assembler
import * as THREE from 'three';
import { createPads } from './pads/index.js';
import { createPlayer } from './player.js';

export function createKeyboard({ camera, domElement, box } = {}) {
  const group = new THREE.Group();

  const pads = createPads({ camera, domElement });
  pads.group.position.set(-0.85, 0, 0.2);
  pads.group.scale.setScalar(0.82);
  group.add(pads.group);

  const player = createPlayer({ camera, domElement, box });
  player.group.position.set(1.85, 0, 0.2);
  player.group.scale.setScalar(0.8);
  group.add(player.group);

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #1e1b4b 0%, #0f172a 60%, #020617 100%)',
     description: 'Rave Concert Console — Play tracks on the right deck & perform across 30 keys. Press = to toggle RETRO / MODERN, 1–4 for Left Hand, 5–0 for Right Hand.',
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
