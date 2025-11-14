/**
 * Middleware de gestion globale des erreurs
 */
const errorHandler = (err, req, res, next) => {
  // Définir le statut par défaut
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erreur serveur interne';

  // Erreurs de validation Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(e => e.message);
    message = errors.join(', ');
  }

  // Erreur de duplication MongoDB (clé unique)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    message = `Cette valeur pour ${field} existe déjà.`;
  }

  // Erreur CastError (ID invalide)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'ID invalide fourni.';
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token invalide.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expiré.';
  }

  // Log de l'erreur en développement
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Erreur capturée:', err);
  }

  // Réponse JSON
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  });
};

/**
 * Wrapper pour les fonctions async/await
 * Évite d'avoir à écrire try/catch dans chaque controller
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Créer une erreur personnalisée avec un code de statut
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  asyncHandler,
  AppError
};
