import * as THREE from 'three';

export function createLateNightLofi() {
  const group = new THREE.Group();

  // Midnight Rainy Window Frame
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x1e1b4b,
    roughness: 0.4,
    metalness: 0.5,
  });
  const frame = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.5, 0.14), frameMat);
  group.add(frame);

  // Warm Glowing City Window Pane
  const pane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.88, 1.28),
    new THREE.MeshStandardMaterial({
      color: 0x312e81,
      emissive: 0x4338ca,
      emissiveIntensity: 0.65,
      roughness: 0.15,
    })
  );
  pane.position.z = 0.08;
  group.add(pane);

  // Warm Neon Moon / Streetlamp Glow
  const moon = new THREE.Mesh(
    new THREE.CircleGeometry(0.32, 32),
    new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
  );
  moon.position.set(0.45, 0.25, 0.09);
  group.add(moon);

  // Falling Neon Raindrops
  const drops = [];
  const dropGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.22, 8);
  const dropMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 });

  for (let i = 0; i < 22; i++) {
    const drop = new THREE.Mesh(dropGeo, dropMat);
    drop.position.set(
      (Math.random() - 0.5) * 2.4,
      (Math.random() - 0.5) * 2.0,
      0.22 + Math.random() * 0.3
    );
    drop.rotation.z = -0.15;
    group.add(drop);
    drops.push({ mesh: drop, speed: 1.4 + Math.random() * 1.1 });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #312e81 0%, #1e1b4b 60%, #090d16 100%)',
    update(t, bounce, spring) {
      group.rotation.y = Math.sin(t * 0.5) * 0.18;

      drops.forEach((d) => {
        d.mesh.position.y -= d.speed * 0.025;
        if (d.mesh.position.y < -1.1) {
          d.mesh.position.y = 1.1;
        }
      });

      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
