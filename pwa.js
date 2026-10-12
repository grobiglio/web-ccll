/* App instalable (PWA): registra el service worker y, en el portal de
   enlaces, muestra el botón "Instalar la app" o la ayuda para iPhone. */
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js");
    });
}

(function () {
    const instalada = window.matchMedia("(display-mode: standalone)").matches
        || window.navigator.standalone === true;
    if (instalada) return;

    // Android y navegadores de escritorio basados en Chromium.
    const boton = document.getElementById("instalar-app");
    if (boton) {
        let aviso = null;
        window.addEventListener("beforeinstallprompt", (event) => {
            event.preventDefault();
            aviso = event;
            boton.hidden = false;
        });
        boton.addEventListener("click", async () => {
            if (!aviso) return;
            aviso.prompt();
            await aviso.userChoice;
            aviso = null;
            boton.hidden = true;
        });
        window.addEventListener("appinstalled", () => {
            boton.hidden = true;
        });
    }

    // iPhone/iPad: no hay aviso de instalación, se explica cómo hacerlo.
    const ayudaIos = document.getElementById("instalar-ios");
    const esIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
        || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (ayudaIos && esIos) ayudaIos.hidden = false;
})();
