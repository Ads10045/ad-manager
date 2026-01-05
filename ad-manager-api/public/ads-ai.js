/**
 * 🎨 Ads-AI Universal Banner Loader (V2)
 * Rendu côté serveur avec Overrides côté client.
 */
(function($) {
    if (!$) {
        console.error("Ads-AI: jQuery est requis.");
        return;
    }

    const API_URL = "https://ad-manager-api.vercel.app/api/render-preview";

    function loadBanners() {
        $('.ads-ai-banner').each(function() {
            const $container = $(this);
            const data = $container.data();
            const path = data.path;
            
            if ($container.hasClass('ads-ai-loaded') || !path) return;

            // On envoie tous les data-* au serveur pour le rendu
            const queryParams = $.param(data);

            $.ajax({
                url: `${API_URL}?${queryParams}`,
                method: 'GET',
                success: function(html) {
                    $container.hide().html(html).addClass('ads-ai-loaded').fadeIn(500);
                },
                error: function() {
                    $container.html('<div style="color:red; font-size:10px;">⚠️ Ads-AI Load Error</div>');
                }
            });
        });
    }

    $(document).ready(loadBanners);
    window.AdsAI = { refresh: loadBanners };

})(window.jQuery);
