// js/aesthetics/dark/surveillance.js
import * as THREE from 'three';

export function createSurveillance({ camera, domElement, box }) {
  const group = new THREE.Group();
  group.name = 'surveillance';

  // Bank of 3 monitors in a tight grid
  const monitorMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    roughness: 0.6,
    metalness: 0.2,
  });
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x1a2b1a,
    emissive: 0x2a4a2a,
    emissiveIntensity: 0.5,
    roughness: 0.9,
  });

  const monitors = [];
  for (let i = 0; i < 3; i++) {
    const mGroup = new THREE.Group();
    mGroup.position.set((i - 1) * 0.75, 0.3, 0);

    // Monitor bezel
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.42, 0.06), monitorMat);
    mGroup.add(bezel);

    // Screen
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 0.34), screenMat.clone());
    screen.position.z = 0.032;
    mGroup.add(screen);

    // Stand
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.08), monitorMat);
    stand.position.y = -0.31;
    mGroup.add(stand);

    group.add(mGroup);
    monitors.push(screen);
  }

  // Sweeping spotlight from above
  const spot = new THREE.SpotLight(0xffffff, 3.0, 8, Math.PI / 6, 0.4, 1.5);
  spot.position.set(0, 2.5, 1.5);
  spot.target.position.set(0, 0, 0);
  group.add(spot);
  group.add(spot.target);

  // Rotating base to sweep the spotlight (we rotate the spotlight's position)
  const spotPivot = new THREE.Group();
  spotPivot.add(spot);
  group.add(spotPivot);

  // Dim ambient so the monitors glow
  const ambient = new THREE.AmbientLight(0x223322, 0.3);
  group.add(ambient);

  // Blinking REC LED
  const recMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const rec = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), recMat);
  rec.position.set(1.4, 0.8, 0.2);
  group.add(rec);

  return {
    group,
    description:
      'Surveillance — the institutional dread of being watched: bank of control-room monitors, sweeping spotlight, and the cold hum of a security feed.',
    background:
      'radial-gradient(circle at 50% 40%, #1a2b1a 0%, #0a0a0a 60%, #000000 100%)',
    draggable: group,
    update(t) {
      // Spot sweeps back and forth
      spotPivot.rotation.y = Math.sin(t * 0.8) * 0.6;

      // Screens flicker independently (each with its own phase)
      monitors.forEach((m, i) => {
        const flicker = 0.35 + 0.25 * Math.abs(Math.sin(t * 2 + i * 1.7));
        m.material.emissiveIntensity = flicker;
      });

      // REC LED blinks on/off once per second
      recMat.color.setHex(Math.floor(t) % 2 === 0 ? 0xff0000 : 0x330000);
    },
  };
}