# 🔗 Guide de Connexion - Plateforme UEMOA Energy

## 📍 URLs d'Accès

### Backend API
- **URL** : http://localhost:5000
- **API Base** : http://localhost:5000/api
- **Health Check** : http://localhost:5000/api/health
- **Port** : 5000

### Frontend
- **URL** : http://localhost:5173
- **Port** : 5173
- **Proxy API** : Configuré vers http://localhost:5000

### Base de Données
- **MongoDB** : mongodb://localhost:27017
- **Database** : uemoa_energy_platform

---

## 🚀 Démarrage des Services

### Backend
```bash
cd backend
npm run dev
```

Le serveur démarre sur **http://localhost:5000**

### Frontend
```bash
cd frontend
npm run dev
```

L'application démarre sur **http://localhost:5173**

---

## 🔑 Compte Administrateur

### Identifiants par défaut
- **Email** : admin@uemoa-energy.org
- **Mot de passe** : Admin@2025!

⚠️ **Important** : Changez ce mot de passe en production !

---

## 📊 Données de Test Disponibles

### 8 Pays UEMOA
- 🇧🇯 Bénin
- 🇧🇫 Burkina Faso
- 🇨🇮 Côte d'Ivoire
- 🇬🇼 Guinée-Bissau
- 🇲🇱 Mali
- 🇳🇪 Niger
- 🇸🇳 Sénégal
- 🇹🇬 Togo

### 8 Catégories
- Production d'énergie
- Distribution et réseau
- Installation et maintenance
- Recherche et développement
- Formation et éducation
- Conseil et ingénierie
- Fabrication d'équipements
- Financement de projets

### 8 Types d'Énergies
- Solaire photovoltaïque ☀️
- Solaire thermique 🌡️
- Éolien 💨
- Hydraulique 💧
- Biomasse 🌾
- Biogaz ♻️
- Géothermie 🌋
- Hydrogène vert ⚡

### 10 Acteurs de Test
1. **SolarTech Sénégal** (Entreprise) - Dakar, Sénégal
   - Installation solaire photovoltaïque
   - 500+ installations réalisées

2. **EcoWind Burkina** (Entreprise) - Ouagadougou, Burkina Faso
   - Solutions éoliennes sahéliennes
   - Premier parc éolien du Burkina

3. **Université des Sciences Énergétiques CI** (Université) - Abidjan
   - Formation et recherche
   - Masters et doctorats en énergie

4. **HydroTogo** (Entreprise) - Lomé, Togo
   - Micro-centrales hydrauliques
   - Électrification rurale

5. **BioMasse Mali** (Entreprise) - Bamako, Mali
   - Transformation déchets agricoles
   - Production biogaz et biocarburants

6. **Niger Green Energy Consultants** (ONG) - Niamey, Niger
   - Conseil en transition énergétique
   - Accompagnement collectivités

7. **GreenTech Manufacturing Bénin** (Entreprise) - Cotonou, Bénin
   - Fabrication équipements solaires
   - 51-200 employés

8. **Fonds d'Investissement UEMOA** (Entreprise) - Dakar, Sénégal
   - Financement projets ER
   - Capital 50M€

9. **Centre de Recherche ER** (Recherche) - Bissau, Guinée-Bissau
   - Innovation énergies renouvelables
   - Statut : En attente d'approbation

10. **Solar Academy West Africa** (Association) - Abidjan, Côte d'Ivoire
    - Formation technique solaire
    - Certifications 3-6 mois

### 6 Actualités
- Actualités pré-créées avec statut "published"

### 5 Événements
- Événements à venir pré-créés

---

## 🔌 Endpoints API Principaux

### Authentification
```
POST /api/auth/register       # Inscription
POST /api/auth/login          # Connexion
POST /api/auth/logout         # Déconnexion
GET  /api/auth/me             # Profil actuel
POST /api/auth/forgot-password
POST /api/auth/reset-password/:token
```

### Acteurs
```
GET    /api/actors            # Liste (avec filtres)
GET    /api/actors/:id        # Détail
POST   /api/actors            # Créer (authentifié)
PUT    /api/actors/:id        # Modifier
DELETE /api/actors/:id        # Supprimer
GET    /api/actors/me         # Mon profil acteur
GET    /api/actors/pending    # En attente (admin)
PATCH  /api/actors/:id/approve # Approuver (admin)
PATCH  /api/actors/:id/reject  # Rejeter (admin)
PATCH  /api/actors/:id/feature # Mise en vedette (admin)
```

### Pays
```
GET /api/countries            # Liste des 8 pays
GET /api/countries/:id        # Détail
GET /api/countries/:id/actors # Acteurs par pays
```

### Catégories
```
GET    /api/categories         # Liste
GET    /api/categories/:id     # Détail
POST   /api/categories         # Créer (admin)
PUT    /api/categories/:id     # Modifier (admin)
DELETE /api/categories/:id     # Supprimer (admin)
PATCH  /api/categories/:id/toggle # Activer/Désactiver (admin)
```

### Énergies
```
GET    /api/energies          # Liste
GET    /api/energies/:id      # Détail
POST   /api/energies          # Créer (admin)
PUT    /api/energies/:id      # Modifier (admin)
DELETE /api/energies/:id      # Supprimer (admin)
PATCH  /api/energies/:id/toggle # Activer/Désactiver (admin)
```

### Recherche
```
GET /api/search               # Recherche globale
GET /api/search/actors        # Recherche acteurs
GET /api/search/news          # Recherche actualités
GET /api/search/events        # Recherche événements
GET /api/search/suggestions   # Autocomplétion
GET /api/search/tags          # Par tag
GET /api/search/popular-tags  # Tags populaires
```

### Statistiques
```
GET /api/stats/overview       # Vue d'ensemble
GET /api/stats/by-country     # Par pays
GET /api/stats/by-energy      # Par énergie
GET /api/stats/by-category    # Par catégorie
GET /api/stats/by-actor-type  # Par type d'acteur
GET /api/stats/timeline       # Évolution
GET /api/stats/top-actors     # Top acteurs
GET /api/stats/admin-dashboard # Dashboard admin
```

### Actualités
```
GET    /api/news              # Liste
GET    /api/news/:slug        # Détail
POST   /api/news              # Créer (admin)
PUT    /api/news/:id          # Modifier (admin)
DELETE /api/news/:id          # Supprimer (admin)
```

### Événements
```
GET    /api/events            # Liste
GET    /api/events/:slug      # Détail
POST   /api/events            # Créer
PUT    /api/events/:id        # Modifier
DELETE /api/events/:id        # Supprimer
```

### Upload
```
POST   /api/upload/image      # Upload image
POST   /api/upload/images     # Upload multiple
POST   /api/upload/document   # Upload document
POST   /api/upload/logo       # Upload logo
POST   /api/upload/cover      # Upload couverture
DELETE /api/upload            # Supprimer fichier
```

---

## 🧪 Tests API Rapides

### Vérifier la santé de l'API
```bash
curl http://localhost:5000/api/health
```

### Récupérer tous les acteurs
```bash
curl http://localhost:5000/api/actors
```

### Récupérer les statistiques globales
```bash
curl http://localhost:5000/api/stats/overview
```

### Se connecter (obtenir un token)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@uemoa-energy.org",
    "password": "Admin@2025!"
  }'
```

---

## 🛠️ Commandes Utiles

### Seeders (Peupler la base)
```bash
cd backend

# Tout peupler en une fois
npm run seed

# Ou individuellement
npm run seed:countries   # 8 pays UEMOA
npm run seed:categories  # 8 catégories
npm run seed:energies    # 8 types d'énergie
npm run seed:admin       # Compte admin
npm run seed:news        # 6 actualités
npm run seed:events      # 5 événements
npm run seed:actors      # 10 acteurs de test
```

### MongoDB
```bash
# Se connecter à MongoDB
mongosh mongodb://localhost:27017/uemoa_energy_platform

# Voir les collections
show collections

# Compter les acteurs
db.actors.countDocuments()

# Voir les acteurs approuvés
db.actors.find({status: "approved"}).pretty()
```

---

## 📝 Variables d'Environnement

Fichier : `backend/.env`

```env
# Backend
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/uemoa_energy_platform

# JWT
JWT_SECRET=uemoa_energy_platform_secret_key_2025_changez_moi_en_production
JWT_EXPIRE=7d

# Frontend (CORS)
FRONTEND_URL=http://localhost:5173

# Cloudinary (Optionnel)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## ✅ Checklist de Démarrage

- [x] MongoDB installé et démarré
- [x] Backend configuré (`.env`)
- [x] Frontend configuré
- [x] Seeders exécutés
- [x] Backend démarré (port 5000)
- [ ] Frontend démarré (port 5173)
- [ ] Test de connexion réussi

---

## 🔍 Résolution de Problèmes

### Le backend ne démarre pas
- Vérifiez que MongoDB est lancé
- Vérifiez le port 5000 est libre
- Vérifiez le fichier `.env`

### Erreur de connexion MongoDB
```bash
# Démarrer MongoDB
mongod
# ou avec service
net start MongoDB
```

### CORS Error
- Vérifiez que `FRONTEND_URL` dans `.env` correspond au port du frontend
- Par défaut : http://localhost:5173

### Les acteurs ne s'affichent pas
```bash
# Vérifier dans MongoDB
mongosh
use uemoa_energy_platform
db.actors.find({status: "approved"}).count()
```

---

## 📞 Support

Pour toute question ou problème :
1. Vérifiez ce guide
2. Consultez les logs du backend
3. Consultez `PHASE3_COMPLETED.md` pour plus de détails
4. Consultez `ROADMAP.md` pour le plan général

---

**Dernière mise à jour** : 2025-11-21
**Version Backend** : 1.0.0
**Version Frontend** : 1.0.0
