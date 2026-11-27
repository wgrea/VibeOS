// js/aesthetics/frutiger-aero/dorfic.js
import * as THREE from 'three';

function createGraphicBandTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 128);

  // Clean sunlit orange & crimson-red vector racing stripes
  ctx.fillStyle = '#ff6b00';
  ctx.fillRect(0, 14, 512, 14);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(0, 32, 512, 7);

  // Diagonal futuristic slashes & micro-telemetry
  for (let x = 24; x < 512; x += 128) {
    ctx.fillStyle = '#ff6b00';
    ctx.beginPath();
    ctx.moveTo(x, 62);
    ctx.lineTo(x + 22, 62);
    ctx.lineTo(x + 8, 102);
    ctx.lineTo(x - 14, 102);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x + 28, 66, 8, 32);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('DORF // 01', x + 46, 82);
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('SOLAR_SYS.06', x + 46, 98);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

export function createDorfic() {
  const group = new THREE.Group();
  const disposables = [];
  const track = (x) => (disposables.push(x), x);

  const whiteGlossMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.06,
      metalness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    })
  );

  const chromeMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.92,
      roughness: 0.12,
    })
  );

  const orangeGlossMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xff6b00,
      emissive: 0xea580c,
      emissiveIntensity: 0.3,
      roughness: 0.08,
      clearcoat: 1.0,
    })
  );

  const crimsonGlossMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.25,
      roughness: 0.08,
      clearcoat: 1.0,
    })
  );

  const tangerineGlassMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xff7a00,
      emissive: 0xd9480f,
      emissiveIntensity: 0.2,
      roughness: 0.03,
      transmission: 0.86,
      thickness: 0.45,
      ior: 1.47,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    })
  );

  // 1. Sleek White & Tangerine-Red Ergonomic Pod
  const chassisGroup = new THREE.Group();

  const core = new THREE.Mesh(
    track(new THREE.CapsuleGeometry(0.54, 0.72, 20, 36)),
    whiteGlossMat
  );
  chassisGroup.add(core);

  // Molded graphic stripe collar wrapped flush around lower cylindrical hull
  const bandTex = track(createGraphicBandTexture());
  const graphicBand = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.544, 0.544, 0.22, 48, 1, true)),
    track(new THREE.MeshPhysicalMaterial({ map: bandTex, roughness: 0.1, clearcoat: 1.0 }))
  );
  graphicBand.position.y = -0.22;
  chassisGroup.add(graphicBand);

  // Split Chrome & Crimson-Orange Waist Collar
  const waistChrome = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.555, 0.026, 16, 48)),
    chromeMat
  );
  waistChrome.rotation.x = Math.PI / 2;
  waistChrome.position.y = -0.07;

  const waistOrange = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.562, 0.042, 18, 48)),
    orangeGlossMat
  );
  waistOrange.rotation.x = Math.PI / 2;
  waistOrange.position.y = -0.01;
  chassisGroup.add(waistChrome, waistOrange);

  // Front & Back Chrome-Beveled Optical Bays with Refracted Glowing Core
  const sleeveGeo = track(new THREE.CylinderGeometry(0.27, 0.3, 0.11, 36));
  const bezelGeo = track(new THREE.TorusGeometry(0.265, 0.025, 14, 40));
  const dishGeo = track(new THREE.CylinderGeometry(0.245, 0.245, 0.015, 32));
  const dishMat = track(new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.35 }));
  const coreOrbGeo = track(new THREE.SphereGeometry(0.115, 20, 20));
  const coreRingGeo = track(new THREE.TorusGeometry(0.175, 0.018, 12, 32));
  const visorGeo = track(new THREE.SphereGeometry(0.255, 28, 28));
  visorGeo.scale(1, 1, 0.42);

  const coreOrbMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xff9f1c,
      emissive: 0xff5500,
      emissiveIntensity: 1.25,
      roughness: 0.15,
    })
  );

  const pulseCores = [];
  [-1, 1].forEach((dir) => {
    const bay = new THREE.Group();
    bay.position.set(0, 0.2, 0);
    if (dir === -1) bay.rotation.y = Math.PI;

    const sleeve = new THREE.Mesh(sleeveGeo, chromeMat);
    sleeve.rotation.x = Math.PI / 2;
    sleeve.position.z = 0.525;

    const bezel = new THREE.Mesh(bezelGeo, chromeMat);
    bezel.position.z = 0.578;

    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.rotation.x = Math.PI / 2;
    dish.position.z = 0.555;

    const orb = new THREE.Mesh(coreOrbGeo, coreOrbMat);
    orb.position.z = 0.572;

    const innerRing = new THREE.Mesh(coreRingGeo, crimsonGlossMat);
    innerRing.position.z = 0.574;

    const visor = new THREE.Mesh(visorGeo, tangerineGlassMat);
    visor.position.z = 0.58;

    bay.add(sleeve, bezel, dish, orb, innerRing, visor);
    chassisGroup.add(bay);
    pulseCores.push(orb);
  });

  // Curve-fitted Status LEDs along Lower Front Hull
  const leds = [-0.14, 0, 0.14].map((x, idx) => {
    const mat = track(
      new THREE.MeshStandardMaterial({
        color: idx === 1 ? 0xef4444 : 0xff6b00,
        emissive: idx === 1 ? 0xef4444 : 0xff6b00,
        emissiveIntensity: 1.0,
      })
    );
    const dot = new THREE.Mesh(track(new THREE.SphereGeometry(0.024, 12, 12)), mat);
    const zCurve = Math.sqrt(0.54 * 0.54 - x * x) + 0.008;
    dot.position.set(x, -0.37, zCurve);
    chassisGroup.add(dot);
    return mat;
  });

  chassisGroup.rotation.z = Math.PI / 7;
  group.add(chassisGroup);

  // 2. Dual Kinetic Architectural Rings with Riding Nodes
  const outerRingGroup = new THREE.Group();
  outerRingGroup.rotation.set(Math.PI / 2.4, -0.22, 0);
  const haloRing = new THREE.Mesh(track(new THREE.TorusGeometry(1.24, 0.028, 16, 64)), whiteGlossMat);
  const ringBeacon = new THREE.Mesh(track(new THREE.SphereGeometry(0.075, 16, 16)), crimsonGlossMat);
  ringBeacon.position.x = 1.24;
  outerRingGroup.add(haloRing, ringBeacon);
  group.add(outerRingGroup);

  const innerGimbal = new THREE.Mesh(track(new THREE.TorusGeometry(0.98, 0.015, 12, 56)), chromeMat);
  innerGimbal.rotation.set(-Math.PI / 3, 0.4, 0);
  group.add(innerGimbal);

  // 3. Orbiting Mini-Pods, Tangerine Gel & Crimson Gel Droplets
  const satellites = [];
  const miniPillGeo = track(new THREE.CapsuleGeometry(0.085, 0.16, 12, 20));
  const gelDropGeo = track(new THREE.SphereGeometry(0.125, 22, 22));

  for (let i = 0; i < 6; i++) {
    const mode = i % 3;
    const sat = new THREE.Mesh(
      mode === 0 ? miniPillGeo : gelDropGeo,
      mode === 0 ? whiteGlossMat : mode === 1 ? tangerineGlassMat : crimsonGlossMat
    );
    if (mode === 0) sat.rotation.z = Math.PI / 4;

    const angle = (i / 6) * Math.PI * 2;
    const baseY = Math.sin(angle * 2) * 0.34;
    sat.position.set(Math.cos(angle) * 1.5, baseY, Math.sin(angle) * 1.5);
    group.add(sat);
    satellites.push({ mesh: sat, angle, baseY, isPill: mode === 0 });
  }

  return {
    group,
    description:
      'Standing for Daylight, Orange, Red, and Futuristic, DORFic merges sterile sunlit white minimalism, seamless mid-2000s industrial hardware curves, and vibrant translucent tangerine and crimson gel accents.',
    background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #ffedd5 52%, #fb923c 100%)',
    update(t, bounce = 0, spring = 0) {
      chassisGroup.rotation.y = t * 0.55;
      chassisGroup.position.y = Math.sin(t * 2) * 0.05 - bounce * 0.42;

      outerRingGroup.rotation.z = -t * 0.65;
      innerGimbal.rotation.z = t * 0.45;
      innerGimbal.rotation.y = Math.sin(t * 0.5) * 0.3;

      const corePulse = 1 + Math.sin(t * 3.5) * 0.08;
      pulseCores.forEach((orb) => orb.scale.setScalar(corePulse));
      leds.forEach((mat, i) => {
        mat.emissiveIntensity = 0.55 + Math.max(0, Math.sin(t * 4.2 - i * 0.9)) * 1.1;
      });

      satellites.forEach((s, idx) => {
        const a = s.angle + t * 0.72;
        s.mesh.position.set(Math.cos(a) * 1.5, s.baseY + Math.sin(t * 2.2 + idx) * 0.16, Math.sin(a) * 1.5);
        if (s.isPill) s.mesh.rotation.y = t * 1.4 + idx;
      });

      group.scale.setScalar(1 + spring * 0.26);
    },
    dispose() {
      disposables.forEach((d) => d.dispose?.());
    },
  };
}