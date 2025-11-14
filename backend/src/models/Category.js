const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
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
    type: String // Nom de l'icône ou URL
  },

  color: {
    type: String, // Code couleur hexadécimal
    default: '#3B82F6'
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
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ isActive: 1 });
categorySchema.index({ order: 1 });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
