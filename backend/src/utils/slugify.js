const slugify = require('slugify');

/**
 * Génère un slug à partir d'un texte
 * @param {String} text - Le texte à transformer en slug
 * @returns {String} Le slug généré
 */
const generateSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: 'fr',
    remove: /[*+~.()'"!:@]/g
  });
};

/**
 * Génère un slug unique en ajoutant un suffixe si nécessaire
 * @param {String} text - Le texte de base
 * @param {Function} checkExists - Fonction async pour vérifier si le slug existe
 * @returns {String} Un slug unique
 */
const generateUniqueSlug = async (text, checkExists) => {
  let slug = generateSlug(text);
  let counter = 1;
  let tempSlug = slug;

  // Vérifier si le slug existe déjà
  while (await checkExists(tempSlug)) {
    tempSlug = `${slug}-${counter}`;
    counter++;
  }

  return tempSlug;
};

module.exports = {
  generateSlug,
  generateUniqueSlug
};
