# 🛒 Ads-AI Scraper

Ce module Node.js permet d'importer des produits depuis **Amazon**, **AliExpress** et **eBay** en utilisant les APIs de RapidAPI.

## 🚀 Installation

```bash
cd ad-manager-scraping
npm install
```

## ⚙️ Configuration

Les configurations sont situées dans `config/config.json`. Vous pouvez également utiliser un fichier `.env` pour la clé API :

```bash
RAPIDAPI_KEY=votre_cle_rapidapi
```

## 🔍 Usage

Pour rechercher des produits (par défaut: smartwatch) :

```bash
npm start
```

Ou avec un mot-clé spécifique :

```bash
node src/index.js "perceuse sans fil"
```

Les résultats sont sauvegardés dans `data/last_search.json`.

## 📦 Services Inclus

- **Amazon** : Via Real-Time Amazon Data API.
- **AliExpress** : Via AliExpress DataHub API.
- **eBay** : Via eBay Data API.
- **Calcul de Marge** : Configurable par plateforme dans `config/config.json`.
