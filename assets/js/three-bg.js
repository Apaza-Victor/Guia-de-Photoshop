/* three-bg.js — fondo 3D ambiental con Three.js
   Metáfora visual: una pila de "capas" translúcidas flotando y girando,
   como el panel de capas de Photoshop llevado a un espacio 3D. */
(function () {
  "use strict";
  var container = document.getElementById("hero-canvas");
  if (!container || typeof THREE === "undefined") return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0.6, 9);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Luces suaves
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  var key = new THREE.PointLight(0x00e5c7, 2.2, 30);
  key.position.set(4, 4, 6);
  scene.add(key);
  var rim = new THREE.PointLight(0xff6b35, 1.4, 30);
  rim.position.set(-6, -3, -4);
  scene.add(rim);

  // Grupo de "capas" — planos apilados con ligero offset, como en Photoshop
  var group = new THREE.Group();
  var LAYER_COUNT = 7;
  var layers = [];
  for (var i = 0; i < LAYER_COUNT; i++) {
    var w = 3.6 - i * 0.12;
    var h = 2.3 - i * 0.08;
    var geo = new THREE.PlaneGeometry(w, h);
    var hue = 0.5 - i * 0.02;
    var color = new THREE.Color().setHSL(hue, 0.75, 0.55);
    var mat = new THREE.MeshPhysicalMaterial({
      color: color,
      transparent: true,
      opacity: 0.16 + (i % 3) * 0.04,
      roughness: 0.35,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.set((i - LAYER_COUNT / 2) * 0.28, (i - LAYER_COUNT / 2) * 0.16, -i * 0.5);
    mesh.rotation.x = -0.15;
    mesh.rotation.y = 0.35;
    group.add(mesh);

    var edges = new THREE.EdgesGeometry(geo);
    var line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x00e5c7, transparent: true, opacity: 0.35 })
    );
    line.position.copy(mesh.position);
    line.rotation.copy(mesh.rotation);
    group.add(line);

    layers.push(mesh);
  }
  group.rotation.y = 0.25;
  scene.add(group);

  // Partículas dispersas ("pixels" flotando)
  var particleCount = window.innerWidth < 560 ? 60 : 140;
  var positions = new Float32Array(particleCount * 3);
  for (var p = 0; p < particleCount; p++) {
    positions[p * 3] = (Math.random() - 0.5) * 16;
    positions[p * 3 + 1] = (Math.random() - 0.5) * 9;
    positions[p * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
  }
  var pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  var pMat = new THREE.PointsMaterial({
    color: 0x00e5c7,
    size: 0.035,
    transparent: true,
    opacity: 0.55,
  });
  var points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  var clock = new THREE.Clock();
  var mouseX = 0,
    mouseY = 0;
  window.addEventListener("pointermove", function (e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function resize() {
    var w = container.clientWidth,
      h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", resize);

  var frameId;
  function animate() {
    frameId = requestAnimationFrame(animate);
    var t = clock.getElapsedTime();
    if (!reduceMotion) {
      group.rotation.y = 0.25 + Math.sin(t * 0.15) * 0.18 + mouseX * 0.15;
      group.rotation.x = -0.05 + mouseY * 0.08;
      points.rotation.y = t * 0.02;
      layers.forEach(function (m, idx) {
        m.position.z = -idx * 0.5 + Math.sin(t * 0.4 + idx) * 0.06;
      });
    }
    renderer.render(scene, camera);
  }
  animate();

  // Pausa el bucle cuando la pestaña no es visible (ahorro de batería)
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      cancelAnimationFrame(frameId);
    } else {
      animate();
    }
  });
})();
