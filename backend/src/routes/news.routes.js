const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');
const newsValidator = require('../validators/news.validator');
const { authenticate, optionalAuth } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

/**
 * @route   GET /api/news/featured
 * @desc    Récupérer les actualités à la une
 * @access  Public
 */
router.get(
  '/featured',
  newsController.getFeaturedNews
);

/**
 * @route   GET /api/news/stats
 * @desc    Récupérer les statistiques des actualités
 * @access  Private (Admin seulement)
 */
router.get(
  '/stats',
  authenticate,
  isAdmin,
  newsController.getNewsStats
);

/**
 * @route   GET /api/news
 * @desc    Récupérer toutes les actualités (avec filtres)
 * @access  Public
 */
router.get(
  '/',
  optionalAuth, // Utilisateur peut être connecté ou non
  newsController.getAllNews
);

/**
 * @route   GET /api/news/:identifier
 * @desc    Récupérer une actualité par ID ou slug
 * @access  Public
 */
router.get(
  '/:identifier',
  optionalAuth,
  newsController.getNewsById
);

/**
 * @route   POST /api/news
 * @desc    Créer une nouvelle actualité
 * @access  Private (Admin seulement)
 */
router.post(
  '/',
  authenticate,
  isAdmin,
  newsValidator.validateCreateNews,
  newsController.createNews
);

/**
 * @route   PUT /api/news/:id
 * @desc    Mettre à jour une actualité
 * @access  Private (Admin ou auteur)
 */
router.put(
  '/:id',
  authenticate,
  newsValidator.validateUpdateNews,
  newsController.updateNews
);

/**
 * @route   DELETE /api/news/:id
 * @desc    Supprimer une actualité
 * @access  Private (Admin ou auteur)
 */
router.delete(
  '/:id',
  authenticate,
  newsController.deleteNews
);

/**
 * @route   PUT /api/news/:id/publish
 * @desc    Publier une actualité
 * @access  Private (Admin seulement)
 */
router.put(
  '/:id/publish',
  authenticate,
  isAdmin,
  newsController.publishNews
);

/**
 * @route   PUT /api/news/:id/unpublish
 * @desc    Dépublier une actualité
 * @access  Private (Admin seulement)
 */
router.put(
  '/:id/unpublish',
  authenticate,
  isAdmin,
  newsController.unpublishNews
);

/**
 * @route   PUT /api/news/:id/feature
 * @desc    Mettre en avant / retirer de la une
 * @access  Private (Admin seulement)
 */
router.put(
  '/:id/feature',
  authenticate,
  isAdmin,
  newsController.toggleFeatureNews
);

/**
 * @route   POST /api/news/:id/view
 * @desc    Incrémenter le compteur de vues
 * @access  Public
 */
router.post(
  '/:id/view',
  newsController.incrementViews
);

module.exports = router;
