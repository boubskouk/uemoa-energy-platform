# 🔍 Test de l'API Recherche (Search)

## 📋 Vue d'ensemble

L'API Search offre une recherche globale performante dans tous les contenus de la plateforme (acteurs, actualités, événements) avec un seul endpoint ou des endpoints spécialisés pour chaque type de contenu.

### Fonctionnalités principales :

1. **Recherche globale** - Un seul endpoint pour chercher partout
2. **Recherche par type** - Endpoints spécialisés (acteurs, news, événements)
3. **Autocomplétion** - Suggestions en temps réel
4. **Recherche par tags** - Trouver du contenu par tags/topics
5. **Tags populaires** - Liste des tags les plus utilisés
6. **Tri par pertinence** - Résultats triés par score de pertinence
7. **Filtres avancés** - Par pays, catégorie, date, type
8. **Pagination** - Support de pagination sur tous les endpoints

---

## ⚙️ Prérequis

1. Serveur lancé : `npm run dev`
2. Base de données peuplée avec des données
3. Avoir créé quelques actualités et événements pour tester

---

## 🧪 Tests à effectuer

### Test 1 : Recherche globale (tous les contenus)

**Endpoint :** `GET http://localhost:5000/api/search?q=solaire`

**Query Parameters :**
- `q` - Terme de recherche (requis, min 2 caractères)
- `type` - Type de contenu : 'actors', 'news', 'events', 'all' (défaut: 'all')
- `country` - Filtrer par pays (ID MongoDB)
- `category` - Filtrer par catégorie
- `dateFrom` - Date de début (pour événements)
- `dateTo` - Date de fin (pour événements)
- `limit` - Nombre de résultats par type (défaut: 10)
- `page` - Numéro de page (défaut: 1)

**Exemple :** `GET http://localhost:5000/api/search?q=solaire&limit=5`

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "query": "solaire",
  "actors": {
    "data": [
      {
        "_id": "...",
        "name": "SolarTech Sénégal",
        "slug": "solartech-senegal",
        "description": "Entreprise spécialisée en énergie solaire...",
        "logo": "...",
        "type": "entreprise",
        "verified": true,
        "featured": false
      }
    ],
    "total": 3
  },
  "news": {
    "data": [
      {
        "_id": "...",
        "title": {
          "fr": "Nouveau parc solaire au Sénégal",
          "en": "New solar park in Senegal"
        },
        "slug": "nouveau-parc-solaire-au-senegal",
        "excerpt": {...},
        "coverImage": "...",
        "category": "project",
        "tags": ["solaire", "sénégal"],
        "publishedAt": "2025-01-10T...",
        "featured": true,
        "views": 150
      }
    ],
    "total": 5
  },
  "events": {
    "data": [
      {
        "_id": "...",
        "title": {
          "fr": "Sommet de l'Énergie Solaire UEMOA 2025",
          "en": "UEMOA Solar Energy Summit 2025"
        },
        "slug": "sommet-energie-solaire-uemoa-2025",
        "description": {...},
        "coverImage": "...",
        "category": "conference",
        "startDate": "2025-06-15T...",
        "endDate": "2025-06-17T...",
        "status": "upcoming",
        "featured": true,
        "views": 200,
        "interestedCount": 45
      }
    ],
    "total": 2
  },
  "totalResults": 10,
  "pagination": {
    "page": 1,
    "limit": 5
  }
}
```

**✅ À vérifier :**
- Les résultats sont groupés par type (actors, news, events)
- Chaque groupe contient `data` (les résultats) et `total` (nombre total)
- Les résultats sont triés par pertinence (score textuel)
- Le `totalResults` est la somme de tous les résultats

---

### Test 2 : Recherche globale avec filtre par type

**Test 2.1 : Rechercher seulement dans les acteurs**

`GET http://localhost:5000/api/search?q=énergie&type=actors`

**Réponse attendue :**
```json
{
  "success": true,
  "query": "énergie",
  "actors": {
    "data": [...],
    "total": 5
  },
  "news": {
    "data": [],
    "total": 0
  },
  "events": {
    "data": [],
    "total": 0
  },
  "totalResults": 5,
  ...
}
```

**Test 2.2 : Rechercher seulement dans les actualités**

`GET http://localhost:5000/api/search?q=énergie&type=news`

**Test 2.3 : Rechercher seulement dans les événements**

`GET http://localhost:5000/api/search?q=énergie&type=events`

**✅ À vérifier :**
- Seul le type spécifié retourne des résultats
- Les autres types ont des tableaux vides

---

### Test 3 : Recherche avec filtres multiples

**Endpoint :** `GET http://localhost:5000/api/search?q=renouvelable&category=project&limit=20`

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "query": "renouvelable",
  "actors": {
    "data": [],
    "total": 0
  },
  "news": {
    "data": [
      {
        "_id": "...",
        "title": {...},
        "category": "project",
        ...
      }
    ],
    "total": 3
  },
  "events": {
    "data": [
      {
        "_id": "...",
        "title": {...},
        "category": "conference",
        ...
      }
    ],
    "total": 1
  },
  "totalResults": 4,
  ...
}
```

**✅ À vérifier :**
- Les résultats respectent le filtre de catégorie
- La limite de résultats est appliquée

---

### Test 4 : Recherche spécifique dans les acteurs

**Endpoint :** `GET http://localhost:5000/api/search/actors?q=solaire&verified=true`

**Query Parameters :**
- `q` - Terme de recherche (requis)
- `country` - Filtrer par pays
- `type` - Type d'acteur (entreprise, ong, etc.)
- `category` - Catégorie d'activité
- `energy` - Type d'énergie
- `verified` - Seulement les acteurs vérifiés (true/false)
- `page` - Numéro de page
- `limit` - Nombre de résultats (défaut: 20)

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "query": "solaire",
  "count": 2,
  "total": 2,
  "page": 1,
  "pages": 1,
  "data": [
    {
      "_id": "...",
      "name": "SolarTech Africa",
      "slug": "solartech-africa",
      "type": "entreprise",
      "verified": true,
      ...
    }
  ]
}
```

**✅ À vérifier :**
- Seuls les acteurs vérifiés sont retournés
- Les résultats correspondent au terme de recherche

---

### Test 5 : Recherche spécifique dans les actualités

**Endpoint :** `GET http://localhost:5000/api/search/news?q=innovation&category=innovation&featured=true`

**Query Parameters :**
- `q` - Terme de recherche (requis)
- `category` - Catégorie d'actualité
- `country` - Pays lié
- `featured` - Seulement les actualités en vedette (true/false)
- `page` - Numéro de page
- `limit` - Nombre de résultats (défaut: 20)

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "query": "innovation",
  "count": 3,
  "total": 3,
  "page": 1,
  "pages": 1,
  "data": [
    {
      "_id": "...",
      "title": {...},
      "category": "innovation",
      "featured": true,
      ...
    }
  ]
}
```

---

### Test 6 : Recherche spécifique dans les événements

**Endpoint :** `GET http://localhost:5000/api/search/events?q=sommet&upcoming=true&category=conference`

**Query Parameters :**
- `q` - Terme de recherche (requis)
- `category` - Catégorie d'événement
- `country` - Pays de l'événement
- `locationType` - Type de localisation (physical, online, hybrid)
- `upcoming` - Seulement les événements à venir (true/false)
- `dateFrom` - Date de début
- `dateTo` - Date de fin
- `page` - Numéro de page
- `limit` - Nombre de résultats (défaut: 20)

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "query": "sommet",
  "count": 1,
  "total": 1,
  "page": 1,
  "pages": 1,
  "data": [
    {
      "_id": "...",
      "title": {...},
      "category": "conference",
      "status": "upcoming",
      "startDate": "2025-06-15T...",
      ...
    }
  ]
}
```

**✅ À vérifier :**
- Seuls les événements à venir sont retournés
- Les événements correspondent à la catégorie

---

### Test 7 : Autocomplétion (Suggestions)

**Endpoint :** `GET http://localhost:5000/api/search/suggestions?q=sol&limit=5`

**Query Parameters :**
- `q` - Début du terme de recherche (min 2 caractères)
- `limit` - Nombre de suggestions par type (défaut: 5)

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "query": "sol",
  "suggestions": {
    "actors": [
      {
        "text": "SolarTech Sénégal",
        "slug": "solartech-senegal",
        "type": "actor",
        "subtype": "entreprise"
      },
      {
        "text": "Solaire Africa",
        "slug": "solaire-africa",
        "type": "actor",
        "subtype": "startup"
      }
    ],
    "news": [
      {
        "text": "Nouveau parc solaire au Mali",
        "slug": "nouveau-parc-solaire-au-mali",
        "type": "news"
      }
    ],
    "events": [
      {
        "text": "Sommet de l'Énergie Solaire UEMOA 2025",
        "slug": "sommet-energie-solaire-uemoa-2025",
        "type": "event",
        "date": "2025-06-15T..."
      }
    ]
  }
}
```

**✅ À vérifier :**
- Les suggestions commencent par le terme recherché
- Limité à 5 suggestions par type
- Chaque suggestion contient texte, slug et type
- Rapide pour l'autocomplétion

---

### Test 8 : Recherche par tag

**Endpoint :** `GET http://localhost:5000/api/search/tags?tag=solaire&limit=10`

**Query Parameters :**
- `tag` - Tag à rechercher (requis)
- `limit` - Nombre de résultats (défaut: 20)
- `page` - Numéro de page

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "tag": "solaire",
  "news": {
    "data": [
      {
        "_id": "...",
        "title": {...},
        "tags": ["solaire", "sénégal", "énergie verte"],
        ...
      }
    ],
    "total": 5
  },
  "events": {
    "data": [
      {
        "_id": "...",
        "title": {...},
        "topics": ["énergie solaire", "innovation"],
        ...
      }
    ],
    "total": 2
  },
  "totalResults": 7,
  "pagination": {
    "page": 1,
    "limit": 10
  }
}
```

**✅ À vérifier :**
- Les actualités contiennent le tag dans leur tableau de tags
- Les événements contiennent le tag dans leurs topics
- Les résultats sont triés (news par date, events par date de début)

---

### Test 9 : Récupérer les tags populaires

**Endpoint :** `GET http://localhost:5000/api/search/popular-tags?limit=20`

**Query Parameters :**
- `limit` - Nombre de tags à retourner (défaut: 20)

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "tag": "solaire",
      "count": 12
    },
    {
      "tag": "énergie verte",
      "count": 8
    },
    {
      "tag": "innovation",
      "count": 7
    },
    {
      "tag": "investissement",
      "count": 5
    },
    {
      "tag": "sénégal",
      "count": 4
    }
  ]
}
```

**✅ À vérifier :**
- Les tags sont triés par popularité (count décroissant)
- Le count représente le nombre d'utilisations du tag
- Les tags proviennent des actualités et événements
- Utile pour créer un nuage de tags

---

### Test 10 : Recherche avec terme trop court

**Endpoint :** `GET http://localhost:5000/api/search?q=s`

**Réponse attendue (400 Bad Request) :**
```json
{
  "success": false,
  "message": "Veuillez fournir au moins 2 caractères pour la recherche"
}
```

**✅ À vérifier :**
- Erreur 400 si le terme a moins de 2 caractères
- Message d'erreur clair

---

### Test 11 : Recherche sans paramètre

**Endpoint :** `GET http://localhost:5000/api/search`

**Réponse attendue (400 Bad Request) :**
```json
{
  "success": false,
  "message": "Veuillez fournir au moins 2 caractères pour la recherche"
}
```

---

### Test 12 : Pagination de la recherche

**Test 12.1 : Page 1**

`GET http://localhost:5000/api/search/actors?q=energie&page=1&limit=5`

**Test 12.2 : Page 2**

`GET http://localhost:5000/api/search/actors?q=energie&page=2&limit=5`

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "query": "energie",
  "count": 5,
  "total": 12,
  "page": 2,
  "pages": 3,
  "data": [...]
}
```

**✅ À vérifier :**
- La page 2 contient des résultats différents de la page 1
- Le nombre total de pages est correct (total / limit)
- Le champ `pages` indique le nombre total de pages

---

### Test 13 : Recherche avec filtres de date (événements)

**Endpoint :** `GET http://localhost:5000/api/search/events?q=sommet&dateFrom=2025-06-01&dateTo=2025-12-31`

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "query": "sommet",
  "count": 2,
  "total": 2,
  "data": [
    {
      "_id": "...",
      "title": {...},
      "startDate": "2025-06-15T...",
      ...
    },
    {
      "_id": "...",
      "title": {...},
      "startDate": "2025-09-20T...",
      ...
    }
  ]
}
```

**✅ À vérifier :**
- Seuls les événements dans la plage de dates sont retournés
- Les dates sont correctement filtrées

---

### Test 14 : Recherche avec accents et casse

**Test 14.1 : Avec accents**

`GET http://localhost:5000/api/search?q=énergie`

**Test 14.2 : Sans accents**

`GET http://localhost:5000/api/search?q=energie`

**Test 14.3 : Majuscules**

`GET http://localhost:5000/api/search?q=ENERGIE`

**Test 14.4 : Minuscules**

`GET http://localhost:5000/api/search?q=energie`

**✅ À vérifier :**
- Les résultats sont similaires (MongoDB full-text search est insensible à la casse)
- La recherche fonctionne avec ou sans accents

---

## 📊 Routes disponibles

### Routes de recherche

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/search` | Recherche globale (tous contenus) |
| GET | `/api/search/actors` | Recherche dans acteurs uniquement |
| GET | `/api/search/news` | Recherche dans actualités uniquement |
| GET | `/api/search/events` | Recherche dans événements uniquement |
| GET | `/api/search/suggestions` | Autocomplétion pour barre de recherche |
| GET | `/api/search/tags` | Recherche par tag/topic |
| GET | `/api/search/popular-tags` | Tags les plus populaires |

---

## 🎯 Paramètres de recherche

### Recherche globale (`/api/search`)

| Paramètre | Type | Description | Défaut |
|-----------|------|-------------|--------|
| `q` | string | Terme de recherche (min 2 caractères) | - (requis) |
| `type` | string | Type : 'actors', 'news', 'events', 'all' | 'all' |
| `country` | string | ID MongoDB du pays | - |
| `category` | string | Catégorie | - |
| `dateFrom` | date | Date de début (ISO 8601) | - |
| `dateTo` | date | Date de fin (ISO 8601) | - |
| `limit` | number | Résultats par type | 10 |
| `page` | number | Numéro de page | 1 |

### Recherche acteurs (`/api/search/actors`)

| Paramètre | Type | Description |
|-----------|------|-------------|
| `q` | string | Terme de recherche (requis) |
| `country` | string | ID pays |
| `type` | string | Type d'acteur |
| `category` | string | Catégorie d'activité |
| `energy` | string | Type d'énergie |
| `verified` | boolean | Acteurs vérifiés |
| `page` | number | Numéro de page |
| `limit` | number | Résultats (défaut: 20) |

### Recherche actualités (`/api/search/news`)

| Paramètre | Type | Description |
|-----------|------|-------------|
| `q` | string | Terme de recherche (requis) |
| `category` | string | Catégorie |
| `country` | string | Pays lié |
| `featured` | boolean | Actualités en vedette |
| `page` | number | Numéro de page |
| `limit` | number | Résultats (défaut: 20) |

### Recherche événements (`/api/search/events`)

| Paramètre | Type | Description |
|-----------|------|-------------|
| `q` | string | Terme de recherche (requis) |
| `category` | string | Catégorie |
| `country` | string | Pays |
| `locationType` | string | physical, online, hybrid |
| `upcoming` | boolean | Événements à venir |
| `dateFrom` | date | Date de début |
| `dateTo` | date | Date de fin |
| `page` | number | Numéro de page |
| `limit` | number | Résultats (défaut: 20) |

---

## ⚡ Optimisations et performances

### Index MongoDB utilisés

La recherche utilise les index full-text définis dans les modèles :

**Actor.js :**
```javascript
actorSchema.index({ name: 'text', description: 'text', ... });
```

**News.js :**
```javascript
newsSchema.index({ 'title.fr': 'text', 'title.en': 'text', 'content.fr': 'text', ... });
```

**Event.js :**
```javascript
eventSchema.index({ 'title.fr': 'text', 'title.en': 'text', ... });
```

### Score de pertinence

Les résultats sont triés par score de pertinence MongoDB :
```javascript
.find(filter, { score: { $meta: 'textScore' } })
.sort({ score: { $meta: 'textScore' } })
```

---

## 🐛 Erreurs courantes

### 400 - Terme de recherche trop court

```json
{
  "success": false,
  "message": "Veuillez fournir au moins 2 caractères pour la recherche"
}
```

**Solution :** Fournir au moins 2 caractères dans le paramètre `q`

### 400 - Paramètre manquant

```json
{
  "success": false,
  "message": "Veuillez fournir au moins 2 caractères pour la recherche"
}
```

**Solution :** Ajouter le paramètre `q` à la requête

---

## ✅ Checklist de test

- [ ] Recherche globale avec résultats dans tous les types
- [ ] Recherche filtrée par type (actors, news, events)
- [ ] Recherche avec filtres multiples (catégorie, pays)
- [ ] Recherche spécifique dans acteurs
- [ ] Recherche spécifique dans actualités
- [ ] Recherche spécifique dans événements
- [ ] Autocomplétion / suggestions
- [ ] Recherche par tag
- [ ] Récupération des tags populaires
- [ ] Validation du minimum 2 caractères
- [ ] Pagination sur tous les endpoints
- [ ] Filtres de date pour événements
- [ ] Recherche insensible à la casse
- [ ] Tri par pertinence

---

## 💡 Cas d'usage

### 1. Barre de recherche globale

Utiliser `/api/search?q=...` pour une recherche globale dans tous les contenus.

### 2. Autocomplétion

Utiliser `/api/search/suggestions?q=...` pour afficher des suggestions en temps réel pendant la frappe.

### 3. Recherche avancée par type

Utiliser les endpoints spécialisés (`/actors`, `/news`, `/events`) pour des recherches ciblées avec filtres avancés.

### 4. Nuage de tags

Utiliser `/api/search/popular-tags` pour créer un nuage de tags interactif.

### 5. Recherche par tag

Utiliser `/api/search/tags?tag=...` pour afficher tout le contenu lié à un tag spécifique.

---

## 🎉 Prochaines étapes

Une fois l'API Search validée, vous pouvez :

1. **Implémentation frontend** - Interface de recherche avec React/Vue
2. **Historique de recherche** - Sauvegarder les recherches des utilisateurs
3. **Recherche avancée avec ElasticSearch** - Pour de meilleures performances
4. **Filtres facettés** - Affichage des filtres avec compteurs
5. **Export des résultats** - Export CSV/PDF des résultats de recherche

---

**🎉 Félicitations ! L'API de Recherche est opérationnelle !**
