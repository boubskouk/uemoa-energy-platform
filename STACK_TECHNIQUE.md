# Stack Technique - Plateforme UEMOA Énergies Renouvelables

## Architecture Générale
**Type** : MEVN Stack (MongoDB, Express, Vue.js, Node.js)

---

## 🎨 Front-End

### Framework Principal
- **Vue.js 3** (Composition API)
- **Vue Router** - Navigation
- **Pinia** - State Management

### UI/UX
- **Tailwind CSS** - Framework CSS utility-first
- **Headless UI** ou **PrimeVue** - Composants UI
- **Leaflet.js** - Carte interactive
- **Chart.js** ou **ApexCharts** - Graphiques et statistiques

### Outils de développement
- **Vite** - Build tool
- **ESLint** - Linting
- **Prettier** - Code formatting

---

## ⚙️ Back-End

### Framework
- **Node.js** (v18+)
- **Express.js** - Framework web

### Base de données
- **MongoDB** (v6+)
- **Mongoose** - ODM (Object Document Mapper)

### Authentification & Sécurité
- **JWT** (jsonwebtoken) - Authentification
- **bcrypt** - Hachage des mots de passe
- **express-validator** - Validation des données
- **helmet** - Sécurité HTTP headers
- **cors** - Configuration CORS
- **express-rate-limit** - Protection anti-spam

### Gestion des fichiers
- **multer** - Upload de fichiers
- **cloudinary** ou **AWS S3** - Stockage cloud des images

### Email
- **nodemailer** - Envoi d'emails

---

## 🗄️ Base de Données

### MongoDB
- **Collections principales** :
  - users (utilisateurs)
  - actors (acteurs/structures)
  - categories (catégories d'activités)
  - energies (types d'énergies)
  - countries (pays UEMOA)
  - news (actualités)
  - events (événements)

---

## 🚀 Déploiement

### Hébergement
- **Front-end** : Vercel / Netlify / AWS Amplify
- **Back-end** : Railway / Render / AWS EC2
- **Base de données** : MongoDB Atlas

### CI/CD
- **GitHub Actions** - Intégration continue
- **Docker** (optionnel) - Containerisation

---

## 📦 Packages Principaux

### Back-end (package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-validator": "^7.0.1",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.5",
    "dotenv": "^16.3.1"
  }
}
```

### Front-end (package.json)
```json
{
  "dependencies": {
    "vue": "^3.3.4",
    "vue-router": "^4.2.5",
    "pinia": "^2.1.7",
    "axios": "^1.5.0",
    "leaflet": "^1.9.4",
    "chart.js": "^4.4.0"
  },
  "devDependencies": {
    "vite": "^4.4.9",
    "tailwindcss": "^3.3.3",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31"
  }
}
```

---

## 🌍 Internationalisation
- **vue-i18n** - Support multilingue (FR/EN)

---

## 📊 Monitoring (Production)
- **Winston** ou **Morgan** - Logging
- **PM2** - Process manager Node.js

---

## 🔒 Conformité RGPD
- Consentement cookies
- Politique de confidentialité
- Droit à l'oubli (suppression de compte)
- Export des données personnelles
