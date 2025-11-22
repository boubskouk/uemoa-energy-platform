// Script Node.js pour tester la connexion directement
const fetch = require('node-fetch');

async function testLogin() {
  console.log('🧪 Test de connexion à l\'API...\n');

  const credentials = {
    email: 'admin@uemoa-energy.org',
    password: 'Admin@2025!'
  };

  console.log('📧 Email:', credentials.email);
  console.log('🔑 Mot de passe:', '***************');
  console.log('🌐 URL:', 'http://localhost:5000/api/auth/login');
  console.log('\n⏳ Envoi de la requête...\n');

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    console.log('📡 Status:', response.status, response.statusText);
    console.log('📡 Headers:', JSON.stringify([...response.headers.entries()], null, 2));

    const data = await response.json();

    console.log('\n📦 Réponse du serveur:');
    console.log(JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('\n✅ CONNEXION RÉUSSIE !');
      console.log('🎟️  Token:', data.token.substring(0, 50) + '...');
      console.log('👤 Utilisateur:', data.user.email);
      console.log('🔑 Rôle:', data.user.role);
    } else {
      console.log('\n❌ CONNEXION ÉCHOUÉE');
      console.log('💬 Message:', data.message);
    }

  } catch (error) {
    console.error('\n💥 ERREUR:', error.message);
    console.error('Stack:', error.stack);
  }
}

testLogin();
