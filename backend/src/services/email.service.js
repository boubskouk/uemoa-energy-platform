const nodemailer = require('nodemailer');
const emailConfig = require('../config/email');

/**
 * Service d'envoi d'emails
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.initTransporter();
  }

  /**
   * Initialiser le transporteur Nodemailer
   */
  initTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        auth: {
          user: emailConfig.auth.user,
          pass: emailConfig.auth.pass
        }
      });

      console.log('✅ Service email initialisé avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation du service email:', error);
    }
  }

  /**
   * Envoyer un email
   * @param {Object} options - Options de l'email
   * @param {string} options.to - Destinataire
   * @param {string} options.subject - Sujet
   * @param {string} options.html - Contenu HTML
   * @param {string} options.text - Contenu texte (optionnel)
   */
  async sendEmail({ to, subject, html, text }) {
    try {
      if (!this.transporter) {
        throw new Error('Le transporteur email n\'est pas initialisé');
      }

      const mailOptions = {
        from: emailConfig.from,
        to,
        subject,
        html,
        text: text || ''
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email envoyé avec succès:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Envoyer une notification à l'admin pour une nouvelle demande d'inscription
   * @param {Object} user - Utilisateur qui s'est inscrit
   * @param {string} adminEmail - Email de l'administrateur
   */
  async sendRegistrationRequestToAdmin(user, adminEmail) {
    const subject = '🔔 Nouvelle demande d\'inscription - UEMOA Energy Platform';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2c5f2d; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
          .user-info { background-color: white; padding: 15px; margin: 20px 0; border-left: 4px solid #2c5f2d; }
          .button { display: inline-block; padding: 12px 24px; margin: 10px 5px; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .btn-approve { background-color: #4CAF50; color: white; }
          .btn-reject { background-color: #f44336; color: white; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Nouvelle Demande d'Inscription</h1>
          </div>
          <div class="content">
            <p>Bonjour Administrateur,</p>
            <p>Une nouvelle demande d'inscription a été reçue sur la plateforme <strong>UEMOA Energy Platform</strong>.</p>

            <div class="user-info">
              <h3>Informations de l'utilisateur :</h3>
              <p><strong>Email :</strong> ${user.email}</p>
              <p><strong>Nom :</strong> ${user.profile?.firstName || 'Non spécifié'} ${user.profile?.lastName || ''}</p>
              <p><strong>Téléphone :</strong> ${user.profile?.phone || 'Non spécifié'}</p>
              <p><strong>Date de la demande :</strong> ${new Date(user.createdAt).toLocaleString('fr-FR')}</p>
            </div>

            <p>Veuillez vous connecter à votre espace administrateur pour approuver ou rejeter cette demande.</p>

            <div style="text-align: center; margin-top: 30px;">
              <p><strong>ID de l'utilisateur :</strong> ${user._id}</p>
            </div>
          </div>
          <div class="footer">
            <p>UEMOA Energy Platform - Système de gestion des acteurs</p>
            <p>Ceci est un email automatique, merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({ to: adminEmail, subject, html });
  }

  /**
   * Envoyer une notification d'approbation à l'utilisateur
   * @param {Object} user - Utilisateur approuvé
   */
  async sendAccountApprovedEmail(user) {
    const subject = '✅ Votre compte a été approuvé - UEMOA Energy Platform';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
          .success-icon { font-size: 60px; text-align: center; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #2c5f2d; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Compte Approuvé !</h1>
          </div>
          <div class="content">
            <div class="success-icon">✅</div>
            <p>Bonjour ${user.profile?.firstName || 'Utilisateur'},</p>
            <p>Nous avons le plaisir de vous informer que votre demande d'inscription sur <strong>UEMOA Energy Platform</strong> a été <strong>approuvée</strong> !</p>

            <p>Vous pouvez maintenant vous connecter à votre compte et accéder à toutes les fonctionnalités de la plateforme.</p>

            <div style="text-align: center;">
              <p><strong>Email de connexion :</strong> ${user.email}</p>
            </div>

            <p>Bienvenue dans notre communauté dédiée aux énergies renouvelables dans l'espace UEMOA !</p>
          </div>
          <div class="footer">
            <p>UEMOA Energy Platform - Système de gestion des acteurs</p>
            <p>Ceci est un email automatique, merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({ to: user.email, subject, html });
  }

  /**
   * Envoyer une notification de rejet à l'utilisateur
   * @param {Object} user - Utilisateur rejeté
   * @param {string} reason - Raison du rejet
   */
  async sendAccountRejectedEmail(user, reason) {
    const subject = '❌ Votre demande d\'inscription a été refusée - UEMOA Energy Platform';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f44336; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
          .reason-box { background-color: #fff3cd; padding: 15px; margin: 20px 0; border-left: 4px solid #f44336; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Demande d'Inscription Refusée</h1>
          </div>
          <div class="content">
            <p>Bonjour ${user.profile?.firstName || 'Utilisateur'},</p>
            <p>Nous regrettons de vous informer que votre demande d'inscription sur <strong>UEMOA Energy Platform</strong> n'a pas été approuvée.</p>

            ${reason ? `
            <div class="reason-box">
              <h3>Raison du refus :</h3>
              <p>${reason}</p>
            </div>
            ` : ''}

            <p>Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez plus d'informations, n'hésitez pas à nous contacter.</p>
          </div>
          <div class="footer">
            <p>UEMOA Energy Platform - Système de gestion des acteurs</p>
            <p>Pour toute question, contactez l'administrateur</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({ to: user.email, subject, html });
  }
}

// Export une instance unique du service
module.exports = new EmailService();
