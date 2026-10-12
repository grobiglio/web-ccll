/* RefTagger: convierte las referencias bíblicas del texto en enlaces con
   vista previa. Misma configuración que https://discipulado.ccll.com.ar/ */
var refTagger = {
    settings: {
        bibleVersion: "NBLH",
        roundCorners: true,
        tagLinksParentNodes: ["p", "blockquote", "cite", "li", "td"],
        noSearchClassNames: ["no-reftagger"],
        customStyle: {
            heading: {
                backgroundColor: "#081c15",
                color: "#d8f3dc"
            },
            body: {
                color: "#081c15"
            }
        }
    }
};

(function (d, t) {
    var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
    g.src = "//api.reftagger.com/v2/RefTagger.es.js";
    s.parentNode.insertBefore(g, s);
}(document, "script"));
