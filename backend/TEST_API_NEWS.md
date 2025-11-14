# 📰 Test de l'API Actualités (News)

## 📋 Vue d'ensemble

L'API News permet de gérer les actualités de la plateforme UEMOA Energy Platform avec support multilingue (français/anglais), système de publication, catégorisation, et statistiques.

### Fonctionnalités principales :

1. **CRUD complet** - Créer, lire, modifier, supprimer des actualités
2. **Système de publication** - Brouillon → Publié → Archivé
3. **Mise en avant** - Actualités à la une (featured)
4. **Multilingue** - Support français et anglais
5. **Relations** - Liens avec acteurs et pays
6. **Statistiques** - Vues, stats par catégorie, actualités populaires
7. **Recherche et filtres** - Par catégorie, pays, acteur, statut

---

## ⚙️ Prérequis

1. Serveur lancé : `npm run dev`
2. Base de données peuplée : `npm run seed`
3. Compte admin créé : `npm run seed:admin`

**Identifiants admin :**
- Email: `admin@uemoa-energy.org`
- Mot de passe: `Admin@2025!`

---

## 🧪 Tests à effectuer

### Test 1 : Connexion Admin

**Endpoint :** `POST http://localhost:5000/api/auth/login`

**Body (JSON) :**
```json
{
  "email": "admin@uemoa-energy.org",
  "password": "Admin@2025!"
}
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "message": "Connexion réussie !",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "email": "admin@uemoa-energy.org",
    "role": "admin"
  }
}
```

**⚠️ Important :** Copiez le token JWT pour les prochaines requêtes !

---

### Test 2 : Créer une actualité

**Endpoint :** `POST http://localhost:5000/api/news`

**Headers :**
```
Authorization: Bearer <TOKEN_ADMIN>
Content-Type: application/json
```

**Body (JSON) :**
```json
{
  "title": {
    "fr": "Lancement d'un nouveau parc solaire au Sénégal",
    "en": "Launch of a new solar park in Senegal"
  },
  "content": {
    "fr": "Un nouveau parc solaire de 50 MW vient d'être inauguré près de Dakar. Cette installation permettra d'alimenter plus de 100,000 foyers en électricité verte et représente un investissement de 75 millions d'euros. Le projet a été développé en partenariat avec plusieurs acteurs locaux et internationaux.",
    "en": "A new 50 MW solar park has just been inaugurated near Dakar. This installation will power more than 100,000 households with green electricity and represents an investment of 75 million euros. The project was developed in partnership with several local and international actors."
  },
  "excerpt": {
    "fr": "Un parc solaire de 50 MW inauguré près de Dakar pour alimenter 100,000 foyers.",
    "en": "A 50 MW solar park inaugurated near Dakar to power 100,000 households."
  },
  "category": "project",
  "tags": ["solaire", "sénégal", "énergie verte", "parc solaire"],
  "status": "draft",
  "featured": false
}
```

**Réponse attendue (201 Created) :**
```json
{
  "success": true,
  "message": "Actualité créée avec succès",
  "data": {
    "_id": "...",
    "title": {
      "fr": "Lancement d'un nouveau parc solaire au Sénégal",
      "en": "Launch of a new solar park in Senegal"
    },
    "slug": "lancement-d-un-nouveau-parc-solaire-au-senegal",
    "status": "draft",
    "featured": false,
    "views": 0,
    "author": {...},
    "createdAt": "2025-01-14T...",
    ...
  }
}
```

**✅ À vérifier :**
- L'actualité est créée avec le statut "draft"
- Un slug unique est généré automatiquement
- L'auteur est l'utilisateur connecté (admin)

**⚠️ Important :** Copiez l'`_id` de l'actualité pour les tests suivants !

---

### Test 3 : Récupérer toutes les actualités (Public)

**Endpoint :** `GET http://localhost:5000/api/news`

**Query Parameters (optionnels) :**
- `page=1` - Numéro de page
- `limit=20` - Nombre de résultats par page
- `category=project` - Filtrer par catégorie
- `featured=true` - Seulement les actualités en vedette
- `search=solaire` - Recherche textuelle
- `sortBy=-publishedAt` - Tri (défaut: date de publication décroissante)

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "count": 0,
  "total": 0,
  "page": 1,
  "pages": 0,
  "data": []
}
```

**✅ À vérifier :**
- Aucune actualité n'est visible car notre actualité est en "draft"
- Seules les actualités publiées sont visibles en public

---

### Test 4 : Publier une actualité

**Endpoint :** `PUT http://localhost:5000/api/news/<NEWS_ID>/publish`

**Headers :**
```
Authorization: Bearer <TOKEN_ADMIN>
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "message": "Actualité publiée avec succès",
  "data": {
    "_id": "...",
    "status": "published",
    "publishedAt": "2025-01-14T...",
    ...
  }
}
```

**✅ À vérifier :**
- Le statut passe à "published"
- La date de publication est automatiquement ajoutée

---

### Test 5 : Récupérer toutes les actualités après publication

**Endpoint :** `GET http://localhost:5000/api/news`

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "page": 1,
  "pages": 1,
  "data": [
    {
      "_id": "...",
      "title": {
        "fr": "Lancement d'un nouveau parc solaire au Sénégal",
        "en": "Launch of a new solar park in Senegal"
      },
      "slug": "lancement-d-un-nouveau-parc-solaire-au-senegal",
      "status": "published",
      ...
    }
  ]
}
```

**✅ À vérifier :**
- L'actualité publiée est maintenant visible en public

---

### Test 6 : Récupérer une actualité par ID ou slug

**Endpoint 1 (par ID) :** `GET http://localhost:5000/api/news/<NEWS_ID>`

**Endpoint 2 (par slug) :** `GET http://localhost:5000/api/news/lancement-d-un-nouveau-parc-solaire-au-senegal`

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": {
      "fr": "Lancement d'un nouveau parc solaire au Sénégal",
      "en": "Launch of a new solar park in Senegal"
    },
    "slug": "lancement-d-un-nouveau-parc-solaire-au-senegal",
    "content": {...},
    "views": 0,
    ...
  }
}
```

**✅ À vérifier :**
- Les deux endpoints (ID et slug) fonctionnent
- Toutes les informations de l'actualité sont présentes

---

### Test 7 : Incrémenter les vues

**Endpoint :** `POST http://localhost:5000/api/news/<NEWS_ID>/view`

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "views": 1
}
```

**✅ À vérifier :**
- Le compteur de vues est incrémenté
- Appeler plusieurs fois pour voir l'incrémentation

---

### Test 8 : Mettre en avant une actualité

**Endpoint :** `PUT http://localhost:5000/api/news/<NEWS_ID>/feature`

**Headers :**
```
Authorization: Bearer <TOKEN_ADMIN>
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "message": "Actualité mise en avant avec succès",
  "data": {
    "_id": "...",
    "featured": true,
    ...
  }
}
```

**✅ À vérifier :**
- Le champ `featured` passe à `true`
- Rappeler l'endpoint pour toggle (passer à `false`)

---

### Test 9 : Récupérer les actualités à la une

**Endpoint :** `GET http://localhost:5000/api/news/featured?limit=5`

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "title": {...},
      "featured": true,
      ...
    }
  ]
}
```

**✅ À vérifier :**
- Seules les actualités avec `featured: true` sont retournées

---

### Test 10 : Mettre à jour une actualité

**Endpoint :** `PUT http://localhost:5000/api/news/<NEWS_ID>`

**Headers :**
```
Authorization: Bearer <TOKEN_ADMIN>
Content-Type: application/json
```

**Body (JSON) :**
```json
{
  "title": {
    "fr": "Inauguration d'un parc solaire de 50 MW au Sénégal",
    "en": "Inauguration of a 50 MW solar park in Senegal"
  },
  "tags": ["solaire", "sénégal", "énergie verte", "parc solaire", "inauguration"]
}
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "message": "Actualité mise à jour avec succès",
  "data": {
    "_id": "...",
    "title": {
      "fr": "Inauguration d'un parc solaire de 50 MW au Sénégal",
      "en": "Inauguration of a 50 MW solar park in Senegal"
    },
    "slug": "inauguration-d-un-parc-solaire-de-50-mw-au-senegal",
    "tags": ["solaire", "sénégal", "énergie verte", "parc solaire", "inauguration"],
    ...
  }
}
```

**✅ À vérifier :**
- Le titre est mis à jour
- Le slug est régénéré automatiquement
- Les autres champs non modifiés restent inchangés

---

### Test 11 : Statistiques des actualités (Admin)

**Endpoint :** `GET http://localhost:5000/api/news/stats`

**Headers :**
```
Authorization: Bearer <TOKEN_ADMIN>
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "data": {
    "total": 1,
    "published": 1,
    "draft": 0,
    "archived": 0,
    "byCategory": [
      {
        "_id": "project",
        "count": 1
      }
    ],
    "mostViewed": [
      {
        "_id": "...",
        "title": {...},
        "slug": "...",
        "views": 1,
        "publishedAt": "..."
      }
    ]
  }
}
```

**✅ À vérifier :**
- Les statistiques globales sont correctes
- La répartition par catégorie est affichée
- Les actualités les plus vues sont listées

---

### Test 12 : Filtres avancés

**Test 12.1 : Filtrer par catégorie**

`GET http://localhost:5000/api/news?category=project`

**Test 12.2 : Recherche textuelle**

`GET http://localhost:5000/api/news?search=solaire`

**Test 12.3 : Actualités publiées seulement**

`GET http://localhost:5000/api/news?status=published`

**Test 12.4 : Pagination**

`GET http://localhost:5000/api/news?page=1&limit=10`

**✅ À vérifier :**
- Chaque filtre retourne les résultats appropriés
- La pagination fonctionne correctement

---

### Test 13 : Dépublier une actualité

**Endpoint :** `PUT http://localhost:5000/api/news/<NEWS_ID>/unpublish`

**Headers :**
```
Authorization: Bearer <TOKEN_ADMIN>
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "message": "Actualité dépubliée avec succès",
  "data": {
    "_id": "...",
    "status": "draft",
    ...
  }
}
```

**✅ À vérifier :**
- Le statut repasse à "draft"
- L'actualité n'est plus visible en public

---

### Test 14 : Supprimer une actualité

**Endpoint :** `DELETE http://localhost:5000/api/news/<NEWS_ID>`

**Headers :**
```
Authorization: Bearer <TOKEN_ADMIN>
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "message": "Actualité supprimée avec succès"
}
```

**✅ À vérifier :**
- L'actualité est supprimée de la base de données
- Un GET sur cet ID retourne une erreur 404

---

## 📊 Routes disponibles

### Routes publiques

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/news` | Liste des actualités (publiées uniquement) |
| GET | `/api/news/featured` | Actualités à la une |
| GET | `/api/news/:identifier` | Détail d'une actualité (par ID ou slug) |
| POST | `/api/news/:id/view` | Incrémenter les vues |

### Routes privées (Admin)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/news/stats` | Statistiques des actualités |
| POST | `/api/news` | Créer une actualité |
| PUT | `/api/news/:id` | Mettre à jour une actualité |
| DELETE | `/api/news/:id` | Supprimer une actualité |
| PUT | `/api/news/:id/publish` | Publier une actualité |
| PUT | `/api/news/:id/unpublish` | Dépublier une actualité |
| PUT | `/api/news/:id/feature` | Toggle mise en avant |

---

## 🎯 Catégories disponibles

- `announcement` - Annonce
- `project` - Projet
- `event` - Événement
- `innovation` - Innovation
- `policy` - Politique

---

## 🎯 Statuts de publication

- `draft` - Brouillon (visible admin seulement)
- `published` - Publié (visible par tous)
- `archived` - Archivé (visible admin seulement)

---

## 🐛 Erreurs courantes

### 400 - Erreur de validation

```json
{
  "success": false,
  "message": "Erreur de validation",
  "errors": [
    "Le titre en français est requis",
    "Le contenu doit contenir au moins 50 caractères"
  ]
}
```

### 401 - Non authentifié

```json
{
  "success": false,
  "message": "Aucun token fourni. Accès refusé."
}
```

### 403 - Non autorisé

```json
{
  "success": false,
  "message": "Non autorisé à modifier cette actualité"
}
```

### 404 - Non trouvé

```json
{
  "success": false,
  "message": "Actualité non trouvée"
}
```

---

## ✅ Checklist de test

- [ ] Connexion admin réussie
- [ ] Création d'une actualité en brouillon
- [ ] Vérification que le brouillon n'est pas visible en public
- [ ] Publication de l'actualité
- [ ] Vérification que l'actualité publiée est visible
- [ ] Récupération par ID et par slug
- [ ] Incrémentation des vues
- [ ] Mise en avant (featured)
- [ ] Récupération des actualités à la une
- [ ] Mise à jour de l'actualité
- [ ] Filtres (catégorie, recherche, pagination)
- [ ] Statistiques admin
- [ ] Dépublication
- [ ] Suppression

---

## 🎉 Prochaines étapes

Une fois l'API News validée, vous pouvez :

1. **Implémenter l'API Events** - Gestion des événements
2. **Ajouter la recherche avancée** - Recherche multi-critères
3. **Créer un dashboard admin** - Statistiques et KPIs
4. **Ajouter l'upload d'images** - Pour les couvertures et galeries
5. **Implémenter les notifications** - Alertes email pour nouvelles actualités

---

**🎉 Félicitations ! L'API Actualités est opérationnelle !**
