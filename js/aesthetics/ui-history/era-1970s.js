export function createScene(THREE) {
  const group = new THREE.Group();

  // 1. Chunky 1970s Terminal Housing & Integrated Keyboard Deck
  const casingMat = new THREE.MeshStandardMaterial({
    color: 0xd6cfc2, // Classic 1970s warm putty/beige
    roughness: 0.65
  });
  const darkBezelMat = new THREE.MeshStandardMaterial({
    color: 0x2b2a27,
    roughness: 0.5
  });

  // Main CRT monitor body
  const monitorBody = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.9, 2.0), casingMat);
  monitorBody.position.set(0, 0.35, -0.55);
  group.add(monitorBody);

  // Recessed dark screen bezel
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(3.65, 2.45, 0.15), darkBezelMat);
  bezel.position.set(0, 0.35, 0.42);
  group.add(bezel);

  // Integrated slanted keyboard base (emphasizing keyboard-only navigation)
  const kbBase = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.45, 1.4), casingMat);
  kbBase.position.set(0, -1.15, 0.25);
  kbBase.rotation.x = 0.12;
  group.add(kbBase);

  // Rows of sculpted mechanical keycaps
  const keyMat = new THREE.MeshStandardMaterial({ color: 0x4a4741, roughness: 0.5 });
  const keyGeo = new THREE.BoxGeometry(0.24, 0.12, 0.22);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 11; col++) {
      const key = new THREE.Mesh(keyGeo, keyMat);
      key.position.set(-1.5 + col * 0.3, -0.88 - row * 0.03, 0.05 + row * 0.28);
      key.rotation.x = 0.12;
      group.add(key);
    }
  }

  // -----------------------------------------
  // 2. Dynamic Phosphor CRT Screen (Structured Text Menu + Typing)
  // -----------------------------------------
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');
  const screenTexture = new THREE.CanvasTexture(canvas);

  const screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3.35, 2.18),
    new THREE.MeshBasicMaterial({ map: screenTexture })
  );
  screenMesh.position.set(0, 0.35, 0.51);
  group.add(screenMesh);

  const commandToType = 'RUN MENU_SELECT 2';

  function drawTerminal(time) {
    // Switch between Green Phosphor (first 5s) and Amber Phosphor (next 5s)
    const isAmber = Math.floor(time / 5) % 2 === 1;
    const bg = isAmber ? '#1a0f00' : '#041404';
    const fg = isAmber ? '#ffb000' : '#33ff33';
    const dim = isAmber ? 'rgba(255, 176, 0, 0.14)' : 'rgba(51, 255, 51, 0.14)';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle CRT horizontal scanlines
    ctx.fillStyle = dim;
    for (let y = 0; y < canvas.height; y += 6) {
      ctx.fillRect(0, y, canvas.width, 2);
    }

    // Terminal text & structured menu
    ctx.fillStyle = fg;
    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.fillText('SYSTEM CONSOLE v1.4 [TTY-01]', 24, 42);
    ctx.fillText('==============================', 24, 66);
    ctx.fillText('  [1] LOAD TAPE ARCHIVE', 24, 106);
    ctx.fillText('  [2] DIRECTORY LISTING', 24, 138);
    ctx.fillText('  [3] DIAGNOSTIC STATUS', 24, 170);
    ctx.fillText('------------------------------', 24, 206);

    // Animated typed command
    const charCount = Math.floor((time * 6) % (commandToType.length + 10));
    const visibleCmd = commandToType.slice(0, Math.min(charCount, commandToType.length));
    const promptText = `> ${visibleCmd}`;
    ctx.fillText(promptText, 24, 248);

    // Blinking solid block cursor
    if (Math.floor(time * 2.5) % 2 === 0) {
      const textWidth = ctx.measureText(promptText).width;
      ctx.fillRect(28 + textWidth, 230, 14, 22);
    }

    screenTexture.needsUpdate = true;
  }

  drawTerminal(0);

  return {
    group,
    update(time, pointer = { x: 0, y: 0 }) {
      drawTerminal(time);
      group.rotation.y = pointer.x * 0.3;
      group.rotation.x = -pointer.y * 0.2;
    }
  };
}
