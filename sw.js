/* Service worker de la app (PWA) de CCLL.
   - Páginas: primero la red, y si no hay conexión, la copia guardada.
   - Resto de recursos (CSS, JS, imágenes, fuentes de los CDN): se sirve la
     copia guardada y se actualiza en segundo plano.
   Al cambiar la lista PRECACHE, subir la versión de CACHE. */
const CACHE = "ccll-v2";

const PRECACHE = [
    "/enlaces/",
    "/enlaces/styles.css",
    "/enlaces/logo1.png",
    "/enlaces/compartir.js",
    "/declaracion-de-fe.html",
    "/actividades.html",
    "/styles/contenido.css",
    "/scripts.js",
    "/pwa.js",
    "/images/logo.png",
    "/images/favicon.ico",
    "/images/iconos/icono-192.png"
];

// Orígenes externos cuyos recursos se guardan (Bootstrap, Font Awesome, fuentes).
const CDN = [
    "https://cdn.jsdelivr.net",
    "https://cdnjs.cloudflare.com",
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE)
            .then((cache) => cache.addAll(PRECACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((claves) => Promise.all(
                claves.filter((clave) => clave !== CACHE).map((clave) => caches.delete(clave))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") return;

    const url = new URL(request.url);
    const propio = url.origin === self.location.origin;
    if (!propio && !CDN.includes(url.origin)) return;

    if (request.mode === "navigate") {
        event.respondWith(primeroLaRed(request));
    } else {
        event.respondWith(primeroLaCopia(request, event));
    }
});

async function primeroLaRed(request) {
    const cache = await caches.open(CACHE);
    try {
        const respuesta = await fetch(request);
        if (respuesta.ok) cache.put(request, respuesta.clone());
        return respuesta;
    } catch (error) {
        return (await cache.match(request, { ignoreSearch: true }))
            || (await cache.match("/enlaces/"));
    }
}

async function primeroLaCopia(request, event) {
    const cache = await caches.open(CACHE);
    const guardada = await cache.match(request);
    const red = fetch(request)
        .then((respuesta) => {
            if (respuesta.ok || respuesta.type === "opaque") cache.put(request, respuesta.clone());
            return respuesta;
        })
        .catch(() => guardada);
    if (guardada) {
        event.waitUntil(red);
        return guardada;
    }
    return red;
}
