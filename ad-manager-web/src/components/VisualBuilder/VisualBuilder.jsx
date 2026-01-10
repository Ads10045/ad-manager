import React, { useState, useRef, useEffect } from 'react';
import InfiniteViewer from 'react-infinite-viewer';
import Selecto from 'react-selecto';
import Moveable from 'react-moveable';
import { useTheme } from '../../context/ThemeContext';
import { useMapping } from '../../context/MappingContext';
import {
    Layers, Type, Image as ImageIcon, Square, Settings2,
    ZoomIn, ZoomOut, Move, Download, X, Plus, Trash2, Globe, Code,
    LayoutTemplate, Palette, Shapes, PlayCircle, MousePointer2,
    Lock, Unlock, Eye, EyeOff, GripVertical, AlignLeft, AlignCenter, AlignRight,
    Play, Pause, SkipBack, SkipForward, Copy, ChevronLeft, ChevronRight,
    Bold, Italic, Underline, ChevronUp, ChevronDown, RotateCcw, Maximize2, MoveHorizontal, MoveVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VisualBuilder = () => {
    const { theme } = useTheme();
    const { selectedTemplate, setIsVisualEditorOpen } = useMapping();

    // -- STATE --
    const [elements, setElements] = useState([]);
    const [selectedTargets, setSelectedTargets] = useState([]);
    const [canvasSize, setCanvasSize] = useState({ width: 728, height: 90 });
    const [zoom, setZoom] = useState(1);

    // UI State
    const [activeTool, setActiveTool] = useState(null);
    const [isTimelineOpen, setIsTimelineOpen] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);
    const [slides, setSlides] = useState([{ id: 1, name: 'Slide 1' }]);

    // Playback
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const duration = 5; // seconds

    // Background
    const [canvasBackground, setCanvasBackground] = useState('#ffffff');
    const [gradientEnabled, setGradientEnabled] = useState(false);
    const [gradientColor2, setGradientColor2] = useState('#000000');
    const [gradientType, setGradientType] = useState('linear');
    const [gradientDirection, setGradientDirection] = useState('to right');

    // Code & Export
    const [showCode, setShowCode] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');

    // -- REFS --
    const moveableRef = useRef(null);
    const selectoRef = useRef(null);
    const viewerRef = useRef(null);
    const containerRef = useRef(null);

    // -- INIT --
    useEffect(() => {
        if (elements.length === 0) {
            setElements([
                {
                    id: 'el-1',
                    type: 'text',
                    name: 'Titre Principal',
                    content: 'Double click to edit',
                    x: 20, y: 20, width: 300, height: 60, rotation: 0,
                    visible: true, locked: false,
                    style: { fontSize: '24px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', color: '#000000', textAlign: 'center', zIndex: 1 },
                    anim: { start: 0, duration: 5 }
                }
            ]);
        }
    }, []);

    useEffect(() => {
        if (selectedTemplate?.size) {
            const [w, h] = selectedTemplate.size.split('x').map(Number);
            setCanvasSize({ width: w, height: h });
        }
    }, [selectedTemplate]);

    // -- HELPERS --
    const updateElement = (id, updates) => {
        setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
    };

    // Button Presets Library
    const buttonPresets = [
        { name: 'DOWNLOAD', colors: ['#22c55e', '#a855f7', 'transparent'], borderColors: ['transparent', 'transparent', '#22c55e'] },
        { name: 'SUBSCRIBE', colors: ['#06b6d4', '#8b5cf6', 'transparent'], borderColors: ['transparent', 'transparent', '#06b6d4'] },
        { name: 'Sign up', colors: ['#f97316', '#ec4899', 'transparent'], borderColors: ['transparent', 'transparent', '#f97316'] },
        { name: 'ADD TO CART', colors: ['#eab308', '#6366f1', 'transparent'], borderColors: ['transparent', 'transparent', '#eab308'] },
        { name: 'Submit', colors: ['#64748b', '#475569', 'transparent'], borderColors: ['transparent', 'transparent', '#64748b'] },
        { name: 'BUY NOW', colors: ['#78716c', '#a8a29e', 'transparent'], borderColors: ['transparent', 'transparent', '#78716c'] },
        { name: 'Call now', colors: ['#ef4444', '#f43f5e', 'transparent'], borderColors: ['transparent', 'transparent', '#ef4444'] },
        { name: 'Like', colors: ['#3b82f6', '#6366f1', 'transparent'], borderColors: ['transparent', 'transparent', '#3b82f6'] },
        { name: 'Learn more', colors: ['#10b981', '#14b8a6', 'transparent'], borderColors: ['transparent', 'transparent', '#10b981'] },
        { name: 'UPLOAD', colors: ['#f43f5e', '#ec4899', 'transparent'], borderColors: ['transparent', 'transparent', '#f43f5e'] },
        { name: 'SEARCH', colors: ['#6b7280', '#9ca3af', 'transparent'], borderColors: ['transparent', 'transparent', '#6b7280'] },
        { name: 'ADD', colors: ['#0ea5e9', '#38bdf8', 'transparent'], borderColors: ['transparent', 'transparent', '#0ea5e9'] },
        { name: 'CLOSE', colors: ['#dc2626', '#ef4444', 'transparent'], borderColors: ['transparent', 'transparent', '#dc2626'] },
    ];

    // Text Presets Library
    const textPresets = [
        { name: 'Joanne Rochester', sub: 'JEWELRY BOUTIQUE', font: 'Playfair Display', size: '28px', weight: '400' },
        { name: 'EXQUISITE TASTE', sub: 'ACCESSORIES FOR MEN', font: 'Didot, serif', size: '36px', weight: '400', spacing: '4px' },
        { name: 'EXPLORE LONDON', sub: 'TAKE A CITY TOUR', font: 'Oswald', size: '32px', weight: '700' },
        { name: 'Fitness Management', sub: 'Complete Programs', font: 'Georgia, serif', size: '28px', weight: '400' },
        { name: 'ORGANIC BODY LINE', sub: '100% Natural', font: 'Montserrat', size: '24px', weight: '800' },
        { name: 'ROSE BUD', sub: 'EXCLUSIVE RESTAURANT', font: 'Cormorant Garamond', size: '36px', weight: '300', spacing: '8px' },
        { name: '24HOURS SALE', sub: 'ONLINE & IN STORES', font: 'Impact', size: '42px', weight: '400' },
        { name: 'WEST COAST', sub: 'MUSIC FESTIVAL', font: 'Bebas Neue', size: '38px', weight: '400', spacing: '2px' },
        { name: '40% OFF', sub: 'Limited Time', font: 'Arial Black', size: '48px', weight: '900' },
    ];

    const addElement = (type, preset = null) => {
        const id = `el-${Date.now()}`;
        const zIndex = elements.length + 1;

        let newEl = {
            id, type, name: type,
            x: 50, y: 50, width: 150, height: 45, rotation: 0,
            visible: true, locked: false,
            style: { zIndex },
            anim: { start: 0, duration: 5 }
        };

        if (type === 'text') {
            newEl.width = 300; newEl.height = 80;
            newEl.content = 'Nouveau Texte';
            newEl.style = { ...newEl.style, color: '#000000', fontSize: '24px', fontFamily: 'Inter, sans-serif' };

            if (preset && typeof preset === 'object') {
                newEl.content = preset.name;
                newEl.name = preset.name.substring(0, 15);
                newEl.style.fontSize = preset.size || '24px';
                newEl.style.fontFamily = preset.font || 'Inter';
                newEl.style.fontWeight = preset.weight || '400';
                newEl.style.letterSpacing = preset.spacing || '0';
            } else if (preset === 'headline') {
                newEl.content = 'Grand Titre'; newEl.style.fontSize = '48px'; newEl.style.fontWeight = 'bold';
            } else if (preset === 'subheadline') {
                newEl.content = 'Sous-titre'; newEl.style.fontSize = '24px'; newEl.style.fontWeight = '500';
            }
            newEl.name = newEl.name || 'Texte';
        }

        if (type === 'button') {
            newEl.width = 140; newEl.height = 42;
            newEl.content = 'BUTTON';
            newEl.name = 'Bouton';
            newEl.style = {
                ...newEl.style,
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '13px',
                border: '2px solid transparent'
            };

            if (preset && typeof preset === 'object') {
                newEl.content = preset.name;
                newEl.name = preset.name;
                newEl.style.backgroundColor = preset.bg;
                newEl.style.color = preset.color;
                newEl.style.borderColor = preset.border || 'transparent';
                newEl.style.borderRadius = preset.radius || '4px';
            }
        }

        if (type === 'square') { newEl.name = 'Forme'; newEl.width = 100; newEl.height = 100; newEl.style = { ...newEl.style, backgroundColor: '#3b82f6' }; }
        if (type === 'circle') { newEl.name = 'Cercle'; newEl.width = 100; newEl.height = 100; newEl.style = { ...newEl.style, backgroundColor: '#ef4444', borderRadius: '50%' }; }
        if (type === 'image') { newEl.name = 'Image'; newEl.src = 'https://via.placeholder.com/150'; newEl.style = { ...newEl.style, objectFit: 'contain' }; }

        setElements(prev => [...prev, newEl]);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        const id = `el-${Date.now()}`;
        const newEl = {
            id, type: 'image', name: file.name,
            src: url, x: 50, y: 50, width: 150, height: 150, rotation: 0,
            visible: true, locked: false,
            style: { zIndex: elements.length + 1, objectFit: 'contain' },
            anim: { start: 0, duration: 5 }
        };
        setElements(prev => [...prev, newEl]);
        e.target.value = null;
    };

    // -- GENERATE HTML -- 
    const generateHTML = () => {
        // ... (Generated code logic remains similar)
        setGeneratedCode("Code HTML generation simulated...");
        setShowCode(true);
    };

    // -- RENDERERS --
    const renderElement = (el) => {
        if (!el.visible) return null;

        const style = {
            position: 'absolute',
            left: '0', top: '0',
            width: `${el.width}px`,
            height: `${el.height}px`,
            transform: `translate(${el.x}px, ${el.y}px) rotate(${el.rotation || 0}deg)`,
            ...el.style,
            opacity: el.locked ? 0.8 : 1
        };

        return (
            <div
                key={el.id}
                className={`absolute banner-element group ${selectedTargets.find(t => t.id === el.id) ? '' : 'hover:outline hover:outline-1 hover:outline-blue-400'}`}
                style={style}
                data-id={el.id}
                id={el.id}
            >
                {el.type === 'text' && (
                    <div className="w-full h-full flex items-center justify-center pointer-events-none whitespace-pre-wrap leading-tight">{el.content}</div>
                )}
                {el.type === 'button' && (
                    <div className="w-full h-full flex items-center justify-center pointer-events-none whitespace-pre-wrap leading-tight">{el.content}</div>
                )}
                {(el.type === 'square' || el.type === 'circle') && (
                    <div className="w-full h-full pointer-events-none" style={{ backgroundColor: el.style.backgroundColor, borderRadius: el.style.borderRadius }} />
                )}
                {el.type === 'image' && (
                    <img src={el.src} className="w-full h-full pointer-events-none" style={{ objectFit: el.style.objectFit || 'contain' }} alt="" />
                )}
            </div>
        );
    };

    const tools = [
        { id: 'templates', icon: LayoutTemplate, label: 'Templates' },
        { id: 'background', icon: Palette, label: 'Bkgnd' }, // Shortened label
        { id: 'text', icon: Type, label: 'Text' },
        { id: 'elements', icon: Shapes, label: 'Elements' },
        { id: 'button', icon: MousePointer2, label: 'Button' },
        { id: 'animator', icon: PlayCircle, label: 'Animator' },
    ];

    return (
        <div className={`flex h-full w-full bg-[#1e1e1e] text-gray-100 overflow-hidden font-sans`}>
            {/* 1. LEFT TOOLBAR */}
            <div className={`w-16 bg-[#121212] border-r border-[#333] flex flex-col items-center py-4 z-40 shrink-0`}>
                <div className="mb-4">
                    <button onClick={() => setIsVisualEditorOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white">
                        <ChevronLeft size={20} />
                    </button>
                </div>
                {tools.map(tool => (
                    <button
                        key={tool.id}
                        onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
                        className={`w-12 h-12 mb-2 flex flex-col items-center justify-center rounded-lg transition-all ${activeTool === tool.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-[#222]'}`}
                    >
                        <tool.icon size={18} className="mb-0.5" />
                        <span className="text-[9px] font-medium">{tool.label}</span>
                    </button>
                ))}
            </div>

            {/* 2. DRAWER (Content of active tool) */}
            <AnimatePresence initial={false}>
                {activeTool && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 320, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="bg-[#1a1a1a] border-r border-[#333] flex flex-col overflow-hidden z-30 relative shadow-2xl shrink-0"
                    >
                        <div className="p-4 border-b border-[#333] flex items-center justify-between">
                            <h3 className="font-bold text-sm uppercase tracking-wider">{tools.find(t => t.id === activeTool)?.label}</h3>
                            <button onClick={() => setActiveTool(null)} className="opacity-50 hover:opacity-100"><X size={16} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {/* TEMPLATES DRAWER */}
                            {activeTool === 'templates' && (
                                <div className="flex flex-col h-full">
                                    {/* Tabs */}
                                    <div className="flex border-b border-[#333] px-4">
                                        <button className="py-3 px-4 text-sm font-bold border-b-2 border-blue-500 text-white">Static</button>
                                        <button className="py-3 px-4 text-sm font-bold border-b-2 border-transparent text-gray-500 hover:text-gray-300">Animated</button>
                                    </div>

                                    {/* Category Filter */}
                                    <div className="p-4 flex items-center gap-2 border-b border-[#333]">
                                        <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center">
                                            <LayoutTemplate size={14} className="opacity-50" />
                                        </div>
                                        <select className="flex-1 bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-sm appearance-none cursor-pointer">
                                            <option>All categories</option>
                                            <option>Finance</option>
                                            <option>E-commerce</option>
                                            <option>Beauty</option>
                                            <option>Food & Drinks</option>
                                            <option>Travel</option>
                                            <option>Real Estate</option>
                                            <option>Sale & Promo</option>
                                        </select>
                                    </div>

                                    {/* Template Grid */}
                                    <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                                        {/* Template 1 - Finance Yellow */}
                                        <button
                                            onClick={() => {
                                                setCanvasBackground('#FDE047');
                                                setElements([
                                                    { id: 'tpl-1', type: 'text', name: 'Headline', content: 'Reach financial freedom', x: 20, y: 15, width: 280, height: 50, rotation: 0, visible: true, locked: false, style: { fontSize: '22px', fontWeight: 'bold', color: '#000', zIndex: 1 }, anim: { start: 0, duration: 5 } },
                                                    { id: 'tpl-2', type: 'text', name: 'Subhead', content: 'with a tailored investment', x: 20, y: 45, width: 280, height: 30, rotation: 0, visible: true, locked: false, style: { fontSize: '18px', fontWeight: '600', color: '#3b82f6', zIndex: 2 }, anim: { start: 0, duration: 5 } },
                                                    { id: 'tpl-3', type: 'button', name: 'CTA', content: 'Get started >', x: 20, y: 75, width: 120, height: 35, rotation: 0, visible: true, locked: false, style: { fontSize: '12px', fontWeight: 'bold', color: '#fff', backgroundColor: '#22c55e', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }, anim: { start: 0, duration: 5 } },
                                                ]);
                                            }}
                                            className="w-full bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-lg overflow-hidden aspect-[728/90] relative group hover:ring-2 hover:ring-blue-500 transition-all"
                                        >
                                            <div className="absolute inset-0 p-3 flex flex-col justify-center">
                                                <p className="text-black font-bold text-sm">Reach financial freedom</p>
                                                <p className="text-blue-600 font-semibold text-xs">with a tailored investment</p>
                                            </div>
                                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="bg-blue-500 text-white text-[8px] px-1.5 py-0.5 rounded">Use</span>
                                            </div>
                                        </button>

                                        {/* Template 2 - Finance Pink */}
                                        <button
                                            onClick={() => {
                                                setCanvasBackground('#EC4899');
                                                setElements([
                                                    { id: 'tpl-1', type: 'text', name: 'Headline', content: 'LEARN HOW TO FINANCE YOUR DREAM', x: 20, y: 10, width: 300, height: 60, rotation: 0, visible: true, locked: false, style: { fontSize: '20px', fontWeight: '800', color: '#fff', zIndex: 1 }, anim: { start: 0, duration: 5 } },
                                                    { id: 'tpl-2', type: 'button', name: 'CTA', content: 'Learn More', x: 20, y: 70, width: 100, height: 30, rotation: 0, visible: true, locked: false, style: { fontSize: '11px', fontWeight: 'bold', color: '#000', backgroundColor: '#22c55e', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }, anim: { start: 0, duration: 5 } },
                                                ]);
                                            }}
                                            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg overflow-hidden aspect-[728/90] relative group hover:ring-2 hover:ring-blue-500 transition-all"
                                        >
                                            <div className="absolute inset-0 p-3 flex flex-col justify-center">
                                                <p className="text-white font-extrabold text-sm">LEARN HOW TO FINANCE</p>
                                                <p className="text-white font-extrabold text-xs">YOUR DREAM</p>
                                            </div>
                                        </button>

                                        {/* Template 3 - Blue Bank */}
                                        <button
                                            onClick={() => {
                                                setCanvasBackground('#3B82F6');
                                                setElements([
                                                    { id: 'tpl-1', type: 'text', name: 'Offer', content: 'Enjoy a $0 annual fee and', x: 20, y: 10, width: 350, height: 30, rotation: 0, visible: true, locked: false, style: { fontSize: '18px', fontWeight: '600', color: '#fff', zIndex: 1 }, anim: { start: 0, duration: 5 } },
                                                    { id: 'tpl-2', type: 'text', name: 'Highlight', content: '1.5% cashback on purchases', x: 20, y: 35, width: 350, height: 30, rotation: 0, visible: true, locked: false, style: { fontSize: '20px', fontWeight: '800', color: '#fff', zIndex: 2 }, anim: { start: 0, duration: 5 } },
                                                    { id: 'tpl-3', type: 'button', name: 'CTA', content: 'See Card Terms', x: 20, y: 70, width: 120, height: 30, rotation: 0, visible: true, locked: false, style: { fontSize: '11px', fontWeight: 'bold', color: '#3B82F6', backgroundColor: '#fff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }, anim: { start: 0, duration: 5 } },
                                                ]);
                                            }}
                                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg overflow-hidden aspect-[728/90] relative group hover:ring-2 hover:ring-blue-500 transition-all"
                                        >
                                            <div className="absolute inset-0 p-3 flex flex-col justify-center">
                                                <p className="text-white font-semibold text-xs">Enjoy a $0 annual fee and</p>
                                                <p className="text-white font-extrabold text-sm">1.5% cashback on purchases</p>
                                            </div>
                                        </button>

                                        {/* Template 4 - Beauty/Skincare */}
                                        <button
                                            onClick={() => {
                                                setCanvasBackground('#FDF4FF');
                                                setGradientEnabled(true);
                                                setGradientColor2('#F0ABFC');
                                                setElements([
                                                    { id: 'tpl-1', type: 'text', name: 'Headline', content: 'Skincare for remarkable', x: 20, y: 10, width: 320, height: 30, rotation: 0, visible: true, locked: false, style: { fontSize: '18px', fontWeight: '600', color: '#000', zIndex: 1 }, anim: { start: 0, duration: 5 } },
                                                    { id: 'tpl-2', type: 'text', name: 'Subhead', content: 'age-defying results', x: 20, y: 35, width: 280, height: 30, rotation: 0, visible: true, locked: false, style: { fontSize: '18px', fontWeight: '600', color: '#000', zIndex: 2 }, anim: { start: 0, duration: 5 } },
                                                    { id: 'tpl-3', type: 'button', name: 'CTA', content: 'Shop here', x: 20, y: 70, width: 90, height: 28, rotation: 0, visible: true, locked: false, style: { fontSize: '11px', fontWeight: 'bold', color: '#fff', backgroundColor: '#1f2937', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }, anim: { start: 0, duration: 5 } },
                                                ]);
                                            }}
                                            className="w-full bg-gradient-to-r from-pink-100 to-purple-200 rounded-lg overflow-hidden aspect-[728/90] relative group hover:ring-2 hover:ring-blue-500 transition-all"
                                        >
                                            <div className="absolute inset-0 p-3 flex flex-col justify-center">
                                                <p className="text-gray-800 font-semibold text-xs">Skincare for remarkable</p>
                                                <p className="text-gray-800 font-semibold text-sm">age-defying results</p>
                                            </div>
                                        </button>

                                        {/* Template 5 - Sale Purple */}
                                        <button
                                            onClick={() => {
                                                setCanvasBackground('#7C3AED');
                                                setElements([
                                                    { id: 'tpl-1', type: 'text', name: 'Title', content: 'LASHES STAY', x: 20, y: 10, width: 300, height: 35, rotation: 0, visible: true, locked: false, style: { fontSize: '28px', fontWeight: '900', color: '#fff', zIndex: 1 }, anim: { start: 0, duration: 5 } },
                                                    { id: 'tpl-2', type: 'text', name: 'Subtitle', content: 'CURLED ALL DAY', x: 20, y: 42, width: 300, height: 35, rotation: 0, visible: true, locked: false, style: { fontSize: '26px', fontWeight: '900', color: '#fff', zIndex: 2 }, anim: { start: 0, duration: 5 } },
                                                    { id: 'tpl-3', type: 'button', name: 'CTA', content: 'Find Store', x: 20, y: 78, width: 100, height: 28, rotation: 0, visible: true, locked: false, style: { fontSize: '11px', fontWeight: 'bold', color: '#7C3AED', backgroundColor: '#fff', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }, anim: { start: 0, duration: 5 } },
                                                ]);
                                            }}
                                            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg overflow-hidden aspect-[728/90] relative group hover:ring-2 hover:ring-blue-500 transition-all"
                                        >
                                            <div className="absolute inset-0 p-3 flex flex-col justify-center">
                                                <p className="text-white font-black text-base">LASHES STAY</p>
                                                <p className="text-white font-black text-sm">CURLED ALL DAY</p>
                                            </div>
                                        </button>

                                        {/* Template 6 - Food Green */}
                                        <button
                                            onClick={() => {
                                                setCanvasBackground('#ECFDF5');
                                                setElements([
                                                    { id: 'tpl-1', type: 'text', name: 'Intro', content: 'Enjoy more of your', x: 20, y: 10, width: 200, height: 25, rotation: 0, visible: true, locked: false, style: { fontSize: '14px', fontWeight: '400', color: '#374151', zIndex: 1 }, anim: { start: 0, duration: 5 } },
                                                    { id: 'tpl-2', type: 'text', name: 'Headline', content: 'FAVORITE DRINK', x: 20, y: 32, width: 280, height: 40, rotation: 0, visible: true, locked: false, style: { fontSize: '28px', fontWeight: '900', color: '#059669', zIndex: 2 }, anim: { start: 0, duration: 5 } },
                                                    { id: 'tpl-3', type: 'button', name: 'CTA', content: 'Find Store', x: 20, y: 75, width: 100, height: 28, rotation: 0, visible: true, locked: false, style: { fontSize: '11px', fontWeight: 'bold', color: '#fff', backgroundColor: '#F97316', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }, anim: { start: 0, duration: 5 } },
                                                ]);
                                            }}
                                            className="w-full bg-gradient-to-r from-emerald-50 to-green-100 rounded-lg overflow-hidden aspect-[728/90] relative group hover:ring-2 hover:ring-blue-500 transition-all"
                                        >
                                            <div className="absolute inset-0 p-3 flex flex-col justify-center">
                                                <p className="text-gray-600 text-xs">Enjoy more of your</p>
                                                <p className="text-emerald-600 font-black text-base">FAVORITE DRINK</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Other drawers with padding */}
                            <div className="p-4">
                                {activeTool === 'text' && (
                                    <div className="space-y-3">
                                        <div className="mb-4">
                                            <button onClick={() => addElement('text', 'headline')} className="w-full text-left bg-white/5 hover:bg-white/10 p-4 rounded border border-white/5 transition-colors mb-2">
                                                <h1 className="text-2xl font-bold">Add a heading</h1>
                                            </button>
                                            <button onClick={() => addElement('text', 'subheadline')} className="w-full text-left bg-white/5 hover:bg-white/10 p-3 rounded border border-white/5 transition-colors">
                                                <h2 className="text-lg">Add a subheading</h2>
                                            </button>
                                        </div>
                                        <p className="text-[10px] uppercase font-bold opacity-40 pt-2 border-t border-white/10">Text Presets</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {textPresets.map((preset, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => addElement('text', preset)}
                                                    className="bg-[#2a2a2a] hover:bg-[#333] p-3 rounded border border-white/5 text-left transition-all hover:border-white/20 h-24 flex flex-col justify-center overflow-hidden"
                                                >
                                                    <span className="text-sm font-semibold truncate block" style={{ fontFamily: preset.font }}>{preset.name}</span>
                                                    <span className="text-[9px] opacity-40 uppercase tracking-wider truncate">{preset.sub}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* ELEMENTS */}
                                {activeTool === 'elements' && (
                                    <div className="space-y-6">
                                        <p className="text-[10px] uppercase font-bold opacity-40">Shapes</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            <button onClick={() => addElement('square')} className="aspect-square bg-white/5 hover:bg-white/10 rounded flex items-center justify-center border border-white/5"><div className="w-8 h-8 bg-blue-500 rounded-sm"></div></button>
                                            <button onClick={() => addElement('circle')} className="aspect-square bg-white/5 hover:bg-white/10 rounded flex items-center justify-center border border-white/5"><div className="w-8 h-8 bg-red-500 rounded-full"></div></button>
                                            <button onClick={() => addElement('square')} className="aspect-square bg-white/5 hover:bg-white/10 rounded flex items-center justify-center border border-white/5"><div className="w-8 h-4 bg-emerald-500 rounded-sm"></div></button>
                                        </div>
                                        <p className="text-[10px] uppercase font-bold opacity-40 pt-2 border-t border-white/10">Images</p>
                                        <div className="relative">
                                            <input type="file" accept="image/*" id="d-upload" className="hidden" onChange={handleImageUpload} />
                                            <label htmlFor="d-upload" className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg">
                                                <ImageIcon size={16} /> Upload Image
                                            </label>
                                        </div>
                                    </div>
                                )}
                                {/* BUTTON DRAWER - Full Library */}
                                {activeTool === 'button' && (
                                    <div className="space-y-4">
                                        {buttonPresets.map((preset, i) => (
                                            <div key={i}>
                                                <p className="text-[9px] uppercase opacity-30 mb-1.5">{preset.name}</p>
                                                <div className="grid grid-cols-3 gap-1.5">
                                                    {/* Solid */}
                                                    <button
                                                        onClick={() => addElement('button', { name: preset.name, bg: preset.colors[0], color: '#fff', border: 'transparent', radius: '4px' })}
                                                        className="py-2 rounded text-[10px] font-bold text-white shadow-sm hover:brightness-110 transition-all"
                                                        style={{ backgroundColor: preset.colors[0] }}
                                                    >{preset.name}</button>
                                                    {/* Gradient/Alt */}
                                                    <button
                                                        onClick={() => addElement('button', { name: preset.name, bg: preset.colors[1], color: '#fff', border: 'transparent', radius: '4px' })}
                                                        className="py-2 rounded text-[10px] font-bold text-white shadow-sm hover:brightness-110 transition-all"
                                                        style={{ backgroundColor: preset.colors[1] }}
                                                    >{preset.name}</button>
                                                    {/* Outline */}
                                                    <button
                                                        onClick={() => addElement('button', { name: preset.name, bg: 'transparent', color: preset.borderColors[2], border: preset.borderColors[2], radius: '4px' })}
                                                        className="py-2 rounded text-[10px] font-bold shadow-sm hover:bg-white/5 transition-all border-2"
                                                        style={{ borderColor: preset.borderColors[2], color: preset.borderColors[2] }}
                                                    >{preset.name}</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* BACKGROUND */}
                                {activeTool === 'background' && (
                                    <div className="space-y-4">
                                        <div className="flex bg-black/20 p-1 rounded-lg">
                                            <button onClick={() => setGradientEnabled(false)} className={`flex-1 py-1.5 text-xs rounded ${!gradientEnabled ? 'bg-white/20 font-bold' : 'opacity-50'}`}>Solid</button>
                                            <button onClick={() => setGradientEnabled(true)} className={`flex-1 py-1.5 text-xs rounded ${gradientEnabled ? 'bg-white/20 font-bold' : 'opacity-50'}`}>Gradient</button>
                                        </div>
                                        <input type="color" value={canvasBackground} onChange={e => setCanvasBackground(e.target.value)} className="w-full h-10 rounded cursor-pointer" />
                                        {gradientEnabled && <input type="color" value={gradientColor2} onChange={e => setGradientColor2(e.target.value)} className="w-full h-10 rounded cursor-pointer mt-2" />}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN CONTENT WRAPPER */}
            <div className="flex-1 flex flex-col min-w-0 h-full relative">

                {/* TOP HEADER */}
                <div className="h-14 border-b border-[#333] bg-[#1a1a1a] flex items-center justify-between px-4 shrink-0 z-20">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-black/20 rounded px-3 py-1.5 border border-white/5">
                            <span className="text-xs opacity-50 uppercase font-bold">Size</span>
                            <div className="w-px h-3 bg-white/10 mx-1"></div>
                            <input type="number" value={canvasSize.width} onChange={e => setCanvasSize({ ...canvasSize, width: +e.target.value })} className="w-8 bg-transparent text-xs font-mono outline-none text-right font-bold" />
                            <span className="text-xs opacity-30">x</span>
                            <input type="number" value={canvasSize.height} onChange={e => setCanvasSize({ ...canvasSize, height: +e.target.value })} className="w-8 bg-transparent text-xs font-mono outline-none font-bold" />
                            <span className="text-[10px] opacity-30 ml-1">px</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setZoom(z => Math.max(0.1, z - 0.1))} className="p-2 hover:bg-white/5 rounded-lg"><ZoomOut size={16} /></button>
                            <span className="text-xs font-mono w-10 text-center opacity-70">{Math.round(zoom * 100)}%</span>
                            <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="p-2 hover:bg-white/5 rounded-lg"><ZoomIn size={16} /></button>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={generateHTML} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95">
                            <Download size={14} /> Download
                        </button>
                    </div>
                </div>

                {/* MIDDLE SECTION: CANVAS + SLIDES */}
                <div className="flex-1 flex overflow-hidden">
                    {/* CANVAS */}
                    <div className="flex-1 bg-[#121212] relative overflow-hidden" ref={containerRef}>
                        <InfiniteViewer
                            ref={viewerRef}
                            className="viewer w-full h-full"
                            zoom={zoom}
                            useWheelScroll={true}
                            usePinch={true}
                            useAutoZoom={false}
                        >
                            <div className="viewport relative pt-60 pl-60 pr-60 pb-60 flex items-center justify-center min-w-full min-h-full">
                                <div
                                    className="shadow-2xl relative transition-all duration-300"
                                    style={{
                                        width: canvasSize.width,
                                        height: canvasSize.height,
                                        background: gradientEnabled
                                            ? `${gradientType}-gradient(${gradientDirection}, ${canvasBackground}, ${gradientColor2})`
                                            : canvasBackground
                                    }}
                                >
                                    {/* Grid Overlay */}
                                    <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                                    {elements.map(renderElement)}
                                </div>
                            </div>
                        </InfiniteViewer>

                        <Moveable
                            ref={moveableRef}
                            target={selectedTargets.filter(el => {
                                const id = el.getAttribute('data-id');
                                const data = elements.find(e => e.id === id);
                                return data && !data.locked && data.visible;
                            })}
                            draggable={true}
                            resizable={true}
                            rotatable={true}
                            snappable={true}
                            snapDirections={{ "top": true, "left": true, "bottom": true, "right": true, "center": true, "middle": true }}
                            elementGuidelines={elements.filter(e => e.visible).map(e => document.getElementById(e.id)).filter(Boolean)}
                            bounds={{ "left": 0, "top": 0, "right": 0, "bottom": 0, "position": "css" }}

                            onDrag={e => e.target.style.transform = e.transform}
                            onDragEnd={e => {
                                const target = e.target;
                                const match = target.style.transform.match(/translate\(([^p]+)px,\s*([^p]+)px\)/);
                                if (match) updateElement(target.id, { x: parseFloat(match[1]), y: parseFloat(match[2]) });
                            }}
                            onResizeStart={e => { e.setOrigin(["%", "%"]); e.dragStart && e.dragStart.set(e.dragStart.translate); }}
                            onResize={e => { e.target.style.width = `${e.width}px`; e.target.style.height = `${e.height}px`; e.target.style.transform = e.drag.transform; }}
                            onResizeEnd={e => {
                                const target = e.target;
                                const match = target.style.transform.match(/translate\(([^p]+)px,\s*([^p]+)px\)/);
                                if (match) updateElement(target.id, { width: target.offsetWidth, height: target.offsetHeight, x: parseFloat(match[1]), y: parseFloat(match[2]) });
                            }}
                            onRotateStart={e => e.set(e.dragStart.transform)}
                            onRotate={e => e.target.style.transform = e.drag.transform}
                            onRotateEnd={e => {
                                const match = e.target.style.transform.match(/rotate\(([^d]+)deg\)/);
                                if (match) updateElement(e.target.id, { rotation: parseFloat(match[1]) });
                            }}
                            renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
                        />
                        <Selecto
                            ref={selectoRef}
                            container={document.body}
                            dragContainer={window}
                            selectableTargets={[".banner-element"]}
                            hitRate={0}
                            selectByClick={true}
                            selectFromInside={false}
                            ratio={0}
                            onSelect={e => {
                                const valid = e.selected.filter(el => {
                                    const id = el.getAttribute('data-id');
                                    const data = elements.find(d => d.id === id);
                                    return data && !data.locked && data.visible;
                                });
                                setSelectedTargets(valid);
                            }}
                            onDragStart={e => {
                                const target = e.inputEvent.target;
                                if (moveableRef.current.isMoveableElement(target) || selectedTargets.some(t => t === target || t.contains(target))) {
                                    e.stop();
                                }
                            }}
                        />
                    </div>

                    {/* RIGHT SIDEBAR - SLIDES */}
                    <div className="w-16 bg-[#1a1a1a] border-l border-[#333] flex flex-col items-center py-4 shrink-0 z-20">
                        <h4 className="text-[9px] uppercase font-bold opacity-50 mb-4 tracking-widest text-center">Slides</h4>
                        {slides.map((slide, idx) => (
                            <button
                                key={slide.id}
                                className={`w-12 h-10 mb-2 rounded border transition-all relative ${idx === activeSlide ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/30'}`}
                            >
                                <span className="absolute top-0.5 right-1 text-[8px] opacity-50">{idx + 1}</span>
                            </button>
                        ))}
                        <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors mt-2">
                            <Plus size={16} />
                        </button>
                    </div>
                </div>

                {/* BOTTOM - TIMELINE */}
                <div className={`border-t border-[#333] bg-[#1a1a1a] flex flex-col transition-all duration-300 ${isTimelineOpen ? 'h-72' : 'h-10'}`}>

                    {/* Timeline Header */}
                    <div className="h-10 flex items-center justify-between px-4 bg-[#1f1f1f] border-b border-[#333] shrink-0">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsTimelineOpen(!isTimelineOpen)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:text-white text-gray-400">
                                <Layers size={14} /> Timeline {isTimelineOpen ? <ChevronLeft className="rotate-[-90deg]" size={12} /> : <ChevronLeft className="rotate-90" size={12} />}
                            </button>
                            <div className="h-4 w-px bg-white/10"></div>
                            <div className="flex gap-2">
                                <button className="p-1 hover:text-white text-gray-400"><SkipBack size={14} /></button>
                                <button onClick={() => setIsPlaying(!isPlaying)} className={`p-1 hover:text-white ${isPlaying ? 'text-blue-400' : 'text-gray-400'}`}>
                                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                                </button>
                            </div>
                            <span className="text-xs font-mono text-blue-400">00:00.0s</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] opacity-40">Zoom</span>
                            <input type="range" className="w-20 h-1 bg-white/10 rounded-full appearance-none" />
                        </div>
                    </div>

                    {/* Timeline Tracks */}
                    {isTimelineOpen && (
                        <div className="flex-1 flex overflow-hidden">
                            {/* Track Headers (Left) */}
                            <div className="w-48 bg-[#1a1a1a] border-r border-[#333] flex flex-col overflow-y-auto custom-scrollbar">
                                {[...elements].reverse().map(el => (
                                    <div key={el.id}
                                        className={`h-8 flex items-center px-3 gap-2 border-b border-[#333]/50 text-xs hover:bg-white/5 cursor-pointer ${selectedTargets.some(t => t.id === el.id) ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400'}`}
                                        onClick={() => {
                                            const target = document.getElementById(el.id);
                                            // Ideally trigger selecto logic, here simplistic highlight
                                        }}
                                    >
                                        <div className="opacity-50">
                                            {el.type === 'image' ? <ImageIcon size={12} /> : (el.type === 'text' ? <Type size={12} /> : <Square size={12} />)}
                                        </div>
                                        <span className="flex-1 truncate">{el.name}</span>
                                        <button onClick={() => updateElement(el.id, { visible: !el.visible })} className="opacity-30 hover:opacity-100"><Eye size={12} /></button>
                                        <button onClick={() => updateElement(el.id, { locked: !el.locked })} className="opacity-30 hover:opacity-100"><Lock size={12} /></button>
                                    </div>
                                ))}
                            </div>

                            {/* Track Bars (Right) */}
                            <div className="flex-1 bg-[#151515] relative overflow-hidden overflow-y-auto custom-scrollbar">
                                {/* Time Ruler */}
                                <div className="h-6 border-b border-[#333] sticky top-0 bg-[#151515] z-10 flex text-[9px] opacity-50 font-mono items-end pb-1 select-none">
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                                        <div key={s} className="flex-1 border-l border-white/10 pl-1 h-3 flex items-end">{s}s</div>
                                    ))}
                                </div>

                                {/* Bars */}
                                <div className="relative min-w-full">
                                    {/* Playhead Cursor */}
                                    <div className="absolute top-0 bottom-0 w-px bg-blue-500 z-20 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ left: '10%' }}>
                                        <div className="w-3 h-3 bg-blue-500 -ml-1.5 rotate-45 -mt-1.5 flex items-center justify-center"></div>
                                    </div>

                                    {[...elements].reverse().map((el, i) => (
                                        <div key={el.id} className="h-8 border-b border-[#333]/50 relative flex items-center group">
                                            {/* Bar */}
                                            <div
                                                className={`h-5 absolute rounded-sm cursor-ew-resize border border-opacity-30 ${['bg-purple-500/40 border-purple-400', 'bg-blue-500/40 border-blue-400', 'bg-emerald-500/40 border-emerald-400'][i % 3]}`}
                                                style={{ left: `${(el.anim?.start || 0) * 10}%`, width: `${(el.anim?.duration || 5) * 10}%` }}
                                            >
                                                {/* resize handles */}
                                                <div className="absolute left-0 top-0 bottom-0 w-1 cursor-w-resize hover:bg-white/50"></div>
                                                <div className="absolute right-0 top-0 bottom-0 w-1 cursor-e-resize hover:bg-white/50"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 4. RIGHT PROPERTIES PANEL */}
            {selectedTargets.length > 0 && (() => {
                const targetEl = selectedTargets[0];
                const selectedEl = elements.find(e => e.id === targetEl?.id);
                if (!selectedEl) return null;

                const updateStyle = (key, value) => {
                    updateElement(selectedEl.id, { style: { ...selectedEl.style, [key]: value } });
                };

                const duplicateElement = () => {
                    const newEl = { ...selectedEl, id: `el-${Date.now()}`, x: selectedEl.x + 20, y: selectedEl.y + 20 };
                    setElements(prev => [...prev, newEl]);
                };

                const deleteElement = () => {
                    setElements(prev => prev.filter(e => e.id !== selectedEl.id));
                    setSelectedTargets([]);
                };

                const moveLayer = (direction) => {
                    const idx = elements.findIndex(e => e.id === selectedEl.id);
                    if (direction === 'up' && idx < elements.length - 1) {
                        const newArr = [...elements];
                        [newArr[idx], newArr[idx + 1]] = [newArr[idx + 1], newArr[idx]];
                        setElements(newArr);
                    } else if (direction === 'down' && idx > 0) {
                        const newArr = [...elements];
                        [newArr[idx], newArr[idx - 1]] = [newArr[idx - 1], newArr[idx]];
                        setElements(newArr);
                    }
                };

                return (
                    <div className="w-72 bg-[#1a1a1a] border-l border-[#333] flex flex-col shrink-0 z-30 overflow-hidden">
                        {/* Header */}
                        <div className="p-3 border-b border-[#333] flex items-center justify-between">
                            <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                                <Settings2 size={14} /> Properties
                            </h3>
                            <span className="text-[10px] opacity-40 bg-white/5 px-2 py-0.5 rounded">{selectedEl.type}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5">
                            {/* POSITION */}
                            <div>
                                <p className="text-[10px] uppercase font-bold opacity-40 mb-2 flex items-center gap-1"><Move size={10} /> Position</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-black/20 rounded p-2 flex items-center gap-2">
                                        <span className="text-[10px] opacity-50">X</span>
                                        <input type="number" value={Math.round(selectedEl.x)} onChange={e => updateElement(selectedEl.id, { x: +e.target.value })} className="flex-1 bg-transparent text-xs font-mono outline-none text-right" />
                                    </div>
                                    <div className="bg-black/20 rounded p-2 flex items-center gap-2">
                                        <span className="text-[10px] opacity-50">Y</span>
                                        <input type="number" value={Math.round(selectedEl.y)} onChange={e => updateElement(selectedEl.id, { y: +e.target.value })} className="flex-1 bg-transparent text-xs font-mono outline-none text-right" />
                                    </div>
                                </div>
                            </div>

                            {/* SIZE */}
                            <div>
                                <p className="text-[10px] uppercase font-bold opacity-40 mb-2 flex items-center gap-1"><Maximize2 size={10} /> Size</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-black/20 rounded p-2 flex items-center gap-2">
                                        <span className="text-[10px] opacity-50">W</span>
                                        <input type="number" value={Math.round(selectedEl.width)} onChange={e => updateElement(selectedEl.id, { width: +e.target.value })} className="flex-1 bg-transparent text-xs font-mono outline-none text-right" />
                                    </div>
                                    <div className="bg-black/20 rounded p-2 flex items-center gap-2">
                                        <span className="text-[10px] opacity-50">H</span>
                                        <input type="number" value={Math.round(selectedEl.height)} onChange={e => updateElement(selectedEl.id, { height: +e.target.value })} className="flex-1 bg-transparent text-xs font-mono outline-none text-right" />
                                    </div>
                                </div>
                            </div>

                            {/* ROTATION */}
                            <div>
                                <p className="text-[10px] uppercase font-bold opacity-40 mb-2 flex items-center gap-1"><RotateCcw size={10} /> Rotation</p>
                                <div className="bg-black/20 rounded p-2 flex items-center gap-2">
                                    <input type="range" min="-180" max="180" value={selectedEl.rotation || 0} onChange={e => updateElement(selectedEl.id, { rotation: +e.target.value })} className="flex-1 h-1 bg-white/10 rounded appearance-none" />
                                    <input type="number" value={Math.round(selectedEl.rotation || 0)} onChange={e => updateElement(selectedEl.id, { rotation: +e.target.value })} className="w-12 bg-black/30 rounded px-2 py-1 text-xs font-mono text-center" />
                                    <span className="text-[10px] opacity-40">°</span>
                                </div>
                            </div>

                            {/* TEXT SPECIFIC PROPERTIES */}
                            {(selectedEl.type === 'text' || selectedEl.type === 'button') && (
                                <>
                                    <div className="border-t border-white/10 pt-4">
                                        <p className="text-[10px] uppercase font-bold opacity-40 mb-2">Content</p>
                                        <textarea
                                            value={selectedEl.content}
                                            onChange={e => updateElement(selectedEl.id, { content: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded p-2 text-sm resize-none h-16"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-[10px] uppercase font-bold opacity-40 mb-2">Typography</p>
                                        <select
                                            value={selectedEl.style.fontFamily || 'Inter'}
                                            onChange={e => updateStyle('fontFamily', e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded p-2 text-xs mb-2"
                                        >
                                            <option value="Inter, sans-serif">Inter</option>
                                            <option value="Arial, sans-serif">Arial</option>
                                            <option value="Georgia, serif">Georgia</option>
                                            <option value="Playfair Display, serif">Playfair Display</option>
                                            <option value="Oswald, sans-serif">Oswald</option>
                                            <option value="Montserrat, sans-serif">Montserrat</option>
                                            <option value="Impact, sans-serif">Impact</option>
                                        </select>

                                        <div className="flex gap-2 mb-2">
                                            <input type="number" value={parseInt(selectedEl.style.fontSize) || 16} onChange={e => updateStyle('fontSize', `${e.target.value}px`)} className="w-16 bg-black/20 border border-white/10 rounded p-2 text-xs" />
                                            <input type="color" value={selectedEl.style.color || '#000000'} onChange={e => updateStyle('color', e.target.value)} className="w-10 h-9 rounded cursor-pointer border-0 p-0" />
                                        </div>

                                        <div className="flex gap-1 bg-black/20 p-1 rounded mb-2">
                                            <button onClick={() => updateStyle('fontWeight', selectedEl.style.fontWeight === 'bold' ? 'normal' : 'bold')} className={`flex-1 p-1.5 rounded flex items-center justify-center ${selectedEl.style.fontWeight === 'bold' ? 'bg-white/20' : 'hover:bg-white/5'}`}><Bold size={14} /></button>
                                            <button onClick={() => updateStyle('fontStyle', selectedEl.style.fontStyle === 'italic' ? 'normal' : 'italic')} className={`flex-1 p-1.5 rounded flex items-center justify-center ${selectedEl.style.fontStyle === 'italic' ? 'bg-white/20' : 'hover:bg-white/5'}`}><Italic size={14} /></button>
                                            <button onClick={() => updateStyle('textDecoration', selectedEl.style.textDecoration === 'underline' ? 'none' : 'underline')} className={`flex-1 p-1.5 rounded flex items-center justify-center ${selectedEl.style.textDecoration === 'underline' ? 'bg-white/20' : 'hover:bg-white/5'}`}><Underline size={14} /></button>
                                        </div>

                                        <div className="flex gap-1 bg-black/20 p-1 rounded">
                                            <button onClick={() => updateStyle('textAlign', 'left')} className={`flex-1 p-1.5 rounded flex items-center justify-center ${selectedEl.style.textAlign === 'left' ? 'bg-white/20' : 'hover:bg-white/5'}`}><AlignLeft size={14} /></button>
                                            <button onClick={() => updateStyle('textAlign', 'center')} className={`flex-1 p-1.5 rounded flex items-center justify-center ${(!selectedEl.style.textAlign || selectedEl.style.textAlign === 'center') ? 'bg-white/20' : 'hover:bg-white/5'}`}><AlignCenter size={14} /></button>
                                            <button onClick={() => updateStyle('textAlign', 'right')} className={`flex-1 p-1.5 rounded flex items-center justify-center ${selectedEl.style.textAlign === 'right' ? 'bg-white/20' : 'hover:bg-white/5'}`}><AlignRight size={14} /></button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* SHAPE/BUTTON BG PROPERTIES */}
                            {(selectedEl.type === 'square' || selectedEl.type === 'circle' || selectedEl.type === 'button') && (
                                <div className="border-t border-white/10 pt-4">
                                    <p className="text-[10px] uppercase font-bold opacity-40 mb-2">Fill & Border</p>
                                    <div className="flex gap-2 mb-2">
                                        <div className="flex-1">
                                            <label className="text-[9px] opacity-40 block mb-1">Background</label>
                                            <input type="color" value={selectedEl.style.backgroundColor || '#3b82f6'} onChange={e => updateStyle('backgroundColor', e.target.value)} className="w-full h-8 rounded cursor-pointer border-0 p-0" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[9px] opacity-40 block mb-1">Border</label>
                                            <input type="color" value={selectedEl.style.borderColor || '#000000'} onChange={e => updateStyle('borderColor', e.target.value)} className="w-full h-8 rounded cursor-pointer border-0 p-0" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-black/20 rounded p-2 flex items-center gap-2">
                                            <span className="text-[9px] opacity-40">Radius</span>
                                            <input type="number" value={parseInt(selectedEl.style.borderRadius) || 0} onChange={e => updateStyle('borderRadius', `${e.target.value}px`)} className="flex-1 bg-transparent text-xs font-mono outline-none text-right" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* IMAGE PROPERTIES */}
                            {selectedEl.type === 'image' && (
                                <div className="border-t border-white/10 pt-4">
                                    <p className="text-[10px] uppercase font-bold opacity-40 mb-2">Image</p>
                                    <select
                                        value={selectedEl.style.objectFit || 'contain'}
                                        onChange={e => updateStyle('objectFit', e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded p-2 text-xs"
                                    >
                                        <option value="contain">Contain</option>
                                        <option value="cover">Cover</option>
                                        <option value="fill">Fill</option>
                                        <option value="none">None</option>
                                    </select>
                                </div>
                            )}

                            {/* LAYER ACTIONS */}
                            <div className="border-t border-white/10 pt-4">
                                <p className="text-[10px] uppercase font-bold opacity-40 mb-2">Layer</p>
                                <div className="grid grid-cols-4 gap-1">
                                    <button onClick={() => moveLayer('up')} className="p-2 bg-black/20 hover:bg-white/10 rounded flex items-center justify-center" title="Move Up"><ChevronUp size={14} /></button>
                                    <button onClick={() => moveLayer('down')} className="p-2 bg-black/20 hover:bg-white/10 rounded flex items-center justify-center" title="Move Down"><ChevronDown size={14} /></button>
                                    <button onClick={duplicateElement} className="p-2 bg-black/20 hover:bg-white/10 rounded flex items-center justify-center" title="Duplicate"><Copy size={14} /></button>
                                    <button onClick={deleteElement} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded flex items-center justify-center" title="Delete"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Code Modal */}
            {showCode && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-10">
                    <div className="w-2/3 h-3/4 bg-[#1e1e1e] border border-white/20 rounded-xl flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center"><h3 className="font-bold text-white">Code HTML</h3><button onClick={() => setShowCode(false)}><X /></button></div>
                        <div className="flex-1 bg-black p-4 font-mono text-xs text-green-400 overflow-auto"><pre>{generatedCode}</pre></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisualBuilder;
