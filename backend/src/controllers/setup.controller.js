const Actor = require('../models/Actor');
const Country = require('../models/Country');
const Category = require('../models/Category');
const Energy = require('../models/Energy');

// Données des acteurs vérifiés UEMOA (33 acteurs - sources officielles)
const realActorsData = require('../data/verified-actors.data');

/**
 * Initialiser les acteurs réels UEMOA
 * GET /api/setup/init-actors
 * Cette route permet d'insérer les données réelles sans utiliser de seeders
 */
exports.initRealActors = async (req, res) => {
  try {
    // Vérifier si des acteurs existent déjà
    const existingCount = await Actor.countDocuments();

    if (existingCount > 0 && !req.query.force) {
      return res.status(400).json({
        success: false,
        message: `${existingCount} acteurs existent déjà. Utilisez ?force=true pour réinitialiser.`
      });
    }

    // Supprimer les acteurs existants si force=true
    if (req.query.force) {
      await Actor.deleteMany({});
      console.log('✅ Acteurs existants supprimés');
    }

    // Récupérer les références
    const countries = await Country.find({});
    const categories = await Category.find({});
    const energies = await Energy.find({});

    if (countries.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun pays trouvé. Veuillez d\'abord initialiser les pays.'
      });
    }

    // Créer des maps pour faciliter la recherche
    const countryMap = {};
    countries.forEach(c => { countryMap[c.code] = c._id; });

    const categoryMap = {};
    categories.forEach(c => { categoryMap[c.name] = c._id; });

    const energyMap = {};
    energies.forEach(e => { energyMap[e.name] = e._id; });

    // Préparer les acteurs pour l'insertion
    const actorsToCreate = realActorsData.map(actor => {
      const actorData = {
        ...actor,
        country: countryMap[actor.country],
        energyTypes: actor.energyTypes?.map(e => energyMap[e]).filter(Boolean) || []
      };

      // Ajouter une catégorie si elle existe
      if (actor.category && categoryMap[actor.category]) {
        actorData.categories = [categoryMap[actor.category]];
      }

      // Retirer temporairement les projets (à ajouter via update plus tard)
      delete actorData.projects;

      return actorData;
    });

    // Insérer tous les acteurs
    const createdActors = await Actor.insertMany(actorsToCreate);

    // Calculer les statistiques
    const stats = {
      total: createdActors.length,
      byType: {},
      byCountry: {},
      featured: createdActors.filter(a => a.featured).length
    };

    createdActors.forEach(actor => {
      stats.byType[actor.type] = (stats.byType[actor.type] || 0) + 1;
      const country = countries.find(c => c._id.equals(actor.country));
      if (country) {
        stats.byCountry[country.code] = (stats.byCountry[country.code] || 0) + 1;
      }
    });

    res.status(201).json({
      success: true,
      message: `${createdActors.length} acteurs réels UEMOA créés avec succès !`,
      data: {
        count: createdActors.length,
        statistics: stats
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'initialisation des acteurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'initialisation des acteurs',
      error: error.message
    });
  }
};

/**
 * Obtenir les statistiques des acteurs
 * GET /api/setup/stats
 */
exports.getStats = async (req, res) => {
  try {
    const total = await Actor.countDocuments();
    const approved = await Actor.countDocuments({ status: 'approved' });
    const featured = await Actor.countDocuments({ featured: true });

    // Stats par type
    const byType = await Actor.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Stats par pays
    const byCountry = await Actor.aggregate([
      {
        $lookup: {
          from: 'countries',
          localField: 'country',
          foreignField: '_id',
          as: 'countryInfo'
        }
      },
      { $unwind: '$countryInfo' },
      { $group: { _id: '$countryInfo.code', name: { $first: '$countryInfo.name' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        approved,
        featured,
        byType,
        byCountry
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};
