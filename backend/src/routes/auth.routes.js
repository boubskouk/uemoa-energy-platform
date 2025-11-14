const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authValidator = require('../validators/auth.validator');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * @route   POST /api/auth/register
 * @desc    Inscription d'un nouvel utilisateur
 * @access  Public
 */
router.post(
  '/register',
  authValidator.validateRegister,
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Connexion d'un utilisateur
 * @access  Public
 */
router.post(
  '/login',
  authValidator.validateLogin,
  authController.login
);

/**
 * @route   GET /api/auth/me
 * @desc    Récupérer l'utilisateur connecté
 * @access  Private
 */
router.get(
  '/me',
  authenticate,
  authController.getMe
);

/**
 * @route   POST /api/auth/logout
 * @desc    Déconnexion (côté client)
 * @access  Private
 */
router.post(
  '/logout',
  authenticate,
  authController.logout
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Mettre à jour le profil utilisateur
 * @access  Private
 */
router.put(
  '/profile',
  authenticate,
  authValidator.validateUpdateProfile,
  authController.updateProfile
);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Changer le mot de passe
 * @access  Private
 */
router.put(
  '/change-password',
  authenticate,
  authValidator.validateChangePassword,
  authController.changePassword
);

module.exports = router;
