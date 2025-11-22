const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

/**
 * @route   GET /api/stats/overview
 * @desc    Récupérer les statistiques globales
 * @access  Public
 */
router.get('/overview', statsController.getOverviewStats);

/**
 * @route   GET /api/stats/by-country
 * @desc    Statistiques par pays
 * @access  Public
 */
router.get('/by-country', statsController.getStatsByCountry);

/**
 * @route   GET /api/stats/by-energy
 * @desc    Statistiques par type d'énergie
 * @access  Public
 */
router.get('/by-energy', statsController.getStatsByEnergy);

/**
 * @route   GET /api/stats/by-category
 * @desc    Statistiques par catégorie
 * @access  Public
 */
router.get('/by-category', statsController.getStatsByCategory);

/**
 * @route   GET /api/stats/by-actor-type
 * @desc    Statistiques par type d'acteur
 * @access  Public
 */
router.get('/by-actor-type', statsController.getStatsByActorType);

/**
 * @route   GET /api/stats/timeline
 * @desc    Statistiques d'évolution temporelle
 * @access  Public
 */
router.get('/timeline', statsController.getTimelineStats);

/**
 * @route   GET /api/stats/top-actors
 * @desc    Top acteurs (plus vus, contactés, etc.)
 * @access  Public
 */
router.get('/top-actors', statsController.getTopActors);

/**
 * @route   GET /api/stats/admin-dashboard
 * @desc    Dashboard administrateur - Stats complètes
 * @access  Private (Admin seulement)
 */
router.get(
  '/admin-dashboard',
  authenticate,
  isAdmin,
  statsController.getAdminDashboard
);

module.exports = router;
