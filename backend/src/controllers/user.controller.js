const User = require('../models/User');
const { asyncHandler } = require('../middlewares/error.middleware');
const emailService = require('../services/email.service');

/**
 * @desc    Récupérer toutes les demandes d'inscription en attente
 * @route   GET /api/users/pending
 * @access  Private/Admin
 */
exports.getPendingUsers = asyncHandler(async (req, res) => {
  const pendingUsers = await User.find({ accountStatus: 'pending' })
    .select('-password')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: pendingUsers.length,
    users: pendingUsers
  });
});

/**
 * @desc    Récupérer tous les utilisateurs
 * @route   GET /api/users
 * @access  Private/Admin
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { status, role } = req.query;

  // Construire le filtre
  const filter = {};
  if (status) filter.accountStatus = status;
  if (role) filter.role = role;

  const users = await User.find(filter)
    .select('-password')
    .populate('actorId', 'name type')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    users
  });
});

/**
 * @desc    Approuver une demande d'inscription
 * @route   PUT /api/users/:userId/approve
 * @access  Private/Admin
 */
exports.approveUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé.'
    });
  }

  if (user.accountStatus === 'approved') {
    return res.status(400).json({
      success: false,
      message: 'Ce compte a déjà été approuvé.'
    });
  }

  // Mettre à jour le statut
  user.accountStatus = 'approved';
  user.approvedBy = req.user._id;
  user.approvedAt = new Date();
  await user.save();

  // Envoyer un email de confirmation à l'utilisateur
  try {
    await emailService.sendAccountApprovedEmail(user);
    console.log('✅ Email d\'approbation envoyé à l\'utilisateur');
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email d\'approbation:', error);
  }

  res.status(200).json({
    success: true,
    message: 'Le compte utilisateur a été approuvé avec succès.',
    user: {
      _id: user._id,
      email: user.email,
      accountStatus: user.accountStatus,
      approvedAt: user.approvedAt
    }
  });
});

/**
 * @desc    Rejeter une demande d'inscription
 * @route   PUT /api/users/:userId/reject
 * @access  Private/Admin
 */
exports.rejectUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { reason } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé.'
    });
  }

  if (user.accountStatus === 'rejected') {
    return res.status(400).json({
      success: false,
      message: 'Ce compte a déjà été rejeté.'
    });
  }

  // Mettre à jour le statut
  user.accountStatus = 'rejected';
  user.rejectionReason = reason || 'Non spécifié';
  await user.save();

  // Envoyer un email de rejet à l'utilisateur
  try {
    await emailService.sendAccountRejectedEmail(user, reason);
    console.log('✅ Email de rejet envoyé à l\'utilisateur');
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email de rejet:', error);
  }

  res.status(200).json({
    success: true,
    message: 'La demande d\'inscription a été rejetée.',
    user: {
      _id: user._id,
      email: user.email,
      accountStatus: user.accountStatus,
      rejectionReason: user.rejectionReason
    }
  });
});

/**
 * @desc    Récupérer un utilisateur par ID
 * @route   GET /api/users/:userId
 * @access  Private/Admin
 */
exports.getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId)
    .select('-password')
    .populate('actorId', 'name type logo')
    .populate('approvedBy', 'email profile.firstName profile.lastName');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé.'
    });
  }

  res.status(200).json({
    success: true,
    user
  });
});

/**
 * @desc    Mettre à jour le rôle d'un utilisateur
 * @route   PUT /api/users/:userId/role
 * @access  Private/Admin
 */
exports.updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({
      success: false,
      message: 'Le rôle est requis.'
    });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé.'
    });
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Le rôle de l\'utilisateur a été mis à jour.',
    user: {
      _id: user._id,
      email: user.email,
      role: user.role
    }
  });
});

/**
 * @desc    Activer/Désactiver un utilisateur
 * @route   PUT /api/users/:userId/toggle-active
 * @access  Private/Admin
 */
exports.toggleUserActive = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé.'
    });
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({
    success: true,
    message: `L'utilisateur a été ${user.isActive ? 'activé' : 'désactivé'}.`,
    user: {
      _id: user._id,
      email: user.email,
      isActive: user.isActive
    }
  });
});
