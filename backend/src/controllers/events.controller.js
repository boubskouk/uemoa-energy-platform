const Event = require('../models/Event');
const { asyncHandler } = require('../middlewares/error.middleware');
const { generateSlug, generateUniqueSlug } = require('../utils/slugify');
const { EVENT_STATUS, EVENT_CATEGORIES, EVENT_LOCATION_TYPES } = require('../utils/constants');

/**
 * @desc    Récupérer tous les événements (avec filtres et pagination)
 * @route   GET /api/events
 * @access  Public
 */
exports.getAllEvents = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    category,
    status,
    featured,
    country,
    locationType,
    upcoming,
    past,
    search,
    sortBy = 'startDate'
  } = req.query;

  // Construire le filtre
  const filter = {};

  if (category) filter.category = category;
  if (status) filter.status = status;
  if (featured) filter.featured = featured === 'true';
  if (country) filter['location.country'] = country;
  if (locationType) filter['location.type'] = locationType;

  // Filtres par date
  const now = new Date();
  if (upcoming === 'true') {
    filter.startDate = { $gte: now };
    filter.status = { $ne: EVENT_STATUS.CANCELLED };
  }
  if (past === 'true') {
    filter.endDate = { $lt: now };
  }

  // Recherche textuelle
  if (search) {
    filter.$text = { $search: search };
  }

  // Pagination
  const skip = (page - 1) * limit;
  const total = await Event.countDocuments(filter);

  const events = await Event.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: events.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: events
  });
});

/**
 * @desc    Récupérer un événement par ID ou slug
 * @route   GET /api/events/:identifier
 * @access  Public
 */
exports.getEventById = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  // Chercher par ID ou slug
  const query = identifier.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: identifier }
    : { slug: identifier };

  const event = await Event.findOne(query);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Événement non trouvé'
    });
  }

  res.status(200).json({
    success: true,
    data: event
  });
});

/**
 * @desc    Créer un nouvel événement
 * @route   POST /api/events
 * @access  Private (Admin)
 */
exports.createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    startDate,
    endDate,
    location,
    coverImage,
    images,
    organizer,
    category,
    topics,
    registrationRequired,
    registrationLink,
    maxParticipants,
    registrationDeadline,
    relatedActors,
    featured
  } = req.body;

  // Générer le slug à partir du titre français
  const slug = await generateUniqueSlug(Event, title.fr);

  // Créer l'événement
  const event = await Event.create({
    title,
    slug,
    description,
    startDate,
    endDate,
    location,
    coverImage,
    images,
    organizer,
    category,
    topics,
    registrationRequired,
    registrationLink,
    maxParticipants,
    registrationDeadline,
    relatedActors,
    featured: featured || false,
    createdBy: req.user._id
  });

  res.status(201).json({
    success: true,
    message: 'Événement créé avec succès',
    data: event
  });
});

/**
 * @desc    Mettre à jour un événement
 * @route   PUT /api/events/:id
 * @access  Private (Admin ou créateur)
 */
exports.updateEvent = asyncHandler(async (req, res) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Événement non trouvé'
    });
  }

  // Vérifier les permissions
  if (req.user.role !== 'admin' && req.user._id.toString() !== event.createdBy.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Non autorisé à modifier cet événement'
    });
  }

  const {
    title,
    description,
    startDate,
    endDate,
    location,
    coverImage,
    images,
    organizer,
    category,
    topics,
    registrationRequired,
    registrationLink,
    maxParticipants,
    registrationDeadline,
    relatedActors,
    featured
  } = req.body;

  // Mettre à jour le slug si le titre français change
  if (title && title.fr && title.fr !== event.title.fr) {
    event.slug = await generateUniqueSlug(Event, title.fr, event._id);
  }

  // Mettre à jour les champs
  if (title) event.title = title;
  if (description) event.description = description;
  if (startDate) event.startDate = startDate;
  if (endDate !== undefined) event.endDate = endDate;
  if (location) event.location = { ...event.location, ...location };
  if (coverImage !== undefined) event.coverImage = coverImage;
  if (images) event.images = images;
  if (organizer) event.organizer = { ...event.organizer, ...organizer };
  if (category) event.category = category;
  if (topics) event.topics = topics;
  if (registrationRequired !== undefined) event.registrationRequired = registrationRequired;
  if (registrationLink !== undefined) event.registrationLink = registrationLink;
  if (maxParticipants !== undefined) event.maxParticipants = maxParticipants;
  if (registrationDeadline !== undefined) event.registrationDeadline = registrationDeadline;
  if (relatedActors) event.relatedActors = relatedActors;
  if (featured !== undefined) event.featured = featured;

  await event.save();

  res.status(200).json({
    success: true,
    message: 'Événement mis à jour avec succès',
    data: event
  });
});

/**
 * @desc    Supprimer un événement
 * @route   DELETE /api/events/:id
 * @access  Private (Admin ou créateur)
 */
exports.deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Événement non trouvé'
    });
  }

  // Vérifier les permissions
  if (req.user.role !== 'admin' && req.user._id.toString() !== event.createdBy.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Non autorisé à supprimer cet événement'
    });
  }

  await event.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Événement supprimé avec succès'
  });
});

/**
 * @desc    Mettre en vedette / retirer de la vedette
 * @route   PUT /api/events/:id/feature
 * @access  Private (Admin)
 */
exports.toggleFeatureEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Événement non trouvé'
    });
  }

  event.featured = !event.featured;
  await event.save();

  res.status(200).json({
    success: true,
    message: event.featured
      ? 'Événement mis en vedette avec succès'
      : 'Événement retiré de la vedette',
    data: event
  });
});

/**
 * @desc    Annuler un événement
 * @route   PUT /api/events/:id/cancel
 * @access  Private (Admin ou créateur)
 */
exports.cancelEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Événement non trouvé'
    });
  }

  // Vérifier les permissions
  if (req.user.role !== 'admin' && req.user._id.toString() !== event.createdBy.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Non autorisé à annuler cet événement'
    });
  }

  if (event.status === EVENT_STATUS.CANCELLED) {
    return res.status(400).json({
      success: false,
      message: 'Cet événement est déjà annulé'
    });
  }

  event.status = EVENT_STATUS.CANCELLED;
  await event.save();

  res.status(200).json({
    success: true,
    message: 'Événement annulé avec succès',
    data: event
  });
});

/**
 * @desc    Incrémenter le compteur de vues
 * @route   POST /api/events/:id/view
 * @access  Public
 */
exports.incrementViews = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Événement non trouvé'
    });
  }

  await event.incrementViews();

  res.status(200).json({
    success: true,
    views: event.views
  });
});

/**
 * @desc    Marquer son intérêt pour un événement
 * @route   POST /api/events/:id/interested
 * @access  Public
 */
exports.incrementInterested = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Événement non trouvé'
    });
  }

  await event.incrementInterested();

  res.status(200).json({
    success: true,
    message: 'Intérêt enregistré',
    interestedCount: event.interestedCount
  });
});

/**
 * @desc    Récupérer les événements à venir
 * @route   GET /api/events/upcoming
 * @access  Public
 */
exports.getUpcomingEvents = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const now = new Date();

  const events = await Event.find({
    startDate: { $gte: now },
    status: { $ne: EVENT_STATUS.CANCELLED }
  })
    .sort('startDate')
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
});

/**
 * @desc    Récupérer les événements en vedette
 * @route   GET /api/events/featured
 * @access  Public
 */
exports.getFeaturedEvents = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;

  const events = await Event.find({
    featured: true,
    status: { $ne: EVENT_STATUS.CANCELLED }
  })
    .sort('startDate')
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
});

/**
 * @desc    Récupérer les événements en cours
 * @route   GET /api/events/ongoing
 * @access  Public
 */
exports.getOngoingEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({
    status: EVENT_STATUS.ONGOING
  })
    .sort('startDate');

  res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
});

/**
 * @desc    Récupérer les événements par pays
 * @route   GET /api/events/country/:countryId
 * @access  Public
 */
exports.getEventsByCountry = asyncHandler(async (req, res) => {
  const { countryId } = req.params;
  const { limit = 20, upcoming } = req.query;

  const filter = {
    'location.country': countryId,
    status: { $ne: EVENT_STATUS.CANCELLED }
  };

  if (upcoming === 'true') {
    filter.startDate = { $gte: new Date() };
  }

  const events = await Event.find(filter)
    .sort('startDate')
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
});

/**
 * @desc    Récupérer les statistiques des événements (Admin)
 * @route   GET /api/events/stats
 * @access  Private (Admin)
 */
exports.getEventsStats = asyncHandler(async (req, res) => {
  const totalEvents = await Event.countDocuments();
  const upcomingEvents = await Event.countDocuments({
    status: EVENT_STATUS.UPCOMING
  });
  const ongoingEvents = await Event.countDocuments({
    status: EVENT_STATUS.ONGOING
  });
  const pastEvents = await Event.countDocuments({
    status: EVENT_STATUS.PAST
  });
  const cancelledEvents = await Event.countDocuments({
    status: EVENT_STATUS.CANCELLED
  });

  // Statistiques par catégorie
  const eventsByCategory = await Event.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);

  // Statistiques par type de localisation
  const eventsByLocationType = await Event.aggregate([
    {
      $group: {
        _id: '$location.type',
        count: { $sum: 1 }
      }
    }
  ]);

  // Événements les plus vus
  const mostViewedEvents = await Event.find()
    .sort('-views')
    .limit(10)
    .select('title slug views startDate status');

  // Événements les plus populaires (intérêt)
  const mostPopularEvents = await Event.find()
    .sort('-interestedCount')
    .limit(10)
    .select('title slug interestedCount startDate status');

  res.status(200).json({
    success: true,
    data: {
      total: totalEvents,
      upcoming: upcomingEvents,
      ongoing: ongoingEvents,
      past: pastEvents,
      cancelled: cancelledEvents,
      byCategory: eventsByCategory,
      byLocationType: eventsByLocationType,
      mostViewed: mostViewedEvents,
      mostPopular: mostPopularEvents
    }
  });
});

/**
 * @desc    Rechercher des événements à proximité (géolocalisation)
 * @route   GET /api/events/nearby
 * @access  Public
 */
exports.getNearbyEvents = asyncHandler(async (req, res) => {
  const { longitude, latitude, maxDistance = 50000, limit = 20 } = req.query;

  if (!longitude || !latitude) {
    return res.status(400).json({
      success: false,
      message: 'Les coordonnées (longitude, latitude) sont requises'
    });
  }

  const events = await Event.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        $maxDistance: parseInt(maxDistance) // en mètres
      }
    },
    status: { $ne: EVENT_STATUS.CANCELLED }
  })
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
});
