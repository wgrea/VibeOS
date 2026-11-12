import * as THREE from 'three';

export function createXpBliss() {
  const group = new THREE.Group();

  // Rolling Green Bliss Hills
  const frontHill = new THREE.Mesh(
    new THREE.SphereGeometry(5, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.8 })
  );
  frontHill.position.set(-1.2, -5.6, 0.2);
  frontHill.scale.set(1.8, 1, 0.8);
  group.add(frontHill);

  const backHill = new THREE.Mesh(
    new THREE.SphereGeometry(5.5, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.85 })
  );
  backHill.position.set(2.2, -5.8, -1.2);
  backHill.scale.set(1.9, 1, 0.8);
  group.add(backHill);

  // Fluffy White Cloud
  const cloudGroup = new THREE.Group();
  const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
  [[-0.5, 0, 0, 0.42], [0, 0.15, 0, 0.55], [0.55, 0.02, 0, 0.4]].forEach(([x, y, z, r]) => {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), cloudMat);
    puff.position.set(x, y, z);
    cloudGroup.add(puff);
  });
  cloudGroup.position.set(-2.3, 1.6, -1.5);
  group.add(cloudGroup);

  // Classic Windows XP "Luna" Window Frame
  const xpWindow = new THREE.Group();

  const winBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 1.85, 0.14),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
  );
  xpWindow.add(winBody);

  const titleBar = new THREE.Mesh(
    new THREE.BoxGeometry(2.84, 0.36, 0.16),
    new THREE.MeshPhysicalMaterial({ color: 0x0058e6, roughness: 0.15, clearcoat: 1.0 })
  );
  titleBar.position.set(0, 0.78, 0.01);
  xpWindow.add(titleBar);

  const closeBtn = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.24, 0.18),
    new THREE.MeshPhysicalMaterial({ color: 0xe81123, roughness: 0.1, clearcoat: 1.0 })
  );
  closeBtn.position.set(1.22, 0.78, 0.02);
  xpWindow.add(closeBtn);

  const okPillGeo = new THREE.CapsuleGeometry(0.16, 0.65, 8, 16);
  okPillGeo.rotateZ(Math.PI / 2);
  const okPill = new THREE.Mesh(
    okPillGeo,
    new THREE.MeshPhysicalMaterial({ color: 0x0ea5e9, roughness: 0.05, clearcoat: 1.0 })
  );
  okPill.position.set(0, -0.32, 0.12);
  xpWindow.add(okPill);

  xpWindow.position.set(0.2, 0.35, 0.4);
  group.add(xpWindow);

  return {
    group,
    background: 'linear-gradient(180deg, #2563eb 0%, #60a5fa 65%, #bbf7d0 100%)',
    update(t, bounce, spring) {
      xpWindow.position.y = 0.35 + Math.sin(t * 2) * 0.06 - bounce * 0.5;
      xpWindow.rotation.y = Math.sin(t * 0.8) * 0.18;
      cloudGroup.position.x = -2.3 + Math.sin(t * 0.4) * 0.25;
      okPill.scale.set(1 + spring * 0.5, 1 - spring * 0.4, 1);
    }
  };
}
