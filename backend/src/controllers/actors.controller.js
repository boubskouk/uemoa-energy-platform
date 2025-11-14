const Actor = require('../models/Actor');
const User = require('../models/User');
const { asyncHandler } = require('../middlewares/error.middleware');
const { generateSlug, generateUniqueSlug } = require('../utils/slugify');

/**
 * @desc    Récupérer tous les acteurs (avec filtres et pagination)
 * @route   GET /api/actors
 * @access  Public
 */
exports.getActors = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    country,
    type,
    status,
    category,
    energy,
    search,
    featured,
    verified
  } = req.query;

  // Construire le filtre
  const filter = {};

  // Filtre par statut (par défaut, montrer seulement les approuvés en public)
  if (status) {
    filter.status = status;
  } else {
    // Si l'utilisateur n'est pas admin, montrer seulement les acteurs approuvés
    if (!req.user || req.user.role !== 'admin') {
      filter.status = 'approved';
    }
  }

  if (country) filter.country = country;
  if (type) filter.type = type;
  if (category) filter.categories = category;
  if (energy) filter.energyTypes = energy;
  if (featured) filter.featured = featured === 'true';
  if (verified) filter.verified = verified === 'true';

  // Recherche textuelle
  if (search) {
    filter.$text = { $search: search };
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Exécuter la requête
  const actors = await Actor.find(filter)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  // Compter le total
  const total = await Actor.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: actors.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: actors
  });
});

/**
 * @desc    Récupérer un acteur par ID
 * @route   GET /api/actors/:id
 * @access  Public
 */
exports.getActorById = asyncHandler(async (req, res) => {
  const actor = await Actor.findById(req.params.id)
    .populate('createdBy', 'profile.firstName profile.lastName email');

  if (!actor) {
    return res.status(404).json({
      success: false,
      message: 'Acteur non trouvé.'
    });
  }

  // Incrémenter les vues
  await actor.incrementViews();

  res.status(200).json({
    success: true,
    data: actor
  });
});

/**
 * @desc    Créer un nouvel acteur
 * @route   POST /api/actors
 * @access  Private
 */
exports.createActor = asyncHandler(async (req, res) => {
  const {
    name,
    acronym,
    type,
    categories,
    energyTypes,
    country,
    city,
    address,
    location,
    contact,
    description,
    yearFounded,
    employeesCount,
    certifications,
    projects,
    gallery,
    documents
  } = req.body;

  // Vérifier que l'utilisateur n'a pas déjà un acteur
  const existingActor = await Actor.findOne({ createdBy: req.user._id });
  if (existingActor && req.user.role !== 'admin') {
    return res.status(400).json({
      success: false,
      message: 'Vous avez déjà créé un profil d\'acteur. Vous ne pouvez en créer qu\'un seul.'
    });
  }

  // Créer l'acteur
  const actor = await Actor.create({
    name,
    acronym,
    type,
    categories,
    energyTypes,
    country,
    city,
    address,
    location,
    contact,
    description,
    yearFounded,
    employeesCount,
    certifications,
    projects,
    gallery,
    documents,
    createdBy: req.user._id,
    status: req.user.role === 'admin' ? 'approved' : 'pending', // Admin peut créer directement approuvé
    verified: req.user.role === 'admin'
  });

  // Lier l'acteur à l'utilisateur
  await User.findByIdAndUpdate(req.user._id, { actorId: actor._id });

  res.status(201).json({
    success: true,
    message: req.user.role === 'admin'
      ? 'Acteur créé et approuvé avec succès.'
      : 'Acteur créé avec succès. En attente d\'approbation par l\'administrateur.',
    data: actor
  });
});

/**
 * @desc    Mettre à jour un acteur
 * @route   PUT /api/actors/:id
 * @access  Private (Owner ou Admin)
 */
exports.updateActor = asyncHandler(async (req, res) => {
  let actor = await Actor.findById(req.params.id);

  if (!actor) {
    return res.status(404).json({
      success: false,
      message: 'Acteur non trouvé.'
    });
  }

  // Vérifier les permissions
  if (req.user.role !== 'admin' && actor.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Vous n\'avez pas la permission de modifier cet acteur.'
    });
  }

  // Mettre à jour
  actor = await Actor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Acteur mis à jour avec succès.',
    data: actor
  });
});

/**
 * @desc    Supprimer un acteur
 * @route   DELETE /api/actors/:id
 * @access  Private (Owner ou Admin)
 */
exports.deleteActor = asyncHandler(async (req, res) => {
  const actor = await Actor.findById(req.params.id);

  if (!actor) {
    return res.status(404).json({
      success: false,
      message: 'Acteur non trouvé.'
    });
  }

  // Vérifier les permissions
  if (req.user.role !== 'admin' && actor.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Vous n\'avez pas la permission de supprimer cet acteur.'
    });
  }

  await actor.deleteOne();

  // Retirer le lien de l'utilisateur
  await User.findByIdAndUpdate(actor.createdBy, { actorId: null });

  res.status(200).json({
    success: true,
    message: 'Acteur supprimé avec succès.'
  });
});

/**
 * @desc    Approuver un acteur
 * @route   PATCH /api/actors/:id/approve
 * @access  Private (Admin seulement)
 */
exports.approveActor = asyncHandler(async (req, res) => {
  const actor = await Actor.findById(req.params.id);

  if (!actor) {
    return res.status(404).json({
      success: false,
      message: 'Acteur non trouvé.'
    });
  }

  // Mettre à jour le statut
  actor.status = 'approved';
  actor.verified = true;
  actor.approvedAt = new Date();
  actor.approvedBy = req.user._id;
  await actor.save();

  // Changer le rôle de l'utilisateur de visitor à actor
  await User.findByIdAndUpdate(actor.createdBy, { role: 'actor' });

  res.status(200).json({
    success: true,
    message: 'Acteur approuvé avec succès.',
    data: actor
  });
});

/**
 * @desc    Rejeter un acteur
 * @route   PATCH /api/actors/:id/reject
 * @access  Private (Admin seulement)
 */
exports.rejectActor = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const actor = await Actor.findById(req.params.id);

  if (!actor) {
    return res.status(404).json({
      success: false,
      message: 'Acteur non trouvé.'
    });
  }

  actor.status = 'rejected';
  await actor.save();

  res.status(200).json({
    success: true,
    message: 'Acteur rejeté.',
    data: actor
  });
});

/**
 * @desc    Récupérer le profil de l'acteur connecté
 * @route   GET /api/actors/me
 * @access  Private
 */
exports.getMyActor = asyncHandler(async (req, res) => {
  const actor = await Actor.findOne({ createdBy: req.user._id });

  if (!actor) {
    return res.status(404).json({
      success: false,
      message: 'Vous n\'avez pas encore créé de profil d\'acteur.'
    });
  }

  res.status(200).json({
    success: true,
    data: actor
  });
});

/**
 * @desc    Récupérer les acteurs en attente d'approbation
 * @route   GET /api/actors/pending
 * @access  Private (Admin seulement)
 */
exports.getPendingActors = asyncHandler(async (req, res) => {
  const actors = await Actor.find({ status: 'pending' })
    .populate('createdBy', 'profile.firstName profile.lastName email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: actors.length,
    data: actors
  });
});

/**
 * @desc    Mettre en vedette un acteur
 * @route   PATCH /api/actors/:id/feature
 * @access  Private (Admin seulement)
 */
exports.featureActor = asyncHandler(async (req, res) => {
  const actor = await Actor.findById(req.params.id);

  if (!actor) {
    return res.status(404).json({
      success: false,
      message: 'Acteur non trouvé.'
    });
  }

  actor.featured = !actor.featured;
  await actor.save();

  res.status(200).json({
    success: true,
    message: actor.featured ? 'Acteur mis en vedette.' : 'Acteur retiré de la vedette.',
    data: actor
  });
});
