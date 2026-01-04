(function($) {
    if (!$) return;
    $(document).ready(function() {
        const config = {
            targetId: '#ads-ai-dynamic-banner',
            apiUrl: "http://localhost:3001/api/render-preview",
            defaultPath: 'achats/special-offers-grid.html'
        };
        const i18n = {
            localesPath: "locales.json", 
            defaultLang: 'fr',
            currentLang: (navigator.language || navigator.userLanguage || 'fr').split('-')[0]
        };
        const $container = $(config.targetId);
        if ($container.length === 0) return;
        const customPath = $container.data('path') || config.defaultPath;

        $.getJSON(i18n.localesPath, function(translations) {
            const langData = translations[i18n.currentLang] || translations[i18n.defaultLang];
            $.ajax({
                url: `${config.apiUrl}?path=${customPath}`,
                type: 'GET',
                success: function(htmlContent) {
                    let localizedHtml = htmlContent;
                    Object.keys(langData).forEach(key => {
                        const regex = new RegExp(`\\[i18n:${key}\\]`, 'g');
                        localizedHtml = localizedHtml.replace(regex, langData[key]);
                    });
                    localizedHtml = localizedHtml.replace('[banner_title]', langData['banner_title']);
                    $container.hide().html(localizedHtml).fadeIn(1000);
                    if (i18n.currentLang === 'ar') $container.attr('dir', 'rtl').addClass('font-arabic');
                }
            });
        });
    });
})(window.jQuery);
