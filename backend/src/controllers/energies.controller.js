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
