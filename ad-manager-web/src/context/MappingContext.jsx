import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Liste des colonnes disponibles dans la DB
export const DB_COLUMNS = [
    { key: 'name', label: 'Nom du Produit', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'category', label: 'Catégorie', type: 'text' },
    { key: 'supplier', label: 'Fournisseur', type: 'text' },
    { key: 'price', label: 'Prix (€)', type: 'value' },
    { key: 'supplierPrice', label: 'Prix Fournisseur (€)', type: 'value' },
    { key: 'margin', label: 'Marge (%)', type: 'value' },
    { key: 'stock', label: 'Stock', type: 'value' },
    { key: 'imageUrl', label: 'Image Principale', type: 'media' },
    { key: 'images', label: 'Galerie Images', type: 'media' },
    { key: 'isPromo', label: 'En Promotion', type: 'logic' },
    { key: 'promoExpiry', label: 'Fin de Promo', type: 'logic' },
    { key: 'sourceUrl', label: 'Lien Produit', type: 'link' }
];

// Clé localStorage pour persister les mappings
const STORAGE_KEY = 'ads-ai-banner-mappings';
const API_URL = 'http://localhost:3001/api';

// Création du contexte
const MappingContext = createContext(null);

export const MappingProvider = ({ children }) => {
    // Template sélectionné
    const [selectedTemplate, setSelectedTemplate] = useState(null);

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
        price: 79.99,
        supplierPrice: 45.00,
        margin: 43.7,
        stock: 150,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        images: [],
        isPromo: true,
        promoExpiry: '2026-01-15',
        sourceUrl: 'https://amazon.fr/dp/B09XYZ123'
    });

    // Charger les mappings depuis localStorage au démarrage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setTemplateMappings(parsed.templateMappings || {});
                setSavedBanners(parsed.savedBanners || []);
                console.log('[Ads-AI] Mappings chargés depuis localStorage');
            }
        } catch (e) {
            console.warn('[Ads-AI] Erreur chargement localStorage:', e);
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

        // Essayer de sauvegarder en DB via l'API
        try {
            const response = await fetch(`${API_URL}/banners/config`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            if (response.ok) {
                console.log('[Ads-AI] Configuration sauvegardée en DB:', config.id);
            } else {
                console.warn('[Ads-AI] API non disponible, sauvegarde locale uniquement');
            }
        } catch (e) {
            console.warn('[Ads-AI] Sauvegarde API échouée, localStorage utilisé:', e.message);
        }

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
        isSaving,
        saveError,
        isCodeEditorOpen,
        editorCode,

        // Setters
        setSelectedTemplate,
        setActiveZone,
        setEditMode,
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
