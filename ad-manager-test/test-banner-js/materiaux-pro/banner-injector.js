(function($) {
    if (!$) return;
    $(document).ready(function() {
        const config = {
            targetClass: '.ads-ai-banner',
            apiUrl: "http://localhost:3001/api/render-preview",
            defaultPath: 'achats/materiaux-pro-banner.html'
        };
        const i18n = {
            localesPath: "locales.json", 
            defaultLang: 'en',
            currentLang: (navigator.language || navigator.userLanguage || 'en').split('-')[0]
        };

        // Supporter ID ou Classe pour la rétrocompatibilité
        const $containers = $(config.targetClass).length ? $(config.targetClass) : $('#ads-ai-dynamic-banner');
        
        if ($containers.length === 0) return;

        // Logic to apply translations and load banners
        const applyI18nAndLoad = function(translations) {
            const langData = translations[i18n.currentLang] || translations[i18n.defaultLang];
            
            // Traduction de la page hôte
            $('[data-i18n]').each(function() {
                const key = $(this).data('i18n');
                if (langData[key]) $(this).text(langData[key]);
            });

            if (i18n.currentLang === 'ar') $('body').attr('dir', 'rtl').addClass('font-arabic');

            // Injection des bannières
            $containers.each(function() {
                const $el = $(this);
                const customPath = $el.data('path') || config.defaultPath;

                $.ajax({
                    url: `${config.apiUrl}?path=${customPath}`,
                    type: 'GET',
                    success: function(htmlContent) {
                        let localizedHtml = htmlContent;
                        Object.keys(langData).forEach(key => {
                            const regex = new RegExp(`\\[i18n:${key}\\]`, 'g');
                            localizedHtml = localizedHtml.replace(regex, langData[key]);
                        });
                        localizedHtml = localizedHtml.replace('[banner_title]', langData['banner_title'] || '');
                        $el.hide().html(localizedHtml).fadeIn(1000);
                    },
                    error: function() {
                        const err = i18n.currentLang === 'ar' ? "خطأ في التحميل" : "Erreur de chargement";
                        $el.html(`<div style="border:1px dashed #ccc;padding:10px;text-align:center;color:#999;font-size:12px;">${err}</div>`);
                    }
                });
            });
        };

        // Si les locales sont déjà chargées via script (window.ADS_AI_LOCALES)
        if (window.ADS_AI_LOCALES) {
            applyI18nAndLoad(window.ADS_AI_LOCALES);
        } else {
            // Fallback AJAX si le script n'est pas là
            $.getJSON(i18n.localesPath, applyI18nAndLoad).fail(function() {
                console.warn("Ads-AI: Local locales script/json failed. Falling back to raw API.");
                $containers.each(function() {
                   const $el = $(this);
                   $.get(`${config.apiUrl}?path=${$el.data('path') || config.defaultPath}`, h => $el.html(h));
                });
            });
        }
    });
})(window.jQuery);
