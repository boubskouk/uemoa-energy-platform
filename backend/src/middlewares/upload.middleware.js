const multer = require('multer');
const path = require('path');
const { MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES, ALLOWED_DOCUMENT_TYPES } = require('../utils/constants');

// Configuration du stockage pour le développement local
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + '-' + uniqueSuffix + ext);
  }
});

// Filtrer les fichiers par type
const imageFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format de fichier non autorisé. Formats acceptés: JPG, PNG, WEBP'), false);
  }
};

const documentFilter = (req, file, cb) => {
  if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format de document non autorisé. Formats acceptés: PDF, DOC, DOCX'), false);
  }
};

const anyFileFilter = (req, file, cb) => {
  const allAllowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];
  if (allAllowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format de fichier non autorisé.'), false);
  }
};

// Configuration de multer pour les images
const uploadImage = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: MAX_FILE_SIZE.IMAGE
  }
});

// Configuration de multer pour les documents
const uploadDocument = multer({
  storage: storage,
  fileFilter: documentFilter,
  limits: {
    fileSize: MAX_FILE_SIZE.DOCUMENT
  }
});

// Configuration de multer pour tous types de fichiers autorisés
const uploadAny = multer({
  storage: storage,
  fileFilter: anyFileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE.DOCUMENT
  }
});

// Middleware pour gérer les erreurs d'upload
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Fichier trop volumineux.',
        maxSize: MAX_FILE_SIZE.IMAGE / (1024 * 1024) + ' MB'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Erreur lors de l\'upload du fichier.',
      error: err.message
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  next();
};

module.exports = {
  uploadImage,
  uploadDocument,
  uploadAny,
  handleUploadError
};
