const mongoose = require('mongoose');
const News = require('../models/News');
const Country = require('../models/Country');
const User = require('../models/User');
require('dotenv').config();

const newsData = [
  {
    title: {
      fr: "Le Sénégal inaugure la plus grande centrale solaire d'Afrique de l'Ouest",
      en: "Senegal inaugurates West Africa's largest solar power plant"
    },
    slug: "senegal-plus-grande-centrale-solaire-afrique-ouest",
    excerpt: {
      fr: "Une nouvelle centrale solaire de 60 MW vient d'être inaugurée à Bokhol, marquant une étape importante dans la transition énergétique du pays.",
      en: "A new 60 MW solar plant has been inaugurated in Bokhol, marking an important step in the country's energy transition."
    },
    content: {
      fr: `
        <h2>Une étape majeure pour les énergies renouvelables</h2>
        <p>Le Sénégal a franchi une étape importante dans sa transition énergétique avec l'inauguration de la centrale solaire de Bokhol, la plus grande installation solaire photovoltaïque d'Afrique de l'Ouest. Cette centrale de 60 MW permettra d'alimenter plus de 160 000 foyers en électricité propre.</p>

        <h3>Caractéristiques techniques</h3>
        <ul>
          <li>Puissance installée : 60 MW</li>
          <li>Superficie : 80 hectares</li>
          <li>Production annuelle : 95 000 MWh</li>
          <li>Réduction CO2 : 70 000 tonnes/an</li>
        </ul>

        <h3>Impact économique et social</h3>
        <p>Le projet a créé plus de 300 emplois pendant la phase de construction et emploiera une trentaine de personnes de façon permanente pour l'exploitation et la maintenance.</p>

        <p>Cette réalisation s'inscrit dans l'objectif du Sénégal d'atteindre 30% d'énergies renouvelables dans son mix énergétique d'ici 2025.</p>
      `,
      en: `
        <h2>A major milestone for renewable energy</h2>
        <p>Senegal has reached an important milestone in its energy transition with the inauguration of the Bokhol solar plant, the largest photovoltaic solar installation in West Africa. This 60 MW plant will power more than 160,000 households with clean electricity.</p>

        <h3>Technical specifications</h3>
        <ul>
          <li>Installed capacity: 60 MW</li>
          <li>Area: 80 hectares</li>
          <li>Annual production: 95,000 MWh</li>
          <li>CO2 reduction: 70,000 tons/year</li>
        </ul>

        <h3>Economic and social impact</h3>
        <p>The project created more than 300 jobs during the construction phase and will employ around thirty people permanently for operation and maintenance.</p>

        <p>This achievement is part of Senegal's goal to reach 30% renewable energy in its energy mix by 2025.</p>
      `
    },
    category: 'innovation',
    tags: ['solaire', 'Sénégal', 'centrale électrique', 'énergies renouvelables'],
    status: 'published',
    featured: true,
    publishedAt: new Date('2025-11-10')
  },
  {
    title: {
      fr: "La Côte d'Ivoire lance un programme de biogaz pour 10 000 ménages ruraux",
      en: "Ivory Coast launches biogas program for 10,000 rural households"
    },
    slug: "cote-ivoire-programme-biogaz-menages-ruraux",
    excerpt: {
      fr: "Le gouvernement ivoirien annonce un ambitieux programme d'installation de digesteurs de biogaz dans les zones rurales.",
      en: "The Ivorian government announces an ambitious program to install biogas digesters in rural areas."
    },
    content: {
      fr: `
        <h2>Un accès à l'énergie pour tous</h2>
        <p>La Côte d'Ivoire vient de lancer un programme national d'installation de digesteurs de biogaz dans 10 000 ménages ruraux. Cette initiative vise à améliorer l'accès à l'énergie tout en réduisant la déforestation.</p>

        <h3>Avantages du biogaz</h3>
        <ul>
          <li>Énergie propre et renouvelable</li>
          <li>Réduction de l'utilisation du bois de chauffe</li>
          <li>Production de fertilisant naturel</li>
          <li>Amélioration de la santé (moins de fumée)</li>
        </ul>

        <p>Le programme sera déployé sur 3 ans avec le soutien d'organisations internationales.</p>
      `,
      en: `
        <h2>Energy access for all</h2>
        <p>Ivory Coast has launched a national program to install biogas digesters in 10,000 rural households. This initiative aims to improve energy access while reducing deforestation.</p>

        <h3>Benefits of biogas</h3>
        <ul>
          <li>Clean and renewable energy</li>
          <li>Reduced use of firewood</li>
          <li>Production of natural fertilizer</li>
          <li>Health improvement (less smoke)</li>
        </ul>

        <p>The program will be deployed over 3 years with support from international organizations.</p>
      `
    },
    category: 'project',
    tags: ['biogaz', 'Côte d\'Ivoire', 'rural', 'accès à l\'énergie'],
    status: 'published',
    featured: true,
    publishedAt: new Date('2025-11-08')
  },
  {
    title: {
      fr: "Le Burkina Faso développe son potentiel éolien avec un parc de 40 MW",
      en: "Burkina Faso develops wind potential with 40 MW park"
    },
    slug: "burkina-faso-parc-eolien-40mw",
    excerpt: {
      fr: "Le premier parc éolien du Burkina Faso verra bientôt le jour dans la région du Sahel, avec une capacité de 40 MW.",
      en: "Burkina Faso's first wind farm will soon see the light in the Sahel region, with a capacity of 40 MW."
    },
    content: {
      fr: `
        <h2>Premier parc éolien burkinabé</h2>
        <p>Le Burkina Faso s'apprête à inaugurer son premier parc éolien dans la région du Sahel. Ce projet de 40 MW marque l'entrée du pays dans l'ère de l'énergie éolienne.</p>

        <h3>Détails du projet</h3>
        <ul>
          <li>20 éoliennes de 2 MW chacune</li>
          <li>Investissement : 60 millions d'euros</li>
          <li>Production : 150 GWh/an</li>
          <li>Mise en service : mi-2026</li>
        </ul>

        <p>Ce parc contribuera significativement à l'objectif national de 30% d'énergies renouvelables d'ici 2030.</p>
      `,
      en: `
        <h2>Burkina Faso's first wind farm</h2>
        <p>Burkina Faso is preparing to inaugurate its first wind farm in the Sahel region. This 40 MW project marks the country's entry into the wind energy era.</p>

        <h3>Project details</h3>
        <ul>
          <li>20 wind turbines of 2 MW each</li>
          <li>Investment: 60 million euros</li>
          <li>Production: 150 GWh/year</li>
          <li>Commissioning: mid-2026</li>
        </ul>

        <p>This park will significantly contribute to the national goal of 30% renewable energy by 2030.</p>
      `
    },
    category: 'innovation',
    tags: ['éolien', 'Burkina Faso', 'parc éolien'],
    status: 'published',
    featured: false,
    publishedAt: new Date('2025-11-05')
  },
  {
    title: {
      fr: "Formation de 500 techniciens en maintenance solaire au Mali",
      en: "Training of 500 solar maintenance technicians in Mali"
    },
    slug: "formation-techniciens-solaire-mali",
    excerpt: {
      fr: "Un nouveau programme de formation vise à créer une main-d'œuvre qualifiée pour l'entretien des installations solaires.",
      en: "A new training program aims to create a skilled workforce for solar installation maintenance."
    },
    content: {
      fr: `
        <h2>Développement des compétences locales</h2>
        <p>Le Mali lance un programme ambitieux de formation de 500 techniciens spécialisés dans la maintenance des installations solaires. Cette initiative répond au besoin croissant de main-d'œuvre qualifiée dans le secteur des énergies renouvelables.</p>

        <h3>Contenu de la formation</h3>
        <ul>
          <li>Installation de panneaux photovoltaïques</li>
          <li>Maintenance préventive et corrective</li>
          <li>Diagnostic de pannes</li>
          <li>Sécurité électrique</li>
        </ul>

        <p>La formation durera 6 mois et combinera théorie et pratique sur des installations réelles.</p>
      `,
      en: `
        <h2>Local skills development</h2>
        <p>Mali is launching an ambitious program to train 500 technicians specialized in solar installation maintenance. This initiative responds to the growing need for skilled labor in the renewable energy sector.</p>

        <h3>Training content</h3>
        <ul>
          <li>Photovoltaic panel installation</li>
          <li>Preventive and corrective maintenance</li>
          <li>Fault diagnosis</li>
          <li>Electrical safety</li>
        </ul>

        <p>The training will last 6 months and combine theory and practice on real installations.</p>
      `
    },
    category: 'announcement',
    tags: ['formation', 'Mali', 'solaire', 'emploi'],
    status: 'published',
    featured: false,
    publishedAt: new Date('2025-11-03')
  },
  {
    title: {
      fr: "Le Niger signe un partenariat pour l'électrification de 200 villages",
      en: "Niger signs partnership for electrification of 200 villages"
    },
    slug: "niger-electrification-villages-solaire",
    excerpt: {
      fr: "Un accord majeur vient d'être signé pour apporter l'électricité solaire à 200 villages isolés du Niger.",
      en: "A major agreement has just been signed to bring solar electricity to 200 isolated villages in Niger."
    },
    content: {
      fr: `
        <h2>Accès universel à l'électricité</h2>
        <p>Le Niger a signé un accord historique avec plusieurs partenaires internationaux pour électrifier 200 villages isolés grâce à des mini-réseaux solaires. Ce projet bénéficiera à plus de 500 000 personnes.</p>

        <h3>Détails du projet</h3>
        <ul>
          <li>200 mini-réseaux solaires</li>
          <li>Capacité totale : 15 MW</li>
          <li>Budget : 120 millions d'euros</li>
          <li>Durée : 4 ans</li>
        </ul>

        <p>Ce projet permettra aux communautés rurales d'accéder aux services de base : éducation, santé et développement économique.</p>
      `,
      en: `
        <h2>Universal access to electricity</h2>
        <p>Niger has signed a historic agreement with several international partners to electrify 200 isolated villages using solar mini-grids. This project will benefit more than 500,000 people.</p>

        <h3>Project details</h3>
        <ul>
          <li>200 solar mini-grids</li>
          <li>Total capacity: 15 MW</li>
          <li>Budget: 120 million euros</li>
          <li>Duration: 4 years</li>
        </ul>

        <p>This project will enable rural communities to access basic services: education, health and economic development.</p>
      `
    },
    category: 'project',
    tags: ['Niger', 'électrification rurale', 'mini-réseaux', 'solaire'],
    status: 'published',
    featured: true,
    publishedAt: new Date('2025-11-01')
  },
  {
    title: {
      fr: "Le Togo développe son potentiel hydroélectrique avec 3 nouveaux barrages",
      en: "Togo develops hydroelectric potential with 3 new dams"
    },
    slug: "togo-barrages-hydroelectriques",
    excerpt: {
      fr: "Trois nouveaux barrages hydroélectriques sont en construction pour augmenter la production d'énergie renouvelable.",
      en: "Three new hydroelectric dams are under construction to increase renewable energy production."
    },
    content: {
      fr: `
        <h2>Valorisation des ressources hydrauliques</h2>
        <p>Le Togo investit massivement dans l'hydroélectricité avec la construction simultanée de trois nouveaux barrages qui ajouteront 75 MW à la capacité nationale.</p>

        <h3>Les trois projets</h3>
        <ul>
          <li>Barrage de Kpémé : 30 MW</li>
          <li>Barrage de Dapaong : 25 MW</li>
          <li>Barrage de Kara : 20 MW</li>
        </ul>

        <p>Ces infrastructures permettront au Togo de réduire sa dépendance aux importations d'électricité et de fournir une énergie stable et propre.</p>
      `,
      en: `
        <h2>Development of water resources</h2>
        <p>Togo is investing heavily in hydroelectricity with the simultaneous construction of three new dams that will add 75 MW to the national capacity.</p>

        <h3>The three projects</h3>
        <ul>
          <li>Kpémé Dam: 30 MW</li>
          <li>Dapaong Dam: 25 MW</li>
          <li>Kara Dam: 20 MW</li>
        </ul>

        <p>These infrastructures will enable Togo to reduce its dependence on electricity imports and provide stable, clean energy.</p>
      `
    },
    category: 'innovation',
    tags: ['Togo', 'hydroélectricité', 'barrages'],
    status: 'published',
    featured: false,
    publishedAt: new Date('2025-10-28')
  }
];

async function seedNews() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion MongoDB établie');

    // Récupérer l'utilisateur admin pour l'associer comme auteur
    const admin = await User.findOne({ email: 'admin@uemoa-energy.org' });
    if (!admin) {
      console.error('❌ Utilisateur admin non trouvé. Exécutez d\'abord le seeder admin.');
      process.exit(1);
    }

    // Récupérer les pays pour les lier aux actualités
    const senegal = await Country.findOne({ code: 'SN' });
    const cotedivoire = await Country.findOne({ code: 'CI' });
    const burkinafaso = await Country.findOne({ code: 'BF' });
    const mali = await Country.findOne({ code: 'ML' });
    const niger = await Country.findOne({ code: 'NE' });
    const togo = await Country.findOne({ code: 'TG' });

    // Associer l'auteur et les pays aux actualités
    newsData.forEach(news => {
      news.author = admin._id;
    });

    if (senegal) newsData[0].relatedCountries = [senegal._id];
    if (cotedivoire) newsData[1].relatedCountries = [cotedivoire._id];
    if (burkinafaso) newsData[2].relatedCountries = [burkinafaso._id];
    if (mali) newsData[3].relatedCountries = [mali._id];
    if (niger) newsData[4].relatedCountries = [niger._id];
    if (togo) newsData[5].relatedCountries = [togo._id];

    // Supprimer les actualités existantes
    await News.deleteMany({});
    console.log('🗑️  Actualités existantes supprimées');

    // Insérer les nouvelles actualités
    const insertedNews = await News.insertMany(newsData);
    console.log(`✅ ${insertedNews.length} actualités insérées avec succès`);

    // Afficher les actualités créées
    insertedNews.forEach((news, index) => {
      console.log(`   ${index + 1}. ${news.title.fr} (${news.slug})`);
    });

    console.log('\n🎉 Seeding des actualités terminé avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding des actualités:', error);
    process.exit(1);
  }
}

// Exécuter le seeder si appelé directement
if (require.main === module) {
  seedNews();
}

module.exports = seedNews;
