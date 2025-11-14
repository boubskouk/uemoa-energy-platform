const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { USER_ROLES } = require('../utils/constants');

/**
 * Toutes les routes nécessitent une authentification et le rôle ADMIN
 */

/**
 * @route   GET /api/users/pending
 * @desc    Récupérer toutes les demandes d'inscription en attente
 * @access  Private/Admin
 */
router.get(
  '/pending',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  userController.getPendingUsers
);

/**
 * @route   GET /api/users
 * @desc    Récupérer tous les utilisateurs
 * @access  Private/Admin
 */
router.get(
  '/',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  userController.getAllUsers
);

/**
 * @route   GET /api/users/:userId
 * @desc    Récupérer un utilisateur par ID
 * @access  Private/Admin
 */
router.get(
  '/:userId',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  userController.getUserById
);

/**
 * @route   PUT /api/users/:userId/approve
 * @desc    Approuver une demande d'inscription
 * @access  Private/Admin
 */
router.put(
  '/:userId/approve',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  userController.approveUser
);

/**
 * @route   PUT /api/users/:userId/reject
 * @desc    Rejeter une demande d'inscription
 * @access  Private/Admin
 */
router.put(
  '/:userId/reject',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  userController.rejectUser
);

/**
 * @route   PUT /api/users/:userId/role
 * @desc    Mettre à jour le rôle d'un utilisateur
 * @access  Private/Admin
 */
router.put(
  '/:userId/role',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  userController.updateUserRole
);

/**
 * @route   PUT /api/users/:userId/toggle-active
 * @desc    Activer/Désactiver un utilisateur
 * @access  Private/Admin
 */
router.put(
  '/:userId/toggle-active',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  userController.toggleUserActive
);

module.exports = router;
