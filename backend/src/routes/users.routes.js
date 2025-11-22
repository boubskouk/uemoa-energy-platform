const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  toggleUserActive,
  deleteUser,
  updateUser,
  getUsersStats
} = require('../controllers/users.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Toutes les routes nécessitent une authentification admin
router.use(protect);
router.use(authorize('admin'));

// Routes statistiques (avant /:id pour éviter les conflits)
router.get('/stats', getUsersStats);

// Routes CRUD
router.route('/')
  .get(getAllUsers);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// Routes d'actions spécifiques
router.patch('/:id/role', updateUserRole);
router.patch('/:id/status', updateUserStatus);
router.patch('/:id/toggle-active', toggleUserActive);

module.exports = router;
