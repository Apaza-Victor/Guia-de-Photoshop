/* search.js — buscador global del header
   Índice de capítulos, glosario y comandos. Abre un overlay con el icono de
   lupa y filtra resultados mientras escribes (con navegación por teclado). */
(function () {
  "use strict";

  var overlay = document.getElementById("search-overlay");
  var input = document.getElementById("search-input");
  var results = document.getElementById("search-results");
  var empty = document.getElementById("search-empty");
  var openBtn = document.querySelector("[data-search-open]");
  var closeBtn = document.querySelector("[data-search-close]");
  if (!overlay) return;

  // Prefijo correcto para funcionar tanto desde la raíz como desde /pages/
  var prefix = window.location.pathname.indexOf("/pages/") !== -1 ? "../" : "";

  var INDEX = [
    // ---- Páginas ----
    { t: "Inicio de la guía", u: "index.html", i: "bi bi-house", c: "Página", k: "inicio guia portada hoja de ruta capítulos empezar" },
    { t: "Cap. 01 — Introducción y primeros pasos", u: "pages/01-introduccion.html", i: "bi bi-rocket-takeoff", c: "Capítulo 01", k: "que es photoshop instalar configurar primer documento rasterizado vectorial" },
    { t: "Cap. 02 — Interfaz y espacio de trabajo", u: "pages/02-interfaz.html", i: "bi bi-layout-sidebar-inset", c: "Capítulo 02", k: "interfaz paneles herramientas espacio de trabajo barra superior navegación" },
    { t: "Cap. 03 — Herramientas de selección", u: "pages/03-seleccion.html", i: "bi bi-bounding-box-circles", c: "Capítulo 03", k: "seleccion marco lazo varita sujeto seleccionar enmascarar" },
    { t: "Cap. 04 — Capas y modos de fusión", u: "pages/04-capas.html", i: "bi bi-stack", c: "Capítulo 04", k: "capas modos de fusion multiplicar pantalla superponer opacidad agrupar" },
    { t: "Cap. 05 — Máscaras de capa y vectoriales", u: "pages/05-mascaras.html", i: "bi bi-mask", c: "Capítulo 05", k: "mascara capa vectorial enmascarar no destructivo recorte" },
    { t: "Cap. 06 — Color, tono y ajustes", u: "pages/06-color.html", i: "bi bi-palette", c: "Capítulo 06", k: "color tono curvas niveles balance de color saturación corrección" },
    { t: "Cap. 07 — Retoque y restauración", u: "pages/07-retoque.html", i: "bi bi-magic", c: "Capítulo 07", k: "retoque tampon pincel corrector rellenar contenido restauracion" },
    { t: "Cap. 08 — Pinceles, pintura y texto", u: "pages/08-pinceles-texto.html", i: "bi bi-brush", c: "Capítulo 08", k: "pincel pintura texto tipografia tipo caracter" },
    { t: "Cap. 09 — Efectos, filtros y estilos de capa", u: "pages/09-filtros.html", i: "bi bi-sliders", c: "Capítulo 09", k: "filtros efectos estilos de capa desenfoque nitidez neuronales" },
    { t: "Cap. 10 — Composición, collage y manipulación", u: "pages/10-composicion.html", i: "bi bi-images", c: "Capítulo 10", k: "composicion collage manipulacion luz perspectiva escala" },
    { t: "Cap. 11 — Automatización y productividad", u: "pages/11-automatizacion.html", i: "bi bi-cpu", c: "Capítulo 11", k: "automatizacion acciones lotes scripts ia generativa productividad" },
    { t: "Cap. 12 — Exportación y flujo de trabajo profesional", u: "pages/12-exportacion.html", i: "bi bi-box-arrow-up-right", c: "Capítulo 12", k: "exportacion formatos perfiles de color organizacion portfolio" },
    { t: "Recursos y práctica 3D", u: "pages/recursos.html", i: "bi bi-badge-3d", c: "Recursos", k: "recursos enlaces descargas escena 3d capas babylon" },
    { t: "Glosario de Photoshop (A–Z)", u: "pages/glosario.html", i: "bi bi-book", c: "Referencia", k: "glosario conceptos terminos definiciones" },
    { t: "Comandos y atajos de teclado", u: "pages/comandos.html", i: "bi bi-keyboard", c: "Referencia", k: "comandos atajos teclado shortcuts windows mac" },
    { t: "Modos: iconos y conmutadores", u: "pages/iconos-modo.html", i: "bi bi-arrow-left-right", c: "Referencia", k: "iconos modos pantalla mascara rapida conmutadores interfaz fusion color" },

    // ---- Glosario (apunta a páginas/glosario.html#termino) ----
    { t: "Acoplar (flatten)", u: "pages/glosario.html#acoplar", i: "bi bi-book", c: "Glosario", k: "acoplar flatten capas fusionar aplanar imagen" },
    { t: "Capa de ajuste", u: "pages/glosario.html#ajuste", i: "bi bi-book", c: "Glosario", k: "capa de ajuste no destructivo correccion curvas niveles" },
    { t: "Canal alfa", u: "pages/glosario.html#alfa", i: "bi bi-book", c: "Glosario", k: "canal alfa transparencia mascara" },
    { t: "Balance de blancos", u: "pages/glosario.html#balance", i: "bi bi-book", c: "Glosario", k: "balance de blancos temperatura de color" },
    { t: "Canal", u: "pages/glosario.html#canal", i: "bi bi-book", c: "Glosario", k: "canal color rgb cmyk alfa informacion" },
    { t: "Capa", u: "pages/glosario.html#capa", i: "bi bi-book", c: "Glosario", k: "capa layer píxeles vectores apilar" },
    { t: "CMYK", u: "pages/glosario.html#cmyk", i: "bi bi-book", c: "Glosario", k: "cmyk cian magenta amarillo negro impresion" },
    { t: "Composición", u: "pages/glosario.html#composicion", i: "bi bi-book", c: "Glosario", k: "composicion compositing unir imagenes escena" },
    { t: "Curvas", u: "pages/glosario.html#curvas", i: "bi bi-book", c: "Glosario", k: "curvas ajuste tono contraste color" },
    { t: "Desenfoque gaussiano", u: "pages/glosario.html#gaussiano", i: "bi bi-book", c: "Glosario", k: "desenfoque gaussiano suavizado filtro blur" },
    { t: "Deshacer", u: "pages/glosario.html#deshacer", i: "bi bi-book", c: "Glosario", k: "deshacer rehacer historial undo" },
    { t: "DPI / PPI", u: "pages/glosario.html#dpi", i: "bi bi-book", c: "Glosario", k: "dpi ppi resolucion impresion puntos pulgadas" },
    { t: "Espacio de color", u: "pages/glosario.html#espacio", i: "bi bi-book", c: "Glosario", k: "espacio de color srgb adobe rgb prophoto perfil" },
    { t: "Estilo de capa", u: "pages/glosario.html#estilo", i: "bi bi-book", c: "Glosario", k: "estilo de capa efectos sombra bisel trazo" },
    { t: "Filtro", u: "pages/glosario.html#filtro", i: "bi bi-book", c: "Glosario", k: "filtro efecto computacional" },
    { t: "Filtros neuronales", u: "pages/glosario.html#neuronales", i: "bi bi-book", c: "Glosario", k: "filtros neuronales inteligencia artificial adobe sensei" },
    { t: "Modo de fusión", u: "pages/glosario.html#fusion", i: "bi bi-book", c: "Glosario", k: "modo de fusion multiplicar pantalla superponer trama color" },
    { t: "Histograma", u: "pages/glosario.html#histograma", i: "bi bi-book", c: "Glosario", k: "histograma tonos luces sombras distribución" },
    { t: "Imagen rasterizada", u: "pages/glosario.html#rasterizada", i: "bi bi-book", c: "Glosario", k: "rasterizada mapa de bits píxeles" },
    { t: "Imagen vectorial", u: "pages/glosario.html#vectorial", i: "bi bi-book", c: "Glosario", k: "vectorial vectores trazados escalable" },
    { t: "Interpolación", u: "pages/glosario.html#interpolacion", i: "bi bi-book", c: "Glosario", k: "interpolacion reescalar bicubica vecino proximo" },
    { t: "JPEG", u: "pages/glosario.html#jpeg", i: "bi bi-book", c: "Glosario", k: "jpeg jpg compresion con perdida" },
    { t: "Kerning", u: "pages/glosario.html#kerning", i: "bi bi-book", c: "Glosario", k: "kerning interletraje espacios caracteres" },
    { t: "Lienzo", u: "pages/glosario.html#lienzo", i: "bi bi-book", c: "Glosario", k: "lienzo canvas area de trabajo imagen" },
    { t: "Luminosidad", u: "pages/glosario.html#luminosidad", i: "bi bi-book", c: "Glosario", k: "luminosidad brillo valor claro oscuro" },
    { t: "Máscara de capa", u: "pages/glosario.html#mascara", i: "bi bi-book", c: "Glosario", k: "mascara de capa ocultar revelar no destructivo" },
    { t: "Máscara rápida", u: "pages/glosario.html#rapida", i: "bi bi-book", c: "Glosario", k: "mascara rapida quick mask seleccion modo edicion" },
    { t: "Niveles", u: "pages/glosario.html#niveles", i: "bi bi-book", c: "Glosario", k: "niveles luces sombras medios tonos ajuste" },
    { t: "Nitidez", u: "pages/glosario.html#nitidez", i: "bi bi-book", c: "Glosario", k: "nitidez sharpen enfoque bordes contraste" },
    { t: "Objeto inteligente", u: "pages/glosario.html#objeto", i: "bi bi-book", c: "Glosario", k: "objeto inteligente smart object no destructivo" },
    { t: "Opacidad", u: "pages/glosario.html#opacidad", i: "bi bi-book", c: "Glosario", k: "opacidad transparencia nivel de relleno" },
    { t: "Píxel", u: "pages/glosario.html#pixel", i: "bi bi-book", c: "Glosario", k: "pixel unidad minima imagen digital" },
    { t: "Pincel corrector", u: "pages/glosario.html#corrector", i: "bi bi-book", c: "Glosario", k: "pincel corrector retoque imperfecciones clonar" },
    { t: "PNG", u: "pages/glosario.html#png", i: "bi bi-book", c: "Glosario", k: "png sin perdida transparencia" },
    { t: "Perfil de color", u: "pages/glosario.html#perfil", i: "bi bi-book", c: "Glosario", k: "perfil de color icc fidelidad calibracion" },
    { t: "PSD", u: "pages/glosario.html#psd", i: "bi bi-book", c: "Glosario", k: "psd formato nativo photoshop capas" },
    { t: "Rasterizar", u: "pages/glosario.html#rasterizar", i: "bi bi-book", c: "Glosario", k: "rasterizar convertir vector píxeles" },
    { t: "Rellenar según contenido", u: "pages/glosario.html#contenido", i: "bi bi-book", c: "Glosario", k: "rellenar segun contenido content aware borrar objeto" },
    { t: "Resolución", u: "pages/glosario.html#resolucion", i: "bi bi-book", c: "Glosario", k: "resolucion ppp píxeles calidad" },
    { t: "RGB", u: "pages/glosario.html#rgb", i: "bi bi-book", c: "Glosario", k: "rgb rojo verde azul pantalla color" },
    { t: "Saturación", u: "pages/glosario.html#saturacion", i: "bi bi-book", c: "Glosario", k: "saturacion intensidad color desaturar" },
    { t: "Seleccionar sujeto", u: "pages/glosario.html#sujeto", i: "bi bi-book", c: "Glosario", k: "seleccionar sujeto inteligencia artificial aislar" },
    { t: "Separación de frecuencias", u: "pages/glosario.html#frecuencias", i: "bi bi-book", c: "Glosario", k: "separacion de frecuencias retoque textura color" },
    { t: "Sobreexponer / Subexponer", u: "pages/glosario.html#sobreexponer", i: "bi bi-book", c: "Glosario", k: "sobreexponer subexponer dodge burn luz" },
    { t: "SVG", u: "pages/glosario.html#svg", i: "bi bi-book", c: "Glosario", k: "svg vector web escalable" },
    { t: "Texto", u: "pages/glosario.html#texto", i: "bi bi-book", c: "Glosario", k: "texto capa tipografia tipo" },
    { t: "TIFF", u: "pages/glosario.html#tiff", i: "bi bi-book", c: "Glosario", k: "tiff alta calidad impresion sin perdida" },
    { t: "Tono", u: "pages/glosario.html#tono", i: "bi bi-book", c: "Glosario", k: "tono hue temperatura color" },
    { t: "Trazado", u: "pages/glosario.html#trazado", i: "bi bi-book", c: "Glosario", k: "trazado path pluma vector" },
    { t: "Umbral", u: "pages/glosario.html#umbral", i: "bi bi-book", c: "Glosario", k: "umbral blanco negro ajuste" },
    { t: "Varita mágica", u: "pages/glosario.html#varita", i: "bi bi-book", c: "Glosario", k: "varita magica seleccion color" },
    { t: "Zoom", u: "pages/glosario.html#zoom", i: "bi bi-book", c: "Glosario", k: "zoom acercar alejar vista" },

    // ---- Comandos (apunta a páginas/comandos.html#categoria) ----
    { t: "Comandos — Archivo", u: "pages/comandos.html#archivo", i: "bi bi-keyboard", c: "Comandos", k: "nuevo abrir guardar exportar comando atajo" },
    { t: "Comandos — Edición", u: "pages/comandos.html#edicion", i: "bi bi-keyboard", c: "Comandos", k: "deshacer copiar cortar pegar transformar relleno" },
    { t: "Comandos — Selección", u: "pages/comandos.html#seleccion", i: "bi bi-keyboard", c: "Comandos", k: "seleccionar todo deseleccionar invertir sujeto" },
    { t: "Comandos — Capas", u: "pages/comandos.html#capas", i: "bi bi-keyboard", c: "Comandos", k: "nueva capa fusionar agrupar duplicar acoplar" },
    { t: "Comandos — Ajustes de color", u: "pages/comandos.html#color", i: "bi bi-keyboard", c: "Comandos", k: "niveles curvas balance tono saturacion" },
    { t: "Comandos — Vista", u: "pages/comandos.html#vista", i: "bi bi-keyboard", c: "Comandos", k: "zoom ajustar pantalla modo pantalla guias reglas" },
    { t: "Comandos — Herramientas (teclas)", u: "pages/comandos.html#herramientas", i: "bi bi-keyboard", c: "Comandos", k: "teclas herramienta mover pincel pluma texto cuentagotas" },
    { t: "Comandos — Combos pro", u: "pages/comandos.html#pro", i: "bi bi-keyboard", c: "Comandos", k: "fusion copia visible opacidad pincel historial espacio tab pro" },
    { t: "Comandos — Tips rápidos", u: "pages/comandos.html#tips", i: "bi bi-keyboard", c: "Comandos", k: "trucos rapido acciones plantillas no destructivo historial guias" }
  ];

  var focused = -1;

  function normalize(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function setFocus(i) {
    focused = i;
    var items = results.querySelectorAll("a");
    items.forEach(function (a, j) {
      a.classList.toggle("is-focused", j === i);
    });
    if (items[i]) items[i].scrollIntoView({ block: "nearest" });
  }

  function render() {
    if (!input) return;
    var q = normalize(input.value).trim();
    results.innerHTML = "";
    if (!q) {
      if (empty) empty.textContent = "Escribe para buscar capítulos, conceptos, glosario y comandos…";
      return;
    }
    var words = q.split(/\s+/);
    var hits = INDEX.filter(function (entry) {
      var hay = normalize(entry.k + " " + entry.t);
      return words.every(function (w) { return hay.indexOf(w) !== -1; });
    }).slice(0, 18);
    if (!hits.length) {
      if (empty) empty.textContent = "Sin resultados para \u201C" + input.value + "\u201D";
      return;
    }
    if (empty) empty.textContent = "";
    focused = -1;
    hits.forEach(function (h, i) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = prefix + h.u;
      a.innerHTML = '<i class="' + h.i + '"></i><span></span><small>' + h.c + '</small>';
      a.querySelector("span").textContent = h.t;
      a.addEventListener("mouseenter", function () { setFocus(i); });
      li.appendChild(a);
      results.appendChild(li);
    });
  }

  function openSearch() {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(function () { if (input) input.focus(); }, 30);
  }
  function closeSearch() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    if (input) input.value = "";
    document.body.style.overflow = "";
    render();
  }

  if (openBtn) openBtn.addEventListener("click", openSearch);
  if (closeBtn) closeBtn.addEventListener("click", closeSearch);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeSearch();
  });
  if (input) input.addEventListener("input", render);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSearch();
    if (!overlay.classList.contains("is-open")) return;
    var items = results.querySelectorAll("a");
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!items.length) return;
      focused = e.key === "ArrowDown"
        ? (focused + 1) % items.length
        : (focused - 1 + items.length) % items.length;
      setFocus(focused);
    } else if (e.key === "Enter") {
      var target = items[focused] || items[0];
      if (target) target.click();
    }
  });
})();
