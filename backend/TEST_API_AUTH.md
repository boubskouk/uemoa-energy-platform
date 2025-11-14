# 🧪 Tests de l'API d'Authentification

## ✅ API Créée avec Succès !

L'API d'authentification est maintenant opérationnelle avec les routes suivantes :

---

## 📡 Routes Disponibles

### 1. **Inscription** (Register)
- **Méthode** : `POST`
- **URL** : `http://localhost:5000/api/auth/register`
- **Accès** : Public

**Body (JSON)** :
```json
{
  "email": "test@example.com",
  "password": "password123",
  "profile": {
    "firstName": "Jean",
    "lastName": "Dupont",
    "phone": "+221 77 123 45 67"
  }
}
```

**Réponse attendue** :
```json
{
  "success": true,
  "message": "Inscription réussie ! Vous pouvez maintenant vous connecter.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "email": "test@example.com",
    "role": "visitor",
    "profile": {
      "firstName": "Jean",
      "lastName": "Dupont",
      "phone": "+221 77 123 45 67"
    }
  }
}
```

---

### 2. **Connexion** (Login)
- **Méthode** : `POST`
- **URL** : `http://localhost:5000/api/auth/login`
- **Accès** : Public

**Body (JSON)** :
```json
{
  "email": "admin@uemoa-energy.org",
  "password": "Admin@2025!"
}
```

**Réponse attendue** :
```json
{
  "success": true,
  "message": "Connexion réussie !",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "email": "admin@uemoa-energy.org",
    "role": "admin",
    "profile": {
      "firstName": "Admin",
      "lastName": "UEMOA"
    },
    "actorId": null
  }
}
```

---

### 3. **Récupérer l'utilisateur connecté** (Get Me)
- **Méthode** : `GET`
- **URL** : `http://localhost:5000/api/auth/me`
- **Accès** : Privé (nécessite token JWT)

**Headers** :
```
Authorization: Bearer <votre_token_jwt>
```

**Réponse attendue** :
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "email": "admin@uemoa-energy.org",
    "role": "admin",
    "profile": {
      "firstName": "Admin",
      "lastName": "UEMOA"
    }
  }
}
```

---

### 4. **Déconnexion** (Logout)
- **Méthode** : `POST`
- **URL** : `http://localhost:5000/api/auth/logout`
- **Accès** : Privé

**Headers** :
```
Authorization: Bearer <votre_token_jwt>
```

**Réponse attendue** :
```json
{
  "success": true,
  "message": "Déconnexion réussie."
}
```

---

### 5. **Mettre à jour le profil**
- **Méthode** : `PUT`
- **URL** : `http://localhost:5000/api/auth/profile`
- **Accès** : Privé

**Headers** :
```
Authorization: Bearer <votre_token_jwt>
```

**Body (JSON)** :
```json
{
  "firstName": "Jean",
  "lastName": "Doe",
  "phone": "+221 77 999 88 77",
  "language": "en"
}
```

---

### 6. **Changer le mot de passe**
- **Méthode** : `PUT`
- **URL** : `http://localhost:5000/api/auth/change-password`
- **Accès** : Privé

**Headers** :
```
Authorization: Bearer <votre_token_jwt>
```

**Body (JSON)** :
```json
{
  "currentPassword": "Admin@2025!",
  "newPassword": "NewPassword@2025"
}
```

---

## 🧪 Comment Tester ?

### Option 1 : Utiliser le Frontend

**Le plus simple !**

1. Assurez-vous que le backend tourne : `npm run dev`
2. Assurez-vous que le frontend tourne
3. Allez sur : `http://localhost:5173/login`
4. Connectez-vous avec :
   - Email : `admin@uemoa-energy.org`
   - Mot de passe : `Admin@2025!`
5. ✅ Vous devriez être connecté et redirigé !

---

### Option 2 : Utiliser Postman ou Thunder Client (VSCode)

#### Installer Thunder Client (Extension VSCode)
1. Ouvrez VSCode
2. Extensions → Rechercher "Thunder Client"
3. Installer

#### Tester la connexion

**1. Login**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

Body:
{
  "email": "admin@uemoa-energy.org",
  "password": "Admin@2025!"
}
```

**2. Copier le token de la réponse**

**3. Tester Get Me**
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer <coller_le_token_ici>
```

---

### Option 3 : Utiliser cURL (Ligne de commande)

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@uemoa-energy.org",
    "password": "Admin@2025!"
  }'
```

#### Get Me (remplacer YOUR_TOKEN)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ✅ Tests Automatiques

### Test 1 : Login avec le compte admin
```
✅ Email : admin@uemoa-energy.org
✅ Password : Admin@2025!
✅ Devrait retourner un token JWT
✅ Role devrait être "admin"
```

### Test 2 : Inscription d'un nouvel utilisateur
```
✅ Email unique
✅ Password minimum 6 caractères
✅ Devrait créer un compte avec role "visitor"
✅ Devrait retourner un token
```

### Test 3 : Connexion avec mauvais mot de passe
```
❌ Devrait retourner une erreur 401
❌ Message : "Email ou mot de passe incorrect."
```

### Test 4 : Accéder à /me sans token
```
❌ Devrait retourner une erreur 401
❌ Message : "Accès non autorisé. Token manquant."
```

---

## 🔍 Validation des Erreurs

### Email invalide
```json
{
  "email": "invalid-email",
  "password": "123456"
}
```
**Erreur attendue** : "L'email n'est pas valide"

### Mot de passe trop court
```json
{
  "email": "test@example.com",
  "password": "123"
}
```
**Erreur attendue** : "Le mot de passe doit contenir au moins 6 caractères"

### Champs manquants
```json
{
  "email": "test@example.com"
}
```
**Erreur attendue** : "Le mot de passe est requis"

---

## 🎯 Prochaines Étapes

Une fois l'authentification testée et validée :

1. ✅ **API Acteurs** - Créer, lister, modifier les acteurs
2. ✅ **API Pays** - Récupérer les pays UEMOA
3. ✅ **API Catégories & Énergies** - Référentiels
4. ✅ **Protection des routes** - Seul l'owner ou admin peut modifier
5. ✅ **Dashboard acteur** - Interface de gestion

---

## 📝 Notes Importantes

- Le token JWT expire après **7 jours** (configurable dans .env)
- Les mots de passe sont hachés avec **bcrypt** (10 salt rounds)
- La validation est faite avec **express-validator**
- Les erreurs sont gérées de manière centralisée
- CORS est configuré pour accepter le frontend (localhost:5173)

---

**L'API d'authentification est prête à être testée ! 🚀**
