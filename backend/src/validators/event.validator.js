const { body, validationResult } = require('express-validator');
const { EVENT_CATEGORIES, EVENT_LOCATION_TYPES } = require('../utils/constants');

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
 * Validation pour la création d'un événement
 */
exports.validateCreateEvent = [
  body('title.fr')
    .trim()
    .notEmpty().withMessage('Le titre en français est requis')
    .isLength({ min: 5, max: 200 }).withMessage('Le titre doit contenir entre 5 et 200 caractères'),

  body('title.en')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('Le titre en anglais doit contenir entre 5 et 200 caractères'),

  body('description.fr')
    .trim()
    .notEmpty().withMessage('La description en français est requise')
    .isLength({ min: 50 }).withMessage('La description doit contenir au moins 50 caractères'),

  body('description.en')
    .optional()
    .trim()
    .isLength({ min: 50 }).withMessage('La description en anglais doit contenir au moins 50 caractères'),

  body('startDate')
    .notEmpty().withMessage('La date de début est requise')
    .isISO8601().withMessage('La date de début doit être au format ISO 8601'),

  body('endDate')
    .optional()
    .isISO8601().withMessage('La date de fin doit être au format ISO 8601')
    .custom((endDate, { req }) => {
      if (endDate && req.body.startDate && new Date(endDate) < new Date(req.body.startDate)) {
        throw new Error('La date de fin doit être postérieure à la date de début');
      }
      return true;
    }),

  body('location.type')
    .optional()
    .isIn(Object.values(EVENT_LOCATION_TYPES)).withMessage(`Le type de localisation doit être l'un des suivants: ${Object.values(EVENT_LOCATION_TYPES).join(', ')}`),

  body('location.venue')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Le nom du lieu doit contenir entre 2 et 200 caractères'),

  body('location.address')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('L\'adresse ne peut pas dépasser 300 caractères'),

  body('location.city')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('La ville ne peut pas dépasser 100 caractères'),

  body('location.country')
    .optional()
    .isMongoId().withMessage('L\'ID du pays doit être un ID MongoDB valide'),

  body('location.coordinates.coordinates')
    .optional()
    .isArray().withMessage('Les coordonnées doivent être un tableau')
    .custom((coordinates) => {
      if (coordinates && coordinates.length !== 2) {
        throw new Error('Les coordonnées doivent contenir exactement 2 valeurs [longitude, latitude]');
      }
      if (coordinates && (coordinates[0] < -180 || coordinates[0] > 180)) {
        throw new Error('La longitude doit être entre -180 et 180');
      }
      if (coordinates && (coordinates[1] < -90 || coordinates[1] > 90)) {
        throw new Error('La latitude doit être entre -90 et 90');
      }
      return true;
    }),

  body('location.onlineLink')
    .optional()
    .trim()
    .isURL().withMessage('Le lien en ligne doit être une URL valide'),

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

  body('organizer.name')
    .trim()
    .notEmpty().withMessage('Le nom de l\'organisateur est requis')
    .isLength({ min: 2, max: 200 }).withMessage('Le nom de l\'organisateur doit contenir entre 2 et 200 caractères'),

  body('organizer.contact')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Le contact de l\'organisateur ne peut pas dépasser 200 caractères'),

  body('organizer.actorId')
    .optional()
    .isMongoId().withMessage('L\'ID de l\'acteur organisateur doit être un ID MongoDB valide'),

  body('category')
    .optional()
    .isIn(EVENT_CATEGORIES).withMessage(`La catégorie doit être l'une des suivantes: ${EVENT_CATEGORIES.join(', ')}`),

  body('topics')
    .optional()
    .isArray().withMessage('Les thématiques doivent être un tableau'),

  body('topics.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Chaque thématique doit contenir entre 2 et 100 caractères'),

  body('registrationRequired')
    .optional()
    .isBoolean().withMessage('Le champ "registrationRequired" doit être un booléen'),

  body('registrationLink')
    .optional()
    .trim()
    .isURL().withMessage('Le lien d\'inscription doit être une URL valide'),

  body('maxParticipants')
    .optional()
    .isInt({ min: 1 }).withMessage('Le nombre maximum de participants doit être un entier positif'),

  body('registrationDeadline')
    .optional()
    .isISO8601().withMessage('La date limite d\'inscription doit être au format ISO 8601')
    .custom((deadline, { req }) => {
      if (deadline && req.body.startDate && new Date(deadline) > new Date(req.body.startDate)) {
        throw new Error('La date limite d\'inscription doit être antérieure à la date de début de l\'événement');
      }
      return true;
    }),

  body('relatedActors')
    .optional()
    .isArray().withMessage('Les acteurs liés doivent être un tableau'),

  body('relatedActors.*')
    .optional()
    .isMongoId().withMessage('Chaque ID d\'acteur doit être un ID MongoDB valide'),

  body('featured')
    .optional()
    .isBoolean().withMessage('Le champ "featured" doit être un booléen'),

  handleValidationErrors
];

/**
 * Validation pour la mise à jour d'un événement
 */
exports.validateUpdateEvent = [
  body('title.fr')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('Le titre doit contenir entre 5 et 200 caractères'),

  body('title.en')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('Le titre en anglais doit contenir entre 5 et 200 caractères'),

  body('description.fr')
    .optional()
    .trim()
    .isLength({ min: 50 }).withMessage('La description doit contenir au moins 50 caractères'),

  body('description.en')
    .optional()
    .trim()
    .isLength({ min: 50 }).withMessage('La description en anglais doit contenir au moins 50 caractères'),

  body('startDate')
    .optional()
    .isISO8601().withMessage('La date de début doit être au format ISO 8601'),

  body('endDate')
    .optional()
    .isISO8601().withMessage('La date de fin doit être au format ISO 8601')
    .custom((endDate, { req }) => {
      if (endDate && req.body.startDate && new Date(endDate) < new Date(req.body.startDate)) {
        throw new Error('La date de fin doit être postérieure à la date de début');
      }
      return true;
    }),

  body('location.type')
    .optional()
    .isIn(Object.values(EVENT_LOCATION_TYPES)).withMessage(`Le type de localisation doit être l'un des suivants: ${Object.values(EVENT_LOCATION_TYPES).join(', ')}`),

  body('location.venue')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Le nom du lieu doit contenir entre 2 et 200 caractères'),

  body('location.address')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('L\'adresse ne peut pas dépasser 300 caractères'),

  body('location.city')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('La ville ne peut pas dépasser 100 caractères'),

  body('location.country')
    .optional()
    .isMongoId().withMessage('L\'ID du pays doit être un ID MongoDB valide'),

  body('location.coordinates.coordinates')
    .optional()
    .isArray().withMessage('Les coordonnées doivent être un tableau')
    .custom((coordinates) => {
      if (coordinates && coordinates.length !== 2) {
        throw new Error('Les coordonnées doivent contenir exactement 2 valeurs [longitude, latitude]');
      }
      if (coordinates && (coordinates[0] < -180 || coordinates[0] > 180)) {
        throw new Error('La longitude doit être entre -180 et 180');
      }
      if (coordinates && (coordinates[1] < -90 || coordinates[1] > 90)) {
        throw new Error('La latitude doit être entre -90 et 90');
      }
      return true;
    }),

  body('location.onlineLink')
    .optional()
    .trim()
    .isURL().withMessage('Le lien en ligne doit être une URL valide'),

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

  body('organizer.name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Le nom de l\'organisateur doit contenir entre 2 et 200 caractères'),

  body('organizer.contact')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Le contact de l\'organisateur ne peut pas dépasser 200 caractères'),

  body('organizer.actorId')
    .optional()
    .isMongoId().withMessage('L\'ID de l\'acteur organisateur doit être un ID MongoDB valide'),

  body('category')
    .optional()
    .isIn(EVENT_CATEGORIES).withMessage(`La catégorie doit être l'une des suivantes: ${EVENT_CATEGORIES.join(', ')}`),

  body('topics')
    .optional()
    .isArray().withMessage('Les thématiques doivent être un tableau'),

  body('topics.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Chaque thématique doit contenir entre 2 et 100 caractères'),

  body('registrationRequired')
    .optional()
    .isBoolean().withMessage('Le champ "registrationRequired" doit être un booléen'),

  body('registrationLink')
    .optional()
    .trim()
    .isURL().withMessage('Le lien d\'inscription doit être une URL valide'),

  body('maxParticipants')
    .optional()
    .isInt({ min: 1 }).withMessage('Le nombre maximum de participants doit être un entier positif'),

  body('registrationDeadline')
    .optional()
    .isISO8601().withMessage('La date limite d\'inscription doit être au format ISO 8601')
    .custom((deadline, { req }) => {
      if (deadline && req.body.startDate && new Date(deadline) > new Date(req.body.startDate)) {
        throw new Error('La date limite d\'inscription doit être antérieure à la date de début de l\'événement');
      }
      return true;
    }),

  body('relatedActors')
    .optional()
    .isArray().withMessage('Les acteurs liés doivent être un tableau'),

  body('relatedActors.*')
    .optional()
    .isMongoId().withMessage('Chaque ID d\'acteur doit être un ID MongoDB valide'),

  body('featured')
    .optional()
    .isBoolean().withMessage('Le champ "featured" doit être un booléen'),

  handleValidationErrors
];
