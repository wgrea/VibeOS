import * as THREE from 'three';
import { createMaterials } from './materials.js';
import { buildTracks } from './track.js';
import { buildVillage } from './village.js';
import { buildConsists } from './consists.js';
import { createSteamPuffs } from './steamPuffs.js';
import { setupInput } from './input.js';
import { createAnimationLoop } from './animation.js';

export function createToyurism(options = {}) {
  const group = new THREE.Group();
  const materials = createMaterials();

  // 1. Track table + three rings
  group.add(buildTracks(materials));

  // 2. Sodor Village station (inside inner loop)
  group.add(buildVillage(materials));

  // 3. Trains + hit-boxes
  const { tracksData, clickableMeshes, steamAnchors } = buildConsists(materials);

  // 4. Steam puffs
  const steamPuffs = createSteamPuffs(materials, tracksData, steamAnchors);

  tracksData.forEach((trackInfo) => group.add(trackInfo.pivot));

  // 5. Shared mutable state between input + animation
  const state = {
    selectedTrack: 0,
    keysPressed: {},
  };

  // 6. Input listeners
  const input = setupInput({ group, tracksData, clickableMeshes, options, state });

  // 7. Per-frame update
  const update = createAnimationLoop({ group, tracksData, steamPuffs, state });

  return {
    group,
    description:
      'Step into a wooden railway play table—click or tap any blue, red, or green train to start or stop its cruise, and use A/D or Left/Right arrow keys to drive the active train forward or in reverse.',
    background:
      'linear-gradient(180deg, #7dd3fc 0%, #bae6fd 52%, #4ade80 53%, #16a34a 100%)',
    dispose() {
      input.dispose();
    },
    update,
  };
}