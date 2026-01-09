import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMapping } from '../context/MappingContext';
import Editor from '@monaco-editor/react';
import AssetLibrary from './AssetLibrary';
import {
    Save, AlertCircle, Eye, Code, RefreshCw, ChevronDown,
    Undo2, Redo2, Copy, Download, Maximize2, Minimize2,
    Image, Type, Palette, Layout, Sparkles, Plus, FolderPlus
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const TEMPLATE_BASE_URL = `${API_URL}/banners/template`;

// Placeholders pour autocomplétion
const PLACEHOLDERS = [
    { label: '[name]', detail: 'Nom du produit' },
    { label: '[price]', detail: 'Prix du produit' },
    { label: '[imageUrl]', detail: 'URL de l\'image' },
    { label: '[category]', detail: 'Catégorie' },
    { label: '[margin]', detail: 'Marge (%)' },
    { label: '[description]', detail: 'Description' },
    { label: '[sourceUrl]', detail: 'Lien vers le produit' },
    { label: '[stock]', detail: 'Stock disponible' },
    { label: '[supplierPrice]', detail: 'Prix fournisseur' },
];

// Templates par défaut pour chaque taille
const getDefaultTemplate = (size) => {
    const [width, height] = size.split('x');

    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=${width}, height=${height}">
    <title>Banner ${size}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .banner-container {
            width: ${width}px;
            height: ${height}px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            align-items: center;
            padding: 16px;
            position: relative;
        }
        
        .product-image {
            width: ${parseInt(height) - 20}px;
            height: ${parseInt(height) - 20}px;
            min-width: 60px;
            border-radius: 10px;
            object-fit: cover;
            flex-shrink: 0;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .content {
            flex: 1;
            padding: 0 16px;
            color: #ffffff;
        }
        
        .product-name {
            font-size: ${parseInt(height) > 100 ? '16px' : '12px'};
            font-weight: 700;
            margin-bottom: 4px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .product-category {
            font-size: ${parseInt(height) > 100 ? '12px' : '10px'};
            opacity: 0.8;
            margin-bottom: 8px;
        }
        
        .price-row {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .price {
            font-size: ${parseInt(height) > 100 ? '24px' : '18px'};
            font-weight: 900;
        }
        
        .margin-badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 700;
        }
        
        .cta-button {
            background: #ffffff;
            color: #764ba2;
            padding: ${parseInt(height) > 100 ? '12px 24px' : '8px 16px'};
            border-radius: 8px;
            font-weight: 700;
            font-size: ${parseInt(height) > 100 ? '14px' : '11px'};
            text-decoration: none;
            flex-shrink: 0;
            transition: all 0.3s ease;
        }
        
        .cta-button:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
    </style>
</head>
<body>
    <div class="banner-container">
        <img src="[imageUrl]" alt="[name]" class="product-image" data-field="imageUrl">
        <div class="content">
            <div class="product-name" data-field="name">[name]</div>
            <div class="product-category" data-field="category">[category]</div>
            <div class="price-row">
                <span class="price" data-field="price">[price]€</span>
                <span class="margin-badge" data-field="margin">+[margin]%</span>
            </div>
        </div>
        <a href="[sourceUrl]" class="cta-button" target="_blank" data-field="sourceUrl">Acheter</a>
    </div>
    
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        $(document).ready(function() {
            // Arrondir la marge
            var marginEl = $('.margin-badge');
            if (marginEl.length) {
                var text = marginEl.text();
                var match = text.match(/([\\d.]+)/);
                if (match) {
                    marginEl.text('+' + Math.round(parseFloat(match[1])) + '%');
                }
            }
            
            // Animation au survol
            $('.banner-container').hover(
                function() { $(this).css('transform', 'scale(1.02)'); },
                function() { $(this).css('transform', 'scale(1)'); }
            );
        });
    </script>
</body>
</html>`;
};

/**
 * BannerEditor - Éditeur avancé avec Monaco, historique, et prévisualisation
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
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('code');
    const [loading, setLoading] = useState(false);
    const [bannerSelectorOpen, setBannerSelectorOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isAssetLibraryOpen, setIsAssetLibraryOpen] = useState(false);

    // Historique pour Undo/Redo
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isUndoRedo, setIsUndoRedo] = useState(false);

    // Ref pour Monaco Editor
    const editorRef = useRef(null);
    const monacoRef = useRef(null);

    // Get all templates for selector
    const allTemplates = React.useMemo(() => {
        if (!bannerConfig?.categories) return [];
        return Object.entries(bannerConfig.categories).flatMap(([catKey, cat]) =>
            cat.templates.map(t => ({ ...t, categoryKey: catKey, categoryName: cat.name }))
        );
    }, [bannerConfig]);

    const categories = config?.categories ? Object.keys(config.categories) : [];

    // Initialiser l'historique
    useEffect(() => {
        if (editorCode && !isUndoRedo) {
            setHistory(prev => {
                const newHistory = prev.slice(0, historyIndex + 1);
                newHistory.push(editorCode);
                // Limiter à 50 entrées
                if (newHistory.length > 50) newHistory.shift();
                return newHistory;
            });
            setHistoryIndex(prev => Math.min(prev + 1, 49));
        }
        setIsUndoRedo(false);
    }, [editorCode]);

    // Load template content when editing existing
    useEffect(() => {
        if (selectedTemplate && isCodeEditorOpen) {
            loadTemplateContent(selectedTemplate);
        } else if (!selectedTemplate && isCodeEditorOpen && !editorCode) {
            // Load default template for new banner
            const defaultCode = getDefaultTemplate(size);
            setEditorCode(defaultCode);
            setHistory([defaultCode]);
            setHistoryIndex(0);
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
                // Reset history
                setHistory([html]);
                setHistoryIndex(0);
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

    // Undo
    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            setIsUndoRedo(true);
            setHistoryIndex(prev => prev - 1);
            setEditorCode(history[historyIndex - 1]);
        }
    }, [history, historyIndex, setEditorCode]);

    // Redo
    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            setIsUndoRedo(true);
            setHistoryIndex(prev => prev + 1);
            setEditorCode(history[historyIndex + 1]);
        }
    }, [history, historyIndex, setEditorCode]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                handleUndo();
            }
            if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
                e.preventDefault();
                handleRedo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo, handleRedo]);

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

    // Copy code to clipboard
    const handleCopyCode = () => {
        navigator.clipboard.writeText(editorCode);
        alert('Code copié !');
    };

    // Download as HTML file
    const handleDownload = () => {
        const blob = new Blob([editorCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name || 'banner'}-${size}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Insert placeholder at cursor
    const insertPlaceholder = (placeholder) => {
        if (editorRef.current) {
            const editor = editorRef.current;
            const selection = editor.getSelection();
            const id = { major: 1, minor: 1 };
            const op = { identifier: id, range: selection, text: placeholder, forceMoveMarkers: true };
            editor.executeEdits("insert-placeholder", [op]);
            editor.focus();
        }
    };

    // Insert asset from library
    const insertAsset = (code) => {
        if (editorRef.current) {
            const editor = editorRef.current;
            const selection = editor.getSelection();
            const id = { major: 1, minor: 1 };
            const op = { identifier: id, range: selection, text: code, forceMoveMarkers: true };
            editor.executeEdits("insert-asset", [op]);
            editor.focus();
        }
        setIsAssetLibraryOpen(false);
    };

    // Monaco Editor mount handler
    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        // Configure HTML autocomplete with placeholders
        monaco.languages.registerCompletionItemProvider('html', {
            provideCompletionItems: () => ({
                suggestions: PLACEHOLDERS.map(p => ({
                    label: p.label,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: p.label,
                    detail: p.detail,
                    documentation: `Placeholder: ${p.detail}`
                }))
            })
        });
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

                // Extract fields from HTML code
                const fieldMatches = editorCode.match(/\[([a-zA-Z0-9_]+)\]/g) || [];
                const extractedFields = [...new Set(fieldMatches.map(f => f.replace(/[\[\]]/g, '')))];

                const templateWithCategory = {
                    ...savedTemplate,
                    categoryKey: category.toLowerCase(),
                    fields: extractedFields.length > 0 ? extractedFields : ['name', 'price', 'imageUrl', 'sourceUrl']
                };

                addTemplateToConfig(templateWithCategory);

                alert(`Template ${isEditing ? 'modifié' : 'créé'}: ${savedTemplate.file || name}`);
                setIsCodeEditorOpen(false);
                setSelectedTemplate(templateWithCategory);
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

    // Reset for new template with default code
    const handleNewTemplate = (newSize = '300x250') => {
        const defaultCode = getDefaultTemplate(newSize);
        setEditorCode(defaultCode);
        setName('');
        setCategory('');
        setSize(newSize);
        setIsEditing(false);
        setSelectedTemplate(null);
        setHistory([defaultCode]);
        setHistoryIndex(0);
    };

    // Update template when size changes (for new templates only)
    const handleSizeChange = (newSize) => {
        setSize(newSize);
        if (!isEditing) {
            const defaultCode = getDefaultTemplate(newSize);
            setEditorCode(defaultCode);
            setHistory([defaultCode]);
            setHistoryIndex(0);
        }
    };

    if (!isCodeEditorOpen) return null;

    const [previewWidth, previewHeight] = size.split('x').map(Number);
    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    return (
        <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'} flex flex-col bg-[#0d0d0d] text-white`}>
            {/* Top Toolbar */}
            <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-black/40">
                {/* Left: Template Selector + Fields */}
                <div className="flex items-center gap-3">
                    {/* Banner Selector Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setBannerSelectorOpen(!bannerSelectorOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs hover:bg-white/10"
                        >
                            <Layout size={14} />
                            <span className="font-bold text-purple-400 max-w-[120px] truncate">
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
                        className="bg-transparent border-b border-white/20 focus:border-purple-500 outline-none text-sm font-bold w-32"
                        placeholder="Nom"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <div className="relative flex items-center gap-1">
                        <input
                            list="category-suggestions"
                            className="bg-transparent border-b border-white/20 focus:border-purple-500 outline-none text-xs w-24"
                            placeholder="Catégorie"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        />
                        <button
                            onClick={() => {
                                const newCat = prompt('Nom de la nouvelle catégorie:');
                                if (newCat && newCat.trim()) {
                                    setCategory(newCat.trim().toLowerCase());
                                }
                            }}
                            className="p-1 hover:bg-white/10 rounded text-purple-400 hover:text-purple-300"
                            title="Ajouter une catégorie"
                        >
                            <FolderPlus size={14} />
                        </button>
                    </div>
                    <datalist id="category-suggestions">
                        {categories.map(cat => <option key={cat} value={cat} />)}
                    </datalist>
                    <select
                        value={size}
                        onChange={e => handleSizeChange(e.target.value)}
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

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Undo/Redo */}
                    <div className="flex bg-white/5 rounded-lg">
                        <button
                            onClick={handleUndo}
                            disabled={!canUndo}
                            className={`p-2 rounded-l-lg transition-all ${canUndo ? 'hover:bg-white/10 text-white' : 'text-white/20 cursor-not-allowed'}`}
                            title="Annuler (Ctrl+Z)"
                        >
                            <Undo2 size={14} />
                        </button>
                        <button
                            onClick={handleRedo}
                            disabled={!canRedo}
                            className={`p-2 rounded-r-lg transition-all ${canRedo ? 'hover:bg-white/10 text-white' : 'text-white/20 cursor-not-allowed'}`}
                            title="Rétablir (Ctrl+Y)"
                        >
                            <Redo2 size={14} />
                        </button>
                    </div>

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

                    {/* Tools */}
                    <button
                        onClick={() => setIsAssetLibraryOpen(true)}
                        className="p-2 hover:bg-white/10 rounded-lg text-purple-400 hover:text-purple-300"
                        title="Bibliothèque d'assets"
                    >
                        <Sparkles size={14} />
                    </button>
                    <button
                        onClick={handleCopyCode}
                        className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white"
                        title="Copier le code"
                    >
                        <Copy size={14} />
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white"
                        title="Télécharger HTML"
                    >
                        <Download size={14} />
                    </button>
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white"
                        title={isFullscreen ? "Quitter plein écran" : "Plein écran"}
                    >
                        {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>

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

            {/* Placeholders Quick Insert Bar */}
            <div className="h-10 border-b border-white/5 bg-black/20 flex items-center px-4 gap-2 overflow-x-auto">
                <span className="text-xs text-white/40 mr-2">Insérer:</span>
                {PLACEHOLDERS.slice(0, 8).map(p => (
                    <button
                        key={p.label}
                        onClick={() => insertPlaceholder(p.label)}
                        className="px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded text-[10px] font-mono text-purple-300 whitespace-nowrap"
                        title={p.detail}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <RefreshCw className="animate-spin text-purple-500" size={32} />
                    </div>
                ) : activeTab === 'code' ? (
                    /* Monaco Code Editor */
                    <div className="flex-1">
                        <Editor
                            height="100%"
                            defaultLanguage="html"
                            theme="vs-dark"
                            value={editorCode}
                            onChange={(value) => setEditorCode(value || '')}
                            onMount={handleEditorDidMount}
                            options={{
                                minimap: { enabled: true },
                                fontSize: 13,
                                fontFamily: "'Fira Code', 'Monaco', monospace",
                                lineNumbers: 'on',
                                wordWrap: 'on',
                                automaticLayout: true,
                                scrollBeyondLastLine: false,
                                folding: true,
                                formatOnPaste: true,
                                formatOnType: true,
                                tabSize: 2,
                                bracketPairColorization: { enabled: true },
                                suggest: {
                                    showKeywords: true,
                                    showSnippets: true,
                                }
                            }}
                        />
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
            <div className="h-7 bg-black/40 border-t border-white/5 flex items-center justify-between px-4 text-[10px] text-white/40">
                <div className="flex items-center gap-4">
                    <span>
                        {isEditing ? `📝 Édition: ${selectedTemplate?.file}` : '✨ Nouvelle bannière'}
                    </span>
                    <span className="text-purple-400">
                        Historique: {historyIndex + 1}/{history.length}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span>{editorCode.length} caractères</span>
                    <span>{size}</span>
                    <span className="text-green-400">Monaco Editor</span>
                </div>
            </div>

            {/* Asset Library Modal */}
            <AssetLibrary
                isOpen={isAssetLibraryOpen}
                onClose={() => setIsAssetLibraryOpen(false)}
                onInsert={insertAsset}
            />
        </div>
    );
};

export default BannerEditor;
