# ⚡ Guide de Déploiement Rapide sur Render

## 🎯 Résumé : 3 Services à Déployer

1. **MongoDB Atlas** (Base de données) - Gratuit
2. **Render Backend** (API Node.js) - Gratuit
3. **Render Frontend** (Site Vue.js) - Gratuit

**Temps total** : 30-45 minutes

---

## ✅ CHECKLIST RAPIDE

### Avant de Commencer
- [ ] Compte GitHub créé
- [ ] Code pushé sur GitHub
- [ ] Compte Render.com créé
- [ ] Compte MongoDB Atlas créé

---

## 🚀 ÉTAPES RAPIDES

### 1️⃣ MongoDB Atlas (10 min)

```
1. Aller sur https://mongodb.com/cloud/atlas
2. Créer compte → "Try Free"
3. Créer cluster M0 (gratuit) → Region: Paris/Frankfurt
4. Database Access → Add User:
   - Username: uemoa_admin
   - Password: [GÉNÉRER ET NOTER]
5. Network Access → Add IP: 0.0.0.0/0 (Allow all)
6. Database → Connect → "Connect your application"
7. Copier connection string et remplacer <password>
```

**Connection String à noter :**
```
mongodb+srv://uemoa_admin:VOTRE_PASSWORD@cluster.xxxxx.mongodb.net/uemoa_energy_platform?retryWrites=true&w=majority
```

---

### 2️⃣ Pusher sur GitHub (5 min)

```bash
# Si pas encore fait
git add .
git commit -m "🚀 Préparation déploiement Render"
git remote add origin https://github.com/VOTRE_USERNAME/uemoa-energy-platform.git
git push -u origin master
```

---

### 3️⃣ Déployer Backend sur Render (10 min)

```
1. Aller sur https://render.com → Login avec GitHub
2. New + → Web Service
3. Connecter repository "uemoa-energy-platform"
4. Configuration:
   - Name: uemoa-energy-backend
   - Region: Frankfurt
   - Root Directory: backend
   - Build: npm install
   - Start: npm start
   - Instance: Free

5. Environment Variables:
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=[Copier depuis MongoDB Atlas]
   JWT_SECRET=[Générer avec: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
   JWT_EXPIRE=7d
   CORS_ORIGIN=*

6. Create Web Service → Attendre déploiement (5-10 min)
7. NOTER L'URL: https://uemoa-energy-backend-xxxx.onrender.com
```

---

### 4️⃣ Déployer Frontend sur Render (10 min)

```
1. Render Dashboard → New + → Static Site
2. Connecter repository "uemoa-energy-platform"
3. Configuration:
   - Name: uemoa-energy-frontend
   - Branch: master
   - Root Directory: frontend
   - Build: npm install && npm run build
   - Publish: dist

4. Environment Variables:
   VITE_API_URL=https://uemoa-energy-backend-xxxx.onrender.com
   VITE_APP_NAME=UEMOA Energy Platform

5. Create Static Site → Attendre (5-10 min)
6. NOTER L'URL: https://uemoa-energy-frontend-xxxx.onrender.com
```

---

### 5️⃣ Mettre à Jour CORS (3 min)

```
1. Retourner sur Backend service dans Render
2. Environment → Modifier CORS_ORIGIN
3. Remplacer * par: https://uemoa-energy-frontend-xxxx.onrender.com
4. Save → Service redémarre automatiquement
```

---

### 6️⃣ Peupler la Base de Données (5 min)

**Utiliser Postman ou votre navigateur :**

```bash
# 1. Initialiser pays
GET https://votre-backend.onrender.com/api/setup/init-countries

# 2. Initialiser énergies
GET https://votre-backend.onrender.com/api/setup/init-energies

# 3. Initialiser catégories
GET https://votre-backend.onrender.com/api/setup/init-categories

# 4. Initialiser acteurs (33 acteurs réels)
GET https://votre-backend.onrender.com/api/setup/init-actors

# 5. Vérifier
GET https://votre-backend.onrender.com/api/setup/stats
```

---

### 7️⃣ Créer Compte Admin (2 min)

**Via Postman :**
```
POST https://votre-backend.onrender.com/api/auth/register

Body (JSON):
{
  "name": "Admin UEMOA",
  "email": "admin@uemoa-energy.org",
  "password": "VotreMotDePasseSecurise123!",
  "role": "admin"
}
```

---

### 8️⃣ Tester l'Application (5 min)

```
1. Ouvrir: https://votre-frontend.onrender.com
2. Vérifier:
   ✓ Page d'accueil charge
   ✓ Répertoire affiche 33 acteurs
   ✓ Filtres fonctionnent
   ✓ Carte interactive s'affiche
   ✓ Login admin fonctionne
```

---

## 🎉 C'EST FAIT !

Votre application est en production !

**URLs de Production :**
- 🌐 **Frontend** : https://votre-frontend.onrender.com
- 🔌 **Backend API** : https://votre-backend.onrender.com
- 👨‍💼 **Admin** : https://votre-frontend.onrender.com/admin

---

## 📋 Variables d'Environnement à Configurer

### Backend (Render)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://uemoa_admin:PASSWORD@cluster.mongodb.net/uemoa_energy_platform
JWT_SECRET=[32+ caractères aléatoires]
JWT_EXPIRE=7d
CORS_ORIGIN=https://votre-frontend.onrender.com
```

### Frontend (Render)
```env
VITE_API_URL=https://votre-backend.onrender.com
VITE_APP_NAME=UEMOA Energy Platform
```

---

## 🔧 Commandes Utiles

### Générer JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Tester Backend Localement
```bash
cd backend
npm install
npm start
```

### Tester Frontend Localement
```bash
cd frontend
npm install
npm run dev
```

### Build Frontend
```bash
cd frontend
npm run build
```

---

## 🚨 Problèmes Fréquents

### Backend ne démarre pas
✓ Vérifier MONGODB_URI dans les variables d'env
✓ Vérifier les logs Render
✓ Vérifier que MongoDB Atlas autorise 0.0.0.0/0

### CORS Errors
✓ Vérifier CORS_ORIGIN = URL exacte du frontend
✓ Pas d'espace, pas de slash final
✓ HTTPS obligatoire

### Frontend ne charge pas les données
✓ Vérifier VITE_API_URL = URL exacte du backend
✓ Ouvrir Console navigateur pour voir les erreurs
✓ Vérifier que backend n'est pas en veille (plan gratuit)

### Services en veille (plan gratuit)
- Les services gratuits s'endorment après 15 min d'inactivité
- Premier chargement peut prendre 30-60 secondes
- Solution: Upgrade vers plan Starter (7€/mois) ou utiliser un service de ping

---

## 💡 Astuces

### Eviter la Mise en Veille (Gratuit)
Utiliser un service comme **UptimeRobot** pour ping votre backend toutes les 10 min:
1. Créer compte sur https://uptimerobot.com
2. Ajouter monitor: https://votre-backend.onrender.com/api/health
3. Interval: 5 minutes

### Logs en Temps Réel
```
Render Dashboard → Votre Service → Logs (onglet)
```

### Redéployer Manuellement
```
Render Dashboard → Votre Service → Manual Deploy → Deploy latest commit
```

---

## 📊 Coûts

| Service | Plan | Coût |
|---------|------|------|
| MongoDB Atlas | M0 (512 MB) | 0€ |
| Render Backend | Free (750h/mois) | 0€ |
| Render Frontend | Free (100 GB) | 0€ |
| **TOTAL** | | **0€/mois** |

### Plans Payants (Optionnel)
- Render Starter: 7€/mois par service (pas de veille)
- MongoDB M10: 9€/mois (2 GB RAM, backup auto)

---

## ✅ Checklist Finale

- [ ] MongoDB Atlas configuré
- [ ] Backend déployé sur Render
- [ ] Frontend déployé sur Render
- [ ] CORS configuré
- [ ] Base de données peuplée (33 acteurs)
- [ ] Compte admin créé
- [ ] Tests passés
- [ ] URLs notées quelque part

---

## 📞 Support

**Documentation complète** : Voir `GUIDE_DEPLOIEMENT_RENDER.md`

**Liens utiles** :
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Render Status: https://status.render.com

---

**Déploiement préparé le** : 27 Janvier 2025
**Version** : 1.0.0
