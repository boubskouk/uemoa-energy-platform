const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories.controller');

/**
 * @route   GET /api/categories
 * @desc    Récupérer toutes les catégories
 * @access  Public
 */
router.get('/', categoriesController.getCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Récupérer une catégorie par ID
 * @access  Public
 */
router.get('/:id', categoriesController.getCategoryById);

module.exports = router;
