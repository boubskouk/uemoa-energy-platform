const express = require('express');
const router = express.Router();
const energiesController = require('../controllers/energies.controller');

/**
 * @route   GET /api/energies
 * @desc    Récupérer tous les types d'énergies renouvelables
 * @access  Public
 */
router.get('/', energiesController.getEnergies);

/**
 * @route   GET /api/energies/:id
 * @desc    Récupérer un type d'énergie par ID
 * @access  Public
 */
router.get('/:id', energiesController.getEnergyById);

module.exports = router;
