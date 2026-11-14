import * as THREE from 'three';

export function createPlazaAvatar() {
  const group = new THREE.Group();

  const plazaMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    roughness: 0.15,
    clearcoat: 0.9,
  });

  // Clean White Plaza Disc
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.5, 0.1, 48), plazaMat);
  disc.position.y = -0.45;
  group.add(disc);

  // Toyetic Mii-Style Pawn Avatars
  const colors = [0x38bdf8, 0xfb7185, 0x4ade80, 0xfacc15, 0xc084fc];
  const avatars = [];

  colors.forEach((hex, i) => {
    const pawn = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: hex, roughness: 0.3 });

    const body = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.45, 20), mat);
    body.position.y = 0.22;

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 20), mat);
    head.position.y = 0.56;

    pawn.add(body, head);
    const angle = (i / colors.length) * Math.PI * 2;
    pawn.position.set(Math.cos(angle) * 0.85, -0.4, Math.sin(angle) * 0.85);
    group.add(pawn);

    avatars.push({ mesh: pawn, angle, phase: i * 1.2 });
  });

  return {
    group,
    background: 'radial-gradient(circle at 50% 25%, #ffffff 0%, #e0f2fe 55%, #bae6fd 100%)',
    update(t, bounce, spring) {
      avatars.forEach((a) => {
        const currentAngle = a.angle + t * 0.45;
        a.mesh.position.x = Math.cos(currentAngle) * 0.85;
        a.mesh.position.z = Math.sin(currentAngle) * 0.85;
        a.mesh.position.y = -0.4 + Math.abs(Math.sin(t * 3.5 + a.phase)) * 0.16;
      });
      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
