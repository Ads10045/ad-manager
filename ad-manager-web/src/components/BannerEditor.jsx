import React, { useState, useEffect } from 'react';
import { useMapping } from '../context/MappingContext';
import { Save, AlertCircle, Eye, Code, RefreshCw, ChevronDown } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const TEMPLATE_BASE_URL = `${API_URL}/banners/template`;

/**
 * BannerEditor - Éditeur et créateur de bannières avec prévisualisation
 */
const BannerEditor = ({ config }) => {
    const {
        isCodeEditorOpen,
        editorCode,
        setEditorCode,
        selectedTemplate,
        setSelectedTemplate,
        setIsCodeEditorOpen,
        addTemplateToConfig,
        bannerConfig,
        previewData
    } = useMapping();

    // States
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [size, setSize] = useState('300x250');
    const [saveStatus, setSaveStatus] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // true if editing existing banner
    const [activeTab, setActiveTab] = useState('code'); // 'code' or 'preview'
    const [loading, setLoading] = useState(false);
    const [bannerSelectorOpen, setBannerSelectorOpen] = useState(false);

    // Get all templates for selector
    const allTemplates = React.useMemo(() => {
        if (!bannerConfig?.categories) return [];
        return Object.entries(bannerConfig.categories).flatMap(([catKey, cat]) =>
            cat.templates.map(t => ({ ...t, categoryKey: catKey, categoryName: cat.name }))
        );
    }, [bannerConfig]);

    const categories = config?.categories ? Object.keys(config.categories) : [];

    // Load template content when editing existing
    useEffect(() => {
        if (selectedTemplate && isCodeEditorOpen) {
            loadTemplateContent(selectedTemplate);
        }
    }, [selectedTemplate?.file, isCodeEditorOpen]);

    // Load template HTML content
    const loadTemplateContent = async (template) => {
        if (!template?.file) return;

        setLoading(true);
        try {
            const response = await fetch(`${TEMPLATE_BASE_URL}/${template.file}`);
            if (response.ok) {
                const html = await response.text();
                setEditorCode(html);
                setName(template.name || '');
                setCategory(template.categoryKey || template.category || '');
                setSize(template.size || '300x250');
                setIsEditing(true);
            }
        } catch (err) {
            console.error('Error loading template:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle template selection from dropdown
    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template);
        loadTemplateContent(template);
        setBannerSelectorOpen(false);
    };

    // Render preview HTML with data injection
    const getPreviewHtml = () => {
        if (!editorCode) return '';

        let html = editorCode;

        // Inject preview data
        Object.entries(previewData || {}).forEach(([key, value]) => {
            const regex = new RegExp(`\\[${key}\\]`, 'gi');
            html = html.replace(regex, String(value));
        });

        return html;
    };

    // Save handler
    const handleSave = async () => {
        if (!name || !category || !editorCode) {
            alert("Veuillez remplir tous les champs obligatoires (Nom, Catégorie, Code)");
            return;
        }

        try {
            const endpoint = isEditing && selectedTemplate?.file
                ? `${API_URL}/banners/template/${selectedTemplate.file}`
                : `${API_URL}/banners/template`;

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, category, size, htmlContent: editorCode })
            });

            if (response.ok) {
                const savedTemplate = await response.json();
                setSaveStatus('success');

                if (!isEditing) {
                    addTemplateToConfig(savedTemplate);
                }

                alert(`Template ${isEditing ? 'modifié' : 'créé'}: ${savedTemplate.file || name}`);
                setIsCodeEditorOpen(false);
                setSelectedTemplate(savedTemplate);
            } else {
                setSaveStatus('error');
                alert("Erreur lors de la sauvegarde");
            }
        } catch (e) {
            console.error(e);
            setSaveStatus('error');
            alert("Erreur: " + e.message);
        }
    };

    // Reset for new template
    const handleNewTemplate = () => {
        setEditorCode('');
        setName('');
        setCategory('');
        setSize('300x250');
        setIsEditing(false);
        setSelectedTemplate(null);
    };

    if (!isCodeEditorOpen) return null;

    const [previewWidth, previewHeight] = size.split('x').map(Number);

    return (
        <div className="h-full flex flex-col bg-[#0d0d0d] text-white">
            {/* Top Toolbar */}
            <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-black/40">
                {/* Left: Template Selector + Fields */}
                <div className="flex items-center gap-4">
                    {/* Banner Selector Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setBannerSelectorOpen(!bannerSelectorOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs hover:bg-white/10"
                        >
                            <span className="text-white/60">Bannière:</span>
                            <span className="font-bold text-purple-400">
                                {selectedTemplate?.name || 'Nouvelle'}
                            </span>
                            <ChevronDown size={14} className="text-white/40" />
                        </button>

                        {bannerSelectorOpen && (
                            <div className="absolute top-full left-0 mt-1 w-80 max-h-96 overflow-y-auto bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50">
                                <div
                                    onClick={handleNewTemplate}
                                    className="p-3 border-b border-white/10 hover:bg-purple-500/20 cursor-pointer flex items-center gap-2"
                                >
                                    <span className="text-lg">➕</span>
                                    <span className="text-sm font-bold">Nouvelle Bannière</span>
                                </div>
                                {Object.entries(bannerConfig?.categories || {}).map(([catKey, cat]) => (
                                    <div key={catKey}>
                                        <div className="px-3 py-2 text-xs font-bold text-white/40 uppercase bg-black/20">
                                            {cat.name}
                                        </div>
                                        {cat.templates.map(t => (
                                            <div
                                                key={t.id}
                                                onClick={() => handleSelectTemplate({ ...t, categoryKey: catKey })}
                                                className={`p-3 hover:bg-white/5 cursor-pointer flex justify-between items-center ${selectedTemplate?.id === t.id ? 'bg-purple-500/20' : ''
                                                    }`}
                                            >
                                                <span className="text-sm">{t.name}</span>
                                                <span className="text-xs text-purple-400 font-mono">{t.size}</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="h-6 w-px bg-white/10" />

                    <input
                        className="bg-transparent border-b border-white/20 focus:border-purple-500 outline-none text-sm font-bold w-40"
                        placeholder="Nom du Template"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        list="category-suggestions"
                        className="bg-transparent border-b border-white/20 focus:border-purple-500 outline-none text-xs w-28"
                        placeholder="Catégorie..."
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    />
                    <datalist id="category-suggestions">
                        {categories.map(cat => <option key={cat} value={cat} />)}
                    </datalist>
                    <select
                        value={size}
                        onChange={e => setSize(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded text-xs px-2 py-1"
                    >
                        <option value="300x250">300x250</option>
                        <option value="728x90">728x90</option>
                        <option value="970x250">970x250</option>
                        <option value="160x600">160x600</option>
                        <option value="300x600">300x600</option>
                        <option value="320x50">320x50</option>
                        <option value="320x100">320x100</option>
                    </select>
                </div>

                {/* Right: Tabs + Actions */}
                <div className="flex items-center gap-4">
                    {/* View Tabs */}
                    <div className="flex bg-white/5 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('code')}
                            className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-bold transition-all ${activeTab === 'code' ? 'bg-purple-500 text-white' : 'text-white/50 hover:text-white'
                                }`}
                        >
                            <Code size={12} />
                            Code
                        </button>
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-purple-500 text-white' : 'text-white/50 hover:text-white'
                                }`}
                        >
                            <Eye size={12} />
                            Aperçu
                        </button>
                    </div>

                    <div className="h-6 w-px bg-white/10" />

                    <button
                        onClick={() => setIsCodeEditorOpen(false)}
                        className="px-3 py-1.5 text-xs font-bold text-white/50 hover:text-white"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 rounded-lg text-xs font-bold"
                    >
                        <Save size={14} />
                        {isEditing ? 'Modifier' : 'Créer'}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <RefreshCw className="animate-spin text-purple-500" size={32} />
                    </div>
                ) : activeTab === 'code' ? (
                    /* Code Editor */
                    <div className="flex-1 flex flex-col">
                        <textarea
                            className="flex-1 w-full bg-[#1e1e1e] text-white/80 font-mono text-xs p-4 resize-none focus:outline-none"
                            value={editorCode}
                            onChange={e => setEditorCode(e.target.value)}
                            placeholder="<!-- Collez votre code HTML ici -->"
                            spellCheck="false"
                        />
                        <div className="h-8 bg-purple-500/10 text-purple-300 text-[10px] flex items-center px-4 gap-2">
                            <AlertCircle size={10} />
                            Placeholders: [name], [price], [imageUrl], [category], [margin], [sourceUrl]
                        </div>
                    </div>
                ) : (
                    /* Preview */
                    <div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)] overflow-auto">
                        <div
                            className="relative"
                            style={{
                                boxShadow: '0 25px 50px -12px rgba(168, 85, 247, 0.25)',
                            }}
                        >
                            <div
                                dangerouslySetInnerHTML={{ __html: getPreviewHtml() }}
                                style={{
                                    width: `${previewWidth}px`,
                                    height: `${previewHeight}px`,
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Status Bar */}
            <div className="h-6 bg-black/40 border-t border-white/5 flex items-center justify-between px-4 text-[10px] text-white/40">
                <span>
                    {isEditing ? `📝 Édition: ${selectedTemplate?.file}` : '✨ Nouvelle bannière'}
                </span>
                <span>
                    {editorCode.length} caractères • {size}
                </span>
            </div>
        </div>
    );
};

export default BannerEditor;
