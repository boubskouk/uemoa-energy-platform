const express = require('express');
const router = express.Router();

// Importer les routes
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const actorsRoutes = require('./actors.routes');
const countriesRoutes = require('./countries.routes');
const categoriesRoutes = require('./categories.routes');
const energiesRoutes = require('./energies.routes');
const newsRoutes = require('./news.routes');
const eventsRoutes = require('./events.routes');
const searchRoutes = require('./search.routes');
const statsRoutes = require('./stats.routes');
const uploadRoutes = require('./upload.routes');

// Utiliser les routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/actors', actorsRoutes);
router.use('/countries', countriesRoutes);
router.use('/categories', categoriesRoutes);
router.use('/energies', energiesRoutes);
router.use('/news', newsRoutes);
router.use('/events', eventsRoutes);
router.use('/search', searchRoutes);
router.use('/stats', statsRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
