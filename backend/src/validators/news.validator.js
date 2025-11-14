const { body, validationResult } = require('express-validator');
const { NEWS_CATEGORIES, PUBLICATION_STATUS } = require('../utils/constants');

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
 * Validation pour la création d'une actualité
 */
exports.validateCreateNews = [
  body('title.fr')
    .trim()
    .notEmpty().withMessage('Le titre en français est requis')
    .isLength({ min: 5, max: 200 }).withMessage('Le titre doit contenir entre 5 et 200 caractères'),

  body('title.en')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('Le titre en anglais doit contenir entre 5 et 200 caractères'),

  body('content.fr')
    .trim()
    .notEmpty().withMessage('Le contenu en français est requis')
    .isLength({ min: 50 }).withMessage('Le contenu doit contenir au moins 50 caractères'),

  body('content.en')
    .optional()
    .trim()
    .isLength({ min: 50 }).withMessage('Le contenu en anglais doit contenir au moins 50 caractères'),

  body('excerpt.fr')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('L\'extrait en français ne peut pas dépasser 500 caractères'),

  body('excerpt.en')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('L\'extrait en anglais ne peut pas dépasser 500 caractères'),

  body('coverImage')
    .optional()
    .trim()
    .isURL().withMessage('L\'URL de l\'image de couverture n\'est pas valide'),

  body('images')
    .optional()
    .isArray().withMessage('Les images doivent être un tableau'),

  body('images.*')
    .optional()
    .trim()
    .isURL().withMessage('Chaque URL d\'image doit être valide'),

  body('category')
    .optional()
    .isIn(NEWS_CATEGORIES).withMessage(`La catégorie doit être l'une des suivantes: ${NEWS_CATEGORIES.join(', ')}`),

  body('tags')
    .optional()
    .isArray().withMessage('Les tags doivent être un tableau'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 }).withMessage('Chaque tag doit contenir entre 2 et 30 caractères'),

  body('relatedActors')
    .optional()
    .isArray().withMessage('Les acteurs liés doivent être un tableau'),

  body('relatedActors.*')
    .optional()
    .isMongoId().withMessage('Chaque ID d\'acteur doit être un ID MongoDB valide'),

  body('relatedCountries')
    .optional()
    .isArray().withMessage('Les pays liés doivent être un tableau'),

  body('relatedCountries.*')
    .optional()
    .isMongoId().withMessage('Chaque ID de pays doit être un ID MongoDB valide'),

  body('status')
    .optional()
    .isIn(Object.values(PUBLICATION_STATUS)).withMessage(`Le statut doit être l'un des suivants: ${Object.values(PUBLICATION_STATUS).join(', ')}`),

  body('featured')
    .optional()
    .isBoolean().withMessage('Le champ "featured" doit être un booléen'),

  handleValidationErrors
];

/**
 * Validation pour la mise à jour d'une actualité
 */
exports.validateUpdateNews = [
  body('title.fr')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('Le titre doit contenir entre 5 et 200 caractères'),

  body('title.en')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('Le titre en anglais doit contenir entre 5 et 200 caractères'),

  body('content.fr')
    .optional()
    .trim()
    .isLength({ min: 50 }).withMessage('Le contenu doit contenir au moins 50 caractères'),

  body('content.en')
    .optional()
    .trim()
    .isLength({ min: 50 }).withMessage('Le contenu en anglais doit contenir au moins 50 caractères'),

  body('excerpt.fr')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('L\'extrait en français ne peut pas dépasser 500 caractères'),

  body('excerpt.en')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('L\'extrait en anglais ne peut pas dépasser 500 caractères'),

  body('coverImage')
    .optional()
    .trim()
    .isURL().withMessage('L\'URL de l\'image de couverture n\'est pas valide'),

  body('images')
    .optional()
    .isArray().withMessage('Les images doivent être un tableau'),

  body('images.*')
    .optional()
    .trim()
    .isURL().withMessage('Chaque URL d\'image doit être valide'),

  body('category')
    .optional()
    .isIn(NEWS_CATEGORIES).withMessage(`La catégorie doit être l'une des suivantes: ${NEWS_CATEGORIES.join(', ')}`),

  body('tags')
    .optional()
    .isArray().withMessage('Les tags doivent être un tableau'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 }).withMessage('Chaque tag doit contenir entre 2 et 30 caractères'),

  body('relatedActors')
    .optional()
    .isArray().withMessage('Les acteurs liés doivent être un tableau'),

  body('relatedActors.*')
    .optional()
    .isMongoId().withMessage('Chaque ID d\'acteur doit être un ID MongoDB valide'),

  body('relatedCountries')
    .optional()
    .isArray().withMessage('Les pays liés doivent être un tableau'),

  body('relatedCountries.*')
    .optional()
    .isMongoId().withMessage('Chaque ID de pays doit être un ID MongoDB valide'),

  body('status')
    .optional()
    .isIn(Object.values(PUBLICATION_STATUS)).withMessage(`Le statut doit être l'un des suivants: ${Object.values(PUBLICATION_STATUS).join(', ')}`),

  body('featured')
    .optional()
    .isBoolean().withMessage('Le champ "featured" doit être un booléen'),

  handleValidationErrors
];

/**
 * Validation pour le rejet d'une inscription (avec raison)
 */
exports.validateRejectReason = [
  body('reason')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 }).withMessage('La raison doit contenir entre 10 et 500 caractères'),

  handleValidationErrors
];
