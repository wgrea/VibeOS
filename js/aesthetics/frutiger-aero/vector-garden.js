// js/aesthetics/frutiger-aero/vector-garden.js
import * as THREE from 'three';

function createHillTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#bef264');
  grad.addColorStop(0.55, '#4ade80');
  grad.addColorStop(1, '#16a34a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  // Layered stock-vector contour waves
  const bands = [
    { y: 120, amp: 18, color: 'rgba(255, 255, 255, 0.22)' },
    { y: 165, amp: 22, color: 'rgba(190, 242, 100, 0.35)' },
    { y: 210, amp: 16, color: 'rgba(21, 128, 61, 0.28)' },
  ];
  bands.forEach((b, idx) => {
    ctx.beginPath();
    ctx.moveTo(0, 256);
    for (let x = 0; x <= 512; x += 16) {
      const y = b.y + Math.sin((x / 512) * Math.PI * 4 + idx * 1.4) * b.amp;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(512, 256);
    ctx.closePath();
    ctx.fillStyle = b.color;
    ctx.fill();
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createBezierShapeGeo(drawFn, depth = 0.014) {
  const shape = new THREE.Shape();
  drawFn(shape);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.008,
    bevelThickness: 0.008,
  });
  geo.center();
  return geo;
}

export function createVectorGarden() {
  const group = new THREE.Group();
  const gardenGroup = new THREE.Group();
  group.add(gardenGroup);

  const disposables = [];
  const track = (x) => (disposables.push(x), x);

  // 1. Floating-Island Vector Hill Mound (sealed underneath)
  const hillTex = track(createHillTexture());
  const hill = new THREE.Mesh(
    track(new THREE.SphereGeometry(1.12, 36, 24, 0, Math.PI * 2, 0, Math.PI / 2)),
    track(new THREE.MeshPhysicalMaterial({ map: hillTex, roughness: 0.12, clearcoat: 1.0, clearcoatRoughness: 0.04 }))
  );
  hill.position.y = -0.68;

  const basePlinth = new THREE.Mesh(
    track(new THREE.CylinderGeometry(1.13, 0.96, 0.09, 40)),
    track(new THREE.MeshPhysicalMaterial({ color: 0xf8fafc, roughness: 0.08, clearcoat: 1.0 }))
  );
  basePlinth.position.y = -0.725;
  gardenGroup.add(hill, basePlinth);

  // 2. Curved Glossy Stems & Bezier Vector Grass Blades
  const stemMat = track(new THREE.MeshPhysicalMaterial({ color: 0x22c55e, emissive: 0x15803d, emissiveIntensity: 0.22, roughness: 0.08, clearcoat: 1.0 }));
  const makeStem = (pts, r) =>
    new THREE.Mesh(track(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 22, r, 10, false)), stemMat);

  const mainStem = makeStem(
    [new THREE.Vector3(0, 0.34, 0), new THREE.Vector3(-0.07, 0.62, 0.02), new THREE.Vector3(0, 0.9, 0.04)],
    0.032
  );
  const miniStem = makeStem(
    [new THREE.Vector3(-0.42, 0.3, 0.24), new THREE.Vector3(-0.5, 0.48, 0.26), new THREE.Vector3(-0.46, 0.63, 0.28)],
    0.022
  );
  gardenGroup.add(mainStem, miniStem);

  const bladeGeo = track(
    createBezierShapeGeo((s) => {
      s.moveTo(0, -0.22);
      s.bezierCurveTo(0.11, -0.05, 0.08, 0.14, 0.02, 0.28);
      s.bezierCurveTo(-0.05, 0.12, -0.09, -0.06, 0, -0.22);
    }, 0.01)
  );
  const bladeMat = track(new THREE.MeshPhysicalMaterial({ color: 0x84cc16, emissive: 0x4d7c0f, emissiveIntensity: 0.2, roughness: 0.08, clearcoat: 1.0 }));

  [
    [-0.28, 0.48, 0.18, 0.18, 0.3, 0.42, 1.05],
    [0.3, 0.47, -0.14, -0.15, -0.4, -0.45, 1.0],
    [-0.14, 0.5, -0.28, -0.25, 0.8, 0.25, 0.9],
    [0.24, 0.48, 0.28, 0.22, -0.5, -0.32, 0.95],
    [-0.6, 0.4, 0.34, 0.2, 0.4, 0.52, 0.78],
  ].forEach(([x, y, z, rx, ry, rz, sc]) => {
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.set(x, y, z);
    blade.rotation.set(rx, ry, rz);
    blade.scale.setScalar(sc);
    gardenGroup.add(blade);
  });

  // 3. Main Sunny Vector Daisy & Companion White Mini Daisy
  const petalGeo = track(
    createBezierShapeGeo((s) => {
      s.moveTo(0, -0.14);
      s.bezierCurveTo(0.14, -0.02, 0.15, 0.14, 0, 0.2);
      s.bezierCurveTo(-0.15, 0.14, -0.14, -0.02, 0, -0.14);
    }, 0.018)
  );
  const yellowPetalMat = track(new THREE.MeshPhysicalMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 0.26, roughness: 0.06, clearcoat: 1.0 }));
  const whitePetalMat = track(new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.06, clearcoat: 1.0 }));
  const skyCoreMat = track(new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.24, roughness: 0.04, clearcoat: 1.0 }));

  const buildFlower = (petalMat, coreMat, scale = 1) => {
    const fg = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const p = new THREE.Mesh(petalGeo, petalMat);
      p.position.set(Math.cos(a) * 0.28, Math.sin(a) * 0.28, 0);
      p.rotation.z = a - Math.PI / 2;
      fg.add(p);
    }
    fg.add(new THREE.Mesh(track(new THREE.SphereGeometry(0.17, 22, 22)), coreMat));
    fg.scale.setScalar(scale);
    return fg;
  };

  const flowerGroup = buildFlower(yellowPetalMat, skyCoreMat, 1.0);
  flowerGroup.position.set(0, 0.9, 0.05);
  flowerGroup.rotation.x = -0.14;

  const miniFlower = buildFlower(whitePetalMat, yellowPetalMat, 0.55);
  miniFlower.position.set(-0.46, 0.63, 0.29);
  miniFlower.rotation.set(-0.2, 0.35, 0.2);
  gardenGroup.add(flowerGroup, miniFlower);

  // 4. Fluttering Glossy Cyan Vector Butterfly
  const butterfly = new THREE.Group();
  const wingGeo = track(
    createBezierShapeGeo((s) => {
      s.moveTo(0, 0);
      s.bezierCurveTo(0.14, 0.14, 0.16, 0.02, 0.09, -0.02);
      s.bezierCurveTo(0.13, -0.08, 0.06, -0.14, 0, -0.03);
    }, 0.008)
  );
  const wingMat = track(new THREE.MeshPhysicalMaterial({ color: 0x22d3ee, emissive: 0x0891b2, emissiveIntensity: 0.3, roughness: 0.05, clearcoat: 1.0 }));
  const wingL = new THREE.Mesh(wingGeo, wingMat);
  wingL.position.x = -0.06;
  wingL.scale.x = -1;
  const wingR = new THREE.Mesh(wingGeo, wingMat);
  wingR.position.x = 0.06;
  butterfly.add(wingL, wingR);
  gardenGroup.add(butterfly);

  // 5. Floating Refractive Dew Drops
  const dewGeo = track(new THREE.SphereGeometry(0.08, 18, 18));
  const dewMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.18,
      roughness: 0.02,
      transmission: 0.88,
      thickness: 0.25,
      ior: 1.34,
      iridescence: 0.85,
      clearcoat: 1.0,
    })
  );
  const dewDrops = Array.from({ length: 8 }, (_, i) => {
    const dew = new THREE.Mesh(dewGeo, dewMat);
    const a = (i / 8) * Math.PI * 2;
    const baseY = 0.12 + (i % 3) * 0.34;
    dew.position.set(Math.cos(a) * 1.28, baseY, Math.sin(a) * 1.28);
    gardenGroup.add(dew);
    return { mesh: dew, baseY, phase: i * 0.9 };
  });

  return {
    group,
    description:
      'Blending mid-2000s vector nature illustrations with playful early-web eco-optimism, Vector Garden pairs rolling lime-green vector hills and curved grass blades with glossy daisy blooms, fluttering cyan butterflies, and floating morning dew drops.',
    background: 'radial-gradient(circle at 50% 25%, #e0f2fe 0%, #7dd3fc 50%, #22c55e 100%)',
    update(t, bounce = 0, spring = 0) {
      gardenGroup.rotation.y = Math.sin(t * 0.4) * 0.28;
      gardenGroup.position.y = -bounce * 0.34;

      flowerGroup.rotation.z = t * 0.6;
      miniFlower.rotation.z = -t * 0.75;

      const ba = t * 0.85;
      butterfly.position.set(Math.cos(ba) * 0.72, 0.85 + Math.sin(t * 2.6) * 0.12, Math.sin(ba) * 0.72);
      butterfly.rotation.y = -ba + Math.PI / 2;
      const flap = Math.sin(t * 9.5) * 0.65;
      wingL.rotation.y = flap;
      wingR.rotation.y = -flap;

      dewDrops.forEach((d) => {
        d.mesh.position.y = d.baseY + Math.sin(t * 2.4 + d.phase) * 0.12;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
    dispose() {
      disposables.forEach((d) => d.dispose?.());
    },
  };
}