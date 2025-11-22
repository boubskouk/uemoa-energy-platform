// Données réelles des acteurs UEMOA
// Ces données peuvent être insérées via l'API /api/setup/init-actors

module.exports = [
  // ==========================================
  // 1. INSTITUTIONS RÉGIONALES & FINANCIÈRES
  // ==========================================
  {
    name: "Commission UEMOA (DEMEN)",
    type: "institution_publique",
    category: "Institution Régionale",
    description: {
      fr: "Direction de l'Environnement et de la Maîtrise de l'Énergie de la Commission de l'UEMOA"
    },
    country: "BF",
    city: "Ouagadougou",
    address: "380, Avenue du Professeur Joseph KI-ZERBO, 01 BP 543",
    energyTypes: ["Solaire", "Éolienne", "Hydraulique", "Biomasse"],
    contact: {
      website: "http://www.uemoa.int",
      email: "contact@uemoa.int",
      phone: "+226 25 31 88 88"
    },
    featured: true,
    verified: true,
    status: "approved"
  },
  {
    name: "CEREEC",
    type: "Institution",
    category: "Institution Régionale",
    description: "Centre Régional pour les Énergies Renouvelables et l'Efficacité Énergétique de la CEDEAO",
    country: "CI",
    energyTypes: ["Solaire", "Éolienne", "Hydraulique", "Biomasse"],
    website: "http://www.ecreee.org",
    email: "info@ecreee.org",
    featured: true,
    verified: true,
    status: "approved"
  },
  {
    name: "RESER",
    type: "Institution",
    category: "Institution Régionale",
    description: "Réseau d'Excellence en Énergie Solaire Renouvelable - Yamoussoukro",
    country: "CI",
    energyTypes: ["Solaire"],
    website: "http://www.reser-ci.org",
    email: "contact@reser-ci.org",
    address: { city: "Yamoussoukro" },
    featured: true,
    verified: true,
    status: "approved"
  },
  {
    name: "BOAD",
    type: "Institution",
    category: "Institution Financière",
    description: "Banque Ouest-Africaine de Développement avec Fonds de Développement Énergie",
    country: "TG",
    energyTypes: ["Solaire", "Éolienne", "Hydraulique", "Biomasse"],
    website: "http://www.boad.org",
    email: "boadsiege@boad.org",
    phone: "+228 22 21 59 06",
    address: { city: "Lomé" },
    featured: true,
    verified: true,
    status: "approved"
  },
  {
    name: "BCEAO",
    type: "Institution",
    category: "Institution Financière",
    description: "Banque Centrale des États de l'Afrique de l'Ouest",
    country: "SN",
    energyTypes: ["Solaire", "Éolienne", "Hydraulique"],
    website: "http://www.bceao.int",
    email: "courrier.bceao@bceao.int",
    address: { city: "Dakar" },
    featured: true,
    verified: true,
    status: "approved"
  },
  {
    name: "SEFA",
    type: "Institution",
    category: "Institution Financière",
    description: "Fonds pour l'Énergie Durable en Afrique - Banque Africaine de Développement",
    country: "CI",
    energyTypes: ["Solaire", "Éolienne", "Hydraulique", "Biomasse", "Géothermie"],
    website: "http://www.afdb.org/sefa",
    email: "sefa@afdb.org",
    address: { city: "Abidjan" },
    featured: true,
    verified: true,
    status: "approved"
  },

  // ==========================================
  // 2. ENTREPRISES PRIVÉES - SÉNÉGAL
  // ==========================================
  {
    name: "Eden Solaire",
    type: "Entreprise",
    category: "Entreprise Privée",
    description: "Entreprise spécialisée dans les installations photovoltaïques au Sénégal",
    country: "SN",
    energyTypes: ["Solaire"],
    website: "http://www.edensolaire.sn",
    email: "contact@edensolaire.sn",
    address: { city: "Dakar" },
    verified: true,
    status: "approved"
  },
  {
    name: "Eiffage Sénégal",
    type: "Entreprise",
    category: "Entreprise Privée",
    description: "Leader des installations électriques et énergies renouvelables",
    country: "SN",
    energyTypes: ["Solaire", "Éolienne"],
    website: "http://www.eiffage.sn",
    email: "contact@eiffage.sn",
    address: { city: "Dakar" },
    verified: true,
    status: "approved"
  },
  {
    name: "Lekela Power",
    type: "Entreprise",
    category: "Entreprise Privée",
    description: "Parc éolien Taiba Ndiaye - 158,7 MW - Premier parc éolien d'Afrique de l'Ouest",
    country: "SN",
    energyTypes: ["Éolienne"],
    website: "http://www.lekelapower.com",
    email: "info@lekelapower.com",
    address: { city: "Taiba Ndiaye" },
    projects: [{
      name: "Parc Éolien Taiba Ndiaye",
      capacity: "158.7 MW",
      status: "En exploitation"
    }],
    featured: true,
    verified: true,
    status: "approved"
  },

  // ==========================================
  // 2. ENTREPRISES PRIVÉES - CÔTE D'IVOIRE
  // ==========================================
  {
    name: "BIOVEA Énergie",
    type: "Entreprise",
    category: "Entreprise Privée",
    description: "Centrale biomasse de 46 MW à Aboisso - Production d'électricité à partir de déchets agricoles",
    country: "CI",
    energyTypes: ["Biomasse"],
    website: "http://www.biovea.ci",
    email: "contact@biovea.ci",
    address: { city: "Aboisso" },
    projects: [{
      name: "Centrale Biomasse Aboisso",
      capacity: "46 MW",
      status: "En exploitation"
    }],
    featured: true,
    verified: true,
    status: "approved"
  },
  {
    name: "GREEN POWER",
    type: "Entreprise",
    category: "Entreprise Privée",
    description: "Fournisseur de systèmes solaires photovoltaïques en Côte d'Ivoire",
    country: "CI",
    energyTypes: ["Solaire"],
    website: "http://www.greenpower.ci",
    email: "info@greenpower.ci",
    address: { city: "Abidjan" },
    verified: true,
    status: "approved"
  },
  {
    name: "Alliance Concept",
    type: "Entreprise",
    category: "Entreprise Privée",
    description: "Distribution d'équipements solaires et énergies renouvelables",
    country: "CI",
    energyTypes: ["Solaire"],
    email: "contact@allianceconcept.ci",
    address: { city: "Abidjan" },
    verified: true,
    status: "approved"
  },
  {
    name: "S-TEL",
    type: "Entreprise",
    category: "Entreprise Privée",
    description: "Solutions solaires professionnelles pour entreprises et industries",
    country: "CI",
    energyTypes: ["Solaire"],
    website: "http://www.s-tel.ci",
    email: "contact@s-tel.ci",
    address: { city: "Abidjan" },
    verified: true,
    status: "approved"
  },

  // MALI
  {
    name: "FENEM",
    type: "Association",
    category: "Fédération",
    description: "Fédération Nationale des Énergies Renouvelables du Mali",
    country: "ML",
    energyTypes: ["Solaire", "Éolienne", "Hydraulique", "Biomasse"],
    email: "contact@fenem.ml",
    address: { city: "Bamako" },
    verified: true,
    status: "approved"
  },

  // TOGO
  {
    name: "SABER Lomé",
    type: "Entreprise",
    category: "Entreprise Privée",
    description: "Spécialiste des biocarburants et énergies renouvelables au Togo",
    country: "TG",
    energyTypes: ["Biomasse", "Solaire"],
    email: "contact@saber-lome.tg",
    address: { city: "Lomé" },
    verified: true,
    status: "approved"
  },
  {
    name: "ELSG",
    type: "Entreprise",
    category: "Entreprise Privée",
    description: "Engineering et développement de projets énergétiques",
    country: "TG",
    energyTypes: ["Solaire", "Hydraulique"],
    email: "info@elsg.tg",
    address: { city: "Lomé" },
    verified: true,
    status: "approved"
  },

  // BÉNIN
  {
    name: "Africa Green Corporation SA",
    type: "Entreprise",
    category: "Entreprise Privée",
    description: "Solutions énergétiques vertes et durables au Bénin",
    country: "BJ",
    energyTypes: ["Solaire", "Biomasse"],
    email: "contact@africagreencorp.bj",
    address: { city: "Cotonou" },
    verified: true,
    status: "approved"
  },
  {
    name: "CETRA SARL",
    type: "Entreprise",
    category: "Entreprise Privée",
    description: "Ingénierie électrique et installations énergies renouvelables",
    country: "BJ",
    energyTypes: ["Solaire"],
    email: "contact@cetra.bj",
    address: { city: "Cotonou" },
    verified: true,
    status: "approved"
  },

  // MULTI-PAYS
  {
    name: "KYA-ENERGY GROUP",
    type: "Entreprise",
    category: "Entreprise Privée",
    description: "Groupes électrosolaires et solutions énergétiques multi-pays UEMOA",
    country: "SN",
    energyTypes: ["Solaire"],
    website: "http://www.kya-energy.com",
    email: "contact@kya-energy.com",
    address: { city: "Dakar" },
    verified: true,
    status: "approved"
  },
  {
    name: "MPower",
    type: "Entreprise",
    category: "Entreprise Privée",
    description: "Distribution d'équipements solaires dans plusieurs pays UEMOA",
    country: "CI",
    energyTypes: ["Solaire"],
    website: "http://www.mpower-africa.com",
    email: "info@mpower-africa.com",
    address: { city: "Abidjan" },
    verified: true,
    status: "approved"
  },

  // ==========================================
  // 3. ONG & SOCIÉTÉ CIVILE
  // ==========================================
  {
    name: "CESAO-AI",
    type: "ONG",
    category: "ONG",
    description: "Réseau ouest-africain des acteurs de la société civile pour les énergies renouvelables",
    country: "BF",
    energyTypes: ["Solaire", "Éolienne", "Hydraulique", "Biomasse"],
    email: "contact@cesao-ai.org",
    address: { city: "Ouagadougou" },
    featured: true,
    verified: true,
    status: "approved"
  },
  {
    name: "CNPDER/BF",
    type: "ONG",
    category: "ONG",
    description: "Coalition Nationale pour la Promotion du Développement des Énergies Renouvelables au Burkina Faso",
    country: "BF",
    energyTypes: ["Solaire", "Éolienne", "Biomasse"],
    email: "contact@cnpder.bf",
    address: { city: "Ouagadougou" },
    verified: true,
    status: "approved"
  },
  {
    name: "Alliance Acteurs Énergies Sénégal",
    type: "ONG",
    category: "ONG",
    description: "Alliance des acteurs des énergies renouvelables au Sénégal",
    country: "SN",
    energyTypes: ["Solaire", "Éolienne", "Biomasse"],
    email: "contact@alliance-energies.sn",
    address: { city: "Dakar" },
    verified: true,
    status: "approved"
  },
  {
    name: "CEAS",
    type: "ONG",
    category: "ONG",
    description: "Centre Écologique Albert Schweitzer - Promotion des énergies renouvelables au Burkina Faso",
    country: "BF",
    energyTypes: ["Solaire", "Biomasse"],
    email: "contact@ceas.bf",
    address: { city: "Ouagadougou" },
    verified: true,
    status: "approved"
  },
  {
    name: "ONG TEMER",
    type: "ONG",
    category: "ONG",
    description: "Technologies et Énergies pour le Mali - Promotion des énergies renouvelables",
    country: "ML",
    energyTypes: ["Solaire", "Biomasse"],
    email: "contact@temer.ml",
    address: { city: "Bamako" },
    verified: true,
    status: "approved"
  },
  {
    name: "SNACC",
    type: "ONG",
    category: "ONG",
    description: "Société Nigérienne d'Action Contre le Changement Climatique",
    country: "NE",
    energyTypes: ["Solaire", "Éolienne"],
    email: "contact@snacc.ne",
    address: { city: "Niamey" },
    verified: true,
    status: "approved"
  },

  // ==========================================
  // 4. OPÉRATEURS NATIONAUX
  // ==========================================
  {
    name: "SENELEC",
    type: "Opérateur National",
    category: "Opérateur National",
    description: "Société Nationale d'Électricité du Sénégal",
    country: "SN",
    energyTypes: ["Solaire", "Éolienne", "Hydraulique"],
    website: "http://www.senelec.sn",
    email: "contact@senelec.sn",
    phone: "+221 33 839 93 93",
    address: { city: "Dakar" },
    featured: true,
    verified: true,
    status: "approved"
  },
  {
    name: "CIE",
    type: "Opérateur National",
    category: "Opérateur National",
    description: "Compagnie Ivoirienne d'Électricité",
    country: "CI",
    energyTypes: ["Solaire", "Hydraulique", "Biomasse"],
    website: "http://www.cie.ci",
    email: "contact@cie.ci",
    phone: "+225 27 21 23 45 00",
    address: { city: "Abidjan" },
    featured: true,
    verified: true,
    status: "approved"
  },
  {
    name: "EDM-SA",
    type: "Opérateur National",
    category: "Opérateur National",
    description: "Énergie du Mali - Société Anonyme",
    country: "ML",
    energyTypes: ["Solaire", "Hydraulique"],
    website: "http://www.edm-sa.com.ml",
    email: "contact@edm-sa.com.ml",
    address: { city: "Bamako" },
    featured: true,
    verified: true,
    status: "approved"
  },
  {
    name: "SONABEL",
    type: "Opérateur National",
    category: "Opérateur National",
    description: "Société Nationale d'Électricité du Burkina Faso",
    country: "BF",
    energyTypes: ["Solaire", "Hydraulique"],
    website: "http://www.sonabel.bf",
    email: "contact@sonabel.bf",
    address: { city: "Ouagadougou" },
    featured: true,
    verified: true,
    status: "approved"
  },
  {
    name: "CEET",
    type: "Opérateur National",
    category: "Opérateur National",
    description: "Compagnie Énergie Électrique du Togo",
    country: "TG",
    energyTypes: ["Solaire", "Hydraulique"],
    website: "http://www.ceet.tg",
    email: "contact@ceet.tg",
    address: { city: "Lomé" },
    featured: true,
    verified: true,
    status: "approved"
  },
  {
    name: "SBEE",
    type: "Opérateur National",
    category: "Opérateur National",
    description: "Société Béninoise d'Énergie Électrique",
    country: "BJ",
    energyTypes: ["Solaire", "Hydraulique"],
    website: "http://www.sbee.bj",
    email: "contact@sbee.bj",
    address: { city: "Cotonou" },
    featured: true,
    verified: true,
    status: "approved"
  },
  {
    name: "NIGELEC",
    type: "Opérateur National",
    category: "Opérateur National",
    description: "Société Nigérienne d'Électricité",
    country: "NE",
    energyTypes: ["Solaire", "Hydraulique"],
    website: "http://www.nigelec.ne",
    email: "contact@nigelec.ne",
    address: { city: "Niamey" },
    featured: true,
    verified: true,
    status: "approved"
  },

  // ==========================================
  // BAILLEURS & PROGRAMMES
  // ==========================================
  {
    name: "AFD",
    type: "Bailleur International",
    category: "Bailleur International",
    description: "Agence Française de Développement - Programme ARE Scale-up pour l'accès à l'énergie",
    country: "SN",
    energyTypes: ["Solaire", "Hydraulique", "Biomasse"],
    website: "http://www.afd.fr",
    email: "afdsenegal@afd.fr",
    address: { city: "Dakar" },
    featured: true,
    verified: true,
    status: "approved"
  },
  {
    name: "Banque Mondiale - RESPITE",
    type: "Bailleur International",
    category: "Bailleur International",
    description: "Programme RESPITE - Appui au secteur énergétique en Afrique de l'Ouest",
    country: "CI",
    energyTypes: ["Solaire", "Hydraulique", "Éolienne"],
    website: "http://www.worldbank.org",
    email: "respite@worldbank.org",
    address: { city: "Abidjan" },
    featured: true,
    verified: true,
    status: "approved"
  },
  {
    name: "Meridiam",
    type: "Investisseur",
    category: "Investisseur",
    description: "4 centrales solaires de 120 MW au total au Sénégal",
    country: "SN",
    energyTypes: ["Solaire"],
    website: "http://www.meridiam.com",
    email: "contact@meridiam.com",
    projects: [{
      name: "Centrales Solaires Sénégal",
      capacity: "120 MW",
      status: "En exploitation"
    }],
    featured: true,
    verified: true,
    status: "approved"
  },
  {
    name: "GIZ",
    type: "Bailleur International",
    category: "Bailleur International",
    description: "Coopération Allemande pour le Développement - Énergies Renouvelables",
    country: "BF",
    energyTypes: ["Solaire", "Biomasse"],
    website: "http://www.giz.de",
    email: "giz-burkina@giz.de",
    address: { city: "Ouagadougou" },
    verified: true,
    status: "approved"
  },
  {
    name: "Power Africa",
    type: "Bailleur International",
    category: "Programme",
    description: "Initiative USAID pour l'accès à l'électricité en Afrique",
    country: "CI",
    energyTypes: ["Solaire", "Hydraulique", "Éolienne"],
    website: "http://www.usaid.gov/powerafrica",
    email: "info@powerafrica.gov",
    address: { city: "Abidjan" },
    verified: true,
    status: "approved"
  },
  {
    name: "AREI",
    type: "Initiative",
    category: "Programme",
    description: "Initiative Africaine pour les Énergies Renouvelables",
    country: "CI",
    energyTypes: ["Solaire", "Éolienne", "Hydraulique", "Géothermie"],
    website: "http://www.arei.org",
    email: "contact@arei.org",
    featured: true,
    verified: true,
    status: "approved"
  },
  {
    name: "PRODERE",
    type: "Programme",
    category: "Programme",
    description: "Programme de Développement des Énergies Renouvelables - 19,2 milliards FCFA",
    country: "BF",
    energyTypes: ["Solaire", "Biomasse"],
    email: "contact@prodere.org",
    address: { city: "Ouagadougou" },
    verified: true,
    status: "approved"
  },
  {
    name: "PPIPS",
    type: "Programme",
    category: "Programme",
    description: "Programme Prioritaire d'Infrastructures Photovoltaïques au Sahel - 165 milliards FCFA",
    country: "BF",
    energyTypes: ["Solaire"],
    email: "contact@ppips.org",
    address: { city: "Ouagadougou" },
    featured: true,
    verified: true,
    status: "approved"
  },
  {
    name: "IRED",
    type: "ONG",
    category: "ONG",
    description: "Innovation et Réseaux pour le Développement - Énergies renouvelables",
    country: "SN",
    energyTypes: ["Solaire", "Biomasse"],
    website: "http://www.ired.org",
    email: "contact@ired.org",
    address: { city: "Dakar" },
    verified: true,
    status: "approved"
  }
];
