require('dotenv').config();
const mongoose = require('mongoose');
const Energy = require('../models/Energy');
const connectDB = require('../config/database');

const energies = [
  {
    name: {
      fr: 'Solaire photovoltaïque',
      en: 'Solar Photovoltaic'
    },
    slug: 'solaire-photovoltaique',
    description: {
      fr: 'Production d\'électricité par conversion directe de la lumière solaire',
      en: 'Electricity production through direct conversion of sunlight'
    },
    icon: '☀️',
    color: '#F59E0B',
    order: 1
  },
  {
    name: {
      fr: 'Solaire thermique',
      en: 'Solar Thermal'
    },
    slug: 'solaire-thermique',
    description: {
      fr: 'Utilisation de la chaleur du soleil pour la production d\'énergie',
      en: 'Use of solar heat for energy production'
    },
    icon: '🌡️',
    color: '#F97316',
    order: 2
  },
  {
    name: {
      fr: 'Éolien',
      en: 'Wind Energy'
    },
    slug: 'eolien',
    description: {
      fr: 'Production d\'énergie par la force du vent',
      en: 'Energy production through wind power'
    },
    icon: '💨',
    color: '#3B82F6',
    order: 3
  },
  {
    name: {
      fr: 'Hydraulique',
      en: 'Hydroelectric'
    },
    slug: 'hydraulique',
    description: {
      fr: 'Production d\'énergie par la force de l\'eau',
      en: 'Energy production through water power'
    },
    icon: '🌊',
    color: '#06B6D4',
    order: 4
  },
  {
    name: {
      fr: 'Biomasse',
      en: 'Biomass'
    },
    slug: 'biomasse',
    description: {
      fr: 'Énergie produite à partir de matières organiques',
      en: 'Energy produced from organic matter'
    },
    icon: '🌱',
    color: '#10B981',
    order: 5
  },
  {
    name: {
      fr: 'Biogaz',
      en: 'Biogas'
    },
    slug: 'biogaz',
    description: {
      fr: 'Gaz produit par fermentation de matières organiques',
      en: 'Gas produced by fermentation of organic matter'
    },
    icon: '♻️',
    color: '#14B8A6',
    order: 6
  },
  {
    name: {
      fr: 'Géothermie',
      en: 'Geothermal'
    },
    slug: 'geothermie',
    description: {
      fr: 'Énergie extraite de la chaleur de la Terre',
      en: 'Energy extracted from Earth\'s heat'
    },
    icon: '🌋',
    color: '#EF4444',
    order: 7
  },
  {
    name: {
      fr: 'Hydrogène vert',
      en: 'Green Hydrogen'
    },
    slug: 'hydrogene-vert',
    description: {
      fr: 'Hydrogène produit par électrolyse d\'eau avec de l\'énergie renouvelable',
      en: 'Hydrogen produced by water electrolysis using renewable energy'
    },
    icon: '🔋',
    color: '#8B5CF6',
    order: 8
  }
];

const seedEnergies = async () => {
  try {
    await connectDB();

    // Supprimer les énergies existantes
    await Energy.deleteMany({});
    console.log('✅ Types d\'énergies existants supprimés');

    // Insérer les nouveaux types d'énergies
    const createdEnergies = await Energy.insertMany(energies);
    console.log(`✅ ${createdEnergies.length} types d'énergies créés avec succès`);

    createdEnergies.forEach(energy => {
      console.log(`   - ${energy.name.fr} (${energy.slug})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding des énergies:', error);
    process.exit(1);
  }
};

// Exécuter si appelé directement
if (require.main === module) {
  seedEnergies();
}

module.exports = seedEnergies;
