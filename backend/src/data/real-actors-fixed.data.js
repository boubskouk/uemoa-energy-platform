// Mapping des types aux valeurs du modèle
const typeMapping = {
  "Institution": "institution_publique",
  "Entreprise": "entreprise",
  "ONG": "ong",
  "Association": "association",
  "Opérateur National": "institution_publique",
  "Bailleur International": "institution_publique",
  "Investisseur": "entreprise",
  "Programme": "institution_publique",
  "Initiative": "ong"
};

// Fonction helper pour normaliser les données
const normalize = (actor) => ({
  name: actor.name,
  type: typeMapping[actor.type] || "entreprise",
  description: {
    fr: actor.description,
    en: actor.description
  },
  country: actor.country,
  city: actor.city || actor.address?.city || "",
  address: typeof actor.address === 'string' ? actor.address : 
    actor.address?.street || actor.address?.city || "",
  energyTypes: actor.energyTypes || [],
  contact: {
    email: actor.email || actor.contact?.email || "",
    phone: actor.phone || actor.contact?.phone || "",
    website: actor.website || actor.contact?.website || ""
  },
  projects: actor.projects || [],
  featured: actor.featured || false,
  verified: actor.verified !== false,
  status: actor.status || "approved"
});

const rawData = require('./real-actors.data');

module.exports = rawData.map(normalize);
