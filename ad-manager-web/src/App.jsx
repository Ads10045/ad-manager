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
    Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

const App = () => {
    const [activeTab, setActiveTab] = useState('Overview');

    const navItems = [
        { name: 'Overview', icon: LayoutDashboard },
        { name: 'Banners', icon: ImageIcon },
        { name: 'Products', icon: ShoppingBag },
        { name: 'Users', icon: Users },
        { name: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
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
                            className={`w-full nav-link ${activeTab === item.name ? 'active' : ''}`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto p-4 glass-card">
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest font-bold">Base Connectée</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Neon Production</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 border-b border-white border-opacity-5 flex items-center justify-between px-10 bg-black bg-opacity-10 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4 bg-white bg-opacity-5 px-4 py-2 rounded-full border border-white border-opacity-5 w-96">
                        <Search size={18} className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Rechercher une campagne ou un produit..."
                            className="bg-transparent border-none outline-none text-sm w-full"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full" />
                        </button>
                        <div className="flex items-center gap-3 bg-white bg-opacity-5 p-1 pr-4 rounded-full border border-white border-opacity-5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500" />
                            <span className="text-sm font-medium">Administrateur</span>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{activeTab}</h1>
                                <p className="text-gray-400">Bienvenue sur votre interface de gestion publicitaire.</p>
                            </div>
                            <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-primary-900/40">
                                <Plus size={20} />
                                <span>Nouvelle Action</span>
                            </button>
                        </div>

                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            {[
                                { title: 'Total Banners', value: '24', change: '+12%', color: 'from-blue-500/20 to-indigo-500/20' },
                                { title: 'Active Ads', value: '18', change: '+5%', color: 'from-emerald-500/20 to-teal-500/20' },
                                { title: 'Expirations', value: '02', change: 'En attente', color: 'from-rose-500/20 to-orange-500/20' },
                                { title: 'Utilisateurs', value: '1,248', change: '+180', color: 'from-purple-500/20 to-fuchsia-500/20' },
                            ].map((stat, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={stat.title}
                                    className={`p-6 glass-card bg-gradient-to-br ${stat.color}`}
                                >
                                    <p className="text-sm font-medium text-gray-400 mb-1">{stat.title}</p>
                                    <div className="flex items-end justify-between">
                                        <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-gray-400'}`}>
                                            {stat.change}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Activity Feed */}
                            <div className="lg:col-span-2 glass-card p-0 overflow-hidden">
                                <div className="p-6 border-b border-white border-opacity-5 flex items-center justify-between">
                                    <h3 className="font-bold text-lg">Activités Récentes (Neon Prod)</h3>
                                    <button className="text-primary-400 text-sm font-bold hover:underline">Voir tout</button>
                                </div>
                                <div className="p-2">
                                    {[1, 2, 3, 4, 5].map((_, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 hover:bg-white hover:bg-opacity-5 rounded-xl transition-all group cursor-pointer">
                                            <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-gray-500 group-hover:text-primary-400 group-hover:bg-primary-500/10 transition-all font-bold">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-white text-sm">Modification de la bannière "Peach Mask"</h4>
                                                <p className="text-xs text-gray-500 mt-1">Il y a 10 minutes par Admin</p>
                                            </div>
                                            <ChevronRight size={16} className="text-gray-700 group-hover:text-white" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Config */}
                            <div className="space-y-6">
                                <div className="glass-card p-6 border-l-4 border-primary-500">
                                    <h3 className="font-bold mb-4">Statut de l'API</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Node.js API</span>
                                            <span className="text-emerald-400 font-bold">Connecté</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Base SQL API</span>
                                            <span className="text-emerald-400 font-bold">Stable</span>
                                        </div>
                                        <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden mt-4">
                                            <div className="bg-primary-500 h-full w-[98%]" />
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-card p-6 bg-gradient-to-tr from-indigo-600/20 to-primary-600/20">
                                    <h3 className="font-bold mb-2">Besoin d'aide ?</h3>
                                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">Consultez la documentation Swagger interactive pour gérer les endpoints complexes.</p>
                                    <a
                                        href="http://localhost:3001/api-docs"
                                        target="_blank"
                                        className="block text-center py-3 bg-white text-gray-950 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all"
                                    >
                                        Ouvrir Swagger
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
