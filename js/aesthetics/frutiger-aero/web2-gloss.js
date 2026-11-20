// js/aesthetics/frutiger-aero/web2-gloss.js

import * as THREE from 'three';

function createStarburstShape(points, outerRadius, innerRadius) {
  const shape = new THREE.Shape();
  const totalVertices = points * 2;
  for (let i = 0; i < totalVertices; i++) {
    const angle = (i / totalVertices) * Math.PI * 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

function createStarShape(outerRadius, innerRadius) {
  return createStarburstShape(5, outerRadius, innerRadius);
}

function createRssEmblem(zOffset, flipZ = false) {
  const rssGroup = new THREE.Group();
  const rssMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.14,
    clearcoat: 1.0,
  });

  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 18, 18), rssMat);
  dot.position.set(-0.46, -0.46, 0);
  rssGroup.add(dot);

  [0.52, 0.88].forEach((arcRadius) => {
    const arcGeo = new THREE.TorusGeometry(arcRadius, 0.095, 14, 28, Math.PI / 2);
    const arcMesh = new THREE.Mesh(arcGeo, rssMat);
    arcMesh.position.set(-0.46, -0.46, 0);
    rssGroup.add(arcMesh);
  });

  rssGroup.position.z = zOffset;
  if (flipZ) {
    rssGroup.rotation.y = Math.PI;
  }
  return rssGroup;
}

export function createWeb2Gloss() {
  const group = new THREE.Group();
  const badgeAssembly = new THREE.Group();

  // 1. Crisp White Vinyl Sticker Outline Backing
  const borderShape = createStarburstShape(16, 1.66, 1.38);
  const borderGeo = new THREE.ExtrudeGeometry(borderShape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelSegments: 4,
    bevelSize: 0.06,
    bevelThickness: 0.06,
  });
  borderGeo.center();

  const stickerBorder = new THREE.Mesh(
    borderGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.18,
      clearcoat: 1.0,
    })
  );
  badgeAssembly.add(stickerBorder);

  // 2. Glossy RSS Orange Starburst Core
  const badgeShape = createStarburstShape(16, 1.52, 1.25);
  const badgeGeo = new THREE.ExtrudeGeometry(badgeShape, {
    depth: 0.18,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: 0.07,
    bevelThickness: 0.07,
  });
  badgeGeo.center();

  const web2Badge = new THREE.Mesh(
    badgeGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0xf97316,
      emissive: 0x9a3412,
      emissiveIntensity: 0.15,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    })
  );
  badgeAssembly.add(web2Badge);

  // 3. Dual-Sided Sculpted RSS Emblems (Front & Back)
  const frontRss = createRssEmblem(0.17, false);
  const backRss = createRssEmblem(-0.17, true);
  badgeAssembly.add(frontRss, backRss);

  // 4. Curved Refractive Glass Highlight Lenses (Front & Back)
  const lensGeo = new THREE.SphereGeometry(1.18, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.28);
  lensGeo.rotateX(Math.PI / 2);
  lensGeo.scale(1, 0.58, 0.12);

  const lensMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.02,
    transmission: 0.92,
    thickness: 0.25,
    ior: 1.48,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.42,
  });

  const frontHighlight = new THREE.Mesh(lensGeo, lensMat);
  frontHighlight.position.set(0, 0.36, 0.18);
  badgeAssembly.add(frontHighlight);

  const backHighlight = new THREE.Mesh(lensGeo, lensMat);
  backHighlight.rotation.y = Math.PI;
  backHighlight.position.set(0, 0.36, -0.18);
  badgeAssembly.add(backHighlight);

  group.add(badgeAssembly);

  // 5. Five Orbiting Glossy Rating Stars (Classic Web 2.0 5-Star System)
  const stars = [];
  const starShape = createStarShape(0.17, 0.075);
  const starGeo = new THREE.ExtrudeGeometry(starShape, {
    depth: 0.05,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  });
  starGeo.center();

  const starMat = new THREE.MeshPhysicalMaterial({
    color: 0xfacc15,
    emissive: 0xca8a04,
    emissiveIntensity: 0.28,
    roughness: 0.06,
    metalness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
  });

  const starCount = 5;
  for (let i = 0; i < starCount; i++) {
    const starMesh = new THREE.Mesh(starGeo, starMat);
    const angle = (i / starCount) * Math.PI * 2;
    const baseY = Math.sin(angle * 2) * 0.28;
    starMesh.position.set(Math.cos(angle) * 2.05, baseY, Math.sin(angle) * 2.05);
    group.add(starMesh);
    stars.push({ mesh: starMesh, angle, baseY });
  }

  return {
    group,
    description:
      'Defining the mid-2000s social web from 2005 to 2008, Web 2.0 Gloss traded raw HTML tables for wet-floor reflections, puffy RSS starburst stickers, specular gel gradients, and interactive 5-star rating widgets.',
    background: 'radial-gradient(circle at 50% 30%, #fff7ed, #fed7aa 65%, #fb923c 100%)',
    update(t, bounce, spring) {
      badgeAssembly.rotation.y = Math.sin(t * 1.1) * 0.55;
      badgeAssembly.position.y = Math.sin(t * 2.1) * 0.05 - bounce * 0.45;
      badgeAssembly.scale.setScalar(1 - spring * 0.28);

      stars.forEach((s, idx) => {
        const a = s.angle + t * 0.52;
        s.mesh.position.x = Math.cos(a) * 2.05;
        s.mesh.position.z = Math.sin(a) * 2.05;
        s.mesh.position.y = s.baseY + Math.sin(t * 2.4 + idx) * 0.09;
        s.mesh.rotation.y = t * 1.8 + idx;
        s.mesh.scale.setScalar(1 + spring * 0.22);
      });
    },
  };
}
