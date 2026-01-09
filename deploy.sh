#!/bin/bash

# ===================================================
# Script de déploiement Vercel GÉNÉRIQUE
# Usage: ./deploy.sh <nom-du-projet>
# ===================================================

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Vérifier si le nom du projet est fourni
if [ -z "$1" ]; then
    echo -e "${YELLOW}Usage: ./deploy.sh <nom-du-projet>${NC}"
    echo ""
    echo "Projets disponibles dans ce répertoire:"
    echo ""
    
    # Lister les dossiers qui contiennent package.json ou vercel.json
    for dir in */; do
        if [ -f "${dir}package.json" ] || [ -f "${dir}vercel.json" ]; then
            echo "  📁 ${dir%/}"
        fi
    done
    echo ""
    exit 1
fi

PROJECT_NAME="$1"
CURRENT_DIR=$(pwd)

echo ""
echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}  🚀 Déploiement Vercel - ${PROJECT_NAME}${NC}"
echo -e "${BLUE}====================================================${NC}"
echo ""

# Vérifier si le dossier existe
if [ ! -d "$PROJECT_NAME" ]; then
    echo -e "${RED}❌ Erreur: Le dossier '$PROJECT_NAME' n'existe pas.${NC}"
    echo ""
    echo "Projets disponibles:"
    for dir in */; do
        if [ -f "${dir}package.json" ] || [ -f "${dir}vercel.json" ]; then
            echo "  📁 ${dir%/}"
        fi
    done
    exit 1
fi

# Vérifier si le projet a une config Vercel ou package.json
if [ ! -f "$PROJECT_NAME/package.json" ] && [ ! -f "$PROJECT_NAME/vercel.json" ]; then
    echo -e "${RED}❌ Erreur: '$PROJECT_NAME' ne semble pas être un projet déployable.${NC}"
    echo "   (pas de package.json ou vercel.json trouvé)"
    exit 1
fi

# Étape 1: Commit & Push
echo -e "${YELLOW}📦 Étape 1: Commit et push des changements...${NC}"
git add .
git commit -m "Deploy $PROJECT_NAME: $(date '+%Y-%m-%d %H:%M:%S')" --allow-empty
git push origin main

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du push Git${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Code pushé sur GitHub${NC}"
echo ""

# Étape 2: Déploiement Vercel
echo -e "${YELLOW}🌐 Étape 2: Déploiement sur Vercel...${NC}"
cd "$PROJECT_NAME"

# Vérifier si vercel CLI est disponible
if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ npx n'est pas installé${NC}"
    cd "$CURRENT_DIR"
    exit 1
fi

npx vercel --prod --yes

DEPLOY_STATUS=$?
cd "$CURRENT_DIR"

if [ $DEPLOY_STATUS -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du déploiement Vercel${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}✅ Déploiement terminé avec succès!${NC}"
echo -e "${GREEN}==========================================${NC}"
echo ""
echo -e "📁 Projet: ${BLUE}$PROJECT_NAME${NC}"
echo -e "⏰ Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
