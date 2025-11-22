const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const { uploadImage, uploadDocument, handleUploadError } = require('../middlewares/upload.middleware');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * @route   POST /api/upload/image
 * @desc    Upload une image unique
 * @access  Private
 */
router.post(
  '/image',
  authenticate,
  uploadImage.single('image'),
  handleUploadError,
  uploadController.uploadSingleImage
);

/**
 * @route   POST /api/upload/images
 * @desc    Upload plusieurs images
 * @access  Private
 */
router.post(
  '/images',
  authenticate,
  uploadImage.array('images', 10),
  handleUploadError,
  uploadController.uploadMultipleImages
);

/**
 * @route   POST /api/upload/document
 * @desc    Upload un document
 * @access  Private
 */
router.post(
  '/document',
  authenticate,
  uploadDocument.single('document'),
  handleUploadError,
  uploadController.uploadSingleDocument
);

/**
 * @route   POST /api/upload/logo
 * @desc    Upload un logo
 * @access  Private
 */
router.post(
  '/logo',
  authenticate,
  uploadImage.single('logo'),
  handleUploadError,
  uploadController.uploadLogo
);

/**
 * @route   POST /api/upload/cover
 * @desc    Upload une image de couverture
 * @access  Private
 */
router.post(
  '/cover',
  authenticate,
  uploadImage.single('cover'),
  handleUploadError,
  uploadController.uploadCover
);

/**
 * @route   DELETE /api/upload
 * @desc    Supprimer un fichier de Cloudinary
 * @access  Private
 */
router.delete(
  '/',
  authenticate,
  uploadController.deleteFile
);

module.exports = router;
