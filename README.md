# 🏗️ Ads-AI : Architecture du Projet (Gestion Publicitaire)

Ce dossier centralise tous les composants du système de gestion publicitaire et de bannières pour les travaux publics.

**Emplacement** : `/Users/younessabach/Documents/dev/workspaceMobile/Ads-AI`

## 📁 Structure des Dossiers

### 📡 [ad-manager-api](file:///Users/younessabach/Documents/dev/workspaceMobile/Ads-AI/ad-manager-api)
**Rôle** : Backend principal (Node.js/Prisma).
- Gestion des bannières et produits (Neon SQL optimized).

### 🐘 [ad-manager-api-php](file:///Users/younessabach/Documents/dev/workspaceMobile/Ads-AI/ad-manager-api-php)
**Rôle** : Backend alternatif (PHP Modern Architecture).
- Architecture PSR-4, PDO, et Front Controller.
- Idéal pour les hébergements mutualisés ou classiques.

### 🖥️ [ad-manager-web](file:///Users/younessabach/Documents/dev/workspaceMobile/Ads-AI/ad-manager-web)
**Rôle** : Dashboard d'administration (React/Next.js).
- Interface de gestion visuelle des bannières.
- Statistiques de performance.
- Configuration des zones publicitaires.

### 📱 [ad-manager-mobile](file:///Users/younessabach/Documents/dev/workspaceMobile/Ads-AI/ad-manager-mobile)
**Rôle** : Application mobile client/gestion locale (React Native/Expo).
- Affichage des bannières contextuelles.
- Suivi des travaux et annonces.

### 🖼️ [ad-manager-banner](file:///Users/younessabach/Documents/dev/workspaceMobile/Ads-AI/ad-manager-banner)
**Rôle** : Bibliothèque d'assets et templates de bannières.
- `achats/` : Templates liés aux ventes et acquisitions.
- `promotions/` : Offres spéciales et remises.
- `travaux/` : Annonces de chantiers et sécurité.
- `evenements/` : Salons professionnels et rencontres.

### 📚 [docs](file:///Users/younessabach/Documents/dev/workspaceMobile/Ads-AI/docs)
**Rôle** : Documentation technique.
- `config-summary.md` : Tous les accès (Neon, Local).

### ⚙️ [shared](file:///Users/younessabach/Documents/dev/workspaceMobile/Ads-AI/shared)
**Rôle** : Code partagé.
- Types TypeScript, constantes, et configurations communes.

---

## 🛠️ Stack Technique Proposée
- **Base de données** : Neon PostgreSQL (Prisma ORM + SQL HTTP API).
- **Architecture** : Microservices-ready, découplée du backend NutriPlus original.
