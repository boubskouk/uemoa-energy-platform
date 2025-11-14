require('dotenv').config();
const seedCountries = require('./countries.seed');
const seedCategories = require('./categories.seed');
const seedEnergies = require('./energies.seed');
const seedAdmin = require('./admin.seed');

/**
 * Script principal pour exécuter tous les seeders
 */
const seedAll = async () => {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🌱 DÉMARRAGE DU SEEDING DE LA BASE DE DONNÉES');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // 1. Seeder les pays UEMOA
    console.log('1️⃣  Seeding des pays UEMOA...');
    await seedCountries();
    console.log('');

    // 2. Seeder les catégories
    console.log('2️⃣  Seeding des catégories...');
    await seedCategories();
    console.log('');

    // 3. Seeder les types d'énergies
    console.log('3️⃣  Seeding des types d\'énergies...');
    await seedEnergies();
    console.log('');

    // 4. Créer le compte administrateur
    console.log('4️⃣  Création du compte administrateur...');
    await seedAdmin();
    console.log('');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ SEEDING TERMINÉ AVEC SUCCÈS!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n📝 Résumé:');
    console.log('   - 8 pays UEMOA créés');
    console.log('   - 8 catégories d\'activités créées');
    console.log('   - 8 types d\'énergies renouvelables créés');
    console.log('   - 1 compte administrateur créé');
    console.log('\n🔐 Identifiants admin:');
    console.log('   Email: admin@uemoa-energy.org');
    console.log('   Mot de passe: Admin@2025!');
    console.log('\n⚠️  N\'oubliez pas de changer le mot de passe admin!\n');

  } catch (error) {
    console.error('\n❌ ERREUR LORS DU SEEDING:', error);
    process.exit(1);
  }
};

// Exécuter le seeding
seedAll();
