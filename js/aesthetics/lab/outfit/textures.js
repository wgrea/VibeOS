// js/aesthetics/lab/outfit/textures.js
import * as THREE from 'three';

function makeCanvasTexture(drawFn, repeatX = 12, repeatY = 12, size = 128) {
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
  return tex;
}

export const TEXTURES = {
  leather: () =>
    makeCanvasTexture((ctx, s) => {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 900; i++) {
        const v = 105 + Math.floor(Math.random() * 55);
        ctx.fillStyle = `rgb(${v},${v},${v})`;
        ctx.beginPath();
        ctx.arc(Math.random() * s, Math.random() * s, 1 + Math.random() * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }, 10, 10),

  ripstop: () =>
    makeCanvasTexture((ctx, s) => {
      ctx.fillStyle = '#787878';
      ctx.fillRect(0, 0, s, s);
      ctx.strokeStyle = '#b8b8b8';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < s; i += 16) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, s);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(s, i);
        ctx.stroke();
      }
    }, 18, 18),

  fleece: () =>
    makeCanvasTexture((ctx, s) => {
      ctx.fillStyle = '#707070';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 2400; i++) {
        const v = 70 + Math.floor(Math.random() * 120);
        ctx.fillStyle = `rgb(${v},${v},${v})`;
        ctx.fillRect(Math.random() * s, Math.random() * s, 2, 2);
      }
    }, 16, 16),

  plush: () =>
    makeCanvasTexture((ctx, s) => {
      ctx.fillStyle = '#505050';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 420; i++) {
        const v = 130 + Math.floor(Math.random() * 115);
        ctx.strokeStyle = `rgb(${v},${v},${v})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(Math.random() * s, Math.random() * s, 2.5 + Math.random() * 3.5, 0, Math.PI * 1.4);
        ctx.stroke();
      }
    }, 14, 14),

  denim: () =>
    makeCanvasTexture((ctx, s) => {
      ctx.fillStyle = '#787878';
      ctx.fillRect(0, 0, s, s);
      ctx.strokeStyle = '#b4b4b4';
      ctx.lineWidth = 2;
      for (let i = -s; i < s * 2; i += 6) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + s, s);
        ctx.stroke();
      }
    }, 22, 22),

  corduroy: () =>
    makeCanvasTexture((ctx, s) => {
      const waleW = 8;
      for (let x = 0; x < s; x += waleW) {
        const grad = ctx.createLinearGradient(x, 0, x + waleW, 0);
        grad.addColorStop(0, '#303030');
        grad.addColorStop(0.5, '#e8e8e8');
        grad.addColorStop(1, '#303030');
        ctx.fillStyle = grad;
        ctx.fillRect(x, 0, waleW, s);
      }
    }, 14, 6),

  cotton: () =>
    makeCanvasTexture((ctx, s) => {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, s, s);
      ctx.fillStyle = '#9a9a9a';
      for (let y = 0; y < s; y += 4) {
        for (let x = y % 8 === 0 ? 0 : 2; x < s; x += 4) {
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }, 24, 24),

  nomex: () =>
    makeCanvasTexture((ctx, s) => {
      ctx.fillStyle = '#767676';
      ctx.fillRect(0, 0, s, s);
      ctx.strokeStyle = '#a8a8a8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, s / 2);
      ctx.lineTo(s / 2, 0);
      ctx.lineTo(s, s / 2);
      ctx.lineTo(s / 2, s);
      ctx.closePath();
      ctx.stroke();
    }, 10, 10)
};
