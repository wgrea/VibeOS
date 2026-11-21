// js/aesthetics/comfort/boutique-lounge.js
import * as THREE from 'three';

export function createBoutiqueLounge() {
  const group = new THREE.Group();

  const floorMat = new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.45 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.5 });
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x99f6e4, roughness: 0.6 });
  const sofaMat = new THREE.MeshStandardMaterial({ color: 0xfb7185, roughness: 0.42 });
  const pillowMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.5 });
  const rugMat = new THREE.MeshStandardMaterial({ color: 0xc4b5fd, roughness: 0.72 });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0xfdba74, roughness: 0.55 });

  const room = new THREE.Group();

  // 1. Isometric Cutaway Floor, Walls & Trim
  const floor = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.12, 1.85), floorMat);
  floor.position.y = -0.55;

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(1.85, 1.25, 0.12), wallMat);
  backWall.position.set(0, 0.02, -0.86);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.25, 1.85), wallMat);
  leftWall.position.set(-0.86, 0, 0);

  const backTrim = new THREE.Mesh(new THREE.BoxGeometry(1.86, 0.1, 0.14), trimMat);
  backTrim.position.set(0, -0.45, -0.85);

  const leftTrim = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 1.86), trimMat);
  leftTrim.position.set(-0.85, -0.45, 0);

  // 2. Cozy Rug & Miniature Diorama Couch with Armrests & Pillows
  const rug = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.03, 32), rugMat);
  rug.position.set(0.18, -0.48, 0.18);

  const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.26, 0.44), sofaMat);
  sofaBase.position.set(-0.12, -0.36, -0.48);

  const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.36, 0.14), sofaMat);
  sofaBack.position.set(-0.12, -0.15, -0.63);

  const armGeo = new THREE.BoxGeometry(0.14, 0.32, 0.44);
  const leftArm = new THREE.Mesh(armGeo, sofaMat);
  leftArm.position.set(-0.52, -0.28, -0.48);
  const rightArm = new THREE.Mesh(armGeo, sofaMat);
  rightArm.position.set(0.28, -0.28, -0.48);

  const pillowGeo = new THREE.BoxGeometry(0.2, 0.2, 0.09);
  const pillow1 = new THREE.Mesh(pillowGeo, pillowMat);
  pillow1.position.set(-0.32, -0.18, -0.52);
  pillow1.rotation.set(-0.2, 0.15, 0.12);

  const pillow2 = new THREE.Mesh(pillowGeo, pillowMat);
  pillow2.position.set(0.08, -0.18, -0.52);
  pillow2.rotation.set(-0.2, -0.15, -0.12);

  // 3. Low Pastel Coffee Table & Mug
  const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.04, 24), woodMat);
  tableTop.position.set(0.18, -0.32, 0.18);

  const tableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.15, 12), trimMat);
  tableLeg.position.set(0.18, -0.4, 0.18);

  const mug = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.04, 0.07, 16),
    new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 })
  );
  mug.position.set(0.22, -0.26, 0.15);

  // 4. Wall Frame & Cozy Corner Lamp
  const frameOuter = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.34, 0.04), woodMat);
  frameOuter.position.set(-0.12, 0.28, -0.78);
  const frameArt = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.24, 0.05),
    new THREE.MeshBasicMaterial({ color: 0xfef08a })
  );
  frameArt.position.set(-0.12, 0.28, -0.78);

  const lampPost = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.65, 12), trimMat);
  lampPost.position.set(0.58, -0.16, -0.62);
  const lampShade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.18, 0.2, 20),
    new THREE.MeshStandardMaterial({
      color: 0xfef9c3,
      emissive: 0xfde047,
      emissiveIntensity: 0.45,
      roughness: 0.3,
    })
  );
  lampShade.position.set(0.58, 0.22, -0.62);
  // 5. Mii-Inspired Diorama Figure
  const miiGroup = new THREE.Group();
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.45 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.4 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.6 });
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });

  // Oversized Mii Head & Hair Cap
  const miiHead = new THREE.Mesh(new THREE.SphereGeometry(0.145, 24, 24), skinMat);
  miiHead.position.y = 0.44;

  const miiHair = new THREE.Mesh(
    new THREE.SphereGeometry(0.152, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.52),
    hairMat
  );
  miiHair.position.y = 0.455;
  miiHair.rotation.x = -0.22;

  // Classic Dot Eyes & Smile
  const eyeGeo = new THREE.SphereGeometry(0.015, 10, 10);
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.048, 0.44, 0.136);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.048, 0.44, 0.136);

  // Capsule Body & Floating Sphere Hands
  const miiBody = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.105, 0.22, 20), shirtMat);
  miiBody.position.y = 0.21;

  const handGeo = new THREE.SphereGeometry(0.036, 14, 14);
  const leftHand = new THREE.Mesh(handGeo, skinMat);
  leftHand.position.set(-0.14, 0.21, 0.04);
  const rightHand = new THREE.Mesh(handGeo, skinMat);
  rightHand.position.set(0.14, 0.21, 0.04);

  // Stubby Feet
  const footGeo = new THREE.SphereGeometry(0.042, 14, 14);
  footGeo.scale(0.85, 0.6, 1.3);
  const leftFoot = new THREE.Mesh(footGeo, hairMat);
  leftFoot.position.set(-0.045, 0.04, 0.02);
  const rightFoot = new THREE.Mesh(footGeo, hairMat);
  rightFoot.position.set(0.045, 0.04, 0.02);

  miiGroup.add(miiHead, miiHair, leftEye, rightEye, miiBody, leftHand, rightHand, leftFoot, rightFoot);
  miiGroup.position.set(-0.22, -0.47, 0.36);
  miiGroup.rotation.y = 0.55;

  // 6. Autonomous Wander + Optional Keyboard Control (WASD / Arrow Keys)
  const keys = { w: false, a: false, s: false, d: false };
  let isManualControl = false;
  let lastManualTime = 0;

  let targetPos = new THREE.Vector3(0.38, -0.47, 0.38);
  let waitTimer = 0;

  const onKeyDown = (e) => {
    const k = e.key.toLowerCase();
    if (k === 'w' || e.key === 'ArrowUp') keys.w = true;
    if (k === 's' || e.key === 'ArrowDown') keys.s = true;
    if (k === 'a' || e.key === 'ArrowLeft') keys.a = true;
    if (k === 'd' || e.key === 'ArrowRight') keys.d = true;
    if (keys.w || keys.a || keys.s || keys.d) {
      isManualControl = true;
      lastManualTime = performance.now();
    }
  };

  const onKeyUp = (e) => {
    const k = e.key.toLowerCase();
    if (k === 'w' || e.key === 'ArrowUp') keys.w = false;
    if (k === 's' || e.key === 'ArrowDown') keys.s = false;
    if (k === 'a' || e.key === 'ArrowLeft') keys.a = false;
    if (k === 'd' || e.key === 'ArrowRight') keys.d = false;
  };

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  // Keep Mii inside the cutaway floor and away from the couch/lamp
  const clampToFloor = (pos) => {
    pos.x = THREE.MathUtils.clamp(pos.x, -0.58, 0.65);
    pos.z = THREE.MathUtils.clamp(pos.z, -0.15, 0.65);
  };


  room.add(
    floor,
    backWall,
    leftWall,
    backTrim,
    leftTrim,
    rug,
    sofaBase,
    sofaBack,
    leftArm,
    rightArm,
    pillow1,
    pillow2,
    tableTop,
    tableLeg,
    mug,
    frameOuter,
    frameArt,
    lampPost,
    lampShade,
    miiGroup
  );
  room.rotation.set(0.25, -Math.PI / 4, 0);
  group.add(room);

  return {
    group,
    description:
      'Inspired by miniature life-sim dollhouses and handheld social spaces, Boutique Lounge frames an isometric cutaway room filled with pastel walls, plush seating, warm lamp glow, and tactile diorama charm.',
    background: 'radial-gradient(circle at 50% 30%, #fef3c7 0%, #a7f3d0 50%, #6ee7b7 100%)',
    update(t, bounce, spring) {
      room.rotation.y = -Math.PI / 4 + Math.sin(t * 0.7) * 0.22;
      room.position.y = Math.sin(t * 1.5) * 0.06;
      lampShade.material.emissiveIntensity = 0.4 + Math.sin(t * 2.5) * 0.1;
      group.scale.setScalar(1 + spring * 0.22);
            // Switch back to autonomous wandering after 4 seconds of no key presses
      if (isManualControl && performance.now() - lastManualTime > 4000) {
        isManualControl = false;
      }

      let moveX = 0;
      let moveZ = 0;
      const speed = 0.014;

      if (isManualControl) {
        if (keys.w) moveZ -= 1;
        if (keys.s) moveZ += 1;
        if (keys.a) moveX -= 1;
        if (keys.d) moveX += 1;

        if (moveX !== 0 || moveZ !== 0) {
          lastManualTime = performance.now();
          const len = Math.hypot(moveX, moveZ);
          moveX = (moveX / len) * speed;
          moveZ = (moveZ / len) * speed;
          miiGroup.position.x += moveX;
          miiGroup.position.z += moveZ;
          clampToFloor(miiGroup.position);
        }
      } else {
        // Autonomous Tomodachi-style room wandering
        if (waitTimer > 0) {
          waitTimer -= 0.016;
        } else {
          const dx = targetPos.x - miiGroup.position.x;
          const dz = targetPos.z - miiGroup.position.z;
          const dist = Math.hypot(dx, dz);

          if (dist < 0.04) {
            waitTimer = 1.2 + Math.random() * 1.8; // Pause & look around
            targetPos.set(
              THREE.MathUtils.randFloat(-0.55, 0.62),
              -0.47,
              THREE.MathUtils.randFloat(-0.12, 0.62)
            );
          } else {
            moveX = (dx / dist) * (speed * 0.65);
            moveZ = (dz / dist) * (speed * 0.65);
            miiGroup.position.x += moveX;
            miiGroup.position.z += moveZ;
            clampToFloor(miiGroup.position);
          }
        }
      }

      const isMoving = Math.hypot(moveX, moveZ) > 0.0001;

      if (isMoving) {
        // Smoothly face movement direction & do a cute waddle hop
        const targetAngle = Math.atan2(moveX, moveZ);
        let diff = targetAngle - miiGroup.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        miiGroup.rotation.y += diff * 0.15;

        miiGroup.position.y = -0.47 + Math.abs(Math.sin(t * 14)) * 0.045;
        miiGroup.rotation.z = Math.sin(t * 14) * 0.09;
        leftFoot.position.z = 0.02 + Math.sin(t * 14) * 0.04;
        rightFoot.position.z = 0.02 - Math.sin(t * 14) * 0.04;
        leftHand.position.z = 0.04 - Math.sin(t * 14) * 0.03;
        rightHand.position.z = 0.04 + Math.sin(t * 14) * 0.03;
      } else {
        // Cozy idle bounce & occasional wave when standing still
        miiGroup.rotation.z *= 0.85;
        miiGroup.position.y = -0.47 + Math.abs(Math.sin(t * 3.2)) * 0.025;
        miiHead.rotation.z = Math.sin(t * 1.6) * 0.07;
        rightHand.position.y = 0.24 + Math.sin(t * 4.5) * 0.03;
      }

    },
  };
}
