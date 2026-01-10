# 🚀 Banner Manager - Guide d'Implémentation Étape par Étape

## 📊 État Actuel (v1.0.0) ✅
- ✅ Création/édition de bannières
- ✅ Prévisualisation temps réel
- ✅ Génération de script d'intégration
- ✅ API produits avec random-promo
- ✅ 6 designs de bannières premium

---

# 📋 PHASE 1 : Authentification & Comptes (2 semaines)

## Étape 1.1 : Installer NextAuth.js
```bash
cd ad-manager-web
npm install next-auth @auth/prisma-adapter
```

### Fichiers à créer :
- [ ] `src/app/api/auth/[...nextauth]/route.ts` - Configuration NextAuth
- [ ] `src/lib/auth.ts` - Options d'authentification
- [ ] `prisma/schema.prisma` - Modèles User, Account, Session

### Actions :
1. [ ] Configurer les providers (Google, GitHub, Email)
2. [ ] Créer les tables utilisateurs dans Neon SQL
3. [ ] Ajouter les variables d'environnement :
   ```env
   GOOGLE_CLIENT_ID=xxx
   GOOGLE_CLIENT_SECRET=xxx
   GITHUB_CLIENT_ID=xxx
   GITHUB_CLIENT_SECRET=xxx
   NEXTAUTH_SECRET=xxx
   NEXTAUTH_URL=http://localhost:5173
   ```

## Étape 1.2 : Pages d'authentification
- [ ] `/login` - Page de connexion
- [ ] `/register` - Page d'inscription
- [ ] `/profile` - Page profil utilisateur
- [ ] `/forgot-password` - Récupération mot de passe

## Étape 1.3 : Protection des routes
- [ ] Middleware pour protéger `/dashboard`, `/editor`, `/templates`
- [ ] Redirection vers `/login` si non connecté
- [ ] Afficher le nom/avatar de l'utilisateur dans le header

---

# 📋 PHASE 2 : Système de Plans & Stripe (2 semaines)

## Étape 2.1 : Configuration Stripe
```bash
npm install stripe @stripe/stripe-js
```

### Créer sur Stripe Dashboard :
1. [ ] Produit "Banner Manager Pro"
 - 29€/mois
2. [ ] Produit "Banner Manager Enterprise" - 99€/mois
3. [ ] Récupérer les Price IDs

### Variables d'environnement :
```env
STRIPE_SECRET_KEY=sk_xxx
STRIPE_PUBLISHABLE_KEY=pk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_ENTERPRISE_PRICE_ID=price_xxx
```

## Étape 2.2 : Endpoints API Stripe
- [ ] `POST /api/stripe/checkout` - Créer session de paiement
- [ ] `POST /api/stripe/webhook` - Gérer les événements Stripe
- [ ] `POST /api/stripe/portal` - Portail client (gérer abonnement)

## Étape 2.3 : Modèle Subscription
```prisma
model Subscription {
  id                 String   @id @default(uuid())
  userId             String   @unique
  stripeCustomerId   String?
  stripeSubscriptionId String?
  plan               String   @default("free") // free, pro, enterprise
  status             String   @default("active")
  currentPeriodEnd   DateTime?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  user               User     @relation(fields: [userId], references: [id])
}
```

## Étape 2.4 : Page Pricing
- [ ] Créer `/pricing` avec les 3 plans
- [ ] Boutons "Choisir ce plan" → Stripe Checkout
- [ ] Afficher le plan actuel dans le profil

## Étape 2.5 : Limites par plan
| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Bannières | 5 | Illimité | Illimité |
| Exports/mois | 10 | Illimité | Illimité |
| Designs premium | ❌ | ✅ | ✅ |
| Support | Email | Prioritaire | Dédié |
| API Access | ❌ | ✅ | ✅ |

---

# 📋 PHASE 3 : Améliorations Éditeur (2 semaines)

## Étape 3.1 : Éditeur de code amélioré
- [ ] Installer Monaco Editor (éditeur de VS Code)
  ```bash
  npm install @monaco-editor/react
  ```
- [ ] Coloration syntaxique HTML/CSS/JS
- [ ] Autocomplétion des placeholders `[name]`, `[price]`

## Étape 3.2 : Historique des versions
- [ ] Undo/Redo avec Ctrl+Z / Ctrl+Y
- [ ] Sauvegarder les 10 dernières versions
- [ ] Bouton "Restaurer version précédente"

## Étape 3.3 : Bibliothèque d'assets
- [ ] Upload d'images personnalisées
- [ ] Galerie d'icônes (Lucide, Heroicons)
- [ ] Google Fonts intégrées
- [ ] Stockage sur Cloudflare R2 ou S3

## Étape 3.4 : Dupliquer un template
- [ ] Bouton "Dupliquer" sur chaque template
- [ ] Crée une copie avec nom "_copy"
- [ ] Ouvre automatiquement dans l'éditeur

---

# 📋 PHASE 4 : Export Avancé (1 semaine)

## Étape 4.1 : Export PNG
```bash
npm install html2canvas
```
- [ ] Capturer la bannière en image
- [ ] Télécharger en PNG haute qualité

## Étape 4.2 : Export GIF Animé
```bash
npm install gif.js
```
- [ ] Capturer plusieurs frames
- [ ] Générer GIF animé
- [ ] Définir durée/boucle

## Étape 4.3 : Export HTML Standalone
- [ ] Générer HTML complet avec CSS inline
- [ ] Pas de dépendances externes
- [ ] Prêt pour upload sur serveur

---

# 📋 PHASE 5 : Analytics (2 semaines)

## Étape 5.1 : Tracking des impressions
- [ ] Pixel de tracking dans chaque bannière
- [ ] Endpoint `POST /api/analytics/impression`
- [ ] Stocker : banner_id, timestamp, user_agent, referrer

## Étape 5.2 : Tracking des clics
- [ ] Wrapper les liens avec tracking
- [ ] Endpoint `POST /api/analytics/click`
- [ ] Stocker : banner_id, timestamp, position_x, position_y

## Étape 5.3 : Dashboard Analytics
- [ ] Graphique impressions/jour
- [ ] Graphique clics/jour
- [ ] Taux de clic (CTR)
- [ ] Top bannières performantes

---

# 📋 PHASE 6 : Features IA (2 semaines)

## Étape 6.1 : Génération IA
```bash
npm install openai
```
- [ ] Endpoint `POST /api/ai/generate`
- [ ] Prompt : "Crée une bannière pour [catégorie] en style [style]"
- [ ] Retourne le code HTML généré

## Étape 6.2 : Suggestions automatiques
- [ ] Analyser le produit sélectionné
- [ ] Suggérer les meilleurs templates
- [ ] Suggérer les couleurs selon la catégorie

---

# 📋 PHASE 7 : Landing Page & Launch (1 semaine)

## Étape 7.1 : Landing Page
- [ ] Hero section avec démo interactive
- [ ] Features avec animations
- [ ] Pricing table
- [ ] Témoignages clients
- [ ] FAQ
- [ ] CTA "Essai gratuit 14 jours"

## Étape 7.2 : SEO
- [ ] Meta tags optimisés
- [ ] Open Graph pour partage réseaux sociaux
- [ ] Schema.org pour Rich Snippets
- [ ] Sitemap.xml

## Étape 7.3 : Launch
- [ ] [ ] Product Hunt
- [ ] [ ] Hacker News
- [ ] [ ] Reddit (r/webdev, r/entrepreneur)
- [ ] [ ] Twitter/X announcement
- [ ] [ ] LinkedIn post

---

# ✅ CHECKLIST FINALE PRE-LAUNCH

## Technique
- [ ] Tests unitaires critiques
- [ ] Tests E2E (Playwright/Cypress)
- [ ] Performance (Lighthouse > 90)
- [ ] Sécurité (OWASP basics)
- [ ] Backup base de données automatique

## Légal
- [ ] Politique de confidentialité
- [ ] Conditions générales d'utilisation
- [ ] RGPD compliance (cookie banner)
- [ ] Mentions légales

## Marketing
- [ ] Logo et branding finalisés
- [ ] Screenshots pour stores/marketplaces
- [ ] Vidéo démo (2-3 min max)
- [ ] Email de bienvenue automatique

---

# 💰 Budget Estimé

| Poste | Coût Initial | Coût Mensuel |
|-------|--------------|--------------|
| Développement | 0€ (vous) | 0€ |
| Vercel Pro | 0€ | 20€ |
| Railway/Render | 0€ | 25€ |
| Neon SQL | 0€ | 0-19€ |
| Cloudflare R2 | 0€ | ~5€ |
| Domain + SSL | 15€/an | ~1€ |
| Stripe | 0€ | 2.9% + 0.30€/tx |
| OpenAI API | 0€ | ~10-50€ |
| **TOTAL** | ~15€ | ~60-120€ |

---

# 📅 Timeline Résumé

```
Semaine 1-2  : Phase 1 (Auth)
Semaine 3-4  : Phase 2 (Stripe)
Semaine 5-6  : Phase 3 (Éditeur)
Semaine 7    : Phase 4 (Export)
Semaine 8-9  : Phase 5 (Analytics)
Semaine 10-11: Phase 6 (IA)
Semaine 12   : Phase 7 (Launch)
─────────────────────────────────
TOTAL: ~3 mois pour v2.0 commerciale
```

---

**🚀 Prêt à commencer ? Cochez les cases au fur et à mesure de votre progression !**
