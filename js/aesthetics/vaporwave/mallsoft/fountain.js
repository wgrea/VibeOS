import * as THREE from 'three';

// Fountain local Y origin is the floor plane (y = 0 inside the group).
// The group is positioned in world space by index.js / the caller.
const BASIN_Y = -0.98;
const UPPER_TIER_Y = -0.25;
const UPPER_WATER_Y = -0.24;
const BASIN_WATER_Y = -0.97;

const STREAM_COUNT = 8;
const STREAM_RADIUS = 0.92;

export function createFountain() {
  const fountain = new THREE.Group();

  // Shared stone material. Exported so atrium/props can reuse it and the
  // pillars, balconies, and fountain tiers all read as the same marble.
  const marbleMat = new THREE.MeshStandardMaterial({
    color: 0xfdf2f8,
    roughness: 0.28,
    metalness: 0.04,
  });

  // Shared water material. Physical + clearcoat so it catches the skylight
  // and the neon without needing an env map.
  const waterMat = new THREE.MeshPhysicalMaterial({
    color: 0x22d3ee,
    transparent: true,
    opacity: 0.82,
    roughness: 0.05,
    metalness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    transmission: 0.0,
  });

  // ---------- Basin ----------
  const basin = new THREE.Mesh(
    new THREE.CylinderGeometry(1.7, 1.85, 0.45, 24),
    marbleMat
  );
  basin.position.y = BASIN_Y;
  fountain.add(basin);

  const basinWater = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 1.6, 0.47, 24),
    waterMat
  );
  basinWater.position.y = BASIN_WATER_Y;
  fountain.add(basinWater);

  // ---------- Upper tier ----------
  const upperTier = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.95, 0.25, 24),
    marbleMat
  );
  upperTier.position.y = UPPER_TIER_Y;
  fountain.add(upperTier);

  const upperWater = new THREE.Mesh(
    new THREE.CylinderGeometry(0.78, 0.78, 0.27, 24),
    waterMat
  );
  upperWater.position.y = UPPER_WATER_Y;
  fountain.add(upperWater);

  // ---------- Center pillar ----------
  const centerPillar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.35, 1.3, 16),
    marbleMat
  );
  centerPillar.position.y = -0.55;
  fountain.add(centerPillar);

  // A small cap on top of the pillar so it doesn't look like a cut cylinder.
  const pillarCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 16, 12),
    marbleMat
  );
  pillarCap.position.y = 0.1;
  pillarCap.scale.y = 0.6;
  fountain.add(pillarCap);

  // ---------- Streams ----------
  // Each stream gets its own water material clone so the animated scale
  // doesn't also stretch the opacity/clearcoat in weird ways, and so we can
  // later tint one stream independently if we want.
  const streams = [];
  const streamGeo = new THREE.CylinderGeometry(0.025, 0.035, 0.58, 8);
  for (let i = 0; i < STREAM_COUNT; i++) {
    const a = (i / STREAM_COUNT) * Math.PI * 2;
    const streamMat = waterMat.clone();
    const stream = new THREE.Mesh(streamGeo, streamMat);
    stream.position.set(
      Math.cos(a) * STREAM_RADIUS,
      -0.54,
      Math.sin(a) * STREAM_RADIUS
    );
    stream.rotation.z = -Math.cos(a) * 0.14;
    stream.rotation.x = Math.sin(a) * 0.14;
    fountain.add(stream);
    streams.push({ mesh: stream, phase: i });
  }

  // ---------- Plinth / surround ----------
  // A thin outer ring of marble at floor level so the fountain reads as
  // "set into" the floor rather than floating on it.
  const plinth = new THREE.Mesh(
    new THREE.RingGeometry(1.85, 2.15, 32),
    marbleMat
  );
  plinth.rotation.x = -Math.PI / 2;
  plinth.position.y = BASIN_Y - 0.22;
  fountain.add(plinth);

  // World placement. Kept as a constant so index.js and future scale-ups
  // don't have to hunt for the -2.5.
  fountain.position.set(0, 0, -2.5);

  return {
    group: fountain,
    marbleMat,

    update(t) {
      basinWater.position.y = BASIN_WATER_Y + Math.sin(t * 2.5) * 0.015;
      upperWater.position.y = UPPER_WATER_Y + Math.cos(t * 2.8) * 0.01;

      streams.forEach(({ mesh, phase }) => {
        const sx = 0.9 + Math.sin(t * 8 + phase) * 0.15;
        const sz = 0.9 + Math.cos(t * 8 + phase) * 0.15;
        mesh.scale.set(sx, 1.0, sz);
      });
    },
  };
}