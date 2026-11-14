import * as THREE from 'three';

export function createUtopianVirtual() {
  const group = new THREE.Group();

  // Procedural Checkerboard Disc Pedestal
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillRect(128, 128, 128, 128);

  const checkerTex = new THREE.CanvasTexture(canvas);
  checkerTex.wrapS = THREE.RepeatWrapping;
  checkerTex.wrapT = THREE.RepeatWrapping;
  checkerTex.repeat.set(4, 4);

  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(1.8, 1.9, 0.22, 32),
    new THREE.MeshStandardMaterial({ map: checkerTex, roughness: 0.25 })
  );
  pedestal.position.y = -1.1;
  group.add(pedestal);

  // Mirror Chrome Centerpiece Sphere
  const chromeSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.85, 36, 36),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.92,
      roughness: 0.06,
    })
  );
  chromeSphere.position.y = 0.2;
  group.add(chromeSphere);

  // Golden Pyramid & Coral Torus
  const pyramid = new THREE.Mesh(
    new THREE.ConeGeometry(0.45, 0.9, 4),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.65, roughness: 0.2 })
  );
  pyramid.position.set(-1.35, 0.45, 0.2);
  group.add(pyramid);

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.14, 16, 36),
    new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.25 })
  );
  torus.position.set(1.35, 0.4, 0.2);
  group.add(torus);

  return {
    group,
    background: 'linear-gradient(180deg, #0284c7 0%, #38bdf8 55%, #bae6fd 100%)',
    update(t, bounce, spring) {
      checkerTex.offset.y = (t * 0.25) % 1;
      chromeSphere.position.y = 0.2 + Math.sin(t * 1.5) * 0.14 + Math.abs(spring) * 0.4;
      pyramid.rotation.y = t * 1.1;
      torus.rotation.x = t * 0.9;
      torus.rotation.y = t * 1.2;
    },
  };
}
