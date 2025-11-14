const Country = require('../models/Country');
const Actor = require('../models/Actor');
const { asyncHandler } = require('../middlewares/error.middleware');

/**
 * @desc    Récupérer tous les pays
 * @route   GET /api/countries
 * @access  Public
 */
exports.getCountries = asyncHandler(async (req, res) => {
  const countries = await Country.find({ isActive: true }).sort({ order: 1 });

  res.status(200).json({
    success: true,
    count: countries.length,
    data: countries
  });
});

/**
 * @desc    Récupérer un pays par ID
 * @route   GET /api/countries/:id
 * @access  Public
 */
exports.getCountryById = asyncHandler(async (req, res) => {
  const country = await Country.findById(req.params.id);

  if (!country) {
    return res.status(404).json({
      success: false,
      message: 'Pays non trouvé.'
    });
  }

  res.status(200).json({
    success: true,
    data: country
  });
});

/**
 * @desc    Récupérer les acteurs d'un pays
 * @route   GET /api/countries/:id/actors
 * @access  Public
 */
exports.getCountryActors = asyncHandler(async (req, res) => {
  const country = await Country.findById(req.params.id);

  if (!country) {
    return res.status(404).json({
      success: false,
      message: 'Pays non trouvé.'
    });
  }

  const actors = await Actor.find({
    country: req.params.id,
    status: 'approved'
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    country: country.name,
    count: actors.length,
    data: actors
  });
});
