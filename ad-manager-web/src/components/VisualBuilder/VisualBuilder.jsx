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
    Bold, Italic, Underline, ChevronUp, ChevronDown, RotateCcw, Maximize2, MoveHorizontal, MoveVertical,
    Save, FolderOpen, Moon, Sun, Monitor, Link, CopyPlus, Star, Heart, Bell, ShoppingCart, ShoppingBag, Tag, CreditCard, Truck, Home, User, Mail, Phone, Paintbrush, Activity, UploadCloud, Film, MapPin, Search, Facebook, Sparkles, Camera, Triangle, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VisualBuilder = () => {
    const { theme } = useTheme();
    const { selectedTemplate, setIsVisualEditorOpen, addTemplateToConfig } = useMapping();

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

    // Studio Theme (dark/light)
    const [studioTheme, setStudioTheme] = useState('dark');

    // Background Panel
    const [bgTab, setBgTab] = useState('colors');
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [bgImageOpacity, setBgImageOpacity] = useState(1);

    // Elements Library Sub-views
    const [elementsSubView, setElementsSubView] = useState(null); // 'shapes', 'icons', etc.
    const [elementsSearch, setElementsSearch] = useState('');
    const [templateSearch, setTemplateSearch] = useState('');

    // Contextual Toolbar
    const [toolbarPosition, setToolbarPosition] = useState(null);

    // Builder Mode: 'editor', 'preview', 'code'
    const [builderMode, setBuilderMode] = useState('editor');

    // -- REFS --
    const moveableRef = useRef(null);
    const selectoRef = useRef(null);
    const viewerRef = useRef(null);
    const containerRef = useRef(null);

    // Animation Loop
    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTime(prev => (prev >= 10 ? 0 : prev + 0.1));
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

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

    // Multi-size Template Presets
    const templatePresets = [
        {
            name: 'Leaderboard Flash', width: 728, height: 90,
            elements: [
                { type: 'square', x: 0, y: 0, width: 728, height: 90, style: { background: 'linear-gradient(90deg, #1e3a8a, #3b82f6)' } },
                { type: 'text', content: 'SEASON SALE', x: 20, y: 15, width: 200, height: 30, style: { color: '#ffffff', fontSize: '24px', fontWeight: '900' } },
                { type: 'text', content: 'UP TO 50% OFF', x: 20, y: 45, width: 200, height: 20, style: { color: '#ffffff', fontSize: '14px', fontWeight: 'bold', opacity: 0.8 } },
                { type: 'button', content: 'SHOP NOW', x: 550, y: 25, width: 140, height: 40, style: { backgroundColor: '#ffffff', color: '#1e3a8a', borderRadius: '4px', fontWeight: 'bold' } }
            ]
        },
        {
            name: 'Square Promo', width: 300, height: 250,
            elements: [
                { type: 'square', x: 0, y: 0, width: 300, height: 250, style: { background: '#f8fafc' } },
                { type: 'text', content: 'New Arrivals', x: 10, y: 40, width: 280, height: 40, style: { fontSize: '28px', fontWeight: '900', color: '#0f172a' } },
                { type: 'text', content: 'Collection 2026', x: 10, y: 80, width: 280, height: 20, style: { fontSize: '16px', color: '#64748b' } },
                { type: 'square', x: 0, y: 150, width: 300, height: 100, style: { backgroundColor: '#3b82f6' } },
                { type: 'button', content: 'VIEW MORE', x: 80, y: 180, width: 140, height: 40, style: { backgroundColor: '#ffffff', color: '#3b82f6', borderRadius: '50px', fontWeight: 'bold' } }
            ]
        },
        {
            name: 'Skyscraper Elite', width: 160, height: 600,
            elements: [
                { type: 'square', x: 0, y: 0, width: 160, height: 600, style: { background: 'linear-gradient(to bottom, #111827, #1f2937)' } },
                { type: 'text', content: 'PREMIUM', x: 10, y: 50, width: 140, height: 30, style: { color: '#fbbf24', fontSize: '18px', fontWeight: '900', letterSpacing: '4px' } },
                { type: 'text', content: 'QUALITY', x: 10, y: 80, width: 140, height: 30, style: { color: '#ffffff', fontSize: '18px', fontWeight: '900', letterSpacing: '4px' } },
                { type: 'square', x: 30, y: 150, width: 100, height: 250, style: { background: '#ffffff20', borderRadius: '8px' } },
                { type: 'text', content: 'Limited Edition', x: 10, y: 450, width: 140, height: 40, style: { color: '#ffffff', fontSize: '14px', textAlign: 'center' } },
                { type: 'button', content: 'BUY', x: 30, y: 520, width: 100, height: 40, style: { backgroundColor: '#fbbf24', color: '#000000', borderRadius: '4px', fontWeight: 'bold' } }
            ]
        },
        {
            name: 'Billboard Premium', width: 970, height: 90,
            elements: [
                { type: 'square', x: 0, y: 0, width: 970, height: 90, style: { background: '#ffffff' } },
                { type: 'square', x: 0, y: 0, width: 300, height: 90, style: { background: '#f3f4f6' } },
                { type: 'text', content: 'UPGRADE YOUR STYLE', x: 320, y: 15, width: 400, height: 30, style: { fontSize: '24px', fontWeight: '900', color: '#111827', textAlign: 'left' } },
                { type: 'text', content: 'Discover our latest accessories collection.', x: 320, y: 45, width: 400, height: 20, style: { fontSize: '14px', color: '#4b5563', textAlign: 'left' } },
                { type: 'button', content: 'SHOP NOW', x: 750, y: 25, width: 180, height: 40, style: { backgroundColor: '#111827', color: '#ffffff', borderRadius: '4px', fontWeight: 'bold' } }
            ]
        },
        {
            name: 'Mobile Banner', width: 320, height: 50,
            elements: [
                { type: 'square', x: 0, y: 0, width: 320, height: 50, style: { background: '#ef4444' } },
                { type: 'text', content: 'HOT DEALS!', x: 10, y: 10, width: 180, height: 30, style: { color: '#ffffff', fontSize: '20px', fontWeight: '900', textAlign: 'left' } },
                { type: 'button', content: 'GO', x: 230, y: 10, width: 80, height: 30, style: { backgroundColor: '#ffffff', color: '#ef4444', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' } }
            ]
        }
    ];


    const applyTemplate = (tpl) => {
        setCanvasSize({ width: tpl.width, height: tpl.height });
        const newElements = tpl.elements.map((el, i) => ({
            ...el,
            id: `el-tpl-${Date.now()}-${i}`,
            visible: true,
            locked: false,
            anim: { start: 0, duration: 5 },
            style: { ...el.style, zIndex: i + 1 }
        }));
        setElements(newElements);
        setSelectedTargets([]);
    };

    // -- AUTO LOAD TEMPLATE --
    useEffect(() => {
        if (!selectedTemplate) {
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
            return;
        }

        // Try to find a matching preset
        const matchingPreset = templatePresets.find(p =>
            p.name.toLowerCase().includes(selectedTemplate.name.toLowerCase()) ||
            selectedTemplate.name.toLowerCase().includes(p.name.toLowerCase()) ||
            (selectedTemplate.size === `${p.width}x${p.height}`)
        );

        if (matchingPreset) {
            applyTemplate(matchingPreset);
        } else {
            // Fallback: Create a basic template based on size
            const [w, h] = selectedTemplate.size.split('x').map(Number);
            setCanvasSize({ width: w, height: h });
            setElements([
                {
                    id: 'el-base-bg',
                    type: 'square',
                    name: 'Background',
                    x: 0, y: 0, width: w, height: h,
                    visible: true, locked: true,
                    style: { backgroundColor: '#ffffff', zIndex: 0 }
                },
                {
                    id: 'el-base-text',
                    type: 'text',
                    name: 'Template Name',
                    content: selectedTemplate.name,
                    x: 20, y: 20, width: w - 40, height: 40,
                    visible: true, locked: false,
                    style: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center', zIndex: 1 }
                }
            ]);
            setSelectedTargets([]);
        }
    }, [selectedTemplate]);

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

        if (type === 'square' || type === 'circle' || type === 'shape') {
            newEl.type = type === 'shape' ? (preset?.type || 'square') : type;
            newEl.name = preset?.name || (newEl.type === 'circle' ? 'Cercle' : 'Forme');
            newEl.width = preset?.width || 100;
            newEl.height = preset?.height || 100;
            newEl.style = {
                ...newEl.style,
                backgroundColor: preset?.style?.backgroundColor || (newEl.type === 'circle' ? '#ef4444' : '#3b82f6'),
                borderRadius: newEl.type === 'circle' ? '50%' : (preset?.style?.borderRadius || '0')
            };
            if (preset?.content) newEl.content = preset.content;
            if (preset?.icon) newEl.icon = preset.icon;
        }

        if (type === 'image') {
            newEl.name = preset?.name || 'Image';
            newEl.src = preset?.src || 'https://via.placeholder.com/150';
            newEl.style = { ...newEl.style, objectFit: 'contain' };
        }

        if (type === 'ecommerce' || type === 'icon') {
            newEl.type = type;
            newEl.name = preset?.name || (type === 'ecommerce' ? 'Promo' : 'Icon');
            newEl.width = preset?.width || (type === 'icon' ? 50 : 120);
            newEl.height = preset?.height || (type === 'icon' ? 50 : 40);
            newEl.content = preset?.content;
            newEl.icon = preset?.icon;
            newEl.style = {
                ...newEl.style,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...preset?.style
            };
        }

        if (preset?.gradient) {
            newEl.style.background = preset.gradient;
        }

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

    // -- SAVE/LOAD PROJECT --
    const saveProject = () => {
        const project = {
            canvasSize,
            canvasBackground,
            gradientEnabled,
            gradientColor2,
            gradientType,
            gradientDirection,
            elements,
            savedAt: new Date().toISOString()
        };
        const projectName = prompt('Nom du projet:', `Banner_${Date.now()}`);
        if (projectName) {
            const saved = JSON.parse(localStorage.getItem('visualBuilderProjects') || '{}');
            saved[projectName] = project;
            localStorage.setItem('visualBuilderProjects', JSON.stringify(saved));
            alert(`Projet "${projectName}" sauvegardé!`);
        }
    };

    const loadProject = () => {
        const saved = JSON.parse(localStorage.getItem('visualBuilderProjects') || '{}');
        const names = Object.keys(saved);
        if (names.length === 0) {
            alert('Aucun projet sauvegardé.');
            return;
        }
        const choice = prompt(`Projets disponibles:\n${names.join('\n')}\n\nEntrez le nom du projet à charger:`);
        if (choice && saved[choice]) {
            const p = saved[choice];
            setCanvasSize(p.canvasSize);
            setCanvasBackground(p.canvasBackground);
            setGradientEnabled(p.gradientEnabled);
            setGradientColor2(p.gradientColor2);
            setGradientType(p.gradientType || 'linear');
            setGradientDirection(p.gradientDirection || 'to right');
            setElements(p.elements);
            setSelectedTargets([]);
            alert(`Projet "${choice}" chargé!`);
        }
    };

    // -- GENERATE HTML -- 
    const getGeneratedHTML = (width = canvasSize.width, height = canvasSize.height, customElements = elements) => {
        const bgStyle = gradientEnabled
            ? `background: ${gradientType}-gradient(${gradientDirection}, ${canvasBackground}, ${gradientColor2});`
            : `background: ${canvasBackground};`;

        const elementsHTML = customElements
            .filter(el => el.visible)
            .map(el => {
                const commonStyle = `
                    position: absolute;
                    left: ${el.x}px;
                    top: ${el.y}px;
                    width: ${el.width}px;
                    height: ${el.height}px;
                    transform: rotate(${el.rotation || 0}deg);
                    ${el.style.opacity !== undefined ? `opacity: ${el.style.opacity};` : ''}
                    ${el.style.boxShadow ? `box-shadow: ${el.style.boxShadow};` : ''}
                    ${el.style.borderWidth ? `border: ${el.style.borderWidth} ${el.style.borderStyle || 'solid'} ${el.style.borderColor || '#000'};` : ''}
                `.trim();

                if (el.type === 'text') {
                    return `    <div style="${commonStyle}
                        font-size: ${el.style.fontSize || '16px'};
                        font-family: ${el.style.fontFamily || 'Inter, sans-serif'};
                        font-weight: ${el.style.fontWeight || 'normal'};
                        font-style: ${el.style.fontStyle || 'normal'};
                        color: ${el.style.color || '#000'};
                        text-align: ${el.style.textAlign || 'center'};
                        text-decoration: ${el.style.textDecoration || 'none'};
                        display: flex;
                        align-items: center;
                        justify-content: ${el.style.textAlign === 'left' ? 'flex-start' : el.style.textAlign === 'right' ? 'flex-end' : 'center'};
                    ">${el.content}</div>`;
                }

                if (el.type === 'button') {
                    return `    <a href="#" style="${commonStyle}
                        background-color: ${el.style.backgroundColor || '#3b82f6'};
                        color: ${el.style.color || '#fff'};
                        border-radius: ${el.style.borderRadius || '4px'};
                        font-size: ${el.style.fontSize || '14px'};
                        font-weight: ${el.style.fontWeight || 'bold'};
                        text-decoration: none;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                    ">${el.content}</a>`;
                }

                if (el.type === 'square' || el.type === 'circle') {
                    return `    <div style="${commonStyle}
                        background-color: ${el.style.backgroundColor || '#3b82f6'};
                        border-radius: ${el.style.borderRadius || '0'};
                    "></div>`;
                }

                if (el.type === 'image') {
                    return `    <img src="${el.src}" alt="${el.name}" style="${commonStyle}
                        object-fit: ${el.style.objectFit || 'contain'};
                    " />`;
                }

                return '';
            })
            .join('\n');

        return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Banner - ${width}x${height}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .banner-container {
            position: relative;
            width: ${width}px;
            height: ${height}px;
            ${bgStyle}
            overflow: hidden;
            font-family: Inter, sans-serif;
        }
    </style>
</head>
<body>
<div class="banner-container">
${elementsHTML}
</div>
</body>
</html>`;
    };

    const generateHTML = () => {
        const html = getGeneratedHTML();
        setGeneratedCode(html);
        setShowCode(true);
    };

    const saveToLibrary = async (name = selectedTemplate?.name || 'Studio Custom', w = canvasSize.width, h = canvasSize.height, customElements = elements) => {
        const htmlContent = getGeneratedHTML(w, h, customElements);
        const sizeString = `${w}x${h}`;

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const response = await fetch(`${API_URL}/banners/template`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    category: 'studio',
                    size: sizeString,
                    htmlContent
                })
            });

            if (response.ok) {
                const newTemplate = await response.json();
                console.log('Template saved to library:', newTemplate);
                // Update local config if needed
                if (typeof addTemplateToConfig === 'function') {
                    addTemplateToConfig(newTemplate);
                }
                return true;
            } else {
                console.error('Failed to save template');
                return false;
            }
        } catch (err) {
            console.error('Error saving template:', err);
            return false;
        }
    };

    const savePack = async () => {
        const standardSizes = [
            { w: 728, h: 90 },
            { w: 300, h: 250 },
            { w: 160, h: 600 },
            { w: 970, h: 90 },
            { w: 320, h: 50 },
            { w: 970, h: 250 },
            { w: 300, h: 600 }
        ];

        const packName = selectedTemplate?.name || 'Studio Pack';
        let successCount = 0;

        for (const size of standardSizes) {
            // Proportional scaling logic
            const scaleX = size.w / canvasSize.width;
            const scaleY = size.h / canvasSize.height;

            const scaledElements = elements.map(el => ({
                ...el,
                x: Math.round(el.x * scaleX),
                y: Math.round(el.y * scaleY),
                width: Math.round(el.width * scaleX),
                height: Math.round(el.height * scaleY),
                // Font size scaling if text
                style: {
                    ...el.style,
                    fontSize: el.style?.fontSize ? `${Math.round(parseInt(el.style.fontSize) * scaleX)}px` : el.style?.fontSize
                }
            }));

            const ok = await saveToLibrary(`${packName} ${size.w}x${size.h}`, size.w, size.h, scaledElements);
            if (ok) successCount++;
        }

        alert(`Pack enregistré ! ${successCount} tailles sauvegardées dans la bibliothèque.`);
    };

    const downloadHTML = () => {
        generateHTML();
        setTimeout(() => {
            const blob = new Blob([generatedCode], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `banner-${canvasSize.width}x${canvasSize.height}.html`;
            a.click();
            URL.revokeObjectURL(url);
        }, 100);
    };

    // -- RENDERERS --
    const renderElement = (el) => {
        if (!el || !el.visible) return null;

        const animStart = el.anim?.start || 0;
        const animDuration = el.anim?.duration || 5;
        const isVisibleAtTime = currentTime >= animStart && currentTime <= (animStart + animDuration);

        const elStyle = el.style || {};
        const commonStyle = {
            position: 'absolute',
            left: '0', top: '0',
            width: `${el.width || 100}px`,
            height: `${el.height || 100}px`,
            transform: `translate(${el.x || 0}px, ${el.y || 0}px) rotate(${el.rotation || 0}deg)`,
            ...elStyle,
            opacity: !isVisibleAtTime ? 0 : (el.locked ? 0.8 : (elStyle.opacity || 1)),
            display: !isVisibleAtTime ? 'none' : 'flex',
            transition: 'opacity 0.2s ease-in-out'
        };

        const renderContent = () => {
            switch (el.type) {
                case 'text':
                case 'button':
                    return (
                        <div className="w-full h-full flex items-center justify-center pointer-events-none whitespace-pre-wrap leading-tight">
                            {typeof el.content === 'string' ? el.content : ''}
                        </div>
                    );
                case 'square':
                case 'circle':
                case 'shape':
                    return (
                        <div className="w-full h-full pointer-events-none flex items-center justify-center" style={{ ...elStyle, backgroundColor: elStyle.backgroundColor }}>
                            {el.icon && <el.icon size="80%" className="opacity-80" />}
                            {typeof el.content === 'string' ? el.content : ''}
                        </div>
                    );
                case 'ecommerce':
                case 'icon':
                    return (
                        <div className="w-full h-full pointer-events-none flex items-center justify-center overflow-hidden" style={elStyle}>
                            {el.icon && <el.icon size="100%" />}
                            {typeof el.content === 'string' ? el.content : ''}
                        </div>
                    );
                case 'image':
                    return (
                        <img src={el.src || ''} className="w-full h-full pointer-events-none" style={{ objectFit: elStyle.objectFit || 'contain' }} alt="" />
                    );
                default:
                    return null;
            }
        };

        return (
            <div
                key={el.id}
                className={`absolute banner-element group ${selectedTargets.some(t => t.id === el.id) ? '' : 'hover:outline hover:outline-1 hover:outline-blue-400'}`}
                style={commonStyle}
                data-id={el.id}
                id={el.id}
            >
                {renderContent()}
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
        <div className={`flex h-full w-full ${studioTheme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-[#1e1e1e] text-gray-100'} overflow-hidden font-sans transition-colors`}>
            {/* 1. LEFT TOOLBAR */}
            {builderMode === 'editor' && (
                <div className={`w-16 ${studioTheme === 'light' ? 'bg-white border-gray-200' : 'bg-[#121212] border-[#333]'} border-r flex flex-col items-center py-4 z-40 shrink-0`}>
                    <div className="mb-4">
                        <button onClick={() => setIsVisualEditorOpen(false)} className={`w-10 h-10 flex items-center justify-center rounded-full ${studioTheme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-white/10 text-white'}`}>
                            <ChevronLeft size={20} />
                        </button>
                    </div>
                    {tools.map(tool => (
                        <button
                            key={tool.id}
                            onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
                            className={`w-12 h-12 mb-2 flex flex-col items-center justify-center rounded-lg transition-all ${activeTool === tool.id ? 'bg-blue-600 text-white shadow-lg' : studioTheme === 'light' ? 'text-gray-500 hover:text-gray-800 hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-[#222]'}`}
                        >
                            <tool.icon size={18} className="mb-0.5" />
                            <span className="text-[9px] font-medium">{tool.label}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* 2. DRAWER (Content of active tool) */}
            <AnimatePresence initial={false}>
                {activeTool && builderMode === 'editor' && (
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
                                <div className="flex flex-col h-full bg-[#1e1e1e]">
                                    <div className="p-4 border-b border-white/5 space-y-3">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">Template Presets</h3>
                                        <div className="relative">
                                            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
                                            <input
                                                type="text"
                                                placeholder="Search templates..."
                                                value={templateSearch}
                                                onChange={e => setTemplateSearch(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-1.5 text-[11px] outline-none focus:border-blue-500/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                                        {templatePresets
                                            .filter(tpl => tpl.name.toLowerCase().includes(templateSearch.toLowerCase()))
                                            .map((tpl, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => applyTemplate(tpl)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden group hover:border-blue-500/50 transition-all text-left flex flex-col"
                                                >
                                                    <div className="aspect-video bg-black/40 relative flex items-center justify-center overflow-hidden">
                                                        <div
                                                            className="shadow-lg transform scale-[0.12] origin-center"
                                                            style={{
                                                                width: tpl.width,
                                                                height: tpl.height,
                                                                background: tpl.elements[0]?.style?.background || '#fff'
                                                            }}
                                                        ></div>
                                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Plus className="text-white" size={24} />
                                                        </div>
                                                    </div>
                                                    <div className="p-3">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <p className="text-[11px] font-bold text-white truncate">{tpl.name}</p>
                                                        </div>
                                                        <p className="text-[9px] text-white/30 uppercase tracking-tighter">{tpl.width} x {tpl.height} PX</p>
                                                    </div>
                                                </button>
                                            ))}
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
                                {/* ELEMENTS DRAWER - CATEGORICAL GRID */}
                                {activeTool === 'elements' && (
                                    <div className="flex flex-col h-full">
                                        {elementsSubView ? (
                                            <div className="flex flex-col h-full">
                                                <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
                                                    <button onClick={() => setElementsSubView(null)} className="p-1 hover:bg-white/5 rounded transition-colors text-gray-400 hover:text-white">
                                                        <ChevronLeft size={16} />
                                                    </button>
                                                    <h4 className="text-xs font-bold uppercase tracking-wider">{elementsSubView}</h4>
                                                </div>
                                                <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                                                    {elementsSubView === 'shapes' && (
                                                        <div className="grid grid-cols-3 gap-3">
                                                            <button onClick={() => addElement('square')} className="aspect-square bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center border border-white/5 group transition-all">
                                                                <div className="w-10 h-10 bg-blue-500 rounded-sm group-hover:scale-110 transition-transform"></div>
                                                            </button>
                                                            <button onClick={() => addElement('circle')} className="aspect-square bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center border border-white/5 group transition-all">
                                                                <div className="w-10 h-10 bg-red-500 rounded-full group-hover:scale-110 transition-transform"></div>
                                                            </button>
                                                            <button onClick={() => addElement('square', { width: 150, height: 75 })} className="aspect-square bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center border border-white/5 group transition-all">
                                                                <div className="w-12 h-6 bg-emerald-500 rounded-sm group-hover:scale-110 transition-transform"></div>
                                                            </button>
                                                            <button onClick={() => addElement('square', { radius: '10px' })} className="aspect-square bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center border border-white/5 group transition-all">
                                                                <div className="w-10 h-10 border-2 border-dashed border-white/20 rounded-xl group-hover:scale-110 transition-transform"></div>
                                                            </button>
                                                        </div>
                                                    )}
                                                    {elementsSubView === 'icons' && (
                                                        <div className="grid grid-cols-4 gap-2">
                                                            {[Star, Heart, Bell, ShoppingCart, Home, User, Mail, Phone, MapPin, Search, Calendar, Camera].map((Icon, i) => (
                                                                <button key={i} onClick={() => addElement('square', { type: 'icon', icon: Icon })} className="aspect-square bg-white/5 hover:bg-white/10 rounded flex items-center justify-center border border-white/5 transition-colors">
                                                                    <Icon size={20} className="text-white/60" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {elementsSubView === 'ecommerce' && (
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {/* Multi-color Gradient Buttons */}
                                                            <button
                                                                onClick={() => addElement('ecommerce', { name: 'Promo Button', content: 'SHOP NOW', style: { background: 'linear-gradient(135deg, #f97316, #ec4899)', color: '#fff', borderRadius: '50px', fontWeight: 'bold' } })}
                                                                className="h-10 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg"
                                                                style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
                                                            >
                                                                GRADIENT
                                                            </button>
                                                            <button
                                                                onClick={() => addElement('ecommerce', { name: 'Cart Link', content: 'ADD TO CART', style: { border: '2px solid #000', borderRadius: '4px', fontWeight: 'black' } })}
                                                                className="h-10 border-2 border-black rounded flex items-center justify-center text-[10px] font-black"
                                                            >
                                                                OUTLINE
                                                            </button>

                                                            {/* Ecommerce Icons */}
                                                            {[ShoppingCart, ShoppingBag, Tag, CreditCard, Truck, Star].map((Icon, i) => (
                                                                <button key={i} onClick={() => addElement('square', { type: 'icon', icon: Icon })} className="aspect-square bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center border border-white/5 transition-colors">
                                                                    <Icon size={24} className="text-white/60" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {elementsSubView === 'photos' && (
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {[
                                                                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
                                                                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
                                                                'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&h=200&fit=crop',
                                                                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
                                                                'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop',
                                                                'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200&h=200&fit=crop'
                                                            ].map((url, i) => (
                                                                <button key={i} onClick={() => addElement('image', { name: 'Photo', src: url })} className="aspect-square bg-white/5 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all">
                                                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {elementsSubView === 'videos' && (
                                                        <div className="flex flex-col items-center justify-center h-48 opacity-20">
                                                            <Film size={48} />
                                                            <p className="text-[10px] mt-4 font-bold text-center">Video stock library integration<br />coming soon!</p>
                                                        </div>
                                                    )}
                                                    {elementsSubView === 'masks' && (
                                                        <div className="grid grid-cols-3 gap-3">
                                                            {['circle', 'square', 'squircle'].map((m, i) => (
                                                                <button key={i} onClick={() => addElement('square', { name: `Mask ${m}`, style: { borderRadius: m === 'circle' ? '50%' : m === 'squircle' ? '30px' : '0', background: '#e2e8f0', opacity: 0.5 } })} className="aspect-square bg-white/5 rounded-xl flex items-center justify-center border border-white/5 hover:bg-white/10 transition-all">
                                                                    <div className={`w-12 h-12 bg-white/20 ${m === 'circle' ? 'rounded-full' : m === 'squircle' ? 'rounded-2xl' : 'rounded-none'}`}></div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {elementsSubView === 'lines' && (
                                                        <div className="space-y-4">
                                                            {[
                                                                { name: 'Solid Line', style: { height: '2px', background: '#fff' } },
                                                                { name: 'Dashed Line', style: { height: '2px', borderBottom: '2px dashed #fff', background: 'transparent' } },
                                                                { name: 'Thick Line', style: { height: '6px', background: '#fff', borderRadius: '3px' } }
                                                            ].map((line, i) => (
                                                                <button key={i} onClick={() => addElement('square', { name: line.name, width: 250, height: parseInt(line.style.height), style: line.style })} className="w-full h-12 bg-white/5 rounded-lg flex items-center justify-center px-4 hover:bg-white/10 transition-all">
                                                                    <div className="w-full" style={line.style}></div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {elementsSubView === 'illustrations' && (
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {[Sparkles, Star, Heart, Flame, Zap].map((Icon, i) => (
                                                                <button key={i} onClick={() => addElement('square', { name: 'Illustration', style: { background: 'transparent' }, content: <Icon size={64} className="text-yellow-400" /> })} className="aspect-square bg-white/5 rounded-xl flex items-center justify-center border border-white/5 hover:bg-white/10 transition-all">
                                                                    <Icon size={32} className="text-white/40" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {elementsSubView === 'logos' && (
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {[Facebook, Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
                                                                <button key={i} onClick={() => addElement('square', { name: 'Social Logo', style: { background: 'transparent' } })} className="aspect-square bg-gray-100 rounded flex items-center justify-center hover:ring-2 hover:ring-blue-500 transition-all">
                                                                    <Icon size={24} className="text-gray-800" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {/* Other category placeholders */}
                                                    {!['shapes', 'icons', 'ecommerce', 'photos', 'videos', 'masks', 'lines', 'illustrations', 'logos'].includes(elementsSubView) && (
                                                        <div className="flex flex-col items-center justify-center h-48 opacity-20">
                                                            <Shapes size={48} />
                                                            <p className="text-[10px] mt-4 font-bold">More {elementsSubView} coming soon!</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col h-full">
                                                {/* Search Bar */}
                                                <div className="px-4 py-3 border-b border-white/10 flex flex-col gap-3">
                                                    <div className="relative group">
                                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" />
                                                        <input
                                                            type="text"
                                                            placeholder="Search elements"
                                                            value={elementsSearch}
                                                            onChange={e => setElementsSearch(e.target.value)}
                                                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-20 py-2 text-xs outline-none focus:border-blue-500/50 transition-colors"
                                                        />
                                                        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center h-[calc(100%-8px)]">
                                                            <div className="w-px h-full bg-white/10 mx-2"></div>
                                                            <select className="bg-transparent text-[10px] font-bold opacity-60 outline-none pr-1 cursor-pointer hover:opacity-100">
                                                                <option>All</option>
                                                                <option>Graphics</option>
                                                                <option>Photos</option>
                                                                <option>Videos</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                                                    {elementsSearch.length > 0 ? (
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-[10px] uppercase font-bold opacity-40 tracking-wider">Search Results</p>
                                                                <button onClick={() => setElementsSearch('')} className="text-[10px] text-blue-500 hover:underline">Clear</button>
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-2">
                                                                {/* Example search results logic: simple filtering across some categories */}
                                                                {['Shape', 'Icon', 'Circle', 'Square', 'Promo', 'Button', 'Text', 'Photo', 'Star'].filter(c => c.toLowerCase().includes(elementsSearch.toLowerCase())).map((item, i) => (
                                                                    <button key={i} onClick={() => addElement(item.toLowerCase() === 'photo' ? 'image' : (['square', 'circle'].includes(item.toLowerCase()) ? item.toLowerCase() : 'square'))} className="aspect-square bg-white/5 hover:bg-white/10 rounded-lg flex flex-col items-center justify-center border border-white/5 transition-all gap-1">
                                                                        <Search size={16} className="opacity-20" />
                                                                        <span className="text-[9px] font-medium opacity-60">{item}</span>
                                                                    </button>
                                                                ))}
                                                                {['Shape', 'Icon', 'Circle', 'Square', 'Promo', 'Button', 'Text', 'Photo', 'Star'].filter(c => c.toLowerCase().includes(elementsSearch.toLowerCase())).length === 0 && (
                                                                    <div className="col-span-3 py-10 flex flex-col items-center justify-center opacity-20">
                                                                        <X size={32} />
                                                                        <p className="text-[10px] mt-2 font-bold">No results found</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {/* Section 1: Quick Access */}
                                                            <div className="grid grid-cols-3 gap-2.5">
                                                                <button className="flex flex-col items-center gap-2 group">
                                                                    <div className="w-full aspect-square bg-[#f59e0b] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                                                        <UploadCloud size={24} className="text-white" />
                                                                    </div>
                                                                    <span className="text-[10px] font-bold opacity-80 group-hover:opacity-100 text-center leading-tight">My Uploads</span>
                                                                </button>
                                                                <button className="flex flex-col items-center gap-2 group">
                                                                    <div className="w-full aspect-square bg-[#4b5563] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                                                        <Star size={24} className="text-white" />
                                                                    </div>
                                                                    <span className="text-[10px] font-bold opacity-80 group-hover:opacity-100 text-center leading-tight">Favorites</span>
                                                                </button>
                                                                <button className="flex flex-col items-center gap-2 group">
                                                                    <div className="w-full aspect-square bg-[#374151] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform relative">
                                                                        <Clock size={24} className="text-white" />
                                                                    </div>
                                                                    <span className="text-[10px] font-bold opacity-80 group-hover:opacity-100 text-center leading-tight">Recently Used</span>
                                                                </button>
                                                            </div>

                                                            <div className={`h-px w-full ${studioTheme === 'light' ? 'bg-gray-200' : 'bg-white/5'}`}></div>

                                                            {/* Section 2: Library Grid */}
                                                            <div className="grid grid-cols-3 gap-x-2.5 gap-y-5">
                                                                {/* Stock Photos */}
                                                                <button onClick={() => setElementsSubView('photos')} className="flex flex-col items-center gap-2 group">
                                                                    <div className="w-full aspect-square bg-[#06b6d4] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                                                        <Camera size={24} className="text-white" />
                                                                    </div>
                                                                    <span className="text-[10px] font-bold opacity-80 group-hover:opacity-100 text-center leading-tight">Stock Photos</span>
                                                                </button>
                                                                {/* Stock Videos */}
                                                                <button onClick={() => setElementsSubView('videos')} className="flex flex-col items-center gap-2 group">
                                                                    <div className="w-full aspect-square bg-[#64748b] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                                                        <Film size={24} className="text-white" />
                                                                    </div>
                                                                    <span className="text-[10px] font-bold opacity-80 group-hover:opacity-100 text-center leading-tight">Stock Videos</span>
                                                                </button>
                                                                {/* Shapes */}
                                                                <button onClick={() => setElementsSubView('shapes')} className="flex flex-col items-center gap-2 group">
                                                                    <div className="w-full aspect-square bg-[#ef4444] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform relative">
                                                                        <Triangle size={24} className="text-white relative z-10" />
                                                                        <div className="absolute w-8 h-8 rounded-full bg-white/20 translate-x-1 translate-y-2"></div>
                                                                    </div>
                                                                    <span className="text-[10px] font-bold opacity-80 group-hover:opacity-100 text-center leading-tight">Shapes</span>
                                                                </button>
                                                                {/* Masks */}
                                                                <button onClick={() => setElementsSubView('masks')} className="flex flex-col items-center gap-2 group">
                                                                    <div className="w-full aspect-square bg-[#8b5e3c] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform relative overflow-hidden">
                                                                        <div className="absolute top-1 right-1 bg-[#fb923c] text-[8px] px-1 rounded font-bold text-white z-20">NEW</div>
                                                                        <div className="w-12 h-12 rotate-45 bg-[#d4a373] flex items-center justify-center rounded-lg">
                                                                            <div className="w-4 h-4 rounded-full bg-white/40 -translate-x-1 -translate-y-1"></div>
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-[10px] font-bold opacity-80 group-hover:opacity-100 text-center leading-tight">Masks</span>
                                                                </button>
                                                                {/* Lines */}
                                                                <button onClick={() => setElementsSubView('lines')} className="flex flex-col items-center gap-2 group">
                                                                    <div className="w-full aspect-square bg-[#0d9488] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform flex-col gap-1.5 p-4">
                                                                        <div className="w-full h-1 bg-white rounded-full"></div>
                                                                        <div className="w-full h-0.5 bg-white/40 rounded-full"></div>
                                                                        <div className="w-full h-1 border-b-2 border-dashed border-white"></div>
                                                                    </div>
                                                                    <span className="text-[10px] font-bold opacity-80 group-hover:opacity-100 text-center leading-tight">Lines</span>
                                                                </button>
                                                                {/* Icons */}
                                                                <button onClick={() => setElementsSubView('icons')} className="flex flex-col items-center gap-2 group">
                                                                    <div className="w-full aspect-square bg-[#4f46e5] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform relative">
                                                                        <div className="w-12 h-14 bg-white/10 rounded-t-xl rotate-[-5deg] absolute -top-1"></div>
                                                                        <MapPin size={24} className="text-white relative z-10" />
                                                                    </div>
                                                                    <span className="text-[10px] font-bold opacity-80 group-hover:opacity-100 text-center leading-tight">Icons</span>
                                                                </button>
                                                                {/* Illustrations */}
                                                                <button onClick={() => setElementsSubView('illustrations')} className="flex flex-col items-center gap-2 group">
                                                                    <div className="w-full aspect-square bg-[#4ade80] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform relative">
                                                                        <Paintbrush size={24} className="text-white rotate-[-30deg]" />
                                                                    </div>
                                                                    <span className="text-[10px] font-bold opacity-80 group-hover:opacity-100 text-center leading-tight">Illustrations</span>
                                                                </button>
                                                                {/* Brand Logos */}
                                                                <button onClick={() => setElementsSubView('logos')} className="flex flex-col items-center gap-2 group">
                                                                    <div className="w-full aspect-square bg-[#3b82f6] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform relative">
                                                                        <div className="absolute w-12 h-12 bg-white/20 rounded-full scale-125"></div>
                                                                        <Facebook size={24} className="text-white relative z-10" />
                                                                    </div>
                                                                    <span className="text-[10px] font-bold opacity-80 group-hover:opacity-100 text-center leading-tight">Brand Logos</span>
                                                                </button>
                                                                {/* GIPHY */}
                                                                <button onClick={() => setElementsSubView('giphy')} className="flex flex-col items-center gap-2 group">
                                                                    <div className="w-full aspect-square bg-[#a855f7] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform relative overflow-hidden">
                                                                        <div className="absolute top-1 right-1 bg-[#f97316] text-[8px] px-1 rounded font-bold text-white z-20"><Star size={7} fill="currentColor" /></div>
                                                                        <div className="w-12 h-14 bg-black/20 rounded border border-white/20 flex flex-col items-center justify-center">
                                                                            <div className="text-[8px] font-black italic bg-white text-black px-1 rounded-sm">GIPHY</div>
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-[10px] font-bold opacity-80 group-hover:opacity-100 text-center leading-tight">GIPHY</span>
                                                                </button>
                                                                {/* Audio */}
                                                                <button onClick={() => setElementsSubView('audio')} className="flex flex-col items-center gap-2 group">
                                                                    <div className="w-full aspect-square bg-[#db2777] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform relative">
                                                                        <div className="absolute bottom-1 right-1 bg-[#fb923c] text-[8px] px-1 rounded font-bold text-white z-20">NEW</div>
                                                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                                                            <Activity size={24} className="text-white" />
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-[10px] font-bold opacity-80 group-hover:opacity-100 text-center leading-tight">Audio</span>
                                                                </button>
                                                                {/* Widgets */}
                                                                <button onClick={() => setElementsSubView('widgets')} className="flex flex-col items-center gap-2 group">
                                                                    <div className="w-full aspect-square bg-[#7c3aed] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform relative">
                                                                        <Settings2 size={24} className="text-white translate-x-2 translate-y-2 opacity-50" />
                                                                        <Sparkles size={24} className="text-white -translate-x-1 -translate-y-1" />
                                                                    </div>
                                                                    <span className="text-[10px] font-bold opacity-80 group-hover:opacity-100 text-center leading-tight">Widgets</span>
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}


                                {/* BUTTON DRAWER - Full Library */}
                                {activeTool === 'button' && (
                                    <div className="space-y-4">
                                        <p className="text-[10px] uppercase font-bold opacity-40">Gradient Buttons</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => addElement('button', { name: 'Shop Now', bg: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'transparent', radius: '8px', gradient: true })}
                                                className="py-2.5 rounded-lg text-[11px] font-bold text-white shadow-lg hover:scale-105 transition-all"
                                                style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                                            >Shop Now</button>
                                            <button
                                                onClick={() => addElement('button', { name: 'Get Started', bg: 'linear-gradient(135deg, #f093fb, #f5576c)', color: '#fff', border: 'transparent', radius: '8px', gradient: true })}
                                                className="py-2.5 rounded-lg text-[11px] font-bold text-white shadow-lg hover:scale-105 transition-all"
                                                style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}
                                            >Get Started</button>
                                            <button
                                                onClick={() => addElement('button', { name: 'Learn More', bg: 'linear-gradient(135deg, #4facfe, #00f2fe)', color: '#fff', border: 'transparent', radius: '8px', gradient: true })}
                                                className="py-2.5 rounded-lg text-[11px] font-bold text-white shadow-lg hover:scale-105 transition-all"
                                                style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}
                                            >Learn More</button>
                                            <button
                                                onClick={() => addElement('button', { name: 'Buy Now', bg: 'linear-gradient(135deg, #fa709a, #fee140)', color: '#fff', border: 'transparent', radius: '8px', gradient: true })}
                                                className="py-2.5 rounded-lg text-[11px] font-bold text-white shadow-lg hover:scale-105 transition-all"
                                                style={{ background: 'linear-gradient(135deg, #fa709a, #fee140)' }}
                                            >Buy Now</button>
                                            <button
                                                onClick={() => addElement('button', { name: 'Subscribe', bg: 'linear-gradient(135deg, #a8edea, #fed6e3)', color: '#1e293b', border: 'transparent', radius: '50px', gradient: true })}
                                                className="py-2.5 rounded-full text-[11px] font-bold text-slate-800 shadow-lg hover:scale-105 transition-all"
                                                style={{ background: 'linear-gradient(135deg, #a8edea, #fed6e3)' }}
                                            >Subscribe</button>
                                            <button
                                                onClick={() => addElement('button', { name: 'Explore', bg: 'linear-gradient(135deg, #0cebeb, #20e3b2, #29ffc6)', color: '#fff', border: 'transparent', radius: '50px', gradient: true })}
                                                className="py-2.5 rounded-full text-[11px] font-bold text-white shadow-lg hover:scale-105 transition-all"
                                                style={{ background: 'linear-gradient(135deg, #0cebeb, #20e3b2)' }}
                                            >Explore</button>
                                        </div>

                                        <p className="text-[10px] uppercase font-bold opacity-40">Solid Buttons</p>
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
                                                    {/* Rounded */}
                                                    <button
                                                        onClick={() => addElement('button', { name: preset.name, bg: preset.colors[1], color: '#fff', border: 'transparent', radius: '50px' })}
                                                        className="py-2 rounded-full text-[10px] font-bold text-white shadow-sm hover:brightness-110 transition-all"
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
                                {/* BACKGROUND - ENHANCED */}
                                {activeTool === 'background' && (
                                    <div className="space-y-4">
                                        {/* Background Tabs */}
                                        <div className="flex border-b border-white/10 -mx-4 px-4">
                                            {['colors', 'gradients', 'textures', 'images'].map(tab => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setBgTab(tab)}
                                                    className={`py-2 px-3 text-xs font-medium capitalize ${bgTab === tab ? 'text-white border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
                                                >
                                                    {tab}
                                                </button>
                                            ))}
                                        </div>

                                        {/* COLORS TAB */}
                                        {bgTab === 'colors' && (
                                            <div className="space-y-4">
                                                {/* Special Options */}
                                                <div className="grid grid-cols-4 gap-2">
                                                    <button onClick={() => { setCanvasBackground('#4a5568'); setGradientEnabled(false); setBackgroundImage(null); }} className="aspect-square bg-gray-600 rounded-lg flex items-center justify-center hover:ring-2 hover:ring-blue-500"><Plus size={20} className="text-white/50" /></button>
                                                    <button onClick={() => { setCanvasBackground('transparent'); setGradientEnabled(false); setBackgroundImage(null); }} className="aspect-square bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImNoZWNrZXIiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjUiIGhlaWdodD0iNSIgZmlsbD0iIzdhN2E3YSIvPjxyZWN0IHg9IjUiIHk9IjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiIGZpbGw9IiM3YTdhN2EiLz48cmVjdCB4PSI1IiB5PSIwIiB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjNWE1YTVhIi8+PHJlY3QgeD0iMCIgeT0iNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIgZmlsbD0iIzVhNWE1YSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNjaGVja2VyKSIvPjwvc3ZnPg==')] rounded-lg hover:ring-2 hover:ring-blue-500"></button>
                                                    <button onClick={() => { setCanvasBackground('#ffffff'); setGradientEnabled(false); setBackgroundImage(null); }} className="aspect-square bg-white rounded-lg border border-gray-300 hover:ring-2 hover:ring-blue-500"></button>
                                                    <button onClick={() => { setCanvasBackground('#000000'); setGradientEnabled(false); setBackgroundImage(null); }} className="aspect-square bg-black rounded-lg hover:ring-2 hover:ring-blue-500"></button>
                                                </div>

                                                <p className="text-[10px] uppercase font-bold opacity-40">Default Presets</p>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {['#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899'].map(color => (
                                                        <button key={color} onClick={() => { setCanvasBackground(color); setGradientEnabled(false); setBackgroundImage(null); }} className="aspect-square rounded-lg hover:ring-2 hover:ring-white/50 transition-all hover:scale-105" style={{ backgroundColor: color }}></button>
                                                    ))}
                                                </div>

                                                <p className="text-[10px] uppercase font-bold opacity-40">Neutrals</p>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {['#1E293B', '#334155', '#475569', '#64748B', '#94A3B8', '#CBD5E1', '#E2E8F0', '#F1F5F9'].map(color => (
                                                        <button key={color} onClick={() => { setCanvasBackground(color); setGradientEnabled(false); setBackgroundImage(null); }} className="aspect-square rounded-lg hover:ring-2 hover:ring-white/50 transition-all" style={{ backgroundColor: color }}></button>
                                                    ))}
                                                </div>

                                                {/* Custom Color Picker */}
                                                <div className="pt-2 border-t border-white/10">
                                                    <p className="text-[10px] uppercase font-bold opacity-40 mb-2">Custom Color</p>
                                                    <input type="color" value={canvasBackground} onChange={e => { setCanvasBackground(e.target.value); setGradientEnabled(false); setBackgroundImage(null); }} className="w-full h-10 rounded cursor-pointer" />
                                                </div>
                                            </div>
                                        )}

                                        {/* GRADIENTS TAB */}
                                        {bgTab === 'gradients' && (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-4 gap-2">
                                                    <button onClick={() => { setCanvasBackground('#4a5568'); setGradientEnabled(true); setGradientColor2('#1a202c'); setBackgroundImage(null); }} className="aspect-square bg-gray-600 rounded-lg flex items-center justify-center hover:ring-2 hover:ring-blue-500"><Plus size={20} className="text-white/50" /></button>
                                                    <button onClick={() => { setCanvasBackground('#e2e8f0'); setGradientEnabled(true); setGradientColor2('#94a3b8'); setBackgroundImage(null); }} className="aspect-square rounded-lg hover:ring-2 hover:ring-blue-500" style={{ background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)' }}></button>
                                                    <button onClick={() => { setCanvasBackground('#cbd5e1'); setGradientEnabled(true); setGradientColor2('#64748b'); setBackgroundImage(null); }} className="aspect-square rounded-lg hover:ring-2 hover:ring-blue-500" style={{ background: 'linear-gradient(135deg, #cbd5e1, #64748b)' }}></button>
                                                    <button onClick={() => { setCanvasBackground('#1e293b'); setGradientEnabled(true); setGradientColor2('#0f172a'); setBackgroundImage(null); }} className="aspect-square rounded-lg hover:ring-2 hover:ring-blue-500" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}></button>
                                                </div>

                                                <p className="text-[10px] uppercase font-bold opacity-40">Popular Gradients</p>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {[
                                                        ['#f97316', '#eab308'], ['#84cc16', '#22c55e'], ['#06b6d4', '#3b82f6'], ['#0f172a', '#334155'],
                                                        ['#7c3aed', '#c084fc'], ['#6366f1', '#a5b4fc'], ['#8b5cf6', '#c4b5fd'], ['#e0e7ff', '#f3e8ff'],
                                                        ['#fbbf24', '#f472b6'], ['#ec4899', '#f43f5e'], ['#ef4444', '#dc2626'], ['#78350f', '#a16207'],
                                                        ['#14b8a6', '#06b6d4'], ['#0ea5e9', '#6366f1'], ['#6366f1', '#8b5cf6'], ['#cbd5e1', '#f1f5f9']
                                                    ].map(([c1, c2], i) => (
                                                        <button key={i} onClick={() => { setCanvasBackground(c1); setGradientEnabled(true); setGradientColor2(c2); setBackgroundImage(null); }} className="aspect-square rounded-lg hover:ring-2 hover:ring-white/50 transition-all hover:scale-105" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}></button>
                                                    ))}
                                                </div>

                                                {/* Custom Gradient */}
                                                <div className="pt-2 border-t border-white/10 space-y-2">
                                                    <p className="text-[10px] uppercase font-bold opacity-40">Custom Gradient</p>
                                                    <div className="flex gap-2">
                                                        <input type="color" value={canvasBackground} onChange={e => { setCanvasBackground(e.target.value); setGradientEnabled(true); }} className="flex-1 h-10 rounded cursor-pointer" />
                                                        <input type="color" value={gradientColor2} onChange={e => { setGradientColor2(e.target.value); setGradientEnabled(true); }} className="flex-1 h-10 rounded cursor-pointer" />
                                                    </div>
                                                    <select value={gradientDirection} onChange={e => setGradientDirection(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded p-2 text-xs">
                                                        <option value="to right">Left to Right</option>
                                                        <option value="to left">Right to Left</option>
                                                        <option value="to bottom">Top to Bottom</option>
                                                        <option value="to top">Bottom to Top</option>
                                                        <option value="135deg">Diagonal ↘</option>
                                                        <option value="45deg">Diagonal ↗</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {/* TEXTURES TAB */}
                                        {bgTab === 'textures' && (
                                            <div className="space-y-5">
                                                <div className="flex flex-col gap-4">
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-2.5">Geometric & Dots</p>
                                                        <div className="grid grid-cols-4 gap-2">
                                                            <button onClick={() => { setCanvasBackground('#f8f9fa'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/cubes.png')"); setBgImageOpacity(0.1); }} className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-gray-500" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}>Cubes</button>
                                                            <button onClick={() => { setCanvasBackground('#1a202c'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/hexellence.png')"); setBgImageOpacity(0.12); }} className="aspect-square rounded-lg bg-gray-900 flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-white/50" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/hexellence.png')" }}>Hex</button>
                                                            <button onClick={() => { setCanvasBackground('#2d3748'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/triangles.png')"); setBgImageOpacity(0.08); }} className="aspect-square rounded-lg bg-gray-800 flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-white/50" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/triangles.png')" }}>Tri</button>
                                                            <button onClick={() => { setCanvasBackground('#ffffff'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/polka-dots.png')"); setBgImageOpacity(0.05); }} className="aspect-square rounded-lg bg-white flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-gray-400" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/polka-dots.png')" }}>Dots</button>
                                                            <button onClick={() => { setCanvasBackground('#f3f4f6'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/subtle-dots.png')"); setBgImageOpacity(0.1); }} className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-gray-400" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/subtle-dots.png')" }}>Subtle</button>
                                                            <button onClick={() => { setCanvasBackground('#1e293b'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/stardust.png')"); setBgImageOpacity(0.3); }} className="aspect-square rounded-lg bg-slate-800 flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-white/40" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }}>Stars</button>
                                                            <button onClick={() => { setCanvasBackground('#ffffff'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')"); setBgImageOpacity(0.05); }} className="aspect-square rounded-lg bg-white flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-gray-400" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')" }}>Stripes</button>
                                                            <button onClick={() => { setCanvasBackground('#ffffff'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/zig-zag.png')"); setBgImageOpacity(0.04); }} className="aspect-square rounded-lg bg-white flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-gray-400" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/zig-zag.png')" }}>ZigZag</button>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-2.5">Nature & Organic</p>
                                                        <div className="grid grid-cols-4 gap-2">
                                                            <button onClick={() => { setCanvasBackground('#fffbf0'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/cream-paper.png')"); setBgImageOpacity(0.4); }} className="aspect-square rounded-lg bg-[#fffbf0] flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-gray-500" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }}>Paper</button>
                                                            <button onClick={() => { setCanvasBackground('#f3f4f6'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/rough-cloth.png')"); setBgImageOpacity(0.3); }} className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-gray-500" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/rough-cloth.png')" }}>Canvas</button>
                                                            <button onClick={() => { setCanvasBackground('#ffffff'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/clouds.png')"); setBgImageOpacity(0.2); }} className="aspect-square rounded-lg bg-blue-50 flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-blue-300" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/clouds.png')" }}>Clouds</button>
                                                            <button onClick={() => { setCanvasBackground('#ffffff'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/marble.png')"); setBgImageOpacity(0.15); }} className="aspect-square rounded-lg bg-white flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-gray-300" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/marble.png')" }}>Marble</button>
                                                            <button onClick={() => { setCanvasBackground('#e2e8f0'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/noise-lines.png')"); setBgImageOpacity(0.2); }} className="aspect-square rounded-lg bg-slate-200 flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-gray-500" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/noise-lines.png')" }}>Noise</button>
                                                            <button onClick={() => { setCanvasBackground('#ffffff'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/linen.png')"); setBgImageOpacity(0.3); }} className="aspect-square rounded-lg bg-white flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-gray-400" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/linen.png')" }}>Linen</button>
                                                            <button onClick={() => { setCanvasBackground('#fffaf0'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/rice-paper.png')"); setBgImageOpacity(0.5); }} className="aspect-square rounded-lg bg-orange-50 flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-orange-200" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/rice-paper.png')" }}>Rice</button>
                                                            <button onClick={() => { setCanvasBackground('#5e504c'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/leather.png')"); setBgImageOpacity(0.2); }} className="aspect-square rounded-lg bg-[#5e504c] flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-white/50" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/leather.png')" }}>Leather</button>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-2.5">Luxury & Tech</p>
                                                        <div className="grid grid-cols-4 gap-2">
                                                            <button onClick={() => { setCanvasBackground('#111827'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/carbon-fibre.png')"); setBgImageOpacity(0.2); }} className="aspect-square rounded-lg bg-gray-900 flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-white/50" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" }}>Carbon</button>
                                                            <button onClick={() => { setCanvasBackground('#1a202c'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/circuit-board.png')"); setBgImageOpacity(0.08); }} className="aspect-square rounded-lg bg-gray-900 flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-emerald-500/30" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/circuit-board.png')" }}>Circuit</button>
                                                            <button onClick={() => { setCanvasBackground('#0f172a'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/connectivity.png')"); setBgImageOpacity(0.1); }} className="aspect-square rounded-lg bg-slate-950 flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-blue-500/20" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/connectivity.png')" }}>Tech</button>
                                                            <button onClick={() => { setCanvasBackground('#ffffff'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/topography.png')"); setBgImageOpacity(0.12); }} className="aspect-square rounded-lg bg-white flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-gray-300" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/topography.png')" }}>Topo</button>
                                                            <button onClick={() => { setCanvasBackground('#1e293b'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/brushed-alum.png')"); setBgImageOpacity(0.3); }} className="aspect-square rounded-lg bg-slate-800 flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-white/30" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/brushed-alum.png')" }}>Alum</button>
                                                            <button onClick={() => { setCanvasBackground('#334155'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/shattered-island.png')"); setBgImageOpacity(0.15); }} className="aspect-square rounded-lg bg-slate-700 flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-white/30" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/shattered-island.png')" }}>Shatter</button>
                                                            <button onClick={() => { setCanvasBackground('#475569'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/asfalt-light.png')"); setBgImageOpacity(0.2); }} className="aspect-square rounded-lg bg-slate-600 flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-white/30" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/asfalt-light.png')" }}>Stone</button>
                                                            <button onClick={() => { setCanvasBackground('#2c3e50'); setGradientEnabled(false); setBackgroundImage("url('https://www.transparenttextures.com/patterns/dark-wood.png')"); setBgImageOpacity(0.4); }} className="aspect-square rounded-lg bg-[#2c3e50] flex items-center justify-center hover:ring-2 hover:ring-blue-500 text-[8px] text-wood-950" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/dark-wood.png')" }}>Wood</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* IMAGES TAB */}
                                        {bgTab === 'images' && (
                                            <div className="space-y-4">
                                                {/* Upload Own Image */}
                                                <div className="relative">
                                                    <input type="file" accept="image/*" id="bg-upload" className="hidden" onChange={e => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const url = URL.createObjectURL(file);
                                                            setBackgroundImage(url);
                                                            setGradientEnabled(false);
                                                        }
                                                    }} />
                                                    <label htmlFor="bg-upload" className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
                                                        <ImageIcon size={16} /> Upload Background
                                                    </label>
                                                </div>

                                                {backgroundImage && (
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] uppercase font-bold opacity-40">Current Image</p>
                                                        <div className="relative">
                                                            <img src={backgroundImage} alt="bg" className="w-full h-20 object-cover rounded-lg" />
                                                            <button onClick={() => setBackgroundImage(null)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded"><X size={12} /></button>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] opacity-50">Opacity</span>
                                                            <input type="range" min="0" max="100" value={bgImageOpacity * 100} onChange={e => setBgImageOpacity(e.target.value / 100)} className="flex-1 h-1 bg-white/10 rounded" />
                                                            <span className="text-[10px] font-mono">{Math.round(bgImageOpacity * 100)}%</span>
                                                        </div>
                                                    </div>
                                                )}

                                                <p className="text-[10px] uppercase font-bold opacity-40">Stock Photos</p>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {[
                                                        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop',
                                                        'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=300&h=200&fit=crop',
                                                        'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=200&fit=crop',
                                                        'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=200&fit=crop',
                                                        'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=300&h=200&fit=crop',
                                                        'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=300&h=200&fit=crop',
                                                        'https://images.unsplash.com/photo-1518173946687-a4c036bc8bc6?w=300&h=200&fit=crop',
                                                        'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=300&h=200&fit=crop',
                                                        'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&h=200&fit=crop'
                                                    ].map((url, i) => (
                                                        <button key={i} onClick={() => { setBackgroundImage(url); setGradientEnabled(false); }} className="aspect-video rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all hover:scale-105">
                                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                                        </button>
                                                    ))}
                                                </div>

                                                <p className="text-[10px] uppercase font-bold opacity-40">Abstract</p>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {[
                                                        'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=300&h=200&fit=crop',
                                                        'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=300&h=200&fit=crop',
                                                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=200&fit=crop'
                                                    ].map((url, i) => (
                                                        <button key={i} onClick={() => { setBackgroundImage(url); setGradientEnabled(false); }} className="aspect-video rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all hover:scale-105">
                                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div >
                )}
            </AnimatePresence >

            {/* MAIN CONTENT WRAPPER */}
            < div className="flex-1 flex flex-col min-w-0 h-full relative" >

                {/* TOP HEADER */}
                < div className={`h-14 border-b ${studioTheme === 'light' ? 'border-gray-200 bg-white' : 'border-[#333] bg-[#1a1a1a]'} flex items-center justify-between px-4 shrink-0 z-20 transition-colors`}>
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/20'} rounded px-3 py-1.5 border ${studioTheme === 'light' ? 'border-gray-200' : 'border-white/5'}`}>
                            <span className={`text-xs opacity-50 uppercase font-bold ${studioTheme === 'light' ? 'text-gray-600' : ''}`}>Size</span>
                            <div className={`w-px h-3 ${studioTheme === 'light' ? 'bg-gray-300' : 'bg-white/10'} mx-1`}></div>
                            <input type="number" value={canvasSize.width} onChange={e => setCanvasSize({ ...canvasSize, width: +e.target.value })} className={`w-8 bg-transparent text-xs font-mono outline-none text-right font-bold ${studioTheme === 'light' ? 'text-gray-800' : ''}`} />
                            <span className={`text-xs ${studioTheme === 'light' ? 'text-gray-400' : 'opacity-30'}`}>x</span>
                            <input type="number" value={canvasSize.height} onChange={e => setCanvasSize({ ...canvasSize, height: +e.target.value })} className={`w-8 bg-transparent text-xs font-mono outline-none font-bold ${studioTheme === 'light' ? 'text-gray-800' : ''}`} />
                            <span className={`text-[10px] ${studioTheme === 'light' ? 'text-gray-400' : 'opacity-30'} ml-1`}>px</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setZoom(z => Math.max(0.1, z - 0.1))} className={`p-2 ${studioTheme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-white/5'} rounded-lg`}><ZoomOut size={16} /></button>
                            <span className={`text-xs font-mono w-10 text-center ${studioTheme === 'light' ? 'text-gray-600' : 'opacity-70'}`}>{Math.round(zoom * 100)}%</span>
                            <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className={`p-2 ${studioTheme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-white/5'} rounded-lg`}><ZoomIn size={16} /></button>
                        </div>

                        {/* Responsive Size Presets */}
                        <div className="flex gap-1">
                            <button onClick={() => setCanvasSize({ width: 728, height: 90 })} className={`px-2 py-1 text-[10px] font-bold rounded ${canvasSize.width === 728 ? 'bg-blue-500 text-white' : studioTheme === 'light' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-white/5 hover:bg-white/10'}`}>728x90</button>
                            <button onClick={() => setCanvasSize({ width: 300, height: 250 })} className={`px-2 py-1 text-[10px] font-bold rounded ${canvasSize.width === 300 && canvasSize.height === 250 ? 'bg-blue-500 text-white' : studioTheme === 'light' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-white/5 hover:bg-white/10'}`}>300x250</button>
                            <button onClick={() => setCanvasSize({ width: 160, height: 600 })} className={`px-2 py-1 text-[10px] font-bold rounded ${canvasSize.width === 160 ? 'bg-blue-500 text-white' : studioTheme === 'light' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-white/5 hover:bg-white/10'}`}>160x600</button>
                            <button onClick={() => setCanvasSize({ width: 970, height: 250 })} className={`px-2 py-1 text-[10px] font-bold rounded ${canvasSize.width === 970 ? 'bg-blue-500 text-white' : studioTheme === 'light' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-white/5 hover:bg-white/10'}`}>970x250</button>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className={`p-1 rounded-lg flex gap-1 ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/20'}`}>
                            {[
                                { id: 'editor', label: 'Editor', icon: MousePointer2 },
                                { id: 'preview', label: 'Preview', icon: Eye },
                                { id: 'code', label: 'Source Code', icon: Code },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setBuilderMode(tab.id)}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${builderMode === tab.id
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : studioTheme === 'light' ? 'text-gray-500 hover:text-gray-800 hover:bg-white/50' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <tab.icon size={14} /> {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 items-center">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => setStudioTheme(studioTheme === 'dark' ? 'light' : 'dark')}
                            className={`p-2 rounded-lg ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-white/5 hover:bg-white/10'}`}
                            title={studioTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {studioTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                        </button>

                        <div className={`w-px h-6 ${studioTheme === 'light' ? 'bg-gray-200' : 'bg-white/10'}`}></div>

                        <button onClick={() => saveToLibrary()} className={`px-4 py-2 ${studioTheme === 'light' ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'} border rounded text-xs font-bold flex items-center gap-2 shadow transition-all active:scale-95`}>
                            <Save size={14} /> Enregistrer
                        </button>

                        <button onClick={savePack} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded text-xs font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95">
                            <Sparkles size={14} /> Pack Multi-tailles
                        </button>

                        <button onClick={downloadHTML} className={`px-4 py-2 ${studioTheme === 'light' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white text-black hover:bg-gray-200'} rounded text-xs font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95`}>
                            <Download size={14} /> Download
                        </button>
                    </div>
                </div >

                {/* MIDDLE SECTION: CANVAS + SLIDES */}
                < div className="flex-1 flex overflow-hidden" >
                    {/* CANVAS */}
                    < div className={`flex-1 ${studioTheme === 'light' ? 'bg-gray-200' : 'bg-[#121212]'} relative overflow-hidden transition-colors`} ref={containerRef} >
                        <InfiniteViewer
                            ref={viewerRef}
                            className="viewer w-full h-full"
                            zoom={zoom}
                            useWheelScroll={true}
                            usePinch={true}
                            useAutoZoom={false}
                            onScroll={e => {
                                // Sync scroll if needed
                            }}
                            onPinch={e => {
                                setZoom(e.zoom);
                            }}
                            onDragStart={e => {
                                if (e.inputEvent.target.closest('.banner-element')) {
                                    e.stop();
                                }
                            }}
                        >
                            <div className="viewport relative pt-60 pl-60 pr-60 pb-60 flex items-center justify-center min-w-full min-h-full">
                                <div
                                    className="shadow-2xl relative transition-all duration-300 overflow-hidden"
                                    style={{
                                        width: canvasSize.width,
                                        height: canvasSize.height,
                                        background: backgroundImage
                                            ? 'transparent'
                                            : gradientEnabled
                                                ? `${gradientType}-gradient(${gradientDirection}, ${canvasBackground}, ${gradientColor2})`
                                                : canvasBackground
                                    }}
                                >
                                    {/* Background Image Layer */}
                                    {backgroundImage && (
                                        <>
                                            <div
                                                className="absolute inset-0 bg-cover bg-center"
                                                style={{
                                                    backgroundImage: `url(${backgroundImage})`,
                                                    opacity: bgImageOpacity
                                                }}
                                            />
                                            {/* Optional color overlay on image */}
                                            {canvasBackground !== '#ffffff' && canvasBackground !== 'transparent' && (
                                                <div
                                                    className="absolute inset-0"
                                                    style={{
                                                        background: gradientEnabled
                                                            ? `${gradientType}-gradient(${gradientDirection}, ${canvasBackground}80, ${gradientColor2}80)`
                                                            : `${canvasBackground}40`
                                                    }}
                                                />
                                            )}
                                        </>
                                    )}

                                    {/* Grid Overlay */}
                                    <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                                    {elements.map(renderElement)}
                                </div>
                            </div>
                        </InfiniteViewer>

                        {builderMode === 'editor' && (
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
                        )}

                        {/* CONTEXTUAL SELECTION TOOLBAR */}
                        <AnimatePresence>
                            {selectedTargets.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="absolute z-[100] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col items-center py-2 px-1 gap-1"
                                    style={{
                                        left: '100%',
                                        marginLeft: '15px',
                                        top: '50%',
                                        transform: 'translateY(-50%)'
                                    }}
                                >
                                    {[
                                        { icon: Palette, label: 'Color', action: () => setActiveTool('background') },
                                        { icon: Type, label: 'Text', action: () => setActiveTool('text') },
                                        { icon: Maximize2, label: 'Layout', action: () => { /* Select move tool */ setActiveTool(null); } },
                                        { icon: ChevronUp, label: 'Move Up', action: () => moveLayer('up') },
                                        { icon: ChevronDown, label: 'Move Down', action: () => moveLayer('down') },
                                        {
                                            icon: Link, label: 'Link', action: () => {
                                                const url = prompt('Enter URL:');
                                                if (url) {
                                                    const id = selectedTargets[0]?.id;
                                                    if (id) updateElement(id, { link: url });
                                                }
                                            }
                                        },
                                        { icon: Paintbrush, label: 'Style', action: () => { /* Toggle some preset styles */ } },
                                    ].map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={item.action}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 transition-colors group relative"
                                        >
                                            <item.icon size={18} />
                                            {/* Tooltip */}
                                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                                {item.label}
                                            </div>
                                        </button>
                                    ))}

                                    <div className="w-6 h-px bg-gray-100 my-1"></div>

                                    <button
                                        onClick={() => {
                                            const newElements = [];
                                            selectedTargets.forEach(t => {
                                                const el = elements.find(e => e.id === t.id);
                                                if (el) {
                                                    const newEl = { ...el, id: `el-${Date.now()}-${Math.random()}`, x: el.x + 20, y: el.y + 20 };
                                                    newElements.push(newEl);
                                                }
                                            });
                                            setElements(prev => [...prev, ...newElements]);
                                        }}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 transition-colors group relative"
                                    >
                                        <CopyPlus size={18} />
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Duplicate</div>
                                    </button>

                                    <button
                                        onClick={() => {
                                            const ids = selectedTargets.map(t => t.id);
                                            setElements(prev => prev.map(el => ids.includes(el.id) ? { ...el, locked: !el.locked } : el));
                                            setSelectedTargets([]);
                                        }}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 transition-colors group relative"
                                    >
                                        <Lock size={18} />
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Lock Toggle</div>
                                    </button>

                                    <div className="w-6 h-px bg-gray-100 my-1"></div>

                                    <button
                                        onClick={() => {
                                            const ids = selectedTargets.map(t => t.id);
                                            setElements(prev => prev.filter(el => !ids.includes(el.id)));
                                            setSelectedTargets([]);
                                        }}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors group relative"
                                    >
                                        <Trash2 size={18} />
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">Delete</div>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {builderMode === 'editor' && (
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
                        )}
                    </div >

                    {/* RIGHT SIDEBAR - SLIDES */}
                    {builderMode === 'editor' && (
                        <div className={`w-16 ${studioTheme === 'light' ? 'bg-white border-gray-200' : 'bg-[#1a1a1a] border-[#333]'} border-l flex flex-col items-center py-4 shrink-0 z-20`}>
                            <h4 className={`text-[9px] uppercase font-bold opacity-50 mb-4 tracking-widest text-center ${studioTheme === 'light' ? 'text-gray-500' : ''}`}>Slides</h4>
                            {
                                slides.map((slide, idx) => (
                                    <button
                                        key={slide.id}
                                        className={`w-12 h-10 mb-2 rounded border transition-all relative ${idx === activeSlide ? 'border-blue-500 bg-blue-500/10' : studioTheme === 'light' ? 'border-gray-200 hover:border-gray-400' : 'border-white/10 hover:border-white/30'}`}
                                    >
                                        <span className={`absolute top-0.5 right-1 text-[8px] opacity-50 ${studioTheme === 'light' ? 'text-black' : 'text-white'}`}>{idx + 1}</span>
                                    </button>
                                ))
                            }
                            <button className={`w-10 h-10 rounded-full ${studioTheme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600' : 'bg-white/5 hover:bg-white/10 text-white/50 hover:text-white'} flex items-center justify-center transition-colors mt-2`}>
                                <Plus size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* BOTTOM - TIMELINE */}
                {builderMode === 'editor' && (
                    <div className={`border-t ${studioTheme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-[#333] bg-[#1a1a1a]'} flex flex-col transition-all duration-300 ${isTimelineOpen ? 'h-72' : 'h-10'}`}>
                        {/* Timeline Header */}
                        <div className={`h-10 flex items-center justify-between px-4 ${studioTheme === 'light' ? 'bg-white border-gray-200' : 'bg-[#1f1f1f] border-[#333]'} border-b shrink-0`}>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setIsTimelineOpen(!isTimelineOpen)} className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:text-blue-500 ${studioTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    <Layers size={14} /> Timeline {isTimelineOpen ? <ChevronLeft className="rotate-[-90deg]" size={12} /> : <ChevronLeft className="rotate-90" size={12} />}
                                </button>
                                <div className={`h-4 w-px ${studioTheme === 'light' ? 'bg-gray-300' : 'bg-white/10'}`}></div>
                                <div className="flex gap-2">
                                    <button className={`p-1 ${studioTheme === 'light' ? 'hover:text-black text-gray-500' : 'hover:text-white text-gray-400'}`}><SkipBack size={14} /></button>
                                    <button onClick={() => setIsPlaying(!isPlaying)} className={`p-1 hover:text-blue-500 ${isPlaying ? 'text-blue-500' : studioTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                                    </button>
                                </div>
                                <span className="text-xs font-mono text-blue-500 w-16">00:0{Math.floor(currentTime)}.{Math.round((currentTime % 1) * 10)}s</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] opacity-40">Zoom</span>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="3"
                                    step="0.1"
                                    value={zoom}
                                    onChange={e => setZoom(+e.target.value)}
                                    className="w-20 h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Timeline Tracks */}
                        {isTimelineOpen && (
                            <div className="flex-1 flex overflow-hidden">
                                {/* Track Headers (Left) */}
                                <div className={`w-48 ${studioTheme === 'light' ? 'bg-white border-gray-200' : 'bg-[#1a1a1a] border-[#333]'} border-r flex flex-col overflow-y-auto custom-scrollbar`}>
                                    {[...elements].reverse().map(el => (
                                        <div key={el.id}
                                            className={`h-8 flex items-center px-3 gap-2 border-b ${studioTheme === 'light' ? 'border-gray-100 text-gray-600 hover:bg-gray-50' : 'border-[#333]/50 text-gray-400 hover:bg-white/5'} text-xs cursor-pointer ${selectedTargets.some(t => t.id === el.id) ? 'bg-blue-500/10 text-blue-500' : ''}`}
                                            onClick={() => {
                                                const target = document.getElementById(el.id);
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
                                <div className={`flex-1 ${studioTheme === 'light' ? 'bg-gray-50' : 'bg-[#151515]'} relative overflow-hidden overflow-y-auto custom-scrollbar`}>
                                    {/* Time Ruler */}
                                    <div className={`h-6 border-b ${studioTheme === 'light' ? 'border-gray-200 bg-gray-50 text-gray-500' : 'border-[#333] bg-[#151515] text-white/50'} sticky top-0 z-10 flex text-[9px] font-mono items-end pb-1 select-none`}>
                                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                                            <div key={s} className={`flex-1 border-l ${studioTheme === 'light' ? 'border-gray-300' : 'border-white/10'} pl-1 h-3 flex items-end`}>{s}s</div>
                                        ))}
                                    </div>

                                    {/* Bars */}
                                    <div className="relative min-w-full">
                                        {/* Playhead Cursor */}
                                        <div
                                            className="absolute top-0 bottom-0 w-px bg-blue-500 z-20 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-100 ease-linear"
                                            style={{ left: `${currentTime * 10}%` }}
                                        >
                                            <div className="w-3 h-3 bg-blue-500 -ml-1.5 rotate-45 -mt-1.5 flex items-center justify-center"></div>
                                        </div>

                                        {[...elements].reverse().map((el, i) => (
                                            <div key={el.id} className={`h-8 border-b ${studioTheme === 'light' ? 'border-gray-200' : 'border-[#333]/50'} relative flex items-center group`}>
                                                {/* Bar */}
                                                <div
                                                    className={`h-5 absolute rounded-sm cursor-ew-resize border border-opacity-30 ${['bg-purple-500/40 border-purple-400', 'bg-blue-500/40 border-blue-400', 'bg-emerald-500/40 border-emerald-400'][i % 3]}`}
                                                    style={{ left: `${(el.anim?.start || 0) * 10}%`, width: `${(el.anim?.duration || 5) * 10}%` }}
                                                >
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
                )}
            </div>

            {/* SOURCE CODE VIEW */}
            {/* SOURCE CODE VIEW */}
            {builderMode === 'code' && (
                <div className={`flex-1 flex flex-col ${studioTheme === 'light' ? 'bg-[#f5f5f5]' : 'bg-[#1e1e1e]'} overflow-hidden`}>
                    <div className={`p-4 border-b ${studioTheme === 'light' ? 'border-gray-200 bg-white' : 'border-white/10 bg-[#1e1e1e]'} flex justify-between items-center shrink-0`}>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                <Code size={18} />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider">HTML Source Code</h3>
                                <p className="text-[10px] opacity-40">Generated static HTML for your ad banner</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(generatedCode);
                                alert('Code copied to clipboard!');
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
                        >
                            <Copy size={14} /> Copy Code
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto p-6 font-mono text-[13px] leading-relaxed relative group">
                        <div className={`absolute top-0 left-0 w-12 h-full ${studioTheme === 'light' ? 'bg-gray-100 border-r border-gray-200' : 'bg-black/20 border-r border-white/5'} text-[9px] text-center py-6 opacity-30 select-none`}>
                            {generatedCode.split('\n').map((_, i) => (
                                <div key={i}>{i + 1}</div>
                            ))}
                        </div>
                        <pre className={`pl-16 whitespace-pre-wrap ${studioTheme === 'light' ? 'text-blue-800' : 'text-emerald-400'}`}>
                            {generatedCode}
                        </pre>
                    </div>
                </div>
            )}

            {/* 4. RIGHT PROPERTIES PANEL */}
            {selectedTargets.length > 0 && builderMode === 'editor' && (() => {
                const targetEl = selectedTargets[0];
                const selectedEl = elements.find(e => e.id === targetEl?.id);
                if (!selectedEl) return null;

                const updateStyle = (key, value) => {
                    updateElement(selectedEl.id, { style: { ...(selectedEl.style || {}), [key]: value } });
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
                    <div
                        onMouseDown={e => e.stopPropagation()}
                        className={`w-72 ${studioTheme === 'light' ? 'bg-white border-gray-200' : 'bg-[#1a1a1a] border-[#333]'} border-l flex flex-col shrink-0 z-30 overflow-hidden`}
                    >
                        {/* Header */}
                        <div className={`p-3 border-b ${studioTheme === 'light' ? 'border-gray-200 bg-white' : 'border-[#333]'} flex items-center justify-between`}>
                            <h3 className={`font-bold text-xs uppercase tracking-wider flex items-center gap-2 ${studioTheme === 'light' ? 'text-gray-700' : 'text-white'}`}>
                                <Settings2 size={14} /> Properties
                            </h3>
                            <span className={`text-[10px] opacity-40 px-2 py-0.5 rounded ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-white/5'}`}>{selectedEl.type}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5">
                            {/* POSITION */}
                            <div>
                                <p className="text-[10px] uppercase font-bold opacity-40 mb-2 flex items-center gap-1"><Move size={10} /> Position</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className={`rounded p-2 flex items-center gap-2 ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/20'}`}>
                                        <span className="text-[10px] opacity-50 uppercase font-bold">X</span>
                                        <input type="number" value={Math.round(selectedEl.x)} onChange={e => updateElement(selectedEl.id, { x: +e.target.value })} className={`flex-1 bg-transparent text-[11px] font-mono outline-none text-right ${studioTheme === 'light' ? 'text-gray-800' : 'text-white'}`} />
                                    </div>
                                    <div className={`rounded p-2 flex items-center gap-2 ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/20'}`}>
                                        <span className="text-[10px] opacity-50 uppercase font-bold">Y</span>
                                        <input type="number" value={Math.round(selectedEl.y)} onChange={e => updateElement(selectedEl.id, { y: +e.target.value })} className={`flex-1 bg-transparent text-[11px] font-mono outline-none text-right ${studioTheme === 'light' ? 'text-gray-800' : 'text-white'}`} />
                                    </div>
                                </div>
                            </div>

                            {/* SIZE */}
                            <div>
                                <p className="text-[10px] uppercase font-bold opacity-40 mb-2 flex items-center gap-1"><Maximize2 size={10} /> Size</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className={`rounded p-2 flex items-center gap-2 ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/20'}`}>
                                        <span className="text-[10px] opacity-50 uppercase font-bold">W</span>
                                        <input type="number" value={Math.round(selectedEl.width)} onChange={e => updateElement(selectedEl.id, { width: +e.target.value })} className={`flex-1 bg-transparent text-[11px] font-mono outline-none text-right ${studioTheme === 'light' ? 'text-gray-800' : 'text-white'}`} />
                                    </div>
                                    <div className={`rounded p-2 flex items-center gap-2 ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/20'}`}>
                                        <span className="text-[10px] opacity-50 uppercase font-bold">H</span>
                                        <input type="number" value={Math.round(selectedEl.height)} onChange={e => updateElement(selectedEl.id, { height: +e.target.value })} className={`flex-1 bg-transparent text-[11px] font-mono outline-none text-right ${studioTheme === 'light' ? 'text-gray-800' : 'text-white'}`} />
                                    </div>
                                </div>
                            </div>

                            {/* ROTATION */}
                            <div>
                                <p className="text-[10px] uppercase font-bold opacity-40 mb-2 flex items-center gap-1"><RotateCcw size={10} /> Rotation</p>
                                <div className={`rounded p-2 flex items-center gap-2 ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/20'}`}>
                                    <input type="range" min="-180" max="180" value={selectedEl.rotation || 0} onChange={e => updateElement(selectedEl.id, { rotation: +e.target.value })} className={`flex-1 h-1 rounded appearance-none ${studioTheme === 'light' ? 'bg-gray-300' : 'bg-white/10'}`} />
                                    <input type="number" value={Math.round(selectedEl.rotation || 0)} onChange={e => updateElement(selectedEl.id, { rotation: +e.target.value })} className={`w-12 bg-transparent text-xs font-mono text-center outline-none ${studioTheme === 'light' ? 'text-gray-800' : 'text-white'}`} />
                                    <span className="text-[10px] opacity-20">°</span>
                                </div>
                            </div>

                            {/* OPACITY */}
                            <div>
                                <p className="text-[10px] uppercase font-bold opacity-40 mb-2 flex items-center gap-1"><Eye size={10} /> Opacity</p>
                                <div className={`rounded p-2 flex items-center gap-2 ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/20'}`}>
                                    <input type="range" min="0" max="100" value={(selectedEl.style?.opacity || 1) * 100} onChange={e => updateStyle('opacity', e.target.value / 100)} className={`flex-1 h-1 rounded appearance-none ${studioTheme === 'light' ? 'bg-gray-300' : 'bg-white/10'}`} />
                                    <input type="number" min="0" max="100" value={Math.round((selectedEl.style?.opacity || 1) * 100)} onChange={e => updateStyle('opacity', e.target.value / 100)} className={`w-12 bg-transparent text-xs font-mono text-center outline-none ${studioTheme === 'light' ? 'text-gray-800' : 'text-white'}`} />
                                    <span className="text-[10px] opacity-20">%</span>
                                </div>
                            </div>

                            {/* SHADOW */}
                            <div>
                                <p className="text-[10px] uppercase font-bold opacity-40 mb-2 flex items-center gap-1">Shadow</p>
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <select
                                            value={selectedEl.style?.boxShadow ? 'custom' : 'none'}
                                            onChange={e => {
                                                if (e.target.value === 'none') updateStyle('boxShadow', 'none');
                                                else if (e.target.value === 'sm') updateStyle('boxShadow', '0 1px 2px rgba(0,0,0,0.1)');
                                                else if (e.target.value === 'md') updateStyle('boxShadow', '0 4px 6px rgba(0,0,0,0.15)');
                                                else if (e.target.value === 'lg') updateStyle('boxShadow', '0 10px 15px rgba(0,0,0,0.2)');
                                                else if (e.target.value === 'xl') updateStyle('boxShadow', '0 20px 25px rgba(0,0,0,0.25)');
                                                else if (e.target.value === 'glow') updateStyle('boxShadow', '0 0 20px rgba(59,130,246,0.5)');
                                            }}
                                            className={`flex-1 border rounded p-2 text-[11px] outline-none transition-colors ${studioTheme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-black/40 border-white/10 text-white'}`}
                                        >
                                            <option value="none">None</option>
                                            <option value="sm">Small</option>
                                            <option value="md">Medium</option>
                                            <option value="lg">Large</option>
                                            <option value="xl">X-Large</option>
                                            <option value="glow">Glow Effect</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* BORDER */}
                            <div>
                                <p className="text-[10px] uppercase font-bold opacity-40 mb-2 flex items-center gap-1">Border</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className={`rounded p-2 flex flex-col gap-1 ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/20'}`}>
                                        <label className="text-[8px] opacity-40 uppercase font-bold">Width</label>
                                        <input type="number" min="0" max="20" value={parseInt(selectedEl.style.borderWidth) || 0} onChange={e => updateStyle('borderWidth', `${e.target.value}px`)} className={`w-full bg-transparent text-[11px] font-mono outline-none ${studioTheme === 'light' ? 'text-gray-800' : 'text-white'}`} />
                                    </div>
                                    <div className={`rounded p-2 flex flex-col gap-1 ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/20'}`}>
                                        <label className="text-[8px] opacity-40 uppercase font-bold">Style</label>
                                        <select value={selectedEl.style.borderStyle || 'solid'} onChange={e => updateStyle('borderStyle', e.target.value)} className={`w-full bg-transparent text-[11px] outline-none ${studioTheme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                            <option value="solid">Solid</option>
                                            <option value="dashed">Dashed</option>
                                            <option value="dotted">Dotted</option>
                                        </select>
                                    </div>
                                    <div className={`rounded p-2 flex flex-col gap-1 ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/20'}`}>
                                        <label className="text-[8px] opacity-40 uppercase font-bold">Color</label>
                                        <input type="color" value={selectedEl.style.borderColor || '#000000'} onChange={e => updateStyle('borderColor', e.target.value)} className="w-full h-4 rounded cursor-pointer border-0 p-0 bg-transparent" />
                                    </div>
                                </div>
                            </div>

                            {/* TEXT SPECIFIC PROPERTIES */}
                            {(selectedEl.type === 'text' || selectedEl.type === 'button') && (
                                <>
                                    <div className={`border-t pt-4 ${studioTheme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
                                        <p className="text-[10px] uppercase font-bold opacity-40 mb-2">Content</p>
                                        <textarea
                                            value={selectedEl.content || ''}
                                            onChange={e => updateElement(selectedEl.id, { content: e.target.value })}
                                            className={`w-full border rounded p-2 text-sm resize-none h-16 transition-colors outline-none ${studioTheme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-800 focus:border-blue-500' : 'bg-black/40 border-white/10 text-white focus:border-blue-500'}`}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-[10px] uppercase font-bold opacity-40 mb-2">Typography</p>
                                        <select
                                            value={selectedEl.style?.fontFamily || 'Inter'}
                                            onChange={e => updateStyle('fontFamily', e.target.value)}
                                            className={`w-full border rounded p-2 text-xs mb-2 ${studioTheme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-800' : 'bg-black/20 border-white/10 text-white'}`}
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
                                            <div className={`flex-1 rounded p-2 flex items-center gap-2 ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/20'}`}>
                                                <span className="text-[10px] opacity-50 uppercase font-bold">Size</span>
                                                <input type="number" value={parseInt(selectedEl.style?.fontSize) || 16} onChange={e => updateStyle('fontSize', `${e.target.value}px`)} className={`flex-1 bg-transparent text-xs font-mono outline-none text-right ${studioTheme === 'light' ? 'text-gray-800' : 'text-white'}`} />
                                            </div>
                                            <div className={`w-12 h-9 rounded p-1 flex items-center justify-center ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/20'}`}>
                                                <input type="color" value={selectedEl.style?.color || '#000000'} onChange={e => updateStyle('color', e.target.value)} className="w-full h-full cursor-pointer border-0 p-0 bg-transparent" />
                                            </div>
                                        </div>

                                        <div className={`flex gap-1 p-1 rounded mb-2 ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/20'}`}>
                                            <button onClick={() => updateStyle('fontWeight', (selectedEl.style?.fontWeight === 'bold' || selectedEl.style?.fontWeight === '700') ? 'normal' : 'bold')} className={`flex-1 p-1.5 rounded flex items-center justify-center ${(selectedEl.style?.fontWeight === 'bold' || selectedEl.style?.fontWeight === '700') ? (studioTheme === 'light' ? 'bg-white shadow' : 'bg-white/20') : 'hover:bg-white/5'}`}><Bold size={14} /></button>
                                            <button onClick={() => updateStyle('fontStyle', selectedEl.style?.fontStyle === 'italic' ? 'normal' : 'italic')} className={`flex-1 p-1.5 rounded flex items-center justify-center ${selectedEl.style?.fontStyle === 'italic' ? (studioTheme === 'light' ? 'bg-white shadow' : 'bg-white/20') : 'hover:bg-white/5'}`}><Italic size={14} /></button>
                                            <button onClick={() => updateStyle('textDecoration', selectedEl.style?.textDecoration === 'underline' ? 'none' : 'underline')} className={`flex-1 p-1.5 rounded flex items-center justify-center ${selectedEl.style?.textDecoration === 'underline' ? (studioTheme === 'light' ? 'bg-white shadow' : 'bg-white/20') : 'hover:bg-white/5'}`}><Underline size={14} /></button>
                                        </div>

                                        <div className={`flex gap-1 p-1 rounded ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/20'}`}>
                                            <button onClick={() => updateStyle('textAlign', 'left')} className={`flex-1 p-1.5 rounded flex items-center justify-center ${selectedEl.style?.textAlign === 'left' ? (studioTheme === 'light' ? 'bg-white shadow' : 'bg-white/20') : 'hover:bg-white/5'}`}><AlignLeft size={14} /></button>
                                            <button onClick={() => updateStyle('textAlign', 'center')} className={`flex-1 p-1.5 rounded flex items-center justify-center ${(!selectedEl.style?.textAlign || selectedEl.style?.textAlign === 'center') ? (studioTheme === 'light' ? 'bg-white shadow' : 'bg-white/20') : 'hover:bg-white/5'}`}><AlignCenter size={14} /></button>
                                            <button onClick={() => updateStyle('textAlign', 'right')} className={`flex-1 p-1.5 rounded flex items-center justify-center ${selectedEl.style?.textAlign === 'right' ? (studioTheme === 'light' ? 'bg-white shadow' : 'bg-white/20') : 'hover:bg-white/5'}`}><AlignRight size={14} /></button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* SHAPE/BUTTON BG PROPERTIES */}
                            {(selectedEl.type === 'square' || selectedEl.type === 'circle' || selectedEl.type === 'button') && (
                                <div className={`border-t pt-4 ${studioTheme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
                                    <p className="text-[10px] uppercase font-bold opacity-40 mb-3">Fill & Border</p>

                                    <div className="space-y-4">
                                        {/* Fill Type */}
                                        <div className={`p-1 rounded flex ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/40'}`}>
                                            <button
                                                onClick={() => {
                                                    const color = selectedEl.style.backgroundColor || '#3b82f6';
                                                    updateElement(selectedEl.id, {
                                                        style: { ...selectedEl.style, background: color, backgroundColor: color },
                                                        useGradient: false
                                                    });
                                                }}
                                                className={`flex-1 py-1 px-2 rounded text-[10px] font-bold transition-all ${!selectedEl.useGradient ? (studioTheme === 'light' ? 'bg-white shadow-sm text-blue-600' : 'bg-white/10 text-white') : 'opacity-40 hover:opacity-100'}`}
                                            >Solid</button>
                                            <button
                                                onClick={() => {
                                                    const c1 = selectedEl.gradientColor1 || selectedEl.style.backgroundColor || '#3b82f6';
                                                    const c2 = selectedEl.gradientColor2 || '#1d4ed8';
                                                    const dir = selectedEl.gradientDirection || '135deg';
                                                    updateElement(selectedEl.id, {
                                                        style: { ...selectedEl.style, background: `linear-gradient(${dir}, ${c1}, ${c2})` },
                                                        useGradient: true,
                                                        gradientColor1: c1,
                                                        gradientColor2: c2,
                                                        gradientDirection: dir
                                                    });
                                                }}
                                                className={`flex-1 py-1 px-2 rounded text-[10px] font-bold transition-all ${selectedEl.useGradient ? (studioTheme === 'light' ? 'bg-white shadow-sm text-blue-600' : 'bg-white/10 text-white') : 'opacity-40 hover:opacity-100'}`}
                                            >Gradient</button>
                                        </div>

                                        {/* Color Controls */}
                                        {!selectedEl.useGradient ? (
                                            <div className="flex gap-2">
                                                <div className={`flex-1 rounded p-2 flex items-center gap-2 ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/20'}`}>
                                                    <input type="color" value={selectedEl.style.backgroundColor || '#3b82f6'} onChange={e => updateElement(selectedEl.id, { style: { ...selectedEl.style, background: e.target.value, backgroundColor: e.target.value } })} className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent" />
                                                    <input type="text" value={selectedEl.style.backgroundColor || '#3b82f6'} onChange={e => updateElement(selectedEl.id, { style: { ...selectedEl.style, background: e.target.value, backgroundColor: e.target.value } })} className={`flex-1 bg-transparent text-[11px] font-mono outline-none ${studioTheme === 'light' ? 'text-gray-800' : 'text-white'}`} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="flex gap-2">
                                                    <div className={`flex-1 rounded p-2 flex flex-col gap-1 ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/20'}`}>
                                                        <span className="text-[8px] opacity-40 uppercase font-bold">Start</span>
                                                        <div className="flex items-center gap-2">
                                                            <input type="color" value={selectedEl.gradientColor1 || '#3b82f6'} onChange={e => {
                                                                const c1 = e.target.value;
                                                                const c2 = selectedEl.gradientColor2 || '#1d4ed8';
                                                                const dir = selectedEl.gradientDirection || '135deg';
                                                                updateElement(selectedEl.id, {
                                                                    style: { ...selectedEl.style, background: `linear-gradient(${dir}, ${c1}, ${c2})` },
                                                                    gradientColor1: c1
                                                                });
                                                            }} className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent" />
                                                            <input type="text" value={selectedEl.gradientColor1 || '#3b82f6'} onChange={e => {
                                                                const c1 = e.target.value;
                                                                const c2 = selectedEl.gradientColor2 || '#1d4ed8';
                                                                const dir = selectedEl.gradientDirection || '135deg';
                                                                updateElement(selectedEl.id, {
                                                                    style: { ...selectedEl.style, background: `linear-gradient(${dir}, ${c1}, ${c2})` },
                                                                    gradientColor1: c1
                                                                });
                                                            }} className={`w-full bg-transparent text-[10px] font-mono outline-none ${studioTheme === 'light' ? 'text-gray-800' : 'text-white'}`} />
                                                        </div>
                                                    </div>
                                                    <div className={`flex-1 rounded p-2 flex flex-col gap-1 ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/20'}`}>
                                                        <span className="text-[8px] opacity-40 uppercase font-bold">End</span>
                                                        <div className="flex items-center gap-2">
                                                            <input type="color" value={selectedEl.gradientColor2 || '#1d4ed8'} onChange={e => {
                                                                const c2 = e.target.value;
                                                                const c1 = selectedEl.gradientColor1 || '#3b82f6';
                                                                const dir = selectedEl.gradientDirection || '135deg';
                                                                updateElement(selectedEl.id, {
                                                                    style: { ...selectedEl.style, background: `linear-gradient(${dir}, ${c1}, ${c2})` },
                                                                    gradientColor2: c2
                                                                });
                                                            }} className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent" />
                                                            <input type="text" value={selectedEl.gradientColor2 || '#1d4ed8'} onChange={e => {
                                                                const c2 = e.target.value;
                                                                const c1 = selectedEl.gradientColor1 || '#3b82f6';
                                                                const dir = selectedEl.gradientDirection || '135deg';
                                                                updateElement(selectedEl.id, {
                                                                    style: { ...selectedEl.style, background: `linear-gradient(${dir}, ${c1}, ${c2})` },
                                                                    gradientColor2: c2
                                                                });
                                                            }} className={`w-full bg-transparent text-[10px] font-mono outline-none ${studioTheme === 'light' ? 'text-gray-800' : 'text-white'}`} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`rounded p-2 flex items-center gap-2 ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/20'}`}>
                                                    <span className="text-[9px] opacity-40 uppercase font-bold">Angle</span>
                                                    <select
                                                        value={selectedEl.gradientDirection || '135deg'}
                                                        onChange={e => {
                                                            const dir = e.target.value;
                                                            const c1 = selectedEl.gradientColor1 || '#3b82f6';
                                                            const c2 = selectedEl.gradientColor2 || '#1d4ed8';
                                                            updateElement(selectedEl.id, {
                                                                style: { ...(selectedEl.style || {}), background: `linear-gradient(${dir}, ${c1}, ${c2})` },
                                                                gradientDirection: dir
                                                            });
                                                        }}
                                                        className={`flex-1 bg-transparent text-[10px] outline-none ${studioTheme === 'light' ? 'text-gray-800' : 'text-white'}`}
                                                    >
                                                        <option value="to right">→ Right</option>
                                                        <option value="to bottom">↓ Bottom</option>
                                                        <option value="to left">← Left</option>
                                                        <option value="to top">↑ Top</option>
                                                        <option value="135deg">↘ Diagonal 1</option>
                                                        <option value="45deg">↗ Diagonal 2</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {/* Corner Radius */}
                                        <div className={`rounded p-2 flex items-center gap-2 ${studioTheme === 'light' ? 'bg-gray-100' : 'bg-black/20'}`}>
                                            <span className="text-[9px] opacity-40 uppercase font-bold">Radius</span>
                                            <input type="range" min="0" max="100" value={parseInt(selectedEl.style?.borderRadius) || 0} onChange={e => updateStyle('borderRadius', `${e.target.value}px`)} className={`flex-1 h-1 rounded appearance-none ${studioTheme === 'light' ? 'bg-gray-300' : 'bg-white/10'}`} />
                                            <input type="number" value={parseInt(selectedEl.style?.borderRadius) || 0} onChange={e => updateStyle('borderRadius', `${e.target.value}px`)} className={`w-10 bg-transparent text-[10px] font-mono outline-none text-right ${studioTheme === 'light' ? 'text-gray-800' : 'text-white'}`} />
                                            <span className="text-[9px] opacity-20 px-1">px</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* IMAGE PROPERTIES */}
                            {selectedEl.type === 'image' && (
                                <div className={`border-t pt-4 ${studioTheme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
                                    <p className="text-[10px] uppercase font-bold opacity-40 mb-2">Image</p>
                                    <select
                                        value={selectedEl.style.objectFit || 'contain'}
                                        onChange={e => updateStyle('objectFit', e.target.value)}
                                        className={`w-full border rounded p-2 text-xs ${studioTheme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-800' : 'bg-black/20 border-white/10 text-white'}`}
                                    >
                                        <option value="contain">Contain</option>
                                        <option value="cover">Cover</option>
                                        <option value="fill">Fill</option>
                                        <option value="none">None</option>
                                    </select>
                                </div>
                            )}

                            {/* LAYER ACTIONS */}
                            <div className={`border-t pt-4 ${studioTheme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
                                <p className="text-[10px] uppercase font-bold opacity-40 mb-2">Layer</p>
                                <div className="grid grid-cols-4 gap-1">
                                    <button onClick={() => moveLayer('up')} className={`p-2 rounded flex items-center justify-center ${studioTheme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' : 'bg-black/20 hover:bg-white/10 text-white'}`} title="Move Up"><ChevronUp size={14} /></button>
                                    <button onClick={() => moveLayer('down')} className={`p-2 rounded flex items-center justify-center ${studioTheme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' : 'bg-black/20 hover:bg-white/10 text-white'}`} title="Move Down"><ChevronDown size={14} /></button>
                                    <button onClick={duplicateElement} className={`p-2 rounded flex items-center justify-center ${studioTheme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' : 'bg-black/20 hover:bg-white/10 text-white'}`} title="Duplicate"><Copy size={14} /></button>
                                    <button onClick={deleteElement} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded flex items-center justify-center" title="Delete"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()
            }

        </div >
    );
};

export default VisualBuilder;
