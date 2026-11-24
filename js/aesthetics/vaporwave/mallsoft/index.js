import * as THREE from 'three';
import { createAtrium } from './atrium.js';
import { createFountain } from './fountain.js';
import { createEscalator } from './escalator.js';
import { createStorefronts } from './storefronts.js';
import { createFoodCourt } from './foodcourt.js';
import { createNeon } from './neon.js';
import { createProps } from './props.js';
import { createSignage } from './signage.js';
import { createPlayer } from './player.js';

export function createMallsoft() {
  const group = new THREE.Group();

  // Fountain owns the shared marble material; atrium and props reuse it
  // so pillars, balconies, and fountain tiers all read as the same stone.
  const fountain = createFountain();
  const marbleMat = fountain.marbleMat;

  const pieces = [
    createAtrium(marbleMat),
    fountain,
    createEscalator(),
    createStorefronts(),
    createFoodCourt(),
    createNeon(),
    createProps(marbleMat),
    createSignage(),
  ];

  pieces.forEach((piece) => group.add(piece.group));

  const playerCtl = createPlayer();

  return {
    group,
    isFirstPerson: true,

    description:
      'Echoey 80s and 90s muzak drifting through pastel-pink indoor shopping atriums, turquoise fountains, neon mezzanines, a sealed skylight ceiling, and lonely artificial palm courts.',

    background:
      'linear-gradient(180deg, #f9a8d4 0%, #fbcfe8 50%, #99f6e4 100%)',

    resetCamera(camera) {
      playerCtl.reset();
      camera.rotation.order = 'YXZ';
      camera.position.set(
        playerCtl.player.x,
        playerCtl.player.y,
        playerCtl.player.z
      );
      camera.rotation.set(0, 0, 0);
    },

    attachMobileControls(canvas) {
      playerCtl.bindLookControls(canvas);
    },

    detachControls() {
      playerCtl.unbindLookControls();
    },

    updateFirstPerson(keys, camera) {
      playerCtl.updateFirstPerson(keys, camera);
    },

    update(t) {
      // Only pieces that expose an update get ticked. Static pieces
      // (storefronts, props, signage) are skipped automatically.
      pieces.forEach((piece) => {
        if (typeof piece.update === 'function') {
          piece.update(t);
        }
      });
    },

    dispose() {
      playerCtl.unbindLookControls();
      group.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            if (m.map) m.map.dispose();
            m.dispose();
          });
        }
      });
    },
  };
}