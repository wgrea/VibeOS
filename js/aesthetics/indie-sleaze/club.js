// js/aesthetics/indie-sleaze/club.js
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

export function createClubSleaze({ camera, domElement, box } = {}) {
  const group = new THREE.Group();
  const disposables = [];
  const track = (x) => (disposables.push(x), x);

  // 1. Club Lighting: Strobe, Camera Flash, Red Backlight & Warm Bulbs
  group.add(new THREE.AmbientLight(0x261210, 0.7));

  const strobe = new THREE.PointLight(0xffffff, 14, 24, 1.2);
  strobe.position.set(0, 4.5, 1.5);
  const camFlash = new THREE.PointLight(0xfff7ed, 0, 22, 1.1);
  camFlash.position.set(2.2, 2.2, 2.8);
  const backRed = new THREE.PointLight(0xff1e42, 9, 18, 1.2);
  backRed.position.set(-3.2, 3.0, -4.5);
  const bulbFill = new THREE.PointLight(0xffb86b, 4.5, 16, 1.3);
  bulbFill.position.set(0, 5.2, -2.5);
  group.add(strobe, camFlash, backRed, bulbFill);

  // 2. Sticky Scuffed Warehouse Floor (matte concrete + glossy spill patches)
  const spillTex = track(
    makeTex(256, 256, (ctx) => {
      ctx.fillStyle = '#d4d4d8';
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 18; i++) {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(20, 20, 25, 0.75)' : 'rgba(110, 110, 120, 0.4)';
        ctx.beginPath();
        ctx.ellipse((i * 59) % 240, (i * 97) % 240, 18 + (i % 4) * 10, 10 + (i % 3) * 8, i, 0, Math.PI * 2);
        ctx.fill();
      }
    }, [4, 4])
  );
  const floor = new THREE.Mesh(
    track(new THREE.PlaneGeometry(22, 22)),
    track(new THREE.MeshStandardMaterial({ color: 0x100c0e, roughness: 0.75, roughnessMap: spillTex, metalness: 0.25 }))
  );
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

  // 3. Exposed Brick Wall, Wheatpaste Flyers & Red Neon Tube Bar
  const brickTex = track(
    makeTex(512, 256, (ctx) => {
      ctx.fillStyle = '#1c0c0a';
      ctx.fillRect(0, 0, 512, 256);
      const bh = 24;
      const bw = 60;
      for (let row = 0; row < 11; row++) {
        const offset = (row % 2) * (bw / 2);
        for (let col = -1; col < 10; col++) {
          const shade = 38 + ((row * 17 + col * 31) % 28);
          ctx.fillStyle = `rgb(${shade + 22}, ${Math.floor(shade * 0.48)}, ${Math.floor(shade * 0.36)})`;
          ctx.fillRect(col * bw + offset + 2, row * bh + 2, bw - 4, bh - 4);
        }
      }
    }, [3, 2])
  );
  const wall = new THREE.Mesh(
    track(new THREE.BoxGeometry(22, 8, 0.4)),
    track(new THREE.MeshStandardMaterial({ map: brickTex, roughness: 0.92 }))
  );
  wall.position.set(0, 4, -7);
  group.add(wall);

  // Crooked wheatpaste gig posters & red neon sign
  const posterColors = [0xfef08a, 0xf43f5e, 0xe2e8f0, 0x38bdf8];
  [[-4.4, 3.3, -0.09], [-3.2, 2.7, 0.08], [3.6, 3.1, -0.07], [4.7, 2.5, 0.11]].forEach(([px, py, rz], i) => {
    const poster = new THREE.Mesh(
      track(new THREE.PlaneGeometry(0.95, 1.3)),
      track(new THREE.MeshStandardMaterial({ color: posterColors[i], roughness: 0.85 }))
    );
    poster.position.set(px, py, -6.78);
    poster.rotation.z = rz;
    group.add(poster);
  });

  const neonMat = track(
    new THREE.MeshStandardMaterial({ color: 0xff2a55, emissive: 0xff1e42, emissiveIntensity: 2.2 })
  );
  const neonBar = new THREE.Mesh(track(new THREE.CylinderGeometry(0.035, 0.035, 3.6, 12)), neonMat);
  neonBar.rotation.z = Math.PI / 2;
  neonBar.position.set(0, 4.6, -6.74);
  group.add(neonBar);

  // Ceiling & swaying bare Edison bulbs
  const ceiling = new THREE.Mesh(
    track(new THREE.PlaneGeometry(22, 22)),
    track(new THREE.MeshStandardMaterial({ color: 0x080608, roughness: 1, side: THREE.DoubleSide }))
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 8;
  group.add(ceiling);

  const cordGeo = track(new THREE.CylinderGeometry(0.012, 0.012, 2.5, 6));
  const cordMat = track(new THREE.MeshBasicMaterial({ color: 0x1e1b18 }));
  const bulbGeo = track(new THREE.SphereGeometry(0.11, 12, 12));
  const bulbMat = track(new THREE.MeshStandardMaterial({ color: 0xffdf99, emissive: 0xffaa44, emissiveIntensity: 1.8 }));
  const bulbs = [-5, -2.5, 0, 2.5, 5].map((x, i) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, 8, -2.8);
    const cord = new THREE.Mesh(cordGeo, cordMat);
    cord.position.y = -1.25;
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.y = -2.5;
    pivot.add(cord, bulb);
    group.add(pivot);
    return { pivot, phase: i * 1.1 };
  });

  // 4. 2008 Bloghouse DJ Booth, Turntables, Laptop & Beer Cans
  const booth = new THREE.Mesh(
    track(new THREE.BoxGeometry(3.2, 1.2, 1.05)),
    track(new THREE.MeshStandardMaterial({ color: 0x161214, roughness: 0.85 }))
  );
  booth.position.set(0, 0.6, -5.5);
  const boothTop = new THREE.Mesh(
    track(new THREE.BoxGeometry(3.3, 0.08, 1.15)),
    track(new THREE.MeshStandardMaterial({ color: 0x111114, metalness: 0.6, roughness: 0.35 }))
  );
  boothTop.position.set(0, 1.24, -5.5);
  group.add(booth, boothTop);

  // Dual turntables + spinning vinyl
  const deckGeo = track(new THREE.BoxGeometry(0.68, 0.06, 0.56));
  const vinylGeo = track(new THREE.CylinderGeometry(0.22, 0.22, 0.015, 24));
  const deckMat = track(new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.5, roughness: 0.4 }));
  const vinylMat = track(new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.25 }));
  const platters = [-0.85, 0.85].map((dx) => {
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(dx, 1.31, -5.42);
    const vinyl = new THREE.Mesh(vinylGeo, vinylMat);
    vinyl.position.set(dx, 1.345, -5.42);
    group.add(deck, vinyl);
    return vinyl;
  });

  // Mixer VU LED bars
  const vuMat = track(new THREE.MeshBasicMaterial({ color: 0x22c55e }));
  const vuBars = Array.from({ length: 4 }, (_, i) => {
    const bar = new THREE.Mesh(track(new THREE.BoxGeometry(0.04, 0.04, 0.14)), vuMat);
    bar.position.set(-0.12 + i * 0.08, 1.31, -5.32);
    group.add(bar);
    return bar;
  });

  // Glowing 2008 MacBook waveform screen + crushed beer cans
  const laptopTex = track(
    makeTex(128, 80, (ctx) => {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, 128, 80);
      ctx.fillStyle = '#38bdf8';
      for (let x = 6; x < 122; x += 5) {
        const h = 8 + ((x * 29) % 34);
        ctx.fillRect(x, 40 - h / 2, 3, h);
      }
    })
  );
  const laptopLid = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.64, 0.42, 0.02)),
    track(new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.7, roughness: 0.3 }))
  );
  laptopLid.position.set(0, 1.5, -5.82);
  laptopLid.rotation.x = 0.2;
  const laptopScreen = new THREE.Mesh(
    track(new THREE.PlaneGeometry(0.58, 0.36)),
    track(new THREE.MeshBasicMaterial({ map: laptopTex }))
  );
  laptopScreen.position.set(0, 1.5, -5.805);
  laptopScreen.rotation.x = 0.2;
  const can = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.045, 0.045, 0.14, 12)),
    track(new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.25 }))
  );
  can.position.set(-1.35, 1.35, -5.25);
  group.add(laptopLid, laptopScreen, can);

  // 5. Flanking PA Subwoofer Stacks
  const cabMat = track(new THREE.MeshStandardMaterial({ color: 0x121012, roughness: 0.9 }));
  const coneMat = track(new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.5 }));
  const woofers = [-2.4, 2.4].map((sx) => {
    const stack = new THREE.Mesh(track(new THREE.BoxGeometry(1.1, 2.2, 0.95)), cabMat);
    stack.position.set(sx, 1.1, -5.55);
    const woofer = new THREE.Mesh(track(new THREE.CylinderGeometry(0.36, 0.28, 0.08, 20)), coneMat);
    woofer.rotation.x = Math.PI / 2;
    woofer.position.set(sx, 0.78, -5.06);
    group.add(stack, woofer);
    return woofer;
  });

  // 6. Soft Radial Flash Haze (no rectangular hard edges)
  const hazeTex = track(
    makeTex(128, 128, (ctx) => {
      const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
      g.addColorStop(0, 'rgba(255, 245, 225, 0.55)');
      g.addColorStop(1, 'rgba(255, 245, 225, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
    })
  );
  const hazeMat = track(
    new THREE.MeshBasicMaterial({ map: hazeTex, transparent: true, opacity: 0.14, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  const haze = new THREE.Mesh(track(new THREE.PlaneGeometry(14, 7)), hazeMat);
  haze.position.set(0, 3.2, -5.9);
  group.add(haze);

  return {
    group,
    background: 'radial-gradient(circle at 50% 40%, #1a0e14 0%, #050305 75%)',
    description:
      '2008 warehouse bloghouse nightlife — exposed brick, wheatpaste gig flyers, sticky spilled-drink floors, glowing DJ laptops, bare swaying bulbs, and harsh disposable-camera flashes.',
    update(t, bounce = 0, spring = 0) {
      const strobeOn = Math.sin(t * 18) > 0.72 ? 1 : 0.12;
      strobe.intensity = 14 * strobeOn;

      // Sharp disposable-camera flash burst every ~3.4s
      const flashCycle = (t * 0.6) % 2.1;
      const flashPop = flashCycle < 0.08 ? 1 - flashCycle / 0.08 : 0;
      camFlash.intensity = flashPop * 28;

      hazeMat.opacity = 0.09 + strobeOn * 0.08 + flashPop * 0.22;
      backRed.intensity = 8.5 + Math.sin(t * 2.2) * 2.0;

      bulbs.forEach((b) => {
        b.pivot.rotation.z = Math.sin(t * 1.4 + b.phase) * 0.035;
      });
      platters.forEach((p) => {
        p.rotation.y = t * 2.4;
      });
      vuBars.forEach((bar, i) => {
        bar.scale.z = 0.4 + Math.abs(Math.sin(t * 7.5 + i * 1.1)) * 1.4;
      });
      const bassHit = Math.pow(Math.max(0, Math.sin(t * 8.4)), 4);
      woofers.forEach((w) => {
        w.position.z = -5.06 + bassHit * 0.045;
      });

      group.rotation.z = spring * 0.008;
    },
    dispose() {
      disposables.forEach((d) => d.dispose?.());
    },
  };
}