const { verifyToken } = require('../utils/generateToken');
const User = require('../models/User');

/**
 * Middleware pour vérifier l'authentification JWT
 */
const authenticate = async (req, res, next) => {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé. Token manquant.'
      });
    }

    // Extraire le token
    const token = authHeader.substring(7); // Enlever 'Bearer '

    // Vérifier et décoder le token
    const decoded = verifyToken(token);

    // Récupérer l'utilisateur depuis la base de données
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Votre compte a été désactivé.'
      });
    }

    // Attacher l'utilisateur à la requête
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré.',
      error: error.message
    });
  }
};

/**
 * Middleware optionnel - Attache l'utilisateur s'il est authentifié, mais ne bloque pas la requête
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('-password');

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Ignorer les erreurs et continuer
    next();
  }
};

/**
 * Middleware pour vérifier le rôle de l'utilisateur
 * @param {...string} roles - Rôles autorisés
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé. Veuillez vous connecter.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.'
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  optionalAuth,
  authorize
};
