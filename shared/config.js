/**
 * Ads Manager - Configuration Générale
 * Ce fichier centralise toutes les configurations du projet (API, Affiliation, etc.)
 */

const AdsAIConfig = {
    // ============================================
    // API CONFIGURATION
    // ============================================
    api: {
        // Base URL de l'API (Production par défaut)
        baseUrl: 'https://ad-manager-api.vercel.app/api',
        
        // URL locale si besoin de tester
        localUrl: 'http://localhost:3000/api',

        // Endpoints
        endpoints: {
            products: '/products',
            banners: '/banners',
            render: '/render-preview'
        },

        // Fonction pour obtenir l'URL complète
        getUrl: function(endpoint) {
            // Détection automatique simple ou URL par défaut
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            // return (isLocal ? this.localUrl : this.baseUrl) + endpoint;
            return this.baseUrl + endpoint; // Forcer la prod pour l'instant
        }
    },

    // ============================================
    // AFFILIATION CONFIGURATION
    // ============================================
    affiliation: {
        // IDs Partenaires (Source: NutriPlusApp)
        ids: {
            amazon: {
                us: 'nutriplusapp2-21',
                es: 'nutriplusap07-21',
                de: 'nutriplusap0f-21',
                uk: 'nutriplusa0c7-21',
                it: 'nutriplusap0e-21',
                fr: 'nutriplusap-21' // Ajout présumé ou à compléter
            },
            aliexpress: 'nutriplusap'
        },

        // Fonction utilitaire pour générer l'URL affiliée
        getAffiliatedUrl: function(sourceUrl) {
            if (!sourceUrl || sourceUrl === '#') return '#';
            
            try {
                const urlObj = new URL(sourceUrl);
                const ids = this.ids;
                
                // --- Amazon Logic ---
                if (sourceUrl.includes('amazon')) {
                    let tag = ids.amazon.us; // Par défaut: US
                    
                    if (sourceUrl.includes('.es')) tag = ids.amazon.es;
                    else if (sourceUrl.includes('.de')) tag = ids.amazon.de;
                    else if (sourceUrl.includes('.co.uk')) tag = ids.amazon.uk;
                    else if (sourceUrl.includes('.it')) tag = ids.amazon.it;
                    else if (sourceUrl.includes('.fr')) tag = ids.amazon.fr;
                    
                    // On remplace ou ajoute le paramètre 'tag'
                    if (tag) urlObj.searchParams.set('tag', tag);
                }
                
                // --- AliExpress Logic ---
                else if (sourceUrl.includes('aliexpress')) {
                    if (ids.aliexpress) {
                        urlObj.searchParams.set('aff_id', ids.aliexpress);
                    }
                }
                
                return urlObj.toString();
            } catch (e) {
                console.warn('Erreur lors de la génération du lien affilié:', e);
                return sourceUrl;
            }
        }
    },

    // ============================================
    // UI / DESIGN TOKENS (Optional)
    // ============================================
    theme: {
        fonts: {
            primary: "'Inter', sans-serif",
            secondary: "'Outfit', sans-serif"
        },
        colors: {
            bg: 'bg-slate-900',
            primary: 'blue-600',
            accent: 'purple-600'
        }
    }
};

// Expose to window immediately for easy debugging
window.AdsAIConfig = AdsAIConfig;
