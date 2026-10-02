# 🖥️ Guide de Déploiement - VPS Hostinger

Ce guide prépare le passage de la plateforme UEMOA Energy de Render (voir
`DEPLOIEMENT_COMPLET.md`, `GUIDE_DEPLOIEMENT_RENDER.md`) vers un VPS Hostinger.

**Statut** : VPS pas encore acheté. Les fichiers de config (`deploy/`) sont prêts à
l'avance ; ce guide est à suivre dès que le VPS est provisionné.

**Choix retenus** :
- Base de données : **MongoDB Atlas conservé** (même cluster que la prod actuelle) — pas de BDD à gérer sur le VPS.
- Domaine : **pas encore acheté** — on déploie d'abord en HTTP sur l'IP du VPS, HTTPS/domaine ajoutés ensuite (étape 8).

---

## 0. Prérequis côté Hostinger

- VPS avec **Ubuntu 22.04 LTS** (recommandé — adapter les commandes si autre distro)
- Accès SSH (IP, utilisateur, mot de passe ou clé SSH fournis par Hostinger)
- Au moins 1 Go de RAM (le plan VPS 1 ou 2 de Hostinger suffit pour ce projet)

---

## 1. Première connexion et sécurisation de base

```bash
ssh root@VOTRE_IP_VPS

# Mise à jour du système
apt update && apt upgrade -y

# Créer un utilisateur non-root pour déployer (éviter de tout faire en root)
adduser deploy
usermod -aG sudo deploy

# Pare-feu : n'ouvrir que SSH, HTTP, HTTPS
apt install -y ufw
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

Se reconnecter ensuite avec `ssh deploy@VOTRE_IP_VPS` pour la suite.

---

## 2. Installer Node.js, Nginx, PM2, Git

```bash
# Node.js 20 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs

node -v   # vérifier la version
npm -v

# Nginx (reverse proxy + hébergement du frontend statique)
sudo apt install -y nginx

# Git
sudo apt install -y git

# PM2 (garde le backend Node vivant, redémarre si crash, démarre au boot)
sudo npm install -g pm2
```

---

## 3. Récupérer le code

```bash
sudo mkdir -p /var/www/uemoa-energy
sudo chown deploy:deploy /var/www/uemoa-energy
cd /var/www
git clone https://github.com/boubskouk/uemoa-energy-platform.git uemoa-energy
cd uemoa-energy
```

---

## 4. Configurer les variables d'environnement

### Backend

```bash
cd /var/www/uemoa-energy/backend
cp .env.production.example .env
nano .env
```

Renseigner :
- `MONGODB_URI` : chaîne de connexion MongoDB Atlas (récupérable sur cloud.mongodb.com,
  ou reprendre celle utilisée pour Render dans `DEPLOIEMENT_COMPLET.md` si le mot de
  passe utilisateur Atlas est toujours valide — sinon le régénérer sur Atlas).
- `JWT_SECRET` : générer une valeur aléatoire, ex. `openssl rand -base64 48`
- `CORS_ORIGIN` : `http://VOTRE_IP_VPS` pour l'instant (sera remplacé par le domaine à l'étape 8)
- `EMAIL_*`, `CLOUDINARY_*` : reprendre les valeurs déjà utilisées en prod sur Render

### Frontend

```bash
cd /var/www/uemoa-energy/frontend
cp .env.production.example .env.production
nano .env.production
```

Renseigner `VITE_API_URL=http://VOTRE_IP_VPS/api` (remplacer par le domaine à l'étape 8).

---

## 5. Premier déploiement

```bash
cd /var/www/uemoa-energy
bash deploy/deploy.sh
```

Ce script (voir `deploy/deploy.sh`) installe les dépendances, build le frontend,
démarre le backend avec PM2 et recharge Nginx. Au premier lancement, Nginx n'est
pas encore configuré pour ce site : passer d'abord par l'étape 6.

Pour que PM2 redémarre le backend automatiquement après un reboot du VPS :

```bash
pm2 startup systemd
# Exécuter la commande que pm2 affiche (sudo env PATH=... pm2 startup systemd -u deploy --hp /home/deploy)
pm2 save
```

---

## 6. Configurer Nginx

```bash
sudo cp /var/www/uemoa-energy/deploy/nginx.conf /etc/nginx/sites-available/uemoa-energy
sudo nano /etc/nginx/sites-available/uemoa-energy
# Remplacer VOTRE_IP_OU_DOMAINE par l'IP réelle du VPS

sudo ln -s /etc/nginx/sites-available/uemoa-energy /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default   # éviter le conflit avec la page par défaut Nginx

sudo nginx -t
sudo systemctl reload nginx
```

---

## 7. Vérification

```bash
curl http://VOTRE_IP_VPS/api/health
```

Puis ouvrir `http://VOTRE_IP_VPS` dans un navigateur : le site doit s'afficher et
charger les données (acteurs, actualités) via l'API.

Commandes utiles côté PM2 :

```bash
pm2 status
pm2 logs uemoa-backend
pm2 restart uemoa-backend
```

---

## 8. Une fois le domaine acheté

1. Chez le registrar (ou Hostinger si acheté là), créer un enregistrement DNS de
   type **A** pointant `votre-domaine.com` (et `www.votre-domaine.com`) vers l'IP du VPS.
2. Mettre à jour `server_name` dans `/etc/nginx/sites-available/uemoa-energy` avec le domaine.
3. Mettre à jour `CORS_ORIGIN` dans `backend/.env` et `VITE_API_URL` dans `frontend/.env.production`
   avec `https://votre-domaine.com`, puis relancer `bash deploy/deploy.sh`.
4. Installer Certbot et activer HTTPS :

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

Certbot édite automatiquement la config Nginx (redirection HTTP → HTTPS) et met en
place le renouvellement automatique du certificat.

---

## 9. Mises à jour futures

Depuis la machine locale, pousser sur `master`, puis sur le VPS :

```bash
ssh deploy@VOTRE_IP_OU_DOMAINE
cd /var/www/uemoa-energy
bash deploy/deploy.sh
```

---

## Fichiers liés

- `deploy/ecosystem.config.js` — config PM2 du backend
- `deploy/nginx.conf` — config Nginx (reverse proxy API + frontend statique)
- `deploy/deploy.sh` — script de déploiement/mise à jour
- `backend/.env.production.example`, `frontend/.env.production.example` — templates de variables d'environnement
