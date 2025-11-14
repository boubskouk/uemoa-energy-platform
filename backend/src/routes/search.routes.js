const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

/**
 * @route   GET /api/search/suggestions
 * @desc    Suggestions de recherche (autocomplétion)
 * @access  Public
 */
router.get(
  '/suggestions',
  searchController.searchSuggestions
);

/**
 * @route   GET /api/search/popular-tags
 * @desc    Récupérer les tags populaires
 * @access  Public
 */
router.get(
  '/popular-tags',
  searchController.getPopularTags
);

/**
 * @route   GET /api/search/tags
 * @desc    Recherche par tag
 * @access  Public
 */
router.get(
  '/tags',
  searchController.searchByTag
);

/**
 * @route   GET /api/search/actors
 * @desc    Recherche dans les acteurs uniquement
 * @access  Public
 */
router.get(
  '/actors',
  searchController.searchActors
);

/**
 * @route   GET /api/search/news
 * @desc    Recherche dans les actualités uniquement
 * @access  Public
 */
router.get(
  '/news',
  searchController.searchNews
);

/**
 * @route   GET /api/search/events
 * @desc    Recherche dans les événements uniquement
 * @access  Public
 */
router.get(
  '/events',
  searchController.searchEvents
);

/**
 * @route   GET /api/search
 * @desc    Recherche globale dans tous les contenus
 * @access  Public
 */
router.get(
  '/',
  searchController.globalSearch
);

module.exports = router;
