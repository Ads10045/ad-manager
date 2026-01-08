import React, { useState, useEffect } from 'react';
import { useMapping } from '../context/MappingContext';
import { Layout, ChevronRight, Layers, ChevronDown, Smartphone, Monitor, LayoutGrid } from 'lucide-react';

// Configuration des templates depuis ad-manager-banner
const BANNER_CONFIG = {
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
        }
    }
};

/**
 * TemplateSidebar - Liste des templates organisés par catégories
 */
const TemplateSidebar = () => {
    const { selectedTemplate, setSelectedTemplate, resetMapping } = useMapping();
    const [expandedCategories, setExpandedCategories] = useState(['leaderboard', 'rectangle']);

    const handleSelectTemplate = (template) => {
        if (selectedTemplate?.id !== template.id) {
            resetMapping();
        }
        setSelectedTemplate(template);
    };

    const toggleCategory = (categoryKey) => {
        setExpandedCategories(prev =>
            prev.includes(categoryKey)
                ? prev.filter(c => c !== categoryKey)
                : [...prev, categoryKey]
        );
    };

    const totalTemplates = Object.values(BANNER_CONFIG.categories)
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
                <p className="text-white/40 text-xs">
                    {totalTemplates} modèles en {Object.keys(BANNER_CONFIG.categories).length} catégories
                </p>
            </div>

            {/* Categories List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {Object.entries(BANNER_CONFIG.categories).map(([categoryKey, category]) => {
                    const isExpanded = expandedCategories.includes(categoryKey);
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
                                                    <span className="text-[10px] text-purple-400 font-mono bg-purple-500/20 px-2 py-0.5 rounded">
                                                        {template.size}
                                                    </span>
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
