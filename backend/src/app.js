const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

// ========== CONFIGURATION EXPRESS ==========

// Trust proxy - Important pour Render, Heroku, etc.
// Permet au rate limiter de récupérer la vraie IP via X-Forwarded-For
app.set('trust proxy', true);

// ========== MIDDLEWARES DE SÉCURITÉ ==========

// Helmet pour sécuriser les headers HTTP
app.use(helmet());

// CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (comme Postman)
    if (!origin) {
      return callback(null, true);
    }

    // En développement, autoriser localhost
    if (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost')) {
      return callback(null, true);
    }

    // En production, vérifier la variable CORS_ORIGIN
    const allowedOrigins = process.env.CORS_ORIGIN ?
      process.env.CORS_ORIGIN.split(',').map(o => o.trim()) :
      [];

    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }

    console.log('❌ CORS: Origine refusée:', origin);
    callback(new Error('Non autorisé par CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Rate limiting - Configuration plus souple en développement
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || (process.env.NODE_ENV === 'development' ? 1000 : 100),
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development' && req.ip === '::1', // Skip pour localhost en dev
  // Désactiver la validation trust proxy pour Render/Heroku
  validate: { trustProxy: false }
});
app.use('/api', limiter);

// ========== MIDDLEWARES DE PARSING ==========

// Parser le body JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========== ROUTES ==========

// Route de santé
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API UEMOA Energy Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Route de bienvenue
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API UEMOA Energy Platform',
    documentation: '/api/health',
    version: '1.0.0'
  });
});

// Importer les routes
const routes = require('./routes');
app.use('/api', routes);

// ========== GESTION DES ERREURS ==========

// 404 - Route non trouvée
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Gestionnaire d'erreurs global
app.use(errorHandler);

module.exports = app;
