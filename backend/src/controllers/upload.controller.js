const { uploadImage, uploadDocument, deleteFile } = require('../config/cloudinary');
const { asyncHandler } = require('../middlewares/error.middleware');
const fs = require('fs');

/**
 * @desc    Upload une image
 * @route   POST /api/upload/image
 * @access  Private
 */
exports.uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Aucun fichier fourni.'
    });
  }

  const { folder = 'general' } = req.body;

  // Upload vers Cloudinary
  const result = await uploadImage(req.file.path, folder);

  // Supprimer le fichier temporaire
  fs.unlinkSync(req.file.path);

  if (!result.success) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload de l\'image.',
      error: result.error
    });
  }

  res.status(200).json({
    success: true,
    message: 'Image uploadée avec succès.',
    data: {
      url: result.url,
      publicId: result.publicId
    }
  });
});

/**
 * @desc    Upload plusieurs images
 * @route   POST /api/upload/images
 * @access  Private
 */
exports.uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Aucun fichier fourni.'
    });
  }

  const { folder = 'general' } = req.body;
  const uploadedImages = [];
  const errors = [];

  // Upload chaque image vers Cloudinary
  for (const file of req.files) {
    const result = await uploadImage(file.path, folder);

    // Supprimer le fichier temporaire
    fs.unlinkSync(file.path);

    if (result.success) {
      uploadedImages.push({
        url: result.url,
        publicId: result.publicId
      });
    } else {
      errors.push({
        filename: file.originalname,
        error: result.error
      });
    }
  }

  res.status(200).json({
    success: true,
    message: `${uploadedImages.length} image(s) uploadée(s) avec succès.`,
    data: uploadedImages,
    errors: errors.length > 0 ? errors : undefined
  });
});

/**
 * @desc    Upload un document
 * @route   POST /api/upload/document
 * @access  Private
 */
exports.uploadSingleDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Aucun fichier fourni.'
    });
  }

  const { folder = 'documents' } = req.body;

  // Upload vers Cloudinary
  const result = await uploadDocument(req.file.path, folder);

  // Supprimer le fichier temporaire
  fs.unlinkSync(req.file.path);

  if (!result.success) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload du document.',
      error: result.error
    });
  }

  res.status(200).json({
    success: true,
    message: 'Document uploadé avec succès.',
    data: {
      url: result.url,
      publicId: result.publicId,
      filename: req.file.originalname
    }
  });
});

/**
 * @desc    Supprimer un fichier de Cloudinary
 * @route   DELETE /api/upload
 * @access  Private
 */
exports.deleteFile = asyncHandler(async (req, res) => {
  const { publicId, resourceType = 'image' } = req.body;

  if (!publicId) {
    return res.status(400).json({
      success: false,
      message: 'L\'ID public du fichier est requis.'
    });
  }

  const result = await deleteFile(publicId, resourceType);

  if (!result.success) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du fichier.',
      error: result.error
    });
  }

  res.status(200).json({
    success: true,
    message: 'Fichier supprimé avec succès.'
  });
});

/**
 * @desc    Upload du logo d'un acteur
 * @route   POST /api/upload/logo
 * @access  Private
 */
exports.uploadLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Aucun fichier fourni.'
    });
  }

  // Upload vers Cloudinary avec transformation pour logo
  const result = await uploadImage(req.file.path, 'logos', {
    transformation: [
      { width: 400, height: 400, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  });

  // Supprimer le fichier temporaire
  fs.unlinkSync(req.file.path);

  if (!result.success) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload du logo.',
      error: result.error
    });
  }

  res.status(200).json({
    success: true,
    message: 'Logo uploadé avec succès.',
    data: {
      url: result.url,
      publicId: result.publicId
    }
  });
});

/**
 * @desc    Upload de la couverture d'une actualité/événement
 * @route   POST /api/upload/cover
 * @access  Private (Admin ou Actor)
 */
exports.uploadCover = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Aucun fichier fourni.'
    });
  }

  const { type = 'news' } = req.body; // 'news' ou 'events'

  // Upload vers Cloudinary avec transformation pour couverture
  const result = await uploadImage(req.file.path, type, {
    transformation: [
      { width: 1200, height: 630, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  });

  // Supprimer le fichier temporaire
  fs.unlinkSync(req.file.path);

  if (!result.success) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload de l\'image de couverture.',
      error: result.error
    });
  }

  res.status(200).json({
    success: true,
    message: 'Image de couverture uploadée avec succès.',
    data: {
      url: result.url,
      publicId: result.publicId
    }
  });
});
