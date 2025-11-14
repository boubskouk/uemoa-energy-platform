const express = require('express');
const router = express.Router();
const actorsController = require('../controllers/actors.controller');
const actorValidator = require('../validators/actor.validator');
const { authenticate, optionalAuth } = require('../middlewares/auth.middleware');
const { isAdmin, isAdminOrActor } = require('../middlewares/role.middleware');

/**
 * @route   GET /api/actors
 * @desc    Récupérer tous les acteurs (avec filtres)
 * @access  Public
 */
router.get(
  '/',
  optionalAuth, // Utilisateur peut être connecté ou non
  actorsController.getActors
);

/**
 * @route   GET /api/actors/me
 * @desc    Récupérer mon profil d'acteur
 * @access  Private
 */
router.get(
  '/me',
  authenticate,
  actorsController.getMyActor
);

/**
 * @route   GET /api/actors/pending
 * @desc    Récupérer les acteurs en attente d'approbation
 * @access  Private (Admin seulement)
 */
router.get(
  '/pending',
  authenticate,
  isAdmin,
  actorsController.getPendingActors
);

/**
 * @route   GET /api/actors/:id
 * @desc    Récupérer un acteur par ID
 * @access  Public
 */
router.get(
  '/:id',
  actorsController.getActorById
);

/**
 * @route   POST /api/actors
 * @desc    Créer un nouvel acteur
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  actorValidator.validateCreateActor,
  actorsController.createActor
);

/**
 * @route   PUT /api/actors/:id
 * @desc    Mettre à jour un acteur
 * @access  Private (Owner ou Admin)
 */
router.put(
  '/:id',
  authenticate,
  actorValidator.validateUpdateActor,
  actorsController.updateActor
);

/**
 * @route   DELETE /api/actors/:id
 * @desc    Supprimer un acteur
 * @access  Private (Owner ou Admin)
 */
router.delete(
  '/:id',
  authenticate,
  actorsController.deleteActor
);

/**
 * @route   PATCH /api/actors/:id/approve
 * @desc    Approuver un acteur
 * @access  Private (Admin seulement)
 */
router.patch(
  '/:id/approve',
  authenticate,
  isAdmin,
  actorsController.approveActor
);

/**
 * @route   PATCH /api/actors/:id/reject
 * @desc    Rejeter un acteur
 * @access  Private (Admin seulement)
 */
router.patch(
  '/:id/reject',
  authenticate,
  isAdmin,
  actorsController.rejectActor
);

/**
 * @route   PATCH /api/actors/:id/feature
 * @desc    Mettre en vedette / retirer de la vedette un acteur
 * @access  Private (Admin seulement)
 */
router.patch(
  '/:id/feature',
  authenticate,
  isAdmin,
  actorsController.featureActor
);

module.exports = router;
