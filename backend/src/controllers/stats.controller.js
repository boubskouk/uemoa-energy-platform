const Actor = require('../models/Actor');
const News = require('../models/News');
const Event = require('../models/Event');
const User = require('../models/User');
const Country = require('../models/Country');
const Category = require('../models/Category');
const Energy = require('../models/Energy');
const { asyncHandler } = require('../middlewares/error.middleware');
const { PUBLICATION_STATUS, EVENT_STATUS } = require('../utils/constants');

/**
 * @desc    Récupérer les statistiques globales
 * @route   GET /api/stats/overview
 * @access  Public
 */
exports.getOverviewStats = asyncHandler(async (req, res) => {
  // Compter les acteurs par statut
  const [
    totalActors,
    approvedActors,
    pendingActors,
    rejectedActors,
    verifiedActors,
    featuredActors,
    totalNews,
    publishedNews,
    totalEvents,
    upcomingEvents,
    totalUsers,
    totalCountries,
    totalCategories,
    totalEnergies
  ] = await Promise.all([
    Actor.countDocuments(),
    Actor.countDocuments({ status: 'approved' }),
    Actor.countDocuments({ status: 'pending' }),
    Actor.countDocuments({ status: 'rejected' }),
    Actor.countDocuments({ verified: true }),
    Actor.countDocuments({ featured: true }),
    News.countDocuments(),
    News.countDocuments({ status: PUBLICATION_STATUS.PUBLISHED }),
    Event.countDocuments(),
    Event.countDocuments({
      startDate: { $gte: new Date() },
      status: { $ne: EVENT_STATUS.CANCELLED }
    }),
    User.countDocuments(),
    Country.countDocuments({ isActive: true }),
    Category.countDocuments({ isActive: true }),
    Energy.countDocuments({ isActive: true })
  ]);

  // Calculer les vues totales
  const actorViewsAgg = await Actor.aggregate([
    { $group: { _id: null, totalViews: { $sum: '$views' } } }
  ]);
  const totalActorViews = actorViewsAgg[0]?.totalViews || 0;

  const newsViewsAgg = await News.aggregate([
    { $group: { _id: null, totalViews: { $sum: '$views' } } }
  ]);
  const totalNewsViews = newsViewsAgg[0]?.totalViews || 0;

  const eventViewsAgg = await Event.aggregate([
    { $group: { _id: null, totalViews: { $sum: '$views' } } }
  ]);
  const totalEventViews = eventViewsAgg[0]?.totalViews || 0;

  res.status(200).json({
    success: true,
    data: {
      actors: {
        total: totalActors,
        approved: approvedActors,
        pending: pendingActors,
        rejected: rejectedActors,
        verified: verifiedActors,
        featured: featuredActors,
        totalViews: totalActorViews
      },
      news: {
        total: totalNews,
        published: publishedNews,
        totalViews: totalNewsViews
      },
      events: {
        total: totalEvents,
        upcoming: upcomingEvents,
        totalViews: totalEventViews
      },
      users: {
        total: totalUsers
      },
      referentials: {
        countries: totalCountries,
        categories: totalCategories,
        energies: totalEnergies
      }
    }
  });
});

/**
 * @desc    Statistiques par pays
 * @route   GET /api/stats/by-country
 * @access  Public
 */
exports.getStatsByCountry = asyncHandler(async (req, res) => {
  // Agréger les acteurs par pays
  const actorsByCountry = await Actor.aggregate([
    { $match: { status: 'approved' } },
    {
      $group: {
        _id: '$country',
        count: { $sum: 1 },
        verified: { $sum: { $cond: ['$verified', 1, 0] } },
        totalViews: { $sum: '$views' }
      }
    },
    {
      $lookup: {
        from: 'countries',
        localField: '_id',
        foreignField: '_id',
        as: 'country'
      }
    },
    { $unwind: '$country' },
    {
      $project: {
        _id: 1,
        countryName: '$country.name',
        countryCode: '$country.code',
        countryFlag: '$country.flag',
        actorsCount: '$count',
        verifiedCount: '$verified',
        totalViews: 1
      }
    },
    { $sort: { actorsCount: -1 } }
  ]);

  res.status(200).json({
    success: true,
    count: actorsByCountry.length,
    data: actorsByCountry
  });
});

/**
 * @desc    Statistiques par type d'énergie
 * @route   GET /api/stats/by-energy
 * @access  Public
 */
exports.getStatsByEnergy = asyncHandler(async (req, res) => {
  // Agréger les acteurs par type d'énergie
  const actorsByEnergy = await Actor.aggregate([
    { $match: { status: 'approved' } },
    { $unwind: '$energyTypes' },
    {
      $group: {
        _id: '$energyTypes',
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'energies',
        localField: '_id',
        foreignField: '_id',
        as: 'energy'
      }
    },
    { $unwind: '$energy' },
    {
      $project: {
        _id: 1,
        energyName: '$energy.name',
        energySlug: '$energy.slug',
        energyIcon: '$energy.icon',
        energyColor: '$energy.color',
        actorsCount: '$count'
      }
    },
    { $sort: { actorsCount: -1 } }
  ]);

  res.status(200).json({
    success: true,
    count: actorsByEnergy.length,
    data: actorsByEnergy
  });
});

/**
 * @desc    Statistiques par catégorie
 * @route   GET /api/stats/by-category
 * @access  Public
 */
exports.getStatsByCategory = asyncHandler(async (req, res) => {
  // Agréger les acteurs par catégorie
  const actorsByCategory = await Actor.aggregate([
    { $match: { status: 'approved' } },
    { $unwind: '$categories' },
    {
      $group: {
        _id: '$categories',
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $project: {
        _id: 1,
        categoryName: '$category.name',
        categorySlug: '$category.slug',
        categoryIcon: '$category.icon',
        categoryColor: '$category.color',
        actorsCount: '$count'
      }
    },
    { $sort: { actorsCount: -1 } }
  ]);

  res.status(200).json({
    success: true,
    count: actorsByCategory.length,
    data: actorsByCategory
  });
});

/**
 * @desc    Statistiques par type d'acteur
 * @route   GET /api/stats/by-actor-type
 * @access  Public
 */
exports.getStatsByActorType = asyncHandler(async (req, res) => {
  // Agréger les acteurs par type
  const actorsByType = await Actor.aggregate([
    { $match: { status: 'approved' } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        verified: { $sum: { $cond: ['$verified', 1, 0] } }
      }
    },
    {
      $project: {
        type: '$_id',
        actorsCount: '$count',
        verifiedCount: '$verified',
        _id: 0
      }
    },
    { $sort: { actorsCount: -1 } }
  ]);

  res.status(200).json({
    success: true,
    count: actorsByType.length,
    data: actorsByType
  });
});

/**
 * @desc    Statistiques d'évolution temporelle
 * @route   GET /api/stats/timeline
 * @access  Public
 */
exports.getTimelineStats = asyncHandler(async (req, res) => {
  const { period = 'month' } = req.query; // 'week', 'month', 'year'

  // Déterminer le format de date selon la période
  let dateFormat;
  let startDate = new Date();

  switch (period) {
    case 'week':
      dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'year':
      dateFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case 'month':
    default:
      dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
      startDate.setMonth(startDate.getMonth() - 1);
      break;
  }

  // Acteurs créés par période
  const actorsTimeline = await Actor.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: dateFormat,
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: '$_id',
        count: 1,
        _id: 0
      }
    }
  ]);

  // Actualités publiées par période
  const newsTimeline = await News.aggregate([
    {
      $match: {
        publishedAt: { $gte: startDate },
        status: PUBLICATION_STATUS.PUBLISHED
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$publishedAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: '$_id',
        count: 1,
        _id: 0
      }
    }
  ]);

  // Événements créés par période
  const eventsTimeline = await Event.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: dateFormat,
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: '$_id',
        count: 1,
        _id: 0
      }
    }
  ]);

  res.status(200).json({
    success: true,
    period,
    data: {
      actors: actorsTimeline,
      news: newsTimeline,
      events: eventsTimeline
    }
  });
});

/**
 * @desc    Top acteurs (les plus vus, les plus contactés, etc.)
 * @route   GET /api/stats/top-actors
 * @access  Public
 */
exports.getTopActors = asyncHandler(async (req, res) => {
  const { sortBy = 'views', limit = 10 } = req.query;

  let sortField = {};
  switch (sortBy) {
    case 'views':
      sortField = { views: -1 };
      break;
    case 'contacts':
      sortField = { contactRequests: -1 };
      break;
    case 'recent':
      sortField = { createdAt: -1 };
      break;
    default:
      sortField = { views: -1 };
  }

  const topActors = await Actor.find({ status: 'approved' })
    .sort(sortField)
    .limit(parseInt(limit))
    .select('name slug logo type country categories energyTypes views contactRequests verified featured createdAt');

  res.status(200).json({
    success: true,
    sortBy,
    count: topActors.length,
    data: topActors
  });
});

/**
 * @desc    Dashboard admin - Statistiques complètes
 * @route   GET /api/stats/admin-dashboard
 * @access  Private (Admin seulement)
 */
exports.getAdminDashboard = asyncHandler(async (req, res) => {
  // Récupérer toutes les stats nécessaires pour le dashboard admin
  const [
    overviewStats,
    recentActors,
    pendingActors,
    recentNews,
    upcomingEvents,
    usersByRole
  ] = await Promise.all([
    // Stats globales (réutiliser la fonction)
    Actor.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          approved: [{ $match: { status: 'approved' } }, { $count: 'count' }],
          pending: [{ $match: { status: 'pending' } }, { $count: 'count' }],
          rejected: [{ $match: { status: 'rejected' } }, { $count: 'count' }]
        }
      }
    ]),
    // Acteurs récents
    Actor.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name type status createdAt createdBy')
      .populate('createdBy', 'profile.firstName profile.lastName email'),
    // Acteurs en attente
    Actor.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name type createdAt createdBy')
      .populate('createdBy', 'profile.firstName profile.lastName email'),
    // Actualités récentes
    News.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status publishedAt views'),
    // Événements à venir
    Event.find({
      startDate: { $gte: new Date() },
      status: { $ne: EVENT_STATUS.CANCELLED }
    })
      .sort({ startDate: 1 })
      .limit(5)
      .select('title startDate location status'),
    // Utilisateurs par rôle
    User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: overviewStats[0],
      recentActors,
      pendingActors,
      recentNews,
      upcomingEvents,
      usersByRole
    }
  });
});
