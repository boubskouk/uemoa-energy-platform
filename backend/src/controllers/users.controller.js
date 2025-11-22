const User = require('../models/User');
const { asyncHandler } = require('../middlewares/error.middleware');

/**
 * @desc    Récupérer tous les utilisateurs
 * @route   GET /api/users
 * @access  Admin
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { role, status, search, page = 1, limit = 10 } = req.query;

  // Construction de la requête
  const query = {};

  if (role) {
    query.role = role;
  }

  if (status) {
    query.accountStatus = status;
  }

  if (search) {
    query.$or = [
      { email: { $regex: search, $options: 'i' } },
      { 'profile.firstName': { $regex: search, $options: 'i' } },
      { 'profile.lastName': { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('actorId', 'name logo'),
    User.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      limit: parseInt(limit)
    }
  });
});

/**
 * @desc    Récupérer un utilisateur par ID
 * @route   GET /api/users/:id
 * @access  Admin
 */
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate('actorId', 'name logo description');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé'
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Modifier le rôle d'un utilisateur
 * @route   PATCH /api/users/:id/role
 * @access  Admin
 */
exports.updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  // Vérifier que le rôle est valide
  const validRoles = ['visitor', 'actor', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Rôle invalide. Les rôles autorisés sont: ' + validRoles.join(', ')
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé'
    });
  }

  // Empêcher de modifier son propre rôle
  if (user._id.toString() === req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Vous ne pouvez pas modifier votre propre rôle'
    });
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Rôle modifié avec succès',
    data: user
  });
});

/**
 * @desc    Modifier le statut d'un utilisateur
 * @route   PATCH /api/users/:id/status
 * @access  Admin
 */
exports.updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  // Vérifier que le statut est valide
  const validStatuses = ['pending', 'approved', 'rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Statut invalide. Les statuts autorisés sont: ' + validStatuses.join(', ')
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé'
    });
  }

  user.accountStatus = status;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Statut modifié avec succès',
    data: user
  });
});

/**
 * @desc    Activer/Désactiver un utilisateur
 * @route   PATCH /api/users/:id/toggle-active
 * @access  Admin
 */
exports.toggleUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé'
    });
  }

  // Empêcher de se désactiver soi-même
  if (user._id.toString() === req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Vous ne pouvez pas désactiver votre propre compte'
    });
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({
    success: true,
    message: `Utilisateur ${user.isActive ? 'activé' : 'désactivé'} avec succès`,
    data: user
  });
});

/**
 * @desc    Supprimer un utilisateur
 * @route   DELETE /api/users/:id
 * @access  Admin
 */
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé'
    });
  }

  // Empêcher de se supprimer soi-même
  if (user._id.toString() === req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Vous ne pouvez pas supprimer votre propre compte'
    });
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Utilisateur supprimé avec succès'
  });
});

/**
 * @desc    Mettre à jour un utilisateur
 * @route   PUT /api/users/:id
 * @access  Admin
 */
exports.updateUser = asyncHandler(async (req, res) => {
  const { email, profile, role, accountStatus, isActive } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé'
    });
  }

  // Vérifier si l'email existe déjà (si changé)
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }
    user.email = email;
  }

  if (profile) {
    user.profile = { ...user.profile, ...profile };
  }

  if (role && req.user.id !== user._id.toString()) {
    user.role = role;
  }

  if (accountStatus) {
    user.accountStatus = accountStatus;
  }

  if (typeof isActive !== 'undefined' && req.user.id !== user._id.toString()) {
    user.isActive = isActive;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Utilisateur mis à jour avec succès',
    data: user
  });
});

/**
 * @desc    Obtenir les statistiques des utilisateurs
 * @route   GET /api/users/stats
 * @access  Admin
 */
exports.getUsersStats = asyncHandler(async (req, res) => {
  const [total, byRole, byStatus, recentUsers] = await Promise.all([
    User.countDocuments(),
    User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]),
    User.aggregate([
      { $group: { _id: '$accountStatus', count: { $sum: 1 } } }
    ]),
    User.find()
      .select('email profile role accountStatus createdAt')
      .sort({ createdAt: -1 })
      .limit(5)
  ]);

  res.status(200).json({
    success: true,
    data: {
      total,
      byRole,
      byStatus,
      recentUsers
    }
  });
});
