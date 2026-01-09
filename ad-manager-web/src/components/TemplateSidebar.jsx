import React, { useState, useEffect } from 'react';
import { useMapping } from '../context/MappingContext';
import { Layout, ChevronRight, Layers, ChevronDown, Smartphone, Monitor, LayoutGrid, Plus, Sparkles, Trash2 } from 'lucide-react';

// Configuration des templates depuis ad-manager-banner
// TODO: Fetch this from API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const FALLBACK_CONFIG = {
    // Empty as fallback, but context should load INITIAL_CONFIG
    categories: {}
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
        setEditorCode,
        bannerConfig,
        deleteTemplateFromConfig
    } = useMapping();
    const [expandedCategories, setExpandedCategories] = useState(['leaderboard', 'rectangle']);

    const handleSelectTemplate = (template, categoryKey) => {
        if (selectedTemplate?.id !== template.id) {
            resetMapping();
        }
        // Add categoryKey to template for editor
        setSelectedTemplate({ ...template, categoryKey });
        setIsCodeEditorOpen(false); // Switch back to preview
    };

    const [searchTerm, setSearchTerm] = useState('');
    // const [localConfig, setLocalConfig] = useState(BANNER_CONFIG); // Use context config instead

    // Filter templates based on search
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
                // Update via separate method
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

                    // Simple icon mapping since we store icons as strings in context now
                    const icons = { Layout, ChevronRight, Layers, ChevronDown, Smartphone, Monitor, LayoutGrid, Plus, Sparkles, Trash2 };
                    const Icon = icons[category.icon] || Layout;

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
                                                onClick={() => handleSelectTemplate(template, categoryKey)}
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
