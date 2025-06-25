# 📊 Farminx Stats API

API Node.js + Express + Prisma pour l'affichage de statistiques agricoles filtrées par région, culture, année, etc.

---

## 🚀 Démarrage rapide

### 1. Cloner le projet
```bash
git clone <repo-url> && cd farminx-stats
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Créer un fichier `.env`
Copier `.env.example` vers `.env` et adapter les variables si besoin :
```env
DATABASE_URL=postgresql://user:password@localhost:5432/farminx
PORT=3000
JWT_SECRET=changeme
DEBUG=false
```

### 4. Générer le client Prisma
```bash
npx prisma generate
```

### 5. Lancer les migrations Prisma (facultatif si déjà en place)
```bash
npx prisma migrate dev --name init
```

### 6. Lancer le serveur en dev
```bash
npm run dev
```

Ou en production :
```bash
npm start
```

---

## 🔍 Documentation Swagger
Accessible ici :
```
http://localhost:3000/api-docs
```

---

## 📁 Structure du projet
```
/src
  app.js           # Configuration Express
  server.js        # Entrée principale (démarre le serveur)
  /controllers     # Logique des routes
  /services        # Logique métier
  /repositories    # Accès à la base de données
  /routes          # Routes Express
  /middlewares     # Middlewares personnalisés (auth, validation...)
  /config          # Configuration globale (BD, JWT...)
  /utils           # Fonctions utilitaires
/docs
  swagger.json     # Documentation OpenAPI
/prisma
  schema.prisma    # Schéma Prisma
.env.example       # Variables d'environnement
package.json       # Scripts, dépendances
```

---

## 🛠 Endpoints disponibles

| Verbe | URL | Paramètres | Retour (DTO) | Description |
|-------|------------------------------------------------------------|-----------------------------|-------------------------------------------------------------|--------------------------------------------|
| GET   | `/api/regions` | - | `RegionDto[]` | Liste des régions |
| GET   | `/api/cultures` | - | `CultureDto[]` | Liste des cultures |
| GET   | `/api/cultures/years` | - | `number[]` | Années disponibles |
| GET   | `/api/stats` | `year?`, `regionId?`, `productId?`, `granularity?`, `page?`, `limit?` | `{ total, page, limit, data: AgriculturalStatDto[] }` | Stats filtrées |
| GET   | `/api/stats/regions/cultures/:culture/years/:year` | `culture` (ID), `year` | `AgriculturalStatDto[]` | Stats par région |
| GET   | `/api/stats/products/:id/summary` | `id` (path), `year?` (query) | `ProductSummaryDto` | Résumé pour un produit |
| GET   | `/api/stats/regions` | `year`, `productId` | `FeatureCollection` | Stats régionales en GeoJSON |
| POST  | `/api/auth/login` | JSON `{ email, password }` | `{ token }` | Connexion utilisateur |
| POST  | `/api/auth/register` | JSON `{ email, password, firstName?, lastName? }` | `{ id, email }` | Création d'utilisateur |
| POST  | `/api/import` | Form-data `file` | `{ message }` | Importer des données Excel |

---

## 🔐 Authentification

Toutes les routes (sauf `/api/auth` et `/api-docs`) nécessitent un token JWT.

### Obtenir un token

```
POST /api/auth/login
{ "email": "user@example.com", "password": "votre_mot_de_passe" }
```

Le token doit ensuite être envoyé dans l'en-tête `Authorization: Bearer <token>`.

---

## 📦 Prochaines étapes
- Filtres départements
- Dockerisation
- Fichiers de seed
