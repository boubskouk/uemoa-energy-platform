# 🎬 Slider sur la Page d'Accueil

## ✅ Slider Installé !

Un **slider (carousel) dynamique** a été ajouté à la page d'accueil avec **5 slides** présentant les différents types d'énergies renouvelables.

---

## 🎨 Caractéristiques du Slider

### Fonctionnalités
- ✅ **5 slides** avec images professionnelles
- ✅ **Navigation automatique** (7 secondes par slide)
- ✅ **Bilingue** (FR/EN) - Change automatiquement avec la langue
- ✅ **Contrôles** : Boutons Précédent/Suivant
- ✅ **Indicateurs** : Points cliquables en bas
- ✅ **Play/Pause** : Contrôle de l'autoplay
- ✅ **Responsive** : S'adapte à tous les écrans
- ✅ **Animations fluides** : Transitions élégantes
- ✅ **Boutons d'action** : Liens vers les pages pertinentes

### Design
- **Hauteur** : 400px (mobile), 500px (tablet), 600px (desktop)
- **Overlay sombre** : Pour améliorer la lisibilité du texte
- **Effets au survol** : Pause automatique quand la souris passe dessus
- **Badge coloré** : Catégorie/Type d'énergie

---

## 📊 Les 5 Slides

### Slide 1 : Présentation Générale (🌍 UEMOA)
- **Image** : Panneaux solaires dans le désert
- **Titre FR** : Répertoire des Acteurs des Énergies Renouvelables
- **Titre EN** : Directory of Renewable Energy Actors
- **Boutons** :
  - Explorer les acteurs → `/actors`
  - En savoir plus → `/about`

### Slide 2 : Énergie Solaire (☀️)
- **Image** : Installation solaire photovoltaïque
- **Titre FR** : L'Énergie Solaire en Afrique de l'Ouest
- **Titre EN** : Solar Energy in West Africa
- **Description** : 300+ jours d'ensoleillement par an
- **Bouton** : Voir les projets solaires → `/actors?energy=solaire-photovoltaique`

### Slide 3 : Énergie Éolienne (💨)
- **Image** : Parc éolien
- **Titre FR** : Le Potentiel Éolien du Sahel
- **Titre EN** : The Wind Potential of the Sahel
- **Description** : Vents constants et puissants
- **Bouton** : Découvrir les parcs éoliens → `/actors?energy=eolien`

### Slide 4 : Énergie Hydraulique (💧)
- **Image** : Barrage hydroélectrique
- **Titre FR** : Hydro-électricité : Exploiter la Force de l'Eau
- **Titre EN** : Hydroelectricity: Harnessing Water Power
- **Description** : Micro-centrales pour zones rurales
- **Bouton** : Voir les projets hydrauliques → `/actors?energy=hydraulique`

### Slide 5 : Biomasse et Biogaz (🌾)
- **Image** : Agriculture et bioénergie
- **Titre FR** : Biomasse et Biogaz : Valoriser les Déchets
- **Titre EN** : Biomass and Biogas: Valorizing Waste
- **Description** : Transformer résidus agricoles en énergie
- **Bouton** : Explorer les solutions biomasse → `/actors?energy=biomasse`

---

## 🎮 Contrôles du Slider

### Navigation Manuelle
- **Flèche Gauche** ← : Slide précédent
- **Flèche Droite** → : Slide suivant
- **Indicateurs (points)** : Cliquer pour aller directement à un slide

### Lecture Automatique
- **Bouton Play/Pause** : En bas à droite
- **Délai** : 7 secondes entre chaque slide
- **Auto-pause** : Se met en pause au survol de la souris

---

## 🌐 Support Multilingue

Le slider s'adapte automatiquement à la langue sélectionnée :

**Français (FR)** :
```
Titre : "Répertoire des Acteurs des Énergies Renouvelables"
Bouton : "Explorer les acteurs"
```

**English (EN)** :
```
Title: "Directory of Renewable Energy Actors"
Button: "Explore actors"
```

---

## 🎨 Personnalisation

### Modifier les Images
Les images viennent d'Unsplash. Pour les remplacer :

1. Ouvrir `frontend/src/views/Home.vue`
2. Trouver la section `heroSlides`
3. Modifier l'URL de l'image :

```javascript
{
  image: 'https://images.unsplash.com/photo-XXXXXX?w=1920&q=80',
  // ...
}
```

### Ajouter un Nouveau Slide
Dans `frontend/src/views/Home.vue`, ajouter un objet au tableau `heroSlides` :

```javascript
{
  image: 'URL_DE_VOTRE_IMAGE',
  badge: '⚡ Nouveau',
  title: {
    fr: 'Titre en français',
    en: 'Title in English'
  },
  description: {
    fr: 'Description en français',
    en: 'Description in English'
  },
  primaryButton: {
    text: { fr: 'Texte bouton FR', en: 'Button text EN' },
    link: '/votre-lien'
  }
}
```

### Modifier le Délai d'Autoplay
Dans `frontend/src/views/Home.vue`, ligne 4 :

```vue
<Slider :slides="heroSlides" :autoplay-delay="7000" />
```

Changer `7000` (millisecondes) :
- 5000 = 5 secondes
- 10000 = 10 secondes

### Désactiver l'Autoplay
```vue
<Slider :slides="heroSlides" :autoplay-delay="0" />
```

---

## 📱 Responsive Design

Le slider s'adapte automatiquement :

### Mobile (< 768px)
- Hauteur : 400px
- Texte plus petit (4xl)
- Boutons empilés verticalement

### Tablet (768px - 1024px)
- Hauteur : 500px
- Texte moyen (5xl)

### Desktop (> 1024px)
- Hauteur : 600px
- Texte grand (6xl)
- Pleine largeur

---

## 🎨 Animations

### Transitions des Slides
- **Effet** : Glissement horizontal (slide)
- **Durée** : 0.6 secondes
- **Type** : ease

### Animations du Contenu
- **Titre** : Slide up (monte de bas en haut)
- **Description** : Slide up avec délai 0.2s
- **Boutons** : Slide up avec délai 0.4s

---

## 🔧 Fichiers Modifiés

### Nouveaux Fichiers
1. **`frontend/src/components/common/Slider.vue`**
   - Composant réutilisable du slider
   - 300+ lignes
   - Gère toute la logique

### Fichiers Modifiés
2. **`frontend/src/views/Home.vue`**
   - Import du composant Slider
   - Données des 5 slides
   - Remplacement de l'ancienne hero section

---

## ✨ Avantages

### Pour les Utilisateurs
- ✅ **Visuel attractif** : Premières impressions importantes
- ✅ **Contenu riche** : 5 thématiques présentées
- ✅ **Navigation intuitive** : Boutons clairs et accessibles
- ✅ **Multilingue** : Accessible aux francophones et anglophones

### Pour les Administrateurs
- ✅ **Facile à modifier** : Un seul fichier à éditer
- ✅ **Réutilisable** : Composant utilisable ailleurs
- ✅ **Extensible** : Ajouter/supprimer des slides facilement
- ✅ **Professionnel** : Design moderne et soigné

---

## 🚀 Voir le Résultat

1. **Ouvrir le frontend** : http://localhost:5173
2. **Observer le slider** en haut de la page d'accueil
3. **Tester les contrôles** :
   - Cliquer sur les flèches
   - Cliquer sur les indicateurs
   - Passer la souris dessus (pause)
4. **Changer de langue** : Le contenu s'adapte instantanément

---

## 📸 Captures d'Écran (À venir)

Le slider affiche :
- Grande image de fond
- Overlay sombre semi-transparent
- Badge coloré en haut
- Titre en gros (blanc)
- Description (blanc, légèrement transparent)
- Boutons d'action (vert UEMOA)
- Contrôles en bas (blancs, semi-transparents)

---

## 🎯 Prochaines Améliorations Possibles

### Court Terme
- [ ] Ajouter des images locales stockées dans le projet
- [ ] Intégrer des données dynamiques depuis l'API
- [ ] Ajouter des statistiques en temps réel

### Moyen Terme
- [ ] Support du swipe tactile (mobile)
- [ ] Mode plein écran
- [ ] Préchargement des images

### Long Terme
- [ ] Slider d'actualités en temps réel
- [ ] Vidéos en background
- [ ] Effets parallax

---

## 🔍 Résolution de Problèmes

### Les images ne s'affichent pas
**Cause** : Connexion Internet ou URLs Unsplash
**Solution** : Vérifier la connexion ou remplacer par des images locales

### Les transitions sont saccadées
**Cause** : Performance du navigateur
**Solution** : Désactiver temporairement les animations ou réduire le nombre de slides

### Le texte n'est pas lisible
**Cause** : Image de fond trop claire
**Solution** : Augmenter l'opacité de l'overlay dans `Slider.vue` (ligne ~17) :
```vue
<div class="absolute inset-0 bg-black/60"></div>
```

---

## 📝 Code Source

**Composant** : `frontend/src/components/common/Slider.vue`
**Utilisation** : `frontend/src/views/Home.vue`
**Lignes** : ~300 lignes de code Vue 3 + Tailwind CSS

---

**Dernière mise à jour** : 2025-11-21
**Statut** : ✅ Fonctionnel et Testé
**Compatibilité** : Vue 3 + Vite + Tailwind CSS
