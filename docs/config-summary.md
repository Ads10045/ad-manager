# 🛠️ Récapitulatif des Configurations du Projet

Ce document résume tous les accès, URL et configurations nécessaires pour le développement local et la production.

## 💻 1. Environnement Local
Ces paramètres sont utilisés lors de l'exécution du backend sur votre machine.

*   **Fichier** : `backend/.env`
*   **Base de Données Locale** : `postgresql://postgres:postgres@localhost:5432/nutriplus?schema=public`
*   **Port Serveur** : `3000`
*   **JWT Secret** : `nutriplus_secret_key_2025_...`
*   **RapidAPI Key** : `b87a875f68msh27a6a1de220...`

---

## 🐘 2. Base de Données Neon (Production)
La base de données PostgreSQL hébergée sur Neon.

*   **DATABASE_URL** : `postgresql://neondb_owner:npg_5AzdsSYIxJ9C@ep-falling-shape-abbss0l8-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require`
*   **SQL API Endpoint** : `https://ep-falling-shape-abbss0l8.eu-west-2.aws.neon.tech/sql`
*   **Pooler Host** : `ep-falling-shape-abbss0l8-pooler.eu-west-2.aws.neon.tech`

---

## 🔗 3. Services Tiers
*   **CORS Proxy** : `https://corsproxy.io/?` (Utilisé pour contourner les restrictions CORS sur les requêtes directes SQL).
*   **RapidAPI** : Utilisé pour le sourcing des produits Amazon/AliExpress.

---

## 🚀 4. Production (Vercel)
L'API est déployée sur Vercel et accessible publiquement.

*   **URL de base** : `https://ad-manager-api.vercel.app/`
*   **API Health** : `https://ad-manager-api.vercel.app/api/health`
*   **Documentation (Swagger)** : `https://ad-manager-api.vercel.app/api-docs`
*   **Données réelles (Produits)** : `https://ad-manager-api.vercel.app/api/products`

---

> [!IMPORTANT]
> **Sécurité** : Ne partagez jamais ces accès en public.
