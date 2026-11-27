// js/aesthetics/indie-sleaze/tumblr-myspace.js
import * as THREE from 'three';

function makeTex(w, h, draw, repeat = [1, 1]) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext('2d'), w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  if (repeat[0] !== 1 || repeat[1] !== 1) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(...repeat);
  }
  return tex;
}

export function createTumblrMySpace({ camera, domElement, box } = {}) {
  const group = new THREE.Group();
  const disposables = [];
  const track = (x) => (disposables.push(x), x);

  // Lighting: warm bedroom shadows + cool MySpace laptop glow + fairy-light warmth
  group.add(new THREE.AmbientLight(0xd8c8b0, 0.65));
  const key = new THREE.DirectionalLight(0xfff0d8, 0.85);
  key.position.set(3, 6, 4);
  const screenGlow = new THREE.PointLight(0x60a5fa, 2.2, 6, 1.3);
  screenGlow.position.set(-0.1, 1.35, 1.35);
  const fairyGlow = new THREE.PointLight(0xffcf87, 3.5, 14, 1.2);
  fairyGlow.position.set(0, 5.8, -4.5);
  group.add(key, screenGlow, fairyGlow);

  // 1. Grainy Carpet & Striped 2008 Bedroom Wallpaper
  const carpetTex = track(
    makeTex(128, 128, (ctx) => {
      ctx.fillStyle = '#291d16';
      ctx.fillRect(0, 0, 128, 128);
      for (let i = 0; i < 420; i++) {
        ctx.fillStyle = i % 2 ? 'rgba(255,240,220,0.04)' : 'rgba(0,0,0,0.14)';
        ctx.fillRect((i * 37) % 128, (i * 73) % 128, 2, 2);
      }
    }, [8, 8])
  );
  const floor = new THREE.Mesh(
    track(new THREE.PlaneGeometry(20, 20)),
    track(new THREE.MeshStandardMaterial({ map: carpetTex, roughness: 0.98 }))
  );
  floor.rotation.x = -Math.PI / 2;

  const wallTex = track(
    makeTex(256, 256, (ctx) => {
      ctx.fillStyle = '#3d2f24';
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = 'rgba(20, 14, 10, 0.16)';
      for (let x = 0; x < 256; x += 32) ctx.fillRect(x, 0, 14, 256);
    }, [6, 3])
  );
  const wall = new THREE.Mesh(
    track(new THREE.PlaneGeometry(20, 10)),
    track(new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.94 }))
  );
  wall.position.set(0, 5, -6);
  group.add(floor, wall);

  // 2. Polaroid Photo Collage Wall
  const polaroidSpecs = [
    ['#18181b', '#f43f5e', '2AM'],
    ['#0f172a', '#38bdf8', '★'],
    ['#27272a', '#fde047', 'MIX'],
    ['#1e1b4b', '#c084fc', '♥'],
  ];
  const polaroidMats = polaroidSpecs.map(([bg, accent, label]) =>
    track(
      new THREE.MeshBasicMaterial({
        map: track(
          makeTex(128, 152, (ctx) => {
            ctx.fillStyle = '#f8f5f0';
            ctx.fillRect(0, 0, 128, 152);
            ctx.fillStyle = bg;
            ctx.fillRect(10, 10, 108, 106);
            ctx.fillStyle = accent;
            ctx.beginPath();
            ctx.arc(64, 60, 26, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#334155';
            ctx.font = 'bold 14px monospace';
            ctx.fillText(label, 14, 138);
          })
        ),
      })
    )
  );
  const polaroidGeo = track(new THREE.PlaneGeometry(0.95, 1.14));
  [
    [-4.2, 4.9, -0.12], [-2.8, 3.6, 0.09], [-1.4, 5.1, -0.06], [-0.1, 3.9, 0.14], [1.3, 4.8, -0.09],
    [2.9, 3.5, 0.08], [4.1, 5.0, -0.15], [-3.5, 2.3, 0.05], [0.5, 2.5, -0.11], [2.4, 2.2, 0.12],
  ].forEach(([px, py, rz], i) => {
    const p = new THREE.Mesh(polaroidGeo, polaroidMats[i % polaroidMats.length]);
    p.position.set(px, py, -5.94 + (i % 3) * 0.01);
    p.rotation.z = rz;
    group.add(p);
  });

  // 3. String of Twinkling Fairy Lights Swagged Across the Wall
  const swagPts = Array.from({ length: 17 }, (_, i) => {
    const u = i / 16;
    const x = -6.4 + u * 12.8;
    const y = 6.45 - Math.sin(u * Math.PI * 2) * 0.45 - Math.abs(Math.sin(u * Math.PI * 3)) * 0.28;
    return new THREE.Vector3(x, y, -5.86);
  });
  const swagCurve = new THREE.CatmullRomCurve3(swagPts);
  group.add(
    new THREE.Mesh(
      track(new THREE.TubeGeometry(swagCurve, 48, 0.014, 6, false)),
      track(new THREE.MeshBasicMaterial({ color: 0x18181b }))
    )
  );
  const fairyGeo = track(new THREE.SphereGeometry(0.065, 10, 10));
  const fairyBulbs = Array.from({ length: 18 }, (_, i) => {
    const mat = track(new THREE.MeshBasicMaterial({ color: 0xffe4a0 }));
    const bulb = new THREE.Mesh(fairyGeo, mat);
    bulb.position.copy(swagCurve.getPointAt(i / 17));
    group.add(bulb);
    return { mesh: bulb, mat, phase: i * 0.85 };
  });

  // 4. Grounded Bedroom Desk, MySpace Laptop, Tangled Earbuds & Mix-CD
  const woodMat = track(new THREE.MeshStandardMaterial({ color: 0x4a3020, roughness: 0.82 }));
  const desk = new THREE.Mesh(track(new THREE.BoxGeometry(2.6, 0.08, 1.25)), woodMat);
  desk.position.set(0, 0.75, 1.0);
  group.add(desk);
  const legGeo = track(new THREE.BoxGeometry(0.08, 0.75, 0.08));
  [[-1.2, -0.54], [1.2, -0.54], [-1.2, 0.54], [1.2, 0.54]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(legGeo, woodMat);
    leg.position.set(lx, 0.375, 1.0 + lz);
    group.add(leg);
  });

  // Open 2008 laptop with keyboard + MySpace/Tumblr screen
  const laptopTex = track(
    makeTex(256, 160, (ctx) => {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 256, 160);
      ctx.fillStyle = '#1e5fa8';
      ctx.fillRect(0, 0, 256, 30);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('MySpace.com   [Online Now!]', 10, 20);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(14, 42, 64, 68);
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(92, 42, 150, 26);
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('Top 8 Friends (8)', 98, 59);
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = ['#fb7185', '#38bdf8', '#facc15', '#a78bfa'][i];
        ctx.fillRect(94 + i * 38, 78, 30, 32);
      }
    })
  );
  const alumMat = track(new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.65, roughness: 0.28 }));
  const laptopBase = new THREE.Mesh(track(new THREE.BoxGeometry(1.16, 0.05, 0.78)), alumMat);
  laptopBase.position.set(-0.1, 0.815, 1.04);
  const kb = new THREE.Mesh(
    track(new THREE.PlaneGeometry(0.95, 0.36)),
    track(new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 }))
  );
  kb.rotation.x = -Math.PI / 2;
  kb.position.set(-0.1, 0.842, 0.96);

  const laptopLid = new THREE.Mesh(track(new THREE.BoxGeometry(1.16, 0.74, 0.025)), alumMat);
  laptopLid.position.set(-0.1, 1.18, 0.65);
  laptopLid.rotation.x = -0.16;
  const screenMat = track(new THREE.MeshBasicMaterial({ map: laptopTex }));
  const laptopScreen = new THREE.Mesh(track(new THREE.PlaneGeometry(1.08, 0.66)), screenMat);
  laptopScreen.position.set(-0.1, 1.18, 0.665);
  laptopScreen.rotation.x = -0.16;
  group.add(laptopBase, kb, laptopLid, laptopScreen);

  // Tangled white wired Apple earbuds draped over the desk edge
  const cordCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.42, 0.81, 0.92),
    new THREE.Vector3(0.75, 0.81, 0.84),
    new THREE.Vector3(0.62, 0.81, 1.24),
    new THREE.Vector3(0.92, 0.81, 1.15),
    new THREE.Vector3(0.78, 0.81, 1.56),
    new THREE.Vector3(0.84, 0.56, 1.68),
  ]);
  const whitePlastic = track(new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }));
  const cordMesh = new THREE.Mesh(track(new THREE.TubeGeometry(cordCurve, 44, 0.011, 6, false)), whitePlastic);
  const bud = new THREE.Mesh(track(new THREE.SphereGeometry(0.03, 10, 10)), whitePlastic);
  bud.position.set(0.84, 0.55, 1.68);
  group.add(cordMesh, bud);

  // Burned Mix-CD on left of desk
  const cd = new THREE.Mesh(
    track(new THREE.RingGeometry(0.035, 0.16, 24)),
    track(new THREE.MeshPhysicalMaterial({ color: 0xe2e8f0, metalness: 0.7, roughness: 0.15, iridescence: 1.0, side: THREE.DoubleSide }))
  );
  cd.rotation.x = -Math.PI / 2;
  cd.position.set(-0.96, 0.795, 1.18);
  group.add(cd);

  // 5. Animated VHS Grain Overlay
  const grainTex = track(
    makeTex(128, 128, (ctx) => {
      for (let y = 0; y < 128; y += 2) {
        ctx.fillStyle = y % 4 === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
        ctx.fillRect(0, y, 128, 1);
      }
      for (let i = 0; i < 260; i++) {
        ctx.fillStyle = 'rgba(255,255,255,0.22)';
        ctx.fillRect((i * 43) % 128, (i * 29) % 128, 2, 1);
      }
    }, [4, 3])
  );
  const grainMat = track(
    new THREE.MeshBasicMaterial({ map: grainTex, transparent: true, opacity: 0.12, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  const grain = new THREE.Mesh(track(new THREE.PlaneGeometry(14, 9)), grainMat);
  grain.position.set(0, 3.5, 4.5);
  group.add(grain);

  return {
    group,
    background: 'radial-gradient(circle at 50% 45%, #3a2a1e 0%, #0a0608 80%)',
    description:
      '2008 Tumblr/MySpace bedroom — Polaroid collage walls, twinkling fairy lights, tangled white earbuds, a glowing MySpace laptop, and VHS tape grain.',
    update(t, bounce = 0, spring = 0) {
      fairyBulbs.forEach((b) => {
        const pulse = 0.72 + Math.sin(t * 2.6 + b.phase) * 0.28;
        b.mesh.scale.setScalar(pulse);
        b.mat.color.setHSL(0.11, 0.95, 0.62 + pulse * 0.18);
      });

      grainTex.offset.set((t * 1.7) % 1, (t * 2.9) % 1);
      grainMat.opacity = 0.08 + Math.abs(Math.sin(t * 19)) * 0.06;
      screenGlow.intensity = 2.0 + Math.sin(t * 3.2) * 0.25;
      group.rotation.z = spring * 0.004;
    },
    dispose() {
      disposables.forEach((d) => d.dispose?.());
    },
  };
}