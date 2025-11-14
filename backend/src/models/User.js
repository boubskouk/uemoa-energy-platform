const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { USER_ROLES } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']
  },

  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false // Ne pas inclure le mot de passe dans les requêtes par défaut
  },

  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.VISITOR
  },

  profile: {
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    profilePicture: {
      type: String
    }
  },

  // Si l'utilisateur est lié à un acteur
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actor'
  },

  // Paramètres
  language: {
    type: String,
    enum: ['fr', 'en'],
    default: 'fr'
  },

  emailVerified: {
    type: Boolean,
    default: false
  },

  emailVerificationToken: {
    type: String,
    select: false
  },

  // RGPD
  consentGiven: {
    type: Boolean,
    default: false
  },

  consentDate: {
    type: Date
  },

  // Gestion de compte
  isActive: {
    type: Boolean,
    default: true
  },

  // Statut d'approbation du compte
  accountStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  rejectionReason: {
    type: String
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  approvedAt: {
    type: Date
  },

  resetPasswordToken: {
    type: String,
    select: false
  },

  resetPasswordExpires: {
    type: Date,
    select: false
  }

}, {
  timestamps: true // Ajoute createdAt et updatedAt automatiquement
});

// ========== INDEXES ==========
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ actorId: 1 });

// ========== MIDDLEWARES ==========

// Hacher le mot de passe avant de sauvegarder
userSchema.pre('save', async function(next) {
  // Si le mot de passe n'a pas été modifié, passer
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Générer un salt et hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ========== MÉTHODES ==========

// Comparer le mot de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Erreur lors de la comparaison des mots de passe');
  }
};

// Obtenir l'objet utilisateur sans informations sensibles
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.emailVerificationToken;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
