# Guide d'Insertion des Acteurs Réels UEMOA

Ce guide explique comment insérer les données réelles des 50+ acteurs UEMOA dans la base de données sans utiliser de seeders.

## 🚀 Méthode 1 : Via API (Recommandé pour Render.com)

### Étape 1 : Démarrer le serveur

```bash
cd backend
npm run dev
```

Ou en production sur Render.com, le serveur sera déjà démarré.

### Étape 2 : Appeler l'API d'initialisation

**Option A : Avec un navigateur**

Ouvrez votre navigateur et allez à :
```
http://localhost:5000/api/setup/init-actors
```

Ou en production :
```
https://votre-app.onrender.com/api/setup/init-actors
```

**Option B : Avec cURL**

```bash
curl http://localhost:5000/api/setup/init-actors
```

**Option C : Avec Postman**

1. Créez une requête GET
2. URL : `http://localhost:5000/api/setup/init-actors`
3. Cliquez sur "Send"

### Étape 3 : Réponse attendue

Si tout fonctionne, vous devriez voir :

```json
{
  "success": true,
  "message": "50 acteurs réels UEMOA créés avec succès !",
  "data": {
    "count": 50,
    "statistics": {
      "total": 50,
      "byType": {
        "Institution": 6,
        "Entreprise": 18,
        "ONG": 9,
        "Opérateur National": 7,
        "Bailleur International": 7,
        "Programme": 3
      },
      "byCountry": {
        "SN": 12,
        "CI": 11,
        "BF": 10,
        "ML": 3,
        "TG": 5,
        "BJ": 3,
        "NE": 2,
        "GW": 1
      },
      "featured": 25
    }
  }
}
```

### Étape 4 : Forcer la réinitialisation (si nécessaire)

Si des acteurs existent déjà et que vous voulez les remplacer :

```
http://localhost:5000/api/setup/init-actors?force=true
```

⚠️ **Attention** : Cela supprimera tous les acteurs existants !

---

## 📊 Vérifier les statistiques

Pour voir les statistiques actuelles sans modifier les données :

```
http://localhost:5000/api/setup/stats
```

Réponse :
```json
{
  "success": true,
  "data": {
    "total": 50,
    "approved": 50,
    "featured": 25,
    "byType": [...],
    "byCountry": [...]
  }
}
```

---

## 📋 Liste des Acteurs Insérés

### 1. INSTITUTIONS RÉGIONALES & FINANCIÈRES (6)
- ✅ Commission UEMOA (DEMEN) - Burkina Faso
- ✅ CEREEC - Côte d'Ivoire
- ✅ RESER - Côte d'Ivoire
- ✅ BOAD - Togo
- ✅ BCEAO - Sénégal
- ✅ SEFA - Côte d'Ivoire

### 2. ENTREPRISES PRIVÉES (18)

**Sénégal (3):**
- ✅ Eden Solaire
- ✅ Eiffage Sénégal
- ✅ Lekela Power (Parc éolien 158,7 MW)

**Côte d'Ivoire (4):**
- ✅ BIOVEA Énergie (Centrale biomasse 46 MW)
- ✅ GREEN POWER
- ✅ Alliance Concept
- ✅ S-TEL

**Mali (1):**
- ✅ FENEM

**Togo (2):**
- ✅ SABER Lomé
- ✅ ELSG

**Bénin (2):**
- ✅ Africa Green Corporation SA
- ✅ CETRA SARL

**Multi-pays (2):**
- ✅ KYA-ENERGY GROUP
- ✅ MPower

### 3. ONG & SOCIÉTÉ CIVILE (9)
- ✅ CESAO-AI - Burkina Faso
- ✅ CNPDER/BF - Burkina Faso
- ✅ Alliance Acteurs Énergies Sénégal
- ✅ CEAS - Burkina Faso
- ✅ ONG TEMER - Mali
- ✅ SNACC - Niger
- ✅ IRED - Sénégal
- ... et 2 autres

### 4. OPÉRATEURS NATIONAUX (7)
- ✅ SENELEC - Sénégal
- ✅ CIE - Côte d'Ivoire
- ✅ EDM-SA - Mali
- ✅ SONABEL - Burkina Faso
- ✅ CEET - Togo
- ✅ SBEE - Bénin
- ✅ NIGELEC - Niger

### 5. BAILLEURS INTERNATIONAUX & PROGRAMMES (10)
- ✅ AFD (Programme ARE Scale-up)
- ✅ Banque Mondiale (RESPITE)
- ✅ Meridiam (4 centrales solaires 120 MW)
- ✅ GIZ
- ✅ Power Africa
- ✅ AREI
- ✅ PRODERE (19,2 milliards FCFA)
- ✅ PPIPS (165 milliards FCFA)
- ... et 2 autres

---

## 🔧 Dépannage

### Erreur : "Aucun pays trouvé"

Assurez-vous d'abord d'initialiser les pays :
```bash
cd backend
npm run seed:countries
npm run seed:categories
npm run seed:energies
```

Ou via l'API (si disponible).

### Erreur : "X acteurs existent déjà"

Utilisez `?force=true` pour remplacer :
```
http://localhost:5000/api/setup/init-actors?force=true
```

### Erreur de connexion à la base de données

Vérifiez que MongoDB est démarré et que la variable `MONGODB_URI` dans `.env` est correcte.

---

## 🌐 Utilisation en Production (Render.com)

1. Déployez votre application sur Render.com
2. Une fois déployée, ouvrez l'URL de votre app
3. Ajoutez `/api/setup/init-actors` à l'URL
4. Exemple : `https://votre-app.onrender.com/api/setup/init-actors`
5. Les acteurs seront insérés automatiquement

**Astuce** : Vous pouvez aussi créer un bouton dans le frontend admin pour appeler cette route.

---

## 📱 Créer un Bouton d'Admin

Ajoutez ce bouton dans votre dashboard admin :

```javascript
const initializeActors = async () => {
  try {
    const response = await axios.get('/api/setup/init-actors');
    alert(`${response.data.data.count} acteurs créés avec succès !`);
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur lors de l\'initialisation');
  }
};

// Dans votre JSX/Template
<button onClick={initializeActors}>
  Initialiser les Acteurs UEMOA
</button>
```

---

## ✅ Vérification

Après l'insertion, vérifiez que tout fonctionne :

1. **Via API** :
   ```
   GET http://localhost:5000/api/actors?limit=100
   ```

2. **Via l'interface** :
   Allez sur `http://localhost:5173/actors` et vérifiez que les acteurs s'affichent

3. **Vérifier les stats** :
   ```
   GET http://localhost:5000/api/setup/stats
   ```

---

## 📝 Notes Importantes

- ✅ Tous les acteurs sont créés avec `status: 'approved'`
- ✅ Les acteurs principaux sont marqués `featured: true`
- ✅ Tous sont vérifiés (`verified: true`)
- ✅ Les coordonnées sont incluses (email, téléphone, adresse)
- ✅ Les projets majeurs sont documentés (Lekela, BIOVEA, Meridiam, etc.)

---

**Besoin d'aide ?** Consultez les logs du serveur pour plus de détails sur les erreurs.
