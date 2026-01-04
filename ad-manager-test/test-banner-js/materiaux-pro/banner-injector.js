/**
 * Ads-AI Dynamic Banner Injector
 * Version: 1.0.0
 * Description: Injects a dynamic banner into any container with ID #ads-ai-dynamic-banner
 */

(function($) {
    if (!$) {
        console.error("Ads-AI: jQuery is required for this script.");
        return;
    }

    $(document).ready(function() {
        // Configuration
        const config = {
            targetId: '#ads-ai-dynamic-banner',
            // URL locale de l'API de rendu
            apiUrl: "http://localhost:3001/api/render-preview",
            defaultPath: 'achats/materiaux-pro-banner.html'
        };

        const $container = $(config.targetId);
        
        if ($container.length === 0) {
            console.warn("Ads-AI: Target container not found. Add <div id='ads-ai-dynamic-banner'></div> to your HTML.");
            return;
        }

        console.log("🚀 Ads-AI: Fetching dynamic HTML content...");

        // Récupération du chemin via l'attribut data-path sur le conteneur
        const customPath = $container.data('path') || config.defaultPath;

        $.ajax({
            url: `${config.apiUrl}?path=${customPath}`,
            type: 'GET',
            crossDomain: true,
            success: function(htmlContent) {
                // Injection directe du HTML envoyé par le serveur
                $container.hide().html(htmlContent).fadeIn(1000);
                console.log("✅ Ads-AI: Content injected successfully.");
            },
            error: function(xhr, status, error) {
                console.error("❌ Ads-AI: Failed to contact the API.", error);
                $container.html(`
                    <div style="border: 1px dashed #ccc; padding: 20px; border-radius: 12px; text-align: center; font-family: sans-serif; color: #666;">
                        <p style="margin: 0; font-size: 14px;">Publicité momentanément indisponible</p>
                    </div>
                `);
            }
        });
    });
})(window.jQuery);
