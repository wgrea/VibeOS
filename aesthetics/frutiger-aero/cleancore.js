// js/aesthetics/frutiger-aero/cleancore.js
import * as THREE from 'three';

export function createCleancore() {
  const group = new THREE.Group();

  // 1. Soft Mint-Aqua Hygiene Core (Low Cleancore gel/soap motif)
  const mintCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 32, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0x6ee7b7,
      emissive: 0x34d399,
      emissiveIntensity: 0.35,
      roughness: 0.04,
      clearcoat: 1.0,
    })
  );
  group.add(mintCore);

  // 2. Ultra-Pure Frosted Porcelain & Glass Cube (High Cleancore minimalism)
  const cubeGeo = new THREE.BoxGeometry(1.12, 1.12, 1.12);
  const pureCube = new THREE.Mesh(
    cubeGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xe0f2fe,
      emissiveIntensity: 0.22,
      roughness: 0.03,
      metalness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    })
  );
  group.add(pureCube);

  // 3. Crisp Ice-White Bevel Edges (sterile architectural framing)
  const cubeEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(cubeGeo),
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    })
  );
  pureCube.add(cubeEdges);

  // 4. Floating Crystal Soap Bubbles (Low Cleancore suds & freshness)
  const bubbleMat = new THREE.MeshPhysicalMaterial({
    color: 0xf0f9ff,
    emissive: 0xbae6fd,
    emissiveIntensity: 0.2,
    roughness: 0.01,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.85,
  });

  const bubbles = [];
  for (let i = 0; i < 12; i++) {
    const size = 0.075 + (i % 3) * 0.045;
    const bubble = new THREE.Mesh(new THREE.SphereGeometry(size, 20, 20), bubbleMat);
    const a = (i / 12) * Math.PI * 2;
    const r = 1.25 + (i % 2) * 0.34;
    bubble.position.set(Math.cos(a) * r, Math.sin(i * 1.7) * 0.62, Math.sin(a) * r);
    group.add(bubble);
    bubbles.push({ mesh: bubble, baseY: bubble.position.y, phase: i * 0.6 });
  }

    // 5. Sterile White Ceramic Tile & Chrome Ring (High Cleancore architectural purity)
  const tileBase = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.2, 0.08, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.08,
      clearcoat: 1.0,
    })
  );
  tileBase.position.y = -1.05;
  group.add(tileBase);

  const chromeRim = new THREE.Mesh(
    new THREE.TorusGeometry(1.18, 0.025, 16, 64),
    new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      metalness: 0.92,
      roughness: 0.06,
      clearcoat: 1.0,
    })
  );
  chromeRim.rotation.x = Math.PI / 2;
  chromeRim.position.y = -1.02;
  group.add(chromeRim);

  
  return {
    group,
    description:
      'Spanning High Cleancore’s sterile white minimalism and Low Cleancore’s fresh soap-and-water motifs, this 2000s sub-aesthetic celebrates spotless hygiene, frosted glass blocks, mint-aqua gels, and weightless crystal bubbles.',
    background: 'radial-gradient(circle at 50% 25%, #ffffff 0%, #f0f9ff 55%, #bae6fd 100%)',
    update(t, bounce, spring) {
      pureCube.rotation.y = t * 0.4;
      pureCube.rotation.x = Math.sin(t * 0.45) * 0.18;
      mintCore.position.y = Math.sin(t * 1.6) * 0.07;

      bubbles.forEach((b) => {
        b.mesh.position.y = b.baseY + Math.sin(t * 1.8 + b.phase) * 0.14;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
