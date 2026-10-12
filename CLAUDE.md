# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este repositorio

Sitio web de la Comunidad Cristiana Laguna Larga (`www.ccll.com.ar`). Es un sitio **estático puro**: no hay `package.json`, build, linter ni tests. Todas las dependencias (Bootstrap, iconos, fuentes, RefTagger) se cargan por CDN, así que no hay paso de instalación.

Para desarrollar, servir la carpeta (los `file://` rompen las rutas relativas entre `/enlaces/` y la raíz):

```bash
python3 -m http.server 8000   # http://localhost:8000/ redirige a /enlaces/
```

El contenido del sitio está en español (`lang="es"`), incluidos los comentarios del CSS y los mensajes de commit. Mantener ese idioma.

## Estructura

La **entrada del sitio es el portal de enlaces** (`/enlaces/`), no una web clásica. La raíz solo redirige hacia él.

| Ruta | Qué es |
| --- | --- |
| [index.html](index.html) | Redirección (`meta refresh` + `location.replace`) a `/enlaces/`. Sin contenido propio. |
| [enlaces/index.html](enlaces/index.html) | Portal de enlaces, estilo link-in-bio. Es la página principal. |
| [declaracion-de-fe.html](declaracion-de-fe.html) | Declaración de Fe de la congregación. |
| [actividades.html](actividades.html) | Actividades, horarios y ubicación. |
| [web/index.html](web/index.html) | Web anterior (2026), **archivada y sin enlazar** desde ningún lado. |
| [images/](images/) | Imágenes compartidas por todas las páginas (logo, favicon, foto de portada). |
| [manifest.webmanifest](manifest.webmanifest), [sw.js](sw.js), [pwa.js](pwa.js) | App instalable (PWA). Ver «App instalable» más abajo. |

Hay **dos sistemas de diseño** y no deben mezclarse:

1. **Portal de enlaces** — [enlaces/styles.css](enlaces/styles.css). Tema oscuro (`#081c15`) con botones píldora y glow verde al hover. Bootstrap 5.3.0 + Font Awesome 6.5.0, sin fuente externa.
2. **Páginas de contenido** (Declaración de Fe, Actividades) — [styles/contenido.css](styles/contenido.css) + [scripts.js](scripts.js). Tema claro, Playfair Display para títulos y Roboto para el cuerpo, `header`/`footer` oscuros, contenido dentro de `.contenedor-material`.

La web archivada conserva su propio [web/styles.css](web/styles.css) (tema claro con Bootstrap 5.3.3 + Bootstrap Icons); está congelada, no hace falta mantenerla al día.

Todas las paletas derivan del mismo rango de verdes ([Coolors](https://coolors.co/palette/d8f3dc-b7e4c7-95d5b2-74c69d-52b788-40916c-2d6a4f-1b4332-081c15)).

## Páginas de contenido

[styles/contenido.css](styles/contenido.css) es una **copia** de `style.css` del repositorio hermano `discipulado-ccll` (`https://discipulado.ccll.com.ar/`), para que las páginas de contenido compartan su estética. Lo propio de este sitio está al final del archivo, bajo el comentario `AÑADIDOS DE ESTE SITIO`: `.metadato`, `.indice`, `.negamos`, `.remision`, `.volver`, `.mapa`. **No editar la parte copiada**: si hay que cambiarla, conviene cambiarla en discipulado y volver a copiarla, para que las dos partes sigan siendo diffeables.

Al crear una página de contenido nueva, copiar la estructura de [declaracion-de-fe.html](declaracion-de-fe.html): `header` con el logo, `div.contenedor-material` con el contenido entre los comentarios `<!-- Inicio contenido -->` / `<!-- Fin contenido -->`, `footer` y `scripts.js` al final.

[scripts.js](scripts.js) carga **RefTagger**, que convierte automáticamente las referencias bíblicas del texto (`Ro 8:28`, `1 Co 15:3-4`) en enlaces con vista previa. Por eso las referencias van como texto plano, sin marcar. Alcanza a `p`, `blockquote`, `cite`, `li` y `td`; para que ignore un bloque (direcciones, fechas, remisiones a la Confesión de 1689) hay que ponerle la clase `no-reftagger`.

La Declaración de Fe se mantiene también en Markdown (`Declaración de Fe — Comunidad Cristiana Laguna Larga.md`, en la raíz), que es el texto fuente. Si se edita la doctrina, actualizar **los dos** archivos.

## App instalable (PWA)

El sitio se puede instalar como app desde el portal. Arranca en `/enlaces/` y su alcance es todo el sitio (`scope: "/"`), así que la Declaración de Fe y Actividades se abren dentro de la app. Los subdominios y las redes sociales se abren fuera. No hay notificaciones push: para avisos se usan el canal y el grupo de WhatsApp.

- [manifest.webmanifest](manifest.webmanifest): nombre, colores e iconos ([images/iconos/](images/iconos/), recortes cuadrados de `enlaces/logo1.png`; el dibujo queda dentro de la zona segura, por eso los mismos iconos sirven como `maskable`).
- [sw.js](sw.js): service worker en la raíz (tiene que estar ahí para abarcar todo el sitio). Las páginas se piden primero a la red y, sin conexión, salen de la copia guardada; el resto de los recursos se sirven de la copia y se actualizan en segundo plano. **Al agregar una página o un recurso propio que deba funcionar sin conexión, sumarlo a `PRECACHE` y subir la versión de `CACHE`.**
- [pwa.js](pwa.js): registra el service worker y, en el portal, muestra el botón «Instalar la app» (Android/escritorio) o la ayuda para iPhone, donde la instalación es manual. Toda página nueva debe llevar los metadatos de la PWA en el `head` (`manifest`, `theme-color`, `apple-touch-icon`) y cargar `pwa.js`, como hacen las páginas actuales.

## Convenciones al editar

- **Open Graph / Twitter Cards**: todas las páginas llevan bloques `og:*` y `twitter:*` con URLs **absolutas** (`https://www.ccll.com.ar/...`). Las rutas relativas no sirven para los previews de redes sociales: al mover o renombrar imágenes o páginas, actualizar esos metadatos. `enlaces/` usa su propia imagen (`logo1-og.png`); el resto usa `images/logo3.png` (972 × 560).
- **Enlaces deshabilitados**: en el portal se comentan con `<!-- -->` en lugar de borrarse (por ejemplo Facebook y X). Respetar ese patrón.
- **Subdominios externos**: `discipulado.ccll.com.ar` y `sermones.ccll.com.ar` viven en otros repositorios; desde aquí son solo enlaces, y van con `target="_blank"`. Los enlaces internos no llevan `target`.
- Los datos de contacto y la ubicación (dirección, WhatsApp, correo, mapa embebido) viven ahora en [actividades.html](actividades.html).

## Ramas

`main` está desactualizada (quedó en la web de 2024). Cada rediseño anual vive en su propia rama `web-YYYY` (`web-2024`, `web-2025`, `web-2025-nueva`, `web-2026`); el trabajo actual es **`web-2026`**. Antes de crear un PR contra `main`, preguntar al usuario: puede que corresponda commitear en la rama del año en curso.
