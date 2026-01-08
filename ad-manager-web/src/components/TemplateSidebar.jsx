import React, { useState, useEffect } from 'react';
import { useMapping } from '../context/MappingContext';
import { Layout, ChevronRight, Layers, ChevronDown, Smartphone, Monitor, LayoutGrid, Plus, Sparkles } from 'lucide-react';

// Configuration des templates depuis ad-manager-banner
// TODO: Fetch this from API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
    const { selectedTemplate, setSelectedTemplate, resetMapping } = useMapping();
    const [expandedCategories, setExpandedCategories] = useState(['leaderboard', 'rectangle']);

    const handleSelectTemplate = (template) => {
        if (selectedTemplate?.id !== template.id) {
            resetMapping();
        }
        setSelectedTemplate(template);
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

    const handleCreateTemplate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const category = formData.get('category');
        const size = formData.get('size');
        const htmlContent = formData.get('htmlContent');

        try {
            const response = await fetch(`${API_URL}/banners/template`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, category, size, htmlContent })
            });

            if (response.ok) {
                const newTemplate = await response.json();

                // Update local config state to show new template immediately
                setLocalConfig(prev => {
                    const newConfig = { ...prev };
                    if (!newConfig.categories[category]) {
                        // Create category if not exists (simplified fallback)
                        newConfig.categories[category] = {
                            name: category.charAt(0).toUpperCase() + category.slice(1),
                            templates: []
                        };
                    }
                    newConfig.categories[category].templates.push(newTemplate);
                    return newConfig;
                });

                // Close modal
                document.getElementById('new-template-modal').close();

                // Show success link
                alert(`Template créé avec succès !\nFichier : ${newTemplate.file}`);

                // Select it
                handleSelectTemplate(newTemplate);
            } else {
                alert("Erreur lors de la création");
            }
        } catch (err) {
            console.error(err);
            alert("Erreur réseau");
        }
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
                <p className="text-white/40 text-xs">
                    {totalTemplates} modèles en {Object.keys(BANNER_CONFIG.categories).length} catégories
                </p>
                <button
                    onClick={() => document.getElementById('new-template-modal').showModal()}
                    className="mt-3 w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                    <Plus size={14} />
                    Nouveau Template
                </button>
            </div>

            <dialog id="new-template-modal" className="bg-[#1a1a1a] text-white p-6 rounded-xl border border-white/10 backdrop-blur-xl shadow-2xl w-96">
                <h3 className="text-lg font-bold mb-4">Créer un nouveau template</h3>
                <form method="dialog" className="space-y-4" onSubmit={async (e) => {
                    e.preventDefault();
                    // Basic creation logic handled via context or prop would be better, but for now we dispatch an event or similar
                    // Actually, we can't easily write files from browser to disk directly.
                    // But we can prompt the agent to do it via tool call? No, the user wants the UI to do it.
                    // Since this is a dev tool running locally, we CAN simply use an API endpoint to create the file if available.
                    // Or more simply, since we are an Agent, we are adding the UI features.

                    // Let's implement a 'createTemplate' function in MappingContext that calls the API.
                    // For now, close modal.
                    const formData = new FormData(e.target);
                    const name = formData.get('name');
                    const category = formData.get('category');
                    const size = formData.get('size');

                    try {
                        // Assuming new API endpoint exists or logic is handled
                        window.dispatchEvent(new CustomEvent('create-template', { detail: { name, category, size } }));
                        e.target.closest('dialog').close();
                    } catch (err) {
                        console.error(err);
                    }
                }}>
                    <div>
                        <label className="block text-xs font-bold text-white/60 mb-1">Nom du template</label>
                        <input name="name" required className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm" placeholder="Ex: Promo Speciale" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/60 mb-1">Catégorie</label>
                        <select name="category" className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm">
                            {Object.entries(BANNER_CONFIG.categories).map(([k, c]) => (
                                <option key={k} value={k}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/60 mb-1">Taille</label>
                        <select name="size" className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm">
                            <option value="300x250">Pavé (300x250)</option>
                            <option value="728x90">Leaderboard (728x90)</option>
                            <option value="160x600">Skyscraper (160x600)</option>
                            <option value="300x600">Half Page (300x600)</option>
                            <option value="320x50">Mobile (320x50)</option>
                        </select>
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => document.getElementById('new-template-modal').close()} className="px-3 py-2 text-xs font-bold text-white/50 hover:text-white">Annuler</button>
                        <button type="submit" className="px-4 py-2 bg-purple-500 rounded-lg text-xs font-bold">Créer</button>
                    </div>
                </form>
            </dialog>

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
