/* babylon-scene.js — escena 3D interactiva con Babylon.js
   Visualiza el concepto de "pila de capas" de Photoshop: el usuario
   puede arrastrar para orbitar y usar la rueda para hacer zoom. */
(function () {
  "use strict";
  var canvas = document.getElementById("babylon-canvas");
  if (!canvas || typeof BABYLON === "undefined") return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

  function createScene() {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    var camera = new BABYLON.ArcRotateCamera(
      "cam",
      -Math.PI / 2.6,
      Math.PI / 2.6,
      9,
      new BABYLON.Vector3(0, 0.4, 0),
      scene
    );
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 14;
    camera.wheelPrecision = 40;
    camera.pinchPrecision = 80;

    var key = new BABYLON.PointLight("key", new BABYLON.Vector3(4, 6, -4), scene);
    key.diffuse = new BABYLON.Color3(0, 0.9, 0.78);
    key.intensity = 0.9;
    var rim = new BABYLON.PointLight("rim", new BABYLON.Vector3(-5, -3, 5), scene);
    rim.diffuse = new BABYLON.Color3(1, 0.42, 0.21);
    rim.intensity = 0.6;
    scene.ambientColor = new BABYLON.Color3(0.2, 0.2, 0.24);
    var hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
    hemi.intensity = 0.35;

    var labels = ["Fondo", "Sombras", "Base", "Retoque", "Color", "Texto", "Efectos"];
    var layers = [];
    var count = labels.length;

    for (var i = 0; i < count; i++) {
      var box = BABYLON.MeshBuilder.CreateBox(
        "layer" + i,
        { width: 3.6 - i * 0.18, height: 2.2 - i * 0.12, depth: 0.06 },
        scene
      );
      box.position.y = i * 0.45 - (count * 0.45) / 2;

      var mat = new BABYLON.StandardMaterial("mat" + i, scene);
      var hue = 172 - i * 14;
      mat.diffuseColor = BABYLON.Color3.FromHSV(hue / 360, 0.65, 0.85);
      mat.alpha = 0.42 + (i % 2) * 0.08;
      mat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      mat.emissiveColor = BABYLON.Color3.FromHSV(hue / 360, 0.5, 0.18);
      box.material = mat;

      layers.push(box);
    }

    // Suave animación idle de flotación (respeta reduce-motion)
    if (!reduceMotion) {
      scene.registerBeforeRender(function () {
        var t = performance.now() * 0.001;
        layers.forEach(function (box, idx) {
          box.rotation.y = Math.sin(t * 0.25 + idx) * 0.05;
          box.position.x = Math.sin(t * 0.3 + idx * 0.6) * 0.08;
        });
      });
    }

    return scene;
  }

  var scene = createScene();
  engine.runRenderLoop(function () {
    scene.render();
  });
  window.addEventListener("resize", function () {
    engine.resize();
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) engine.stopRenderLoop();
    else engine.runRenderLoop(function () { scene.render(); });
  });
})();
