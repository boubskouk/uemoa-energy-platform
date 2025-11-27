# 🚀 Guide de Déploiement sur Render
## Plateforme UEMOA Énergies Renouvelables

---

## 📋 Vue d'Ensemble

Nous allons déployer :
- **Backend** (Node.js + Express) → Render Web Service
- **Frontend** (Vue.js) → Render Static Site
- **Base de données** → MongoDB Atlas (gratuit)

**Coût estimé** : 0-25€/mois

---

## ✅ Prérequis

### Comptes à Créer (Gratuits)
- [ ] Compte GitHub (pour héberger le code)
- [ ] Compte Render.com
- [ ] Compte MongoDB Atlas

### Fichiers à Préparer
- [ ] Code source backend
- [ ] Code source frontend
- [ ] Variables d'environnement

---

## 📝 ÉTAPE 1 : Préparer le Repository GitHub

### 1.1 Créer un Repository GitHub

**Si pas encore fait :**
```bash
# Aller sur github.com et créer un nouveau repository
# Nom suggéré : uemoa-energy-platform
```

### 1.2 Pousser le Code sur GitHub

```bash
# Vérifier l'état git
git status

# Ajouter tous les fichiers
git add .

# Commiter
git commit -m "🚀 Préparation déploiement Render"

# Ajouter le remote GitHub (remplacer YOUR_USERNAME et YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/uemoa-energy-platform.git

# Pousser sur GitHub
git push -u origin master
```

### 1.3 Vérifier la Structure

Votre repository doit avoir cette structure :
```
uemoa-energy-platform/
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## 🗄️ ÉTAPE 2 : Configurer MongoDB Atlas

### 2.1 Créer un Compte MongoDB Atlas

1. Aller sur https://www.mongodb.com/cloud/atlas
2. Cliquer sur "Try Free"
3. S'inscrire avec Google/Email
4. Vérifier l'email

### 2.2 Créer un Cluster (Gratuit)

1. **Choisir le plan** : M0 (Free Forever)
2. **Provider** : AWS
3. **Region** : Europe (Paris) ou la plus proche
4. **Nom du cluster** : uemoa-energy-cluster
5. Cliquer "Create Cluster" (prend 3-5 minutes)

### 2.3 Créer un Utilisateur Database

1. Dans le menu, cliquer "Database Access"
2. Cliquer "Add New Database User"
3. **Authentication Method** : Password
4. **Username** : `uemoa_admin`
5. **Password** : Générer un mot de passe fort (NOTER LE !)
6. **Database User Privileges** : "Read and write to any database"
7. Cliquer "Add User"

### 2.4 Configurer Network Access

1. Dans le menu, cliquer "Network Access"
2. Cliquer "Add IP Address"
3. Cliquer "Allow Access from Anywhere" (0.0.0.0/0)
4. **Note** : "Render deployment"
5. Cliquer "Confirm"

### 2.5 Obtenir la Connection String

1. Cliquer "Database" dans le menu
2. Cliquer "Connect" sur votre cluster
3. Choisir "Connect your application"
4. **Driver** : Node.js
5. **Version** : 5.5 or later
6. Copier la connection string :
   ```
   mongodb+srv://uemoa_admin:<password>@uemoa-energy-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. **IMPORTANT** : Remplacer `<password>` par votre vrai mot de passe
8. Ajouter le nom de la base : `/uemoa_energy_platform`
   ```
   mongodb+srv://uemoa_admin:VOTRE_PASSWORD@uemoa-energy-cluster.xxxxx.mongodb.net/uemoa_energy_platform?retryWrites=true&w=majority
   ```

**NOTER CETTE CONNECTION STRING !** Vous en aurez besoin pour le backend.

---

## 🔧 ÉTAPE 3 : Préparer le Backend pour Render

### 3.1 Créer un Fichier `render.yaml` à la Racine du Projet

```bash
cd "E:\site et apps\repertoire acteur\site repertoire acteur"
```

Créer `render.yaml` :
```yaml
services:
  # Backend API
  - type: web
    name: uemoa-energy-backend
    env: node
    region: frankfurt
    plan: free
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: MONGODB_URI
        sync: false # À configurer manuellement dans Render dashboard
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_EXPIRE
        value: 7d
      - key: CORS_ORIGIN
        sync: false # URL du frontend (à configurer après)
```

### 3.2 Vérifier `backend/package.json`

Ouvrir `backend/package.json` et vérifier les scripts :

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "seed": "node src/seeders/index.js"
  }
}
```

### 3.3 Modifier `backend/src/server.js`

Vérifier que le port est bien dynamique :

```javascript
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV}`);
});
```

### 3.4 Créer `.gitignore` pour le Backend

Vérifier que `backend/.gitignore` contient :
```
node_modules/
.env
.env.local
.env.production
*.log
```

### 3.5 Commit et Push

```bash
git add .
git commit -m "🔧 Configuration pour déploiement Render"
git push origin master
```

---

## 🌐 ÉTAPE 4 : Déployer le Backend sur Render

### 4.1 Créer un Compte Render

1. Aller sur https://render.com
2. Cliquer "Get Started for Free"
3. S'inscrire avec GitHub (recommandé)
4. Autoriser Render à accéder à vos repositories

### 4.2 Créer un Web Service pour le Backend

1. Sur le dashboard Render, cliquer "New +"
2. Choisir "Web Service"
3. **Connect a repository** : Chercher et sélectionner votre repo `uemoa-energy-platform`
4. Cliquer "Connect"

### 4.3 Configurer le Web Service

**Settings de base :**
- **Name** : `uemoa-energy-backend`
- **Region** : Frankfurt (Europe) ou la plus proche
- **Branch** : `master`
- **Root Directory** : `backend`
- **Runtime** : Node
- **Build Command** : `npm install`
- **Start Command** : `npm start`

**Instance Type :**
- Choisir "Free" (0€/mois)

### 4.4 Configurer les Variables d'Environnement

Scroller jusqu'à "Environment Variables" et ajouter :

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://uemoa_admin:VOTRE_PASSWORD@...` (de l'étape 2.5) |
| `JWT_SECRET` | Générer une chaîne aléatoire forte (32+ caractères) |
| `JWT_EXPIRE` | `7d` |
| `CORS_ORIGIN` | `*` (temporaire, on changera après) |

**Pour générer JWT_SECRET :**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4.5 Déployer

1. Cliquer "Create Web Service"
2. Render va commencer à déployer (5-10 minutes)
3. Vous verrez les logs en temps réel

### 4.6 Vérifier le Déploiement

Une fois le déploiement réussi :
1. Copier l'URL de votre backend (ex: `https://uemoa-energy-backend.onrender.com`)
2. Tester dans le navigateur : `https://uemoa-energy-backend.onrender.com/api/health`
3. Vous devriez voir : `{"status": "ok"}`

**NOTER L'URL DU BACKEND !**

---

## 🎨 ÉTAPE 5 : Préparer le Frontend pour Render

### 5.1 Configurer les Variables d'Environnement

Créer `frontend/.env.production` :

```env
VITE_API_URL=https://uemoa-energy-backend.onrender.com
VITE_APP_NAME=UEMOA Energy Platform
```

**IMPORTANT** : Remplacer l'URL par celle de votre backend (de l'étape 4.6)

### 5.2 Vérifier `frontend/package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 5.3 Tester le Build Localement

```bash
cd frontend
npm run build
```

Vérifier qu'il n'y a pas d'erreurs. Le build doit créer un dossier `dist/`.

### 5.4 Créer `frontend/.gitignore`

```
node_modules/
dist/
.env.local
.env.production.local
*.log
```

### 5.5 Commit et Push

```bash
cd ..
git add .
git commit -m "🎨 Configuration frontend pour Render"
git push origin master
```

---

## 🌐 ÉTAPE 6 : Déployer le Frontend sur Render

### 6.1 Créer un Static Site

1. Sur le dashboard Render, cliquer "New +"
2. Choisir "Static Site"
3. Sélectionner votre repo `uemoa-energy-platform`
4. Cliquer "Connect"

### 6.2 Configurer le Static Site

**Settings de base :**
- **Name** : `uemoa-energy-frontend`
- **Branch** : `master`
- **Root Directory** : `frontend`
- **Build Command** : `npm install && npm run build`
- **Publish Directory** : `dist`

### 6.3 Configurer les Variables d'Environnement

Ajouter :

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://uemoa-energy-backend.onrender.com` (votre URL backend) |
| `VITE_APP_NAME` | `UEMOA Energy Platform` |

### 6.4 Déployer

1. Cliquer "Create Static Site"
2. Render va déployer (5-10 minutes)
3. Une fois terminé, copier l'URL du frontend (ex: `https://uemoa-energy-frontend.onrender.com`)

**NOTER L'URL DU FRONTEND !**

---

## 🔗 ÉTAPE 7 : Configurer CORS

### 7.1 Mettre à Jour CORS_ORIGIN du Backend

1. Aller sur le dashboard Render
2. Sélectionner votre backend service `uemoa-energy-backend`
3. Aller dans "Environment"
4. Modifier `CORS_ORIGIN` :
   - **Avant** : `*`
   - **Après** : `https://uemoa-energy-frontend.onrender.com` (votre URL frontend)
5. Cliquer "Save Changes"
6. Le service va redémarrer automatiquement

### 7.2 Vérifier dans le Code Backend

Si besoin, modifier `backend/src/server.js` :

```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
  credentials: true
};

app.use(cors(corsOptions));
```

---

## 🗄️ ÉTAPE 8 : Peupler la Base de Données

### 8.1 Option A : Via Script Local

```bash
# Depuis votre machine locale
cd backend

# Créer un fichier .env.production temporaire
echo "MONGODB_URI=mongodb+srv://uemoa_admin:PASSWORD@..." > .env.production

# Exécuter les seeders
NODE_ENV=production node src/seeders/countries.seed.js
NODE_ENV=production node src/seeders/energies.seed.js
NODE_ENV=production node src/seeders/categories.seed.js
NODE_ENV=production node src/seeders/admin.seed.js

# Insérer les acteurs réels via l'API setup
# Utiliser Postman ou curl :
curl -X GET "https://uemoa-energy-backend.onrender.com/api/setup/init-actors"
```

### 8.2 Option B : Via l'API Setup (Recommandé)

1. Ouvrir Postman ou votre navigateur
2. Appeler les endpoints suivants (dans l'ordre) :

```bash
# 1. Initialiser les pays
GET https://uemoa-energy-backend.onrender.com/api/setup/init-countries

# 2. Initialiser les énergies
GET https://uemoa-energy-backend.onrender.com/api/setup/init-energies

# 3. Initialiser les catégories
GET https://uemoa-energy-backend.onrender.com/api/setup/init-categories

# 4. Créer un admin (NOTE: créer une route sécurisée pour ça)
POST https://uemoa-energy-backend.onrender.com/api/auth/register
Body (JSON):
{
  "name": "Admin UEMOA",
  "email": "admin@uemoa-energy.org",
  "password": "VotreMotDePasseSecurise123!",
  "role": "admin"
}

# 5. Initialiser les acteurs réels
GET https://uemoa-energy-backend.onrender.com/api/setup/init-actors
```

### 8.3 Vérifier les Données

```bash
# Vérifier les statistiques
GET https://uemoa-energy-backend.onrender.com/api/setup/stats

# Devrait retourner :
{
  "total": 33,
  "approved": 33,
  "featured": 24,
  "byType": {...},
  "byCountry": {...}
}
```

---

## ✅ ÉTAPE 9 : Tests Finaux

### 9.1 Tester le Backend

```bash
# Health check
curl https://uemoa-energy-backend.onrender.com/api/health

# Récupérer les acteurs
curl https://uemoa-energy-backend.onrender.com/api/actors

# Récupérer les pays
curl https://uemoa-energy-backend.onrender.com/api/countries
```

### 9.2 Tester le Frontend

1. Ouvrir `https://uemoa-energy-frontend.onrender.com` dans le navigateur
2. Vérifier :
   - [ ] Page d'accueil se charge
   - [ ] Répertoire des acteurs affiche les 33 acteurs
   - [ ] Filtres fonctionnent
   - [ ] Carte interactive s'affiche
   - [ ] Recherche fonctionne
   - [ ] Connexion admin fonctionne

### 9.3 Tester l'Authentification

1. Aller sur `https://uemoa-energy-frontend.onrender.com/login`
2. Se connecter avec le compte admin créé
3. Vérifier l'accès au dashboard admin

---

## 🔒 ÉTAPE 10 : Sécurisation

### 10.1 Créer des Variables d'Environnement Sécurisées

Sur Render, pour le backend :
- [ ] `JWT_SECRET` : Généré aléatoirement (32+ caractères)
- [ ] `MONGODB_URI` : Avec utilisateur et mot de passe forts
- [ ] Activer "Auto-Deploy" : Oui

### 10.2 Configurer les Headers de Sécurité

Vérifier que `backend/src/server.js` a :
```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 10.3 Activer HTTPS Only

Render active automatiquement HTTPS. Vérifier :
- [ ] URLs commencent par `https://`
- [ ] Redirection HTTP → HTTPS automatique

---

## 📊 ÉTAPE 11 : Monitoring

### 11.1 Activer les Logs Render

1. Sur chaque service Render, aller dans "Logs"
2. Observer les logs en temps réel
3. Vérifier qu'il n'y a pas d'erreurs

### 11.2 Configurer Uptime Monitoring (Optionnel)

Utiliser un service gratuit comme :
- **UptimeRobot** (https://uptimerobot.com) - Gratuit pour 50 monitors
- **Pingdom** - Essai gratuit

Ajouter des checks pour :
- Backend API : `https://uemoa-energy-backend.onrender.com/api/health`
- Frontend : `https://uemoa-energy-frontend.onrender.com`

---

## 💰 Coûts Render

### Plan Gratuit (0€/mois)
- **Backend** : 750 heures/mois (suffisant)
- **Frontend** : 100 GB bandwidth/mois
- **Limitations** :
  - Services s'endorment après 15 min d'inactivité
  - Redémarrage lent (30-60 secondes)

### Plan Starter (7€/mois par service)
- Pas de mise en veille
- Support prioritaire
- Meilleures performances

**Recommandation** : Commencer avec le plan gratuit pour tester

---

## 🚨 Dépannage

### Problème : Build échoue

**Solution** :
1. Vérifier les logs dans Render
2. Tester le build localement : `npm install && npm run build`
3. Vérifier `package.json` et les dépendances

### Problème : Connection MongoDB échoue

**Solution** :
1. Vérifier la connection string dans les variables d'environnement
2. Vérifier que le mot de passe ne contient pas de caractères spéciaux non encodés
3. Vérifier que "0.0.0.0/0" est dans la whitelist MongoDB Atlas

### Problème : CORS errors

**Solution** :
1. Vérifier `CORS_ORIGIN` dans le backend
2. Vérifier que l'URL du frontend est correcte
3. Vérifier que `credentials: true` est configuré

### Problème : Frontend ne se connecte pas au Backend

**Solution** :
1. Vérifier `VITE_API_URL` dans les variables d'environnement du frontend
2. Ouvrir la console du navigateur pour voir les erreurs
3. Vérifier que le backend est bien démarré (pas en veille)

---

## 📝 Checklist Finale

- [ ] MongoDB Atlas configuré et accessible
- [ ] Backend déployé sur Render
- [ ] Frontend déployé sur Render
- [ ] Variables d'environnement configurées
- [ ] CORS configuré correctement
- [ ] Base de données peuplée (33 acteurs)
- [ ] Compte admin créé
- [ ] Tests fonctionnels passés
- [ ] HTTPS activé
- [ ] Monitoring configuré (optionnel)

---

## 🎉 Félicitations !

Votre application est maintenant en production sur Render !

**URLs de Production :**
- **Frontend** : https://uemoa-energy-frontend.onrender.com
- **Backend API** : https://uemoa-energy-backend.onrender.com
- **Dashboard Admin** : https://uemoa-energy-frontend.onrender.com/admin

**Prochaines étapes :**
1. Configurer un nom de domaine personnalisé (optionnel)
2. Configurer les emails transactionnels
3. Ajouter plus de contenu (actualités, événements)
4. Faire des tests utilisateurs

---

**Date de déploiement** : _________
**Version** : 1.0.0
**Statut** : ✅ En production
