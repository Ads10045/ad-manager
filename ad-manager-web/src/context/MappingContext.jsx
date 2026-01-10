import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Layout, Smartphone, Monitor, LayoutGrid, Layers, Sparkles } from 'lucide-react';

// Liste des colonnes disponibles dans la DB
export const DB_COLUMNS = [
    { key: 'name', label: 'Nom du Produit', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'category', label: 'Catégorie', type: 'text' },
    { key: 'supplier', label: 'Fournisseur', type: 'text' },
    { key: 'source', label: 'Site Source', type: 'text' },
    { key: 'price', label: 'Prix (€)', type: 'value' },
    { key: 'supplierPrice', label: 'Prix Fournisseur (€)', type: 'value' },
    { key: 'margin', label: 'Marge (%)', type: 'value' },
    { key: 'stock', label: 'Stock', type: 'value' },
    { key: 'imageUrl', label: 'Image Principale', type: 'media' },
    { key: 'images', label: 'Galerie Images', type: 'media' },
    { key: 'sourceLogo', label: 'Logo Site Source', type: 'media' },
    { key: 'isPromo', label: 'En Promotion', type: 'logic' },
    { key: 'promoExpiry', label: 'Fin de Promo', type: 'logic' },
    { key: 'sourceUrl', label: 'Lien Produit', type: 'link' }
];

// Sites sources disponibles avec leurs logos
export const SOURCE_SITES = [
    {
        name: 'Amazon',
        key: 'amazon',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        color: '#FF9900'
    },
    {
        name: 'AliExpress',
        key: 'aliexpress',
        logo: 'https://ae01.alicdn.com/kf/S9177d7f9251842339ba3c1ef19b1b990R.png',
        color: '#E62E04'
    },
    {
        name: 'eBay',
        key: 'ebay',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg',
        color: '#0064D2'
    },
    {
        name: 'Cdiscount',
        key: 'cdiscount',
        logo: 'https://www.cdiscount.com/favicon.ico',
        color: '#00529B'
    },
    {
        name: 'Fnac',
        key: 'fnac',
        logo: 'https://www.fnac.com/favicon.ico',
        color: '#E1A400'
    },
    {
        name: 'Rakuten',
        key: 'rakuten',
        logo: 'https://www.rakuten.com/favicon.ico',
        color: '#BF0000'
    }
];

// Clé localStorage pour persister les mappings
const STORAGE_KEY = 'ads-ai-banner-mappings';
const CONFIG_KEY = 'ads-ai-banner-config'; // New key for templates
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const INITIAL_CONFIG = {
    categories: {
        leaderboard: {
            name: "Leaderboard",
            icon: "Monitor",
            description: "Bannières horizontales larges",
            templates: [
                {
                    id: "banner-type-a-728x90",
                    name: "Épuré - Leaderboard",
                    file: "leaderboard/BannerTypeA-728x90.html",
                    size: "728x90",
                    description: "Design minimaliste avec focus sur l'image",
                    fields: ["imageUrl", "name", "category", "price", "sourceUrl"]
                },
                {
                    id: "billboard-premium-970x90",
                    name: "Billboard Premium",
                    file: "leaderboard/billboard-premium-970x90.html",
                    size: "970x90",
                    description: "Format large avec branding et statistiques",
                    fields: ["imageUrl", "name", "category", "price", "supplierPrice", "stock", "margin", "sourceUrl"]
                },
                {
                    id: "minimal-white-728x90",
                    name: "Minimal White",
                    file: "leaderboard/minimal-white-728x90.html",
                    size: "728x90",
                    description: "Design épuré blanc et moderne",
                    fields: ["imageUrl", "name", "category", "price", "margin", "sourceUrl"]
                }
            ]
        },
        rectangle: {
            name: "Rectangle",
            icon: "LayoutGrid",
            description: "Bannières moyennes format carré",
            templates: [
                {
                    id: "banner-type-b-300x250",
                    name: "Promotionnel",
                    file: "rectangle/BannerTypeB-300x250.html",
                    size: "300x250",
                    description: "Design promo avec focus sur le prix",
                    fields: ["imageUrl", "name", "description", "price", "supplierPrice", "sourceUrl"]
                },
                {
                    id: "neon-glow-300x250",
                    name: "Neon Glow",
                    file: "rectangle/neon-glow-300x250.html",
                    size: "300x250",
                    description: "Design néon animé avec bordure RGB",
                    fields: ["imageUrl", "name", "price", "margin", "sourceUrl"]
                },
                {
                    id: "glassmorphism-300x250",
                    name: "Glassmorphism",
                    file: "rectangle/glassmorphism-300x250.html",
                    size: "300x250",
                    description: "Effet verre flou moderne",
                    fields: ["imageUrl", "name", "category", "price", "margin", "sourceUrl"]
                },
                {
                    id: "tech-dark-300x250",
                    name: "Tech Dark",
                    file: "rectangle/tech-dark-300x250.html",
                    size: "300x250",
                    description: "Thème développeur style GitHub",
                    fields: ["imageUrl", "name", "category", "price", "margin", "sourceUrl"]
                }
            ]
        },
        skyscraper: {
            name: "Skyscraper",
            icon: "Layout",
            description: "Bannières verticales étroites",
            templates: [
                {
                    id: "banner-type-c-160x600",
                    name: "Informatif",
                    file: "skyscraper/BannerTypeC-160x600.html",
                    size: "160x600",
                    description: "Design vertical avec détails",
                    fields: ["imageUrl", "name", "description", "category", "supplier", "stock", "price", "margin", "sourceUrl"]
                }
            ]
        },
        halfpage: {
            name: "Half Page",
            icon: "Layout",
            description: "Bannières demi-page",
            templates: [
                {
                    id: "banner-type-d-300x600",
                    name: "Premium",
                    file: "halfpage/BannerTypeD-300x600.html",
                    size: "300x600",
                    description: "Design premium avec stats",
                    fields: ["imageUrl", "name", "description", "category", "stock", "margin", "price", "sourceUrl"]
                },
                {
                    id: "luxury-gold-300x600",
                    name: "Luxury Gold",
                    file: "halfpage/luxury-gold-300x600.html",
                    size: "300x600",
                    description: "Style luxe avec accents dorés",
                    fields: ["imageUrl", "name", "category", "price", "margin", "sourceUrl"]
                }
            ]
        },
        mobile: {
            name: "Mobile",
            icon: "Smartphone",
            description: "Optimisées pour mobile",
            templates: [
                {
                    id: "mobile-banner-320x100",
                    name: "Mobile Banner",
                    file: "mobile/mobile-banner-320x100.html",
                    size: "320x100",
                    description: "Format compact pour mobile",
                    fields: ["imageUrl", "name", "price", "sourceUrl"]
                },
                {
                    id: "mobile-leaderboard-320x50",
                    name: "Mobile Leaderboard",
                    file: "mobile/mobile-leaderboard-320x50.html",
                    size: "320x50",
                    description: "Format ultra-compact",
                    fields: ["imageUrl", "name", "price", "sourceUrl"]
                },
                {
                    id: "gradient-wave-320x100",
                    name: "Gradient Wave",
                    file: "mobile/gradient-wave-320x100.html",
                    size: "320x100",
                    description: "Dégradé coloré dynamique",
                    fields: ["imageUrl", "name", "price", "margin", "sourceUrl"]
                }
            ]
        },
        "multi-product": {
            name: "Multi-Produits",
            icon: "Layers",
            description: "Affichant plusieurs produits",
            templates: [
                {
                    id: "multi-product-leaderboard-728x90",
                    name: "Multi-Product Leaderboard",
                    file: "multi-product/multi-product-leaderboard-728x90.html",
                    size: "728x90",
                    description: "3 produits côte à côte",
                    fields: ["product1ImageUrl", "product1Name", "product1Price", "product2ImageUrl", "product2Name", "product2Price", "product3ImageUrl", "product3Name", "product3Price", "storeUrl"]
                },
                {
                    id: "multi-product-grid-300x600",
                    name: "Multi-Product Grid",
                    file: "multi-product/multi-product-grid-300x600.html",
                    size: "300x600",
                    description: "4 produits en liste verticale",
                    fields: ["product1ImageUrl", "product1Name", "product1Price", "product2ImageUrl", "product2Name", "product2Price", "product3ImageUrl", "product3Name", "product3Price", "product4ImageUrl", "product4Name", "product4Price", "storeUrl"]
                }
            ]
        },
        fashion: {
            name: "Mode & Fashion",
            icon: "Sparkles",
            description: "Collections et Soldes",
            templates: [
                {
                    id: "fashion-black-friday-970x250",
                    name: "Black Friday Collection",
                    file: "fashion/black-friday-multi-970x250.html",
                    size: "970x250",
                    description: "Billboard élégant multi-produits (Style Mimi Chamois)",
                    fields: ["product1Image", "product1Name", "product1Link", "product2Image", "product2Name", "product2Link", "product3Image", "product3Name", "product3Link", "product4Image", "product4Name", "product4Link"]
                }
            ]
        }
    }
};

// Création du contexte
const MappingContext = createContext(null);

export const MappingProvider = ({ children }) => {
    // Template sélectionné
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    // Banner Config (List of templates)
    const [bannerConfig, setBannerConfig] = useState(INITIAL_CONFIG);

    // Mappings par template : { templateId: { zoneName: columnKey } }
    const [templateMappings, setTemplateMappings] = useState({});

    // Zone actuellement sélectionnée pour le mapping
    const [activeZone, setActiveZone] = useState(null);

    // Mode d'édition (survol des zones)
    const [editMode, setEditMode] = useState(false);

    // Configurations sauvegardées en DB
    const [savedBanners, setSavedBanners] = useState([]);

    // État de sauvegarde
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    // Mode Éditeur de Code (Tab dans App.jsx)
    const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
    // Contenu HTML en cours d'édition (si null, non chargé)
    const [editorCode, setEditorCode] = useState('');

    // Données de prévisualisation (produit exemple)
    const [previewData, setPreviewData] = useState({
        name: 'Écouteurs Bluetooth Pro',
        description: 'Écouteurs sans fil avec réduction de bruit active et autonomie de 30h.',
        category: 'Tech',
        supplier: 'Amazon',
        source: 'Amazon',
        sourceLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        price: 79.99,
        supplierPrice: 45.00,
        margin: 44,
        stock: 150,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        images: [],
        isPromo: true,
        promoExpiry: '2026-01-15',
        sourceUrl: 'https://amazon.fr/dp/B09XYZ123'
    });

    // Charger les mappings et config depuis localStorage au démarrage
    useEffect(() => {
        try {
            // Always use INITIAL_CONFIG as base, then merge any custom templates from localStorage
            const storedConfig = localStorage.getItem(CONFIG_KEY);
            if (storedConfig) {
                const parsed = JSON.parse(storedConfig);
                // Merge: Start with INITIAL_CONFIG, add any custom templates from localStorage
                const mergedConfig = { categories: { ...INITIAL_CONFIG.categories } };

                // Add any custom templates that aren't in INITIAL_CONFIG
                Object.entries(parsed.categories || {}).forEach(([catKey, cat]) => {
                    if (!mergedConfig.categories[catKey]) {
                        // New category from localStorage
                        mergedConfig.categories[catKey] = cat;
                    } else {
                        // Existing category - add custom templates
                        const existingIds = mergedConfig.categories[catKey].templates.map(t => t.id);
                        const customTemplates = cat.templates.filter(t => !existingIds.includes(t.id));
                        mergedConfig.categories[catKey].templates = [
                            ...mergedConfig.categories[catKey].templates,
                            ...customTemplates
                        ];
                    }
                });

                setBannerConfig(mergedConfig);
            } else {
                setBannerConfig(INITIAL_CONFIG);
            }

            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setTemplateMappings(parsed.templateMappings || {});
                setSavedBanners(parsed.savedBanners || []);
                console.log('[Ads-AI] Mappings chargés depuis localStorage');
            }
        } catch (e) {
            console.warn('[Ads-AI] Erreur chargement localStorage:', e);
            setBannerConfig(INITIAL_CONFIG);
        }
    }, []);

    // Sauvegarder dans localStorage à chaque changement
    useEffect(() => {
        try {
            const data = {
                templateMappings,
                savedBanners,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('[Ads-AI] Erreur sauvegarde localStorage:', e);
        }
    }, [templateMappings, savedBanners]);

    // Obtenir le mapping actuel pour le template sélectionné
    const mapping = selectedTemplate
        ? (templateMappings[selectedTemplate.id] || {})
        : {};

    // Mettre à jour une liaison pour le template actuel
    const updateMapping = useCallback((zoneName, columnKey) => {
        if (!selectedTemplate) return;

        setTemplateMappings(prev => ({
            ...prev,
            [selectedTemplate.id]: {
                ...(prev[selectedTemplate.id] || {}),
                [zoneName]: columnKey
            }
        }));
    }, [selectedTemplate]);

    // Supprimer une liaison pour le template actuel
    const removeMapping = useCallback((zoneName) => {
        if (!selectedTemplate) return;

        setTemplateMappings(prev => {
            const templateMapping = { ...(prev[selectedTemplate.id] || {}) };
            delete templateMapping[zoneName];
            return {
                ...prev,
                [selectedTemplate.id]: templateMapping
            };
        });
    }, [selectedTemplate]);

    // Réinitialiser le mapping du template actuel
    const resetMapping = useCallback(() => {
        if (!selectedTemplate) return;

        setTemplateMappings(prev => ({
            ...prev,
            [selectedTemplate.id]: {}
        }));
        setActiveZone(null);
    }, [selectedTemplate]);

    // Sauvegarder la configuration dans la DB + localStorage
    const saveConfiguration = useCallback(async () => {
        if (!selectedTemplate) return null;

        setIsSaving(true);
        setSaveError(null);

        const config = {
            id: crypto.randomUUID(),
            template_id: selectedTemplate.id,
            template_file: selectedTemplate.file,
            template_name: selectedTemplate.name,
            template_size: selectedTemplate.size,
            config_json: { ...mapping },
            created_at: new Date().toISOString()
        };

        // Mettre à jour le state local
        setSavedBanners(prev => {
            const existingIndex = prev.findIndex(b => b.template_id === selectedTemplate.id);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = config;
                return updated;
            }
            return [...prev, config];
        });

        // Sauvegarde locale effectuée
        console.log('[Ads-AI] Configuration sauvegardée localement:', config.id);

        setIsSaving(false);
        return config;
    }, [selectedTemplate, mapping]);

    // Charger une configuration sauvegardée
    const loadConfiguration = useCallback((config) => {
        if (config && config.config_json && config.template_id) {
            setTemplateMappings(prev => ({
                ...prev,
                [config.template_id]: config.config_json
            }));
        }
    }, []);

    // Obtenir le mapping d'un template spécifique
    const getTemplateMapping = useCallback((templateId) => {
        return templateMappings[templateId] || {};
    }, [templateMappings]);

    // Obtenir la valeur mappée pour une zone
    const getMappedValue = useCallback((zoneName) => {
        const columnKey = mapping[zoneName];
        if (!columnKey || !previewData[columnKey]) return null;
        return previewData[columnKey];
    }, [mapping, previewData]);

    // Exporter toutes les configurations
    const exportAllConfigurations = useCallback(() => {
        return {
            version: '1.0.0',
            exportedAt: new Date().toISOString(),
            templateMappings,
            savedBanners
        };
    }, [templateMappings, savedBanners]);

    // Importer des configurations
    const importConfigurations = useCallback((data) => {
        if (data.templateMappings) {
            setTemplateMappings(prev => ({ ...prev, ...data.templateMappings }));
        }
        if (data.savedBanners) {
            setSavedBanners(prev => {
                const merged = [...prev];
                data.savedBanners.forEach(config => {
                    const existingIndex = merged.findIndex(b => b.template_id === config.template_id);
                    if (existingIndex >= 0) {
                        merged[existingIndex] = config;
                    } else {
                        merged.push(config);
                    }
                });
                return merged;
            });
        }
    }, []);

    // Add Template to Config
    const addTemplateToConfig = useCallback((newTemplate) => {
        setBannerConfig(prev => {
            const newConfig = { ...prev };
            const category = newTemplate.category || 'Custom';

            // Format category key (lowercase)
            const catKey = category.toLowerCase();

            if (!newConfig.categories[catKey]) {
                newConfig.categories[catKey] = {
                    name: category.charAt(0).toUpperCase() + category.slice(1),
                    icon: 'Layout',
                    templates: []
                };
            }

            // Check if template already exists (avoid duplicates)
            const existingIndex = newConfig.categories[catKey].templates.findIndex(
                t => t.id === newTemplate.id || t.file === newTemplate.file
            );

            if (existingIndex >= 0) {
                // Update existing template
                newConfig.categories[catKey].templates[existingIndex] = newTemplate;
            } else {
                // Add new template
                newConfig.categories[catKey].templates.push(newTemplate);
            }

            // Save to LocalStorage
            localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));

            return newConfig;
        });
    }, []);

    // Delete Template from Config
    const deleteTemplateFromConfig = useCallback((templateId) => {
        setBannerConfig(prev => {
            const newConfig = { ...prev };
            Object.keys(newConfig.categories).forEach(catKey => {
                newConfig.categories[catKey].templates = newConfig.categories[catKey].templates.filter(t => t.id !== templateId);
            });
            localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
            return newConfig;
        });
    }, []);

    const value = {
        // State
        selectedTemplate,
        mapping,
        templateMappings,
        activeZone,
        editMode,
        savedBanners,
        previewData,
        isSaving,
        saveError,
        isCodeEditorOpen,
        editorCode,
        bannerConfig, // Export config

        // Setters
        setSelectedTemplate,
        setActiveZone,
        setEditMode,
        setPreviewData,
        setIsCodeEditorOpen,
        setEditorCode,

        // Actions
        updateMapping,
        removeMapping,
        resetMapping,
        saveConfiguration,
        loadConfiguration,
        getMappedValue,
        getTemplateMapping,
        exportAllConfigurations,
        importConfigurations,
        addTemplateToConfig,
        deleteTemplateFromConfig,

        // Constants
        DB_COLUMNS
    };

    return (
        <MappingContext.Provider value={value}>
            {children}
        </MappingContext.Provider>
    );
};

// Hook personnalisé pour utiliser le contexte
export const useMapping = () => {
    const context = useContext(MappingContext);
    if (!context) {
        throw new Error('useMapping must be used within a MappingProvider');
    }
    return context;
};

export default MappingContext;
