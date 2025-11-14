require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const connectDB = require('../config/database');

const categories = [
  {
    name: {
      fr: 'Production d\'énergie',
      en: 'Energy Production'
    },
    slug: 'production-energie',
    description: {
      fr: 'Production et génération d\'énergie renouvelable',
      en: 'Renewable energy production and generation'
    },
    icon: '⚡',
    color: '#F59E0B',
    order: 1
  },
  {
    name: {
      fr: 'Distribution et réseau',
      en: 'Distribution and Grid'
    },
    slug: 'distribution-reseau',
    description: {
      fr: 'Distribution d\'énergie et gestion de réseau électrique',
      en: 'Energy distribution and electrical grid management'
    },
    icon: '🔌',
    color: '#3B82F6',
    order: 2
  },
  {
    name: {
      fr: 'Installation et maintenance',
      en: 'Installation and Maintenance'
    },
    slug: 'installation-maintenance',
    description: {
      fr: 'Installation, entretien et maintenance d\'équipements énergétiques',
      en: 'Installation, servicing and maintenance of energy equipment'
    },
    icon: '🔧',
    color: '#8B5CF6',
    order: 3
  },
  {
    name: {
      fr: 'Recherche et développement',
      en: 'Research and Development'
    },
    slug: 'recherche-developpement',
    description: {
      fr: 'Recherche, innovation et développement de nouvelles technologies',
      en: 'Research, innovation and development of new technologies'
    },
    icon: '🔬',
    color: '#10B981',
    order: 4
  },
  {
    name: {
      fr: 'Formation et éducation',
      en: 'Training and Education'
    },
    slug: 'formation-education',
    description: {
      fr: 'Formation professionnelle et sensibilisation aux énergies renouvelables',
      en: 'Professional training and renewable energy awareness'
    },
    icon: '📚',
    color: '#EF4444',
    order: 5
  },
  {
    name: {
      fr: 'Conseil et ingénierie',
      en: 'Consulting and Engineering'
    },
    slug: 'conseil-ingenierie',
    description: {
      fr: 'Services de conseil, étude et ingénierie de projets énergétiques',
      en: 'Consulting, study and engineering services for energy projects'
    },
    icon: '💼',
    color: '#06B6D4',
    order: 6
  },
  {
    name: {
      fr: 'Fabrication d\'équipements',
      en: 'Equipment Manufacturing'
    },
    slug: 'fabrication-equipements',
    description: {
      fr: 'Fabrication et fourniture d\'équipements pour énergies renouvelables',
      en: 'Manufacturing and supply of renewable energy equipment'
    },
    icon: '🏭',
    color: '#F97316',
    order: 7
  },
  {
    name: {
      fr: 'Financement de projets',
      en: 'Project Financing'
    },
    slug: 'financement-projets',
    description: {
      fr: 'Financement, investissement et soutien financier aux projets',
      en: 'Financing, investment and financial support for projects'
    },
    icon: '💰',
    color: '#14B8A6',
    order: 8
  }
];

const seedCategories = async () => {
  try {
    await connectDB();

    // Supprimer les catégories existantes
    await Category.deleteMany({});
    console.log('✅ Catégories existantes supprimées');

    // Insérer les nouvelles catégories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ ${createdCategories.length} catégories créées avec succès`);

    createdCategories.forEach(category => {
      console.log(`   - ${category.name.fr} (${category.slug})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding des catégories:', error);
    process.exit(1);
  }
};

// Exécuter si appelé directement
if (require.main === module) {
  seedCategories();
}

module.exports = seedCategories;
