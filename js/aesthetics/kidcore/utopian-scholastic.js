// js/aesthetics/kidcore/utopian-scholastic.js
import * as THREE from 'three';

export function createUtopianScholastic() {
  const group = new THREE.Group();

  const oceanMat = new THREE.MeshPhysicalMaterial({
    color: 0x0284c7,
    emissive: 0x0369a1,
    emissiveIntensity: 0.15,
    roughness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  });

  const landMat = new THREE.MeshPhysicalMaterial({
    color: 0x22c55e,
    roughness: 0.35,
    clearcoat: 0.5,
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.82,
    roughness: 0.2,
  });

  const pageWhiteMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.22,
    clearcoat: 0.45,
  });

  const terracottaMat = new THREE.MeshPhysicalMaterial({
    color: 0xea580c,
    roughness: 0.3,
    clearcoat: 0.5,
  });

  const inkSlateMat = new THREE.MeshBasicMaterial({
    color: 0x64748b,
  });

  // 1. Classic Classroom / Encyclopedia Terrestrial Globe
  const globeAssembly = new THREE.Group();

  const tiltedAxis = new THREE.Group();
  tiltedAxis.rotation.z = -0.38; // 23.5-degree axial tilt

  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 32), oceanMat);

  // Stylized landmass patches
  const continentCoords = [
    [0.35, 0.25, 0.44, 0.22],
    [-0.4, 0.15, 0.45, 0.25],
    [0.15, -0.32, 0.5, 0.2],
    [-0.18, 0.42, -0.4, 0.18],
    [0.48, -0.15, -0.35, 0.21],
  ];
  continentCoords.forEach(([x, y, z, r]) => {
    const patch = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), landMat);
    patch.position.set(x, y, z);
    sphere.add(patch);
  });

  // Equatorial Brass Horizon Ring & Meridian C-Bracket
  const horizonRing = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.024, 12, 48), brassMat);
  horizonRing.rotation.x = Math.PI / 2;

  const meridianArc = new THREE.Mesh(
    new THREE.TorusGeometry(0.74, 0.032, 14, 48, Math.PI * 1.15),
    brassMat
  );
  meridianArc.rotation.z = -Math.PI / 2 - 0.18;

  const axisRod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.56, 12), brassMat);
  tiltedAxis.add(sphere, meridianArc, axisRod);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.28, 16), brassMat);
  stem.position.y = -0.84;
  const basePlate = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 0.08, 24), brassMat);
  basePlate.position.y = -0.98;

  globeAssembly.add(tiltedAxis, horizonRing, stem, basePlate);
  group.add(globeAssembly);

  // 2. Orbiting Eyewitness Encyclopedia Plates (with specimen block + text lines)
  const plates = [];
  const plateGeo = new THREE.BoxGeometry(0.36, 0.48, 0.028);
  const illustrationGeo = new THREE.BoxGeometry(0.24, 0.18, 0.034);
  const textLineGeo = new THREE.BoxGeometry(0.24, 0.022, 0.034);

  for (let i = 0; i < 4; i++) {
    const card = new THREE.Mesh(plateGeo, pageWhiteMat);

    const illustration = new THREE.Mesh(
      illustrationGeo,
      i % 2 === 0 ? terracottaMat : oceanMat
    );
    illustration.position.y = 0.09;

    const line1 = new THREE.Mesh(textLineGeo, inkSlateMat);
    line1.position.y = -0.06;
    const line2 = new THREE.Mesh(textLineGeo, inkSlateMat);
    line2.scale.x = 0.72;
    line2.position.set(-0.03, -0.12, 0);

    card.add(illustration, line1, line2);

    const angle = (i / 4) * Math.PI * 2;
    group.add(card);
    plates.push({ mesh: card, angle, yOffset: (i % 2 === 0 ? 1 : -1) * 0.2 });
  }

  // 3. Orbiting Brass Compass Star / Discovery Satellite
  const compassStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), brassMat);
  group.add(compassStar);

  return {
    group,
    description:
      'Step into 90s museum-gallery optimism, crisp white-void encyclopedias, and global curiosity—where every spinning globe, specimen plate, and brass instrument invites you to explore the wonders of the natural world.',
    background: 'radial-gradient(circle at 50% 40%, #ffffff 0%, #e2e8f0 58%, #94a3b8 100%)',
    update(t, bounce, spring) {
      sphere.rotation.y = t * 0.85;
      globeAssembly.rotation.y = Math.sin(t * 0.45) * 0.25;

      plates.forEach((p, idx) => {
        const a = p.angle + t * 0.55;
        p.mesh.position.x = Math.cos(a) * 1.38;
        p.mesh.position.z = Math.sin(a) * 1.38;
        p.mesh.position.y = p.yOffset + Math.sin(t * 2.0 + idx) * 0.09;
        p.mesh.rotation.y = -a + Math.PI / 2;
        p.mesh.rotation.z = Math.sin(t * 1.5 + idx) * 0.06;
      });

      compassStar.position.x = Math.cos(-t * 1.1) * 1.1;
      compassStar.position.z = Math.sin(-t * 1.1) * 1.1;
      compassStar.position.y = 0.55 + Math.sin(t * 2.4) * 0.08;
      compassStar.rotation.y = t * 2.0;

      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
