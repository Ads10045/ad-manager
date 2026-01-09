import React, { useState } from 'react';
import { useMapping } from '../context/MappingContext';
import { useTheme } from '../context/ThemeContext';
import { Code, Copy, Check, Download, ExternalLink, Settings, Package } from 'lucide-react';
import ProductPickerModal from './ProductPickerModal';

/* ... generateIntegrationScript skipped ... */
const generateIntegrationScript = (template, mapping, apiUrl, productId) => {
    if (!template) return '// Sélectionnez un template pour générer le script';

    const mappingJson = JSON.stringify(mapping, null, 4);
    const displayProductId = productId || 'YOUR_PRODUCT_ID_HERE';

    return `<!-- Ads-AI Dynamic Banner Integration -->
<!-- Template: ${template.name} (${template.size}) -->
<div id="ads-ai-banner" data-product-id="${displayProductId}"></div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script>
(function($) {
    'use strict';
    
    // Configuration de la bannière
    const CONFIG = {
        apiUrl: '${apiUrl}',
        templateFile: '${template.file}',
        templateSize: '${template.size}',
        mapping: ${mappingJson},
        affiliationTags: {
            amazon: {
                fr: 'nutriplusap-21',
                es: 'nutriplusap07-21',
                de: 'nutriplusap0f-21',
                uk: 'nutriplusa0c7-21',
                it: 'nutriplusap0e-21',
                us: 'nutriplusapp2-21'
            }
        }
    };
    
    // Fonction pour appliquer l'affiliation
    function applyAffiliation(url) {
        if (!url || url === '#') return url;
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname.includes('amazon')) {
                let tag = CONFIG.affiliationTags.amazon.us;
                if (urlObj.hostname.includes('.fr')) tag = CONFIG.affiliationTags.amazon.fr;
                else if (urlObj.hostname.includes('.es')) tag = CONFIG.affiliationTags.amazon.es;
                else if (urlObj.hostname.includes('.de')) tag = CONFIG.affiliationTags.amazon.de;
                else if (urlObj.hostname.includes('.co.uk')) tag = CONFIG.affiliationTags.amazon.uk;
                else if (urlObj.hostname.includes('.it')) tag = CONFIG.affiliationTags.amazon.it;
                urlObj.searchParams.set('tag', tag);
            }
            return urlObj.toString();
        } catch (e) {
            return url;
        }
    }
    
    // Initialisation
    $(document).ready(function() {
        const $container = $('#ads-ai-banner');
        const productId = $container.data('product-id');
        
        if (!productId) {
            console.error('[Ads-AI] Missing data-product-id attribute');
            return;
        }
        
        // Récupération des données produit
        $.ajax({
            url: CONFIG.apiUrl + '/api/products/' + productId,
            method: 'GET',
            success: function(product) {
                // Récupération du template HTML
                $.ajax({
                    url: CONFIG.apiUrl + '/api/banners/template/' + CONFIG.templateFile,
                    method: 'GET',
                    success: function(html) {
                        let renderedHtml = html;
                        
                        // Injection des données mappées
                        Object.entries(CONFIG.mapping).forEach(function([zone, column]) {
                            if (product[column] !== undefined) {
                                let value = product[column];
                                
                                // Appliquer l'affiliation sur les URLs
                                if (column === 'sourceUrl' || column.includes('Url')) {
                                    value = applyAffiliation(value);
                                }
                                
                                // Remplacer les placeholders
                                const regex = new RegExp('\\\\[' + zone + '\\\\]', 'gi');
                                renderedHtml = renderedHtml.replace(regex, value);
                                
                                const colRegex = new RegExp('\\\\[' + column + '\\\\]', 'gi');
                                renderedHtml = renderedHtml.replace(colRegex, value);
                            }
                        });
                        
                        // Remplacer les données directes
                        Object.entries(product).forEach(function([key, value]) {
                            if (key === 'sourceUrl') value = applyAffiliation(value);
                            const regex = new RegExp('\\\\[' + key + '\\\\]', 'gi');
                            renderedHtml = renderedHtml.replace(regex, String(value));
                        });
                        
                        // Injecter dans le container
                        $container.html(renderedHtml);
                        console.log('[Ads-AI] Banner rendered: ${template.name}');
                    },
                    error: function() {
                        console.error('[Ads-AI] Failed to load banner template');
                    }
                });
            },
            error: function() {
                console.error('[Ads-AI] Failed to fetch product data');
            }
        });
    });
})(jQuery);
</script>

<style>
#ads-ai-banner {
    display: inline-block;
    width: ${template.size.split('x')[0]}px;
    height: ${template.size.split('x')[1]}px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
</style>`;
};

/**
 * ExportPanel - Panneau d'exportation du script d'intégration
 */
const ExportPanel = () => {
    const { selectedTemplate, mapping, saveConfiguration, savedBanners, isSaving } = useMapping();
    const { theme } = useTheme();
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);
    const [apiUrl, setApiUrl] = useState('https://ad-manager-api.vercel.app');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProductPicker, setShowProductPicker] = useState(false);

    const script = generateIntegrationScript(selectedTemplate, mapping, apiUrl, selectedProduct?.id);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(script);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleSave = async () => {
        const config = await saveConfiguration();
        if (config) {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([script], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ads-ai-banner-${selectedTemplate?.id || 'config'}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
    };

    if (!selectedTemplate) {
        return (
            <div className={`h-full flex flex-col items-center justify-center ${theme.text} opacity-30 p-8`}>
                <Code size={48} className="mb-4 opacity-50" />
                <h3 className="text-lg font-bold opacity-60 mb-2">Export</h3>
                <p className="text-sm text-center">
                    Configurez un template pour générer le script.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className={`p-4 border-b ${theme.border}`}>
                <h2 className={`text-lg font-black ${theme.text} uppercase tracking-wider flex items-center gap-2`}>
                    <Code size={18} className={theme.accent} />
                    Export
                </h2>
                <p className={`opacity-40 text-xs mt-1 ${theme.text}`}>
                    Script jQuery prêt à l'emploi
                </p>
            </div>

            {/* Settings */}
            <div className={`p-4 border-b ${theme.border} ${theme.card} space-y-3`}>
                {/* API URL */}
                <label className="block">
                    <span className={`opacity-60 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mb-2 ${theme.text}`}>
                        <Settings size={10} /> URL API
                    </span>
                    <input
                        type="text"
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        className={`w-full ${theme.input} border ${theme.border} rounded-lg px-3 py-2 ${theme.text} text-xs focus:border-purple-500 outline-none font-mono`}
                    />
                </label>

                {/* Product Selector */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className={`opacity-60 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${theme.text}`}>
                            <Package size={10} /> Produit
                        </span>
                        <button
                            onClick={() => handleProductSelect({ id: 'random-promo', name: 'Produit Aléatoire (Promo)', imageUrl: 'https://placehold.co/100x100?text=RANDOM' })}
                            className={`text-[10px] ${theme.accent} hover:opacity-80 underline cursor-pointer`}
                        >
                            Aléatoire
                        </button>
                    </div>
                    <button
                        onClick={() => setShowProductPicker(true)}
                        className={`w-full flex items-center justify-between ${theme.input} border ${theme.border} rounded-lg px-3 py-2.5 text-left hover:border-purple-500/50 transition-colors group`}
                    >
                        {selectedProduct ? (
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-8 h-8 ${theme.card} rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                                    {selectedProduct.imageUrl ? (
                                        <img src={selectedProduct.imageUrl} alt="" className="w-full h-full object-contain" />
                                    ) : (
                                        <Package size={14} className="opacity-40" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className={`${theme.text} text-xs font-bold truncate`}>{selectedProduct.name}</div>
                                    <div className={`${theme.accent} text-[10px]`}>ID: {selectedProduct.id}</div>
                                </div>
                            </div>
                        ) : (
                            <span className={`opacity-40 text-xs ${theme.text}`}>Cliquez pour sélectionner un produit...</span>
                        )}
                        <span className={`${theme.accent} text-xs font-bold group-hover:translate-x-1 transition-transform`}>
                            Choisir →
                        </span>
                    </button>
                </div>
            </div>

            {/* Code Preview */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className={`flex-1 overflow-auto custom-scrollbar p-4 ${theme.input}`}>
                    <pre className={`text-[10px] font-mono ${theme.text} opacity-60 whitespace-pre-wrap break-all leading-relaxed`}>
                        {script}
                    </pre>
                </div>
            </div>

            {/* Actions */}
            <div className={`p-4 border-t ${theme.border} space-y-2`}>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={handleCopy}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${copied
                            ? 'bg-emerald-500 text-white'
                            : `${theme.input} ${theme.text} ${theme.hover}`
                            }`}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copié !' : 'Copier'}
                    </button>
                    <button
                        onClick={handleDownload}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs ${theme.input} ${theme.text} ${theme.hover} transition-all`}
                    >
                        <Download size={14} />
                        Télécharger
                    </button>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${saved
                        ? 'bg-emerald-500 text-white'
                        : isSaving
                            ? 'bg-purple-500/50 text-white/50 cursor-wait'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                        }`}
                >
                    {isSaving ? (
                        <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sauvegarde...
                        </>
                    ) : saved ? (
                        <>
                            <Check size={14} />
                            Sauvegardé !
                        </>
                    ) : (
                        <>
                            <ExternalLink size={14} />
                            Sauvegarder Config
                        </>
                    )}
                </button>

                {/* Storage info */}
                <div className={`text-center text-[10px] ${theme.text} opacity-30 space-y-0.5`}>
                    <div>💾 Stockage: <span className="text-purple-300">localStorage</span> + <span className="text-pink-300">API</span></div>
                    {savedBanners.length > 0 && (
                        <div className="text-emerald-400">{savedBanners.length} config(s) sauvegardée(s)</div>
                    )}
                </div>
            </div>

            {/* Product Picker Modal */}
            <ProductPickerModal
                isOpen={showProductPicker}
                onClose={() => setShowProductPicker(false)}
                onSelect={handleProductSelect}
                selectedProductId={selectedProduct?.id}
            />
        </div>
    );
};

export default ExportPanel;
