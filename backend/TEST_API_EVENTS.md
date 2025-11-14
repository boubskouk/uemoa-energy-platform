# 📅 Test de l'API Événements (Events)

## 📋 Vue d'ensemble

L'API Events permet de gérer les événements de la plateforme UEMOA Energy Platform avec support multilingue (français/anglais), géolocalisation, système d'inscription, et gestion automatique des statuts.

### Fonctionnalités principales :

1. **CRUD complet** - Créer, lire, modifier, supprimer des événements
2. **Gestion automatique des statuts** - À venir → En cours → Passé
3. **Géolocalisation** - Événements physiques, en ligne, ou hybrides
4. **Système d'inscription** - Lien d'inscription, limite de participants
5. **Multilingue** - Support français et anglais
6. **Relations** - Liens avec acteurs, pays, organisateurs
7. **Statistiques** - Vues, intérêt, stats par catégorie
8. **Recherche avancée** - Par catégorie, pays, date, proximité géographique

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

### Test 2 : Créer un événement

**Endpoint :** `POST http://localhost:5000/api/events`

**Headers :**
```
Authorization: Bearer <TOKEN_ADMIN>
Content-Type: application/json
```

**Body (JSON) :**
```json
{
  "title": {
    "fr": "Sommet de l'Énergie Solaire UEMOA 2025",
    "en": "UEMOA Solar Energy Summit 2025"
  },
  "description": {
    "fr": "Le Sommet de l'Énergie Solaire UEMOA 2025 réunira les principaux acteurs du secteur des énergies renouvelables de la région. Au programme : conférences, ateliers pratiques, exposition de technologies innovantes, et sessions de networking. Cet événement majeur vise à accélérer la transition énergétique dans la zone UEMOA.",
    "en": "The UEMOA Solar Energy Summit 2025 will bring together key renewable energy stakeholders from the region. The program includes conferences, practical workshops, innovative technology exhibition, and networking sessions. This major event aims to accelerate the energy transition in the UEMOA zone."
  },
  "startDate": "2025-06-15T09:00:00.000Z",
  "endDate": "2025-06-17T18:00:00.000Z",
  "location": {
    "type": "physical",
    "venue": "Centre International de Conférences de Dakar",
    "address": "Route de l'Aéroport",
    "city": "Dakar",
    "coordinates": {
      "type": "Point",
      "coordinates": [-17.4676, 14.7167]
    }
  },
  "organizer": {
    "name": "Commission UEMOA",
    "contact": "contact@uemoa.int"
  },
  "category": "conference",
  "topics": ["énergie solaire", "transition énergétique", "innovation", "investissement"],
  "registrationRequired": true,
  "registrationLink": "https://summit-uemoa.org/register",
  "maxParticipants": 500,
  "registrationDeadline": "2025-06-01T23:59:59.000Z",
  "featured": false
}
```

**Réponse attendue (201 Created) :**
```json
{
  "success": true,
  "message": "Événement créé avec succès",
  "data": {
    "_id": "...",
    "title": {
      "fr": "Sommet de l'Énergie Solaire UEMOA 2025",
      "en": "UEMOA Solar Energy Summit 2025"
    },
    "slug": "sommet-de-l-energie-solaire-uemoa-2025",
    "status": "upcoming",
    "featured": false,
    "views": 0,
    "interestedCount": 0,
    "createdBy": {...},
    "createdAt": "2025-01-14T...",
    ...
  }
}
```

**✅ À vérifier :**
- L'événement est créé avec le statut "upcoming" (car la date est dans le futur)
- Un slug unique est généré automatiquement
- Le créateur est l'utilisateur connecté (admin)
- Les coordonnées GPS sont bien enregistrées

**⚠️ Important :** Copiez l'`_id` de l'événement pour les tests suivants !

---

### Test 3 : Récupérer tous les événements

**Endpoint :** `GET http://localhost:5000/api/events`

**Query Parameters (optionnels) :**
- `page=1` - Numéro de page
- `limit=20` - Nombre de résultats par page
- `category=conference` - Filtrer par catégorie
- `featured=true` - Seulement les événements en vedette
- `upcoming=true` - Seulement les événements à venir
- `past=true` - Seulement les événements passés
- `country=<COUNTRY_ID>` - Filtrer par pays
- `locationType=physical` - Type de localisation
- `search=solaire` - Recherche textuelle
- `sortBy=startDate` - Tri (défaut: date de début)

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
        "fr": "Sommet de l'Énergie Solaire UEMOA 2025",
        "en": "UEMOA Solar Energy Summit 2025"
      },
      "slug": "sommet-de-l-energie-solaire-uemoa-2025",
      "status": "upcoming",
      ...
    }
  ]
}
```

---

### Test 4 : Récupérer un événement par ID ou slug

**Endpoint 1 (par ID) :** `GET http://localhost:5000/api/events/<EVENT_ID>`

**Endpoint 2 (par slug) :** `GET http://localhost:5000/api/events/sommet-de-l-energie-solaire-uemoa-2025`

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": {
      "fr": "Sommet de l'Énergie Solaire UEMOA 2025",
      "en": "UEMOA Solar Energy Summit 2025"
    },
    "slug": "sommet-de-l-energie-solaire-uemoa-2025",
    "description": {...},
    "startDate": "2025-06-15T09:00:00.000Z",
    "endDate": "2025-06-17T18:00:00.000Z",
    "location": {
      "type": "physical",
      "venue": "Centre International de Conférences de Dakar",
      ...
    },
    "views": 0,
    "interestedCount": 0,
    ...
  }
}
```

---

### Test 5 : Récupérer les événements à venir

**Endpoint :** `GET http://localhost:5000/api/events/upcoming?limit=10`

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "title": {...},
      "startDate": "2025-06-15T09:00:00.000Z",
      "status": "upcoming",
      ...
    }
  ]
}
```

**✅ À vérifier :**
- Seuls les événements avec `startDate >= aujourd'hui` sont retournés
- Triés par date de début croissante
- Les événements annulés sont exclus

---

### Test 6 : Incrémenter les vues

**Endpoint :** `POST http://localhost:5000/api/events/<EVENT_ID>/view`

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

### Test 7 : Marquer son intérêt

**Endpoint :** `POST http://localhost:5000/api/events/<EVENT_ID>/interested`

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "message": "Intérêt enregistré",
  "interestedCount": 1
}
```

**✅ À vérifier :**
- Le compteur d'intérêt est incrémenté
- Peut être appelé plusieurs fois

---

### Test 8 : Mettre en vedette un événement

**Endpoint :** `PUT http://localhost:5000/api/events/<EVENT_ID>/feature`

**Headers :**
```
Authorization: Bearer <TOKEN_ADMIN>
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "message": "Événement mis en vedette avec succès",
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

### Test 9 : Récupérer les événements en vedette

**Endpoint :** `GET http://localhost:5000/api/events/featured?limit=5`

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

---

### Test 10 : Mettre à jour un événement

**Endpoint :** `PUT http://localhost:5000/api/events/<EVENT_ID>`

**Headers :**
```
Authorization: Bearer <TOKEN_ADMIN>
Content-Type: application/json
```

**Body (JSON) :**
```json
{
  "title": {
    "fr": "Grand Sommet de l'Énergie Solaire UEMOA 2025",
    "en": "Grand UEMOA Solar Energy Summit 2025"
  },
  "maxParticipants": 600,
  "topics": ["énergie solaire", "transition énergétique", "innovation", "investissement", "partenariats"]
}
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "message": "Événement mis à jour avec succès",
  "data": {
    "_id": "...",
    "title": {
      "fr": "Grand Sommet de l'Énergie Solaire UEMOA 2025",
      "en": "Grand UEMOA Solar Energy Summit 2025"
    },
    "slug": "grand-sommet-de-l-energie-solaire-uemoa-2025",
    "maxParticipants": 600,
    "topics": ["énergie solaire", "transition énergétique", "innovation", "investissement", "partenariats"],
    ...
  }
}
```

**✅ À vérifier :**
- Le titre est mis à jour
- Le slug est régénéré automatiquement
- Les autres champs non modifiés restent inchangés

---

### Test 11 : Créer un événement en ligne

**Endpoint :** `POST http://localhost:5000/api/events`

**Headers :**
```
Authorization: Bearer <TOKEN_ADMIN>
Content-Type: application/json
```

**Body (JSON) :**
```json
{
  "title": {
    "fr": "Webinaire : Financement des projets d'énergie renouvelable",
    "en": "Webinar: Financing Renewable Energy Projects"
  },
  "description": {
    "fr": "Ce webinaire gratuit explore les différentes options de financement disponibles pour les projets d'énergie renouvelable dans la zone UEMOA. Experts financiers et porteurs de projets partageront leurs expériences et meilleures pratiques.",
    "en": "This free webinar explores the various financing options available for renewable energy projects in the UEMOA zone. Financial experts and project developers will share their experiences and best practices."
  },
  "startDate": "2025-02-20T14:00:00.000Z",
  "endDate": "2025-02-20T16:00:00.000Z",
  "location": {
    "type": "online",
    "onlineLink": "https://zoom.us/j/123456789"
  },
  "organizer": {
    "name": "UEMOA Energy Platform",
    "contact": "webinars@uemoa-energy.org"
  },
  "category": "webinar",
  "topics": ["financement", "investissement", "projets renouvelables"],
  "registrationRequired": true,
  "registrationLink": "https://events.uemoa-energy.org/webinar-financement",
  "maxParticipants": 200,
  "registrationDeadline": "2025-02-19T23:59:59.000Z"
}
```

**Réponse attendue (201 Created) :**
```json
{
  "success": true,
  "message": "Événement créé avec succès",
  "data": {
    "_id": "...",
    "title": {...},
    "location": {
      "type": "online",
      "onlineLink": "https://zoom.us/j/123456789"
    },
    ...
  }
}
```

---

### Test 12 : Récupérer les événements par pays

Pour ce test, vous devez d'abord récupérer l'ID d'un pays :

**Étape 1 :** `GET http://localhost:5000/api/countries`

Copiez l'ID d'un pays (par exemple, Sénégal).

**Étape 2 :** `GET http://localhost:5000/api/events/country/<COUNTRY_ID>?upcoming=true`

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "title": {...},
      "location": {
        "country": {
          "_id": "...",
          "name": "Sénégal",
          "code": "SN"
        }
      },
      ...
    }
  ]
}
```

---

### Test 13 : Recherche d'événements à proximité (géolocalisation)

**Endpoint :** `GET http://localhost:5000/api/events/nearby`

**Query Parameters :**
- `longitude=-17.4676` - Longitude (Dakar)
- `latitude=14.7167` - Latitude (Dakar)
- `maxDistance=50000` - Distance maximale en mètres (50km par défaut)
- `limit=20` - Nombre de résultats

**Exemple :** `GET http://localhost:5000/api/events/nearby?longitude=-17.4676&latitude=14.7167&maxDistance=100000`

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "title": {...},
      "location": {
        "venue": "Centre International de Conférences de Dakar",
        "coordinates": {
          "type": "Point",
          "coordinates": [-17.4676, 14.7167]
        }
      },
      ...
    }
  ]
}
```

**✅ À vérifier :**
- Les événements sont triés par distance
- Seuls les événements dans le rayon spécifié sont retournés

---

### Test 14 : Statistiques des événements (Admin)

**Endpoint :** `GET http://localhost:5000/api/events/stats`

**Headers :**
```
Authorization: Bearer <TOKEN_ADMIN>
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "data": {
    "total": 2,
    "upcoming": 2,
    "ongoing": 0,
    "past": 0,
    "cancelled": 0,
    "byCategory": [
      {
        "_id": "conference",
        "count": 1
      },
      {
        "_id": "webinar",
        "count": 1
      }
    ],
    "byLocationType": [
      {
        "_id": "physical",
        "count": 1
      },
      {
        "_id": "online",
        "count": 1
      }
    ],
    "mostViewed": [...],
    "mostPopular": [...]
  }
}
```

---

### Test 15 : Annuler un événement

**Endpoint :** `PUT http://localhost:5000/api/events/<EVENT_ID>/cancel`

**Headers :**
```
Authorization: Bearer <TOKEN_ADMIN>
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "message": "Événement annulé avec succès",
  "data": {
    "_id": "...",
    "status": "cancelled",
    ...
  }
}
```

**✅ À vérifier :**
- Le statut passe à "cancelled"
- L'événement n'apparaît plus dans les listes d'événements à venir

---

### Test 16 : Récupérer les événements en cours

**Note :** Pour ce test, vous devrez créer un événement avec des dates incluant la date actuelle.

**Endpoint :** `GET http://localhost:5000/api/events/ongoing`

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

**✅ À vérifier :**
- Seuls les événements avec `startDate <= maintenant <= endDate` sont retournés

---

### Test 17 : Supprimer un événement

**Endpoint :** `DELETE http://localhost:5000/api/events/<EVENT_ID>`

**Headers :**
```
Authorization: Bearer <TOKEN_ADMIN>
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "message": "Événement supprimé avec succès"
}
```

**✅ À vérifier :**
- L'événement est supprimé de la base de données
- Un GET sur cet ID retourne une erreur 404

---

## 📊 Routes disponibles

### Routes publiques

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/events` | Liste des événements (avec filtres) |
| GET | `/api/events/upcoming` | Événements à venir |
| GET | `/api/events/featured` | Événements en vedette |
| GET | `/api/events/ongoing` | Événements en cours |
| GET | `/api/events/nearby` | Événements à proximité (géolocalisation) |
| GET | `/api/events/country/:countryId` | Événements par pays |
| GET | `/api/events/:identifier` | Détail d'un événement (par ID ou slug) |
| POST | `/api/events/:id/view` | Incrémenter les vues |
| POST | `/api/events/:id/interested` | Marquer son intérêt |

### Routes privées (Admin ou créateur)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/events/stats` | Statistiques des événements (Admin) |
| POST | `/api/events` | Créer un événement (Admin) |
| PUT | `/api/events/:id` | Mettre à jour un événement |
| DELETE | `/api/events/:id` | Supprimer un événement |
| PUT | `/api/events/:id/feature` | Toggle mise en vedette (Admin) |
| PUT | `/api/events/:id/cancel` | Annuler un événement |

---

## 🎯 Catégories disponibles

- `conference` - Conférence
- `workshop` - Atelier
- `webinar` - Webinaire
- `fair` - Salon / Foire
- `training` - Formation

---

## 🎯 Types de localisation

- `physical` - Événement physique (avec lieu et coordonnées)
- `online` - Événement en ligne (avec lien de visioconférence)
- `hybrid` - Événement hybride (physique + en ligne)

---

## 🎯 Statuts d'événements (automatiques)

- `upcoming` - À venir (avant la date de début)
- `ongoing` - En cours (entre date de début et de fin)
- `past` - Passé (après la date de fin)
- `cancelled` - Annulé (manuellement par admin/créateur)

**Note :** Les statuts sont mis à jour automatiquement à chaque sauvegarde en fonction des dates.

---

## 🐛 Erreurs courantes

### 400 - Erreur de validation

```json
{
  "success": false,
  "message": "Erreur de validation",
  "errors": [
    "Le titre en français est requis",
    "La date de début est requise",
    "La date de fin doit être postérieure à la date de début"
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
  "message": "Non autorisé à modifier cet événement"
}
```

### 404 - Non trouvé

```json
{
  "success": false,
  "message": "Événement non trouvé"
}
```

---

## ✅ Checklist de test

- [ ] Connexion admin réussie
- [ ] Création d'un événement physique
- [ ] Création d'un événement en ligne
- [ ] Récupération de tous les événements
- [ ] Récupération par ID et par slug
- [ ] Filtrage des événements à venir
- [ ] Incrémentation des vues
- [ ] Marquage d'intérêt
- [ ] Mise en vedette
- [ ] Récupération des événements en vedette
- [ ] Mise à jour d'un événement
- [ ] Filtres (catégorie, pays, date)
- [ ] Recherche géolocalisée (nearby)
- [ ] Statistiques admin
- [ ] Annulation d'un événement
- [ ] Suppression

---

## 🎉 Prochaines étapes

Une fois l'API Events validée, vous pouvez :

1. **Système de recherche avancée** - Recherche multi-critères combinée (acteurs + news + events)
2. **Dashboard admin complet** - Statistiques globales et KPIs
3. **Système de notifications** - Alertes email pour nouveaux événements
4. **Inscription aux événements** - Système de gestion des participants
5. **Calendrier interactif** - Vue calendrier des événements
6. **Export de données** - Export CSV/PDF des événements

---

**🎉 Félicitations ! L'API Événements est opérationnelle !**
