# Backend - UEMOA Energy Platform API

API REST pour la plateforme de répertoire des acteurs des énergies renouvelables de l'UEMOA.

## 🚀 Démarrage Rapide

### Prérequis

- Node.js v18 ou supérieur
- MongoDB v6 ou supérieur (local ou Atlas)
- npm ou yarn

### Installation

```bash
# Installer les dépendances
npm install

# Copier et configurer les variables d'environnement
cp .env.example .env
# Éditez .env avec vos configurations

# Peupler la base de données avec les données initiales
npm run seed

# Démarrer le serveur en mode développement
npm run dev
```

Le serveur démarrera sur `http://localhost:5000`

---

## 📁 Structure du Projet

```
backend/
├── src/
│   ├── config/           # Configurations (DB, JWT, Email)
│   ├── models/           # Modèles Mongoose
│   ├── routes/           # Routes API (à créer)
│   ├── controllers/      # Logique métier (à créer)
│   ├── middlewares/      # Middlewares (auth, upload, etc.)
│   ├── validators/       # Validation des données (à créer)
│   ├── services/         # Services (email, upload, etc.) (à créer)
│   ├── utils/            # Utilitaires
│   ├── seeders/          # Scripts de peuplement DB
│   ├── app.js            # Configuration Express
│   └── server.js         # Point d'entrée
├── uploads/              # Fichiers uploadés (dev only)
├── logs/                 # Logs
├── .env                  # Variables d'environnement
├── .env.example          # Template des variables
└── package.json
```

---

## 🔧 Scripts Disponibles

```bash
npm start           # Démarrer en mode production
npm run dev         # Démarrer en mode développement (avec nodemon)
npm run seed        # Peupler toute la base de données
npm run seed:countries    # Peupler uniquement les pays
npm run seed:categories   # Peupler uniquement les catégories
npm run seed:energies     # Peupler uniquement les énergies
npm run seed:admin        # Créer le compte admin
```

---

## 🗄️ Base de Données

### Collections MongoDB

1. **users** - Utilisateurs de la plateforme
2. **actors** - Acteurs du secteur énergétique
3. **countries** - 8 pays UEMOA
4. **categories** - Catégories d'activités
5. **energies** - Types d'énergies renouvelables
6. **news** - Actualités
7. **events** - Événements

### Peuplement Initial

Après avoir exécuté `npm run seed`, la base de données contient:
- ✅ 8 pays UEMOA
- ✅ 8 catégories d'activités
- ✅ 8 types d'énergies renouvelables
- ✅ 1 compte administrateur

**Identifiants admin par défaut:**
- Email: `admin@uemoa-energy.org`
- Mot de passe: `Admin@2025!`

⚠️ **IMPORTANT:** Changez le mot de passe après la première connexion!

---

## 🔑 Variables d'Environnement

Créez un fichier `.env` à la racine du dossier backend:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/uemoa_energy_platform

# JWT
JWT_SECRET=votre_cle_secrete_tres_longue_et_complexe
JWT_EXPIRE=7d

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:5173

# Email (optionnel pour le moment)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=noreply@uemoa-energy.org
```

---

## 📡 API Endpoints (En Développement)

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/forgot-password` - Mot de passe oublié
- `GET /api/auth/me` - Utilisateur connecté

### Acteurs
- `GET /api/actors` - Liste des acteurs
- `GET /api/actors/:id` - Détail d'un acteur
- `POST /api/actors` - Créer un acteur (auth requis)
- `PUT /api/actors/:id` - Modifier un acteur (auth requis)
- `DELETE /api/actors/:id` - Supprimer un acteur (auth requis)

### Pays
- `GET /api/countries` - Liste des pays UEMOA
- `GET /api/countries/:id` - Détail d'un pays
- `GET /api/countries/:id/actors` - Acteurs d'un pays

### Catégories & Énergies
- `GET /api/categories` - Liste des catégories
- `GET /api/energies` - Liste des types d'énergies

_Note: Les routes seront créées dans les prochaines étapes_

---

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

### Utilisation

1. **Connexion**
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}
```

2. **Utiliser le token**
```bash
GET /api/actors
Headers:
  Authorization: Bearer <votre_token_jwt>
```

---

## 👥 Rôles Utilisateurs

- **admin** - Accès complet
- **actor** - Peut gérer son profil d'acteur
- **visitor** - Consultation uniquement

---

## 📤 Upload de Fichiers

Les fichiers sont uploadés dans le dossier `uploads/` en développement.

Types de fichiers autorisés:
- **Images**: JPG, PNG, WEBP (max 5MB)
- **Documents**: PDF, DOC, DOCX (max 10MB)

---

## 🧪 Tests

```bash
npm test   # Tests unitaires et d'intégration (à configurer)
```

---

## 🛠️ Développement

### Créer une nouvelle route

1. Créer le controller dans `src/controllers/`
2. Créer les validators dans `src/validators/`
3. Créer la route dans `src/routes/`
4. Importer la route dans `src/app.js`

### Exemple

```javascript
// src/controllers/example.controller.js
exports.getAll = async (req, res) => {
  // Logique
};

// src/routes/example.routes.js
const express = require('express');
const router = express.Router();
const { getAll } = require('../controllers/example.controller');

router.get('/', getAll);

module.exports = router;

// src/app.js
const exampleRoutes = require('./routes/example.routes');
app.use('/api/examples', exampleRoutes);
```

---

## 📝 Modèles Disponibles

- `User` - Utilisateur
- `Actor` - Acteur
- `Country` - Pays
- `Category` - Catégorie
- `Energy` - Type d'énergie
- `News` - Actualité
- `Event` - Événement

Import:
```javascript
const { User, Actor, Country } = require('./models');
```

---

## 🐛 Dépannage

### MongoDB ne se connecte pas

- Vérifiez que MongoDB est démarré: `mongosh`
- Vérifiez `MONGODB_URI` dans `.env`
- Pour MongoDB Atlas: vérifiez l'IP whitelisting

### Port déjà utilisé

Changez le `PORT` dans `.env`

### Erreur lors du seeding

```bash
# Supprimer la base et recommencer
mongosh
> use uemoa_energy_platform
> db.dropDatabase()
> exit

npm run seed
```

---

## 📚 Ressources

- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [MongoDB](https://www.mongodb.com/docs/)

---

## 📄 Licence

© 2025 UEMOA Energy Platform
