const express = require('express');
const router = express.Router();
const setupController = require('../controllers/setup.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

/**
 * @route   GET /api/setup/init-actors
 * @desc    Initialiser les acteurs réels UEMOA
 * @access  Admin only (ou Public pour première installation)
 * @query   force=true pour réinitialiser si des acteurs existent
 */
router.get('/init-actors', setupController.initRealActors);

/**
 * @route   GET /api/setup/stats
 * @desc    Obtenir les statistiques des acteurs
 * @access  Public
 */
router.get('/stats', setupController.getStats);

module.exports = router;
