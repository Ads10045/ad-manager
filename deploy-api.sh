#!/bin/bash

# ===================================================
# Script de déploiement Vercel pour ad-manager-api
# ===================================================

echo "🚀 Déploiement ad-manager-api sur Vercel..."
echo ""

# Variables
PROJECT_DIR="ad-manager-api"
CURRENT_DIR=$(pwd)

# Vérifier si on est dans le bon répertoire
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Erreur: Le dossier '$PROJECT_DIR' n'existe pas."
    echo "   Assurez-vous d'être dans le répertoire racine du monorepo."
    exit 1
fi

# Étape 1: Commit & Push
echo "📦 Étape 1: Commit et push des changements..."
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" --allow-empty
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du push Git"
    exit 1
fi

echo "✅ Code pushé sur GitHub"
echo ""

# Étape 2: Déploiement Vercel
echo "🌐 Étape 2: Déploiement sur Vercel..."
cd "$PROJECT_DIR"
npx vercel --prod --yes

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du déploiement Vercel"
    cd "$CURRENT_DIR"
    exit 1
fi

cd "$CURRENT_DIR"

echo ""
echo "=========================================="
echo "✅ Déploiement terminé avec succès!"
echo "=========================================="
echo ""
echo "🔗 URL: https://ad-manager-api.vercel.app"
echo ""
echo "Test des endpoints:"
echo "  - Health: https://ad-manager-api.vercel.app/api/health"
echo "  - Products: https://ad-manager-api.vercel.app/api/products"
echo "  - Random Promo: https://ad-manager-api.vercel.app/api/products/random-promo"
echo ""
