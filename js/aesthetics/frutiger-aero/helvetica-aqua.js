import * as THREE from 'three';

export function createHelveticaAqua() {
  const group = new THREE.Group();

  // Iconic Mac OS X Aqua Gel Pill Button
  const gelPill = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.52, 1.15, 20, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.4,
      roughness: 0.04,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      transparent: true,
      opacity: 0.9,
    })
  );
  gelPill.rotation.z = Math.PI / 2;
  group.add(gelPill);

  // Crisp White Specular Top Highlight Bar
  const highlight = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.14, 0.95, 12, 20),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 })
  );
  highlight.rotation.z = Math.PI / 2;
  highlight.position.set(0, 0.28, 0.42);
  group.add(highlight);

  // Floating Pinstripe Glass Bars Behind Pill
  const barMat = new THREE.MeshPhysicalMaterial({
    color: 0xf1f5f9,
    roughness: 0.15,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.75,
  });

  const topBar = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.14, 0.08), barMat);
  topBar.position.set(0, 0.85, -0.35);
  const botBar = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.14, 0.08), barMat);
  botBar.position.set(0, -0.85, -0.35);
  group.add(topBar, botBar);

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #bae6fd 55%, #38bdf8 100%)',
    update(t, bounce, spring) {
      group.rotation.y = Math.sin(t * 0.6) * 0.28;
      group.rotation.x = Math.cos(t * 0.5) * 0.12;
      gelPill.position.y = Math.sin(t * 1.8) * 0.08;
      highlight.position.y = 0.28 + Math.sin(t * 1.8) * 0.08;

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
