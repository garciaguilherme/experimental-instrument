// Mini-VLAT SVG Export & Serialization Utility

(function() {
    window.SVG_EXPORTER = {
        getSerializedSvg,
        downloadSvg,
        copySvgCode,
        downloadAllAsZip
    };

    const STANDALONE_STYLE = `
        text {
            font-family: Arial, Helvetica, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            text-rendering: geometricPrecision;
        }
        line, path, rect, circle {
            shape-rendering: geometricPrecision;
        }
    `;

    function getSerializedSvg(svgEl) {
        // Clone node so we don't mutate displayed SVG
        const clone = svgEl.cloneNode(true);

        // Ensure proper attributes
        clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
        clone.setAttribute("version", "1.1");

        // Embed standalone style if not already present
        let styleTag = clone.querySelector("style");
        if (!styleTag) {
            styleTag = document.createElementNS("http://www.w3.org/2000/svg", "style");
            styleTag.textContent = STANDALONE_STYLE;
            clone.insertBefore(styleTag, clone.firstChild);
        }

        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(clone);

        // Prepend XML declaration
        if (!svgString.startsWith("<?xml")) {
            svgString = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + svgString;
        }

        return svgString;
    }

    function downloadSvg(svgEl, filename) {
        try {
            const svgString = getSerializedSvg(svgEl);
            const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename.endsWith(".svg") ? filename : `${filename}.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast(`Arquivo "${a.download}" exportado com sucesso!`);
        } catch (err) {
            console.error("Erro ao exportar SVG:", err);
            showToast("Erro ao exportar SVG. Verifique o console.", true);
        }
    }

    async function copySvgCode(svgEl) {
        try {
            const svgString = getSerializedSvg(svgEl);
            await navigator.clipboard.writeText(svgString);
            showToast("Código SVG copiado para a área de transferência!");
        } catch (err) {
            console.warn("Clipboard API falhou, tentando fallback:", err);
            const ta = document.createElement("textarea");
            ta.value = getSerializedSvg(svgEl);
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            showToast("Código SVG copiado para a área de transferência!");
        }
    }

    async function downloadAllAsZip(chartsList) {
        if (!window.JSZip) {
            showToast("Biblioteca JSZip não encontrada.", true);
            return;
        }

        showToast("Preparando pacote ZIP com todos os 12 SVGs...", false);
        const zip = new JSZip();
        const folder = zip.folder("Mini-VLAT_SVGs");

        chartsList.forEach(item => {
            const svgEl = document.getElementById(item.id);
            if (svgEl) {
                const svgString = getSerializedSvg(svgEl);
                folder.file(`${item.filename}.svg`, svgString);
            }
        });

        try {
            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Mini-VLAT_Graficos_SVG.zip";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast("Todos os 12 arquivos SVG foram baixados em Mini-VLAT_Graficos_SVG.zip!");
        } catch (err) {
            console.error("Erro ao gerar ZIP:", err);
            showToast("Falha ao gerar arquivo ZIP.", true);
        }
    }

    function showToast(message, isError = false) {
        let toast = document.getElementById("toast-notification");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast-notification";
            toast.className = "toast";
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.className = `toast show ${isError ? 'toast-error' : ''}`;
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.className = "toast";
        }, 3500);
    }
})();
