module.exports = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true pour 465, false pour les autres ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  from: process.env.EMAIL_FROM || 'noreply@uemoa-energy.org',

  // Templates
  templates: {
    welcome: 'Bienvenue sur UEMOA Energy Platform',
    resetPassword: 'Réinitialisation de votre mot de passe',
    verifyEmail: 'Vérification de votre email',
    actorApproved: 'Votre acteur a été approuvé'
  }
};
