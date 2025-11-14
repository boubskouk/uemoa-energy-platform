# Architecture de l'Application

## 📁 Structure Générale du Projet

```
uemoa-energy-platform/
├── backend/                    # API Node.js + Express
├── frontend/                   # Application Vue.js
├── docs/                       # Documentation
├── docker-compose.yml          # Configuration Docker (optionnel)
└── README.md
```

---

## 🔧 Structure du BACKEND (Node.js + Express)

```
backend/
├── src/
│   ├── config/                 # Configuration
│   │   ├── database.js        # Configuration MongoDB
│   │   ├── jwt.js             # Configuration JWT
│   │   └── email.js           # Configuration nodemailer
│   │
│   ├── models/                 # Modèles Mongoose
│   │   ├── User.js
│   │   ├── Actor.js
│   │   ├── Category.js
│   │   ├── Energy.js
│   │   ├── Country.js
│   │   ├── News.js
│   │   ├── Event.js
│   │   └── index.js           # Export de tous les modèles
│   │
│   ├── routes/                 # Routes API
│   │   ├── auth.routes.js     # /api/auth (login, register, forgot-password)
│   │   ├── users.routes.js    # /api/users
│   │   ├── actors.routes.js   # /api/actors
│   │   ├── categories.routes.js
│   │   ├── energies.routes.js
│   │   ├── countries.routes.js
│   │   ├── news.routes.js
│   │   ├── events.routes.js
│   │   ├── search.routes.js   # /api/search (recherche avancée)
│   │   ├── stats.routes.js    # /api/stats (statistiques)
│   │   └── index.js           # Centralisation des routes
│   │
│   ├── controllers/            # Logique métier
│   │   ├── auth.controller.js
│   │   ├── users.controller.js
│   │   ├── actors.controller.js
│   │   ├── categories.controller.js
│   │   ├── energies.controller.js
│   │   ├── countries.controller.js
│   │   ├── news.controller.js
│   │   ├── events.controller.js
│   │   ├── search.controller.js
│   │   └── stats.controller.js
│   │
│   ├── middlewares/            # Middlewares
│   │   ├── auth.middleware.js # Vérification JWT
│   │   ├── role.middleware.js # Vérification rôles (admin, actor, visitor)
│   │   ├── validation.middleware.js # Validation des données
│   │   ├── upload.middleware.js     # Upload de fichiers (multer)
│   │   ├── error.middleware.js      # Gestion des erreurs
│   │   └── logger.middleware.js     # Logging des requêtes
│   │
│   ├── validators/             # Schémas de validation (express-validator)
│   │   ├── auth.validator.js
│   │   ├── actor.validator.js
│   │   ├── user.validator.js
│   │   ├── news.validator.js
│   │   └── event.validator.js
│   │
│   ├── services/               # Services (logique complexe)
│   │   ├── email.service.js   # Envoi d'emails
│   │   ├── upload.service.js  # Gestion uploads (Cloudinary/S3)
│   │   ├── geocoding.service.js # Géocodage d'adresses
│   │   └── stats.service.js   # Calcul de statistiques
│   │
│   ├── utils/                  # Utilitaires
│   │   ├── generateToken.js   # Génération JWT
│   │   ├── sendEmail.js
│   │   ├── slugify.js         # Génération de slugs
│   │   └── constants.js       # Constantes de l'app
│   │
│   ├── seeders/                # Initialisation de la DB
│   │   ├── countries.seed.js  # Les 8 pays UEMOA
│   │   ├── categories.seed.js
│   │   ├── energies.seed.js
│   │   ├── admin.seed.js      # Compte admin par défaut
│   │   └── index.js
│   │
│   ├── app.js                  # Configuration Express
│   └── server.js               # Point d'entrée
│
├── uploads/                    # Fichiers uploadés (en local, dev uniquement)
├── logs/                       # Logs de l'application
├── tests/                      # Tests unitaires et d'intégration
│   ├── unit/
│   ├── integration/
│   └── setup.js
│
├── .env.example                # Variables d'environnement exemple
├── .env                        # Variables d'environnement (git-ignored)
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

### Fichier `.env` (Backend)

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/uemoa_energy_platform

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# Email (exemple avec Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend URL (pour CORS)
FRONTEND_URL=http://localhost:5173

# Upload (Cloudinary - optionnel)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🎨 Structure du FRONTEND (Vue.js 3)

```
frontend/
├── public/
│   ├── favicon.ico
│   └── index.html
│
├── src/
│   ├── assets/                 # Assets statiques
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │       ├── main.css       # Imports Tailwind
│   │       └── custom.css     # Styles personnalisés
│   │
│   ├── components/             # Composants réutilisables
│   │   ├── common/            # Composants communs
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppFooter.vue
│   │   │   ├── AppNavbar.vue
│   │   │   ├── LoadingSpinner.vue
│   │   │   ├── ConfirmDialog.vue
│   │   │   ├── Pagination.vue
│   │   │   └── SearchBar.vue
│   │   │
│   │   ├── actors/            # Composants acteurs
│   │   │   ├── ActorCard.vue
│   │   │   ├── ActorList.vue
│   │   │   ├── ActorFilter.vue
│   │   │   ├── ActorForm.vue
│   │   │   └── ActorMap.vue
│   │   │
│   │   ├── news/
│   │   │   ├── NewsCard.vue
│   │   │   ├── NewsList.vue
│   │   │   └── NewsForm.vue
│   │   │
│   │   ├── events/
│   │   │   ├── EventCard.vue
│   │   │   ├── EventList.vue
│   │   │   └── EventForm.vue
│   │   │
│   │   └── stats/
│   │       ├── StatCard.vue
│   │       ├── ChartBar.vue
│   │       ├── ChartPie.vue
│   │       └── CountryMap.vue
│   │
│   ├── views/                  # Pages (routes)
│   │   ├── Home.vue           # Page d'accueil
│   │   ├── About.vue          # À propos
│   │   │
│   │   ├── actors/
│   │   │   ├── ActorsList.vue        # Liste des acteurs
│   │   │   ├── ActorDetail.vue       # Détail d'un acteur
│   │   │   ├── ActorCreate.vue       # Créer un acteur
│   │   │   └── ActorEdit.vue         # Modifier un acteur
│   │   │
│   │   ├── news/
│   │   │   ├── NewsList.vue
│   │   │   └── NewsDetail.vue
│   │   │
│   │   ├── events/
│   │   │   ├── EventsList.vue
│   │   │   └── EventDetail.vue
│   │   │
│   │   ├── auth/
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   ├── ForgotPassword.vue
│   │   │   └── ResetPassword.vue
│   │   │
│   │   ├── profile/
│   │   │   ├── ProfileView.vue       # Mon profil
│   │   │   └── ProfileEdit.vue       # Modifier profil
│   │   │
│   │   ├── admin/              # Pages admin
│   │   │   ├── Dashboard.vue         # Tableau de bord
│   │   │   ├── ManageActors.vue      # Gérer les acteurs
│   │   │   ├── ManageUsers.vue       # Gérer les utilisateurs
│   │   │   ├── ManageNews.vue
│   │   │   ├── ManageEvents.vue
│   │   │   ├── Statistics.vue        # Statistiques globales
│   │   │   └── Settings.vue          # Paramètres
│   │   │
│   │   ├── Search.vue          # Recherche avancée
│   │   ├── Map.vue             # Carte interactive
│   │   ├── Statistics.vue      # Statistiques publiques
│   │   ├── Contact.vue         # Contact
│   │   └── NotFound.vue        # 404
│   │
│   ├── router/
│   │   └── index.js            # Configuration Vue Router
│   │
│   ├── stores/                 # Pinia stores (state management)
│   │   ├── auth.js            # Authentification
│   │   ├── actors.js          # Gestion des acteurs
│   │   ├── news.js
│   │   ├── events.js
│   │   ├── countries.js
│   │   ├── categories.js
│   │   ├── energies.js
│   │   ├── ui.js              # État UI (modals, notifications)
│   │   └── index.js
│   │
│   ├── services/               # Services API
│   │   ├── api.js             # Instance Axios configurée
│   │   ├── auth.service.js
│   │   ├── actors.service.js
│   │   ├── news.service.js
│   │   ├── events.service.js
│   │   ├── countries.service.js
│   │   ├── categories.service.js
│   │   └── stats.service.js
│   │
│   ├── composables/            # Composition API composables
│   │   ├── useAuth.js
│   │   ├── usePagination.js
│   │   ├── useFilters.js
│   │   ├── useMap.js
│   │   └── useNotification.js
│   │
│   ├── utils/                  # Utilitaires
│   │   ├── constants.js
│   │   ├── formatters.js      # Format dates, nombres, etc.
│   │   ├── validators.js      # Validation de formulaires
│   │   └── helpers.js
│   │
│   ├── i18n/                   # Internationalisation
│   │   ├── index.js
│   │   ├── locales/
│   │   │   ├── fr.json        # Traductions françaises
│   │   │   └── en.json        # Traductions anglaises
│   │
│   ├── plugins/                # Plugins Vue
│   │   ├── i18n.js
│   │   └── toast.js           # Notifications toast
│   │
│   ├── App.vue                 # Composant racine
│   └── main.js                 # Point d'entrée
│
├── .env.example
├── .env                        # Variables d'environnement
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js              # Configuration Vite
├── tailwind.config.js          # Configuration Tailwind
├── postcss.config.js
└── README.md
```

### Fichier `.env` (Frontend)

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=UEMOA Energy Platform
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

---

## 🔄 Flux de données (Architecture)

```
Vue Component
    ↓
Store (Pinia)
    ↓
Service (Axios)
    ↓
API Backend (Express)
    ↓
Controller
    ↓
Model (Mongoose)
    ↓
MongoDB
```

---

## 🛣️ Routes principales

### Backend API Routes

```
/api/auth
  POST   /register          - Inscription
  POST   /login             - Connexion
  POST   /forgot-password   - Mot de passe oublié
  POST   /reset-password    - Réinitialiser mot de passe
  GET    /me                - Utilisateur connecté
  POST   /verify-email      - Vérifier email

/api/actors
  GET    /                  - Liste des acteurs (public)
  GET    /:id               - Détail d'un acteur
  POST   /                  - Créer un acteur (auth)
  PUT    /:id               - Modifier un acteur (auth, owner ou admin)
  DELETE /:id               - Supprimer un acteur (auth, owner ou admin)
  GET    /country/:countryId - Acteurs par pays
  PATCH  /:id/approve       - Approuver un acteur (admin)

/api/categories
  GET    /                  - Liste des catégories
  POST   /                  - Créer une catégorie (admin)
  PUT    /:id               - Modifier (admin)
  DELETE /:id               - Supprimer (admin)

/api/energies
  GET    /                  - Liste des types d'énergies
  POST   /                  - Créer (admin)
  PUT    /:id               - Modifier (admin)
  DELETE /:id               - Supprimer (admin)

/api/countries
  GET    /                  - Liste des pays UEMOA
  GET    /:id               - Détail d'un pays
  GET    /:id/actors        - Acteurs d'un pays

/api/news
  GET    /                  - Liste des actualités
  GET    /:slug             - Détail
  POST   /                  - Créer (admin)
  PUT    /:id               - Modifier (admin)
  DELETE /:id               - Supprimer (admin)

/api/events
  GET    /                  - Liste des événements
  GET    /:slug             - Détail
  POST   /                  - Créer (auth)
  PUT    /:id               - Modifier (auth, owner ou admin)
  DELETE /:id               - Supprimer (auth, owner ou admin)

/api/search
  GET    /                  - Recherche globale
  GET    /actors            - Recherche d'acteurs avancée

/api/stats
  GET    /overview          - Statistiques générales
  GET    /by-country        - Stats par pays
  GET    /by-energy         - Stats par type d'énergie
  GET    /by-category       - Stats par catégorie
```

### Frontend Routes (Vue Router)

```
/                           - Accueil
/about                      - À propos

/actors                     - Liste des acteurs
/actors/:id                 - Détail d'un acteur
/actors/create              - Créer un acteur (auth)
/actors/:id/edit            - Modifier un acteur (auth)

/news                       - Actualités
/news/:slug                 - Détail actualité

/events                     - Événements
/events/:slug               - Détail événement

/search                     - Recherche avancée
/map                        - Carte interactive
/statistics                 - Statistiques

/login                      - Connexion
/register                   - Inscription
/forgot-password            - Mot de passe oublié
/reset-password/:token      - Réinitialiser mot de passe

/profile                    - Mon profil (auth)
/profile/edit               - Modifier profil (auth)

/admin                      - Dashboard admin (admin)
/admin/actors               - Gérer acteurs (admin)
/admin/users                - Gérer utilisateurs (admin)
/admin/news                 - Gérer actualités (admin)
/admin/events               - Gérer événements (admin)
/admin/statistics           - Statistiques (admin)
/admin/settings             - Paramètres (admin)

/contact                    - Contact
/*                          - 404 Not Found
```

---

## 🔐 Middleware Chain (Backend)

Exemple pour une route protégée :

```javascript
router.post(
  '/actors',
  auth.middleware,           // Vérifier JWT
  role.middleware(['actor', 'admin']), // Vérifier rôle
  upload.middleware,         // Gérer upload de fichiers
  actor.validator,           // Valider les données
  actors.controller.create   // Exécuter logique
);
```

---

## 📦 Modules principaux

### Backend
1. **Authentication** : JWT, bcrypt
2. **Database** : Mongoose, MongoDB
3. **Validation** : express-validator
4. **File Upload** : multer, cloudinary
5. **Email** : nodemailer
6. **Security** : helmet, cors, express-rate-limit

### Frontend
1. **UI** : Vue 3, Tailwind CSS
2. **Routing** : Vue Router
3. **State** : Pinia
4. **HTTP** : Axios
5. **Maps** : Leaflet.js
6. **Charts** : Chart.js
7. **i18n** : vue-i18n

---

## 🚀 Commandes de développement

### Backend
```bash
npm run dev          # Démarrer en mode développement (nodemon)
npm start            # Démarrer en production
npm run seed         # Peupler la base de données
npm test             # Lancer les tests
```

### Frontend
```bash
npm run dev          # Démarrer serveur de dev (Vite)
npm run build        # Build pour production
npm run preview      # Prévisualiser le build
npm run lint         # Linter le code
```
