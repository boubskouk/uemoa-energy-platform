# 📝 Guide : Comment Ajouter le Logo UEMOA

## 🎯 Objectif
Remplacer le logo SVG temporaire par le véritable logo de l'UEMOA dans l'application.

---

## 📁 Étapes pour Ajouter le Logo

### 1. Préparer votre fichier logo

**Formats acceptés :**
- ✅ **PNG** (recommandé si vous avez un fond transparent)
- ✅ **SVG** (meilleur qualité, taille de fichier réduite)
- ⚠️ JPG (si c'est votre seul format disponible)

**Taille recommandée :**
- Minimum : 200x200 pixels
- Recommandé : 512x512 pixels
- Format carré de préférence

**Nom du fichier :**
- `uemoa-logo.png` OU `uemoa-logo.svg`

---

### 2. Placer le fichier dans le bon dossier

**Chemin complet :**
```
E:\site et apps\repertoire acteur\site repertoire acteur\frontend\src\assets\images\
```

**Le dossier est déjà créé et vous attend !**

**Actions à faire :**
1. Ouvrez l'explorateur Windows
2. Naviguez vers : `E:\site et apps\repertoire acteur\site repertoire acteur\frontend\src\assets\images\`
3. Copiez votre logo dans ce dossier
4. Renommez-le en `uemoa-logo.png` (ou `.svg`)

---

### 3. Vérifier que tout fonctionne

Une fois le logo ajouté :

1. **Le serveur détectera automatiquement le nouveau fichier** (Hot Module Replacement)
2. **Rechargez la page** dans votre navigateur : http://localhost:5174
3. **Le logo devrait apparaître** dans le header à la place du SVG temporaire

---

## 📍 Où le Logo Sera Utilisé

Le logo apparaîtra automatiquement dans :

✅ **Header principal** (en haut de toutes les pages)
- Taille : 48x48 pixels
- Position : En haut à gauche
- Avec le texte "UEMOA Energy"

✅ **Fallback intelligent**
- Si le logo ne charge pas, un SVG temporaire s'affiche
- Aucune erreur visible pour l'utilisateur

---

## 🔧 Formats Alternatifs

### Si vous avez un logo SVG :

Placez-le avec le nom `uemoa-logo.svg` et modifiez cette ligne dans Header.vue :
```vue
<img
  v-if="logoExists"
  src="@/assets/images/uemoa-logo.svg"  <!-- Changez .png en .svg -->
  alt="Logo UEMOA"
  class="w-full h-full object-contain p-1"
  @error="logoExists = false"
/>
```

### Si votre logo a un format différent :

1. Convertissez-le en PNG ou SVG
2. Ou contactez-moi pour adapter le code

---

## ❓ Problèmes Courants

### Le logo ne s'affiche pas ?

**Vérifiez :**
1. ✅ Le nom exact du fichier : `uemoa-logo.png`
2. ✅ L'emplacement : `frontend/src/assets/images/`
3. ✅ Les permissions du fichier (lecture autorisée)
4. ✅ Rechargez la page avec Ctrl+F5 (force refresh)

### Le logo est déformé ?

**Solutions :**
- Le logo est automatiquement redimensionné pour tenir dans 48x48px
- Il garde son ratio d'aspect grâce à `object-contain`
- Si le problème persiste, envoyez-moi le logo pour ajustement

---

## 🎨 Personnalisation Avancée (Optionnel)

Si vous voulez modifier la taille du logo dans le header :

**Fichier :** `frontend/src/components/layout/Header.vue`

**Ligne à modifier :**
```vue
<div class="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-md overflow-hidden">
```

Changez `w-12 h-12` (48x48px) par :
- `w-16 h-16` pour 64x64px
- `w-20 h-20` pour 80x80px
- etc.

---

## 📞 Besoin d'Aide ?

Si vous rencontrez un problème :
1. Vérifiez que le fichier est bien dans le bon dossier
2. Vérifiez le nom exact du fichier
3. Faites un Ctrl+F5 pour forcer le rechargement
4. Si le problème persiste, je suis là pour vous aider !

---

## ✅ Checklist Rapide

- [ ] J'ai mon logo au format PNG ou SVG
- [ ] Le fichier est nommé `uemoa-logo.png` ou `uemoa-logo.svg`
- [ ] Je l'ai copié dans `frontend/src/assets/images/`
- [ ] J'ai rechargé la page http://localhost:5174
- [ ] Le logo s'affiche correctement dans le header

---

**C'est tout ! Le logo sera automatiquement détecté et affiché.** 🎉
