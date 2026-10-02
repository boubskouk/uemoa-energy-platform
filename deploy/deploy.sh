#!/usr/bin/env bash
# Script de déploiement - UEMOA Energy Platform sur VPS Hostinger
#
# A exécuter SUR LE VPS, depuis la racine du repo (/var/www/uemoa-energy),
# après le setup initial décrit dans GUIDE_DEPLOIEMENT_HOSTINGER_VPS.md.
#
# Usage : bash deploy/deploy.sh

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

echo "📥 Récupération du dernier code..."
git pull origin master

echo "📦 Installation des dépendances backend..."
cd backend
npm ci --omit=dev
cd ..

echo "📦 Installation + build du frontend..."
cd frontend
npm ci
npm run build
cd ..

echo "🚀 (Re)démarrage du backend via PM2..."
mkdir -p logs
if pm2 describe uemoa-backend > /dev/null 2>&1; then
    pm2 restart deploy/ecosystem.config.js --env production
else
    pm2 start deploy/ecosystem.config.js --env production
    pm2 save
fi

echo "🔄 Rechargement de Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Déploiement terminé."
pm2 status
