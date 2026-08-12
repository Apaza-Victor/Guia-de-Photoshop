/* main.js — comportamiento compartido en todas las páginas */
(function () {
  "use strict";

  // ---- Dropdown "Módulos" del header ----
  var ddBtn = document.querySelector("[data-dd-toggle]");
  var dd = document.querySelector(".topbar-dd");
  var ddMenu = dd ? dd.querySelector(".topbar-dd__menu") : null;
  function closeDD() {
    if (!dd) return;
    dd.classList.remove("is-open");
    if (ddBtn) ddBtn.setAttribute("aria-expanded", "false");
  }
  function positionDD() {
    if (!ddBtn || !ddMenu) return;
    var r = ddBtn.getBoundingClientRect();
    var mw = ddMenu.offsetWidth || 280;
    var left = Math.max(10, Math.min(r.left, window.innerWidth - mw - 10));
    ddMenu.style.top = (r.bottom + 8) + "px";
    ddMenu.style.left = left + "px";
  }
  if (ddBtn && dd && ddMenu) {
    ddBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = dd.classList.toggle("is-open");
      ddBtn.setAttribute("aria-expanded", String(open));
      if (open) positionDD();
    });
    document.addEventListener("click", function (e) {
      if (!dd.contains(e.target)) closeDD();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDD();
    });
    window.addEventListener("resize", closeDD);
  }

  // ---- Tema claro / oscuro ----
  var themeBtn = document.querySelector("[data-theme-toggle]");
  var root = document.documentElement;
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("pm-theme", t); } catch (e) {}
    if (themeBtn) {
      themeBtn.setAttribute("aria-label", t === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
      themeBtn.setAttribute("aria-pressed", t === "light" ? "true" : "false");
    }
  }
  var savedTheme = null;
  try { savedTheme = localStorage.getItem("pm-theme"); } catch (e) {}
  setTheme(savedTheme === "light" ? "light" : "dark");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  // ---- Resalta el módulo/capítulo activo en la navegación del header ----
  var here = window.location.pathname.split("/").pop() || "index.html";
  var hereNum = (here.match(/\d{2}/) || [])[0];
  document.querySelectorAll(".topbar-nav a, .topbar-dd__menu a").forEach(function (link) {
    if ((link.getAttribute("href") || "").split("/").pop() === here) {
      link.classList.add("is-active");
      return;
    }
    var caps = link.getAttribute("data-caps");
    if (caps && hereNum && caps.split(",").indexOf(hereNum) !== -1) {
      link.classList.add("is-active");
    }
  });
  if (ddBtn && dd && dd.querySelector(".is-active")) {
    ddBtn.classList.add("is-active");
  }

  // ---- Revela elementos con [data-reveal] al entrar en el viewport ----
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.dispatchEvent(new CustomEvent("reveal"));
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    // Sin soporte: muestra todo de inmediato
    revealEls.forEach(function (el) {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
  }

  // ---- Año en footer ----
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
