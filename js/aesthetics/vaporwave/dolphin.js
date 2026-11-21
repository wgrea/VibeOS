import * as THREE from 'three';

export const meta = {
  slug: 'dolphin',
  title: 'Dolphin Aesthetic',
  era: 'Mid-2000s – Early 2010s',
  description:
    'Sun-drenched ocean optimism, translucent aqua caustics, and glossy CGI marine life inspired by early-2000s digital screensavers, Lisa Frank palettes, and aquatic escapism.'
};

export function createDolphin() {
  const group = new THREE.Group();

  // Procedural Caustic Aqua Reflection Map
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 256;
  envCanvas.height = 128;
  const ctx = envCanvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0.0, '#ffffff');
  grad.addColorStop(0.35, '#a5f3fc');
  grad.addColorStop(0.65, '#0284c7');
  grad.addColorStop(1.0, '#1e1b4b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 128);

  const envMap = new THREE.CanvasTexture(envCanvas);
  envMap.mapping = THREE.EquirectangularReflectionMapping;

  // 1. Layered Concentric Water Ripple Rings
  const ripples = [];
  const rippleConfigs = [
    { radius: 1.05, tube: 0.032, opacity: 0.9, speed: 1.0, offset: 0 },
    { radius: 1.45, tube: 0.024, opacity: 0.65, speed: 0.85, offset: 1.4 },
    { radius: 1.85, tube: 0.016, opacity: 0.38, speed: 0.7, offset: 2.8 }
  ];

  rippleConfigs.forEach((cfg) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 72),
      new THREE.MeshPhysicalMaterial({
        color: 0x5eead4,
        emissive: 0x0d9488,
        emissiveIntensity: 0.55,
        roughness: 0.05,
        clearcoat: 1.0,
        transparent: true,
        opacity: cfg.opacity,
        envMap,
        envMapIntensity: 1.2
      })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.45;
    ring.userData = cfg;
    group.add(ring);
    ripples.push(ring);
  });

  // 2. Sculpted Cyber-Dolphin Mesh
  const dolphinGroup = new THREE.Group();

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    emissive: 0x0369a1,
    emissiveIntensity: 0.35,
    roughness: 0.08,
    metalness: 0.35,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    iridescence: 0.85,
    iridescenceIOR: 1.45,
    envMap,
    envMapIntensity: 1.5
  });

  const bellyMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe,
    emissive: 0x7dd3fc,
    emissiveIntensity: 0.25,
    roughness: 0.12,
    clearcoat: 1.0,
    envMap,
    envMapIntensity: 1.2
  });

  // Smooth Curved Spine via Lathe/Tube Profile
  const spineCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.78, -0.24, 0),
    new THREE.Vector3(-0.42, 0.06, 0),
    new THREE.Vector3(0.0, 0.22, 0),
    new THREE.Vector3(0.42, 0.14, 0),
    new THREE.Vector3(0.68, -0.02, 0)
  ]);

  const segments = 32;
  const radialSegments = 20;
  const bodyGeo = new THREE.TubeGeometry(spineCurve, segments, 1, radialSegments, false);
  const pos = bodyGeo.attributes.position;
  const v = new THREE.Vector3();

  // Taper radius along the curve to form a sleek dolphin silhouette
  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    const center = spineCurve.getPointAt(u);
    let radius;
    if (u < 0.25) {
      radius = 0.05 + (u / 0.25) * 0.16; // Narrow tail peduncle
    } else if (u < 0.65) {
      radius = 0.21 + Math.sin(((u - 0.25) / 0.4) * Math.PI) * 0.07; // Full chest
    } else {
      radius = 0.21 * (1 - (u - 0.65) / 0.35) + 0.045; // Taper to melon/head
    }

    for (let j = 0; j <= radialSegments; j++) {
      const idx = i * (radialSegments + 1) + j;
      v.fromBufferAttribute(pos, idx).sub(center).multiplyScalar(radius).add(center);
      pos.setXYZ(idx, v.x, v.y, v.z);
    }
  }
  bodyGeo.computeVertexNormals();

  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  dolphinGroup.add(bodyMesh);

  // Rostrum (Snout)
  const snout = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.3, 16), bellyMat);
  snout.position.set(0.78, -0.08, 0);
  snout.rotation.z = -Math.PI / 1.75;
  dolphinGroup.add(snout);

  // Swept Dorsal Fin
  const dorsalShape = new THREE.Shape();
  dorsalShape.moveTo(0, 0);
  dorsalShape.quadraticCurveTo(-0.08, 0.24, -0.22, 0.3);
  dorsalShape.quadraticCurveTo(-0.16, 0.12, -0.18, 0);
  dorsalShape.closePath();

  const dorsalGeo = new THREE.ExtrudeGeometry(dorsalShape, {
    depth: 0.025,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.01,
    bevelSegments: 3
  });
  dorsalGeo.center();
  const dorsal = new THREE.Mesh(dorsalGeo, bodyMat);
  dorsal.position.set(-0.04, 0.33, 0);
  dolphinGroup.add(dorsal);

  // Pectoral Fins (Left & Right)
  const pecShape = new THREE.Shape();
  pecShape.moveTo(0, 0);
  pecShape.quadraticCurveTo(-0.1, -0.18, -0.26, -0.24);
  pecShape.quadraticCurveTo(-0.16, -0.08, -0.12, 0);
  pecShape.closePath();

  const pecGeo = new THREE.ExtrudeGeometry(pecShape, {
    depth: 0.016,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 2
  });

  [-1, 1].forEach((side) => {
    const fin = new THREE.Mesh(pecGeo, bellyMat);
    fin.position.set(0.24, 0.02, side * 0.2);
    fin.rotation.x = side * 0.55;
    fin.rotation.y = side * -0.25;
    dolphinGroup.add(fin);
  });

  // Crescent Tail Fluke
  const flukeShape = new THREE.Shape();
  flukeShape.moveTo(0, 0);
  flukeShape.quadraticCurveTo(-0.12, 0.22, -0.26, 0.34);
  flukeShape.quadraticCurveTo(-0.14, 0.08, -0.12, 0);
  flukeShape.quadraticCurveTo(-0.14, -0.08, -0.26, -0.34);
  flukeShape.quadraticCurveTo(-0.12, -0.22, 0, 0);

  const flukeGeo = new THREE.ExtrudeGeometry(flukeShape, {
    depth: 0.02,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 2
  });
  flukeGeo.rotateX(Math.PI / 2);
  const tailFluke = new THREE.Mesh(flukeGeo, bodyMat);
  tailFluke.position.set(-0.76, -0.24, 0);
  tailFluke.rotation.z = -0.35;
  dolphinGroup.add(tailFluke);

  group.add(dolphinGroup);

  // 3. Rising Glossy Seafoam Bubbles
  const bubbles = [];
  const bubbleGeo = new THREE.SphereGeometry(0.045, 16, 16);
  const bubbleMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.85,
    ior: 1.33,
    clearcoat: 1.0,
    envMap
  });

  for (let i = 0; i < 14; i++) {
    const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
    const angle = (i / 14) * Math.PI * 2;
    const radius = 0.55 + (i % 3) * 0.28;
    bubble.position.set(
      Math.cos(angle) * radius,
      -0.45 + (i % 5) * 0.22,
      Math.sin(angle) * radius
    );
    const scale = 0.5 + (i % 4) * 0.35;
    bubble.scale.setScalar(scale);
    bubble.userData = {
      baseY: -0.45,
      speed: 0.45 + (i % 4) * 0.15,
      phase: i * 0.85,
      radius,
      angle
    };
    group.add(bubble);
    bubbles.push(bubble);
  }

  // Lighting for Specular Water Highlights
  const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
  sunLight.position.set(2.5, 4.5, 3.0);
  group.add(sunLight);

  const causticLight = new THREE.PointLight(0x22d3ee, 2.5, 8);
  causticLight.position.set(0, -1.2, 0);
  group.add(causticLight);

   return {
    group,
    description:
      'Mid-2000s to early-2010s aquatic optimism—sun-drenched aqua caustics, glossy CGI marine life, Lisa Frank tropical palettes, and serene screensaver escapism.',
    background: 'radial-gradient(circle at 50% 30%, #67e8f9 0%, #0284c7 52%, #1e1b4b 100%)',
    update(t, bounce, spring) {
      const leapPhase = t * 2.1;
      dolphinGroup.position.y = Math.sin(leapPhase) * 0.34 + 0.18 - bounce * 0.15;
      dolphinGroup.rotation.z = Math.cos(leapPhase) * 0.42;
      dolphinGroup.rotation.y = t * 0.55;

      tailFluke.rotation.z = -0.35 + Math.sin(leapPhase * 2) * 0.18;

      ripples.forEach((ring) => {
        const { speed, offset, opacity } = ring.userData;
        const pulse = (Math.sin(t * 2.1 * speed + offset) + 1) * 0.5;
        const scale = 0.94 + pulse * 0.14;
        ring.scale.set(scale, scale, 1);
        ring.material.opacity = opacity * (0.65 + (1 - pulse) * 0.35);
      });

      bubbles.forEach((b) => {
        const { baseY, speed, phase, radius, angle } = b.userData;
        const cycle = (t * speed + phase) % 1.4;
        b.position.y = baseY + cycle;
        b.position.x = Math.cos(angle + t * 0.3) * radius + Math.sin(t * 2 + phase) * 0.04;
        b.position.z = Math.sin(angle + t * 0.3) * radius;
      });

      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}