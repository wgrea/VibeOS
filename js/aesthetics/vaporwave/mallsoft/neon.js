import * as THREE from 'three';

export function createNeon() {
  const neonSigns = new THREE.Group();

  // Each entry is a neon element: position, color, geometry, and a phase
  // so the flickers don't sync. `kind` is 'strip' (vertical on a pillar),
  // 'bar' (horizontal on a balcony), or 'ring' (torus around a feature).
  const elements = [];

  // ---------- Pillar strips ----------
  // Vertical strips on the inner faces of the four colonnade pillars.
  // Colors rotate through pink / teal / violet / yellow.
  const pillarColors = [0xf472b6, 0x2dd4bf, 0xa78bfa, 0xfbbf24];
  const pillarPositions = [
    { x: -3.9, z: -1.0, ry:  0 },
    { x:  3.9, z: -1.0, ry:  0 },
    { x: -3.9, z: -5.5, ry:  0 },
    { x:  3.9, z: -5.5, ry:  0 },
  ];
  pillarPositions.forEach(({ x, z }, i) => {
    const color = pillarColors[i % pillarColors.length];
    const mat = new THREE.MeshBasicMaterial({ color });
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 1.6, 0.04),
      mat
    );
    strip.position.set(x, 1.6, z);
    neonSigns.add(strip);
    elements.push({ mesh: strip, mat, phase: i * 1.7, kind: 'strip' });
  });

  // ---------- Balcony bars ----------
  // Horizontal bars along the lower mezzanine fascia. These read as the
  // "outline" of the second floor and give the atrium a second neon layer.
  const balconySegments = [
    { w: 12.5, x: 0, z: -6.8, ry: 0 },
    { w: 12.5, x: -6.2, z: -0.6, ry: Math.PI / 2 },
    { w: 12.5, x: 6.2, z: -0.6, ry: Math.PI / 2 },
  ];
  balconySegments.forEach(({ w, x, z, ry }, i) => {
    const color = i % 2 === 0 ? 0x2dd4bf : 0xf472b6;
    const mat = new THREE.MeshBasicMaterial({ color });
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(w, 0.04, 0.04),
      mat
    );
    bar.position.set(x, 2.25, z);
    bar.rotation.y = ry;
    neonSigns.add(bar);
    elements.push({ mesh: bar, mat, phase: i * 2.3 + 0.5, kind: 'bar' });
  });

  // ---------- Ceiling ring above the fountain ----------
  // A thin torus hanging above the fountain. Gives the eye something to
  // follow up from the fountain to the ceiling, reinforcing the height.
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xa7f3d0 });
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.4, 0.03, 8, 48),
    ringMat
  );
  ring.position.set(0, 3.8, -2.5);
  ring.rotation.x = Math.PI / 2;
  neonSigns.add(ring);
  elements.push({ mesh: ring, mat: ringMat, phase: 3.1, kind: 'ring' });

  return {
    group: neonSigns,
    update(t) {
      // Neon flicker: each element gets a pseudo-random dropout pattern
      // based on its phase. Occasional sharp dimmings read as real neon;
      // a smooth sine pulse does not.
      for (const { mat, phase, kind } of elements) {
        // Base brightness is the sine, but with a sharp threshold so the
        // element spends most of its time bright and occasionally dips.
        const s = Math.sin(t * 4.0 + phase) * 0.5 + 0.5;
        const flicker = s > 0.92 ? 0.35 : 1.0;
        // Slight persistent shimmer even when "on"
        const shimmer = 0.9 + Math.sin(t * 12.0 + phase * 3.0) * 0.08;
        const intensity = flicker * shimmer;

        // Apply as a lightness scaling on the base color. We re-set from a
        // stored base so repeated frames don't accumulate.
        if (!mat.userData.baseColor) {
          mat.userData.baseColor = mat.color.clone();
        }
        mat.color.copy(mat.userData.baseColor);
        mat.color.multiplyScalar(intensity);
      }
    },
  };
}