import * as THREE from 'three';

export function createDolphin() {
  const group = new THREE.Group();

  // Translucent Aqua Ocean Ripple Ring
  const waterRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.35, 0.06, 16, 64),
    new THREE.MeshPhysicalMaterial({
      color: 0x2dd4bf,
      emissive: 0x0d9488,
      emissiveIntensity: 0.5,
      roughness: 0.08,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.85,
    })
  );
  waterRing.rotation.x = Math.PI / 2;
  waterRing.position.y = -0.35;
  group.add(waterRing);

  // Stylized Iridescent Cyber-Dolphin Arc
  const dolphinGroup = new THREE.Group();
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x67e8f9,
    emissive: 0x0284c7,
    emissiveIntensity: 0.45,
    roughness: 0.1,
    metalness: 0.25,
    clearcoat: 1.0,
  });

  // Curved Torso + Snout + Dorsal & Tail Fins
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.26, 0.85, 16, 24), bodyMat);
  torso.rotation.z = Math.PI / 2.4;
  dolphinGroup.add(torso);

  const snout = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.38, 16), bodyMat);
  snout.position.set(0.62, 0.18, 0);
  snout.rotation.z = -Math.PI / 3;
  dolphinGroup.add(snout);

  const dorsal = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.35, 12), bodyMat);
  dorsal.position.set(-0.05, 0.34, 0);
  dorsal.rotation.z = 0.35;
  dolphinGroup.add(dorsal);

  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.55), bodyMat);
  tail.position.set(-0.62, -0.22, 0);
  tail.rotation.z = -0.4;
  dolphinGroup.add(tail);

  group.add(dolphinGroup);

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #22d3ee 0%, #0284c7 55%, #1e1b4b 100%)',
    update(t, bounce, spring) {
      // Leaping arc motion over the water ring
      dolphinGroup.position.y = Math.sin(t * 2.2) * 0.32 + 0.15;
      dolphinGroup.rotation.z = Math.cos(t * 2.2) * 0.35;
      dolphinGroup.rotation.y = t * 0.65;

      const rippleScale = 1 + Math.sin(t * 2.2) * 0.08;
      waterRing.scale.set(rippleScale, rippleScale, 1);

      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
