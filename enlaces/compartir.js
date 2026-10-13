/* Botón «Compartir»: abre el menú nativo de compartir del dispositivo y,
   si no existe (algunos navegadores de escritorio), copia el enlace. */
(function () {
    const boton = document.getElementById("compartir");
    if (!boton) return;

    // Se comparte /enlaces/ (no la raíz) porque es la que tiene Open Graph.
    const datos = {
        title: "Comunidad Cristiana Laguna Larga",
        text: "Edificando vidas sobre la verdad del Evangelio.",
        url: "https://www.ccll.com.ar/enlaces/"
    };
    const etiqueta = boton.querySelector("span");
    const textoOriginal = etiqueta.textContent;

    function avisar(texto) {
        etiqueta.textContent = texto;
        setTimeout(() => { etiqueta.textContent = textoOriginal; }, 2500);
    }

    boton.addEventListener("click", async () => {
        if (navigator.share) {
            try {
                await navigator.share(datos);
            } catch (error) {
                // AbortError: la persona cerró el menú sin compartir.
            }
            return;
        }
        try {
            await navigator.clipboard.writeText(datos.url);
            avisar("¡Enlace copiado!");
        } catch (error) {
            avisar(datos.url);
        }
    });
})();
