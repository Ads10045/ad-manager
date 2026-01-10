import React, { useState, useEffect } from 'react';
import { useMapping } from '../context/MappingContext';
import { useTheme } from '../context/ThemeContext';
import { Edit3 } from 'lucide-react';

// URL de base pour les templates (local ou GitHub)
const TEMPLATE_BASE_URL = 'http://localhost:3001/api/templates';

/**
 * BannerPreview - Composant de prévisualisation en temps réel
 * Charge le HTML depuis ad-manager-banner et injecte les données mappées
 */
const BannerPreview = () => {
    const {
        selectedTemplate,
        mapping,
        previewData,
        editMode,
        setActiveZone,
        setIsCodeEditorOpen
    } = useMapping();
    const { theme } = useTheme();

    const [bannerHtml, setBannerHtml] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Charger le template HTML quand le template sélectionné change
    useEffect(() => {
        if (!selectedTemplate?.file) {
            setBannerHtml(null);
            return;
        }

        const loadTemplate = async () => {
            setLoading(true);
            setError(null);

            try {
                // Essayer de charger depuis l'API locale
                const response = await fetch(`${TEMPLATE_BASE_URL}/${selectedTemplate.file}`);

                if (!response.ok) {
                    throw new Error(`Template non trouvé: ${selectedTemplate.file}`);
                }

                const html = await response.text();
                setBannerHtml(html);
            } catch (err) {
                console.error('Erreur chargement template:', err);
                setError(err.message);

                // Fallback: générer un aperçu basique
                setBannerHtml(generateFallbackHtml(selectedTemplate));
            } finally {
                setLoading(false);
            }
        };

        loadTemplate();
    }, [selectedTemplate?.file]);

    // Générer un HTML de fallback si le template n'est pas accessible
    const generateFallbackHtml = (template) => {
        const [width, height] = (template.size || '300x250').split('x');
        return `
            <div style="
                width: ${width}px;
                height: ${height}px;
                background: linear-gradient(135deg, #1a0a2e, #4c1d95);
                border-radius: 16px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                font-family: system-ui;
                padding: 20px;
                text-align: center;
            ">
                <div style="font-size: 32px; margin-bottom: 12px;">🖼️</div>
                <div style="font-weight: bold; margin-bottom: 8px;">${template.name}</div>
                <div style="font-size: 12px; opacity: 0.6;">${template.size}</div>
                <div style="font-size: 10px; opacity: 0.4; margin-top: 12px;">Aperçu local</div>
            </div>
        `;
    };

    // Injecter les données mappées dans le HTML
    const getRenderedHtml = () => {
        if (!bannerHtml) return null;

        let html = bannerHtml;

        // Remplacer les placeholders avec les données mappées
        Object.entries(mapping).forEach(([zoneName, columnKey]) => {
            if (previewData[columnKey] !== undefined) {
                const value = previewData[columnKey];
                // Remplacer [zoneName] par la valeur
                const regex = new RegExp(`\\[${zoneName}\\]`, 'gi');
                html = html.replace(regex, value);

                // Aussi remplacer [columnKey] directement
                const colRegex = new RegExp(`\\[${columnKey}\\]`, 'gi');
                html = html.replace(colRegex, value);
            }
        });

        // Remplacer aussi les données directes de previewData
        Object.entries(previewData).forEach(([key, value]) => {
            const regex = new RegExp(`\\[${key}\\]`, 'gi');
            html = html.replace(regex, String(value));
        });

        // Gérer le badge promo
        if (previewData.isPromo) {
            html = html.replace(/style="display:\s*none;?"([^>]*data-field="promoBadge")/gi, '$1');
        }

        return html;
    };

    if (!selectedTemplate) {
        return (
            <div className={`h-full flex flex-col items-center justify-center ${theme.text} opacity-30 p-8`}>
                <div className={`w-32 h-32 border-2 border-dashed ${theme.border} rounded-2xl flex items-center justify-center mb-4`}>
                    <span className="text-4xl opacity-50">🖼️</span>
                </div>
                <h3 className="text-lg font-bold opacity-60 mb-2">Prévisualisation</h3>
                <p className="text-sm text-center max-w-xs">
                    Sélectionnez un template pour voir l'aperçu en temps réel avec vos données mappées.
                </p>
            </div>
        );
    }

    const [width, height] = (selectedTemplate.size || '300x250').split('x');

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className={`p-4 border-b ${theme.border} flex items-center justify-between`}>
                <div>
                    <h2 className={`text-lg font-black ${theme.text} uppercase tracking-wider`}>
                        Prévisualisation
                    </h2>
                    <p className={`opacity-40 text-xs mt-1 ${theme.text}`}>
                        {selectedTemplate.size} • {selectedTemplate.name}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {editMode && (
                        <div className={`px-3 py-1 ${theme.accentBg}/20 border border-purple-500/50 rounded-full ${theme.accent} text-xs font-bold animate-pulse`}>
                            Mode Édition Actif
                        </div>
                    )}
                    <button
                        onClick={() => setIsCodeEditorOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 rounded-lg text-xs font-bold text-white shadow-lg shadow-purple-500/20"
                    >
                        <Edit3 size={14} />
                        Éditer
                    </button>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05)_0%,transparent_70%)] overflow-auto">
                {loading ? (
                    <div className={`${theme.text} opacity-40 flex flex-col items-center gap-4`}>
                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Chargement du template...</span>
                    </div>
                ) : error ? (
                    <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-xl max-w-sm">
                        <div className="text-red-400 text-sm font-bold mb-2">⚠️ Erreur de chargement</div>
                        <p className={`${theme.text} opacity-50 text-xs`}>{error}</p>
                    </div>
                ) : (
                    <div
                        className="relative"
                        style={{
                            boxShadow: '0 25px 50px -12px rgba(168, 85, 247, 0.25)',
                        }}
                    >
                        {/* Banner Container */}
                        <div
                            dangerouslySetInnerHTML={{ __html: getRenderedHtml() }}
                            style={{
                                width: `${width}px`,
                                height: `${height}px`,
                                background: 'white' // Toujours blanc pour le template lui-même
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Data Inspector */}
            <div className={`p-4 border-t ${theme.border} ${theme.card} bg-opacity-50`}>
                <div className={`text-[10px] uppercase tracking-widest opacity-40 mb-2 font-bold ${theme.text}`}>
                    Données mappées
                </div>
                <div className="flex flex-wrap gap-1">
                    {Object.entries(mapping).map(([zone, column]) => (
                        <div
                            key={zone}
                            className={`px-2 py-1 ${theme.input} border ${theme.border} rounded text-xs opacity-80 ${theme.text}`}
                        >
                            <span className={theme.accent}>{zone}</span>
                            <span className="opacity-30 mx-1">→</span>
                            <span className="text-emerald-500 font-bold">{column}</span>
                        </div>
                    ))}
                    {Object.keys(mapping).length === 0 && (
                        <span className={`opacity-30 text-xs italic ${theme.text}`}>Aucune liaison configurée</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BannerPreview;
