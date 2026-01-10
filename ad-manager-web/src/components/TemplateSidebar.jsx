import React, { useState } from 'react';
import { useMapping } from '../context/MappingContext';
import { useTheme } from '../context/ThemeContext';
import { Layout, ChevronRight, Layers, ChevronDown, Smartphone, Monitor, LayoutGrid, Plus, Sparkles, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const TemplateSidebar = () => {
    const {
        selectedTemplate,
        setSelectedTemplate,
        resetMapping,
        setIsCodeEditorOpen,
        setEditorCode,
        bannerConfig,
        deleteTemplateFromConfig
    } = useMapping();
    const { theme } = useTheme();
    const [expandedCategories, setExpandedCategories] = useState([]);

    const handleSelectTemplate = (template, categoryKey) => {
        if (selectedTemplate?.id !== template.id) {
            resetMapping();
        }
        // Add categoryKey to template for editor
        setSelectedTemplate({ ...template, categoryKey });
        setIsCodeEditorOpen(false); // Switch back to preview
    };

    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = Object.entries(bannerConfig.categories).reduce((acc, [key, cat]) => {
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
            prev.includes(categoryKey) ? [] : [categoryKey]
        );
    };

    const handleDeleteTemplate = async (template, e) => {
        e.stopPropagation();
        if (!confirm(`Voulez-vous vraiment supprimer le template "${template.name}" ?`)) return;

        try {
            const fileId = template.file;

            const response = await fetch(`${API_URL}/banners/template/${fileId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                deleteTemplateFromConfig(template.id);
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
        setSelectedTemplate(null);
        setEditorCode('');
        setIsCodeEditorOpen(true);
    };


    const totalTemplates = Object.values(filteredCategories)
        .reduce((acc, cat) => acc + cat.templates.length, 0);

    const categoryGradients = {
        leaderboard: 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20',
        rectangle: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20',
        skyscraper: 'bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-orange-500/20',
        halfpage: 'bg-gradient-to-r from-rose-500/10 to-pink-500/10 border-rose-500/20',
        mobile: 'bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border-indigo-500/20',
        'multi-product': 'bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border-purple-500/20',
        fashion: 'bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-pink-500/20',
    };

    const categoryListGradients = {
        leaderboard: 'bg-blue-500/5 border-blue-500/10',
        rectangle: 'bg-emerald-500/5 border-emerald-500/10',
        skyscraper: 'bg-orange-500/5 border-orange-500/10',
        halfpage: 'bg-rose-500/5 border-rose-500/10',
        mobile: 'bg-indigo-500/5 border-indigo-500/10',
        'multi-product': 'bg-purple-500/5 border-purple-500/10',
        fashion: 'bg-pink-500/5 border-pink-500/10',
    };

    return (
        <div className={`h-full flex flex-col ${theme.sidebar} border-r ${theme.border}`}>
            {/* Header */}
            <div className={`p-4 border-b ${theme.border}`}>
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Layers size={16} className="text-white" />
                    </div>
                    <h1 className={`text-lg font-black ${theme.text} uppercase tracking-tight`}>
                        Templates
                    </h1>
                </div>
                <div className="mt-2 relative">
                    <input
                        type="text"
                        placeholder="Rechercher une bannière..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full ${theme.input} border ${theme.border} rounded-lg px-3 py-2 text-xs ${theme.text} placeholder-opacity-50 focus:outline-none focus:border-purple-500/50`}
                    />
                </div>
                <p className={`opacity-40 text-[10px] mt-2 flex justify-between ${theme.text}`}>
                    <span>{totalTemplates} modèles trouvés</span>
                </p>
                <button
                    onClick={handleNewTemplateClick}
                    className="mt-3 w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                    <Plus size={14} />
                    Nouveau Template
                </button>
            </div>

            {/* Categories List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {Object.entries(filteredCategories).map(([categoryKey, category]) => {
                    const isExpanded = expandedCategories.includes(categoryKey) || searchTerm.length > 0;
                    const icons = { Layout, ChevronRight, Layers, ChevronDown, Smartphone, Monitor, LayoutGrid, Plus, Sparkles, Trash2 };
                    const Icon = icons[category.icon] || Layout;
                    const gradientClass = categoryGradients[categoryKey] || 'bg-gradient-to-r from-gray-500/10 to-slate-500/10 border-gray-500/20';
                    const listGradientClass = categoryListGradients[categoryKey] || 'bg-gray-500/5 border-gray-500/10';

                    const selectedGradients = {
                        leaderboard: 'from-blue-500/20 to-cyan-500/20 border-blue-500/50',
                        rectangle: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/50',
                        skyscraper: 'from-orange-500/20 to-amber-500/20 border-orange-500/50',
                        halfpage: 'from-rose-500/20 to-pink-500/20 border-rose-500/50',
                        mobile: 'from-indigo-500/20 to-blue-500/20 border-indigo-500/50',
                        'multi-product': 'from-purple-500/20 to-fuchsia-500/20 border-purple-500/50',
                        fashion: 'from-pink-500/20 to-rose-500/20 border-pink-500/50',
                    };

                    const selectedClass = selectedGradients[categoryKey] || 'from-purple-500/20 to-pink-500/20 border-purple-500/50';

                    return (
                        <div key={categoryKey} className="rounded-xl overflow-hidden">
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory(categoryKey)}
                                className={`w-full flex items-center justify-between p-3 ${theme.hover} transition-all rounded-xl border ${gradientClass}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 ${theme.accentBg}/20 rounded-lg flex items-center justify-center`}>
                                        <Icon size={16} className={theme.accent} />
                                    </div>
                                    <div className="text-left">
                                        <div className={`font-bold text-sm ${theme.text}`}>{category.name}</div>
                                        <div className={`opacity-40 text-[10px] ${theme.text}`}>{category.templates.length} templates</div>
                                    </div>
                                </div>
                                <ChevronDown
                                    size={16}
                                    className={`opacity-40 transition-transform ${isExpanded ? 'rotate-180' : ''} ${theme.text}`}
                                />
                            </button>

                            {/* Templates List */}
                            {isExpanded && (
                                <div className={`mt-1 py-1 space-y-1 pl-2 pr-1 animate-fade-in rounded-xl border ${listGradientClass}`}>
                                    {category.templates.map((template) => {
                                        const isSelected = selectedTemplate?.id === template.id;
                                        return (
                                            <button
                                                key={template.id}
                                                onClick={() => handleSelectTemplate(template, categoryKey)}
                                                className={`w-full text-left p-3 rounded-xl border transition-all group ${isSelected
                                                    ? `bg-gradient-to-r ${selectedClass} shadow-lg`
                                                    : `bg-transparent border-transparent ${theme.hover}`
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className={`font-bold text-xs ${isSelected ? theme.text : theme.text + ' opacity-80'}`}>
                                                        {template.name}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] ${theme.accent} font-mono ${theme.accentBg}/20 px-2 py-0.5 rounded`}>
                                                            {template.size}
                                                        </span>
                                                        <button
                                                            onClick={(e) => handleDeleteTemplate(template, e)}
                                                            className={`opacity-20 hover:opacity-100 hover:text-red-500 transition-colors p-1 ${theme.text}`}
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className={`opacity-40 text-[10px] leading-relaxed ${theme.text}`}>
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
            <div className={`p-4 border-t ${theme.border} opacity-20`}>
                <div className={`text-xs text-center ${theme.text}`}>
                    📁 ad-manager-banner
                </div>
            </div>
        </div>
    );
};

export default TemplateSidebar;
