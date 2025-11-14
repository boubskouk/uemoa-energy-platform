const { body, validationResult } = require('express-validator');

/**
 * Middleware pour gérer les erreurs de validation
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: errorMessages
    });
  }

  next();
};

/**
 * Validation pour l'inscription
 */
exports.validateRegister = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('L\'email n\'est pas valide')
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),

  body('profile.firstName')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères'),

  body('profile.lastName')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),

  body('profile.phone')
    .optional()
    .trim(),

  handleValidationErrors
];

/**
 * Validation pour la connexion
 */
exports.validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('L\'email n\'est pas valide')
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty().withMessage('Le mot de passe est requis'),

  handleValidationErrors
];

/**
 * Validation pour la mise à jour du profil
 */
exports.validateUpdateProfile = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),

  body('phone')
    .optional()
    .trim(),

  body('language')
    .optional()
    .isIn(['fr', 'en']).withMessage('La langue doit être "fr" ou "en"'),

  handleValidationErrors
];

/**
 * Validation pour le changement de mot de passe
 */
exports.validateChangePassword = [
  body('currentPassword')
    .trim()
    .notEmpty().withMessage('Le mot de passe actuel est requis'),

  body('newPassword')
    .trim()
    .notEmpty().withMessage('Le nouveau mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères'),

  handleValidationErrors
];
