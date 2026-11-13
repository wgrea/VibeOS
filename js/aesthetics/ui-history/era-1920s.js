// js/aesthetics/ui-history/era-1920s.js
export function createScene(THREE) {
  const group = new THREE.Group();

  // Shared materials
  const bakeliteMat = new THREE.MeshStandardMaterial({
    color: 0x24170e,
    roughness: 0.35,
    metalness: 0.2
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.85
  });
  const holeMat = new THREE.MeshStandardMaterial({
    color: 0x110a05,
    roughness: 0.8
  });

  // Bakelite control panel backboard
  const panel = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.7, 0.28), bakeliteMat);
  group.add(panel);

  // Brass Art Deco border frame
  const frameEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(5.24, 2.74, 0.3));
  const frame = new THREE.LineSegments(frameEdges, new THREE.LineBasicMaterial({ color: 0xd4af37 }));
  group.add(frame);

  // -----------------------------------------
  // 1. LEFT: Rotary Phone Dial
  // -----------------------------------------
  const rotaryGroup = new THREE.Group();
  rotaryGroup.position.set(-1.35, 0, 0.18);

  const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.08, 16, 40), brassMat);
  rotaryGroup.add(bezel);

  const wheelGroup = new THREE.Group();
  wheelGroup.position.z = 0.06;

  const wheelPlateGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.08, 36);
  wheelPlateGeo.rotateX(Math.PI / 2);
  wheelGroup.add(new THREE.Mesh(wheelPlateGeo, brassMat));

  // Historically accurate 10 finger holes packed along a 270-degree arc
  const holeGeo = new THREE.CylinderGeometry(0.115, 0.115, 0.1, 20);
  holeGeo.rotateX(Math.PI / 2);

  const arcSpan = Math.PI * 1.5; // 270 degrees for the 10 holes, leaving a 90-degree gap at the stop
  const startAngle = -0.15;      // Starts just above the finger stop on the right

  for (let i = 0; i < 10; i++) {
    const angle = startAngle + (i / 9) * arcSpan;
    const hole = new THREE.Mesh(holeGeo, holeMat);
    hole.position.set(Math.cos(angle) * 0.56, Math.sin(angle) * 0.56, 0.01);
    wheelGroup.add(hole);
  }


  const stop = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.14), brassMat);
  stop.position.set(0.7, -0.4, 0.12);
  stop.rotation.z = -0.5;

  rotaryGroup.add(stop, wheelGroup);
  group.add(rotaryGroup);

  // -----------------------------------------
  // 2. TOP-RIGHT: Bakelite Radio Tuning Knob
  // -----------------------------------------
  const radioGroup = new THREE.Group();
  radioGroup.position.set(1.25, 0.55, 0.22);

  const dialBezel = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.05, 12, 32), brassMat);
  radioGroup.add(dialBezel);

  const knobGroup = new THREE.Group();
  const knobGeo = new THREE.CylinderGeometry(0.38, 0.44, 0.24, 24);
  knobGeo.rotateX(Math.PI / 2);
  knobGroup.add(new THREE.Mesh(knobGeo, bakeliteMat));

  // Brass indicator pointer on the radio knob
  const pointerBar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.34, 0.06), brassMat);
  pointerBar.position.set(0, 0.14, 0.12);
  knobGroup.add(pointerBar);

  radioGroup.add(knobGroup);
  group.add(radioGroup);

  // -----------------------------------------
  // 3. BOTTOM-RIGHT: Physical Toggle Switch
  // -----------------------------------------
  const toggleGroup = new THREE.Group();
  toggleGroup.position.set(1.25, -0.65, 0.18);

  const collarGeo = new THREE.CylinderGeometry(0.22, 0.26, 0.12, 20);
  collarGeo.rotateX(Math.PI / 2);
  toggleGroup.add(new THREE.Mesh(collarGeo, brassMat));

  const leverPivot = new THREE.Group();
  const leverGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.55, 12);
  leverGeo.translate(0, 0.25, 0);
  const lever = new THREE.Mesh(leverGeo, brassMat);
  lever.rotation.x = Math.PI / 2;
  leverPivot.add(lever);

  toggleGroup.add(leverPivot);
  group.add(toggleGroup);

  return {
    group,
    update(time, pointer = { x: 0, y: 0 }) {
      // 1. Rotary dial wind-up and spring return
      const cycle = time % 4;
      if (cycle < 1.5) {
        wheelGroup.rotation.z = -(cycle / 1.5) * 2.2;
      } else if (cycle < 2.5) {
        const t = (cycle - 1.5) / 1.0;
        wheelGroup.rotation.z = -2.2 * (1 - t * t);
      } else {
        wheelGroup.rotation.z = 0;
      }

      // 2. Radio tuning knob sweeping across frequencies
      knobGroup.rotation.z = Math.sin(time * 1.3) * 1.1;

      // 3. Toggle switch snapping up and down every 2 seconds
      const isOn = Math.floor(time / 2) % 2 === 0;
      const targetTilt = isOn ? 0.45 : -0.45;
      leverPivot.rotation.x += (targetTilt - leverPivot.rotation.x) * 0.2;

      group.rotation.y = pointer.x * 0.35;
      group.rotation.x = -pointer.y * 0.25;
    }
  };
}
