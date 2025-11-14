# Schéma de Base de Données - MongoDB

## Vue d'ensemble
Base de données NoSQL MongoDB avec 7 collections principales.

---

## 📊 Collections

### 1. **users** - Utilisateurs de la plateforme

```javascript
{
  _id: ObjectId,
  email: String, // unique, required
  password: String, // hashed with bcrypt
  role: String, // enum: ['admin', 'actor', 'visitor']

  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    profilePicture: String, // URL
  },

  // Si l'utilisateur est lié à un acteur
  actorId: ObjectId, // ref: 'actors'

  // Paramètres
  language: String, // 'fr' ou 'en'
  emailVerified: Boolean,
  emailVerificationToken: String,

  // RGPD
  consentGiven: Boolean,
  consentDate: Date,

  // Gestion de compte
  isActive: Boolean,
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  createdAt: Date,
  updatedAt: Date
}
```

**Indexes** :
- `email` (unique)
- `role`
- `actorId`

---

### 2. **actors** - Acteurs du secteur

```javascript
{
  _id: ObjectId,

  // Informations générales
  name: String, // required - Nom de la structure
  acronym: String, // Sigle/Acronyme
  logo: String, // URL du logo

  type: String, // enum: ['entreprise', 'ong', 'institution_publique', 'universite', 'recherche', 'startup', 'association']

  // Catégories et domaines
  categories: [ObjectId], // ref: 'categories' - Ex: production, distribution, recherche
  energyTypes: [ObjectId], // ref: 'energies' - Ex: solaire, éolien, hydraulique

  // Localisation
  country: ObjectId, // ref: 'countries' - required
  city: String,
  address: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number] // [longitude, latitude]
  },

  // Contact
  contact: {
    email: String,
    phone: String,
    website: String,
    socialMedia: {
      linkedin: String,
      twitter: String,
      facebook: String
    }
  },

  // Description
  description: {
    fr: String, // Description en français
    en: String  // Description en anglais
  },

  // Informations complémentaires
  yearFounded: Number,
  employeesCount: String, // enum: ['1-10', '11-50', '51-200', '201-500', '500+']
  certifications: [String], // Certifications/Labels

  // Projets et réalisations
  projects: [{
    title: String,
    description: String,
    year: Number,
    images: [String] // URLs
  }],

  // Galerie
  gallery: [String], // URLs des images

  // Documents
  documents: [{
    name: String,
    url: String,
    type: String // 'presentation', 'certificate', 'report'
  }],

  // Statistiques
  views: Number,
  contactRequests: Number,

  // Statut
  status: String, // enum: ['pending', 'approved', 'rejected', 'archived']
  verified: Boolean, // Vérifié par l'admin
  featured: Boolean, // Mis en avant

  // Gestion
  createdBy: ObjectId, // ref: 'users'
  createdAt: Date,
  updatedAt: Date,
  approvedAt: Date,
  approvedBy: ObjectId // ref: 'users'
}
```

**Indexes** :
- `country`
- `type`
- `status`
- `location` (2dsphere - pour recherche géographique)
- `name` (text search)
- `categories`, `energyTypes`

---

### 3. **categories** - Catégories d'activités

```javascript
{
  _id: ObjectId,
  name: {
    fr: String, // required
    en: String  // required
  },
  slug: String, // unique - Ex: 'production-energie'
  description: {
    fr: String,
    en: String
  },
  icon: String, // Nom de l'icône ou URL
  color: String, // Code couleur hexadécimal
  order: Number, // Ordre d'affichage
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Exemples de catégories** :
- Production d'énergie
- Distribution et réseau
- Installation et maintenance
- Recherche et développement
- Formation et éducation
- Conseil et ingénierie
- Fabrication d'équipements
- Financement de projets

**Indexes** :
- `slug` (unique)
- `isActive`

---

### 4. **energies** - Types d'énergies renouvelables

```javascript
{
  _id: ObjectId,
  name: {
    fr: String, // required
    en: String  // required
  },
  slug: String, // unique - Ex: 'solaire-photovoltaique'
  description: {
    fr: String,
    en: String
  },
  icon: String,
  color: String,
  order: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Exemples de types** :
- Solaire photovoltaïque
- Solaire thermique
- Éolien
- Hydraulique
- Biomasse
- Géothermie
- Biogaz

**Indexes** :
- `slug` (unique)
- `isActive`

---

### 5. **countries** - Pays de l'UEMOA

```javascript
{
  _id: ObjectId,
  name: {
    fr: String, // required
    en: String  // required
  },
  code: String, // ISO 3166-1 alpha-2 - Ex: 'BJ', 'BF', 'CI'
  flag: String, // URL du drapeau
  capital: String,

  // Coordonnées du centre du pays (pour carte)
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number] // [longitude, latitude]
  },

  // Statistiques
  actorsCount: Number, // Nombre d'acteurs (mis à jour automatiquement)

  order: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Les 8 pays UEMOA** :
- Bénin (BJ)
- Burkina Faso (BF)
- Côte d'Ivoire (CI)
- Guinée-Bissau (GW)
- Mali (ML)
- Niger (NE)
- Sénégal (SN)
- Togo (TG)

**Indexes** :
- `code` (unique)

---

### 6. **news** - Actualités

```javascript
{
  _id: ObjectId,

  title: {
    fr: String, // required
    en: String
  },
  slug: String, // unique

  content: {
    fr: String, // required - Contenu HTML
    en: String
  },

  excerpt: {
    fr: String, // Court résumé
    en: String
  },

  coverImage: String, // URL de l'image principale
  images: [String], // Galerie d'images

  // Catégorisation
  category: String, // 'announcement', 'project', 'event', 'innovation', 'policy'
  tags: [String],

  // Relation avec acteurs
  relatedActors: [ObjectId], // ref: 'actors'
  relatedCountries: [ObjectId], // ref: 'countries'

  // Publication
  status: String, // enum: ['draft', 'published', 'archived']
  publishedAt: Date,
  featured: Boolean, // Article mis en avant

  // Statistiques
  views: Number,

  // Auteur
  author: ObjectId, // ref: 'users'

  createdAt: Date,
  updatedAt: Date
}
```

**Indexes** :
- `slug` (unique)
- `status`
- `publishedAt`
- `category`
- `title.fr`, `title.en` (text search)

---

### 7. **events** - Événements

```javascript
{
  _id: ObjectId,

  title: {
    fr: String, // required
    en: String
  },
  slug: String, // unique

  description: {
    fr: String,
    en: String
  },

  // Date et lieu
  startDate: Date, // required
  endDate: Date,

  location: {
    type: String, // 'physical', 'online', 'hybrid'
    venue: String, // Nom du lieu
    address: String,
    city: String,
    country: ObjectId, // ref: 'countries'
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    },
    onlineLink: String // Lien visioconférence
  },

  // Médias
  coverImage: String,
  images: [String],

  // Organisation
  organizer: {
    name: String,
    contact: String,
    actorId: ObjectId // ref: 'actors'
  },

  // Catégorie
  category: String, // 'conference', 'workshop', 'webinar', 'fair', 'training'
  topics: [String], // Thématiques abordées

  // Inscription
  registrationRequired: Boolean,
  registrationLink: String,
  maxParticipants: Number,
  registrationDeadline: Date,

  // Relations
  relatedActors: [ObjectId], // ref: 'actors'

  // Publication
  status: String, // enum: ['upcoming', 'ongoing', 'past', 'cancelled']
  featured: Boolean,

  // Statistiques
  views: Number,
  interestedCount: Number,

  // Auteur
  createdBy: ObjectId, // ref: 'users'

  createdAt: Date,
  updatedAt: Date
}
```

**Indexes** :
- `slug` (unique)
- `status`
- `startDate`
- `category`
- `location.country`

---

## 🔗 Relations entre collections

```
users ──(1:1)─→ actors (si role = 'actor')
actors ──(n:m)─→ categories
actors ──(n:m)─→ energies
actors ──(n:1)─→ countries
news ──(n:m)─→ actors
news ──(n:m)─→ countries
events ──(n:m)─→ actors
events ──(n:1)─→ countries
```

---

## 📈 Collections additionnelles (optionnelles)

### 8. **contact_requests** - Demandes de contact

```javascript
{
  _id: ObjectId,
  actorId: ObjectId, // ref: 'actors'
  senderName: String,
  senderEmail: String,
  senderPhone: String,
  subject: String,
  message: String,
  status: String, // 'pending', 'read', 'replied'
  createdAt: Date
}
```

### 9. **statistics** - Statistiques générales

```javascript
{
  _id: ObjectId,
  date: Date,
  actorsByCountry: Object, // { "BJ": 45, "SN": 78, ... }
  actorsByType: Object,
  actorsByEnergy: Object,
  totalVisitors: Number,
  createdAt: Date
}
```

---

## 🛡️ Considérations de sécurité

1. **Mots de passe** : Toujours hachés avec bcrypt (salt rounds: 10)
2. **Emails** : Validés et en minuscules
3. **Données sensibles** : Jamais exposées dans les réponses API
4. **Validation** : Mongoose validators + express-validator
5. **Indexes** : Optimisation des requêtes fréquentes

---

## 📊 Migration des données

Pour l'initialisation de la base :
1. Pré-remplir la collection `countries` avec les 8 pays UEMOA
2. Pré-remplir `categories` avec les catégories de base
3. Pré-remplir `energies` avec les types d'énergies renouvelables
4. Créer un compte administrateur par défaut
