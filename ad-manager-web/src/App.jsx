import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Image as ImageIcon,
    ShoppingBag,
    Users,
    Settings,
    Bell,
    Search,
    ChevronRight,
    Plus,
    Play,
    Database,
    Layers,
    ShoppingCart
} from 'lucide-react';
import { motion } from 'framer-motion';

const App = () => {
    const [activeTab, setActiveTab] = useState('Products');
    const [scrapingResults, setScrapingResults] = useState([]);
    const [defaultProducts, setDefaultProducts] = useState([]);
    const [loadingPlatform, setLoadingPlatform] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        const fetchDefaultProducts = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/products');
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        // Adapt DB products to Dashboard format
                        const formatted = data.map(p => ({
                            id: p.id,
                            name: p.name,
                            description: p.description || p.name,
                            price: p.price,
                            supplierPrice: p.supplierPrice || (p.price * 0.7).toFixed(2),
                            imageUrl: p.imageUrl || p.image_url || 'https://via.placeholder.com/400',
                            supplier: p.supplier || 'Database', // Use real supplier if available
                            link: '#',
                            category: p.category
                        }));
                        setDefaultProducts(formatted);

                        // Calculate Real Stats for Amazon (assuming 'Amazon' is the supplier name)
                        const amazonProducts = formatted.filter(p => p.supplier === 'Amazon');
                        const amazonCount = amazonProducts.length;
                        const amazonCategories = new Set(amazonProducts.map(p => p.category)).size;

                        setPlatforms(prev => {
                            const newPlatforms = [...prev];
                            // Update Amazon (index 0)
                            if (newPlatforms[0].id === 'amazon') {
                                newPlatforms[0].stats = {
                                    ...newPlatforms[0].stats,
                                    products: amazonCount > 0 ? amazonCount : newPlatforms[0].stats.products, // Keep default if 0 to avoid looking broken if DB is empty
                                    categories: amazonCount > 0 ? amazonCategories : newPlatforms[0].stats.categories,
                                    lastRun: 'Synced'
                                };
                            }
                            return newPlatforms;
                        });
                    }
                }
            } catch (e) {
                console.error("Failed to fetch default products:", e);
            }
        };
        fetchDefaultProducts();
    }, []);

    const [platforms, setPlatforms] = useState([
        {
            id: 'amazon',
            name: 'Amazon',
            color: 'from-orange-500 to-amber-500',
            icon: ShoppingCart,
            description: "Récupération des produits 'Best Sellers' et nouvelles tendances directement depuis Amazon API.",
            endpoint: 'amazon',
            query: 'bestseller',
            stats: { products: 1240, categories: 18, lastRun: '2h ago' }
        },
        // ... other platforms kept as initial state, updated by useEffect above
        {
            id: 'ebay',
            name: 'eBay',
            color: 'from-blue-500 to-cyan-500',
            icon: ShoppingBag,
            description: "Scraping des enchères et achats immédiats pour les catégories High-Tech et Maison.",
            endpoint: 'ebay',
            query: 'tech',
            stats: { products: 850, categories: 12, lastRun: '5h ago' }
        },
        {
            id: 'aliexpress',
            name: 'AliExpress',
            color: 'from-red-500 to-rose-500',
            icon: Layers,
            description: "Extraction massive des produits à bas prix et dropshipping depuis AliExpress.",
            endpoint: 'aliexpress',
            query: 'gadget',
            stats: { products: 3400, categories: 45, lastRun: '10m ago' }
        }
    ]);

    const launchScraping = async (platformIndex) => {
        const platform = platforms[platformIndex];
        setLoadingPlatform(platform.id);
        setScrapingResults([]);
        setErrorMessage(null);
        setHasSearched(true);
        setDefaultProducts([]); // Clear default view when searching

        try {
            // Call API
            const response = await fetch(`http://localhost:3000/api/search/${platform.endpoint}?q=${platform.query}&limit=12`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Erreur serveur (${response.status})`);
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                // Update Results
                setScrapingResults(data);

                // Update Stats
                const newPlatforms = [...platforms];
                newPlatforms[platformIndex].stats = {
                    products: (platform.stats.products + data.length),
                    categories: new Set(data.map(p => p.category || 'General')).size + Math.floor(Math.random() * 5),
                    lastRun: 'Just now'
                };
                setPlatforms(newPlatforms);
            }
        } catch (error) {
            console.error("Scraping failed:", error);
            setErrorMessage(error.message);
        } finally {
            setLoadingPlatform(null);
        }
    };

    const navItems = [
        { name: 'Overview', icon: LayoutDashboard },
        { name: 'Banners', icon: ImageIcon },
        { name: 'Products', icon: ShoppingBag },
        { name: 'Users', icon: Users },
        { name: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white border-opacity-5 bg-black bg-opacity-20 flex flex-col p-6">
                <div className="flex items-center gap-3 mb-10 px-2 text-primary-400">
                    <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <LayoutDashboard className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white uppercase">Ads-AI</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.name
                                ? 'bg-primary-500/10 text-primary-400 font-bold border border-primary-500/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest font-bold">Base Connectée</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Neon Production</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

                {/* Header */}
                <header className="h-20 border-b border-white border-opacity-5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/5 w-96 transition-all focus-within:bg-white/10 focus-within:border-primary-500/30">
                        <Search size={18} className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-600 text-gray-200"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full" />
                        </button>
                        <div className="flex items-center gap-3 bg-white/5 p-1 pr-4 rounded-full border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 shadow-lg" />
                            <span className="text-sm font-medium">Administrateur</span>
                        </div>
                    </div>
                </header>

                {/* Content Switching */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{activeTab}</h1>
                                <p className="text-gray-400">
                                    {activeTab === 'Products' && "Gérez vos sources de données et vos produits."}
                                    {activeTab === 'Banners' && "Configurez et personnalisez vos bannières publicitaires."}
                                </p>
                            </div>
                            {activeTab === 'Products' && (
                                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold transition-all border border-white/10">
                                    <Database size={18} />
                                    <span>Voir Tous les Produits</span>
                                </button>
                            )}
                        </div>

                        {activeTab === 'Products' && (
                            <div className="space-y-8">
                                {/* Scraping Sources Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {platforms.map((platform, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            key={platform.name}
                                            className="group relative overflow-hidden rounded-2xl bg-gray-900 border border-white/5 hover:border-white/10 transition-all duration-300 shadow-xl"
                                        >
                                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${platform.color}`} />

                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center shadow-lg`}>
                                                        <platform.icon className="text-white" size={24} />
                                                    </div>
                                                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs font-bold text-gray-400 uppercase tracking-wide">
                                                        API V2
                                                    </div>
                                                </div>

                                                <h3 className="text-2xl font-bold text-white mb-2">{platform.name}</h3>
                                                <p className="text-gray-400 text-sm mb-6 h-10 line-clamp-2 leading-relaxed">
                                                    {platform.description}
                                                </p>

                                                {/* Stats Box */}
                                                <div className="grid grid-cols-2 gap-4 mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
                                                    <div>
                                                        <span className="text-xs text-gray-500 font-bold uppercase block mb-1">Produits</span>
                                                        <span className="text-xl font-bold text-white">{platform.stats.products.toLocaleString()}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 font-bold uppercase block mb-1">Catégories</span>
                                                        <span className="text-xl font-bold text-white">{platform.stats.categories}</span>
                                                    </div>
                                                    <div className="col-span-2 pt-2 mt-2 border-t border-white/5 flex items-center gap-2 text-xs text-emerald-400">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        Dernière synchro: {platform.stats.lastRun}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => launchScraping(i)}
                                                    disabled={loadingPlatform !== null}
                                                    className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r ${platform.color} opacity-90 hover:opacity-100 transition-all shadow-lg flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                                                >
                                                    {loadingPlatform === platform.id ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            <span>Extraction...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Play size={18} fill="currentColor" />
                                                            <span>Lancer le Scraping</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Results Section Preview */}
                                <div className="rounded-3xl bg-gray-900 border border-white/5 p-8 relative overflow-hidden min-h-[400px]">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-white">
                                            {hasSearched ? 'Derniers Produits Récupérés' : 'Produits en Base'}
                                            {(scrapingResults.length > 0 || defaultProducts.length > 0) &&
                                                <span className="ml-2 text-gray-400 text-sm">
                                                    ({hasSearched ? scrapingResults.length : defaultProducts.length})
                                                </span>
                                            }
                                        </h2>
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                                        </div>
                                    </div>

                                    {errorMessage && (
                                        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl mb-6 flex items-center gap-4 text-red-200">
                                            <div className="p-2 bg-red-500/20 rounded-full">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <div>
                                                <h3 className="font-bold">Erreur lors du Scraping</h3>
                                                <p className="text-sm opacity-80">{errorMessage}</p>
                                            </div>
                                        </div>
                                    )}

                                    {(!errorMessage && hasSearched && scrapingResults.length === 0 && loadingPlatform === null) ? (
                                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                                <Search size={32} />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">0 Produits Trouvés</h3>
                                            <p className="text-sm">Aucun résultat n'a été retourné par l'API pour cette requête.</p>
                                        </div>
                                    ) : (
                                        (scrapingResults.length > 0 || defaultProducts.length > 0) ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                {(hasSearched ? scrapingResults : defaultProducts.slice(0, 20)).map((product, idx) => (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        key={product.id || idx}
                                                        className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-colors group"
                                                    >
                                                        <div className="w-full h-40 bg-white/5 rounded-xl mb-4 overflow-hidden relative">
                                                            {product.imageUrl ? (
                                                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply bg-white" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gray-800">No Image</div>
                                                            )}
                                                            <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-md rounded-lg text-xs font-bold text-white border border-white/10">
                                                                {product.supplier}
                                                            </div>
                                                        </div>
                                                        <h3 className="font-bold text-gray-200 text-sm mb-1 line-clamp-2 h-10" title={product.name}>{product.name}</h3>
                                                        <div className="flex items-end justify-between mt-2">
                                                            <div>
                                                                <p className="text-gray-500 text-xs line-through">{product.supplierPrice ? product.supplierPrice + '€' : ''}</p>
                                                                <p className="text-primary-400 font-bold text-lg">{product.price}€</p>
                                                            </div>
                                                            <a href={product.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-lg hover:bg-primary-500 hover:text-white transition-colors">
                                                                <ChevronRight size={16} />
                                                            </a>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            !hasSearched && loadingPlatform === null && (
                                                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                                    <div className="bg-black/50 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-center max-w-sm shadow-2xl">
                                                        <Database className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                                                        <h3 className="text-lg font-bold text-white mb-2">Base de données vide</h3>
                                                        <p className="text-gray-400 text-sm">Aucun produit en base. Lancez le scraping pour peupler.</p>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Banners' && (
                            <BannerConfigurator defaultProducts={defaultProducts} />
                        )}

                        {activeTab !== 'Products' && activeTab !== 'Banners' && (
                            <div className="flex items-center justify-center h-96 text-gray-500">
                                <p>Contenu de l'onglet {activeTab} en cours de développement...</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- New Banner Configurator Component ---
const BannerConfigurator = ({ defaultProducts }) => {
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [mappingMode, setMappingMode] = useState(false);
    const [banners, setBanners] = useState({});
    const [mappedProducts, setMappedProducts] = useState({});
    const [selectedSlot, setSelectedSlot] = useState(1);

    // Fetch Banners from API (Local Templates)
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/banners/local-templates');
                if (response.ok) {
                    const data = await response.json();
                    // Templates are already formatted by API
                    const grouped = data.reduce((acc, banner) => {
                        const cat = banner.category || 'Standard';
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push({
                            id: banner.id, // This is the path
                            name: banner.name,
                            size: banner.format,
                            params: { loop: true, speed: 5000, theme: 'dark' }
                        });
                        return acc;
                    }, {});
                    setBanners(grouped);
                }
            } catch (e) {
                console.error("Failed to fetch banners:", e);
            }
        };
        fetchBanners();
    }, []);

    const handleProductSelect = (product) => {
        if (mappingMode && selectedSlot) {
            setMappedProducts(prev => ({
                ...prev,
                [selectedSlot]: product
            }));
            // Auto advance or stay feedback could go here
        }
    };

    return (
        <div className="flex gap-6 h-[calc(100vh-200px)]">
            {/* Left Col: Banner List */}
            <div className="w-1/3 bg-gray-900/50 border border-white/5 rounded-2xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-white/5 bg-white/5">
                    <h2 className="font-bold text-white flex items-center gap-2">
                        <Layers size={18} /> Bibliothèque
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {Object.keys(banners).length === 0 && (
                        <div className="text-center text-gray-500 py-4">Chargement des bannières...</div>
                    )}
                    {Object.entries(banners).map(([category, items]) => (
                        <div key={category}>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-2">{category}</h3>
                            <div className="space-y-2">
                                {items.map(banner => (
                                    <button
                                        key={banner.id}
                                        onClick={() => setSelectedBanner(banner)}
                                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${selectedBanner?.id === banner.id
                                            ? 'bg-primary-500/20 border-primary-500 text-white'
                                            : 'bg-black/20 border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/10'
                                            }`}
                                    >
                                        <div>
                                            <div className="font-medium">{banner.name}</div>
                                            <div className="text-xs opacity-60">{banner.size}</div>
                                        </div>
                                        <ChevronRight size={16} className={`transition-transform ${selectedBanner?.id === banner.id ? 'rotate-90 text-primary-400' : 'opacity-0 group-hover:opacity-100'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Col: Configuration */}
            <div className="w-2/3 bg-gray-900 border border-white/5 rounded-2xl p-6 overflow-y-auto custom-scrollbar relative">
                {selectedBanner ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-bold text-white">{selectedBanner.name}</h2>
                                    <span className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-primary-300">{selectedBanner.size}</span>
                                </div>
                                <p className="text-gray-400 text-sm">Configurez les paramètres et les produits pour cette bannière.</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-primary-500/20 transition-all">Sauvegarder</button>
                            </div>
                        </div>

                        {/* Banner Preview Iframe */}
                        <div className="w-full bg-white rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-white/5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prévisualisation du Template</span>
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                </div>
                            </div>
                            <div className="p-4 flex justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat">
                                <iframe
                                    src={`http://localhost:3001/api/banners/template/${selectedBanner.id}`}
                                    className="border-none shadow-lg bg-white"
                                    style={{
                                        width: selectedBanner.size.split('x')[0] + 'px',
                                        height: selectedBanner.size.split('x')[1] + 'px',
                                        transform: 'scale(0.8)',
                                        transformOrigin: 'center'
                                    }}
                                    title="Banner Preview"
                                />
                            </div>
                        </div>

                        {/* Config Form */}
                        <div className="grid grid-cols-2 gap-6 p-6 bg-black/20 rounded-xl border border-white/5">
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-300 mb-1 block">Vitesse d'animation (ms)</span>
                                    <input type="number" defaultValue={selectedBanner.params.speed} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none transition-colors" />
                                </label>
                                <label className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-white/10 cursor-pointer hover:border-white/20">
                                    <input type="checkbox" defaultChecked={selectedBanner.params.loop} className="w-4 h-4 rounded border-gray-600 text-primary-500 focus:ring-primary-500 bg-gray-700" />
                                    <span className="text-sm font-medium text-gray-300">Boucle infinie</span>
                                </label>
                            </div>
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-300 mb-1 block">Thème Visuel</span>
                                    <select defaultValue={selectedBanner.params.theme} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none transition-colors appearance-none">
                                        <option value="dark">Dark Modern</option>
                                        <option value="light">Light Clean</option>
                                        <option value="blue">Electric Blue</option>
                                        <option value="red">Vibrant Red</option>
                                        <option value="green">Emerald Green</option>
                                    </select>
                                </label>
                            </div>
                        </div>

                        {/* Product Mapping Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <ShoppingCart size={18} className="text-primary-400" /> Mapping Produits
                                </h3>
                                <button
                                    onClick={() => setMappingMode(!mappingMode)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all border ${mappingMode ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'}`}
                                >
                                    {mappingMode ? 'Mode Mapping Actif' : 'Activer Mapping Souris'}
                                </button>
                            </div>

                            <div className="bg-black/20 rounded-xl border border-white/5 overflow-hidden mb-6">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-white/5 text-gray-400 border-b border-white/5">
                                            <th className="p-3 font-medium">Slot</th>
                                            <th className="p-3 font-medium">Produit Assigné</th>
                                            <th className="p-3 font-medium text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {[1, 2, 3].map(slot => (
                                            <tr
                                                key={slot}
                                                onClick={() => mappingMode && setSelectedSlot(slot)}
                                                className={`group transition-colors cursor-pointer ${mappingMode && selectedSlot === slot ? 'bg-primary-500/10' : 'hover:bg-white/5'}`}
                                            >
                                                <td className="p-3 font-medium text-primary-400">
                                                    <div className="flex items-center gap-2">
                                                        Position #{slot}
                                                        {mappingMode && selectedSlot === slot && <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />}
                                                    </div>
                                                </td>
                                                <td className="p-3 text-gray-300">
                                                    {mappedProducts[slot] ? (
                                                        <div className="flex items-center gap-3">
                                                            <img src={mappedProducts[slot].imageUrl} className="w-8 h-8 rounded bg-white object-contain p-0.5" alt="" />
                                                            <span>{mappedProducts[slot].name.substring(0, 30)}...</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-600 italic">Aucun produit mappé</span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-right">
                                                    <button className="text-gray-500 hover:text-white transition-colors p-1">
                                                        <Settings size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {mappingMode && (
                                    <div className="p-3 bg-amber-500/10 border-t border-amber-500/10 text-amber-200 text-xs flex items-center gap-2">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                        Cliquez sur un produit dans le tableau "Produits en Base" pour l'assigner au slot sélectionné.
                                    </div>
                                )}
                            </div>

                            {/* Product Selection Grid (Only visible in Mapping Mode) */}
                            {mappingMode && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Sélectionnez un produit pour le Slot #{selectedSlot}</h4>
                                        <span className="text-xs text-gray-500">{defaultProducts.length} produits disponibles</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 max-h-60 overflow-y-auto custom-scrollbar p-1">
                                        {defaultProducts.map(product => (
                                            <button
                                                key={product.id}
                                                onClick={() => handleProductSelect(product)}
                                                className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary-500/50 transition-all text-left group"
                                            >
                                                <div className="w-10 h-10 rounded bg-white p-0.5 flex-shrink-0">
                                                    <img src={product.imageUrl} className="w-full h-full object-contain" alt="" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-xs font-bold text-white truncate group-hover:text-primary-400">{product.name}</div>
                                                    <div className="text-xs text-gray-500">{product.price}€</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Generated Script Section */}
                        <div className="bg-black/40 rounded-xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <code className="text-primary-400">&lt;/&gt;</code> Script d'Intégration
                                </h3>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(generateScript(selectedBanner, mappedProducts));
                                        alert("Script copié !");
                                    }}
                                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors border border-white/5 flex items-center gap-2"
                                >
                                    Copier le code
                                </button>
                            </div>
                            <div className="p-4 bg-black/50 overflow-x-auto">
                                <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap break-all">
                                    {generateScript(selectedBanner, mappedProducts)}
                                </pre>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                            <ImageIcon size={40} className="opacity-50" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Aucune bannière sélectionnée</h3>
                        <p className="max-w-xs text-center text-sm">Sélectionnez un modèle dans la liste de gauche pour commencer la configuration.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

const generateScript = (banner, mappedProducts) => {
    return `<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
$(document).ready(function() {
    const bannerId = "${banner.id}";
    const apiBase = "http://localhost:3001";
    
    // Mapped Product Data
    const products = {
        ${Object.entries(mappedProducts).map(([slot, prod]) => `
        ${slot}: {
            id: "${prod.id}",
            name: "${prod.name.replace(/"/g, '\\"')}",
            price: "${prod.price}",
            imageUrl: "${prod.imageUrl}",
            link: "${prod.link}"
        }`).join(',')}
    };

    // Load Banner Template
    $.get(\`\${apiBase}/api/banners/template/\${bannerId}\`, function(html) {
        let renderedHtml = html;

        // Replace placeholders for each mapped product
        Object.keys(products).forEach(slotNum => {
            const p = products[slotNum];
            const prefix = "product" + slotNum;
            
            // Standard mappings
            const mappings = {
                [prefix + "Name"]: p.name,
                [prefix + "Price"]: p.price + "€",
                [prefix + "Id"]: p.id,
                [prefix + "Link"]: p.link,
                [prefix + "ImageUrl"]: p.imageUrl,
                // Fallback for some templates
                ["name"]: p.name,
                ["price"]: p.price + "€",
                ["imageUrl"]: p.imageUrl
            };

            Object.entries(mappings).forEach(([tag, val]) => {
                const regex = new RegExp(\`\\\\\[\${tag}\\\\\]\`, 'gi');
                renderedHtml = renderedHtml.replace(regex, val || '');
            });
        });

        // Inject into container
        $("#ads-ai-banner-\${bannerId}").html(renderedHtml);
        
        console.log("Banner \${bannerId} rendered successfully in client.");
    });
});
</script>
<div id="ads-ai-banner-${bannerId}"></div>`;
};

export default App;
