require('dotenv').config();
const mongoose = require('mongoose');
const Country = require('../models/Country');
const connectDB = require('../config/database');

const countries = [
  {
    name: {
      fr: 'Bénin',
      en: 'Benin'
    },
    code: 'BJ',
    capital: 'Porto-Novo',
    flag: '🇧🇯',
    location: {
      type: 'Point',
      coordinates: [2.3158, 9.3077] // [longitude, latitude] - Centre du Bénin
    },
    order: 1
  },
  {
    name: {
      fr: 'Burkina Faso',
      en: 'Burkina Faso'
    },
    code: 'BF',
    capital: 'Ouagadougou',
    flag: '🇧🇫',
    location: {
      type: 'Point',
      coordinates: [-1.5616, 12.2383]
    },
    order: 2
  },
  {
    name: {
      fr: 'Côte d\'Ivoire',
      en: 'Ivory Coast'
    },
    code: 'CI',
    capital: 'Yamoussoukro',
    flag: '🇨🇮',
    location: {
      type: 'Point',
      coordinates: [-5.5471, 7.5400]
    },
    order: 3
  },
  {
    name: {
      fr: 'Guinée-Bissau',
      en: 'Guinea-Bissau'
    },
    code: 'GW',
    capital: 'Bissau',
    flag: '🇬🇼',
    location: {
      type: 'Point',
      coordinates: [-15.1804, 11.8037]
    },
    order: 4
  },
  {
    name: {
      fr: 'Mali',
      en: 'Mali'
    },
    code: 'ML',
    capital: 'Bamako',
    flag: '🇲🇱',
    location: {
      type: 'Point',
      coordinates: [-3.9962, 17.5707]
    },
    order: 5
  },
  {
    name: {
      fr: 'Niger',
      en: 'Niger'
    },
    code: 'NE',
    capital: 'Niamey',
    flag: '🇳🇪',
    location: {
      type: 'Point',
      coordinates: [8.0817, 17.6078]
    },
    order: 6
  },
  {
    name: {
      fr: 'Sénégal',
      en: 'Senegal'
    },
    code: 'SN',
    capital: 'Dakar',
    flag: '🇸🇳',
    location: {
      type: 'Point',
      coordinates: [-14.4524, 14.4974]
    },
    order: 7
  },
  {
    name: {
      fr: 'Togo',
      en: 'Togo'
    },
    code: 'TG',
    capital: 'Lomé',
    flag: '🇹🇬',
    location: {
      type: 'Point',
      coordinates: [0.8248, 8.6195]
    },
    order: 8
  }
];

const seedCountries = async () => {
  try {
    await connectDB();

    // Supprimer les pays existants
    await Country.deleteMany({});
    console.log('✅ Pays existants supprimés');

    // Insérer les nouveaux pays
    const createdCountries = await Country.insertMany(countries);
    console.log(`✅ ${createdCountries.length} pays UEMOA créés avec succès`);

    createdCountries.forEach(country => {
      console.log(`   - ${country.name.fr} (${country.code})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding des pays:', error);
    process.exit(1);
  }
};

// Exécuter si appelé directement
if (require.main === module) {
  seedCountries();
}

module.exports = seedCountries;
