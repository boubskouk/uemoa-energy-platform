const mongoose = require('mongoose');

const energySchema = new mongoose.Schema({
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

  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  description: {
    fr: {
      type: String
    },
    en: {
      type: String
    }
  },

  icon: {
    type: String // Emoji ou nom de l'icône
  },

  color: {
    type: String, // Code couleur hexadécimal
    default: '#10B981'
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
energySchema.index({ slug: 1 }, { unique: true });
energySchema.index({ isActive: 1 });
energySchema.index({ order: 1 });

const Energy = mongoose.model('Energy', energySchema);

module.exports = Energy;
