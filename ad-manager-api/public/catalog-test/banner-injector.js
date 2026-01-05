(function($) {
    if (!$) return;
    $(document).ready(function() {
        const config = {
            targetClass: '.ads-ai-banner',
            apiUrl: "https://ad-manager-api.vercel.app/api/render-preview"
        };

        const $containers = $(config.targetClass);
        if ($containers.length === 0) return;

        $containers.each(function() {
            const $el = $(this);
            const path = $el.data('path');
            if (!path) return;

            // Logique d'injection universelle
            $.ajax({
                url: `${config.apiUrl}?path=${path}`,
                type: 'GET',
                success: function(html) {
                    let finalHtml = html;
                    
                    // On récupère TOUS les attributs data-* de l'élément
                    // jQuery .data() convertit data-image-url en "imageUrl"
                    const allData = $el.data();
                    
                    Object.keys(allData).forEach(key => {
                        // On remplace [key] par la valeur
                        const value = allData[key];
                        const regex = new RegExp(`\\[${key}\\]`, 'g');
                        finalHtml = finalHtml.replace(regex, value);
                    });

                    // On injecte avec un effet de fondu
                    $el.hide().html(finalHtml).fadeIn(800);
                },
                error: function(xhr, status, error) {
                    console.error("Ads-AI Injector Error:", error);
                    $el.html(`<div class="p-12 text-center text-red-500 bg-red-50 rounded-[2rem] border border-red-100">
                        <span class="block font-black text-xl mb-4">FAILED TO LOAD TEMPLATE</span>
                        <code class="text-xs bg-white px-3 py-2 rounded-lg border border-red-100">${path}</code>
                    </div>`);
                }
            });
        });
    });
})(window.jQuery);
