import * as THREE from 'three';

export function create2019Ambience() {
  const group = new THREE.Group();

  // Materials
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x312e81,
    roughness: 0.45,
    metalness: 0.15,
  });

  const twilightGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x818cf8,
    emissive: 0x4f46e5,
    emissiveIntensity: 0.25,
    roughness: 0.12,
    transparent: true,
    opacity: 0.55,
  });

  const warmLampMat = new THREE.MeshPhysicalMaterial({
    color: 0xffedd5,
    emissive: 0xf97316,
    emissiveIntensity: 0.85,
    roughness: 0.25,
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.75,
    roughness: 0.3,
  });

  const terracottaMat = new THREE.MeshStandardMaterial({
    color: 0xea580c,
    roughness: 0.75,
  });

  const plantGreenMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    roughness: 0.55,
  });

  // 1. Twilight Apartment Window & Cross-Panes
  const windowGroup = new THREE.Group();
  windowGroup.position.set(0, 0.08, -0.32);

  const glassPane = new THREE.Mesh(new THREE.PlaneGeometry(1.36, 1.06), twilightGlassMat);
  windowGroup.add(glassPane);

  const outerTop = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.08, 0.1), frameMat);
  outerTop.position.y = 0.54;
  const outerBottom = outerTop.clone();
  outerBottom.position.y = -0.54;

  const outerLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.16, 0.1), frameMat);
  outerLeft.position.x = -0.7;
  const outerRight = outerLeft.clone();
  outerRight.position.x = 0.7;

  const mullionV = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.06, 0.06), frameMat);
  const mullionH = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.04, 0.06), frameMat);

  windowGroup.add(outerTop, outerBottom, outerLeft, outerRight, mullionV, mullionH);
  group.add(windowGroup);

  // 2. Warm Glowing Desk Lamp
  const lampGroup = new THREE.Group();
  lampGroup.position.set(-0.38, -0.35, 0.14);

  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.06, 20), brassMat);
  const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.28, 12), brassMat);
  lampStem.position.y = 0.15;

  const warmOrb = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 24), warmLampMat);
  warmOrb.position.y = 0.36;

  lampGroup.add(lampBase, lampStem, warmOrb);
  group.add(lampGroup);

  // 3. Potted Houseplant & Floating Lo-Fi Audio Ring
  const plantGroup = new THREE.Group();
  plantGroup.position.set(0.42, -0.38, 0.2);

  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.22, 16), terracottaMat);
  pot.position.y = 0.11;

  const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(0.21, 1), plantGreenMat);
  foliage.position.y = 0.32;

  plantGroup.add(pot, foliage);
  group.add(plantGroup);

  // Subtle floating dust / lo-fi dust motes
  const motes = [];
  const moteGeo = new THREE.SphereGeometry(0.016, 8, 8);
  const moteMat = new THREE.MeshBasicMaterial({ color: 0xfde68a, transparent: true, opacity: 0.8 });

  for (let i = 0; i < 14; i++) {
    const m = new THREE.Mesh(moteGeo, moteMat);
    const angle = (i / 14) * Math.PI * 2;
    const radius = 0.55 + (i % 3) * 0.18;
    const baseY = -0.3 + (i % 5) * 0.18;
    m.position.set(Math.cos(angle) * radius, baseY, Math.sin(angle) * radius);
    group.add(m);
    motes.push({ mesh: m, angle, radius, baseY, phase: i * 0.6 });
  }

  // Warm lamp point light + cool dusk fill
  const lampLight = new THREE.PointLight(0xfb923c, 1.8, 4);
  lampLight.position.set(-0.38, 0.15, 0.35);
  const duskLight = new THREE.DirectionalLight(0xc4b5fd, 1.1);
  duskLight.position.set(2, 3, 2);
  group.add(lampLight, duskLight);

  return {
    group,
    description:
      'Late-night pre-2020 nostalgia captured through warm amber desk lamps, purple twilight apartment windows, cozy houseplants, and drifting lo-fi study beats.',
    background: 'linear-gradient(180deg, #312e81 0%, #6d28d9 48%, #f472b6 82%, #fed7aa 100%)',
    update(t, bounce, spring) {
      warmOrb.scale.setScalar(1 + Math.sin(t * 1.8) * 0.04);
      lampLight.intensity = 1.7 + Math.sin(t * 2.2) * 0.25;
      foliage.rotation.y = t * 0.35;

      motes.forEach((m) => {
        const a = m.angle + t * 0.25;
        m.mesh.position.x = Math.cos(a) * m.radius;
        m.mesh.position.z = Math.sin(a) * m.radius;
        m.mesh.position.y = m.baseY + Math.sin(t * 1.6 + m.phase) * 0.08;
      });

      group.rotation.y = Math.sin(t * 0.5) * 0.22;
      group.position.y = -bounce * 0.25;
      group.scale.setScalar(1 + spring * 0.22);
    },
  };
}
