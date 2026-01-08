import React, { useState, useEffect } from 'react';
import { useMapping } from '../context/MappingContext';
import { Save, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const BannerEditor = () => {
    const {
        isCodeEditorOpen,
        editorCode,
        setEditorCode,
        selectedTemplate,
        setSelectedTemplate,
        setIsCodeEditorOpen
    } = useMapping();

    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [size, setSize] = useState('300x250');
    const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error'

    // Load template code if editing an existing one
    useEffect(() => {
        if (selectedTemplate && isCodeEditorOpen) {
            // Fetch content if needed, but for now we might assume we are creating NEW
            // Unless we implement 'Edit Existing' fully.
            // For now, if we clicked 'New Template', selectedTemplate is null.
        }
    }, [selectedTemplate, isCodeEditorOpen]);

    const handleSave = async () => {
        if (!name || !category || !editorCode) {
            alert("Veuillez remplir tous les champs obligatoires (Nom, Catégorie, Code)");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/banners/template`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, category, size, htmlContent: editorCode })
            });

            if (response.ok) {
                const newTemplate = await response.json();
                setSaveStatus('success');
                // Could refresh sidebar via context if we had a reload function, 
                // but sidebar handles its own re-fetch or push? 
                // Actually TemplateSidebar managed its own localConfig. 
                // We should probably move banner list to context to share it.
                // For now, simple alert.
                alert(`Template créé: ${newTemplate.file}`);
                // Close editor
                setIsCodeEditorOpen(false);
                setSelectedTemplate(newTemplate);
                // We need to trigger Sidebar update. 
                // Since we can't easily, we might rely on the user refreshing or simple hack:
                window.location.reload();
            } else {
                setSaveStatus('error');
                alert("Erreur lors de la sauvegarde");
            }
        } catch (e) {
            console.error(e);
            setSaveStatus('error');
        }
    };

    if (!isCodeEditorOpen) return null;

    return (
        <div className="h-full flex flex-col bg-[#1e1e1e] text-white">
            {/* Toolbar */}
            <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-black/20">
                <div className="flex items-center gap-4">
                    <input
                        className="bg-transparent border-b border-white/20 focus:border-purple-500 outline-none text-sm font-bold w-40"
                        placeholder="Nom du Template"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        className="bg-transparent border-b border-white/20 focus:border-purple-500 outline-none text-xs w-32"
                        placeholder="Catégorie (ex: fashion)"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    />
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
                    </select>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsCodeEditorOpen(false)}
                        className="px-3 py-1.5 text-xs font-bold text-white/50 hover:text-white"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 rounded text-xs font-bold"
                    >
                        <Save size={14} />
                        Sauvegarder
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative">
                <textarea
                    className="w-full h-full bg-[#1e1e1e] text-white/80 font-mono text-xs p-4 resize-none focus:outline-none"
                    value={editorCode}
                    onChange={e => setEditorCode(e.target.value)}
                    placeholder="<!-- Collez votre code HTML ici -->"
                    spellCheck="false"
                />
            </div>
            <div className="h-6 bg-purple-500/10 text-purple-300 text-[10px] flex items-center px-4 gap-2">
                <AlertCircle size={10} />
                Utilisez les placeholders: [product1Name], [product1Price], [product1Image], etc.
            </div>
        </div>
    );
};

export default BannerEditor;
