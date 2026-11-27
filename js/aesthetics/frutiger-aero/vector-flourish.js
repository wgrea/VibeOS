// js/aesthetics/frutiger-aero/vector-flourish.js
import * as THREE from 'three';

function createEcoGlobeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const ocean = ctx.createLinearGradient(0, 0, 0, 256);
  ocean.addColorStop(0, '#38bdf8');
  ocean.addColorStop(0.5, '#0ea5e9');
  ocean.addColorStop(1, '#0284c7');
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, 512, 256);

  // Clean stock-vector latitude/longitude grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.5;
  for (let x = 0; x < 512; x += 42) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }
  for (let y = 32; y < 256; y += 36) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Stylized bright-lime / white vector continents
  const blobs = [
    [95, 92, 46, 26, -0.3],
    [138, 152, 26, 36, 0.2],
    [265, 86, 52, 28, 0.15],
    [285, 146, 32, 38, -0.1],
    [395, 108, 48, 30, 0.25],
    [432, 174, 24, 18, -0.2],
  ];
  ctx.fillStyle = '#bef264';
  blobs.forEach(([x, y, rx, ry, rot]) => {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
    ctx.fill();
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createTaperedSwoosh(points, maxRadius, widthScale = 1.45) {
  const curve = new THREE.CatmullRomCurve3(points);
  const tubularSegments = 96;
  const radialSegments = 10;
  const geo = new THREE.TubeGeometry(curve, tubularSegments, maxRadius, radialSegments, false);
  const frames = curve.computeFrenetFrames(tubularSegments, false);

  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  const center = new THREE.Vector3();
  const stride = radialSegments + 1;

  for (let r = 0; r <= tubularSegments; r++) {
    const u = r / tubularSegments;
    curve.getPointAt(u, center);
    const taper = Math.max(0.03, Math.pow(Math.sin(u * Math.PI), 0.65));
    const N = frames.normals[r];
    const B = frames.binormals[r];

    for (let j = 0; j < stride; j++) {
      const idx = r * stride + j;
      v.fromBufferAttribute(pos, idx).sub(center);
      const nComp = v.dot(N) * taper * 0.4;
      const bComp = v.dot(B) * taper * widthScale;
      v.copy(N).multiplyScalar(nComp).addScaledVector(B, bComp).add(center);
      pos.setXYZ(idx, v.x, v.y, v.z);
    }
  }

  geo.computeVertexNormals();
  return geo;
}

function createVectorLeafGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, -0.17);
  s.bezierCurveTo(0.13, -0.07, 0.13, 0.09, 0, 0.21);
  s.bezierCurveTo(-0.13, 0.09, -0.13, -0.07, 0, -0.17);
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.012,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.008,
    bevelThickness: 0.008,
  });
  geo.center();
  return geo;
}

export function createVectorFlourish() {
  const group = new THREE.Group();
  const disposables = [];
  const track = (x) => (disposables.push(x), x);

  const coreGroup = new THREE.Group();
  group.add(coreGroup);

  // 1. Eco-Vector Sky-Blue Globe + Beaded Vector Orbit Rings
  const globeTex = track(createEcoGlobeTexture());
  const globe = new THREE.Mesh(
    track(new THREE.SphereGeometry(0.72, 36, 36)),
    track(
      new THREE.MeshPhysicalMaterial({
        map: globeTex,
        emissive: 0x0369a1,
        emissiveIntensity: 0.14,
        roughness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
      })
    )
  );
  coreGroup.add(globe);

  const ringMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 }));
  const beadGeo = track(new THREE.SphereGeometry(0.032, 12, 12));
  const whiteGlossMat = track(new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, clearcoat: 1.0 }));

  const eqRingGroup = new THREE.Group();
  eqRingGroup.rotation.x = Math.PI / 2.2;
  eqRingGroup.add(new THREE.Mesh(track(new THREE.TorusGeometry(0.84, 0.011, 8, 64)), ringMat));
  [0, 0.25, 2.8].forEach((ang, i) => {
    const dot = new THREE.Mesh(beadGeo, whiteGlossMat);
    dot.scale.setScalar(1 - i * 0.22);
    dot.position.set(Math.cos(ang) * 0.84, Math.sin(ang) * 0.84, 0);
    eqRingGroup.add(dot);
  });

  const tiltRing = new THREE.Mesh(track(new THREE.TorusGeometry(0.94, 0.009, 8, 64)), ringMat);
  tiltRing.rotation.set(Math.PI / 3, 0.45, 0);
  coreGroup.add(eqRingGroup, tiltRing);

  // 2. Calligraphic Tapered Vector Flourish Ribbons
  const swooshGroup = new THREE.Group();
  const makeSpiral = (turns, rBase, ySpan, phase) =>
    Array.from({ length: 42 }, (_, i) => {
      const u = i / 41;
      const a = phase + u * Math.PI * turns;
      const r = rBase + Math.sin(u * Math.PI) * 0.34;
      return new THREE.Vector3(Math.cos(a) * r, (u - 0.5) * ySpan, Math.sin(a) * r);
    });

  const limeFlourish = new THREE.Mesh(
    track(createTaperedSwoosh(makeSpiral(2.3, 1.02, 1.25, 0), 0.085, 1.65)),
    track(new THREE.MeshPhysicalMaterial({ color: 0x84cc16, emissive: 0x4d7c0f, emissiveIntensity: 0.28, roughness: 0.06, clearcoat: 1.0 }))
  );
  const whiteFlourish = new THREE.Mesh(
    track(createTaperedSwoosh(makeSpiral(1.8, 1.12, -0.95, Math.PI * 0.85), 0.052, 1.5)),
    whiteGlossMat
  );
  const cyanFlourish = new THREE.Mesh(
    track(createTaperedSwoosh(makeSpiral(1.6, 0.96, 0.9, Math.PI * 1.6), 0.042, 1.35)),
    track(new THREE.MeshPhysicalMaterial({ color: 0x22d3ee, emissive: 0x0891b2, emissiveIntensity: 0.28, roughness: 0.06, clearcoat: 1.0 }))
  );

  swooshGroup.add(limeFlourish, whiteFlourish, cyanFlourish);
  group.add(swooshGroup);

  // 3. Floating Vector Bezier Leaves, Dew Drops & Halftone Dots
  const leafGeo = track(createVectorLeafGeometry());
  const dewGeo = track(new THREE.SphereGeometry(0.085, 20, 20));
  const leafMat = track(new THREE.MeshPhysicalMaterial({ color: 0x4ade80, emissive: 0x16a34a, emissiveIntensity: 0.25, roughness: 0.06, clearcoat: 1.0 }));
  const dewMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.22,
      roughness: 0.02,
      transmission: 0.88,
      thickness: 0.3,
      ior: 1.35,
      clearcoat: 1.0,
    })
  );

  const orbiters = [];
  for (let i = 0; i < 10; i++) {
    const type = i % 3;
    const mesh = new THREE.Mesh(
      type === 0 ? leafGeo : type === 1 ? dewGeo : beadGeo,
      type === 0 ? leafMat : type === 1 ? dewMat : whiteGlossMat
    );
    const angle = (i / 10) * Math.PI * 2;
    const radius = type === 2 ? 1.32 : 1.54;
    const baseY = Math.sin(i * 1.35) * 0.44;
    mesh.position.set(Math.cos(angle) * radius, baseY, Math.sin(angle) * radius);
    group.add(mesh);
    orbiters.push({ mesh, angle, radius, baseY, isLeaf: type === 0 });
  }

  return {
    group,
    description:
      'Defined by mid-2000s stock vector graphics, corporate eco-initiatives, and Adobe Illustrator pen-tool curves, Vector Flourish pairs glossy eco-globes with tapered lime-green vine swooshes, crisp white rings, and floating dew-kissed leaves.',
    background: 'radial-gradient(circle at 50% 25%, #ffffff 0%, #dcfce7 50%, #38bdf8 100%)',
    update(t, bounce = 0, spring = 0) {
      coreGroup.position.y = Math.sin(t * 1.6) * 0.045 - bounce * 0.38;
      globe.rotation.y = t * 0.45;
      eqRingGroup.rotation.z = t * 0.55;
      tiltRing.rotation.y = -t * 0.4;

      swooshGroup.rotation.y = -t * 0.48;
      swooshGroup.rotation.x = Math.sin(t * 0.45) * 0.16;

      orbiters.forEach((item, idx) => {
        const a = item.angle + t * 0.52;
        item.mesh.position.set(
          Math.cos(a) * item.radius,
          item.baseY + Math.sin(t * 2 + idx) * 0.13,
          Math.sin(a) * item.radius
        );
        if (item.isLeaf) {
          item.mesh.rotation.set(Math.sin(t + idx) * 0.3, -a, t * 0.9 + idx);
        }
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
    dispose() {
      disposables.forEach((d) => d.dispose?.());
    },
  };
}