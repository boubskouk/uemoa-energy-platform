# 🔐 Test du Système d'Approbation des Inscriptions

## 📋 Vue d'ensemble

Le système d'approbation des inscriptions permet à l'administrateur de valider ou rejeter les nouvelles demandes d'inscription avant que les utilisateurs puissent se connecter.

### Flux de fonctionnement :

1. **Utilisateur s'inscrit** → Compte créé avec statut `pending`
2. **Email envoyé à l'admin** → Notification de nouvelle demande
3. **Admin approuve/rejette** → Via l'interface d'administration
4. **Email envoyé à l'utilisateur** → Confirmation ou rejet de la demande
5. **Utilisateur peut se connecter** → Seulement si approuvé

---

## ⚙️ Configuration préalable

### 1. Configurer Gmail pour l'envoi d'emails

Vous devez créer un **mot de passe d'application** pour votre compte Gmail :

1. Connectez-vous à votre compte Google : https://myaccount.google.com/
2. Allez dans **Sécurité**
3. Activez la **validation en deux étapes** (si ce n'est pas déjà fait)
4. Recherchez **Mots de passe des applications**
5. Créez un nouveau mot de passe d'application :
   - Application : **Autre (nom personnalisé)**
   - Nom : **UEMOA Energy Platform**
6. Copiez le mot de passe généré (16 caractères)

### 2. Mettre à jour le fichier `.env`

Ajoutez le mot de passe d'application dans le fichier `.env` :

```env
EMAIL_USER=jacqueskoukoui@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_application_ici
ADMIN_EMAIL=jacqueskoukoui@gmail.com
```

### 3. Relancer le seeding pour créer le compte admin

```bash
npm run seed:admin
```

---

## 🧪 Tests à effectuer

### Test 1 : Inscription d'un nouvel utilisateur

**Endpoint :** `POST http://localhost:5000/api/auth/register`

**Body (JSON) :**
```json
{
  "email": "test.user@example.com",
  "password": "Test@2025!",
  "profile": {
    "firstName": "Jean",
    "lastName": "Dupont",
    "phone": "+225 01 02 03 04 05"
  }
}
```

**Réponse attendue (201 Created) :**
```json
{
  "success": true,
  "message": "Votre demande d'inscription a été envoyée. Vous recevrez un email une fois votre compte approuvé par l'administrateur.",
  "user": {
    "_id": "...",
    "email": "test.user@example.com",
    "role": "visitor",
    "profile": {
      "firstName": "Jean",
      "lastName": "Dupont",
      "phone": "+225 01 02 03 04 05"
    },
    "accountStatus": "pending"
  }
}
```

**✅ À vérifier :**
- L'utilisateur est créé avec `accountStatus: "pending"`
- Un email est envoyé à `jacqueskoukoui@gmail.com` avec les détails de la demande

---

### Test 2 : Tentative de connexion avec un compte en attente

**Endpoint :** `POST http://localhost:5000/api/auth/login`

**Body (JSON) :**
```json
{
  "email": "test.user@example.com",
  "password": "Test@2025!"
}
```

**Réponse attendue (403 Forbidden) :**
```json
{
  "success": false,
  "message": "Votre compte est en attente d'approbation par l'administrateur. Vous recevrez un email une fois votre compte approuvé."
}
```

**✅ À vérifier :**
- La connexion est refusée
- Message clair sur le statut en attente

---

### Test 3 : Connexion en tant qu'admin

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
    "role": "admin",
    "accountStatus": "approved",
    ...
  }
}
```

**✅ À vérifier :**
- L'admin peut se connecter (son compte est `approved` par défaut)
- Un token JWT est retourné

**⚠️ Important :** Copiez le token JWT pour les prochaines requêtes !

---

### Test 4 : Récupérer les demandes en attente (Admin)

**Endpoint :** `GET http://localhost:5000/api/users/pending`

**Headers :**
```
Authorization: Bearer <TOKEN_ADMIN>
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "count": 1,
  "users": [
    {
      "_id": "...",
      "email": "test.user@example.com",
      "role": "visitor",
      "profile": {
        "firstName": "Jean",
        "lastName": "Dupont",
        "phone": "+225 01 02 03 04 05"
      },
      "accountStatus": "pending",
      "createdAt": "2025-01-09T...",
      ...
    }
  ]
}
```

**✅ À vérifier :**
- Toutes les demandes en attente sont listées
- Les informations complètes de chaque utilisateur sont présentes

---

### Test 5 : Approuver une demande d'inscription (Admin)

**Endpoint :** `PUT http://localhost:5000/api/users/<USER_ID>/approve`

**Headers :**
```
Authorization: Bearer <TOKEN_ADMIN>
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "message": "Le compte utilisateur a été approuvé avec succès.",
  "user": {
    "_id": "...",
    "email": "test.user@example.com",
    "accountStatus": "approved",
    "approvedAt": "2025-01-09T..."
  }
}
```

**✅ À vérifier :**
- Le statut du compte passe à `approved`
- Un email de confirmation est envoyé à `test.user@example.com`
- La date d'approbation est enregistrée

---

### Test 6 : Connexion avec le compte approuvé

**Endpoint :** `POST http://localhost:5000/api/auth/login`

**Body (JSON) :**
```json
{
  "email": "test.user@example.com",
  "password": "Test@2025!"
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
    "email": "test.user@example.com",
    "role": "visitor",
    "accountStatus": "approved",
    ...
  }
}
```

**✅ À vérifier :**
- L'utilisateur peut maintenant se connecter
- Un token JWT est retourné

---

### Test 7 : Rejeter une demande d'inscription (Admin)

**Étape 1 :** Créer un nouvel utilisateur de test

**Endpoint :** `POST http://localhost:5000/api/auth/register`

**Body (JSON) :**
```json
{
  "email": "test.reject@example.com",
  "password": "Test@2025!",
  "profile": {
    "firstName": "Marie",
    "lastName": "Martin"
  }
}
```

**Étape 2 :** Rejeter la demande

**Endpoint :** `PUT http://localhost:5000/api/users/<USER_ID>/reject`

**Headers :**
```
Authorization: Bearer <TOKEN_ADMIN>
```

**Body (JSON) :**
```json
{
  "reason": "Informations incomplètes. Veuillez fournir plus de détails sur votre organisation."
}
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "message": "La demande d'inscription a été rejetée.",
  "user": {
    "_id": "...",
    "email": "test.reject@example.com",
    "accountStatus": "rejected",
    "rejectionReason": "Informations incomplètes. Veuillez fournir plus de détails sur votre organisation."
  }
}
```

**✅ À vérifier :**
- Le statut du compte passe à `rejected`
- Un email de rejet est envoyé à `test.reject@example.com` avec la raison
- La raison du rejet est enregistrée

**Étape 3 :** Tenter de se connecter avec le compte rejeté

**Endpoint :** `POST http://localhost:5000/api/auth/login`

**Body (JSON) :**
```json
{
  "email": "test.reject@example.com",
  "password": "Test@2025!"
}
```

**Réponse attendue (403 Forbidden) :**
```json
{
  "success": false,
  "message": "Votre demande d'inscription a été refusée. Veuillez contacter l'administrateur pour plus d'informations."
}
```

---

## 📊 Routes disponibles pour l'administration

### Gestion des utilisateurs (Admin uniquement)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/users/pending` | Liste des demandes en attente |
| GET | `/api/users` | Liste de tous les utilisateurs |
| GET | `/api/users/:userId` | Détails d'un utilisateur |
| PUT | `/api/users/:userId/approve` | Approuver une demande |
| PUT | `/api/users/:userId/reject` | Rejeter une demande |
| PUT | `/api/users/:userId/role` | Modifier le rôle d'un utilisateur |
| PUT | `/api/users/:userId/toggle-active` | Activer/Désactiver un utilisateur |

---

## 📧 Emails envoyés

### 1. Email à l'admin (nouvelle demande)

**Sujet :** 🔔 Nouvelle demande d'inscription - UEMOA Energy Platform

**Contenu :**
- Informations de l'utilisateur (nom, email, téléphone)
- Date de la demande
- ID de l'utilisateur pour l'approbation

### 2. Email à l'utilisateur (approbation)

**Sujet :** ✅ Votre compte a été approuvé - UEMOA Energy Platform

**Contenu :**
- Confirmation de l'approbation
- Email de connexion
- Message de bienvenue

### 3. Email à l'utilisateur (rejet)

**Sujet :** ❌ Votre demande d'inscription a été refusée - UEMOA Energy Platform

**Contenu :**
- Information du rejet
- Raison du rejet (si fournie)
- Invitation à contacter l'administrateur

---

## 🐛 Dépannage

### Les emails ne sont pas envoyés

1. Vérifiez que `EMAIL_PASSWORD` dans `.env` est bien votre **mot de passe d'application** (pas votre mot de passe Gmail normal)
2. Vérifiez que la validation en deux étapes est activée sur votre compte Google
3. Regardez les logs du serveur pour voir les erreurs éventuelles
4. Vérifiez vos spams/courriers indésirables

### L'admin ne peut pas se connecter

1. Relancez le seeding : `npm run seed:admin`
2. Vérifiez que le compte admin a `accountStatus: "approved"` dans la base de données

### Token JWT invalide

1. Assurez-vous d'ajouter `Bearer ` avant le token dans le header Authorization
2. Le format correct est : `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## ✅ Checklist finale

- [ ] Configuration Gmail avec mot de passe d'application
- [ ] Fichier `.env` mis à jour
- [ ] Compte admin créé et approuvé
- [ ] Test d'inscription réussi
- [ ] Email de notification reçu par l'admin
- [ ] Connexion refusée pour compte en attente
- [ ] Approbation d'un compte réussie
- [ ] Email d'approbation reçu par l'utilisateur
- [ ] Connexion réussie avec compte approuvé
- [ ] Rejet d'un compte réussi
- [ ] Email de rejet reçu par l'utilisateur

---

**🎉 Félicitations ! Le système d'approbation des inscriptions est opérationnel !**
