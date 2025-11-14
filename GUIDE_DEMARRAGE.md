# Guide de Démarrage - Phase 2

## 🎯 Objectif de la Phase 2

Initialiser l'environnement de développement et créer la structure de base du projet.

---

## ✅ Pré-requis

Avant de commencer, assurez-vous d'avoir installé :

1. **Node.js** (version 18 ou supérieure)
   - Télécharger : https://nodejs.org/
   - Vérifier : `node --version`

2. **npm** (installé avec Node.js)
   - Vérifier : `npm --version`

3. **MongoDB**
   - Option 1 : Installation locale - https://www.mongodb.com/try/download/community
   - Option 2 (Recommandé) : MongoDB Atlas (cloud gratuit) - https://www.mongodb.com/cloud/atlas

4. **Git** (pour le versioning)
   - Télécharger : https://git-scm.com/
   - Vérifier : `git --version`

5. **Un éditeur de code** (Visual Studio Code recommandé)
   - Télécharger : https://code.visualstudio.com/

---

## 📁 Étape 1 : Créer la structure du projet

```bash
# Créer le dossier principal
mkdir uemoa-energy-platform
cd uemoa-energy-platform

# Créer les dossiers backend et frontend
mkdir backend frontend
```

---

## 🔧 Étape 2 : Initialiser le Backend

### 2.1 Configuration de base

```bash
cd backend
npm init -y
```

### 2.2 Installer les dépendances

```bash
# Dépendances principales
npm install express mongoose cors dotenv bcrypt jsonwebtoken express-validator helmet express-rate-limit

# Dépendances de développement
npm install --save-dev nodemon
```

### 2.3 Créer la structure des dossiers

```bash
# Windows
mkdir src src\config src\models src\routes src\controllers src\middlewares src\validators src\services src\utils src\seeders

# Linux/Mac
mkdir -p src/{config,models,routes,controllers,middlewares,validators,services,utils,seeders}
```

### 2.4 Créer les fichiers de base

**package.json** (ajouter les scripts) :
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "seed": "node src/seeders/index.js"
  }
}
```

**Créer `.env`** :
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/uemoa_energy_platform
JWT_SECRET=votre_cle_secrete_tres_longue_et_complexe
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

**Créer `.gitignore`** :
```
node_modules/
.env
uploads/
logs/
*.log
.DS_Store
```

### 2.5 Créer le point d'entrée `src/server.js`

```javascript
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// Connexion à MongoDB
connectDB();

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV}`);
});
```

### 2.6 Créer `src/app.js`

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middlewares de sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Middlewares pour parser le body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de test
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API UEMOA Energy Platform',
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

module.exports = app;
```

### 2.7 Créer `src/config/database.js`

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté avec succès');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 2.8 Tester le backend

```bash
npm run dev
```

Vous devriez voir :
```
✅ MongoDB connecté avec succès
✅ Serveur démarré sur le port 5000
🌍 Environnement: development
```

Testez l'API : http://localhost:5000/api/health

---

## 🎨 Étape 3 : Initialiser le Frontend

### 3.1 Créer le projet Vue.js avec Vite

```bash
cd ../frontend
npm create vite@latest . -- --template vue

# Installer les dépendances
npm install
```

### 3.2 Installer Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configurer `tailwind.config.js`** :
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#10B981',
          blue: '#3B82F6',
          yellow: '#F59E0B',
        }
      }
    },
  },
  plugins: [],
}
```

**Créer `src/assets/styles/main.css`** :
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Importer dans `src/main.js`** :
```javascript
import { createApp } from 'vue'
import './assets/styles/main.css'
import App from './App.vue'

createApp(App).mount('#app')
```

### 3.3 Installer les dépendances frontend

```bash
npm install vue-router pinia axios
npm install leaflet chart.js
```

### 3.4 Créer `.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=UEMOA Energy Platform
```

### 3.5 Créer la structure des dossiers

```bash
# Windows
cd src
mkdir components views router stores services utils

# Linux/Mac
mkdir -p components views router stores services utils
```

### 3.6 Tester le frontend

```bash
npm run dev
```

Le serveur devrait démarrer sur http://localhost:5173

---

## 🔗 Étape 4 : Connecter Frontend et Backend

### 4.1 Créer `frontend/src/services/api.js`

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 4.2 Tester la connexion

Créer `frontend/src/App.vue` :
```vue
<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <div class="container mx-auto p-8">
      <h1 class="text-3xl font-bold text-primary-green">
        UEMOA Energy Platform
      </h1>

      <div v-if="apiStatus" class="mt-4 p-4 bg-green-100 rounded">
        <p class="text-green-800">✅ API connectée : {{ apiStatus.message }}</p>
      </div>

      <div v-else-if="error" class="mt-4 p-4 bg-red-100 rounded">
        <p class="text-red-800">❌ Erreur : {{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from './services/api';

const apiStatus = ref(null);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await api.get('/health');
    apiStatus.value = response.data;
  } catch (err) {
    error.value = err.message;
  }
});
</script>
```

---

## ✅ Vérification finale

### Backend
- [ ] Serveur démarre sur http://localhost:5000
- [ ] MongoDB est connecté
- [ ] Route `/api/health` répond correctement

### Frontend
- [ ] Application démarre sur http://localhost:5173
- [ ] Tailwind CSS fonctionne
- [ ] Connexion à l'API backend réussie

---

## 🎯 Prochaines étapes

Une fois cette phase terminée, vous pouvez passer à :

1. **Créer les modèles Mongoose** (User, Actor, Country, etc.)
2. **Implémenter l'authentification** (JWT)
3. **Créer les routes API** de base
4. **Développer les composants Vue** principaux
5. **Mettre en place Vue Router** et Pinia

---

## 🆘 Problèmes courants

### MongoDB ne se connecte pas
- Vérifiez que MongoDB est démarré (si installation locale)
- Vérifiez l'URL dans `.env`
- Pour MongoDB Atlas, vérifiez les credentials et l'IP whitelisting

### CORS Error
- Vérifiez que `FRONTEND_URL` dans `.env` backend correspond au port frontend
- Assurez-vous que le middleware CORS est bien configuré

### Port déjà utilisé
- Changez le port dans `.env` (backend) ou `vite.config.js` (frontend)

---

## 📚 Ressources utiles

- [Documentation Vue.js 3](https://vuejs.org/)
- [Documentation Express](https://expressjs.com/)
- [Documentation Mongoose](https://mongoosejs.com/)
- [Documentation Tailwind CSS](https://tailwindcss.com/)
- [Documentation MongoDB](https://www.mongodb.com/docs/)

---

**Prêt à commencer le développement ?** 🚀

Dites-moi quand vous êtes prêt pour créer les modèles et implémenter les fonctionnalités !
