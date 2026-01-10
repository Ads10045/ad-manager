import React from 'react';
import TemplateSidebar from './components/TemplateSidebar';
import BannerPreview from './components/BannerPreview';
import BannerEditor from './components/BannerEditor';
import MappingPanel from './components/MappingPanel';
import ExportPanel from './components/ExportPanel';
import ExportPanel from './components/ExportPanel';
import { useMapping } from './context/MappingContext';
import { useTheme } from './context/ThemeContext';
import { Wand2, SlidersHorizontal, Code, Edit3, Palette, Check, Move } from 'lucide-react';

/**
 * App - Application principale du générateur de bannières dynamiques
 * Charge les templates depuis ad-manager-banner
 */
const App = () => {
    const { selectedTemplate, isCodeEditorOpen, bannerConfig } = useMapping();
    const { theme, currentTheme, setTheme, themes } = useTheme();
    const [activePanel, setActivePanel] = React.useState('mapping');
    const [themeMenuOpen, setThemeMenuOpen] = React.useState(false);

    return (
        <div className={`h-screen w-screen flex ${theme.bg} ${theme.text} overflow-hidden font-sans selection:bg-purple-500/30 transition-colors duration-300`}>
            {/* Left Sidebar - Templates */}
            <aside className={`w-72 flex-shrink-0 ${theme.sidebar} border-r ${theme.border}`}>
                <TemplateSidebar />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Top Header */}
                <header className={`h-16 border-b ${theme.border} ${theme.header} backdrop-blur-xl flex items-center justify-between px-6 z-10`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <Wand2 size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                                Ads-AI <Wand2 size={20} className={theme.accent} /> <span className={theme.accent}>Banner Studio</span>
                            </h1>
                            <p className="opacity-40 text-xs">
                                Générateur de bannières dynamiques
                            </p>
                        </div>
                    </div>

                    {/* Status Indicators & Theme Selector */}
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <div className="relative">
                            <button
                                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                                className={`p-2 rounded-lg transition-colors ${theme.hover} ${currentTheme !== 'dark' ? 'text-gray-600' : 'text-white'}`}
                                title="Changer le thème"
                            >
                                <Palette size={20} />
                            </button>

                            {themeMenuOpen && (
                                <div className={`absolute top-full right-0 mt-2 w-48 ${theme.card} border ${theme.border} rounded-xl shadow-2xl z-50 p-1 overflow-hidden font-sans`}>
                                    {Object.entries(themes).map(([key, t]) => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setTheme(key);
                                                setThemeMenuOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${theme.hover} ${currentTheme === key ? theme.accent : 'opacity-70'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${key === 'light' ? 'bg-gray-200 border border-gray-400' : t.bg} border border-white/20`} />
                                                <span className={theme.text}>{t.name}</span>
                                            </div>
                                            {currentTheme === key && <Check size={14} />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedTemplate && (
                            <div className={`flex items-center gap-2 px-3 py-1.5 ${theme.input} rounded-full border ${theme.border}`}>
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                <span className={`text-xs ${theme.text} opacity-60`}>
                                    Template: <span className="font-bold opacity-100">{selectedTemplate.name}</span>
                                </span>
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
                <div className="flex-1 flex overflow-hidden relative">
                    {/* Background Grid Effect - conditional opacity based on theme */}
                    <div className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay ${currentTheme === 'light' ? 'opacity-5' : 'opacity-20'}`}></div>

                    {/* Preview or Editor Section */}
                    <div className="flex-1 flex flex-col relative z-0">
                        {isCodeEditorOpen ? (
                            <BannerEditor config={bannerConfig} />
                        ) : (
                            <BannerPreview />
                        )}
                    </div>
                </div>
            </main>

            {/* Right Panel - Tabs: Only show if NOT in an editor mode */}
            {!isCodeEditorOpen && (
                <aside className={`w-80 flex-shrink-0 flex flex-col border-l ${theme.border} ${theme.sidebar} z-10`}>
                    {/* Tab Headers */}
                    <div className={`flex border-b ${theme.border}`}>
                        <button
                            onClick={() => setActivePanel('mapping')}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${activePanel === 'mapping'
                                ? `${theme.text} border-b-2 border-purple-500 ${theme.input}`
                                : 'opacity-40 hover:opacity-100 hover:bg-white/5'
                                }`}
                        >
                            <SlidersHorizontal size={16} />
                            Mapping
                        </button>
                        <button
                            onClick={() => setActivePanel('export')}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${activePanel === 'export'
                                ? `${theme.text} border-b-2 border-purple-500 ${theme.input}`
                                : 'opacity-40 hover:opacity-100 hover:bg-white/5'
                                }`}
                        >
                            <Code size={16} />
                            Export
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className={`flex-1 overflow-hidden ${currentTheme === 'light' ? 'bg-gray-50' : 'bg-[#0a0a0a]'}`}>
                        {activePanel === 'mapping' ? <MappingPanel /> : <ExportPanel />}
                    </div>
                </aside>
            )}
        </div>
    );
};

export default App;
