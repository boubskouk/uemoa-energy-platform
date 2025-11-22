# Resolution du Probleme de Connexion

## Probleme Identifie

Le message "CONNEXION ECHOUEE" peut avoir plusieurs causes. Voici ce qui a ete verifie et corrige :

## Solutions Appliquees

### 1. Backend Demarre
- Le serveur backend est maintenant actif sur **http://localhost:5000**
- MongoDB est connecte correctement
- Le health check fonctionne : http://localhost:5000/api/health

### 2. Credentials Corrects
Les identifiants admin valides sont :
- **Email** : `admin@uemoa-energy.org`
- **Mot de passe** : `Admin@2025!`

⚠️ Le mot de passe n'est PAS `Admin@123456` mais bien `Admin@2025!`

### 3. Test de Connexion Backend Reussi
```bash
node -e "fetch('http://localhost:5000/api/auth/login', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email: 'admin@uemoa-energy.org', password: 'Admin@2025!'})}).then(r => r.json()).then(d => console.log(JSON.stringify(d, null, 2)))"
```

Resultat : ✅ Connexion reussie avec token JWT genere

### 4. Route /admin/settings Ajoutee
- Creation du composant `Settings.vue`
- Ajout de la route dans le router
- Plus d'erreur 404 sur `/admin/settings`

### 5. Erreur referenceStore Corrigee
- Dans `ActorsList.vue`, correction de `loadReferences()` en `fetchAll()`
- Le store reference fonctionne correctement maintenant

## Comment Se Connecter

### Methode 1 : Via l'Interface Web

1. Assurez-vous que le backend est demarre :
   ```bash
   cd backend
   npm run dev
   ```

2. Assurez-vous que le frontend est demarre :
   ```bash
   cd frontend
   npm run dev
   ```

3. Ouvrez le navigateur sur : http://localhost:5174 (ou le port indique)

4. Cliquez sur "Connexion" ou allez sur : http://localhost:5174/login

5. Entrez les credentials :
   - Email : `admin@uemoa-energy.org`
   - Mot de passe : `Admin@2025!`

6. Cliquez sur "Se connecter"

### Methode 2 : Via l'API directement

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@uemoa-energy.org","password":"Admin@2025!"}'
```

## Verification du Compte Admin

Pour verifier que le compte admin existe et tester le mot de passe :

```bash
cd backend
node check-admin.js
```

Cela affichera :
- Les informations du compte admin
- La validation du mot de passe
- L'etat du compte (actif, approuve, etc.)

## Problemes Potentiels Restants

Si la connexion echoue encore, verifiez :

### 1. Le frontend communique-t-il avec le backend ?
Ouvrez la console du navigateur (F12) et regardez les erreurs reseau.
L'URL de l'API devrait etre : `http://localhost:5000/api`

### 2. CORS actives ?
Le backend doit autoriser le frontend. Verifiez dans `backend/src/app.js` que CORS est configure pour accepter `http://localhost:5174` (ou votre port frontend)

### 3. Les deux serveurs tournent-ils ?
- Backend sur port 5000
- Frontend sur port 5174 (ou 5173)

Verifiez avec :
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :5174

# Linux/Mac
lsof -i :5000
lsof -i :5174
```

### 4. Token stocke dans localStorage ?
Apres connexion, ouvrez les DevTools (F12) > Application > Local Storage
Vous devriez voir :
- `token` : le JWT
- `user` : les donnees utilisateur

## Messages de Debug

Le composant Login.vue contient des alerts de debug. Si vous voyez ces messages :
- "CLICK DETECTE!" : Le bouton fonctionne
- "Champs vides!" : Vous avez oublie un champ
- "Connexion reussie! Redirection dans 1.5s" : Tout fonctionne
- "Echec: ..." : Verifiez les credentials ou le backend

## Logs Backend

Consultez les logs du backend pour voir les requetes entrantes :
- Les requetes POST sur /api/auth/login
- Les erreurs eventuelles
- La validation du mot de passe

## Prochaines Etapes

Si tout fonctionne :
1. Vous serez redirige vers la page d'accueil (/)
2. Le header affichera votre nom
3. Vous pouvez acceder a l'admin via : http://localhost:5174/admin

## Support

En cas de probleme persistant :
1. Verifiez les logs du backend (console)
2. Verifiez la console du navigateur (F12)
3. Testez l'API directement avec curl ou Postman
4. Verifiez que MongoDB est bien demarre

---

**Date de resolution** : 2025-11-21
**Fichiers modifies** :
- `CONNEXION_GUIDE.md` (mot de passe mis a jour)
- `frontend/src/views/admin/Settings.vue` (cree)
- `frontend/src/router/index.js` (route settings ajoutee)
- `frontend/src/views/admin/actors/ActorsList.vue` (erreur store corrigee)
