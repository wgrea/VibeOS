import * as THREE from 'three';

export function createVhsPop() {
  const group = new THREE.Group();

  // Retro 80s/90s VHS Cassette Shell
  const cassette = new THREE.Mesh(
    new THREE.BoxGeometry(1.85, 1.05, 0.24),
    new THREE.MeshPhysicalMaterial({
      color: 0x1e1b4b,
      roughness: 0.25,
      metalness: 0.3,
      clearcoat: 0.8,
    })
  );
  group.add(cassette);

  // Hot-Pink & Electric-Cyan Cassette Label Strip
  const label = new THREE.Mesh(
    new THREE.BoxGeometry(1.55, 0.28, 0.26),
    new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 0.65,
    })
  );
  label.position.y = 0.26;
  group.add(label);

  // Spinning Left & Right Tape Reels
  const reelMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.45,
  });

  const leftReel = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.06, 12, 24), reelMat);
  leftReel.position.set(-0.46, -0.14, 0.13);
  group.add(leftReel);

  const rightReel = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.06, 12, 24), reelMat);
  rightReel.position.set(0.46, -0.14, 0.13);
  group.add(rightReel);

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #ec4899 0%, #6d28d9 55%, #0f172a 100%)',
    update(t, bounce, spring) {
      group.rotation.y = Math.sin(t * 0.65) * 0.32;
      group.rotation.x = Math.cos(t * 0.5) * 0.14;

      leftReel.rotation.z = -t * 2.4;
      rightReel.rotation.z = -t * 2.4;

      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
