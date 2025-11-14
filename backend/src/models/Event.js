const mongoose = require('mongoose');
const { EVENT_CATEGORIES, EVENT_LOCATION_TYPES, EVENT_STATUS } = require('../utils/constants');

const eventSchema = new mongoose.Schema({
  title: {
    fr: {
      type: String,
      required: [true, 'Le titre en français est requis']
    },
    en: {
      type: String
    }
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  description: {
    fr: {
      type: String,
      required: [true, 'La description en français est requise']
    },
    en: {
      type: String
    }
  },

  // ========== DATE ET LIEU ==========
  startDate: {
    type: Date,
    required: [true, 'La date de début est requise']
  },

  endDate: {
    type: Date
  },

  location: {
    type: {
      type: String,
      enum: Object.values(EVENT_LOCATION_TYPES),
      default: EVENT_LOCATION_TYPES.PHYSICAL
    },
    venue: {
      type: String // Nom du lieu
    },
    address: {
      type: String
    },
    city: {
      type: String
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country'
    },
    coordinates: {
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
    onlineLink: {
      type: String // Lien visioconférence
    }
  },

  // ========== MÉDIAS ==========
  coverImage: {
    type: String
  },

  images: [{
    type: String
  }],

  // ========== ORGANISATION ==========
  organizer: {
    name: {
      type: String,
      required: true
    },
    contact: {
      type: String
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Actor'
    }
  },

  // ========== CATÉGORIE ==========
  category: {
    type: String,
    enum: EVENT_CATEGORIES,
    default: 'conference'
  },

  topics: [{
    type: String // Thématiques abordées
  }],

  // ========== INSCRIPTION ==========
  registrationRequired: {
    type: Boolean,
    default: false
  },

  registrationLink: {
    type: String
  },

  maxParticipants: {
    type: Number
  },

  registrationDeadline: {
    type: Date
  },

  // ========== RELATIONS ==========
  relatedActors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actor'
  }],

  // ========== PUBLICATION ==========
  status: {
    type: String,
    enum: Object.values(EVENT_STATUS),
    default: EVENT_STATUS.UPCOMING
  },

  featured: {
    type: Boolean,
    default: false
  },

  // ========== STATISTIQUES ==========
  views: {
    type: Number,
    default: 0
  },

  interestedCount: {
    type: Number,
    default: 0
  },

  // ========== AUTEUR ==========
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, {
  timestamps: true
});

// ========== INDEXES ==========
eventSchema.index({ slug: 1 }, { unique: true });
eventSchema.index({ status: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ 'location.country': 1 });
eventSchema.index({ featured: 1 });
eventSchema.index({ 'location.coordinates': '2dsphere' });

// ========== MÉTHODES ==========

// Incrémenter le compteur de vues
eventSchema.methods.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

// Incrémenter le compteur d'intérêt
eventSchema.methods.incrementInterested = async function() {
  this.interestedCount += 1;
  return await this.save();
};

// Mettre à jour automatiquement le statut en fonction de la date
eventSchema.methods.updateStatus = function() {
  const now = new Date();

  if (this.status === EVENT_STATUS.CANCELLED) {
    return; // Ne pas changer si annulé
  }

  if (this.endDate && now > this.endDate) {
    this.status = EVENT_STATUS.PAST;
  } else if (now >= this.startDate && now <= (this.endDate || this.startDate)) {
    this.status = EVENT_STATUS.ONGOING;
  } else if (now < this.startDate) {
    this.status = EVENT_STATUS.UPCOMING;
  }
};

// ========== MIDDLEWARES ==========

// Mettre à jour le statut avant de sauvegarder
eventSchema.pre('save', function(next) {
  this.updateStatus();
  next();
});

// Peupler automatiquement les références
eventSchema.pre(/^find/, function(next) {
  this.populate('location.country', 'name code flag')
      .populate('organizer.actorId', 'name logo')
      .populate('relatedActors', 'name logo type')
      .populate('createdBy', 'profile.firstName profile.lastName email');
  next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
