# 🚀 Guide de Démarrage - Plateforme UEMOA Energy

## ✅ Ce qui a été créé

### Phase 1 : Conception (✅ TERMINÉE)
- ✅ Stack technique MEVN définie
- ✅ Schéma de base de données MongoDB
- ✅ Architecture complète de l'application
- ✅ Wireframes des pages principales

### Phase 2 & 3 : Initialisation et Développement Backend (✅ TERMINÉE)
- ✅ Projet backend Node.js + Express initialisé
- ✅ Configuration MongoDB
- ✅ 7 modèles Mongoose créés (User, Actor, Country, Category, Energy, News, Event)
- ✅ 4 seeders pour données initiales
- ✅ Middlewares (authentification JWT, rôles, upload, erreurs)
- ✅ Utilitaires (JWT, slugify, constants)

### Phase 4 : Frontend (✅ BASE CRÉÉE)
- ✅ Projet Vue.js 3 + Vite initialisé
- ✅ Tailwind CSS configuré
- ✅ Vue Router configuré
- ✅ Service API Axios
- ✅ Store Pinia (authentification)
- ✅ 5 pages de base créées (Home, Login, Register, ActorsList, NotFound)

---

## 📋 Prérequis

Avant de démarrer, assurez-vous d'avoir installé :

1. **Node.js** v18+ ([télécharger](https://nodejs.org/))
2. **MongoDB** v6+ ([télécharger](https://www.mongodb.com/try/download/community) ou utiliser [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
3. **Git** ([télécharger](https://git-scm.com/))
4. **Un éditeur de code** (VSCode recommandé)

---

## 🛠️ Installation et Démarrage

### Étape 1 : MongoDB

#### Option A : MongoDB Local
```bash
# Windows
# Téléchargez et installez MongoDB Community Edition
# Démarrez MongoDB comme service

# Vérifier que MongoDB fonctionne
mongosh
```

#### Option B : MongoDB Atlas (Recommandé)
1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster gratuit
3. Créez un utilisateur de base de données
4. Ajoutez votre IP à la whitelist (0.0.0.0/0 pour autoriser toutes les IP en dev)
5. Récupérez votre connection string

---

### Étape 2 : Backend

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
# Le fichier .env est déjà créé avec des valeurs par défaut
# Si vous utilisez MongoDB Atlas, modifiez MONGODB_URI dans .env

# Peupler la base de données avec les données initiales
npm run seed

# Démarrer le serveur backend
npm run dev
```

Le backend démarre sur **http://localhost:5000**

✅ **Vérification** : Ouvrez http://localhost:5000/api/health dans votre navigateur. Vous devriez voir :
```json
{
  "status": "OK",
  "message": "API UEMOA Energy Platform",
  ...
}
```

---

### Étape 3 : Frontend

**Dans un nouveau terminal :**

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le frontend démarre sur **http://localhost:5173**

✅ **Vérification** : Ouvrez http://localhost:5173 dans votre navigateur. Vous devriez voir la page d'accueil.

---

## 🎯 Test Complet

### 1. Vérifier la connexion backend ↔ frontend

Sur la page d'accueil (http://localhost:5173), vous devriez voir :
- ✅ Message "Connexion API réussie" en vert

### 2. Tester l'authentification

**Identifiants admin créés automatiquement :**
- Email : `admin@uemoa-energy.org`
- Mot de passe : `Admin@2025!`

1. Allez sur http://localhost:5173/login
2. Connectez-vous avec les identifiants ci-dessus
3. Vous serez redirigé vers la page d'accueil

⚠️ **IMPORTANT** : Changez le mot de passe admin en production !

---

## 📁 Structure du Projet

```
uemoa-energy-platform/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── config/         # Configuration (DB, JWT, Email)
│   │   ├── models/         # Modèles Mongoose (7 modèles)
│   │   ├── middlewares/    # Auth, Upload, Erreurs
│   │   ├── utils/          # Utilitaires
│   │   ├── seeders/        # Scripts de peuplement DB
│   │   ├── app.js          # Configuration Express
│   │   └── server.js       # Point d'entrée
│   ├── .env                # Variables d'environnement
│   ├── package.json
│   └── README.md
│
├── frontend/               # Application Vue.js 3
│   ├── src/
│   │   ├── assets/        # Images, styles
│   │   ├── components/    # Composants Vue (à créer)
│   │   ├── views/         # Pages (5 pages de base)
│   │   ├── router/        # Configuration Vue Router
│   │   ├── stores/        # Stores Pinia (auth créé)
│   │   ├── services/      # Services API (api.js)
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env
│
├── STACK_TECHNIQUE.md
├── DATABASE_SCHEMA.md
├── ARCHITECTURE.md
├── WIREFRAMES.md
├── ROADMAP.md
└── DEMARRAGE_PROJET.md  ← Vous êtes ici
```

---

## 🗄️ Données Initiales (Seeder)

Après avoir exécuté `npm run seed` dans le backend, votre base de données contient :

- ✅ **8 pays UEMOA** : Bénin, Burkina Faso, Côte d'Ivoire, Guinée-Bissau, Mali, Niger, Sénégal, Togo
- ✅ **8 catégories d'activités** : Production, Distribution, Installation, Recherche, Formation, Conseil, Fabrication, Financement
- ✅ **8 types d'énergies** : Solaire PV, Solaire thermique, Éolien, Hydraulique, Biomasse, Biogaz, Géothermie, Hydrogène vert
- ✅ **1 compte administrateur** : admin@uemoa-energy.org / Admin@2025!

---

## 🔄 Commandes Utiles

### Backend
```bash
cd backend

npm run dev              # Démarrer en mode développement
npm start                # Démarrer en mode production
npm run seed             # Peupler toute la base de données
npm run seed:countries   # Peupler uniquement les pays
npm run seed:categories  # Peupler uniquement les catégories
npm run seed:energies    # Peupler uniquement les énergies
npm run seed:admin       # Créer le compte admin
```

### Frontend
```bash
cd frontend

npm run dev              # Démarrer serveur de dev
npm run build            # Build pour production
npm run preview          # Prévisualiser le build
```

---

## 🐛 Dépannage

### Backend ne démarre pas

**Erreur : "Cannot connect to MongoDB"**
- Vérifiez que MongoDB est démarré (si installation locale)
- Vérifiez `MONGODB_URI` dans `backend/.env`
- Pour MongoDB Atlas : vérifiez les credentials et l'IP whitelisting

**Erreur : "Port 5000 already in use"**
- Changez le `PORT` dans `backend/.env`

### Frontend ne démarre pas

**Erreur : "Failed to resolve import"**
- Supprimez `node_modules/` et `package-lock.json`
- Réexécutez `npm install`

**Erreur CORS**
- Vérifiez que le backend est démarré
- Vérifiez que `FRONTEND_URL` dans `backend/.env` est correct

### API non accessible depuis le frontend

- Vérifiez que le backend est démarré sur http://localhost:5000
- Vérifiez `VITE_API_URL` dans `frontend/.env`
- Ouvrez les DevTools du navigateur (F12) et vérifiez la console

---

## 📝 Prochaines Étapes

### À court terme (Phase 3 - Backend)
1. Créer les routes API restantes (auth, actors, news, events, search, stats)
2. Créer les controllers correspondants
3. Créer les validators avec express-validator
4. Tester toutes les routes avec Postman ou Thunder Client

### À court terme (Phase 4 - Frontend)
1. Créer tous les composants (Header, Footer, ActorCard, etc.)
2. Développer toutes les pages (liste acteurs avec filtres, détail, carte, stats, admin)
3. Implémenter la logique de recherche et filtres
4. Intégrer Leaflet pour la carte interactive
5. Intégrer Chart.js pour les statistiques

### À moyen terme (Phase 5)
1. Tests unitaires et d'intégration
2. Optimisation des performances
3. Sécurité et conformité RGPD
4. Documentation complète

### À long terme (Phase 6)
1. Déploiement en production
2. Formation des utilisateurs
3. Maintenance et support

Consultez **ROADMAP.md** pour le plan détaillé complet.

---

## 📚 Documentation

- [README Backend](./backend/README.md) - Documentation détaillée de l'API
- [STACK_TECHNIQUE.md](./STACK_TECHNIQUE.md) - Technologies utilisées
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Schéma de base de données
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture de l'application
- [WIREFRAMES.md](./WIREFRAMES.md) - Maquettes des pages
- [ROADMAP.md](./ROADMAP.md) - Plan de développement complet

---

## ⚠️ Notes Importantes

1. **Environnement de développement uniquement** : Cette configuration est pour le développement. Ne PAS utiliser en production sans ajustements de sécurité.

2. **Changez le mot de passe admin** : Le mot de passe par défaut doit être changé immédiatement.

3. **Variables d'environnement** : Ne jamais commit les fichiers `.env` dans Git. Les fichiers `.env.example` servent de template.

4. **MongoDB Atlas** : Pour la production, utilisez MongoDB Atlas avec des credentials sécurisés.

5. **JWT Secret** : Changez `JWT_SECRET` dans `backend/.env` par une valeur complexe et unique.

---

## 🆘 Besoin d'Aide ?

Si vous rencontrez des problèmes :

1. Vérifiez que tous les prérequis sont installés
2. Vérifiez que MongoDB fonctionne
3. Vérifiez les fichiers `.env`
4. Consultez les logs dans les terminaux backend et frontend
5. Consultez la documentation dans les README

---

## ✅ Checklist de Démarrage

- [ ] Node.js installé et fonctionnel
- [ ] MongoDB installé ou compte Atlas créé
- [ ] Backend : `npm install` exécuté
- [ ] Backend : `npm run seed` exécuté avec succès
- [ ] Backend : serveur démarre sur http://localhost:5000
- [ ] Backend : route /api/health accessible
- [ ] Frontend : `npm install` exécuté
- [ ] Frontend : serveur démarre sur http://localhost:5173
- [ ] Frontend : page d'accueil affiche "Connexion API réussie"
- [ ] Frontend : connexion avec admin@uemoa-energy.org fonctionne

---

**Le projet est prêt à être développé ! 🎉**

Consultez la **ROADMAP.md** pour la suite du développement.
