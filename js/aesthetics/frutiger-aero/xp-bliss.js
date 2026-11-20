// js/aesthetics/frutiger-aero/xp-bliss.js

import * as THREE from 'three';

function createRoundedRectShape(width, height, radius) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x, y + radius);
  shape.lineTo(x, y + height - radius);
  shape.quadraticCurveTo(x, y + height, x + radius, y + height);
  shape.lineTo(x + width - radius, y + height);
  shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  shape.lineTo(x + width, y + radius);
  shape.quadraticCurveTo(x + width, y, x + width - radius, y);
  shape.lineTo(x + radius, y);
  shape.quadraticCurveTo(x, y, x, y + radius);
  return shape;
}

export function createXpBliss() {
  const group = new THREE.Group();

  // 1. Rolling Green Bliss Hills
  const frontHill = new THREE.Mesh(
    new THREE.SphereGeometry(5, 36, 36),
    new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.78 })
  );
  frontHill.position.set(-1.2, -5.6, 0.2);
  frontHill.scale.set(1.85, 1, 0.8);
  group.add(frontHill);

  const backHill = new THREE.Mesh(
    new THREE.SphereGeometry(5.5, 36, 36),
    new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.85 })
  );
  backHill.position.set(2.2, -5.8, -1.2);
  backHill.scale.set(1.9, 1, 0.8);
  group.add(backHill);

  // 2. Fluffy White Cloud
  const cloudGroup = new THREE.Group();
  const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
  [
    [-0.5, 0, 0, 0.42],
    [0, 0.16, 0, 0.56],
    [0.55, 0.02, 0, 0.4],
  ].forEach(([x, y, z, r]) => {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), cloudMat);
    puff.position.set(x, y, z);
    cloudGroup.add(puff);
  });
  cloudGroup.position.set(-2.3, 1.65, -1.5);
  group.add(cloudGroup);

  // 3. Classic Windows XP "Luna" Window Frame with Rounded Corners
  const xpWindow = new THREE.Group();

  const bodyShape = createRoundedRectShape(2.85, 1.9, 0.14);
  const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
    depth: 0.1,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  });
  bodyGeo.center();

  const winBody = new THREE.Mesh(
    bodyGeo,
    new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.28 })
  );
  xpWindow.add(winBody);

  // XP Royal Blue Luna Title Bar
  const titleShape = createRoundedRectShape(2.88, 0.36, 0.12);
  const titleGeo = new THREE.ExtrudeGeometry(titleShape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.015,
    bevelThickness: 0.015,
  });
  titleGeo.center();

  const titleBar = new THREE.Mesh(
    titleGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0x0058e6,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    })
  );
  titleBar.position.set(0, 0.78, 0.015);
  xpWindow.add(titleBar);

  // XP Red Close Button + Crisp White "X"
  const closeGroup = new THREE.Group();
  const closeBtn = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.24, 0.15),
    new THREE.MeshPhysicalMaterial({
      color: 0xe81123,
      roughness: 0.1,
      clearcoat: 1.0,
    })
  );
  closeGroup.add(closeBtn);

  const xMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const xBar1 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.16), xMat);
  xBar1.rotation.z = Math.PI / 4;
  const xBar2 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.16), xMat);
  xBar2.rotation.z = -Math.PI / 4;
  closeGroup.add(xBar1, xBar2);

  closeGroup.position.set(1.22, 0.78, 0.02);
  xpWindow.add(closeGroup);

  // 4. Mac OS X "Aqua" Refractive Gel Pill Button (Inner Core + Glass Shell)
  const aquaPillGroup = new THREE.Group();

  const innerGelGeo = new THREE.CapsuleGeometry(0.13, 0.62, 10, 20);
  innerGelGeo.rotateZ(Math.PI / 2);
  const innerGel = new THREE.Mesh(
    innerGelGeo,
    new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.35,
      roughness: 0.2,
    })
  );
  aquaPillGroup.add(innerGel);

  const outerGelGeo = new THREE.CapsuleGeometry(0.17, 0.66, 12, 24);
  outerGelGeo.rotateZ(Math.PI / 2);
  const outerGel = new THREE.Mesh(
    outerGelGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      roughness: 0.04,
      transmission: 0.88,
      thickness: 0.45,
      ior: 1.45,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
    })
  );
  aquaPillGroup.add(outerGel);

  aquaPillGroup.position.set(0, -0.32, 0.12);
  xpWindow.add(aquaPillGroup);

  // 5. Floating Mac OS X Aqua "Stoplight" Gel Orbs beside the Window
  const stoplightOrbs = [];
  const stoplightColors = [
    { color: 0xff5f56, emissive: 0xdc2626, y: 0.55 }, // Aqua Red
    { color: 0xffbd2e, emissive: 0xd97706, y: 0.15 }, // Aqua Yellow
    { color: 0x27c93f, emissive: 0x16a34a, y: -0.25 }, // Aqua Green
  ];

  stoplightColors.forEach((item, idx) => {
    const orbGroup = new THREE.Group();

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 20, 20),
      new THREE.MeshStandardMaterial({
        color: item.color,
        emissive: item.emissive,
        emissiveIntensity: 0.3,
        roughness: 0.25,
      })
    );

    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(0.17, 24, 24),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.03,
        transmission: 0.9,
        thickness: 0.4,
        ior: 1.46,
        clearcoat: 1.0,
      })
    );

    orbGroup.add(core, shell);
    orbGroup.position.set(-1.85, item.y, 0.65);
    group.add(orbGroup);
    stoplightOrbs.push({ mesh: orbGroup, baseY: item.y, offset: idx * 1.1 });
  });

  xpWindow.position.set(0.25, 0.35, 0.35);
  group.add(xpWindow);

  return {
    group,
    description:
      'Debuting in 2001 with Mac OS X Aqua and Windows XP’s Luna theme, Aqua & XP replaced flat gray bevels with rolling green hills, bright blue skies, translucent candy-gel buttons, and friendly tactile UI.',
    background: 'linear-gradient(180deg, #2563eb 0%, #60a5fa 65%, #bbf7d0 100%)',
    update(t, bounce, spring) {
      xpWindow.position.y = 0.35 + Math.sin(t * 2) * 0.06 - bounce * 0.5;
      xpWindow.rotation.y = Math.sin(t * 0.8) * 0.16;

      cloudGroup.position.x = -2.3 + Math.sin(t * 0.4) * 0.25;

      aquaPillGroup.scale.set(1 + spring * 0.45, 1 - spring * 0.35, 1);

      stoplightOrbs.forEach((orb) => {
        orb.mesh.position.y = orb.baseY + Math.sin(t * 2.4 + orb.offset) * 0.07;
        orb.mesh.scale.setScalar(1 + spring * 0.25);
      });
    },
  };
}
