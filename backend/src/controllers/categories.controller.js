const Category = require('../models/Category');
const { asyncHandler } = require('../middlewares/error.middleware');

/**
 * @desc    Récupérer toutes les catégories
 * @route   GET /api/categories
 * @access  Public
 */
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ order: 1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

/**
 * @desc    Récupérer une catégorie par ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
exports.getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Catégorie non trouvée.'
    });
  }

  res.status(200).json({
    success: true,
    data: category
  });
});
