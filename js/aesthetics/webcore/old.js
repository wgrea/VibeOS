// js/aesthetics/webcore/old.js
import * as THREE from 'three';

export function createOldWeb({ camera, domElement, box }) {
  const group = new THREE.Group();

  group.add(new THREE.AmbientLight(0xffffff, 0.9));
  const light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(3, 5, 4);
  group.add(light);

  // Floating "Under Construction" panels
  const panelMat = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
  for (let i = 0; i < 6; i++) {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.9), panelMat);
    panel.position.set(
      (i - 2.5) * 1.8,
      1 + Math.random(),
      -1 - Math.random() * 4
    );
    panel.rotation.y = (Math.random() - 0.5) * 0.6;
    group.add(panel);
  }

  // Spinning MIDI icon (torus)
  const midi = new THREE.Mesh(
    new THREE.TorusGeometry(0.6, 0.18, 12, 24),
    new THREE.MeshStandardMaterial({ color: 0xff00ff, metalness: 0.5, roughness: 0.4 })
  );
  midi.position.set(0, 2, 0);
  group.add(midi);

  // Classic tiled floor
  const tiles = new THREE.GridHelper(20, 20, 0x00ffff, 0x0080ff);
  group.add(tiles);

  return {
    group,
    background: '#000080',
    description: 'Old Web / Geocities (1995–2008): navy backgrounds, spinning MIDI icons, "Under Construction" GIFs.',
    update(t) {
      midi.rotation.y = t * 0.8;
      midi.rotation.x = t * 0.2;
    }
  };
}