require('dotenv').config();
const mongoose = require('mongoose');
const Actor = require('../models/Actor');
const User = require('../models/User');
const Country = require('../models/Country');
const Category = require('../models/Category');
const Energy = require('../models/Energy');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connecté: ${mongoose.connection.host}`);
    console.log(`📊 Base de données: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

const seedActors = async () => {
  try {
    await connectDB();

    // Récupérer les IDs nécessaires
    const countries = await Country.find();
    const categories = await Category.find();
    const energies = await Energy.find();
    const adminUser = await User.findOne({ role: 'admin' });

    if (!adminUser) {
      console.error('❌ Erreur: Aucun utilisateur admin trouvé. Exécutez d\'abord npm run seed:admin');
      process.exit(1);
    }

    // Supprimer les acteurs existants
    await Actor.deleteMany({});
    console.log('✅ Acteurs existants supprimés');

    // Créer des acteurs de test
    const actorsData = [
      {
        name: 'SolarTech Sénégal',
        acronym: 'STS',
        type: 'entreprise',
        description: {
          fr: 'Entreprise leader dans l\'installation de panneaux solaires photovoltaïques au Sénégal. Plus de 500 installations résidentielles et commerciales à notre actif.',
          en: 'Leading company in the installation of photovoltaic solar panels in Senegal. Over 500 residential and commercial installations to our credit.'
        },
        country: countries.find(c => c.code === 'SN')?._id,
        city: 'Dakar',
        address: 'Zone industrielle de Dakar',
        location: {
          type: 'Point',
          coordinates: [-17.4467, 14.7167]
        },
        categories: [
          categories.find(c => c.slug === 'production-energie')?._id,
          categories.find(c => c.slug === 'installation-maintenance')?._id
        ],
        energyTypes: [
          energies.find(e => e.slug === 'solaire-photovoltaique')?._id
        ],
        contact: {
          email: 'contact@solartech-sn.com',
          phone: '+221 33 123 45 67',
          website: 'https://solartech-sn.com',
          socialMedia: {
            linkedin: 'solartech-senegal',
            twitter: '@solartechsn',
            facebook: 'SolarTechSenegal'
          }
        },
        yearFounded: 2018,
        employeesCount: '11-50',
        certifications: ['ISO 9001', 'Certification Solaire IEC'],
        projects: [
          {
            title: 'Installation solaire Hôtel Teranga',
            description: 'Installation de 200 kWc pour alimentation partielle de l\'hôtel',
            year: 2023,
            images: []
          },
          {
            title: 'Ferme solaire de Keur Momar Sarr',
            description: 'Centrale solaire de 5 MWc alimentant 5000 foyers',
            year: 2022,
            images: []
          }
        ],
        status: 'approved',
        verified: true,
        featured: true,
        createdBy: adminUser._id,
        approvedAt: new Date(),
        approvedBy: adminUser._id
      },
      {
        name: 'EcoWind Burkina',
        acronym: 'EWB',
        type: 'entreprise',
        description: {
          fr: 'Spécialiste des solutions éoliennes adaptées au climat sahélien. Études de faisabilité et installation de parcs éoliens.',
          en: 'Specialist in wind solutions adapted to the Sahelian climate. Feasibility studies and wind farm installation.'
        },
        country: countries.find(c => c.code === 'BF')?._id,
        city: 'Ouagadougou',
        address: 'Avenue de la Nation',
        location: {
          type: 'Point',
          coordinates: [-1.5247, 12.3714]
        },
        categories: [
          categories.find(c => c.slug === 'production-energie')?._id,
          categories.find(c => c.slug === 'conseil-ingenierie')?._id,
          categories.find(c => c.slug === 'recherche-developpement')?._id
        ],
        energyTypes: [
          energies.find(e => e.slug === 'eolien')?._id
        ],
        contact: {
          email: 'info@ecowind-bf.com',
          phone: '+226 25 12 34 56',
          website: 'https://ecowind-burkina.com'
        },
        yearFounded: 2019,
        employeesCount: '11-50',
        certifications: ['ISO 14001'],
        projects: [
          {
            title: 'Parc éolien de Tanghin Dassouri',
            description: 'Première ferme éolienne du Burkina Faso - 10 MW',
            year: 2023
          }
        ],
        status: 'approved',
        verified: true,
        featured: true,
        createdBy: adminUser._id,
        approvedAt: new Date(),
        approvedBy: adminUser._id
      },
      {
        name: 'Université des Sciences Énergétiques de Côte d\'Ivoire',
        acronym: 'USECI',
        type: 'universite',
        description: {
          fr: 'Institution de formation et de recherche en énergies renouvelables. Masters et doctorats spécialisés en ingénierie énergétique.',
          en: 'Training and research institution in renewable energies. Specialized Masters and PhDs in energy engineering.'
        },
        country: countries.find(c => c.code === 'CI')?._id,
        city: 'Abidjan',
        address: 'Cocody, Rue des Jardins',
        location: {
          type: 'Point',
          coordinates: [-4.0083, 5.3599]
        },
        categories: [
          categories.find(c => c.slug === 'formation-education')?._id,
          categories.find(c => c.slug === 'recherche-developpement')?._id
        ],
        energyTypes: [
          energies.find(e => e.slug === 'solaire-photovoltaique')?._id,
          energies.find(e => e.slug === 'hydraulique')?._id,
          energies.find(e => e.slug === 'biomasse')?._id
        ],
        contact: {
          email: 'admission@useci.edu.ci',
          phone: '+225 27 22 12 34 56',
          website: 'https://useci.edu.ci'
        },
        yearFounded: 2015,
        employeesCount: '51-200',
        certifications: ['Accréditation CAMES'],
        status: 'approved',
        verified: true,
        featured: false,
        createdBy: adminUser._id,
        approvedAt: new Date(),
        approvedBy: adminUser._id
      },
      {
        name: 'HydroTogo - Énergie Hydraulique',
        acronym: 'HT',
        type: 'entreprise',
        description: {
          fr: 'Développement de micro-centrales hydrauliques pour l\'électrification rurale. Solutions innovantes pour les communautés isolées.',
          en: 'Development of micro hydro power plants for rural electrification. Innovative solutions for isolated communities.'
        },
        country: countries.find(c => c.code === 'TG')?._id,
        city: 'Lomé',
        address: 'Quartier Administratif',
        location: {
          type: 'Point',
          coordinates: [1.2255, 6.1375]
        },
        categories: [
          categories.find(c => c.slug === 'production-energie')?._id,
          categories.find(c => c.slug === 'installation-maintenance')?._id
        ],
        energyTypes: [
          energies.find(e => e.slug === 'hydraulique')?._id
        ],
        contact: {
          email: 'contact@hydrotogo.tg',
          phone: '+228 22 12 34 56',
          website: 'https://hydrotogo.tg'
        },
        yearFounded: 2020,
        employeesCount: '1-10',
        status: 'approved',
        verified: false,
        featured: false,
        createdBy: adminUser._id,
        approvedAt: new Date(),
        approvedBy: adminUser._id
      },
      {
        name: 'BioMasse Mali - Solutions Énergétiques',
        acronym: 'BMM',
        type: 'entreprise',
        description: {
          fr: 'Transformation de déchets agricoles en énergie. Production de biogaz et de biocarburants à partir de résidus de cultures.',
          en: 'Transformation of agricultural waste into energy. Biogas and biofuel production from crop residues.'
        },
        country: countries.find(c => c.code === 'ML')?._id,
        city: 'Bamako',
        address: 'Zone industrielle de Sotuba',
        location: {
          type: 'Point',
          coordinates: [-7.9889, 12.6392]
        },
        categories: [
          categories.find(c => c.slug === 'production-energie')?._id,
          categories.find(c => c.slug === 'recherche-developpement')?._id
        ],
        energyTypes: [
          energies.find(e => e.slug === 'biomasse')?._id,
          energies.find(e => e.slug === 'biogaz')?._id
        ],
        contact: {
          email: 'info@biomasse-mali.ml',
          phone: '+223 20 12 34 56'
        },
        yearFounded: 2021,
        employeesCount: '11-50',
        status: 'approved',
        verified: true,
        featured: false,
        createdBy: adminUser._id,
        approvedAt: new Date(),
        approvedBy: adminUser._id
      },
      {
        name: 'Niger Green Energy Consultants',
        acronym: 'NGEC',
        type: 'ong',
        description: {
          fr: 'ONG spécialisée dans le conseil en transition énergétique. Accompagnement des collectivités et entreprises vers les énergies renouvelables.',
          en: 'NGO specializing in energy transition consulting. Supporting local authorities and businesses towards renewable energies.'
        },
        country: countries.find(c => c.code === 'NE')?._id,
        city: 'Niamey',
        address: 'Plateau 2',
        location: {
          type: 'Point',
          coordinates: [2.1098, 13.5127]
        },
        categories: [
          categories.find(c => c.slug === 'conseil-ingenierie')?._id,
          categories.find(c => c.slug === 'formation-education')?._id
        ],
        energyTypes: [
          energies.find(e => e.slug === 'solaire-photovoltaique')?._id,
          energies.find(e => e.slug === 'eolien')?._id,
          energies.find(e => e.slug === 'hydrogene-vert')?._id
        ],
        contact: {
          email: 'contact@ngec.ne',
          phone: '+227 20 12 34 56',
          website: 'https://ngec-niger.org'
        },
        yearFounded: 2017,
        employeesCount: '1-10',
        status: 'approved',
        verified: false,
        featured: false,
        createdBy: adminUser._id,
        approvedAt: new Date(),
        approvedBy: adminUser._id
      },
      {
        name: 'GreenTech Manufacturing Bénin',
        acronym: 'GTMB',
        type: 'entreprise',
        description: {
          fr: 'Fabricant local d\'équipements solaires. Production de supports de panneaux, onduleurs et systèmes de stockage adaptés au marché UEMOA.',
          en: 'Local manufacturer of solar equipment. Production of panel mounts, inverters and storage systems adapted to the WAEMU market.'
        },
        country: countries.find(c => c.code === 'BJ')?._id,
        city: 'Cotonou',
        address: 'Zone industrielle de Godomey',
        location: {
          type: 'Point',
          coordinates: [2.4374, 6.3703]
        },
        categories: [
          categories.find(c => c.slug === 'fabrication-equipements')?._id
        ],
        energyTypes: [
          energies.find(e => e.slug === 'solaire-photovoltaique')?._id,
          energies.find(e => e.slug === 'solaire-thermique')?._id
        ],
        contact: {
          email: 'commercial@greentech-benin.bj',
          phone: '+229 21 12 34 56',
          website: 'https://greentech-benin.com'
        },
        yearFounded: 2019,
        employeesCount: '51-200',
        certifications: ['ISO 9001', 'CE'],
        status: 'approved',
        verified: true,
        featured: false,
        createdBy: adminUser._id,
        approvedAt: new Date(),
        approvedBy: adminUser._id
      },
      {
        name: 'Fonds d\'Investissement Énergies Vertes UEMOA',
        acronym: 'FIEV-UEMOA',
        type: 'entreprise',
        description: {
          fr: 'Fonds d\'investissement dédié au financement de projets d\'énergies renouvelables dans la zone UEMOA. Capital de 50 millions d\'euros.',
          en: 'Investment fund dedicated to financing renewable energy projects in the WAEMU zone. Capital of 50 million euros.'
        },
        country: countries.find(c => c.code === 'SN')?._id,
        city: 'Dakar',
        address: 'Plateau, Avenue Roume',
        location: {
          type: 'Point',
          coordinates: [-17.4467, 14.6937]
        },
        categories: [
          categories.find(c => c.slug === 'financement-projets')?._id
        ],
        energyTypes: [
          energies.find(e => e.slug === 'solaire-photovoltaique')?._id,
          energies.find(e => e.slug === 'eolien')?._id,
          energies.find(e => e.slug === 'hydraulique')?._id,
          energies.find(e => e.slug === 'biomasse')?._id
        ],
        contact: {
          email: 'invest@fiev-uemoa.org',
          phone: '+221 33 889 12 34',
          website: 'https://fiev-uemoa.org'
        },
        yearFounded: 2016,
        employeesCount: '11-50',
        status: 'approved',
        verified: true,
        featured: true,
        createdBy: adminUser._id,
        approvedAt: new Date(),
        approvedBy: adminUser._id
      },
      {
        name: 'Centre de Recherche en Énergies Renouvelables',
        acronym: 'CRER-GW',
        type: 'recherche',
        description: {
          fr: 'Centre de recherche public dédié à l\'innovation en matière d\'énergies renouvelables. Partenariats avec universités européennes.',
          en: 'Public research center dedicated to innovation in renewable energies. Partnerships with European universities.'
        },
        country: countries.find(c => c.code === 'GW')?._id,
        city: 'Bissau',
        address: 'Avenue Amilcar Cabral',
        location: {
          type: 'Point',
          coordinates: [-15.5989, 11.8637]
        },
        categories: [
          categories.find(c => c.slug === 'recherche-developpement')?._id
        ],
        energyTypes: [
          energies.find(e => e.slug === 'solaire-photovoltaique')?._id,
          energies.find(e => e.slug === 'biomasse')?._id,
          energies.find(e => e.slug === 'biogaz')?._id
        ],
        contact: {
          email: 'info@crer.gw',
          phone: '+245 320 12 34'
        },
        yearFounded: 2018,
        employeesCount: '11-50',
        status: 'pending',
        verified: false,
        featured: false,
        createdBy: adminUser._id
      },
      {
        name: 'Solar Academy West Africa',
        acronym: 'SAWA',
        type: 'association',
        description: {
          fr: 'Centre de formation technique en installation solaire. Formations certifiantes de 3 à 6 mois pour techniciens et installateurs.',
          en: 'Technical training center in solar installation. Certifying training from 3 to 6 months for technicians and installers.'
        },
        country: countries.find(c => c.code === 'CI')?._id,
        city: 'Abidjan',
        address: 'Yopougon, Zone industrielle',
        location: {
          type: 'Point',
          coordinates: [-4.0856, 5.3364]
        },
        categories: [
          categories.find(c => c.slug === 'formation-education')?._id
        ],
        energyTypes: [
          energies.find(e => e.slug === 'solaire-photovoltaique')?._id,
          energies.find(e => e.slug === 'solaire-thermique')?._id
        ],
        contact: {
          email: 'formation@sawa.ci',
          phone: '+225 27 21 12 34 56',
          website: 'https://solar-academy-wa.org'
        },
        yearFounded: 2020,
        employeesCount: '11-50',
        certifications: ['Certification FAFPA'],
        status: 'approved',
        verified: true,
        featured: false,
        createdBy: adminUser._id,
        approvedAt: new Date(),
        approvedBy: adminUser._id
      }
    ];

    // Filtrer les acteurs avec des données valides
    const validActors = actorsData.filter(actor =>
      actor.country &&
      actor.categories.every(c => c) &&
      actor.energyTypes.every(e => e)
    );

    // Insérer les acteurs
    const actors = await Actor.insertMany(validActors);

    console.log(`✅ ${actors.length} acteurs de test créés avec succès`);
    actors.forEach(actor => {
      console.log(`   - ${actor.name} (${actor.type}) - ${actor.status}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed des acteurs:', error);
    process.exit(1);
  }
};

seedActors();
