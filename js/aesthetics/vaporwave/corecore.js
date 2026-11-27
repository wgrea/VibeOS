// js/aesthetics/vaporwave/corecore.js
import * as THREE from 'three';

// Procedural "lo-fi clip" texture: scanlines + noise + drifting bright band.
// Each screen gets its own seed so no two feeds look alike.
function makeClipTexture(seed, tint) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');

  // Base wash in the screen's tint (desaturated, melancholy)
  ctx.fillStyle = tint;
  ctx.fillRect(0, 0, 128, 96);

  // Per-screen pseudo-random from seed (deterministic = stable across frames)
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  // Fragmented "clip" blocks — overlapping rectangle cuts of varying brightness
  for (let i = 0; i < 14; i++) {
    const bw = 20 + rand() * 60;
    const bh = 8 + rand() * 30;
    const bx = rand() * 128;
    const by = rand() * 96;
    const bright = 0.4 + rand() * 0.6;
    ctx.fillStyle = `rgba(255,255,255,${bright * 0.18})`;
    ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = `rgba(0,0,0,${(1 - bright) * 0.22})`;
    ctx.fillRect(bx + 2, by + 2, bw - 4, bh - 4);
  }

  // Scanlines — the CRT tell
  ctx.fillStyle = 'rgba(0,0,0,0.32)';
  for (let y = 0; y < 96; y += 3) ctx.fillRect(0, y, 128, 1);

  // Bright scan band (moving vertically at runtime via texture.offset)
  const bandGrad = ctx.createLinearGradient(0, 0, 0, 96);
  bandGrad.addColorStop(0.0, 'rgba(255,255,255,0)');
  bandGrad.addColorStop(0.5, 'rgba(255,255,255,0.18)');
  bandGrad.addColorStop(1.0, 'rgba(255,255,255,0)');
  ctx.fillStyle = bandGrad;
  ctx.fillRect(0, 0, 128, 96);

  // Fine grain
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = `rgba(0,0,0,${rand() * 0.25})`;
    ctx.fillRect(rand() * 128, rand() * 96, 1, 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 2); // allows vertical scroll
  return tex;
}

export function createCorecore() {
  const group = new THREE.Group();
  group.name = 'corecore';

  // Desaturated, melancholy palette — six distinct feeds, all slightly off
  const screenTints = [
    '#8ba9c9', '#c98ba9', '#a9c98b',
    '#c9b88b', '#8bc9c0', '#b88bc9',
  ];

  const screens = [];

  // 3×2 grid of CRT feeds with visible gaps (fragmented collage, not one panel)
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      const i = row * 3 + col;
      const tex = makeClipTexture(i * 7919 + 17, screenTints[i]);

      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(0.9, 0.6),
        new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: 0.94,
        })
      );

      // Grid placement with slight per-screen offset (unstable, hand-tuned collage)
      const jitterX = (Math.sin(i * 2.3) * 0.03);
      const jitterY = (Math.cos(i * 1.7) * 0.03);
      screen.position.set((col - 1) * 1.02 + jitterX, (1 - row) * 0.7 + jitterY, 0);

      // Per-screen scroll speed & jump-cut rhythm — sensory overload editing
      screen.userData = {
        tex,
        phase: i * 0.9,
        scrollSpeed: 0.08 + (i % 3) * 0.05,
        flickerHz: 1.2 + (i % 4) * 0.7,
        jumpHz: 0.4 + (i % 3) * 0.35,
        baseY: (1 - row) * 0.7,
        baseX: (col - 1) * 1.02,
      };

      screens.push(screen);
      group.add(screen);

      // Thin black bezel per screen — CRT chassis, not floating rectangle
      const bezelPts = [
        new THREE.Vector3(-0.47,  0.32, 0.005),
        new THREE.Vector3( 0.47,  0.32, 0.005),
        new THREE.Vector3( 0.47, -0.32, 0.005),
        new THREE.Vector3(-0.47, -0.32, 0.005),
        new THREE.Vector3(-0.47,  0.32, 0.005),
      ];
      const bezel = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(bezelPts),
        new THREE.LineBasicMaterial({ color: 0x0a0a0a, transparent: true, opacity: 0.85 })
      );
      bezel.position.copy(screen.position);
      group.add(bezel);
    }
  }

  // Outer CRT frame — the whole collage sits inside one chassis
  const outerBezelPts = [
    new THREE.Vector3(-1.62,  1.08, 0.04),
    new THREE.Vector3( 1.62,  1.08, 0.04),
    new THREE.Vector3( 1.62, -1.08, 0.04),
    new THREE.Vector3(-1.62, -1.08, 0.04),
    new THREE.Vector3(-1.62,  1.08, 0.04),
  ];
  const outerBezel = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(outerBezelPts),
    new THREE.LineBasicMaterial({ color: 0x1a1a2e, transparent: true, opacity: 0.7 })
  );
  group.add(outerBezel);

  // Cool ambient wash + flickering purple point light (the CRT glow)
  const ambient = new THREE.AmbientLight(0x334466, 0.55);
  group.add(ambient);

  const flickerLight = new THREE.PointLight(0xc9a9e0, 0.9, 8);
  flickerLight.position.set(0, 0, 1.5);
  group.add(flickerLight);

  return {
    group,
    description:
      'Corecore — fragmented multi-screen CRT collage: overlapping lo-fi clips, nostalgic melancholy, sensory-overload editing, and the feeling of scrolling every feed at once.',
    background:
      'radial-gradient(circle at 50% 40%, #2a2f45 0%, #14121f 55%, #050509 100%)',
    update(t, bounce, spring) {
      screens.forEach((s) => {
        const d = s.userData;

        // Vertical feed scroll — different speed per screen = every feed at once
        d.tex.offset.y = (t * d.scrollSpeed) % 1;

        // Emissive-style flicker baked into texture brightness via opacity
        const flick = Math.abs(Math.sin(t * d.flickerHz + d.phase));
        s.material.opacity = 0.82 + flick * 0.14;

        // Jump-cut: every ~1/jumpHz seconds the screen snaps its offset
        const jumpStep = Math.floor(t * d.jumpHz + d.phase);
        const jumpJitter = (Math.sin(jumpStep * 12.9898) * 43758.5453) % 1;
        s.position.y = d.baseY + (jumpJitter - 0.5) * 0.05;

        // Subtle Z parallax jitter (the "unstable feed" feel)
        s.position.z = 0.015 * Math.sin(t * 5 + d.phase);

        // Slight horizontal drift — the whole collage never fully settles
        s.position.x = d.baseX + Math.sin(t * 0.6 + d.phase) * 0.012;
      });

      flickerLight.intensity = 0.7 + 0.35 * Math.abs(Math.sin(t * 3.7));

      // Whole collage breathes with interaction (matches sibling factories)
      group.scale.setScalar(1 + spring * 0.18 - bounce * 0.06);
    },
  };
}