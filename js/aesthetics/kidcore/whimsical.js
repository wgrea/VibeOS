// js/aesthetics/kidcore/whimsical.js
import * as THREE from 'three';

export function createWhimsical() {
  const group = new THREE.Group();

  const moonMat = new THREE.MeshPhysicalMaterial({
    color: 0xfef08a,
    emissive: 0xfacc15,
    emissiveIntensity: 0.25,
    roughness: 0.2,
    clearcoat: 0.85,
  });

  const pastelPinkMat = new THREE.MeshPhysicalMaterial({
    color: 0xf9a8d4,
    roughness: 0.35,
    clearcoat: 0.4,
  });

  const skyCloudMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.45,
    clearcoat: 0.3,
  });

  const keyGoldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.8,
    roughness: 0.18,
  });

  const magicBlueMat = new THREE.MeshPhysicalMaterial({
    color: 0x7dd3fc,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.3,
    roughness: 0.15,
    clearcoat: 0.9,
  });

  // 1. Main Storybook Moon & Key
  const heroGroup = new THREE.Group();

  const moonGeo = new THREE.TorusGeometry(0.68, 0.22, 18, 48, Math.PI * 1.35);
  const moon = new THREE.Mesh(moonGeo, moonMat);
  moon.rotation.z = Math.PI * 0.65;
  moon.position.x = -0.15;

  // Floating Storybook Key
  const keyGroup = new THREE.Group();
  const keyBow = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.035, 12, 24), keyGoldMat);
  keyBow.position.y = 0.22;
  const keyShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.44, 12), keyGoldMat);
  const keyTooth1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.04, 0.03), keyGoldMat);
  keyTooth1.position.set(0.05, -0.14, 0);
  const keyTooth2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.03), keyGoldMat);
  keyTooth2.position.set(0.04, -0.2, 0);

  keyGroup.add(keyBow, keyShaft, keyTooth1, keyTooth2);
  keyGroup.position.set(0.28, -0.05, 0.12);
  keyGroup.rotation.z = -0.25;

  // Puffy Toy Cloud at the base
  const cloudGroup = new THREE.Group();
  const puffSpecs = [
    [0, 0, 0, 0.26],
    [-0.24, -0.04, 0.05, 0.2],
    [0.24, -0.04, -0.04, 0.21],
    [0.08, 0.1, 0.08, 0.19],
  ];
  puffSpecs.forEach(([x, y, z, r]) => {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), skyCloudMat);
    puff.position.set(x, y, z);
    cloudGroup.add(puff);
  });
  cloudGroup.position.set(-0.1, -0.68, 0.2);

  heroGroup.add(moon, keyGroup, cloudGroup);
  group.add(heroGroup);

  // 2. Orbiting Twinkling Stars
  const sparkles = [];
  for (let i = 0; i < 8; i++) {
    const mat = i % 2 === 0 ? pastelPinkMat : magicBlueMat;
    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.085, 0), mat);
    const angle = (i / 8) * Math.PI * 2;
    group.add(star);
    sparkles.push({
      mesh: star,
      angle,
      radius: 1.25 + (i % 2) * 0.2,
      yBase: ((i % 3) - 1) * 0.38,
    });
  }

  return {
    group,
    description:
      'Step into lighthearted wonder, daydreaming, and playful curiosity—where gravity feels optional, ordinary moments spark fairy-tale imagination, and a mischievous golden key unlocks hidden storybook worlds.',
    background: 'radial-gradient(circle at 50% 35%, #fbcfe8 0%, #c4b5fd 52%, #4c1d95 100%)',
    update(t, bounce, spring) {
      // Gentle buoyant sway
      heroGroup.rotation.y = Math.sin(t * 0.65) * 0.35;
      heroGroup.rotation.z = Math.sin(t * 0.9) * 0.08;
      heroGroup.position.y = Math.sin(t * 1.8) * 0.08;

      // Playful floating key with a cheeky mid-air somersault
      keyGroup.position.y = -0.05 + Math.sin(t * 2.6) * 0.11;
      keyGroup.rotation.y = t * 1.1;
      keyGroup.rotation.z = -0.25 + Math.sin(t * 1.4) * 0.35;

      // Soft cloud squish-and-stretch
      const squish = Math.sin(t * 2.4) * 0.06;
      cloudGroup.scale.set(1 + squish, 1 - squish, 1 + squish);

      // Twinkling starlight pulse
      sparkles.forEach((s, idx) => {
        const a = s.angle + t * 0.55;
        const twinkle = 0.85 + Math.sin(t * 4.5 + idx * 1.3) * 0.3;
        s.mesh.position.x = Math.cos(a) * s.radius;
        s.mesh.position.z = Math.sin(a) * s.radius;
        s.mesh.position.y = s.yBase + Math.sin(t * 2.2 + idx) * 0.14;
        s.mesh.rotation.y = t * 1.8;
        s.mesh.scale.set(twinkle, twinkle * 1.45, twinkle * 0.5);
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
