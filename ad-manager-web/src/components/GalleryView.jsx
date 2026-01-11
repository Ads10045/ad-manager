import React, { useState } from 'react';
import { useMapping } from '../context/MappingContext';
import { useTheme } from '../context/ThemeContext';
import { Layout, ChevronRight, Layers, Smartphone, Monitor, LayoutGrid, Plus, Trash2, Search, ArrowRight } from 'lucide-react';

const GalleryView = ({ onSelect }) => {
    const { bannerConfig, deleteTemplateFromConfig, setSelectedTemplate, setEditorCode, setIsCodeEditorOpen } = useMapping();
    const { theme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const handleSelectTemplate = (template, categoryKey) => {
        setSelectedTemplate({ ...template, categoryKey });
        setIsCodeEditorOpen(false);
        onSelect();
    };

    const handleNewTemplateClick = () => {
        setSelectedTemplate(null);
        setEditorCode('');
        setIsCodeEditorOpen(true);
        onSelect();
    };

    // Filter logic
    const filteredCategories = Object.entries(bannerConfig.categories).reduce((acc, [key, cat]) => {
        if (selectedCategory !== 'all' && key !== selectedCategory) return acc;

        const matchedTemplates = cat.templates.filter(t =>
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.id.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (matchedTemplates.length > 0 || (searchTerm === '' && selectedCategory === 'all')) {
            acc[key] = {
                ...cat,
                templates: matchedTemplates
            };
        }
        return acc;
    }, {});

    const categoryIcons = {
        'leaderboard': Monitor,
        'rectangle': LayoutGrid,
        'skyscraper': Layout,
        'halfpage': Layout,
        'mobile': Smartphone,
        'multi-product': Layers,
        'fashion': Layout,
        'studio': Layout
    };

    return (
        <div className={`flex flex-col h-full ${theme.bg} ${theme.text} font-sans overflow-hidden p-6`}>
            {/* Search Bar */}
            <div className="max-w-7xl mx-auto w-full mb-8 flex flex-col items-center space-y-6">
                <div className="flex items-center gap-4 justify-center w-full">
                    <div className={`relative w-full max-w-md group`}>
                        <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                        <div className={`relative flex items-center ${theme.card} border ${theme.border} rounded-xl px-4 py-3 shadow-2xl`}>
                            <Search size={18} className="opacity-40 mr-3" />
                            <input
                                type="text"
                                placeholder="Rechercher un template..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full bg-transparent border-none outline-none ${theme.text} placeholder-opacity-40`}
                            />
                        </div>
                    </div>
                </div>

                {/* Categories Filter Pills */}
                <div className="flex flex-wrap gap-2 justify-center">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === 'all'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                            : `${theme.card} border ${theme.border} hover:border-purple-500/50`}`}
                    >
                        Tous
                    </button>
                    {Object.entries(bannerConfig.categories).map(([key, cat]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedCategory(key)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === key
                                ? 'bg-white text-black shadow-lg'
                                : `${theme.card} border ${theme.border} hover:border-white/50`}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4">
                <div className="max-w-7xl mx-auto pb-10">

                    {/* New Template Card */}
                    <div className="mb-8 p-6 rounded-2xl border border-dashed border-gray-500/30 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer group flex items-center justify-center gap-4" onClick={handleNewTemplateClick}>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Plus size={24} className="text-white" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-lg">Créer un nouveau template</h3>
                            <p className="opacity-50 text-sm">Partir de zéro avec l'éditeur HTML</p>
                        </div>
                    </div>

                    {Object.entries(filteredCategories).map(([catKey, category]) => {
                        const Icon = categoryIcons[catKey] || Layout;
                        return (
                            <div key={catKey} className="mb-10">
                                <div className="flex items-center gap-3 mb-4 pl-1">
                                    <div className={`p-2 rounded-lg ${theme.accentBg}/20`}>
                                        <Icon size={20} className={theme.accent} />
                                    </div>
                                    <h2 className="text-xl font-bold">{category.name}</h2>
                                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4"></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {category.templates.map(template => (
                                        <div
                                            key={template.id}
                                            onClick={() => handleSelectTemplate(template, catKey)}
                                            className={`group relative aspect-video ${theme.card} border ${theme.border} rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-purple-500/10 transition-all hover:-translate-y-1`}
                                        >
                                            {/* Preview Placeholder */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-black/50 p-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                                <div className="text-center opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <div className="text-4xl mb-2">🎨</div>
                                                    <div className="font-mono text-xs opacity-70">{template.size}</div>
                                                </div>
                                            </div>

                                            {/* Overlay Content */}
                                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                                                <h3 className="font-bold text-white truncate">{template.name}</h3>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-xs text-white/60 font-mono">{template.size}</span>
                                                    <span className={`p-1 rounded-full bg-white/10 text-white/80 group-hover:bg-purple-500 group-hover:text-white transition-colors`}>
                                                        <ArrowRight size={12} />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default GalleryView;
