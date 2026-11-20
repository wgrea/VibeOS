// js/aesthetics/vaporwave/krushclub.js

import * as THREE from 'three';

export function createKrushclub() {
  const group = new THREE.Group();

  // Procedural High-Contrast Scenecore Club Reflection Map
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 256;
  envCanvas.height = 128;
  const ctx = envCanvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 256, 128);
  grad.addColorStop(0.0, '#ff007f');
  grad.addColorStop(0.3, '#ffffff');
  grad.addColorStop(0.55, '#a3e635');
  grad.addColorStop(0.8, '#00f0ff');
  grad.addColorStop(1.0, '#18181b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 128);

  const envMap = new THREE.CanvasTexture(envCanvas);
  envMap.mapping = THREE.EquirectangularReflectionMapping;

  // 1. Unified Scenecore Star, Strobe Rings & Kandi Bracelet Assembly (Draggable / Arrow-Key Interactive)
  const krushclubAssembly = new THREE.Group();
  const coreGroup = new THREE.Group();

  // Extruded 5-Point Scenecore Kandi Star Core
  const starShape = new THREE.Shape();
  const outerR = 0.86;
  const innerR = 0.38;
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) starShape.moveTo(x, y);
    else starShape.lineTo(x, y);
  }
  starShape.closePath();

  const starGeo = new THREE.ExtrudeGeometry(starShape, {
    depth: 0.24,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelSegments: 3,
  });
  starGeo.center();

  const starCore = new THREE.Mesh(
    starGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0xff007f,
      emissive: 0xdb2777,
      emissiveIntensity: 0.65,
      roughness: 0.06,
      metalness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      iridescence: 0.75,
      envMap,
      envMapIntensity: 1.5,
    })
  );
  coreGroup.add(starCore);

  // Glossy Electric-Lime Star Border Wire
  const starWire = new THREE.Mesh(
    starGeo,
    new THREE.MeshBasicMaterial({
      color: 0xa3e635,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    })
  );
  starWire.scale.setScalar(1.04);
  coreGroup.add(starWire);

  krushclubAssembly.add(coreGroup);

  // 2. Dual Electric-Lime & Cyan Strobe Rings
  const limeRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.26, 0.055, 16, 64),
    new THREE.MeshPhysicalMaterial({
      color: 0xa3e635,
      emissive: 0x65a30d,
      emissiveIntensity: 0.85,
      roughness: 0.08,
      clearcoat: 1.0,
      envMap,
    })
  );
  krushclubAssembly.add(limeRing);

  const cyanRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.12, 0.025, 12, 64),
    new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x0284c7,
      emissiveIntensity: 1.1,
      roughness: 0.1,
    })
  );
  cyanRing.rotation.x = Math.PI / 2;
  krushclubAssembly.add(cyanRing);

  // 3. Orbiting Pony-Bead Kandi Bracelet Ring (Hollow Torus Beads + Mini Star Charms)
  const kandiGroup = new THREE.Group();
  kandiGroup.rotation.x = 0.32;
  kandiGroup.rotation.z = -0.18;

  const cord = new THREE.Mesh(
    new THREE.TorusGeometry(1.56, 0.012, 8, 72),
    new THREE.MeshBasicMaterial({
      color: 0xf472b6,
      transparent: true,
      opacity: 0.65,
    })
  );
  cord.rotation.x = Math.PI / 2;
  kandiGroup.add(cord);

  const beadColors = [0xff007f, 0xa3e635, 0x00f0ff, 0x18181b];
  const beads = [];
  const beadGeo = new THREE.TorusGeometry(0.115, 0.055, 12, 24);

  for (let i = 0; i < 16; i++) {
    const col = beadColors[i % beadColors.length];
    const isBlack = col === 0x18181b;
    const bead = new THREE.Mesh(
      beadGeo,
      new THREE.MeshPhysicalMaterial({
        color: col,
        emissive: isBlack ? 0x27272a : col,
        emissiveIntensity: isBlack ? 0.2 : 0.48,
        roughness: 0.08,
        metalness: isBlack ? 0.4 : 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        envMap,
        envMapIntensity: 1.4,
      })
    );

    const a = (i / 16) * Math.PI * 2;
    const r = 1.56;
    bead.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    bead.rotation.y = -a;
    kandiGroup.add(bead);
    beads.push({ mesh: bead, angle: a, radius: r });
  }

  krushclubAssembly.add(kandiGroup);
  group.add(krushclubAssembly);

  // 4. Club Strobe Point Lights (Hot Pink & Electric Lime)
  const pinkSpot = new THREE.PointLight(0xff007f, 3.0, 9);
  pinkSpot.position.set(-2.0, 1.5, 2.0);
  group.add(pinkSpot);

  const limeSpot = new THREE.PointLight(0xa3e635, 2.8, 9);
  limeSpot.position.set(2.0, -1.2, 2.0);
  group.add(limeSpot);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
  keyLight.position.set(0, 4, 3);
  group.add(keyLight);

  return {
    group,
    draggable: krushclubAssembly,
    description:
      'Early-to-mid 2020s scenecore rave revival—Jersey club 808 bounce, distorted bass drops, hot-pink & electric-lime kandi beads, and strobing dancefloor energy.',
    background: 'radial-gradient(circle at 50% 35%, #be185d 0%, #3b0764 55%, #09090b 100%)',
    update(t, bounce, spring) {
      krushclubAssembly.position.y = Math.sin(t * 1.4) * 0.05 - bounce * 0.18;

      // Jersey club 808 bounce + crisp kandi star spin
      const clubBounce = Math.abs(Math.sin(t * 4.8)) * 0.16;
      const bassPunch = 1 + Math.pow(Math.sin(t * 4.8), 4) * 0.12;

      coreGroup.position.y = clubBounce;
      coreGroup.scale.setScalar(bassPunch);
      coreGroup.rotation.y = t * 1.85;
      coreGroup.rotation.z = Math.sin(t * 2.4) * 0.25;

      // Gyroscopic club strobe rings
      limeRing.rotation.x = t * 1.4;
      limeRing.rotation.y = -t * 1.1;

      cyanRing.rotation.x = Math.PI / 2 + Math.sin(t * 1.8) * 0.55;
      cyanRing.rotation.y = t * 1.9;

      // Kandi bracelet orbit & wave ripple
      kandiGroup.rotation.y = t * 1.35;
      kandiGroup.rotation.z = -0.18 + Math.cos(t * 1.6) * 0.12;

      beads.forEach((b, idx) => {
        b.mesh.position.y = Math.sin(t * 5.2 + idx * 0.8) * 0.05;
      });

      // Alternating club strobe intensity
      pinkSpot.intensity = 2.2 + Math.max(0, Math.sin(t * 6.0)) * 2.0;
      limeSpot.intensity = 2.2 + Math.max(0, Math.cos(t * 6.0)) * 2.0;

      group.scale.setScalar(1 + spring * 0.3);
    },
  };
}
