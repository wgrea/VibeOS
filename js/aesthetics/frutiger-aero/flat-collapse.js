import * as THREE from 'three';

export function createFlatCollapse() {
  const group = new THREE.Group();

  // Paper-thin, unlit 2D pastel UI tiles (Zero shadows, zero gloss, zero Z-depth)
  const cards = [
    { w: 2.8, h: 1.8, color: 0xffffff, x: 0,    y: 0,     z: 0.00 },
    { w: 2.8, h: 0.34, color: 0x38bdf8, x: 0,   y: 0.73,  z: 0.01 },
    { w: 1.1, h: 0.55, color: 0xf472b6, x: -0.65, y: -0.25, z: 0.01 },
    { w: 1.1, h: 0.55, color: 0x34d399, x: 0.65,  y: -0.25, z: 0.01 }
  ];

  cards.forEach((c) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(c.w, c.h),
      new THREE.MeshBasicMaterial({ color: c.color }) // Completely unlit flat color
    );
    mesh.position.set(c.x, c.y, c.z);
    group.add(mesh);
  });

  return {
    group,
    background: '#f1f5f9', // Stark, matte off-white flat background
    update(t, bounce, spring) {
      // Rigid, zero-depth 2D snap when clicked (no 3D tilt or jelly physics)
      group.rotation.set(0, 0, 0);
      group.scale.setScalar(1 - bounce * 0.12);
    }
  };
}
