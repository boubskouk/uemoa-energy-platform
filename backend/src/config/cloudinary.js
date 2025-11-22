const cloudinary = require('cloudinary').v2;

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo-secret'
});

/**
 * Upload une image vers Cloudinary
 * @param {String} filePath - Chemin du fichier à uploader
 * @param {String} folder - Dossier de destination
 * @param {Object} options - Options supplémentaires
 */
const uploadImage = async (filePath, folder, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `uemoa-energy/${folder}`,
      resource_type: 'image',
      ...options
    });
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Upload un document vers Cloudinary
 * @param {String} filePath - Chemin du fichier à uploader
 * @param {String} folder - Dossier de destination
 */
const uploadDocument = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `uemoa-energy/${folder}`,
      resource_type: 'raw'
    });
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Supprimer un fichier de Cloudinary
 * @param {String} publicId - ID public du fichier
 * @param {String} resourceType - Type de ressource ('image' ou 'raw')
 */
const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return {
      success: result.result === 'ok',
      result
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  uploadDocument,
  deleteFile
};
