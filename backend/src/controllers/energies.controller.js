const Energy = require('../models/Energy');
const { asyncHandler } = require('../middlewares/error.middleware');

/**
 * @desc    Récupérer tous les types d'énergies
 * @route   GET /api/energies
 * @access  Public
 */
exports.getEnergies = asyncHandler(async (req, res) => {
  const energies = await Energy.find({ isActive: true }).sort({ order: 1 });

  res.status(200).json({
    success: true,
    count: energies.length,
    data: energies
  });
});

/**
 * @desc    Récupérer un type d'énergie par ID
 * @route   GET /api/energies/:id
 * @access  Public
 */
exports.getEnergyById = asyncHandler(async (req, res) => {
  const energy = await Energy.findById(req.params.id);

  if (!energy) {
    return res.status(404).json({
      success: false,
      message: 'Type d\'énergie non trouvé.'
    });
  }

  res.status(200).json({
    success: true,
    data: energy
  });
});

/**
 * @desc    Créer un nouveau type d'énergie
 * @route   POST /api/energies
 * @access  Private (Admin seulement)
 */
exports.createEnergy = asyncHandler(async (req, res) => {
  const { name, description, icon, color, order } = req.body;

  // Vérifier si le type d'énergie existe déjà
  const existingEnergy = await Energy.findOne({
    $or: [
      { 'name.fr': name.fr },
      { 'name.en': name.en }
    ]
  });

  if (existingEnergy) {
    return res.status(400).json({
      success: false,
      message: 'Un type d\'énergie avec ce nom existe déjà.'
    });
  }

  const energy = await Energy.create({
    name,
    description,
    icon,
    color,
    order
  });

  res.status(201).json({
    success: true,
    message: 'Type d\'énergie créé avec succès.',
    data: energy
  });
});

/**
 * @desc    Mettre à jour un type d'énergie
 * @route   PUT /api/energies/:id
 * @access  Private (Admin seulement)
 */
exports.updateEnergy = asyncHandler(async (req, res) => {
  let energy = await Energy.findById(req.params.id);

  if (!energy) {
    return res.status(404).json({
      success: false,
      message: 'Type d\'énergie non trouvé.'
    });
  }

  energy = await Energy.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Type d\'énergie mis à jour avec succès.',
    data: energy
  });
});

/**
 * @desc    Supprimer un type d'énergie
 * @route   DELETE /api/energies/:id
 * @access  Private (Admin seulement)
 */
exports.deleteEnergy = asyncHandler(async (req, res) => {
  const energy = await Energy.findById(req.params.id);

  if (!energy) {
    return res.status(404).json({
      success: false,
      message: 'Type d\'énergie non trouvé.'
    });
  }

  // Vérifier si le type d'énergie est utilisé par des acteurs
  const Actor = require('../models/Actor');
  const actorsCount = await Actor.countDocuments({ energyTypes: req.params.id });

  if (actorsCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Ce type d'énergie est utilisé par ${actorsCount} acteur(s). Impossible de le supprimer.`
    });
  }

  await energy.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Type d\'énergie supprimé avec succès.'
  });
});

/**
 * @desc    Activer/Désactiver un type d'énergie
 * @route   PATCH /api/energies/:id/toggle
 * @access  Private (Admin seulement)
 */
exports.toggleEnergy = asyncHandler(async (req, res) => {
  const energy = await Energy.findById(req.params.id);

  if (!energy) {
    return res.status(404).json({
      success: false,
      message: 'Type d\'énergie non trouvé.'
    });
  }

  energy.isActive = !energy.isActive;
  await energy.save();

  res.status(200).json({
    success: true,
    message: energy.isActive ? 'Type d\'énergie activé.' : 'Type d\'énergie désactivé.',
    data: energy
  });
});
