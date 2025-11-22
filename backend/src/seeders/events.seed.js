const mongoose = require('mongoose');
const Event = require('../models/Event');
const Country = require('../models/Country');
const User = require('../models/User');
require('dotenv').config();

const eventsData = [
  {
    title: {
      fr: "Sommet des Énergies Renouvelables de l'UEMOA 2026",
      en: "UEMOA Renewable Energy Summit 2026"
    },
    slug: "sommet-energies-renouvelables-uemoa-2026",
    description: {
      fr: "Le plus grand événement régional dédié aux énergies renouvelables réunira les acteurs clés du secteur pour échanger sur les innovations et opportunités.",
      en: "The largest regional event dedicated to renewable energy will bring together key sector stakeholders to discuss innovations and opportunities."
    },
    content: {
      fr: `
        <h2>À propos du sommet</h2>
        <p>Le Sommet des Énergies Renouvelables de l'UEMOA est l'événement annuel incontournable pour tous les acteurs du secteur énergétique en Afrique de l'Ouest.</p>

        <h3>Programme</h3>
        <ul>
          <li><strong>Jour 1 :</strong> Plénières - État des lieux et perspectives</li>
          <li><strong>Jour 2 :</strong> Ateliers techniques - Solaire, Éolien, Biogaz</li>
          <li><strong>Jour 3 :</strong> Rencontres B2B et visites de sites</li>
        </ul>

        <h3>Thématiques principales</h3>
        <ul>
          <li>Financement de projets renouvelables</li>
          <li>Innovations technologiques</li>
          <li>Politiques publiques favorables</li>
          <li>Accès à l'énergie en zone rurale</li>
        </ul>

        <h3>Pourquoi participer ?</h3>
        <ul>
          <li>Networking avec 500+ professionnels</li>
          <li>Découverte des dernières technologies</li>
          <li>Opportunités d'investissement</li>
          <li>Certification de participation</li>
        </ul>
      `,
      en: `
        <h2>About the summit</h2>
        <p>The UEMOA Renewable Energy Summit is the annual must-attend event for all energy sector stakeholders in West Africa.</p>

        <h3>Program</h3>
        <ul>
          <li><strong>Day 1:</strong> Plenaries - Current situation and prospects</li>
          <li><strong>Day 2:</strong> Technical workshops - Solar, Wind, Biogas</li>
          <li><strong>Day 3:</strong> B2B meetings and site visits</li>
        </ul>

        <h3>Main themes</h3>
        <ul>
          <li>Financing renewable projects</li>
          <li>Technological innovations</li>
          <li>Favorable public policies</li>
          <li>Energy access in rural areas</li>
        </ul>

        <h3>Why participate?</h3>
        <ul>
          <li>Networking with 500+ professionals</li>
          <li>Discover latest technologies</li>
          <li>Investment opportunities</li>
          <li>Participation certificate</li>
        </ul>
      `
    },
    category: 'conference',
    startDate: new Date('2026-03-15T09:00:00'),
    endDate: new Date('2026-03-17T18:00:00'),
    location: {
      type: 'physical',
      venue: 'Centre de Conférence Internationale',
      city: 'Dakar',
      address: 'Route de la Corniche Ouest, Dakar',
      coordinates: {
        type: 'Point',
        coordinates: [-17.4677, 14.7167] // [longitude, latitude] pour Dakar
      }
    },
    organizer: {
      name: 'Commission UEMOA',
      email: 'events@uemoa.int',
      phone: '+221 33 839 05 00'
    },
    status: 'upcoming',
    featured: true,
    registrationRequired: true,
    registrationLink: 'https://sommet-uemoa.org/inscription',
    maxAttendees: 500,
    tags: ['sommet', 'UEMOA', 'énergies renouvelables', 'networking']
  },
  {
    title: {
      fr: "Formation : Installation et Maintenance de Panneaux Solaires",
      en: "Training: Solar Panel Installation and Maintenance"
    },
    slug: "formation-installation-maintenance-solaire",
    description: {
      fr: "Formation pratique de 5 jours pour apprendre à installer et entretenir des systèmes photovoltaïques.",
      en: "5-day practical training to learn how to install and maintain photovoltaic systems."
    },
    content: {
      fr: `
        <h2>Formation certifiante</h2>
        <p>Cette formation intensive vous permettra d'acquérir toutes les compétences nécessaires pour devenir technicien solaire qualifié.</p>

        <h3>Programme détaillé</h3>
        <ul>
          <li><strong>Jour 1 :</strong> Principes du photovoltaïque</li>
          <li><strong>Jour 2 :</strong> Dimensionnement d'installations</li>
          <li><strong>Jour 3 :</strong> Installation pratique</li>
          <li><strong>Jour 4 :</strong> Maintenance et dépannage</li>
          <li><strong>Jour 5 :</strong> Sécurité et certification</li>
        </ul>

        <h3>Prérequis</h3>
        <ul>
          <li>Connaissances de base en électricité</li>
          <li>Niveau BAC ou équivalent</li>
        </ul>

        <h3>Certification</h3>
        <p>Certificat reconnu par l'État délivré en fin de formation après examen pratique.</p>
      `,
      en: `
        <h2>Certified training</h2>
        <p>This intensive training will enable you to acquire all the skills needed to become a qualified solar technician.</p>

        <h3>Detailed program</h3>
        <ul>
          <li><strong>Day 1:</strong> Photovoltaic principles</li>
          <li><strong>Day 2:</strong> Installation sizing</li>
          <li><strong>Day 3:</strong> Practical installation</li>
          <li><strong>Day 4:</strong> Maintenance and troubleshooting</li>
          <li><strong>Day 5:</strong> Safety and certification</li>
        </ul>

        <h3>Prerequisites</h3>
        <ul>
          <li>Basic knowledge of electricity</li>
          <li>High school level or equivalent</li>
        </ul>

        <h3>Certification</h3>
        <p>State-recognized certificate issued at the end of training after practical exam.</p>
      `
    },
    category: 'training',
    startDate: new Date('2026-01-20T08:00:00'),
    endDate: new Date('2026-01-24T17:00:00'),
    location: {
      type: 'physical',
      venue: 'Centre de Formation Technique',
      city: 'Ouagadougou',
      address: 'Avenue Kwame Nkrumah, Ouagadougou',
      coordinates: {
        type: 'Point',
        coordinates: [-1.5247, 12.3714] // Ouagadougou
      }
    },
    organizer: {
      name: 'Institut de Formation en Énergies Renouvelables',
      email: 'formation@ifer-bf.org',
      phone: '+226 25 30 60 70'
    },
    status: 'upcoming',
    featured: true,
    registrationRequired: true,
    registrationDeadline: new Date('2026-01-10'),
    maxAttendees: 30,
    tags: ['formation', 'solaire', 'certification', 'technique']
  },
  {
    title: {
      fr: "Webinaire : Financer votre projet d'énergie renouvelable",
      en: "Webinar: Financing your renewable energy project"
    },
    slug: "webinaire-financement-projet-energie-renouvelable",
    description: {
      fr: "Découvrez les différentes options de financement disponibles pour vos projets d'énergies renouvelables dans l'espace UEMOA.",
      en: "Discover the different financing options available for your renewable energy projects in the UEMOA area."
    },
    content: {
      fr: `
        <h2>Webinaire gratuit en ligne</h2>
        <p>Rejoignez notre webinaire interactif pour comprendre les mécanismes de financement de projets renouvelables.</p>

        <h3>Au programme</h3>
        <ul>
          <li>Panorama des sources de financement</li>
          <li>Fonds verts et subventions</li>
          <li>Prêts concessionnels</li>
          <li>Investissement privé et PPP</li>
          <li>Session Q&A avec des experts</li>
        </ul>

        <h3>Intervenants</h3>
        <ul>
          <li>Représentants de la BOAD</li>
          <li>Experts de la Banque Mondiale</li>
          <li>Investisseurs privés</li>
          <li>Porteurs de projets à succès</li>
        </ul>
      `,
      en: `
        <h2>Free online webinar</h2>
        <p>Join our interactive webinar to understand renewable project financing mechanisms.</p>

        <h3>Program</h3>
        <ul>
          <li>Overview of funding sources</li>
          <li>Green funds and grants</li>
          <li>Concessional loans</li>
          <li>Private investment and PPP</li>
          <li>Q&A session with experts</li>
        </ul>

        <h3>Speakers</h3>
        <ul>
          <li>BOAD representatives</li>
          <li>World Bank experts</li>
          <li>Private investors</li>
          <li>Successful project leaders</li>
        </ul>
      `
    },
    category: 'webinar',
    startDate: new Date('2025-12-10T15:00:00'),
    endDate: new Date('2025-12-10T17:00:00'),
    location: {
      type: 'online',
      onlineUrl: 'https://zoom.us/j/123456789'
    },
    organizer: {
      name: 'UEMOA Energy Platform',
      email: 'webinaires@uemoa-energy.org'
    },
    status: 'upcoming',
    featured: true,
    registrationRequired: true,
    tags: ['webinaire', 'financement', 'investissement', 'en ligne']
  },
  {
    title: {
      fr: "Salon des Technologies Vertes de Bamako",
      en: "Bamako Green Technologies Fair"
    },
    slug: "salon-technologies-vertes-bamako",
    description: {
      fr: "Exposition de technologies innovantes en énergies renouvelables et efficacité énergétique.",
      en: "Exhibition of innovative technologies in renewable energy and energy efficiency."
    },
    content: {
      fr: `
        <h2>3 jours d'innovation</h2>
        <p>Le Salon des Technologies Vertes réunira plus de 100 exposants et 3000 visiteurs professionnels.</p>

        <h3>Espaces d'exposition</h3>
        <ul>
          <li>Pavillon Solaire</li>
          <li>Espace Éolien et Hydraulique</li>
          <li>Zone Biogaz et Biomasse</li>
          <li>Village des Start-ups</li>
        </ul>

        <h3>Animations</h3>
        <ul>
          <li>Démonstrations en direct</li>
          <li>Conférences techniques</li>
          <li>Speed dating investisseurs-porteurs de projets</li>
          <li>Remise des prix de l'innovation</li>
        </ul>
      `,
      en: `
        <h2>3 days of innovation</h2>
        <p>The Green Technologies Fair will bring together more than 100 exhibitors and 3000 professional visitors.</p>

        <h3>Exhibition spaces</h3>
        <ul>
          <li>Solar Pavilion</li>
          <li>Wind and Hydro Space</li>
          <li>Biogas and Biomass Zone</li>
          <li>Start-up Village</li>
        </ul>

        <h3>Activities</h3>
        <ul>
          <li>Live demonstrations</li>
          <li>Technical conferences</li>
          <li>Investor-project leader speed dating</li>
          <li>Innovation awards ceremony</li>
        </ul>
      `
    },
    category: 'fair',
    startDate: new Date('2026-02-05T09:00:00'),
    endDate: new Date('2026-02-07T18:00:00'),
    location: {
      type: 'physical',
      venue: 'Palais de la Culture Amadou Hampaté Bâ',
      city: 'Bamako',
      address: 'Avenue de la Nation, Bamako',
      coordinates: {
        type: 'Point',
        coordinates: [-8.0029, 12.6392] // Bamako
      }
    },
    organizer: {
      name: 'Chambre de Commerce du Mali',
      email: 'salon@ccim.ml',
      phone: '+223 20 22 66 74'
    },
    status: 'upcoming',
    featured: false,
    registrationRequired: true,
    maxAttendees: 3000,
    tags: ['salon', 'exposition', 'Mali', 'innovation']
  },
  {
    title: {
      fr: "Atelier : Entrepreneuriat dans les énergies renouvelables",
      en: "Workshop: Entrepreneurship in renewable energy"
    },
    slug: "atelier-entrepreneuriat-energies-renouvelables",
    description: {
      fr: "Atelier pratique pour les entrepreneurs souhaitant lancer leur activité dans les énergies renouvelables.",
      en: "Practical workshop for entrepreneurs wishing to start their renewable energy business."
    },
    content: {
      fr: `
        <h2>Lancez votre entreprise verte</h2>
        <p>Cet atelier intensif de 2 jours vous donnera tous les outils pour démarrer votre business dans les énergies renouvelables.</p>

        <h3>Modules</h3>
        <ul>
          <li>Identifier les opportunités de marché</li>
          <li>Élaborer un business plan solide</li>
          <li>Trouver des financements</li>
          <li>Aspects réglementaires et juridiques</li>
          <li>Marketing et développement commercial</li>
        </ul>

        <h3>Méthode</h3>
        <p>Approche interactive avec études de cas, travaux de groupe et coaching personnalisé.</p>
      `,
      en: `
        <h2>Launch your green business</h2>
        <p>This intensive 2-day workshop will give you all the tools to start your renewable energy business.</p>

        <h3>Modules</h3>
        <ul>
          <li>Identify market opportunities</li>
          <li>Develop a solid business plan</li>
          <li>Find financing</li>
          <li>Regulatory and legal aspects</li>
          <li>Marketing and business development</li>
        </ul>

        <h3>Method</h3>
        <p>Interactive approach with case studies, group work and personalized coaching.</p>
      `
    },
    category: 'workshop',
    startDate: new Date('2025-12-15T09:00:00'),
    endDate: new Date('2025-12-16T17:00:00'),
    location: {
      type: 'hybrid',
      venue: 'Hub d\'Innovation de Lomé',
      city: 'Lomé',
      address: 'Boulevard du 13 Janvier, Lomé',
      onlineUrl: 'https://meet.google.com/abc-defg-hij',
      coordinates: {
        type: 'Point',
        coordinates: [1.2255, 6.1256] // Lomé
      }
    },
    organizer: {
      name: 'Incubateur Togo Tech',
      email: 'contact@togotech.tg',
      phone: '+228 22 21 42 86'
    },
    status: 'upcoming',
    featured: false,
    registrationRequired: true,
    registrationDeadline: new Date('2025-12-08'),
    maxAttendees: 40,
    tags: ['entrepreneuriat', 'atelier', 'business', 'Togo']
  }
];

async function seedEvents() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion MongoDB établie');

    // Récupérer l'utilisateur admin pour l'associer comme créateur
    const admin = await User.findOne({ email: 'admin@uemoa-energy.org' });
    if (!admin) {
      console.error('❌ Utilisateur admin non trouvé. Exécutez d\'abord le seeder admin.');
      process.exit(1);
    }

    // Récupérer les pays pour les lier aux événements
    const senegal = await Country.findOne({ code: 'SN' });
    const burkinafaso = await Country.findOne({ code: 'BF' });
    const mali = await Country.findOne({ code: 'ML' });
    const togo = await Country.findOne({ code: 'TG' });

    // Associer le créateur aux événements
    eventsData.forEach(event => {
      event.createdBy = admin._id;
    });

    // Associer les pays aux événements (pour location.country)
    if (senegal) eventsData[0].location.country = senegal._id;
    if (burkinafaso) eventsData[1].location.country = burkinafaso._id;
    if (mali) eventsData[3].location.country = mali._id;
    if (togo) eventsData[4].location.country = togo._id;

    // Supprimer les événements existants
    await Event.deleteMany({});
    console.log('🗑️  Événements existants supprimés');

    // Insérer les nouveaux événements
    const insertedEvents = await Event.insertMany(eventsData);
    console.log(`✅ ${insertedEvents.length} événements insérés avec succès`);

    // Afficher les événements créés
    insertedEvents.forEach((event, index) => {
      console.log(`   ${index + 1}. ${event.title.fr} (${event.slug})`);
    });

    console.log('\n🎉 Seeding des événements terminé avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding des événements:', error);
    process.exit(1);
  }
}

// Exécuter le seeder si appelé directement
if (require.main === module) {
  seedEvents();
}

module.exports = seedEvents;
