import React, { useState, useEffect } from 'react';
import { X, Search, ChevronLeft, ChevronRight, Package, Check } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';
const ITEMS_PER_PAGE = 12;

/**
 * ProductPickerModal - Popup pour sélectionner un produit de la base de données
 */
const ProductPickerModal = ({ isOpen, onClose, onSelect, selectedProductId }) => {
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
                    { id: 'demo-1', name: 'Produit Demo 1', price: 29.99, imageUrl: 'https://via.placeholder.com/100' },
                    { id: 'demo-2', name: 'Produit Demo 2', price: 49.99, imageUrl: 'https://via.placeholder.com/100' },
                    { id: 'demo-3', name: 'Produit Demo 3', price: 79.99, imageUrl: 'https://via.placeholder.com/100' },
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
            <div className="relative w-full max-w-3xl bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                            <Package size={24} className="text-purple-400" />
                            Sélectionner un Produit
                        </h2>
                        <p className="text-white/40 text-sm mt-1">
                            {totalProducts} produit(s) disponible(s)
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b border-white/10 bg-black/20">
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher un produit..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/30 focus:border-purple-500 outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Products Grid */}
                <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-400">
                            <p>{error}</p>
                            <p className="text-white/40 text-sm mt-2">Utilisation des données de démonstration</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12 text-white/40">
                            <Package size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Aucun produit trouvé</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            {products.map((product) => {
                                const isSelected = selectedProductId === product.id;
                                return (
                                    <button
                                        key={product.id}
                                        onClick={() => handleSelect(product)}
                                        className={`relative text-left p-3 rounded-xl border transition-all group ${isSelected
                                                ? 'bg-purple-500/20 border-purple-500/50 shadow-lg'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                                <Check size={12} className="text-white" />
                                            </div>
                                        )}

                                        <div className="w-full aspect-square bg-white/10 rounded-lg mb-2 overflow-hidden flex items-center justify-center">
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                                                />
                                            ) : (
                                                <Package size={24} className="text-white/20" />
                                            )}
                                        </div>

                                        <div className="text-white text-xs font-bold truncate group-hover:text-purple-300 transition-colors">
                                            {product.name}
                                        </div>

                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-purple-400 text-sm font-bold">
                                                {product.price}€
                                            </span>
                                            <span className="text-white/30 text-[10px] font-mono">
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
                    <div className="p-4 border-t border-white/10 bg-black/20 flex items-center justify-between">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={16} />
                            Précédent
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
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-white/5 text-white/60 hover:bg-white/10'
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
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Suivant
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductPickerModal;
