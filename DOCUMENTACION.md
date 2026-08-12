# PixelMaestro — Guía completa de Photoshop (de cero a experto)

Documentación del proyecto: qué es, cómo está construido paso a paso, cómo usarlo y cómo extenderlo.

---

## 1. Qué es este proyecto

Un sitio web estático, 100% HTML/CSS/JS (sin frameworks de backend, sin build step,
sin dependencias de Node), que funciona como una **guía interactiva para aprender
Photoshop de cero a experto**, organizada en 12 capítulos + 1 página de recursos,
cada uno en su propio archivo `.html` independiente.

Incluye:
- Diseño propio ("Panel de Capas") inspirado en la interfaz de Photoshop.
- Navegación lateral tipo panel de capas, responsiva desde **360px**.
- Fondo 3D ambiental en el hero con **Three.js**.
- Visualización 3D interactiva (orbitable) de una pila de capas con **Babylon.js**.
- Micro-interacciones y animaciones de scroll con **anime.js**.
- Bootstrap 5 + Bootstrap Icons como base utilitaria de iconografía y grid.

---

## 2. Proceso de construcción, paso a paso

Así se construyó el sitio, en el orden real en que se hizo:

### Paso 1 — Definir la dirección de diseño
Antes de escribir código se definió un sistema de diseño (tokens) para que el sitio
tuviera identidad propia y no se viera "genérico":

- **Paleta:** negro tinta `#0E0F12` de fondo, panel `#17191E`, acento cian `#00E5C7`
  (inspirado en canales de pantalla) y acento naranja `#FF6B35` (inspirado en
  herramientas de luz/sobreexposición de Photoshop).
- **Tipografía:** `Space Grotesk` (títulos, carácter técnico), `Inter` (cuerpo,
  legibilidad) y `JetBrains Mono` (atajos de teclado, etiquetas, metadatos).
- **Metáfora de navegación:** el menú lateral se diseñó para verse y comportarse
  como el **panel de Capas** de Photoshop — cada capítulo es una "capa" en la lista,
  con su icono de ojo (visibilidad) y numeración.

### Paso 2 — Construir el sistema CSS (`css/style.css`)
Se definieron variables CSS (`:root`) para colores, tipografías y radios, y luego
se construyeron los componentes reutilizables: barra superior móvil, panel lateral
(`layers-nav`), tarjetas de capítulo, tablas de atajos, cajas de aviso (`callout`),
paginador de capítulo anterior/siguiente, etc. El sitio se diseñó **mobile-first**,
partiendo de 360px de ancho y usando `clamp()` para tipografía fluida y
`grid-template-columns: repeat(auto-fit, minmax(...))` para que las tarjetas se
reacomoden solas en cualquier tamaño de pantalla.

### Paso 3 — Comportamiento compartido (`js/main.js`)
Se programó la lógica común a todas las páginas: abrir/cerrar el panel de
navegación en móvil, marcar el capítulo activo, y revelar elementos al hacer
scroll con `IntersectionObserver`.

### Paso 4 — Animaciones con anime.js (`js/animations.js`)
Se añadió la capa de "vida" de la interfaz: el título del hero se anima letra por
letra al cargar, las tarjetas aparecen escalonadas al hacer scroll, y los botones
principales reaccionan al pasar el cursor. Todo respeta
`prefers-reduced-motion` para personas que prefieren menos animación.

### Paso 5 — Fondo 3D con Three.js (`js/three-bg.js`)
Se creó una escena 3D ligera para el hero de la portada: una pila de planos
translúcidos (metáfora directa de las capas de Photoshop) con partículas e
iluminación de color cian/naranja, que reacciona sutilmente al movimiento del
cursor y se pausa automáticamente si la pestaña no está visible.

### Paso 6 — Escena interactiva con Babylon.js (`js/babylon-scene.js`)
En la página de Recursos se construyó una segunda escena 3D, esta vez
**interactiva** (cámara orbital que el usuario controla arrastrando o con la
rueda del ratón): una pila de bloques que representa el orden típico de capas
de un retoque fotográfico (fondo, sombras, base, retoque, color, texto, efectos).

### Paso 7 — Contenido de los 12 capítulos
Se redactó el contenido educativo completo de cada capítulo: objetivos de
aprendizaje, secciones teóricas, tabla de atajos de teclado (Windows/Mac),
consejos (`tip`), advertencias (`warn`) y un ejercicio práctico guiado.

### Paso 8 — Generación de las páginas
Para mantener **consistencia estructural exacta** entre las 14 páginas (mismo
`<head>`, misma navegación, mismo pie de página, mismos scripts) sin copiar y
pegar HTML a mano, se escribió un generador en Python (`build.py`) que arma
cada archivo `.html` a partir de los datos de los capítulos y de un conjunto de
funciones de plantilla (`head()`, `nav_html()`, `topbar_html()`, `footer_html()`,
`scripts_html()`, etc.). El resultado son **archivos `.html` finales, planos y
autocontenidos** — no dependen de `build.py` para funcionar; ese script solo se
usó como herramienta de construcción, igual que un generador de sitio estático.

### Paso 9 — Verificación
Se comprobó que las 14 páginas tienen HTML válido, que todos los enlaces entre
capítulos existen y apuntan al lugar correcto, y que la navegación anterior/
siguiente encadena los 12 capítulos en orden más la página de recursos al final.

---

## 3. Estructura de archivos

```
photoshop-guide/
├── index.html                     Portada (hero 3D + hoja de ruta + tarjetas de capítulo)
├── css/
│   └── style.css                  Sistema de diseño completo (tokens + componentes + responsive)
├── js/
│   ├── main.js                    Navegación (drawer móvil), estado activo, scroll-reveal
│   ├── animations.js              Animaciones de interfaz con anime.js
│   ├── three-bg.js                Fondo 3D del hero (Three.js) — solo en index.html
│   └── babylon-scene.js           Escena 3D interactiva (Babylon.js) — solo en recursos.html
└── pages/
    ├── 01-introduccion.html       Cap. 1 — Introducción y primeros pasos
    ├── 02-interfaz.html           Cap. 2 — Interfaz y espacio de trabajo
    ├── 03-seleccion.html          Cap. 3 — Herramientas de selección
    ├── 04-capas.html              Cap. 4 — Capas y modos de fusión
    ├── 05-mascaras.html           Cap. 5 — Máscaras de capa y vectoriales
    ├── 06-color.html              Cap. 6 — Color, tono y ajustes
    ├── 07-retoque.html            Cap. 7 — Retoque y restauración
    ├── 08-pinceles-texto.html     Cap. 8 — Pinceles, pintura y texto
    ├── 09-filtros.html            Cap. 9 — Efectos, filtros y estilos de capa
    ├── 10-composicion.html        Cap. 10 — Composición, collage y manipulación
    ├── 11-automatizacion.html     Cap. 11 — Automatización y productividad
    ├── 12-exportacion.html        Cap. 12 — Exportación y flujo de trabajo profesional
    └── recursos.html              Extra — Recursos + escena 3D interactiva de capas
```

`build.py` (el generador) no se incluye en el paquete final porque no es
necesario para ver el sitio; se documenta aquí por transparencia sobre cómo se
construyó.

---

## 4. Cómo usarlo

1. Descomprime el `.zip`.
2. Abre `index.html` haciendo doble clic (funciona directo desde el sistema de
   archivos, con `file://`, sin necesidad de servidor).
3. Navega con el panel lateral ("Panel de capítulos"): en pantallas grandes es
   fijo a la izquierda; en móvil se abre con el botón de menú (☰) de la barra
   superior.
4. Cada capítulo tiene, al final, botones de "capítulo anterior" y "siguiente"
   para leer la guía en orden.

**Nota:** el sitio carga Bootstrap, Bootstrap Icons, las fuentes de Google,
Three.js, Babylon.js y anime.js desde CDN — necesita conexión a internet la
primera vez que se abre cada página (los navegadores cachean estos archivos
automáticamente en visitas posteriores).

### Publicarlo en un hosting real
Al ser HTML/CSS/JS puro, puedes subir la carpeta `photoshop-guide/` completa a
cualquier hosting estático (GitHub Pages, Netlify, Vercel, un hosting
compartido tradicional, etc.) sin ningún paso de compilación adicional.

---

## 5. Tecnologías usadas

| Tecnología | Uso en el proyecto |
|---|---|
| HTML5 | Estructura semántica de las 14 páginas |
| CSS3 (variables, Grid, Flexbox, `clamp()`) | Sistema de diseño y responsividad desde 360px |
| Bootstrap 5 (CDN) | Utilidades base y sistema de contenedor/columnas |
| Bootstrap Icons (CDN) | Iconografía en navegación, tarjetas y avisos |
| JavaScript (vanilla, sin framework) | Interactividad de navegación y utilidades |
| Three.js | Fondo 3D ambiental del hero en `index.html` |
| Babylon.js | Escena 3D interactiva y orbitable en `recursos.html` |
| anime.js | Animaciones de entrada y micro-interacciones |
| Python 3 (`build.py`, herramienta interna) | Generación consistente de las 14 páginas HTML |

---

## 6. Cómo extender la guía

- **Añadir un capítulo nuevo:** duplica un bloque de diccionario en la lista
  `CHAPTERS` de `build.py` (si vuelves a generar con Python) o, si prefieres
  editar a mano, copia la estructura de cualquier `pages/XX-*.html` como base
  y actualiza los enlaces de "anterior/siguiente" de los capítulos vecinos.
- **Cambiar la paleta de color:** edita las variables en la sección `:root` de
  `css/style.css` (`--ink`, `--panel`, `--cyan`, `--orange`, etc.); todo el
  sitio se actualiza automáticamente porque los componentes usan esas variables.
- **Ajustar la escena 3D del hero:** el número de "capas" flotantes y de
  partículas se controla en `js/three-bg.js` (`LAYER_COUNT` y `particleCount`).

---

## 7. Accesibilidad y buenas prácticas incluidas

- Enlace "Saltar al contenido" para navegación por teclado.
- Estados de foco visibles (`:focus-visible`) en todos los elementos interactivos.
- Todas las animaciones respetan `prefers-reduced-motion: reduce`.
- Contraste de texto pensado para fondo oscuro (texto principal `#EDEEF2` sobre `#0E0F12`).
- Las escenas 3D se pausan automáticamente cuando la pestaña no está visible,
  para no consumir batería/CPU innecesariamente.
