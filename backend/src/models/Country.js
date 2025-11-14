const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: {
    fr: {
      type: String,
      required: [true, 'Le nom en français est requis']
    },
    en: {
      type: String,
      required: [true, 'Le nom en anglais est requis']
    }
  },

  code: {
    type: String,
    required: [true, 'Le code pays est requis'],
    unique: true,
    uppercase: true,
    minlength: 2,
    maxlength: 2
  },

  flag: {
    type: String // URL du drapeau
  },

  capital: {
    type: String
  },

  // Coordonnées du centre du pays (pour la carte)
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },

  // Statistiques
  actorsCount: {
    type: Number,
    default: 0
  },

  order: {
    type: Number,
    default: 0
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
});

// ========== INDEXES ==========
countrySchema.index({ code: 1 }, { unique: true });
countrySchema.index({ 'name.fr': 1 });
countrySchema.index({ 'name.en': 1 });
countrySchema.index({ location: '2dsphere' });

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;
