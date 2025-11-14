const { body, validationResult } = require('express-validator');
const { ACTOR_TYPES, COMPANY_SIZES } = require('../utils/constants');

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
 * Validation pour la création d'un acteur
 */
exports.validateCreateActor = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom de la structure est requis')
    .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),

  body('type')
    .notEmpty().withMessage('Le type d\'acteur est requis')
    .isIn(ACTOR_TYPES).withMessage('Type d\'acteur invalide'),

  body('country')
    .notEmpty().withMessage('Le pays est requis')
    .isMongoId().withMessage('ID de pays invalide'),

  body('description.fr')
    .trim()
    .notEmpty().withMessage('La description en français est requise')
    .isLength({ min: 50 }).withMessage('La description doit contenir au moins 50 caractères'),

  body('description.en')
    .optional()
    .trim(),

  body('categories')
    .optional()
    .isArray().withMessage('Les catégories doivent être un tableau'),

  body('categories.*')
    .optional()
    .isMongoId().withMessage('ID de catégorie invalide'),

  body('energyTypes')
    .optional()
    .isArray().withMessage('Les types d\'énergie doivent être un tableau'),

  body('energyTypes.*')
    .optional()
    .isMongoId().withMessage('ID de type d\'énergie invalide'),

  body('city')
    .optional()
    .trim(),

  body('address')
    .optional()
    .trim(),

  body('contact.email')
    .optional()
    .isEmail().withMessage('Email de contact invalide')
    .normalizeEmail(),

  body('contact.phone')
    .optional()
    .trim(),

  body('contact.website')
    .optional()
    .trim()
    .isURL().withMessage('URL du site web invalide'),

  body('yearFounded')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`L'année de création doit être entre 1900 et ${new Date().getFullYear()}`),

  body('employeesCount')
    .optional()
    .isIn(COMPANY_SIZES).withMessage('Taille d\'entreprise invalide'),

  handleValidationErrors
];

/**
 * Validation pour la mise à jour d'un acteur
 */
exports.validateUpdateActor = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),

  body('type')
    .optional()
    .isIn(ACTOR_TYPES).withMessage('Type d\'acteur invalide'),

  body('description.fr')
    .optional()
    .trim()
    .isLength({ min: 50 }).withMessage('La description doit contenir au moins 50 caractères'),

  body('categories')
    .optional()
    .isArray().withMessage('Les catégories doivent être un tableau'),

  body('energyTypes')
    .optional()
    .isArray().withMessage('Les types d\'énergie doivent être un tableau'),

  body('contact.email')
    .optional()
    .isEmail().withMessage('Email de contact invalide')
    .normalizeEmail(),

  body('contact.website')
    .optional()
    .trim()
    .isURL().withMessage('URL du site web invalide'),

  body('yearFounded')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`L'année de création doit être entre 1900 et ${new Date().getFullYear()}`),

  body('employeesCount')
    .optional()
    .isIn(COMPANY_SIZES).withMessage('Taille d\'entreprise invalide'),

  handleValidationErrors
];
