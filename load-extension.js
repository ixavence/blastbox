// load-extension.js
document.addEventListener("DOMContentLoaded", function () {
    const saved = localStorage.getItem("extensions");
    if (!saved) return;

    let extensions;
    try {
        extensions = JSON.parse(saved);
    } catch (err) {
        console.error("[BlastBox Extension] Error parsing extensions:", err);
        return;
    }

    extensions
        .filter(function (ext) { return ext.enabled; })
        .forEach(function (ext) {
            const script = document.createElement("script");
            script.src = ext.src;
            script.onload = function () {
                console.log("[BlastBox Extension] Loaded:", ext.name);
            };
            script.onerror = function () {
                console.error("[BlastBox Extension] Failed to load:", ext.name, "(" + ext.src + ")");
            };
            document.body.appendChild(script);
        });
});