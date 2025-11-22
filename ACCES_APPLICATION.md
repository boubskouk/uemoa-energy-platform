# 🌐 Accès à l'Application UEMOA Energy Platform

## ✅ Statut des Services

### Backend ✅ EN LIGNE
- **URL** : http://localhost:5000
- **Status** : Serveur démarré et opérationnel
- **Base de données** : Connectée (uemoa_energy_platform)

### Frontend ✅ EN LIGNE
- **URL** : http://localhost:5173
- **Status** : Serveur Vite démarré
- **Version** : Vite 4.5.14

---

## 🔗 Comment Accéder à l'Application

### 1. Ouvrir le Frontend dans votre Navigateur

```
http://localhost:5173
```

**ou** cliquer sur ce lien si vous êtes sur Windows :
- Ouvrir une fenêtre de navigateur
- Taper `localhost:5173` dans la barre d'adresse
- Appuyer sur Entrée

### 2. Vous devriez voir la Page d'Accueil

La page d'accueil contient :
- 🎯 **Hero Section** : Titre principal et barre de recherche
- 📊 **Statistiques** : Nombre d'acteurs, pays, projets
- ⚡ **Types d'énergies** : Solaire, éolien, hydraulique, etc.
- 🌍 **Acteurs en vedette** : Les 3 meilleurs acteurs
- 📰 **Actualités récentes**

---

## 🔍 Si la Page ne S'affiche Pas

### Vérification 1 : Le serveur frontend fonctionne-t-il ?
Dans le terminal où vous avez lancé `npm run dev`, vous devriez voir :
```
VITE v4.5.14  ready in 2224 ms
➜  Local:   http://localhost:5173/
```

### Vérification 2 : Erreur de navigateur
Ouvrez la **Console Développeur** de votre navigateur :
- Chrome/Edge : F12 ou Ctrl+Shift+I
- Firefox : F12 ou Ctrl+Shift+K

Cherchez les erreurs en rouge dans l'onglet "Console"

### Vérification 3 : Vider le cache
- Faire Ctrl+F5 (recharge forcée)
- Ou Ctrl+Shift+R

### Vérification 4 : Essayer un autre navigateur
- Chrome
- Firefox
- Edge

---

## 🎨 Pages Disponibles

### Pages Publiques
1. **Accueil** : http://localhost:5173/
   - Hero section avec recherche
   - Statistiques
   - Acteurs en vedette

2. **Liste des Acteurs** : http://localhost:5173/actors
   - Tous les acteurs approuvés (9 acteurs)
   - Filtres par pays, type, énergie
   - Barre de recherche

3. **Détail d'un Acteur** : http://localhost:5173/actors/:id
   - Informations complètes
   - Projets et réalisations
   - Coordonnées

4. **Actualités** : http://localhost:5173/news
   - 6 actualités publiées
   - Filtres et recherche

5. **Événements** : http://localhost:5173/events
   - 5 événements à venir
   - Calendrier

6. **Recherche** : http://localhost:5173/search
   - Recherche globale

### Pages d'Authentification
7. **Connexion** : http://localhost:5173/login
   - Email : admin@uemoa-energy.org
   - Mot de passe : Admin@123456

8. **Inscription** : http://localhost:5173/register

### Pages Admin (après connexion)
9. **Dashboard Admin** : http://localhost:5173/admin
   - Vue d'ensemble
   - Statistiques

10. **Gestion Actualités** : http://localhost:5173/admin/news

11. **Gestion Événements** : http://localhost:5173/admin/events

---

## 🌍 Site Bilingue (FR/EN)

Le site est **bilingue** : **Français** et **Anglais**

### Changer de Langue

Un composant `LanguageSwitcher` devrait être présent dans le Header :
- 🇫🇷 **Français** (par défaut)
- 🇬🇧 **English**

La langue est sauvegardée dans le localStorage et s'applique à :
- Interface utilisateur
- Contenu dynamique (actualités, événements)
- Descriptions des acteurs

### Données Bilingues

Tous les contenus sont stockés en FR et EN :
```json
{
  "description": {
    "fr": "Description en français",
    "en": "English description"
  }
}
```

---

## 🔐 Se Connecter en tant qu'Admin

### Étape 1 : Aller sur la page de connexion
```
http://localhost:5173/login
```

### Étape 2 : Utiliser les identifiants admin
- **Email** : `admin@uemoa-energy.org`
- **Mot de passe** : `Admin@123456`

### Étape 3 : Accéder au dashboard
Après connexion, vous serez redirigé vers :
```
http://localhost:5173/admin
```

### Fonctionnalités Admin
- ✅ Approuver/Rejeter des acteurs
- ✅ Créer/Modifier des actualités
- ✅ Créer/Modifier des événements
- ✅ Gérer les catégories
- ✅ Gérer les types d'énergie
- ✅ Voir les statistiques complètes

---

## 📊 Données Disponibles

### 10 Acteurs de Test
- **9 approuvés** (visibles publiquement)
- **1 en attente** (visible uniquement en admin)

Répartis sur les **8 pays UEMOA** :
- 🇸🇳 Sénégal : SolarTech, Fonds UEMOA
- 🇧🇫 Burkina Faso : EcoWind
- 🇨🇮 Côte d'Ivoire : Université, Solar Academy
- 🇹🇬 Togo : HydroTogo
- 🇲🇱 Mali : BioMasse Mali
- 🇳🇪 Niger : Green Energy Consultants
- 🇧🇯 Bénin : GreenTech Manufacturing
- 🇬🇼 Guinée-Bissau : Centre de Recherche

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
- ☀️ Solaire photovoltaïque
- 🌡️ Solaire thermique
- 💨 Éolien
- 💧 Hydraulique
- 🌾 Biomasse
- ♻️ Biogaz
- 🌋 Géothermie
- ⚡ Hydrogène vert

### 6 Actualités Publiées
- Articles avec images
- Statut "published"
- Visibles sur la page /news

### 5 Événements à Venir
- Conférences, workshops, webinaires
- Dates futures
- Visibles sur la page /events

---

## 🛠️ Résolution de Problèmes

### Le Frontend ne Charge Pas

#### Problème : Page blanche
**Solution** :
1. Vérifier la console du navigateur (F12)
2. Vérifier que le backend est bien démarré
3. Vider le cache : Ctrl+F5

#### Problème : Erreur 404
**Solution** :
- Vérifier l'URL : doit être `http://localhost:5173`
- Vérifier que Vite est démarré

#### Problème : CORS Error
**Solution** :
- Vérifier que le backend `.env` a `FRONTEND_URL=http://localhost:5173`
- Redémarrer le backend après modification

### Les Données ne S'affichent Pas

#### Problème : Aucun acteur visible
**Solution** :
1. Vérifier que le backend est connecté
2. Tester l'API : http://localhost:5000/api/actors
3. Vérifier que les seeders ont été exécutés

#### Problème : Statistiques à 0
**Solution** :
```bash
cd backend
npm run seed:actors
npm run seed:categories
npm run seed:energies
```

### Problème de Connexion Admin

#### Erreur : "Email ou mot de passe incorrect"
**Vérifier** :
- Email : `admin@uemoa-energy.org` (avec @)
- Mot de passe : `Admin@123456` (sensible à la casse)

#### Créer un nouveau compte admin
```bash
cd backend
npm run seed:admin
```

---

## 📱 Fonctionnalités Prêtes

### ✅ Fonctionnel
- Navigation entre les pages
- Affichage de la liste des acteurs
- Détails des acteurs
- Actualités et événements
- Recherche
- Authentification
- Dashboard admin
- Changement de langue FR/EN

### 🚧 En Développement
- Carte interactive (Leaflet)
- Statistiques graphiques
- Upload d'images
- Formulaires complets de création/édition
- Filtres avancés

---

## 🎯 Points d'Entrée Recommandés

1. **Commencer par l'Accueil** : http://localhost:5173
2. **Voir les Acteurs** : http://localhost:5173/actors
3. **Se Connecter en Admin** : http://localhost:5173/login
4. **Explorer le Dashboard** : http://localhost:5173/admin

---

## 📞 Besoin d'Aide ?

Si vous rencontrez des problèmes :
1. Vérifier les logs du terminal (backend et frontend)
2. Vérifier la console du navigateur (F12)
3. Consulter `CONNEXION_GUIDE.md` pour plus de détails
4. Tester les endpoints API directement

---

## 🎉 Bon à Savoir

- 🌍 **Site multilingue** (FR/EN)
- 📱 **Responsive** (desktop, tablet, mobile)
- 🔒 **Sécurisé** (JWT, CORS, validation)
- ⚡ **Rapide** (Vite + Vue 3)
- 🎨 **Moderne** (Tailwind CSS)
- 📊 **Données réelles** de test

---

**Dernière mise à jour** : 2025-11-21
**Frontend** : http://localhost:5173 ✅ EN LIGNE
**Backend** : http://localhost:5000 ✅ EN LIGNE
