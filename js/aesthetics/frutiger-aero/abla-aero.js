// js/aesthetics/frutiger-aero/abla-aero.js
import * as THREE from 'three';

function createWaveRibbonGeometry(radius, waveAmp, waveFreq, widthScale, phaseOffset = 0) {
  const points = [];
  const segments = 96;
  const tubularSegments = 120;
  const radialSegments = 12;

  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const r = radius + Math.sin(angle * waveFreq + phaseOffset) * (waveAmp * 0.55);
    const y = Math.cos(angle * waveFreq + phaseOffset) * waveAmp;
    points.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
  }

  const curve = new THREE.CatmullRomCurve3(points, true);
  const tubeGeo = new THREE.TubeGeometry(curve, tubularSegments, 0.08, radialSegments, true);
  const frames = curve.computeFrenetFrames(tubularSegments, true);

  const pos = tubeGeo.attributes.position;
  const v = new THREE.Vector3();
  const center = new THREE.Vector3();
  const ringStride = radialSegments + 1;

  // Flatten consistently along the curve's local Frenet frame for smooth silk tapering
  for (let rIdx = 0; rIdx <= tubularSegments; rIdx++) {
    const u = rIdx / tubularSegments;
    curve.getPointAt(u % 1, center);
    const N = frames.normals[rIdx];
    const B = frames.binormals[rIdx];
    const swell = 0.8 + 0.35 * Math.sin(u * Math.PI * 2 * waveFreq);

    for (let j = 0; j < ringStride; j++) {
      const i = rIdx * ringStride + j;
      v.fromBufferAttribute(pos, i).sub(center);
      const nComp = v.dot(N) * 0.28;
      const bComp = v.dot(B) * widthScale * swell;
      v.copy(N).multiplyScalar(nComp).addScaledVector(B, bComp).add(center);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
  }

  tubeGeo.computeVertexNormals();
  return tubeGeo;
}

function createSunsetCoreTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0.0, '#fef08a');
  grad.addColorStop(0.32, '#fbbf24');
  grad.addColorStop(0.65, '#fb7185');
  grad.addColorStop(1.0, '#f43f5e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Soft golden-hour caustic bands
  ctx.globalAlpha = 0.28;
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#fffbeb' : '#fda4af';
    ctx.beginPath();
    ctx.ellipse(40 + i * 42, 128 + Math.sin(i) * 32, 48, 18, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createAblaAero() {
  const group = new THREE.Group();
  const disposables = [];
  const track = (x) => (disposables.push(x), x);

  // 1. Sunlit Coral & Golden-Hour Refracting Glass Core
  const coreGroup = new THREE.Group();
  const sunTex = track(createSunsetCoreTexture());

  const innerSun = new THREE.Mesh(
    track(new THREE.SphereGeometry(0.56, 32, 32)),
    track(
      new THREE.MeshStandardMaterial({
        map: sunTex,
        emissiveMap: sunTex,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.48,
        roughness: 0.16,
      })
    )
  );

  const outerGlassOrb = new THREE.Mesh(
    track(new THREE.SphereGeometry(0.84, 40, 40)),
    track(
      new THREE.MeshPhysicalMaterial({
        color: 0xfb7185,
        emissive: 0xe11d48,
        emissiveIntensity: 0.14,
        roughness: 0.03,
        transmission: 0.88,
        thickness: 0.9,
        ior: 1.44,
        iridescence: 0.75,
        iridescenceIOR: 1.32,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
      })
    )
  );

  const roseGoldHalo = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.98, 0.02, 14, 64)),
    track(new THREE.MeshStandardMaterial({ color: 0xfda4af, metalness: 0.88, roughness: 0.16 }))
  );
  roseGoldHalo.rotation.set(Math.PI / 2.6, 0.3, 0);

  coreGroup.add(innerSun, outerGlassOrb, roseGoldHalo);
  group.add(coreGroup);

  // 2. Flowing Sunset Silk & Liquid Glass Wave Ribbons
  const goldRibbonMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.28,
      roughness: 0.06,
      transmission: 0.58,
      thickness: 0.3,
      ior: 1.42,
      iridescence: 0.65,
      clearcoat: 1.0,
    })
  );

  const coralRibbonMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xf43f5e,
      emissive: 0xbe123c,
      emissiveIntensity: 0.25,
      roughness: 0.05,
      transmission: 0.62,
      thickness: 0.3,
      ior: 1.43,
      iridescence: 0.75,
      clearcoat: 1.0,
    })
  );

  const ribbon1 = new THREE.Mesh(track(createWaveRibbonGeometry(1.26, 0.24, 3, 1.85, 0)), goldRibbonMat);
  ribbon1.rotation.x = Math.PI / 3.4;

  const ribbon2 = new THREE.Mesh(
    track(createWaveRibbonGeometry(1.16, 0.22, 2, 1.7, Math.PI / 2)),
    coralRibbonMat
  );
  ribbon2.rotation.set(0, Math.PI / 2.6, -0.3);
  group.add(ribbon1, ribbon2);

  // 3. Orbiting Iridescent Golden-Hour Bokeh Bubbles & Rose-Gold Pearls
  const sharedBubbleGeo = track(new THREE.SphereGeometry(1, 20, 20));
  const bubbleMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xfef3c7,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.16,
      roughness: 0.02,
      transmission: 0.9,
      thickness: 0.35,
      ior: 1.34,
      iridescence: 1.0,
      iridescenceIOR: 1.3,
      clearcoat: 1.0,
    })
  );
  const pearlMat = track(
    new THREE.MeshPhysicalMaterial({ color: 0xfecdd3, metalness: 0.35, roughness: 0.14, clearcoat: 1.0 })
  );

  const bubbles = [];
  const bubbleCount = 9;
  for (let i = 0; i < bubbleCount; i++) {
    const radius = 0.065 + (i % 3) * 0.03;
    const b = new THREE.Mesh(sharedBubbleGeo, i % 3 === 0 ? pearlMat : bubbleMat);
    const angle = (i / bubbleCount) * Math.PI * 2;
    const orbitR = 1.45 + (i % 2) * 0.18;
    const baseY = Math.sin(i * 1.4) * 0.46;

    b.scale.setScalar(radius);
    b.position.set(Math.cos(angle) * orbitR, baseY, Math.sin(angle) * orbitR);
    group.add(b);
    bubbles.push({ mesh: b, angle, orbitR, baseY, phase: i * 0.85 });
  }

  return {
    group,
    description:
      'A warm, golden-hour evolution of Frutiger Aero, Abla Aero trades cool cyans for sunset coral, rose-tinted glass, flowing silk wave ribbons, and iridescent dusk-lit bokeh bubbles.',
    background: 'radial-gradient(circle at 50% 30%, #ffe4e6 0%, #fda4af 45%, #f59e0b 100%)',
    update(t, bounce = 0, spring = 0) {
      coreGroup.rotation.y = t * 0.35;
      coreGroup.position.y = Math.sin(t * 1.9) * 0.05 - bounce * 0.4;
      innerSun.rotation.y = t * 0.55;
      innerSun.scale.setScalar(1 + Math.sin(t * 2.8) * 0.05);
      roseGoldHalo.rotation.z = -t * 0.4;

      ribbon1.rotation.y = t * 0.45;
      ribbon1.rotation.z = Math.sin(t * 0.6) * 0.18;
      ribbon2.rotation.x = -t * 0.52;
      ribbon2.rotation.y = Math.PI / 2.6 + t * 0.3;

      bubbles.forEach((b) => {
        const a = b.angle + t * 0.38;
        b.mesh.position.set(
          Math.cos(a) * b.orbitR,
          b.baseY + Math.sin(t * 2.1 + b.phase) * 0.14,
          Math.sin(a) * b.orbitR
        );
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
    dispose() {
      disposables.forEach((d) => d.dispose?.());
    },
  };
}