require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');
const { USER_ROLES } = require('../utils/constants');

const adminUser = {
  email: 'admin@uemoa-energy.org',
  password: 'Admin@2025!',
  role: USER_ROLES.ADMIN,
  profile: {
    firstName: 'Admin',
    lastName: 'UEMOA'
  },
  language: 'fr',
  emailVerified: true,
  consentGiven: true,
  consentDate: new Date(),
  isActive: true,
  accountStatus: 'approved' // Le compte admin est approuvé par défaut
};

const seedAdmin = async () => {
  try {
    await connectDB();

    // Vérifier si un admin existe déjà
    const existingAdmin = await User.findOne({ email: adminUser.email });

    if (existingAdmin) {
      console.log('⚠️  Un administrateur existe déjà avec cet email');
      console.log(`   Email: ${existingAdmin.email}`);
      process.exit(0);
    }

    // Créer le compte administrateur
    const createdAdmin = await User.create(adminUser);
    console.log('✅ Compte administrateur créé avec succès');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`   Email: ${createdAdmin.email}`);
    console.log(`   Mot de passe: Admin@2025!`);
    console.log(`   Rôle: ${createdAdmin.role}`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('⚠️  IMPORTANT: Changez le mot de passe après la première connexion!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error);
    process.exit(1);
  }
};

// Exécuter si appelé directement
if (require.main === module) {
  seedAdmin();
}

module.exports = seedAdmin;
