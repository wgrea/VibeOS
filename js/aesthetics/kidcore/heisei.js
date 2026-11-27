// js/aesthetics/kidcore/heisei.js
import * as THREE from 'three';

function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function makeCanvasTex(w, h, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext('2d'), w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createHeisei() {
  const group = new THREE.Group();
  const heroGroup = new THREE.Group();
  group.add(heroGroup);

  const disposables = [];
  const track = (x) => (disposables.push(x), x);

  const mdTex = track(
    makeCanvasTex(256, 256, (ctx) => {
      const grad = ctx.createConicGradient(0.4, 128, 128);
      ['#f9a8d4', '#c4b5fd', '#99f6e4', '#fbcfe8', '#a5f3fc', '#f9a8d4'].forEach((c, i, a) =>
        grad.addColorStop(i / (a.length - 1), c)
      );
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);

      ctx.beginPath();
      ctx.arc(128, 128, 110, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.arc(128, 128, 54, 0.8 * Math.PI, 0.2 * Math.PI, true);
      ctx.closePath();
      ctx.fillStyle = '#fdf2f8';
      ctx.fill();
      ctx.fillStyle = '#7e22ce';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('MD-74 ♪ HEISEI', 128, 206);
    })
  );

  const lcdTex = track(
    makeCanvasTex(256, 112, (ctx) => {
      const bg = ctx.createLinearGradient(0, 0, 256, 112);
      bg.addColorStop(0, '#cffafe');
      bg.addColorStop(1, '#a5f3fc');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 256, 112);
      ctx.fillStyle = '#0e7490';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('MDLP   BASS+', 14, 24);
      ctx.strokeStyle = '#0e7490';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(208, 11, 32, 14);
      ctx.fillRect(212, 14, 18, 8);
      ctx.fillStyle = '#155e75';
      ctx.font = 'bold 34px monospace';
      ctx.fillText('01 02:48', 14, 66);
      ctx.fillStyle = '#0891b2';
      ctx.font = 'bold 15px monospace';
      ctx.fillText('♪ SHIBUYA_SKY.MD', 14, 96);
    })
  );

  // Materials
  const silverMat = track(new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.84, roughness: 0.22 }));
  const backMat = track(new THREE.MeshPhysicalMaterial({ color: 0xf5d0fe, roughness: 0.25, clearcoat: 0.9 }));
  const lidMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xc084fc,
      emissive: 0x9333ea,
      emissiveIntensity: 0.12,
      roughness: 0.1,
      transmission: 0.68,
      ior: 1.48,
      thickness: 0.25,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    })
  );

  // 1. Clamshell MD Player Body (Back -> Silver Seam -> Spinning Disc -> Translucent Lid)
  const shellShape = roundedRect(1.52, 1.0, 0.14);
  const backMesh = new THREE.Mesh(
    track(new THREE.ExtrudeGeometry(shellShape, { depth: 0.06, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.015, bevelThickness: 0.015 })),
    backMat
  );
  backMesh.position.z = -0.065;

  const midMesh = new THREE.Mesh(
    track(new THREE.ExtrudeGeometry(roundedRect(1.46, 0.94, 0.12), { depth: 0.036, bevelEnabled: false })),
    silverMat
  );
  midMesh.position.z = 0.01;

  const discWell = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.38, 0.38, 0.008, 40)),
    track(new THREE.MeshStandardMaterial({ color: 0x3b0764, roughness: 0.65 }))
  );
  discWell.rotation.x = Math.PI / 2;
  discWell.position.set(-0.21, 0.02, 0.047);

  const discGroup = new THREE.Group();
  discGroup.position.set(-0.21, 0.02, 0.056);
  const discMesh = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.34, 0.34, 0.012, 40)),
    [silverMat, track(new THREE.MeshStandardMaterial({ map: mdTex, metalness: 0.5, roughness: 0.22 })), silverMat]
  );
  discMesh.rotation.x = Math.PI / 2;
  const spindle = new THREE.Mesh(track(new THREE.CylinderGeometry(0.055, 0.055, 0.018, 20)), silverMat);
  spindle.rotation.x = Math.PI / 2;
  discGroup.add(discMesh, spindle);

  const shutter = new THREE.Mesh(track(new THREE.BoxGeometry(0.17, 0.28, 0.014)), silverMat);
  shutter.position.set(-0.41, 0.02, 0.057);

  const lidMesh = new THREE.Mesh(
    track(new THREE.ExtrudeGeometry(shellShape, { depth: 0.028, bevelEnabled: true, bevelSegments: 4, bevelSize: 0.012, bevelThickness: 0.012 })),
    lidMat
  );
  lidMesh.position.z = 0.08;
  heroGroup.add(backMesh, midMesh, discWell, discGroup, shutter, lidMesh);

  // 2. EL-Backlit LCD, EQ Bars, LED & Chrome Controls
  const lcdBezel = new THREE.Mesh(
    track(new THREE.ExtrudeGeometry(roundedRect(0.54, 0.25, 0.035), { depth: 0.01, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.004, bevelThickness: 0.004 })),
    silverMat
  );
  lcdBezel.position.set(0.41, 0.23, 0.122);

  const lcdScreen = new THREE.Mesh(
    track(new THREE.PlaneGeometry(0.48, 0.2)),
    track(new THREE.MeshStandardMaterial({ map: lcdTex, emissiveMap: lcdTex, emissive: 0x67e8f9, emissiveIntensity: 0.6, roughness: 0.2 }))
  );
  lcdScreen.position.set(0.41, 0.23, 0.138);

  const eqBars = [];
  const eqGeo = track(new THREE.BoxGeometry(0.022, 0.055, 0.01));
  const eqMat = track(new THREE.MeshStandardMaterial({ color: 0xf472b6, emissive: 0xf472b6, emissiveIntensity: 0.9 }));
  for (let i = 0; i < 4; i++) {
    const bar = new THREE.Mesh(eqGeo, eqMat);
    bar.position.set(0.2 + i * 0.036, 0.035, 0.126);
    heroGroup.add(bar);
    eqBars.push(bar);
  }

  const ledMat = track(new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xfb7185, emissiveIntensity: 1.1 }));
  const led = new THREE.Mesh(track(new THREE.SphereGeometry(0.02, 14, 14)), ledMat);
  led.position.set(0.64, 0.04, 0.125);

  const jog = new THREE.Mesh(track(new THREE.CylinderGeometry(0.135, 0.145, 0.018, 28)), silverMat);
  jog.rotation.x = Math.PI / 2;
  jog.position.set(0.47, -0.19, 0.125);
  const jogCenter = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.06, 0.06, 0.024, 20)),
    track(new THREE.MeshStandardMaterial({ color: 0xf9a8d4, metalness: 0.35, roughness: 0.25 }))
  );
  jogCenter.rotation.x = Math.PI / 2;
  jogCenter.position.set(0.47, -0.19, 0.128);

  const pillGeo = track(new THREE.BoxGeometry(0.11, 0.05, 0.016));
  const stopBtn = new THREE.Mesh(pillGeo, silverMat);
  stopBtn.position.set(0.23, -0.14, 0.125);
  const modeBtn = new THREE.Mesh(pillGeo, silverMat);
  modeBtn.position.set(0.23, -0.24, 0.125);
  const jack = new THREE.Mesh(track(new THREE.CylinderGeometry(0.045, 0.045, 0.028, 18)), silverMat);
  jack.position.set(-0.46, 0.51, 0.02);
  heroGroup.add(lcdBezel, lcdScreen, led, jog, jogCenter, stopBtn, modeBtn, jack);

  // 3. Swinging Beaded Charm Strap + Mini Flip-Phone Charm
  const eyelet = new THREE.Mesh(track(new THREE.TorusGeometry(0.04, 0.01, 10, 20)), silverMat);
  eyelet.position.set(-0.66, -0.43, 0.02);
  eyelet.rotation.y = Math.PI / 4;
  heroGroup.add(eyelet);

  const strapPivot = new THREE.Group();
  strapPivot.position.set(-0.66, -0.45, 0.02);
  heroGroup.add(strapPivot);

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.04, -0.16, 0.03),
    new THREE.Vector3(0.11, -0.36, 0.03),
    new THREE.Vector3(0.15, -0.5, 0.02),
  ]);
  strapPivot.add(
    new THREE.Mesh(
      track(new THREE.TubeGeometry(curve, 16, 0.008, 8, false)),
      track(new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.35 }))
    )
  );

  const beadGeo = track(new THREE.SphereGeometry(0.04, 14, 14));
  [0xf472b6, 0xfdf2f8, 0x67e8f9, 0xc084fc, 0xfde047].forEach((hex, i) => {
    const bead = new THREE.Mesh(
      beadGeo,
      track(new THREE.MeshPhysicalMaterial({ color: hex, roughness: 0.15, clearcoat: 1.0 }))
    );
    bead.position.copy(curve.getPointAt(0.16 + i * 0.16));
    strapPivot.add(bead);
  });

  const phoneCharm = new THREE.Group();
  phoneCharm.position.set(0.15, -0.54, 0.02);
  phoneCharm.rotation.set(0.1, 0.35, -0.15);
  const phoneMat = track(new THREE.MeshPhysicalMaterial({ color: 0xf9a8d4, roughness: 0.2, clearcoat: 1.0 }));
  const halfGeo = track(new THREE.BoxGeometry(0.15, 0.22, 0.025));
  const phoneBase = new THREE.Mesh(halfGeo, phoneMat);
  phoneBase.position.y = -0.1;
  phoneBase.rotation.x = -0.35;
  const phoneLid = new THREE.Mesh(halfGeo, phoneMat);
  phoneLid.position.set(0, 0.1, -0.02);
  phoneLid.rotation.x = 0.38;
  const phoneScreen = new THREE.Mesh(
    track(new THREE.PlaneGeometry(0.11, 0.15)),
    track(new THREE.MeshStandardMaterial({ color: 0xa5f3fc, emissive: 0x67e8f9, emissiveIntensity: 0.65 }))
  );
  phoneScreen.position.set(0, 0.1, -0.006);
  phoneScreen.rotation.x = 0.38;
  phoneCharm.add(phoneBase, phoneLid, phoneScreen);
  strapPivot.add(phoneCharm);

  // 4. Orbiting Purikura Sparkles
  const sparkleGeo = track(new THREE.OctahedronGeometry(0.055, 0));
  const sparkles = [0xfef08a, 0xf9a8d4, 0xa5f3fc, 0xe9d5ff, 0xfbcfe8].map((c, i) => {
    const mesh = new THREE.Mesh(
      sparkleGeo,
      track(new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.65, roughness: 0.2 }))
    );
    group.add(mesh);
    return { mesh, angle: (i / 5) * Math.PI * 2, yBase: ((i % 3) - 1) * 0.36 };
  });

  return {
    group,
    description:
      'Step into late-1990s and 2000s Japanese consumer pop nostalgia—where translucent MiniDisc players, EL-backlit screens, pastel flip phones, and swinging beaded charms capture the bright optimism of the Heisei era.',
    background: 'radial-gradient(circle at 50% 35%, #fce7f3 0%, #c084fc 55%, #4c1d95 100%)',
    update(t, bounce, spring = 0) {
      heroGroup.rotation.y = Math.sin(t * 0.55) * 0.22;
      heroGroup.rotation.z = Math.sin(t * 0.85) * 0.05;
      heroGroup.position.y = Math.sin(t * 1.4) * 0.05;

      discGroup.rotation.z = -t * 0.75;
      strapPivot.rotation.z = 0.06 + Math.sin(t * 1.7) * 0.09;
      strapPivot.rotation.x = Math.cos(t * 1.2) * 0.045;
      ledMat.emissiveIntensity = 0.95 + Math.sin(t * 3.4) * 0.55;

      eqBars.forEach((bar, i) => {
        bar.scale.y = 0.35 + Math.abs(Math.sin(t * 4.2 + i * 0.85)) * 0.95;
      });

      sparkles.forEach((s, i) => {
        const a = s.angle + t * 0.45;
        const pulse = 0.8 + Math.sin(t * 3.5 + i * 1.2) * 0.3;
        s.mesh.position.set(Math.cos(a) * 1.28, s.yBase + Math.sin(t * 2.0 + i) * 0.1, Math.sin(a) * 1.28);
        s.mesh.rotation.y = t * 1.6;
        s.mesh.scale.set(pulse, pulse * 1.35, pulse * 0.6);
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
    dispose() {
      disposables.forEach((d) => d.dispose?.());
    },
  };
}