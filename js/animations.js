/* animations.js — animaciones de interfaz con anime.js
   (las animaciones 3D de fondo viven en three-bg.js / babylon-scene.js) */
(function () {
  "use strict";
  if (typeof anime === "undefined") return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Entrada del hero: título letra a letra + fade de los hijos ----
  var heroTitle = document.querySelector("[data-anime-title]");
  if (heroTitle && !reduceMotion) {
    var text = heroTitle.textContent;
    heroTitle.innerHTML = text
      .split("")
      .map(function (ch) {
        return '<span class="char" style="display:inline-block; will-change:transform">' +
          (ch === " " ? "&nbsp;" : ch) + "</span>";
      })
      .join("");

    anime.timeline({ easing: "easeOutExpo" })
      .add({
        targets: heroTitle.querySelectorAll(".char"),
        translateY: [40, 0],
        opacity: [0, 1],
        duration: 900,
        delay: anime.stagger(18),
      })
      .add(
        {
          targets: "[data-anime-fade]",
          translateY: [16, 0],
          opacity: [0, 1],
          duration: 700,
          delay: anime.stagger(90),
        },
        "-=500"
      );
  } else if (heroTitle) {
    heroTitle.style.opacity = 1;
  }

  // ---- Revelado escalonado de tarjetas / secciones al hacer scroll ----
  document.querySelectorAll("[data-reveal]").forEach(function (group) {
    group.addEventListener("reveal", function () {
      var targets = group.matches("[data-reveal-children]")
        ? group.children
        : group;
      anime({
        targets: targets,
        opacity: [0, 1],
        translateY: [22, 0],
        duration: 650,
        delay: anime.stagger(70),
        easing: "easeOutCubic",
      });
    });
  });

  // ---- Micro-interacción en botones primarios ----
  document.querySelectorAll(".btn-primary").forEach(function (btn) {
    btn.addEventListener("mouseenter", function () {
      if (reduceMotion) return;
      anime({
        targets: btn,
        scale: [1, 1.045],
        duration: 260,
        easing: "easeOutQuad",
      });
    });
    btn.addEventListener("mouseleave", function () {
      if (reduceMotion) return;
      anime({ targets: btn, scale: 1, duration: 260, easing: "easeOutQuad" });
    });
  });

  // ---- Barra de progreso de lectura (rellena los puntos del "progress-rail") ----
  var rail = document.querySelector("[data-progress-rail]");
  if (rail) {
    var dots = rail.querySelectorAll("span");
    function updateRail() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? scrollTop / docHeight : 0;
      var activeCount = Math.round(pct * dots.length);
      dots.forEach(function (dot, i) {
        dot.classList.toggle("done", i < activeCount);
      });
    }
    document.addEventListener("scroll", updateRail, { passive: true });
    updateRail();
  }
})();
