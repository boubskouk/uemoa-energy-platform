require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jacqueskoukoui:6bSe3t7qEbJJqwx5@cluster0.jodtq6h.mongodb.net/uemoa_energy_platform';

async function fixEventSlug() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Utiliser updateOne directement sans passer par le modèle
    const result = await mongoose.connection.db.collection('events').updateOne(
      { _id: new mongoose.Types.ObjectId('692977ecb55d4dd4775ddf13') },
      { $set: { slug: 'sommet-energie-renouvelable-uemoa-2025' } }
    );

    console.log('✅ Résultat:', result.modifiedCount, 'document(s) modifié(s)');

    // Vérifier
    const updated = await mongoose.connection.db.collection('events').findOne(
      { _id: new mongoose.Types.ObjectId('692977ecb55d4dd4775ddf13') }
    );
    console.log('✅ Vérification - Slug:', updated.slug);
    console.log('✅ Titre:', updated.title);

    await mongoose.connection.close();
    console.log('✅ Terminé !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixEventSlug();
