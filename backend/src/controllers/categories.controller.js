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

/**
 * @desc    Créer une nouvelle catégorie
 * @route   POST /api/categories
 * @access  Private (Admin seulement)
 */
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon, color, order } = req.body;

  // Vérifier si la catégorie existe déjà
  const existingCategory = await Category.findOne({
    $or: [
      { 'name.fr': name.fr },
      { 'name.en': name.en }
    ]
  });

  if (existingCategory) {
    return res.status(400).json({
      success: false,
      message: 'Une catégorie avec ce nom existe déjà.'
    });
  }

  const category = await Category.create({
    name,
    description,
    icon,
    color,
    order
  });

  res.status(201).json({
    success: true,
    message: 'Catégorie créée avec succès.',
    data: category
  });
});

/**
 * @desc    Mettre à jour une catégorie
 * @route   PUT /api/categories/:id
 * @access  Private (Admin seulement)
 */
exports.updateCategory = asyncHandler(async (req, res) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Catégorie non trouvée.'
    });
  }

  category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Catégorie mise à jour avec succès.',
    data: category
  });
});

/**
 * @desc    Supprimer une catégorie
 * @route   DELETE /api/categories/:id
 * @access  Private (Admin seulement)
 */
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Catégorie non trouvée.'
    });
  }

  // Vérifier si la catégorie est utilisée par des acteurs
  const Actor = require('../models/Actor');
  const actorsCount = await Actor.countDocuments({ categories: req.params.id });

  if (actorsCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Cette catégorie est utilisée par ${actorsCount} acteur(s). Impossible de la supprimer.`
    });
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Catégorie supprimée avec succès.'
  });
});

/**
 * @desc    Activer/Désactiver une catégorie
 * @route   PATCH /api/categories/:id/toggle
 * @access  Private (Admin seulement)
 */
exports.toggleCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Catégorie non trouvée.'
    });
  }

  category.isActive = !category.isActive;
  await category.save();

  res.status(200).json({
    success: true,
    message: category.isActive ? 'Catégorie activée.' : 'Catégorie désactivée.',
    data: category
  });
});
