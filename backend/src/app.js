const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

// ========== MIDDLEWARES DE SÉCURITÉ ==========

// Helmet pour sécuriser les headers HTTP
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
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
