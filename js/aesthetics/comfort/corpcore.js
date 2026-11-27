import * as THREE from 'three';

export function createCorpcore() {
  const group = new THREE.Group();

  // Procedural Fabric Cubicle Partition Texture
  function createCubicleFabricTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#d6d3d1';
    ctx.fillRect(0, 0, 128, 128);

    // Woven speckled office partition weave
    for (let y = 0; y < 128; y += 2) {
      for (let x = 0; x < 128; x += 2) {
        const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        const val = hash - Math.floor(hash);
        if (val > 0.65) {
          ctx.fillStyle = '#a8a29e';
        } else if (val < 0.25) {
          ctx.fillStyle = '#e7e5e4';
        } else {
          continue;
        }
        ctx.fillRect(x, y, 2, 2);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    return tex;
  }

  // Procedural Spreadsheet Screen Texture
  function createSpreadsheetTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 192;
    const ctx = canvas.getContext('2d');

    // Classic blue corporate title bar & toolbar
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 256, 192);

    ctx.fillStyle = '#0369a1';
    ctx.fillRect(0, 0, 256, 22);

    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 22, 256, 18);

    // Spreadsheet grid lines
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    const cols = 6;
    const rows = 9;
    const colW = 256 / cols;
    const rowH = (192 - 40) / rows;

    for (let c = 1; c < cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * colW, 40);
      ctx.lineTo(c * colW, 192);
      ctx.stroke();
    }
    for (let r = 1; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, 40 + r * rowH);
      ctx.lineTo(256, 40 + r * rowH);
      ctx.stroke();
    }

    // Highlighted green KPI header row & data bars
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(1, 41, 254, rowH - 1);

    ctx.fillStyle = '#0284c7';
    for (let r = 1; r < rows; r++) {
      const barW = 18 + ((r * 29) % 22);
      ctx.fillRect(colW + 4, 40 + r * rowH + 4, barW, rowH - 8);
      ctx.fillRect(colW * 3 + 4, 40 + r * rowH + 4, barW * 0.8, rowH - 8);
    }

    return new THREE.CanvasTexture(canvas);
  }

  // Materials
  const fabricWallMat = new THREE.MeshStandardMaterial({
    map: createCubicleFabricTexture(),
    roughness: 0.92,
  });

  const wallTrimMat = new THREE.MeshStandardMaterial({
    color: 0x78716c,
    roughness: 0.55,
    metalness: 0.25,
  });

  const deskLaminateMat = new THREE.MeshStandardMaterial({
    color: 0xe7e5e4,
    roughness: 0.45,
  });

  const beigePlasticMat = new THREE.MeshStandardMaterial({
    color: 0xd6d3d1,
    roughness: 0.42,
  });

  const screenDisplayMat = new THREE.MeshBasicMaterial({
    map: createSpreadsheetTexture(),
  });

  const mugYellowMat = new THREE.MeshPhysicalMaterial({
    color: 0xfacc15,
    roughness: 0.2,
    clearcoat: 0.85,
  });

  const coffeeDarkMat = new THREE.MeshPhysicalMaterial({
    color: 0x291509,
    roughness: 0.15,
    clearcoat: 0.9,
  });

  const folderManilaMat = new THREE.MeshStandardMaterial({
    color: 0xfde68a,
    roughness: 0.7,
  });

  const staplerRedMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    roughness: 0.3,
    metalness: 0.25,
  });

  // Overhead Cool Fluorescent Office Tube Lighting
  const ambientLight = new THREE.AmbientLight(0xf8fafc, 0.85);
  const fluorescentLight = new THREE.DirectionalLight(0xf0f9ff, 1.25);
  fluorescentLight.position.set(1.5, 4.5, 3.5);
  const warmBounceLight = new THREE.DirectionalLight(0xfef3c7, 0.45);
  warmBounceLight.position.set(-3, 2, 2);
  group.add(ambientLight, fluorescentLight, warmBounceLight);

  // =========================================================================
  // 1. ANCHORED / STATIC STAGE: Corporate Cubicle Corner & Workstation
  // =========================================================================
  const cubicle = new THREE.Group();
  cubicle.position.set(-0.08, -0.05, 0);

  // Back & Left Fabric Cubicle Partition Walls with Dark Trim Rails
  const backPartition = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.32, 0.08), fabricWallMat);
  backPartition.position.set(0, 0.04, -0.58);

  const backTopRail = new THREE.Mesh(new THREE.BoxGeometry(2.14, 0.04, 0.1), wallTrimMat);
  backTopRail.position.set(0, 0.71, -0.58);

  const sidePartition = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.32, 1.15), fabricWallMat);
  sidePartition.position.set(-1.02, 0.04, -0.02);

  const sideTopRail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.04, 1.18), wallTrimMat);
  sideTopRail.position.set(-1.02, 0.71, -0.02);

  cubicle.add(backPartition, backTopRail, sidePartition, sideTopRail);

  // Laminate Office Desk Surface
  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.02, 0.06, 1.08), deskLaminateMat);
  deskTop.position.set(0.01, -0.36, -0.02);

  const deskEdge = new THREE.Mesh(new THREE.BoxGeometry(2.03, 0.065, 0.03), wallTrimMat);
  deskEdge.position.set(0.01, -0.36, 0.52);

  cubicle.add(deskTop, deskEdge);

  // Beige Desktop Monitor & Spreadsheet Display
  const monitorGroup = new THREE.Group();
  monitorGroup.position.set(-0.22, -0.02, -0.22);
  monitorGroup.rotation.y = 0.12;

  const monitorBase = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.04, 0.24), beigePlasticMat);
  monitorBase.position.y = -0.29;

  const monitorNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.14, 12), beigePlasticMat);
  monitorNeck.position.y = -0.21;

  const monitorBezel = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.54, 0.18), beigePlasticMat);
  monitorBezel.position.y = 0.09;

  const screenPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.44), screenDisplayMat);
  screenPlane.position.set(0, 0.09, 0.092);

  monitorGroup.add(monitorBase, monitorNeck, monitorBezel, screenPlane);
  cubicle.add(monitorGroup);

  // Beige Mechanical Keyboard & Mouse
  const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.025, 0.2), beigePlasticMat);
  keyboard.position.set(-0.2, -0.315, 0.18);
  keyboard.rotation.set(0.06, 0.08, 0);

  const mousePad = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.008, 0.22),
    new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.7 })
  );
  mousePad.position.set(0.24, -0.325, 0.2);

  const mouse = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.032, 0.13), beigePlasticMat);
  mouse.position.set(0.24, -0.308, 0.2);

  cubicle.add(keyboard, mousePad, mouse);

  // Stacked Manila Folders & Iconic Red Swingline-Style Stapler (Left Side of Desk)
  const folder1 = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.022, 0.44), folderManilaMat);
  folder1.position.set(-0.72, -0.318, 0.12);
  folder1.rotation.y = -0.18;

  const folder2 = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.022, 0.44), folderManilaMat);
  folder2.position.set(-0.71, -0.296, 0.13);
  folder2.rotation.y = -0.05;

  const stapler = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.055, 0.22), staplerRedMat);
  stapler.position.set(-0.68, -0.26, 0.14);
  stapler.rotation.y = 0.22;

  cubicle.add(folder1, folder2, stapler);

  group.add(cubicle);

  // =========================================================================
  // 2. MOVING ELEMENT: Floating Yellow Office Coffee Mug
  // =========================================================================
  const mugGroup = new THREE.Group();
  mugGroup.position.set(0.68, 0.12, 0.14);

  const cupOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.14, 0.28, 24), mugYellowMat);
  const coffeeSurface = new THREE.Mesh(new THREE.CircleGeometry(0.135, 20), coffeeDarkMat);
  coffeeSurface.rotation.x = -Math.PI / 2;
  coffeeSurface.position.y = 0.11;

  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.085, 0.024, 10, 20, Math.PI * 1.25),
    mugYellowMat
  );
  handle.rotation.z = -Math.PI * 0.62;
  handle.position.x = 0.14;

  mugGroup.add(cupOuter, coffeeSurface, handle);
  group.add(mugGroup);

  return {
    group,
    description:
      'Late-90s corporate cubicle workstation with speckled fabric partition walls, a glowing spreadsheet monitor, beige keyboard, stacked manila folders, red stapler, and a floating yellow coffee mug.',
    background: 'radial-gradient(circle at 50% 30%, #e7e5e4 0%, #a8a29e 55%, #57534e 100%)',
    update(t, bounce, spring) {
      mugGroup.position.y = 0.12 + Math.sin(t * 2.2) * 0.09;
      mugGroup.rotation.y = t * 0.75;
      mugGroup.rotation.z = Math.sin(t * 1.5) * 0.12;
      group.scale.setScalar(1 + spring * 0.2);
    },
  };
}
