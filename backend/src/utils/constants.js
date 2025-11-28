// Rôles utilisateurs
exports.USER_ROLES = {
  ADMIN: 'admin',
  ACTOR: 'actor',
  VISITOR: 'visitor'
};

// Types d'acteurs
exports.ACTOR_TYPES = [
  'entreprise',
  'ong',
  'institution_publique',
  'universite',
  'recherche',
  'startup',
  'association'
];

// Statuts d'acteurs
exports.ACTOR_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ARCHIVED: 'archived'
};

// Tailles d'entreprise
exports.COMPANY_SIZES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '500+'
];

// Catégories d'actualités
exports.NEWS_CATEGORIES = [
  'announcement',
  'project',
  'event',
  'innovation',
  'policy',
  'financing',
  'infrastructure',
  'access'
];

// Statuts de publication
exports.PUBLICATION_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

// Types d'événements
exports.EVENT_CATEGORIES = [
  'conference',
  'workshop',
  'webinar',
  'fair',
  'training'
];

// Types de localisation d'événements
exports.EVENT_LOCATION_TYPES = {
  PHYSICAL: 'physical',
  ONLINE: 'online',
  HYBRID: 'hybrid'
};

// Statuts d'événements
exports.EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  PAST: 'past',
  CANCELLED: 'cancelled'
};

// Codes des pays UEMOA
exports.UEMOA_COUNTRIES = [
  { code: 'BJ', name: 'Bénin' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'CI', name: 'Côte d\'Ivoire' },
  { code: 'GW', name: 'Guinée-Bissau' },
  { code: 'ML', name: 'Mali' },
  { code: 'NE', name: 'Niger' },
  { code: 'SN', name: 'Sénégal' },
  { code: 'TG', name: 'Togo' }
];

// Langues supportées
exports.LANGUAGES = ['fr', 'en'];

// Formats d'export
exports.EXPORT_FORMATS = ['csv', 'pdf', 'json'];

// Limite de pagination par défaut
exports.DEFAULT_PAGE_LIMIT = 20;
exports.MAX_PAGE_LIMIT = 100;

// Taille maximale des fichiers (en bytes)
exports.MAX_FILE_SIZE = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
};

// Types MIME autorisés
exports.ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

exports.ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
