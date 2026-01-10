# 🏗️ Ads-AI : Architecture du Projet (Gestion Publicitaire)

Ce dossier centralise tous les composants du système de gestion publicitaire et de bannières pour les travaux publics.

**Emplacement** : `/Users/younessabach/Documents/dev/workspaceMobile/Ads-AI`

## 📁 Structure des Dossiers

### 📡 [ad-manager-api](file:///Users/younessabach/Documents/dev/workspaceMobile/Ads-AI/ad-manager-api)
**Rôle** : Backend principal (Node.js/Prisma).
- Gestion des bannières et produits (Neon SQL optimized).

### 🛒 [ad-manager-scraping](file:///Users/younessabach/Documents/dev/workspaceMobile/Ads-AI/ad-manager-scraping)
**Rôle** : Module d'importation de produits (Amazon, AliExpress, eBay).
- Sourcing dynamique via RapidAPI.
- Calcul de marges automatique.

### 🖼️ [ad-manager-banner](file:///Users/younessabach/Documents/dev/workspaceMobile/Ads-AI/ad-manager-banner)
**Rôle** : Bibliothèque d'assets et templates de bannières.
- `catalog/`, `print/`, `achats/`, etc.

### 🖥️ [ad-manager-web](file:///Users/younessabach/Documents/dev/workspaceMobile/Ads-AI/ad-manager-web)
**Rôle** : Dashboard d'administration (React/Next.js).

### 📱 [ad-manager-mobile](file:///Users/younessabach/Documents/dev/workspaceMobile/Ads-AI/ad-manager-mobile)
**Rôle** : Application mobile client (React Native/Expo).

### 📚 [docs](file:///Users/younessabach/Documents/dev/workspaceMobile/Ads-AI/docs)
**Rôle** : Documentation technique.

---

## 🛠️ Stack Technique
- **Backend** : Node.js, Express, Prisma, Neon SQL.
- **Scraping** : Axios + RapidAPI (Amazon, AliExpress, eBay).
- **Banner Engine** : Injection dynamique via jQuery (ads-ai.js).

---

## 🎨 Banner Manager

Le Banner Manager est l'interface de création et gestion de bannières publicitaires.

### Fonctionnalités

| Fonctionnalité | Description |
|----------------|-------------|
| **Sélecteur de bannières** | Dropdown pour choisir n'importe quelle bannière |
| **Édition en temps réel** | Modifier le code HTML et voir l'aperçu instantané |
| **Extraction auto des fields** | Détection automatique des placeholders `[name]`, `[price]`, etc. |
| **Mapping dynamique** | Lier les zones aux colonnes de la base de données |
| **Génération de script** | Créer le script d'intégration jQuery |
| **Anti-doublons** | Évite les templates en double dans la liste |

### Templates Disponibles

| Design | Taille | Style |
|--------|--------|-------|
| Neon Glow | 300x250 | Bordure animée RGB |
| Glassmorphism | 300x250 | Effet verre/flou |
| Minimal White | 728x90 | Design épuré clair |
| Luxury Gold | 300x600 | Style luxe doré |
| Gradient Wave | 320x100 | Dégradé mobile coloré |
| Tech Dark | 300x250 | Thème développeur |

---

## 🚀 Scripts de Déploiement

```bash
# Déployer l'API sur Vercel
./deploy-api.sh

# Déployer n'importe quel projet
./deploy.sh <nom-du-projet>
```

---

## 📝 Changelog

### v1.0.0 (2026-01-09)
- ✅ Banner Manager avec éditeur de code
- ✅ Prévisualisation en temps réel (onglets Code/Aperçu)
- ✅ Suppression de templates
- ✅ Sélection/création de catégories
- ✅ Endpoint API `/api/products/random-promo`
- ✅ Marge arrondie (20% au lieu de 20.223%)
- ✅ 6 nouveaux designs de bannières
- ✅ Scripts de déploiement Vercel
- ✅ Extraction automatique des fields pour le mapping

### URLs de Production
- **API** : https://ad-manager-api.vercel.app
- **Swagger** : https://ad-manager-api.vercel.app/api-docs
