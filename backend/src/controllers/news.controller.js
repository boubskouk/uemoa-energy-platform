const News = require('../models/News');
const { asyncHandler } = require('../middlewares/error.middleware');
const { generateSlug, generateUniqueSlug } = require('../utils/slugify');
const { PUBLICATION_STATUS, NEWS_CATEGORIES } = require('../utils/constants');

/**
 * @desc    Récupérer toutes les actualités (avec filtres et pagination)
 * @route   GET /api/news
 * @access  Public (seules les news publiées sont visibles en public)
 */
exports.getAllNews = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    category,
    status,
    featured,
    country,
    actor,
    search,
    sortBy = '-publishedAt'
  } = req.query;

  // Construire le filtre
  const filter = {};

  // Filtre par statut (par défaut, montrer seulement les publiées en public)
  if (status) {
    filter.status = status;
  } else {
    // Si l'utilisateur n'est pas admin, montrer seulement les actualités publiées
    if (!req.user || req.user.role !== 'admin') {
      filter.status = PUBLICATION_STATUS.PUBLISHED;
    }
  }

  if (category) filter.category = category;
  if (featured) filter.featured = featured === 'true';
  if (country) filter.relatedCountries = country;
  if (actor) filter.relatedActors = actor;

  // Recherche textuelle
  if (search) {
    filter.$text = { $search: search };
  }

  // Pagination
  const skip = (page - 1) * limit;
  const total = await News.countDocuments(filter);

  const news = await News.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: news.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: news
  });
});

/**
 * @desc    Récupérer une actualité par ID ou slug
 * @route   GET /api/news/:identifier
 * @access  Public (seulement si publiée)
 */
exports.getNewsById = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  // Chercher par ID ou slug
  const query = identifier.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: identifier }
    : { slug: identifier };

  const news = await News.findOne(query);

  if (!news) {
    return res.status(404).json({
      success: false,
      message: 'Actualité non trouvée'
    });
  }

  // Vérifier si l'utilisateur peut voir cette actualité
  if (news.status !== PUBLICATION_STATUS.PUBLISHED) {
    if (!req.user || (req.user.role !== 'admin' && req.user._id.toString() !== news.author.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à cette actualité'
      });
    }
  }

  res.status(200).json({
    success: true,
    data: news
  });
});

/**
 * @desc    Créer une nouvelle actualité
 * @route   POST /api/news
 * @access  Private (Admin)
 */
exports.createNews = asyncHandler(async (req, res) => {
  const {
    title,
    content,
    excerpt,
    coverImage,
    images,
    category,
    tags,
    relatedActors,
    relatedCountries,
    status,
    featured
  } = req.body;

  // Générer le slug à partir du titre français
  const slug = await generateUniqueSlug(News, title.fr);

  // Créer l'actualité
  const news = await News.create({
    title,
    slug,
    content,
    excerpt,
    coverImage,
    images,
    category,
    tags,
    relatedActors,
    relatedCountries,
    status: status || PUBLICATION_STATUS.DRAFT,
    featured: featured || false,
    author: req.user._id,
    publishedAt: status === PUBLICATION_STATUS.PUBLISHED ? new Date() : null
  });

  res.status(201).json({
    success: true,
    message: 'Actualité créée avec succès',
    data: news
  });
});

/**
 * @desc    Mettre à jour une actualité
 * @route   PUT /api/news/:id
 * @access  Private (Admin ou auteur)
 */
exports.updateNews = asyncHandler(async (req, res) => {
  let news = await News.findById(req.params.id);

  if (!news) {
    return res.status(404).json({
      success: false,
      message: 'Actualité non trouvée'
    });
  }

  // Vérifier les permissions
  if (req.user.role !== 'admin' && req.user._id.toString() !== news.author.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Non autorisé à modifier cette actualité'
    });
  }

  const {
    title,
    content,
    excerpt,
    coverImage,
    images,
    category,
    tags,
    relatedActors,
    relatedCountries,
    status,
    featured
  } = req.body;

  // Mettre à jour le slug si le titre français change
  if (title && title.fr && title.fr !== news.title.fr) {
    news.slug = await generateUniqueSlug(News, title.fr, news._id);
  }

  // Mettre à jour les champs
  if (title) news.title = title;
  if (content) news.content = content;
  if (excerpt) news.excerpt = excerpt;
  if (coverImage !== undefined) news.coverImage = coverImage;
  if (images) news.images = images;
  if (category) news.category = category;
  if (tags) news.tags = tags;
  if (relatedActors) news.relatedActors = relatedActors;
  if (relatedCountries) news.relatedCountries = relatedCountries;

  // Gérer le changement de statut
  if (status && status !== news.status) {
    news.status = status;
    if (status === PUBLICATION_STATUS.PUBLISHED && !news.publishedAt) {
      news.publishedAt = new Date();
    }
  }

  if (featured !== undefined) news.featured = featured;

  await news.save();

  res.status(200).json({
    success: true,
    message: 'Actualité mise à jour avec succès',
    data: news
  });
});

/**
 * @desc    Supprimer une actualité
 * @route   DELETE /api/news/:id
 * @access  Private (Admin ou auteur)
 */
exports.deleteNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return res.status(404).json({
      success: false,
      message: 'Actualité non trouvée'
    });
  }

  // Vérifier les permissions
  if (req.user.role !== 'admin' && req.user._id.toString() !== news.author.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Non autorisé à supprimer cette actualité'
    });
  }

  await news.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Actualité supprimée avec succès'
  });
});

/**
 * @desc    Publier une actualité (brouillon -> publié)
 * @route   PUT /api/news/:id/publish
 * @access  Private (Admin)
 */
exports.publishNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return res.status(404).json({
      success: false,
      message: 'Actualité non trouvée'
    });
  }

  if (news.status === PUBLICATION_STATUS.PUBLISHED) {
    return res.status(400).json({
      success: false,
      message: 'Cette actualité est déjà publiée'
    });
  }

  news.status = PUBLICATION_STATUS.PUBLISHED;
  news.publishedAt = new Date();
  await news.save();

  res.status(200).json({
    success: true,
    message: 'Actualité publiée avec succès',
    data: news
  });
});

/**
 * @desc    Dépublier une actualité (publié -> brouillon)
 * @route   PUT /api/news/:id/unpublish
 * @access  Private (Admin)
 */
exports.unpublishNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return res.status(404).json({
      success: false,
      message: 'Actualité non trouvée'
    });
  }

  if (news.status !== PUBLICATION_STATUS.PUBLISHED) {
    return res.status(400).json({
      success: false,
      message: 'Cette actualité n\'est pas publiée'
    });
  }

  news.status = PUBLICATION_STATUS.DRAFT;
  await news.save();

  res.status(200).json({
    success: true,
    message: 'Actualité dépubliée avec succès',
    data: news
  });
});

/**
 * @desc    Mettre en avant / retirer de la une
 * @route   PUT /api/news/:id/feature
 * @access  Private (Admin)
 */
exports.toggleFeatureNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return res.status(404).json({
      success: false,
      message: 'Actualité non trouvée'
    });
  }

  news.featured = !news.featured;
  await news.save();

  res.status(200).json({
    success: true,
    message: news.featured
      ? 'Actualité mise en avant avec succès'
      : 'Actualité retirée de la une',
    data: news
  });
});

/**
 * @desc    Incrémenter le compteur de vues
 * @route   POST /api/news/:id/view
 * @access  Public
 */
exports.incrementViews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return res.status(404).json({
      success: false,
      message: 'Actualité non trouvée'
    });
  }

  await news.incrementViews();

  res.status(200).json({
    success: true,
    views: news.views
  });
});

/**
 * @desc    Récupérer les actualités à la une
 * @route   GET /api/news/featured
 * @access  Public
 */
exports.getFeaturedNews = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;

  const news = await News.find({
    status: PUBLICATION_STATUS.PUBLISHED,
    featured: true
  })
    .sort('-publishedAt')
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: news.length,
    data: news
  });
});

/**
 * @desc    Récupérer les statistiques des actualités (Admin)
 * @route   GET /api/news/stats
 * @access  Private (Admin)
 */
exports.getNewsStats = asyncHandler(async (req, res) => {
  const totalNews = await News.countDocuments();
  const publishedNews = await News.countDocuments({ status: PUBLICATION_STATUS.PUBLISHED });
  const draftNews = await News.countDocuments({ status: PUBLICATION_STATUS.DRAFT });
  const archivedNews = await News.countDocuments({ status: PUBLICATION_STATUS.ARCHIVED });

  // Statistiques par catégorie
  const newsByCategory = await News.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);

  // Actualités les plus vues
  const mostViewedNews = await News.find({ status: PUBLICATION_STATUS.PUBLISHED })
    .sort('-views')
    .limit(10)
    .select('title slug views publishedAt');

  res.status(200).json({
    success: true,
    data: {
      total: totalNews,
      published: publishedNews,
      draft: draftNews,
      archived: archivedNews,
      byCategory: newsByCategory,
      mostViewed: mostViewedNews
    }
  });
});
