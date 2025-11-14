const mongoose = require('mongoose');
const { ACTOR_TYPES, ACTOR_STATUS, COMPANY_SIZES } = require('../utils/constants');

const actorSchema = new mongoose.Schema({
  // ========== INFORMATIONS GÉNÉRALES ==========
  name: {
    type: String,
    required: [true, 'Le nom de la structure est requis'],
    trim: true
  },

  acronym: {
    type: String,
    trim: true
  },

  logo: {
    type: String // URL du logo
  },

  type: {
    type: String,
    required: [true, 'Le type d\'acteur est requis'],
    enum: ACTOR_TYPES
  },

  // ========== CATÉGORIES ET DOMAINES ==========
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],

  energyTypes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Energy'
  }],

  // ========== LOCALISATION ==========
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: [true, 'Le pays est requis']
  },

  city: {
    type: String,
    trim: true
  },

  address: {
    type: String,
    trim: true
  },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },

  // ========== CONTACT ==========
  contact: {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email invalide']
    },
    phone: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    socialMedia: {
      linkedin: String,
      twitter: String,
      facebook: String
    }
  },

  // ========== DESCRIPTION ==========
  description: {
    fr: {
      type: String,
      required: [true, 'La description en français est requise']
    },
    en: {
      type: String
    }
  },

  // ========== INFORMATIONS COMPLÉMENTAIRES ==========
  yearFounded: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear()
  },

  employeesCount: {
    type: String,
    enum: COMPANY_SIZES
  },

  certifications: [{
    type: String
  }],

  // ========== PROJETS ET RÉALISATIONS ==========
  projects: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    year: {
      type: Number
    },
    images: [{
      type: String
    }]
  }],

  // ========== GALERIE ==========
  gallery: [{
    type: String // URLs des images
  }],

  // ========== DOCUMENTS ==========
  documents: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['presentation', 'certificate', 'report', 'other']
    }
  }],

  // ========== STATISTIQUES ==========
  views: {
    type: Number,
    default: 0
  },

  contactRequests: {
    type: Number,
    default: 0
  },

  // ========== STATUT ==========
  status: {
    type: String,
    enum: Object.values(ACTOR_STATUS),
    default: ACTOR_STATUS.PENDING
  },

  verified: {
    type: Boolean,
    default: false
  },

  featured: {
    type: Boolean,
    default: false
  },

  // ========== GESTION ==========
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  approvedAt: {
    type: Date
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

}, {
  timestamps: true
});

// ========== INDEXES ==========
actorSchema.index({ name: 'text', 'description.fr': 'text', 'description.en': 'text' });
actorSchema.index({ country: 1 });
actorSchema.index({ type: 1 });
actorSchema.index({ status: 1 });
actorSchema.index({ categories: 1 });
actorSchema.index({ energyTypes: 1 });
actorSchema.index({ location: '2dsphere' });
actorSchema.index({ featured: 1 });
actorSchema.index({ verified: 1 });

// ========== MÉTHODES ==========

// Incrémenter le compteur de vues
actorSchema.methods.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

// Incrémenter le compteur de demandes de contact
actorSchema.methods.incrementContactRequests = async function() {
  this.contactRequests += 1;
  return await this.save();
};

// ========== MIDDLEWARES ==========

// Peupler automatiquement les références lors des requêtes find
actorSchema.pre(/^find/, function(next) {
  this.populate('country', 'name code flag')
      .populate('categories', 'name slug icon color')
      .populate('energyTypes', 'name slug icon color');
  next();
});

const Actor = mongoose.model('Actor', actorSchema);

module.exports = Actor;
