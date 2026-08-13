/* three-bg.js — fondo 3D ambiental con Three.js
   Metáfora visual: una "mesa de luz" con la pila de capas de Photoshop
   flotando como cartas translúcidas (con miniatura y borde), rodeada por
   iconos de herramientas, polvo de píxeles y luces dinámicas. */
(function () {
  "use strict";
  var container = document.getElementById("hero-canvas");
  if (!container || typeof THREE === "undefined") return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isMobile = window.innerWidth < 640;

  var ACCENTS = {
    cyan: 0x00e5c7,
    orange: 0xff6b35,
    violet: 0x9b7bff,
  };
  // Colores "miniatura" de cada capa (fotos ficticias del proyecto)
  var THUMB_COLORS = [0x0b3a36, 0x3a1f12, 0x241f4d, 0x1f3a4d, 0x143a2e, 0x4d1f33];

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0.55, 8.6);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  // ---- Luces ----
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  var key = new THREE.PointLight(ACCENTS.cyan, 2.0, 26);
  scene.add(key);
  var rim = new THREE.PointLight(ACCENTS.orange, 1.4, 22);
  scene.add(rim);
  var fill = new THREE.PointLight(ACCENTS.violet, 0.7, 18);
  fill.position.set(0, 3, -5);
  scene.add(fill);
  var top = new THREE.DirectionalLight(0xffffff, 0.6);
  top.position.set(0, 6, 3);
  scene.add(top);

  // ---- Escenario: todo lo focal se desplaza a la derecha (espacio vacío del hero) ----
  var stage = new THREE.Group();
  scene.add(stage);
  function heroShift() {
    var w = container.clientWidth;
    return w < 768 ? 0.4 : w < 1200 ? 1.7 : 2.3;
  }
  stage.position.x = heroShift();

  // ---- Pila de capas (cartas con grosor, borde y miniatura) ----
  var group = new THREE.Group();
  var LAYER_COUNT = 6;
  var layers = [];
  var layerEdges = [];
  for (var i = 0; i < LAYER_COUNT; i++) {
    var w = 3.3 - i * 0.1;
    var h = 2.15 - i * 0.07;
    var depth = 0.05;
    var geo = new THREE.BoxGeometry(w, h, depth);

    var mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.16 + (i % 3) * 0.05,
      roughness: 0.3,
      metalness: 0.35,
    });
    var card = new THREE.Mesh(geo, mat);

    // Miniatura del "contenido" de la capa, delante de la cara frontal
    var thGeo = new THREE.PlaneGeometry(w * 0.74, h * 0.62);
    var thMat = new THREE.MeshStandardMaterial({
      color: THUMB_COLORS[i],
      emissive: THUMB_COLORS[i],
      emissiveIntensity: 0.22,
      transparent: true,
      opacity: 0.7,
      roughness: 0.55,
      metalness: 0.05,
    });
    var thumb = new THREE.Mesh(thGeo, thMat);
    thumb.position.z = depth / 2 + 0.004;
    card.add(thumb);

    card.position.set((i - (LAYER_COUNT - 1) / 2) * 0.26, (i - (LAYER_COUNT - 1) / 2) * 0.13, -i * 0.4);
    card.rotation.x = -0.12;
    card.rotation.y = 0.45;
    card.rotation.z = (i - (LAYER_COUNT - 1) / 2) * 0.045;
    group.add(card);

    var edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: ACCENTS.cyan, transparent: true, opacity: 0.45 })
    );
    card.add(edges);

    layers.push(card);
    layerEdges.push(edges);
  }
  group.rotation.y = -0.5;
  stage.add(group);

  // ---- Iconos de herramientas flotantes alrededor ----
  var icons = [];
  var iconDefs = [
    { geo: new THREE.TorusGeometry(0.34, 0.09, 12, 32), color: ACCENTS.orange, p: [2.6, 1.0, 1.2] },
    { geo: new THREE.OctahedronGeometry(0.34), color: ACCENTS.cyan, p: [-2.7, 0.2, 0.7] },
    { geo: new THREE.ConeGeometry(0.27, 0.55, 24), color: ACCENTS.violet, p: [2.0, -1.0, -0.7] },
    { geo: new THREE.IcosahedronGeometry(0.3), color: ACCENTS.cyan, p: [-2.3, -0.8, -1.1] },
    { geo: new THREE.TetrahedronGeometry(0.38), color: ACCENTS.orange, p: [2.8, -0.2, -1.7] },
    { geo: new THREE.BoxGeometry(0.42, 0.42, 0.42), color: ACCENTS.violet, p: [-1.7, 1.3, -1.5] },
  ];
  iconDefs.forEach(function (def) {
    var mat = new THREE.MeshStandardMaterial({
      color: def.color,
      emissive: def.color,
      emissiveIntensity: 0.25,
      metalness: 0.6,
      roughness: 0.2,
    });
    var mesh = new THREE.Mesh(def.geo, mat);
    mesh.position.set(def.p[0], def.p[1], def.p[2]);
    mesh.userData = { baseY: def.p[1], speed: 0.5 + Math.random() * 0.6, phase: Math.random() * Math.PI * 2 };
    stage.add(mesh);
    icons.push(mesh);
  });

  // ---- Polvo de píxeles: partículas cian + destellos naranjas ----
  function makeParticles(count, color, size, opacity) {
    var positions = new Float32Array(count * 3);
    for (var p = 0; p < count; p++) {
      positions[p * 3] = (Math.random() - 0.5) * 17;
      positions[p * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[p * 3 + 2] = (Math.random() - 0.5) * 9 - 1;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    var mat = new THREE.PointsMaterial({
      color: color,
      size: size,
      transparent: true,
      opacity: opacity,
      depthWrite: false,
    });
    return new THREE.Points(geo, mat);
  }
  var dust = makeParticles(isMobile ? 50 : 110, ACCENTS.cyan, 0.035, 0.5);
  var sparks = makeParticles(isMobile ? 16 : 34, ACCENTS.orange, 0.055, 0.65);
  scene.add(dust);
  scene.add(sparks);

  // ---- Niebla adaptada al tema (oscuro/claro) ----
  var fog = new THREE.Fog(0x0e0f12, 12, 24);
  scene.fog = fog;
  function applyTheme() {
    var light = document.documentElement.getAttribute("data-theme") === "light";
    fog.color.set(light ? 0xf4f5f7 : 0x0e0f12);
  }
  applyTheme();
  new MutationObserver(applyTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  // ---- Interacción: parallax suave del ratón ----
  var mouseX = 0,
    mouseY = 0;
  var targetX = 0,
    targetY = 0.55;
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
    stage.position.x = heroShift();
  }
  window.addEventListener("resize", resize);

  var clock = new THREE.Clock();
  var frameId;
  var yOffsets = layers.map(function () {
    return Math.random() * Math.PI * 2;
  });

  function animate() {
    frameId = requestAnimationFrame(animate);
    var t = clock.getElapsedTime();

    if (reduceMotion) {
      renderer.render(scene, camera);
      return;
    }

    // Parallax del ratón (interpolación suave)
    targetX += (mouseX * 0.7 - targetX) * 0.05;
    targetY += (0.55 + mouseY * 0.45 - targetY) * 0.05;
    camera.position.x = targetX;
    camera.position.y = targetY;
    camera.lookAt(0, 0, 0);

    // Rotación y "respiración" de la pila de capas
    group.rotation.y = -0.5 + Math.sin(t * 0.12) * 0.14 + mouseX * 0.1;
    group.rotation.x = Math.sin(t * 0.1) * 0.03;

    layers.forEach(function (card, idx) {
      var bob = Math.sin(t * 0.55 + yOffsets[idx]) * 0.09;
      card.position.y = (idx - (LAYER_COUNT - 1) / 2) * 0.13 + bob;
      card.rotation.z += Math.sin(t * 0.4 + idx) * 0.0004;
    });

    // Iconos girando y flotando en su propio eje
    icons.forEach(function (mesh) {
      var d = mesh.userData;
      mesh.rotation.x += 0.005 * d.speed;
      mesh.rotation.y += 0.008 * d.speed;
      mesh.position.y = d.baseY + Math.sin(t * d.speed + d.phase) * 0.22;
    });

    // Partículas que ascienden (y rebotan por arriba)
    var dp = dust.geometry.attributes.position;
    var sp = sparks.geometry.attributes.position;
    for (var i = 0; i < dp.count; i++) {
      dp.array[i * 3 + 1] += 0.0035;
      if (dp.array[i * 3 + 1] > 5.2) dp.array[i * 3 + 1] = -5.2;
    }
    for (var j = 0; j < sp.count; j++) {
      sp.array[j * 3 + 1] += 0.006;
      if (sp.array[j * 3 + 1] > 5.2) sp.array[j * 3 + 1] = -5.2;
    }
    dp.needsUpdate = true;
    sp.needsUpdate = true;
    sparks.material.opacity = 0.45 + Math.sin(t * 1.4) * 0.2;

    // Luz principal orbitando para dar movimiento a los reflejos
    key.position.set(Math.cos(t * 0.25) * 5, 3.4 + Math.sin(t * 0.4) * 1.2, 5);
    rim.position.set(-5 - Math.sin(t * 0.2) * 1.5, -3.2, -3.5);

    renderer.render(scene, camera);
  }

  if (reduceMotion) {
    renderer.render(scene, camera);
  } else {
    animate();
  }

  // Pausa el bucle cuando la pestaña no es visible (ahorro de batería)
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      cancelAnimationFrame(frameId);
    } else if (!reduceMotion) {
      clock.getDelta();
      animate();
    }
  });
})();
