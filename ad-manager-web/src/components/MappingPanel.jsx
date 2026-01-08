import React from 'react';
import { useMapping, DB_COLUMNS } from '../context/MappingContext';
import { ChevronRight, Link2, Unlink, Database, Sparkles } from 'lucide-react';

/**
 * MappingPanel - Panneau de configuration du mapping
 * Affiche les zones du template sélectionné et permet de les lier aux colonnes DB
 */
const MappingPanel = () => {
    const {
        selectedTemplate,
        mapping,
        activeZone,
        setActiveZone,
        updateMapping,
        removeMapping,
        editMode,
        setEditMode
    } = useMapping();

    if (!selectedTemplate) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-white/30 p-8 text-center">
                <Database size={48} className="mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-white/60 mb-2">Aucun template sélectionné</h3>
                <p className="text-sm">Choisissez un template dans le panneau de gauche pour commencer le mapping.</p>
            </div>
        );
    }

    // Récupérer les zones depuis les fields du template
    const zones = (selectedTemplate.fields || []).map(field => ({
        name: field,
        label: DB_COLUMNS.find(c => c.key === field)?.label || field,
        type: DB_COLUMNS.find(c => c.key === field)?.type || 'text'
    }));

    // Grouper les colonnes par type
    const groupedColumns = DB_COLUMNS.reduce((acc, col) => {
        if (!acc[col.type]) acc[col.type] = [];
        acc[col.type].push(col);
        return acc;
    }, {});

    const typeLabels = {
        text: '📝 Textes',
        value: '💰 Valeurs',
        media: '🖼️ Médias',
        logic: '⚙️ Logique',
        link: '🔗 Liens'
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <Link2 size={18} className="text-purple-400" />
                        Mapping
                    </h2>
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${editMode
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                                : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
                            }`}
                    >
                        {editMode ? '✨ Actif' : 'Édition'}
                    </button>
                </div>
                <p className="text-white/40 text-xs">
                    {selectedTemplate.name} • {zones.length} zones
                </p>
            </div>

            {/* Zones List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                {zones.map((zone) => {
                    const isActive = activeZone === zone.name;
                    const mappedColumn = mapping[zone.name];
                    const columnInfo = DB_COLUMNS.find(c => c.key === mappedColumn);

                    return (
                        <div
                            key={zone.name}
                            className={`p-3 rounded-xl border transition-all ${isActive
                                    ? 'bg-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/10'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                        >
                            {/* Zone Header */}
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => setActiveZone(isActive ? null : zone.name)}
                            >
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${mappedColumn ? 'bg-emerald-400' : 'bg-white/20'}`} />
                                    <span className="text-white font-bold text-xs">{zone.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {mappedColumn && (
                                        <span className="text-purple-300 text-[10px] font-mono bg-purple-500/20 px-2 py-0.5 rounded">
                                            {mappedColumn}
                                        </span>
                                    )}
                                    <ChevronRight
                                        size={14}
                                        className={`text-white/40 transition-transform ${isActive ? 'rotate-90' : ''}`}
                                    />
                                </div>
                            </div>

                            {/* Column Selector (expanded) */}
                            {isActive && (
                                <div className="mt-3 pt-3 border-t border-white/10 space-y-2 animate-fade-in">
                                    {mappedColumn && (
                                        <button
                                            onClick={() => removeMapping(zone.name)}
                                            className="w-full flex items-center justify-center gap-2 py-2 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-all"
                                        >
                                            <Unlink size={12} />
                                            Supprimer la liaison
                                        </button>
                                    )}

                                    {Object.entries(groupedColumns).map(([type, columns]) => (
                                        <div key={type}>
                                            <div className="text-white/30 text-[9px] uppercase tracking-widest mb-1 font-bold">
                                                {typeLabels[type] || type}
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {columns.map(col => (
                                                    <button
                                                        key={col.key}
                                                        onClick={() => {
                                                            updateMapping(zone.name, col.key);
                                                            setActiveZone(null);
                                                        }}
                                                        className={`px-2 py-1 rounded text-[10px] transition-all ${mappedColumn === col.key
                                                                ? 'bg-purple-500 text-white font-bold'
                                                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                                            }`}
                                                    >
                                                        {col.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer Stats */}
            <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-white/40">
                        Liées: <span className="text-emerald-400 font-bold">{Object.keys(mapping).length}</span> / {zones.length}
                    </span>
                    <div className="flex items-center gap-1 text-purple-300">
                        <Sparkles size={12} />
                        <span>Temps réel</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MappingPanel;
