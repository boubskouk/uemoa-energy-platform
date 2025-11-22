const express = require('express');
const router = express.Router();
const energiesController = require('../controllers/energies.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

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

/**
 * @route   POST /api/energies
 * @desc    Créer un nouveau type d'énergie
 * @access  Private (Admin seulement)
 */
router.post(
  '/',
  authenticate,
  isAdmin,
  energiesController.createEnergy
);

/**
 * @route   PUT /api/energies/:id
 * @desc    Mettre à jour un type d'énergie
 * @access  Private (Admin seulement)
 */
router.put(
  '/:id',
  authenticate,
  isAdmin,
  energiesController.updateEnergy
);

/**
 * @route   DELETE /api/energies/:id
 * @desc    Supprimer un type d'énergie
 * @access  Private (Admin seulement)
 */
router.delete(
  '/:id',
  authenticate,
  isAdmin,
  energiesController.deleteEnergy
);

/**
 * @route   PATCH /api/energies/:id/toggle
 * @desc    Activer/Désactiver un type d'énergie
 * @access  Private (Admin seulement)
 */
router.patch(
  '/:id/toggle',
  authenticate,
  isAdmin,
  energiesController.toggleEnergy
);

module.exports = router;
