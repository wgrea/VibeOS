// js/aesthetics/frutiger-aero/skeuo-dial.js
import * as THREE from 'three';

export function createSkeuoDial() {
  const group = new THREE.Group();

  // 1. Rich Brown Stitched-Leather Camera Body Backing (iOS 6 Instagram / Camera motif)
  const leatherBody = new THREE.Mesh(
    new THREE.BoxGeometry(3.1, 2.3, 0.38),
    new THREE.MeshPhysicalMaterial({
      color: 0x451a03,
      roughness: 0.78,
      metalness: 0.05,
      clearcoat: 0.15,
    })
  );
  leatherBody.position.z = -0.22;
  group.add(leatherBody);

  // Subtle Stitched Seam Border on the Leather Body
  const stitchEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(2.94, 1.78, 0.4)),
    new THREE.LineBasicMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0.75,
    })
  );
  stitchEdges.position.set(0, -0.16, -0.21);
  group.add(stitchEdges);

  // Silver Chrome Top Plate & Tactile Shutter Button
  const chromeMat = new THREE.MeshPhysicalMaterial({
    color: 0xe2e8f0,
    roughness: 0.14,
    metalness: 0.88,
    clearcoat: 1.0,
  });

  const chromeTop = new THREE.Mesh(new THREE.BoxGeometry(3.12, 0.38, 0.4), chromeMat);
  chromeTop.position.set(0, 0.98, -0.22);
  group.add(chromeTop);

  const shutterBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.14, 24), chromeMat);
  shutterBtn.position.set(1.05, 1.24, -0.22);
  group.add(shutterBtn);

  // 2. Brushed-Metal Camera Lens Barrel & Tactile Ridged Focus Dial
  const dialGroup = new THREE.Group();

  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 1.0, 0.55, 36),
    new THREE.MeshPhysicalMaterial({
      color: 0x334155,
      roughness: 0.25,
      metalness: 0.85,
      clearcoat: 0.6,
    })
  );
  barrel.rotation.x = Math.PI / 2;
  dialGroup.add(barrel);

  // Chrome Front Lens Bezel Ring
  const frontBezel = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.04, 16, 48), chromeMat);
  frontBezel.position.z = 0.27;
  dialGroup.add(frontBezel);

  // 24 Physical Grip Ridges Around the Focus Ring
  const ridgeGeo = new THREE.BoxGeometry(0.05, 0.08, 0.26);
  const ridgeMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.22,
    metalness: 0.9,
  });
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);
    ridge.position.set(Math.cos(angle) * 0.98, Math.sin(angle) * 0.98, 0.08);
    ridge.rotation.z = angle;
    dialGroup.add(ridge);
  }

  // 3. Deep Optical Glass Lens & Cyan Coating Glint
  const lensGlass = new THREE.Mesh(
    new THREE.SphereGeometry(0.72, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.35),
    new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.42,
      roughness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
    })
  );
  lensGlass.rotation.x = Math.PI / 2;
  lensGlass.position.z = -0.18;
  dialGroup.add(lensGlass);

  const lensGlint = new THREE.Mesh(
    new THREE.CircleGeometry(0.14, 24),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    })
  );
  lensGlint.position.set(-0.24, 0.24, 0.28);
  dialGroup.add(lensGlint);

  group.add(dialGroup);

  let spinSpeed = 0.005;

  return {
    group,
    description:
      'Reaching its zenith around 2010–2012 in iOS 6 apps like Instagram, Podcasts, and Game Center, Peak Skeuomorphism mimicked real-world craftsmanship—stitched leather, brushed aluminum, knurled dials, and multi-coated camera glass—to make touchscreens feel physically tangible.',
    background: 'radial-gradient(circle at 50% 40%, #fef3c7 0%, #d97706 65%, #78350f 100%)',
    update(t, bounce, spring = 0) {
      // Clicking gives the tactile dial a mechanical flick & depresses the shutter
      if (bounce > 0.18) spinSpeed = 0.14;
      spinSpeed = Math.max(0.005, spinSpeed * 0.94);
      dialGroup.rotation.z -= spinSpeed;

      shutterBtn.position.y = 1.24 - bounce * 0.06;
      group.rotation.y = Math.sin(t * 0.45) * 0.16;
      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
