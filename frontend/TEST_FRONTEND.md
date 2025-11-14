# 🧪 GUIDE DE TEST - FRONTEND UEMOA ENERGY PLATFORM

Ce document vous guide pour tester toutes les fonctionnalités du frontend.

---

## 📋 Prérequis

### 1. Backend Démarré
```bash
cd backend
npm run dev
# ✅ Backend doit tourner sur http://localhost:5000
```

### 2. Frontend Démarré
```bash
cd frontend
npm run dev
# ✅ Frontend doit tourner sur http://localhost:5173
```

### 3. Base de Données Peuplée
```bash
cd backend
npm run seed
# ✅ Pays, catégories, énergies et admin créés
```

---

## 🏠 Test 1 : Page d'Accueil

### Accéder à la page
```
URL : http://localhost:5173
```

### ✅ Vérifications

#### A. Section Hero
- [ ] Titre affiché : "Répertoire des Acteurs des Énergies Renouvelables de l'UEMOA"
- [ ] Sous-titre visible
- [ ] Barre de recherche présente
- [ ] Boutons "Explorer les acteurs" et "Voir la carte" affichés

#### B. Section Statistiques
- [ ] 4 statistiques affichées : Acteurs, Pays, Projets, Solaire
- [ ] Nombre de pays = 8
- [ ] Autres statistiques peuvent être à 0 (normal si pas d'acteurs)

#### C. Section Pays UEMOA
- [ ] 8 cartes de pays affichées
- [ ] Chaque carte contient :
  - Drapeau du pays (emoji)
  - Nom du pays en français
  - Capitale
  - Nombre d'acteurs (badge vert)

**Liste des 8 pays à vérifier :**
1. 🇧🇯 Bénin - Porto-Novo
2. 🇧🇫 Burkina Faso - Ouagadougou
3. 🇨🇮 Côte d'Ivoire - Yamoussoukro
4. 🇬🇼 Guinée-Bissau - Bissau
5. 🇲🇱 Mali - Bamako
6. 🇳🇪 Niger - Niamey
7. 🇸🇳 Sénégal - Dakar
8. 🇹🇬 Togo - Lomé

#### D. Section Types d'Énergies
- [ ] 8 cartes d'énergies affichées
- [ ] Chaque carte contient :
  - Icône de l'énergie
  - Nom de l'énergie
  - Compteur (peut être à 0)

**Liste des 8 énergies à vérifier :**
1. ☀️ Solaire
2. 💨 Éolienne
3. 💧 Hydraulique
4. 🌿 Biomasse
5. 🌊 Marémotrice
6. 🌋 Géothermique
7. ⚡ Hybride
8. 🔋 Stockage

#### E. Message de Connexion API
- [ ] Message vert affiché : "✅ Connexion API réussie"
- [ ] Message contient : "Bienvenue sur l'API UEMOA Energy Platform"

**Si message rouge :**
```bash
# Vérifier que le backend tourne
curl http://localhost:5000/api/health

# Vérifier le fichier .env du frontend
cat frontend/.env
# Doit contenir : VITE_API_URL=http://localhost:5000/api
```

---

## 🔐 Test 2 : Authentification

### A. Page de Connexion

#### Accéder
```
URL : http://localhost:5173/login
Ou cliquer sur "Se connecter" dans le header
```

#### ✅ Vérifications Visuelles
- [ ] Formulaire de connexion affiché
- [ ] 2 champs : Email et Mot de passe
- [ ] Bouton "Se connecter"
- [ ] Lien "Pas encore de compte ? S'inscrire"

#### Test 1 : Connexion Admin
```
Email : admin@uemoa-energy.org
Mot de passe : Admin@2025!
```

**Actions :**
1. Saisir l'email
2. Saisir le mot de passe
3. Cliquer sur "Se connecter"

**Résultat attendu :**
- ✅ Redirection vers la page d'accueil
- ✅ Message de succès affiché
- ✅ Header change : "Se déconnecter" visible

**Vérification dans la Console (F12) :**
```javascript
// Ouvrir la console du navigateur (F12)
// Vérifier que le token est stocké
localStorage.getItem('token')
// Doit afficher un token JWT
```

#### Test 2 : Connexion avec Mauvais Mot de Passe
```
Email : admin@uemoa-energy.org
Mot de passe : mauvais123
```

**Résultat attendu :**
- ❌ Message d'erreur : "Email ou mot de passe incorrect"
- ❌ Pas de redirection

#### Test 3 : Connexion avec Email Inexistant
```
Email : inexistant@test.com
Mot de passe : Test123!
```

**Résultat attendu :**
- ❌ Message d'erreur affiché
- ❌ Reste sur la page de connexion

---

### B. Page d'Inscription

#### Accéder
```
URL : http://localhost:5173/register
Ou cliquer sur "S'inscrire" depuis /login
```

#### ✅ Vérifications Visuelles
- [ ] Formulaire d'inscription affiché
- [ ] Champs : Nom, Prénom, Email, Mot de passe, Confirmer mot de passe
- [ ] Bouton "S'inscrire"
- [ ] Lien "Déjà un compte ? Se connecter"

#### Test 1 : Inscription Valide
```
Prénom : Jean
Nom : Dupont
Email : jean.dupont@test.com
Mot de passe : Test@2025!
Confirmer : Test@2025!
```

**Actions :**
1. Remplir tous les champs
2. Cliquer sur "S'inscrire"

**Résultat attendu :**
- ✅ Message de succès
- ✅ Redirection vers /login
- ✅ Peut se connecter avec ces identifiants

#### Test 2 : Mots de Passe Non Identiques
```
Prénom : Marie
Nom : Martin
Email : marie.martin@test.com
Mot de passe : Test@2025!
Confirmer : Autre@2025!
```

**Résultat attendu :**
- ❌ Message d'erreur : "Les mots de passe ne correspondent pas"

#### Test 3 : Email Déjà Utilisé
```
Email : admin@uemoa-energy.org
(Autres champs valides)
```

**Résultat attendu :**
- ❌ Message d'erreur : "Cet email est déjà utilisé"

---

### C. Déconnexion

#### Test
1. Se connecter avec admin
2. Cliquer sur "Se déconnecter" dans le header

**Résultat attendu :**
- ✅ Redirection vers /login
- ✅ Header revient à "Se connecter"
- ✅ Token supprimé du localStorage

**Vérification Console :**
```javascript
localStorage.getItem('token')
// Doit retourner null
```

---

## 👥 Test 3 : Liste des Acteurs

### Accéder
```
URL : http://localhost:5173/actors
```

### Cas 1 : Aucun Acteur (État Initial)

**Résultat attendu :**
- [ ] Message : "Aucun acteur trouvé"
- [ ] Ou liste vide
- [ ] Filtres visibles sur le côté

### Cas 2 : Avec Acteurs (Après Création)

**Après avoir créé des acteurs via API, vérifier :**
- [ ] Cartes d'acteurs affichées
- [ ] Chaque carte contient :
  - Nom de l'acteur
  - Type (ONG, Entreprise, etc.)
  - Pays avec drapeau
  - Bouton "Voir détails"

---

## 🔍 Test 4 : Détail d'un Acteur

### Accéder
```
URL : http://localhost:5173/actors/:id
Ou cliquer sur "Voir détails" depuis la liste
```

### ✅ Vérifications
- [ ] Nom de l'acteur affiché
- [ ] Informations complètes :
  - Type
  - Pays
  - Catégories
  - Types d'énergies
  - Description
  - Coordonnées
- [ ] Boutons d'action (si propriétaire ou admin)

---

## 🎨 Test 5 : Responsive Design

### Test sur Mobile (Viewport 375px)
1. Ouvrir DevTools (F12)
2. Cliquer sur l'icône mobile
3. Sélectionner iPhone SE ou similaire

**Vérifications :**
- [ ] Menu hamburger visible
- [ ] Cartes empilées en 1 colonne
- [ ] Textes lisibles
- [ ] Boutons accessibles
- [ ] Pas de scroll horizontal

### Test sur Tablette (Viewport 768px)
- [ ] Cartes en 2 colonnes
- [ ] Navigation adaptée
- [ ] Images redimensionnées

### Test sur Desktop (Viewport 1920px)
- [ ] Cartes en 4 colonnes
- [ ] Layout optimal
- [ ] Tous les éléments visibles

---

## 🐛 Test 6 : Gestion des Erreurs

### Test 1 : Backend Arrêté

**Actions :**
1. Arrêter le backend (Ctrl+C dans le terminal backend)
2. Rafraîchir la page d'accueil (F5)

**Résultat attendu :**
- ❌ Message rouge : "Erreur de connexion API"
- ❌ Statistiques à 0
- ❌ Pays et énergies non chargés

### Test 2 : Mauvaise URL API

**Actions :**
1. Modifier `frontend/.env`
```env
VITE_API_URL=http://localhost:9999/api
```
2. Redémarrer le frontend
3. Ouvrir http://localhost:5173

**Résultat attendu :**
- ❌ Erreur de connexion affichée
- ❌ Impossible de charger les données

**Remettre la bonne URL :**
```env
VITE_API_URL=http://localhost:5000/api
```

---

## ⚡ Test 7 : Performance

### Test de Chargement

**Ouvrir DevTools (F12) → Network**

1. Rafraîchir la page d'accueil
2. Vérifier les requêtes :

**Requêtes attendues :**
```
GET /api/health          → 200 OK
GET /api/countries       → 200 OK
GET /api/categories      → 200 OK
GET /api/energies        → 200 OK
GET /api/actors?limit=1  → 200 OK
```

**Temps de chargement :**
- [ ] Page chargée en < 2 secondes
- [ ] Toutes les requêtes en < 500ms chacune
- [ ] Pas d'erreurs 404 ou 500

---

## 🔒 Test 8 : Sécurité

### Test 1 : Routes Protégées

**Actions :**
1. Se déconnecter
2. Essayer d'accéder à `/admin` ou `/profile` (si ces pages existent)

**Résultat attendu :**
- ✅ Redirection vers /login
- ✅ Message : "Vous devez être connecté"

### Test 2 : Token Expiré

**Actions :**
1. Se connecter
2. Dans DevTools Console :
```javascript
// Modifier le token pour le rendre invalide
localStorage.setItem('token', 'invalid-token')
```
3. Rafraîchir la page
4. Essayer d'accéder à une route protégée

**Résultat attendu :**
- ✅ Redirection vers /login
- ✅ Token supprimé

---

## 📱 Test 9 : Navigation

### Test du Router

**Parcours complet :**
1. / → Page d'accueil ✅
2. /login → Connexion ✅
3. /register → Inscription ✅
4. /actors → Liste ✅
5. /actors/:id → Détail ✅
6. /page-inexistante → 404 ✅

**Vérifications :**
- [ ] Toutes les routes fonctionnent
- [ ] Bouton "Retour" fonctionne
- [ ] URL change correctement
- [ ] Page 404 pour routes inexistantes

---

## 🎯 Test 10 : Stores Pinia

### Test dans la Console

**Ouvrir DevTools (F12) → Console**

```javascript
// Accéder aux stores (après avoir chargé la page)

// 1. Store Auth
const authStore = useAuthStore()
console.log('User:', authStore.user)
console.log('Token:', authStore.token)
console.log('IsAuthenticated:', authStore.isAuthenticated)

// 2. Store Actors
const actorsStore = useActorsStore()
console.log('Actors:', actorsStore.actors)
console.log('Pagination:', actorsStore.pagination)
console.log('Filters:', actorsStore.filters)

// 3. Store Reference
const refStore = useReferenceStore()
console.log('Countries:', refStore.countries)
console.log('Categories:', refStore.categories)
console.log('Energies:', refStore.energies)
```

**Résultats attendus :**
- ✅ Tous les stores accessibles
- ✅ Données correctement chargées
- ✅ Pas d'erreurs dans la console

---

## ✅ Checklist Finale

### Fonctionnalités de Base
- [ ] Page d'accueil affiche les 8 pays UEMOA
- [ ] Page d'accueil affiche les 8 types d'énergies
- [ ] Connexion API réussie (message vert)
- [ ] Statistiques affichées

### Authentification
- [ ] Connexion admin fonctionne
- [ ] Inscription utilisateur fonctionne
- [ ] Déconnexion fonctionne
- [ ] Validation des formulaires active
- [ ] Erreurs affichées correctement

### Navigation
- [ ] Toutes les routes accessibles
- [ ] Router fonctionne
- [ ] Page 404 affichée pour routes inexistantes

### Stores & API
- [ ] Store auth opérationnel
- [ ] Store actors opérationnel
- [ ] Store reference opérationnel
- [ ] Toutes les requêtes API réussies

### Design & UX
- [ ] Design responsive (mobile, tablette, desktop)
- [ ] Tailwind CSS appliqué
- [ ] Pas d'erreurs visuelles
- [ ] Transitions fluides

### Performance
- [ ] Chargement < 2 secondes
- [ ] Pas d'erreurs console
- [ ] Requêtes optimisées

---

## 🚨 Problèmes Courants

### Problème 1 : "Connexion API échouée"
```bash
# Solution 1 : Vérifier que le backend tourne
curl http://localhost:5000/api/health

# Solution 2 : Vérifier CORS dans backend/.env
FRONTEND_URL=http://localhost:5173

# Solution 3 : Vérifier frontend/.env
VITE_API_URL=http://localhost:5000/api

# Solution 4 : Redémarrer les deux serveurs
```

### Problème 2 : "Pays/Énergies ne s'affichent pas"
```bash
# Vérifier que le seed a été exécuté
cd backend
npm run seed

# Vérifier dans MongoDB
mongosh
> use uemoa_energy_platform
> db.countries.countDocuments()  # Doit retourner 8
> db.energies.countDocuments()   # Doit retourner 8
```

### Problème 3 : "Token non stocké"
```javascript
// Ouvrir Console (F12)
localStorage.getItem('token')

// Si null, se reconnecter
// Si présent, vérifier le store
const authStore = useAuthStore()
console.log(authStore.token)
```

### Problème 4 : "Page blanche"
```bash
# Vérifier la console pour les erreurs
# Ouvrir DevTools (F12) → Console

# Souvent causé par :
# 1. Import incorrect
# 2. Store non initialisé
# 3. Erreur de syntaxe
```

---

## 📊 Résultats Attendus

### État Actuel (75% Complet)

**✅ Fonctionnel :**
- Backend API (29 routes)
- Authentification complète
- Page d'accueil avec vraies données
- Stores Pinia
- Services API
- Routes de base

**🔨 En Développement :**
- Pages acteurs complètes
- Formulaires de création
- Dashboard admin
- Dashboard acteur

**⏳ À Faire :**
- Carte interactive
- Statistiques avancées
- Upload de fichiers
- Tests unitaires

---

## 🎓 Conseils de Test

1. **Tester dans l'ordre** : Commencer par les tests de base avant les tests avancés
2. **Vérifier la console** : Toujours avoir DevTools ouvert (F12)
3. **Tester les erreurs** : Les cas d'erreur sont aussi importants que les cas de succès
4. **Tester responsive** : Toujours vérifier sur mobile, tablette et desktop
5. **Nettoyer les données** : Réexécuter `npm run seed` si besoin de repartir à zéro

---

## 📞 Support

En cas de problème :
1. Vérifier cette documentation
2. Consulter `PROJET_COMPLET.md`
3. Vérifier les logs backend et frontend
4. Vérifier la structure de la base MongoDB

---

**Bon test ! 🚀**
