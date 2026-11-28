// js/aesthetics/lab/outfit/textures.js
import * as THREE from 'three';

// 1. Helper defined first so all texture methods can call it safely
function makeCanvasTexture(drawFn, repeatX = 12, repeatY = 12, size = 256) {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  drawFn(ctx, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

// Helper to draw across canvas borders so repeat tiling has zero hard seams
function drawWrapped(ctx, size, x, y, drawCall) {
  for (let ox = -size; ox <= size; ox += size) {
    for (let oy = -size; oy <= size; oy += size) {
      const px = x + ox;
      const py = y + oy;
      if (px > -32 && px < size + 32 && py > -32 && py < size + 32) {
        drawCall(px, py);
      }
    }
  }
}

// 2. TEXTURES object referencing makeCanvasTexture cleanly
export const TEXTURES = {
  // Organic pebbled grain + subtle natural hide creases
  leather: () =>
    makeCanvasTexture((ctx, s) => {
      ctx.fillStyle = '#7c7c7c';
      ctx.fillRect(0, 0, s, s);

      // Soft pore blotches
      for (let i = 0; i < 2600; i++) {
        const x = Math.random() * s;
        const y = Math.random() * s;
        const r = 1.2 + Math.random() * 2.8;
        const v = 108 + Math.floor(Math.random() * 44);
        drawWrapped(ctx, s, x, y, (px, py) => {
          ctx.fillStyle = `rgba(${v},${v},${v},0.45)`;
          ctx.beginPath();
          ctx.ellipse(px, py, r, r * (0.65 + Math.random() * 0.5), Math.random() * Math.PI, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Fine skin creases
      ctx.lineWidth = 0.8;
      for (let i = 0; i < 85; i++) {
        const x = Math.random() * s;
        const y = Math.random() * s;
        const angle = Math.random() * Math.PI * 2;
        const len = 10 + Math.random() * 18;
        drawWrapped(ctx, s, x, y, (px, py) => {
          ctx.strokeStyle = 'rgba(65,65,65,0.35)';
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.quadraticCurveTo(
            px + Math.cos(angle + 0.4) * (len * 0.5),
            py + Math.sin(angle + 0.4) * (len * 0.5),
            px + Math.cos(angle) * len,
            py + Math.sin(angle) * len
          );
          ctx.stroke();
        });
      }
    }, 10, 10),

  // Micro-weave base with raised double-thread reinforcement grid
  ripstop: () =>
    makeCanvasTexture((ctx, s) => {
      ctx.fillStyle = '#747474';
      ctx.fillRect(0, 0, s, s);

      // Fine inner nylon cross-hatch
      ctx.fillStyle = 'rgba(145,145,145,0.28)';
      for (let y = 0; y < s; y += 2) {
        for (let x = (y % 4 === 0 ? 0 : 1); x < s; x += 2) {
          ctx.fillRect(x, y, 1, 1);
        }
      }

      // Raised reinforcement grid every 16px
      const step = 16;
      for (let i = 0; i < s; i += step) {
        ctx.fillStyle = 'rgba(50,50,50,0.4)';
        ctx.fillRect(i + 2, 0, 1, s);
        ctx.fillRect(0, i + 2, s, 1);

        ctx.fillStyle = '#bdbdbd';
        ctx.fillRect(i, 0, 1.5, s);
        ctx.fillRect(0, i, s, 1.5);
      }
    }, 18, 18),

  // Clumped, fuzzy lofted fibers instead of uniform pixel noise
  fleece: () =>
    makeCanvasTexture((ctx, s) => {
      ctx.fillStyle = '#686868';
      ctx.fillRect(0, 0, s, s);

      // Base soft wool tufts
      for (let i = 0; i < 1800; i++) {
        const x = Math.random() * s;
        const y = Math.random() * s;
        const v = 75 + Math.floor(Math.random() * 115);
        const r = 1.5 + Math.random() * 2.5;
        drawWrapped(ctx, s, x, y, (px, py) => {
          ctx.fillStyle = `rgba(${v},${v},${v},0.38)`;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Fine tangled micro-strands
      ctx.lineWidth = 0.9;
      for (let i = 0; i < 900; i++) {
        const x = Math.random() * s;
        const y = Math.random() * s;
        const v = 135 + Math.floor(Math.random() * 90);
        const a = Math.random() * Math.PI * 2;
        drawWrapped(ctx, s, x, y, (px, py) => {
          ctx.strokeStyle = `rgba(${v},${v},${v},0.42)`;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + Math.cos(a) * 4, py + Math.sin(a) * 4);
          ctx.stroke();
        });
      }
    }, 16, 16),

  // Layered directional fur tufts with dark undercoat depth
  plush: () =>
    makeCanvasTexture((ctx, s) => {
      ctx.fillStyle = '#3e3e3e';
      ctx.fillRect(0, 0, s, s);

      for (let i = 0; i < 1600; i++) {
        const x = Math.random() * s;
        const y = Math.random() * s;
        const v = 110 + Math.floor(Math.random() * 135);
        const lean = (Math.random() - 0.5) * 3.5;
        const len = 5 + Math.random() * 6;
        drawWrapped(ctx, s, x, y, (px, py) => {
          const grad = ctx.createLinearGradient(px, py, px + lean, py + len);
          grad.addColorStop(0, 'rgba(45,45,45,0.6)');
          grad.addColorStop(1, `rgba(${v},${v},${v},0.75)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.quadraticCurveTo(px + lean * 0.6, py + len * 0.5, px + lean, py + len);
          ctx.stroke();
        });
      }
    }, 14, 14),

  // Authentic 3x1 twill weave with warp/weft yarn slubs
  denim: () =>
    makeCanvasTexture((ctx, s) => {
      ctx.fillStyle = '#6e6e6e';
      ctx.fillRect(0, 0, s, s);

      // Diagonal twill ribs
      for (let y = 0; y < s; y += 2) {
        for (let x = 0; x < s; x += 2) {
          const phase = (x + y) % 8;
          const v = phase < 4 ? 168 : 96;
          ctx.fillStyle = `rgb(${v},${v},${v})`;
          ctx.fillRect(x, y, 2, 2);
        }
      }

      // Subtle vertical warp yarn slubs
      for (let i = 0; i < 140; i++) {
        const x = Math.floor(Math.random() * (s / 2)) * 2;
        const y = Math.random() * s;
        const h = 6 + Math.random() * 16;
        drawWrapped(ctx, s, x, y, (px, py) => {
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(205,205,205,0.28)' : 'rgba(60,60,60,0.28)';
          ctx.fillRect(px, py, 1.5, h);
        });
      }
    }, 22, 22),

  // Ribbed wales with horizontal cut-pile tuft notches
  corduroy: () =>
    makeCanvasTexture((ctx, s) => {
      const waleW = 8;
      for (let x = 0; x < s; x += waleW) {
        const grad = ctx.createLinearGradient(x, 0, x + waleW, 0);
        grad.addColorStop(0, '#262626');
        grad.addColorStop(0.22, '#8a8a8a');
        grad.addColorStop(0.5, '#eaeaea');
        grad.addColorStop(0.78, '#8a8a8a');
        grad.addColorStop(1, '#262626');
        ctx.fillStyle = grad;
        ctx.fillRect(x, 0, waleW, s);

        // Horizontal pile tuft breaks along each wale
        for (let y = 0; y < s; y += 3) {
          const jitter = (Math.random() - 0.5) * 28;
          ctx.fillStyle = jitter > 0 ? 'rgba(255,255,255,0.14)' : 'rgba(20,20,20,0.22)';
          ctx.fillRect(x + 1, y, waleW - 2, 1.5);
        }
      }
    }, 14, 14),

  // Tight plain-weave jersey knit with soft organic yarn thickness variation
  cotton: () =>
    makeCanvasTexture((ctx, s) => {
      ctx.fillStyle = '#7a7a7a';
      ctx.fillRect(0, 0, s, s);

      for (let y = 0; y < s; y += 4) {
        for (let x = 0; x < s; x += 4) {
          const v = 132 + Math.floor((Math.random() - 0.5) * 22);
          ctx.fillStyle = `rgb(${v},${v},${v})`;
          ctx.fillRect(x, y, 2, 3);
          ctx.fillRect(x + 2, y + 1, 2, 3);
        }
      }
    }, 24, 24),

  // Interlocking aramid diamond quilting with subtle stitched thread pips
  nomex: () =>
    makeCanvasTexture((ctx, s) => {
      ctx.fillStyle = '#707070';
      ctx.fillRect(0, 0, s, s);

      // Subtle micro-weave fill
      ctx.fillStyle = 'rgba(130,130,130,0.22)';
      for (let y = 0; y < s; y += 4) {
        for (let x = 0; x < s; x += 4) {
          ctx.fillRect(x, y, 2, 2);
        }
      }

      // Beveled diamond stitch lines
      const drawDiamond = (offsetY, color, width) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.setLineDash([4, 2]);
        ctx.beginPath();
        ctx.moveTo(0, s / 2 + offsetY);
        ctx.lineTo(s / 2, offsetY);
        ctx.lineTo(s, s / 2 + offsetY);
        ctx.lineTo(s / 2, s + offsetY);
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);
      };

      drawDiamond(1.5, 'rgba(40,40,40,0.55)', 2.2);
      drawDiamond(0, '#bcbcbc', 1.5);
    }, 10, 10)
};