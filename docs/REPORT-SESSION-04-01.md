# 📊 Rapport de Session - Ads-AI (04/01/2026)

Ce rapport détaille les technologies utilisées, les configurations systèmes mises en place et les procédures de tests pour le projet de gestion publicitaire.

---

## 🛠️ 1. Technologies & Stack Technique

Nous avons utilisé une stack moderne conçue pour la performance et la portabilité :

*   **Backend (API)** : 
    *   **Node.js & Express** : Serveur d'API robuste.
    *   **Prisma ORM** : Gestion de la base de données avec typage sécurisé.
    *   **Swagger (OpenAPI 3.0)** : Documentation interactive et auto-générée.
    *   **Axios** : Pour la récupération dynamique des templates depuis GitHub.
*   **Database** :
    *   **PostgreSQL (Neon.tech)** : Base de données Cloud serverless avec pooling de connexions.
*   **Frontend & Bannières** :
    *   **Tailwind CSS** : Design "Utility-first" pour des bannières ultra-rapides sans CSS lourd.
    *   **jQuery 3.7.1** : Injection dynamique légère compatible avec tous les CMS (WordPress, Wix, etc.).
*   **DevOps & Tunneling** :
    *   **LocalTunnel** : Exposition sécurisée du port local vers le web (HTTPS).
    *   **Git & GitHub** : Stockage du code et hébergement des assets statiques (Templates).

---

## ⚙️ 2. Configurations Spécifiques

### Configuration Database (`config.json`)
L'API est configurée pour basculer dynamiquement entre les environnements :
```json
"database": {
  "targets": {
    "dev": "postgresql://neondb_owner:...",
    "prod": "postgresql://neondb_owner:..."
  }
}
```

### Configuration des Templates (GitHub)
L'API récupère les designs directement depuis la branche `main` pour garantir une mise à jour instantanée :
*   **URL de base** : `https://raw.githubusercontent.com/Ads10045/ad-manager/main/ad-manager-banner/`

### Middleware CORS
Activé pour autoriser les requêtes provenant de n'importe quel domaine externe (nécessaire pour l'affichage de pub sur des blogs tiers).

---

## 🧪 3. Procédures de Tests

Nous avons mis en place trois niveaux de validation :

### A. Test Unitaire de l'API (Santé)
*   **Endpoint** : `/api/health`
*   **Objectif** : Vérifier que le serveur est "UP" et connecté à la base Neon.

### B. Test de Rendu Visuel (Local)
*   **Fichier** : `materiaux-pro-TEST-JQUERY.html`
*   **Méthode** : Ouverture directe du fichier dans Chrome.
*   **Vérification** : Injection du HTML dynamique, affichage de l'image du produit et du prix réel.

### C. Test d'Intégration Externe (Tunnel)
*   **URL** : `https://ten-regions-talk.loca.lt/api-docs`
*   **Méthode** : Accès depuis un navigateur hors réseau local.
*   **Vérification** : Validation du Swagger et de l'endpoint `/api/render-preview`.

---

## 🚀 4. Organisation du Travail (Dossiers)

| Dossier | Contenu |
| :--- | :--- |
| `ad-manager-api/` | Serveur, Routes, Contrôleurs et Logique Prisma. |
| `ad-manager-banner/` | Templates HTML bruts (utilisés comme blueprints). |
| `ad-manager-test/` | Fichiers de tests locaux et environnement de démo. |
| `test-banner-js/` | Scripts d'injection JS universels organisés par thématique. |

---

## 🛠️ État actuel des serveurs
| Service | URL / Port | État |
| :--- | :--- | :--- |
| **API Backend** | `localhost:3001` | 🟢 Actif |
| **Tunnel Public** | `https://ten-regions-talk.loca.lt` | 🟢 Actif |
| **Swagger UI** | `/api-docs` | 🟢 Prêt |

---
*Rapport généré automatiquement - Ads-AI Ecosystem.* 🚀📈
