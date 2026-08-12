# Guía de Photoshop

Guía web estática, responsive y en español para aprender Photoshop desde cero hasta nivel experto. Incluye 12 capítulos, un glosario A–Z, referencia de atajos de teclado, explicación de iconos y modos, y un directorio con más de 175 recursos gratuitos y open source.

> Proyecto independiente. No está afiliado ni respaldado por Adobe.

## Características

- **12 capítulos** organizados en módulos: fundamentos, selección y capas, color y retoque, creación y efectos, composición avanzada y nivel experto.
- **Tema claro/oscuro** con botón en el header (se recuerda tu elección).
- **Buscador global** en overlay: busca capítulos, términos del glosario y secciones de comandos.
- **Header fijo** con navegación centrada: logo a la izquierda, acciones a la derecha.
- **Navegación entre capítulos** con pager compacto (Anterior / Siguiente).
- **Páginas de referencia**: `comandos.html` (100+ atajos), `glosario.html` (A–Z), `iconos-modo.html` (modos y conmutadores) y `recursos.html` (directorio de recursos).
- Animaciones de entrada con [anime.js](https://animejs.com/).

## Estructura

```
Guia de Photoshop/
├── index.html              # Inicio y mapa de la guía
├── pages/                  # Capítulos y páginas de referencia
│   ├── 01-introduccion.html
│   ├── 02-interfaz.html
│   ├── 03-seleccion.html
│   ├── 04-capas.html
│   ├── 05-mascaras.html
│   ├── 06-color.html
│   ├── 07-retoque.html
│   ├── 08-pinceles-texto.html
│   ├── 09-filtros.html
│   ├── 10-composicion.html
│   ├── 11-automatizacion.html
│   ├── 12-exportacion.html
│   ├── comandos.html       # Atajos de teclado y tips
│   ├── glosario.html       # Glosario A–Z
│   ├── iconos-modo.html    # Iconos y modos de la interfaz
│   └── recursos.html       # Recursos gratuitos y open source
├── css/
│   └── style.css           # Todo el estilo (tema claro/oscuro)
├── js/
│   ├── main.js             # Navegación, dropdown y tema
│   ├── search.js           # Índice y overlay de búsqueda
│   └── animations.js       # Animaciones de entrada
└── README.md
```

## Uso

No necesita compilación ni servidor: abre `index.html` en cualquier navegador moderno.

```powershell
Start-Process index.html
```

## Tecnología

- HTML5 semántico + CSS3 (variables, grid y flexbox).
- [Bootstrap Icons](https://icons.getbootstrap.com/) (CDN) para la iconografía.
- [anime.js](https://animejs.com/) (CDN) para animaciones.
- JavaScript vanilla (sin dependencias de build).

## Contenido de recursos

El directorio `recursos.html` agrupa enlaces externos con licencia marcada: **Open source**, **CC0**, **Gratis**, **Con atribución** y **Poco conocido**. Incluye fotos, vectores, iconos, 3D, texturas, tipografías, mockups, color, vídeo/audio, imágenes PNG, herramientas para quitar fondos, programas y IA gratuita para diseñar.

## Licencia y derechos de autor

**© 2026 Víctor Hugo Apaza. Todos los derechos reservados.**

Esta guía es una obra original de Víctor Hugo Apaza. Puedes usar el contenido con fines educativos y personales, citando la autoría; queda prohibida su redistribución o uso comercial sin autorización previa.

Los enlaces, iconos y marcas citadas (incluida la marca Adobe) pertenecen a sus respectivos autores. Este proyecto no redistribuye contenido de Adobe.
