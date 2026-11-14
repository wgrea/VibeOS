import * as THREE from 'three';

export function createSimpsonswave() {
  const group = new THREE.Group();

  // Retro Curved CRT Television Casing
  const tvBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 1.35, 1.15),
    new THREE.MeshStandardMaterial({
      color: 0x3b2f4a,
      roughness: 0.45,
      metalness: 0.3,
    })
  );
  group.add(tvBody);

  // Nostalgic Sunset-Amber / VHS Purple CRT Screen
  const screen = new THREE.Mesh(
    new THREE.BoxGeometry(1.38, 1.02, 0.08),
    new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xd946ef,
      emissiveIntensity: 0.85,
      roughness: 0.1,
    })
  );
  screen.position.set(-0.08, 0.02, 0.56);
  group.add(screen);

  // VHS Scanline Bars across Screen
  const scanlines = [];
  for (let i = 0; i < 5; i++) {
    const line = new THREE.Mesh(
      new THREE.PlaneGeometry(1.34, 0.04),
      new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.55 })
    );
    line.position.set(-0.08, -0.4 + i * 0.2, 0.61);
    group.add(line);
    scanlines.push(line);
  }

  // Classic Rabbit-Ear V-Antennas
  const antMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.15 });
  const antLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.95, 8), antMat);
  antLeft.position.set(-0.25, 1.02, -0.1);
  antLeft.rotation.z = 0.42;
  group.add(antLeft);

  const antRight = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.95, 8), antMat);
  antRight.position.set(0.25, 1.02, -0.1);
  antRight.rotation.z = -0.42;
  group.add(antRight);

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #a21caf 0%, #4c1d95 55%, #0f172a 100%)',
    update(t, bounce, spring) {
      group.rotation.y = Math.sin(t * 0.55) * 0.28;
      group.position.y = Math.sin(t * 1.4) * 0.08;

      scanlines.forEach((line, idx) => {
        line.position.y = -0.45 + ((t * 0.45 + idx * 0.2) % 0.95);
      });

      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
