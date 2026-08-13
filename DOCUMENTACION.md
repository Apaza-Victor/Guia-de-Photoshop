# Guía de Photoshop — Documentación del proyecto

Documentación del proyecto: qué es, cómo está construido, cómo usarlo y cómo extenderlo.

---

## 1. Qué es este proyecto

Un sitio web estático, 100% HTML/CSS/JS (sin frameworks de backend, sin build step,
sin dependencias de Node), que funciona como una **guía interactiva para aprender
Photoshop de cero a experto**, organizada en 12 capítulos + 4 páginas de referencia,
cada uno en su propio archivo `.html` independiente y autocontenido.

Incluye:
- Diseño propio con identidad diferenciada en **modo claro y oscuro** (botón en el
  header, preferencia guardada en `localStorage`).
- **Header fijo** con el logo oficial de Photoshop (SVG), navegación centrada con
  dropdown "Módulos", acciones a la derecha y favicon.
- **Buscador global** en overlay que indexa capítulos, glosario y categorías de
  comandos, con navegación por teclado (↑ ↓ Enter Esc).
- **Fondo 3D ambiental** en el hero de la portada con **Three.js**.
- **Visualización 3D interactiva** (orbitable, con zoom) de una pila de capas con
  **Babylon.js** en la página de recursos.
- Animaciones de entrada y micro-interacciones con **anime.js**.
- Responsive desde **360px**, mobile-first.

---

## 2. Estructura de archivos

```
Guia de Photoshop/
├── index.html                     Portada: hero 3D (Three.js), 12 tarjetas de capítulo, hoja de ruta y sección de características
├── 404.html                       Página de error 404 con el mismo header y buscador
├── robots.txt                     Permisos para buscadores y referencia al sitemap
├── sitemap.xml                    Sitemap con las 18 URLs del sitio
├── pages/                         Capítulos y páginas de referencia
│   ├── 01-introduccion.html       Cap. 1 — Introducción y primeros pasos
│   ├── 02-interfaz.html           Cap. 2 — Interfaz y espacio de trabajo
│   ├── 03-seleccion.html          Cap. 3 — Herramientas de selección
│   ├── 04-capas.html              Cap. 4 — Capas y modos de fusión
│   ├── 05-mascaras.html           Cap. 5 — Máscaras de capa y vectoriales
│   ├── 06-color.html              Cap. 6 — Color, tono y ajustes
│   ├── 07-retoque.html            Cap. 7 — Retoque y restauración
│   ├── 08-pinceles-texto.html     Cap. 8 — Pinceles, pintura y texto
│   ├── 09-filtros.html            Cap. 9 — Efectos, filtros y estilos de capa
│   ├── 10-composicion.html        Cap. 10 — Composición, collage y manipulación
│   ├── 11-automatizacion.html     Cap. 11 — Automatización y productividad
│   ├── 12-exportacion.html        Cap. 12 — Exportación y flujo de trabajo profesional
│   ├── comandos.html              Referencia — 100+ atajos de teclado, combos pro y tips
│   ├── glosario.html              Referencia — Glosario A–Z (76 términos)
│   ├── iconos-modo.html           Referencia — Iconos, modos de color y conmutadores de la interfaz
│   ├── herramientas.html          Referencia — Todas las herramientas por grupo y tecla
│   └── recursos.html              Referencia — Directorio con 175+ recursos + escena 3D interactiva
├── assets/
│   ├── css/
│   │   └── style.css              Sistema de diseño completo (tokens + componentes + tema claro/oscuro)
│   ├── js/
│   │   ├── main.js                Tema, dropdown, resaltado de módulo activo, scroll-reveal
│   │   ├── search.js              Índice y overlay de búsqueda global
│   │   ├── animations.js          Animaciones de interfaz con anime.js
│   │   ├── three-bg.js            Fondo 3D del hero (Three.js) — solo en index.html
│   │   └── babylon-scene.js       Escena 3D interactiva (Babylon.js) — solo en recursos.html
│   └── img/
│       ├── Adobe_Photoshop_CC_icon.svg   Logo oficial (header y favicon)
│       └── .gitkeep
├── README.md
└── DOCUMENTACION.md
```

---

## 3. Sistema de diseño

### Tokens de diseño (CSS variables en `:root`)
- **Paleta:** fondo tinta `#0E0F12`, panel `#17191E`, acento cian `#00E5C7`
  (inspirado en canales de pantalla) y acento naranja `#FF6B35` (herramientas de
  luz/sobreexposición). Acento violeta `#9B7BFF` con uso moderado.
- **Tipografías (Google Fonts):** `Space Grotesk` (títulos), `Inter` (cuerpo),
  `JetBrains Mono` (atajos, etiquetas, metadatos).
- **Tema claro:** `:root[data-theme="light"]` redefine las mismas variables para
  un esquema claro con el mismo acento cian, ajustado para contraste.
- Radios (`--radius-sm/md/lg`), sombras y medidas de header centralizadas.

### Componentes reutilizables
`chapter-card`, `roadmap-step`, `feature`, `shortcuts` (tabla de atajos),
`callout` (`--tip`, `--warn`, `--exercise`), `chapter-pager` (anterior/siguiente),
`chapter-header` con objetivos, `search-overlay`, `topbar`/`topbar-dd`,
`site-footer`, `pill`, `eyebrow`, clases tipográficas `h-display/h-xl/h-lg`,
`mono`, `kbd`, `skip-link`.

---

## 4. Comportamiento compartido (`assets/js`)

| Script | Página | Qué hace |
|---|---|---|
| `main.js` | Todas | Tema claro/oscuro persistente, dropdown "Módulos", resaltar capítulo/módulo activo, revelar con `IntersectionObserver`, año del footer |
| `search.js` | Todas | Overlay de búsqueda con índice de 17 páginas + 76 términos de glosario + 9 categorías de comandos + secciones de Modos, Recursos y Herramientas; autocompletado con acentos normalizados |
| `animations.js` | Todas | Título del hero letra a letra, revelado escalonado, hover de botones, barra de progreso (`[data-progress-rail]`) |
| `three-bg.js` | `index.html` | Escena Three.js: pila de capas translúcidas + partículas, reacciona al mouse, pausa al ocultar pestaña |
| `babylon-scene.js` | `recursos.html` | Escena Babylon.js orbitable de la pila de capas de un retoque (Fondo → Sombras → Base → Retoque → Color → Texto → Efectos) |

**CDNs cargados:**
- Todas las páginas: `anime.js` (3.2.1), Bootstrap 5.3.3, Bootstrap Icons 1.11.3,
  fuentes de Google.
- `index.html` añade `three@0.128.0`.
- `recursos.html` añade `babylon.js`.

El sitio necesita conexión a internet la primera vez que se abre cada página
(los navegadores cachean los CDN en visitas posteriores).

---

## 5. Cómo usarlo

1. Abre `index.html` haciendo doble clic (funciona directo con `file://`, sin
   servidor) o súbelo a cualquier hosting estático (GitHub Pages, Netlify, Vercel).
2. Publicado actualmente en **GitHub Pages**:
   https://apaza-victor.github.io/Guia-de-Photoshop/
   (se actualiza automáticamente al hacer push a `main`).
3. Navega con el header fijo: dropdown "Módulos" para agrupar capítulos por rango
   (01–02, 03–05, 06–07, 08–09, 10–11, 12), o enlaces directos a Glosario,
   Comandos, Modos y Recursos.
4. Usa la lupa del header para buscar capítulos, términos del glosario y secciones
   de comandos (teclas: ↑ ↓ navegar, Enter abrir, Esc cerrar).
5. Cada capítulo termina con botones de "capítulo anterior" y "siguiente" para leer
   la guía en orden.
6. Alterna el tema claro/oscuro con el botón del header; la elección se recuerda.

---

## 6. Tecnologías usadas

| Tecnología | Uso en el proyecto |
|---|---|
| HTML5 | Estructura semántica de las 18 páginas |
| CSS3 (variables, Grid, Flexbox, `clamp()`) | Sistema de diseño y responsividad desde 360px |
| Bootstrap 5 (CDN) | Utilidades base y contenedores |
| Bootstrap Icons (CDN) | Iconografía en navegación, tarjetas y avisos |
| JavaScript (vanilla, sin framework) | Interactividad, tema y búsqueda |
| Three.js | Fondo 3D ambiental del hero en `index.html` |
| Babylon.js | Escena 3D interactiva y orbitable en `recursos.html` |
| anime.js | Animaciones de entrada y micro-interacciones |
| Google Fonts | `Space Grotesk`, `Inter`, `JetBrains Mono` |

---

## 7. Cómo extender la guía

- **Añadir un capítulo nuevo:** copia la estructura de cualquier `pages/XX-*.html`
  como base (mismo `<head>`, misma navegación, mismos scripts), crea el archivo con
  la numeración siguiente y actualiza los enlaces "anterior/siguiente" de los
  capítulos vecinos y del índice de `index.html`.
- **Añadir una página de referencia:** duplica una de las páginas de referencia,
  registra su título y descripción en el índice `INDEX` de `assets/js/search.js`
  y añade el enlace al header de todas las páginas.
- **Añadir un término al glosario:** añade el `<dt id="...">` en `glosario.html`
  y una entrada correspondiente en `assets/js/search.js` (categoría "Glosario").
- **Cambiar la paleta:** edita las variables de `:root` y `:root[data-theme="light"]`
  en `assets/css/style.css`; todo el sitio se actualiza automáticamente.
- **Ajustar la escena 3D del hero:** en `assets/js/three-bg.js` se controlan
  `LAYER_COUNT` y `particleCount`; la escena de recursos se ajusta desde
  `assets/js/babylon-scene.js` (lista `labels` y tamaños de caja).

---

## 8. Accesibilidad y buenas prácticas incluidas

- Enlace "Saltar al contenido" para navegación por teclado.
- Estados de foco visibles (`:focus-visible`) en los elementos interactivos.
- Todas las animaciones respetan `prefers-reduced-motion: reduce`.
- Contraste de texto pensado para fondo oscuro y para modo claro.
- Las escenas 3D se pausan automáticamente cuando la pestaña no está visible,
  para no consumir batería/CPU innecesariamente.
- Botones con `aria-label`/`aria-expanded`/`aria-pressed` según corresponda y
  overlay de búsqueda con `aria-hidden`.

---

## 9. Contenido educativo

- **12 capítulos** de teoría + tabla de atajos Windows/Mac + consejos (`tip`),
  advertencias (`warn`) y ejercicio práctico guiado (`exercise`).
- **Glosario A–Z** con 76 términos fundamentales.
- **Comandos:** 9 categorías (Archivo, Edición, Selección, Capas, Ajustes de color,
  Vista y navegación, Herramientas por tecla, Combos pro, Tips) con más de 100 atajos.
- **Iconos y modos:** 7 secciones (modos de pantalla, máscara rápida, colores
  frontal/fondo, panel de capas, modos de color, modos de fusión, conmutadores).
- **Recursos:** 15 secciones con más de 175 enlaces (fotos, vectores, iconos, 3D,
  texturas, tipografías, mockups, color, vídeo/audio, PNG, quitar fondos,
  programas open source, IA para diseñar) y un checklist final.

## Licencia y derechos de autor

**© 2026 Víctor Hugo Apaza. Todos los derechos reservados.**
