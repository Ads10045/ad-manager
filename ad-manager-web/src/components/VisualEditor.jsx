import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { useMapping } from '../context/MappingContext';
import { useTheme } from '../context/ThemeContext';
import { Type, Image as ImageIcon, MousePointer2, Trash2, Maximize, Move, Layers, Settings2, Plus, Download, Save, X } from 'lucide-react';

const VisualEditor = () => {
    const { selectedTemplate, previewData, setIsVisualEditorOpen } = useMapping();
    const { theme } = useTheme();

    // Dimensons du canvas basées sur le template sélectionné (ex: 728x90)
    const [canvasSize, setCanvasSize] = useState({ width: 728, height: 90 });
    const [elements, setElements] = useState([]);
    const [selectedElementId, setSelectedElementId] = useState(null);
    const [scale, setScale] = useState(1);

    // Zoom automatique pour rentrer dans l'écran
    useEffect(() => {
        if (selectedTemplate?.size) {
            const [w, h] = selectedTemplate.size.split('x').map(Number);
            setCanvasSize({ width: w, height: h });

            // Initial elements if it's a new one or based on existing logic
            if (elements.length === 0) {
                setElements([
                    {
                        id: 'el-1',
                        type: 'text',
                        content: '[name]',
                        x: 20,
                        y: 20,
                        width: 200,
                        height: 40,
                        style: { color: '#ffffff', fontSize: '18px', fontWeight: 'bold' }
                    }
                ]);
            }
        }
    }, [selectedTemplate]);

    const addElement = (type) => {
        const id = `el-${Date.now()}`;
        let newElement = {
            id,
            type,
            x: 50,
            y: 20,
            width: type === 'text' ? 150 : 100,
            height: type === 'text' ? 40 : 100,
            style: type === 'text' ? { color: '#ffffff', fontSize: '14px' } : {}
        };

        if (type === 'text') newElement.content = 'Nouveau texte';
        if (type === 'image') newElement.src = '[imageUrl]';
        if (type === 'button') {
            newElement.content = 'Acheter';
            newElement.width = 120;
            newElement.height = 40;
            newElement.style = { backgroundColor: '#9333ea', color: '#ffffff', borderRadius: '8px', textAlign: 'center', lineHeight: '40px' };
        }

        setElements([...elements, newElement]);
        setSelectedElementId(id);
    };

    const deleteElement = (e, id) => {
        e.stopPropagation();
        setElements(elements.filter(el => el.id !== id));
        if (selectedElementId === id) setSelectedElementId(null);
    };

    const updateElement = (id, updates) => {
        setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
    };

    const selectedElement = elements.find(el => el.id === selectedElementId);

    const renderElement = (el) => {
        const isSelected = selectedElementId === el.id;

        // Remplacer les placeholders pour la prévisualisation
        let displayContent = el.content;
        if (typeof displayContent === 'string') {
            displayContent = displayContent.replace(/\[(.*?)\]/g, (match, key) => previewData[key] || match);
        }

        let imgSrc = el.src;
        if (imgSrc && typeof imgSrc === 'string') {
            imgSrc = imgSrc.replace(/\[(.*?)\]/g, (match, key) => previewData[key] || match);
        }

        return (
            <Rnd
                key={el.id}
                size={{ width: el.width, height: el.height }}
                position={{ x: el.x, y: el.y }}
                onDragStop={(e, d) => updateElement(el.id, { x: d.x, y: d.y })}
                onResizeStop={(e, direction, ref, delta, position) => {
                    updateElement(el.id, {
                        width: ref.offsetWidth,
                        height: ref.offsetHeight,
                        ...position
                    });
                }}
                bounds="parent"
                onClick={() => setSelectedElementId(el.id)}
                className={`flex items-center justify-center cursor-move transition-shadow ${isSelected ? 'ring-2 ring-purple-500 z-50' : 'hover:ring-1 hover:ring-purple-400/50'}`}
            >
                {el.type === 'text' && (
                    <div style={{ ...el.style, width: '100%', height: '100%' }} className="flex items-center">
                        {displayContent}
                    </div>
                )}
                {el.type === 'image' && (
                    <img
                        src={imgSrc || 'https://via.placeholder.com/150'}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                )}
                {el.type === 'button' && (
                    <div style={{ ...el.style, width: '100%', height: '100%' }}>
                        {displayContent}
                    </div>
                )}
                {isSelected && (
                    <button
                        onClick={(e) => deleteElement(e, el.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                    >
                        <Trash2 size={12} />
                    </button>
                )}
            </Rnd>
        );
    };

    const generateHTML = () => {
        const css = elements.map(el => {
            const styles = Object.entries(el.style || {})
                .map(([k, v]) => `${k.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}: ${v};`)
                .join(' ');
            return `.el-${el.id} { position: absolute; left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px; ${styles} }`;
        }).join('\n');

        const html = elements.map(el => {
            if (el.type === 'text') return `<div class="el-${el.id}">${el.content}</div>`;
            if (el.type === 'image') return `<img src="${el.src}" class="el-${el.id}" alt="Product image">`;
            if (el.type === 'button') return `<a href="[sourceUrl]" class="el-${el.id}">${el.content}</a>`;
            return '';
        }).join('\n');

        const fullHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; overflow: hidden; font-family: sans-serif; }
        .banner-container { width: ${canvasSize.width}px; height: ${canvasSize.height}px; position: relative; overflow: hidden; background: #000; }
        ${css}
    </style>
</head>
<body>
    <div class="banner-container">
        ${html}
    </div>
</body>
</html>`;
        console.log(fullHTML);
        alert("Code HTML généré dans la console (POC)");
    };

    return (
        <div className={`flex h-full ${theme.bg}`}>
            {/* Toolbar gauche */}
            <div className={`w-16 border-r ${theme.border} ${theme.sidebar} flex flex-col items-center py-4 gap-4`}>
                <button
                    onClick={() => addElement('text')}
                    className={`p-3 rounded-xl ${theme.hover} ${theme.text}`}
                    title="Ajouter du texte"
                >
                    <Type size={20} />
                </button>
                <button
                    onClick={() => addElement('image')}
                    className={`p-3 rounded-xl ${theme.hover} ${theme.text}`}
                    title="Ajouter une image"
                >
                    <ImageIcon size={20} />
                </button>
                <button
                    onClick={() => addElement('button')}
                    className={`p-3 rounded-xl ${theme.hover} ${theme.text}`}
                    title="Ajouter un bouton"
                >
                    <MousePointer2 size={20} />
                </button>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className={`h-12 border-b ${theme.border} flex items-center justify-between px-4 ${theme.header}`}>
                    <div className="flex items-center gap-2">
                        <Settings2 size={16} className={theme.accent} />
                        <span className="text-xs font-bold uppercase tracking-wider">Visual Editor</span>
                        <span className="text-[10px] opacity-40 ml-2">{canvasSize.width}x{canvasSize.height}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={generateHTML}
                            className="flex items-center gap-2 px-3 py-1.5 bg-purple-500 text-white rounded-lg text-[10px] font-bold hover:bg-purple-600 transition-colors"
                        >
                            <Download size={14} /> EXPORTER HTML
                        </button>
                        <button
                            onClick={() => setIsVisualEditorOpen(false)}
                            className={`p-1.5 rounded-lg ${theme.hover} ${theme.text}`}
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-[#1a1a1a] flex items-center justify-center p-8 overflow-auto custom-scrollbar">
                    <div
                        className="bg-black shadow-2xl relative"
                        style={{
                            width: canvasSize.width,
                            height: canvasSize.height
                        }}
                    >
                        {/* Grid Pattern Background */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                        {elements.map(renderElement)}
                    </div>
                </div>
            </div>

            {/* Sidebar Droite - Propriétés */}
            <div className={`w-64 border-l ${theme.border} ${theme.sidebar} p-4 overflow-y-auto custom-scrollbar`}>
                <h3 className={`text-xs font-black uppercase tracking-widest mb-4 ${theme.text} opacity-50 flex items-center gap-2`}>
                    <Layers size={14} /> Propriétés
                </h3>

                {selectedElement ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold opacity-40">Contenu / Source</label>
                            <textarea
                                value={selectedElement.type === 'image' ? selectedElement.src : selectedElement.content}
                                onChange={(e) => updateElement(selectedElement.id, selectedElement.type === 'image' ? { src: e.target.value } : { content: e.target.value })}
                                className={`w-full ${theme.input} border ${theme.border} rounded-lg p-2 text-xs focus:outline-none`}
                                rows={3}
                            />
                            <p className="text-[9px] opacity-40 font-mono italic">Supporte [name], [price], etc.</p>
                        </div>

                        {selectedElement.type === 'text' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold opacity-40">Taille Police</label>
                                    <input
                                        type="text"
                                        value={selectedElement.style.fontSize}
                                        onChange={(e) => updateElement(selectedElement.id, { style: { ...selectedElement.style, fontSize: e.target.value } })}
                                        className={`w-full ${theme.input} border ${theme.border} rounded-lg p-2 text-xs focus:outline-none`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold opacity-40">Couleur</label>
                                    <input
                                        type="color"
                                        value={selectedElement.style.color}
                                        onChange={(e) => updateElement(selectedElement.id, { style: { ...selectedElement.style, color: e.target.value } })}
                                        className={`w-full h-8 bg-transparent cursor-pointer`}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2 mt-4">
                            <label className="text-[10px] uppercase font-bold opacity-40">Position & Taille</label>
                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                                <div className="flex items-center gap-1 border border-white/5 p-1 rounded">X: {Math.round(selectedElement.x)}</div>
                                <div className="flex items-center gap-1 border border-white/5 p-1 rounded">Y: {Math.round(selectedElement.y)}</div>
                                <div className="flex items-center gap-1 border border-white/5 p-1 rounded">W: {selectedElement.width}</div>
                                <div className="flex items-center gap-1 border border-white/5 p-1 rounded">H: {selectedElement.height}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 opacity-20">
                        <MousePointer2 size={32} />
                        <p className="text-[10px] mt-2 italic">Sélectionnez un élément</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisualEditor;
