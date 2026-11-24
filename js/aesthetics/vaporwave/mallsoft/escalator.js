import * as THREE from 'three';

// Geometry of the escalator. Kept as constants so the slope angle,
// step pitch, and rail length are all derived from the same numbers.
const STEP_COUNT = 18;
const STEP_WIDTH = 0.55;
const STEP_DEPTH = 0.32;
const STEP_HEIGHT = 0.08;

const START_Y = -1.2;   // floor level (matches atrium FLOOR_Y)
const END_Y = 1.2;      // roughly the mezzanine underside
const START_Z = 3.4;
const END_Z = -1.4;
const ESC_X = 5.6;      // right side of the atrium

// Distance along the incline (horizontal), and the resulting angle.
const RUN = START_Z - END_Z;          // 4.8
const RISE = END_Y - START_Y;         // 2.4
const INCLINE_ANGLE = Math.atan2(RISE, RUN); // ~0.4636 rad
const INCLINE_LENGTH = Math.hypot(RUN, RISE); // ~5.37

// How fast the steps travel (in normalized 0..1 along the incline per second).
const STEP_SPEED = 0.18;

export function createEscalator() {
  const escalatorGroup = new THREE.Group();

  const stepMat = new THREE.MeshStandardMaterial({
    color: 0xd4d4d8,
    roughness: 0.4,
    metalness: 0.3,
  });
  const railMat = new THREE.MeshStandardMaterial({
    color: 0x2dd4bf,
    roughness: 0.2,
    metalness: 0.6,
  });
  const handrailMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.6,
  });

  const escalatorSteps = [];

  // ---------- Steps ----------
  // Steps are laid out along the incline and spaced STEP_DEPTH apart in the
  // *local* escalator frame, not in world Z. Each step's world position is
  // recomputed every frame from its own offset along the incline.
  const stepGeo = new THREE.BoxGeometry(STEP_WIDTH, STEP_HEIGHT, STEP_DEPTH);

  for (let i = 0; i < STEP_COUNT; i++) {
    const step = new THREE.Mesh(stepGeo, stepMat);
    // Rotate each step so its top face is horizontal even though the
    // incline is tilted — that's how real escalator steps work.
    step.rotation.x = INCLINE_ANGLE;
    escalatorGroup.add(step);
    escalatorSteps.push({
      mesh: step,
      // Normalized offset along the incline (0 = bottom, 1 = top).
      offset: i / STEP_COUNT,
    });
  }

  // ---------- Side skirts + handrails ----------
  // One shared geometry per pair, mirrored by position only.
  const skirtGeo = new THREE.BoxGeometry(0.06, 0.5, INCLINE_LENGTH);
  const handrailGeo = new THREE.BoxGeometry(0.05, 0.06, INCLINE_LENGTH);
  const midY = (START_Y + END_Y) / 2;
  const midZ = (START_Z + END_Z) / 2;

  for (const side of [-1, 1]) {
    const x = ESC_X + side * (STEP_WIDTH / 2 + 0.03);

    const skirt = new THREE.Mesh(skirtGeo, railMat);
    skirt.position.set(x, midY - 0.05, midZ);
    skirt.rotation.x = INCLINE_ANGLE;
    escalatorGroup.add(skirt);

    const handrail = new THREE.Mesh(handrailGeo, handrailMat);
    handrail.position.set(x, midY + 0.25, midZ);
    handrail.rotation.x = INCLINE_ANGLE;
    escalatorGroup.add(handrail);
  }

  // ---------- Landing plates ----------
  // Flat marble-ish plates at the bottom and top of the incline so the
  // escalator doesn't just end in mid-air.
  const plateMat = new THREE.MeshStandardMaterial({
    color: 0xe5e7eb,
    roughness: 0.5,
    metalness: 0.2,
  });
  const plateGeo = new THREE.BoxGeometry(STEP_WIDTH + 0.2, 0.06, 0.6);

  const bottomPlate = new THREE.Mesh(plateGeo, plateMat);
  bottomPlate.position.set(ESC_X, START_Y - 0.03, START_Z + 0.3);
  escalatorGroup.add(bottomPlate);

  const topPlate = new THREE.Mesh(plateGeo, plateMat);
  topPlate.position.set(ESC_X, END_Y - 0.03, END_Z - 0.3);
  escalatorGroup.add(topPlate);

  // ---------- Update ----------
  // Each step has a normalized offset that advances with time. When it
  // passes 1.0 it wraps to 0.0 (bottom), which is what makes the escalator
  // look like it's continuously running.
  function positionStep(mesh, offset) {
    const y = START_Y + RISE * offset;
    const z = START_Z - RUN * offset;
    mesh.position.set(ESC_X, y, z);
  }

  return {
    group: escalatorGroup,
    update(t) {
      for (let i = 0; i < escalatorSteps.length; i++) {
        const s = escalatorSteps[i];
        // Wrap the offset so it loops. STEP_SPEED is in cycles per second.
        const offset = (s.offset + t * STEP_SPEED) % 1;
        positionStep(s.mesh, offset);
      }
    },
  };
}