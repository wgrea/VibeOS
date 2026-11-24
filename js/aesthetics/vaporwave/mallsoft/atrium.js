import * as THREE from 'three';

export function createAtrium(marbleMat) {
  const atrium = new THREE.Group();

  // Vertical extents of the atrium. Kept as named constants so the walls,
  // ceiling, skylight, and balcony rings all agree with each other.
  const FLOOR_Y = -1.2;
  const CEILING_Y = 5.6;
  const WALL_X = 8.9;
  const WALL_Z = 8.9;
  const WALL_HEIGHT = CEILING_Y - FLOOR_Y; // 6.8
  const WALL_MID_Y = FLOOR_Y + WALL_HEIGHT / 2;

  // ---------- Floor ----------
  // Terrazzo-ish pastel floor. Procedural canvas texture with soft speckles.
  const floorTex = makeTerrazzoTexture();
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 18),
    new THREE.MeshStandardMaterial({
      map: floorTex,
      color: 0xffffff,
      roughness: 0.18,
      metalness: 0.08,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = FLOOR_Y;
  atrium.add(floor);

  // Coarser tile grid (12x12 instead of 18x18). Fewer, larger tiles read as a
  // bigger floor because the eye isn't counting small cells.
  const tileGrid = new THREE.GridHelper(18, 12, 0x2dd4bf, 0xf472b6);
  tileGrid.position.y = FLOOR_Y + 0.01;
  tileGrid.material.transparent = true;
  tileGrid.material.opacity = 0.3;
  atrium.add(tileGrid);

  // ---------- Walls ----------
  // Three walls close the atrium off (back + two sides). Front stays open
  // so the camera doesn't spawn inside a wall.
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xfbcfe8,
    roughness: 0.7,
    metalness: 0.0,
  });

  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(18, WALL_HEIGHT, 0.2),
    wallMat
  );
  backWall.position.set(0, WALL_MID_Y, -WALL_Z);
  atrium.add(backWall);

  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, WALL_HEIGHT, 18),
    wallMat
  );
  leftWall.position.set(-WALL_X, WALL_MID_Y, 0);
  atrium.add(leftWall);

  const rightWall = leftWall.clone();
  rightWall.position.x = WALL_X;
  atrium.add(rightWall);

  // ---------- Ceiling + Skylight ----------
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 18),
    new THREE.MeshStandardMaterial({ color: 0x2a2438, roughness: 0.9 })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = CEILING_Y;
  atrium.add(ceiling);

  // Skylight glazing, slightly below the ceiling plane.
  const skylightY = CEILING_Y - 0.01;
  const skylight = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({
      color: 0xbfe9ff,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    })
  );
  skylight.rotation.x = Math.PI / 2;
  skylight.position.y = skylightY;
  atrium.add(skylight);

  // Mullion grid over the skylight so it reads as architecture, not a glow.
  const skylightFrame = new THREE.Group();
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0xe5e7eb,
    roughness: 0.4,
    metalness: 0.3,
  });
  for (let i = 0; i <= 3; i++) {
    const offset = -5 + i * (10 / 3);
    const barX = new THREE.Mesh(
      new THREE.BoxGeometry(10, 0.04, 0.05),
      frameMat
    );
    barX.position.set(0, skylightY - 0.01, offset);
    skylightFrame.add(barX);

    const barZ = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.04, 10),
      frameMat
    );
    barZ.position.set(offset, skylightY - 0.01, 0);
    skylightFrame.add(barZ);
  }
  atrium.add(skylightFrame);

  // ---------- Mezzanine Balcony Rings ----------
  // Two rings: the existing mezzanine at y=2.25, and a "fake" upper level at
  // y=4.4. The upper ring is non-functional decoration, but the extra
  // horizontal line at eye-line+above is one of the strongest depth cues in
  // an atrium — it tells the viewer the building keeps going up.
  const balconyGroup = new THREE.Group();
  const neonPink = new THREE.MeshBasicMaterial({ color: 0xf472b6 });
  const neonTeal = new THREE.MeshBasicMaterial({ color: 0x2dd4bf });

  const balconySegments = [
    { w: 12.5, x: 0, z: -6.8, ry: 0 },
    { w: 12.5, x: -6.2, z: -0.6, ry: Math.PI / 2 },
    { w: 12.5, x: 6.2, z: -0.6, ry: Math.PI / 2 },
  ];

  const balconyLevels = [
    { y: 2.25, neonScale: 1.0 },
    { y: 4.4, neonScale: 0.75 },
  ];

  balconyLevels.forEach(({ y, neonScale }) => {
    balconySegments.forEach(({ w, x, z, ry }) => {
      const seg = new THREE.Group();
      const fascia = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.35, 0.4),
        marbleMat
      );
      seg.add(fascia);

      const topNeon = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.045, 0.43),
        neonTeal
      );
      topNeon.position.y = 0.16;
      seg.add(topNeon);

      const bottomNeon = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.045, 0.43),
        neonPink
      );
      bottomNeon.position.y = -0.16;
      seg.add(bottomNeon);

      seg.position.set(x, y, z);
      seg.rotation.y = ry;
      seg.scale.setScalar(1.0);
      // Upper ring slightly dimmer so it reads as further away.
      if (neonScale !== 1.0) {
        topNeon.material = neonTeal.clone();
        topNeon.material.transparent = true;
        topNeon.material.opacity = neonScale;
        bottomNeon.material = neonPink.clone();
        bottomNeon.material.transparent = true;
        bottomNeon.material.opacity = neonScale;
      }
      balconyGroup.add(seg);
    });
  });
  atrium.add(balconyGroup);

  // ---------- Lighting ----------
  // Main directional stays warm-pastel so marble reads white, not grey.
  const atriumLight = new THREE.DirectionalLight(0xfff1f2, 1.3);
  atriumLight.position.set(2, 8, 4);
  atrium.add(atriumLight);

  const pastelAmbient = new THREE.AmbientLight(0xfce7f3, 1.2);
  atrium.add(pastelAmbient);

  // Cyan fill from the skylight direction so the taller upper walls and the
  // fake top balcony ring don't fall into shadow.
  const skylightFill = new THREE.DirectionalLight(0xbfe9ff, 0.5);
  skylightFill.position.set(0, 10, 0);
  atrium.add(skylightFill);

  return { group: atrium };
}

// ---------- Helpers ----------

/**
 * Procedural terrazzo texture: pastel base with random soft speckles.
 * Self-contained so the atrium file has no external texture dependencies.
 */
function makeTerrazzoTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fce7f3';
  ctx.fillRect(0, 0, size, size);

  const palette = ['#f9a8d4', '#a7f3d0', '#bae6fd', '#e9d5ff', '#fde68a'];
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 1 + Math.random() * 3;
    ctx.fillStyle = palette[i % palette.length];
    ctx.globalAlpha = 0.35 + Math.random() * 0.35;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}