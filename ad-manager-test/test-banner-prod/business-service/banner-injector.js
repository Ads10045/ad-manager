(function($) {
    if (!$) return;
    $(document).ready(function() {
        const config = {
            targetClass: '.ads-ai-banner',
            apiUrl: "https://ad-manager-api.vercel.app/api/render-preview",
            defaultPath: 'service/business-solution.html'
        };
        const i18n = {
            defaultLang: 'en',
            currentLang: (navigator.language || navigator.userLanguage || 'en').split('-')[0]
        };

        const $containers = $(config.targetClass).length ? $(config.targetClass) : $('#ads-ai-dynamic-banner');
        if ($containers.length === 0) return;

        const applyI18nAndLoad = function(translations) {
            const langData = translations[i18n.currentLang] || translations[i18n.defaultLang];
            
            $('[data-i18n]').each(function() {
                const key = $(this).data('i18n');
                if (langData[key]) $(this).text(langData[key]);
            });

            if (i18n.currentLang === 'ar') $('body').attr('dir', 'rtl').addClass('font-arabic');

            $containers.each(function() {
                const $el = $(this);
                const customPath = $el.data('path') || config.defaultPath;

                $.ajax({
                    url: `${config.apiUrl}?path=${customPath}`,
                    type: 'GET',
                    success: function(htmlContent) {
                        let localizedHtml = htmlContent;
                        
                        // Injection de données dynamiques via attributs data-*
                        const dataInject = {
                            imageURL: $el.data('image') || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
                            phone: $el.data('phone') || "0000 0000 0000",
                            email: $el.data('email') || "contact@ads-ai.com",
                            website: $el.data('website') || "www.ads-ai.com",
                            productName: $el.data('name') || "",
                            productPrice: $el.data('price') || ""
                        };

                        Object.keys(dataInject).forEach(key => {
                            const regex = new RegExp(`\\[${key}\\]`, 'g');
                            localizedHtml = localizedHtml.replace(regex, dataInject[key]);
                        });

                        Object.keys(langData).forEach(key => {
                            const regex = new RegExp(`\\[i18n:${key}\\]`, 'g');
                            localizedHtml = localizedHtml.replace(regex, langData[key]);
                        });
                        localizedHtml = localizedHtml.replace('[banner_title]', langData['banner_title'] || '');
                        $el.hide().html(localizedHtml).fadeIn(1000);
                    },
                    error: function(xhr, status, error) {
                        console.error("Ads-AI Error:", error);
                        $el.html(`<div class="h-[400px] flex items-center justify-center text-red-500 bg-red-50 rounded-2xl border border-red-200">
                            <div class="text-center">
                                <span class="block font-black text-xl mb-2">ERREUR DE CHARGEMENT</span>
                                <span class="text-xs font-mono">${config.apiUrl}?path=${customPath}</span>
                            </div>
                        </div>`);
                    }
                });
            });
        };

        if (window.ADS_AI_LOCALES) {
            applyI18nAndLoad(window.ADS_AI_LOCALES);
        } else {
            console.error("Ads-AI: locales.js not found.");
        }
    });
})(window.jQuery);
