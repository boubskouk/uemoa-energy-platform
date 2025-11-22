const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const { asyncHandler } = require('../middlewares/error.middleware');
const emailService = require('../services/email.service');

/**
 * @desc    Inscription d'un nouvel utilisateur
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res) => {
  const { email, password, profile } = req.body;

  // Vérifier si l'email existe déjà
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Cet email est déjà utilisé.'
    });
  }

  // Créer l'utilisateur avec le statut "pending"
  const user = await User.create({
    email,
    password,
    profile: {
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      phone: profile?.phone
    },
    role: 'visitor', // Par défaut, un nouvel utilisateur est visitor
    language: 'fr',
    consentGiven: true,
    consentDate: new Date(),
    accountStatus: 'pending' // En attente d'approbation
  });

  // Envoyer une notification à l'administrateur
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    try {
      await emailService.sendRegistrationRequestToAdmin(user, adminEmail);
      console.log('✅ Email de notification envoyé à l\'admin');
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email à l\'admin:', error);
      // On continue même si l'email échoue
    }
  }

  res.status(201).json({
    success: true,
    message: 'Votre demande d\'inscription a été envoyée. Vous recevrez un email une fois votre compte approuvé par l\'administrateur.',
    user: {
      _id: user._id,
      email: user.email,
      role: user.role,
      profile: user.profile,
      accountStatus: user.accountStatus
    }
  });
});

/**
 * @desc    Connexion d'un utilisateur
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('🔵 Tentative de connexion reçue');
  console.log('📧 Email:', email);
  console.log('🔑 Password fourni:', password ? 'OUI (longueur: ' + password.length + ')' : 'NON');

  // Vérifier que l'email et le mot de passe sont fournis
  if (!email || !password) {
    console.log('❌ Email ou mot de passe manquant');
    return res.status(400).json({
      success: false,
      message: 'Veuillez fournir un email et un mot de passe.'
    });
  }

  // Trouver l'utilisateur avec le mot de passe (select: false par défaut)
  console.log('🔍 Recherche de l\'utilisateur:', email);
  const user = await User.findOne({ email }).select('+password');
  console.log('👤 Utilisateur trouvé:', user ? 'OUI' : 'NON');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Email ou mot de passe incorrect.'
    });
  }

  // Vérifier le mot de passe
  console.log('🔐 Vérification du mot de passe...');
  const isPasswordValid = await user.comparePassword(password);
  console.log('✓ Résultat de la comparaison:', isPasswordValid ? 'VALIDE ✅' : 'INVALIDE ❌');

  if (!isPasswordValid) {
    console.log('❌ Mot de passe incorrect pour:', email);
    return res.status(401).json({
      success: false,
      message: 'Email ou mot de passe incorrect.'
    });
  }

  console.log('✅ Mot de passe valide! Génération du token...');

  // Vérifier que le compte est actif
  if (!user.isActive) {
    console.log('❌ Compte inactif');
    return res.status(403).json({
      success: false,
      message: 'Votre compte a été désactivé. Veuillez contacter l\'administrateur.'
    });
  }
  console.log('✓ Compte actif');

  // Vérifier le statut d'approbation du compte
  if (user.accountStatus === 'pending') {
    console.log('❌ Compte en attente d\'approbation');
    return res.status(403).json({
      success: false,
      message: 'Votre compte est en attente d\'approbation par l\'administrateur. Vous recevrez un email une fois votre compte approuvé.'
    });
  }

  if (user.accountStatus === 'rejected') {
    console.log('❌ Compte rejeté');
    return res.status(403).json({
      success: false,
      message: 'Votre demande d\'inscription a été refusée. Veuillez contacter l\'administrateur pour plus d\'informations.'
    });
  }
  console.log('✓ Statut du compte: ' + user.accountStatus);

  // Générer le token JWT
  console.log('🔑 Génération du token JWT...');
  const token = generateToken(user);
  console.log('✓ Token généré:', token.substring(0, 30) + '...');

  // Retourner l'utilisateur sans le mot de passe
  console.log('👤 Récupération des données utilisateur...');
  try {
    const userWithoutPassword = await User.findById(user._id).populate('actorId', 'name logo');
    console.log('✓ Utilisateur récupéré');

    console.log('📤 Envoi de la réponse...');
    res.status(200).json({
      success: true,
      message: 'Connexion réussie !',
      token,
      user: userWithoutPassword
    });
    console.log('✅ Réponse envoyée avec succès!');
  } catch (populateError) {
    console.error('⚠️ Erreur lors du populate, envoi sans populate:', populateError.message);
    // Si populate échoue, renvoyer l'utilisateur sans le populate
    const userObj = user.toObject();
    delete userObj.password;

    console.log('📤 Envoi de la réponse (sans populate)...');
    res.status(200).json({
      success: true,
      message: 'Connexion réussie !',
      token,
      user: userObj
    });
    console.log('✅ Réponse envoyée avec succès (sans populate)!');
  }
});

/**
 * @desc    Récupérer l'utilisateur connecté
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res) => {
  // req.user est défini par le middleware authenticate
  const user = await User.findById(req.user._id).populate('actorId', 'name logo type status');

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
 * @desc    Déconnexion (côté client seulement)
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res) => {
  // Avec JWT, la déconnexion se fait côté client en supprimant le token
  // On peut optionnellement logger l'événement ici

  res.status(200).json({
    success: true,
    message: 'Déconnexion réussie.'
  });
});

/**
 * @desc    Mettre à jour le profil utilisateur
 * @route   PUT /api/auth/profile
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, language } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé.'
    });
  }

  // Mettre à jour les champs
  if (firstName) user.profile.firstName = firstName;
  if (lastName) user.profile.lastName = lastName;
  if (phone) user.profile.phone = phone;
  if (language) user.language = language;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profil mis à jour avec succès.',
    user
  });
});

/**
 * @desc    Changer le mot de passe
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Veuillez fournir l\'ancien et le nouveau mot de passe.'
    });
  }

  // Récupérer l'utilisateur avec le mot de passe
  const user = await User.findById(req.user._id).select('+password');

  // Vérifier l'ancien mot de passe
  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Mot de passe actuel incorrect.'
    });
  }

  // Mettre à jour le mot de passe
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Mot de passe modifié avec succès.'
  });
});
