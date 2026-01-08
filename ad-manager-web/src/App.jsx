import React from 'react';
import TemplateSidebar from './components/TemplateSidebar';
import BannerPreview from './components/BannerPreview';
import BannerEditor from './components/BannerEditor';
import MappingPanel from './components/MappingPanel';
import ExportPanel from './components/ExportPanel';
import { useMapping } from './context/MappingContext';
import { Wand2, Eye, SlidersHorizontal, Code, Edit3 } from 'lucide-react';

/**
 * App - Application principale du générateur de bannières dynamiques
 * Charge les templates depuis ad-manager-banner
 */
const App = () => {
    const { selectedTemplate, editMode, isCodeEditorOpen, bannerConfig } = useMapping();
    const [activePanel, setActivePanel] = React.useState('mapping');

    return (
        <div className="h-screen w-screen flex bg-transparent text-white overflow-hidden">
            {/* Left Sidebar - Templates */}
            <aside className="w-72 flex-shrink-0">
                <TemplateSidebar />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-16 border-b border-white/10 bg-black/20 backdrop-blur-xl flex items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <Wand2 size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-tighter">
                                Ads-AI <span className="text-purple-400">Banner Studio</span>
                            </h1>
                            <p className="text-white/40 text-xs">
                                Générateur de bannières dynamiques
                            </p>
                        </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="flex items-center gap-4">
                        {selectedTemplate && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-xs text-white/60">
                                    Template: <span className="text-white font-bold">{selectedTemplate.name}</span>
                                </span>
                            </div>
                        )}
                        {editMode && !isCodeEditorOpen && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 rounded-full border border-purple-500/50">
                                <Eye size={14} className="text-purple-400" />
                                <span className="text-xs text-purple-300 font-bold">Mode Édition</span>
                            </div>
                        )}
                        {isCodeEditorOpen && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 rounded-full border border-blue-500/50">
                                <Edit3 size={14} className="text-blue-400" />
                                <span className="text-xs text-blue-300 font-bold">Éditeur HTML</span>
                            </div>
                        )}
                    </div>
                </header>

                {/* Content Grid */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Preview or Editor Section */}
                    <div className="flex-1 border-r border-white/10 relative">
                        {isCodeEditorOpen ? (
                            <BannerEditor config={bannerConfig} />
                        ) : (
                            <BannerPreview />
                        )}
                    </div>
                </div>
            </main>

            {/* Right Panel - Tabs */}
            <aside className="w-80 flex-shrink-0 flex flex-col border-l border-white/10 bg-black/20">
                {/* Tab Headers */}
                <div className="flex border-b border-white/10">
                    <button
                        onClick={() => setActivePanel('mapping')}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${activePanel === 'mapping'
                            ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                            : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                            }`}
                    >
                        <SlidersHorizontal size={16} />
                        Mapping
                    </button>
                    <button
                        onClick={() => setActivePanel('export')}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${activePanel === 'export'
                            ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                            : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                            }`}
                    >
                        <Code size={16} />
                        Export
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                    {activePanel === 'mapping' ? <MappingPanel /> : <ExportPanel />}
                </div>
            </aside>
        </div>
    );
};

export default App;
