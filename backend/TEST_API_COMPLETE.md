# 🧪 Tests de l'API Complète - UEMOA Energy Platform

## ✅ API Créée avec Succès !

Vous avez maintenant accès à **5 modules API** :

1. 🔐 **Authentification** (`/api/auth`)
2. 👥 **Acteurs** (`/api/actors`)
3. 🌍 **Pays** (`/api/countries`)
4. 📂 **Catégories** (`/api/categories`)
5. ⚡ **Énergies** (`/api/energies`)

---

## 📊 Vue d'ensemble des Routes

### Total : **29 routes disponibles**

| Module | Routes | Authentification |
|--------|--------|------------------|
| Auth | 6 | Public/Private |
| Actors | 11 | Public/Private/Admin |
| Countries | 3 | Public |
| Categories | 2 | Public |
| Energies | 2 | Public |

---

## 🌍 1. API PAYS (Countries)

### GET /api/countries
Récupérer tous les pays UEMOA

```bash
curl http://localhost:5000/api/countries
```

**Réponse attendue** :
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "_id": "...",
      "name": {
        "fr": "Bénin",
        "en": "Benin"
      },
      "code": "BJ",
      "capital": "Porto-Novo",
      "flag": "🇧🇯",
      "actorsCount": 0
    },
    // ... 7 autres pays
  ]
}
```

### GET /api/countries/:id
Récupérer un pays spécifique

### GET /api/countries/:id/actors
Récupérer tous les acteurs d'un pays

---

## 📂 2. API CATÉGORIES (Categories)

### GET /api/categories
Récupérer toutes les catégories d'activités

```bash
curl http://localhost:5000/api/categories
```

**Réponse attendue** :
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "_id": "...",
      "name": {
        "fr": "Production d'énergie",
        "en": "Energy Production"
      },
      "slug": "production-energie",
      "icon": "⚡",
      "color": "#F59E0B"
    },
    // ... 7 autres catégories
  ]
}
```

### GET /api/categories/:id
Récupérer une catégorie spécifique

---

## ⚡ 3. API ÉNERGIES (Energies)

### GET /api/energies
Récupérer tous les types d'énergies renouvelables

```bash
curl http://localhost:5000/api/energies
```

**Réponse attendue** :
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "_id": "...",
      "name": {
        "fr": "Solaire photovoltaïque",
        "en": "Solar Photovoltaic"
      },
      "slug": "solaire-photovoltaique",
      "icon": "☀️",
      "color": "#F59E0B"
    },
    // ... 7 autres énergies
  ]
}
```

### GET /api/energies/:id
Récupérer un type d'énergie spécifique

---

## 👥 4. API ACTEURS (Actors)

### Routes Publiques

#### GET /api/actors
Récupérer tous les acteurs (avec filtres)

**Query Parameters** :
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre d'acteurs par page (défaut: 20)
- `country` : Filtrer par pays (ID)
- `type` : Filtrer par type (entreprise, ong, etc.)
- `category` : Filtrer par catégorie (ID)
- `energy` : Filtrer par type d'énergie (ID)
- `search` : Recherche textuelle
- `featured` : Acteurs en vedette (true/false)
- `verified` : Acteurs vérifiés (true/false)

**Exemples** :
```bash
# Tous les acteurs (approuvés uniquement)
curl http://localhost:5000/api/actors

# Acteurs du Sénégal
curl http://localhost:5000/api/actors?country=COUNTRY_ID

# Acteurs de type entreprise
curl http://localhost:5000/api/actors?type=entreprise

# Recherche textuelle
curl http://localhost:5000/api/actors?search=solaire

# Pagination
curl http://localhost:5000/api/actors?page=2&limit=10
```

**Réponse** :
```json
{
  "success": true,
  "count": 20,
  "total": 156,
  "page": 1,
  "pages": 8,
  "data": [...]
}
```

#### GET /api/actors/:id
Récupérer un acteur spécifique

```bash
curl http://localhost:5000/api/actors/ACTOR_ID
```

---

### Routes Privées (Authentification requise)

#### POST /api/actors
Créer un nouvel acteur

**Headers** :
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Body** :
```json
{
  "name": "Solaire SARL",
  "type": "entreprise",
  "country": "SENEGAL_ID",
  "description": {
    "fr": "Entreprise spécialisée dans l'installation de panneaux solaires photovoltaïques pour les particuliers et entreprises.",
    "en": "Company specialized in solar panel installation for individuals and businesses."
  },
  "categories": ["CATEGORY_ID_1", "CATEGORY_ID_2"],
  "energyTypes": ["SOLAR_ID"],
  "city": "Dakar",
  "address": "Rue 10, Plateau",
  "contact": {
    "email": "contact@solaire-sarl.com",
    "phone": "+221 77 123 45 67",
    "website": "https://solaire-sarl.com"
  },
  "yearFounded": 2018,
  "employeesCount": "11-50"
}
```

**Réponse (visitor)** :
```json
{
  "success": true,
  "message": "Acteur créé avec succès. En attente d'approbation par l'administrateur.",
  "data": {
    "_id": "...",
    "name": "Solaire SARL",
    "status": "pending",
    ...
  }
}
```

**Réponse (admin)** :
```json
{
  "success": true,
  "message": "Acteur créé et approuvé avec succès.",
  "data": {
    "_id": "...",
    "status": "approved",
    ...
  }
}
```

#### GET /api/actors/me
Récupérer mon profil d'acteur

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/actors/me
```

#### PUT /api/actors/:id
Mettre à jour un acteur (owner ou admin)

#### DELETE /api/actors/:id
Supprimer un acteur (owner ou admin)

---

### Routes Admin Uniquement

#### GET /api/actors/pending
Récupérer les acteurs en attente d'approbation

```bash
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  http://localhost:5000/api/actors/pending
```

#### PATCH /api/actors/:id/approve
Approuver un acteur

```bash
curl -X PATCH \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  http://localhost:5000/api/actors/ACTOR_ID/approve
```

**Effet** :
- Status passe de `pending` à `approved`
- `verified` passe à `true`
- Rôle de l'utilisateur créateur passe de `visitor` à `actor`

#### PATCH /api/actors/:id/reject
Rejeter un acteur

```bash
curl -X PATCH \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Informations incomplètes"}' \
  http://localhost:5000/api/actors/ACTOR_ID/reject
```

#### PATCH /api/actors/:id/feature
Mettre en vedette / retirer de la vedette

```bash
curl -X PATCH \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  http://localhost:5000/api/actors/ACTOR_ID/feature
```

---

## 🎯 Scénarios de Test Complets

### Scénario 1 : Inscription et Création de Profil Acteur

```bash
# 1. S'inscrire
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean@solaire-sarl.com",
    "password": "password123",
    "profile": {
      "firstName": "Jean",
      "lastName": "Dupont"
    }
  }'

# 2. Se connecter
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean@solaire-sarl.com",
    "password": "password123"
  }'
# → Copier le token

# 3. Récupérer les pays
curl http://localhost:5000/api/countries
# → Copier l'ID du Sénégal

# 4. Récupérer les catégories
curl http://localhost:5000/api/categories
# → Copier l'ID de "Production d'énergie"

# 5. Récupérer les énergies
curl http://localhost:5000/api/energies
# → Copier l'ID de "Solaire photovoltaïque"

# 6. Créer le profil acteur
curl -X POST http://localhost:5000/api/actors \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Solaire SARL",
    "type": "entreprise",
    "country": "SENEGAL_ID",
    "description": {
      "fr": "Entreprise spécialisée dans l installation et la maintenance de systèmes solaires photovoltaïques pour particuliers et entreprises au Sénégal."
    },
    "categories": ["PRODUCTION_ID"],
    "energyTypes": ["SOLAR_ID"],
    "city": "Dakar",
    "contact": {
      "email": "contact@solaire-sarl.com",
      "phone": "+221 77 123 45 67"
    }
  }'
# → Status: pending
```

### Scénario 2 : Approbation Admin

```bash
# 1. Se connecter en tant qu'admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@uemoa-energy.org",
    "password": "Admin@2025!"
  }'
# → Copier le token admin

# 2. Voir les acteurs en attente
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  http://localhost:5000/api/actors/pending

# 3. Approuver l'acteur
curl -X PATCH \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  http://localhost:5000/api/actors/ACTOR_ID/approve
```

### Scénario 3 : Consultation Publique

```bash
# 1. Liste des acteurs
curl http://localhost:5000/api/actors

# 2. Acteurs du Sénégal
curl http://localhost:5000/api/countries/SENEGAL_ID/actors

# 3. Recherche
curl http://localhost:5000/api/actors?search=solaire

# 4. Détail d'un acteur
curl http://localhost:5000/api/actors/ACTOR_ID
```

---

## 🔧 Tests avec Postman/Thunder Client

### Collection Postman

Créez les requêtes suivantes dans Postman :

**1. Environment Variables**
- `base_url` = `http://localhost:5000/api`
- `token` = (vide initialement)
- `admin_token` = (vide initialement)

**2. Authentification**
- POST Login → Sauvegarder le token
- POST Register

**3. Référentiels**
- GET Countries
- GET Categories
- GET Energies

**4. Acteurs**
- GET All Actors
- GET Actor by ID
- POST Create Actor (avec token)
- PUT Update Actor (avec token)
- GET My Actor (avec token)
- GET Pending Actors (avec admin_token)
- PATCH Approve Actor (avec admin_token)

---

## ✅ Checklist de Test

### Authentification
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Token JWT est retourné
- [ ] Route protégée refuse sans token
- [ ] Route protégée accepte avec token valide

### Référentiels
- [ ] 8 pays sont retournés
- [ ] 8 catégories sont retournées
- [ ] 8 énergies sont retournées

### Acteurs
- [ ] Création d'acteur (visitor) → status pending
- [ ] Création d'acteur (admin) → status approved
- [ ] Liste des acteurs affiche uniquement les approuvés (public)
- [ ] Admin peut voir les acteurs pending
- [ ] Approbation change le statut et le rôle utilisateur
- [ ] Filtres fonctionnent (pays, type, catégorie, énergie)
- [ ] Pagination fonctionne
- [ ] Recherche textuelle fonctionne

---

## 🚀 Redémarrer le Backend

**IMPORTANT** : Redémarrez le backend pour prendre en compte les nouvelles routes :

```bash
# Dans le terminal backend
# Appuyez sur Ctrl+C
# Puis :
npm run dev
```

---

## 📖 Documentation

Consultez également :
- `TEST_API_AUTH.md` pour les détails sur l'authentification
- `DATABASE_SCHEMA.md` pour comprendre la structure des données

---

**Toutes les APIs sont prêtes ! 🎉**

Testez-les et dites-moi si tout fonctionne !
