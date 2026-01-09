import React, { useState } from 'react';
import {
    Image, Palette, Type, Sparkles, X, Search,
    ShoppingCart, Tag, Percent, Star, Heart, Zap,
    Package, Truck, Clock, Award, Gift, Shield
} from 'lucide-react';

// Icônes disponibles pour les bannières
const ICON_LIBRARY = [
    { name: 'shopping-cart', icon: ShoppingCart, label: 'Panier' },
    { name: 'tag', icon: Tag, label: 'Étiquette' },
    { name: 'percent', icon: Percent, label: 'Réduction' },
    { name: 'star', icon: Star, label: 'Étoile' },
    { name: 'heart', icon: Heart, label: 'Coeur' },
    { name: 'zap', icon: Zap, label: 'Éclair' },
    { name: 'package', icon: Package, label: 'Colis' },
    { name: 'truck', icon: Truck, label: 'Livraison' },
    { name: 'clock', icon: Clock, label: 'Temps' },
    { name: 'award', icon: Award, label: 'Prix' },
    { name: 'gift', icon: Gift, label: 'Cadeau' },
    { name: 'shield', icon: Shield, label: 'Garantie' },
];

// Palettes de couleurs prédéfinies
const COLOR_PALETTES = [
    {
        name: 'Neon',
        colors: ['#00ff88', '#00d4ff', '#ff00ff', '#ffff00', '#ff6b6b']
    },
    {
        name: 'Corporate',
        colors: ['#1a1a2e', '#16213e', '#0f3460', '#e94560', '#ffffff']
    },
    {
        name: 'Nature',
        colors: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#b7e4c7']
    },
    {
        name: 'Sunset',
        colors: ['#ff6b35', '#f7c59f', '#efa8b1', '#d45d79', '#4a0e4e']
    },
    {
        name: 'Ocean',
        colors: ['#0077b6', '#00b4d8', '#90e0ef', '#caf0f8', '#03045e']
    },
    {
        name: 'Dark Mode',
        colors: ['#0d1117', '#161b22', '#21262d', '#30363d', '#c9d1d9']
    },
    {
        name: 'Luxury',
        colors: ['#d4af37', '#c9a227', '#1a1a1a', '#0d0d0d', '#ffffff']
    },
    {
        name: 'Pastel',
        colors: ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff']
    }
];

// Images stock gratuites (Unsplash)
const STOCK_IMAGES = [
    { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', label: 'Écouteurs' },
    { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', label: 'Montre' },
    { url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400', label: 'Polaroid' },
    { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', label: 'Sneaker' },
    { url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400', label: 'Parfum' },
    { url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400', label: 'Crème' },
    { url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', label: 'Lunettes' },
    { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', label: 'Sac' },
    { url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400', label: 'Basket' },
    { url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400', label: 'Smart Watch' },
    { url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400', label: 'Casque' },
    { url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400', label: 'Rouge à lèvres' },
];

// Gradients prédéfinis
const GRADIENTS = [
    { name: 'Purple Pink', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Neon', value: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)' },
    { name: 'Sunset', value: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)' },
    { name: 'Ocean', value: 'linear-gradient(135deg, #667eea 0%, #00d4ff 100%)' },
    { name: 'Fire', value: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)' },
    { name: 'Dark', value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
    { name: 'Gold', value: 'linear-gradient(135deg, #d4af37 0%, #f9d423 100%)' },
    { name: 'Emerald', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
];

/**
 * AssetLibrary - Bibliothèque d'assets pour l'éditeur
 */
const AssetLibrary = ({ isOpen, onClose, onInsert }) => {
    const [activeTab, setActiveTab] = useState('images');
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedItem, setCopiedItem] = useState(null);

    if (!isOpen) return null;

    const handleCopyColor = (color) => {
        navigator.clipboard.writeText(color);
        setCopiedItem(color);
        setTimeout(() => setCopiedItem(null), 1500);
    };

    const handleInsertImage = (url) => {
        const code = `<img src="${url}" alt="Product" style="width: 100%; height: auto; object-fit: cover;" />`;
        onInsert(code);
    };

    const handleInsertIcon = (iconName) => {
        // SVG inline pour les icônes
        const svgCode = `<!-- Icon: ${iconName} -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <!-- Remplacer par le SVG de ${iconName} -->
</svg>`;
        onInsert(svgCode);
    };

    // Sites sources e-commerce avec logos
    const SOURCE_SITES = [
        {
            name: 'Amazon',
            key: 'amazon',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
            color: '#FF9900'
        },
        {
            name: 'AliExpress',
            key: 'aliexpress',
            logo: 'https://ae01.alicdn.com/kf/S9177d7f9251842339ba3c1ef19b1b990R.png',
            color: '#E62E04'
        },
        {
            name: 'eBay',
            key: 'ebay',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg',
            color: '#0064D2'
        },
        {
            name: 'Cdiscount',
            key: 'cdiscount',
            logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/8/8e/Cdiscount_logo.svg/200px-Cdiscount_logo.svg.png',
            color: '#00529B'
        },
        {
            name: 'Fnac',
            key: 'fnac',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Fnac_Logo.svg',
            color: '#E1A400'
        },
        {
            name: 'Rakuten',
            key: 'rakuten',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Rakuten_Global_Brand_Logo.svg',
            color: '#BF0000'
        }
    ];

    const handleInsertGradient = (gradient) => {
        const code = `background: ${gradient};`;
        onInsert(code);
    };

    const handleInsertSiteLogo = (site) => {
        const code = `<img src="${site.logo}" alt="${site.name}" style="height: 20px; width: auto;" data-field="sourceLogo" />`;
        onInsert(code);
    };

    const handleInsertSiteBadge = (site) => {
        const code = `<div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: ${site.color}; border-radius: 4px;">
    <img src="${site.logo}" alt="${site.name}" style="height: 16px; width: auto; filter: brightness(0) invert(1);" />
    <span style="color: white; font-size: 11px; font-weight: bold;">${site.name}</span>
</div>`;
        onInsert(code);
    };

    const tabs = [
        { id: 'images', label: 'Images', icon: Image },
        { id: 'sites', label: 'Boutiques', icon: ShoppingCart },
        { id: 'colors', label: 'Couleurs', icon: Palette },
        { id: 'gradients', label: 'Dégradés', icon: Sparkles },
        { id: 'icons', label: 'Icônes', icon: Type },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-[700px] max-h-[80vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Sparkles className="text-purple-400" size={20} />
                        Bibliothèque d'Assets
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all ${activeTab === tab.id
                                ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                                : 'text-white/50 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="p-4 border-b border-white/5">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {activeTab === 'images' && (
                        <div className="grid grid-cols-4 gap-3">
                            {STOCK_IMAGES.filter(img =>
                                img.label.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleInsertImage(img.url)}
                                    className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-purple-500 transition-all"
                                >
                                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                        <span className="text-xs font-bold text-white">{img.label}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTab === 'sites' && (
                        <div className="space-y-6">
                            {/* Sites E-commerce */}
                            <div>
                                <h3 className="text-sm font-bold text-white/60 mb-3">🛒 Sites E-commerce</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {SOURCE_SITES.filter(site =>
                                        site.name.toLowerCase().includes(searchTerm.toLowerCase())
                                    ).map((site) => (
                                        <div key={site.key} className="space-y-2">
                                            <button
                                                onClick={() => handleInsertSiteLogo(site)}
                                                className="w-full p-4 rounded-xl border border-white/10 hover:border-purple-500 bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center gap-2"
                                                style={{ borderLeftColor: site.color, borderLeftWidth: '3px' }}
                                            >
                                                <img src={site.logo} alt={site.name} className="h-6 object-contain" />
                                                <span className="text-[10px] text-white/60">{site.name}</span>
                                            </button>
                                            <button
                                                onClick={() => handleInsertSiteBadge(site)}
                                                className="w-full text-[9px] text-purple-400 hover:text-purple-300"
                                            >
                                                + Badge avec couleur
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Badges Promo */}
                            <div>
                                <h3 className="text-sm font-bold text-white/60 mb-3">🏷️ Badges Promo</h3>
                                <div className="grid grid-cols-4 gap-3">
                                    <button
                                        onClick={() => onInsert(`<div style="position: absolute; top: 8px; left: 8px; background: #e53935; color: white; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold;">PROMO</div>`)}
                                        className="p-3 rounded-xl border border-white/10 hover:border-red-500 bg-red-500/20 text-center"
                                    >
                                        <span className="text-xs font-bold text-red-400">PROMO</span>
                                    </button>
                                    <button
                                        onClick={() => onInsert(`<div style="position: absolute; top: 8px; left: 8px; background: #ff9800; color: white; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold;">-[margin]%</div>`)}
                                        className="p-3 rounded-xl border border-white/10 hover:border-orange-500 bg-orange-500/20 text-center"
                                    >
                                        <span className="text-xs font-bold text-orange-400">-XX%</span>
                                    </button>
                                    <button
                                        onClick={() => onInsert(`<div style="position: absolute; top: 8px; left: 8px; background: #4caf50; color: white; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold;">OFFRE</div>`)}
                                        className="p-3 rounded-xl border border-white/10 hover:border-green-500 bg-green-500/20 text-center"
                                    >
                                        <span className="text-xs font-bold text-green-400">OFFRE</span>
                                    </button>
                                    <button
                                        onClick={() => onInsert(`<div style="position: absolute; top: 8px; left: 8px; background: #9c27b0; color: white; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold;">NEW</div>`)}
                                        className="p-3 rounded-xl border border-white/10 hover:border-purple-500 bg-purple-500/20 text-center"
                                    >
                                        <span className="text-xs font-bold text-purple-400">NEW</span>
                                    </button>
                                    <button
                                        onClick={() => onInsert(`<div style="position: absolute; top: 8px; left: 8px; background: #2196f3; color: white; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold;">⭐ TOP</div>`)}
                                        className="p-3 rounded-xl border border-white/10 hover:border-blue-500 bg-blue-500/20 text-center"
                                    >
                                        <span className="text-xs font-bold text-blue-400">⭐ TOP</span>
                                    </button>
                                    <button
                                        onClick={() => onInsert(`<div style="position: absolute; top: 8px; left: 8px; background: #f44336; color: white; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; animation: pulse 1s infinite;">🔥 HOT</div>`)}
                                        className="p-3 rounded-xl border border-white/10 hover:border-red-500 bg-red-500/20 text-center"
                                    >
                                        <span className="text-xs font-bold text-red-400">🔥 HOT</span>
                                    </button>
                                    <button
                                        onClick={() => onInsert(`<div style="position: absolute; top: 8px; left: 8px; background: #607d8b; color: white; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold;">STOCK LIMITÉ</div>`)}
                                        className="p-3 rounded-xl border border-white/10 hover:border-gray-500 bg-gray-500/20 text-center"
                                    >
                                        <span className="text-xs font-bold text-gray-400">STOCK</span>
                                    </button>
                                    <button
                                        onClick={() => onInsert(`<div style="position: absolute; top: 8px; left: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold;">EXCLUSIF</div>`)}
                                        className="p-3 rounded-xl border border-white/10 hover:border-purple-500 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-center"
                                    >
                                        <span className="text-xs font-bold text-purple-400">EXCLUSIF</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'colors' && (
                        <div className="space-y-6">
                            {COLOR_PALETTES.filter(p =>
                                p.name.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((palette) => (
                                <div key={palette.name}>
                                    <h3 className="text-sm font-bold text-white/60 mb-3">{palette.name}</h3>
                                    <div className="flex gap-2">
                                        {palette.colors.map((color, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleCopyColor(color)}
                                                className={`relative w-12 h-12 rounded-xl border-2 transition-all hover:scale-110 ${copiedItem === color ? 'border-green-500' : 'border-white/20 hover:border-white/50'
                                                    }`}
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            >
                                                {copiedItem === color && (
                                                    <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white bg-black/50 rounded-xl">
                                                        Copié!
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'gradients' && (
                        <div className="grid grid-cols-2 gap-4">
                            {GRADIENTS.filter(g =>
                                g.name.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((gradient) => (
                                <button
                                    key={gradient.name}
                                    onClick={() => handleInsertGradient(gradient.value)}
                                    className="h-24 rounded-xl border border-white/10 hover:border-purple-500 transition-all flex items-end p-3"
                                    style={{ background: gradient.value }}
                                >
                                    <span className="text-xs font-bold text-white bg-black/40 px-2 py-1 rounded">
                                        {gradient.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTab === 'icons' && (
                        <div className="grid grid-cols-6 gap-3">
                            {ICON_LIBRARY.filter(icon =>
                                icon.label.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => handleInsertIcon(item.name)}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/10 hover:border-purple-500 hover:bg-purple-500/10 transition-all"
                                >
                                    <item.icon size={24} className="text-purple-400" />
                                    <span className="text-[10px] text-white/60">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-black/20">
                    <p className="text-xs text-white/40 text-center">
                        Cliquez sur un élément pour l'insérer dans l'éditeur
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AssetLibrary;
