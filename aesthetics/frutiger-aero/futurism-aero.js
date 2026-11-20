// js/aesthetics/frutiger-aero/futurism-aero.js
import * as THREE from 'three';

export function createFuturismAero() {
  const group = new THREE.Group();

  // 1. Sleek White-Pearl & Cyan Materials
  const pearlMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    roughness: 0.05,
    metalness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
  });

  const cyanGlowMat = new THREE.MeshPhysicalMaterial({
    color: 0x22d3ee,
    emissive: 0x06b6d4,
    emissiveIntensity: 1.15,
    roughness: 0.06,
    clearcoat: 1.0,
  });

  // 2. Smooth Glowing Cyan Core inside a Translucent Aero Glass Shell
  const innerCore = new THREE.Mesh(new THREE.SphereGeometry(0.46, 32, 32), cyanGlowMat);
  group.add(innerCore);

  const glassShell = new THREE.Mesh(
    new THREE.SphereGeometry(0.68, 32, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    })
  );
  group.add(glassShell);

  // 3. Triple Gyroscopic White-Pearl & Cyan Aerodynamic Gimbal Rings
  const g1 = new THREE.Mesh(new THREE.TorusGeometry(1.04, 0.048, 16, 64), pearlMat);
  const g2 = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.048, 16, 64), pearlMat);
  const g3 = new THREE.Mesh(new THREE.TorusGeometry(1.58, 0.036, 16, 64), cyanGlowMat);
  group.add(g1, g2, g3);

  // 4. Precision HUD Equatorial Track & Orbiting Aerodynamic Pods
  const trackRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.82, 0.01, 8, 64),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
    })
  );
  trackRing.rotation.x = Math.PI / 2.2;
  group.add(trackRing);

  const pods = [];
  for (let i = 0; i < 6; i++) {
    const pod = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.14, 12, 20), pearlMat);
    const angle = (i / 6) * Math.PI * 2;
    const r = 1.82;
    pod.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
    pod.rotation.z = Math.PI / 2;
    pod.rotation.y = -angle;
    trackRing.add(pod);
    pods.push({ mesh: pod, angle });
  }

  return {
    group,
    description:
      'Rooted in mid-2000s utopian sci-fi interfaces, clean-energy concept hardware, and titles like Mirror’s Edge and Portal, Futurism Aero fuses glossy white-pearl curves with glowing cyan cores, glass spheres, and kinetic gyroscopic rings.',
    background: 'radial-gradient(circle at 50% 35%, #e0f2fe 0%, #38bdf8 55%, #0369a1 100%)',
    update(t, bounce, spring) {
      innerCore.scale.setScalar(1 + Math.sin(t * 2.5) * 0.05);

      g1.rotation.x = t * 0.85;
      g1.rotation.y = t * 0.4;

      g2.rotation.y = -t * 0.65;
      g2.rotation.z = t * 0.5;

      g3.rotation.x = Math.PI / 3 + Math.sin(t * 0.6) * 0.3;
      g3.rotation.z = t * 0.35;

      trackRing.rotation.z = t * 0.3;

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
