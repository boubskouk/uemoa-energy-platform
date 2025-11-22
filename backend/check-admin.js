const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    const admin = await User.findOne({ email: 'admin@uemoa-energy.org' }).select('+password');

    if (!admin) {
      console.log('❌ AUCUN ADMIN TROUVÉ!');
      process.exit(1);
    }

    console.log('\n📋 Informations du compte admin:');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Active:', admin.isActive);
    console.log('Status:', admin.accountStatus);
    console.log('Password hash exists:', !!admin.password);
    console.log('Password hash length:', admin.password ? admin.password.length : 0);

    // Tester le mot de passe
    console.log('\n🔑 Test du mot de passe "Admin@2025!" :');
    const isValid = await admin.comparePassword('Admin@2025!');
    console.log('Résultat:', isValid ? '✅ VALIDE' : '❌ INVALIDE');

    if (!isValid) {
      console.log('\n⚠️  Le mot de passe ne correspond pas. Recréation du compte admin...');

      // Supprimer l'ancien admin
      await User.deleteOne({ email: 'admin@uemoa-energy.org' });
      console.log('🗑️  Ancien compte supprimé');

      // Créer un nouveau compte admin
      const newAdmin = await User.create({
        email: 'admin@uemoa-energy.org',
        password: 'Admin@2025!',
        role: 'admin',
        profile: {
          firstName: 'Admin',
          lastName: 'UEMOA'
        },
        language: 'fr',
        emailVerified: true,
        consentGiven: true,
        consentDate: new Date(),
        isActive: true,
        accountStatus: 'approved'
      });

      console.log('✅ Nouveau compte admin créé');

      // Vérifier le nouveau mot de passe
      const isNewValid = await newAdmin.comparePassword('Admin@2025!');
      console.log('✅ Vérification du nouveau mot de passe:', isNewValid ? 'VALIDE' : 'INVALIDE');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

checkAdmin();
