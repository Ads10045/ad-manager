(function($) {
    if (!$) return;
    $(document).ready(function() {
        const config = {
            targetClass: '.ads-ai-banner',
            apiUrl: "https://ad-manager-api.vercel.app/api/render-preview",
            defaultPath: 'automotive/car-comparison.html'
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
                            // Model 1
                            model1_name: $el.data('model1-name') || "Outlander",
                            model1_image: $el.data('model1-image') || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
                            model1_price: $el.data('model1-price') || "24 895 $",
                            model1_feature1: $el.data('model1-feature1') || "5/7 places",
                            model1_feature2: $el.data('model1-feature2') || "velit esse cillum",
                            model1_feature3: $el.data('model1-feature3') || "dolore eu fugiat nulla",
                            model1_feature4: $el.data('model1-feature4') || "non proident",
                            
                            // Model 2
                            model2_name: $el.data('model2-name') || "Croix de l'Éclipse",
                            model2_image: $el.data('model2-image') || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
                            model2_price: $el.data('model2-price') || "22 995 $",
                            model2_feature1: $el.data('model2-feature1') || "5/7 places",
                            model2_feature2: $el.data('model2-feature2') || "velit esse cillum",
                            model2_feature3: $el.data('model2-feature3') || "dolore eu fugiat nulla",
                            model2_feature4: $el.data('model2-feature4') || "non proident",
                            
                            // Model 3
                            model3_name: $el.data('model3-name') || "Sport de Shogun",
                            model3_image: $el.data('model3-image') || "https://images.unsplash.com/photo-1519641474000-f4674a14849ac?auto=format&fit=crop&q=80&w=800",
                            model3_price: $el.data('model3-price') || "39 995 $",
                            model3_feature1: $el.data('model3-feature1') || "5/7 places",
                            model3_feature2: $el.data('model3-feature2') || "velit esse cillum",
                            model3_feature3: $el.data('model3-feature3') || "dolore eu fugiat nulla",
                            model3_feature4: $el.data('model3-feature4') || "non proident"
                        };

                        Object.keys(dataInject).forEach(key => {
                            const regex = new RegExp(`\\[${key}\\]`, 'g');
                            localizedHtml = localizedHtml.replace(regex, dataInject[key]);
                        });

                        Object.keys(langData).forEach(key => {
                            const regex = new RegExp(`\\[i18n:${key}\\]`, 'g');
                            localizedHtml = localizedHtml.replace(regex, langData[key]);
                        });
                        
                        $el.hide().html(localizedHtml).fadeIn(1000);
                    },
                    error: function(xhr, status, error) {
                        console.error("Ads-AI Error:", error);
                        $el.html(`<div class="h-[600px] flex items-center justify-center text-red-500 bg-red-50 rounded-2xl border border-red-200">
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
