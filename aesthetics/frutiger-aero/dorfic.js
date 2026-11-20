// js/aesthetics/frutiger-aero/dorfic.js

import * as THREE from 'three';

export function createDorfic() {
  const group = new THREE.Group();

  const whiteGlossMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.06,
    metalness: 0.04,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
  });

  const orangeGlossMat = new THREE.MeshPhysicalMaterial({
    color: 0xff6b00,
    emissive: 0xea580c,
    emissiveIntensity: 0.35,
    roughness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
  });

  const tangerineGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xff7a00,
    emissive: 0xd9480f,
    emissiveIntensity: 0.25,
    roughness: 0.03,
    transmission: 0.88,
    thickness: 0.65,
    ior: 1.45,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
  });

  // 1. Unified Futuristic White & Tangerine Ergonomic Pod
  const chassisGroup = new THREE.Group();

  // Seamless Molded White Capsule Body
  const core = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.56, 0.78, 20, 36),
    whiteGlossMat
  );
  chassisGroup.add(core);

  // Precision-Locked Tangerine Waist Collar (stays aligned on the capsule's XZ plane)
  const waistBand = new THREE.Mesh(
    new THREE.TorusGeometry(0.585, 0.075, 20, 48),
    orangeGlossMat
  );
  waistBand.rotation.x = Math.PI / 2;
  chassisGroup.add(waistBand);

  // Dual-Sided Translucent Tangerine Gel Visor Windows (Front & Back)
  const visorGeo = new THREE.SphereGeometry(0.32, 28, 28);
  visorGeo.scale(0.85, 1.15, 0.38);

  const frontVisor = new THREE.Mesh(visorGeo, tangerineGlassMat);
  frontVisor.position.set(0, 0.24, 0.48);

  const backVisor = new THREE.Mesh(visorGeo, tangerineGlassMat);
  backVisor.position.set(0, 0.24, -0.48);

  // Inner Glowing Orange Core Visible Through the Visor
  const innerCore = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.55, 24),
    new THREE.MeshStandardMaterial({
      color: 0xff8800,
      emissive: 0xff5500,
      emissiveIntensity: 0.65,
      roughness: 0.2,
    })
  );
  innerCore.position.y = 0.22;

  chassisGroup.add(frontVisor, backVisor, innerCore);

  // Minimalist Recessed LED Status Bar on Lower Chassis
  const ledMat = new THREE.MeshBasicMaterial({ color: 0xff6b00 });
  [-0.14, 0, 0.14].forEach((x) => {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 12), ledMat);
    dot.position.set(x, -0.34, 0.555);
    chassisGroup.add(dot);
  });

  chassisGroup.rotation.z = Math.PI / 7;
  group.add(chassisGroup);

  // 2. Sleek Architectural Halo Ring
  const haloRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.26, 0.032, 16, 64),
    whiteGlossMat
  );
  haloRing.rotation.x = Math.PI / 2.4;
  haloRing.rotation.y = -0.22;
  group.add(haloRing);

  // 3. Orbiting Mini-Capsules & Refractive Tangerine Gel Droplets
  const satellites = [];
  const miniPillGeo = new THREE.CapsuleGeometry(0.095, 0.18, 12, 20);
  const gelDropGeo = new THREE.SphereGeometry(0.135, 22, 22);

  for (let i = 0; i < 6; i++) {
    const isPill = i % 2 === 0;
    const sat = new THREE.Mesh(
      isPill ? miniPillGeo : gelDropGeo,
      isPill ? whiteGlossMat : tangerineGlassMat
    );

    if (isPill) {
      sat.rotation.z = Math.PI / 4;
    }

    const angle = (i / 6) * Math.PI * 2;
    const baseY = Math.sin(angle * 2) * 0.34;
    sat.position.set(Math.cos(angle) * 1.5, baseY, Math.sin(angle) * 1.5);
    group.add(sat);
    satellites.push({ mesh: sat, angle, baseY, isPill });
  }

  return {
    group,
    description:
      'Standing for Daylight, Orange, Red, and Futuristic, DORFic merges sterile sunlit white minimalism, seamless mid-2000s consumer hardware curves, and vibrant translucent tangerine gel accents.',
    background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #ffedd5 55%, #fb923c 100%)',
    update(t, bounce, spring) {
      chassisGroup.rotation.y = t * 0.55;
      chassisGroup.position.y = Math.sin(t * 2) * 0.05 - bounce * 0.42;

      haloRing.rotation.z = -t * 0.45;

      satellites.forEach((s, idx) => {
        const a = s.angle + t * 0.72;
        s.mesh.position.x = Math.cos(a) * 1.5;
        s.mesh.position.z = Math.sin(a) * 1.5;
        s.mesh.position.y = s.baseY + Math.sin(t * 2.2 + idx) * 0.16;

        if (s.isPill) {
          s.mesh.rotation.y = t * 1.4 + idx;
        }
      });

      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
