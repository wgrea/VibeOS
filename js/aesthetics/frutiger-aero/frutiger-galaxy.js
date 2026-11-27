// js/aesthetics/frutiger-aero/frutiger-galaxy.js
import * as THREE from 'three';

// 4-point sparkle geometry (generic 2000s space-clip-art vocabulary)
function makeSparkleGeometry(size = 0.1) {
  const shape = new THREE.Shape();
  const outer = size;
  const inner = size * 0.28;
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, { depth: 0.02, bevelEnabled: false });
}

// 5-point star geometry (generic star motif, not a game collectible)
function makeStarGeometry(outerR = 0.5, innerR = 0.22) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.03,
    bevelSegments: 2,
  });
  geo.center();
  return geo;
}

export function createFrutigerGalaxy() {
  const group = new THREE.Group();

  // 1. Central Star Motif (champagne-amber, not saturated gold)
  const starCore = new THREE.Mesh(
    makeStarGeometry(0.5, 0.21),
    new THREE.MeshPhysicalMaterial({
      color: 0xfde68a,        // pale champagne, not Mario gold
      emissive: 0xd97706,
      emissiveIntensity: 0.9,
      roughness: 0.08,
      metalness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
    })
  );
  group.add(starCore);

  // Soft glow behind the star motif
  const starGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 24, 24),
    new THREE.MeshBasicMaterial({
      color: 0xfef3c7,
      transparent: true,
      opacity: 0.7,
    })
  );
  group.add(starGlow);

  // 2. Translucent Aqua Nebula Shell
  const nebulaShell = new THREE.Mesh(
    new THREE.SphereGeometry(0.98, 32, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x312e81,
      emissiveIntensity: 0.5,
      roughness: 0.04,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    })
  );
  group.add(nebulaShell);

  // Equatorial glass ring on the shell
  const shellRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.99, 0.012, 10, 96),
    new THREE.MeshStandardMaterial({
      color: 0xa5f3fc,
      emissive: 0x22d3ee,
      emissiveIntensity: 0.7,
      roughness: 0.1,
      metalness: 0.6,
      transparent: true,
      opacity: 0.55,
    })
  );
  shellRing.rotation.x = Math.PI / 2;
  group.add(shellRing);

  // 3. Drifting Sparkle Field (mixed violet/aqua/pink, not all gold)
  const sparkleGeo = makeSparkleGeometry(0.09);
  const sparkleColors = [0xe879f9, 0x67e8f9, 0xf9a8d4, 0xfcd34d];
  const sparkles = [];
  const SPARKLE_COUNT = 18;
  for (let i = 0; i < SPARKLE_COUNT; i++) {
    const col = sparkleColors[i % sparkleColors.length];
    const bit = new THREE.Mesh(
      sparkleGeo,
      new THREE.MeshPhysicalMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 1.1,
        roughness: 0.04,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.92,
      })
    );
    const angle = (i / SPARKLE_COUNT) * Math.PI * 2;
    const radius = 1.28 + (i % 3) * 0.22;
    bit.position.set(
      Math.cos(angle) * radius,
      Math.sin(i * 1.3) * 0.42,
      Math.sin(angle) * radius
    );
    bit.lookAt(0, bit.position.y * 0.2, 0);
    sparkles.push({ mesh: bit, baseY: bit.position.y, phase: i * 0.6, angle, radius });
    group.add(bit);
  }

  // 4. Pastel Orb Ring (small glossy spheres — generic bokeh, not "Lumas")
  const orbColors = [0x67e8f9, 0xa855f7, 0x34d399, 0xf472b6];
  const orbs = [];
  const ORB_COUNT = 8;
  for (let i = 0; i < ORB_COUNT; i++) {
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 16, 16),
      new THREE.MeshPhysicalMaterial({
        color: orbColors[i % orbColors.length],
        emissive: orbColors[i % orbColors.length],
        emissiveIntensity: 0.85,
        roughness: 0.05,
        clearcoat: 1.0,
      })
    );
    const angle = (i / ORB_COUNT) * Math.PI * 2;
    const radius = 0.72;
    orb.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    orb.userData = { angle, radius, phase: i * 0.9 };
    orbs.push(orb);
    group.add(orb);

    // Soft bokeh halo
    const halo = new THREE.Mesh(
      new THREE.PlaneGeometry(0.32, 0.32),
      new THREE.MeshBasicMaterial({
        color: orbColors[i % orbColors.length],
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      })
    );
    halo.position.copy(orb.position);
    orb.userData.halo = halo;
    group.add(halo);
  }

  // 5. Aurora Ribbon (the Frutiger wave — kept from your original)
  const auroraPoints = [];
  for (let i = 0; i <= 40; i++) {
    const u = i / 40;
    const angle = (u - 0.5) * Math.PI * 1.35;
    const r = 1.55 + Math.sin(u * Math.PI) * 0.22;
    const y = (u - 0.5) * 1.2;
    auroraPoints.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
  }
  const auroraRibbon = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(auroraPoints), 64, 0.06, 10, false),
    new THREE.MeshPhysicalMaterial({
      color: 0xe879f9,
      emissive: 0xa855f7,
      emissiveIntensity: 0.55,
      roughness: 0.05,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
    })
  );
  auroraRibbon.rotation.z = 0.35;
  group.add(auroraRibbon);

  // 6. Starfield backdrop
  const starCount = 900;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 3.5 + Math.random() * 2.0;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.cos(phi);
    starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starField = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.025,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      depthWrite: false,
    })
  );
  group.add(starField);

  // 7. Lighting: warm amber key + cool violet fill
  const warmKey = new THREE.PointLight(0xfcd34d, 2.6, 12);
  warmKey.position.set(2.4, 1.8, 2.0);
  group.add(warmKey);

  const coolFill = new THREE.PointLight(0x8b5cf6, 2.2, 12);
  coolFill.position.set(-2.4, -1.2, 1.8);
  group.add(coolFill);

  const amb = new THREE.AmbientLight(0x1e1b4b, 0.6);
  group.add(amb);

  return {
    group,
    description:
      'Late-2000s cosmic wallpaper revival — deep violet nebulae, aqua planet shells, a translucent nebula dome, drifting pastel sparkles, glossy bokeh orbs, and a soft starfield. Frutiger Aero\'s optimistic space-future rendered in glass and light.',
    background:
      'radial-gradient(circle at 50% 35%, #3b0764 0%, #0c4a6e 55%, #030712 100%)',
    update(t, bounce, spring) {
      // Central star motif: slow rotation + gentle pulse
      starCore.rotation.y = t * 0.35;
      starCore.rotation.z = Math.sin(t * 0.4) * 0.08;
      const pulse = 1 + Math.sin(t * 2.2) * 0.05;
      starCore.scale.setScalar(pulse);
      starGlow.scale.setScalar(pulse * 1.02);

      // Nebula shell + ring: very slow counter-spin
      nebulaShell.rotation.y = t * 0.12;
      shellRing.rotation.z = t * 0.25;

      // Sparkle field: orbit + bob + spin
      sparkles.forEach((s) => {
        const a = s.angle + t * 0.55;
        s.mesh.position.x = Math.cos(a) * s.radius;
        s.mesh.position.z = Math.sin(a) * s.radius;
        s.mesh.position.y = s.baseY + Math.sin(t * 2.0 + s.phase) * 0.1;
        s.mesh.rotation.y = t * 1.8 + s.phase;
        s.mesh.rotation.x = Math.sin(t * 1.1 + s.phase) * 0.4;
      });

      // Orb ring: orbit + bob; halo follows
      orbs.forEach((o) => {
        const u = o.userData;
        const a = u.angle + t * 0.35;
        o.position.x = Math.cos(a) * u.radius;
        o.position.z = Math.sin(a) * u.radius;
        o.position.y = Math.sin(t * 1.6 + u.phase) * 0.08;
        if (u.halo) {
          u.halo.position.copy(o.position);
          u.halo.material.opacity = 0.12 + Math.abs(Math.sin(t * 2.0 + u.phase)) * 0.12;
        }
        o.scale.setScalar(1 + Math.sin(t * 3.0 + u.phase) * 0.08);
      });

      // Aurora + starfield drift
      auroraRibbon.rotation.y = Math.sin(t * 0.35) * 0.2;
      starField.rotation.y = t * 0.015;
      starField.rotation.x = Math.sin(t * 0.1) * 0.05;

      group.scale.setScalar(1 + spring * 0.22 - bounce * 0.06);
    },
  };
}