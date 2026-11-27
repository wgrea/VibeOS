// js/aesthetics/webcore/zine-risograph.js
import * as THREE from 'three';

export function createZineRisograph({ camera, domElement, box }) {
  const group = new THREE.Group();

  group.add(new THREE.AmbientLight(0xffffff, 0.95));

  // Misregistered halftone sheets
  const sheetMatA = new THREE.MeshBasicMaterial({
    color: 0xff3366, transparent: true, opacity: 0.7, side: THREE.DoubleSide,
  });
  const sheetMatB = new THREE.MeshBasicMaterial({
    color: 0x00aaff, transparent: true, opacity: 0.7, side: THREE.DoubleSide,
  });
  const s1 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2.6), sheetMatA);
  s1.position.set(-0.15, 1.5, 0);
  group.add(s1);
  const s2 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2.6), sheetMatB);
  s2.position.set(0.15, 1.45, 0.02);
  group.add(s2);

  // Masking tape strip
  const tape = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 0.25),
    new THREE.MeshBasicMaterial({ color: 0xe8dcb8, transparent: true, opacity: 0.85 })
  );
  tape.position.set(0, 2.65, 0.03);
  tape.rotation.z = 0.15;
  group.add(tape);

  return {
    group,
    background: '#f2e9d8',
    description: 'Risograph misregistration, halftone overlaps, masking tape, hand-cut zine collage.',
    update(t) {
      s1.position.x = -0.15 + Math.sin(t * 1.0) * 0.02;
      s2.position.x = 0.15 + Math.cos(t * 1.0) * 0.02;
    }
  };
}