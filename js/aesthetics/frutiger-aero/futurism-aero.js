// js/aesthetics/frutiger-aero/futurism-aero.js
import * as THREE from 'three';

function createCoreHudTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#a5f3fc');
  grad.addColorStop(0.5, '#06b6d4');
  grad.addColorStop(1, '#0284c7');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  // Clean-energy telemetry grid & scan bands
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 2;
  for (let y = 32; y < 256; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }
  for (let x = 0; x < 512; x += 64) {
    ctx.strokeRect(x + 12, 86, 40, 84);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(x + 20, 120, 24, 16);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createFuturismAero() {
  const group = new THREE.Group();
  const disposables = [];
  const track = (x) => (disposables.push(x), x);

  const pearlMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.05,
      metalness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    })
  );

  const chromeMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.14,
    })
  );

  const cyanGlowMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 1.1,
      roughness: 0.06,
      clearcoat: 1.0,
    })
  );

  // 1. Holographic Cyan Core + Refractive Glass Shell + Stabilizer Cowls
  const coreGroup = new THREE.Group();
  const hudTex = track(createCoreHudTexture());

  const innerCore = new THREE.Mesh(
    track(new THREE.SphereGeometry(0.45, 32, 32)),
    track(
      new THREE.MeshStandardMaterial({
        map: hudTex,
        emissiveMap: hudTex,
        emissive: 0x22d3ee,
        emissiveIntensity: 0.75,
        roughness: 0.12,
      })
    )
  );

  const glassShell = new THREE.Mesh(
    track(new THREE.SphereGeometry(0.68, 36, 36)),
    track(
      new THREE.MeshPhysicalMaterial({
        color: 0xe0f2fe,
        roughness: 0.03,
        transmission: 0.9,
        thickness: 0.7,
        ior: 1.45,
        iridescence: 0.7,
        iridescenceIOR: 1.3,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
      })
    )
  );

  const cowlGeo = track(new THREE.TorusGeometry(0.77, 0.055, 14, 40, Math.PI * 0.7));
  const cowlL = new THREE.Mesh(cowlGeo, pearlMat);
  cowlL.rotation.z = Math.PI * 0.65;
  const cowlR = new THREE.Mesh(cowlGeo, pearlMat);
  cowlR.rotation.z = -Math.PI * 0.35;

  coreGroup.add(innerCore, glassShell, cowlL, cowlR);
  group.add(coreGroup);

  // 2. Engineered White-Pearl & Cyan Gyroscopic Gimbal Rings
  const clipGeo = track(new THREE.BoxGeometry(0.12, 0.14, 0.13));
  const nodeGeo = track(new THREE.SphereGeometry(0.055, 14, 14));

  const buildGimbal = (radius, tube, mat, addClips) => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(track(new THREE.TorusGeometry(radius, tube, 16, 64)), mat));
    if (addClips) {
      [0, Math.PI].forEach((a) => {
        const clip = new THREE.Mesh(clipGeo, chromeMat);
        clip.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
        clip.rotation.z = a;
        const pip = new THREE.Mesh(nodeGeo, cyanGlowMat);
        pip.position.set(Math.cos(a + Math.PI / 2) * radius, Math.sin(a + Math.PI / 2) * radius, 0);
        g.add(clip, pip);
      });
    }
    group.add(g);
    return g;
  };

  const g1 = buildGimbal(1.04, 0.045, pearlMat, true);
  const g2 = buildGimbal(1.32, 0.045, pearlMat, true);
  const g3 = buildGimbal(1.58, 0.03, cyanGlowMat, false);

  // 3. Precision HUD Equatorial Track & Properly Aligned Aerodynamic Pods
  const trackRing = new THREE.Group();
  trackRing.rotation.x = Math.PI / 2.2;
  trackRing.add(
    new THREE.Mesh(
      track(new THREE.TorusGeometry(1.82, 0.012, 8, 64)),
      track(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }))
    )
  );
  group.add(trackRing);

  const podGeo = track(new THREE.CapsuleGeometry(0.055, 0.15, 12, 20));
  const podBandGeo = track(new THREE.CylinderGeometry(0.06, 0.06, 0.032, 16));
  const podCount = 6;
  const rTrack = 1.82;

  for (let i = 0; i < podCount; i++) {
    const angle = (i / podCount) * Math.PI * 2;
    const podGroup = new THREE.Group();
    podGroup.position.set(Math.cos(angle) * rTrack, Math.sin(angle) * rTrack, 0);
    podGroup.rotation.z = angle;

    podGroup.add(new THREE.Mesh(podGeo, pearlMat));
    podGroup.add(new THREE.Mesh(podBandGeo, cyanGlowMat));
    trackRing.add(podGroup);
  }

  return {
    group,
    description:
      'Rooted in mid-2000s utopian sci-fi interfaces, clean-energy concept hardware, and titles like Mirror’s Edge and Portal, Futurism Aero fuses glossy white-pearl curves with glowing cyan HUD cores, refractive glass spheres, and kinetic gyroscopic rings.',
    background: 'radial-gradient(circle at 50% 35%, #e0f2fe 0%, #38bdf8 55%, #0369a1 100%)',
    update(t, bounce = 0, spring = 0) {
      coreGroup.position.y = Math.sin(t * 1.8) * 0.04 - bounce * 0.35;
      coreGroup.rotation.y = t * 0.35;
      innerCore.rotation.y = t * 0.7;
      innerCore.scale.setScalar(1 + Math.sin(t * 2.5) * 0.05);

      g1.rotation.set(t * 0.85, t * 0.4, 0);
      g2.rotation.set(0, -t * 0.65, t * 0.5);
      g3.rotation.set(Math.PI / 3 + Math.sin(t * 0.6) * 0.3, 0, t * 0.35);

      trackRing.rotation.z = t * 0.35;

      group.scale.setScalar(1 + spring * 0.25);
    },
    dispose() {
      disposables.forEach((d) => d.dispose?.());
    },
  };
}