const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events.controller');
const eventValidator = require('../validators/event.validator');
const { authenticate } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

/**
 * @route   GET /api/events/upcoming
 * @desc    Récupérer les événements à venir
 * @access  Public
 */
router.get(
  '/upcoming',
  eventsController.getUpcomingEvents
);

/**
 * @route   GET /api/events/featured
 * @desc    Récupérer les événements en vedette
 * @access  Public
 */
router.get(
  '/featured',
  eventsController.getFeaturedEvents
);

/**
 * @route   GET /api/events/ongoing
 * @desc    Récupérer les événements en cours
 * @access  Public
 */
router.get(
  '/ongoing',
  eventsController.getOngoingEvents
);

/**
 * @route   GET /api/events/nearby
 * @desc    Rechercher des événements à proximité (géolocalisation)
 * @access  Public
 */
router.get(
  '/nearby',
  eventsController.getNearbyEvents
);

/**
 * @route   GET /api/events/stats
 * @desc    Récupérer les statistiques des événements
 * @access  Private (Admin seulement)
 */
router.get(
  '/stats',
  authenticate,
  isAdmin,
  eventsController.getEventsStats
);

/**
 * @route   GET /api/events/country/:countryId
 * @desc    Récupérer les événements par pays
 * @access  Public
 */
router.get(
  '/country/:countryId',
  eventsController.getEventsByCountry
);

/**
 * @route   GET /api/events
 * @desc    Récupérer tous les événements (avec filtres)
 * @access  Public
 */
router.get(
  '/',
  eventsController.getAllEvents
);

/**
 * @route   GET /api/events/:identifier
 * @desc    Récupérer un événement par ID ou slug
 * @access  Public
 */
router.get(
  '/:identifier',
  eventsController.getEventById
);

/**
 * @route   POST /api/events
 * @desc    Créer un nouvel événement
 * @access  Private (Admin seulement)
 */
router.post(
  '/',
  authenticate,
  isAdmin,
  eventValidator.validateCreateEvent,
  eventsController.createEvent
);

/**
 * @route   PUT /api/events/:id
 * @desc    Mettre à jour un événement
 * @access  Private (Admin ou créateur)
 */
router.put(
  '/:id',
  authenticate,
  eventValidator.validateUpdateEvent,
  eventsController.updateEvent
);

/**
 * @route   DELETE /api/events/:id
 * @desc    Supprimer un événement
 * @access  Private (Admin ou créateur)
 */
router.delete(
  '/:id',
  authenticate,
  eventsController.deleteEvent
);

/**
 * @route   PUT /api/events/:id/feature
 * @desc    Mettre en vedette / retirer de la vedette
 * @access  Private (Admin seulement)
 */
router.put(
  '/:id/feature',
  authenticate,
  isAdmin,
  eventsController.toggleFeatureEvent
);

/**
 * @route   PUT /api/events/:id/cancel
 * @desc    Annuler un événement
 * @access  Private (Admin ou créateur)
 */
router.put(
  '/:id/cancel',
  authenticate,
  eventsController.cancelEvent
);

/**
 * @route   POST /api/events/:id/view
 * @desc    Incrémenter le compteur de vues
 * @access  Public
 */
router.post(
  '/:id/view',
  eventsController.incrementViews
);

/**
 * @route   POST /api/events/:id/interested
 * @desc    Marquer son intérêt pour un événement
 * @access  Public
 */
router.post(
  '/:id/interested',
  eventsController.incrementInterested
);

module.exports = router;
