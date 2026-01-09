import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { X, Search, ChevronLeft, ChevronRight, Package, Check } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const ITEMS_PER_PAGE = 12;

/**
 * ProductPickerModal - Popup pour sélectionner un produit de la base de données
 */
const ProductPickerModal = ({ isOpen, onClose, onSelect, selectedProductId }) => {
    const { theme, currentTheme } = useTheme();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // Charger les produits
    useEffect(() => {
        if (!isOpen) return;

        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams({
                    page: currentPage,
                    limit: ITEMS_PER_PAGE,
                    ...(searchQuery && { search: searchQuery })
                });

                const response = await fetch(`${API_URL}/products?${params}`);

                if (!response.ok) throw new Error('Erreur API');

                const data = await response.json();

                // Gérer différents formats de réponse API
                if (Array.isArray(data)) {
                    setProducts(data);
                    setTotalProducts(data.length);
                    setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
                } else if (data.products) {
                    setProducts(data.products);
                    setTotalProducts(data.total || data.products.length);
                    setTotalPages(data.totalPages || Math.ceil((data.total || data.products.length) / ITEMS_PER_PAGE));
                } else {
                    setProducts([]);
                }
            } catch (err) {
                console.error('Erreur chargement produits:', err);
                setError('Impossible de charger les produits');
                // Fallback avec des données de démo
                setProducts([
                    { id: 'demo-1', name: 'Produit Demo 1', price: 29.99, imageUrl: 'https://placehold.co/100x100?text=DEMO1' },
                    { id: 'demo-2', name: 'Produit Demo 2', price: 49.99, imageUrl: 'https://placehold.co/100x100?text=DEMO2' },
                    { id: 'demo-3', name: 'Produit Demo 3', price: 79.99, imageUrl: 'https://placehold.co/100x100?text=DEMO3' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [isOpen, currentPage, searchQuery]);

    // Reset page quand la recherche change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    if (!isOpen) return null;

    const handleSelect = (product) => {
        onSelect(product);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`relative w-full max-w-3xl ${theme.card} border ${theme.border} rounded-3xl shadow-2xl overflow-hidden animate-fade-in font-sans`}>
                {/* Header */}
                <div className={`p-6 border-b ${theme.border} flex items-center justify-between`}>
                    <div>
                        <h2 className={`text-xl font-black ${theme.text} uppercase tracking-tight flex items-center gap-3`}>
                            <Package size={24} className={theme.accent} />
                            Sélectionner un Produit
                        </h2>
                        <p className={`opacity-40 text-sm mt-1 ${theme.text}`}>
                            {totalProducts} produit(s) disponible(s)
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-xl ${theme.input} ${theme.text} opacity-60 hover:opacity-100 transition-all`}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className={`p-4 border-b ${theme.border} ${theme.sidebar} bg-opacity-30`}>
                    <div className="relative">
                        <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.text} opacity-40`} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher un produit..."
                            className={`w-full ${theme.input} border ${theme.border} rounded-xl pl-12 pr-4 py-3 ${theme.text} placeholder-opacity-30 focus:border-purple-500 outline-none transition-colors shadow-inner`}
                        />
                    </div>
                </div>

                {/* Products Grid */}
                <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : error && products.length === 0 ? (
                        <div className="text-center py-8 text-red-500">
                            <p>{error}</p>
                            <p className={`opacity-40 text-sm mt-2 ${theme.text}`}>Vérifiez la connexion à l'API</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12 opacity-30">
                            <Package size={48} className={`mx-auto mb-4 ${theme.text}`} />
                            <p className={theme.text}>Aucun produit trouvé</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {products.map((product) => {
                                const isSelected = selectedProductId === product.id;
                                return (
                                    <button
                                        key={product.id}
                                        onClick={() => handleSelect(product)}
                                        className={`relative text-left p-3 rounded-xl border transition-all group ${isSelected
                                            ? `${theme.accentBg}/20 border-purple-500/50 shadow-lg`
                                            : `${theme.input} border-transparent ${theme.hover} border-${theme.border}`
                                            }`}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center z-10">
                                                <Check size={12} className="text-white" />
                                            </div>
                                        )}

                                        <div className={`w-full aspect-square ${theme.card} rounded-lg mb-2 overflow-hidden flex items-center justify-center border ${theme.border}`}>
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => e.target.src = 'https://placehold.co/100x100?text=IMAGE'}
                                                />
                                            ) : (
                                                <Package size={24} className={`opacity-20 ${theme.text}`} />
                                            )}
                                        </div>

                                        <div className={`${theme.text} text-xs font-bold truncate group-hover:${theme.accent} transition-colors`}>
                                            {product.name}
                                        </div>

                                        <div className="flex items-center justify-between mt-1">
                                            <span className={`${theme.accent} text-sm font-bold`}>
                                                {product.price}€
                                            </span>
                                            <span className={`${theme.text} opacity-30 text-[10px] font-mono`}>
                                                #{product.id?.toString().slice(-6) || 'N/A'}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className={`p-4 border-t ${theme.border} ${theme.sidebar} bg-opacity-30 flex items-center justify-between`}>
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${theme.input} ${theme.text} opacity-60 hover:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed transition-all text-xs font-bold`}
                        >
                            <ChevronLeft size={16} />
                            <span className="hidden sm:inline">Précédent</span>
                        </button>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === pageNum
                                            ? 'bg-purple-500 text-white shadow-lg'
                                            : `${theme.input} ${theme.text} opacity-50 hover:opacity-100`
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${theme.input} ${theme.text} opacity-60 hover:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed transition-all text-xs font-bold`}
                        >
                            <span className="hidden sm:inline">Suivant</span>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductPickerModal;
