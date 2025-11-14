const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

/**
 * Génère un token JWT pour un utilisateur
 * @param {Object} user - L'objet utilisateur
 * @returns {String} Token JWT
 */
const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
    issuer: jwtConfig.options.issuer,
    audience: jwtConfig.options.audience
  });
};

/**
 * Vérifie et décode un token JWT
 * @param {String} token - Le token JWT
 * @returns {Object} Payload décodé
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.secret, {
      issuer: jwtConfig.options.issuer,
      audience: jwtConfig.options.audience
    });
  } catch (error) {
    throw new Error('Token invalide ou expiré');
  }
};

/**
 * Génère un token de réinitialisation de mot de passe
 * @param {Object} user - L'objet utilisateur
 * @returns {String} Token
 */
const generateResetToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    type: 'reset-password'
  };

  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: '1h' // Le token de reset expire après 1 heure
  });
};

module.exports = {
  generateToken,
  verifyToken,
  generateResetToken
};
