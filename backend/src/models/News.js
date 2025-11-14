const mongoose = require('mongoose');
const { NEWS_CATEGORIES, PUBLICATION_STATUS } = require('../utils/constants');

const newsSchema = new mongoose.Schema({
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

  content: {
    fr: {
      type: String,
      required: [true, 'Le contenu en français est requis']
    },
    en: {
      type: String
    }
  },

  excerpt: {
    fr: {
      type: String
    },
    en: {
      type: String
    }
  },

  coverImage: {
    type: String // URL de l'image principale
  },

  images: [{
    type: String // Galerie d'images
  }],

  // ========== CATÉGORISATION ==========
  category: {
    type: String,
    enum: NEWS_CATEGORIES,
    default: 'announcement'
  },

  tags: [{
    type: String,
    trim: true
  }],

  // ========== RELATIONS ==========
  relatedActors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actor'
  }],

  relatedCountries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country'
  }],

  // ========== PUBLICATION ==========
  status: {
    type: String,
    enum: Object.values(PUBLICATION_STATUS),
    default: PUBLICATION_STATUS.DRAFT
  },

  publishedAt: {
    type: Date
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

  // ========== AUTEUR ==========
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, {
  timestamps: true
});

// ========== INDEXES ==========
newsSchema.index({ slug: 1 }, { unique: true });
newsSchema.index({ status: 1 });
newsSchema.index({ publishedAt: -1 });
newsSchema.index({ category: 1 });
newsSchema.index({ featured: 1 });
newsSchema.index({ 'title.fr': 'text', 'title.en': 'text', 'content.fr': 'text', 'content.en': 'text' });

// ========== MÉTHODES ==========

// Incrémenter le compteur de vues
newsSchema.methods.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

// ========== MIDDLEWARES ==========

// Peupler automatiquement les références
newsSchema.pre(/^find/, function(next) {
  this.populate('author', 'profile.firstName profile.lastName email')
      .populate('relatedActors', 'name logo type')
      .populate('relatedCountries', 'name code flag');
  next();
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
