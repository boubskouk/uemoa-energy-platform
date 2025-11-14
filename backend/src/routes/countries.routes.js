const express = require('express');
const router = express.Router();
const countriesController = require('../controllers/countries.controller');

/**
 * @route   GET /api/countries
 * @desc    Récupérer tous les pays UEMOA
 * @access  Public
 */
router.get('/', countriesController.getCountries);

/**
 * @route   GET /api/countries/:id
 * @desc    Récupérer un pays par ID
 * @access  Public
 */
router.get('/:id', countriesController.getCountryById);

/**
 * @route   GET /api/countries/:id/actors
 * @desc    Récupérer les acteurs d'un pays
 * @access  Public
 */
router.get('/:id/actors', countriesController.getCountryActors);

module.exports = router;
