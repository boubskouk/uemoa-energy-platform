const Actor = require('../models/Actor');
const News = require('../models/News');
const Event = require('../models/Event');
const { asyncHandler } = require('../middlewares/error.middleware');
const { PUBLICATION_STATUS, EVENT_STATUS } = require('../utils/constants');

/**
 * @desc    Recherche globale dans tous les contenus (acteurs, news, événements)
 * @route   GET /api/search
 * @access  Public
 */
exports.globalSearch = asyncHandler(async (req, res) => {
  const {
    q, // Query de recherche
    type, // Type de contenu : 'actors', 'news', 'events', 'all' (défaut)
    country, // Filtrer par pays
    category, // Filtrer par catégorie
    dateFrom, // Date de début (pour événements)
    dateTo, // Date de fin (pour événements)
    limit = 10, // Limite par type
    page = 1
  } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Veuillez fournir au moins 2 caractères pour la recherche'
    });
  }

  const searchQuery = q.trim();
  const results = {
    query: searchQuery,
    actors: { data: [], total: 0 },
    news: { data: [], total: 0 },
    events: { data: [], total: 0 },
    totalResults: 0
  };

  // Calculer le skip pour la pagination
  const skip = (page - 1) * parseInt(limit);

  // ========== RECHERCHE DANS LES ACTEURS ==========
  if (!type || type === 'all' || type === 'actors') {
    const actorFilter = {
      $text: { $search: searchQuery },
      status: 'approved' // Seulement les acteurs approuvés
    };

    // Filtres optionnels
    if (country) actorFilter.country = country;
    if (category) actorFilter.categories = category;

    const actorsTotal = await Actor.countDocuments(actorFilter);
    const actors = await Actor.find(actorFilter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(parseInt(limit))
      .select('name slug description logo type country categories energyTypes verified featured');

    results.actors = {
      data: actors,
      total: actorsTotal
    };
  }

  // ========== RECHERCHE DANS LES ACTUALITÉS ==========
  if (!type || type === 'all' || type === 'news') {
    const newsFilter = {
      $text: { $search: searchQuery },
      status: PUBLICATION_STATUS.PUBLISHED // Seulement les actualités publiées
    };

    // Filtres optionnels
    if (country) newsFilter.relatedCountries = country;
    if (category) newsFilter.category = category;

    const newsTotal = await News.countDocuments(newsFilter);
    const news = await News.find(newsFilter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(parseInt(limit))
      .select('title slug excerpt coverImage category tags publishedAt featured views');

    results.news = {
      data: news,
      total: newsTotal
    };
  }

  // ========== RECHERCHE DANS LES ÉVÉNEMENTS ==========
  if (!type || type === 'all' || type === 'events') {
    const eventFilter = {
      $text: { $search: searchQuery },
      status: { $ne: EVENT_STATUS.CANCELLED } // Exclure les événements annulés
    };

    // Filtres optionnels
    if (country) eventFilter['location.country'] = country;
    if (category) eventFilter.category = category;

    // Filtres par date
    if (dateFrom || dateTo) {
      eventFilter.startDate = {};
      if (dateFrom) eventFilter.startDate.$gte = new Date(dateFrom);
      if (dateTo) eventFilter.startDate.$lte = new Date(dateTo);
    }

    const eventsTotal = await Event.countDocuments(eventFilter);
    const events = await Event.find(eventFilter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(parseInt(limit))
      .select('title slug description coverImage category location startDate endDate status featured views interestedCount');

    results.events = {
      data: events,
      total: eventsTotal
    };
  }

  // Calculer le total global
  results.totalResults = results.actors.total + results.news.total + results.events.total;

  res.status(200).json({
    success: true,
    ...results,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit)
    }
  });
});

/**
 * @desc    Recherche dans les acteurs uniquement
 * @route   GET /api/search/actors
 * @access  Public
 */
exports.searchActors = asyncHandler(async (req, res) => {
  const {
    q,
    country,
    type,
    category,
    energy,
    verified,
    page = 1,
    limit = 20
  } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Veuillez fournir au moins 2 caractères pour la recherche'
    });
  }

  const filter = {
    $text: { $search: q.trim() },
    status: 'approved'
  };

  // Filtres optionnels
  if (country) filter.country = country;
  if (type) filter.type = type;
  if (category) filter.categories = category;
  if (energy) filter.energyTypes = energy;
  if (verified !== undefined) filter.verified = verified === 'true';

  const skip = (page - 1) * limit;
  const total = await Actor.countDocuments(filter);

  const actors = await Actor.find(filter, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    query: q.trim(),
    count: actors.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: actors
  });
});

/**
 * @desc    Recherche dans les actualités uniquement
 * @route   GET /api/search/news
 * @access  Public
 */
exports.searchNews = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    country,
    featured,
    page = 1,
    limit = 20
  } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Veuillez fournir au moins 2 caractères pour la recherche'
    });
  }

  const filter = {
    $text: { $search: q.trim() },
    status: PUBLICATION_STATUS.PUBLISHED
  };

  // Filtres optionnels
  if (category) filter.category = category;
  if (country) filter.relatedCountries = country;
  if (featured !== undefined) filter.featured = featured === 'true';

  const skip = (page - 1) * limit;
  const total = await News.countDocuments(filter);

  const news = await News.find(filter, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    query: q.trim(),
    count: news.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: news
  });
});

/**
 * @desc    Recherche dans les événements uniquement
 * @route   GET /api/search/events
 * @access  Public
 */
exports.searchEvents = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    country,
    locationType,
    upcoming,
    dateFrom,
    dateTo,
    page = 1,
    limit = 20
  } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Veuillez fournir au moins 2 caractères pour la recherche'
    });
  }

  const filter = {
    $text: { $search: q.trim() },
    status: { $ne: EVENT_STATUS.CANCELLED }
  };

  // Filtres optionnels
  if (category) filter.category = category;
  if (country) filter['location.country'] = country;
  if (locationType) filter['location.type'] = locationType;

  // Filtres par date
  if (upcoming === 'true') {
    filter.startDate = { $gte: new Date() };
  }

  if (dateFrom || dateTo) {
    filter.startDate = filter.startDate || {};
    if (dateFrom) filter.startDate.$gte = new Date(dateFrom);
    if (dateTo) filter.startDate.$lte = new Date(dateTo);
  }

  const skip = (page - 1) * limit;
  const total = await Event.countDocuments(filter);

  const events = await Event.find(filter, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    query: q.trim(),
    count: events.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: events
  });
});

/**
 * @desc    Suggestions de recherche (autocomplétion)
 * @route   GET /api/search/suggestions
 * @access  Public
 */
exports.searchSuggestions = asyncHandler(async (req, res) => {
  const { q, limit = 5 } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Veuillez fournir au moins 2 caractères pour la recherche'
    });
  }

  const searchQuery = q.trim();
  const regex = new RegExp(searchQuery, 'i'); // Case insensitive

  // Recherche dans les noms d'acteurs
  const actorSuggestions = await Actor.find({
    name: regex,
    status: 'approved'
  })
    .limit(parseInt(limit))
    .select('name slug type')
    .lean();

  // Recherche dans les titres d'actualités
  const newsSuggestions = await News.find({
    'title.fr': regex,
    status: PUBLICATION_STATUS.PUBLISHED
  })
    .limit(parseInt(limit))
    .select('title slug')
    .lean();

  // Recherche dans les titres d'événements
  const eventSuggestions = await Event.find({
    'title.fr': regex,
    status: { $ne: EVENT_STATUS.CANCELLED }
  })
    .limit(parseInt(limit))
    .select('title slug startDate')
    .lean();

  res.status(200).json({
    success: true,
    query: searchQuery,
    suggestions: {
      actors: actorSuggestions.map(a => ({
        text: a.name,
        slug: a.slug,
        type: 'actor',
        subtype: a.type
      })),
      news: newsSuggestions.map(n => ({
        text: n.title.fr,
        slug: n.slug,
        type: 'news'
      })),
      events: eventSuggestions.map(e => ({
        text: e.title.fr,
        slug: e.slug,
        type: 'event',
        date: e.startDate
      }))
    }
  });
});

/**
 * @desc    Recherche par tags
 * @route   GET /api/search/tags
 * @access  Public
 */
exports.searchByTag = asyncHandler(async (req, res) => {
  const { tag, limit = 20, page = 1 } = req.query;

  if (!tag || tag.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Veuillez fournir un tag valide'
    });
  }

  const tagQuery = tag.trim();
  const skip = (page - 1) * limit;

  // Rechercher dans les actualités avec ce tag
  const newsTotal = await News.countDocuments({
    tags: { $in: [new RegExp(tagQuery, 'i')] },
    status: PUBLICATION_STATUS.PUBLISHED
  });

  const news = await News.find({
    tags: { $in: [new RegExp(tagQuery, 'i')] },
    status: PUBLICATION_STATUS.PUBLISHED
  })
    .skip(skip)
    .limit(parseInt(limit))
    .sort('-publishedAt')
    .select('title slug excerpt coverImage tags publishedAt');

  // Rechercher dans les événements avec ce topic
  const eventsTotal = await Event.countDocuments({
    topics: { $in: [new RegExp(tagQuery, 'i')] },
    status: { $ne: EVENT_STATUS.CANCELLED }
  });

  const events = await Event.find({
    topics: { $in: [new RegExp(tagQuery, 'i')] },
    status: { $ne: EVENT_STATUS.CANCELLED }
  })
    .skip(skip)
    .limit(parseInt(limit))
    .sort('startDate')
    .select('title slug description topics startDate');

  res.status(200).json({
    success: true,
    tag: tagQuery,
    news: {
      data: news,
      total: newsTotal
    },
    events: {
      data: events,
      total: eventsTotal
    },
    totalResults: newsTotal + eventsTotal,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit)
    }
  });
});

/**
 * @desc    Récupérer les tags populaires
 * @route   GET /api/search/popular-tags
 * @access  Public
 */
exports.getPopularTags = asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  // Agréger les tags des actualités
  const newsTags = await News.aggregate([
    { $match: { status: PUBLICATION_STATUS.PUBLISHED } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: parseInt(limit) },
    { $project: { tag: '$_id', count: 1, _id: 0 } }
  ]);

  // Agréger les topics des événements
  const eventTopics = await Event.aggregate([
    { $match: { status: { $ne: EVENT_STATUS.CANCELLED } } },
    { $unwind: '$topics' },
    { $group: { _id: '$topics', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: parseInt(limit) },
    { $project: { tag: '$_id', count: 1, _id: 0 } }
  ]);

  // Combiner et trier par popularité
  const allTags = [...newsTags, ...eventTopics];
  const tagsMap = new Map();

  allTags.forEach(item => {
    const existing = tagsMap.get(item.tag);
    if (existing) {
      tagsMap.set(item.tag, { tag: item.tag, count: existing.count + item.count });
    } else {
      tagsMap.set(item.tag, item);
    }
  });

  const popularTags = Array.from(tagsMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, parseInt(limit));

  res.status(200).json({
    success: true,
    count: popularTags.length,
    data: popularTags
  });
});
