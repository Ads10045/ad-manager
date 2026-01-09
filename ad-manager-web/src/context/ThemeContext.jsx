import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = {
    dark: {
        name: 'Dark (Default)',
        bg: 'bg-[#0d0d0d]',
        sidebar: 'bg-black',
        header: 'bg-black/40',
        text: 'text-white',
        border: 'border-white/10',
        input: 'bg-white/5',
        accent: 'text-purple-400',
        accentBg: 'bg-purple-500',
        card: 'bg-[#1a1a1a]', // Plus sombre que base
        hover: 'hover:bg-white/5'
    },
    light: {
        name: 'Light',
        bg: 'bg-gray-50',
        sidebar: 'bg-white',
        header: 'bg-white/80',
        text: 'text-gray-900',
        border: 'border-gray-200',
        input: 'bg-gray-100',
        accent: 'text-purple-600',
        accentBg: 'bg-purple-600',
        card: 'bg-white',
        hover: 'hover:bg-gray-100'
    },
    midnight: {
        name: 'Midnight Blue',
        bg: 'bg-[#0f172a]',
        sidebar: 'bg-[#1e293b]',
        header: 'bg-[#1e293b]/80',
        text: 'text-slate-100',
        border: 'border-slate-700',
        input: 'bg-slate-800',
        accent: 'text-blue-400',
        accentBg: 'bg-blue-500',
        card: 'bg-[#1e293b]',
        hover: 'hover:bg-slate-700'
    }
};

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState('dark');

    // Persistance du thème
    useEffect(() => {
        try {
            const savedTheme = localStorage.getItem('ads-ai-app-theme');
            if (savedTheme && THEMES[savedTheme]) {
                setCurrentTheme(savedTheme);
            }
        } catch (e) {
            console.warn('Theme load failed', e);
        }
    }, []);

    const setTheme = (themeKey) => {
        if (THEMES[themeKey]) {
            setCurrentTheme(themeKey);
            localStorage.setItem('ads-ai-app-theme', themeKey);
        }
    };

    // Fallback de sécurité : toujours retourner un thème valide
    const theme = THEMES[currentTheme] || THEMES.dark;

    return (
        <ThemeContext.Provider value={{ theme, currentTheme, setTheme, themes: THEMES }}>
            <div className={`min-h-screen transition-colors duration-300 ${theme.bg} ${theme.text}`}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        // Fallback si utilisé hors du provider (évite écran blanc)
        return {
            theme: THEMES.dark,
            currentTheme: 'dark',
            setTheme: () => { },
            themes: THEMES
        };
    }
    return context;
};
