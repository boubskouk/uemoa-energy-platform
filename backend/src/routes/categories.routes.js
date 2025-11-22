const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

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

/**
 * @route   POST /api/categories
 * @desc    Créer une nouvelle catégorie
 * @access  Private (Admin seulement)
 */
router.post(
  '/',
  authenticate,
  isAdmin,
  categoriesController.createCategory
);

/**
 * @route   PUT /api/categories/:id
 * @desc    Mettre à jour une catégorie
 * @access  Private (Admin seulement)
 */
router.put(
  '/:id',
  authenticate,
  isAdmin,
  categoriesController.updateCategory
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Supprimer une catégorie
 * @access  Private (Admin seulement)
 */
router.delete(
  '/:id',
  authenticate,
  isAdmin,
  categoriesController.deleteCategory
);

/**
 * @route   PATCH /api/categories/:id/toggle
 * @desc    Activer/Désactiver une catégorie
 * @access  Private (Admin seulement)
 */
router.patch(
  '/:id/toggle',
  authenticate,
  isAdmin,
  categoriesController.toggleCategory
);

module.exports = router;
