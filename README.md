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
