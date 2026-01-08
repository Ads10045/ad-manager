import React, { useState, useEffect } from 'react';
import { useMapping } from '../context/MappingContext';
import { Layout, ChevronRight, Layers, ChevronDown, Smartphone, Monitor, LayoutGrid, Plus, Sparkles, Trash2 } from 'lucide-react';

// Configuration des templates depuis ad-manager-banner
// TODO: Fetch this from API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const BANNER_CONFIG = {
    categories: {
        leaderboard: {
            name: "Leaderboard",
            icon: Monitor,
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
                }
            ]
        },
        rectangle: {
            name: "Rectangle",
            icon: LayoutGrid,
            description: "Bannières moyennes format carré",
            templates: [
                {
                    id: "banner-type-b-300x250",
                    name: "Promotionnel",
                    file: "rectangle/BannerTypeB-300x250.html",
                    size: "300x250",
                    description: "Design promo avec focus sur le prix",
                    fields: ["imageUrl", "name", "description", "price", "supplierPrice", "sourceUrl"]
                }
            ]
        },
        skyscraper: {
            name: "Skyscraper",
            icon: Layout,
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
            icon: Layout,
            description: "Bannières demi-page",
            templates: [
                {
                    id: "banner-type-d-300x600",
                    name: "Premium",
                    file: "halfpage/BannerTypeD-300x600.html",
                    size: "300x600",
                    description: "Design premium avec stats",
                    fields: ["imageUrl", "name", "description", "category", "stock", "margin", "price", "sourceUrl"]
                }
            ]
        },
        mobile: {
            name: "Mobile",
            icon: Smartphone,
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
                }
            ]
        },
        "multi-product": {
            name: "Multi-Produits",
            icon: Layers,
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
            icon: Sparkles,
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

/**
 * TemplateSidebar - Liste des templates organisés par catégories
 */
const TemplateSidebar = () => {
    const {
        selectedTemplate,
        setSelectedTemplate,
        resetMapping,
        setIsCodeEditorOpen,
        setEditorCode
    } = useMapping();
    const [expandedCategories, setExpandedCategories] = useState(['leaderboard', 'rectangle']);

    const handleSelectTemplate = (template) => {
        if (selectedTemplate?.id !== template.id) {
            resetMapping();
        }
        setSelectedTemplate(template);
        setIsCodeEditorOpen(false); // Switch back to preview
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [localConfig, setLocalConfig] = useState(BANNER_CONFIG);

    // Filter templates based on search
    const filteredCategories = Object.entries(localConfig.categories).reduce((acc, [key, cat]) => {
        const matchesCat = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchedTemplates = cat.templates.filter(t =>
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.id.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (matchesCat || matchedTemplates.length > 0) {
            acc[key] = {
                ...cat,
                templates: matchesCat ? cat.templates : matchedTemplates
            };
        }
        return acc;
    }, {});

    const toggleCategory = (categoryKey) => {
        setExpandedCategories(prev =>
            prev.includes(categoryKey)
                ? prev.filter(c => c !== categoryKey)
                : [...prev, categoryKey]
        );
    };

    const handleDeleteTemplate = async (template, e) => {
        e.stopPropagation();
        if (!confirm(`Voulez-vous vraiment supprimer le template "${template.name}" ?`)) return;

        try {
            // Identifier is actually path or ID, but here ID is like 'banner-type-a...' which assumes a file?
            // Actually config doesn't store file ID well for deletion unless we use the 'file' property.
            // But API expects ID (filename without ext or relative path).
            // Let's pass the relative path (file) which is unique.
            const fileId = template.file; // e.g., "fashion/black-friday..."

            const response = await fetch(`${API_URL}/banners/template/${fileId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Update local state
                setLocalConfig(prev => {
                    const newConfig = { ...prev };
                    Object.keys(newConfig.categories).forEach(catKey => {
                        newConfig.categories[catKey].templates = newConfig.categories[catKey].templates.filter(t => t.id !== template.id);
                    });
                    // Remove empty categories?
                    return newConfig;
                });
                alert("Template supprimé");
                if (selectedTemplate?.id === template.id) setSelectedTemplate(null);
            } else {
                alert("Erreur lors de la suppression");
            }
        } catch (err) {
            console.error(err);
            alert("Erreur réseau");
        }
    };

    const handleNewTemplateClick = () => {
        // Instead of modal, open Editor Mode with empty state
        setSelectedTemplate(null); // Deselect current
        setEditorCode(''); // Empty code
        setIsCodeEditorOpen(true); // Open tab
    };

    const totalTemplates = Object.values(filteredCategories)
        .reduce((acc, cat) => acc + cat.templates.length, 0);

    return (
        <div className="h-full flex flex-col bg-black/30 border-r border-white/10">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Layers size={16} className="text-white" />
                    </div>
                    <h1 className="text-lg font-black text-white uppercase tracking-tight">
                        Templates
                    </h1>
                </div>
                <div className="mt-2 relative">
                    <input
                        type="text"
                        placeholder="Rechercher une bannière..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                    />
                </div>
                <p className="text-white/40 text-[10px] mt-2 flex justify-between">
                    <span>{totalTemplates} modèles trouvés</span>
                </p>
                <button
                    onClick={handleNewTemplateClick}
                    className="mt-3 w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                    <Plus size={14} />
                    Nouveau Template (Éditeur)
                </button>
            </div>

            {/* Modal removed - now using Editor Tab */}

            {/* Categories List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {Object.entries(filteredCategories).map(([categoryKey, category]) => {
                    const isExpanded = expandedCategories.includes(categoryKey) || searchTerm.length > 0;
                    const Icon = category.icon || Layout;

                    return (
                        <div key={categoryKey} className="rounded-xl overflow-hidden">
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory(categoryKey)}
                                className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-all rounded-xl border border-white/5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                        <Icon size={16} className="text-purple-400" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-white font-bold text-sm">{category.name}</div>
                                        <div className="text-white/40 text-[10px]">{category.templates.length} templates</div>
                                    </div>
                                </div>
                                <ChevronDown
                                    size={16}
                                    className={`text-white/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {/* Templates List */}
                            {isExpanded && (
                                <div className="mt-1 space-y-1 pl-4 animate-fade-in">
                                    {category.templates.map((template) => {
                                        const isSelected = selectedTemplate?.id === template.id;
                                        return (
                                            <button
                                                key={template.id}
                                                onClick={() => handleSelectTemplate(template)}
                                                className={`w-full text-left p-3 rounded-xl border transition-all group ${isSelected
                                                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50 shadow-lg'
                                                    : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-white/80'}`}>
                                                        {template.name}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-purple-400 font-mono bg-purple-500/20 px-2 py-0.5 rounded">
                                                            {template.size}
                                                        </span>
                                                        <button
                                                            onClick={(e) => handleDeleteTemplate(template, e)}
                                                            className="text-white/20 hover:text-red-500 transition-colors p-1"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-white/40 text-[10px] leading-relaxed">
                                                    {template.description}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="text-white/30 text-xs text-center">
                    📁 ad-manager-banner
                </div>
            </div>
        </div>
    );
};

export default TemplateSidebar;
